"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Save, Shield, Eye, EyeOff } from "lucide-react"
import ToggleSwitch from "./ToggleSwitch"

const PrivacySettings = () => {
  // Define privacy settings with default values
  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    showProgress: true,
    showAchievements: true,
    allowFriendRequests: true,
    shareActivity: false,
    dataCollection: true,
    cookieConsent: true,
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Group privacy settings for better organization
  const privacyGroups = [
    {
      title: "Profile Privacy",
      icon: <Eye className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
      settings: [
        {
          id: "publicProfile",
          label: "Public Profile",
          description: "Make your profile visible to other users",
        },
        {
          id: "showProgress",
          label: "Show Learning Progress",
          description: "Display your learning progress on your profile",
        },
        {
          id: "showAchievements",
          label: "Show Achievements",
          description: "Display your achievements on your profile",
        },
      ],
    },
    {
      title: "Social Privacy",
      icon: <EyeOff className="h-5 w-5 text-purple-500 dark:text-purple-400" />,
      settings: [
        {
          id: "allowFriendRequests",
          label: "Allow Friend Requests",
          description: "Let other users send you friend requests",
        },
        {
          id: "shareActivity",
          label: "Share Learning Activity",
          description: "Share your learning activity with friends",
        },
      ],
    },
    {
      title: "Data Privacy",
      icon: <Shield className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />,
      settings: [
        {
          id: "dataCollection",
          label: "Data Collection",
          description: "Allow us to collect usage data to improve your experience",
        },
        {
          id: "cookieConsent",
          label: "Cookie Consent",
          description: "Allow us to use cookies to enhance your browsing experience",
        },
      ],
    },
  ]

  const handleToggle = (id, value) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [id]: value,
    }))
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

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 transition-colors duration-200">
        Privacy Settings
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {privacyGroups.map((group, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5 transition-colors duration-200">
              <div className="flex items-center mb-4">
                {group.icon}
                <h3 className="ml-2 text-lg font-medium text-gray-800 dark:text-gray-100 transition-colors duration-200">
                  {group.title}
                </h3>
              </div>

              <div className="space-y-2">
                {group.settings.map((setting) => (
                  <ToggleSwitch
                    key={setting.id}
                    id={setting.id}
                    label={setting.label}
                    description={setting.description}
                    checked={privacySettings[setting.id]}
                    onChange={(value) => handleToggle(setting.id, value)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-end">
          {success && (
            <motion.p
              className="mr-4 text-sm text-green-600 dark:text-green-400 transition-colors duration-200"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              Privacy settings saved successfully!
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

export default PrivacySettings

