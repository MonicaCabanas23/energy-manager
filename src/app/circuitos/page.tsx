"use client"
import CreateOrUpdateSensorForm         from "@/components/CreateOrUpdateSensorForm";
import ElectricalPanel                  from "@/components/electrical-panel/electrical-panel";
import Modal                            from "@/components/ui/Modal";
import { useEffect, useState }          from "react";
import { SensorWithReadingResponseDTO } from "@/dto/sensor-with-reading-response.dto";
import type { CreateOrUpdateSensor }     from "@/types/actions/types";

export default function Circuitos() {
  const [action, setAction]                 = useState<'create'|'view'|'update'|'delete'>('create')
  const [modalIsVisible, setModalIsVisible] = useState<boolean>(false)
  const [sensors, setSensors]               = useState<SensorWithReadingResponseDTO[]>([])
  const [sensor, setSensor]                 = useState<CreateOrUpdateSensor>({
    id             : null,
    name           : '',
    doublePolarity : false,
    panelId        : 1
  })
  
  const titles = {
    create : 'Agregar sensor',
    view   : 'Visualizar sensor',
    update : 'Editar sensor',
    delete : '¿Estás seguro de eliminar este sensor?'
  }

  type TitleKeys = keyof typeof titles
  
  const getTitle = (key: TitleKeys) => {
    return titles[key]
  }

  const handleOnCloseModal = () => {
    setModalIsVisible(false)
  }

  const handleOnAccept = async () => {
    try {
      if(action === 'create') {
        const response = await fetch('/api/sensors/with-reading', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(sensor)
        })

        const newSensor = await response.json()
        const newSensors = [...sensors, newSensor]
        setSensors(newSensors)

        // TODO: toast for successfully 
        
      }
      else if(action === 'update') {
        const data = await fetch('/api/sensors/with-reading', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(sensor)
        })

        console.log(data)
        // TODO: toast for successfully updating the sensor
      }
      else if(action === 'delete') {
        await fetch(`/api/sensors/${sensor.id}`, {
          method: 'DELETE'
        })

        // TODO: toast for successfully deleting the sensor
      }

      setModalIsVisible(false)
      resetSensorReference()
    } catch (error) {
      
    }
  }

  const handleOnCancel = () => {
    resetSensorReference()
    setModalIsVisible(false)
  }

  const resetSensorReference = () => {
    setSensor({
      id             : 0,
      name           : '',
      doublePolarity : false,
      panelId        : 1
    })
  }

  /**
   * Handles sensor click
   * @param {Isensor} item
   */
  const handleEditSensorClic = (item: SensorWithReadingResponseDTO) => {
    setModalIsVisible(true)
    setSensor(item)
    setAction('update')
  }

  const handleViewSensorClic = (item: SensorWithReadingResponseDTO) => {
    setModalIsVisible(true)
    setSensor(item)
    setAction('update')
  }

  const handleDeleteSensorClick = (item: SensorWithReadingResponseDTO) => {

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
        const res = await fetch(`/api/sensors/with-reading?${new URLSearchParams({
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
        onViewSensorClick={handleEditSensorClic}
        onEditSensorClick={handleEditSensorClic}
        onDeleteSensorClick={handleEditSensorClic}
        onAddSensorClick={handleAddSensorClick}
      />

      <Modal 
        visible={modalIsVisible}
        onClose={handleOnCloseModal}
        onAccept={handleOnAccept}
        onCancel={handleOnCancel}
        title={getTitle(action)}
      >
        <CreateOrUpdateSensorForm 
          sensor={sensor}
          onChange={(item: CreateOrUpdateSensor) => setSensor(item)}
        />
      </Modal>
    </div>
  );
}
