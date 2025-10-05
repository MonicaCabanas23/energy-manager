import type { CreateSensorDTO } from "@/dto/create-sensor.dto";
import { prisma } from "@/lib/prisma";
import { Panel } from "@prisma/client";

export async function getSensorsWithLastReadingByPanel(panel: Panel) {
    const sensors = await prisma.sensor.findMany({
        where: {
            panel: panel
        },
        include: { readings: {orderBy: {createdAt: 'desc'}, take: 1} },
        orderBy: { createdAt: 'asc' }
    })
    return sensors
}

export async function createSensor(data: CreateSensorDTO) {
    try {
        const sensor = await prisma.sensor.create({data})
        return sensor
    } catch (error) {
        throw new Error('Error creating sensor')        
    }
} 

export async function getNewCode(panel: Panel)
{
    try {
        // Obtain last code to keep the sequence
        const lastSensor = await prisma.sensor.findFirst({
            where: {
                panel: panel
            },
            orderBy: { createdAt: 'desc' }
        })
    
        const code = lastSensor?.code ?? 'A0' // TODO: replace for real businnes logic
        return code
    } catch (error) {
        throw new Error('Error generating new code')
    }
}

export async function getSensorByCodeAndPanel(code: string, panel: Panel) {
    try {
        const sensor = await prisma.sensor.findFirst({
            where: {
                code: code,
                panel: panel
            }
        })

        return sensor
    } catch (error) {
        throw new Error('Error fetching sensor')
    }
}