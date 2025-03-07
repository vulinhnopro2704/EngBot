"use client"

import { useState } from "react"
import { Users, BookOpen, CheckSquare, TrendingUp, TrendingDown, Activity } from "lucide-react"
import { motion } from "framer-motion"
import PageTransition from "../../components/PageTransition"

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState("week")

  const stats = [
    {
      title: "Total Users",
      value: "2,845",
      change: "+12.5%",
      trend: "up",
      icon: <Users className="h-6 w-6 text-blue-500 dark:text-blue-400" />,
    },
    {
      title: "Active Learners",
      value: "1,257",
      change: "+8.2%",
      trend: "up",
      icon: <Activity className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />,
    },
    {
      title: "Flashcards Created",
      value: "12,845",
      change: "+24.3%",
      trend: "up",
      icon: <BookOpen className="h-6 w-6 text-purple-500 dark:text-purple-400" />,
    },
    {
      title: "Quizzes Completed",
      value: "8,372",
      change: "-3.8%",
      trend: "down",
      icon: <CheckSquare className="h-6 w-6 text-orange-500 dark:text-orange-400" />,
    },
  ]

  const recentUsers = [
    { id: 1, name: "John Doe", email: "john@example.com", joined: "2 days ago", progress: 78 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", joined: "5 days ago", progress: 92 },
    { id: 3, name: "Robert Johnson", email: "robert@example.com", joined: "1 week ago", progress: 45 },
    { id: 4, name: "Emily Davis", email: "emily@example.com", joined: "2 weeks ago", progress: 63 },
    { id: 5, name: "Michael Wilson", email: "michael@example.com", joined: "3 weeks ago", progress: 87 },
  ]

  const popularContent = [
    { id: 1, title: "Business English Vocabulary", type: "Flashcard Set", views: 1245, rating: 4.8 },
    { id: 2, title: "TOEFL Preparation Quiz", type: "Quiz", views: 982, rating: 4.6 },
    { id: 3, title: "Phrasal Verbs Mastery", type: "Flashcard Set", views: 876, rating: 4.7 },
    { id: 4, title: "English Idioms and Expressions", type: "Reading", views: 754, rating: 4.5 },
    { id: 5, title: "Advanced Grammar Quiz", type: "Quiz", views: 698, rating: 4.4 },
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

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto">
        <motion.div className="mb-8 flex justify-between items-center" variants={itemVariants}>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-200">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-200">
              Overview of your learning platform
            </p>
          </div>

          <div className="flex bg-white dark:bg-gray-800 rounded-lg shadow-sm p-1 transition-colors duration-200">
            <button
              className={`px-3 py-1 text-sm rounded-md ${timeRange === "day" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "text-gray-600 dark:text-gray-400"} transition-colors duration-200`}
              onClick={() => setTimeRange("day")}
            >
              Day
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md ${timeRange === "week" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "text-gray-600 dark:text-gray-400"} transition-colors duration-200`}
              onClick={() => setTimeRange("week")}
            >
              Week
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md ${timeRange === "month" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "text-gray-600 dark:text-gray-400"} transition-colors duration-200`}
              onClick={() => setTimeRange("month")}
            >
              Month
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md ${timeRange === "year" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "text-gray-600 dark:text-gray-400"} transition-colors duration-200`}
              onClick={() => setTimeRange("year")}
            >
              Year
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" variants={containerVariants}>
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-200"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 transition-colors duration-200">
                  {stat.icon}
                </div>
                <div
                  className={`flex items-center ${stat.trend === "up" ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"} transition-colors duration-200`}
                >
                  <span className="text-sm font-medium">{stat.change}</span>
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 ml-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 ml-1" />
                  )}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-200">
                {stat.value}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-200">{stat.title}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Activity Chart */}
          <motion.div
            className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-200"
            variants={itemVariants}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-200">
                User Activity
              </h2>
              <div className="flex space-x-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 mr-1"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                    New Users
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                    Active Users
                  </span>
                </div>
              </div>
            </div>

            <div className="h-64 flex items-end justify-between">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                <div key={day} className="flex flex-col items-center w-1/7">
                  <div className="flex flex-col items-center space-y-1 w-full">
                    <motion.div
                      className="w-full bg-blue-500 dark:bg-blue-600 rounded-t transition-colors duration-200"
                      style={{ height: `${Math.random() * 100 + 50}px` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.random() * 100 + 50}px` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    ></motion.div>
                    <motion.div
                      className="w-full bg-emerald-500 dark:bg-emerald-600 rounded-t transition-colors duration-200"
                      style={{ height: `${Math.random() * 60 + 20}px` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.random() * 60 + 20}px` }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                    ></motion.div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 transition-colors duration-200">
                    {day}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Platform Stats */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-200"
            variants={itemVariants}
          >
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 transition-colors duration-200">
              Platform Stats
            </h2>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                    User Retention
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 transition-colors duration-200">
                    78%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden transition-colors duration-200">
                  <motion.div
                    className="h-full bg-emerald-500 dark:bg-emerald-600 rounded-full transition-colors duration-200"
                    initial={{ width: 0 }}
                    animate={{ width: "78%" }}
                    transition={{ duration: 1, delay: 0.2 }}
                  ></motion.div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                    Content Engagement
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 transition-colors duration-200">
                    92%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden transition-colors duration-200">
                  <motion.div
                    className="h-full bg-blue-500 dark:bg-blue-600 rounded-full transition-colors duration-200"
                    initial={{ width: 0 }}
                    animate={{ width: "92%" }}
                    transition={{ duration: 1, delay: 0.3 }}
                  ></motion.div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                    Quiz Completion
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 transition-colors duration-200">
                    64%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden transition-colors duration-200">
                  <motion.div
                    className="h-full bg-purple-500 dark:bg-purple-600 rounded-full transition-colors duration-200"
                    initial={{ width: 0 }}
                    animate={{ width: "64%" }}
                    transition={{ duration: 1, delay: 0.4 }}
                  ></motion.div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                    Daily Active Users
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 transition-colors duration-200">
                    85%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden transition-colors duration-200">
                  <motion.div
                    className="h-full bg-orange-500 dark:bg-orange-600 rounded-full transition-colors duration-200"
                    initial={{ width: 0 }}
                    animate={{ width: "85%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                  ></motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Users */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-200"
            variants={itemVariants}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-200">
                Recent Users
              </h2>
              <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline transition-colors duration-200">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Joined</th>
                    <th className="px-4 py-2">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                    >
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{user.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{user.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{user.joined}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mr-2">
                            <div
                              className="h-full bg-emerald-500 dark:bg-emerald-600 rounded-full"
                              style={{ width: `${user.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{user.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Popular Content */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-200"
            variants={itemVariants}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-200">
                Popular Content
              </h2>
              <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline transition-colors duration-200">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <th className="px-4 py-2">Title</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Views</th>
                    <th className="px-4 py-2">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {popularContent.map((content) => (
                    <tr
                      key={content.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                    >
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{content.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{content.type}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {content.views.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(content.rating) ? "fill-current" : "stroke-current fill-none"}`}
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                            {content.rating}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}

export default AdminDashboard

