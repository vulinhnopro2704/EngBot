"use client"

import { motion } from "framer-motion"
import { Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const BlogFeaturedAuthors = ({ authors }) => {
  // Remove duplicate authors based on id
  const uniqueAuthors = authors.filter((author, index, self) => index === self.findIndex((a) => a.id === author.id))

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 transition-colors duration-200">
      <div className="flex items-center mb-3">
        <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mr-2" />
        <h3 className="font-medium text-gray-800 dark:text-gray-100 transition-colors duration-200">
          Featured Authors
        </h3>
      </div>

      <div className="space-y-3">
        {uniqueAuthors.map((author) => (
          <motion.div
            key={author.id}
            className="flex items-center justify-between"
            whileHover={{ x: 3 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={author.avatar} alt={author.name} />
                <AvatarFallback className="bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100 transition-colors duration-200">
                  {author.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 transition-colors duration-200">
                  {author.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                  {author.role || "Contributor"}
                </p>
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
    </div>
  )
}

export default BlogFeaturedAuthors

