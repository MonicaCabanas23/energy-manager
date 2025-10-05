import { prisma } from "@/lib/prisma";

export async function getPanelById(id: number) {
    const panel = await prisma.panel.findFirst({
        where: {
            id: id
        }
    })
    
    return panel
}

export async function getPanelByEspChipId(espChipId: string) {
    const panel = await prisma.panel.findFirst({
        where: {
            espChipId: espChipId
        }
    })

    return panel
}