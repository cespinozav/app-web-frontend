import moment from 'moment'
import { DATE_STR_FORMAT } from './constants'

const KNOWN_DATE_FORMATS = [
  DATE_STR_FORMAT,
  'DD-MM-YYYY',
  'DD/MM/YYYY',
  'YYYY-MM-DD',
  'YYYY/MM/DD',
  'YYYY-MM-DD HH:mm:ss',
  'YYYY/MM/DD HH:mm:ss',
  'DD-MM-YYYY HH:mm',
  moment.ISO_8601
]

function parseDateValue(date) {
  if (!date) return null
  if (typeof date === 'string') {
    const strictParsed = moment(date, KNOWN_DATE_FORMATS, true)
    if (strictParsed.isValid()) return strictParsed
    const fallbackParsed = moment(date)
    return fallbackParsed.isValid() ? fallbackParsed : null
  }
  const parsed = moment(date)
  return parsed.isValid() ? parsed : null
}

export function formatDate(date, sep = '/') {
  const parsedDate = parseDateValue(date)
  if (!parsedDate || !parsedDate.isValid()) return '-'
  return parsedDate.format(`DD${sep}MM${sep}YYYY`)
}

export function formatSearchDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

export function addDays(date, daysNum = 1) {
  return moment(date).add(daysNum, 'd')
}

export function parseStrToDate(date) {
  if (date) {
    const momentDate =
      typeof date === 'string'
        ? moment(date, [DATE_STR_FORMAT, 'DD-MM-YYYY', 'YYYY-MM-DD', moment.ISO_8601], true)
        : moment(date)
    return momentDate.toDate()
  }
  return null
}

export function formatDateMin(date) {
  const parsedDate = parseDateValue(date)
  if (!parsedDate || !parsedDate.isValid()) return '-'
  return parsedDate.format('DD/MM/YYYY HH:mm')
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
