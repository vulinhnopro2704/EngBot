"use client"

import { motion } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const ConversationList = ({ conversations, activeConversation, onSelect }) => {
  if (conversations.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
          No conversations found
        </p>
      </div>
    )
  }
  
  return (
    <div className="overflow-y-auto h-[calc(600px-60px)]">
      {conversations.map((conversation) => (
        <motion.div
          key={conversation.id}
          className={`p-3 cursor-pointer transition-colors duration-200 ${
            activeConversation?.id === conversation.id
              ? "bg-emerald-50 dark:bg-emerald-900/20"
              : "hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
          onClick={() => onSelect(conversation)}
          whileHover={{ x: 3 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="flex items-start">
            <div className="relative">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} />
                <AvatarFallback className="bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100 transition-colors duration-200">
                  {conversation.user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className={`absolute bottom-0 right-2 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-gray-800 ${
                conversation.user.status === 'online' ? 'bg-green-500' :
                conversation.user.status === 'away' ? 'bg-yellow-500' :
                'bg-gray-400'
              } transition-colors duration-200`}></span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm text-gray-800 dark:text-gray-100 truncate transition-colors duration-200">
                  {conversation.user.name}
                </h4>
                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap transition-colors duration-200">
                  {formatDistanceToNow(new Date(conversation.lastMessage.timestamp), { addSuffix: true })}
                </span>
              </div>
              
              <div className="flex items-center justify-between mt-1">
                <p className={`text-xs truncate ${
                  conversation.unreadCount > 0
                    ? "font-medium text-gray-800 dark:text-gray-200"
                    : "text-gray-600 dark:text-gray-400"
                } transition-colors duration-200`}>
                  {conversation.lastMessage.content}
                </p>
                
                {conversation.unreadCount > 0 && (
                  <Badge className="ml-2 bg-emerald-500 hover:bg-emerald-600 text-white transition-colors duration-200">
                    {conversation.unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default ConversationList

