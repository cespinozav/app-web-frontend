import { useState, useContext } from 'react'
import MENU_BTN from 'assets/img/menu.png'
import LOGO from 'assets/img/logo.png'
import PHONE from 'assets/img/icons/phone.svg'
import FILE from 'assets/img/icons/file.svg'
import MODULE from 'assets/img/laptop.png'
// import DASH from 'assets/img/icons/dashboard.svg'
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
            {/* <MenuItem path={ROUTES.DASHBOARD_LICENSE} name="Dashboard" icon={DASH} /> */}
            {userInfo?.modules?.MOBILE && (
              <MenuItem
                path={ROUTES.MOBILE_MODULE}
                name="Módulo Móvil"
                icon={PHONE}
                isDefault={true}
                defaultPath={SUB_ROUTES.MOBILE_MODULE.KIT_ASSIGNMENT}
              />
            )}
            {userInfo?.modules?.LICENSE && (
              <MenuItem
                path={ROUTES.LICENSE_MODULE}
                name="Módulo Licencia"
                icon={FILE}
                defaultPath={SUB_ROUTES.LICENSE_MODULE.LICENSE_ASSIGNMENT}
              />
            )}
            {userInfo?.modules?.ASSET && (
              <MenuItem
                path={ROUTES.ASSET_MODULE}
                name="Módulo Activos"
                icon={MODULE}
                defaultPath={SUB_ROUTES.ASSET_MODULE.ASSETS_ASSIGNMENT}
              />
            )}
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
