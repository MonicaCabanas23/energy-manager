"use client"

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
import { io, Socket } from 'socket.io-client'
import { Line } from 'react-chartjs-2';
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
        position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Consumo de energía (kWh) por mes',
        },
    },
};

const costOptions = {
    responsive: true,
    plugins: {
        legend: {
        position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Costo (USD) por mes',
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
    borderColor?: string;
    backgroundColor?: string;
}

export default function Dashboard() {
    const [selectOptions, setSelectOptions]       = useState<Option[]>([])
    const [tableCircuits, setTableCircuits]       = useState<CircuitWithReadingsAndCalculationsDTO[]>([])
    const [energyDataSet, setEnergyDataSet]       = useState<LineGraphDataSet[]>([])
    const [costDataSet, setCostDataSet]           = useState<LineGraphDataSet[]>([])
    const [monthLabels, setMonthLabels]           = useState<string[]>([])
    const [selectedCircuits, setSelectedCircuits] = useState<Option[]>([])
    const [isLoading, setIsLoading]               = useState<boolean>(true)
    const [startDate, setStartDate]               = useState<string>('')
    const [endDate, setEndDate]                   = useState<string>('')
    const socketRef = useRef<Socket | null>(null)

    const override: CSSProperties = {
        display : "block",
        margin  : "auto auto",
    };

    // const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

    const energyDataLine = {
        labels: monthLabels,
        datasets: energyDataSet,
    };

    const costDataLine = {
        labels: monthLabels,
        datasets: energyDataSet,
    }

    function getMonthNameInSpanish(monthNumber: number) {
        // Create a Date object. The year and day don't matter as we only need the month.
        // monthNumber is 0-indexed, so 0 is January, 1 is February, etc.
        const date = new Date(2000, monthNumber, 1); 

        // Create an Intl.DateTimeFormat instance for Spanish (es-ES)
        // and specify that we want the 'long' (full) month name.
        const formatter = new Intl.DateTimeFormat('es-ES', { month: 'long' });

        // Format the date to get the Spanish month name.
        return formatter.format(date);
    }

    const fetchCircuits = async (): Promise<Option[]> => {
        try {
            const params = new URLSearchParams({
                espChipId : 'demo', // TODO Cambiar por un espChipId asociado a la cuenta del usuario
            })

            const res = await fetch(`/api/circuits?${params.toString()}`);
            
            if (!res.ok) {
                throw new Error(`Error ${res.status}`);
            }

            let data = await res.json();
            data = data.filter((c: CircuitWithReadingsAndCalculationsDTO) => !['L1', 'L2', 'N'].includes(c.name) )
            
            const options = data.map((c: CircuitDTO) => ({
                value: c.name,
                label: c.name
            }))

            setSelectOptions(options)
            return options
        } catch (error) {
            console.error(error);
            return []
        }
    }

    const fetchCircuitsWithCalculationsGroupedByMonth = async () => {
        try {
            const params = new URLSearchParams({
                espChipId : 'demo', // TODO Cambiar por un espChipId asociado a la cuenta del usuario
            })

            startDate                   && params.set('startDate', startDate)
            endDate                     && params.set('endDate', endDate)
            selectedCircuits.length > 0 && params.set('circuits', selectedCircuits.map(c => c.value).join('|'))

            const res = await fetch(`/api/circuits-calculations?${params.toString()}`);
            
            if (!res.ok) {
                throw new Error(`Error ${res.status}`);
            }

            let data = await res.json();
            data           = data.filter((c: CircuitWithCalculationsGroupedByMonth) => !['L1', 'L2', 'N'].includes(c.name) )
            const months   = data.find((c: CircuitWithCalculationsGroupedByMonth) => c.months.length > 0).months.map((m: number) => getMonthNameInSpanish(m-1))
            const energyDataSet = data.map((c: CircuitWithCalculationsGroupedByMonth, index: number) => {
                const hue = (index * 360 / data.length) % 360; // distribuye tonos uniformemente
                const borderColor = `hsl(${hue}, 70%, 50%)`;
                const backgroundColor = `hsla(${hue}, 70%, 50%, 0.5)`;

                return {
                    label: c.name,
                    data: c.energies,
                    borderColor,
                    backgroundColor,
                };
            })
            const costDataSet = data.map((c: CircuitWithCalculationsGroupedByMonth, index: number) => {
                const hue = (index * 360 / data.length) % 360; // distribuye tonos uniformemente
                const borderColor = `hsl(${hue}, 70%, 50%)`;
                const backgroundColor = `hsla(${hue}, 70%, 50%, 0.5)`;

                return {
                    label: c.name,
                    data: c.costs,
                    borderColor,
                    backgroundColor,
                };
            })

            setMonthLabels(months)
            setEnergyDataSet(energyDataSet)
            setCostDataSet(costDataSet)
        } catch (error) {
            console.error(error);
        }
    }

    const fetchCircuitsWithReadingsAndCalculations = async () => {
        try {
            const params = new URLSearchParams({
                espChipId : 'demo', // TODO Cambiar por un espChipId asociado a la cuenta del usuario
            })

            startDate                   && params.set('startDate', startDate)
            endDate                     && params.set('endDate', endDate)
            selectedCircuits.length > 0 && params.set('circuits', selectedCircuits.map(c => c.value).join('|'))

            const res = await fetch(`/api/circuits-readings-calculations?${params.toString()}`);
            
            if (!res.ok) {
                throw new Error(`Error ${res.status}`);
            }

            let data = await res.json();
            data = data.filter((c: CircuitWithReadingsAndCalculationsDTO) => !['L1', 'L2', 'N'].includes(c.name) )

            setTableCircuits(data)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const url = process.env.NEXT_PUBLIC_SOCKET_URL ?? 'ws://localhost:3001'

        const setup = async () => {
            // Inicializa el suscriptor MQTT en backend (idempotente)
            await fetch('/api/mqtt')

            const options = await fetchCircuits()

            const socket = io(url, { transports: ['websocket'] })
            socketRef.current = socket

            // Manejo de actualizaciones puntuales
            socket.on('circuits_readings_calculations', (payload: CircuitWithReadingsAndCalculationsDTO[]) => {
                const data = payload.filter((c) => !['L1', 'L2', 'N'].includes(c.name))
                setTableCircuits((prev) => {
                    const map = new Map(prev.map((c) => [c.name, c]))
                    data.forEach((c) => map.set(c.name, c))
                    return Array.from(map.values())
                })
            })

            socket.on('circuits_calculations', (payload: CircuitWithCalculationsGroupedByMonth[]) => {
                const data = payload.filter((c) => !['L1', 'L2', 'N'].includes(c.name))
                // Actualiza labels si vienen del backend
                const anyMonths = data.find((c) => c.months.length > 0)?.months
                if (anyMonths && anyMonths.length) {
                    setMonthLabels(anyMonths.map((m) => getMonthNameInSpanish(m - 1)))
                }

                setEnergyDataSet((prev) => {
                    const map = new Map(prev.map((d) => [d.label, d]))
                    data.forEach((c, index) => {
                        const hue = (index * 360 / Math.max(data.length, 1)) % 360
                        const borderColor = `hsl(${hue}, 70%, 50%)`
                        const backgroundColor = `hsla(${hue}, 70%, 50%, 0.5)`
                        map.set(c.name, {
                            label: c.name,
                            data: c.energies,
                            borderColor,
                            backgroundColor,
                        })
                    })
                    return Array.from(map.values())
                })

                setCostDataSet((prev) => {
                    const map = new Map(prev.map((d) => [d.label, d]))
                    data.forEach((c, index) => {
                        const hue = (index * 360 / Math.max(data.length, 1)) % 360
                        const borderColor = `hsl(${hue}, 70%, 50%)`
                        const backgroundColor = `hsla(${hue}, 70%, 50%, 0.5)`
                        map.set(c.name, {
                            label: c.name,
                            data: c.costs,
                            borderColor,
                            backgroundColor,
                        })
                    })
                    return Array.from(map.values())
                })
            })

            // Solicita snapshot inicial para todos los circuitos disponibles
            // Filtra fases L1/L2/N fuera del snapshot
            const allCircuitNames = options
                .map((o) => o.value)
                .filter((name) => !['L1', 'L2', 'N'].includes(name))

            const espChipId = 'demo'
            if (allCircuitNames.length > 0) {
                // Suscribir a todos los circuitos al inicio para recibir actualizaciones
                allCircuitNames.forEach((name) => {
                    socket.emit('subscribe', { espChipId, circuitName: name })
                })

                socket.emit('request_initial_data', {
                    espChipId,
                    circuits: allCircuitNames.join('|'),
                    startDate: startDate || null,
                    endDate: endDate || null,
                })
            }

            setIsLoading(false)
        }

        setup()

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect()
                socketRef.current = null
            }
        }
    }, [])

    // Suscribe/desuscribe por circuitos seleccionados
    useEffect(() => {
        const socket = socketRef.current
        if (!socket) return
        const espChipId = 'demo'

        // Primero desuscribe todo
        // En un caso real, llevaríamos un tracking de suscripciones previas
        selectOptions.forEach((opt) => {
            socket.emit('unsubscribe', { espChipId, circuitName: opt.value })
        })

        // Suscribe a los circuitos seleccionados actuales
        selectedCircuits.forEach((opt) => {
            socket.emit('subscribe', { espChipId, circuitName: opt.value })
        })
        // También puede solicitar datos iniciales para los seleccionados
        if (selectedCircuits.length > 0) {
            const names = selectedCircuits.map((o) => o.value)
            socket.emit('request_initial_data', {
                espChipId,
                circuits: names.join('|'),
                startDate: startDate || null,
                endDate: endDate || null,
            })
        }
    }, [selectedCircuits])

  return (
    <div className="flex flex-col gap-4 p-2">
        {
            !isLoading ? 
            <>
                <Filters classes="grid grid-cols-3 gap-4">
                    {
                        selectOptions.length > 0 ?
                            <MultipleSelect 
                                label="Circuito" 
                                options={selectOptions}
                                selected={selectedCircuits}
                                onChange={(v) => setSelectedCircuits(v)}
                            /> 
                        : null
                    }
                    <Input
                        id='startDate'
                        type='date'
                        label="Desde"
                        value={startDate}
                        onChange={(v) => { typeof v === 'string' && setStartDate(v)}}
                    />
                    <Input
                        id='endDate'
                        type='date'
                        label="Hasta"
                        value={endDate}
                        onChange={(v) => { typeof v === 'string' && setEndDate(v)}}
                    />
                </Filters>
                
                <div className="max-w-full grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-4">
                    {/** 
                    
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
                                name           : "Circuito",
                                doublePolarity : "Doble polaridad",
                                lastIntensity  : "Corriente (A)",
                                lastVoltage    : "Voltaje (V)",
                                energy         : "Consumo (kWh)",
                                cost           : "Costo (USD)"
                            }}
                            data={tableCircuits}
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
