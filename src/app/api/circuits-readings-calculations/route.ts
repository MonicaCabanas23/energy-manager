import { CircuitBindingsDTO } from "@/dto/circuits/circuit-bindings.dto"
import type { CircuitWithReadingsAndCalculationsDTO } from "@/dto/circuits/circuit-with-readings-and-calcultations.dto"
import { getCiruitsWithLastReadingAndCalculationsByPanel } from "@/services/circuits-service"
import { getPanelByEspChipId } from "@/services/panel-service"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    req: NextRequest,
) {
    try {
        // TODO: Improve endpoint for verifying if panelId belongs to the user that is requesting it.
        const params    = req.nextUrl.searchParams
        const espChipId = params.get('espChipId')
        const bindings  = CircuitBindingsDTO.parse({
            startDate : params.get('startDate'),
            endDate   : params.get('endDate'),
            circuits  : params.get('circuits')
        })

        let panel = null
        let circuits: CircuitWithReadingsAndCalculationsDTO[] = []
        
        if(espChipId) {
            panel = await getPanelByEspChipId(espChipId)
        }

        if(panel) {
            circuits = await getCiruitsWithLastReadingAndCalculationsByPanel(panel, bindings)
        }
    
        return NextResponse.json(circuits, {status: 200})
    } catch (error) {
        console.error(error)
        return NextResponse.json({message: 'Error fetching circuits'}, {status: 500})
    }
}