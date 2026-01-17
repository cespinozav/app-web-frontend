import { networkRequest } from 'utils/network'
import { capitalize } from 'utils/misc'

const PersonService = {
  id: 'person',
  filters({ dni, name, page, activeOnly = true }) {
    return networkRequest('/autocomplete-person', { params: { dni, name, user_state: activeOnly ? 'A' : null, page } })
      .then(r => r.json())
      .then(r => {
        const data =
          r.result?.results?.map(e => ({
            personId: e.id,
            name: `${capitalize(e.lastname_p)} ${capitalize(e.lastname_m)}, ${capitalize(e.names)}`,
            dni: e.dni
          })) || []
        data.sort((a, b) => (a.name < b.name ? -1 : 1))
        return data
      })
  },
  responsible({ dni }) {
    return networkRequest('/search-responsible', { params: { dni } })
      .then(r => r.json())
      .then(r => {
        const person = r.result[0]
        return {
          ceco: person.cent_cost_id || '-',
          cecoDesc: person.cent_cost_num || '-',
          job: person.job_num || '-'
        }
      })
  }
}

export default PersonService
