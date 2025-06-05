import { AppLayout } from "@/components/layout/app-layout";
import { DictionarySearch } from "@/components/dictionary/dictionary-search";
import { SectionIndicator } from "@/components/ui/section-indicator";
import { QueryProvider } from "@/providers/query-provider";
import { BookOpen, Lightbulb, Sparkles } from "lucide-react";

export default function DictionaryPage() {
  return (
    <AppLayout>
      <div className="mx-auto p-4 w-full max-w-5xl">
        <div className="flex flex-col space-y-4">
          {/* Header with decorative elements */}
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-purple-200 rounded-full opacity-50 animate-pulse dark:bg-purple-900"></div>
            <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-blue-200 rounded-full opacity-50 animate-pulse delay-300 dark:bg-blue-900"></div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-800 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10">
                <Sparkles className="w-32 h-32 text-blue-500" />
              </div>

              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                  Word Explorer
                </h1>
              </div>

              <p className="text-gray-600 dark:text-gray-300 ml-9 max-w-2xl">
                Discover new words, meanings, and examples to boost your
                vocabulary. Save words to your notebook to track your learning
                journey!
              </p>

              <div className="flex items-center gap-2 mt-4 ml-9 text-sm text-blue-600 dark:text-blue-400">
                <Lightbulb className="h-4 w-4" />
                <span>
                  Tip: Try searching for a word to see its detailed definition,
                  examples, and more!
                </span>
              </div>
            </div>
          </div>

          {/* Dictionary search with provider */}
          <div className="mt-6 relative">
            <div className="absolute -z-10 blur-3xl rounded-full w-32 h-32 bg-purple-300/30 dark:bg-purple-700/20 -top-10 -right-10"></div>
            <div className="absolute -z-10 blur-3xl rounded-full w-32 h-32 bg-blue-300/30 dark:bg-blue-700/20 -bottom-10 -left-10"></div>

            <QueryProvider>
              <DictionarySearch />
            </QueryProvider>
          </div>
        </div>
      </div>
      <SectionIndicator />
    </AppLayout>
  );
}
