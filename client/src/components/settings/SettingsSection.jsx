"use client"

import { motion } from "framer-motion"

// Reusable container for settings sections
const SettingsSection = ({ children, title, description }) => {
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-200">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-200">{description}</p>
          )}
        </div>
      )}
      {children}
    </motion.div>
  )
}

export default SettingsSection

