import { CircuitBindingsDTO } from "@/dto/circuits/circuit-bindings.dto";
import { CircuitWithReadingsAndCalculationsDTO } from "@/dto/circuits/circuit-with-readings-and-calcultations.dto";
import { CircuitDTO } from "@/dto/circuits/circuit.dto";
import { prisma } from "@/lib/prisma";
import { Panel, Prisma } from "@prisma/client";

export async function getCiruitsWithLastReadingAndCalculationsByPanel(panel: Panel, bindings: CircuitBindingsDTO)
{
    const whereConditions: Prisma.Sql[]         = [];
    const voltageJoinConditions: Prisma.Sql[]   = [];
    const intensityJoinConditions: Prisma.Sql[] = [];
    const aggregateJoinConditions: Prisma.Sql[] = [];

    if (bindings.startDate) {
        const startDate = new Date(bindings.startDate)
        voltageJoinConditions.push(Prisma.sql`lr_v."createdAt" >= ${startDate}`);
        intensityJoinConditions.push(Prisma.sql`lr_i."createdAt" >= ${startDate}`);
        aggregateJoinConditions.push(Prisma.sql`a."createdAt" >= ${startDate}`);
    }
    if (bindings.endDate) {
        const endDate = new Date(bindings.endDate)
        voltageJoinConditions.push(Prisma.sql`lr_v."createdAt" <= ${endDate}`);
        intensityJoinConditions.push(Prisma.sql`lr_i."createdAt" <= ${endDate}`);
        aggregateJoinConditions.push(Prisma.sql`a."createdAt" <= ${endDate}`);
    }
    if (bindings.circuits) {
        const circuits = bindings.circuits.split('|');
        whereConditions.push(Prisma.sql`s."name" IN (${Prisma.join(circuits)})`);
    }

    const whereClause = whereConditions.length > 0
    ? Prisma.sql`AND ${Prisma.join(whereConditions, ` AND `)}`
    : Prisma.empty;

    const voltageJoinClause = voltageJoinConditions.length > 0
    ? Prisma.sql`AND ${Prisma.join(voltageJoinConditions, ` AND `)}`
    : Prisma.empty;
    
    const intensityJoinClause = intensityJoinConditions.length > 0
    ? Prisma.sql`AND ${Prisma.join(intensityJoinConditions, ` AND `)}`
    : Prisma.empty;

    const agregateJoinClause = aggregateJoinConditions.length > 0
    ? Prisma.sql`AND ${Prisma.join(aggregateJoinConditions, ` AND `)}`
    : Prisma.empty;

    const circuits = await prisma.$queryRaw<CircuitWithReadingsAndCalculationsDTO[]>`
            with last_readings as (
                select distinct on (r."sensorId", rt.code)
                    r."sensorId",
                    rt.code,
                    r.value,
                    r."createdAt"
                from "Reading" r
                join "ReadingType" rt on rt.id = r."readingTypeId"
                order by r."sensorId", rt.code, r."createdAt" desc
            ),
            aggregates as (
                select 
                    s."name",
                    avg(r.value) filter (where rt.code = 'corriente')                  as avg_corriente,
                    coalesce(avg(r.value) filter (where rt.code = 'voltaje'), 0)       as avg_voltaje,
                    extract(epoch from max(r."createdAt") - min(r."createdAt")) / 3600 as horas,
                    max(r."createdAt")                                                 as "createdAt"
                from "Reading" r
                join "ReadingType" rt on rt.id = r."readingTypeId"
                join "Sensor" s on s.id = r."sensorId"
                group by s."name"
            )
            select 
                s."name",
                s."doublePolarity",
                sum(coalesce(lr_i.value, 0))                                 as "lastIntensity",
                sum(coalesce(lr_v.value, 0))                                 as "lastVoltage",
                coalesce(a.avg_corriente * a.avg_voltaje * a.horas, 0)       as "power",
                coalesce(a.avg_corriente * a.avg_voltaje * a.horas * 0.3, 0) as "cost"
            from "Sensor" s
            join "Panel" p on p.id = s."panelId"
            left join last_readings lr_i 
                on lr_i."sensorId" = s.id 
                and lr_i.code = 'corriente'
                ${intensityJoinClause}
            left join last_readings lr_v 
                on lr_v."sensorId" = s.id 
                and lr_v.code = 'voltaje'
                ${voltageJoinClause}
            left join aggregates a 
                on a."name" = s."name"
                ${agregateJoinClause}
            where 1=1
            and s."name" not ilike '%L%'
            and s."name" not ilike '%N%'
            and p.id = ${panel.id}
            ${whereClause}
            group by 
                s."name",
                s."doublePolarity",
                a.avg_corriente,
                a.avg_voltaje,
                a.horas
            order by s."name";
        `;
    
    return circuits
}

export async function getCircuitsByPanel(panel: Panel)
{
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