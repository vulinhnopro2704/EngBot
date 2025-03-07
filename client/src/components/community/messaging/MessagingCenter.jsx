"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Edit, Phone, Video, Info } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ConversationList from "./ConversationList"
import MessageThread from "./MessageThread"
import NewMessageDialog from "./NewMessageDialog"

// Sample conversation data
const SAMPLE_CONVERSATIONS = [
  {
    id: 1,
    user: {
      id: 101,
      name: "Sarah Johnson",
      username: "sarahj",
      avatar: null,
      status: "online",
    },
    lastMessage: {
      content: "Thanks for the grammar tips! They were really helpful.",
      timestamp: "2023-03-06T14:28:00.000Z",
      isRead: true,
      sender: 101,
    },
    unreadCount: 0,
  },
  {
    id: 2,
    user: {
      id: 102,
      name: "Miguel Rodriguez",
      username: "miguelr",
      avatar: null,
      status: "offline",
    },
    lastMessage: {
      content: "Do you have any resources for IELTS speaking practice?",
      timestamp: "2023-03-05T09:15:00.000Z",
      isRead: false,
      sender: 102,
    },
    unreadCount: 2,
  },
  {
    id: 3,
    user: {
      id: 103,
      name: "Aisha Patel",
      username: "aishap",
      avatar: null,
      status: "online",
    },
    lastMessage: {
      content: "I'll send you my notes from the pronunciation workshop.",
      timestamp: "2023-03-04T16:42:00.000Z",
      isRead: true,
      sender: 103,
    },
    unreadCount: 0,
  },
  {
    id: 4,
    user: {
      id: 104,
      name: "David Kim",
      username: "davidk",
      avatar: null,
      status: "away",
    },
    lastMessage: {
      content: "Let's practice conversation tomorrow at 3pm?",
      timestamp: "2023-03-03T11:20:00.000Z",
      isRead: false,
      sender: 104,
    },
    unreadCount: 1,
  },
]

const MessagingCenter = () => {
  const [loading, setLoading] = useState(true)
  const [conversations, setConversations] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false)
  
  // Simulate loading conversations from an API
  useEffect(() => {
    const timer = setTimeout(() => {
      setConversations(SAMPLE_CONVERSATIONS)
      setLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])
  
  const handleConversationSelect = (conversation) => {
    setActiveConversation(conversation)
    
    // Mark conversation as read
    if (conversation.unreadCount > 0) {
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === conversation.id 
            ? { ...conv, unreadCount: 0, lastMessage: { ...conv.lastMessage, isRead: true } }
            : conv
        )
      )
    }
  }
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }
  
  const filteredConversations = conversations.filter(conversation => 
    conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const handleNewMessage = (user) => {
    // Check if conversation already exists
    const existingConversation = conversations.find(conv => conv.user.id === user.id)
    
    if (existingConversation) {
      setActiveConversation(existingConversation)
    } else {
      // Create new conversation
      const newConversation = {
        id: Date.now(),
        user,
        lastMessage: {
          content: "Start a new conversation...",
          timestamp: new Date().toISOString(),
          isRead: true,
          sender: user.id,
        },
        unreadCount: 0,
      }
      
      setConversations([newConversation, ...conversations])
      setActiveConversation(newConversation)
    }
    
    setShowNewMessageDialog(false)
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200">
      <Tabs defaultValue="messages" className="w-full">
        <div className="border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <TabsList className="w-full justify-start px-4 pt-2 bg-transparent">
            <TabsTrigger value="messages" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 transition-colors duration-200">
              Messages
            </TabsTrigger>
            <TabsTrigger value="requests" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 transition-colors duration-200">
              Requests
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="messages" className="m-0">
          <div className="flex h-[600px]">
            {/* Conversation List */}
            <div className="w-full md:w-1/3 border-r border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-800 dark:text-gray-100 transition-colors duration-200">
                    Messages
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setShowNewMessageDialog(true)}
                    className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">New message</span>
                  </Button>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="pl-9 h-9 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 transition-colors duration-200"
                  />
                </div>
              </div>
              
              {loading ? (
                <div className="p-3 space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ConversationList 
                  conversations={filteredConversations}
                  activeConversation={activeConversation}
                  onSelect={handleConversationSelect}
                />
              )}
            </div>
            
            {/* Message Thread */}
            <div className="hidden md:block md:w-2/3">
              {activeConversation ? (
                <>
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between transition-colors duration-200">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={activeConversation.user.avatar} alt={activeConversation.user.name} />
                        <AvatarFallback className="bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100 transition-colors duration-200">
                          {activeConversation.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-sm text-gray-800 dark:text-gray-100 transition-colors duration-200">
                          {activeConversation.user.name}
                        </h3>
                        <div className="flex items-center">
                          <span className={`inline-block h-2 w-2 rounded-full mr-1 ${
                            activeConversation.user.status === 'online' ? 'bg-green-500' :
                            activeConversation.user.status === 'away' ? 'bg-yellow-500' :
                            'bg-gray-400'
                          }`}></span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                            {activeConversation.user.status === 'online' ? 'Online' :
                             activeConversation.user.status === 'away' ? 'Away' :
                             'Offline'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200">
                        <Phone className="h-4 w-4" />
                        <span className="sr-only">Call</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200">
                        <Video className="h-4 w-4" />
                        <span className="sr-only">Video call</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200">
                        <Info className="h-4 w-4" />
                        <span className="sr-only">Info</span>
                      </Button>
                    </div>
                  </div>
                  
                  <MessageThread conversation={activeConversation} />
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4 transition-colors duration-200">
                    <MessageThread className="h-8 w-8 text-emerald-600 dark:text-emerald-400 transition-colors duration-200" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-200">
                    Your Messages
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-200">
                    Select a conversation or start a new one
                  </p>
                  <Button 
                    onClick={() => setShowNewMessageDialog(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-200"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    New Message
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="requests" className="m-0">
          <div className="h-[600px] flex items-center justify-center p-6 text-center">
            <div>
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4 transition-colors duration-200">
                <MessageThread className="h-8 w-8 text-emerald-600 dark:text-emerald-400 transition-colors duration-200" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-200">
                No Message Requests
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                When someone you're not connected with sends you a message, it will appear here.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <NewMessageDialog 
        open={showNewMessageDialog} 
        onClose={() => setShowNewMessageDialog(false)}
        onSelect={handleNewMessage}
      />
    </div>
  )
}

export default MessagingCenter

