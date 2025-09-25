"use client"

import Filters from "@/components/ui/Filters";
import MultipleSelect from "@/components/ui/MultipleSelect";
import Select from "@/components/ui/Select";
import Table from "@/components/ui/Table";
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
import { Line } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';

export default function Dashboard() {
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

    const dummyData = [
        { circuito: "Circuito 1", voltaje: "220V", intensidad: "5A", consumo: "1kWh", costo: "$100" },
        { circuito: "Circuito 2", voltaje: "110V", intensidad: "10A", consumo: "2kWh", costo: "$200" },
        { circuito: "Circuito 3", voltaje: "220V", intensidad: "15A", consumo: "3kWh", costo: "$300" },
        { circuito: "Circuito 4", voltaje: "220V", intensidad: "15A", consumo: "3kWh", costo: "$300" },
        { circuito: "Circuito 5", voltaje: "220V", intensidad: "15A", consumo: "3kWh", costo: "$300" },
        { circuito: "Circuito 6", voltaje: "220V", intensidad: "15A", consumo: "3kWh", costo: "$300" },
        { circuito: "Circuito 7", voltaje: "220V", intensidad: "15A", consumo: "3kWh", costo: "$300" },
        { circuito: "Circuito 8", voltaje: "220V", intensidad: "15A", consumo: "3kWh", costo: "$300" },
        { circuito: "Circuito 9", voltaje: "220V", intensidad: "15A", consumo: "3kWh", costo: "$300" },
        { circuito: "Circuito 10", voltaje: "220V", intensidad: "15A", consumo: "3kWh", costo: "$300" },
    ];
    
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

  return (
    <div className="flex flex-col gap-4 p-2">
        <Filters classes="grid grid-cols-3 gap-4">
            <Select 
                label="Casa" 
                options={[
                    {value: "casa_1", label: "Casa 1"},
                    {value: "casa_2", label: "Casa 2"},
                    {value: "casa_3", label: "Casa 3"},
                ]}
            />
            <MultipleSelect 
                label="Circuito" 
                options={[
                    {value: "circuito_1", label: "Circuito 1"},
                    {value: "circuito_2", label: "Circuito 2"},
                    {value: "circuito_3", label: "Circuito 3"},
                ]}
                onChange={(value) => console.log(value)}
            />
            <MultipleSelect 
                label="Mes" 
                options={[
                    {value: "enero", label: "Enero"},
                    {value: "febrero", label: "Febrero"},
                    {value: "marzo", label: "Marzo"},
                ]}
                onChange={(value) => console.log(value)}
            />
        </Filters>
        
        <div className="max-w-full grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-4">
            <div className="bg-white col-span-1 md:col-span-8 rounded-md shadow-md p-6">
                <Line options={options} data={dataLine} />
            </div>
            <div className="bg-white col-span-1 md:col-span-4 rounded-md shadow-md p-6">
                <Pie data={dataPie} />
            </div>
            <div className="col-span-1 md:col-span-12 shadow-md rounded-bl-md rounded-br-md">
                <Table 
                    definition={{
                        circuito   : "Circuito",
                        voltaje    : "Voltaje",
                        intensidad : "Intensidad",
                        consumo    : "Consumo",
                        costo      : "Costo"
                    }}
                    data={dummyData}
                />
            </div>
        </div>
    </div>
  );
}
