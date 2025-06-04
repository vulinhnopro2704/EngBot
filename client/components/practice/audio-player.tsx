"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, VolumeX, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface AudioPlayerProps {
  src: string
  className?: string
  autoPlay?: boolean
}

export function AudioPlayer({ src, className, autoPlay = false }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [audio] = useState(new Audio(src))
  
  // Set up event handlers
  audio.onplay = () => setIsPlaying(true)
  audio.onpause = () => setIsPlaying(false)
  audio.onended = () => setIsPlaying(false)
  
  const togglePlay = () => {
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
  }
  
  const toggleMute = () => {
    audio.muted = !audio.muted
    setIsMuted(!isMuted)
  }
  
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button 
        size="icon" 
        variant="ghost" 
        onClick={togglePlay}
        className="h-8 w-8"
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      
      <Button 
        size="icon" 
        variant="ghost" 
        onClick={toggleMute}
        className="h-8 w-8"
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>
    </div>
  )
}
