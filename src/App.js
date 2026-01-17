import React from 'react'
import { ToastProvider } from 'react-toast-notifications'
import AppRoutes from 'routing'
import { GlobalProvider } from './context'
import 'primeicons/primeicons.css'
import 'primereact/resources/primereact.min.css'
import 'primereact/resources/themes/lara-light-blue/theme.css'
import './style.scss'

const App = () => (
  <GlobalProvider>
    <ToastProvider placement="bottom-right" autoDismissTimeout={5000}>
      <AppRoutes />
    </ToastProvider>
  </GlobalProvider>
)

export default App
