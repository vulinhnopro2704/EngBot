"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WordData } from "@/types/mochi-dictionary";

interface WordThesaurusProps {
  wordData: WordData;
}

export function WordThesaurus({ wordData }: WordThesaurusProps) {
  return (
    <div className="space-y-4">
      {wordData.thesaurus.length > 0 ? (
        wordData.thesaurus.map((thesaurus, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="grid gap-4">
                <div>
                  <div className="font-medium mb-2">{thesaurus.positionContent} ({thesaurus.position})</div>
                  
                  <div className="space-y-3">
                    {/* Synonyms */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Synonyms</h4>
                      <div className="space-y-2">
                        {thesaurus.strongestMatch && (
                          <div>
                            <span className="text-xs text-gray-500">Strongest:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {thesaurus.strongestMatch.split(',').map((word, i) => (
                                <Badge key={i} variant="outline" className="bg-green-50">
                                  {word.trim()}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {thesaurus.strongMatch && (
                          <div>
                            <span className="text-xs text-gray-500">Strong:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {thesaurus.strongMatch.split(',').map((word, i) => (
                                <Badge key={i} variant="outline" className="bg-blue-50">
                                  {word.trim()}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {thesaurus.weakMatch && (
                          <div>
                            <span className="text-xs text-gray-500">Weak:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {thesaurus.weakMatch.split(',').map((word, i) => (
                                <Badge key={i} variant="outline">
                                  {word.trim()}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Antonyms */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Antonyms</h4>
                      <div className="space-y-2">
                        {thesaurus.strongestOpposite && (
                          <div>
                            <span className="text-xs text-gray-500">Strongest:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {thesaurus.strongestOpposite.split(',').map((word, i) => (
                                <Badge key={i} variant="outline" className="bg-red-50">
                                  {word.trim()}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {thesaurus.strongOpposite && (
                          <div>
                            <span className="text-xs text-gray-500">Strong:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {thesaurus.strongOpposite.split(',').map((word, i) => (
                                <Badge key={i} variant="outline" className="bg-orange-50">
                                  {word.trim()}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {thesaurus.weakOpposite && (
                          <div>
                            <span className="text-xs text-gray-500">Weak:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {thesaurus.weakOpposite.split(',').map((word, i) => (
                                <Badge key={i} variant="outline">
                                  {word.trim()}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-muted-foreground">No thesaurus data available for this word.</p>
      )}
    </div>
  );
}
