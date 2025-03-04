"use client"

import { useState } from "react"
import { Calendar, Clock, CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import PageTransition from "../components/PageTransition"

const ReviewPage = () => {
  const [reviewWords, setReviewWords] = useState([
    {
      id: 1,
      word: "Accomplish",
      definition: "To succeed in doing something",
      lastReviewed: "2 days ago",
      dueIn: "Today",
      level: 3,
    },
    {
      id: 2,
      word: "Benevolent",
      definition: "Kind and generous",
      lastReviewed: "5 days ago",
      dueIn: "Today",
      level: 2,
    },
    {
      id: 3,
      word: "Concise",
      definition: "Giving a lot of information clearly and in a few words",
      lastReviewed: "1 week ago",
      dueIn: "Today",
      level: 1,
    },
    {
      id: 4,
      word: "Diligent",
      definition: "Showing care and effort in your work or duties",
      lastReviewed: "3 days ago",
      dueIn: "Tomorrow",
      level: 2,
    },
    {
      id: 5,
      word: "Eloquent",
      definition: "Fluent or persuasive in speaking or writing",
      lastReviewed: "2 weeks ago",
      dueIn: "Today",
      level: 1,
    },
    {
      id: 6,
      word: "Feasible",
      definition: "Possible to do easily or conveniently",
      lastReviewed: "4 days ago",
      dueIn: "In 2 days",
      level: 3,
    },
    {
      id: 7,
      word: "Gratitude",
      definition: "The quality of being thankful",
      lastReviewed: "1 week ago",
      dueIn: "Tomorrow",
      level: 2,
    },
    {
      id: 8,
      word: "Harmony",
      definition: "The state of being in agreement or concord",
      lastReviewed: "3 days ago",
      dueIn: "In 3 days",
      level: 4,
    },
  ])

  const [activeTab, setActiveTab] = useState("due")
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)
  const [isReviewing, setIsReviewing] = useState(false)
  const [showDefinition, setShowDefinition] = useState(false)

  const dueWords = reviewWords.filter((word) => word.dueIn === "Today")
  const upcomingWords = reviewWords.filter((word) => word.dueIn !== "Today")

  const startReview = () => {
    setIsReviewing(true)
    setCurrentReviewIndex(0)
    setShowDefinition(false)
  }

  const handleKnown = () => {
    // In a real app, you would update the spaced repetition algorithm here
    if (currentReviewIndex < dueWords.length - 1) {
      setCurrentReviewIndex(currentReviewIndex + 1)
      setShowDefinition(false)
    } else {
      setIsReviewing(false)
    }
  }

  const handleUnknown = () => {
    // In a real app, you would update the spaced repetition algorithm here
    if (currentReviewIndex < dueWords.length - 1) {
      setCurrentReviewIndex(currentReviewIndex + 1)
      setShowDefinition(false)
    } else {
      setIsReviewing(false)
    }
  }

  const toggleDefinition = () => {
    setShowDefinition(!showDefinition)
  }

  const getLevelColor = (level) => {
    switch (level) {
      case 1:
        return "bg-red-100 text-red-800"
      case 2:
        return "bg-orange-100 text-orange-800"
      case 3:
        return "bg-green-100 text-green-800"
      case 4:
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Animation variants
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
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
      <div className="max-w-4xl mx-auto">
        {!isReviewing ? (
          <>
            <motion.div className="mb-8" variants={itemVariants}>
              <h1 className="text-3xl font-bold text-gray-800">Spaced Repetition Review</h1>
              <p className="text-gray-600 mt-2">Review words at optimal intervals for better retention</p>
            </motion.div>

            <motion.div className="bg-white rounded-xl shadow-md p-6 mb-8" variants={itemVariants}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">Today's Review</h2>
                  <p className="text-gray-600">You have {dueWords.length} words to review today</p>
                </div>
                <motion.button
                  onClick={startReview}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
                  disabled={dueWords.length === 0}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Review
                </motion.button>
              </div>

              <div className="flex space-x-2 border-b mb-4">
                <button
                  className={`px-4 py-2 font-medium ${activeTab === "due" ? "text-emerald-600 border-b-2 border-emerald-500" : "text-gray-500"}`}
                  onClick={() => setActiveTab("due")}
                >
                  Due Today ({dueWords.length})
                </button>
                <button
                  className={`px-4 py-2 font-medium ${activeTab === "upcoming" ? "text-emerald-600 border-b-2 border-emerald-500" : "text-gray-500"}`}
                  onClick={() => setActiveTab("upcoming")}
                >
                  Upcoming ({upcomingWords.length})
                </button>
              </div>

              {activeTab === "due" ? (
                dueWords.length > 0 ? (
                  <motion.div className="space-y-3" variants={listVariants} initial="hidden" animate="visible">
                    {dueWords.map((word) => (
                      <motion.div
                        key={word.id}
                        className="p-4 border rounded-lg flex justify-between items-center hover:bg-gray-50"
                        variants={itemVariants}
                        whileHover={{ scale: 1.02, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                      >
                        <div>
                          <h3 className="font-bold text-lg">{word.word}</h3>
                          <p className="text-gray-600">{word.definition}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(word.level)}`}>
                            Level {word.level}
                          </span>
                          <div className="flex items-center text-gray-500 text-sm">
                            <Calendar className="h-4 w-4 mr-1" />
                            {word.lastReviewed}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    className="text-center py-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      className="inline-block p-3 bg-gray-100 rounded-full mb-3"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </motion.div>
                    <h3 className="text-lg font-medium">All caught up!</h3>
                    <p className="text-gray-500">You have no words to review today.</p>
                  </motion.div>
                )
              ) : (
                <motion.div className="space-y-3" variants={listVariants} initial="hidden" animate="visible">
                  {upcomingWords.map((word) => (
                    <motion.div
                      key={word.id}
                      className="p-4 border rounded-lg flex justify-between items-center hover:bg-gray-50"
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                    >
                      <div>
                        <h3 className="font-bold text-lg">{word.word}</h3>
                        <p className="text-gray-600">{word.definition}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(word.level)}`}>
                          Level {word.level}
                        </span>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          Due {word.dueIn}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>

            <motion.div className="bg-white rounded-xl shadow-md p-6" variants={itemVariants}>
              <h2 className="text-xl font-bold mb-4">About Spaced Repetition</h2>
              <p className="text-gray-600 mb-4">
                Spaced repetition is a learning technique that incorporates increasing intervals of time between
                subsequent review of previously learned material to exploit the psychological spacing effect.
              </p>
              <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6" variants={listVariants}>
                <motion.div
                  className="p-4 border rounded-lg"
                  variants={itemVariants}
                  whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="flex items-center mb-2">
                    <div className="p-2 rounded-full bg-red-100 mr-2">
                      <RefreshCw className="h-5 w-5 text-red-500" />
                    </div>
                    <h3 className="font-semibold">Level 1</h3>
                  </div>
                  <p className="text-sm text-gray-600">Review again in 1 day</p>
                </motion.div>
                <motion.div
                  className="p-4 border rounded-lg"
                  variants={itemVariants}
                  whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="flex items-center mb-2">
                    <div className="p-2 rounded-full bg-orange-100 mr-2">
                      <RefreshCw className="h-5 w-5 text-orange-500" />
                    </div>
                    <h3 className="font-semibold">Level 2</h3>
                  </div>
                  <p className="text-sm text-gray-600">Review again in 3 days</p>
                </motion.div>
                <motion.div
                  className="p-4 border rounded-lg"
                  variants={itemVariants}
                  whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="flex items-center mb-2">
                    <div className="p-2 rounded-full bg-green-100 mr-2">
                      <RefreshCw className="h-5 w-5 text-green-500" />
                    </div>
                    <h3 className="font-semibold">Level 3+</h3>
                  </div>
                  <p className="text-sm text-gray-600">Review again in 7+ days</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        ) : (
          <motion.div
            className="bg-white rounded-xl shadow-md p-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold">Review Session</h2>
              <div className="text-gray-600">
                {currentReviewIndex + 1} of {dueWords.length}
              </div>
            </div>

            <motion.div
              className="mb-8"
              key={dueWords[currentReviewIndex].word + showDefinition}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="p-8 border-2 border-emerald-100 rounded-xl cursor-pointer text-center"
                onClick={toggleDefinition}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {!showDefinition ? (
                  <div>
                    <motion.h3
                      className="text-3xl font-bold mb-4"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {dueWords[currentReviewIndex].word}
                    </motion.h3>
                    <p className="text-gray-500">Click to reveal definition</p>
                  </div>
                ) : (
                  <div>
                    <motion.p
                      className="text-xl mb-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {dueWords[currentReviewIndex].definition}
                    </motion.p>
                    <p className="text-gray-500">Click to see word again</p>
                  </div>
                )}
              </motion.div>
            </motion.div>

            <motion.div
              className="flex justify-center space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <motion.button
                onClick={handleUnknown}
                className="px-6 py-3 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <XCircle className="mr-2 h-5 w-5" />
                Don't Know
              </motion.button>
              <motion.button
                onClick={handleKnown}
                className="px-6 py-3 bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition-colors flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                Know It
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  )
}

export default ReviewPage

