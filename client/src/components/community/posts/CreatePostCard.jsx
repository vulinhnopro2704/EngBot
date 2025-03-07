"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Image, Smile, Tag, Send } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "../../../contexts/AuthContext"

const CreatePostCard = () => {
  const { currentUser } = useAuth()
  const [content, setContent] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  
  const handleFocus = () => {
    setIsExpanded(true)
  }
  
  const handleCancel = () => {
    setContent("")
    setIsExpanded(false)
  }
  
  const handleSubmit = () => {
    if (content.trim()) {
      // In a real app, you would submit the post to your backend
      console.log("Submitting post:", content)
      setContent("")
      setIsExpanded(false)
    }
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 transition-colors duration-200">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
          <AvatarFallback className="bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100 transition-colors duration-200">
            {currentUser?.name ? currentUser.name.charAt(0) : "U"}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <Textarea
            placeholder="Share your thoughts, questions, or learning tips..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={handleFocus}
            className="min-h-[60px] resize-none border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-500 transition-colors duration-200"
          />
          
          {isExpanded && (
            <motion.div 
              className="mt-3 flex flex-wrap justify-between items-center"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex space-x-2 mb-2 sm:mb-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs flex items-center text-gray-600 dark:text-gray-400 transition-colors duration-200"
                >
                  <Image className="h-4 w-4 mr-1" />
                  Add Image
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs flex items-center text-gray-600 dark:text-gray-400 transition-colors duration-200"
                >
                  <Tag className="h-4 w-4 mr-1" />
                  Category
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs flex items-center text-gray-600 dark:text-gray-400 transition-colors duration-200"
                >
                  <Smile className="h-4 w-4 mr-1" />
                  Emoji
                </Button>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCancel}
                  className="h-8 text-xs"
                >
                  Cancel
                </Button>
                
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleSubmit}
                  disabled={!content.trim()}
                  className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-200"
                >
                  <Send className="h-3 w-3 mr-1" />
                  Post
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreatePostCard

