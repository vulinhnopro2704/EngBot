"use client"

import { Link } from "react-router"
import { BookOpen, CheckSquare, Clock, Award } from "lucide-react"
import { motion } from "framer-motion"

const HomePage = () => {
  const learningOptions = [
    {
      title: "Flashcards",
      description: "Learn new words with interactive flashcards",
      icon: <BookOpen className="h-8 w-8 text-emerald-500" />,
      path: "/flashcards",
      color: "bg-emerald-50",
      buttonColor: "bg-emerald-500 hover:bg-emerald-600",
    },
    {
      title: "Quizzes",
      description: "Test your knowledge with multiple choice quizzes",
      icon: <CheckSquare className="h-8 w-8 text-blue-500" />,
      path: "/quiz",
      color: "bg-blue-50",
      buttonColor: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Spaced Review",
      description: "Review words at optimal intervals for better retention",
      icon: <Clock className="h-8 w-8 text-purple-500" />,
      path: "/review",
      color: "bg-purple-50",
      buttonColor: "bg-purple-500 hover:bg-purple-600",
    },
  ]

  const streakDays = 5
  const wordsLearned = 120
  const dailyGoal = 10
  const wordsToReview = 15

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
    exit: {
      opacity: 0,
      transition: { ease: "easeInOut" },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  return (
    <motion.div
      className="max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div className="mb-8" variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-800">Welcome back!</h1>
        <p className="text-gray-600 mt-2">Continue your English learning journey</p>
      </motion.div>

      {/* Stats Section */}
      <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8" variants={itemVariants}>
        <motion.div
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-orange-100">
              <Award className="h-6 w-6 text-orange-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Streak</p>
              <p className="text-xl font-semibold">{streakDays} days</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-emerald-100">
              <BookOpen className="h-6 w-6 text-emerald-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Words Learned</p>
              <p className="text-xl font-semibold">{wordsLearned}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100">
              <CheckSquare className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Daily Goal</p>
              <p className="text-xl font-semibold">{dailyGoal} words</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-purple-100">
              <Clock className="h-6 w-6 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">To Review</p>
              <p className="text-xl font-semibold">{wordsToReview} words</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Daily Challenge */}
      <motion.div
        className="bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg shadow-md p-6 mb-8 text-white"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <h2 className="text-xl font-bold mb-2">Daily Challenge</h2>
        <p className="mb-4">Complete today's challenge to maintain your streak!</p>
        <div className="w-full bg-white/20 rounded-full h-2.5 mb-4">
          <motion.div
            className="bg-white h-2.5 rounded-full"
            style={{ width: "45%" }}
            initial={{ width: "0%" }}
            animate={{ width: "45%" }}
            transition={{ duration: 1, ease: "easeOut" }}
          ></motion.div>
        </div>
        <div className="flex justify-between text-sm">
          <span>4/10 words</span>
          <span>6 words left</span>
        </div>
        <motion.button
          className="mt-4 bg-white text-emerald-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Continue Challenge
        </motion.button>
      </motion.div>

      {/* Learning Options */}
      <motion.h2 className="text-2xl font-bold text-gray-800 mb-4" variants={itemVariants}>
        Choose your learning method
      </motion.h2>
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" variants={itemVariants}>
        {learningOptions.map((option, index) => (
          <motion.div
            key={index}
            className={`${option.color} rounded-lg shadow-sm p-6 border border-gray-100`}
            whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            variants={itemVariants}
          >
            <motion.div
              className="mb-4"
              initial={{ rotate: -10, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
            >
              {option.icon}
            </motion.div>
            <h3 className="text-xl font-bold mb-2">{option.title}</h3>
            <p className="text-gray-600 mb-4">{option.description}</p>
            <Link to={option.path}>
              <motion.button
                className={`${option.buttonColor} text-white px-4 py-2 rounded-md font-medium transition-colors`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Learning
              </motion.button>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Recently Learned Words */}
      <motion.h2 className="text-2xl font-bold text-gray-800 mb-4" variants={itemVariants}>
        Recently Learned Words
      </motion.h2>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        variants={containerVariants}
      >
        {["Accomplish", "Benevolent", "Concise", "Diligent", "Eloquent", "Feasible", "Gratitude", "Harmony"].map(
          (word, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow"
              variants={itemVariants}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            >
              <h3 className="font-bold text-lg text-gray-800">{word}</h3>
              <p className="text-gray-500 text-sm mt-1">Tap to review</p>
            </motion.div>
          ),
        )}
      </motion.div>
    </motion.div>
  )
}

export default HomePage

