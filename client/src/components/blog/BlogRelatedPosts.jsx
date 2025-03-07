"use client"

import { motion } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { useNavigate } from "react-router"
import { Badge } from "@/components/ui/badge"

const BlogRelatedPosts = ({ posts }) => {
  const navigate = useNavigate()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {posts.map((post) => (
        <motion.div
          key={post.id}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden cursor-pointer transition-colors duration-200"
          onClick={() => navigate(`/blog/post/${post.id}`)}
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="h-40 overflow-hidden">
            <img
              src={post.coverImage || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
          </div>

          <div className="p-4">
            <Badge className="mb-2 bg-emerald-500 hover:bg-emerald-600 text-white">{post.category}</Badge>

            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2 line-clamp-2 transition-colors duration-200">
              {post.title}
            </h3>

            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2 transition-colors duration-200">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
              <span>By {post.author.name}</span>
              <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default BlogRelatedPosts

