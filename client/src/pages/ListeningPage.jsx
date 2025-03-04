"use client"

import { useState } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, CheckCircle, XCircle } from "lucide-react"
import { motion } from "framer-motion"
import PageTransition from "../components/PageTransition"

const ListeningPage = () => {
    const [activeTab, setActiveTab] = useState("conversations")
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(180) // 3 minutes in seconds
    const [volume, setVolume] = useState(80)
    const [isMuted, setIsMuted] = useState(false)
    const [showAnswers, setShowAnswers] = useState(false)
    const [selectedAnswers, setSelectedAnswers] = useState({})

    const listeningTypes = [
        { id: "conversations", name: "Conversations" },
        { id: "lectures", name: "Lectures" },
        { id: "news", name: "News Reports" },
        { id: "stories", name: "Short Stories" },
        { id: "interviews", name: "Interviews" },
    ]

    const exercises = [
        {
            id: 1,
            title: "At the Restaurant",
            level: "Beginner",
            duration: "3:00",
            description: "A conversation between a customer and a waiter at a restaurant.",
            questions: [
                {
                    id: "q1",
                    text: "What does the customer order for the main course?",
                    options: ["Steak", "Chicken", "Fish", "Pasta"],
                    correctAnswer: "Steak",
                },
                {
                    id: "q2",
                    text: "What drink does the customer order?",
                    options: ["Water", "Wine", "Soda", "Coffee"],
                    correctAnswer: "Wine",
                },
                {
                    id: "q3",
                    text: "What dessert does the waiter recommend?",
                    options: ["Ice cream", "Cheesecake", "Chocolate cake", "Apple pie"],
                    correctAnswer: "Chocolate cake",
                },
            ],
        },
        {
            id: 2,
            title: "Job Interview",
            level: "Intermediate",
            duration: "4:30",
            description: "A job interview for a marketing position.",
            questions: [],
        },
        {
            id: 3,
            title: "Weather Forecast",
            level: "Beginner",
            duration: "2:15",
            description: "A weather report for the upcoming week.",
            questions: [],
        },
    ]

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying)
    }

    const handleTimeChange = (e) => {
        setCurrentTime(Number.parseInt(e.target.value))
    }

    const handleVolumeChange = (e) => {
        setVolume(Number.parseInt(e.target.value))
        if (Number.parseInt(e.target.value) === 0) {
            setIsMuted(true)
        } else {
            setIsMuted(false)
        }
    }

    const toggleMute = () => {
        setIsMuted(!isMuted)
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`
    }

    const handleAnswerSelect = (questionId, answer) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [questionId]: answer,
        })
    }

    const checkAnswer = (questionId, answer, correctAnswer) => {
        if (!showAnswers) return ""
        return answer === correctAnswer ? "correct" : "incorrect"
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
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Listening Practice</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Improve your listening skills with various audio exercises
                    </p>
                </motion.div>

                {/* Listening Types Tabs */}
                <motion.div
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8 transition-colors duration-200"
                    variants={itemVariants}
                >
                    <div className="flex overflow-x-auto scrollbar-hide">
                        {listeningTypes.map((type) => (
                            <motion.button
                                key={type.id}
                                className={`px-6 py-3 font-medium whitespace-nowrap transition-colors duration-200 ${activeTab === type.id
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

                {/* Current Exercise */}
                <motion.div
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 transition-colors duration-200"
                    variants={itemVariants}
                >
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">At the Restaurant</h2>
                        <div className="flex items-center mb-4">
                            <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-medium rounded mr-2 transition-colors duration-200">
                                Beginner
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-200">3:00</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
                            A conversation between a customer and a waiter at a restaurant. Listen carefully to answer the questions
                            below.
                        </p>
                    </div>

                    {/* Audio Player */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 transition-colors duration-200">
                        <div className="flex items-center justify-center space-x-4 mb-4">
                            <motion.button
                                className="p-2 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors duration-200"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <SkipBack className="h-5 w-5" />
                            </motion.button>

                            <motion.button
                                className="p-3 rounded-full bg-emerald-500 dark:bg-emerald-600 text-white transition-colors duration-200"
                                onClick={handlePlayPause}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                            </motion.button>

                            <motion.button
                                className="p-2 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors duration-200"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <SkipForward className="h-5 w-5" />
                            </motion.button>
                        </div>

                        <div className="flex items-center mb-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400 w-12 text-right transition-colors duration-200">
                                {formatTime(currentTime)}
                            </span>
                            <div className="flex-1 mx-2">
                                <input
                                    type="range"
                                    min="0"
                                    max={duration}
                                    value={currentTime}
                                    onChange={handleTimeChange}
                                    className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-emerald-500 transition-colors duration-200"
                                />
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400 w-12 transition-colors duration-200">
                                {formatTime(duration)}
                            </span>
                        </div>

                        <div className="flex items-center">
                            <button
                                onClick={toggleMute}
                                className="p-1 text-gray-500 dark:text-gray-400 transition-colors duration-200"
                            >
                                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                            </button>
                            <div className="flex-1 mx-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-emerald-500 transition-colors duration-200"
                                />
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400 w-8 text-right transition-colors duration-200">
                                {isMuted ? 0 : volume}%
                            </span>
                        </div>
                    </div>

                    {/* Questions */}
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-200">
                            Comprehension Questions
                        </h3>

                        <motion.div className="space-y-6" variants={containerVariants}>
                            {exercises[0].questions.map((question, qIndex) => (
                                <motion.div
                                    key={question.id}
                                    className="border dark:border-gray-700 rounded-lg p-4 transition-colors duration-200"
                                    variants={itemVariants}
                                >
                                    <p className="text-gray-800 dark:text-gray-200 font-medium mb-3 transition-colors duration-200">
                                        {qIndex + 1}. {question.text}
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {question.options.map((option, oIndex) => {
                                            const isSelected = selectedAnswers[question.id] === option
                                            const answerStatus = checkAnswer(question.id, option, question.correctAnswer)

                                            return (
                                                <motion.button
                                                    key={oIndex}
                                                    className={`p-3 rounded-lg border text-left transition-all duration-200 ${isSelected
                                                        ? "border-emerald-500 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30"
                                                        : "border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700"
                                                        } ${answerStatus === "correct"
                                                            ? "bg-green-50 dark:bg-green-900/30 border-green-500 dark:border-green-600"
                                                            : answerStatus === "incorrect"
                                                                ? "bg-red-50 dark:bg-red-900/30 border-red-500 dark:border-red-600"
                                                                : ""
                                                        }`}
                                                    onClick={() => handleAnswerSelect(question.id, option)}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <div className="flex items-center">
                                                        <span className="flex-1">{option}</span>
                                                        {showAnswers && option === question.correctAnswer && (
                                                            <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 ml-2" />
                                                        )}
                                                        {showAnswers && isSelected && option !== question.correctAnswer && (
                                                            <XCircle className="h-5 w-5 text-red-500 dark:text-red-400 ml-2" />
                                                        )}
                                                    </div>
                                                </motion.button>
                                            )
                                        })}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    <div className="flex justify-between">
                        <motion.button
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Transcript
                        </motion.button>

                        <motion.button
                            className="px-4 py-2 bg-emerald-500 dark:bg-emerald-600 text-white rounded-md hover:bg-emerald-600 dark:hover:bg-emerald-700 transition-colors duration-200"
                            onClick={() => setShowAnswers(true)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Check Answers
                        </motion.button>
                    </div>
                </motion.div>

                {/* More Exercises */}
                <motion.div variants={itemVariants}>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-200">
                        More Listening Exercises
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {exercises.slice(1).map((exercise) => (
                            <motion.div
                                key={exercise.id}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200"
                                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                            >
                                <div className="flex items-center mb-2">
                                    <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-medium rounded mr-2 transition-colors duration-200">
                                        {exercise.level}
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-200">
                                        {exercise.duration}
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-2 transition-colors duration-200">
                                    {exercise.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 transition-colors duration-200">
                                    {exercise.description}
                                </p>
                                <motion.button
                                    className="w-full px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-md hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors duration-200"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    Start Exercise
                                </motion.button>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </PageTransition>
    )
}

export default ListeningPage

