import { CiudadClienteService } from 'services'

const options = [
  {
    title: 'Ciudad',
    request: CiudadClienteService.get,
    schema: [
      { field: 'id', label: 'ID' },
      { field: 'description', label: 'Ciudad' },
      { field: 'user_created', label: 'Creador' },
      { field: 'date_created', label: 'Fecha de creación' }
    ],
    FormComponent: require('./TypeServiceForm').default,
    service: {
      id: 'ciudades_cliente',
      post: CiudadClienteService.post,
      put: CiudadClienteService.put,
      delete: CiudadClienteService.delete
    }
  }
]

export default options
