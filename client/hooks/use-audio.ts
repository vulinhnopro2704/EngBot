"use client"

import { useState, useEffect, useCallback } from "react"
import { useVocabStore } from "@/lib/store"

export function useAudio() {
  const {
    masterVolume,
    speechVolume,
    effectsVolume,
    autoPlayAudio,
    updateMasterVolume,
    updateSpeechVolume,
    updateEffectsVolume,
    toggleAutoPlayAudio,
  } = useVocabStore()

  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [speechSynthAvailable, setSpeechSynthAvailable] = useState(false)
  const [ttsSupported, setTtsSupported] = useState(false)
  const [audioCache, setAudioCache] = useState<Record<string, HTMLAudioElement>>({})

  // Initialize AudioContext and check speech synthesis availability
  useEffect(() => {
    // Initialize AudioContext on client-side only
    if (typeof window !== "undefined" && !audioContext) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
        if (AudioContextClass) {
          setAudioContext(new AudioContextClass())
        }
      } catch (error) {
        console.error("Error initializing AudioContext:", error)
      }
    }

    // Check if speech synthesis is available
    if (typeof window !== "undefined") {
      setSpeechSynthAvailable("speechSynthesis" in window)
      // Try to initialize to check real support
      if ("speechSynthesis" in window) {
        try {
          // Check if we can actually create an utterance
          new SpeechSynthesisUtterance("test")
          setTtsSupported(true)
        } catch (error) {
          console.error("Speech synthesis creation failed:", error)
          setTtsSupported(false)
        }
      }
    }

    // Cleanup
    return () => {
      if (audioContext) {
        try {
          audioContext.close()
        } catch (error) {
          console.error("Error closing AudioContext:", error)
        }
      }
    }
  }, [audioContext])

  // Speak a word using SpeechSynthesis
  const speakWord = useCallback(
    (word: string, rate = 0.8) => {
      if (!speechSynthAvailable) {
        console.log("Speech synthesis not available, using fallback")
        // Use fallback tone as notification
        playSimpleTone("speech")
        return false
      }

      try {
        // Cancel any ongoing speech first
        window.speechSynthesis.cancel()

        const utterance = new SpeechSynthesisUtterance(word)
        utterance.rate = rate
        utterance.volume = (masterVolume / 100) * (speechVolume / 100)

        // Add error handling
        utterance.onerror = (event) => {
          console.error("Speech synthesis error:", event)
          // Try fallback tone if speech fails
          playSimpleTone("speech")
        }

        speechSynthesis.speak(utterance)
        return true
      } catch (error) {
        console.error("Error with speech synthesis:", error)
        playSimpleTone("speech")
        return false
      }
    },
    [masterVolume, speechVolume, speechSynthAvailable],
  )

  // Play a simple tone as a fallback
  const playSimpleTone = useCallback(
    (type: "speech" | "effect" | "notification") => {
      if (!audioContext) return false

      try {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        // Configure based on type
        switch (type) {
          case "speech":
            oscillator.type = "sine"
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime) // A4 note
            oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.2) // Up to A5
            gainNode.gain.value = (masterVolume / 100) * (speechVolume / 100) * 0.1
            break
          case "effect":
            oscillator.type = "triangle"
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime)
            oscillator.frequency.exponentialRampToValueAtTime(900, audioContext.currentTime + 0.1)
            gainNode.gain.value = (masterVolume / 100) * (effectsVolume / 100) * 0.1
            break
          case "notification":
            oscillator.type = "sine"
            oscillator.frequency.setValueAtTime(700, audioContext.currentTime)
            oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1)
            gainNode.gain.value = (masterVolume / 100) * (effectsVolume / 100) * 0.1
            break
        }

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.3)

        return true
      } catch (error) {
        console.error("Error playing fallback tone:", error)
        return false
      }
    },
    [audioContext, effectsVolume, masterVolume, speechVolume],
  )

  // Play a predefined sound
  const playSound = useCallback(
    async (soundType: "correct" | "incorrect" | "complete" | "click") => {
      if (!audioContext) {
        console.log("AudioContext not available, using fallback")
        return playSimpleTone("effect")
      }

      try {
        // Create oscillator for synthetic sounds
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        // Configure sound based on type
        switch (soundType) {
          case "correct":
            oscillator.type = "sine"
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
            oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1)
            gainNode.gain.value = (masterVolume / 100) * (effectsVolume / 100) * 0.1
            break
          case "incorrect":
            oscillator.type = "sawtooth"
            oscillator.frequency.setValueAtTime(400, audioContext.currentTime)
            oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.2)
            gainNode.gain.value = (masterVolume / 100) * (effectsVolume / 100) * 0.1
            break
          case "complete":
            oscillator.type = "sine"
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime)
            oscillator.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.1)
            gainNode.gain.value = (masterVolume / 100) * (effectsVolume / 100) * 0.1
            break
          case "click":
            oscillator.type = "sine"
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
            gainNode.gain.value = (masterVolume / 100) * (effectsVolume / 100) * 0.05
            break
        }

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.start()
        oscillator.stop(audioContext.currentTime + (soundType === "click" ? 0.05 : 0.3))

        return true
      } catch (error) {
        console.error("Error playing sound:", error)
        return playSimpleTone("effect")
      }
    },
    [audioContext, effectsVolume, masterVolume, playSimpleTone],
  )

  // Play an audio file with error handling and fallback
  const playAudio = useCallback(
    (audioUrl: string) => {
      if (!audioUrl) {
        console.error("No audio URL provided")
        return playSimpleTone("notification")
      }

      // Map sound file names to sound types for fallback
      const soundTypeMap: Record<string, "correct" | "incorrect" | "complete" | "click"> = {
        "correct.mp3": "correct",
        "incorrect.mp3": "incorrect",
        "success.mp3": "correct",
        "celebration.mp3": "complete",
        "click.mp3": "click",
        "card-flip.mp3": "click",
        "tab-change.mp3": "click",
      }

      // Extract the filename from the URL
      const filename = audioUrl.split("/").pop() || ""
      const soundType = soundTypeMap[filename]

      // For internal app sounds, try to use actual audio files with fallback to synthetic sounds
      if (audioUrl.startsWith("/sounds/")) {
        try {
          // Check if we already have this audio in cache
          if (audioCache[audioUrl]) {
            const audio = audioCache[audioUrl]

            // Reset the audio to the beginning if it was already played
            audio.currentTime = 0

            // Apply volume settings
            audio.volume =
              (masterVolume / 100) *
              (audioUrl.includes("word") || audioUrl.includes("pronunciation")
                ? speechVolume / 100
                : effectsVolume / 100)

            // Play the audio with error handling
            const playPromise = audio.play()
            if (playPromise !== undefined) {
              playPromise.catch((error) => {
                console.error("Error playing cached audio:", error)
                if (soundType) {
                  playSound(soundType)
                } else {
                  playSimpleTone("effect")
                }
              })
            }

            return true
          }

          // Create an audio element
          const audio = new Audio(audioUrl)

          // Set up error handling with specific fallback
          audio.onerror = (e) => {
            console.error(`Error loading audio from ${audioUrl}:`, e)
            // Use the synthetic sound fallback since file is missing
            if (soundType) {
              playSound(soundType)
            } else {
              playSimpleTone(audioUrl.includes("correct") || audioUrl.includes("success") ? "effect" : "notification")
            }
          }

          // Apply volume settings
          audio.volume =
            (masterVolume / 100) *
            (audioUrl.includes("word") || audioUrl.includes("pronunciation") ? speechVolume / 100 : effectsVolume / 100)

          // Play the audio
          const playPromise = audio.play()

          // Handle promise rejection (happens in some browsers)
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                // Add to cache on successful play
                setAudioCache((prev) => ({ ...prev, [audioUrl]: audio }))
              })
              .catch((error) => {
                console.error("Error playing audio:", error)
                if (soundType) {
                  playSound(soundType)
                } else {
                  playSimpleTone("effect")
                }
                return false
              })
          }

          return true
        } catch (error) {
          console.error("Error setting up audio playback:", error)
          if (soundType) {
            return playSound(soundType)
          }
          return playSimpleTone("effect")
        }
      }
      // For external URLs, be more careful with error handling
      else {
        try {
          // First check if the URL is valid
          const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
          if (!urlPattern.test(audioUrl)) {
            console.error("Invalid audio URL:", audioUrl)
            return playSimpleTone("notification")
          }

          // Create audio with crossOrigin setting for external resources
          const audio = new Audio()
          audio.crossOrigin = "anonymous"
          audio.src = audioUrl

          // Add timeouts in case audio never loads
          const timeoutId = setTimeout(() => {
            console.error("Audio loading timeout:", audioUrl)
            audio.onerror = null
            audio.onloadeddata = null
            playSimpleTone("notification")
          }, 5000)

          // Set up event handling
          audio.onerror = (e) => {
            clearTimeout(timeoutId)
            console.error(`Error loading audio from ${audioUrl}:`, e)
            playSimpleTone("notification")
          }

          audio.onloadeddata = () => {
            clearTimeout(timeoutId)

            // Apply volume settings
            audio.volume = (masterVolume / 100) * (speechVolume / 100)

            // Play the audio
            audio.play().catch((error) => {
              console.error("Error playing audio:", error)
              playSimpleTone("notification")
            })
          }

          return true
        } catch (error) {
          console.error("Error with external audio:", error)
          return playSimpleTone("notification")
        }
      }
    },
    [masterVolume, speechVolume, effectsVolume, playSimpleTone, playSound, audioCache],
  )

  // Safely cancel speech
  const cancelSpeech = useCallback(() => {
    if (speechSynthAvailable) {
      try {
        window.speechSynthesis.cancel()
      } catch (error) {
        console.error("Error cancelling speech:", error)
      }
    }
  }, [speechSynthAvailable])

  return {
    // Audio state
    masterVolume,
    speechVolume,
    effectsVolume,
    autoPlayAudio,
    speechSynthAvailable,
    ttsSupported,

    // Audio state update methods
    updateMasterVolume,
    updateSpeechVolume,
    updateEffectsVolume,
    toggleAutoPlayAudio,

    // Audio playback methods
    speakWord,
    playSound,
    playAudio,
    cancelSpeech,
    playSimpleTone,
  }
}
