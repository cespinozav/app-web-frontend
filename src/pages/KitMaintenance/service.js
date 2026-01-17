import { KitService } from 'services'
import { formatDate } from 'utils/dates'
import {
  PlansForm,
  OperatorForm,
  BrandsForm,
  ModelsForm,
  SeatForm,
  TypeServiceForm,
  ContractForm,
  ClassificationForm,
  AdditionalForm
} from './Forms'

const service = {
  contract({ signal }) {
    return KitService.contract.get({ signal }).then(res =>
      res.map(c => ({
        ...c,
        period: `${formatDate(c.startDate)} -- ${formatDate(c.endDate)}`
      }))
    )
  },
  dummy() {
    return new Promise(resolve => {
      resolve([])
    })
  }
}

const schema = {
  operators: [
    { field: 'id', label: 'ID' },
    { field: 'description', label: 'Nombre' },
    { field: 'userCreated', label: 'Creador' }
  ],
  contract: [
    { field: 'id', label: 'ID' },
    { field: 'code', label: 'Cod. Contrato' },
    // { field: 'period', label: 'Vigencia' },
    { field: 'description', label: 'Descripción' },
    // { field: 'observation', label: 'Observación' },
    // { field: 'amount', label: 'Cantidad' },
    { field: 'operatorName', label: 'Operador' },
    // { field: 'simcard', label: 'Simcard' }
    { field: 'userCreated', label: 'Creador' }
  ],
  brands: [
    { field: 'id', label: 'ID' },
    { field: 'description', label: 'Marca' },
    { field: 'userCreated', label: 'Creador' }
  ],
  models: [
    { field: 'id', label: 'ID' },
    { field: 'brandName', label: 'Marca' },
    { field: 'description', label: 'Modelo' },
    { field: 'costWithCurrency', label: 'Costo' },
    { field: 'userCreated', label: 'Creador' }
  ],
  plans: [
    { field: 'id', label: 'ID' },
    { field: 'description', label: 'Descripción' },
    { field: 'typeServiceName', label: 'Tipo de Servicio' },
    { field: 'operatorName', label: 'Operador' },
    { field: 'costWithCurrency', label: 'Costo' }
  ],
  additionalService: [
    { field: 'id', label: 'ID' },
    { field: 'description', label: 'Descripción' },
    { field: 'operatorName', label: 'Operador' },
    { field: 'costWithCurrency', label: 'Costo' }
  ],
  seat: [
    { field: 'id', label: 'ID' },
    { field: 'description', label: 'Descripción' },
    { field: 'departament', label: 'Departamento' },
    { field: 'province', label: 'Provincia' },
    { field: 'district', label: 'Distrito' },
    { field: 'userCreated', label: 'Usuario' }
  ],
  classifications: [
    { field: 'id', label: 'ID' },
    { field: 'description', label: 'Descripción' },
    { field: 'userCreated', label: 'Usuario' }
  ],
  dummy: []
}

const options = [
  {
    title: 'Tipo',
    request: KitService.typeService.get,
    schema: schema.operators,
    FormComponent: TypeServiceForm,
    service: {
      id: KitService.typeService.id,
      post: KitService.typeService.post,
      put: KitService.typeService.put,
      delete: KitService.typeService.delete
    }
  },
  {
    title: 'Operador',
    request: KitService.operators.get,
    schema: schema.operators,
    service: {
      id: KitService.operators.id,
      post: KitService.operators.post,
      put: KitService.operators.put,
      delete: KitService.operators.delete
    },
    FormComponent: OperatorForm
  },
  {
    title: 'Nro. de contrato',
    request: service.contract,
    schema: schema.contract,
    service: {
      id: KitService.contract.id,
      post: KitService.contract.post,
      put: KitService.contract.put,
      delete: KitService.contract.delete
    },
    FormComponent: ContractForm
  },
  {
    title: 'Marca',
    request: KitService.brands.get,
    schema: schema.brands,
    service: {
      id: KitService.brands.id,
      post: KitService.brands.post,
      put: KitService.brands.put,
      delete: KitService.brands.delete
    },
    FormComponent: BrandsForm
  },
  {
    title: 'Modelo',
    request: KitService.models.get,
    schema: schema.models,
    service: {
      id: KitService.models.id,
      post: KitService.models.post,
      put: KitService.models.put,
      delete: KitService.models.delete
    },
    FormComponent: ModelsForm
  },
  {
    title: 'Sedes',
    request: KitService.seats.get,
    schema: schema.seat,
    service: {
      id: KitService.seats.id,
      post: KitService.seats.post,
      put: KitService.seats.put,
      delete: KitService.seats.delete
    },
    FormComponent: SeatForm
  },
  {
    title: 'Plan',
    request: KitService.plans.get,
    schema: schema.plans,
    service: {
      id: KitService.plans.id,
      post: KitService.plans.post,
      put: KitService.plans.put,
      delete: KitService.plans.delete
    },
    FormComponent: PlansForm
  },
  {
    title: 'Servicio Adicional',
    request: KitService.additionalService.get,
    schema: schema.additionalService,
    service: {
      id: KitService.additionalService.id,
      post: KitService.additionalService.post,
      put: KitService.additionalService.put,
      delete: KitService.additionalService.delete
    },
    FormComponent: AdditionalForm
  },
  {
    title: 'Clasificación',
    request: KitService.classifications.get,
    schema: schema.classifications,
    service: {
      id: KitService.classifications.id,
      post: KitService.classifications.post,
      put: KitService.classifications.put,
      delete: KitService.classifications.delete
    },
    FormComponent: ClassificationForm
  }
]

export default options
