"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PageTransition from "../components/PageTransition"
import CommunityFeed from "../components/community/posts/CommunityFeed"
import MessagingCenter from "../components/community/messaging/MessagingCenter"
import CommunityAchievements from "../components/community/profile/CommunityAchievements"
import CommunityHeader from "../components/community/shared/CommunityHeader"
import CommunitySearch from "../components/community/shared/CommunitySearch"
import TrendingTopics from "../components/community/shared/TrendingTopics"
import SuggestedUsers from "../components/community/shared/SuggestedUsers"

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState("feed")
  const [searchQuery, setSearchQuery] = useState("")
  
  const handleSearch = (query) => {
    setSearchQuery(query)
    // In a real app, you would filter content based on the query
  }
  
  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto">
        <CommunityHeader />
        
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="space-y-6">
              <CommunitySearch onSearch={handleSearch} />
              <TrendingTopics />
              <SuggestedUsers />
            </div>
          </div>
          
          {/* Main Content */}
          <div className="col-span-1 lg:col-span-6">
            <Tabs 
              defaultValue="feed" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="feed">Feed</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>
              
              <TabsContent value="feed" className="mt-0">
                <CommunityFeed searchQuery={searchQuery} />
              </TabsContent>
              
              <TabsContent value="messages" className="mt-0">
                <MessagingCenter />
              </TabsContent>
              
              <TabsContent value="achievements" className="mt-0">
                <CommunityAchievements />
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right Sidebar - Mobile Responsive */}
          <div className="lg:hidden col-span-1 space-y-6">
            <CommunitySearch onSearch={handleSearch} />
            <div className="flex space-x-4">
              <div className="w-1/2">
                <TrendingTopics compact={true} />
              </div>
              <div className="w-1/2">
                <SuggestedUsers compact={true} />
              </div>
            </div>
          </div>
          
          {/* Right Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 transition-colors duration-200">
              <h3 className="font-medium text-lg mb-4 text-gray-800 dark:text-gray-100 transition-colors duration-200">
                Community Guidelines
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2">•</span>
                  <span>Be respectful and supportive of other learners</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2">•</span>
                  <span>Share helpful resources and learning tips</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2">•</span>
                  <span>Ask questions if you're unsure about something</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2">•</span>
                  <span>Provide constructive feedback on others' work</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2">•</span>
                  <span>Keep conversations relevant to language learning</span>
                </li>
              </ul>
              
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
                <h4 className="font-medium mb-2 text-gray-800 dark:text-gray-100 transition-colors duration-200">
                  Need Help?
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                  Contact our community moderators for assistance with any issues.
                </p>
                <button className="mt-2 text-sm text-emerald-600 dark:text-emerald-400 hover:underline transition-colors duration-200">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default CommunityPage

