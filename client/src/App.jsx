"use client"
import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router"
import { AnimatePresence } from "framer-motion"

import { ThemeProvider } from "./components/ThemeProvider"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import HomePage from "./pages/HomePage"
import FlashcardPage from "./pages/FlashcardPage"
import QuizPage from "./pages/QuizPage"
import ReviewPage from "./pages/ReviewPage"
import ProgressPage from "./pages/ProgressPage"
import ChatbotPage from "./pages/ChatbotPage"
import ListeningPage from "./pages/ListeningPage"
import WritingPage from "./pages/WritingPage"
import ReadingPage from "./pages/ReadingPage"

// Admin components
import AdminDashboard from "./pages/admin/AdminDashBoard"
import AdminUsers from "./pages/admin/AdminUsers"
import AdminContent from "./pages/admin/AdminContent"
import AdminSettings from "./pages/admin/AdminSetting"
import AdminLayout from "./components/admin/AdminLayout"
import LessonsPage from "./pages/LessonPage"
import LessonDetailPage from "./pages/LessonDetailPage"

// Wrapper component to handle AnimatePresence
const AnimatedRoutes = () => {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith("/admin")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const toggleAdminMode = () => {
    // Navigate to admin dashboard or home page
    window.location.href = isAdminRoute ? "/" : "/admin"
  }

  // Render admin routes with AdminLayout
  if (isAdminRoute) {
    return (
      <AdminLayout>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/content" element={<AdminContent />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Routes>
        </AnimatePresence>
      </AdminLayout>
    )
  }

  // Render regular user routes
  return (
    <>
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} isAdmin={false} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} toggleAdminMode={toggleAdminMode} isAdmin={false} />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-200">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/flashcards" element={<FlashcardPage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/review" element={<ReviewPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/chatbot" element={<ChatbotPage />} />
              <Route path="/listening" element={<ListeningPage />} />
              <Route path="/writing" element={<WritingPage />} />
              <Route path="/reading" element={<ReadingPage />} />
              <Route path="/lessons" element={<LessonsPage />} />
              <Route path="/lessons/:lessonId" element={<LessonDetailPage />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </>
  )
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <AnimatedRoutes />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App

