"use client"
import { Bot } from "lucide-react"
import { motion } from "framer-motion"
import PageTransition from "../components/PageTransition"

const ChatbotPage = () => {
  // This is just a placeholder component
  // The actual 3D AI Chatbot implementation will be done by the user

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
      <div className="max-w-4xl mx-auto">
        <motion.div className="mb-8" variants={itemVariants}>
          <h1 className="text-3xl font-bold text-gray-800">AI Language Assistant</h1>
          <p className="text-gray-600 mt-2">Practice your English with our 3D AI Chatbot</p>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-md p-6 mb-8 flex items-center justify-center h-96"
          variants={itemVariants}
        >
          <motion.div
            className="text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              className="inline-block p-4 bg-emerald-100 rounded-full mb-4"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 10,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                duration: 1,
                repeatDelay: 1,
              }}
            >
              <Bot className="h-12 w-12 text-emerald-500" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">3D AI Chatbot</h2>
            <p className="text-gray-600 mb-4">This is a placeholder for the 3D AI Chatbot interface.</p>
            <p className="text-sm text-gray-500">The actual implementation will be done separately.</p>
          </motion.div>
        </motion.div>
      </div>
    </PageTransition>
  )
}

export default ChatbotPage

