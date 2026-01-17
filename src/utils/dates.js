import moment from 'moment'
import { DATE_STR_FORMAT } from './constants'

export function formatDate(date, sep = '-') {
  return moment(date).format(`DD${sep}MM${sep}YYYY`)
}

export function formatSearchDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

export function addDays(date, daysNum = 1) {
  return moment(date).add(daysNum, 'd')
}

export function parseStrToDate(date) {
  if (date) {
    const momentDate = typeof date === 'string' ? moment(date, DATE_STR_FORMAT) : moment(date)
    return momentDate.toDate()
  }
  return null
}

export function formatDateMin(date) {
  return moment(date).format('DD-MM-YYYY HH:mm')
}

export function parseToDate(dateStr, sep = '/') {
  return moment(dateStr, `YYYY${sep}MM${sep}DD`).toDate()
}

export function getMonthsTillNow(date) {
  const startDate = moment(date).startOf('day')
  const current = moment().startOf('day')
  return moment.duration(startDate.diff(current)).asMonths()
}

export function getDatesRange({ startDate, endDate }) {
  if (startDate && endDate) {
    return [new Date(startDate), new Date(endDate)]
  }
  return null
}
