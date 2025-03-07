"use client"

import { useState } from "react"
import { Search, X } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"

const NewMessageDialog = ({ open, onClose, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState("")
  
  // Sample users for search results
  const users = [
    { id: 101, name: "Sarah Johnson", username: "sarahj", avatar: null, status: "online" },
    { id: 102, name: "Miguel Rodriguez", username: "miguelr", avatar: null, status: "offline" },
    { id: 103, name: "Aisha Patel", username: "aishap", avatar: null, status: "online" },
    { id: 104, name: "David Kim", username: "davidk", avatar: null, status: "away" },
    { id: 105, name: "Emma Wilson", username: "emmaw", avatar: null, status: "online" },
    { id: 106, name: "Jamal Ahmed", username: "jamala", avatar: null, status: "offline" },
    { id: 107, name: "Sofia Garcia", username: "sofiag", avatar: null, status: "online" },
    { id: 108, name: "Chen Wei", username: "chenw", avatar: null, status: "away" },
  ]
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const handleUserSelect = (user) => {
    onSelect(user)
  }
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 transition-colors duration-200"
            autoFocus
          />
        </div>
        
        <div className="max-h-[300px] overflow-y-auto">
          {filteredUsers.length > 0 ? (
            <div className="space-y-1">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100 transition-colors duration-200">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className={`absolute bottom-0 right-2 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-gray-800 ${
                      user.status === 'online' ? 'bg-green-500' :
                      user.status === 'away' ? 'bg-yellow-500' :
                      'bg-gray-400'
                    } transition-colors duration-200`}></span>
                  </div>
                  
                  <div>
                    <p className="font-medium text-sm text-gray-800 dark:text-gray-100 transition-colors duration-200">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                      @{user.username}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
                No users found matching "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default NewMessageDialog

