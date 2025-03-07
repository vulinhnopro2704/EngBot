"use client"

import { motion } from "framer-motion"
import { Users } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const SuggestedUsers = ({ compact = false }) => {
  // Sample suggested users
  const suggestedUsers = [
    { id: 1, name: "Sarah Johnson", username: "sarahj", level: "Advanced", avatar: null },
    { id: 2, name: "Miguel Rodriguez", username: "miguelr", level: "Intermediate", avatar: null },
    { id: 3, name: "Aisha Patel", username: "aishap", level: "Advanced", avatar: null },
    { id: 4, name: "David Kim", username: "davidk", level: "Beginner", avatar: null },
  ]
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 transition-colors duration-200">
      <div className="flex items-center mb-3">
        <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mr-2" />
        <h3 className="font-medium text-gray-800 dark:text-gray-100 transition-colors duration-200">
          Suggested Learners
        </h3>
      </div>
      
      <div className="space-y-3">
        {suggestedUsers.slice(0, compact ? 2 : 4).map((user) => (
          <motion.div 
            key={user.id}
            className="flex items-center justify-between"
            whileHover={{ x: 3 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100 transition-colors duration-200">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 transition-colors duration-200">
                  {user.name}
                </p>
                {!compact && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                    {user.level} • @{user.username}
                  </p>
                )}
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 text-xs border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-900/20 transition-colors duration-200"
            >
              Follow
            </Button>
          </motion.div>
        ))}
      </div>
      
      {!compact && (
        <button className="mt-3 text-xs text-emerald-600 dark:text-emerald-400 hover:underline transition-colors duration-200">
          View more suggestions
        </button>
      )}
    </div>
  )
}

export default SuggestedUsers

