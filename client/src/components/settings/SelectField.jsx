"use client"

import { ChevronDown } from "lucide-react"

// Reusable select field component
const SelectField = ({
  label,
  id,
  value,
  onChange,
  options = [],
  required = false,
  disabled = false,
  error = "",
  helpText = "",
  className = "",
}) => {
  const baseSelectClasses =
    "block w-full px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 appearance-none"
  const selectClasses = `${baseSelectClasses} ${error ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"} ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${className}`

  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={selectClasses}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">{helpText}</p>
      )}

      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{error}</p>}
    </div>
  )
}

export default SelectField

