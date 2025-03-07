"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useAuth } from "../contexts/AuthContext"
import PageTransition from "../components/PageTransition"
import SettingsSection from "../components/settings/SettingsSection"
import ProfileSettings from "../components/settings/ProfileSettings"
import AccountSettings from "../components/settings/AccountSettings"
import NotificationSettings from "../components/settings/NotificationSettings"
import PrivacySettings from "../components/settings/PrivacySettings"
import AppearanceSettings from "../components/settings/AppearanceSettings"
import LanguageSettings from "../components/settings/LanguageSettings"

const SettingsPage = () => {
  const { currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")

  // Define all available settings tabs
  const settingsTabs = [
    { id: "profile", label: "Profile" },
    { id: "account", label: "Account" },
    { id: "notifications", label: "Notifications" },
    { id: "privacy", label: "Privacy" },
    { id: "appearance", label: "Appearance" },
    { id: "language", label: "Language" },
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  // Render the appropriate settings component based on active tab
  const renderSettingsContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings user={currentUser} />
      case "account":
        return <AccountSettings />
      case "notifications":
        return <NotificationSettings />
      case "privacy":
        return <PrivacySettings />
      case "appearance":
        return <AppearanceSettings />
      case "language":
        return <LanguageSettings />
      default:
        return <ProfileSettings user={currentUser} />
    }
  }

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto">
        <motion.div className="mb-8" variants={itemVariants}>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-200">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-200">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Settings Navigation */}
          <motion.div
            className="w-full md:w-64 flex-shrink-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200">
              <nav className="p-2">
                <ul className="space-y-1">
                  {settingsTabs.map((tab) => (
                    <motion.li key={tab.id} variants={itemVariants}>
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                          activeTab === tab.id
                            ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-medium"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        {tab.label}
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </nav>
            </div>
          </motion.div>

          {/* Settings Content */}
          <motion.div className="flex-1" variants={containerVariants} initial="hidden" animate="visible">
            <SettingsSection>{renderSettingsContent()}</SettingsSection>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}

export default SettingsPage

