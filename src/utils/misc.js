import { FILE_FORMATS } from './constants'

export function capitalize(str) {
  if (!str) return ''
  return str
    .split(' ')
    .filter(s => s)
    .map(s => s[0].toUpperCase() + s.slice(1).toLowerCase())
    .join(' ')
}

export function parseJwt(token) {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(c => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  )
  return JSON.parse(jsonPayload)
}

export function objectIsEqual(obj1, obj2) {
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)
  if (keys1.length !== keys2.length) {
    return false
  }
  return keys1.every(k1 => {
    if (!keys2.includes(k1)) {
      return false
    }
    let val1 = obj1[k1]
    let val2 = obj2[k1]
    if (Array.isArray(val2) && Array.isArray(val2)) {
      val2 = val2.flat()
      val1 = val1.flat()
      if (val1.length !== val2.length) {
        return false
      }
      let everyEqual = true
      for (let i = 0; i < val1.length; i += 1) {
        if (typeof val1[i] === 'object' && typeof val2[i] === 'object') {
          everyEqual &&= objectIsEqual(val1[i], val2[i])
        } else {
          everyEqual &&= val1[i] === val2[i]
        }
      }
      return everyEqual
    }
    if (typeof val1 === 'object' && typeof val2 === 'object') {
      return objectIsEqual(val1, val2)
    }
    return val1 === val2
  })
}

export function getFileformatIcon(documentName) {
  const docSlices = documentName.split('.')
  const extension = docSlices.length > 1 ? `.${docSlices.at(-1).toLowerCase()}` : null
  if (FILE_FORMATS.IMAGE.includes(extension)) {
    return 'pi-image'
  }
  if (FILE_FORMATS.PDF.includes(extension)) {
    return 'pi-file-pdf'
  }
  return 'pi-file'
}

export function generateDownloadFile(blobData, filename) {
  const url = window.URL.createObjectURL(blobData)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `${filename}-${Date.now()}.xls`)
  link.click()
}

export function getFilenameFromUrl(url) {
  return url.match(/[^/]+(?=\?)/)[0] || ''
}
