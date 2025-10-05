"use client"

import { SensorWithReadingResponseDTO } from "@/dto/sensor-with-reading-response.dto";
import { useState } from "react"
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { MdInfo } from "react-icons/md";  

interface ElectricalPanelProps {
  sensors              : SensorWithReadingResponseDTO[];
  classes             ?: string;
  onViewSensorClick   ?: (item: SensorWithReadingResponseDTO) => void;
  onEditSensorClick   ?: (item: SensorWithReadingResponseDTO) => void;
  onDeleteSensorClick ?: (item: SensorWithReadingResponseDTO) => void;
}

export default function ElectricalPanel({ 
  sensors = [], 
  classes = '',
  onViewSensorClick,
  onEditSensorClick,
  onDeleteSensorClick,
}: ElectricalPanelProps
) {
  const [selectedCircuit, setSelectedCircuit] = useState<number | null>(null)

  const handleSensorClic = (index: number) => {
    if(selectedCircuit === index + 1) {
      setSelectedCircuit(null)
    }
    else {
      setSelectedCircuit(index + 1)
    }
  }

  const getNumberOfRows = () => {
    return Math.ceil(sensors.length / 2)
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
              {/* TODO: Modificar con los que vienen de la base de datos */}
                <div className="min-w-16 h-16 rounded-md bg-gray-800 text-white hover:cursor-pointer transform hover:scale-105 transition-all duration-200 flex items-center justify-center font-semibold">10 A</div>
                <div className="min-w-16 h-16 rounded-md bg-gray-800 text-white hover:cursor-pointer transform hover:scale-105 transition-all duration-200 flex items-center justify-center font-semibold">9.5 A</div>
                <div className="min-w-16 h-16 rounded-md bg-gray-800 text-white hover:cursor-pointer transform hover:scale-105 transition-all duration-200 flex items-center justify-center font-semibold">0.5 A</div>
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
              {sensors.map((sensor, index) => {
              const current = sensor.intensity ?? 0

              return (
                  <div
                    key={index}
                    className={`
                      min-w-16 min-h-16 h-full text-gray-800 bg-white border-b-teal-600 border-b-3 
                      rounded-md cursor-pointer transition-all duration-200
                      flex flex-col items-center justify-center gap-2 p-2
                      shadow-md hover:shadow-lg
                      ${sensor.doublePolarity ? 'row-span-2' : 'row-span-1'}
                    `}
                    onClick={() => handleSensorClic(index)}
                  >
                    {/* Info */}
                    <div className="w-full font-bold text-center">
                      <p 
                        className="text-xs"
                      >
                        { sensor.name }
                      </p>
                      <div className="text-sm">{current}A</div>
                    </div>

                    {/* Actions */}
                    <div 
                      className={`flex gap-2 transition-all text-white
                      ${selectedCircuit === index + 1 ? 'h-6 opacity-100' : 'h-0 opacity-0'}`}
                    >
                      <button 
                        className="bg-gray-500 rounded-md p-1  hover:cursor-pointer" 
                        onClick={(e) => {e.stopPropagation(); onViewSensorClick?.(sensor)}}
                      >
                        <MdInfo />
                      </button>
                      <button 
                        className="bg-teal-500 rounded-md p-1 hover:cursor-pointer" 
                        onClick={(e) => {e.stopPropagation(); onEditSensorClick?.(sensor)}}
                      >
                        <MdEdit />
                      </button>
                      <button 
                        className="bg-rose-500 rounded-md p-1 hover:cursor-pointer"
                        onClick={(e) => {e.stopPropagation(); onDeleteSensorClick?.(sensor)}}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
        </div>
      </div>
    </div>
  )
}
