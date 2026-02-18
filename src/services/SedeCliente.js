import { makeRequest } from 'utils/api'

const SedeCliente = {
  async getSedesPorPersona() {
    return makeRequest(`/personas-sede-cliente/sedes-por-persona`, {
      headers: localStorage.getItem('accessToken') ? { Authorization: require('utils/auth').getBearer() } : undefined
    })
  }
}

export default SedeCliente
