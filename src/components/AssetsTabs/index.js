import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import ROUTES from 'routing/routes'

const AssetsTabs = ({ children }) => {
  const location = useLocation()

  const [selected, setSelected] = useState(location.pathname === ROUTES.ASSETS_ASSIGNMENT ? 0 : 1)

  const clickOption = opt => {
    setSelected(opt)
  }

  return (
    <div className="actives-module">
      <h1>Modulo Activos</h1>
      <div className="module">
        <div className={selected === 0 ? 'active' : ''}>
          <Link to="/assets-assignment" onClick={() => clickOption(0)}>
            Asignacion de Activos
          </Link>
        </div>
        <div className={selected === 1 ? 'active' : ''}>
          <Link to="/assets" onClick={() => clickOption(1)}>
            Administrador de Activos
          </Link>
        </div>
      </div>
      {children}
    </div>
  )
}
export default AssetsTabs
