"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Save, Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "../../components/ThemeProvider"
import SelectField from "./SelectField"

const AppearanceSettings = () => {
  const { theme, toggleTheme } = useTheme()
  const [selectedTheme, setSelectedTheme] = useState(theme || "system")
  const [fontSize, setFontSize] = useState("medium")
  const [reducedMotion, setReducedMotion] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const themeOptions = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
  ]

  const fontSizeOptions = [
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" },
    { value: "x-large", label: "Extra Large" },
  ]

  const handleThemeChange = (e) => {
    const newTheme = e.target.value
    setSelectedTheme(newTheme)

    // Update theme in the app
    if (newTheme === "light" && theme !== "light") {
      toggleTheme()
    } else if (newTheme === "dark" && theme !== "dark") {
      toggleTheme()
    }
  }

  const handleFontSizeChange = (e) => {
    setFontSize(e.target.value)
  }

  const handleReducedMotionToggle = () => {
    setReducedMotion(!reducedMotion)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    }, 1000)
  }

  // Theme cards for visual selection
  const themeCards = [
    {
      id: "light",
      name: "Light",
      icon: <Sun className="h-5 w-5" />,
      bgClass: "bg-white",
      textClass: "text-gray-800",
      borderClass: "border-gray-200",
    },
    {
      id: "dark",
      name: "Dark",
      icon: <Moon className="h-5 w-5" />,
      bgClass: "bg-gray-800",
      textClass: "text-white",
      borderClass: "border-gray-700",
    },
    {
      id: "system",
      name: "System",
      icon: <Monitor className="h-5 w-5" />,
      bgClass: "bg-gradient-to-r from-white to-gray-800",
      textClass: "text-gray-800",
      borderClass: "border-gray-300",
    },
  ]

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 transition-colors duration-200">
        Appearance Settings
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {/* Theme Selection */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5 transition-colors duration-200">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-200">
              Theme
            </h3>

            <div className="grid grid-cols-3 gap-4 mb-4">
              {themeCards.map((card) => (
                <motion.div
                  key={card.id}
                  className={`${card.bgClass} ${card.borderClass} border rounded-lg p-4 cursor-pointer transition-colors duration-200 ${
                    selectedTheme === card.id ? "ring-2 ring-emerald-500" : ""
                  }`}
                  onClick={() => setSelectedTheme(card.id)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex flex-col items-center">
                    <div className={`${card.textClass} mb-2`}>{card.icon}</div>
                    <span className={`${card.textClass} text-sm font-medium`}>{card.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <SelectField
              label="Theme Mode"
              id="theme"
              value={selectedTheme}
              onChange={handleThemeChange}
              options={themeOptions}
              helpText="Choose how VocaLearn appears to you"
            />
          </div>

          {/* Font Size */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5 transition-colors duration-200">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-200">
              Text Size
            </h3>

            <SelectField
              label="Font Size"
              id="fontSize"
              value={fontSize}
              onChange={handleFontSizeChange}
              options={fontSizeOptions}
              helpText="Adjust the size of text throughout the application"
            />

            <div className="mt-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg transition-colors duration-200">
              <p
                className={`text-gray-800 dark:text-gray-200 transition-colors duration-200 ${
                  fontSize === "small"
                    ? "text-sm"
                    : fontSize === "medium"
                      ? "text-base"
                      : fontSize === "large"
                        ? "text-lg"
                        : "text-xl"
                }`}
              >
                This is a preview of how text will appear with your selected size.
              </p>
            </div>
          </div>

          {/* Accessibility */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5 transition-colors duration-200">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-200">
              Accessibility
            </h3>

            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="text-base font-medium text-gray-800 dark:text-gray-100 transition-colors duration-200">
                  Reduced Motion
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                  Minimize animations throughout the application
                </p>
              </div>
              <div className="flex items-center h-5">
                <button
                  type="button"
                  role="switch"
                  aria-checked={reducedMotion}
                  onClick={handleReducedMotionToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                    reducedMotion ? "bg-emerald-500 dark:bg-emerald-600" : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  <span className="sr-only">Reduced Motion</span>
                  <motion.span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      reducedMotion ? "translate-x-6" : "translate-x-1"
                    }`}
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end">
          {success && (
            <motion.p
              className="mr-4 text-sm text-green-600 dark:text-green-400 transition-colors duration-200"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              Appearance settings saved successfully!
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
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  )
}

export default AppearanceSettings

