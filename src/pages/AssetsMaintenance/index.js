import { Dropdown } from 'primereact/dropdown'
import { useState } from 'react'
import options from './service'
import Table from './Table'

const optionIndexes = options.map(({ title }, index) => ({ title, index }))

function AssetOption({ name, isSelected, select }) {
  return (
    <button className={isSelected ? 'active' : ''} onClick={select}>
      {name}
    </button>
  )
}

export default function AssetMaintenance() {
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
            <AssetOption
              name={option.title}
              isSelected={selectedOption === index}
              select={() => {
                setSelectedOption(index)
              }}
              key={index}
            />
          ))}
          <Dropdown
            inputId="maintenance-option"
            width="100%"
            value={optionIndexes[selectedOption]}
            optionLabel="title"
            options={optionIndexes}
            onChange={e => {
              setSelectedOption(e.target.value.index)
            }}
          />
        </div>
        <Table option={options[selectedOption]} />
      </section>
    </div>
  )
}
