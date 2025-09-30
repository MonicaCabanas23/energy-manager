import z from "zod"

export const SensorWithReadingResponseDTO = z.object({
    id               : z.number(),
    code             : z.string(),
    name             : z.string(),
    doublePolarity   : z.boolean(),
    panelId          : z.number(),
    intensity        : z.number().nullable(),
    voltage          : z.number().nullable(),
    power            : z.number().nullable(),
    readingCreatedAt : z.date().nullable()
})

export type SensorWithReadingResponseDTO = z.infer<typeof SensorWithReadingResponseDTO> 