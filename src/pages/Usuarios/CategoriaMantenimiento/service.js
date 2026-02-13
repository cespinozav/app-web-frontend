import { CategoriaUsuarioService } from 'services'
import TypeServiceForm from './TypeServiceForm'

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
    FormComponent: TypeServiceForm,
    service: {
      id: 'categorias_usuario',
      post: CategoriaUsuarioService.post,
      put: CategoriaUsuarioService.put,
      delete: CategoriaUsuarioService.delete
    }
  }
]

export default options
