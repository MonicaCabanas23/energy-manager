import z from "zod"

export const createPowerDTO = z.object({
    circuitId : z.number(),
    value     : z.number(),
})

export type createPowerDTO = z.infer<typeof createPowerDTO>