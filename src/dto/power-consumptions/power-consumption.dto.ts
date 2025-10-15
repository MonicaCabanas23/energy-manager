import z from "zod";

export const PowerConsumptionDTO = z.object({
    name           : z.string(),
    doublePolarity : z.boolean(),
    kwh            : z.number(),
    cost           : z.number()
})

export type PowerConsumptionDTO = z.infer<typeof PowerConsumptionDTO>