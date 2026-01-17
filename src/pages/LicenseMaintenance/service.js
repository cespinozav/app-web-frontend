import { LicenseService } from 'services'
import { formatDateMin, getMonthsTillNow } from 'utils/dates'
import { ClassificationForm, LicenseTypeForm, LicensesForm } from './Forms'

function getLicenseStatus(startDate, endDate) {
  if (new Date() > new Date(startDate)) {
    const monthDiff = getMonthsTillNow(endDate)
    if (monthDiff > 3) {
      return 'VIGENTE'
    }
    if (monthDiff > 0) {
      return 'POR VENCER'
    }
    return 'VENCIDA'
  }
  return 'SIN VIGENCIA'
}

function licenseRequest({ signal }) {
  return LicenseService.licenses.get({ signal }).then(res =>
    res.map(r => ({
      ...r,
      period: `${formatDateMin(r.startDate)} -- ${formatDateMin(r.endDate)}`,
      state: getLicenseStatus(r.startDate, r.endDate)
    }))
  )
}

const schema = {
  licenses: [
    { field: 'id', label: 'ID' },
    { field: 'description', label: 'Descripción' },
    { field: 'period', label: 'Vigencia' },
    { field: 'state', label: 'Estado' }
  ],
  type: [
    { field: 'id', label: 'ID' },
    { field: 'description', label: 'Descripción' },
    { field: 'licenseName', label: 'Licencia' },
    { field: 'currencyName', label: 'Moneda' },
    { field: 'amount', label: 'Costo' },
    { field: 'quantity', label: 'Cantidad' }
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
    title: 'Licencia',
    request: licenseRequest,
    schema: schema.licenses,
    FormComponent: LicensesForm,
    service: {
      id: LicenseService.licenses.id,
      post: LicenseService.licenses.post,
      put: LicenseService.licenses.put,
      delete: LicenseService.licenses.delete
    }
  },
  {
    title: 'Tipo',
    request: LicenseService.typeLicense.get,
    schema: schema.type,
    FormComponent: LicenseTypeForm,
    service: {
      id: LicenseService.typeLicense.id,
      post: LicenseService.typeLicense.post,
      put: LicenseService.typeLicense.put,
      delete: LicenseService.typeLicense.delete
    }
  },
  {
    title: 'Clasificación',
    request: LicenseService.classifications.get,
    schema: schema.classifications,
    service: {
      id: LicenseService.classifications.id,
      post: LicenseService.classifications.post,
      put: LicenseService.classifications.put,
      delete: LicenseService.classifications.delete
    },
    FormComponent: ClassificationForm
  }
]

export default options
