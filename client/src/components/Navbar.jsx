"use client"

import { useState } from "react"
import { Link } from "react-router"
import { Menu, Bell, User, Moon, Sun, LogIn } from "lucide-react"
import { motion } from "framer-motion"
import { useTheme } from "./ThemeProvider"
import { useAuth } from "../contexts/AuthContext"

const Navbar = ({ toggleSidebar, toggleAdminMode, isAdmin }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { currentUser, logout } = useAuth()

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm z-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center md:hidden">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors duration-200"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="h-8 w-auto text-2xl font-bold text-emerald-500 dark:text-emerald-400">
                {isAdmin ? "VocaLearn Admin" : "VocaLearn"}
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
                <div className="flex space-x-4">
                  <motion.button
                    onClick={toggleTheme}
                    className="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {theme === "light" ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
                  </motion.button>

                  {currentUser && (
                    <motion.button
                      className="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Bell className="h-6 w-6" />
                    </motion.button>
                  )}

                  {currentUser ? (
                    <div className="ml-3 relative">
                      <div>
                        <button
                          onClick={() => setDropdownOpen(!dropdownOpen)}
                          className="bg-white dark:bg-gray-700 rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                        >
                          <span className="sr-only">Open user menu</span>
                          <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-500 dark:text-emerald-400 transition-colors duration-200">
                            {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                          </div>
                        </button>
                      </div>

                      {dropdownOpen && (
                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none transition-colors duration-200">
                          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{currentUser.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser.email}</p>
                          </div>
                          <Link
                            to="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                            onClick={() => setDropdownOpen(false)}
                          >
                            Your Profile
                          </Link>
                          <Link
                            to="/settings"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                            onClick={() => setDropdownOpen(false)}
                          >
                            Settings
                          </Link>
                          <button
                            onClick={toggleAdminMode}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                          >
                            {isAdmin ? "Exit Admin Mode" : "Admin Mode"}
                          </button>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                          >
                            Sign out
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link to="/login">
                      <motion.button
                        className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign In
                      </motion.button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar

