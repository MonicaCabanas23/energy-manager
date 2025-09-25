"use client"
import { useEffect, useState } from "react";

interface InputProps {
    id        : string
    type      : string;
    label    ?: string;
    value    ?: string|number|boolean;
    onChange ?: (value: string) => void;
}

export default function Input({
    id,
    type,
    label, 
    value,
    onChange
}: InputProps
) {
    const [_value, setValue] = useState<string|number|boolean>('')

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value
        setValue(newValue)
        onChange?.(newValue)
    }

    const renderInput = () => {
        if(type === 'checkbox' && typeof _value === 'boolean') {
            return (
                <input
                    id={ id }
                    type={ type }
                    checked={_value }
                    className="mt-0.5 border-gray-300 shadow-sm"
                    onChange={ handleInputChange }
                />
            )
        }
        else if (typeof _value !== 'boolean') {
            return (
                <input
                    id={ id }
                    type={ type }
                    value={_value }
                    className="mt-0.5 w-full rounded border-gray-300 shadow-sm sm:text-sm"
                    onChange={ handleInputChange }
                />
            )
        }
        else {
            return null
        }
    }

    useEffect(() => {
        if(value) {
            setValue(value)
        }
    }, [])

    return (
        <label>
            <span className="text-sm font-medium text-gray-700"> { label } </span>
            { renderInput() }
        </label>
    )
}