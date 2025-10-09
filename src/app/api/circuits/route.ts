import { CircuitDTO } from "@/dto/circuits/circuit.dto";
import { getCircuitsByPanel } from "@/services/circuits-service";
import { getPanelByEspChipId } from "@/services/panel-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
) {
    try {
        const params               = req.nextUrl.searchParams
        const espChipId            = params.get('espChipId')
        let panel                  = null
        let circuits: CircuitDTO[] = []
    
        if(espChipId) {
            panel = await getPanelByEspChipId(espChipId)
        }

        if(panel) {
            circuits = await getCircuitsByPanel(panel)
        }

    } catch (error) {
        console.error(error)
        return NextResponse.json({message: 'Error fetching circuits'}, {status: 500})        
    }
}