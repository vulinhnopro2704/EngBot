import { motion } from "framer-motion"

interface ScoreCircleProps {
  score: number
  size?: "sm" | "md" | "lg"
}

export function ScoreCircle({ score, size = "lg" }: ScoreCircleProps) {
  const dimensions = {
    sm: "w-24 h-24",
    md: "w-32 h-32",
    lg: "w-40 h-40",
  }

  const fontSizes = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl",
  }

  return (
    <div className={`relative ${dimensions[size]}`}>
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle className="text-muted stroke-current" strokeWidth="10" cx="50" cy="50" r="40" fill="none"></circle>

        {/* Progress circle */}
        <motion.circle
          initial={{ strokeDashoffset: 251.2 }}
          animate={{
            strokeDashoffset: 251.2 - (score / 100) * 251.2,
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`stroke-current ${
            score >= 80 ? "text-green-500" : score >= 60 ? "text-yellow-500" : "text-red-500"
          }`}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray="251.2"
          cx="50"
          cy="50"
          r="40"
          fill="none"
          transform="rotate(-90 50 50)"
        ></motion.circle>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`${fontSizes[size]} font-bold`}>{score}%</span>
        <span className="text-sm text-muted-foreground">Score</span>
      </div>
    </div>
  )
}
