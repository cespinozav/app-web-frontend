import { useState } from 'react'
import options from './service'
import Table from './Table'
import './style.scss'

export default function RolMantenimiento() {
  const [selectedOption, setSelectedOption] = useState(0)
  return (
    <div className="device-maintenance">
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
