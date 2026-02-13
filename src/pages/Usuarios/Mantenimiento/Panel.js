import React from 'react'
import CategoriaUsuarioService from 'services/CategoriaUsuario'
import CategoriaTable from '../CategoriaMantenimiento/Table'
import RolTable from '../RolMantenimiento/Table'
import CategoriaForm from '../CategoriaMantenimiento/TypeServiceForm'
import rolOptions from '../RolMantenimiento/service'
import '../CategoriaMantenimiento/style.scss'
import '../RolMantenimiento/style.scss'

const options = [
  {
    title: 'Categoría',
    request: CategoriaUsuarioService.get,
    schema: [
      { field: 'id', label: 'ID' },
      { field: 'description', label: 'Categoría' },
      { field: 'user_created', label: 'Creador' },
      { field: 'date_created', label: 'Fecha de creación' }
    ],
    FormComponent: CategoriaForm,
    service: {
      id: 'categorias_usuario',
      post: CategoriaUsuarioService.post,
      put: CategoriaUsuarioService.put,
      delete: CategoriaUsuarioService.delete
    }
  },
  rolOptions[0]
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
        {selectedOption === 0 ? <CategoriaTable option={options[0]} /> : <RolTable option={options[1]} />}
      </section>
    </div>
  )
}
