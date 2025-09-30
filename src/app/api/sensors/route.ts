import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Reading, Sensor } from "@prisma/client";
import { SensorWithReadingResponseDTO } from "@/dto/sensor-with-reading-response.dto";

interface SensorWithReadings extends Sensor{
    readings: Reading[]
}

export async function GET(
    req: NextRequest,
) {
    try {
        const params                      = req.nextUrl.searchParams
        const panelId                     = params.get('panelId')
        let sensors: SensorWithReadings[] = []

        // Fetches sensors only if panelId parameter is present.
        // TODO: Improve endpoint for verifying if panelId belongs to the user that is requesting it.
        if(panelId) {
            sensors = await prisma.sensor.findMany({
                where: {
                    panelId: {
                        equals: Number(panelId)
                    }
                },
                include: { readings: {orderBy: {createdAt: 'desc'}, take: 1} },
            })
        }

        // Se mapean los datos para que devuelva el sensor junto a la ultima lectura realizada
        let mapped = sensors.map((s: SensorWithReadings) => (
            SensorWithReadingResponseDTO.parse({
                ...s,
                intensity : s.readings[0]?.intensity ?? 0,
                voltage   : s.readings[0]?.voltage   ?? 0,
                power     : s.readings[0]?.power     ?? 0,
                createdAt : s.readings[0]?.createdAt ?? new Date()
            })
        ))
    
        return new Response(JSON.stringify(mapped), {
            status: 200, 
            headers: {'Content-Type': 'application/json'}
        });
    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({message: 'Error fetching sensors'}), {status: 500})
    }
}