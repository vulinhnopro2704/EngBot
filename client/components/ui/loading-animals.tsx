"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

type AnimalType = "cat" | "quokka" | "hamster" | "capybara"

interface LoadingAnimalsProps {
  type?: AnimalType
  text?: string
  size?: "sm" | "md" | "lg"
  color?: string
}

export function LoadingAnimals({
  type = "cat",
  text = "Loading...",
  size = "md",
  color = "primary",
}: LoadingAnimalsProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const sizeClass = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  }

  const colorClass = {
    primary: "text-primary",
    blue: "text-blue-500",
    green: "text-green-500",
    purple: "text-purple-500",
    pink: "text-pink-500",
    yellow: "text-yellow-500",
    orange: "text-orange-500",
  }

  const animals = {
    cat: (
      <div className="relative">
        <motion.div
          className={`${sizeClass[size]} relative`}
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
          }}
        >
          {/* Cat face */}
          <div
            className={`absolute inset-0 rounded-full bg-gray-200 dark:bg-gray-800 ${colorClass[color as keyof typeof colorClass]}`}
          >
            {/* Cat ears */}
            <div className="absolute -top-3 -left-1 w-5 h-5 rounded-tl-full bg-gray-200 dark:bg-gray-800 transform rotate-45"></div>
            <div className="absolute -top-3 -right-1 w-5 h-5 rounded-tr-full bg-gray-200 dark:bg-gray-800 transform -rotate-45"></div>

            {/* Cat eyes */}
            <motion.div
              className="absolute top-1/3 left-1/4 w-2 h-3 bg-black rounded-full"
              animate={{ scaleY: [1, 0.1, 1] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            ></motion.div>
            <motion.div
              className="absolute top-1/3 right-1/4 w-2 h-3 bg-black rounded-full"
              animate={{ scaleY: [1, 0.1, 1] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            ></motion.div>

            {/* Cat nose and mouth */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4">
              <div className="w-1.5 h-1.5 bg-pink-400 rounded-full"></div>
              <motion.div
                className="w-3 h-2 border-b border-black mt-1"
                animate={{ width: [3, 5, 3] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              ></motion.div>
            </div>

            {/* Cat whiskers */}
            <div className="absolute top-1/2 left-1/4 w-3 h-0.5 bg-gray-400"></div>
            <div className="absolute top-[55%] left-1/4 w-4 h-0.5 bg-gray-400"></div>
            <div className="absolute top-1/2 right-1/4 w-3 h-0.5 bg-gray-400"></div>
            <div className="absolute top-[55%] right-1/4 w-4 h-0.5 bg-gray-400"></div>
          </div>
        </motion.div>

        {/* Loading dots */}
        <div className="flex justify-center mt-2">
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0 }}
            className="w-2 h-2 rounded-full bg-current mx-0.5"
          />
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.2 }}
            className="w-2 h-2 rounded-full bg-current mx-0.5"
          />
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.4 }}
            className="w-2 h-2 rounded-full bg-current mx-0.5"
          />
        </div>

        <div className="text-center mt-2 text-sm font-medium">{text}</div>
      </div>
    ),
    quokka: (
      <div className="relative">
        <motion.div
          className={`${sizeClass[size]} relative`}
          animate={{
            y: [0, -5, 0],
            rotate: [0, 3, 0, -3, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
          }}
        >
          {/* Quokka face */}
          <div
            className={`absolute inset-0 rounded-full bg-amber-200 dark:bg-amber-800 ${colorClass[color as keyof typeof colorClass]}`}
          >
            {/* Quokka ears */}
            <div className="absolute -top-2 -left-1 w-4 h-4 rounded-full bg-amber-200 dark:bg-amber-800"></div>
            <div className="absolute -top-2 -right-1 w-4 h-4 rounded-full bg-amber-200 dark:bg-amber-800"></div>

            {/* Quokka eyes */}
            <motion.div
              className="absolute top-1/3 left-1/4 w-2 h-2 bg-black rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            ></motion.div>
            <motion.div
              className="absolute top-1/3 right-1/4 w-2 h-2 bg-black rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            ></motion.div>

            {/* Quokka nose and mouth */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4">
              <div className="w-2 h-1.5 bg-black rounded-full"></div>
              <motion.div
                className="w-4 h-1 border-b border-black mt-1"
                animate={{ width: [4, 6, 4] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              ></motion.div>
            </div>
          </div>
        </motion.div>

        {/* Loading dots */}
        <div className="flex justify-center mt-2">
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0 }}
            className="w-2 h-2 rounded-full bg-current mx-0.5"
          />
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.2 }}
            className="w-2 h-2 rounded-full bg-current mx-0.5"
          />
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.4 }}
            className="w-2 h-2 rounded-full bg-current mx-0.5"
          />
        </div>

        <div className="text-center mt-2 text-sm font-medium">{text}</div>
      </div>
    ),
    hamster: (
      <div className="relative">
        <motion.div
          className={`${sizeClass[size]} relative`}
          animate={{
            y: [0, -8, 0],
            rotate: [0, 10, 0, -10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
          }}
        >
          {/* Hamster face */}
          <div
            className={`absolute inset-0 rounded-full bg-amber-100 dark:bg-amber-700 ${colorClass[color as keyof typeof colorClass]}`}
          >
            {/* Hamster ears */}
            <div className="absolute -top-1 left-1/4 w-3 h-3 rounded-full bg-amber-100 dark:bg-amber-700"></div>
            <div className="absolute -top-1 right-1/4 w-3 h-3 rounded-full bg-amber-100 dark:bg-amber-700"></div>

            {/* Hamster eyes */}
            <motion.div
              className="absolute top-1/3 left-1/4 w-1.5 h-1.5 bg-black rounded-full"
              animate={{ scale: [1, 0.8, 1] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            ></motion.div>
            <motion.div
              className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-black rounded-full"
              animate={{ scale: [1, 0.8, 1] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            ></motion.div>

            {/* Hamster cheeks */}
            <motion.div
              className="absolute top-1/2 left-1/5 w-4 h-3 bg-pink-200 dark:bg-pink-800 rounded-full opacity-60"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            ></motion.div>
            <motion.div
              className="absolute top-1/2 right-1/5 w-4 h-3 bg-pink-200 dark:bg-pink-800 rounded-full opacity-60"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            ></motion.div>

            {/* Hamster nose and mouth */}
            <div className="absolute top-[45%] left-1/2 transform -translate-x-1/2">
              <div className="w-1.5 h-1.5 bg-pink-400 rounded-full"></div>
              <motion.div
                className="w-2 h-1 border-b border-black mt-1"
                animate={{ width: [2, 3, 2] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              ></motion.div>
            </div>
          </div>
        </motion.div>

        {/* Loading dots */}
        <div className="flex justify-center mt-2">
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0 }}
            className="w-2 h-2 rounded-full bg-current mx-0.5"
          />
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.2 }}
            className="w-2 h-2 rounded-full bg-current mx-0.5"
          />
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.4 }}
            className="w-2 h-2 rounded-full bg-current mx-0.5"
          />
        </div>

        <div className="text-center mt-2 text-sm font-medium">{text}</div>
      </div>
    ),
    capybara: (
      <div className="relative">
        <motion.div
          className={`${sizeClass[size]} relative`}
          animate={{
            y: [0, -3, 0],
            rotate: [0, 2, 0, -2, 0],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
          }}
        >
          {/* Capybara face */}
          <div
            className={`absolute inset-0 rounded-full bg-amber-300 dark:bg-amber-900 ${colorClass[color as keyof typeof colorClass]}`}
          >
            {/* Capybara ears */}
            <div className="absolute -top-1 left-1/4 w-2 h-2 rounded-full bg-amber-300 dark:bg-amber-900"></div>
            <div className="absolute -top-1 right-1/4 w-2 h-2 rounded-full bg-amber-300 dark:bg-amber-900"></div>

            {/* Capybara eyes */}
            <motion.div
              className="absolute top-1/3 left-1/4 w-2 h-1.5 bg-black rounded-full"
              animate={{ scaleY: [1, 0.5, 1] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            ></motion.div>
            <motion.div
              className="absolute top-1/3 right-1/4 w-2 h-1.5 bg-black rounded-full"
              animate={{ scaleY: [1, 0.5, 1] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            ></motion.div>

            {/* Capybara nose */}
            <div className="absolute top-[45%] left-1/2 transform -translate-x-1/2">
              <div className="w-4 h-3 bg-black rounded-lg"></div>
              <motion.div
                className="w-3 h-1 border-b border-black mt-2"
                animate={{ width: [3, 4, 3] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              ></motion.div>
            </div>
          </div>
        </motion.div>

        {/* Loading dots */}
        <div className="flex justify-center mt-2">
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0 }}
            className="w-2 h-2 rounded-full bg-current mx-0.5"
          />
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.2 }}
            className="w-2 h-2 rounded-full bg-current mx-0.5"
          />
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.4 }}
            className="w-2 h-2 rounded-full bg-current mx-0.5"
          />
        </div>

        <div className="text-center mt-2 text-sm font-medium">{text}</div>
      </div>
    ),
  }

  return animals[type]
}
