"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WordHeader } from "@/components/dictionary/word-header";
import { WordDefinitions } from "@/components/dictionary/word-definitions";
import { WordCollocations } from "@/components/dictionary/word-collocations";
import { WordIdioms } from "@/components/dictionary/word-idioms";
import { WordPhrasalVerbs } from "@/components/dictionary/word-phrasal-verbs";
import { WordThesaurus } from "@/components/dictionary/word-thesaurus";
import { SaveToNotebookButton } from "@/components/dictionary/save-to-notebook-button";
import type { WordData } from "@/types/mochi-dictionary";
import { Book, PuzzleIcon, Highlighter, BookText, LibraryBig } from "lucide-react";

interface WordDetailsProps {
  wordData: WordData;
  searchTerm: string;
}

export function WordDetails({ wordData, searchTerm }: WordDetailsProps) {
  const [activeTab, setActiveTab] = useState("definitions");
  
  // Check if additional tabs have content
  const hasCollocations = wordData.words.some(word => word.collocations?.length > 0);
  const hasIdioms = wordData.idioms?.length > 0;
  const hasPhrasalVerbs = wordData.phrasalVerb?.length > 0;
  const hasThesaurus = wordData.thesaurus?.length > 0;

  const tabIcons = {
    definitions: Book,
    collocations: PuzzleIcon,
    idioms: Highlighter,
    "phrasal-verbs": BookText,
    thesaurus: LibraryBig,
  };

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100/40 to-purple-100/40 dark:from-blue-900/20 dark:to-purple-900/20 rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-100/40 to-purple-100/40 dark:from-blue-900/20 dark:to-purple-900/20 rounded-tr-full"></div>
          
          <div className="relative z-10 p-6 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <WordHeader wordData={wordData} />
            <SaveToNotebookButton word={searchTerm} wordData={wordData} />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6 pt-2">
          <TabsList className="bg-gray-100 dark:bg-gray-700/50 p-1 rounded-lg mb-6 w-full overflow-x-auto flex-nowrap">
            <TabsTrigger 
              value="definitions"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm"
            >
              <Book className="h-4 w-4 mr-2" />
              Definitions
            </TabsTrigger>
            
            {hasCollocations && (
              <TabsTrigger 
                value="collocations"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm"
              >
                <PuzzleIcon className="h-4 w-4 mr-2" />
                Collocations
              </TabsTrigger>
            )}
            
            {hasIdioms && (
              <TabsTrigger 
                value="idioms"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm"
              >
                <Highlighter className="h-4 w-4 mr-2" />
                Idioms
              </TabsTrigger>
            )}
            
            {hasPhrasalVerbs && (
              <TabsTrigger 
                value="phrasal-verbs"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm"
              >
                <BookText className="h-4 w-4 mr-2" />
                Phrasal Verbs
              </TabsTrigger>
            )}
            
            {hasThesaurus && (
              <TabsTrigger 
                value="thesaurus"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm"
              >
                <LibraryBig className="h-4 w-4 mr-2" />
                Thesaurus
              </TabsTrigger>
            )}
          </TabsList>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="definitions">
              <WordDefinitions wordData={wordData} />
            </TabsContent>

            {hasCollocations && (
              <TabsContent value="collocations">
                <WordCollocations wordData={wordData} />
              </TabsContent>
            )}

            {hasIdioms && (
              <TabsContent value="idioms">
                <WordIdioms wordData={wordData} />
              </TabsContent>
            )}

            {hasPhrasalVerbs && (
              <TabsContent value="phrasal-verbs">
                <WordPhrasalVerbs wordData={wordData} />
              </TabsContent>
            )}

            {hasThesaurus && (
              <TabsContent value="thesaurus">
                <WordThesaurus wordData={wordData} />
              </TabsContent>
            )}
          </motion.div>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
