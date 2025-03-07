"use client"

import { useState } from "react"

import { motion } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { ThumbsUp, MessageCircle, Bookmark } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"

const BlogPostCard = ({ post }) => {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)

  const handleSave = (e) => {
    e.stopPropagation()
    setSaved(!saved)
  }

  const handlePostClick = () => {
    navigate(`/blog/post/${post.id}`)
  }

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200 cursor-pointer"
      onClick={handlePostClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={post.coverImage || "/placeholder.svg"}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white">{post.category}</Badge>
        </div>
        <button
          className={`absolute top-3 right-3 p-1.5 rounded-full ${saved ? "bg-emerald-500 text-white" : "bg-white/80 text-gray-700 hover:bg-white"
            } transition-colors duration-200`}
          onClick={handleSave}
        >
          <Bookmark className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 line-clamp-2 transition-colors duration-200">
          {post.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2 transition-colors duration-200">
          {post.excerpt}
        </p>

        <div className="flex items-center mb-3">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback className="bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100 transition-colors duration-200">
              {post.author.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs font-medium text-gray-800 dark:text-gray-200 transition-colors duration-200">
              {post.author.name}
            </p>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
              <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
              <span className="mx-1">•</span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700 transition-colors duration-200">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-500 dark:text-gray-400 transition-colors duration-200">
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span className="text-xs">{post.likes}</span>
            </div>
            <div className="flex items-center text-gray-500 dark:text-gray-400 transition-colors duration-200">
              <MessageCircle className="h-4 w-4 mr-1" />
              <span className="text-xs">{post.comments}</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/blog/post/${post.id}`)
            }}
          >
            Read More
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default BlogPostCard

