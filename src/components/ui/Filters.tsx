import React from "react";
import CardLigth from "./CardLigth";
import { MdFilterAlt } from "react-icons/md";
import { MdFilterAltOff } from "react-icons/md";

interface FiltersProps {
    children?: React.ReactNode;
    classes?: string;
    onFilter?: () => void;
    onClear?: () => void;
}

export default function Filters({
    children, 
    classes,
    onFilter, 
    onClear
}: FiltersProps
) {
    return (
        <CardLigth classes="flex flex-col gap-4">
            <div className={classes}>
                {children}
            </div>
            
            {/* Actions Buttons */}
            <div className="w-full flex items-center justify-end gap-4">
                <button 
                    className="flex rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700"
                    onClick={onFilter}
                >
                    <MdFilterAlt />
                </button>
                <button 
                    className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600 transition hover:text-teal-600/75 sm:block"
                    onClick={onClear}
                >
                    <MdFilterAltOff />
                </button>
            </div>
        </CardLigth>
    )
}