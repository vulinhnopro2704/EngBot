"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { Send, Image, Smile, Paperclip } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "../../../contexts/AuthContext"

// Sample messages for the conversation
const generateSampleMessages = (conversation) => {
  const currentUserId = 999 // Assuming current user has this ID
  const otherUserId = conversation.user.id
  
  return [
    {
      id: 1,
      content: "Hi there! I saw your post about English idioms. Very helpful!",
      timestamp: "2023-03-05T09:10:00.000Z",
      sender: otherUserId,
    },
    {
      id: 2,
      content: "Thanks! I'm glad you found it useful. Are you studying for a specific exam?",
      timestamp: "2023-03-05T09:12:00.000Z",
      sender: currentUserId,
    },
    {
      id: 3,
      content: "Yes, I'm preparing for the IELTS test next month. Trying to improve my vocabulary and speaking skills.",
      timestamp: "2023-03-05T09:15:00.000Z",
      sender: otherUserId,
    },
    {
      id: 4,
      content: "That's great! I took the IELTS last year. I can share some resources that helped me if you'd like.",
      timestamp: "2023-03-05T09:18:00.000Z",
      sender: currentUserId,
    },
    {
      id: 5,
      content: "That would be amazing! Thank you so much for offering to help.",
      timestamp: "2023-03-05T09:20:00.000Z",
      sender: otherUserId,
    },
    {
      id: 6,
      content: conversation.lastMessage.content,
      timestamp: conversation.lastMessage.timestamp,
      sender: conversation.lastMessage.sender,
    },
  ]
}

const MessageThread = ({ conversation }) => {
  const { currentUser } = useAuth()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  
  useEffect(() => {
    // Load messages for this conversation
    setMessages(generateSampleMessages(conversation))
    
    // Simulate the other user typing
    const timer = setTimeout(() => {
      setIsTyping(true)
      
      setTimeout(() => {
        setIsTyping(false)
      }, 3000)
    }, 5000)
    
    return () => clearTimeout(timer)
  }, [conversation])
  
  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])
  
  const handleSendMessage = (e) => {
    e.preventDefault()
    
    if (!newMessage.trim()) return
    
    const message = {
      id: Date.now(),
      content: newMessage,
      timestamp: new Date().toISOString(),
      sender: currentUser?.id || 999, // Assuming current user has this ID
    }
    
    setMessages([...messages, message])
    setNewMessage("")
  }
  
  const groupMessagesByDate = () => {
    const groups = {}
    
    messages.forEach(message => {
      const date = new Date(message.timestamp).toLocaleDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })
    
    return groups
  }
  
  const messageGroups = groupMessagesByDate()
  
  return (
    <div className="flex flex-col h-[calc(600px-60px)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(messageGroups).map(([date, msgs]) => (
          <div key={date} className="space-y-3">
            <div className="flex justify-center">
              <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full transition-colors duration-200">
                {date === new Date().toLocaleDateString() ? "Today" : date}
              </span>
            </div>
            
            {msgs.map((message) => {
              const isCurrentUser = message.sender === (currentUser?.id || 999)
              
              return (
                <motion.div
                  key={message.id}
                  className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {!isCurrentUser && (
                    <Avatar className="h-8 w-8 mr-2 mt-1">
                      <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} />
                      <AvatarFallback className="bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100 transition-colors duration-200">
                        {conversation.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`max-w-[70%] ${isCurrentUser ? "order-1" : "order-2"}`}>
                    <div className={`px-4 py-2 rounded-lg ${
                      isCurrentUser 
                        ? "bg-emerald-500 text-white" 
                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    } transition-colors duration-200`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <p className={`text-xs mt-1 ${
                      isCurrentUser ? "text-right" : ""
                    } text-gray-500 dark:text-gray-400 transition-colors duration-200`}>
                      {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <Avatar className="h-8 w-8 mr-2 mt-1">
              <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} />
              <AvatarFallback className="bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100 transition-colors duration-200">
                {conversation.user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg transition-colors duration-200">
              <div className="flex space-x-1">
                <div className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce transition-colors duration-200"></div>
                <div className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce delay-100 transition-colors duration-200"></div>
                <div className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce delay-200 transition-colors duration-200"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200"
          >
            <Paperclip className="h-5 w-5" />
            <span className="sr-only">Attach file</span>
          </Button>
          
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200"
          >
            <Image className="h-5 w-5" />
            <span className="sr-only">Attach image</span>
          </Button>
          
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200"
          >
            <Smile className="h-5 w-5" />
            <span className="sr-only">Add emoji</span>
          </Button>
          
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 h-9 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 transition-colors duration-200"
          />
          
          <Button 
            type="submit" 
            disabled={!newMessage.trim()}
            className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-200"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  )
}

export default MessageThread

