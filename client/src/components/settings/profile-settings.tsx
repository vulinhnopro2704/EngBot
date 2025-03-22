"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useVocabStore } from "@/lib/store"

export function ProfileSettings() {
  const { userName, userAvatar, updateUserName, updateUserAvatar } = useVocabStore()
  const [name, setName] = useState(userName)
  const [email, setEmail] = useState("student@example.com")
  const [bio, setBio] = useState("I'm learning English to improve my communication skills.")

  const handleSave = () => {
    updateUserName(name)
    // In a real app, we would save other fields too
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 md:gap-8">
        <div className="relative">
          <Avatar className="w-24 h-24 md:w-32 md:h-32">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className="text-2xl md:text-3xl">{userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <Button
            size="icon"
            variant="secondary"
            className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 md:w-10 md:h-10"
          >
            <Camera className="h-4 w-4 md:h-5 md:w-5" />
            <span className="sr-only">Change avatar</span>
          </Button>
        </div>
        <div className="flex-1 space-y-4 text-center sm:text-left">
          <div>
            <h3 className="text-lg md:text-xl font-medium">{userName}</h3>
            <p className="text-sm md:text-base text-muted-foreground">student@example.com</p>
          </div>
          <p className="text-sm md:text-base">Member since March 2024</p>
        </div>
      </div>

      <div className="space-y-6 mt-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base md:text-lg">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 md:h-12 text-base md:text-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base md:text-lg">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 md:h-12 text-base md:text-lg"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio" className="text-base md:text-lg">
            Bio
          </Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="text-base md:text-lg resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="h-10 md:h-12 px-6 text-base md:text-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
        >
          Save Changes
        </Button>
      </div>
    </motion.div>
  )
}

