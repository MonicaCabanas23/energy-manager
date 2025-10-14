"use client"
import { Reading } from "@/types/circuits";
import { useState } from "react"

interface ElectricalPanelProps {
  circuits : Reading[];
  classes ?: string;
}

export default function ElectricalPanel({ 
  circuits = [], 
  classes = '',
}: ElectricalPanelProps
) {
  const [selectedCircuit, setSelectedCircuit] = useState<number | null>(null)

  const renderPhases = () => {
    const regex = /^(L[12]|N)$/;

    return circuits
    .filter(c => regex.test(c.name))
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
    .map((c: Reading, index: number)=> (
      <div 
        key={index}
        className="min-w-16 h-16 rounded-md bg-gray-800 text-white hover:cursor-pointer transform hover:scale-105 transition-all duration-200 flex flex-col items-center justify-center font-semibold"
      >
        <p>{c.name}</p>
        { c.intensity } A
      </div>
    ))
  }

  const renderNormalCircuits = () => {
    const regex = /^C([1-9]|10)(,C([1-9]|10))*$/;

    return circuits
    .filter(c => regex.test(c.name))
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
    .map((circuit: Reading, index: number) => (
      <div
        key={index}
        className={`
          min-w-16 min-h-16 h-full text-gray-800 bg-white border-b-teal-600 border-b-3 
          rounded-md cursor-pointer transition-all duration-200
          flex flex-col items-center justify-center gap-2 p-2
          shadow-md hover:shadow-lg
          ${circuit.doublePolarity ? 'row-span-2' : 'row-span-1'}
        `}
        onClick={() => handleSensorClic(index)}
      >
        {/* Info */}
          <p 
            className="text-xs font-bold"
          >
            { circuit.name }
          </p>
          <div className="flex gap-2 font-bold justify-center items-center">
            <p 
              className="text-xs"
            >
              { circuit.intensity ?? 0 }A
            </p>
            <p 
              className="text-xs"
            >
              { circuit.voltage ?? 0 }V
            </p>
          </div>
      </div>
    ))
  }

  const handleSensorClic = (index: number) => {
    if(selectedCircuit === index + 1) {
      setSelectedCircuit(null)
    }
    else {
      setSelectedCircuit(index + 1)
    }
  }

  const getNumberOfRows = () => {
    return Math.ceil(circuits.length / 2)
  }

  return (
    <div className={`p-6 rounded-xl shadow-lg ${classes}`}>
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Tablero Eléctrico</h2>
      </div>

      {/* Sensores especiales */}
      <div className="min-w-48 md:w-1/2 flex flex-col m-auto bg-gray-300 rounded-md p-4 shadow-lg">
        <div className="flex flex-col items-center">
            <div className="w-full grid grid-cols-3 gap-4 items-center justify-center">
              { renderPhases() }
            </div>
            <div className="w-full grid grid-cols-3 gap-4 items-center justify-center">
                <div className="m-auto w-4 h-8 bg-gray-800"></div>
                <div className="m-auto w-4 h-8 bg-gray-800"></div>
            </div>
        </div>

        {/* Sensores de circuitos */}
        <div className="grid grid-cols-3">
            <div 
              className="col-span-2 grid grid-cols-2 gap-4 items-center justify-center"
              style={{gridTemplateRows: `repeat(${getNumberOfRows()}, minmax(0, 1fr))`}}
            >
              { renderNormalCircuits() }
            </div>
        </div>
      </div>
    </div>
  )
}
