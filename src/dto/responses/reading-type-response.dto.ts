import z from "zod"

export const ReadingTypeResponseDTO = z.object({
    id        : z.number(),
    code      : z.string(),
    label     : z.string(),
})

export type ReadingTypeResponseDTO = z.infer<typeof ReadingTypeResponseDTO> 