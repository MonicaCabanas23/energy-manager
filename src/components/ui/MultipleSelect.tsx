"use client"

import { useState } from "react";
import React from 'react';

interface Option {
    value: string;
    label: string | number;
}

interface MultipleSelectProps {
    label     : string;
    options   : Option[];
    onChange ?: (selected: Option[]) => void;
}

export default function MultipleSelect({
    label,
    options, 
    onChange
}: MultipleSelectProps
) {
    const [selectedOptions, setSelectedOptions] = useState<Option[]>([])

    /**
     * Handles option change
     * @param event 
     */
    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value       = event.target.id
        const isChecked   = event.target.checked
        const optionIndex = selectedOptions.findIndex((opt: Option) => opt.value === value)

        if(optionIndex >= 0 && !isChecked) {
            const updated = selectedOptions.filter((opt: Option) => opt.value !== value)
            onChange?.(updated)
            setSelectedOptions(updated)
        }
        else if(optionIndex === -1 && isChecked) {
            const option = options.find((opt: Option) => opt.value === value)

            if(option) {
                const updated = [...selectedOptions, option]
                onChange?.(updated)
                setSelectedOptions(updated)
            }
        }
    }

    /**
     * Handles reset click
     */
    const handleResetClick = () => {
        selectedOptions.forEach((opt: Option) => {
            const target: HTMLInputElement | null = document.getElementById(opt.value) as HTMLInputElement | null
            if(target) target.checked = false
        })

        setSelectedOptions([])
    }

    /**
     * Renders the options passed by parameter
     * @returns an array of checkboxes of options
     */
    const renderOptions = () => {
        return options.map(({value, label}, index) => {
            return (
                <label htmlFor={value} className="inline-flex items-center gap-3" key={index}>
                    <input type="checkbox" className="size-5 rounded border-gray-300 shadow-sm" id={value} onChange={handleOptionChange} />
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                </label>
            )
        })
    }

    return (
        <div className="space-y-4">
            <span className="text-sm font-medium text-gray-700"> {label} </span>
            
            <details className="group relative w-full rounded border border-gray-300 shadow-sm">
                <summary
                className="flex items-center justify-between gap-2 p-3 text-gray-700 transition-colors hover:text-gray-900 [&::-webkit-details-marker]:hidden cursor-pointer"
                >

                <span className="text-sm truncate">{selectedOptions.map((opt) => opt.label).toString()}</span>

                <span className="transition-transform group-open:-rotate-180">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-4"
                    >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </span>
                </summary>

                {/* Dropdown flotante */}
                <div className="absolute top-full left-0 z-10 mt-1 w-full divide-y divide-gray-300 rounded border border-gray-300 bg-white shadow-lg">
                <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-sm text-gray-700">{selectedOptions.length} selected</span>
                    <button
                        type="button"
                        className="text-sm text-gray-700 underline transition-colors hover:text-gray-900 hover:cursor-pointer"
                        onClick={handleResetClick}
                    >
                        Reset
                    </button>
                </div>

                <fieldset className="p-3">
                    <legend className="sr-only">Checkboxes</legend>

                    <div className="flex flex-col items-start gap-3">
                    {renderOptions()}
                    </div>
                </fieldset>
                </div>
            </details>
        </div>
    )
}