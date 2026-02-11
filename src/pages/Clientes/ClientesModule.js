import { Link, Outlet, useLocation } from 'react-router-dom';
import CLIENTS_ICON from 'assets/img/icons/folder-shared.svg';
import MAINTENANCE_ICON from 'assets/img/icons/settings.svg';
import { SUB_ROUTES } from 'routing/routes';
import './style.scss';

function ClientesModule() {
  const { pathname } = useLocation();
  const isClientsActive = pathname === SUB_ROUTES.CLIENTS.MAIN;
  const isMaintenanceActive = pathname === SUB_ROUTES.CLIENTS.MAINTENANCE;
  return (
    <div>
      <h1>
        <img src={CLIENTS_ICON} alt="clientes icon" /> Clientes
      </h1>
      <div className="module">
        <div className={isClientsActive ? 'active' : ''}>
          <Link to={SUB_ROUTES.CLIENTS.MAIN}>
            <img src={CLIENTS_ICON} alt="clientes icon" />
            Clientes
          </Link>
        </div>
        <div className={isMaintenanceActive ? 'active' : ''}>
          <Link to={SUB_ROUTES.CLIENTS.MAINTENANCE}>
            <img src={MAINTENANCE_ICON} alt="mantenimientos icon" />
            Mantenimiento
          </Link>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
export default ClientesModule;