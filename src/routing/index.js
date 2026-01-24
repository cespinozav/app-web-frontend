

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from 'pages/Login';
import Dashboard from 'pages/Dashboard';
import InventarioModule from 'pages/Inventario/InventarioModule';
import Productos from 'pages/Inventario/Productos';
import Mantenimientos from 'pages/Inventario/Mantenimientos';
import Perfil from 'pages/Perfil';
import ROUTES from 'routing/routes';
import AuthGuard from './AuthGuard';
import Layout from 'components/Layout';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route element={<AuthGuard />}>
          <Route element={<Layout />}>
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.INVENTORY} element={<InventarioModule />}>
              <Route index element={<Navigate to={ROUTES.INVENTORY_PRODUCTS} replace />} />
              <Route path={ROUTES.INVENTORY_PRODUCTS} element={<Productos />} />
              <Route path={ROUTES.INVENTORY_MAINTENANCE} element={<Mantenimientos />} />
            </Route>
            <Route path={ROUTES.PROFILE} element={<Perfil />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
