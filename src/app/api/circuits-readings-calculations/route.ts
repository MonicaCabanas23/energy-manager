import { NextRequest, NextResponse } from "next/server"

export async function GET(
    req: NextRequest,
) {
    try {
        const wsUrl = process.env.SOCKET_PUBLIC_URL ?? `ws://localhost:${process.env.SOCKET_PORT ?? 3001}`
        return NextResponse.json({
            message: 'Este endpoint fue migrado a WebSocket para actualizaciones en tiempo real.',
            socket: wsUrl,
            usage: {
                event: 'subscribe',
                payload: '{ espChipId: string, circuitName: string }',
                listen: ['circuits_readings_calculations']
            }
        }, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({message: 'Error fetching circuits'}, {status: 500})
    }
}