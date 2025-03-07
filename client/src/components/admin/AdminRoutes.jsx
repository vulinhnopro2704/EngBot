"use client"

import { Route, Routes, useLocation } from "react-router"
import { AnimatePresence } from "framer-motion"

import AdminDashboard from "../../pages/admin/AdminDashboard"
import AdminUsers from "../../pages/admin/AdminUsers"
import AdminContent from "../../pages/admin/AdminContent"
import AdminSettings from "../../pages/admin/AdminSettings"
import AdminLayout from "./AdminLayout"

const AdminRoutes = () => {
  const location = useLocation()

  return (
    <AdminLayout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/content" element={<AdminContent />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Routes>
      </AnimatePresence>
    </AdminLayout>
  )
}

export default AdminRoutes

