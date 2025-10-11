import { CircuitBindingsDTO } from "@/dto/circuits/circuit-bindings.dto";
import { CircuitWithCalculationsGroupedByMonth } from "@/dto/circuits/circuit-with-calculations-grouped-by-month.dto";
import { CircuitWithReadingsAndCalculationsDTO } from "@/dto/circuits/circuit-with-readings-and-calcultations.dto";
import { CircuitDTO } from "@/dto/circuits/circuit.dto";
import { prisma } from "@/lib/prisma";
import { Panel, Prisma } from "@prisma/client";

export async function getCiruitsWithLastReadingAndCalculationsByPanel(panel: Panel, bindings: CircuitBindingsDTO)
{
    const whereConditions         : Prisma.Sql[] = [];
    const voltageJoinConditions   : Prisma.Sql[] = [];
    const intensityJoinConditions : Prisma.Sql[] = [];
    const aggregateJoinConditions : Prisma.Sql[] = [];

    if (bindings.startDate) {
        const startDate = new Date(bindings.startDate)
        voltageJoinConditions.push(Prisma.sql`lr_v."createdAt" >= ${startDate}`);
        intensityJoinConditions.push(Prisma.sql`lr_i."createdAt" >= ${startDate}`);
        aggregateJoinConditions.push(Prisma.sql`a."minCreatedAt" >= ${startDate}`);
    }
    if (bindings.endDate) {
        const endDate = new Date(bindings.endDate)
        voltageJoinConditions.push(Prisma.sql`lr_v."createdAt" <= ${endDate}`);
        intensityJoinConditions.push(Prisma.sql`lr_i."createdAt" <= ${endDate}`);
        aggregateJoinConditions.push(Prisma.sql`a."maxCreatedAt" <= ${endDate}`);
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
            intensities as (
                select 
                    s."name" as circuit,
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
                        when i."createdAt" > v."createdAt" then i."createdAt"
                    end as "createdAt"
                from intensities i
                join voltages v 
                        on v.circuit = i.circuit
                        and abs(extract(epoch from (i."createdAt" - v."createdAt"))) < 0.5
            ),
            aggregates as (
                select
                    p.circuit,
                    sum(p."power") as power_sum,
                    extract(epoch from max(p."createdAt") - min(p."createdAt")) / 3600 as hours,
                    max(p."createdAt") as "maxCreatedAt",
                    min(p."createdAt") as "minCreatedAt"
                from powers p 
                group by p.circuit
            )
            select 
                s."name",
                s."doublePolarity",
                sum(coalesce(lr_i.value, 0))                     as "lastIntensity",
                sum(coalesce(lr_v.value, 0))                     as "lastVoltage",
                coalesce(trunc((a.power_sum * a.hours / 1000)::numeric, 4), 0)        as "energy",
                coalesce(trunc((a.power_sum * a.hours / 1000 * 0.22)::numeric, 4), 0) as "cost"
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
                on a.circuit = s."name"
                ${agregateJoinClause}
            where 1=1
                and p.id = ${panel.id}
                ${whereClause}
            group by 
                s."name",
                s."doublePolarity",
                a.power_sum,
                a.hours
            order by s."name";
        `;
    
    return circuits
}

export async function getCircuitsWithCalculationsGroupedByMonth(panel: Panel, bindings: CircuitBindingsDTO)
{
    const whereConditions         : Prisma.Sql[] = [];
    const aggregateJoinConditions : Prisma.Sql[] = [];

    if (bindings.startDate) {
        const startDate = new Date(bindings.startDate)
        aggregateJoinConditions.push(Prisma.sql`a."minCreatedAt" >= ${startDate}`);
    }
    if (bindings.endDate) {
        const endDate = new Date(bindings.endDate)
        aggregateJoinConditions.push(Prisma.sql`a."maxCreatedAt" <= ${endDate}`);
    }
    if (bindings.circuits) {
        const circuits = bindings.circuits.split('|');
        whereConditions.push(Prisma.sql`s."name" IN (${Prisma.join(circuits)})`);
    }

    const whereClause = whereConditions.length > 0
    ? Prisma.sql`AND ${Prisma.join(whereConditions, ` AND `)}`
    : Prisma.empty;

    const agregateJoinClause = aggregateJoinConditions.length > 0
    ? Prisma.sql`AND ${Prisma.join(aggregateJoinConditions, ` AND `)}`
    : Prisma.empty;

    const circuits = await prisma.$queryRaw<CircuitWithCalculationsGroupedByMonth[]>`
            with intensities as (
                select 
                    s."name" as circuit,
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