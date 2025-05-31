"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { ReactNode } from "react"

interface PracticeModeCardProps {
  title: string
  description: string
  content?: ReactNode
  onStart: () => void
  isLoading: boolean
}

export function PracticeModeCard({ title, description, content, onStart, isLoading }: PracticeModeCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">{content}</CardContent>
      <CardFooter>
        <Button onClick={onStart} disabled={isLoading}>
          Start {title}
        </Button>
      </CardFooter>
    </Card>
  )
}
