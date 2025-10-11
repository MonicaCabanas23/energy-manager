import { prisma } from "@/lib/prisma";

export async function getReadingTypeByCode(code: string) {
    const readingType = await prisma.readingType.findFirst({
        where: { code },
        // Avoid any implicit ordering by a timestamp field
        orderBy: { id: 'desc' },
        // Select only necessary columns to avoid touching problematic ones
        select: { id: true, code: true, label: true }
    })

    return readingType
}