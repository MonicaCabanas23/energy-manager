import z from "zod";

export const CircuitDTO = z.object({
    name: z.string()
})

export type CircuitDTO = z.infer<typeof CircuitDTO>