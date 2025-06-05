"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, History, X } from "lucide-react";
import type { ApiResponse } from "@/types/mochi-dictionary";
import { WordDetails } from "./word-details";
import { fetchDictionaryWord } from "@/lib/mochi-client";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";

export function DictionarySearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ["dictionary", searchQuery],
    queryFn: async () => {
      return fetchDictionaryWord(searchQuery);
    },
    enabled: !!searchQuery,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchQuery(searchTerm.trim());
      // Add to search history if not already there
      if (!searchHistory.includes(searchTerm.trim())) {
        setSearchHistory((prev) => [searchTerm.trim(), ...prev].slice(0, 5));
      }
    }
  };

  const handleHistoryClick = (term: string) => {
    setSearchTerm(term);
    setSearchQuery(term);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchQuery("");
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
      >
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>

            <Input
              type="text"
              placeholder="Enter a word to discover its meaning..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 py-6 text-lg bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute inset-y-0 right-12 flex items-center pr-3"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={!searchTerm.trim() || isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-5 h-auto font-medium text-base shadow-md hover:shadow-lg transition-all duration-200"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <Search className="h-5 w-5 mr-2" />
              )}
              Explore Word
            </Button>

            {searchHistory.length > 0 && (
              <div className="flex-1 flex items-center overflow-x-auto gap-2 px-2">
                <History className="h-4 w-4 text-gray-400 flex-shrink-0" />
                {searchHistory.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleHistoryClick(term)}
                    className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            )}
          </div>
        </form>
      </motion.div>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-purple-500 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-400 rounded-full animate-pulse delay-300"></div>
            </div>
            <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium">
              Exploring the dictionary...
            </p>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center flex-shrink-0">
              <X className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold">Error Loading Word</h3>
              <p>There was a problem finding this word. Please try again.</p>
            </div>
          </motion.div>
        )}

        {data && data.data.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <WordDetails wordData={data.data[0]} searchTerm={searchQuery} />
          </motion.div>
        ) : data && data.data.length === 0 && !isLoading ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 rounded-lg flex items-center gap-3"
          >
            <Avatar className="w-12 h-12 bg-yellow-100 dark:bg-yellow-800 text-yellow-600 dark:text-yellow-400">
              <span className="text-xl">?</span>
            </Avatar>
            <div>
              <h3 className="font-bold">Word Not Found</h3>
              <p>
                No results found for "{searchQuery}". Try another word or check
                your spelling.
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
