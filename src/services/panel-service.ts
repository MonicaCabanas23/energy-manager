import { prisma } from "@/lib/prisma";

export async function getPanelById(id: number) {
    const panel = await prisma.panel.findFirst({
        where: {
            id: id
        }
    })
    
    return panel
}