"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Save, AlertTriangle } from "lucide-react"
import FormField from "./FormField"

const AccountSettings = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear errors when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required"
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required"
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters"
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    }, 1000)
  }

  const dangerActions = [
    {
      title: "Export Your Data",
      description: "Download all your data including profile, learning history, and progress.",
      buttonText: "Export Data",
      buttonClass: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Delete Account",
      description: "Permanently delete your account and all associated data. This action cannot be undone.",
      buttonText: "Delete Account",
      buttonClass: "bg-red-600 hover:bg-red-700",
      icon: <AlertTriangle className="h-5 w-5 mr-2" />,
    },
  ]

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 transition-colors duration-200">
        Account Settings
      </h2>

      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-200">
          Change Password
        </h3>

        <form onSubmit={handleSubmit}>
          <FormField
            label="Current Password"
            id="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
            error={errors.currentPassword}
          />

          <FormField
            label="New Password"
            id="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
            error={errors.newPassword}
            helpText="Password must be at least 8 characters long"
          />

          <FormField
            label="Confirm New Password"
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
            error={errors.confirmPassword}
          />

          <div className="mt-6 flex items-center justify-end">
            {success && (
              <motion.p
                className="mr-4 text-sm text-green-600 dark:text-green-400 transition-colors duration-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                Password updated successfully!
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Password
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-8 transition-colors duration-200">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-200">
          Account Actions
        </h3>

        <div className="space-y-6">
          {dangerActions.map((action, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-colors duration-200">
              <h4 className="text-base font-medium text-gray-800 dark:text-gray-100 transition-colors duration-200">
                {action.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-3 transition-colors duration-200">
                {action.description}
              </p>
              <motion.button
                className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${action.buttonClass} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 transition-colors duration-200`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {action.icon}
                {action.buttonText}
              </motion.button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AccountSettings

