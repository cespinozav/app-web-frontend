import { HTTP_METHODS, networkRequest, newtworkMultipartRequest } from 'utils/network'
import { ACCOUNT_TYPES, CURRENCY, KIT_STATUSES, LINE_STATUSES, USER_STATUS } from 'utils/constants'
import { capitalize, generateDownloadFile, getFilenameFromUrl } from 'utils/misc'
import { validateReportError } from 'utils/exceptions'
import { formatSearchDate, parseStrToDate } from 'utils/dates'
import { formatNumber } from 'utils/numbers'

function formatService(service) {
  if (!service) return null
  return {
    ...service,
    serviceNum: service.service_num,
    currency: CURRENCY.find(c => service.currency === c.value)?.label || ''
  }
}

function formatAssignmentInfo(res) {
  const { person } = res
  const cessationDate = res.person?.cessation_date
  const isUserActive = cessationDate ? new Date(cessationDate) - new Date() >= 0 : true
  const author = res.authorization ?? { id: null, dni: null }
  const authorName = res.authorization
    ? `${capitalize(author.lastname_p)} ${capitalize(author.lastname_m)}, ${capitalize(author.names)}`
    : '-'
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
    userState: USER_STATUS[isUserActive ? 0 : 1],
    id: res.id,
    officeId: person.office_id,
    company: person.company,
    assignType: ACCOUNT_TYPES.find(e => e.value.toLowerCase() === res.type?.toLowerCase()) || {
      value: '',
      label: ''
    },
    assignTo: res.assign_to,
    correlative: res.correlative,
    phone: res.phone,
    email: res.email,
    typeServiceId: res.type_service.id,
    typeServiceName: res.type_service.description,
    operatorName: res.operator.name,
    operatorId: res.operator.id,
    brandId: res.brand.id,
    brandName: res.brand.name,
    modelId: res.model.id,
    modelName: res.model.name,
    imei: res.imei,
    startDate: parseStrToDate(res.date_start),
    endDate: parseStrToDate(res.date_end),
    observation: res.observation,
    kitStatus: KIT_STATUSES.find(k => k.label.toLowerCase() === res.state_equipment?.toLowerCase()) || {
      value: '',
      label: ''
    },
    lineStatus: LINE_STATUSES.find(k => k.label.toLowerCase() === res.state_line?.toLowerCase()) || {
      value: '',
      label: ''
    },
    lineBlockDays: res.line_block_days ?? 0,
    lineSuspendDays: res.line_suspend_days ?? 0,
    plan: formatService(res.plan),
    additional1: formatService(res.aditional_service_1),
    additional2: formatService(res.aditional_service_2),
    seatId: res.sede.id,
    seatName: res.sede.description,
    simcard: res.sim_card,
    contract: {
      ...res.contract,
      startDate: parseStrToDate(res.contract.date_start),
      endDate: parseStrToDate(res.contract.date_end)
    },
    method: res.medium,
    authorName,
    authorId: author.id,
    authorDni: author.dni,
    reference: res.ticket,
    comments: res.comments,
    classificationId: res.classification_mov?.id,
    classificationName: res.classification_mov?.name,
    documents: [res.first_document, res.second_document, res.third_document]
      .filter(d => d)
      .map(d => ({ name: d.split('/').at(-1), filepath: d, size: d?.size ?? 0 })),
    created: parseStrToDate(res.created),
    user: res.user_created,
    kitAmount: res.equipment_amount,
    penaltyAmount: res.penalty_amount,
    basicIncomeAmount: res.basic_income_amount,
    ssaaAmount: res.ssaa_amount,
    othersAmount: res.others_amount
  }
}

