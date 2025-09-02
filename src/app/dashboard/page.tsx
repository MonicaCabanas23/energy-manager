"use client"

import Table from "@/components/ui/Table";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
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
    <div className="max-w-full p-2 grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-4">
        <div className="bg-teal-600 rounded-md md:col-span-2 text-white py-4 px-1 text-center relative shadow-md">
            <h2 className="font-medium">Consumo total de energía</h2>
            <h1 className="font-extrabold text-4xl md:absolute md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2">24kWh</h1>
        </div>
        <div className="col-span-1 md:col-span-10 shadow-md rounded-bl-md rounded-br-md">
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
        <div className="bg-white col-span-1 md:col-span-8 rounded-md shadow-md">
            <Line options={options} data={dataLine} />
        </div>
        <div className="bg-white col-span-1 md:col-span-4 rounded-md shadow-md">
            <Pie data={dataPie} />
        </div>
    </div>
  );
}
