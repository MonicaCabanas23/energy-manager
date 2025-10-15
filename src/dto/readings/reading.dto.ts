import z from "zod";

export const ReadingDTO = z.object({
    name           : z.string(),
    doublePolarity : z.boolean(),
    intensity      : z.number(),
    voltage        : z.number()
})

export type ReadingDTO = z.infer<typeof ReadingDTO>