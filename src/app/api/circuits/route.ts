import { CircuitDTO } from "@/dto/circuits/circuit.dto";
import { getCircuitByName, getCircuitsByPanel } from "@/services/circuits-service";
import { getPanelByEspChipId } from "@/services/panel-service";
import { Circuit } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
) {
    try {
        const params            = req.nextUrl.searchParams
        const espChipId         = params.get('espChipId')
        const name              = params.get('name')
        let circuits: Circuit[] = []
        let singleCircuit: Circuit | null = null
    
        if(espChipId && !name) {
            const panel = await getPanelByEspChipId(espChipId)

            if(panel) {
                circuits = await getCircuitsByPanel(panel)
            }
        }
        else if(name && !espChipId) {
            singleCircuit = await getCircuitByName(name)
            
            if(singleCircuit) {
                circuits = [singleCircuit]
            }
        }

        const mapped = circuits.map((c: Circuit) => CircuitDTO.parse(c))

        return NextResponse.json(mapped, {status: 200})
    } catch (error) {
        console.error(error)
        return NextResponse.json({message: 'Error fetching circuits'}, {status: 500})        
    }
}