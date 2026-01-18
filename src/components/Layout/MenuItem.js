
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function getLocalPath(pathname) {
  const localPaths = pathname.split('/')
  const localPath = localPaths.length > 2 ? localPaths.slice(0, 2).join('/') : pathname
  return localPath
}

export default function MenuItem({ path, name, icon, isDefault, defaultPath, subRoutes }) {
  const location = useLocation()
  const localPath = getLocalPath(location.pathname)
  const isSelected = localPath === path || (isDefault && localPath === '/')
  const [open, setOpen] = useState(false)

  if (subRoutes && subRoutes.length > 0) {
    return (
      <div className={`item ${isSelected ? 'active' : ''} ${open ? 'open' : ''}`} style={{ flexDirection: 'column', cursor: 'pointer', padding: 0 }}>
        <div className="item main-item" onClick={() => setOpen(!open)}>
          <div className="logo">
            <img src={icon} alt={`${name} icon`} style={{ width: 16, height: 16 }} />
          </div>
          <span>{name}</span>
          <span style={{ marginLeft: 'auto', fontSize: 12 }}>{open ? '▲' : '▼'}</span>
        </div>
        {open && (
          <div className="submenu" style={{ marginLeft: 32, width: '100%' }}>
            {subRoutes.map(sub => (
              <Link to={sub.path} key={sub.path} style={{ textDecoration: 'none' }}>
                <div className="item subitem">
                  <span>{sub.name}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }
  return (
    <Link to={defaultPath || path}>
      <div className={`item ${isSelected ? 'active' : ''}`}>
        <div className="logo">
          <img src={icon} alt={`${name} icon`} style={{ width: 16, height: 16 }} />
        </div>
        <span>{name}</span>
      </div>
    </Link>
  )
}
