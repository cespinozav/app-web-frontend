import { UserContext } from 'context'
import { useContext } from 'react'
import { Navigate } from 'react-router'

export default function DefaultModule() {
  const [userinfo] = useContext(UserContext)
  if (userinfo?.modules) return <Navigate to={userinfo.modules.DEFAULT} />
  return <div>No tiene autorización</div>
}
