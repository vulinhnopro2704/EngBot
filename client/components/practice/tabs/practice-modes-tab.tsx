import { motion } from "framer-motion"
import { 
  BookOpen, 
  PenTool, 
  Headphones, 
  Layers,
  MoveHorizontalIcon as DragDropHorizontal
} from "lucide-react"
import { PracticeModeCard, containerVariants } from "../ui/practice-mode-card"
import type { PracticeMode } from "@/data/types"

interface PracticeModesTabProps {
  handleStartPractice: (mode: PracticeMode) => void
}

export function PracticeModesTab({ handleStartPractice }: PracticeModesTabProps) {
  const practiceModesConfig = [
    {
      title: "Multiple Choice",
      description: "Test your knowledge of word definitions",
      explanation: "Choose the correct definition for each word from multiple options.",
      icon: BookOpen,
      mode: "multiple-choice" as PracticeMode,
      colors: {
        gradient: "from-blue-500 to-indigo-500",
        bg: "bg-blue-100",
        darkBg: "dark:bg-blue-900",
        iconBg: "bg-blue-100",
        darkIconBg: "dark:bg-blue-900",
        iconColor: "text-blue-600",
        darkIconColor: "dark:text-blue-400"
      }
    },
    {
      title: "Fill in the Blank",
      description: "Complete sentences with the correct word",
      explanation: "Fill in missing words in sentences to practice using vocabulary in context.",
      icon: PenTool,
      mode: "fill-blank" as PracticeMode,
      colors: {
        gradient: "from-green-500 to-teal-500",
        bg: "bg-green-100",
        darkBg: "dark:bg-green-900",
        iconBg: "bg-green-100",
        darkIconBg: "dark:bg-green-900",
        iconColor: "text-green-600",
        darkIconColor: "dark:text-green-400"
      }
    },
    {
      title: "Listening Practice",
      description: "Improve your listening and spelling skills",
      explanation: "Listen to words and type what you hear to improve pronunciation recognition.",
      icon: Headphones,
      mode: "listening" as PracticeMode,
      colors: {
        gradient: "from-purple-500 to-pink-500",
        bg: "bg-purple-100",
        darkBg: "dark:bg-purple-900",
        iconBg: "bg-purple-100",
        darkIconBg: "dark:bg-purple-900",
        iconColor: "text-purple-600",
        darkIconColor: "dark:text-purple-400"
      }
    },
    {
      title: "Matching Pairs",
      description: "Match words with their definitions",
      explanation: "Connect words with their correct meanings in this matching exercise.",
      icon: Layers,
      mode: "matching" as PracticeMode,
      colors: {
        gradient: "from-amber-500 to-orange-500",
        bg: "bg-amber-100",
        darkBg: "dark:bg-amber-900",
        iconBg: "bg-amber-100",
        darkIconBg: "dark:bg-amber-900",
        iconColor: "text-amber-600",
        darkIconColor: "dark:text-amber-400"
      }
    },
    {
      title: "Drag & Drop",
      description: "Arrange words to form correct sentences",
      explanation: "Drag and drop words to complete sentences and practice word order.",
      icon: DragDropHorizontal,
      mode: "drag-drop" as PracticeMode,
      colors: {
        gradient: "from-rose-500 to-red-500",
        bg: "bg-rose-100",
        darkBg: "dark:bg-rose-900",
        iconBg: "bg-rose-100",
        darkIconBg: "dark:bg-rose-900",
        iconColor: "text-rose-600",
        darkIconColor: "dark:text-rose-400"
      }
    }
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {practiceModesConfig.map((config) => (
        <PracticeModeCard
          isLoading={false} // Replace with actual loading state if needed
          key={config.mode}
          title={config.title}
          description={config.description}
          explanation={config.explanation}
          icon={config.icon}
          colors={config.colors}
          mode={config.mode}
          onStartPractice={handleStartPractice}
        />
      ))}
    </motion.div>
  )
}
