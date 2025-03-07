"use client"

// Reusable form field component
const FormField = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  disabled = false,
  error = "",
  helpText = "",
  className = "",
  children,
}) => {
  const baseInputClasses =
    "block w-full px-3 py-2 border rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
  const inputClasses = `${baseInputClasses} ${error ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-gray-600"} ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${className}`

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

      {children ? (
        children
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClasses}
        />
      )}

      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">{helpText}</p>
      )}

      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{error}</p>}
    </div>
  )
}

export default FormField

