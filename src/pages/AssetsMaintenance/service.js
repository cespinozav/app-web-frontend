import { AssetService } from 'services'
import { formatDateMin } from 'utils/dates'
import { ClassificationForm, GenericSpecForm, LeasingForm, TypesForm, SeatForm, BrandForm, ModelForm } from './Forms'

function leasingRequest({ signal }) {
  return AssetService.leasing.get({ signal }).then(res =>
    res.map(r => {
      const { startDate, endDate } = r
      let period = 'Indefinido'
      if (startDate) {
        period = `${formatDateMin(startDate)} -- ${endDate ? formatDateMin(endDate) : 'Indefinido'}`
      }
      return {
        ...r,
        period
      }
    })
  )
}

const schema = {
  type: [
    { field: 'id', label: 'ID' },
    { field: 'description', label: 'Descripción' },
    { field: 'userCreated', label: 'Usuario' }
  ],
  brand: [
    { field: 'id', label: 'ID' },
    { field: 'description', label: 'Descripción' }
  ],
  model: [
    { field: 'id', label: 'ID' },
    { field: 'brandName', label: 'Marca' },
    { field: 'description', label: 'Descripción' },
    { field: 'costWithCurrency', label: 'Costo' }
  ],
  leasing: [
    { field: 'id', label: 'ID' },
    { field: 'description', label: 'Descripción' },
    { field: 'period', label: 'Vigencia' }
  ],
  seat: [
    { field: 'id', label: 'ID' },
    { field: 'description', label: 'Descripción' },
    { field: 'departament', label: 'Departamento' },
    { field: 'province', label: 'Provincia' },
    { field: 'district', label: 'Distrito' },
    { field: 'userCreated', label: 'Usuario' }
  ],
  spec: [
    { field: 'id', label: 'ID' },
    { field: 'description', label: 'Descripción' },
    { field: 'typeDescription', label: 'Tipo' }
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
    request: AssetService.typeAsset.get,
    schema: schema.type,
    FormComponent: TypesForm,
    service: {
      id: AssetService.typeAsset.id,
      post: AssetService.typeAsset.post,
      put: AssetService.typeAsset.put,
      delete: AssetService.typeAsset.delete
    }
  },
  {
    title: 'Marca',
    request: AssetService.brand.get,
    schema: schema.brand,
    FormComponent: BrandForm,
    service: {
      id: AssetService.brand.id,
      post: AssetService.brand.post,
      put: AssetService.brand.put,
      delete: AssetService.brand.delete
    }
  },
  {
    title: 'Modelo',
    request: AssetService.model.get,
    schema: schema.model,
    FormComponent: ModelForm,
    service: {
      id: AssetService.model.id,
      post: AssetService.model.post,
      put: AssetService.model.put,
      delete: AssetService.model.delete
    }
  },
  {
    title: 'Leasing ID',
    request: leasingRequest,
    schema: schema.leasing,
    FormComponent: LeasingForm,
    service: {
      id: AssetService.leasing.id,
      post: AssetService.leasing.post,
      put: AssetService.leasing.put,
      delete: AssetService.leasing.delete
    }
  },
  {
    title: 'Sedes',
    request: AssetService.seats.get,
    schema: schema.seat,
    FormComponent: SeatForm,
    service: {
      id: AssetService.seats.id,
      post: AssetService.seats.post,
      put: AssetService.seats.put,
      delete: AssetService.seats.delete
    }
  },
  {
    title: 'Sistema operativo',
    request: AssetService.operatingSystem.get,
    schema: schema.spec,
    FormComponent: GenericSpecForm('sistema operativo'),
    service: {
      id: AssetService.operatingSystem.id,
      post: AssetService.operatingSystem.post,
      put: AssetService.operatingSystem.put,
      delete: AssetService.operatingSystem.delete
    }
  },
  {
    title: 'Dominio',
    request: AssetService.domain.get,
    schema: schema.spec,
    FormComponent: GenericSpecForm('dominio'),
    service: {
      id: AssetService.domain.id,
      post: AssetService.domain.post,
      put: AssetService.domain.put,
      delete: AssetService.domain.delete
    }
  },
  {
    title: 'Procesador',
    request: AssetService.processor.get,
    schema: schema.spec,
    FormComponent: GenericSpecForm('procesador'),
    service: {
      id: AssetService.processor.id,
      post: AssetService.processor.post,
      put: AssetService.processor.put,
      delete: AssetService.processor.delete
    }
  },
  {
    title: 'Memoria',
    request: AssetService.memory.get,
    schema: schema.spec,
    FormComponent: GenericSpecForm('memoria'),
    service: {
      id: AssetService.memory.id,
      post: AssetService.memory.post,
      put: AssetService.memory.put,
      delete: AssetService.memory.delete
    }
  },
  {
    title: 'Disco duro',
    request: AssetService.disk.get,
    schema: schema.spec,
    FormComponent: GenericSpecForm('disco duro'),
    service: {
      id: AssetService.disk.id,
      post: AssetService.disk.post,
      put: AssetService.disk.put,
      delete: AssetService.disk.delete
    }
  },
  {
    title: 'Pulgadas',
    request: AssetService.inches.get,
    schema: schema.spec,
    FormComponent: GenericSpecForm('pulgadas'),
    service: {
      id: AssetService.inches.id,
      post: AssetService.inches.post,
      put: AssetService.inches.put,
      delete: AssetService.inches.delete
    }
  },
  {
    title: 'Clasificación',
    request: AssetService.classifications.get,
    schema: schema.classifications,
    FormComponent: ClassificationForm,
    service: {
      id: AssetService.classifications.id,
      post: AssetService.classifications.post,
      put: AssetService.classifications.put,
      delete: AssetService.classifications.delete
    }
  }
]

export default options
