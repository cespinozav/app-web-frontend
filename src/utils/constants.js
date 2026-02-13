export const APP_VERSION = '0.2.19'

export const DATE_STR_FORMAT = 'DD/MM/YYYY'

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
}

export const MODES = {
  READ: 'READ',
  EDIT: 'EDIT',
  CREATE: 'CREATE'
}

export const DEFAULT_USER = {
  username: 'defaultUser',
  name: 'Usuario',
  job: 'Temporal',
  role: 'ADMIN'
}

export const ACCOUNT_TYPES = [
  { value: 'G', label: 'Responsable', classname: 'status--green' },
  { value: 'T', label: 'Titular', classname: 'status--green' }
]

export const CURRENCY = [
  { value: 'PEN', label: 's/.' }
  // { value: 'USD', label: '$' }
]

export const KIT_STATUS = {
  IN_USE: { value: 'U', label: 'En Uso', classname: 'status--green' },
  TO_ASSIGN: { value: 'A', label: 'Por asignar', classname: 'status--yellow' },
  BACKUP: { value: 'B', label: 'Backup', classname: 'status--blue' },
  REVISION: { value: 'R', label: 'Revision', classname: 'status--black' },
  CANCELED: { value: 'C', label: 'Anulado', classname: 'status--red' }
}

export const KIT_STATUSES = [
  { value: 'U', label: 'En Uso', classname: 'status--green' },
  { value: 'A', label: 'Por asignar', classname: 'status--yellow' },
  { value: 'B', label: 'Backup', classname: 'status--blue' },
  { value: 'R', label: 'Revision', classname: 'status--black' },
  { value: 'C', label: 'Anulado', classname: 'status--red' }
]

export const KIT_STATUS2 = [
  { value: 'U', label: 'En Uso', classname: 'status--green' },
  { value: 'B', label: 'Por asignar', classname: 'status--black' }
]

export const CONTRACT_STATUS = [
  { value: 'V', label: 'Vigente', classname: 'status--green' },
  { value: 'AF', label: 'Por vencer', classname: 'status--yellow' },
  { value: 'F', label: 'Terminado', classname: 'status--red' }
]

export const KIT_TYPES = [
  { value: 'T', label: 'T' },
  { value: 'G', label: 'G' }
]

export const PLAN_VALUES = [
  { value: 45, label: 'LDI' },
  { value: 10, label: 'SOTI' },
  { value: 35, label: 'PLUS' }
]

export const LINE_STATUS = {
  ACTIVE: { value: 'A', label: 'Activo', classname: 'status--green' },
  SUSPENDED: { value: 'S', label: 'Suspendido', classname: 'status--yellow' },
  BLOCKED: { value: 'B', label: 'Bloqueado', classname: 'status--blue' },
  CANCELED: { value: 'C', label: 'Anulado', classname: 'status--red' }
}

export const LINE_STATUSES = Object.values(LINE_STATUS)

const ASSET_OPTION = {
  operatingSystem: true,
  ip: true,
  mac: true,
  domain: true,
  processor: true,
  memory: true,
  disk: true,
  inches: true
}

export const ASSETS = {
  STATUS: [
    { value: 'OP', label: 'Operativo', classname: 'status--green' },
    { value: 'IP', label: 'Inoperativo', classname: 'status--red' },
    { value: 'L', label: 'Extraviado', classname: 'status--yellow' },
    { value: 'D', label: 'Baja', classname: 'status--black' }
  ],
  SITUATION: [
    { value: 'R', label: 'Rentado', classname: 'status--green' },
    { value: 'L', label: 'Prestado', classname: 'status--blue' },
    { value: 'NL', label: 'No prestado', classname: 'status--black' }
  ],
  PERMISSION: [
    { value: true, label: 'Si' },
    { value: false, label: 'No' }
  ],
  TYPES: [
    { value: 'server', label: 'Servidor', options: ASSET_OPTION },
    { value: 'member_server', label: 'Member Server', options: ASSET_OPTION },
    { value: 'member_workstation', label: 'Member Workstation', options: ASSET_OPTION },
    { value: 'network_appliance', label: 'Network Appliance', options: { ...ASSET_OPTION, domain: false } },
    { value: 'standalone_workstation', label: 'Standalone Workstation', options: ASSET_OPTION }
  ],
  OPTIONS: {
    operatingSystem: {
      label: 'Sistema Operativo',
      select: true,
      rules: { required: 'Sistema operativo no ingresado' }
    },
    ip: {
      label: 'Activo',
      select: false
      // rules: {
      //   pattern: { value: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, message: 'IP no válida' }
      // }
    },
    mac: {
      label: 'MAC',
      select: false,
      rules: {
        maxLength: { value: 20, message: 'MAC debe tener 20 caracteres como máximo' }
      }
    },
    domain: {
      label: 'Dominio',
      select: true,
      rules: {
        required: 'Dominio no ingresado'
      }
    },
    processor: {
      label: 'Procesador',
      select: true,
      rules: {
        required: 'Procesador no ingresado'
      }
    },
    memory: {
      label: 'Memoria',
      select: true,
      rules: {
        required: 'Memoria no ingresada'
      }
    },
    disk: {
      label: 'Und. Disco',
      select: true,
      rules: {
        required: 'Und. de Disco no ingresado'
      }
    },
    inches: {
      label: 'Pulgadas',
      select: true,
      rules: {
        required: 'Pulgadas no ingresadas'
      }
    }
  }
}

