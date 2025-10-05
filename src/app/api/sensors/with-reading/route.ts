import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Reading, Sensor } from "@prisma/client";
import { SensorWithReadingResponseDTO } from "@/dto/sensor-with-reading-response.dto";
import { CreateSensorRequestDTO } from "@/dto/requests/create-sensor-request-dto";
import { createSensor, getNewCode, getSensorsWithLastReadingByPanel } from "@/services/sensor-service";
import { CreateSensorDTO } from "@/dto/create-sensor.dto";
import { getPanelById } from "@/services/panel-service";

interface SensorWithReadings extends Sensor{
    readings: Reading[]
}

export async function GET(
    req: NextRequest,
) {
    try {
        // TODO: Improve endpoint for verifying if panelId belongs to the user that is requesting it.
        const params                      = req.nextUrl.searchParams
        const panelId                     = Number(params.get('panelId'))
        let panel                         = null
        let sensors: SensorWithReadings[] = []
        
        if(panelId) {
            panel = await getPanelById(panelId)
        }

        if(panel) {
            sensors = await getSensorsWithLastReadingByPanel(panel)
        }

        // Se mapean los datos para que devuelva el sensor junto a la ultima lectura realizada
        const mapped = sensors.map((s: SensorWithReadings) => (
            SensorWithReadingResponseDTO.parse({
                ...s,
                value            : s.readings[0]?.value     ?? null,
                readingTypeId    : s.readings[0]?.readingTypeId ?? null,
                readingCreatedAt : s.readings[0]?.createdAt ?? null
            })
        ))
    
        return NextResponse.json(mapped, {status: 200})
    } catch (error) {
        console.error(error)
        return NextResponse.json({message: 'Error fetching sensors'}, {status: 500})
    }
}

export async function POST(
    req: NextRequest
) {
    try {
        const body      = await req.json()
        let sensor      = null

        const validated = CreateSensorRequestDTO.parse(body)
        const panel     = await getPanelById(validated.panelId)

        if(panel) {
            const newCode = await getNewCode(panel)
            sensor        = await createSensor(CreateSensorDTO.parse({...validated, code: newCode}))
        }

        sensor = SensorWithReadingResponseDTO.parse({
            ...sensor,
            intensity        : null,
            voltage          : null,
            power            : null,
            readingCreatedAt : null
        })
        
        return NextResponse.json(sensor, {status: 201})
    } catch (error) {
        console.error(error)
        return NextResponse.json({message: 'Error fetching sensors'}, {status: 500})
    }
}