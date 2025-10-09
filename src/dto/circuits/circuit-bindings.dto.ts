import z from "zod";

export const CircuitBindingsDTO = z.object({
    startDate : z.iso.date().nullable(),
    endDate   : z.iso.date().nullable(),
    circuits  : z.string().nullable()
})

export type CircuitBindingsDTO = z.infer<typeof CircuitBindingsDTO>