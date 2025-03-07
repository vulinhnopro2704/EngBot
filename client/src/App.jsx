"use client";

import { useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router";
import { AnimatePresence } from "framer-motion";

import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Toaster } from "@/components/ui/sonner";

// Lazy import các trang
const HomePage = lazy(() => import("./pages/HomePage"));
const FlashcardPage = lazy(() => import("./pages/FlashcardPage"));
const QuizPage = lazy(() => import("./pages/QuizPage"));
const ReviewPage = lazy(() => import("./pages/ReviewPage"));
const ProgressPage = lazy(() => import("./pages/ProgressPage"));
const ChatbotPage = lazy(() => import("./pages/ChatbotPage"));
const ListeningPage = lazy(() => import("./pages/ListeningPage"));
const WritingPage = lazy(() => import("./pages/WritingPage"));
const ReadingPage = lazy(() => import("./pages/ReadingPage"));
const LessonsPage = lazy(() => import("./pages/LessonsPage"));
const LessonDetailPage = lazy(() => import("./pages/LessonDetailPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const CommunityPage = lazy(() => import("./pages/CommunityPage"));
const CreatePostPage = lazy(() => import("./pages/CreatePostPage"));
const PostDetailPage = lazy(() => import("./pages/PostDetailPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPostDetailPage = lazy(() => import("./pages/BlogPostDetailPage"));
const CreateBlogPostPage = lazy(() => import("./pages/CreateBlogPostPage"));

// Lazy import các component admin
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashBoard"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminContent = lazy(() => import("./pages/admin/AdminContent"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));

// Wrapper component để xử lý AnimatePresence và Suspense
const AnimatedRoutes = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAuthRoute = location.pathname === "/login" || location.pathname === "/signup";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleAdminMode = () => {
    window.location.href = isAdminRoute ? "/" : "/admin";
  };

  // Render auth routes mà không có sidebar và navbar
  if (isAuthRoute) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </Suspense>
    );
  }

  // Render admin routes với AdminLayout
  if (isAdminRoute) {
    return (
      <ProtectedRoute>
        <Suspense fallback={<div>Loading admin...</div>}>
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
        </Suspense>
      </ProtectedRoute>
    );
  }

  // Render regular user routes
  return (
    <>
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} isAdmin={false} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} toggleAdminMode={toggleAdminMode} isAdmin={false} />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-200">
          <Suspense fallback={<div>Loading...</div>}>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomePage />} />
                <Route
                  path="/flashcards"
                  element={
                    <ProtectedRoute>
                      <FlashcardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/quiz"
                  element={
                    <ProtectedRoute>
                      <QuizPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/review"
                  element={
                    <ProtectedRoute>
                      <ReviewPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/progress"
                  element={
                    <ProtectedRoute>
                      <ProgressPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chatbot"
                  element={
                    <ProtectedRoute>
                      <ChatbotPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/listening"
                  element={
                    <ProtectedRoute>
                      <ListeningPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/writing"
                  element={
                    <ProtectedRoute>
                      <WritingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reading"
                  element={
                    <ProtectedRoute>
                      <ReadingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/lessons"
                  element={
                    <ProtectedRoute>
                      <LessonsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/lessons/:lessonId"
                  element={
                    <ProtectedRoute>
                      <LessonDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/community"
                  element={
                    <ProtectedRoute>
                      <CommunityPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/community/create-post"
                  element={
                    <ProtectedRoute>
                      <CreatePostPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/community/post/:postId"
                  element={
                    <ProtectedRoute>
                      <PostDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/blog"
                  element={
                    <ProtectedRoute>
                      <BlogPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/blog/post/:postId"
                  element={
                    <ProtectedRoute>
                      <BlogPostDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/blog/create"
                  element={
                    <ProtectedRoute>
                      <CreateBlogPostPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </main>
      </div>
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <AnimatedRoutes />
          </div>
        </Router>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
