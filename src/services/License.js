import { HTTP_METHODS, networkRequest, newtworkMultipartRequest } from 'utils/network'
import { CURRENCY, EMAIL_TYPES, MASSIVE_LOAD_RESPONSES, USER_STATUS } from 'utils/constants'
import { capitalize, generateDownloadFile, getFilenameFromUrl } from 'utils/misc'
import { validateReportError } from 'utils/exceptions'
import { addDays, formatSearchDate, parseStrToDate } from 'utils/dates'

function formatAssignmentInfo(res) {
  const { person } = res
  const assignedLicense = res.assign_licenses
  if (!assignedLicense || assignedLicense.length === 0) {
    return {}
  }
  const cessationDate = res.person?.cessation_date
  const isUserActive = cessationDate ? new Date(cessationDate) - new Date() >= 0 : true
  const groupByLicenseId = {}
  assignedLicense.forEach(({ license, ...lt }) => {
    if (!groupByLicenseId[license.id]) {
      groupByLicenseId[license.id] = { name: license.name, id: license.id, types: [] }
    }
    groupByLicenseId[license.id].types.push({
      amount: parseFloat(lt.amount),
      currency: CURRENCY.find(c => c.value === lt.currency).label || '-',
      id: lt.id,
      name: lt.description
    })
  })
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
    assignType: EMAIL_TYPES.find(e => e.value.toLowerCase() === res.type?.toLowerCase()) || {
      value: '',
      label: ''
    },
    email: res.email,
    userRed: res.user_red,
    correlative: res.correlative,
    licenses: Object.values(groupByLicenseId),
    id: res.id,
    userState: USER_STATUS[isUserActive ? 0 : 1],
    officeId: person.office_id,
    company: person.company,
    assignedTo: res.assign_to,
    endDate: parseStrToDate(res.date_end),
    startDate: parseStrToDate(res.date_start),
    currency: CURRENCY.find(c => c.value === assignedLicense[0].currency).label || '-',
    observation: res.observation,
    method: res.medium,
    authorName,
    authorId: author.id,
    authorDni: author.dni,
    country: res.ubication,
    reference: res.ticket,
    comments: res.comments,
    classificationId: res.classification_license.id,
    classificationName: res.classification_license.name,
    documents: [res.first_document, res.second_document, res.third_document]
      .filter(d => d)
      .map(d => ({ name: d.split('/').at(-1), filepath: d, size: d?.size ?? 0 })),
    created: parseStrToDate(res.created),
    user: res.user_created
  }
}

function formatAssignmentInput({
  id,
  personId,
  assignType,
  assignedTo,
  email,
  userRed,
  correlative,
  name,
  authorizer,
  observation,
  licenseTypes,
  startDate,
  endDate,
  classification,
  reference,
  method,
  comment,
  documents,
  adminUser
}) {
  const getDocumentByIndex = index => (documents?.length > index - 1 ? documents[index - 1]?.filepath : null)
  return {
    type: assignType || 'T',
    person_id: personId,
    assign_to: assignedTo || name,
    email: email || '-',
    user_red: userRed,
    observation,
    date_start: startDate ? new Date(startDate).toISOString() : null,
    date_end: endDate ? new Date(endDate).toISOString() : null,
    assign_licenses: licenseTypes.map(lt => ({ id: lt.value })),
    user_created: adminUser,
    correlative,
    id,
    classification_license_id: classification,
    authorization_id: authorizer,
    medium: method,
    first_document: getDocumentByIndex(1),
    second_document: getDocumentByIndex(2),
    third_document: getDocumentByIndex(3),
    ticket: reference,
    comments: comment
  }
}

