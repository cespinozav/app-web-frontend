import { Link, Outlet, useLocation } from 'react-router-dom'
import INVENTORY_ICON from 'assets/img/icons/file.svg'
import PRODUCT_ICON from 'assets/img/icons/file.svg'
import MAINTENANCE_ICON from 'assets/img/icons/settings.svg'
import ROUTES, { SUB_ROUTES } from 'routing/routes'
import './style.scss'

function InventarioModule() {
  const { pathname } = useLocation()
  const isProductsActive = pathname === SUB_ROUTES.INVENTORY.PRODUCTS
  const isMaintenanceActive = pathname === SUB_ROUTES.INVENTORY.MAINTENANCE
  return (
    <div>
      <h1>
        <img src={INVENTORY_ICON} alt="inventario icon" /> Inventario
      </h1>
      <div className="module">
        <div className={isProductsActive ? 'active' : ''}>
          <Link to={SUB_ROUTES.INVENTORY.PRODUCTS}>
            <img src={PRODUCT_ICON} alt="productos icon" />
            Productos
          </Link>
        </div>
        <div className={isMaintenanceActive ? 'active' : ''}>
          <Link to={SUB_ROUTES.INVENTORY.MAINTENANCE}>
            <img src={MAINTENANCE_ICON} alt="mantenimientos icon" />
            Mantenimientos
          </Link>
        </div>
      </div>
      <Outlet />
    </div>
  )
}
export default InventarioModule
