interface InputProps {
    id        : string
    type      : 'text'|'checkbox'|'date';
    label    ?: string;
    value    ?: string|number|boolean;
    disabled ?: boolean;
    onChange ?: (value: string|number|boolean) => void;
}

export default function Input({
    id,
    type,
    label, 
    value,
    disabled,
    onChange
}: InputProps
) {
    const renderInput = () => {
        if(type === 'checkbox') {
            return (
                <input
                    id={ id }
                    type={ type }
                    checked={ Boolean(value) }
                    disabled={disabled}
                    className="mt-0.5 rounded border-gray-300 shadow-sm sm:text-sm disabled:opacity-75"
                    onChange={ (e) => onChange?.(e.target.checked) }
                />
            )
        }
        else if (type === 'date') {
            return (
                <label>
                    <span className="text-sm font-medium text-gray-700">
                        {label}
                    </span>
                    <input
                        id={ id }
                        type={ type }
                        value={ String(value) }
                        disabled={disabled}
                        className="mt-0.5 w-full rounded border-gray-300 shadow-sm sm:text-sm"
                        onChange={ (e) => onChange?.(e.target.value) }
                    />
                </label>
            )
        }
        else {
            return (
                <input
                    id={ id }
                    type={ type }
                    value={ String(value) }
                    disabled={disabled}
                    className="mt-0.5 w-full rounded border-gray-300 shadow-sm sm:text-sm"
                    onChange={ (e) => onChange?.(e.target.value) }
                />
            )
        }
    }

    return (
        <>
            { renderInput() }
        </>
    )
}