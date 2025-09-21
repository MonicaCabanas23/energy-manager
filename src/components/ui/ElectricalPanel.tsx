"use client"

import { useState } from "react"

interface CircuitInfo {
  circuit: number
  name: string
}

interface ElectricalPanelProps {
  className?: string
}

const circuitData: CircuitInfo[] = [
  { circuit: 1, name: "Circuito Sala" },
  { circuit: 2, name: "Circuito Cocina" },
  { circuit: 3, name: "Circuito Habitación 1" },
  { circuit: 4, name: "Circuito Habitación 2" },
  { circuit: 5, name: "Circuito Lavandería" },
  { circuit: 6, name: "Circuito Baño" },
  { circuit: 7, name: "Circuito Aire Acondicionado" },
  { circuit: 8, name: "Circuito Iluminación Exterior" },
  { circuit: 9, name: "Circuito Refrigerador" },
  { circuit: 10, name: "Circuito General Auxiliar" },
]

// Simulate different load states for demonstration
const getCircuitStatus = (circuit: number) => {
  const statuses = ["normal", "warning", "overload", "main"]
  const index = (circuit - 1) % 4
  return statuses[index]
}

const getCircuitColor = (status: string) => {
  switch (status) {
    case "main":
      return "bg-blue-500 hover:bg-blue-600"
    case "normal":
      return "bg-teal-600 hover:bg-teal-700"
    case "warning":
      return "bg-yellow-400 hover:bg-yellow-500"
    case "overload":
      return "bg-red-500 hover:bg-red-600"
    default:
      return "bg-green-500 hover:bg-green-600"
  }
}

const getCurrentValue = (circuit: number) => {
  // Simulate different current values
  const values = [15, 8, 22, 18, 12, 6, 35, 9, 14, 11]
  return values[(circuit - 1) % values.length]
}

export default function ElectricalPanel({ className = "" }: ElectricalPanelProps) {
  const [hoveredCircuit, setHoveredCircuit] = useState<number | null>(null)

  return (
    <div className={`p-6 rounded-xl shadow-lg ${className}`}>
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Tablero Eléctrico</h2>
      </div>

      <div className="min-w-48 overflow-scroll md:w-1/2 flex flex-col m-auto bg-gray-600 rounded-md p-4 shadow-lg">
        <div className="flex flex-col items-center">
            <div className="w-full grid grid-cols-3 gap-4 items-center justify-center">
                <div className="min-w-16 h-16 rounded-md bg-gray-800 text-white hover:cursor-pointer transform hover:scale-105 transition-all duration-200 flex items-center justify-center font-semibold">10 A</div>
                <div className="min-w-16 h-16 rounded-md bg-gray-800 text-white hover:cursor-pointer transform hover:scale-105 transition-all duration-200 flex items-center justify-center font-semibold">9.5 A</div>
                <div className="min-w-16 h-16 rounded-md bg-gray-800 text-white hover:cursor-pointer transform hover:scale-105 transition-all duration-200 flex items-center justify-center font-semibold">0.5 A</div>
            </div>
            <div className="w-full grid grid-cols-3 gap-4 items-center justify-center">
                <div className="m-auto w-4 h-8 bg-gray-800"></div>
                <div className="m-auto w-4 h-8 bg-gray-800"></div>
            </div>
        </div>

        <div className="grid grid-cols-3">
            <div className="col-span-2 grid grid-cols-2 gap-4 items-center justify-center">
                {circuitData.map((circuit) => {
                const status = getCircuitStatus(circuit.circuit)
                const current = getCurrentValue(circuit.circuit)
                const colorClass = getCircuitColor(status)

                return (
                    <div
                    key={circuit.circuit}
                    className="relative"
                    onMouseEnter={() => setHoveredCircuit(circuit.circuit)}
                    onMouseLeave={() => setHoveredCircuit(null)}
                    >
                    <div
                        className={`
                        min-w-16 h-16 ${colorClass} 
                        rounded-md cursor-pointer transition-all duration-200
                        flex flex-col items-center justify-center
                        transform hover:scale-105 shadow-md hover:shadow-lg
                        `}
                    >
                        <div className="text-white font-bold text-center">
                        <div className="text-xs">C{circuit.circuit}</div>
                        <div className="text-sm">{current}A</div>
                        </div>
                    </div>

                    {hoveredCircuit === circuit.circuit && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
                        <div className="bg-gray-800 text-white text-sm rounded p-2 whitespace-nowrap shadow-lg">
                            <div className="font-semibold">{circuit.name}</div>
                            <div className="text-xs opacity-90">Corriente: {current}A</div>
                            <div className="text-xs opacity-90 capitalize">
                            Estado:{" "}
                            {status === "main"
                                ? "Principal"
                                : status === "normal"
                                ? "Normal"
                                : status === "warning"
                                    ? "Advertencia"
                                    : "Sobrecarga"}
                            </div>
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                        </div>
                    )}
                    </div>
                )
                })}
            </div>
        </div>
      </div>


      <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-gray-700">Principal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-gray-700">Normal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-400 rounded"></div>
          <span className="text-gray-700">Advertencia</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-gray-700">Sobrecarga</span>
        </div>
      </div>
    </div>
  )
}
