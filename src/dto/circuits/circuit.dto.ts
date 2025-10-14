import z from "zod";

export const CircuitDTO = z.object({
    id             : z.number(),
    name           : z.string(),
    doublePolarity : z.boolean(),
})

export type CircuitDTO = z.infer<typeof CircuitDTO>