export function formatAssignmentInput({
  id,
  assignType,
  personId,
  assignTo,
  operatorId,
  brandId,
  observation,
  contractNum,
  imei,
  simcard,
  email,
  planId,
  typeServiceId,
  startDate,
  modelId,
  endDate,
  additional1,
  additional2,
  adminUser,
  kitStatus,
  lineStatus,
  lineBlockDays,
  lineSuspendDays,
  seatId,
  phone,
  classification,
  authorizer,
  method,
  kitAmount,
  penaltyAmount,
  basicIncomeAmount,
  ssaaAmount,
  othersAmount,
  reference,
  documents,
  comment
}) {
  const getDocumentByIndex = index =>
    documents?.length > index - 1 ? documents[index - 1]?.filepath : null

  return {
    id,
    type: assignType,
    person_id: personId,
    assign_to: assignTo,
    phone,
    email,
    operator_id: operatorId,
    type_service_id: typeServiceId,
    contract_id: contractNum,
    brand_id: brandId,
    model_id: modelId,
    date_start: startDate ? new Date(startDate).toISOString() : null,
    date_end: endDate ? new Date(endDate).toISOString() : null,
    imei,
    sim_card: simcard,
    sede_id: seatId,
    plan_id: planId,
    aditional_service_1_id: additional1 || null,
    aditional_service_2_id: additional2 || null,
    observation,
    state_equipment: kitStatus,
    state_line: lineStatus,
    line_block_days: lineBlockDays,
    line_suspend_days: lineSuspendDays,
    user_created: adminUser,
    classification_mov_id: classification,
    authorization_id: authorizer,
    medium: method,
    ticket: reference,
    first_document: getDocumentByIndex(1),
    second_document: getDocumentByIndex(2),
    third_document: getDocumentByIndex(3),
    comments: comment,
    equipment_amount: kitAmount ?? null,
    penalty_amount: penaltyAmount ?? null,
    basic_income_amount: basicIncomeAmount ?? null,
    ssaa_amount: ssaaAmount ?? null,
    others_amount: othersAmount ?? null
  }
}

