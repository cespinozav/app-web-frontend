import { Outlet } from 'react-router-dom'
import './style.scss'

function LoginModule() {
  return (
    <div className="login-module">
      <Outlet />
    </div>
  )
}

export default LoginModule
