"use client"

import { motion } from "framer-motion"
import { Users, MessageCircle, Award } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"

const CommunityHeader = () => {
  const navigate = useNavigate()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <motion.h1
            className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-200"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Learning Community
          </motion.h1>
          <motion.p
            className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl transition-colors duration-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            Connect with fellow language learners, share your progress, and learn together in our supportive community.
          </motion.p>
        </div>

        <div className="mt-4 md:mt-0">
          <Button
            onClick={() => navigate("/community/create-post")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-200"
          >
            Create Post
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <motion.div
          className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 flex items-center transition-colors duration-200"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-2" />
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 transition-colors duration-200">12.5K</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-200">Community Members</p>
          </div>
        </motion.div>

        <motion.div
          className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 flex items-center transition-colors duration-200"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <MessageCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-2" />
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 transition-colors duration-200">8.2K</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-200">Active Discussions</p>
          </div>
        </motion.div>

        <motion.div
          className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 flex items-center transition-colors duration-200"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Award className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-2" />
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 transition-colors duration-200">5.7K</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-200">Achievements Shared</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CommunityHeader

