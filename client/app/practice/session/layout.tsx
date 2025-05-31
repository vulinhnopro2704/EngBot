import type React from "react"
import { PracticeSessionLayout } from "@/components/practice/practice-session-layout"

export default function SessionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PracticeSessionLayout>{children}</PracticeSessionLayout>
}
