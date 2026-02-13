import { Link, Outlet, useLocation } from 'react-router-dom'
import ORDERS_ICON from 'assets/img/icons/files.svg'
import ADD_ICON from 'assets/img/icons/note-add.svg'
import { SUB_ROUTES } from 'routing/routes'
import './style.scss'

function OrdenesModule() {
  const { pathname } = useLocation()
  const isMainActive = pathname === SUB_ROUTES.ORDERS.MAIN
  const isCreateActive = pathname === SUB_ROUTES.ORDERS.CREATE

  return (
    <div>
      <h1>
        <img src={ORDERS_ICON} alt="ícono de órdenes" /> Órdenes
      </h1>
      <div className="module">
        <div className={isMainActive ? 'active' : ''}>
          <Link to={SUB_ROUTES.ORDERS.MAIN}>
            <img src={ORDERS_ICON} alt="listado de órdenes" />
            Listado de Órdenes
          </Link>
        </div>
        <div className={isCreateActive ? 'active' : ''}>
          <Link to={SUB_ROUTES.ORDERS.CREATE}>
            <img src={ADD_ICON} alt="agregar orden" />
            Agregar Orden
          </Link>
        </div>
      </div>
      <Outlet />
    </div>
  )
}

export default OrdenesModule
