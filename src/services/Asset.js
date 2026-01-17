import { HTTP_METHODS, networkRequest, newtworkMultipartRequest } from 'utils/network'
import { ACCOUNT_TYPES, ASSETS, USER_STATUS } from 'utils/constants'
import { capitalize, generateDownloadFile, getFilenameFromUrl } from 'utils/misc'
import { validateReportError } from 'utils/exceptions'
import { addDays, formatSearchDate, parseStrToDate } from 'utils/dates'
import { formatNumber } from 'utils/numbers'

function formatAssignmentInfo(res) {
  const { person } = res
  const cessationDate = res.person?.cessation_date
  const isUserActive = cessationDate ? new Date(cessationDate) - new Date() >= 0 : true
  if (!res.authorization) {
    return null
  }
  const author = res.authorization
  const authorName = `${capitalize(author.lastname_p)} ${capitalize(author.lastname_m)}, ${capitalize(author.names)}`
  return {
    category: person.category,
    areaCode: person.area_id,
    areaNum: person.area_num,
    cecoCode: person.cent_cost_id,
    jobCode: person.job_id,
    dni: person.dni,
    personId: person.id,
    lastnameP: person.lastname_p,
    lastnameM: person.lastname_m,
    names: person.names,
    unitNum: person.unit_num,
    cecoDesc: person.cent_cost_num,
    job: person.job_num,
    assignType: ACCOUNT_TYPES.find(e => e.value.toLowerCase() === res.type?.toLowerCase()) || {
      value: '',
      label: ''
    },
    assignTo: res.assign_to,
    email: res.email,
    assetCode: res.code_equipment,
    assetType: { value: res.type_active.id, label: res.type_active.description },
    brand: { value: res.brand.id, label: res.brand.name },
    model: { value: res.model.id, label: res.model.name },
    leasing: { value: res.leasing.id, label: res.leasing.description },
    status: ASSETS.STATUS.find(s => s.label.toLowerCase() === res.state.toLowerCase()) || {
      label: res.state
    },
    situation: ASSETS.SITUATION.find(s => s.label.toLowerCase() === res.situation.toLowerCase()) || {
      label: res.situation
    },
    seat: { ...res.sede, value: res.sede.id },
    exitPermit: res.exit_permit,
    serialNum: res.serial_number,
    description: res.description,
    observation: res.observation,
    operatingSystem: res.operating_system
      ? { value: res.operating_system.id, label: res.operating_system.description }
      : null,
    ip: res.ip_address,
    mac: res.mac_address,
    domain: res.domain ? { value: res.domain.id, label: res.domain.description } : null,
    processor: res.processor ? { value: res.processor.id, label: res.processor.description } : null,
    memory: res.memory ? { value: res.memory.id, label: res.memory.description } : null,
    diskDrive: res.disk_drive ? { value: res.disk_drive.id, label: res.disk_drive.description } : null,
    inches: res.inches ? { value: res.inches.id, label: res.inches.description } : null,
    userState: USER_STATUS[isUserActive ? 0 : 1],
    id: res.id,
    officeId: person.office_id,
    company: person.company,
    endDate: parseStrToDate(res.date_end),
    startDate: parseStrToDate(res.date_start),
    method: res.medium,
    authorName,
    authorId: author.id,
    authorDni: author.dni,
    reference: res.ticket,
    comments: res.comments,
    classificationId: res.classification_active.id,
    classificationName: res.classification_active.name,
    documents: [res.first_document, res.second_document, res.third_document]
      .filter(d => d)
      .map(d => ({ name: d.split('/').at(-1), filepath: d, size: d?.size ?? 0 })),
    created: parseStrToDate(res.created),
    user: res.user_created
  }
}

