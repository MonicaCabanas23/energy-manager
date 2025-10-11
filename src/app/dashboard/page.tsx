"use client";

import Filters from "@/components/ui/Filters";
import Input from "@/components/ui/Input";
import MultipleSelect from "@/components/ui/MultipleSelect";
import Table from "@/components/ui/Table";
import { BarLoader } from "react-spinners";
import { CircuitWithReadingsAndCalculationsDTO } from "@/dto/circuits/circuit-with-readings-and-calcultations.dto";
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
} from "chart.js";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import { CircuitDTO } from "@/dto/circuits/circuit.dto";
import { CircuitWithCalculationsGroupedByMonth } from "@/dto/circuits/circuit-with-calculations-grouped-by-month.dto";

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

interface Option {
  value: string;
  label: string;
}

interface LineGraphDataSet {
  label: string;
  data: number[];
}

export default function Dashboard() {
  const [selectOptions, setSelectOptions] = useState<Option[]>([]);
  const [tableCircuits, setTableCircuits] = useState<
    CircuitWithReadingsAndCalculationsDTO[]
  >([]);
  const [energyDataSet, setEnergyDataSet] = useState<LineGraphDataSet[]>([]);
  const [costDataSet, setCostDataSet] = useState<LineGraphDataSet[]>([]);
  const [monthLabels, setMonthLabels] = useState<string[]>([]);
  const [selectedCircuits, setSelectedCircuits] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const isRequestInProgressRef = useRef(false);

  const override: CSSProperties = {
    display: "block",
    margin: "auto auto",
  };

  // const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  const energyDataLine = {
    labels: monthLabels,
    datasets: energyDataSet,
  };

  const costDataLine = {
    labels: monthLabels,
    datasets: energyDataSet,
  };

  function getMonthNameInSpanish(monthNumber: number) {
    // Create a Date object. The year and day don't matter as we only need the month.
    // monthNumber is 0-indexed, so 0 is January, 1 is February, etc.
    const date = new Date(2000, monthNumber, 1);

    // Create an Intl.DateTimeFormat instance for Spanish (es-ES)
    // and specify that we want the 'long' (full) month name.
    const formatter = new Intl.DateTimeFormat("es-ES", { month: "long" });

    // Format the date to get the Spanish month name.
    return formatter.format(date);
  }

  const fetchCircuits = async () => {
    try {
      const params = new URLSearchParams({
        espChipId: "demo", // TODO Cambiar por un espChipId asociado a la cuenta del usuario
      });

      const res = await fetch(`/api/circuits?${params.toString()}`);

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      let data = await res.json();
      data = data.filter(
        (c: CircuitWithReadingsAndCalculationsDTO) =>
          !["L1", "L2", "N"].includes(c.name)
      );

      const options = data.map((c: CircuitDTO) => ({
        value: c.name,
        label: c.name,
      }));

      setSelectOptions(options);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCircuitsWithCalculationsGroupedByMonth = async () => {
    try {
      const params = new URLSearchParams({
        espChipId: "demo", // TODO Cambiar por un espChipId asociado a la cuenta del usuario
      });

      startDate && params.set("startDate", startDate);
      endDate && params.set("endDate", endDate);
      selectedCircuits.length > 0 &&
        params.set("circuits", selectedCircuits.map((c) => c.value).join("|"));

      const res = await fetch(
        `/api/circuits-calculations?${params.toString()}`
      );

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      let data = await res.json();
      data = data.filter(
        (c: CircuitWithCalculationsGroupedByMonth) =>
          !["L1", "L2", "N"].includes(c.name)
      );
      const months = data
        .find((c: CircuitWithCalculationsGroupedByMonth) => c.months.length > 0)
        .months.map((m: number) => getMonthNameInSpanish(m - 1));
      const energyDataSet = data.map(
        (c: CircuitWithCalculationsGroupedByMonth, index: number) => {
          const hue = ((index * 360) / data.length) % 360; // distribuye tonos uniformemente
          const borderColor = `hsl(${hue}, 70%, 50%)`;
          const backgroundColor = `hsla(${hue}, 70%, 50%, 0.5)`;

          return {
            label: c.name,
            data: c.energies,
            borderColor,
            backgroundColor,
          };
        }
      );
      const costDataSet = data.map(
        (c: CircuitWithCalculationsGroupedByMonth, index: number) => {
          const hue = ((index * 360) / data.length) % 360; // distribuye tonos uniformemente
          const borderColor = `hsl(${hue}, 70%, 50%)`;
          const backgroundColor = `hsla(${hue}, 70%, 50%, 0.5)`;

          return {
            label: c.name,
            data: c.costs,
            borderColor,
            backgroundColor,
          };
        }
      );

      setMonthLabels(months);
      setEnergyDataSet(energyDataSet);
      setCostDataSet(costDataSet);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCircuitsWithReadingsAndCalculations = async () => {
    try {
      const params = new URLSearchParams({
        espChipId: "demo", // TODO Cambiar por un espChipId asociado a la cuenta del usuario
      });

      startDate && params.set("startDate", startDate);
      endDate && params.set("endDate", endDate);
      selectedCircuits.length > 0 &&
        params.set("circuits", selectedCircuits.map((c) => c.value).join("|"));

      const res = await fetch(
        `/api/circuits-readings-calculations?${params.toString()}`
      );

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      let data = await res.json();
      data = data.filter(
        (c: CircuitWithReadingsAndCalculationsDTO) =>
          !["L1", "L2", "N"].includes(c.name)
      );

      setTableCircuits(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchCircuits();
      await fetchCircuitsWithReadingsAndCalculations();
      await fetchCircuitsWithCalculationsGroupedByMonth();
      setIsLoading(false);
    };

    load();

    // Set up interval to fetch data secuencialmente
    const intervalId = setInterval(async () => {
      // Referencia para controlar si hay una solicitud en progreso
      if (isRequestInProgressRef.current) {
        return;
      }

      isRequestInProgressRef.current = true;
      try {
        // Ejecutar secuencialmente, esperando que cada una termine
        // await fetchCircuitsWithCalculationsGroupedByMonth();
        await fetchCircuitsWithReadingsAndCalculations();
      } catch (error) {
        console.error("Error en la actualización periódica:", error);
      } finally {
        isRequestInProgressRef.current = false;
      }
    }, 3000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [startDate, endDate, selectedCircuits]);

  return (
    <div className="flex flex-col gap-4 p-2">
      {!isLoading ? (
        <>
          <Filters classes="grid grid-cols-3 gap-4">
            {selectOptions.length > 0 ? (
              <MultipleSelect
                label="Circuito"
                options={selectOptions}
                selected={selectedCircuits}
                onChange={(v) => setSelectedCircuits(v)}
              />
            ) : null}
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
            <div className="col-span-1 md:col-span-12 shadow-md rounded-bl-md rounded-br-md">
              <Table
                definition={{
                  name: "Circuito",
                  doublePolarity: "Doble polaridad",
                  lastIntensity: "Corriente (A)",
                  lastVoltage: "Voltaje (V)",
                  energy: "Consumo (kWh)",
                  cost: "Costo (USD)",
                }}
                data={tableCircuits}
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
