import z from "zod";

export const CircuitWithCalculationsGroupedByMonth = z.object({
    name     : z.string(),
    months   : z.array(z.number()),
    energies : z.array(z.number()),
    costs    : z.array(z.number()),
}) 

export type CircuitWithCalculationsGroupedByMonth = z.infer<typeof CircuitWithCalculationsGroupedByMonth>