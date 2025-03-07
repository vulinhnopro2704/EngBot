"use client"

import { motion } from "framer-motion"
import { TrendingUp } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

const TrendingTopics = ({ compact = false }) => {
  // Sample trending topics
  const trendingTopics = [
    { id: 1, name: "Grammar Tips", count: 245 },
    { id: 2, name: "Vocabulary Building", count: 189 },
    { id: 3, name: "Pronunciation", count: 156 },
    { id: 4, name: "IELTS Preparation", count: 132 },
    { id: 5, name: "Idioms & Phrases", count: 98 },
  ]
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 transition-colors duration-200">
      <div className="flex items-center mb-3">
        <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mr-2" />
        <h3 className="font-medium text-gray-800 dark:text-gray-100 transition-colors duration-200">
          Trending Topics
        </h3>
      </div>
      
      <div className="space-y-2">
        {trendingTopics.slice(0, compact ? 3 : 5).map((topic) => (
          <motion.div 
            key={topic.id}
            className="flex items-center justify-between"
            whileHover={{ x: 3 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Badge 
              variant="outline" 
              className="cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors duration-200"
            >
              #{topic.name}
            </Badge>
            {!compact && (
              <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                {topic.count} posts
              </span>
            )}
          </motion.div>
        ))}
      </div>
      
      {!compact && (
        <button className="mt-3 text-xs text-emerald-600 dark:text-emerald-400 hover:underline transition-colors duration-200">
          View all topics
        </button>
      )}
    </div>
  )
}

export default TrendingTopics

