import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import KitAssignment from 'pages/KitAssignment'
import KitReport from 'pages/KitReport'
import KitMaintenance from 'pages/KitMaintenance'
import LicenseAssignment from 'pages/LicenseAssignment'
import Login from 'pages/Login'
import Layout from 'components/Layout'
import MobileModule from 'pages/MobileModule'
import LicenseModule from 'pages/LicensesModule'
import AssetModule from 'pages/AssetModule'
import LicenseMaintenance from 'pages/LicenseMaintenance'
import ROUTES from 'routing/routes'
import AssetAssignment from 'pages/AssetsAssignment'
import AssetMaintenance from 'pages/AssetsMaintenance'
import LicenseReport from 'pages/LicenseReport'
import AssetReport from 'pages/AssetReport'
import NotFound from 'components/NotFound'
import AuthGuard from './AuthGuard'
import DefaultModule from './DefaultRoute'
import RoleGuard from './RoleGuard'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route element={<AuthGuard />}>
          <Route element={<Layout />}>
            <Route path="/" element={<DefaultModule />} />
            <Route
              path={ROUTES.MOBILE_MODULE}
              element={
                <RoleGuard module="MOBILE">
                  <MobileModule />
                </RoleGuard>
              }
            >
              <Route index element={<KitAssignment />} />
              <Route path={ROUTES.KIT_ASSIGNMENT} element={<KitAssignment />} />
              <Route path={ROUTES.KIT_MAINTENANCE} element={<KitMaintenance />} />
              <Route path={ROUTES.KIT_REPORT} element={<KitReport />} />
            </Route>
            <Route
              path={ROUTES.LICENSE_MODULE}
              element={
                <RoleGuard module="LICENSE">
                  <LicenseModule />
                </RoleGuard>
              }
            >
              <Route index element={<LicenseAssignment />} />
              <Route path={ROUTES.LICENSE_ASSIGNMENT} element={<LicenseAssignment />} />
              <Route path={ROUTES.LICENSE_MAINTENANCE} element={<LicenseMaintenance />} />
              <Route path={ROUTES.LICENSE_REPORT} element={<LicenseReport />} />
            </Route>
            <Route
              path={ROUTES.ASSET_MODULE}
              element={
                <RoleGuard module="ASSET">
                  <AssetModule />
                </RoleGuard>
              }
            >
              <Route index element={<AssetAssignment />} />
              <Route path={ROUTES.ASSETS_ASSIGNMENT} element={<AssetAssignment />} />
              <Route path={ROUTES.ASSETS_MAINTENANCE} element={<AssetMaintenance />} />
              <Route path={ROUTES.ASSETS_REPORT} element={<AssetReport />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
