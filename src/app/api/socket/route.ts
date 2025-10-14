import subscribe from "@/services/mqtt-subscriber-service";
import { MqttMessagePayload } from "@/types/mqtt";
import { NextRequest } from "next/server";

let mqttClient: any = null;
const clients: Set<WritableStreamDefaultWriter> = new Set();

export async function GET(req: NextRequest) {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  // Guardamos este cliente
  clients.add(writer);

  // Cuando el cliente cierre la conexión, lo eliminamos
  const closeConnection = () => {
    clients.delete(writer);
    writer.close();
  };

  req.signal.addEventListener("abort", closeConnection);

  // Inicializar MQTT solo una vez
  if (!mqttClient) {
    mqttClient = subscribe((data: MqttMessagePayload) => {
      const payload = `data: ${JSON.stringify(data)}\n\n`;
      // Emitir a todos los clientes
      for (const client of clients) {
        client.write(payload);
      }
    });
  }

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
