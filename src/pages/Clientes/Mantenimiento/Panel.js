import React from 'react'
import { CategoriaClienteService, CiudadClienteService } from 'services'
import CategoriaTable from '../CategoriaMantenimiento/Table'
import CiudadTable from '../CiudadMantenimiento/Table'
import CategoriaForm from '../CategoriaMantenimiento/TypeServiceForm'
import CiudadForm from '../CiudadMantenimiento/TypeServiceForm'
import '../CategoriaMantenimiento/style.scss'

const options = [
  {
    title: 'Categoría',
    request: CategoriaClienteService.get,
    schema: [
      { field: 'id', label: 'ID' },
      { field: 'description', label: 'Categoría' },
      { field: 'user_created', label: 'Creador' },
      { field: 'date_created', label: 'Fecha de creación' }
    ],
    FormComponent: CategoriaForm,
    service: {
      id: 'categorias_cliente',
      post: CategoriaClienteService.post,
      put: CategoriaClienteService.put,
      delete: CategoriaClienteService.delete
    }
  },
  {
    title: 'Ciudad',
    request: CiudadClienteService.get,
    schema: [
      { field: 'id', label: 'ID' },
      { field: 'description', label: 'Ciudad' },
      { field: 'user_created', label: 'Creador' },
      { field: 'date_created', label: 'Fecha de creación' }
    ],
    FormComponent: CiudadForm,
    service: {
      id: 'ciudades_cliente',
      post: CiudadClienteService.post,
      put: CiudadClienteService.put,
      delete: CiudadClienteService.delete
    }
  }
]

export default function Panel() {
  const [selectedOption, setSelectedOption] = React.useState(0)
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
        {selectedOption === 0 ? <CategoriaTable option={options[0]} /> : <CiudadTable option={options[1]} />}
      </section>
    </div>
  )
}
