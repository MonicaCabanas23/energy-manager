import z from "zod";
import { CircuitDTO } from "../circuits/circuit.dto";

export const GetEnergyAndCostByCircuitDTO = z.object({
    energy : z.number(),
    cost   : z.number(),
    circuit: CircuitDTO
})

export type GetEnergyAndCostByCircuitDTO = z.infer<typeof GetEnergyAndCostByCircuitDTO>