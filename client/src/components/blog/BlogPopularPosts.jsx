"use client"

import { motion } from "framer-motion"
import { TrendingUp } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useNavigate } from "react-router"

const BlogPopularPosts = ({ posts }) => {
  const navigate = useNavigate()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 transition-colors duration-200">
      <div className="flex items-center mb-3">
        <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mr-2" />
        <h3 className="font-medium text-gray-800 dark:text-gray-100 transition-colors duration-200">
          Popular Articles
        </h3>
      </div>

      <div className="space-y-3">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            className="flex items-start cursor-pointer"
            onClick={() => navigate(`/blog/post/${post.id}`)}
            whileHover={{ x: 3 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0 mr-3">
              <img
                src={post.coverImage || "/placeholder.svg"}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-800 dark:text-gray-100 line-clamp-2 transition-colors duration-200">
                {post.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-200">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default BlogPopularPosts

