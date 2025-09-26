"use client"
import { useEffect, useState } from "react";

interface InputProps {
    id        : string
    type      : string;
    label    ?: string;
    value    ?: string|number|boolean;
    onChange ?: (value: string|number|boolean) => void;
}

export default function Input({
    id,
    type,
    label, 
    value,
    onChange
}: InputProps
) {
    const [checkBoxInputValue, setCheckBoxInputValue] = useState<boolean>(false)
    const [textInputValue, setTextInputValue]         = useState<string>('')

    const handleTextInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value
        setTextInputValue(newValue)
        onChange?.(newValue)
    }

    const handleCheckboxInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.checked
        console.log('en input',newValue)
        setCheckBoxInputValue(newValue)
        onChange?.(newValue)
    }

    const renderInput = () => {
        if(type === 'checkbox') {
            return (
                <input
                    id={ id }
                    type={ type }
                    checked={ checkBoxInputValue }
                    className="mt-0.5 rounded border-gray-300 shadow-sm sm:text-sm"
                    onChange={ handleCheckboxInputChange }
                />
            )
        }
        else {
            return (
                <input
                    id={ id }
                    type={ type }
                    value={ textInputValue}
                    className="mt-0.5 w-full rounded border-gray-300 shadow-sm sm:text-sm"
                    onChange={ handleTextInputChange }
                />
            )
        }
    }

    useEffect(() => {
        if(value && type === 'checkbox' && typeof value === 'boolean') {
            setCheckBoxInputValue(value)
        }
        else if(value && type === 'text' && typeof value === 'string') {
            setTextInputValue(value)
        }
    }, [])

    return (
        <label>
            <span className="text-sm font-medium text-gray-700"> { label } </span>
            { renderInput() }
        </label>
    )
}