export const DNI_RULES = {
  pattern: {
    message: 'DNI no válido',
    value: /^\d{8}$/
  }
}

export const PHONE = {
  pattern: {
    message: 'Número no válido',
    value: /\d/
  },
  minLength: {
    message: 'Número debe tener 9 digitos',
    value: 9
  }
}

export const EMAIL_RULES = {
  pattern: {
    message: 'Correo no válido',
    value: /^[^@]+@[^@]+$/
  },
  minLength: {
    message: 'Correo debe por lo menos 5 digitos',
    value: 5
  }
}
