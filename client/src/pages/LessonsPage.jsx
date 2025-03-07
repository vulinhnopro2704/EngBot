"use client"

import { useState } from "react"
import { Link } from "react-router"
import { Book, Briefcase, Home, Users, Utensils, ShoppingBag, Plane, Activity, Award } from "lucide-react"
import { motion } from "framer-motion"
import PageTransition from "../components/PageTransition"

const LessonsPage = () => {
  const [activeCategory, setActiveCategory] = useState("all")

  const categories = [
    { id: "all", name: "All Lessons" },
    { id: "beginner", name: "Beginner" },
    { id: "intermediate", name: "Intermediate" },
    { id: "advanced", name: "Advanced" },
    { id: "business", name: "Business English" },
  ]

  const lessons = [
    {
      id: 1,
      title: "School & Education",
      description: "Learn vocabulary related to school, education, and academic life.",
      icon: Book,
      color: "bg-blue-500",
      category: "beginner",
      wordsCount: 20,
      completedCount: 0,
      estimatedTime: "15 min",
    },
    {
      id: 2,
      title: "Work & Office",
      description: "Essential vocabulary for the workplace and professional settings.",
      icon: Briefcase,
      color: "bg-emerald-500",
      category: "intermediate",
      wordsCount: 25,
      completedCount: 0,
      estimatedTime: "20 min",
    },
    {
      id: 3,
      title: "Home & Family",
      description: "Words related to home, family members, and daily household activities.",
      icon: Home,
      color: "bg-purple-500",
      category: "beginner",
      wordsCount: 18,
      completedCount: 0,
      estimatedTime: "12 min",
    },
    {
      id: 4,
      title: "Social Interactions",
      description: "Vocabulary for social situations, making friends, and conversations.",
      icon: Users,
      color: "bg-orange-500",
      category: "intermediate",
      wordsCount: 22,
      completedCount: 0,
      estimatedTime: "18 min",
    },
    {
      id: 5,
      title: "Food & Dining",
      description: "Words for food, cooking, restaurants, and dining experiences.",
      icon: Utensils,
      color: "bg-red-500",
      category: "beginner",
      wordsCount: 24,
      completedCount: 0,
      estimatedTime: "20 min",
    },
    {
      id: 6,
      title: "Shopping & Commerce",
      description: "Vocabulary for shopping, stores, products, and transactions.",
      icon: ShoppingBag,
      color: "bg-pink-500",
      category: "intermediate",
      wordsCount: 20,
      completedCount: 0,
      estimatedTime: "15 min",
    },
    {
      id: 7,
      title: "Travel & Transportation",
      description: "Essential words for traveling, transportation, and navigation.",
      icon: Plane,
      color: "bg-indigo-500",
      category: "intermediate",
      wordsCount: 28,
      completedCount: 0,
      estimatedTime: "25 min",
    },
    {
      id: 8,
      title: "Business Negotiations",
      description: "Advanced vocabulary for business meetings and negotiations.",
      icon: Activity,
      color: "bg-gray-700",
      category: "business",
      wordsCount: 30,
      completedCount: 0,
      estimatedTime: "30 min",
    },
    {
      id: 9,
      title: "Academic Writing",
      description: "Sophisticated vocabulary for academic papers and research.",
      icon: Award,
      color: "bg-yellow-500",
      category: "advanced",
      wordsCount: 35,
      completedCount: 0,
      estimatedTime: "35 min",
    },
  ]

  const filteredLessons =
    activeCategory === "all" ? lessons : lessons.filter((lesson) => lesson.category === activeCategory)

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
      <div className="max-w-7xl mx-auto">
        <motion.div className="mb-8" variants={itemVariants}>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-200">
            Vocabulary Lessons
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-200">
            Choose a lesson to start learning new vocabulary
          </p>
        </motion.div>

        {/* Categories */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8 transition-colors duration-200"
          variants={itemVariants}
        >
          <div className="flex overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                className={`px-6 py-3 font-medium whitespace-nowrap transition-colors duration-200 ${activeCategory === category.id
                    ? "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500 dark:border-emerald-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                onClick={() => setActiveCategory(category.id)}
                whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.05)" }}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Lessons Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredLessons.map((lesson) => (
            <motion.div
              key={lesson.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${lesson.color} text-white mr-4`}>
                    <lesson.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 transition-colors duration-200">
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                      {lesson.wordsCount} words • {lesson.estimatedTime}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm transition-colors duration-200">
                  {lesson.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden transition-colors duration-200">
                      <div
                        className="h-full bg-emerald-500 dark:bg-emerald-600 transition-colors duration-200"
                        style={{ width: `${(lesson.completedCount / lesson.wordsCount) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-200">
                      {lesson.completedCount} of {lesson.wordsCount} completed
                    </p>
                  </div>

                  <Link to={`/lessons/${lesson.id}`}>
                    <motion.button
                      className="px-4 py-2 bg-emerald-500 dark:bg-emerald-600 text-white rounded-md hover:bg-emerald-600 dark:hover:bg-emerald-700 transition-colors duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Start
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PageTransition>
  )
}

export default LessonsPage

