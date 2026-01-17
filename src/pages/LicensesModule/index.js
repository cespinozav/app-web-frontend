import { Link, Outlet, useLocation } from 'react-router-dom'
import LAPTOP from 'assets/img/laptop.png'
import FOLDER from 'assets/img/folder.png'
import FOLDER_SELECTED from 'assets/img/folder_selected.png'
import FOLDER_SHARED from 'assets/img/icons/folder-shared.svg'
import ROUTES, { SUB_ROUTES } from 'routing/routes'

function LicensesTabs() {
  const { pathname } = useLocation()
  const isAssignmentActive = pathname === SUB_ROUTES.LICENSE_MODULE.LICENSE_ASSIGNMENT || pathname === ROUTES.LICENSES
  const isMaintenanceActive = pathname === SUB_ROUTES.LICENSE_MODULE.LICENSE_MAINTENANCE
  const isReportActive = pathname === SUB_ROUTES.LICENSE_MODULE.LICENSE_REPORT

  return (
    <div className="licenses-module">
      <h1>
        <img src={LAPTOP} alt="laptop icon" /> Módulo Licencias
      </h1>
      <div className="module">
        <div className={isAssignmentActive ? 'active' : ''}>
          <Link to={SUB_ROUTES.LICENSE_MODULE.LICENSE_ASSIGNMENT}>
            <img src={FOLDER_SHARED} alt="folder shared" />
            Asignacion de Licencias
          </Link>
        </div>
        <div className={isMaintenanceActive ? 'active' : ''}>
          <Link to={SUB_ROUTES.LICENSE_MODULE.LICENSE_MAINTENANCE}>
            <img src={isMaintenanceActive ? FOLDER_SELECTED : FOLDER} alt="folder" />
            Mantenimiento
          </Link>
        </div>
        <div className={isReportActive ? 'active' : ''}>
          <Link to={SUB_ROUTES.LICENSE_MODULE.LICENSE_REPORT}>
            <img src={FOLDER_SHARED} alt="folder shared" />
            Reporte
          </Link>
        </div>
      </div>
      <Outlet />
    </div>
  )
}
export default LicensesTabs
