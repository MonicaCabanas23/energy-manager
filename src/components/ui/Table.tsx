interface TableProps {
    definition: { [key: string]: string; };
    data: Array<{ [key: string]: any }>;
}

export default function Table({ definition, data }: TableProps) {
    const renderHeaderColumns = () => {
        return Object.entries(definition).map(([key, value]) => (
            <th className="px-3 py-2 whitespace-nowrap" key={key}>{value}</th>
        ))
    }

    const renderRows = () => {
        return data.map((item, index) => (
            <tr className="*:text-gray-900 *:first:font-medium" key={index}>
                {Object.entries(item).map(([key, value]) => (
                    <td className="px-3 py-2 whitespace-nowrap" key={key}>{value}</td>
                ))}
            </tr>
        ))
    }

    return (
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y-2 divide-gray-200">
            <thead className="ltr:text-left rtl:text-right">
            <tr className="*:font-medium *:text-gray-900">
                {renderHeaderColumns()}
            </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 *:even:bg-gray-50">
                {renderRows()}
            </tbody>
        </table>
        </div>
    );
}