const LicenseService = {
  filters: {
    usernet(userRed) {
      return networkRequest('/license-fields', { params: { user_red: userRed } })
        .then(r => r.json())
        .then(r => r.result?.results?.map(e => e.user_red) || [])
    },
    dni(dni) {
      return networkRequest('/license-fields', { params: { dni } })
        .then(r => r.json())
        .then(r => r.result?.results?.map(e => e.dni) || [])
    },
    mail(email) {
      return networkRequest('/license-fields', { params: { email } })
        .then(r => r.json())
        .then(r => r.result?.results?.map(e => e.email) || [])
    },
    license(license) {
      return networkRequest('/license-fields', { params: { license } })
        .then(r => r.json())
        .then(r => r.result?.results?.map(e => e.license) || [])
    },
    ceco(ceco) {
      return networkRequest('/license-fields', { params: { ceco } })
        .then(r => r.json())
        .then(r => r.result?.results?.map(e => e.person.cent_cost_id) || [])
    },
    cecoDescription(cecoDesc) {
      return networkRequest('/license-fields', { params: { desc_ceco: cecoDesc } })
        .then(r => r.json())
        .then(r => r.result?.results?.map(e => e.person.cent_cost_num) || [])
    }
  },
  assignments: {
    id: 'assigns-license',
    get({
      signal,
      personId,
      email,
      licenseType,
      fromDate,
      toDate,
      ceco,
      cecoDesc,
      emailType,
      page,
      userRed,
      userState,
      excel
    }) {
      const params = {
        id_person: personId,
        email,
        id_license: licenseType,
        from_date: fromDate && toDate ? fromDate : '',
        to_date: fromDate && toDate ? formatSearchDate(addDays(toDate, 1)) : '',
        ceco,
        desc_ceco: cecoDesc,
        user_red: userRed,
        user_state: userState,
        type_email: emailType,
        page: page ? page + 1 : 1,
        excel
      }
      if (excel) {
        return networkRequest('/filters-license', { params })
          .then(res => {
            validateReportError(res)
            return res.blob()
          })
          .then(blobData => {
            generateDownloadFile(blobData, 'reporte-asignacion-licencias')
          })
      }
      return networkRequest('/filters-license', { signal, params })
        .then(resp => resp.json())
        .then(resp => {
          const rowCount = resp?.result?.count
          const results = resp?.result?.results || []
          const data = results.map(res => formatAssignmentInfo(res)).filter(res => res !== null)
          return { data, rowCount }
        })
    },
    post(formInput) {
      const body = formatAssignmentInput(formInput)
      return networkRequest('/assigns-license', {
        body: {
          ...body,
          type_licenses: body.assign_licenses.map(l => ({ type_license_id: l.id }))
        },
        method: HTTP_METHODS.POST
      })
    },
    put(formInput) {
      const body = formatAssignmentInput(formInput)
      return networkRequest(`/assigns-license/${body.id}`, {
        body,
        method: HTTP_METHODS.PUT
      })
    },
    delete({ id }) {
      return networkRequest(`/assigns-license/${id}`, { method: HTTP_METHODS.DELETE })
    }
  },
  massiveLoad: {
    validate({ document }) {
      const formData = new FormData()
      formData.append('file', document)
      return newtworkMultipartRequest('/validate-license-file', formData, HTTP_METHODS.POST)
        .then(res => res.json())
        .then(
          res =>
            res?.result?.results.map(r => ({
              id: `lv-${r.numRow}`,
              numRow: r.num_row,
              licenses: r.licencias,
              personId: r.person_id,
              username: r.nombre_principal_de_usuario,
              postalCode: r.codigo_postal,
              name: r.nombre,
              completeName: capitalize(`${r.apellido}, ${r.nombre}`),
              licensesNames: r.licencias.map(l => l.name_license).join(', '),
              lastname: r.apellido,
              created: r.cuando_se_crea,
              country: r.ubicacion_pais ?? '',
              observation: r.valide_observation
            })) || []
        )
    },
    load({ rows, userCreated, mode }) {
      const results = rows.map(r => ({
        num_row: r.numRow,
        licencias: r.licenses,
        person_id: r.personId,
        nombre_principal_de_usuario: r.username,
        codigo_postal: r.postalCode,
        nombre: r.name,
        apellido: r.lastname,
        cuando_se_crea: r.created,
        ubicacion_pais: r.country,
        valide_observation: r.observation
      }))
      return networkRequest('/operate-license-file', {
        body: {
          mode,
          results,
          user_created: userCreated
        },
        method: HTTP_METHODS.POST
      })
        .then(res => res.json())
        .then(
          res =>
            res?.result?.results.map(r => {
              const assignObservation = r.assign_observation
              const observation =
                MASSIVE_LOAD_RESPONSES.find(mlr => mlr.value === assignObservation)?.label || assignObservation
              return {
                id: `lv-${r.numRow}`,
                numRow: r.num_row,
                licensesNames: `${r.licenses.map(l => l.name_license).join(', ')}`,
                personId: r.person,
                country: r.ubicacion_pais ?? '',
                observation
              }
            }) || []
        )
    }
  },
  licenses: {
    id: 'license',
    get(f = { signal: null }) {
      const { signal } = f
      return networkRequest('/license', { signal })
        .then(resp => resp.json())
        .then(res => {
          const data = res.result?.results?.map(r => ({
            startDate: parseStrToDate(r.date_start),
            endDate: parseStrToDate(r.date_end),
            id: r.id,
            description: r.name,
            userCreated: r.user_created
          }))
          return data || []
        })
    },
    post({ description, endDate, startDate, userCreated }) {
      return networkRequest('/license', {
        body: {
          name: description,
          date_start: startDate,
          date_end: endDate,
          state: false,
          user_created: userCreated
        },
        method: HTTP_METHODS.POST
      })
    },
    put({ id, description, endDate, startDate, userCreated }) {
      return networkRequest(`/license/${id}`, {
        body: {
          id,
          name: description,
          date_start: startDate,
          date_end: endDate,
          state: true,
          user_created: userCreated
        },
        method: HTTP_METHODS.PUT
      })
    },
    delete({ id }) {
      return networkRequest(`/license/${id}`, {
        method: HTTP_METHODS.DELETE
      })
    }
  },
  typeLicense: {
    id: 'type-license',
    get(f = { signal: null }) {
      const { signal } = f
      return networkRequest('/type-license', { signal })
        .then(resp => resp.json())
        .then(res => {
          const data = res.result?.results?.map(r => {
            const currency = CURRENCY.find(c => c.value === r.currency) || {
              label: r.currency,
              value: r.currency
            }
            return {
              startDate: parseStrToDate(r.date_start),
              endDate: parseStrToDate(r.date_end),
              id: r.id,
              currencyName: currency.label,
              currencyId: currency.value,
              description: r.description,
              licenseName: r.license.name,
              licenseId: r.license.id,
              amount: parseFloat(r.amount),
              quantity: r.Q,
              userCreated: r.user_created
            }
          })
          return data || []
        })
    },
    post({ signal, license, description, currency, amount, quantity, userCreated }) {
      return networkRequest('/type-license', {
        signal,
        body: {
          license_id: license,
          description,
          currency,
          amount,
          Q: quantity,
          user_created: userCreated
        },
        method: HTTP_METHODS.POST
      })
    },
    put({ signal, id, license, description, currency, amount, quantity, userCreated }) {
      return networkRequest(`/type-license/${id}`, {
        signal,
        body: {
          id,
          license_id: license,
          description,
          currency,
          amount,
          Q: quantity,
          user_created: userCreated
        },
        method: HTTP_METHODS.PUT
      })
    },
    delete({ id }) {
      return networkRequest(`/type-license/${id}`, {
        method: HTTP_METHODS.DELETE
      })
    }
  },
  binnacle: {
    get({ signal, assignId, page }) {
      return networkRequest('/binnacle-license', {
        params: { assign_license: assignId, page: page ? page + 1 : 1 },
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
                assignId: r.id
              }
            }) || []
          return { data, rowCount }
        })
    },
    post({ id, classification, authorizer, method, reference, comment, documents = [], adminUser }) {
      const formData = new FormData()
      formData.append('assign_license_id', id)
      formData.append('classification_license_id', classification)
      formData.append('authorization_id', authorizer)
      formData.append('medium', method)
      formData.append('ticket', reference)
      formData.append('comments', comment)
      formData.append('user_created', adminUser)
      if (documents.length > 0) {
        documents.forEach((file, idx) => {
          const date = Date.now()
          formData.append(`document_${idx + 1}`, file, `${date}_${file.name}`)
        })
      }
      return newtworkMultipartRequest('/binnacle-license', formData)
    },
    report({ fromDate, toDate, classification }) {
      const params = {
        from_date: fromDate,
        to_date: toDate,
        classification_id: classification
      }
      return networkRequest('/binnacle-license-report', { params })
        .then(res => {
          validateReportError(res)
          return res.blob()
        })
        .then(blobData => {
          generateDownloadFile(blobData, 'reporte-bitacora-licencias')
        })
    }
  },
  classifications: {
    id: 'classification-ls',
    get(f = { signal: null }) {
      const { signal } = f
      return networkRequest('/classification', {
        signal,
        params: {
          type: 'LS'
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
          type: 'LS'
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
          type: 'LS'
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
          type: 'LS'
        },
        method: HTTP_METHODS.DELETE
      })
    }
  },
  dummy() {
    return new Promise(resolve => {
      resolve([])
    })
  },
  uploadFile: {
    get(filepath) {
      return networkRequest('/upload-document/license', { params: { filepath } }).then(res => res.json())
    },
    post(document) {
      const formData = new FormData()
      formData.append('file', document)
      return newtworkMultipartRequest('/upload-document/license', formData, HTTP_METHODS.POST)
        .then(res => res.json())
        .then(res => {
          const result = res.result ?? {}
          return { filepath: result.filepath, url: result.url }
        })
    }
  }
}

export default LicenseService
