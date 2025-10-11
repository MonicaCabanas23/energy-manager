import { NextRequest, NextResponse } from 'next/server'
import subscribe from '@/services/mqtt-subscriber-service'

declare global {
  // eslint-disable-next-line no-var
  var __mqttInitialized__: boolean | undefined
}

export async function GET(_req: NextRequest) {
  try {
    if (!global.__mqttInitialized__) {
      subscribe()
      global.__mqttInitialized__ = true
    }
    return NextResponse.json({ initialized: true }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Error initializing MQTT subscriber' }, { status: 500 })
  }
}