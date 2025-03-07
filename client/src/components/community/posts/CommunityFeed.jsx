"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Filter } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PostCard from "./PostCard"
import CreatePostCard from "./CreatePostCard"
import { Skeleton } from "@/components/ui/skeleton"

// Sample post data
const SAMPLE_POSTS = [
  {
    id: 1,
    author: {
      id: 101,
      name: "Emily Chen",
      username: "emilyc",
      avatar: null,
    },
    content: "Just learned about the difference between 'affect' and 'effect'. Here's a simple rule: 'Affect' is usually a verb (action) and 'Effect' is usually a noun (thing). Example: The weather affects my mood. / The effect of the weather on my mood is significant.",
    images: [],
    category: "Grammar Tips",
    likes: 42,
    comments: 8,
    shares: 5,
    createdAt: "2023-03-06T14:28:00.000Z",
  },
  {
    id: 2,
    author: {
      id: 102,
      name: "James Wilson",
      username: "jamesw",
      avatar: null,
    },
    content: "I've been practicing my pronunciation with tongue twisters. This one is challenging: 'She sells seashells by the seashore.' Anyone have other good ones to share?",
    images: ["/placeholder.svg?height=300&width=500"],
    category: "Pronunciation",
    likes: 28,
    comments: 15,
    shares: 3,
    createdAt: "2023-03-05T09:15:00.000Z",
  },
  {
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
    comments: 23,
    shares: 14,
    createdAt: "2023-03-04T16:42:00.000Z",
  },
  {
    id: 4,
    author: {
      id: 104,
      name: "Ahmed Hassan",
      username: "ahmedh",
      avatar: null,
    },
    content: "Learned some interesting idioms today:\n\n• 'Break a leg' = Good luck\n• 'Cost an arm and a leg' = Very expensive\n• 'Hit the books' = Study hard\n• 'Piece of cake' = Very easy\n\nWhat are your favorite English idioms?",
    images: ["/placeholder.svg?height=300&width=500"],
    category: "Idioms & Phrases",
    likes: 56,
    comments: 31,
    shares: 9,
    createdAt: "2023-03-03T11:20:00.000Z",
  },
]

const CommunityFeed = ({ searchQuery }) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("latest")
  const [categoryFilter, setCategoryFilter] = useState("all")
  
  // Categories for filtering
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "grammar-tips", label: "Grammar Tips" },
    { value: "vocabulary", label: "Vocabulary" },
    { value: "pronunciation", label: "Pronunciation" },
    { value: "ielts-preparation", label: "IELTS Preparation" },
    { value: "idioms-phrases", label: "Idioms & Phrases" },
  ]
  
  // Simulate loading posts from an API
  useEffect(() => {
    const timer = setTimeout(() => {
      setPosts(SAMPLE_POSTS)
      setLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])
  
  // Filter posts based on search query and category
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery 
      ? post.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
        post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true
      
    const matchesCategory = categoryFilter === "all" || 
      post.category.toLowerCase().replace(/\s+/g, '-') === categoryFilter
      
    return matchesSearch && matchesCategory
  })
  
  // Sort posts based on filter
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (filter === "latest") {
      return new Date(b.createdAt) - new Date(a.createdAt)
    } else if (filter === "popular") {
      return (b.likes + b.comments) - (a.likes + a.comments)
    }
    return 0
  })
  
  return (
    <div className="space-y-6">
      <CreatePostCard />
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center">
            <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
              Filter Posts
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px] h-8 text-xs">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-[140px] h-8 text-xs">
                <SelectValue placeholder="Latest" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {loading ? (
        // Skeleton loading state
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 transition-colors duration-200">
              <div className="flex items-center space-x-3 mb-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="space-y-2">
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
          ))}
        </div>
      ) : (
        <AnimatePresence>
          {sortedPosts.length > 0 ? (
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {sortedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center transition-colors duration-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
                No posts found matching your criteria.
              </p>
              <Button 
                onClick={() => {
                  setCategoryFilter("all")
                  setFilter("latest")
                }}
                variant="link" 
                className="mt-2 text-emerald-600 dark:text-emerald-400 transition-colors duration-200"
              >
                Clear filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}

export default CommunityFeed

