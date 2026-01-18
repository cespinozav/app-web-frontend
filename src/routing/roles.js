

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
    DEFAULT: '/'
  },
  USER: {
    ASSET: false,
    MOBILE: false,
    LICENSE: true,
    DEFAULT: '/'
  },
  DEFAULT: {
    ASSET: false,
    MOBILE: true,
    LICENSE: false,
    DEFAULT: '/'
  }
}

export function parsePathToModule(pathname) {
  return pathname
    .match(/\/[a-z]+/)[0]
    .slice(1)
    .toUpperCase()
}
