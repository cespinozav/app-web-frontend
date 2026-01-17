import { Link } from 'react-router-dom'
import { useLocation } from 'react-router'

function getLocalPath(pathname) {
  const localPaths = pathname.split('/')
  const localPath = localPaths.length > 2 ? localPaths.slice(0, 2).join('/') : pathname
  return localPath
}

export default function MenuItem({ path, name, icon, isDefault, defaultPath }) {
  const location = useLocation()
  const localPath = getLocalPath(location.pathname)
  const isSelected = localPath === path || (isDefault && localPath === '/')
  return (
    <Link to={defaultPath || path}>
      <div className={`item ${isSelected ? 'active' : ''}`}>
        <div className="logo">
          <img src={icon} alt={`${name} icon`} />
        </div>
        <span>{name}</span>
      </div>
    </Link>
  )
}
