"use client"
import { motion } from "framer-motion"
import { Bell, Globe, Sun, User, Volume2, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { AppearanceSettings } from "@/components/settings/appearance-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { AudioSettings } from "@/components/settings/audio-settings"
import { LanguageSettings } from "@/components/settings/language-settings"

export function SettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-[1600px] mx-auto w-full"
    >
      <Card className="border-none shadow-lg overflow-hidden">
        <CardHeader className="pb-2 bg-gradient-to-r from-orange-500/10 to-amber-500/10 dark:from-orange-900/30 dark:to-amber-900/30">
          <div className="flex items-center gap-2">
            <CardTitle className="text-2xl md:text-3xl flex items-center gap-2">
              Settings
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  repeatDelay: 5,
                }}
              >
                <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-yellow-500 ml-2" />
              </motion.div>
            </CardTitle>
          </div>
          <CardDescription className="text-base md:text-lg">
            Manage your account settings and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 lg:p-8">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6 h-11 md:h-12">
              <TabsTrigger
                value="profile"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white md:text-base"
              >
                <User className="h-4 w-4 md:h-5 md:w-5" /> Profile
              </TabsTrigger>
              <TabsTrigger
                value="appearance"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white md:text-base"
              >
                <Sun className="h-4 w-4 md:h-5 md:w-5" /> Appearance
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white md:text-base"
              >
                <Bell className="h-4 w-4 md:h-5 md:w-5" /> Notifications
              </TabsTrigger>
              <TabsTrigger
                value="audio"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white md:text-base"
              >
                <Volume2 className="h-4 w-4 md:h-5 md:w-5" /> Audio
              </TabsTrigger>
              <TabsTrigger
                value="language"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white md:text-base"
              >
                <Globe className="h-4 w-4 md:h-5 md:w-5" /> Language
              </TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <ProfileSettings />
            </TabsContent>
            <TabsContent value="appearance">
              <AppearanceSettings />
            </TabsContent>
            <TabsContent value="notifications">
              <NotificationSettings />
            </TabsContent>
            <TabsContent value="audio">
              <AudioSettings />
            </TabsContent>
            <TabsContent value="language">
              <LanguageSettings />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}
