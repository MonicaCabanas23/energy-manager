import { Server } from 'socket.io'
import { getPanelByEspChipId } from '@/services/panel-service'
import { getCiruitsWithLastReadingAndCalculationsByPanel, getCircuitsWithCalculationsGroupedByMonth } from '@/services/circuits-service'
import type { CircuitBindingsDTO } from '@/dto/circuits/circuit-bindings.dto'

type SubscriptionPayload = {
  espChipId: string
  circuitName?: string
  circuits?: string
  startDate?: string | null
  endDate?: string | null
}

declare global {
  // eslint-disable-next-line no-var
  var __io__: Server | undefined
}

function createIoServer(): Server {
  const port = Number(process.env.SOCKET_PORT ?? 3001)
  const io = new Server(port, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
    transports: ['websocket'],
  })

  io.on('connection', (socket) => {
    socket.on('subscribe', (payload: SubscriptionPayload) => {
      const { espChipId, circuitName } = payload
      if (!espChipId || !circuitName) return
      const room = `${espChipId}:${circuitName}`
      socket.join(room)
      socket.emit('subscribed', { room })
    })

    socket.on('unsubscribe', (payload: SubscriptionPayload) => {
      const { espChipId, circuitName } = payload
      if (!espChipId || !circuitName) return
      const room = `${espChipId}:${circuitName}`
      socket.leave(room)
      socket.emit('unsubscribed', { room })
    })

    // Permite pedir un snapshot inicial al cargar el dashboard
    socket.on('request_initial_data', async (payload: SubscriptionPayload) => {
      try {
        const { espChipId, circuitName, circuits, startDate = null, endDate = null } = payload
        if (!espChipId) return
        const panel = await getPanelByEspChipId(espChipId)
        if (!panel) return

        const bindings: CircuitBindingsDTO = {
          startDate: startDate ?? null,
          endDate: endDate ?? null,
          circuits: circuits ?? circuitName ?? null,
        }

        const readingsAndCalc = await getCiruitsWithLastReadingAndCalculationsByPanel(panel, bindings)
        const monthlyCalcs = await getCircuitsWithCalculationsGroupedByMonth(panel, bindings)

        // Emitir directamente al socket que solicitó, para snapshot inicial
        socket.emit('circuits_readings_calculations', readingsAndCalc)
        socket.emit('circuits_calculations', monthlyCalcs)
      } catch (err) {
        console.error('[socket.io] request_initial_data error:', err)
      }
    })
  })

  console.log(`[socket.io] server listening on ws://localhost:${port}`)
  return io
}

export function getIo(): Server {
  if (!global.__io__) {
    global.__io__ = createIoServer()
  }
  return global.__io__!
}

export function emitSensorUpdate(
  espChipId: string,
  circuitName: string,
  event: string,
  data: unknown
) {
  const io = getIo()
  const room = `${espChipId}:${circuitName}`
  io.to(room).emit(event, data)
}