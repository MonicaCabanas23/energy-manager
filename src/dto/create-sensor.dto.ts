import z from "zod"

export const CreateSensorDTO = z.object({
    name: z.string(),
    code: z.string(),
    doublePolarity: z.boolean(),
    panelId: z.number()
})

export type CreateSensorDTO = z.infer<typeof CreateSensorDTO>