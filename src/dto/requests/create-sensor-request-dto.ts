import z from "zod"

export const CreateSensorRequestDTO = z.object({
    name: z.string(),
    doublePolarity: z.boolean(),
    panelId: z.number()
})

export type CreateSensorRequestDTO = z.infer<typeof CreateSensorRequestDTO>