function formatAssignmentInput({
  id,
  assignType,
  personId,
  assetCode,
  status,
  type,
  brand,
  observation,
  startDate,
  model,
  endDate,
  leasingId,
  assignTo,
  email,
  situation,
  adminUser,
  exitPermit,
  serialNum,
  description,
  operatingSystem,
  seat,
  ip,
  domain,
  mac,
  processor,
  memory,
  disk,
  inches,
  classification,
  authorizer,
  method,
  reference,
  comment,
  documents
}) {
  const getDocumentByIndex = index => (documents?.length > index - 1 ? documents[index - 1]?.filepath : null)
  return {
    id,
    type: assignType,
    person_id: personId,
    code_equipment: assetCode,
    assign_to: assignTo,
    email,
    type_active_id: type,
    brand_id: brand,
    model_id: model,
    leasing_id: leasingId,
    state: status,
    situation,
    sede_id: seat,
    exit_permit: exitPermit,
    serial_number: serialNum,
    description,
    observation,
    operating_system_id: operatingSystem,
    ip_address: ip,
    mac_address: mac,
    domain_id: domain,
    processor_id: processor,
    memory_id: memory,
    disk_drive_id: disk,
    inches_id: inches,
    date_start: startDate ? new Date(startDate).toISOString() : null,
    date_end: endDate ? new Date(endDate).toISOString() : null,
    classification_active_id: classification,
    authorization_id: authorizer,
    medium: method,
    ticket: reference,
    comments: comment,
    first_document: getDocumentByIndex(1),
    second_document: getDocumentByIndex(2),
    third_document: getDocumentByIndex(3),
    user_created: adminUser
  }
}

