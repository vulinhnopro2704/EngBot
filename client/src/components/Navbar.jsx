"use client"

import { useState } from "react"
import { Menu, Bell, User, Moon, Sun } from "lucide-react"
import { motion } from "framer-motion"
import { useTheme } from "./ThemeProvider"

const Navbar = ({ toggleSidebar, toggleAdminMode, isAdmin }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

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
              <span className="h-8 w-auto text-2xl font-bold text-emerald-500 dark:text-emerald-400">
                {isAdmin ? "VocaLearn Admin" : "VocaLearn"}
              </span>
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

                  <motion.button
                    className="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Bell className="h-6 w-6" />
                  </motion.button>

                  <div className="ml-3 relative">
                    <div>
                      <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="bg-white dark:bg-gray-700 rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                      >
                        <span className="sr-only">Open user menu</span>
                        <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-500 dark:text-emerald-400 transition-colors duration-200">
                          <User className="h-5 w-5" />
                        </div>
                      </button>
                    </div>

                    {dropdownOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none transition-colors duration-200">
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          Your Profile
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          Settings
                        </a>
                        <button
                          onClick={toggleAdminMode}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          {isAdmin ? "Exit Admin Mode" : "Admin Mode"}
                        </button>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          Sign out
                        </a>
                      </div>
                    )}
                  </div>
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

