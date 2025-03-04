import { Link } from "react-router"
import { Home, BookOpen, CheckSquare, Clock, BarChart2, Settings, X, Bot } from "lucide-react"

const Sidebar = ({ open, toggleSidebar }) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-emerald-500">VocaLearn</span>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <nav className="mt-5 px-2 space-y-1">
        <Link
          to="/"
          className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"
        >
          <Home className="mr-4 h-6 w-6" />
          Home
        </Link>

        <Link
          to="/flashcards"
          className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"
        >
          <BookOpen className="mr-4 h-6 w-6" />
          Flashcards
        </Link>

        <Link
          to="/quiz"
          className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"
        >
          <CheckSquare className="mr-4 h-6 w-6" />
          Quizzes
        </Link>

        <Link
          to="/review"
          className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"
        >
          <Clock className="mr-4 h-6 w-6" />
          Review
        </Link>

        <Link
          to="/progress"
          className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"
        >
          <BarChart2 className="mr-4 h-6 w-6" />
          Progress
        </Link>

        <Link
          to="/chatbot"
          className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"
        >
          <Bot className="mr-4 h-6 w-6" />
          AI Chatbot
        </Link>
      </nav>

      <div className="absolute bottom-0 w-full border-t border-gray-200">
        <div className="px-2 py-4">
          <Link
            to="/settings"
            className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"
          >
            <Settings className="mr-4 h-6 w-6" />
            Settings
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Sidebar

