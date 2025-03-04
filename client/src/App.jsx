import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router"
import { AnimatePresence } from "framer-motion"

import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import HomePage from "./pages/HomePage"
import FlashcardPage from "./pages/FlashcardPage"
import QuizPage from "./pages/QuizPage"
import ReviewPage from "./pages/ReviewPage"
import ProgressPage from "./pages/ProgressPage"
import ChatbotPage from "./pages/ChatbotPage"

// Wrapper component to handle AnimatePresence
const AnimatedRoutes = () => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/flashcards" element={<FlashcardPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar toggleSidebar={toggleSidebar} />

          <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
            <AnimatedRoutes />
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App

