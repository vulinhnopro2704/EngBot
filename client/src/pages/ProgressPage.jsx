"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Award, TrendingUp, Clock, CheckCircle } from "lucide-react"
import { BookOpen, CheckSquare } from "lucide-react"
import { motion } from "framer-motion"
import PageTransition from "../components/PageTransition"

const ProgressPage = () => {
  const [activeTab, setActiveTab] = useState("overview")

  const weeklyData = [
    { name: "Mon", words: 12 },
    { name: "Tue", words: 8 },
    { name: "Wed", words: 15 },
    { name: "Thu", words: 10 },
    { name: "Fri", words: 5 },
    { name: "Sat", words: 20 },
    { name: "Sun", words: 18 },
  ]

  const monthlyData = [
    { name: "Week 1", words: 45 },
    { name: "Week 2", words: 60 },
    { name: "Week 3", words: 52 },
    { name: "Week 4", words: 70 },
  ]

  const categoryData = [
    { name: "Business", words: 35 },
    { name: "Academic", words: 42 },
    { name: "Daily Life", words: 28 },
    { name: "Technology", words: 15 },
  ]

  const achievements = [
    { id: 1, name: "First Steps", description: "Learn your first 10 words", completed: true, date: "2 weeks ago" },
    { id: 2, name: "Vocabulary Builder", description: "Learn 50 words", completed: true, date: "1 week ago" },
    { id: 3, name: "Word Master", description: "Learn 100 words", completed: true, date: "3 days ago" },
    { id: 4, name: "Consistent Learner", description: "Maintain a 7-day streak", completed: true, date: "Yesterday" },
    { id: 5, name: "Quiz Champion", description: "Score 100% on 5 quizzes", completed: false, progress: "3/5" },
    { id: 6, name: "Advanced Vocabulary", description: "Learn 25 advanced words", completed: false, progress: "18/25" },
  ]

  const stats = [
    { name: "Words Learned", value: 120, icon: <BookOpen className="h-6 w-6 text-emerald-500" /> },
    { name: "Current Streak", value: "5 days", icon: <Award className="h-6 w-6 text-orange-500" /> },
    { name: "Quizzes Completed", value: 15, icon: <CheckSquare className="h-6 w-6 text-blue-500" /> },
    { name: "Time Spent", value: "8.5 hours", icon: <Clock className="h-6 w-6 text-purple-500" /> },
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
      <div className="max-w-6xl mx-auto">
        <motion.div className="mb-8" variants={itemVariants}>
          <h1 className="text-3xl font-bold text-gray-800">Your Progress</h1>
          <p className="text-gray-600 mt-2">Track your learning journey and achievements</p>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8" variants={containerVariants}>
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="flex items-center mb-2">
                {stat.icon}
                <h3 className="ml-2 text-lg font-semibold text-gray-700">{stat.name}</h3>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="bg-white rounded-xl shadow-md overflow-hidden mb-8" variants={itemVariants}>
          <div className="flex border-b">
            <motion.button
              className={`px-6 py-3 font-medium ${activeTab === "overview" ? "text-emerald-600 border-b-2 border-emerald-500" : "text-gray-500"}`}
              onClick={() => setActiveTab("overview")}
              whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.05)" }}
            >
              Overview
            </motion.button>
            <motion.button
              className={`px-6 py-3 font-medium ${activeTab === "achievements" ? "text-emerald-600 border-b-2 border-emerald-500" : "text-gray-500"}`}
              onClick={() => setActiveTab("achievements")}
              whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.05)" }}
            >
              Achievements
            </motion.button>
            <motion.button
              className={`px-6 py-3 font-medium ${activeTab === "categories" ? "text-emerald-600 border-b-2 border-emerald-500" : "text-gray-500"}`}
              onClick={() => setActiveTab("categories")}
              whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.05)" }}
            >
              Categories
            </motion.button>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <h2 className="text-xl font-bold mb-6">Weekly Progress</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="words" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <h2 className="text-xl font-bold mt-8 mb-6">Monthly Progress</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="words" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {activeTab === "achievements" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <h2 className="text-xl font-bold mb-6">Your Achievements</h2>
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {achievements.map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      className={`p-4 rounded-lg border-2 ${achievement.completed ? "border-emerald-100 bg-emerald-50" : "border-gray-200"}`}
                      variants={itemVariants}
                      whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    >
                      <div className="flex items-center mb-2">
                        <div className={`p-2 rounded-full ${achievement.completed ? "bg-emerald-100" : "bg-gray-100"}`}>
                          {achievement.completed ? (
                            <Award className="h-5 w-5 text-emerald-500" />
                          ) : (
                            <Award className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <h3 className="ml-2 font-semibold">{achievement.name}</h3>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{achievement.description}</p>
                      {achievement.completed ? (
                        <div className="flex items-center text-sm text-emerald-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Completed {achievement.date}
                        </div>
                      ) : (
                        <div className="flex items-center text-sm text-gray-500">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          In progress: {achievement.progress}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {activeTab === "categories" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <h2 className="text-xl font-bold mb-6">Words by Category</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Bar dataKey="words" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <motion.div
                  className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div
                    className="p-4 border rounded-lg"
                    variants={itemVariants}
                    whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                  >
                    <h3 className="font-semibold mb-2">Most Studied Category</h3>
                    <p className="text-lg font-bold">Academic</p>
                    <p className="text-gray-600">42 words learned</p>
                  </motion.div>

                  <motion.div
                    className="p-4 border rounded-lg"
                    variants={itemVariants}
                    whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                  >
                    <h3 className="font-semibold mb-2">Suggested Focus</h3>
                    <p className="text-lg font-bold">Technology</p>
                    <p className="text-gray-600">Least studied category</p>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  )
}

export default ProgressPage

