import { SUB_ROUTES } from './routes'

export const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  DEFAULT: 'DEFAULT'
}

export const AUTHORIZER = {
  ADMIN: {
    ASSET: true,
    MOBILE: true,
    LICENSE: true,
    DEFAULT: SUB_ROUTES.MOBILE_MODULE.KIT_ASSIGNMENT
  },
  USER: {
    ASSET: false,
    MOBILE: false,
    LICENSE: true,
    DEFAULT: SUB_ROUTES.LICENSE_MODULE.LICENSE_ASSIGNMENT
  },
  DEFAULT: {
    ASSET: false,
    MOBILE: true,
    LICENSE: false,
    DEFAULT: SUB_ROUTES.MOBILE_MODULE.KIT_ASSIGNMENT
  }
}

export function parsePathToModule(pathname) {
  return pathname
    .match(/\/[a-z]+/)[0]
    .slice(1)
    .toUpperCase()
}
