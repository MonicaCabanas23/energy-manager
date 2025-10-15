import { createPowerDTO } from "@/dto/powers/create-power.dto";
import { prisma } from "@/lib/prisma";

export async function createPower(data: createPowerDTO) {
    try {
        const power = await prisma.power.create({data})
        return power
    } catch (error) {
        throw new Error('Error creating power')        
    }
}