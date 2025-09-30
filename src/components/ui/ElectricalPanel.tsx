"use client"

import { SensorWithReadingResponseDTO } from "@/dto/sensor-with-reading-response.dto";
import { useState } from "react"
import { FaPlus } from "react-icons/fa6";

interface ElectricalPanelProps {
  sensors           : SensorWithReadingResponseDTO[];
  classes          ?: string;
  onSensorClick    ?: (item: SensorWithReadingResponseDTO) => void;
  onAddSensorClick ?: () => void;
}

export default function ElectricalPanel({ 
  sensors = [], 
  classes = '',
  onSensorClick,
  onAddSensorClick,
}: ElectricalPanelProps
) {
  const [hoveredCircuit, setHoveredCircuit] = useState<number | null>(null)

  return (
    <div className={`p-6 rounded-xl shadow-lg ${classes}`}>
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Tablero Eléctrico</h2>
      </div>

      <div className="min-w-48 md:w-1/2 flex flex-col m-auto bg-gray-300 rounded-md p-4 shadow-lg">
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
              {sensors.map((sensor, index) => {
              const current    = sensor.intensity ?? 0

              return (
                  <div
                    key={index}
                    className="relative"
                    onMouseEnter={() => setHoveredCircuit(index + 1)}
                    onMouseLeave={() => setHoveredCircuit(null)}
                  >
                  <div
                    className={`
                      min-w-16 min-h-16 bg-blue-500 hover:bg-blue-600 
                      rounded-md cursor-pointer transition-all duration-200
                      flex flex-col items-center justify-center
                      transform hover:scale-105 shadow-md hover:shadow-lg
                      ${sensor.doublePolarity ? 'row-span-2' : 'row-span-1'}
                    `}
                    onClick={() => {onSensorClick?.(sensor)}}
                  >
                      <div className="text-white font-bold text-center">
                      <div className="text-xs">C{index + 1}</div>
                      <div className="text-sm">{current}A</div>
                      </div>
                  </div>

                  {/* Tooltip */}
                  {hoveredCircuit === index + 1 && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
                      <div className="bg-gray-800 text-white text-sm rounded p-2 whitespace-nowrap shadow-lg">
                          <div className="font-semibold">{sensor.name}</div>
                          <div className="text-xs opacity-90">Corriente: {current}A</div>
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                      </div>
                  )}
                  </div>
                )
              })}
              {/* Botón por defecto para agregar más sensores */}
              <div className="min-w-16 h-16 bg-teal-600 
                rounded-md cursor-pointer transition-all duration-200
                flex flex-col items-center justify-center
                transform hover:scale-105 shadow-md hover:shadow-lg text-white"
                onClick={() => onAddSensorClick?.()}
              >
                <FaPlus />
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}
