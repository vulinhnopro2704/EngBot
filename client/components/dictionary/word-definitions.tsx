"use client";

import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { WordData } from "@/types/mochi-dictionary";

interface WordDefinitionsProps {
  wordData: WordData;
}

export function WordDefinitions({ wordData }: WordDefinitionsProps) {
  const playAudio = (audioUrl: string) => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audio.play().catch((error) => console.error("Audio playback error:", error));
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {wordData.words.map((word, index) => (
        <motion.div
          key={index}
          variants={item}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-b border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-center">
              <div className="font-semibold text-lg text-gray-800 dark:text-gray-200 capitalize">
                {word.position || "Definition"}
              </div>

              {word.cefrLevel && (
                <div className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium">
                  {word.cefrLevel.toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Definition:
              </h4>
              <p className="text-gray-800 dark:text-gray-200">
                {word.definition || word.definitionGpt || "No definition available"}
              </p>
            </div>

            {word.trans && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Translation:
                </h4>
                <p className="text-gray-600 dark:text-gray-400">{word.trans}</p>
              </div>
            )}

            {word.sentenceAudio && word.sentenceAudio.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Examples:
                </h4>
                <div className="space-y-4">
                  {word.sentenceAudio.map((sentence, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 border border-gray-100 dark:border-gray-800"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <p className="text-gray-800 dark:text-gray-200">
                            {sentence.key}
                          </p>
                          {sentence.trans && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
                              {sentence.trans}
                            </p>
                          )}
                        </div>

                        {sentence.audio && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 flex-shrink-0 rounded-full hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/50 dark:hover:text-blue-400"
                            onClick={() => playAudio(sentence.audio)}
                          >
                            <Volume2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
