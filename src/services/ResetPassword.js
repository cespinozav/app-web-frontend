/* eslint-disable camelcase */
import { makeRequest } from 'utils/api'

const ResetPasswordService = {
  requestReset: data =>
    makeRequest('/send-email-reset-password', {
      method: 'POST',
      body: data
    }),

  confirmReset: ({ uid, token, new_password }) =>
    makeRequest(`/reset-password/${uid}/${token}/`, {
      method: 'POST',
      body: { new_password }
    })
}

export default ResetPasswordService
