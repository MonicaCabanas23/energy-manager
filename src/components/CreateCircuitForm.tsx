"use client"

import Input from "./ui/Input"

export default function CreateCircuitForm() {
    
    return (
        <form className="flex flex-col gap-4">
            <Input 
                id="name" 
                type="text" 
                label="Nombre" 
                value="" 
                onChange={(value) => {console.log(value)}}
            />
            <Input 
                id="double_polarity" 
                type="checkbox" 
                label="Doble polaridad" 
                value={false} 
                onChange={(value) => {console.log(value)}}
            />
        </form>
    )
}