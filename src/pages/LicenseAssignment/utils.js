import { getMonthsTillNow } from 'utils/dates'

const DEFAULT_LICENSE = {
  label: '-',
  subLabel: '-',
  classname: 'license status--black'
}

export const getLicense = (startDate, endDate) => {
  const license = { ...DEFAULT_LICENSE }
  if (!startDate || !endDate) {
    license.label = 'VIGENTE'
    license.classname = 'license status--green'
    return license
  }
  if (new Date() > new Date(startDate)) {
    const monthDiff = getMonthsTillNow(endDate)
    if (monthDiff > 3) {
      license.label = 'VIGENTE'
      license.subClassname = 'status--green'
    } else if (monthDiff > 0) {
      license.label = 'POR VENCER'
      license.subClassname = 'status--yellow'
    } else {
      license.label = 'VENCIDA'
      license.subClassname = 'status--red'
    }
    license.subLabel = `${Math.max(Math.floor(monthDiff), 0)} meses`
    license.classname = `license ${license.subClassname}`
  }
  return license
}

export function getTotalAmount(selections) {
  return selections.map(s => parseFloat(s.amount)).reduce((acc, curr) => acc + curr, 0)
}
