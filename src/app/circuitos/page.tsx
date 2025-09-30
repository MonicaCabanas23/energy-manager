"use client"
import CreateOrUpdateSensorForm         from "@/components/CreateOrUpdateSensorForm";
import ElectricalPanel                  from "@/components/ui/ElectricalPanel";
import Modal                            from "@/components/ui/Modal";
import { useEffect, useState }          from "react";
import { SensorWithReadingResponseDTO } from "@/dto/sensor-with-reading-response.dto";
import type { CreateOrUpdateSensor }     from "@/types/actions/types";

export default function Circuitos() {
  const [action, setAction]                 = useState<'create'|'update'>('create')
  const [modalIsVisible, setModalIsVisible] = useState<boolean>(false)
  const [sensors, setSensors]               = useState<SensorWithReadingResponseDTO[]>([])
  const [sensor, setSensor]                 = useState<CreateOrUpdateSensor>({
    id             : 0,
    code           : 'A0',
    name           : '',
    doublePolarity : false,
    panelId        : 1
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
      id             : 0,
      code           : 'A0',
      name           : '',
      doublePolarity : false,
      panelId        : 1
    })
  }

  /**
   * Handles sensor click
   * @param {Isensor} item
   */
  const handleSensorClick = (item: SensorWithReadingResponseDTO) => {
    setModalIsVisible(true)
    setSensor(item)
    setAction('update')
  }

  /**
   * Handles click event to "Add sensor" button
   */
  const handleAddSensorClick = () => {
    setModalIsVisible(true)
    setAction('create')
  }

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const res = await fetch(`/api/sensors?${new URLSearchParams({
            panelId: '1' // TODO: Cambiar el parámetro por el id del panel de manera dinámica
          }).toString()
        }`);
        
        if (!res.ok) {
          throw new Error(`Error ${res.status}`);
        }
        const data = await res.json();
        setSensors(data)
      } catch (error) {
        console.error(error);
      }
    };

    fetchSensors()
  }, [])
  
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
          onChange={(item: CreateOrUpdateSensor) => setSensor(item)}
        />
      </Modal>
    </div>
  );
}
