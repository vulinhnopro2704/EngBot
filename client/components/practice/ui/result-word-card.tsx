import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AudioPlayer } from "../audio-player"

interface ResultWordCardProps {
  item: {
    id: string
    level: number
    streak: number
    next_review: string
    word: {
      word: string
      pronunciation: string
      pos: string
      meaning: string
      example: string
      example_vi: string
      cefr: string
      audio?: string
    }
  }
}

export function ResultWordCard({ item }: ResultWordCardProps) {
  return (
    <Card key={item.id} className="overflow-hidden">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">{item.word.word}</CardTitle>
          <p className="text-muted-foreground text-sm">
            {item.word.pronunciation} · <span className="uppercase">{item.word.pos}</span>
          </p>
        </div>
        {item.word.audio && (
          <AudioPlayer 
            src={item.word.audio}
            className="h-8 w-8"
          />
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <div className="font-medium">Meaning</div>
          <p>{item.word.meaning}</p>
        </div>
        
        <div>
          <div className="font-medium">Example</div>
          <p className="text-sm">{item.word.example}</p>
          <p className="text-sm text-muted-foreground">{item.word.example_vi}</p>
        </div>
        
        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="outline">Level {item.level}</Badge>
          <Badge variant="outline">Streak {item.streak}</Badge>
          <Badge>{item.word.cefr}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
