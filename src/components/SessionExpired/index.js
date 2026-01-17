import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { removeSession } from 'utils/auth'
import ROUTES from 'routing/routes'

const TIMEOUT = 10000

export default function SessionExpired(props) {
  const timeout = props.timeout || TIMEOUT
  const [seconds, setSeconds] = useState(timeout / 1000)
  const navigate = useNavigate()
  const redirectToLogin = () => {
    removeSession()
    navigate(ROUTES.LOGIN)
  }
  useEffect(() => {
    const intervalRef = setInterval(() => {
      setSeconds(s => s - 1)
    }, 1000)
    const timeoutRef = setTimeout(() => {
      redirectToLogin()
    }, timeout)
    return () => {
      removeSession()
      clearTimeout(timeoutRef)
      clearInterval(intervalRef)
    }
  }, [])
  return (
    <main className="session-expired">
      <h1>Sesión Expirada</h1>
      <section>
        <p>Haga clic en Refrescar para iniciar sesión nuevamente.</p>
        <p>
          Se redireccionará automáticamente en <strong>{seconds} segundos</strong>.
        </p>
        <div className="buttons">
          <button className="button" onClick={redirectToLogin}>
            Refrescar
          </button>
        </div>
      </section>
    </main>
  )
}
