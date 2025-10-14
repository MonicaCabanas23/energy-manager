import { prisma } from "@/lib/prisma";

export async function getSensorByCode(code: string)
{
    try {
        const sensor = prisma.sensor.findFirst({
            where: {
                code: code
            }
        })

        return sensor
    } catch (error) {
        console.log(error)
        throw new Error('Error fetching sensor')
    }
}