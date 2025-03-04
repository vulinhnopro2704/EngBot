"use client"

import { useState } from "react"
import { Menu, Bell, User, Moon, Sun, Search } from "lucide-react"
import { motion } from "framer-motion"
import { useTheme } from "../ThemeProvider"

const AdminTopbar = ({ toggleSidebar }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [notificationsOpen, setNotificationsOpen] = useState(false)
    const { theme, toggleTheme } = useTheme()

    const notifications = [
        { id: 1, message: "New user registered", time: "5 minutes ago", read: false },
        { id: 2, message: "Server update completed", time: "1 hour ago", read: false },
        { id: 3, message: "New content added", time: "3 hours ago", read: true },
        { id: 4, message: "Weekly report available", time: "1 day ago", read: true },
    ]

    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10 transition-colors duration-200">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden transition-colors duration-200"
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        <div className="ml-4 md:ml-0 relative flex-grow max-w-md hidden md:block">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                                placeholder="Search..."
                            />
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

                                    <div className="relative">
                                        <motion.button
                                            className="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setNotificationsOpen(!notificationsOpen)}
                                        >
                                            <Bell className="h-6 w-6" />
                                            {notifications.filter((n) => !n.read).length > 0 && (
                                                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
                                            )}
                                        </motion.button>

                                        {notificationsOpen && (
                                            <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 transition-colors duration-200">
                                                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Notifications</h3>
                                                </div>
                                                <div className="max-h-60 overflow-y-auto">
                                                    {notifications.map((notification) => (
                                                        <div
                                                            key={notification.id}
                                                            className={`px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${notification.read ? "" : "bg-blue-50 dark:bg-blue-900/20"}`}
                                                        >
                                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                {notification.message}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 text-center">
                                                    <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                                                        View all notifications
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="ml-3 relative">
                                        <div>
                                            <button
                                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                                className="bg-white dark:bg-gray-700 rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                                            >
                                                <span className="sr-only">Open user menu</span>
                                                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-500 dark:text-blue-400 transition-colors duration-200">
                                                    <User className="h-5 w-5" />
                                                </div>
                                            </button>
                                        </div>

                                        {dropdownOpen && (
                                            <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 transition-colors duration-200">
                                                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Admin User</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">admin@example.com</p>
                                                </div>
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

export default AdminTopbar

