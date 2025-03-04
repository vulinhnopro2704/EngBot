"use client"

import { useState } from "react"
import { useLocation } from "react-router"
import AdminSidebar from "./AdminSidebar"
import AdminTopbar from "./AdminTopbar"
import { motion } from "framer-motion"

const AdminLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const location = useLocation()

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    return (
        <div className="flex w-screen h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
            <AdminSidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminTopbar toggleSidebar={toggleSidebar} />

                <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-200">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    )
}

export default AdminLayout

