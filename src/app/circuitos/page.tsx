"use client"
import ElectricalPanel                           from "@/components/electrical-panel/electrical-panel";
import { CSSProperties, useEffect, useRef, useState }    from "react";
import { CircuitWithReadingsAndCalculationsDTO } from "@/dto/circuits/circuit-with-readings-and-calcultations.dto";
import { BarLoader }                             from "react-spinners";
import { io, Socket }                            from 'socket.io-client'
import { CircuitDTO }                            from "@/dto/circuits/circuit.dto";

export default function Circuitos() {
  const [circuits, setCircuits] = useState<CircuitWithReadingsAndCalculationsDTO[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const socketRef = useRef<Socket | null>(null)

  const override: CSSProperties = {
      display     : "block",
      margin      : "auto auto",
  };

  // Configura WebSocket y solicita snapshot inicial
  const setupSockets = async () => {
    const url = process.env.NEXT_PUBLIC_SOCKET_URL ?? 'ws://localhost:3001'

    // Inicializa el suscriptor MQTT en backend (idempotente)
    await fetch('/api/mqtt')

    // Obtén la lista de circuitos del panel
    const params = new URLSearchParams({ espChipId: 'demo' })
    const res = await fetch(`/api/circuits?${params.toString()}`)
    if (!res.ok) throw new Error(`Error ${res.status}`)
    const circuitsList: CircuitDTO[] = await res.json()
    const allCircuitNames = circuitsList.map((c) => c.name)

    const socket = io(url, { transports: ['websocket'] })
    socketRef.current = socket

    // Recibe actualizaciones de lecturas y cálculos para renderizar el tablero
    socket.on('circuits_readings_calculations', (payload: CircuitWithReadingsAndCalculationsDTO[]) => {
      // No filtramos L1/L2/N aquí porque el ElectricalPanel los usa
      setCircuits((prev) => {
        const map = new Map(prev.map((c) => [c.name, c]))
        payload.forEach((c) => map.set(c.name, c))
        return Array.from(map.values())
      })
    })

    const espChipId = 'demo'
    // Suscribe a todos los circuitos del panel
    allCircuitNames.forEach((name) => {
      socket.emit('subscribe', { espChipId, circuitName: name })
    })

    // Solicita snapshot inicial para todos los circuitos
    socket.emit('request_initial_data', {
      espChipId,
      circuits: allCircuitNames.join('|'),
      startDate: null,
      endDate: null,
    })
  }

  useEffect(() => {
    const init = async () => {
      try {
        await setupSockets()
      } catch (err) {
        console.error('[Circuitos] Error al configurar sockets:', err)
      } finally {
        setIsLoading(false)
      }
    }
    init()

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [])
  
  return (
    <div className="flex flex-col p-2">
      {
        !isLoading ? 
        <ElectricalPanel
          circuits={circuits}
        />
        :
        <BarLoader
            color="#008080"
            loading={isLoading}
            cssOverride={override}
            aria-label="Loading Spinner"
            data-testid="loader"
        />
      }
    </div>
  );
}
