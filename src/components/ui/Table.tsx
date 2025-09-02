import { JSX } from "react";

interface TableProps<T extends Record<string, JSX.Element | string | number>> {
    definition : { [key in keyof T]: string; };
    data       : Array<T>;
}

export default function Table<T extends Record<string, JSX.Element | string | number>>({
    definition, 
    data 
}: TableProps<T>
) {
    /**
     * Render the header columns of the table.
     * @returns An array of table header elements.
     */
    const renderHeaderColumns = () => {
        const keysLength = Object.entries(definition).length

        return Object.entries(definition).map(([key, value], index) => {
            if(index === 0) {
                return (
                    <th className="px-3 py-2 whitespace-nowrap rounded-tl-md" key={key}>{value}</th>
                )
            }
            else if(index + 1 === keysLength) {
                return (
                    <th className="px-3 py-2 whitespace-nowrap rounded-tr-md" key={key}>{value}</th>
                )
            }

            return (
                <th className="px-3 py-2 whitespace-nowrap" key={key}>{value}</th>
            )
        })
    }

    /**
     * Render the columns of a table row.
     * @param item The data item for the row.
     * @returns An array of table cell elements.
     */
    const renderRowsColumns = (item: T) => {
        return Object.entries(item).map(([key, value], index) => (
            <td className="px-3 py-2 whitespace-nowrap" key={key}>{value}</td>
        ))
    }

    /**
     * Render the rows of the table.
     * @returns An array of table row elements.
     */
    const renderRows = () => {
        return data.map((item, index) => (
            <tr className="*:text-gray-900 *:first:font-medium" key={index}>
                { renderRowsColumns(item) }
            </tr>
        ))
    }

    return (
        <div className="overflow-x-auto bg-white rounded-bl-md rounded-br-md">
        <table className="min-w-full divide-y-2 divide-gray-200">
            <thead className="ltr:text-left rtl:text-right text-white bg-teal-600">
                <tr className="*:font-medium">
                    {renderHeaderColumns()}
                </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 *:even:bg-teal-50">
                {renderRows()}
            </tbody>
        </table>
        </div>
    );
}