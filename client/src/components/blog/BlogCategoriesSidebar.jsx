"use client"

import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"

const BlogCategoriesSidebar = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 transition-colors duration-200">
      <div className="flex items-center mb-3">
        <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mr-2" />
        <h3 className="font-medium text-gray-800 dark:text-gray-100 transition-colors duration-200">Categories</h3>
      </div>

      <div className="space-y-1">
        {categories.map((category) => (
          <motion.button
            key={category.value}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-left text-sm transition-colors duration-200 ${
              activeCategory === category.value
                ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-medium"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            onClick={() => onCategoryChange(category.value)}
            whileHover={{ x: 3 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <span>{category.label}</span>
            {category.value !== "all" && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  activeCategory === category.value
                    ? "bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-400"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                } transition-colors duration-200`}
              >
                {Math.floor(Math.random() * 20) + 1}
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default BlogCategoriesSidebar

