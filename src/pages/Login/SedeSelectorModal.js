import { useState, useEffect } from 'react'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import SedeCliente from 'services/SedeCliente'

const SedeSelectorModal = ({ visible, onSelect, onClose }) => {
  const [sedes, setSedes] = useState([])
  const [selectedSede, setSelectedSede] = useState(null)
  const [loading, setLoading] = useState(false)
  const [cliente, setCliente] = useState('')

  useEffect(() => {
    if (visible) {
      setLoading(true)
      SedeCliente.getSedesPorPersona()
        .then(async res => {
          const data = await res.json()
          const sedesArray = Array.isArray(data.result) ? data.result : []
          setSedes(sedesArray)
          if (sedesArray.length > 0) {
            setCliente(sedesArray[0].nombre_cliente)
          }
        })
        .finally(() => setLoading(false))
    }
  }, [visible])

  const handleSelect = () => {
    if (selectedSede) {
      onSelect(selectedSede)
    }
  }

  return (
    <Dialog
      visible={visible}
      modal
      header="Selecciona una sede"
      closable={false}
      footer={
        <Button
          label="Ingresar"
          disabled={!selectedSede}
          onClick={handleSelect}
        />
      }
      onHide={onClose}
    >
      <div style={{ marginBottom: 16 }}>
        <strong>Cliente:</strong> {cliente || 'Sin cliente'}
      </div>
      <Dropdown
        value={selectedSede}
        options={sedes.map(s => ({ label: s.nombre_sede, value: s }))}
        onChange={e => setSelectedSede(e.value)}
        placeholder="Selecciona una sede"
        loading={loading}
        style={{ width: '100%' }}
      />
    </Dialog>
  )
}

export default SedeSelectorModal
