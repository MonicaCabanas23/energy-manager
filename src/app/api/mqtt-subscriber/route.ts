
import subscribe from "@/services/mqtt-subscriber-service";

// Iniciar la suscripción MQTT
subscribe();

// Exportar función GET para el App Router de Next.js
export async function GET() {
    return Response.json({ message: 'MQTT subscriber running' }, { status: 200 });
}