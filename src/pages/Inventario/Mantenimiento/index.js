import { useState } from 'react'
import CategoriaMantenimiento from '../CategoriaMantenimiento'
import UnidadMantenimiento from '../UnidadMantenimiento'

const options = [
  { title: 'Categoría', Component: CategoriaMantenimiento },
  { title: 'Unidades', Component: UnidadMantenimiento }
]

export default function MantenimientoInventario() {
  const [selected, setSelected] = useState(0)
  const SelectedComponent = options[selected].Component
  return (
    <div className="device-maintenance">
      <hr style={{ border: 'none', borderBottom: '1.5px solid #ecebeb', margin: '16px 0' }} />
      <section>
        <div className="options">
          {options.map((opt, idx) => (
            <button key={opt.title} className={selected === idx ? 'active' : ''} onClick={() => setSelected(idx)}>
              {opt.title}
            </button>
          ))}
        </div>
        <SelectedComponent />
      </section>
    </div>
  )
}
