import z from "zod"
import { ReadingResponseDTO } from "./reading-response.dto"

export const SensorWithReadingResponseDTO = z.object({
    id               : z.number(),
    code             : z.string(),
    name             : z.string(),
    doublePolarity   : z.boolean(),
    panelId          : z.number(),
    readings         : z.array(ReadingResponseDTO)
})

export type SensorWithReadingResponseDTO = z.infer<typeof SensorWithReadingResponseDTO> 