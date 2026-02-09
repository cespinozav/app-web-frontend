import { makeRequest } from 'utils/api'
import { HTTP_METHODS } from './constants'
import { parseJwt } from './misc'

const MOCK_DATA = {
  status: true,
  result: { user: 'JohnDoe', name: 'John Doe', job: 'Analista de Sistemas', token: 'asdasd', role: 'ADMIN' }
}

const sessionDummy = () =>
  new Promise(resolve => {
    setTimeout(() => {
      const { token, ...data } = MOCK_DATA.result
      resolve(data)
    }, 500)
  })

const authDummy = () =>
  new Promise(resolve => {
    setTimeout(() => {
      const { token, ...data } = MOCK_DATA.result
      localStorage.setItem('accessToken', token)
      // console.log({ data })
      resolve(data)
    }, 1000)
  })

export function authenticate({ username, password }) {
  return makeRequest('/login', {
    method: HTTP_METHODS.POST,
    body: {
      username,
      password
    }
  })
    .then(res => {
      if (!res || typeof res.json !== 'function') {
        throw Error('Respuesta inválida del servidor')
      }
      return res.json()
    })
    .then(res => {
      const { result } = res
      if (!result || !result.access) {
        throw Error('Credenciales inválidas o usuario sin acceso')
      }
      localStorage.setItem('accessToken', result.access)
      localStorage.setItem('refreshToken', result.refresh)
      return { username: result.username }
    })
  // return authDummy()
}

export function refreshSession() {
  const refreshToken = localStorage.getItem('refreshToken')
  return makeRequest('/api-token-auth/token/refresh', {
    method: HTTP_METHODS.POST,
    body: {
      refresh: refreshToken
    }
  })
    .then(res => res.json())
    .then(res => {
      const { result } = res
      localStorage.setItem('accessToken', result.access)
    })
}

export function verify() {
  const accessToken = localStorage.getItem('accessToken')
  return makeRequest('/api-token-auth/token/verify', {
    method: HTTP_METHODS.GET,
    body: {
      accessToken
    }
  })
}

export function getBearer() {
  const accessToken = localStorage.getItem('accessToken')
  return `Bearer ${accessToken}`
}

export async function getSession() {
  const accessToken = localStorage.getItem('accessToken')
  const expiration = parseJwt(accessToken).exp
  if (Date.now() >= expiration * 1000) {
    await refreshSession()
  }
}

export function hasToken() {
  return !!localStorage.getItem('accessToken')
}

export function removeSession() {
  localStorage.clear()
}

export function hasNoAuth() {}
