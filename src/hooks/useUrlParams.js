import { useSearchParams } from 'react-router-dom'

export function decodeUrlParams(defaultParams, urlSearchParams) {
  const newSearch = {}
  Object.keys(defaultParams).forEach(k => {
    const value = urlSearchParams.get(k)
    if (![null, undefined].includes(value) || (Array.isArray(value) && value.length > 0)) {
      let decodedValue = decodeURIComponent(value)
      if (decodedValue[0] === '[' && decodedValue.slice(-1) === ']') {
        decodedValue = decodedValue.slice(1, -1)
        if (decodedValue === '') return
        decodedValue = decodedValue.split(',')
      }
      decodedValue = decodedValue === 'false' ? false : decodedValue
      decodedValue = decodedValue === 'true' ? true : decodedValue
      newSearch[k] = decodedValue
    } else {
      newSearch[k] = defaultParams[k]
    }
  })
  return newSearch
}

export function encodeUrlParams(params) {
  if (params) {
    const strParams = Object.entries(params)
      .filter(([, val]) => ![undefined, '', null].includes(val))
      .map(([key, val]) => {
        const value = val instanceof Array ? `[${val}]` : val
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      })
      .join('&')
    return `?${strParams}`
  }
  return ''
}

export function formatUrlParams(params) {
  const formattedParams = {}
  if (params) {
    Object.entries(params)
      .filter(([, val]) => ![undefined, '', null].includes(val) || (Array.isArray(val) && val.length > 0))
      .forEach(([key, val]) => {
        formattedParams[key] = val instanceof Array ? `[${val}]` : val
      })
  }
  return formattedParams
}

export function useUrlParams(defaultParams) {
  const [searchParams, setSearchParams] = useSearchParams()
  const decodedSearchParams = decodeUrlParams(defaultParams, searchParams)
  const setFormattedSearchParams = params => setSearchParams(formatUrlParams(params))
  return [decodedSearchParams, setFormattedSearchParams]
}

export function parseTypes(types, params) {
  const parseObj = {
    int: value => parseInt(value, 10),
    float: value => parseFloat(value),
    bool: value => value === 'true',
    array: value => value.split(',')
  }
  const parsedParams = {}
  Object.keys(params).forEach(key => {
    const type = types[key]
    const value = params[key]
    if (!(key in types)) {
      parsedParams[key] = value
      return
    }
    if (type in parseObj[type]) {
      parsedParams[key] = parseObj[type](value)
    } else {
      const arrVals = type.map(t => t.value)
      const idx = arrVals.indexOf(value)
      parsedParams[key] = idx > -1 ? arrVals[idx] : ''
    }
  })
}
