import { GetEnergyAndCostByCircuitDTO } from "@/dto/energies-and-costs/get-energy-and-cost-by-circuit.dto"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    req: NextRequest,
) {
    try {
        const params                                                = req.nextUrl.searchParams
        const circuitName                                           = params.get('circuitName')
        let panel                                                   = null
        let energyAndCostByCircuit: GetEnergyAndCostByCircuitDTO [] = []
    

        return NextResponse.json(energyAndCostByCircuit, {status: 200})
    } catch (error) {
        console.error(error)
        return NextResponse.json({message: 'Error fetching circuits'}, {status: 500})        
    }
}