"use client"

import Input from "./ui/Input"
import type { ISensor } from "@/types/schemas/types";

interface Props {
    sensor: ISensor;
    onChange ?: (item: ISensor) => void;
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
        console.log(typeof value)

        if(typeof value === 'boolean') {
            const newSensor = { ...sensor, double_polarity: value }
            onChange?.(newSensor)
        }
    }

    return (
        <form className="flex flex-col gap-4">
            <Input 
                id="name" 
                type="text" 
                label="Nombre" 
                value="" 
                onChange={ handleNameChange }
            />
            <Input 
                id="double_polarity" 
                type="checkbox" 
                label="Doble polaridad" 
                value={false} 
                onChange={ handleDoublePolarityChange }
            />
        </form>
    )
}