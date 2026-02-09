import { useState, useContext } from 'react'
import MENU_BTN from 'assets/img/menu.png'
import LOGO from 'assets/img/logo.png'
import DASHBOARD_ICON from 'assets/img/icons/dashboard.svg'
import INVENTORY_ICON from 'assets/img/icons/file.svg'
import CLIENTS_ICON from 'assets/img/icons/folder-shared.svg';
import SETTINGS_ICON from 'assets/img/icons/settings.svg'
// Puedes cambiar el ícono por uno específico de usuarios si lo tienes
import USERS_ICON from 'assets/img/icons/active-user-inventory-color.svg'
import LOGO_SM from 'assets/img/talma_logo.png'
import { UserContext } from 'context'
import ROUTES, { SUB_ROUTES } from 'routing/routes'
import { Button } from 'primereact/button'
import { APP_VERSION } from 'utils/constants'
import { removeSession } from 'utils/auth'
import { Outlet } from 'react-router'
import MenuItem from './MenuItem'

function Layout() {
  const [showMenu, setShowMenu] = useState(false)
  const [userInfo, setUserinfo] = useContext(UserContext)
  const [shrinkMenu, setShrinkMenu] = useState(false)
  const clickMenu = () => {
    setShowMenu(!showMenu)
  }
  const signout = () => {
    setUserinfo(null)
    removeSession()
  }
  return (
    <div className="layout">
      <button onClick={clickMenu} className="menu_btn">
        <img src={MENU_BTN} alt="menu" />
      </button>
      <div className={`side-menu${showMenu ? ' show' : ''} ${shrinkMenu ? 'shrink' : ''}`}>
        <div>
          <header>
            <div className="brand">
              <img src={LOGO} alt="logo" />
              <img src={LOGO_SM} alt="logo" />
              <button onClick={() => setShrinkMenu(!shrinkMenu)}>
                <i className={`pi ${shrinkMenu ? 'pi-chevron-right' : 'pi-chevron-left'}`}></i>
              </button>
            </div>
            <div className="user">
              <div>{userInfo?.name}</div>
              <div>{userInfo?.job}</div>
            </div>
          </header>
          <div className="options">
            <MenuItem
              path="/"
              name="Dashboard"
              icon={DASHBOARD_ICON}
              isDefault={true}
            />
            <MenuItem
              path="/inventario"
              name="Inventario"
              icon={INVENTORY_ICON}
            />
            <MenuItem
              path="/clientes"
              name="Clientes"
              icon={CLIENTS_ICON}
            />
            <MenuItem
              path="/usuarios"
              name="Usuarios"
              icon={USERS_ICON}
            />
            <MenuItem
              path="/perfil"
              name="Perfil"
              icon={SETTINGS_ICON}
            />
          </div>
        </div>
        <div className="action">
          <Button onClick={signout} icon="pi pi-power-off">
            Cerrar Sesión
          </Button>
          <div className="version">v{APP_VERSION}</div>
        </div>
      </div>
      <div className={`content ${shrinkMenu ? 'menu-shrink' : ''}`}>
        <Outlet />
      </div>
    </div>
  )
}
export default Layout
