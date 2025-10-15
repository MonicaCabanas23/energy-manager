import { prisma } from "@/lib/prisma";
import { Panel, Sensor } from "@prisma/client";

export async function listAllCircuits()
{
    return await prisma.circuit.findMany()
}

export async function getCircuitBySensor(sensor: Sensor) 
{
    try {
        const circuit = await prisma.sensorXCircuit.findFirst({
            where: { sensor: sensor}
        }).circuit();

        return circuit;
    } catch (error) {
        throw new Error('Error fetching circuit')
    }
}

export async function getCircuitByName(name: string)
{
    try {
        const circuit = await prisma.circuit.findFirst({
            where: {
                name: name
            }
        })

        return circuit
    } catch (error) {
        console.error(error)
        throw new Error('Error fetching circuit')
    }
}

export async function getCircuitsByPanel(panel: Panel)
{
    try {
        const circuits = await prisma.circuit.findMany({
            where: {
                panel: panel
            }
        })

        return circuits
    } catch (error) {
        throw new Error('Error fetching circuits')
    }
}