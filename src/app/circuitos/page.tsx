"use client";
import ElectricalPanel from "@/components/electrical-panel/electrical-panel";
import { CSSProperties, useEffect, useState } from "react";
import { CircuitWithReadingsAndCalculationsDTO } from "@/dto/circuits/circuit-with-readings-and-calcultations.dto";
import { BarLoader } from "react-spinners";

export default function Circuitos() {
  const [circuits, setCircuits] = useState<
    CircuitWithReadingsAndCalculationsDTO[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const override: CSSProperties = {
    display: "block",
    margin: "auto auto",
  };

  const fetchCircuits = async () => {
    try {
      const res = await fetch(
        `/api/circuits-readings-calculations?${new URLSearchParams({
          espChipId: "demo", // TODO: Cambiar por un espChipId asociado a la cuenta del usuario
        }).toString()}`
      );

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }
      const data = await res.json();
      setCircuits(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchCircuits();
      setIsLoading(false);
    };

    load();

    // Set up interval to fetch data every 5 seconds (5000 milliseconds)
    const intervalId = setInterval(() => {
      fetchCircuits();
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col p-2">
      {!isLoading ? (
        <ElectricalPanel circuits={circuits} />
      ) : (
        <BarLoader
          color="#008080"
          loading={isLoading}
          cssOverride={override}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      )}
    </div>
  );
}
