import { Link, Outlet, useLocation } from 'react-router-dom';
import CLIENTS_ICON from 'assets/img/icons/active-user.svg';
import MAINTENANCE_ICON from 'assets/img/icons/settings.svg';
import { SUB_ROUTES } from 'routing/routes';
import './style.scss';

function UsuariosModule() {
  const { pathname } = useLocation();
  const isUsuariosActive = pathname === SUB_ROUTES.USERS.MAIN;
  const isMaintenanceActive = pathname === SUB_ROUTES.USERS.MAINTENANCE;
  return (
    <div>
      <h1>
        <img src={CLIENTS_ICON} alt="usuarios icon" /> Usuarios
      </h1>
      <div className="module">
        <div className={isUsuariosActive ? 'active' : ''}>
          <Link to={SUB_ROUTES.USERS.MAIN}>
            <img src={CLIENTS_ICON} alt="usuarios icon" />
            Usuarios
          </Link>
        </div>
        <div className={isMaintenanceActive ? 'active' : ''}>
          <Link to={SUB_ROUTES.USERS.MAINTENANCE}>
            <img src={MAINTENANCE_ICON} alt="mantenimientos icon" />
            Mantenimiento
          </Link>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
export default UsuariosModule;