const AssetService = {
  filters: {
    name(name) {
      return networkRequest('/active-fields', { params: { name } })
        .then(r => r.json())
        .then(r =>
          r.result.results.map(e => {
            const { person } = e
            const names = `${capitalize(person.names)}, ${capitalize(person.lastname_p)} ${capitalize(
              person.lastname_m
            )}`
            return {
              name: names,
              dni: person.dni,
              personId: person.id
            }
          })
        )
    },
    dni(dni) {
      return networkRequest('/active-fields', { params: { dni } })
        .then(r => r.json())
        .then(r =>
          r.result.results.map(e => {
            const { person } = e
            const names = `${capitalize(person.names)}, ${capitalize(person.lastname_p)} ${capitalize(
              person.lastname_m
            )}`
            return {
              name: names,
              dni: person.dni,
              personId: person.id
            }
          })
        )
    },
    leasing(leasingId) {
      return networkRequest('/active-fields', { params: { leasing: leasingId } })
        .then(r => r.json())
        .then(r => r.result.results.map(e => ({ label: e.description, value: e.id })))
    },
    ceco(ceco) {
      return networkRequest('/active-fields', { params: { ceco } })
        .then(r => r.json())
        .then(r => r.result.results.map(e => e.person.cent_cost_id))
    },
    cecoDescription(cecoDesc) {
      return networkRequest('/active-fields', { params: { desc_ceco: cecoDesc } })
        .then(r => r.json())
        .then(r => r.result.results.map(e => e.person.cent_cost_num))
    },
    serialNum(num) {
      return networkRequest('/active-fields', { params: { nro_serie: num } })
        .then(r => r.json())
        .then(r => r.result.results.map(e => e.serial_number))
    },
    type(num) {
      return networkRequest('/active-fields', { params: { type_active: num } })
        .then(r => r.json())
        .then(r => r.result.results.map(e => e.type_active))
    }
  },
  assignments: {
    id: 'assigns-terminal',
    get({
      signal,
      personId,
      leasingId,
      accountType,
      fromDate,
      toDate,
      ceco,
      cecoDesc,
      serialNum,
      assetType,
      page,
      excel
    }) {
      const params = {
        id_person: personId,
        id_leasing: leasingId,
        id_type_active: assetType,
        from_date: fromDate && toDate ? fromDate : '',
        to_date: fromDate && toDate ? formatSearchDate(addDays(toDate, 1)) : '',
        ceco,
        serial_number: serialNum,
        desc_ceco: cecoDesc,
        holder: accountType,
        page: page ? page + 1 : 1,
        excel
      }
      if (excel) {
        return networkRequest('/filters-active', { params })
          .then(res => {
            validateReportError(res)
            return res.blob()
          })
          .then(blobData => {
            generateDownloadFile(blobData, 'reporte-asignacion-activos')
          })
      }
      return networkRequest('/filters-active', { signal, params })
        .then(resp => resp.json())
        .then(resp => {
          const rowCount = resp?.result?.count
          const results = resp?.result?.results || []
          const data = results.map(res => formatAssignmentInfo(res)).filter(r => r !== null)
          return { data, rowCount }
        })
    },
    post(formInput) {
      const body = formatAssignmentInput(formInput)
      return networkRequest('/assigns-terminal', {
        body,
        method: HTTP_METHODS.POST
      })
    },
    put(formInput) {
      const body = formatAssignmentInput(formInput)
      return networkRequest(`/assigns-terminal/${body.id}`, {
        body,
        method: HTTP_METHODS.PUT
      })
    },
    delete({ id }) {
      return networkRequest(`/assigns-terminal/${id}`, { method: HTTP_METHODS.DELETE })
    }
  },
  leasing: {
    id: 'leasing',
    get({ signal, page }) {
      return networkRequest('/leasing', { signal, params: { page } })
        .then(resp => resp.json())
        .then(res => {
          const data = res.result?.results?.map(r => ({
            id: r.id,
            startDate: parseStrToDate(r.date_start),
            endDate: parseStrToDate(r.date_end),
            description: r.description,
            userCreated: r.user_created
          }))
          return data || []
        })
    },
    post({ description, userCreated, startDate, endDate }) {
      return networkRequest('/leasing', {
        body: {
          description,
          date_start: startDate || null,
          date_end: endDate || null,
          user_created: userCreated
        },
        method: HTTP_METHODS.POST
      })
    },
    put({ id, description, startDate, endDate, userCreated }) {
      return networkRequest(`/leasing/${id}`, {
        body: {
          description,
          date_start: startDate || null,
          date_end: endDate || null,
          user_created: userCreated
        },
        method: HTTP_METHODS.PUT
      })
    },
    delete({ id }) {
      return networkRequest(`/leasing/${id}`, {
        method: HTTP_METHODS.DELETE
      })
    }
  },
  operatingSystem: {
    id: 'operating-system',
    get({ signal, page }) {
      return networkRequest('/operating-system', { signal, params: { page } })
        .then(resp => resp.json())
        .then(res => {
          const data = res.result?.results?.map(r => {
            const type = r.type_active
            return {
              id: r.id,
              typeId: type.id,
              typeDescription: type.description,
              description: r.description,
              userCreated: r.user_created
            }
          })
          return data || []
        })
    },
    post({ description, userCreated, type }) {
      return networkRequest('/operating-system', {
        body: {
          type_active_id: type,
          description,
          user_created: userCreated
        },
        method: HTTP_METHODS.POST
      })
    },
    put({ id, type, description, userCreated }) {
      return networkRequest(`/operating-system/${id}`, {
        body: {
          type_active_id: type,
          description,
          user_created: userCreated
        },
        method: HTTP_METHODS.PUT
      })
    },
    delete({ id }) {
      return networkRequest(`/operating-system/${id}`, {
        method: HTTP_METHODS.DELETE
      })
    }
  },
  domain: {
    id: 'domain',
    get({ signal, page }) {
      return networkRequest('/domain', { signal, params: { page } })
        .then(resp => resp.json())
        .then(res => {
          const data = res.result?.results?.map(r => {
            const type = r.type_active
            return {
              id: r.id,
              typeId: type.id,
              typeDescription: type.description,
              description: r.description,
              userCreated: r.user_created
            }
          })
          return data || []
        })
    },
    post({ description, userCreated, type }) {
      return networkRequest('/domain', {
        body: {
          type_active_id: type,
          description,
          user_created: userCreated
        },
        method: HTTP_METHODS.POST
      })
    },
    put({ id, type, description, userCreated }) {
      return networkRequest(`/domain/${id}`, {
        body: {
          type_active_id: type,
          description,
          user_created: userCreated
        },
        method: HTTP_METHODS.PUT
      })
    },
    delete({ id }) {
      return networkRequest(`/domain/${id}`, {
        method: HTTP_METHODS.DELETE
      })
    }
  },
  processor: {
    id: 'processor',
    get({ signal, page }) {
      return networkRequest('/processor', { signal, params: { page } })
        .then(resp => resp.json())
        .then(res => {
          const data = res.result?.results?.map(r => {
            const type = r.type_active
            return {
              id: r.id,
              typeId: type.id,
              typeDescription: type.description,
              description: r.description,
              userCreated: r.user_created
            }
          })
          return data || []
        })
    },
    post({ description, userCreated, type }) {
      return networkRequest('/processor', {
        body: {
          type_active_id: type,
          description,
          user_created: userCreated
        },
        method: HTTP_METHODS.POST
      })
    },
    put({ id, type, description, userCreated }) {
      return networkRequest(`/processor/${id}`, {
        body: {
          type_active_id: type,
          description,
          user_created: userCreated
        },
        method: HTTP_METHODS.PUT
      })
    },
    delete({ id }) {
      return networkRequest(`/processor/${id}`, {
        method: HTTP_METHODS.DELETE
      })
    }
  },
  memory: {
    id: 'memory',
    get({ signal, page }) {
      return networkRequest('/memory', { signal, params: { page } })
        .then(resp => resp.json())
        .then(res => {
          const data = res.result?.results?.map(r => {
            const type = r.type_active
            return {
              id: r.id,
              typeId: type.id,
              typeDescription: type.description,
              description: r.description,
              userCreated: r.user_created
            }
          })
          return data || []
        })
    },
    post({ description, userCreated, type }) {
      return networkRequest('/memory', {
        body: {
          type_active_id: type,
          description,
          user_created: userCreated
        },
        method: HTTP_METHODS.POST
      })
    },
    put({ id, type, description, userCreated }) {
      return networkRequest(`/memory/${id}`, {
        body: {
          type_active_id: type,
          description,
          user_created: userCreated
        },
        method: HTTP_METHODS.PUT
      })
    },
    delete({ id }) {
      return networkRequest(`/memory/${id}`, {
        method: HTTP_METHODS.DELETE
      })
    }
  },
  disk: {
    id: 'disk',
    get({ signal, page }) {
      return networkRequest('/disk-drive', { signal, params: { page } })
        .then(resp => resp.json())
        .then(res => {
          const data = res.result?.results?.map(r => {
            const type = r.type_active
            return {
              id: r.id,
              typeId: type.id,
              typeDescription: type.description,
              description: r.description,
              userCreated: r.user_created
            }
          })
          return data || []
        })
    },
    post({ description, userCreated, type }) {
      return networkRequest('/disk-drive', {
        body: {
          type_active_id: type,
          description,
          user_created: userCreated
        },
        method: HTTP_METHODS.POST
      })
    },
    put({ id, type, description, userCreated }) {
      return networkRequest(`/disk-drive/${id}`, {
        body: {
          type_active_id: type,
          description,
          user_created: userCreated
        },
        method: HTTP_METHODS.PUT
      })
    },
    delete({ id }) {
      return networkRequest(`/disk-drive/${id}`, {
        method: HTTP_METHODS.DELETE
      })
    }
  },
  inches: {
    id: 'inches',
    get({ signal, page }) {
      return networkRequest('/inches', { signal, params: { page } })
        .then(resp => resp.json())
        .then(res => {
          const data = res.result?.results?.map(r => {
            const type = r.type_active
            return {
              id: r.id,
              typeId: type.id,
              typeDescription: type.description,
              description: r.description,
              userCreated: r.user_created
            }
          })
          return data || []
        })
    },
    post({ description, userCreated, type }) {
      return networkRequest('/inches', {
        body: {
          type_active_id: type,
          description,
          user_created: userCreated
        },
        method: HTTP_METHODS.POST
      })
    },
    put({ id, type, description, userCreated }) {
      return networkRequest(`/inches/${id}`, {
        body: {
          type_active_id: type,
          description,
          user_created: userCreated
        },
        method: HTTP_METHODS.PUT
      })
    },
    delete({ id }) {
      return networkRequest(`/inches/${id}`, {
        method: HTTP_METHODS.DELETE
      })
    }
  },
  typeAsset: {
    id: 'type-active',
    get(f = { signal: null }) {
      const { signal } = f
      return networkRequest('/type-active', { signal })
        .then(resp => resp.json())
        .then(res => {
          const data = res.result?.results?.map(r => ({
            id: r.id,
            description: r.description,
            userCreated: r.user_created
          }))
          return data || []
        })
    },
    post({ description, userCreated }) {
      return networkRequest('/type-active', {
        body: {
          description,
          user_created: userCreated
        },
        method: HTTP_METHODS.POST
      })
    },
    put({ id, description, userCreated }) {
      return networkRequest(`/type-active/${id}`, {
        body: {
          id,
          description,
          user_created: userCreated
        },
        method: HTTP_METHODS.PUT
      })
    },
    delete({ id }) {
      return networkRequest(`/type-active/${id}`, {
        method: HTTP_METHODS.DELETE
      })
    }
  },
  seats: {
    id: 'sedes',
    get(f = { signal: null }) {
      const { signal } = f
      return networkRequest('/sedes', { signal })
        .then(resp => resp.json())
        .then(res => {
          const data = res.result?.results?.map(r => ({
            id: r.id,
            description: r.description,
            district: r.district,
            province: r.province,
            departament: r.departament,
            userCreated: r.user_created
          }))
          return data || []
        })
    },
    post({ signal, district, description, province, departament, userCreated }) {
      return networkRequest('/sedes', {
        signal,
        body: {
          description,
          district,
          province,
          departament,
          user_created: userCreated
        },
        method: HTTP_METHODS.POST
      })
    },
    put({ signal, id, district, description, province, departament, userCreated }) {
      return networkRequest(`/sedes/${id}`, {
        signal,
        body: {
          id,
          description,
          district,
          province,
          departament,
          user_created: userCreated
        },
        method: HTTP_METHODS.PUT
      })
    },
    delete({ id }) {
      return networkRequest(`/sedes/${id}`, {
        method: HTTP_METHODS.DELETE
      })
    }
  },
  brand: {
    id: 'brand-as',
    get(f = { signal: null }) {
      const { signal } = f
      return networkRequest('/brand', { signal, params: { section: 'AS' } })
        .then(resp => resp.json())
        .then(res => {
          const data = res.result?.results?.map(r => ({
            id: r.id,
            description: r.name,
            userCreated: r.user_created
          }))
          return data || []
        })
    },
    post({ signal, description, userCreated }) {
      return networkRequest('/brand', {
        signal,
        body: {
          name: description,
          type: 'AS',
          state: 't',
          user_created: userCreated
        },
        method: HTTP_METHODS.POST
      })
    },
    put({ signal, id, description, userCreated }) {
      return networkRequest(`/brand/${id}`, {
        signal,
        body: {
          id,
          name: description,
          type: 'AS',
          state: 't',
          user_created: userCreated
        },
        method: HTTP_METHODS.PUT
      })
    },
    delete({ id }) {
      return networkRequest(`/brand/${id}`, {
        method: HTTP_METHODS.DELETE
      })
    }
  },
  model: {
    id: 'model-as',
    get(f = { signal: null }) {
      const { signal } = f
      return networkRequest('/model', { signal, params: { section: 'AS' } })
        .then(resp => resp.json())
        .then(res => {
          const data = res.result?.results?.map(r => ({
            id: r.id,
            brandId: r.brand.id,
            brandName: r.brand.name,
            cost: r.amount,
            currency: r.currency,
            costWithCurrency: r.amount && r.currency ? `${formatNumber(r.amount)} ${r.currency}` : '',
            description: r.name,
            userCreated: r.user_created
          }))
          return data || []
        })
    },
    post({ signal, description, brand, cost, currency, userCreated }) {
      return networkRequest('/model', {
        signal,
        body: {
          name: description,
          type: 'AS',
          state: 't',
          currency,
          amount: cost,
          brand_id: String(brand),
          user_created: userCreated
        },
        method: HTTP_METHODS.POST
      })
    },
    put({ signal, id, description, cost, currency, brand, userCreated }) {
      return networkRequest(`/model/${id}`, {
        signal,
        body: {
          id,
          name: description,
          brand_id: String(brand),
          currency,
          amount: cost,
          type: 'AS',
          state: 't',
          user_created: userCreated
        },
        method: HTTP_METHODS.PUT
      })
    },
    delete({ id }) {
      return networkRequest(`/model/${id}`, {
        method: HTTP_METHODS.DELETE
      })
    }
  },
  binnacle: {
    id: 'binnacle-active',
    get({ signal, assignId, page }) {
      return networkRequest('/binnacle-active', {
        params: { assign_active: assignId, page: page ? page + 1 : 1 },
        signal
      })
        .then(res => res.json())
        .then(res => {
          const rowCount = res?.result?.count
          const result = res.result?.results || res.result
          const data =
            result.map(r => {
              const assignment = formatAssignmentInfo(r)
              return {
                ...assignment,
                documents: assignment.documents.map(doc => ({
                  name: getFilenameFromUrl(doc.filepath),
                  url: doc.filepath
                })),
                id: r.history_id,
                updateDate: r.history_date,
                assignId: r.id
              }
            }) || []
          return { data, rowCount }
        })
    },
    post({ id, classification, authorizer, method, reference, comment, documents = [], adminUser }) {
      const formData = new FormData()
      formData.append('assign_active_id', id)
      formData.append('classification_active_id', classification)
      formData.append('authorization_id', authorizer)
      formData.append('medium', method)
      formData.append('ticket', reference)
      formData.append('comments', comment)
      formData.append('user_created', adminUser)
      if (documents.length > 0) {
        documents.forEach((file, idx) => {
          formData.append(`document_${idx + 1}`, file)
        })
      }
      return newtworkMultipartRequest('/binnacle-active', formData)
    },
    report({ fromDate, toDate, classification }) {
      const params = {
        from_date: fromDate,
        to_date: toDate,
        classification_id: classification
      }
      return networkRequest('/binnacle-active-report', { params })
        .then(res => {
          validateReportError(res)
          return res.blob()
        })
        .then(blobData => {
          generateDownloadFile(blobData, 'reporte-bitacora-activos')
        })
    }
  },
  classifications: {
    id: 'classification-as',
    get(f = { signal: null }) {
      const { signal } = f
      return networkRequest('/classification', {
        signal,
        params: {
          type: 'AS'
        }
      })
        .then(resp => resp.json())
        .then(res =>
          res.result?.results?.map(r => ({
            id: r.id,
            description: r.name,
            type: r.type,
            userCreated: r.user_created
          }))
        )
    },
    post({ description, userCreated, type }) {
      return networkRequest('/classification', {
        params: {
          type: 'AS'
        },
        body: {
          name: description,
          type,
          user_created: userCreated
        },
        method: HTTP_METHODS.POST
      })
    },
    put({ id, description, userCreated, type }) {
      return networkRequest(`/classification/${id}`, {
        params: {
          type: 'AS'
        },
        body: {
          name: description,
          type,
          user_created: userCreated
        },
        method: HTTP_METHODS.PUT
      })
    },
    delete({ id }) {
      return networkRequest(`/classification/${id}`, {
        params: {
          type: 'AS'
        },
        method: HTTP_METHODS.DELETE
      })
    }
  },
  uploadFile: {
    get(filepath) {
      return networkRequest('/upload-document/active', { params: { filepath } })
        .then(res => res.json())
        .then(res => {
          console.log(res)
        })
    },
    post(document) {
      const formData = new FormData()
      formData.append('file', document)
      return newtworkMultipartRequest('/upload-document/active', formData, HTTP_METHODS.POST)
        .then(res => res.json())
        .then(res => {
          const result = res.result ?? {}
          return { filepath: result.filepath, url: result.url }
        })
    }
  },
  dummy() {
    return new Promise(resolve => {
      resolve([])
    })
  }
}

export default AssetService
