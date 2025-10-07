import z from "zod";

export const CircuitWithReadingsAndCalculationsDTO = z.object({
    name          : z.string(),
    doublePolarity: z.boolean(),
    lastIntensity : z.number(),
    lastVoltage   : z.number(),
    power         : z.number(),
    cost          : z.number(),
}) 

export type CircuitWithReadingsAndCalculationsDTO = z.infer<typeof CircuitWithReadingsAndCalculationsDTO>