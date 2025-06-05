"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import type { WordData } from "@/types/mochi-dictionary";

interface WordPhrasalVerbsProps {
  wordData: WordData;
}

export function WordPhrasalVerbs({ wordData }: WordPhrasalVerbsProps) {
  const playAudio = (audioUrl: string) => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audio.play().catch(error => console.error("Audio playback error:", error));
  };

  return (
    <div className="space-y-4">
      {wordData.phrasalVerb.length > 0 ? (
        wordData.phrasalVerb.map((phrasalVerb, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <div className="font-medium text-lg">{phrasalVerb.phrasalVerbs}</div>
                  <div className="flex gap-2">
                    {phrasalVerb.audioUk && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">UK</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => playAudio(phrasalVerb.audioUk)}
                        >
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    {phrasalVerb.audioUs && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">US</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => playAudio(phrasalVerb.audioUs)}
                        >
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-4">
                  {phrasalVerb.phoneticUk && (
                    <div>
                      <span className="text-xs text-gray-500">UK:</span> {phrasalVerb.phoneticUk}
                    </div>
                  )}
                  {phrasalVerb.phoneticUs && (
                    <div>
                      <span className="text-xs text-gray-500">US:</span> {phrasalVerb.phoneticUs}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-muted-foreground">No phrasal verbs available for this word.</p>
      )}
    </div>
  );
}
