"use client"

import { useEffect } from "react";
import Input from "./ui/Input"
import type { CreateOrUpdateSensor } from "@/types/actions/types";

interface Props {
    sensor: CreateOrUpdateSensor;
    onChange ?: (item: CreateOrUpdateSensor) => void;
}

export default function CreateOrUpdateSensorForm({
    sensor,
    onChange
}: Props
) {
    const handleNameChange = (value: string|number|boolean) => {
        if(typeof value === 'string') {
            const newSensor = { ...sensor, name: value }
            onChange?.(newSensor)
        }
    }

    const handleDoublePolarityChange = (value: string|number|boolean) => {
        if(typeof value === 'boolean') {
            const newSensor = { ...sensor, doublePolarity: value }
            onChange?.(newSensor)
        }
    }

    useEffect(() => {
        console.log(sensor)
    }, [sensor])

    return (
        <form className="flex flex-col gap-4 justify-center">
            <Input 
                id="name" 
                type="text" 
                label="Nombre" 
                value={sensor.name} 
                onChange={ handleNameChange }
            />
            <Input 
                id="doublePolarity" 
                type="checkbox" 
                label="Doble polaridad" 
                value={sensor.doublePolarity} 
                onChange={ handleDoublePolarityChange }
            />
        </form>
    )
}