const KitService = {
  filters: {
    number(number) {
      return networkRequest('/movil-fields', { params: { number } })
        .then(r => r.json())
        .then(r => r.result?.results.map(e => e.phone) || [])
    },
    name(name) {
      return networkRequest('/movil-fields', { params: { name } })
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
      return networkRequest('/movil-fields', { params: { dni } })
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
    imei(imei) {
      return networkRequest('/movil-fields', { params: { imei } })
        .then(r => r.json())
        .then(r => r.result?.results.map(e => e.imei) || [])
    },
    seat(sede) {
      return networkRequest('/movil-fields', { params: { sede } })
        .then(r => r.json())
        .then(r => r.result?.results.map(e => e.sede.description) || [])
    },
    job(cargo) {
      return networkRequest('/movil-fields', { params: { cargo } })
        .then(r => r.json())
        .then(r => r.result?.results.map(e => e.person.job_num) || [])
    },
    unit({ signal }) {
      return networkRequest('/movil-fields?unidad', { signal, nullParam: true })
        .then(r => r.json())
        .then(r => r.result?.results.map(e => e.unit_num) || [])
    },
    simcard(sim) {
      return networkRequest('/movil-fields', { params: { sim } })
        .then(r => r.json())
        .then(r => r.result?.results.map(e => e.sim_card) || [])
    },
    contractNum(contract) {
      return networkRequest('/movil-fields', { params: { no_contrato: contract } })
        .then(r => r.json())
        .then(r => r.result?.results.map(e => e.contract.code) || [])
    },
    management(gerencia) {
      return networkRequest('/movil-fields', { params: { gerencia } })
        .then(r => r.json())
        .then(r => r.result?.results.map(e => e.person.area_num) || [])
    },
    additional1(service1) {
      return networkRequest('/movil-fields', { params: { service_1: service1 } })
        .then(r => r.json())
        .then(r => r.result?.results.map(e => e.aditional_service_1.service_num) || [])
    },
    additional2(service2) {
      return networkRequest('/movil-fields', { params: { service_2: service2 } })
        .then(r => r.json())
        .then(r => r.result?.results.map(e => e.aditional_service_2.service_num) || [])
    },
    ceco(ceco) {
      return networkRequest('/movil-fields', { params: { ceco } })
        .then(r => r.json())
        .then(r => r.result?.results?.map(e => e.person.cent_cost_id) || [])
    },
    cecoDescription(cecoDesc) {
      return networkRequest('/movil-fields', { params: { desc_ceco: cecoDesc } })
        .then(r => r.json())
        .then(r => r.result?.results?.map(e => e.person.cent_cost_num) || [])
    }
  },
  assignments: {
    id: 'assigns-movil',
    get({
      dni,
      phone,
      accountType,
      kitState,
      userState,
      personId,
      assignTo,
      operator,
      fromDate,
      toDate,
      contractNumber,
      brand,
      model,
      imei,
      plan,
      additional1,
      additional2,
      seat,
      type,
      ceco,
      cecoDescription,
      lineState,
      contractState,
      simcard,
      excel,
      unit,
      job,
      management,
      page
    }) {
      const params = {
        phone,
        person_id: personId,
        assign_to: assignTo,
        dni,
        holder: accountType,
        equipment_state: kitState,
        line_state: lineState,
        user_state: userState,
        type_service_id: type,
        from_date: fromDate,
        to_date: toDate ? formatSearchDate(toDate) : null,
        operator_id: operator,
        contract_id: contractNumber,
        brand_id: brand,
        model_id: model,
        imei,
        cargo: job,
        gerencia: management,
        plan_id: plan,
        first_service_id: additional1,
        second_service_id: additional2,
        sede_id: seat,
        sim: simcard,
        ceco,
        unidad: unit,
        desc_ceco: cecoDescription,
        page: page ? page + 1 : 1,
        contract_state: contractState,
        excel
      }
      if (excel) {
        return networkRequest('/filters-movil', { params })
          .then(res => {
            validateReportError(res)
            return res.blob()
          })
          .then(blobData => {
            generateDownloadFile(blobData, 'reporte-asignacion-moviles')
          })
      }
      return networkRequest('/filters-movil', { params })
        .then(res => res.json())
        .then(resp => {
          const rowCount = resp?.result?.count
          const results = resp?.result?.results || []
          const data = results.map(res => formatAssignmentInfo(res)).filter(res => res !== null)
          return { data, rowCount }
        })
    },
    post(formInput) {
      const body = formatAssignmentInput(formInput)
      delete body.line_block_days
      delete body.line_suspend_days
      return networkRequest('/assigns-movil', {
        body,
        method: HTTP_METHODS.POST
      })
    },
    put(formInput) {
      const body = formatAssignmentInput(formInput)
      return networkRequest(`/assigns-movil/${body.id}`, {
        body,
        method: HTTP_METHODS.PUT
      })
    },
    delete({ id }) {
      return networkRequest(`/assigns-movil/${id}`, { method: HTTP_METHODS.DELETE })
    }
  },
  binnacle: {
    id: 'binnacle-movil',
    get({ signal, assignId, page, lastCreated }) {
      return networkRequest('/binnacle-movil', {
        params: { assign_mov: assignId, page: page ? page + 1 : 1, last_created: lastCreated },
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
      formData.append('assign_mov_id', id)
      formData.append('classification_mov_id', classification)
      formData.append('authorization_id', authorizer)
      formData.append('medium', method)
      formData.append('ticket', reference)
      formData.append('comments', comment)
      formData.append('user_created', adminUser)
      // for (let idx = 0; idx < 3; idx += 1) {
      //   const file = documents[idx] || null
      //   formData.append(`document_${idx + 1}`, file)
      // }
      if (documents.length > 0) {
        documents.forEach((file, idx) => {
          formData.append(`document_${idx + 1}`, file)
        })
      }
      return newtworkMultipartRequest('/binnacle-movil', formData)
    },
    report({ fromDate, toDate, classification }) {
      const params = {
        from_date: fromDate,
        to_date: toDate,
        classification_id: classification
      }
      return networkRequest('/binnacle-movil-report', { params })
        .then(res => {
          validateReportError(res)
          return res.blob()
        })
        .then(blobData => {
          generateDownloadFile(blobData, 'reporte-bitacora-moviles')
        })
    }
  },
  typeService: {
    id: 'type-service',
    get(f = { signal: null }) {
      const { signal } = f
      return networkRequest('/type-service', { signal })
        .then(resp => resp.json())
        .then(data =>
          data.result?.results.map(item => ({
            id: item.id,
            description: item.description,
            userCreated: item.user_created
          }))
        )
    },
    post({ signal, description, userCreated }) {
      return networkRequest('/type-service', {
        signal,
        body: {
          user_created: userCreated,
          description
        },
        method: HTTP_METHODS.POST
      })
    },
    put({ signal, description, userCreated, id }) {
      return networkRequest(`/type-service/${id}`, {
        signal,
        body: {
          user_created: userCreated,
          description,
          id
        },
        method: HTTP_METHODS.PUT
      })
    },
    delete({ id }) {
      return networkRequest(`/type-service/${id}`, { method: HTTP_METHODS.DELETE })
    }
  },
  plans: {
    id: 'plans',
    get(f = { signal: null }) {
      const { signal } = f
      return networkRequest('/plan', { signal })
        .then(resp => resp.json())
        .then(res =>
          res.result?.results.map(item => {
            const { currency, cost } = item
            return {
              id: item.id,
              operatorId: item.operator.id,
              operatorName: item.operator.name,
              description: item.service_num,
              typeServiceName: item.type_service.description,
              typeServiceId: item.type_service.id,
              cost,
              currency,
              costWithCurrency: cost && currency ? `${formatNumber(cost)} ${currency}` : '',
              userCreated: item.user_created
            }
          })
        )
    },
    post({ cost, currency, description, operatorId, userCreated, typeServiceId }) {
      return networkRequest('/plan', {
        method: HTTP_METHODS.POST,
        body: {
          service_num: description,
          operator_id: operatorId,
          type_service_id: typeServiceId,
          currency,
          cost,
          user_created: userCreated
        }
      })
    },
    put({ id, cost, currency, description, operatorId, userCreated, typeServiceId }) {
      return networkRequest(`/plan/${id}`, {
        body: {
          id,
          service_num: description,
          operator_id: operatorId,
          type_service_id: typeServiceId,
          currency,
          cost,
          user_created: userCreated
        },
        method: HTTP_METHODS.PUT
      })
    },
    delete({ id }) {
      return networkRequest(`/plan/${id}`, { method: HTTP_METHODS.DELETE })
    }
  },
  additionalService: {
    id: 'additional-service',
    get(f = { signal: null }) {
      const { signal } = f
      return networkRequest('/additional-service', { signal })
        .then(resp => resp.json())
        .then(res =>
          res.result?.results.map(item => {
            const { currency, cost } = item
            return {
              id: item.id,
              operatorId: item.operator.id,
              operatorName: item.operator.name,
              description: item.service_num,
              cost,
              currency,
              costWithCurrency: cost && currency ? `${formatNumber(cost)} ${currency}` : '',
              userCreated: item.user_created
            }
          })
        )
    },
    post({ cost, currency, description, operatorId, userCreated }) {
      return networkRequest('/additional-service', {
        method: HTTP_METHODS.POST,
        body: {
          service_num: description,
          operator_id: operatorId,
          currency,
          cost,
          user_created: userCreated
        }
      })
    },
    put({ id, cost, currency, description, operatorId, userCreated }) {
      return networkRequest(`/additional-service/${id}`, {
        body: {
          id,
          service_num: description,
          operator_id: operatorId,
          currency,
          cost,
          user_created: userCreated
        },
        method: HTTP_METHODS.PUT
      })
    },
    delete({ id }) {
      return networkRequest(`/additional-service/${id}`, { method: HTTP_METHODS.DELETE })
    }
  },
  suspend: {
    get(f = { signal: null }) {
      const { signal } = f
      return networkRequest('/suspend', { signal })
        .then(resp => resp.json())
        .then(dataSuspend => dataSuspend.result.map(item => ({ suspendId: item.id, description: item.name, day: 0 })))
    }
  },
  operators: {
    id: 'operator',
    get(f = { signal: null }) {
      const { signal } = f
      return networkRequest('/operator', { signal })
        .then(resp => resp.json())
        .then(data =>
          data.result?.results.map(item => ({ id: item.id, description: item.name, userCreated: item.user_created }))
        )
    },
    post({ signal, description, userCreated }) {
      return networkRequest('/operator', {
        signal,
        body: {
          user_created: userCreated,
          name: description
        },
        method: HTTP_METHODS.POST
      })
    },
    put({ signal, description, userCreated, id }) {
      return networkRequest(`/operator/${id}`, {
        signal,
        body: {
          user_created: userCreated,
          name: description,
          id
        },
        method: HTTP_METHODS.PUT
      })
    },
    delete({ id }) {
      return networkRequest(`/operator/${id}`, { method: HTTP_METHODS.DELETE })
    }
  },
  contract: {
    id: 'contract',
    get(f = { signal: null }) {
      const { signal } = f
      return networkRequest('/contract', { signal })
        .then(resp => resp.json())
        .then(res =>
          res.result?.results.map(item => ({
            id: item.id,
            code: item.code,
            description: item.description,
            startDate: parseStrToDate(item.date_start),
            endDate: parseStrToDate(item.date_end),
            // observation: item.observation,
            operatorId: item.operator.id,
            operatorName: item.operator.name,
            // simcard: item.sim_card,
            // amount: item.amount,
            userCreated: item.user_created
          }))
        )
    },
    post({ signal, code, endDate, startDate, operatorId, description, userCreated }) {
      return networkRequest('/contract', {
        signal,
        body: {
          code,
          operator_id: operatorId,
          // amount,
          description,
          date_start: startDate || null,
          date_end: endDate || null,
          // sim_card: simcard,
          // observation,
          state: 'false',
          user_created: userCreated
        },
        method: HTTP_METHODS.POST
      })
    },
    put({ signal, id, code, endDate, startDate, operatorId, description, userCreated }) {
      return networkRequest(`/contract/${id}`, {
        signal,
        body: {
          code,
          operator_id: operatorId,
          // amount,
          date_start: startDate || null,
          date_end: endDate || null,
          description,
          // sim_card: simcard,
          // observation,
          state: 'false',
          user_created: userCreated,
          id
        },
        method: HTTP_METHODS.PUT
      })
    },
    delete({ id }) {
      return networkRequest(`/contract/${id}`, { method: HTTP_METHODS.DELETE })
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
  brands: {
    id: 'brand-ms',
    get(f = { signal: null }) {
      const { signal } = f
      return networkRequest('/brand', { signal, params: { section: 'MS' } })
        .then(resp => resp.json())
        .then(
          data =>
            data.result?.results?.map(item => ({
              id: item.id,
              description: item.name,
              userCreated: item.user_created
            })) || []
        )
    },
    post({ signal, description, userCreated }) {
      return networkRequest('/brand', {
        signal,
        body: {
          user_created: userCreated,
          name: description,
          state: 't',
          type: 'MS'
        },
        method: HTTP_METHODS.POST
      })
    },
    put({ signal, description, userCreated, id }) {
      return networkRequest(`/brand/${id}`, {
        signal,
        body: {
          id,
          user_created: userCreated,
          name: description,
          state: 't',
          type: 'MS'
        },
        method: HTTP_METHODS.PUT
      })
    },
    delete({ id }) {
      return networkRequest(`/brand/${id}`, { method: HTTP_METHODS.DELETE })
    }
  },
  models: {
    id: 'model-ms',
    get(f = { signal: null }) {
      const { signal } = f
      return networkRequest('/model', { signal, params: { section: 'MS' } })
        .then(resp => resp.json())
        .then(res => {
          const data =
            res.result?.results?.map(r => ({
              id: r.id,
              brandId: r.brand.id,
              cost: r.amount,
              currency: r.currency,
              costWithCurrency: r.amount && r.currency ? `${formatNumber(r.amount)} ${r.currency}` : '',
              brandName: r.brand.name,
              description: r.name,
              userCreated: r.user_created
            })) || []
          return data
        })
    },
    post({ signal, description, cost, currency, userCreated, brandId }) {
      return networkRequest('/model', {
        signal,
        body: {
          user_created: userCreated,
          name: description,
          brand_id: brandId,
          currency,
          amount: cost,
          state: 't',
          type: 'MS'
        },
        method: HTTP_METHODS.POST
      })
    },
    put({ signal, description, cost, currency, userCreated, brandId, id }) {
      return networkRequest(`/model/${id}`, {
        signal,
        body: {
          id,
          user_created: userCreated,
          currency,
          amount: cost,
          name: description,
          brand_id: brandId,
          state: 't',
          type: 'MS'
        },
        method: HTTP_METHODS.PUT
      })
    },
    delete({ id }) {
      return networkRequest(`/model/${id}`, { method: HTTP_METHODS.DELETE })
    }
  },
  classifications: {
    id: 'classification-ms',
    get(f = { signal: null }) {
      const { signal } = f
      return networkRequest('/classification', {
        signal,
        params: {
          type: 'MS'
        }
      })
        .then(resp => resp.json())
        .then(
          res =>
            res.result?.results?.map(r => ({
              id: r.id,
              description: r.name,
              type: r.type,
              userCreated: r.user_created
            })) || []
        )
    },
    post({ description, userCreated, type }) {
      return networkRequest('/classification', {
        params: {
          type: 'MS'
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
          type: 'MS'
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
      return networkRequest('/upload-document/movil', { params: { filepath } })
        .then(res => res.json())
        .then(res => {
          console.log(res)
        })
    },
    post(document) {
      const formData = new FormData()
      formData.append('file', document)
      return newtworkMultipartRequest('/upload-document/movil', formData, HTTP_METHODS.POST)
        .then(res => res.json())
        .then(res => {
          const result = res.result ?? {}
          return { filepath: result.filepath, url: result.url }
        })
    }
  }
}

export default KitService
