import { CircuitBindingsDTO } from "@/dto/circuits/circuit-bindings.dto";
import { CircuitWithCalculationsGroupedByMonth } from "@/dto/circuits/circuit-with-calculations-grouped-by-month.dto";
import { CircuitWithReadingsAndCalculationsDTO } from "@/dto/circuits/circuit-with-readings-and-calcultations.dto";
import { CircuitDTO } from "@/dto/circuits/circuit.dto";
import { prisma } from "@/lib/prisma";
import { toUTC } from "@/lib/utc";
import { Panel, Prisma } from "@prisma/client";

export async function getCiruitsWithLastReadingAndCalculationsByPanel(
  panel: Panel,
  bindings: CircuitBindingsDTO
) {
  // Variables de filtrado dinámico
  const whereConditions: Prisma.Sql[] = [];

  // Fechas reutilizables para filtros dentro de CTEs
  const startDateGlobal = bindings.startDate
    ? toUTC(bindings.startDate)
    : null;
  const endDateGlobal = bindings.endDate ? toUTC(bindings.endDate) : null;

  // Obtener IDs de tipos de lectura una sola vez (optimización)
  const readingTypes = await prisma.readingType.findMany({
    where: { code: { in: ["corriente", "voltaje"] } },
    select: { id: true, code: true },
  });

  const intensityTypeId = readingTypes.find(
    (rt) => rt.code === "corriente"
  )?.id;
  const voltageTypeId = readingTypes.find((rt) => rt.code === "voltaje")?.id;

  // Construcción de condiciones WHERE dinámicas
  if (bindings.circuits) {
    const circuits = bindings.circuits.split("|");
    whereConditions.push(Prisma.sql`s."name" IN (${Prisma.join(circuits)})`);
  }

  // Construcción de cláusulas WHERE
  const whereClause =
    whereConditions.length > 0
      ? Prisma.sql`AND ${Prisma.join(whereConditions, ` AND `)}`
      : Prisma.empty;

  await prisma.$executeRaw`SET LOCAL work_mem = '1024MB'`;

  const circuits = await prisma.$queryRaw<
    CircuitWithReadingsAndCalculationsDTO[]
  >`
    WITH panel_sensors AS (
    SELECT id, "name", code, "relatedCode", "doublePolarity"
    FROM "Sensor"
    WHERE "panelId" = ${panel.id}
        ${whereClause}
    ),
    last_intensity AS (
    SELECT DISTINCT ON (r."sensorId")
      r."sensorId",
      TRUNC(r.value::numeric, 4) as value,
      r."createdAt" 
    FROM "Reading" r
    JOIN "Sensor" s ON s.id = r."sensorId"
    JOIN "Panel" p ON p.id = s."panelId"
    WHERE r."readingTypeId" = ${intensityTypeId}
      AND p.id = ${panel.id}
      ${whereClause}
      ${
        startDateGlobal
          ? Prisma.sql`AND r."createdAt" >= ${startDateGlobal}`
          : Prisma.empty
      }
      ${
        endDateGlobal
          ? Prisma.sql`AND r."createdAt" <= ${endDateGlobal}`
          : Prisma.empty
      }
    ORDER BY r."sensorId", r."createdAt" DESC
  ),
  last_voltage AS (
    SELECT DISTINCT ON (r."sensorId")
      r."sensorId",
      TRUNC(r.value::numeric, 4) as value,
      r."createdAt" 
    FROM "Reading" r
    JOIN "Sensor" s ON s.id = r."sensorId"
    JOIN "Panel" p ON p.id = s."panelId"
    WHERE r."readingTypeId" = ${voltageTypeId}
      AND p.id = ${panel.id}
      ${whereClause}
      ${
        startDateGlobal
          ? Prisma.sql`AND r."createdAt" >= ${startDateGlobal}`
          : Prisma.empty
      }
      ${
        endDateGlobal
          ? Prisma.sql`AND r."createdAt" <= ${endDateGlobal}`
          : Prisma.empty
      }
    ORDER BY r."sensorId", r."createdAt" DESC
  ),
  intensities AS (
    SELECT 
      s."name",
      s.code as code,
      s."relatedCode" as "relatedCode",
      r."createdAt" ,
      r.value as intensity
    FROM "Reading" r
    JOIN "Sensor" s ON s.id = r."sensorId"
    JOIN "Panel" p ON p.id = s."panelId"
    WHERE r."readingTypeId" = ${intensityTypeId}
      AND r.value > 0
      AND p.id = ${panel.id}
      ${whereClause}
      ${
        startDateGlobal
          ? Prisma.sql`AND r."createdAt" >= ${startDateGlobal}`
          : Prisma.empty
      }
      ${
        endDateGlobal
          ? Prisma.sql`AND r."createdAt" <= ${endDateGlobal}`
          : Prisma.empty
      }
  ),
  voltages AS (
    SELECT 
      s."name",
      s.code as code,
      s."relatedCode" as "relatedCode",
      r."createdAt" ,
      r.value as voltage
    FROM "Reading" r
    JOIN "Sensor" s ON s.id = r."sensorId"
    JOIN "Panel" p ON p.id = s."panelId"
    WHERE r."readingTypeId" = ${voltageTypeId}
      AND r.value > 0
      AND p.id = ${panel.id}
      ${whereClause}
      ${
        startDateGlobal
          ? Prisma.sql`AND r."createdAt" >= ${startDateGlobal}`
          : Prisma.empty
      }
      ${
        endDateGlobal
          ? Prisma.sql`AND r."createdAt" <= ${endDateGlobal}`
          : Prisma.empty
      }
  ),
  powers AS (
    SELECT 
      i."name",
      i.intensity * v.voltage as "power",
      i."createdAt"
    FROM intensities i
    JOIN voltages v 
      ON v.code = i."relatedCode"
      AND i.code = v."relatedCode"
      AND i."createdAt" BETWEEN v."createdAt" - INTERVAL '0.5 seconds' 
                            AND v."createdAt" + INTERVAL '0.5 seconds'
    GROUP BY 
      i."name",
      i.intensity,
      v.voltage,
      i."createdAt"
    ORDER BY i."createdAt"
  ),
  energies AS (
    SELECT
      "name",
      "power" as current_power,
      LAG("power") OVER (PARTITION BY "name" ORDER BY "createdAt") as prev_power,
      EXTRACT(EPOCH FROM ("createdAt" - LAG("createdAt") OVER (PARTITION BY "name" ORDER BY "createdAt"))) / 3600 as hours_diff,
      TRUNC(
        (LAG("power") OVER (PARTITION BY "name" ORDER BY "createdAt") *
         EXTRACT(EPOCH FROM ("createdAt" - LAG("createdAt") OVER (PARTITION BY "name" ORDER BY "createdAt"))) / 3600 * 
         1/1000)::numeric, 4
      ) as kwh,
      TRUNC(
        (LAG("power") OVER (PARTITION BY "name" ORDER BY "createdAt") *
         EXTRACT(EPOCH FROM ("createdAt" - LAG("createdAt") OVER (PARTITION BY "name" ORDER BY "createdAt"))) / 3600 * 
         1/1000 * 0.22)::numeric, 4
      ) as cost,
      "createdAt"
    FROM powers
  ),
  energies_aggregated AS (
    SELECT
      "name",
      SUM(kwh) as total_kwh,
      SUM(cost) as total_cost
    FROM energies
    WHERE kwh > 0
    GROUP BY "name"
  )
  SELECT 
    s."name",
    BOOL_OR(s."doublePolarity") as "doublePolarity",
    MAX(COALESCE(lr_i.value, 0)) as "lastIntensity",
    MAX(COALESCE(lr_v.value, 0)) as "lastVoltage",
    MAX(COALESCE(ea.total_kwh, 0)) as energy,
    MAX(COALESCE(ea.total_cost, 0)) as cost
  FROM "Sensor" s
  JOIN "Panel" p ON p.id = s."panelId"
  LEFT JOIN last_intensity lr_i 
    ON lr_i."sensorId" = s.id
  LEFT JOIN last_voltage lr_v 
    ON lr_v."sensorId" = s.id
  LEFT JOIN energies_aggregated ea
    ON ea."name" = s."name"
  WHERE p.id = ${panel.id}
    ${whereClause}
  GROUP BY s."name";
`;

  return circuits;
}

