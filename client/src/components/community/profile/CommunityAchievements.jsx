"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Award, Trophy, Star, BookOpen, Target, Share2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "../../../contexts/AuthContext"

const CommunityAchievements = () => {
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [achievements, setAchievements] = useState([])
  const [stats, setStats] = useState({})
  
  // Sample achievements data
  const sampleAchievements = [
    {
      id: 1,
      title: "Vocabulary Master",
      description: "Learned 500 new words",
      icon: <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
      progress: 85,
      date: "2023-02-15T00:00:00.000Z",
      isCompleted: false,
    },
    {
      id: 2,
      title: "Grammar Guru",
      description: "Completed all grammar lessons",
      icon: <Star className="h-5 w-5 text-yellow-500" />,
      progress: 100,
      date: "2023-01-20T00:00:00.000Z",
      isCompleted: true,
      badge: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 3,
      title: "Conversation Champion",
      description: "Participated in 10 community discussions",
      icon: <Trophy className="h-5 w-5 text-amber-500" />,
      progress: 100,
      date: "2023-02-05T00:00:00.000Z",
      isCompleted: true,
      badge: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 4,
      title: "Pronunciation Pro",
      description: "Mastered 20 difficult sounds",
      icon: <Target className="h-5 w-5 text-blue-500" />,
      progress: 60,
      date: "2023-03-01T00:00:00.000Z",
      isCompleted: false,
    },
    {
      id: 5,
      title: "Consistent Learner",
      description: "Studied for 30 days in a row",
      icon: <Award className="h-5 w-5 text-purple-500" />,
      progress: 100,
      date: "2023-02-28T00:00:00.000Z",
      isCompleted: true,
      badge: "/placeholder.svg?height=80&width=80",
    },
  ]
  
  // Sample stats data
  const sampleStats = {
    totalXP: 4250,
    streak: 32,
    wordsLearned: 487,
    lessonsCompleted: 78,
    quizzesTaken: 45,
    accuracy: 92,
    level: 8,
    nextLevelXP: 5000,
  }
  
  // Simulate loading data from an API
  useEffect(() => {
    const timer = setTimeout(() => {
      setAchievements(sampleAchievements)
      setStats(sampleStats)
      setLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])
  
  const completedAchievements = achievements.filter(a => a.isCompleted)
  const inProgressAchievements = achievements.filter(a => !a.isCompleted)
  
  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200">
        {loading ? (
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <Skeleton className="h-6 w-40 mx-auto sm:mx-0" />
                <Skeleton className="h-4 w-32 mx-auto sm:mx-0" />
                <Skeleton className="h-4 w-64 mx-auto sm:mx-0" />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                <AvatarFallback className="bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100 text-2xl transition-colors duration-200">
                  {currentUser?.name ? currentUser.name.charAt(0) : "U"}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-200">
                  {currentUser?.name || "User"}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                  @{currentUser?.username || "username"} • Level {stats.level}
                </p>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200">
                  English learner passionate about improving communication skills and expanding vocabulary.
                </p>
                
                <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-900/20 transition-colors duration-200"
                  >
                    Edit Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-900/20 transition-colors duration-200"
                  >
                    <Share2 className="h-3 w-3 mr-1" />
                    Share Progress
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Trophy className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mr-1" />
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-100 transition-colors duration-200">
                    Level Progress
                  </span>
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-200">
                  {stats.totalXP} / {stats.nextLevelXP} XP
                </span>
              </div>
              <Progress value={(stats.totalXP / stats.nextLevelXP) * 100} className="h-2 bg-gray-100 dark:bg-gray-700 transition-colors duration-200" />
            </div>
          </div>
        )}
        
        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-6 pt-0">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-6 pt-0">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 transition-colors duration-200">
              <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-200">
                Day Streak
              </p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 transition-colors duration-200">
                {stats.streak} days
              </p>
            </div>
            
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 transition-colors duration-200">
              <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-200">
                Words Learned
              </p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 transition-colors duration-200">
                {stats.wordsLearned}
              </p>
            </div>
            
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 transition-colors duration-200">
              <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-200">
                Lessons Completed
              </p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 transition-colors duration-200">
                {stats.lessonsCompleted}
              </p>
            </div>
            
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 transition-colors duration-200">
              <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-200">
                Quizzes Taken
              </p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 transition-colors duration-200">
                {stats.quizzesTaken}
              </p>
            </div>
            
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 transition-colors duration-200">
              <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-200">
                Accuracy
              </p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 transition-colors duration-200">
                {stats.accuracy}%
              </p>
            </div>
            
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 transition-colors duration-200">
              <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-200">
                Achievements
              </p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 transition-colors duration-200">
                {completedAchievements.length}/{achievements.length}
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Achievements Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200">
        <Tabs defaultValue="completed" className="w-full">
          <div className="px-6 pt-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-200">
              Your Achievements
            </h3>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="completed" className="p-6 pt-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24" />
                ))}
              </div>
            ) : completedAchievements.length > 0 ? (
              <div className="space-y-4">
                {completedAchievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-colors duration-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex-shrink-0 mr-4">
                      <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center transition-colors duration-200">
                        {achievement.badge ? (
                          <img 
                            src={achievement.badge || "/placeholder.svg"} 
                            alt={achievement.title} 
                            className="h-14 w-14 rounded-full"
                          />
                        ) : (
                          achievement.icon
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-800 dark:text-gray-100 transition-colors duration-200">
                          {achievement.title}
                        </h4>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-7 text-xs border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-900/20 transition-colors duration-200"
                        >
                          <Share2 className="h-3 w-3 mr-1" />
                          Share
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                        {achievement.description}
                      </p>
                      <div className="mt-2 flex items-center">
                        <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-200">
                          Completed on {new Date(achievement.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
                  You haven't earned any achievements yet.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 transition-colors duration-200">
                  Complete lessons and activities to earn achievements.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="in-progress" className="p-6 pt-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24" />
                ))}
              </div>
            ) : inProgressAchievements.length > 0 ? (
              <div className="space-y-4">
                {inProgressAchievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-colors duration-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex-shrink-0 mr-4">
                      <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center transition-colors duration-200">
                        {achievement.icon}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 dark:text-gray-100 transition-colors duration-200">
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                        {achievement.description}
                      </p>
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-200">
                            Progress
                          </span>
                          <span className="text-xs font-medium text-gray-800 dark:text-gray-200 transition-colors duration-200">
                            {achievement.progress}%
                          </span>
                        </div>
                        <Progress value={achievement.progress} className="h-2 bg-gray-100 dark:bg-gray-700 transition-colors duration-200" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
                  No achievements in progress.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 transition-colors duration-200">
                  Start new lessons and activities to work towards achievements.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default CommunityAchievements