export const USER_STATUS = [
  { value: 'A', label: 'Activo', classname: 'status--green' },
  { value: 'C', label: 'Cesado', classname: 'status--red' }
]

export const CHIP_TYPES = [
  { value: 'mobile', label: 'Chip móvil' },
  { value: 'mobile_contract', label: 'Chip móvil + contrato' },
  { value: 'gps', label: 'Chip seg. ruta' },
  { value: 'internet', label: 'Chip internet' },
  { value: 'internet_modem', label: 'Chip internet + modem' }
]

export const LICENSE_BINNACLE = {
  CLASSIFICATIONS: [
    { value: 1, label: 'Nuevo ingreso' },
    { value: 2, label: 'Modificación de licencia' },
    { value: 3, label: 'Retirar licencia' }
  ],
  METHODS: [
    { value: 'email', label: 'Correo' },
    { value: 'ticket', label: 'Ticket' },
    { value: 'others', label: 'Otros' }
  ]
}

export const LICENSE_LOAD_MODE = [
  { value: 1, label: 'Total' },
  { value: 0, label: 'Parcial' }
]

export const MASSIVE_LOAD_RESPONSES = [
  {
    value: 'Licenses do not exist',
    label: 'La licencia no existe'
  },
  {
    value: 'Person does not exist',
    label: 'La persona no existe'
  },
  {
    value: 'assignment already exists',
    label: 'La asignación ya existe'
  },
  {
    value: 'successful creation',
    label: 'Creación exitosa'
  },
  {
    value: 'successful update',
    label: 'Actualización exitosa'
  },
  {
    value: 'Fail Operation',
    label: 'Falla en operación'
  }
]

export const BINNACLE = {
  CLASSIFICATIONS: [
    { value: 'renewal', label: 'Renovación' },
    { value: 'plan_change', label: 'Cambio de plan' },
    { value: 'temp_suspension', label: 'Suspensión temporal' },
    { value: 'new_request', label: 'Solicitud nueva' },
    { value: 'reassignment', label: 'Reasignación' },
    { value: 'down', label: 'Baja de línea' },
    { value: 'replacement', label: 'Reposición' },
    { value: 'repair', label: 'Servicio técnico' },
    { value: 'assign_ldi', label: 'Asigna LDI' },
    { value: 'reture_ldi', label: 'Retira LDI' },
    { value: 'assign_mdm', label: 'Asigna MDM' },
    { value: 'ceco_change', label: 'Cambio de CeCo' },
    { value: 'new_sim', label: 'Nuevo Simcard' },
    { value: 'kit_loan', label: 'Préstamo de equipo' },
    { value: 'theft_lock', label: 'Bloqueo por robo' },
    { value: 'loss_lock', label: 'Bloqueo por perdida' },
    { value: 'data_assign', label: 'Asignación Datos' },
    { value: 'number_change', label: 'Cambio de número' },
    { value: 'receipt_change', label: 'Cambio de recibo' }
  ],
  METHODS: [
    { value: 'email', label: 'Correo' },
    { value: 'ticket', label: 'Ticket' },
    { value: 'inventory', label: 'Inventario' },
    { value: 'others', label: 'Otros' }
  ]
}

export const KIT_DETAILS = {
  OPERATOR: [
    { value: 'Claro', label: 'Claro' },
    { value: 'Movistar', label: 'Movistar' },
    { value: 'Entel', label: 'Entel' }
  ],
  TYPE: CHIP_TYPES,
  BRANDS: [
    { value: 'apple', label: 'Apple' },
    { value: 'samsung', label: 'Samsung' },
    { value: 'huawei', label: 'Huawei' }
  ]
}

export const CHIP_STATUS = [
  { value: 'active', label: 'Activo' },
  { value: 'suspended', label: 'Suspendido' },
  { value: 'down', label: 'Dado de baja' },
  { value: 'pending', label: 'Pendiente por asignación' },
  { value: 'temporal', label: 'Temporal' }
]

export const LICENSES = [
  { value: 'adobe', label: 'Adobe' },
  { value: 'office', label: 'Office 365' }
]

export const EMAIL_TYPES = [
  { value: 'T', label: 'Personal', classname: 'status--green' },
  { value: 'G', label: 'Genérica', classname: 'status--blue' }
]

export const FILE_FORMATS = {
  PDF: ['.pdf'],
  IMAGE: ['.jpg', '.jpeg', '.png'],
  ZIP: ['.zip', '.rar'],
  EXCEL: [
    '.csv',
    { accept: 'application/vnd.ms-excel', extension: '.xls' },
    {
      accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      extension: '.xlsx'
    }
  ]
}

export const MAX_MB_SIZE = 2
export const MAX_FILES = 3
