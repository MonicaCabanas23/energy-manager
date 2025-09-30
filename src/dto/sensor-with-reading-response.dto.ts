import z from "zod"

export const SensorWithReadingResponseDTO = z.object({
    id             : z.number(),
    code           : z.string(),
    name           : z.string(),
    doublePolarity : z.boolean(),
    panelId        : z.number(),
    intensity      : z.number(),
    voltage        : z.number(),
    power          : z.number(),
    createdAt      : z.date()
})

export type SensorWithReadingResponseDTO = z.infer<typeof SensorWithReadingResponseDTO> 