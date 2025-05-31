"use client"
import { motion } from "framer-motion"
import { Volume, Volume1, Volume2, VolumeX } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useAudio } from "@/hooks/use-audio"

export function AudioSettings() {
  const {
    // Audio state
    masterVolume,
    speechVolume,
    effectsVolume,
    autoPlayAudio,

    // Audio state update methods
    updateMasterVolume,
    updateSpeechVolume,
    updateEffectsVolume,
    toggleAutoPlayAudio,

    // Audio playback methods
    speakWord,
    playSound,
  } = useAudio()

  const testAudio = (type: "speech" | "effect") => {
    if (type === "speech") {
      speakWord("This is a test of the speech volume.")
    } else if (type === "effect") {
      playSound("correct")
    }
  }

  const VolumeIcon = ({ volume }: { volume: number }) => {
    if (volume === 0) return <VolumeX className="h-5 w-5" />
    if (volume < 33) return <Volume className="h-5 w-5" />
    if (volume < 66) return <Volume1 className="h-5 w-5" />
    return <Volume2 className="h-5 w-5" />
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Master Volume</Label>
            <p className="text-sm text-muted-foreground">Control the overall volume of the application</p>
          </div>
          <VolumeIcon volume={masterVolume} />
        </div>
        <Slider
          value={[masterVolume]}
          min={0}
          max={100}
          step={1}
          onValueChange={(value) => updateMasterVolume(value[0])}
          className="w-full"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Speech Volume</Label>
            <p className="text-sm text-muted-foreground">Control the volume of spoken words</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => testAudio("speech")}>
            Test
          </Button>
        </div>
        <Slider
          value={[speechVolume]}
          min={0}
          max={100}
          step={1}
          onValueChange={(value) => updateSpeechVolume(value[0])}
          className="w-full"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Sound Effects</Label>
            <p className="text-sm text-muted-foreground">Control the volume of UI sound effects</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => testAudio("effect")}>
            Test
          </Button>
        </div>
        <Slider
          value={[effectsVolume]}
          min={0}
          max={100}
          step={1}
          onValueChange={(value) => updateEffectsVolume(value[0])}
          className="w-full"
        />
      </div>

      <div className="flex items-center justify-between space-y-0.5">
        <div>
          <Label className="text-base">Auto-play Audio</Label>
          <p className="text-sm text-muted-foreground">Automatically play audio when learning new words</p>
        </div>
        <Switch checked={autoPlayAudio} onCheckedChange={toggleAutoPlayAudio} />
      </div>
    </motion.div>
  )
}
