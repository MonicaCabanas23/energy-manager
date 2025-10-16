"use client";
import ElectricalPanel                        from "@/components/electrical-panel/electrical-panel";
import { CSSProperties, useEffect, useState } from "react";
import { BarLoader }                          from "react-spinners";
import { MqttMessagePayload }                 from "@/types/mqtt";
import { defaultReadings }                    from "@/data/default-readings";
import { ReadingDTO }                         from "@/dto/readings/reading.dto";

export default function Circuitos() {
  const [readings, setReadings]   = useState<ReadingDTO[]>(defaultReadings);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const override: CSSProperties = {
    display: "block",
    margin: "auto auto",
  };

  function processWSMessage(data: MqttMessagePayload) {
      const circuitName     = data.circuitName;
      const doublePolarity  = data.doublePolarity;
      const topic           = data.topic;
      const parts           = topic.split("/")
      const readingTypeCode = parts[parts.length - 2]
  
      setReadings((prev) => {
        // Verificar si ya existe la lectura
        const exists = prev.find(r => r.name.trim() === circuitName.trim());
        
        if (exists) {
          // Actualizar lectura existente
          return prev.map(r => {
            if (r.name.trim() === circuitName.trim()) {
              return {
                ...r,
                intensity: readingTypeCode === 'corriente' ? Number(data.message) ?? 0 : r.intensity,
                voltage: readingTypeCode === 'voltaje' ? Number(data.message) ?? 0 : r.voltage
              }
            }
            return r;
          });
        } else {
          // Agregar nueva lectura
          const newReading: ReadingDTO = {
            name: circuitName,
            doublePolarity: doublePolarity,
            intensity: readingTypeCode === 'corriente' ? Number(data.message) ?? 0 : 0,
            voltage: readingTypeCode === 'voltaje' ? Number(data.message) ?? 0 : 0
          };
          return [newReading, ...prev];
        }
      });
    }

  useEffect(() => {
    const load = async () => {
      setIsLoading(false);
    };

    load();

    const url = process.env.NEXT_PUBLIC_WS_URL
    const evtSource = new EventSource(url!);

    evtSource.onmessage = (event) => {
      const data: MqttMessagePayload = JSON.parse(event.data);
      processWSMessage(data)
    };

    return () => evtSource.close();
  }, []);

  return (
    <div className="flex flex-col p-2">
      {!isLoading ? (
        <ElectricalPanel circuits={readings} />
      ) : (
        <BarLoader
          color="#008080"
          loading={isLoading}
          cssOverride={override}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      )}
    </div>
  );
}
