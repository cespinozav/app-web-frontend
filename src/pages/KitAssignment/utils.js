import { getMonthsTillNow } from 'utils/dates'
import { formatNumber } from 'utils/numbers'

export const DEFAULT_CONTRACT = {
  label: '-',
  subLabel: '-',
  classname: 'contract status--black'
}

export function getContract(assignment) {
  const contract = { ...DEFAULT_CONTRACT }
  const { startDate, endDate } = assignment || {}
  if (startDate) {
    if (endDate) {
      if (new Date() > startDate) {
        let rangeClassname = ''
        const monthDiff = getMonthsTillNow(endDate)
        if (monthDiff > 3) {
          contract.label = 'VIGENTE'
          rangeClassname = 'status--green'
        } else if (monthDiff > 0) {
          contract.label = 'POR VENCER'
          rangeClassname = 'status--yellow'
        } else {
          contract.label = 'TERMINADO'
          rangeClassname = 'status--red'
        }
        contract.subLabel = `${Math.max(Math.floor(monthDiff), 0)} meses`
        contract.classname = `contract ${rangeClassname}`
      }
    } else {
      contract.subLabel = 'Indefinido'
      if (new Date() > startDate) {
        contract.label = 'VIGENTE'
        contract.classname = 'contract status--green'
      }
    }
  } else {
    contract.subLabel = 'Indefinido'
    contract.classname = 'contract status--green'
    contract.label = 'VIGENTE'
  }
  return contract
}

export function getServicesCost(assignment) {
  if (!assignment) return ''
  const { plan, additional1, additional2 } = assignment
  const groupByCurrency = {}
  const services = [plan, additional1, additional2]
  services.forEach(service => {
    if (service) {
      const { cost, currency } = service
      if (!groupByCurrency[currency]) {
        groupByCurrency[currency] = 0
      }
      groupByCurrency[currency] += parseFloat(cost)
    }
  })
  return Object.entries(groupByCurrency)
    .map(([currency, cost]) => `${currency} ${formatNumber(cost)}`)
    .join(' + ')
}
