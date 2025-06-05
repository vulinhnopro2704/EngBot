"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { WordData } from "@/types/mochi-dictionary";

interface WordCollocationsProps {
  wordData: WordData;
}

export function WordCollocations({ wordData }: WordCollocationsProps) {
  // Flatten all collocations from all word entries
  const allCollocations = wordData.words.flatMap(word => word.collocations || []);

  return (
    <div className="space-y-4">
      {allCollocations.length > 0 ? (
        allCollocations.map((collocation, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="grid gap-2">
                <div className="font-medium text-lg">{collocation.collocations}</div>
                
                <div>
                  <div className="font-medium text-sm text-gray-500">Definition:</div>
                  <div className="mt-1">{collocation.definition}</div>
                </div>
                
                {collocation.collocationTrans?.definition && (
                  <div>
                    <div className="font-medium text-sm text-gray-500">Translation:</div>
                    <div className="mt-1 text-muted-foreground">
                      {collocation.collocationTrans.definition}
                    </div>
                  </div>
                )}
                
                <div>
                  <div className="font-medium text-sm text-gray-500 mt-2">Examples:</div>
                  <ul className="list-disc list-inside space-y-2 mt-1">
                    {collocation.example && (
                      <li>
                        <span>{collocation.example}</span>
                        {collocation.collocationTrans?.example && (
                          <div className="ml-6 text-sm text-muted-foreground">
                            {collocation.collocationTrans.example}
                          </div>
                        )}
                      </li>
                    )}
                    {collocation.example2 && (
                      <li>
                        <span>{collocation.example2}</span>
                        {collocation.collocationTrans?.example2 && (
                          <div className="ml-6 text-sm text-muted-foreground">
                            {collocation.collocationTrans.example2}
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
        <p className="text-muted-foreground">No collocations available for this word.</p>
      )}
    </div>
  );
}
