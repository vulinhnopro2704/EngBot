"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, VolumeX, Star, Info } from "lucide-react";
import type { WordData } from "@/types/mochi-dictionary";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface WordHeaderProps {
  wordData: WordData;
}

export function WordHeader({ wordData }: WordHeaderProps) {
  const [isPlayingUk, setIsPlayingUk] = useState(false);
  const [isPlayingUs, setIsPlayingUs] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const playAudio = (audioUrl: string, type: 'uk' | 'us') => {
    if (!audioUrl) {
      setAudioError(true);
      setTimeout(() => setAudioError(false), 2000);
      return;
    }
    
    const audio = new Audio(audioUrl);
    
    if (type === 'uk') {
      setIsPlayingUk(true);
      audio.onended = () => setIsPlayingUk(false);
    } else {
      setIsPlayingUs(true);
      audio.onended = () => setIsPlayingUs(false);
    }
    
    audio.play().catch(error => {
      console.error("Audio playback error:", error);
      setAudioError(true);
      setTimeout(() => setAudioError(false), 2000);
      if (type === 'uk') setIsPlayingUk(false);
      else setIsPlayingUs(false);
    });
  };

  const cefrLevel = wordData.words[0]?.cefrLevel || "";
  
  const getCefrColor = (level: string) => {
    switch(level.toUpperCase()) {
      case 'A1': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'A2': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'B1': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'B2': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      case 'C1': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'C2': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 border-gray-200 dark:border-gray-800';
    }
  };

  const cefrDescriptions = {
    'A1': 'Beginner level vocabulary',
    'A2': 'Elementary level vocabulary',
    'B1': 'Intermediate level vocabulary',
    'B2': 'Upper intermediate level vocabulary',
    'C1': 'Advanced level vocabulary',
    'C2': 'Proficient level vocabulary',
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center flex-wrap gap-3">
        <motion.h2 
          className="text-3xl font-bold text-gray-900 dark:text-gray-100"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {wordData.content}
        </motion.h2>
        
        {cefrLevel && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <Badge className={`${getCefrColor(cefrLevel)} px-3 py-1 text-sm font-semibold border shadow-sm flex items-center gap-1`}>
                    <Star className="h-3 w-3" />
                    {cefrLevel.toUpperCase()}
                  </Badge>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{cefrDescriptions[cefrLevel.toUpperCase() as keyof typeof cefrDescriptions] || 'CEFR level indicator'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        <motion.span 
          className="text-gray-500 dark:text-gray-400 text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          /{wordData.position}/
        </motion.span>
      </div>
      
      <motion.div 
        className="flex flex-wrap items-center gap-4"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        {wordData.phoneticUk && (
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 rounded-full px-4 py-2 shadow-sm border border-gray-100 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">UK: {wordData.phoneticUk}</span>
            {wordData.audioUk ? (
              <Button 
                variant="ghost" 
                size="sm" 
                className={`h-8 w-8 p-0 rounded-full ${isPlayingUk ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' : ''}`}
                onClick={() => playAudio(wordData.audioUk, 'uk')}
              >
                <Volume2 className={`h-4 w-4 ${isPlayingUk ? 'animate-pulse' : ''}`} />
              </Button>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full opacity-50 cursor-not-allowed">
                      <VolumeX className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>No audio available</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}
        
        {wordData.phoneticUs && (
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 rounded-full px-4 py-2 shadow-sm border border-gray-100 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">US: {wordData.phoneticUs}</span>
            {wordData.audioUs ? (
              <Button 
                variant="ghost" 
                size="sm" 
                className={`h-8 w-8 p-0 rounded-full ${isPlayingUs ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' : ''}`}
                onClick={() => playAudio(wordData.audioUs, 'us')}
              >
                <Volume2 className={`h-4 w-4 ${isPlayingUs ? 'animate-pulse' : ''}`} />
              </Button>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full opacity-50 cursor-not-allowed">
                      <VolumeX className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>No audio available</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}
        
        {wordData.frequency !== null && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800/50 rounded-full px-3 py-1 shadow-sm border border-gray-100 dark:border-gray-700">
                  <Info className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    Frequency: {wordData.frequency}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>How frequently this word is used in English</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {audioError && (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="text-sm text-red-500 dark:text-red-400"
          >
            Failed to play audio
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
