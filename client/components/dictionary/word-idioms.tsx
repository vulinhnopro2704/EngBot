"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import type { WordData } from "@/types/mochi-dictionary";

interface WordIdiomsProps {
  wordData: WordData;
}

export function WordIdioms({ wordData }: WordIdiomsProps) {
  const playAudio = (audioUrl: string) => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audio.play().catch(error => console.error("Audio playback error:", error));
  };

  return (
    <div className="space-y-4">
      {wordData.idioms.length > 0 ? (
        wordData.idioms.map((idiom, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <div className="font-medium text-lg">{idiom.idiom}</div>
                  {idiom.audio && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={() => playAudio(idiom.audio || "")}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div>
                  <div className="font-medium text-sm text-gray-500">Definition:</div>
                  <div className="mt-1">{idiom.definition || idiom.definitionGpt}</div>
                </div>
                
                {idiom.idiomsTran?.definition && (
                  <div>
                    <div className="font-medium text-sm text-gray-500">Translation:</div>
                    <div className="mt-1 text-muted-foreground">{idiom.idiomsTran.definition}</div>
                  </div>
                )}
                
                <div>
                  <div className="font-medium text-sm text-gray-500 mt-2">Examples:</div>
                  <ul className="list-disc list-inside space-y-2 mt-1">
                    {idiom.example && (
                      <li>
                        <span>{idiom.example}</span>
                        {idiom.idiomsTran?.example && (
                          <div className="ml-6 text-sm text-muted-foreground">
                            {idiom.idiomsTran.example}
                          </div>
                        )}
                      </li>
                    )}
                    {idiom.example2 && (
                      <li>
                        <span>{idiom.example2}</span>
                        {idiom.idiomsTran?.example2 && (
                          <div className="ml-6 text-sm text-muted-foreground">
                            {idiom.idiomsTran.example2}
                          </div>
                        )}
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-muted-foreground">No idioms available for this word.</p>
      )}
    </div>
  );
}
