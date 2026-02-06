import { UnitService } from 'services'

const options = [
  {
    title: 'Unidades',
    request: UnitService.get,
    schema: [
      { field: 'id', label: 'ID' },
      { field: 'description', label: 'Unidad' },
      { field: 'reference', label: 'Referencia' },
      { field: 'user_created', label: 'Creador' },
      { field: 'date_created', label: 'Fecha Creación' }
    ],
    FormComponent: require('./UnidadForm').default,
    // Sin ModalForm personalizado, usa el de Table
    service: {
      id: 'units',
      post: UnitService.post,
      put: UnitService.put,
      delete: UnitService.delete
    }
  }
]

export default options
