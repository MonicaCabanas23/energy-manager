import { CircuitBindingsDTO } from "@/dto/circuits/circuit-bindings.dto";
import { CircuitWithCalculationsGroupedByMonth } from "@/dto/circuits/circuit-with-calculations-grouped-by-month.dto";
import { CircuitWithReadingsAndCalculationsDTO } from "@/dto/circuits/circuit-with-readings-and-calcultations.dto";
import { CircuitDTO } from "@/dto/circuits/circuit.dto";
import { prisma } from "@/lib/prisma";
import { Panel, Prisma } from "@prisma/client";

export async function getCiruitsWithLastReadingAndCalculationsByPanel(
  panel: Panel,
  bindings: CircuitBindingsDTO
) {
  const whereConditions: Prisma.Sql[] = [];
  const voltageJoinConditions: Prisma.Sql[] = [];
  const intensityJoinConditions: Prisma.Sql[] = [];

  // Fechas reutilizables para filtros dentro de CTEs
  const startDateGlobal = bindings.startDate
    ? new Date(bindings.startDate)
    : null;
  const endDateGlobal = bindings.endDate ? new Date(bindings.endDate) : null;

  if (bindings.startDate) {
    const startDate = new Date(bindings.startDate);
    voltageJoinConditions.push(Prisma.sql`lr_v."createdAt" >= ${startDate}`);
    intensityJoinConditions.push(Prisma.sql`lr_i."createdAt" >= ${startDate}`);
  }
  if (bindings.endDate) {
    const endDate = new Date(bindings.endDate);
    voltageJoinConditions.push(Prisma.sql`lr_v."createdAt" <= ${endDate}`);
    intensityJoinConditions.push(Prisma.sql`lr_i."createdAt" <= ${endDate}`);
  }
  if (bindings.circuits) {
    const circuits = bindings.circuits.split("|");
    whereConditions.push(Prisma.sql`s."name" IN (${Prisma.join(circuits)})`);
  }

  const whereClause =
    whereConditions.length > 0
      ? Prisma.sql`AND ${Prisma.join(whereConditions, ` AND `)}`
      : Prisma.empty;

  const voltageJoinClause =
    voltageJoinConditions.length > 0
      ? Prisma.sql`AND ${Prisma.join(voltageJoinConditions, ` AND `)}`
      : Prisma.empty;

  const intensityJoinClause =
    intensityJoinConditions.length > 0
      ? Prisma.sql`AND ${Prisma.join(intensityJoinConditions, ` AND `)}`
      : Prisma.empty;

  const circuits = await prisma.$queryRaw<
    CircuitWithReadingsAndCalculationsDTO[]
  >`
        with last_intensity as (
            select distinct on (r."sensorId")
                r."sensorId",
                trunc(r.value::numeric, 4) as value,
                r."createdAt" AT TIME ZONE 'UTC' AT TIME ZONE 'America/El_Salvador' as "createdAt"
            from "Reading" r
            join "ReadingType" rt on rt.id = r."readingTypeId"
            join "Sensor" s on s.id = r."sensorId"
            join "Panel" p on p.id = s."panelId"
            where rt.code = 'corriente'
                and p.id = ${panel.id}
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
            order by r."sensorId", r."createdAt" desc
        ),
        last_voltage as (
            select distinct on (r."sensorId")
                r."sensorId",
                trunc(r.value::numeric, 4) as value,
                r."createdAt" AT TIME ZONE 'UTC' AT TIME ZONE 'America/El_Salvador' as "createdAt"
            from "Reading" r
            join "ReadingType" rt on rt.id = r."readingTypeId"
            join "Sensor" s on s.id = r."sensorId"
            join "Panel" p on p.id = s."panelId"
            where rt.code = 'voltaje'
                and p.id = ${panel.id}
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
            order by r."sensorId", r."createdAt" desc
        ),
        intensities as (
            select 
                s."name",
                s.code as code,
                s."relatedCode" as "relatedCode",
                r."createdAt" AT TIME ZONE 'UTC' AT TIME ZONE 'America/El_Salvador' as "createdAt",
                r.value as intensity
            from "Reading" r
            join "ReadingType" rt on rt.id = r."readingTypeId"
            join "Sensor" s on s.id = r."sensorId"
            join "Panel" p on p.id = s."panelId"
            where rt.code = 'corriente'
                and r.value > 0
                and p.id = ${panel.id}
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
        voltages as (
            select 
                s."name",
                s.code as code,
                s."relatedCode" as "relatedCode",
                r."createdAt" AT TIME ZONE 'UTC' AT TIME ZONE 'America/El_Salvador' as "createdAt",
                r.value as voltage
            from "Reading" r
            join "ReadingType" rt on rt.id = r."readingTypeId"
            join "Sensor" s on s.id = r."sensorId"
            join "Panel" p on p.id = s."panelId"
            where rt.code = 'voltaje'
                and r.value > 0
                and p.id = ${panel.id}
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
        powers as (
            select 
                i."name",
                i.intensity * v.voltage as "power",
                i."createdAt"
            from intensities i
            join voltages v 
                    on v.code = i."relatedCode"
                    and i.code = v."relatedCode"
                    and i."createdAt" between v."createdAt" - interval '0.5 seconds' and v."createdAt" + interval '0.5 seconds'
            group by 
                i."name",
                i.intensity,
                v.voltage,
                i."createdAt"
            order by i."createdAt"
        ),
        energies as (
            select
                "name",
                "power" as current_power,
                lag("power") over (partition by "name" order by "createdAt") as prev_power,
                extract(epoch from ("createdAt" - lag("createdAt") OVER (PARTITION BY "name" ORDER BY "createdAt"))) / 3600 as hours_diff,
                    trunc(
                        (lag("power") over (partition by "name" order by "createdAt") *
                        extract(epoch from ("createdAt" - lag("createdAt") OVER (PARTITION BY "name" ORDER BY "createdAt"))) / 3600 * 
                        1/1000)::numeric, 4
                    ) as kwh,
                    trunc(
                        (lag("power") over (partition by "name" order by "createdAt") *
                        extract(epoch from ("createdAt" - lag("createdAt") OVER (PARTITION BY "name" ORDER BY "createdAt"))) / 3600 * 
                        1/1000 * 0.22)::numeric, 4
                    ) as cost,
                    "createdAt"
            from powers
        )
            select 
            s."name",
            s."doublePolarity",
            sum(coalesce(lr_i.value, 0)) as "lastIntensity",
            sum(coalesce(lr_v.value, 0)) as "lastVoltage",
            coalesce(sum(e.kwh), 0)      as energy,
            coalesce(sum(e.cost), 0)     as cost
        from "Sensor" s
        join "Panel" p on p.id = s."panelId"
        left join last_intensity lr_i 
            on lr_i."sensorId" = s.id 
            ${intensityJoinClause}
        left join last_voltage lr_v 
            on lr_v."sensorId" = s.id 
            ${voltageJoinClause}
        left join energies e
            on e."name" = s."name"
            and e.kwh > 0
        where 1=1
            ${whereClause}
        group by 
            s."name",
            s."doublePolarity",
            e."name";
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
