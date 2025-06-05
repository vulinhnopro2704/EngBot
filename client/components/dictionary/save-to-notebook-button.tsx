"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Check, Loader2, BookmarkPlus, Trophy, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { apiPost } from "@/lib/api-client";
import { ENDPOINTS } from "@/lib/endpoint";
import type { WordData } from "@/types/mochi-dictionary";

interface SaveToNotebookButtonProps {
  word: string;
  wordData: WordData;
}

export function SaveToNotebookButton({ word, wordData }: SaveToNotebookButtonProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const { toast } = useToast();

  const handleSaveWord = async () => {
    if (isSaved) return;
    
    try {
      setIsSaving(true);
      
      // Prepare the word data to save
      const wordDetails = wordData.words[0];
      const payload = {
        word: word,
        definition: wordDetails?.definition || wordDetails?.definitionGpt || "",
        cefrLevel: wordDetails?.cefrLevel || "A1",
        translation: wordDetails?.trans || "",
        phonetic: wordData.phoneticUs || wordData.phoneticUk || "",
        audio: wordData.audioUs || wordData.audioUk || "",
        example: wordDetails?.sentenceAudio?.[0]?.key || "",
        exampleTranslation: wordDetails?.sentenceAudio?.[0]?.trans || "",
        partOfSpeech: wordData.position || "",
      };
      
      await apiPost(ENDPOINTS.USER_WORDS.SUBMIT_WORDS, payload);
      
      setIsSaved(true);
      setShowReward(true);
      
      // Hide the reward animation after 3 seconds
      setTimeout(() => {
        setShowReward(false);
      }, 3000);
      
      toast({
        title: "Word saved!",
        description: `"${word}" has been added to your vocabulary notebook.`,
      });
    } catch (error) {
      console.error("Failed to save word:", error);
      toast({
        title: "Failed to save word",
        description: "An error occurred while saving the word to your notebook.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative">
      <Button 
        onClick={handleSaveWord} 
        disabled={isSaving || isSaved}
        variant={isSaved ? "outline" : "default"}
        size="lg"
        className={`relative transition-all duration-300 ${
          isSaved 
            ? "bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800" 
            : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
        }`}
      >
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Saving...
          </>
        ) : isSaved ? (
          <>
            <Check className="mr-2 h-5 w-5" />
            Saved to Notebook
          </>
        ) : (
          <>
            <BookmarkPlus className="mr-2 h-5 w-5" />
            Save to Notebook
          </>
        )}
      </Button>
      
      <AnimatePresence>
        {showReward && (
          <motion.div 
            className="absolute -top-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
            initial={{ opacity: 0, y: 20, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.5 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 15 
            }}
          >
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-yellow-300/30 dark:bg-yellow-600/30"></div>
              <div className="relative flex items-center justify-center p-3 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full shadow-lg">
                <Trophy className="h-6 w-6 text-white" />
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-2 text-center text-sm font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1"
            >
              <Sparkles className="h-3 w-3" />
              <span>+5 XP</span>
              <Sparkles className="h-3 w-3" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
