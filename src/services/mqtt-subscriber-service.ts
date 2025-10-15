import mqtt, { MqttClient }                     from "mqtt";
import { createPower }                          from "./power-service";
import { getCircuitByName, getCircuitBySensor } from "./circuits-service";
import { MqttMessagePayload }                   from "@/types/mqtt";
import { getSensorByCode }                      from "./sensor-service";
import { synchronizePowerConsumption } from "./power-consumption-service";

export default function subscribe(
  onMessageCallback?: (data: MqttMessagePayload) => void
): MqttClient {
  const mqttUri = process.env.MQTT_URI ?? ""; // Or wss:// for secure websockets

  const options = {
    clientId: "nextjs-subscriber-" + Math.random().toString(16).substr(2, 8),
    // Add authentication options if needed
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    reconnectPeriod: 2000, // Reconnect every 2 seconds
  };

  const client = mqtt.connect(mqttUri, options);

  client.on("connect", () => {
    console.log("Connected to MQTT broker");
    // Subscribe to a topic
    const topicsString = process.env.MQTT_TOPICS;
    const topicsArray = topicsString?.split(",");

    topicsArray?.forEach((topic) => {
      client.subscribe(topic, (err) => {
        if (!err) {
          console.log(`Subscribed to ${topic}`);
        } else {
          console.error("Subscription error:", err);
        }
      });
    });
  });

  client.on("message", async (topic, message) => {
    const length          = topic.split("/").length;
    const identifier      = topic.split("/")[length - 1];
    const readingTypeCode = topic.split("/")[length - 2]; // Especifica el tipo de lectura que se manda
    let circuitName       = null

    const regex = /^c/i;
    if(regex.test(identifier)) {
      const codes = identifier.match(/c\d+/g)
      circuitName = codes?.join(',').toUpperCase() ?? ''
    }
    
    if (readingTypeCode === 'potencia' && circuitName != null) { // Guardar en base de datos para almacenar históricos
      const circuit = await getCircuitByName(circuitName)
      
      if(circuit) {
        await createPower({
          circuitId : circuit.id,
          value     : Number(message.toString()) ?? 0,
        });

        // Actualiza histórico de consumo en PowerConsumption
        await synchronizePowerConsumption()
      }
    }

    if(readingTypeCode === 'corriente' || readingTypeCode === 'voltaje') {
      const sensor = await getSensorByCode(identifier)

      if(sensor) {
        const circuit = await getCircuitBySensor(sensor)

        const payload: MqttMessagePayload= {
          topic,
          circuitName    : circuit?.name ?? '',
          doublePolarity : circuit?.doublePolarity ?? false,
          message        : message.toString(),
          timestamp      : new Date().toISOString(),
        };
    
        onMessageCallback?.(payload)
      }
    }


    console.log(`Received message on topic ${topic}: ${message.toString()}`);
  });

  client.on("error", (err) => {
    console.error("MQTT error:", err);
  });

  return client;
}
