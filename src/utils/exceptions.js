export const ERRORS_MSG = {
  INVALID_TOKEN: 'Given token not valid for any token type',
  ABORTED_REQUEST: 'The user aborted a request.',
  NO_CHANGED_VALUE: 'Debe cambiar algún campo',
  SAME_FILE: 'No puede subir el mismo archivo',
  MAX_FILE_SIZE: 'Supero la cantidad máxima de archivos'
}

export const ERROR_TAGS = {
  VOID_REPORT: {
    TAG: 'VOID_REPORT',
    MSG: 'No hay registros con los parámetros ingresados'
  }
}

export function validateReportError(response) {
  if (response.headers.get('content-type') !== 'application/vnd.ms-excel') {
    const error = new Error(ERROR_TAGS.VOID_REPORT.MSG)
    error.name = ERROR_TAGS.VOID_REPORT.TAG
    throw error
  }
}
