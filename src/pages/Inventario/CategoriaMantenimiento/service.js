/* eslint-disable global-require, import/no-duplicates */
import { CategoriaService } from 'services'

const options = [
  {
    title: 'Categoría',
   request: CategoriaService.get,
    schema: [
    { field: 'id', label: 'ID' },
    { field: 'description', label: 'Categoría' },
    { field: 'user_created', label: 'Creador' },
    { field: 'date_created', label: 'Fecha de creación' }
    ],
    FormComponent: require('./TypeServiceForm').default,
    service: {
    id: 'categorias',
    post: CategoriaService.post,
    put: CategoriaService.put,
    delete: CategoriaService.delete
    }
  }
]

export default options
