import { PowerConsumptionDTO } from "@/dto/power-consumptions/power-consumption.dto";
import { listAllCircuits } from "@/services/circuits-service";
import { listPowerConsumptionGroupedByCircuit } from "@/services/power-consumption-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
) {
    try {
        const params    = req.nextUrl.searchParams;
        const startDate = params.get('startDate')
        const endDate   = params.get('endDate')


        const data     = await listPowerConsumptionGroupedByCircuit(startDate ?? undefined, endDate ?? undefined)
        const circuits = await listAllCircuits()

        if (!Array.isArray(data)) {
            console.error('Data is not an array:', data);
            return NextResponse.json({ message: 'Invalid data' }, { status: 500 });
        }

        const mapped = data.map((d) => {
            const circuit = circuits.find((c) => c.id === d.circuitId)

            if(circuit) {
                return PowerConsumptionDTO.parse({
                    name           : circuit.name,
                    doublePolarity : circuit.doublePolarity,
                    kwh            : d._sum.kwh ? Math.trunc(d._sum.kwh * 10000) / 10000 : 0,
                    cost           : d._sum.cost ? Math.trunc(d._sum.cost * 10000) / 10000 : 0
                })
            }

            return null
        })
        .filter(Boolean)

        return NextResponse.json(mapped, {status: 200})

    } catch (error) {
        console.error(error)
        return NextResponse.json({message: 'Error fetching power consumptions'}, {status: 500})          
    }
}