"use client"
import ElectricalPanel                  from "@/components/electrical-panel/electrical-panel";
import { useEffect, useState }          from "react";
import { CircuitWithReadingsAndCalculationsDTO } from "@/dto/circuits/circuit-with-readings-and-calcultations.dto";

export default function Circuitos() {
  const [circuits, setCircuits] = useState<CircuitWithReadingsAndCalculationsDTO[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const fetchCircuits = async () => {
    try {
      const res = await fetch(`/api/circuits?${new URLSearchParams({
          espChipId: 'demo' // TODO: Cambiar por un espChipId asociado a la cuenta del usuario
        }).toString()
      }`);
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }
      const data = await res.json();
      setCircuits(data)
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchCircuits()
      setIsLoading(false)
    }

    load()
  }, [])
  
  return (
    <div>
      {
        !isLoading ? 
        <ElectricalPanel 
          circuits={circuits}
        />
        :
        <> Cargando...</>
      }
    </div>
  );
}
