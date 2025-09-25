import React from "react"

interface CardLigthProps {
    classes  ?: string;
    children ?: React.ReactNode
}

export default function CardLigth({ 
    classes, 
    children 
}: CardLigthProps
) {
    return(
        <div className={`bg-white min-h-24 rounded-md shadow-md border-l-teal-600 border-l-6 p-2 ${classes}`}>
            { children }
        </div>
    )
}