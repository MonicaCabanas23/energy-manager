import { createReadingDTO } from "@/dto/create-reading.dto";
import { prisma } from "@/lib/prisma";

export async function createReading(data: createReadingDTO) {
    try {
        const reading = await prisma.reading.create({data})
        return reading
    } catch (error) {
        throw new Error('Error creating reading')        
    }
}