"use client"

import Filters from "@/components/ui/Filters";
import Input from "@/components/ui/Input";
import MultipleSelect from "@/components/ui/MultipleSelect";
import Table from "@/components/ui/Table";
import { useUser } from "@/contexts/UserContext";
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
import { CSSProperties, useEffect, useState } from "react";
import { Line } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';

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

const options = {
    responsive: true,
    plugins: {
        legend: {
        position: 'top' as const,
        },
        title: {
        display: true,
        text: 'Consumo de energía por mes',
        },
    },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

const dataLine = {
    labels: labels,
    datasets: [
        {
            label: 'Circuito 1',
            data: [1, 1, 1, 1, 1, 6, 24],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            label: 'Circuito 2',
            data: [1, 2, 3, 4, 100, 30, 35],
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
            label: 'Circuito 3',
            data: [2, 75, 10, 32, 50, 30, 10],
            borderColor: 'rgb(100, 60, 200)',
            backgroundColor: 'rgba(100, 60, 200, 0.5)',
        },
    ],
};

const dataPie = {
    labels: ['Circuito 1', 'Circuito 2', 'Circuito 3'],
    datasets: [
        {
        label: 'Consumo total',
        data: [12, 19, 3],
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
        },
    ],
};

interface SelectOption {
    value: string;
    label: string;
}

export default function Dashboard() {
    const user = useUser()
    const [circuits, setCircuits] = useState<CircuitWithReadingsAndCalculationsDTO[]>([])
    const [selectOptions, setSelectOptions] = useState<SelectOption[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const override: CSSProperties = {
        display : "block",
        margin  : "auto auto",
    };

    const fetchCircuits = async () => {
        try {
            const res = await fetch(`/api/circuits?${new URLSearchParams({
                    espChipId: 'demo' // TODO: Cambiar por un espChipId asociado a la cuenta del usuario
                }).toString()
            }`);
            
            if (!res.ok) {
                throw new Error(`Error ${res.status}`);
            }

            const data = await res.json();

            setCircuits(data)
            
            const options = data.map((c: CircuitWithReadingsAndCalculationsDTO) => ({
                value: c.name,
                label: c.name
            }))

            setSelectOptions(options)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const load = async () => {
            await fetchCircuits()
            setIsLoading(false)
        }

        load()

        // Set up interval to fetch data every 5 seconds (5000 milliseconds)
        const intervalId = setInterval(() => {
            fetchCircuits();
        }, 5000);

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);

    }, [])

  return (
    <div className="flex flex-col gap-4 p-2">
        {
            !isLoading ? 
            <>
                <Filters classes="grid grid-cols-2 gap-4">
                    {
                        selectOptions.length > 0 ?
                            <MultipleSelect 
                                label="Circuito" 
                                options={selectOptions}
                                onChange={(value) => console.log(value)}
                            /> 
                        : null
                    }
                    <Input
                        id='date'
                        type='date'
                        label="Fecha"
                    />
                </Filters>
                
                <div className="max-w-full grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-4">
                    {/* <div className="bg-white col-span-1 md:col-span-8 rounded-md shadow-md p-6">
                        <Line options={options} data={dataLine} />
                    </div>
                    <div className="bg-white col-span-1 md:col-span-4 rounded-md shadow-md p-6">
                        <Pie data={dataPie} />
                    </div> */}
                    <div className="col-span-1 md:col-span-12 shadow-md rounded-bl-md rounded-br-md">
                        <Table 
                            definition={{
                                name           : "Circuito",
                                doublePolarity : "Doble polaridad",
                                lastIntensity  : "Voltaje (V)",
                                lastVoltage    : "Corriente (A)",
                                power          : "Consumo (W)",
                                cost           : "Costo"
                            }}
                            data={circuits}
                        />
                    </div>
                </div>
            </>
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
