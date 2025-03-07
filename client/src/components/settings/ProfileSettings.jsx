"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Camera, Save } from "lucide-react"
import FormField from "./FormField"

const ProfileSettings = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: "",
    location: "",
    website: "",
    occupation: "",
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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
        Profile Settings
      </h2>

      {/* Profile Picture */}
      <div className="mb-8 flex flex-col items-center sm:flex-row sm:items-start">
        <div className="relative mb-4 sm:mb-0 sm:mr-6">
          <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-4xl font-bold transition-colors duration-200">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <button className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 rounded-full p-1.5 shadow-md border border-gray-200 dark:border-gray-600 transition-colors duration-200">
            <Camera className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 transition-colors duration-200">
            Profile Picture
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-3 transition-colors duration-200">
            Upload a new profile picture or avatar
          </p>
          <div className="flex space-x-3">
            <button className="px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
              Upload
            </button>
            <button className="px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
              Remove
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <FormField
            label="Full Name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
            required
          />

          <FormField
            label="Email Address"
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            required
            disabled
            helpText="Email cannot be changed. Contact support for assistance."
          />

          <FormField
            label="Location"
            id="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="City, Country"
          />

          <FormField
            label="Occupation"
            id="occupation"
            value={formData.occupation}
            onChange={handleChange}
            placeholder="Your job title"
          />

          <FormField
            label="Website"
            id="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://yourwebsite.com"
          />
        </div>

        <FormField
          label="Bio"
          id="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us a bit about yourself"
          helpText="Brief description for your profile. Maximum 200 characters."
        >
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
            placeholder="Tell us a bit about yourself"
          />
        </FormField>

        <div className="mt-6 flex items-center justify-end">
          {success && (
            <motion.p
              className="mr-4 text-sm text-green-600 dark:text-green-400 transition-colors duration-200"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              Profile updated successfully!
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
                Save Changes
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  )
}

export default ProfileSettings

