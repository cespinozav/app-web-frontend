import { getSession, getBearer } from './auth'
import { makeRequest, API, makeNoParamRequest } from './api'
import { DEFAULT_USER } from './constants'

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
}

export function delay(ms = 1000) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

async function validateSession() {
  try {
    await getSession()
  } catch (_e) {
    localStorage.setItem('EXPIRED', true)
    window.location.href = '/'
  }
}

export function isSessionExpired() {
  const expired = localStorage.getItem('EXPIRED')
  return expired === 'true'
}

export async function multiFetch(requestsArray) {
  await validateSession()
  return Promise.all(requestsArray.map(request => request()))
}

export async function networkRequest(
  suffix,
  { method = HTTP_METHODS.GET, params, body, signal, nullParam = false } = {}
) {
  await validateSession()
  try {
    if (nullParam) {
      return await makeNoParamRequest(suffix, { method, signal, headers: { Authorization: getBearer() } })
    }
    return await makeRequest(suffix, { method, params, body, signal, headers: { Authorization: getBearer() } })
  } catch (e) {
    const res = e?.result
    if (res) {
      throw Object.values(res)[0]
    } else {
      throw e
    }
  }
}

export async function newtworkMultipartRequest(suffix, formData, method = HTTP_METHODS.POST) {
  await validateSession()
  const url = `${API}${suffix}/`
  try {
    const response = await fetch(url, {
      method,
      body: formData,
      headers: { Authorization: getBearer() }
    })
    if (response.ok) return response
    const err = await response.json()
    throw err
  } catch (e) {
    const msg = String(e)
    if (msg.includes('Syntax')) {
      throw Error('Error de consulta')
    }
    const res = e?.result
    if (res) {
      throw Object.values(res)[0]
    } else {
      throw e
    }
  }
}

export async function getUser() {
  return networkRequest('/access-token')
    .then(res => res.json())
    .then(res => {
      const { result } = res
      const data = {
        user: result?.username || DEFAULT_USER.username,
        name: result?.name || DEFAULT_USER.name,
        job: result?.job || DEFAULT_USER.job,
        role: result?.role || DEFAULT_USER.role
      }
      return data
    })
}
