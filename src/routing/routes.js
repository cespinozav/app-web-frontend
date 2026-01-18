
const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  INVENTORY: '/inventario',
  INVENTORY_PRODUCTS: '/inventario/productos',
  INVENTORY_MAINTENANCE: '/inventario/mantenimientos',
  PROFILE: '/perfil',
}


export const SUB_ROUTES = {
  INVENTORY: {
    PRODUCTS: `${ROUTES.INVENTORY}/productos`,
    MAINTENANCE: `${ROUTES.INVENTORY}/mantenimientos`
  }
}

export default ROUTES
