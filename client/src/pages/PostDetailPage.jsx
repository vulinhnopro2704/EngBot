"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useParams, useNavigate } from "react-router"
import { formatDistanceToNow } from "date-fns"
import { ArrowLeft, ThumbsUp, MessageCircle, Share2, Send, MoreHorizontal, Bookmark } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import PageTransition from "../components/PageTransition"
import { useAuth } from "../contexts/AuthContext"

// Sample post data (would come from API in real app)
const SAMPLE_POST = {
  id: 3,
  author: {
    id: 103,
    name: "Sofia Martinez",
    username: "sofiam",
    avatar: null,
  },
  content: "Just passed my IELTS exam with a band score of 7.5! So happy with my progress. Here are some study tips that helped me:\n\n1. Practice timed writing every day\n2. Record yourself speaking and listen back\n3. Read academic articles regularly\n4. Use vocabulary flashcards\n5. Take full practice tests weekly",
  images: [],
  category: "IELTS Preparation",
  likes: 87,
  comments: [
    {
      id: 1,
      author: {
        id: 101,
        name: "Emily Chen",
        username: "emilyc",
        avatar: null,
      },
      content: "Congratulations! That's an amazing score. How long did you prepare for?",
      timestamp: "2023-03-04T17:30:00.000Z",
      likes: 5,
    },
    {
      id: 2,
      author: {
        id: 102,
        name: "James Wilson",
        username: "jamesw",
        avatar: null,
      },
      content: "Thanks for sharing these tips! I'm taking the test next month and feeling nervous about the speaking section. Any specific advice for that part?",
      timestamp: "2023-03-04T18:15:00.000Z",
      likes: 3,
    },
    {
      id: 3,
      author: {
        id: 103,
        name: "Sofia Martinez",
        username: "sofiam",
        avatar: null,
      },
      content: "@emilyc I prepared for about 3 months, studying 2-3 hours daily.\n\n@jamesw For speaking, I recommend practicing with a timer and recording yourself. Then listen back and identify areas to improve. Also, try to use a variety of vocabulary and sentence structures. Good luck!",
      timestamp: "2023-03-04T19:42:00.000Z",
      likes: 8,
    },
  ],
  shares: 14,
  createdAt: "2023-03-04T16:42:00.000Z",
}

const PostDetailPage = () => {
  const { postId } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [saved, setSaved] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [submittingComment, setSubmittingComment] = useState(false)

  // Simulate fetching post data
  useEffect(() => {
    const timer = setTimeout(() => {
      // In a real app, you would fetch the post by ID from your API
      setPost(SAMPLE_POST)
      setLikesCount(SAMPLE_POST.likes)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [postId])

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

  const handleCommentSubmit = (e) => {
    e.preventDefault()

    if (!newComment.trim()) return

    setSubmittingComment(true)

    // Simulate API call to submit comment
    setTimeout(() => {
      const newCommentObj = {
        id: Date.now(),
        author: {
          id: currentUser?.id || 999,
          name: currentUser?.name || "User",
          username: currentUser?.username || "username",
          avatar: currentUser?.avatar || null,
        },
        content: newComment,
        timestamp: new Date().toISOString(),
        likes: 0,
      }

      setPost({
        ...post,
        comments: [...post.comments, newCommentObj],
      })

      setNewComment("")
      setSubmittingComment(false)
    }, 1000)
  }

  // Format the post content with line breaks
  const formatContent = (content) => {
    return content.split('\n').map((line, i) => (
      <p key={i} className="mb-2">{line}</p>
    ))
  }

  if (loading) {
    return (
      <PageTransition>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-200">
            <div className="flex items-center mb-6">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Skeleton className="h-6 w-32" />
            </div>

            <div className="flex items-center space-x-3 mb-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            <div className="mt-4 flex justify-between">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </div>
      </PageTransition>
    )
  }

  if (!post) {
    return (
      <PageTransition>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center transition-colors duration-200">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-200">
              Post Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-200">
              The post you're looking for doesn't exist or has been removed.
            </p>
            <Button
              onClick={() => navigate("/community")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-200"
            >
              Back to Community
            </Button>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200">
          {/* Post Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <div className="flex items-center mb-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/community")}
                className="mr-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-200">
                Post Detail
              </h1>
            </div>

            <div className="flex items-start justify-between">
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
                    <DropdownMenuItem onClick={() => window.print()}>
                      Print post
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600 dark:text-red-400">
                      Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="p-6">
            <div className="text-gray-800 dark:text-gray-200 transition-colors duration-200">
              {formatContent(post.content)}
            </div>

            {post.images && post.images.length > 0 && (
              <div className="mt-4">
                {post.images.map((image, index) => (
                  <img
                    key={index}
                    src={image || "/placeholder.svg"}
                    alt={`Post image ${index + 1}`}
                    className="rounded-lg w-full h-auto object-cover max-h-96"
                  />
                ))}
              </div>
            )}

            {/* Post Actions */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between transition-colors duration-200">
              <Button
                variant="ghost"
                className={`flex items-center ${liked ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-400'} transition-colors duration-200`}
                onClick={handleLike}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                {likesCount} Likes
              </Button>

              <Button
                variant="ghost"
                className="flex items-center text-gray-600 dark:text-gray-400 transition-colors duration-200"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                {post.comments.length} Comments
              </Button>

              <Button
                variant="ghost"
                className="flex items-center text-gray-600 dark:text-gray-400 transition-colors duration-200"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="p-6 pt-0">
            <h3 className="font-medium text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-200">
              Comments ({post.comments.length})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                  <AvatarFallback className="bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100 transition-colors duration-200">
                    {currentUser?.name ? currentUser.name.charAt(0) : "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[80px] resize-none border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-500 transition-colors duration-200"
                  />

                  <div className="mt-2 flex justify-end">
                    <Button
                      type="submit"
                      disabled={!newComment.trim() || submittingComment}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-200"
                    >
                      {submittingComment ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Posting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Post Comment
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {post.comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                    <AvatarFallback className="bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100 transition-colors duration-200">
                      {comment.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 transition-colors duration-200">
                      <div className="flex items-center mb-1">
                        <span className="font-medium text-sm text-gray-800 dark:text-gray-100 transition-colors duration-200">
                          {comment.author.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 transition-colors duration-200">
                          @{comment.author.username}
                        </span>
                      </div>

                      <div className="text-sm text-gray-800 dark:text-gray-200 transition-colors duration-200">
                        {formatContent(comment.content)}
                      </div>
                    </div>

                    <div className="flex items-center mt-1 ml-2">
                      <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200">
                        Like ({comment.likes})
                      </button>
                      <span className="mx-2 text-gray-400">•</span>
                      <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200">
                        Reply
                      </button>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                        {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default PostDetailPage

