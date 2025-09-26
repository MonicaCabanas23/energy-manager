interface InputProps {
    id        : string
    type      : 'text'|'checkbox';
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
    const renderInput = () => {
        if(type === 'checkbox') {
            return (
                <input
                    id={ id }
                    type={ type }
                    checked={ Boolean(value) }
                    className="mt-0.5 rounded border-gray-300 shadow-sm sm:text-sm"
                    onChange={ (e) => onChange?.(e.target.checked) }
                />
            )
        }
        else {
            return (
                <input
                    id={ id }
                    type={ type }
                    value={ String(value) }
                    className="mt-0.5 w-full rounded border-gray-300 shadow-sm sm:text-sm"
                    onChange={ (e) => onChange?.(e.target.value) }
                />
            )
        }
    }

    return (
        <label>
            <span className="text-sm font-medium text-gray-700"> { label } </span>
            { renderInput() }
        </label>
    )
}