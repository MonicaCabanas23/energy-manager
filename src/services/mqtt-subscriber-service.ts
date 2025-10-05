import mqtt from 'mqtt';
import { createSensor, getSensorByCodeAndPanel } from './sensor-service';
import { getPanelByEspChipId } from './panel-service';
import { createReading } from './reading-service';
import { getReadingTypeByCode } from './reading-type-service';

export default function subscribe()
{
    const mqttUri = process.env.MQTT_URI ?? ''; // Or wss:// for secure websockets
    const espChipId = 'demo' // TODO: Cambiar por el espChipId obtenido de la sesión del usuario

    const options = {
      clientId: 'nextjs-subscriber-' + Math.random().toString(16).substr(2, 8),
      // Add authentication options if needed
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
      reconnectPeriod: 2000, // Reconnect every 2 seconds
    };

    const client = mqtt.connect(mqttUri, options);

    client.on('connect', () => {

        console.log('Connected to MQTT broker');
        // Subscribe to a topic
        const topicsString = process.env.MQTT_TOPICS;
        const topicsArray = topicsString?.split(',');

        topicsArray?.forEach((topic) => {
            client.subscribe(topic, (err) => {

                if (!err) {
                    console.log(`Subscribed to ${topic}`);
                } else {
                    console.error('Subscription error:', err);
                }
            
            });
        })
    });

    client.on('message', async (topic, message) => {
        const length          = topic.split('/').length
        const sensorCode      = topic.split('/')[length - 1]
        const readingTypeCode = topic.split('/')[length - 2] // Especifica el tipo de lectura que se manda 
        const readingType     = await getReadingTypeByCode(readingTypeCode)
        const panel           = await getPanelByEspChipId(espChipId)
        let sensor            = null
        
        if(panel && readingType) {
            sensor = await getSensorByCodeAndPanel(sensorCode, panel)

            if(sensor) {
                const reading = await createReading({
                    sensorId      : sensor.id,
                    readingTypeId : readingType.id,
                    value         : Number(message.toString()) ?? 0
                })
                console.log(`Lectura guardada: ${reading.value}`)
            }
            else {
                
            }
        }

        console.log(`Received message on topic ${topic}: ${message.toString()}`);
    });

    client.on('error', (err) => {
      console.error('MQTT error:', err);
    });
}