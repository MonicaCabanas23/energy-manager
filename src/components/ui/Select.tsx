interface Option {
    value: string;
    label: string | number;
}

interface SelectProps {
    label     : string;
    options   : Option[];
    onChange ?: (selected: Option) => void; 
}

export default function Select({
    label, 
    options, 
    onChange
}: SelectProps
) {
    const renderOptions = () => {
        return options.map(({ value, label }: Option, index: number) => {
            return <option value={ value } key={index}>{ label }</option>
        })
    }

    const handleOnChange = (event: any) => {
        const selectedValue = event.target.value
        const option = options.find(opt => opt.value === selectedValue)

        if(option) 
            onChange?.(option)
    }

    return (
        <div>
            <label htmlFor="Headline" className="space-y-4">
                <span className="text-sm font-medium text-gray-700"> {label} </span>

                <select
                    name="Headline"
                    id="Headline"
                    className="mt-0.5 w-full rounded border-gray-300 shadow-sm sm:text-sm p-2"
                    onChange={handleOnChange}
                >
                {renderOptions()}
                </select>
            </label>
        </div>
    )
}