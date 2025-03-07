"use client"

import { useState } from "react"
import { Send, RefreshCw, CheckCircle, AlertTriangle, HelpCircle } from "lucide-react"
import { motion } from "framer-motion"
import PageTransition from "../components/PageTransition"

const WritingPage = () => {
  const [activeTab, setActiveTab] = useState("prompts")
  const [selectedPrompt, setSelectedPrompt] = useState(null)
  const [userText, setUserText] = useState("")
  const [feedback, setFeedback] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showGrammarErrors, setShowGrammarErrors] = useState(false)

  const writingTypes = [
    { id: "prompts", name: "Writing Prompts" },
    { id: "grammar", name: "Grammar Practice" },
    { id: "emails", name: "Email Writing" },
    { id: "essays", name: "Essays" },
    { id: "stories", name: "Creative Writing" },
  ]

  const prompts = [
    {
      id: 1,
      title: "Describe Your Hometown",
      category: "Descriptive",
      difficulty: "Beginner",
      description:
        "Write about your hometown. Include information about its location, interesting places, and why it is special to you.",
      minWords: 100,
      maxWords: 150,
    },
    {
      id: 2,
      title: "Technology in Education",
      category: "Opinion",
      difficulty: "Intermediate",
      description: "Do you think technology has improved education? Give reasons and examples to support your opinion.",
      minWords: 150,
      maxWords: 200,
    },
    {
      id: 3,
      title: "A Memorable Journey",
      category: "Narrative",
      difficulty: "Beginner",
      description: "Write about a journey that was memorable for you. What made it special?",
      minWords: 120,
      maxWords: 180,
    },
  ]

  // Simulated grammar errors for demo
  const grammarErrors = [
    { start: 10, end: 15, type: "spelling", suggestion: "beautiful", message: "Possible spelling error" },
    {
      start: 30,
      end: 45,
      type: "grammar",
      suggestion: "has improved significantly",
      message: "Consider using a more precise verb tense",
    },
    {
      start: 80,
      end: 90,
      type: "punctuation",
      suggestion: "However, I think",
      message: "Add a comma after introductory words",
    },
  ]

  const handlePromptSelect = (prompt) => {
    setSelectedPrompt(prompt)
    setUserText("")
    setFeedback(null)
  }

  const handleTextChange = (e) => {
    setUserText(e.target.value)
    // In a real app, you might want to analyze the text as the user types
  }

  const handleSubmit = () => {
    if (!userText.trim()) return

    setIsSubmitting(true)

    // Simulate API call to grammar/writing suggestion service
    setTimeout(() => {
      setFeedback({
        score: 85,
        wordCount: userText.split(/\s+/).filter(Boolean).length,
        strengths: [
          "Good use of descriptive language",
          "Clear structure with introduction and conclusion",
          "Appropriate vocabulary for the topic",
        ],
        improvements: [
          "Consider using more complex sentence structures",
          "Add more specific examples to support your points",
          "Pay attention to verb tense consistency",
        ],
        grammarErrors: showGrammarErrors ? grammarErrors : [],
      })
      setIsSubmitting(false)
    }, 1500)
  }

  const getWordCount = () => {
    return userText.split(/\s+/).filter(Boolean).length
  }

  const resetExercise = () => {
    setUserText("")
    setFeedback(null)
  }

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
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-200">
            Writing Practice
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-200">
            Improve your writing skills with guided exercises and feedback
          </p>
        </motion.div>

        {/* Writing Types Tabs */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8 transition-colors duration-200"
          variants={itemVariants}
        >
          <div className="flex overflow-x-auto scrollbar-hide">
            {writingTypes.map((type) => (
              <motion.button
                key={type.id}
                className={`px-6 py-3 font-medium whitespace-nowrap transition-colors duration-200 ${
                  activeTab === type.id
                    ? "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500 dark:border-emerald-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab(type.id)}
                whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.05)" }}
              >
                {type.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prompts List */}
          <motion.div className="lg:col-span-1" variants={itemVariants}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 transition-colors duration-200">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-200">
                Select a Writing Prompt
              </h2>
              <div className="space-y-3">
                {prompts.map((prompt) => (
                  <motion.div
                    key={prompt.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedPrompt?.id === prompt.id
                        ? "border-emerald-500 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30"
                        : "border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700"
                    }`}
                    onClick={() => handlePromptSelect(prompt)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <h3 className="font-medium text-gray-800 dark:text-gray-200 transition-colors duration-200">
                      {prompt.title}
                    </h3>
                    <div className="flex mt-2 text-xs">
                      <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 rounded mr-2 transition-colors duration-200">
                        {prompt.difficulty}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded transition-colors duration-200">
                        {prompt.category}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Writing Area */}
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            {selectedPrompt ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-200">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-200">
                    {selectedPrompt.title}
                  </h2>
                  <div className="flex items-center mb-4">
                    <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-medium rounded mr-2 transition-colors duration-200">
                      {selectedPrompt.difficulty}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs font-medium rounded mr-2 transition-colors duration-200">
                      {selectedPrompt.category}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-200">
                      {selectedPrompt.minWords}-{selectedPrompt.maxWords} words
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
                    {selectedPrompt.description}
                  </p>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                      Your Response
                    </label>
                    <span
                      className={`text-sm ${
                        getWordCount() < selectedPrompt.minWords
                          ? "text-red-500 dark:text-red-400"
                          : getWordCount() > selectedPrompt.maxWords
                            ? "text-orange-500 dark:text-orange-400"
                            : "text-green-500 dark:text-green-400"
                      } transition-colors duration-200`}
                    >
                      {getWordCount()} / {selectedPrompt.minWords}-{selectedPrompt.maxWords} words
                    </span>
                  </div>
                  <textarea
                    value={userText}
                    onChange={handleTextChange}
                    className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-gray-100 transition-colors duration-200"
                    placeholder="Start writing here..."
                  ></textarea>
                </div>

                <div className="flex justify-between">
                  <motion.button
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center transition-colors duration-200"
                    onClick={resetExercise}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset
                  </motion.button>

                  <motion.button
                    className="px-4 py-2 bg-emerald-500 dark:bg-emerald-600 text-white rounded-md hover:bg-emerald-600 dark:hover:bg-emerald-700 flex items-center transition-colors duration-200"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !userText.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Get Feedback
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Feedback Section */}
                {feedback && (
                  <motion.div
                    className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 transition-colors duration-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-200">
                      Writing Feedback
                    </h3>

                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mr-4 transition-colors duration-200">
                        <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 transition-colors duration-200">
                          {feedback.score}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200 transition-colors duration-200">
                          Overall Score
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                          {feedback.wordCount} words | {feedback.grammarErrors.length} grammar issues
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg transition-colors duration-200">
                        <h4 className="font-medium text-green-800 dark:text-green-300 flex items-center mb-2 transition-colors duration-200">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Strengths
                        </h4>
                        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300 transition-colors duration-200">
                          {feedback.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg transition-colors duration-200">
                        <h4 className="font-medium text-orange-800 dark:text-orange-300 flex items-center mb-2 transition-colors duration-200">
                          <AlertTriangle className="h-5 w-5 mr-2" />
                          Areas for Improvement
                        </h4>
                        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300 transition-colors duration-200">
                          {feedback.improvements.map((improvement, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-800 dark:text-gray-200 transition-colors duration-200">
                          Grammar & Spelling
                        </h4>
                        <button
                          className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline transition-colors duration-200"
                          onClick={() => setShowGrammarErrors(!showGrammarErrors)}
                        >
                          {showGrammarErrors ? "Hide Details" : "Show Details"}
                        </button>
                      </div>

                      {showGrammarErrors && (
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg transition-colors duration-200">
                          {feedback.grammarErrors.length > 0 ? (
                            <ul className="space-y-2">
                              {feedback.grammarErrors.map((error, index) => (
                                <li
                                  key={index}
                                  className="text-sm border-l-2 border-orange-500 dark:border-orange-400 pl-3 py-1 transition-colors duration-200"
                                >
                                  <div className="font-medium text-gray-800 dark:text-gray-200 transition-colors duration-200">
                                    {error.type === "spelling"
                                      ? "Spelling"
                                      : error.type === "grammar"
                                        ? "Grammar"
                                        : "Punctuation"}{" "}
                                    Issue
                                  </div>
                                  <div className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
                                    {error.message}
                                  </div>
                                  <div className="mt-1">
                                    <span className="text-orange-600 dark:text-orange-400 line-through transition-colors duration-200">
                                      {userText.substring(error.start, error.end)}
                                    </span>
                                    <span className="mx-2">→</span>
                                    <span className="text-green-600 dark:text-green-400 transition-colors duration-200">
                                      {error.suggestion}
                                    </span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="text-center py-4">
                              <CheckCircle className="h-8 w-8 text-green-500 dark:text-green-400 mx-auto mb-2 transition-colors duration-200" />
                              <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
                                No grammar or spelling issues found!
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-center mt-6">
                      <motion.button
                        className="px-6 py-2 bg-emerald-500 dark:bg-emerald-600 text-white rounded-md hover:bg-emerald-600 dark:hover:bg-emerald-700 transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Save to My Progress
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center justify-center h-full text-center transition-colors duration-200">
                <HelpCircle className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4 transition-colors duration-200" />
                <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                  Select a Writing Prompt
                </h3>
                <p className="text-gray-500 dark:text-gray-400 transition-colors duration-200">
                  Choose a prompt from the list to start your writing practice
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}

export default WritingPage

