import { prisma } from "@/lib/prisma";

export async function synchronizePowerConsumption() 
{
    try {
        const inserted = await prisma.$queryRaw`
            with new_data as (
                select * 
                from "Power"
                where "createdAt" > (select coalesce(max(timestamp), '1970-01-01') from "PowerConsumption")
            )
            insert into "PowerConsumption" ("circuitId", hour, day, month, timestamp, kwh, cost)
            select 
                "circuitId",
                extract(hour from "createdAt") as hour,
                extract(day from "createdAt") as day,
                extract(month from "createdAt") as month,
                "createdAt" as timestamp,
                COALESCE(TRUNC(
                    (LAG(value) OVER (PARTITION BY "circuitId" ORDER BY "createdAt") *
                    EXTRACT(EPOCH FROM ("createdAt" - LAG("createdAt") OVER (PARTITION BY "circuitId" ORDER BY "createdAt"))) / 3600)::numeric, 10
                ), 0) as kwh,
                COALESCE(TRUNC(
                    (LAG(value) OVER (PARTITION BY "circuitId" ORDER BY "createdAt") *
                    EXTRACT(EPOCH FROM ("createdAt" - LAG("createdAt") OVER (PARTITION BY "circuitId" ORDER BY "createdAt"))) / 3600 * 0.22)::numeric, 10
                ), 0) as cost
            from new_data
            where value is not null;
        `

        console.log('Inserted:', inserted);
    } catch (error) {
        throw error
    }
}

export async function listPowerConsumptionGroupedByCircuit(startDate?: string, endDate?: string) {
    try {
        let where = {};

        // Si hay fechas definidas, las agregamos al filtro
        if (startDate && endDate) {
            where = {
                timestamp: {
                    gte: (new Date(startDate)).toISOString(),
                    lte: (new Date(endDate)).toISOString()
                }
            };
        } else if (startDate) {
            where = { timestamp: { gte: (new Date(startDate)).toISOString() } };
        } else if (endDate) {
            where = { timestamp: { lte: (new Date(endDate)).toISOString() } };
        }

        const data = await prisma.powerConsumption.groupBy({
            by: ['circuitId'],
            where,
            _sum: {
                kwh: true,
                cost: true
            }
        })

        return data
    } catch (error) {
        throw new Error('Error fetching power consumption')
    }
}