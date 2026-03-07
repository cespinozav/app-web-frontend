import { Link, Outlet, useLocation } from 'react-router-dom';
import CATALOG_ICON from 'assets/img/icons/files.svg';
import CART_ICON from 'assets/img/icons/note-add.svg';
import { SUB_ROUTES } from 'routing/routes';
import './style.scss';

function CatalogoModule() {
  const { pathname } = useLocation();
  const isMainActive = pathname === SUB_ROUTES.CATALOG.MAIN;
  const isCartActive = pathname === SUB_ROUTES.CATALOG.CART;

  return (
    <div>
      <h1>
        <img src={CATALOG_ICON} alt="ícono de catálogo" /> Catálogo
      </h1>
      <div className="module">
        <div className={isMainActive ? 'active' : ''}>
          <Link to={SUB_ROUTES.CATALOG.MAIN}>
            <img src={CATALOG_ICON} alt="listado de productos" />
            Listado de Productos
          </Link>
        </div>
        <div className={isCartActive ? 'active' : ''}>
          <Link to={SUB_ROUTES.CATALOG.CART}>
            <img src={CART_ICON} alt="carrito" />
            Carrito
          </Link>
        </div>
      </div>
      <hr style={{ border: 'none', borderBottom: '1.5px solid #ecebeb', margin: '16px 0' }} />
      <Outlet />
    </div>
  );
}

export default CatalogoModule;
