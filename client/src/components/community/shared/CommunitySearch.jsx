"use client"

import { useState } from "react"
import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"

const CommunitySearch = ({ onSearch }) => {
  const [query, setQuery] = useState("")
  
  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 transition-colors duration-200">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search posts, users, or topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 transition-colors duration-200"
          />
        </div>
      </form>
    </div>
  )
}

export default CommunitySearch

