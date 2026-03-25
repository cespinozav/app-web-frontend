import { Link, Outlet, useLocation } from 'react-router-dom'
import BANK_ICON from 'assets/img/icons/files.svg'
import { SUB_ROUTES } from 'routing/routes'
import './style.scss'

function CuentasBancariasModule() {
  return (
    <div>
      <h1>
        <img src={BANK_ICON} alt="ícono de cuentas bancarias" /> Mis cuentas bancarias
      </h1>
      <Outlet />
    </div>
  )
}

export default CuentasBancariasModule
