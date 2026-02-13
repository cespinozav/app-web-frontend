/* eslint-disable camelcase, global-require */
import { makeRequest } from 'utils/api'

const ENDPOINT = '/countries'

const CountryService = {
  get: ({ page = 1, page_size = 100 } = {}) =>
    makeRequest(`${ENDPOINT}/?page=${page}&page_size=${page_size}`, {
      headers: localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : undefined
    })
      .then(res => res.json())
      .then(res => {
        const result = res.result || {}
        return {
          results: Array.isArray(result.results) ? result.results : [],
          count: typeof result.count === 'number' ? result.count : 0
        }
      })
}

export default CountryService
