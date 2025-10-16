"use client";

import Filters                                        from "@/components/ui/Filters";
import Input                                          from "@/components/ui/Input";
import Table                                          from "@/components/ui/Table";
import { BarLoader }                                  from "react-spinners";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
}                                                     from "chart.js";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { Line }                                       from "react-chartjs-2";
import { MqttMessagePayload }                         from "@/types/mqtt";
import { PowerConsumptionDTO }                        from "@/dto/power-consumptions/power-consumption.dto";
import { ReadingDTO }                                 from "@/dto/readings/reading.dto";
import { defaultReadings }                            from "@/data/default-readings";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const energyOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Consumo de energía (kWh) por mes",
    },
  },
};

const costOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Costo (USD) por mes",
    },
  },
};

const excludedReadings = ['L1', 'L2', 'N']

interface Option {
  value: string;
  label: string;
}

interface LineGraphDataSet {
  label: string;
  data: number[];
}

export default function Dashboard() {
  const [readings, setReadings]                 = useState<ReadingDTO[]>(defaultReadings.filter((r) => !excludedReadings.includes(r.name)));
  const [consumptions, setConsumptions]         = useState<PowerConsumptionDTO[]>([]);
  const [energyDataSet, setEnergyDataSet]       = useState<LineGraphDataSet[]>([]);
  const [monthLabels, setMonthLabels]           = useState<string[]>([]);
  const [isLoading, setIsLoading]               = useState<boolean>(true);
  const [startDate, setStartDate]               = useState<string>("");
  const [endDate, setEndDate]                   = useState<string>("");

  const isRequestInProgressRef = useRef(false);

  const override: CSSProperties = {
    display: "block",
    margin: "auto auto",
  };

  const energyDataLine = {
    labels: monthLabels,
    datasets: energyDataSet,
  };

  const costDataLine = {
    labels: monthLabels,
    datasets: energyDataSet,
  };

  function processWSMessage(data: MqttMessagePayload) 
  {
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
      } else if(!exists && excludedReadings.includes(circuitName)) {
        return prev;
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

  async function fetchConsumptions()
  {
    try {
      const params = new URLSearchParams({});

      startDate && params.set("startDate", startDate);
      endDate   && params.set("endDate", endDate);

      const response = await fetch(`/api/power-consumptions?${params.toString()}`)
      const data     = await response.json()
      setConsumptions(data.filter((d: PowerConsumptionDTO) => !excludedReadings.includes(d.name)))
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const load = async () => {
      await fetchConsumptions()
      setIsLoading(false);
    };

    load();
      
    const url = process.env.NEXT_PUBLIC_WS_URL
    const evtSource = new EventSource(url!);

    // SSE
    evtSource.onmessage = (event) => {
      const data: MqttMessagePayload = JSON.parse(event.data);
      processWSMessage(data)
    };

    // Set up interval to fetch data secuencialmente
    const intervalId = setInterval(async () => {
      // Referencia para controlar si hay una solicitud en progreso
      if (isRequestInProgressRef.current) {
        return;
      }

      isRequestInProgressRef.current = true;
      try {
        // Ejecutar secuencialmente, esperando que cada una termine
        await fetchConsumptions();
      } catch (error) {
        console.error("Error en la actualización periódica:", error);
      } finally {
        isRequestInProgressRef.current = false;
      }
    }, 5000);

    // Clean up the interval when the component unmounts
    return () => {clearInterval(intervalId); evtSource.close();}

  }, [startDate, endDate]);

  return (
    <div className="flex flex-col gap-4 p-2">
      {!isLoading ? (
        <>
          <Filters 
            classes="grid grid-cols-2 gap-4"
            onClear={() => {setStartDate(''); setEndDate('')}}
          >
            <Input
              id="startDate"
              type="date"
              label="Desde"
              value={startDate}
              onChange={(v) => {
                typeof v === "string" && setStartDate(v);
              }}
            />
            <Input
              id="endDate"
              type="date"
              label="Hasta"
              value={endDate}
              onChange={(v) => {
                typeof v === "string" && setEndDate(v);
              }}
            />
          </Filters>

          <div className="max-w-full grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-4">
            {/*
                    
            <div className="bg-white col-span-1 md:col-span-6 rounded-md shadow-md p-6">
                <Line options={energyOptions} data={energyDataLine} />
            </div>
            <div className="bg-white col-span-1 md:col-span-6 rounded-md shadow-md p-6">
                <Line options={costOptions} data={costDataLine} />
            </div>
            
            */}
            <div className="col-span-1 md:col-span-6 shadow-md rounded-bl-md rounded-br-md">
              <Table
                definition={{
                  name           : "Circuito",
                  doublePolarity : "Doble polaridad",
                  kwh            : "Consumo (kWh)",
                  cost           : "Costo (USD)",
                }}
                data={consumptions}
              />
            </div>
            <div className="col-span-1 md:col-span-6 shadow-md rounded-bl-md rounded-br-md">
              <Table
                definition={{
                  name           : "Circuito",
                  doublePolarity : "Doble polaridad",
                  intensity      : "Corriente (A)",
                  voltage        : "Voltaje (V)"
                }}
                data={readings}
              />
            </div>
          </div>
        </>
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