export async function getCircuitsWithCalculationsGroupedByMonth(
  panel: Panel,
  bindings: CircuitBindingsDTO
) {
  const whereConditions: Prisma.Sql[] = [];
  const aggregateJoinConditions: Prisma.Sql[] = [];

  if (bindings.startDate) {
    const startDate = new Date(bindings.startDate);
    aggregateJoinConditions.push(Prisma.sql`a."minCreatedAt" >= ${startDate}`);
  }
  if (bindings.endDate) {
    const endDate = new Date(bindings.endDate);
    aggregateJoinConditions.push(Prisma.sql`a."maxCreatedAt" <= ${endDate}`);
  }
  if (bindings.circuits) {
    const circuits = bindings.circuits.split("|");
    whereConditions.push(Prisma.sql`s."name" IN (${Prisma.join(circuits)})`);
  }

  const whereClause =
    whereConditions.length > 0
      ? Prisma.sql`AND ${Prisma.join(whereConditions, ` AND `)}`
      : Prisma.empty;

  const agregateJoinClause =
    aggregateJoinConditions.length > 0
      ? Prisma.sql`AND ${Prisma.join(aggregateJoinConditions, ` AND `)}`
      : Prisma.empty;

  const circuits = await prisma.$queryRaw<
    CircuitWithCalculationsGroupedByMonth[]
  >`
            with intensities as (
                select 
                    s."name" as circuit,
                    s.code as code,
                    s."relatedCode" as "relatedCode",
                    r."createdAt",
                    r.value as intensity
                from "Reading" r
                join "ReadingType" rt on rt.id = r."readingTypeId"
                join "Sensor" s on s.id = r."sensorId"
                where rt.code = 'corriente'
                and r.value > 0
            ),
            voltages as (
                select 
                    s."name" as circuit,
                    s.code as code,
                    s."relatedCode" as "relatedCode",
                    r."createdAt",
                    r.value as voltage
                from "Reading" r
                join "ReadingType" rt on rt.id = r."readingTypeId"
                join "Sensor" s on s.id = r."sensorId"
                where rt.code = 'voltaje'
                and r.value > 0
            ),
            powers as (
                select 
                    i.circuit,
                    i.intensity * v.voltage as "power",
                    case 
                        when	 i."createdAt" <= v."createdAt" then v."createdAt"
                        else i."createdAt"
                    end as "createdAt"
                from intensities i
                join voltages v 
                        on v.circuit = i.circuit
                        and v.code = i."relatedCode"
                        and i.code = v."relatedCode"
                        and abs(extract(epoch from (i."createdAt" - v."createdAt"))) < 0.5
            ),
            aggregates as (
                select
                    p.circuit,
                    extract(month from p."createdAt") as "month",
                    sum(p."power") as power_sum,
                    extract(epoch from max(p."createdAt") - min(p."createdAt")) / 3600 as hours,
                    max(p."createdAt") as "maxCreatedAt",
                    min(p."createdAt") as "minCreatedAt"
                from powers p 
                group by 
                    p.circuit,
                    extract(month from p."createdAt")
            )
            select 
                s."name",
                json_agg(distinct a."month") as months,
                json_agg(distinct coalesce(trunc((a.power_sum * a.hours / 1000)::numeric, 4), 0)) as "energies",
                json_agg(distinct coalesce(trunc((a.power_sum * a.hours / 1000 * 0.22)::numeric, 4), 0)) as "costs"
            from "Sensor" s
            join "Panel" p on p.id = s."panelId"
            left join aggregates a 
                on a.circuit = s."name"
                ${agregateJoinClause}
            where 1=1
                and p.id = ${panel.id}
                ${whereClause}
            group by 
                s."name"
            order by s."name";
        `;

  return circuits;
}

export async function getCircuitsByPanel(panel: Panel) {
  const circuits = await prisma.$queryRaw<CircuitDTO[]>`
        select
            s."name"
        from "Sensor" s
        join "Panel" p on p.id = s."panelId"
        where 1=1
        and p.id = ${panel.id}
        group by 
            s."name"
    `;

  return circuits;
}
