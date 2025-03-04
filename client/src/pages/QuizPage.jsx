"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, AlertCircle, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import PageTransition from "../components/PageTransition"

const QuizPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15)
  const [quizQuestions, setQuizQuestions] = useState([
    {
      id: 1,
      word: "Accomplish",
      options: [
        "To fail at something",
        "To succeed in doing something",
        "To attempt something",
        "To avoid doing something",
      ],
      correctAnswer: 1,
    },
    {
      id: 2,
      word: "Benevolent",
      options: ["Cruel and harsh", "Indifferent and uncaring", "Kind and generous", "Strict and demanding"],
      correctAnswer: 2,
    },
    {
      id: 3,
      word: "Concise",
      options: [
        "Giving a lot of information clearly and in a few words",
        "Long and detailed",
        "Confusing and complicated",
        "Boring and repetitive",
      ],
      correctAnswer: 0,
    },
    {
      id: 4,
      word: "Diligent",
      options: [
        "Lazy and careless",
        "Showing care and effort in your work or duties",
        "Quick and impulsive",
        "Slow and methodical",
      ],
      correctAnswer: 1,
    },
    {
      id: 5,
      word: "Eloquent",
      options: [
        "Silent and reserved",
        "Fluent or persuasive in speaking or writing",
        "Loud and boisterous",
        "Shy and hesitant",
      ],
      correctAnswer: 1,
    },
  ])

  useEffect(() => {
    if (quizCompleted) return

    if (isAnswered) return

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          handleAnswer(null)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isAnswered, quizCompleted])

  const handleAnswer = (optionIndex) => {
    if (isAnswered) return

    setSelectedOption(optionIndex)
    setIsAnswered(true)

    const currentQuestion = quizQuestions[currentQuestionIndex]
    if (optionIndex === currentQuestion.correctAnswer) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedOption(null)
      setIsAnswered(false)
      setTimeLeft(15)
    } else {
      setQuizCompleted(true)
    }
  }

  const restartQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedOption(null)
    setIsAnswered(false)
    setScore(0)
    setQuizCompleted(false)
    setTimeLeft(15)
  }

  const currentQuestion = quizQuestions[currentQuestionIndex]

  const getOptionClassName = (index) => {
    let className = "p-4 rounded-lg border-2 mb-3 transition-all duration-200 "

    if (!isAnswered) {
      className += "border-gray-200 hover:border-blue-300 cursor-pointer"
    } else if (index === currentQuestion.correctAnswer) {
      className += "border-green-500 bg-green-50"
    } else if (index === selectedOption && index !== currentQuestion.correctAnswer) {
      className += "border-red-500 bg-red-50"
    } else {
      className += "border-gray-200 opacity-50"
    }

    return className
  }

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto">
        {!quizCompleted ? (
          <>
            <motion.div className="mb-8 flex justify-between items-center" variants={itemVariants}>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Vocabulary Quiz</h1>
                <p className="text-gray-600 mt-2">Choose the correct definition</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">
                  Question {currentQuestionIndex + 1}/{quizQuestions.length}
                </p>
                <p className="text-gray-600">Score: {score}</p>
              </div>
            </motion.div>

            {/* Progress bar */}
            <motion.div className="w-full bg-gray-200 rounded-full h-2.5 mb-6" variants={itemVariants}>
              <motion.div
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${(currentQuestionIndex / quizQuestions.length) * 100}%` }}
                initial={{ width: "0%" }}
                animate={{ width: `${(currentQuestionIndex / quizQuestions.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              ></motion.div>
            </motion.div>

            {/* Timer */}
            <motion.div className="mb-6 flex items-center" variants={itemVariants}>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <motion.div
                  className={`h-2.5 rounded-full transition-all duration-1000 ${timeLeft > 5 ? "bg-blue-500" : "bg-red-500"}`}
                  style={{ width: `${(timeLeft / 15) * 100}%` }}
                  initial={{ width: "100%" }}
                  animate={{ width: `${(timeLeft / 15) * 100}%` }}
                  transition={{ duration: 1 }}
                ></motion.div>
              </div>
              <span className="ml-2 text-sm font-medium">{timeLeft}s</span>
            </motion.div>

            <motion.div className="bg-white rounded-xl shadow-md p-6 mb-8" variants={itemVariants}>
              <motion.h2
                className="text-2xl font-bold text-center mb-6"
                key={currentQuestion.word}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                What does "{currentQuestion.word}" mean?
              </motion.h2>

              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <motion.div
                    key={index}
                    className={getOptionClassName(index)}
                    onClick={() => handleAnswer(index)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={!isAnswered ? { scale: 1.02 } : {}}
                  >
                    <div className="flex items-center">
                      {isAnswered && index === currentQuestion.correctAnswer && (
                        <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                      )}
                      {isAnswered && index === selectedOption && index !== currentQuestion.correctAnswer && (
                        <XCircle className="h-6 w-6 text-red-500 mr-2 flex-shrink-0" />
                      )}
                      <span>{option}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {isAnswered && (
                <motion.div
                  className="mt-6 flex justify-end"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.button
                    onClick={nextQuestion}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {currentQuestionIndex < quizQuestions.length - 1 ? "Next Question" : "See Results"}
                    <ChevronRight className="ml-1 h-5 w-5" />
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </>
        ) : (
          <motion.div
            className="bg-white rounded-xl shadow-md p-8 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6">Quiz Completed!</h2>

            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <motion.div
                className="inline-block p-4 bg-blue-100 rounded-full mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              >
                {score === quizQuestions.length ? (
                  <CheckCircle className="h-12 w-12 text-green-500" />
                ) : score >= quizQuestions.length / 2 ? (
                  <CheckCircle className="h-12 w-12 text-blue-500" />
                ) : (
                  <AlertCircle className="h-12 w-12 text-orange-500" />
                )}
              </motion.div>
              <h3 className="text-2xl font-bold">
                Your Score: {score}/{quizQuestions.length}
              </h3>
              <p className="text-gray-600 mt-2">
                {score === quizQuestions.length
                  ? "Perfect! You got all questions right!"
                  : score >= quizQuestions.length / 2
                    ? "Good job! You're making progress."
                    : "Keep practicing to improve your vocabulary!"}
              </p>
            </motion.div>

            <motion.div
              className="flex justify-center space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <motion.button
                onClick={restartQuiz}
                className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Again
              </motion.button>
              <motion.button
                className="px-6 py-3 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Home
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  )
}

export default QuizPage

