import z from "zod"
import { ReadingTypeResponseDTO } from "./reading-type-response.dto"

export const ReadingResponseDTO = z.object({
    id          : z.number(),
    sensorId    : z.number(),
    value       : z.number(),
    createdAt   : z.date(),
    readingType : ReadingTypeResponseDTO,
})

export type ReadingResponseDTO = z.infer<typeof ReadingResponseDTO> 