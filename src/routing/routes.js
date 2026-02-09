

const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  INVENTORY: '/inventario',
  INVENTORY_PRODUCTS: '/inventario/productos',
  INVENTORY_MAINTENANCE: '/inventario/mantenimientos',
  CLIENTS: '/clientes',
  CLIENTS_MAIN: '/clientes/clientes',
  CLIENTS_MAINTENANCE: '/clientes/mantenimientos',
  USERS: '/usuarios',
  USERS_MAIN: '/usuarios/usuarios',
  USERS_MAINTENANCE: '/usuarios/mantenimientos',
  PROFILE: '/perfil',
  PASSWORD_RESET_CONFIRM: '/reset-password/:uid/:token',
}


export const SUB_ROUTES = {
  INVENTORY: {
    PRODUCTS: `${ROUTES.INVENTORY}/productos`,
    MAINTENANCE: `${ROUTES.INVENTORY}/mantenimientos`
  },
  CLIENTS: {
    MAIN: `${ROUTES.CLIENTS}/clientes`,
    MAINTENANCE: `${ROUTES.CLIENTS}/mantenimientos`
  },
  USERS: {
    MAIN: `${ROUTES.USERS}/usuarios`,
    MAINTENANCE: `${ROUTES.USERS}/mantenimientos`
  }
}

export default ROUTES
