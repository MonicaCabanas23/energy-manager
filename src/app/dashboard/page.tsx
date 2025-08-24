"use client"

import Table from "@/components/ui/Table";

export default function Dashboard() {
    const dummyData = [
        { circuito: "Circuito 1", voltaje: "220V", intensidad: "5A", consumo: "1kWh", costo: "$100" },
        { circuito: "Circuito 2", voltaje: "110V", intensidad: "10A", consumo: "2kWh", costo: "$200" },
        { circuito: "Circuito 3", voltaje: "220V", intensidad: "15A", consumo: "3kWh", costo: "$300" },
    ];
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  return (
    <div className="max-w-full p-2 grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-4">
        <div className="bg-teal-600 rounded-sm md:col-span-2 lg:col-span-2 text-white py-4 px-1 text-center relative">
            <h2 className="font-medium">Consumo total de energía</h2>
            <h1 className="font-extrabold text-4xl md:absolute md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2">24kWh</h1>
        </div>
        <div className="md:col-span-6 lg:col-span-10">
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
  );
}
