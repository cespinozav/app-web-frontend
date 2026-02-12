import { createContext, useRef, useState } from 'react'
import { Toast } from 'primereact/toast'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AUTHORIZER, ROLES } from 'routing/roles'

const UserContext = createContext()
const ToastContext = createContext()
const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

const GlobalProvider = ({ children }) => {
  const toastRef = useRef()
  const showToast = messages => toastRef.current.show(messages)
  const [userinfo, setUserinfo] = useState({
    name: '',
    user: '',
    job: '',
    role: ROLES.DEFAULT,
    modules: null
  })
  const updateUserinfo = info => {
    if (info) {
      const modules = AUTHORIZER[info?.role]
      setUserinfo({ ...info, modules })
    } else {
      setUserinfo(info)
    }
  }
  return (
    <QueryClientProvider client={client}>
      <UserContext.Provider value={[userinfo, updateUserinfo]}>
        <ToastContext.Provider value={showToast}>
          {children}
          <Toast ref={toastRef} position="bottom-right" life={5000} />
        </ToastContext.Provider>
      </UserContext.Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export { GlobalProvider, UserContext, ToastContext }
