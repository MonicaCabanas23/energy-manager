import z from "zod"

export const createReadingDTO = z.object({
    sensorId      : z.number(),
    readingTypeId : z.number(),
    value         : z.number()
})

export type createReadingDTO = z.infer<typeof createReadingDTO>