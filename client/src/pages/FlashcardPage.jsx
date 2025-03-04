"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Volume2, Check, X } from "lucide-react"
import { motion } from "framer-motion"

const FlashcardPage = () => {
  const [flipped, setFlipped] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [cards, setCards] = useState([
    {
      id: 1,
      word: "Accomplish",
      definition: "To succeed in doing something",
      example: "She accomplished her goal of running a marathon.",
      level: "Intermediate",
    },
    {
      id: 2,
      word: "Benevolent",
      definition: "Kind and generous",
      example: "The benevolent donor gave millions to charity.",
      level: "Advanced",
    },
    {
      id: 3,
      word: "Concise",
      definition: "Giving a lot of information clearly and in a few words",
      example: "His instructions were clear and concise.",
      level: "Intermediate",
    },
    {
      id: 4,
      word: "Diligent",
      definition: "Showing care and effort in your work or duties",
      example: "She is a diligent student who always completes her assignments on time.",
      level: "Intermediate",
    },
    {
      id: 5,
      word: "Eloquent",
      definition: "Fluent or persuasive in speaking or writing",
      example: "His eloquent speech moved the audience to tears.",
      level: "Advanced",
    },
  ])

  const handleFlip = () => {
    setFlipped(!flipped)
  }

  const nextCard = () => {
    setFlipped(false)
    setTimeout(() => {
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length)
    }, 300)
  }

  const prevCard = () => {
    setFlipped(false)
    setTimeout(() => {
      setCurrentCardIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length)
    }, 300)
  }

  const markAsKnown = () => {
    // In a real app, you would update the spaced repetition algorithm here
    nextCard()
  }

  const markAsUnknown = () => {
    // In a real app, you would update the spaced repetition algorithm here
    nextCard()
  }

  const playAudio = () => {
    // In a real app, you would play the pronunciation audio here
    const utterance = new SpeechSynthesisUtterance(cards[currentCardIndex].word)
    utterance.lang = "en-US"
    window.speechSynthesis.speak(utterance)
  }

  const currentCard = cards[currentCardIndex]

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  }

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div className="max-w-4xl mx-auto" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <motion.div className="mb-8" variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-800">Flashcards</h1>
        <p className="text-gray-600 mt-2">Flip the cards to learn new vocabulary</p>
      </motion.div>

      <motion.div className="mb-6 flex justify-between items-center" variants={itemVariants}>
        <div className="text-gray-600">
          Card {currentCardIndex + 1} of {cards.length}
        </div>
        <div className="flex space-x-2">
          <motion.button
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Shuffle
          </motion.button>
          <select className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700">
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </motion.div>

      <motion.div className="relative h-80 w-full perspective-1000" variants={itemVariants}>
        <div
          className={`absolute inset-0 transition-transform duration-500 transform-style-preserve-3d cursor-pointer ${flipped ? "rotate-y-180" : ""}`}
          onClick={handleFlip}
        >
          {/* Front of card */}
          <div className="absolute inset-0 backface-hidden bg-white rounded-xl shadow-lg flex flex-col items-center justify-center p-8 border-2 border-emerald-100">
            <span className="absolute top-4 right-4 px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded">
              {currentCard.level}
            </span>
            <motion.h2
              className="text-4xl font-bold text-gray-800 mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              key={currentCard.word}
            >
              {currentCard.word}
            </motion.h2>
            <motion.button
              onClick={(e) => {
                e.stopPropagation()
                playAudio()
              }}
              className="mt-4 p-3 rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Volume2 className="h-6 w-6" />
            </motion.button>
            <p className="mt-6 text-gray-500 text-center">Click to see definition</p>
          </div>

          {/* Back of card */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-xl shadow-lg flex flex-col p-8 border-2 border-emerald-100">
            <span className="absolute top-4 right-4 px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded">
              {currentCard.level}
            </span>
            <div className="flex-1 flex flex-col justify-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Definition:</h3>
              <p className="text-gray-800 text-lg mb-6">{currentCard.definition}</p>

              <h3 className="text-xl font-semibold text-gray-700 mb-2">Example:</h3>
              <p className="text-gray-800 italic">{currentCard.example}</p>
            </div>
            <p className="text-gray-500 text-center mt-4">Click to see word</p>
          </div>
        </div>
      </motion.div>

      <motion.div className="mt-8 flex justify-between items-center" variants={itemVariants}>
        <motion.button
          onClick={prevCard}
          className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="h-6 w-6" />
        </motion.button>

        <div className="flex space-x-4">
          <motion.button
            onClick={markAsUnknown}
            className="p-3 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-6 w-6" />
          </motion.button>
          <motion.button
            onClick={markAsKnown}
            className="p-3 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Check className="h-6 w-6" />
          </motion.button>
        </div>

        <motion.button
          onClick={nextCard}
          className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="h-6 w-6" />
        </motion.button>
      </motion.div>

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
    </motion.div>
  )
}

export default FlashcardPage

