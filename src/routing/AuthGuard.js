import LoadingScreen from 'components/LoadingScreen'
import SessionExpired from 'components/SessionExpired'
import { UserContext } from 'context'
import { useContext, useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router'
import { removeSession, hasToken } from 'utils/auth'
import { getUser, isSessionExpired } from 'utils/network'
import ROUTES from 'routing/routes'

const AUTH_STATE = {
  FETCHING: 'FETCHING',
  FETCHED: 'FETCHED',
  MOUNTING: 'MOUNTING',
  MOUNTED: 'MOUNTED'
}

export default function AuthGuard() {
  const [userinfo, setUserinfo] = useContext(UserContext)
  const [authState, setAuthState] = useState(AUTH_STATE.MOUNTING)
  const [sede, setSede] = useState(() => {
    const stored = localStorage.getItem('selectedSede')
    return stored ? JSON.parse(stored) : null
  })
  useEffect(() => {
    setAuthState(AUTH_STATE.MOUNTED)
    if (!isSessionExpired() && hasToken()) {
      setAuthState(AUTH_STATE.FETCHING)
      getUser()
        .then(data => {
          setUserinfo(data)
          setAuthState(AUTH_STATE.FETCHED)
        })
        .catch(() => {
          removeSession()
          setUserinfo(null)
          setAuthState(AUTH_STATE.FETCHED)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    const stored = localStorage.getItem('selectedSede')
    setSede(stored ? JSON.parse(stored) : null)
  }, [userinfo])
  if (authState === AUTH_STATE.FETCHING || authState === AUTH_STATE.MOUNTING) return <LoadingScreen />
  if (isSessionExpired()) {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('selectedSede')
    localStorage.removeItem('EXPIRED')
    setUserinfo(null)
    return <Navigate to={ROUTES.LOGIN} replace />
  }
  if (userinfo?.user && sede) return <Outlet />
  if (userinfo?.user && !sede) {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('selectedSede')
    setUserinfo(null)
    return <Navigate to={ROUTES.LOGIN} replace />
  }
  return <Navigate to={ROUTES.LOGIN} replace />
}
