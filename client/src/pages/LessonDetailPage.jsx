"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { ChevronLeft, ChevronRight, Volume2, Check, X, ArrowLeft, RefreshCw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import PageTransition from "../components/PageTransition"

// Learning stages
const STAGES = {
  FLASHCARD: "flashcard",
  WRITING: "writing",
  FILL_BLANKS: "fill_blanks",
  COMPLETED: "completed",
}

const LessonDetailPage = () => {
  const { lessonId } = useParams()
  const navigate = useNavigate()

  const [currentStage, setCurrentStage] = useState(STAGES.FLASHCARD)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [userInput, setUserInput] = useState("")
  const [isCorrect, setIsCorrect] = useState(null)
  const [mistakeWords, setMistakeWords] = useState([])
  const [progress, setProgress] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [lessonComplete, setLessonComplete] = useState(false)
  const [stats, setStats] = useState({
    totalWords: 0,
    correctAnswers: 0,
    mistakesCount: 0,
    timeSpent: 0,
  })
  const [startTime, setStartTime] = useState(null)

  // Mock lesson data - in a real app, this would be fetched from an API
  const [lesson, setLesson] = useState({
    id: Number.parseInt(lessonId),
    title: "",
    words: [],
  })

  // Fetch lesson data
  useEffect(() => {
    // In a real app, this would be an API call
    const mockLessons = {
      1: {
        title: "School & Education",
        words: [
          {
            id: 1,
            word: "Classroom",
            definition: "A room where classes are taught in a school or college",
            example: "The students gathered in the classroom for their English lesson.",
            partOfSpeech: "noun",
            pronunciation: "/ˈklɑːsruːm/",
            blankSentence: "The teacher asked everyone to be quiet in the _______.",
          },
          {
            id: 2,
            word: "Homework",
            definition: "Work that a student is given to do at home",
            example: "I have a lot of homework to complete this weekend.",
            partOfSpeech: "noun",
            pronunciation: "/ˈhoʊmwɜːrk/",
            blankSentence: "Don't forget to do your _______ before tomorrow's class.",
          },
          {
            id: 3,
            word: "Teacher",
            definition: "A person who helps students to learn",
            example: "Our math teacher explains concepts very clearly.",
            partOfSpeech: "noun",
            pronunciation: "/ˈtiːtʃər/",
            blankSentence: "The _______ wrote the assignment on the board.",
          },
          {
            id: 4,
            word: "Textbook",
            definition: "A book used as a standard source in a particular subject",
            example: "Please open your textbooks to page 42.",
            partOfSpeech: "noun",
            pronunciation: "/ˈtekstbʊk/",
            blankSentence: "The information can be found on page 15 of your _______.",
          },
          {
            id: 5,
            word: "Examination",
            definition: "A formal test of knowledge or proficiency",
            example: "We have our final examination next week.",
            partOfSpeech: "noun",
            pronunciation: "/ɪɡˌzæmɪˈneɪʃən/",
            blankSentence: "Students are preparing for their final _______ in June.",
          },
        ],
      },
      2: {
        title: "Work & Office",
        words: [
          {
            id: 1,
            word: "Colleague",
            definition: "A person with whom one works",
            example: "My colleagues are very supportive.",
            partOfSpeech: "noun",
            pronunciation: "/ˈkɒliːɡ/",
            blankSentence: "I'm going to lunch with my _______ from the marketing department.",
          },
          {
            id: 2,
            word: "Deadline",
            definition: "The latest time by which something should be completed",
            example: "We need to meet the deadline for this project.",
            partOfSpeech: "noun",
            pronunciation: "/ˈdedlaɪn/",
            blankSentence: "The _______ for submitting the report is Friday at 5 PM.",
          },
          {
            id: 3,
            word: "Meeting",
            definition: "An assembly of people for discussion or business",
            example: "We have a team meeting every Monday morning.",
            partOfSpeech: "noun",
            pronunciation: "/ˈmiːtɪŋ/",
            blankSentence: "The weekly _______ will be held in the conference room.",
          },
        ],
      },
    }

    if (mockLessons[lessonId]) {
      setLesson({
        id: Number.parseInt(lessonId),
        title: mockLessons[lessonId].title,
        words: mockLessons[lessonId].words,
      })
      setStats((prev) => ({
        ...prev,
        totalWords: mockLessons[lessonId].words.length,
      }))
      setStartTime(Date.now())
    } else {
      // Handle lesson not found
      navigate("/lessons")
    }
  }, [lessonId, navigate])

  // Current word being learned
  const currentWord = lesson.words[currentWordIndex] || {}

  // Handle next word
  const goToNextWord = () => {
    setFlipped(false)
    setUserInput("")
    setIsCorrect(null)
    setShowHint(false)

    if (currentWordIndex < lesson.words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1)
    } else {
      // If we're in flashcard stage, move to writing stage
      if (currentStage === STAGES.FLASHCARD) {
        setCurrentStage(STAGES.WRITING)
        setCurrentWordIndex(0)
      }
      // If we're in writing stage, move to fill blanks stage
      else if (currentStage === STAGES.WRITING) {
        setCurrentStage(STAGES.FILL_BLANKS)
        setCurrentWordIndex(0)
      }
      // If we're in fill blanks stage, check if there are mistake words to review
      else if (currentStage === STAGES.FILL_BLANKS) {
        if (mistakeWords.length > 0) {
          // Review mistake words
          setLesson((prev) => ({
            ...prev,
            words: mistakeWords,
          }))
          setCurrentWordIndex(0)
          setMistakeWords([])
          setCurrentStage(STAGES.WRITING) // Start with writing stage for review
        } else {
          // Lesson completed
          setCurrentStage(STAGES.COMPLETED)
          setLessonComplete(true)
          // Calculate time spent
          const timeSpent = Math.floor((Date.now() - startTime) / 1000) // in seconds
          setStats((prev) => ({
            ...prev,
            timeSpent,
          }))
        }
      }
    }

    // Update progress
    const totalSteps = lesson.words.length * 3 // 3 stages per word
    const currentStep =
      (currentStage === STAGES.FLASHCARD
        ? 0
        : currentStage === STAGES.WRITING
          ? 1
          : currentStage === STAGES.FILL_BLANKS
            ? 2
            : 0) *
      lesson.words.length +
      currentWordIndex +
      1

    setProgress(Math.min((currentStep / totalSteps) * 100, 100))
  }

  // Handle previous word
  const goToPreviousWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1)
      setFlipped(false)
      setUserInput("")
      setIsCorrect(null)
      setShowHint(false)
    }
  }

  // Handle flashcard flip
  const handleFlip = () => {
    setFlipped(!flipped)
  }

  // Play pronunciation
  const playAudio = (e) => {
    e?.stopPropagation()
    const utterance = new SpeechSynthesisUtterance(currentWord.word)
    utterance.lang = "en-US"
    window.speechSynthesis.speak(utterance)
  }

  // Check user input for writing and fill blanks stages
  const checkAnswer = () => {
    const normalizedInput = userInput.trim().toLowerCase()
    const normalizedWord = currentWord.word.toLowerCase()

    const correct = normalizedInput === normalizedWord
    setIsCorrect(correct)

    if (correct) {
      setStats((prev) => ({
        ...prev,
        correctAnswers: prev.correctAnswers + 1,
      }))
      // Move to next word after a short delay
      setTimeout(() => {
        goToNextWord()
      }, 1000)
    } else {
      setStats((prev) => ({
        ...prev,
        mistakesCount: prev.mistakesCount + 1,
      }))
      // Add to mistake words if not already there
      if (!mistakeWords.some((w) => w.id === currentWord.id)) {
        setMistakeWords([...mistakeWords, currentWord])
      }
    }
  }

  // Show hint in writing stage
  const toggleHint = () => {
    setShowHint(!showHint)
  }

  // Restart lesson
  const restartLesson = () => {
    setCurrentStage(STAGES.FLASHCARD)
    setCurrentWordIndex(0)
    setFlipped(false)
    setUserInput("")
    setIsCorrect(null)
    setMistakeWords([])
    setProgress(0)
    setShowHint(false)
    setLessonComplete(false)
    setStats({
      totalWords: lesson.words.length,
      correctAnswers: 0,
      mistakesCount: 0,
      timeSpent: 0,
    })
    setStartTime(Date.now())
  }

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  // Animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
  }

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto">
        <motion.div className="mb-6 flex items-center justify-between" variants={cardVariants}>
          <button
            onClick={() => navigate("/lessons")}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Lessons
          </button>

          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-200">
              {lesson.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
              {currentStage === STAGES.FLASHCARD
                ? "Flashcard Stage"
                : currentStage === STAGES.WRITING
                  ? "Writing Stage"
                  : currentStage === STAGES.FILL_BLANKS
                    ? "Fill in the Blanks"
                    : "Lesson Complete"}
            </p>
          </div>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-6 transition-colors duration-200"
          variants={cardVariants}
        >
          <motion.div
            className="h-2.5 rounded-full bg-emerald-500 dark:bg-emerald-600 transition-colors duration-200"
            style={{ width: `${progress}%` }}
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          ></motion.div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Flashcard Stage */}
          {currentStage === STAGES.FLASHCARD && (
            <motion.div
              key="flashcard"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 transition-colors duration-200"
            >
              <div className="mb-4 flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
                  Word {currentWordIndex + 1} of {lesson.words.length}
                </span>
                <span className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded transition-colors duration-200">
                  {currentWord.partOfSpeech}
                </span>
              </div>

              <div className="relative h-64 w-full perspective-1000 cursor-pointer mb-6" onClick={handleFlip}>
                <div
                  className={`absolute inset-0 transition-transform duration-500 transform-style-preserve-3d ${flipped ? "rotate-y-180" : ""}`}
                >
                  {/* Front of card */}
                  <div className="absolute inset-0 backface-hidden bg-white dark:bg-gray-800 rounded-xl border-2 border-emerald-100 dark:border-emerald-900/50 flex flex-col items-center justify-center p-8 transition-colors duration-200">
                    <motion.h2
                      className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-200"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      key={currentWord.word}
                    >
                      {currentWord.word}
                    </motion.h2>
                    <motion.div
                      className="text-gray-500 dark:text-gray-400 text-sm mb-6 transition-colors duration-200"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {currentWord.pronunciation}
                    </motion.div>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation()
                        playAudio()
                      }}
                      className="mt-2 p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Volume2 className="h-6 w-6" />
                    </motion.button>
                    <p className="mt-6 text-gray-500 dark:text-gray-400 text-sm transition-colors duration-200">
                      Click to see definition
                    </p>
                  </div>

                  {/* Back of card */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white dark:bg-gray-800 rounded-xl border-2 border-emerald-100 dark:border-emerald-900/50 flex flex-col p-8 transition-colors duration-200">
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-200">
                        Definition:
                      </h3>
                      <p className="text-gray-800 dark:text-gray-200 text-lg mb-6 transition-colors duration-200">
                        {currentWord.definition}
                      </p>

                      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                        Example:
                      </h3>
                      <p className="text-gray-800 dark:text-gray-200 italic transition-colors duration-200">
                        {currentWord.example}
                      </p>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm text-center mt-4 transition-colors duration-200">
                      Click to see word
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <motion.button
                  onClick={goToPreviousWord}
                  disabled={currentWordIndex === 0}
                  className={`p-3 rounded-full ${currentWordIndex === 0
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-600"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                    } transition-colors duration-200`}
                  whileHover={currentWordIndex !== 0 ? { scale: 1.1 } : {}}
                  whileTap={currentWordIndex !== 0 ? { scale: 0.9 } : {}}
                >
                  <ChevronLeft className="h-6 w-6" />
                </motion.button>

                <motion.button
                  onClick={goToNextWord}
                  className="px-6 py-2 bg-emerald-500 dark:bg-emerald-600 text-white rounded-md hover:bg-emerald-600 dark:hover:bg-emerald-700 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {currentWordIndex < lesson.words.length - 1 ? "Next Word" : "Next Stage"}
                </motion.button>

                <motion.button
                  onClick={goToNextWord}
                  className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight className="h-6 w-6" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Writing Stage */}
          {currentStage === STAGES.WRITING && (
            <motion.div
              key="writing"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 transition-colors duration-200"
            >
              <div className="mb-4 flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
                  Word {currentWordIndex + 1} of {lesson.words.length}
                </span>
                <span className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded transition-colors duration-200">
                  {currentWord.partOfSpeech}
                </span>
              </div>

              <div className="mb-6">
                <div className="text-center mb-6">
                  <p className="text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                    Write the word that matches this definition:
                  </p>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-200">
                    {currentWord.definition}
                  </h3>
                  <div className="flex justify-center mb-4">
                    <motion.button
                      onClick={playAudio}
                      className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Volume2 className="h-6 w-6" />
                    </motion.button>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 italic text-sm transition-colors duration-200">
                    Example: {currentWord.example}
                  </p>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type your answer here..."
                    className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${isCorrect === null
                        ? "border-gray-300 dark:border-gray-600 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-emerald-200 dark:focus:ring-emerald-900/30"
                        : isCorrect
                          ? "border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/20"
                          : "border-red-500 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && userInput.trim() !== "") {
                        checkAnswer()
                      }
                    }}
                    disabled={isCorrect !== null}
                  />

                  {isCorrect !== null && (
                    <div className="absolute right-3 top-3">
                      {isCorrect ? (
                        <Check className="h-6 w-6 text-green-500 dark:text-green-400" />
                      ) : (
                        <X className="h-6 w-6 text-red-500 dark:text-red-400" />
                      )}
                    </div>
                  )}
                </div>

                {isCorrect === false && (
                  <div className="mt-2 text-center">
                    <p className="text-red-600 dark:text-red-400 mb-1 transition-colors duration-200">
                      Incorrect. The correct answer is:
                    </p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-200">
                      {currentWord.word}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <motion.button
                  onClick={toggleHint}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showHint ? "Hide Hint" : "Show Hint"}
                </motion.button>

                {showHint && (
                  <div className="text-center text-gray-600 dark:text-gray-400 transition-colors duration-200">
                    First letter: <span className="font-bold">{currentWord.word.charAt(0)}</span>
                  </div>
                )}

                <motion.button
                  onClick={() => {
                    if (userInput.trim() !== "") {
                      checkAnswer()
                    }
                  }}
                  disabled={userInput.trim() === "" || isCorrect !== null}
                  className={`px-6 py-2 rounded-md transition-colors duration-200 ${userInput.trim() === "" || isCorrect !== null
                      ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500"
                      : "bg-emerald-500 dark:bg-emerald-600 text-white hover:bg-emerald-600 dark:hover:bg-emerald-700"
                    }`}
                  whileHover={userInput.trim() !== "" && isCorrect === null ? { scale: 1.05 } : {}}
                  whileTap={userInput.trim() !== "" && isCorrect === null ? { scale: 0.95 } : {}}
                >
                  Check Answer
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Fill in the Blanks Stage */}
          {currentStage === STAGES.FILL_BLANKS && (
            <motion.div
              key="fill_blanks"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 transition-colors duration-200"
            >
              <div className="mb-4 flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
                  Word {currentWordIndex + 1} of {lesson.words.length}
                </span>
                <span className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded transition-colors duration-200">
                  {currentWord.partOfSpeech}
                </span>
              </div>

              <div className="mb-6">
                <div className="text-center mb-6">
                  <p className="text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-200">
                    Fill in the blank with the correct word:
                  </p>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 transition-colors duration-200">
                    {currentWord.blankSentence.replace("_______", "___________")}
                  </h3>
                  <div className="flex justify-center mb-2">
                    <motion.button
                      onClick={playAudio}
                      className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Volume2 className="h-6 w-6" />
                    </motion.button>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-200">
                    Hint: {currentWord.definition}
                  </p>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type your answer here..."
                    className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${isCorrect === null
                        ? "border-gray-300 dark:border-gray-600 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-emerald-200 dark:focus:ring-emerald-900/30"
                        : isCorrect
                          ? "border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/20"
                          : "border-red-500 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && userInput.trim() !== "") {
                        checkAnswer()
                      }
                    }}
                    disabled={isCorrect !== null}
                  />

                  {isCorrect !== null && (
                    <div className="absolute right-3 top-3">
                      {isCorrect ? (
                        <Check className="h-6 w-6 text-green-500 dark:text-green-400" />
                      ) : (
                        <X className="h-6 w-6 text-red-500 dark:text-red-400" />
                      )}
                    </div>
                  )}
                </div>

                {isCorrect === false && (
                  <div className="mt-2 text-center">
                    <p className="text-red-600 dark:text-red-400 mb-1 transition-colors duration-200">
                      Incorrect. The correct answer is:
                    </p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-200">
                      {currentWord.word}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-200">
                      {currentWord.blankSentence.replace("_______", currentWord.word)}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <motion.button
                  onClick={toggleHint}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showHint ? "Hide Hint" : "Show Hint"}
                </motion.button>

                {showHint && (
                  <div className="text-center text-gray-600 dark:text-gray-400 transition-colors duration-200">
                    First letter: <span className="font-bold">{currentWord.word.charAt(0)}</span>
                  </div>
                )}

                <motion.button
                  onClick={() => {
                    if (userInput.trim() !== "") {
                      checkAnswer()
                    }
                  }}
                  disabled={userInput.trim() === "" || isCorrect !== null}
                  className={`px-6 py-2 rounded-md transition-colors duration-200 ${userInput.trim() === "" || isCorrect !== null
                      ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500"
                      : "bg-emerald-500 dark:bg-emerald-600 text-white hover:bg-emerald-600 dark:hover:bg-emerald-700"
                    }`}
                  whileHover={userInput.trim() !== "" && isCorrect === null ? { scale: 1.05 } : {}}
                  whileTap={userInput.trim() !== "" && isCorrect === null ? { scale: 0.95 } : {}}
                >
                  Check Answer
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Lesson Complete */}
          {currentStage === STAGES.COMPLETED && (
            <motion.div
              key="completed"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center transition-colors duration-200"
            >
              <motion.div
                className="inline-block p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-6 transition-colors duration-200"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              >
                <Check className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
              </motion.div>

              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-200">
                Lesson Completed!
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg transition-colors duration-200">
                  <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-200">
                    Words Learned
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-200">
                    {stats.totalWords}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg transition-colors duration-200">
                  <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-200">Accuracy</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-200">
                    {Math.round((stats.correctAnswers / (stats.correctAnswers + stats.mistakesCount)) * 100)}%
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg transition-colors duration-200">
                  <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-200">Mistakes</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-200">
                    {stats.mistakesCount}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg transition-colors duration-200">
                  <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-200">Time Spent</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-200">
                    {formatTime(stats.timeSpent)}
                  </p>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <motion.button
                  onClick={restartLesson}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Restart Lesson
                </motion.button>

                <motion.button
                  onClick={() => navigate("/lessons")}
                  className="px-6 py-3 bg-emerald-500 dark:bg-emerald-600 text-white rounded-md hover:bg-emerald-600 dark:hover:bg-emerald-700 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Back to Lessons
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </PageTransition>
  )
}

export default LessonDetailPage

