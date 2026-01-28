import options from './service'
import Table from '../../Inventario/CategoriaMantenimiento/Table'
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

export default function CategoriaClienteMantenimiento() {
  const [showMaintenance, setShowMaintenance] = useState(true)
  const [selectedOption, setSelectedOption] = useState(0)
  return (
    <div className="device-maintenance">
      <hr style={{ border: 'none', borderBottom: '1.5px solid #ecebeb', margin: '16px 0' }} />
      <section>
        <div className="options">
          {options.map((option, index) => (
            <button
              name={option.title}
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
