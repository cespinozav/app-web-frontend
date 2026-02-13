import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from 'components/Layout'
import Login from 'pages/Login'
import NewPassword from 'pages/Login/NewPassword'
import Dashboard from 'pages/Dashboard'
import InventarioModule from 'pages/Inventario/InventarioModule'
import Productos from 'pages/Inventario/Productos'
import Mantenimientos from 'pages/Inventario/Mantenimientos'
import ClientesModule from 'pages/Clientes/ClientesModule'
import Clientes from 'pages/Clientes/Clientes'
import MantenimientoClientes from 'pages/Clientes/Mantenimiento'
import UsuariosModule from 'pages/Usuarios/UsuariosModule'
import Usuarios from 'pages/Usuarios/Usuarios'
import MantenimientoUsuarios from 'pages/Usuarios/Mantenimiento'
import Perfil from 'pages/Perfil'
import ROUTES from 'routing/routes'
import OrdenesModule from '../pages/Ordenes/OrdenesModule'
import Ordenes from '../pages/Ordenes/Ordenes'
import NuevaOrden from '../pages/Ordenes/NuevaOrden'
import AuthGuard from './AuthGuard'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.PASSWORD_RESET_CONFIRM} element={<NewPassword />} />
        <Route element={<AuthGuard />}>
          <Route element={<Layout />}>
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.ORDERS} element={<OrdenesModule />}>
              <Route index element={<Navigate to={ROUTES.ORDERS_MAIN} replace />} />
              <Route path={ROUTES.ORDERS_MAIN} element={<Ordenes />} />
              <Route path={ROUTES.ORDERS_CREATE} element={<NuevaOrden />} />
            </Route>
            <Route path={ROUTES.INVENTORY} element={<InventarioModule />}>
              <Route index element={<Navigate to={ROUTES.INVENTORY_PRODUCTS} replace />} />
              <Route path={ROUTES.INVENTORY_PRODUCTS} element={<Productos />} />
              <Route path={ROUTES.INVENTORY_MAINTENANCE} element={<Mantenimientos />} />
            </Route>
            <Route path={ROUTES.CLIENTS} element={<ClientesModule />}>
              <Route index element={<Navigate to={ROUTES.CLIENTS_MAIN} replace />} />
              <Route path={ROUTES.CLIENTS_MAIN} element={<Clientes />} />
              <Route path={ROUTES.CLIENTS_MAINTENANCE} element={<MantenimientoClientes />} />
            </Route>
            <Route path={ROUTES.USERS} element={<UsuariosModule />}>
              <Route index element={<Navigate to={ROUTES.USERS_MAIN} replace />} />
              <Route path={ROUTES.USERS_MAIN} element={<Usuarios />} />
              <Route path={ROUTES.USERS_MAINTENANCE} element={<MantenimientoUsuarios />} />
            </Route>
            <Route path={ROUTES.PROFILE} element={<Perfil />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
