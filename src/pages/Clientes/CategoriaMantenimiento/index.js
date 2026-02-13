import { useState } from 'react'
import options from './service'
import Table from '../../Inventario/CategoriaMantenimiento/Table'
import './style.scss'

export default function CategoriaClienteMantenimiento() {
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
