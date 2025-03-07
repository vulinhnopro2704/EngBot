"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useParams, useNavigate } from "react-router"
import { formatDistanceToNow } from "date-fns"
import { ArrowLeft, ThumbsUp, MessageCircle, Share2, Bookmark, Facebook, Twitter, Linkedin, Link2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import PageTransition from "../components/PageTransition"
import { useAuth } from "../contexts/AuthContext"
import BlogRelatedPosts from "../components/blog/BlogRelatedPosts"

// Sample blog posts data (would come from API in real app)
const SAMPLE_BLOG_POSTS = [
  {
    id: 1,
    title: "10 Common English Phrasal Verbs You Should Know",
    excerpt:
      "Phrasal verbs can be challenging for English learners. Here are 10 common ones that will help improve your everyday conversations.",
    content:
      "Phrasal verbs are combinations of words that are used as a single verb, but their meaning is different from the meanings of the individual words combined. They are very common in everyday English.\n\n## 1. Break down\n\nMeaning: To stop functioning (for machines); to lose control of your emotions and cry.\n\nExamples:\n- My car broke down on the highway yesterday.\n- She broke down when she heard the sad news.\n\n## 2. Bring up\n\nMeaning: To mention a topic; to raise a child.\n\nExamples:\n- I didn't want to bring up the issue during dinner.\n- He was brought up by his grandparents.\n\n## 3. Call off\n\nMeaning: To cancel.\n\nExample:\n- The outdoor concert was called off due to rain.\n\n## 4. Figure out\n\nMeaning: To understand, to find the answer.\n\nExample:\n- I can't figure out how to solve this math problem.\n\n## 5. Give up\n\nMeaning: To stop trying, to surrender.\n\nExample:\n- Don't give up on your dreams.\n\n## 6. Look after\n\nMeaning: To take care of.\n\nExample:\n- Can you look after my dog while I'm away?\n\n## 7. Look forward to\n\nMeaning: To be excited about something in the future.\n\nExample:\n- I'm looking forward to meeting you next week.\n\n## 8. Run into\n\nMeaning: To meet by chance.\n\nExample:\n- I ran into my old friend at the supermarket.\n\n## 9. Turn down\n\nMeaning: To reject; to reduce the volume.\n\nExamples:\n- She turned down the job offer.\n- Please turn down the music.\n\n## 10. Work out\n\nMeaning: To exercise; to find a solution.\n\nExamples:\n- I work out at the gym three times a week.\n- We need to work out our differences.\n\nPractice using these phrasal verbs in your daily conversations to sound more natural in English!",
    author: {
      id: 101,
      name: "Emily Chen",
      username: "emilyc",
      avatar: null,
      role: "English Teacher",
    },
    category: "Vocabulary",
    tags: ["phrasal verbs", "vocabulary", "speaking"],
    coverImage: "/placeholder.svg?height=400&width=800",
    readTime: "5 min read",
    likes: 124,
    comments: [
      {
        id: 1,
        author: {
          id: 102,
          name: "James Wilson",
          username: "jamesw",
          avatar: null,
        },
        content:
          "This is really helpful! I always struggle with phrasal verbs. Could you do a follow-up post on phrasal verbs related to business English?",
        timestamp: "2023-03-11T10:30:00.000Z",
        likes: 8,
      },
      {
        id: 2,
        author: {
          id: 103,
          name: "Sofia Martinez",
          username: "sofiam",
          avatar: null,
        },
        content:
          "I've been studying English for years and still find phrasal verbs confusing. This list is a great starting point. Thanks for sharing!",
        timestamp: "2023-03-11T14:15:00.000Z",
        likes: 5,
      },
    ],
    shares: 18,
    createdAt: "2023-03-10T14:28:00.000Z",
    featured: true,
  },
  // Other blog posts would be here
]

const BlogPostDetailPage = () => {
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
  const [relatedPosts, setRelatedPosts] = useState([])

  // Simulate fetching post data
  useEffect(() => {
    const timer = setTimeout(() => {
      // In a real app, you would fetch the post by ID from your API
      const foundPost = SAMPLE_BLOG_POSTS.find((p) => p.id === Number.parseInt(postId))
      setPost(foundPost)

      if (foundPost) {
        setLikesCount(foundPost.likes)

        // Get related posts based on category and tags
        const related = SAMPLE_BLOG_POSTS.filter(
          (p) =>
            p.id !== foundPost.id &&
            (p.category === foundPost.category || p.tags.some((tag) => foundPost.tags.includes(tag))),
        ).slice(0, 3)

        setRelatedPosts(related)
      }

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

  // Format the post content with markdown-like styling
  const formatContent = (content) => {
    if (!content) return null

    // Split content by paragraphs
    const paragraphs = content.split("\n\n")

    return paragraphs.map((paragraph, index) => {
      // Check if paragraph is a heading
      if (paragraph.startsWith("## ")) {
        return (
          <h2
            key={index}
            className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-6 mb-3 transition-colors duration-200"
          >
            {paragraph.replace("## ", "")}
          </h2>
        )
      }

      // Check if paragraph contains a list
      if (paragraph.includes("\n- ")) {
        const [listTitle, ...items] = paragraph.split("\n- ")
        return (
          <div key={index} className="mb-4">
            <p className="text-gray-800 dark:text-gray-200 mb-2 transition-colors duration-200">{listTitle}</p>
            <ul className="list-disc pl-5 space-y-1">
              {items.map((item, i) => (
                <li key={i} className="text-gray-800 dark:text-gray-200 transition-colors duration-200">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )
      }

      // Regular paragraph
      return (
        <p key={index} className="text-gray-800 dark:text-gray-200 mb-4 transition-colors duration-200">
          {paragraph}
        </p>
      )
    })
  }

  if (loading) {
    return (
      <PageTransition>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-200">
            <div className="flex items-center mb-6">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Skeleton className="h-6 w-32" />
            </div>

            <Skeleton className="h-8 w-3/4 mb-4" />

            <div className="flex items-center space-x-3 mb-6">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>

            <Skeleton className="h-64 w-full mb-6" />

            <div className="space-y-4 mb-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
      </PageTransition>
    )
  }

  if (!post) {
    return (
      <PageTransition>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center transition-colors duration-200">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-200">
              Post Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-200">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Button
              onClick={() => navigate("/blog")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-200"
            >
              Back to Blog
            </Button>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200">
          {/* Post Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <div className="flex items-center mb-6">
              <Button variant="ghost" size="icon" onClick={() => navigate("/blog")} className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white">{post.category}</Badge>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-200">
              {post.title}
            </h1>

            <div className="flex items-center justify-between mb-6">
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
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                    <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                    <span className="mx-1">•</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="sm"
                  className={`mr-2 ${saved ? "text-emerald-600 dark:text-emerald-400 border-emerald-600 dark:border-emerald-400" : ""}`}
                  onClick={handleSave}
                >
                  <Bookmark className="h-4 w-4 mr-1" />
                  {saved ? "Saved" : "Save"}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="cursor-pointer">
                      <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                      Facebook
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                      Twitter
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
                      LinkedIn
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href)
                      }}
                    >
                      <Link2 className="h-4 w-4 mr-2" />
                      Copy Link
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="w-full h-80 relative">
            <img src={post.coverImage || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
          </div>

          {/* Post Content */}
          <div className="p-6 md:p-8">
            <div className="prose dark:prose-invert max-w-none">{formatContent(post.content)}</div>

            {/* Tags */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Post Actions */}
            <div className="mt-6 flex justify-between">
              <Button
                variant="ghost"
                className={`flex items-center ${liked ? "text-emerald-600 dark:text-emerald-400" : "text-gray-600 dark:text-gray-400"} transition-colors duration-200`}
                onClick={handleLike}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                {likesCount} Likes
              </Button>

              <Button
                variant="ghost"
                className="flex items-center text-gray-600 dark:text-gray-400 transition-colors duration-200"
                onClick={() => document.getElementById("comments-section").scrollIntoView({ behavior: "smooth" })}
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

            {/* Author Bio */}
            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl transition-colors duration-200">
              <div className="flex items-start">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback className="bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100 transition-colors duration-200">
                    {post.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-100 transition-colors duration-200">
                    About {post.author.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-200">
                    {post.author.role || "Contributor"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-200">
                    Passionate about helping English learners master the language through practical tips and engaging
                    content. Specializes in {post.category.toLowerCase()} and conversational English.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-900/20 transition-colors duration-200"
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div
            id="comments-section"
            className="p-6 md:p-8 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200"
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 transition-colors duration-200">
              Comments ({post.comments.length})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
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
                    className="min-h-[100px] resize-none border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-500 transition-colors duration-200"
                  />

                  <div className="mt-2 flex justify-end">
                    <Button
                      type="submit"
                      disabled={!newComment.trim() || submittingComment}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-200"
                    >
                      {submittingComment ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Posting...
                        </>
                      ) : (
                        "Post Comment"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
              {post.comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                    <AvatarFallback className="bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100 transition-colors duration-200">
                      {comment.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-colors duration-200">
                      <div className="flex items-center mb-2">
                        <span className="font-medium text-gray-800 dark:text-gray-100 transition-colors duration-200">
                          {comment.author.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 transition-colors duration-200">
                          {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                        </span>
                      </div>

                      <p className="text-gray-800 dark:text-gray-200 text-sm transition-colors duration-200">
                        {comment.content}
                      </p>
                    </div>

                    <div className="flex items-center mt-2 ml-2">
                      <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200">
                        Like ({comment.likes})
                      </button>
                      <span className="mx-2 text-gray-400">•</span>
                      <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200">
                        Reply
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 transition-colors duration-200">
              Related Articles
            </h3>
            <BlogRelatedPosts posts={relatedPosts} />
          </div>
        )}
      </div>
    </PageTransition>
  )
}

export default BlogPostDetailPage

