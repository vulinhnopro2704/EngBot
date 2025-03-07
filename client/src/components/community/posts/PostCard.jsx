"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal, Bookmark } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router"

const PostCard = ({ post }) => {
  const navigate = useNavigate()
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes)
  const [saved, setSaved] = useState(false)

  const handleLike = () => {
    if (liked) {
      setLikesCount(likesCount - 1)
    } else {
      setLikesCount(likesCount + 1)
    }
    setLiked(!liked)
  }

  const handleSave = () => {
    setSaved(!saved)
  }

  const handleViewPost = () => {
    navigate(`/community/post/${post.id}`)
  }

  // Format the post content with line breaks
  const formattedContent = post.content.split('\n').map((line, i) => (
    <p key={i} className="mb-2">{line}</p>
  ))

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      {/* Post Header */}
      <div className="p-4 flex items-start justify-between">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback className="bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100 transition-colors duration-200">
              {post.author.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center">
              <h3 className="font-medium text-gray-800 dark:text-gray-100 transition-colors duration-200">
                {post.author.name}
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 transition-colors duration-200">
                @{post.author.username}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <Badge variant="outline" className="mr-2 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 transition-colors duration-200">
            {post.category}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleSave}>
                <Bookmark className="h-4 w-4 mr-2" />
                {saved ? "Unsave post" : "Save post"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/community/post/${post.id}`)}>
                View post
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 dark:text-red-400">
                Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <div className="text-gray-800 dark:text-gray-200 text-sm transition-colors duration-200">
          {formattedContent}
        </div>

        {post.images && post.images.length > 0 && (
          <div className="mt-3">
            {post.images.map((image, index) => (
              <img
                key={index}
                src={image || "/placeholder.svg"}
                alt={`Post image ${index + 1}`}
                className="rounded-lg w-full h-auto object-cover max-h-80"
              />
            ))}
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 flex justify-between transition-colors duration-200">
        <Button
          variant="ghost"
          size="sm"
          className={`text-xs flex items-center ${liked ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-400'} transition-colors duration-200`}
          onClick={handleLike}
        >
          <ThumbsUp className="h-4 w-4 mr-1" />
          {likesCount}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-xs flex items-center text-gray-600 dark:text-gray-400 transition-colors duration-200"
          onClick={handleViewPost}
        >
          <MessageCircle className="h-4 w-4 mr-1" />
          {post.comments}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-xs flex items-center text-gray-600 dark:text-gray-400 transition-colors duration-200"
        >
          <Share2 className="h-4 w-4 mr-1" />
          {post.shares}
        </Button>
      </div>
    </motion.div>
  )
}

export default PostCard

