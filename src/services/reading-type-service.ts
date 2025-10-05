import { prisma } from "@/lib/prisma";

export async function getReadingTypeByCode(code: string) {
    const readingType = await prisma.readingType.findFirst({
        where: {
            code: code
        }
    })

    return readingType
}