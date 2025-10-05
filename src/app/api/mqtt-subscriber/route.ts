
import subscribe from "@/services/mqtt-subscriber-service";

subscribe()
// You can export functions from your API route to interact with this client,
// or if in a server-side component, the logic would run on page load.
export default function handler(req: Request, res: Response) {
    return Response.json({ message: 'MQTT subscriber running' }, { status: 200 });
}