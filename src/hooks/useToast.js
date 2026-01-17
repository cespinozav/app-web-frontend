import { ToastContext } from 'context'
import { useContext } from 'react'
import { ERRORS_MSG } from 'utils/exceptions'

function formatToast(severity, message) {
  if (Array.isArray(message)) {
    return message.map(m => ({ severity, detail: m }))
  }
  return { severity, detail: message }
}

function useToast() {
  const showToast = useContext(ToastContext)
  const error = message => {
    if (message) {
      const strMessage = String(message)
      if (strMessage === ERRORS_MSG.INVALID_TOKEN || strMessage.includes(ERRORS_MSG.ABORTED_REQUEST)) {
        return
      }
      showToast(formatToast('error', message))
    }
  }
  const warn = message => {
    showToast(formatToast('warn', message))
  }
  const success = message => {
    showToast(formatToast('success', message))
  }
  const toast = {
    error,
    warn,
    success
  }
  return toast
}

export default useToast
