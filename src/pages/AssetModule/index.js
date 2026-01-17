import { Link, Outlet, useLocation } from 'react-router-dom'
import LAPTOP from 'assets/img/laptop.png'
import FOLDER from 'assets/img/folder.png'
import FOLDER_SELECTED from 'assets/img/folder_selected.png'
import FOLDER_SHARED from 'assets/img/icons/folder-shared.svg'
import ROUTES, { SUB_ROUTES } from 'routing/routes'

function AssetModule() {
  const { pathname } = useLocation()
  const isAssignmentActive = pathname === SUB_ROUTES.ASSET_MODULE.ASSETS_ASSIGNMENT || pathname === ROUTES.ASSETS
  const isMaintenanceActive = pathname === SUB_ROUTES.ASSET_MODULE.ASSETS_MAINTENANCE
  const isReportActive = pathname === SUB_ROUTES.ASSET_MODULE.ASSETS_REPORT
  return (
    <div>
      <h1>
        <img src={LAPTOP} alt="laptop icon" /> Módulo Activos
      </h1>
      <div className="module">
        <div className={isAssignmentActive ? 'active' : ''}>
          <Link to={SUB_ROUTES.ASSET_MODULE.ASSETS_ASSIGNMENT}>
            <img src={FOLDER_SHARED} alt="folder shared" />
            Asignacion de activos
          </Link>
        </div>
        <div className={isMaintenanceActive ? 'active' : ''}>
          <Link to={SUB_ROUTES.ASSET_MODULE.ASSETS_MAINTENANCE}>
            <img src={isMaintenanceActive ? FOLDER_SELECTED : FOLDER} alt="folder" />
            Mantenimiento de activos
          </Link>
        </div>
        <div className={isReportActive ? 'active' : ''}>
          <Link to={SUB_ROUTES.ASSET_MODULE.ASSETS_REPORT}>
            <img src={FOLDER_SHARED} alt="folder shared" />
            Reporte
          </Link>
        </div>
      </div>
      <Outlet />
    </div>
  )
}
export default AssetModule
