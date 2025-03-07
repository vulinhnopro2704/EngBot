"use client"

import { motion } from "framer-motion"

// Reusable toggle switch component
const ToggleSwitch = ({ id, label, checked, onChange, description = "", disabled = false }) => {
  return (
    <div className="flex items-start py-3">
      <div className="flex items-center h-5">
        <button
          type="button"
          id={id}
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => !disabled && onChange(!checked)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
            checked ? "bg-emerald-500 dark:bg-emerald-600" : "bg-gray-200 dark:bg-gray-700"
          } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <span className="sr-only">{label}</span>
          <motion.span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              checked ? "translate-x-6" : "translate-x-1"
            }`}
            layout
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </button>
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={id} className="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
          {label}
        </label>
        {description && (
          <p className="text-gray-500 dark:text-gray-400 transition-colors duration-200">{description}</p>
        )}
      </div>
    </div>
  )
}

export default ToggleSwitch

