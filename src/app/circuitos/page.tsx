"use client"
import CreateOrUpdateSensorForm from "@/components/CreateOrUpdateSensorForm";
import ElectricalPanel          from "@/components/ui/ElectricalPanel";
import Modal                    from "@/components/ui/Modal";
import { ISensor }              from "@/types/schemas/types";
import { useEffect, useState }  from "react";
import { sensors }              from "@/data/sensors";

export default function Circuitos() {
  const [action, setAction]                 = useState<'create'|'update'>('create')
  const [modalIsVisible, setModalIsVisible] = useState<boolean>(false)
  const [sensor, setSensor]                 = useState<ISensor>({
    name: '',
    double_polarity: false
  })

  const handleOnCloseModal = () => {
    setModalIsVisible(false)
  }

  const handleOnAccept = () => {
    // TODO: Send request to the API to save the circuit
    console.log('Sensor a guardar: ', sensor)
    setModalIsVisible(false)
    resetSensorReference()
  }

  const handleOnCancel = () => {
    resetSensorReference()
    setModalIsVisible(false)
  }

  const resetSensorReference = () => {
    setSensor({
      name: '',
      double_polarity: false
    })
  }

  const handleSensorClick = (item: ISensor) => {
    setModalIsVisible(true)
    setSensor(item)
    setAction('update')
  }

  const handleAddSensorClick = () => {
    setModalIsVisible(true)
    setAction('create')
  }
  
  return (
    <div>
      <ElectricalPanel 
        sensors={sensors}
        onSensorClick={handleSensorClick}
        onAddSensorClick={handleAddSensorClick}
      />
      <Modal 
        visible={modalIsVisible}
        onClose={handleOnCloseModal}
        onAccept={handleOnAccept}
        onCancel={handleOnCancel}
        title={action === 'create' ? 'Agregar sensor' : 'Editar sensor'}
      >
        <CreateOrUpdateSensorForm 
          sensor={sensor}
          onChange={(item: ISensor) => setSensor(item)}
        />
      </Modal>
    </div>
  );
}
