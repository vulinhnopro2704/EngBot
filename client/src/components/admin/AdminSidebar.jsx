"use client"

import { Link, useLocation } from "react-router"
import {
  Home,
  Users,
  Database,
  Settings,
  X,
  BarChart2,
  BookOpen,
  CheckSquare,
  Headphones,
  Edit,
  Book,
  LogOut,
} from "lucide-react"
import { motion } from "framer-motion"

const AdminSidebar = ({ open, toggleSidebar }) => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  const menuItems = [
    { path: "/admin", icon: Home, label: "Dashboard" },
    { path: "/admin/users", icon: Users, label: "Users" },
    { path: "/admin/content", icon: Database, label: "Content" },
    { path: "/admin/flashcards", icon: BookOpen, label: "Flashcards" },
    { path: "/admin/quizzes", icon: CheckSquare, label: "Quizzes" },
    { path: "/admin/reading", icon: Book, label: "Reading" },
    { path: "/admin/listening", icon: Headphones, label: "Listening" },
    { path: "/admin/writing", icon: Edit, label: "Writing" },
    { path: "/admin/analytics", icon: BarChart2, label: "Analytics" },
    { path: "/admin/settings", icon: Settings, label: "Settings" },
  ]

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">Admin Panel</span>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden transition-colors duration-200"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <nav className="mt-5 px-2 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-200 ${isActive(item.path)
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="mr-4">
              <item.icon className="h-6 w-6" />
            </motion.div>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full border-t border-gray-200 dark:border-gray-700">
        <div className="px-2 py-4">
          <Link
            to="/"
            className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="mr-4">
              <LogOut className="h-6 w-6" />
            </motion.div>
            Exit Admin Mode
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminSidebar

