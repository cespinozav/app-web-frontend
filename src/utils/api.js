import { HTTP_METHODS } from './constants'
import { getBearer, removeSession } from './auth'

function getAPI() {
  if (process.env.REACT_APP_ENV === 'prd') {
    return 'https://sirtel.apptalma.com/api/v1'
  }
  return 'http://localhost:8000/api/v1'
}

export const API = getAPI()

const HEADERS = {
  'X-Requested-With': 'XMLHttpRequest',
  'Content-Type': 'application/json',
  ...(localStorage.getItem('accessToken') && { Authorization: getBearer() })
}

export async function makeRequest(suffix, { method = HTTP_METHODS.GET, params, body, headers, signal } = {}) {
  let url;
  // Si el sufijo contiene '?', asegúrate que antes del '?' haya un slash
  if (suffix.includes('?')) {
    const [base, query] = suffix.split('?');
    let cleanBase = base;
    if (!base.endsWith('/')) cleanBase += '/';
    url = `${API}${cleanBase}?${query}`;
  } else {
    url = `${API}${suffix}`;
    if (!suffix.endsWith('/')) url += '/';
    if (params) {
      const strParams = Object.entries(params)
        .filter(([, val]) => ![undefined, '', null].includes(val) && !(Array.isArray(val) && val.length === 0))
        .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
        .join('&');
      url += `?${strParams}`;
    }
  }
  try {
    let bodyValue = null;
    if (body) {
      bodyValue = typeof body === 'string' ? body : JSON.stringify(body);
    }
    const response = await fetch(url, {
      method,
      headers: headers ? { ...HEADERS, ...headers, ...(localStorage.getItem('accessToken') && { Authorization: getBearer() }) } : HEADERS,
      body: bodyValue,
      signal
    })
    if (response.ok) return response
    if (response.status === 401) {
      // Cerrar sesión automáticamente cuando se detecta 401
      removeSession();
      window.location.href = '/login';
      const err = await response.json();
      throw err;
    }
    const err = await response.json();
    throw err;
  } catch (e) {
    const msg = String(e)
    if (msg.includes('Syntax')) {
      throw Error('Error de consulta')
    }
    throw e
  }
}

export async function makeNoParamRequest(suffix, { headers, signal } = {}) {
  const url = `${API}${suffix}`
  try {
    const response = await fetch(url, {
      method: HTTP_METHODS.GET,
      headers: headers ? { ...HEADERS, ...headers, ...(localStorage.getItem('accessToken') && { Authorization: getBearer() }) } : HEADERS,
      signal
    })
    if (response.ok) return response
    if (response.status === 401) {
      // Cerrar sesión automáticamente cuando se detecta 401
      removeSession();
      window.location.href = '/login';
    }
    const err = await response.json()
    throw err
  } catch (e) {
    const msg = String(e)
    if (msg.includes('Syntax')) {
      throw Error('Error de consulta')
    }
    throw e
  }
}
