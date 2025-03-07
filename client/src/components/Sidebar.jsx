"use client"

import { Link, useLocation } from "react-router"
import {
  Home,
  BookOpen,
  CheckSquare,
  Clock,
  BarChart2,
  Settings,
  X,
  Bot,
  Headphones,
  Edit,
  Book,
  Users,
  Database,
  Sliders,
  GraduationCap,
} from "lucide-react"
import { motion } from "framer-motion"

const Sidebar = ({ open, toggleSidebar, isAdmin }) => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  const regularMenuItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/lessons", icon: GraduationCap, label: "Lessons" },
    { path: "/flashcards", icon: BookOpen, label: "Flashcards" },
    { path: "/quiz", icon: CheckSquare, label: "Quizzes" },
    { path: "/review", icon: Clock, label: "Review" },
    { path: "/listening", icon: Headphones, label: "Listening" },
    { path: "/writing", icon: Edit, label: "Writing" },
    { path: "/reading", icon: Book, label: "Reading" },
    { path: "/chatbot", icon: Bot, label: "AI Chatbot" },
    { path: "/progress", icon: BarChart2, label: "Progress" },
  ]

  const adminMenuItems = [
    { path: "/admin", icon: Home, label: "Dashboard" },
    { path: "/admin/users", icon: Users, label: "Users" },
    { path: "/admin/content", icon: Database, label: "Content" },
    { path: "/admin/settings", icon: Sliders, label: "Settings" },
  ]

  const menuItems = isAdmin ? adminMenuItems : regularMenuItems

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-emerald-500 dark:text-emerald-400">
            {isAdmin ? "Admin Panel" : "VocaLearn"}
          </span>
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
                ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                : "text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400"
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
            to="/settings"
            className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200"
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="mr-4">
              <Settings className="h-6 w-6" />
            </motion.div>
            Settings
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Sidebar

