import { UserContext } from 'context'
import { useContext } from 'react'
import { Navigate } from 'react-router'

export default function RoleGuard({ children, module }) {
  // const location = useLocation()
  const [userinfo] = useContext(UserContext)
  // const module = parsePathToModule(location.pathname)
  if (userinfo?.modules && userinfo.modules[module]) return children
  return <Navigate to="/" />
}
