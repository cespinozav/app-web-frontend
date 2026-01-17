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
  }, [])
  if (authState === AUTH_STATE.FETCHING || authState === AUTH_STATE.MOUNTING) return <LoadingScreen />
  if (isSessionExpired()) return <SessionExpired />
  if (userinfo?.user) return <Outlet />
  return <Navigate to={ROUTES.LOGIN} replace />
}
