import options from './service'
import Table from './Table'
import { Dialog } from 'primereact/dialog'
import { useState } from 'react'
import './style.scss'

function ModalForm({ isVisible, onClose, children }) {
  const close = () => {
    onClose()
  }
  return (
    <Dialog className="dialog licenses-dialog maintenance" draggable={false} visible={isVisible} modal onHide={close}>
      {children}
    </Dialog>
  )
}

export default function CategoriaMantenimiento() {
  const [showMaintenance, setShowMaintenance] = useState(true)
  const [selectedOption, setSelectedOption] = useState(0)
  return (
    <div className="device-maintenance">
      <div className="header">
        <button onClick={() => setShowMaintenance(true)} className={showMaintenance ? 'active' : ''}>
          MANTENIMIENTO
        </button>
        <button onClick={() => setShowMaintenance(false)} className={showMaintenance ? '' : 'active'}>
          BITÁCORA DE MOVIMIENTO
        </button>
      </div>
      <section>
        <div className="options">
          {options.map((option, index) => (
            <button
              name={option.title}
              // isSelected prop eliminada para evitar warning de React
              onClick={() => setSelectedOption(index)}
              key={index}
              className={selectedOption === index ? 'active' : ''}
            >
              {option.title}
            </button>
          ))}
        </div>
        <Table option={options[selectedOption]} />
      </section>
    </div>
  )
}
