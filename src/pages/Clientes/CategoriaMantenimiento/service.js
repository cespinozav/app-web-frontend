import { CategoriaClienteService } from 'services'

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
    FormComponent: require('./TypeServiceForm').default,
    service: {
      id: 'categorias_cliente',
      post: CategoriaClienteService.post,
      put: CategoriaClienteService.put,
      delete: CategoriaClienteService.delete
    }
  }
]

export default options
