import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResultWordCard } from "../ui/result-word-card"

interface ReviewWordsSectionProps {
  correctPercentage: number
  timeSpentReview: number
  lastSession: any
  reviewWordsResult: any[] | null
  onStartNewSession: () => void
}

export function ReviewWordsSection({
  correctPercentage,
  timeSpentReview,
  lastSession,
  reviewWordsResult,
  onStartNewSession
}: ReviewWordsSectionProps) {
  return (
    <div className="container max-w-5xl py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Practice Complete!</h1>
        <p className="text-muted-foreground">
          Great job! You've completed your practice session.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{correctPercentage}%</div>
            <p className="text-muted-foreground">
              {lastSession.correctAnswers} of {lastSession.questions.length} correct
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{timeSpentReview}s</div>
            <p className="text-muted-foreground">
              {Math.round(timeSpentReview / lastSession.questions.length)}s per word
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{lastSession.mode}</div>
            <p className="text-muted-foreground">
              {lastSession.questions.length} words
            </p>
          </CardContent>
        </Card>
      </div>

      {reviewWordsResult && reviewWordsResult.length > 0 && (
        <Tabs defaultValue="words" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="words">Reviewed Words</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="words" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviewWordsResult.map(item => (
                <ResultWordCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="stats" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Review Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Words by Level</h3>
                    <ul className="mt-2 space-y-1">
                      {Array.from(new Set(reviewWordsResult.map(w => w.level))).sort().map(level => (
                        <li key={level} className="flex justify-between">
                          <span>Level {level}</span>
                          <span>{reviewWordsResult.filter(w => w.level === level).length} words</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Words by CEFR</h3>
                    <ul className="mt-2 space-y-1">
                      {Array.from(new Set(reviewWordsResult.map(w => w.word.cefr))).sort().map(cefr => (
                        <li key={cefr} className="flex justify-between">
                          <span>CEFR {cefr}</span>
                          <span>{reviewWordsResult.filter(w => w.word.cefr === cefr).length} words</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Next Review Times</h3>
                    <ul className="mt-2 space-y-1">
                      {reviewWordsResult.slice(0, 5).map(item => (
                        <li key={item.id} className="flex justify-between">
                          <span>{item.word.word}</span>
                          <span>{new Date(item.next_review).toLocaleDateString()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      <div className="flex justify-center pt-6">
        <Button size="lg" onClick={onStartNewSession}>
          Practice More Words
        </Button>
      </div>
    </div>
  )
}
