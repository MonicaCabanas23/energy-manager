import { CircuitWithReadingsAndCalculationsDTO } from "@/dto/circuits/circuit-with-readings-and-calcultations.dto";
import { prisma } from "@/lib/prisma";
import { Panel } from "@prisma/client";

export async function getCiruitsWithLastReadingAndCalculationsByPanel(panel: Panel)
{
    // TODO: Agregar bindings dinámicos
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
                    extract(epoch from max(r."createdAt") - min(r."createdAt")) / 3600 as horas
                from "Reading" r
                join "ReadingType" rt on rt.id = r."readingTypeId"
                join "Sensor" s on s.id = r."sensorId"
                group by s."name"
            )
            select 
                s."name",
                s."doublePolarity",
                sum(coalesce(lr_i.value, 0))                    as "lastIntensity",
                sum(coalesce(lr_v.value, 0))                    as "lastVoltage",
                a.avg_corriente * a.avg_voltaje * a.horas       as "power",
                a.avg_corriente * a.avg_voltaje * a.horas * 0.3 as "cost"
            from "Sensor" s
            left join last_readings lr_i on lr_i."sensorId" = s.id and lr_i.code = 'corriente'
            left join last_readings lr_v on lr_v."sensorId" = s.id and lr_v.code = 'voltaje'
            left join aggregates a on a."name" = s."name"
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