"use client"
import CreateCircuitForm from "@/components/CreateCircuitForm";
import ElectricalPanel from "@/components/ui/ElectricalPanel";
import Modal from "@/components/ui/Modal";
import { useState } from "react";

interface Circuit {
  name            : string;
  double_polarity : boolean;
}

export default function Circuitos() {
  const [modalIsVisible, setModalIsVisible] = useState<boolean>(false)
  const [circuit, setCirctuit]              = useState<Circuit|null>(null)

  const handleOnCloseModal = () => {
    setModalIsVisible(false)
  }

  const handleOnAccept = () => {
    // TODO: Send request to the API to save the circuit
    setModalIsVisible(false)
    resetCircuitReference()
  }

  const handleOnCancel = () => {
    resetCircuitReference()
    setModalIsVisible(false)
  }

  const resetCircuitReference = () => {
    setCirctuit(null)
  }
  
  return (
    <div>
      <button onClick={() => setModalIsVisible(true)}>Open modal</button>
      <ElectricalPanel />
        <Modal 
          visible={modalIsVisible}
          onClose={handleOnCloseModal}
          onAccept={handleOnAccept}
          onCancel={handleOnCancel}
          title="Editar ciruito"
        >
          <CreateCircuitForm />
        </Modal>
    </div>
  );
}
