import { AppLayout } from "@/components/layout/app-layout"
import { PracticePage } from "@/components/practice/practice-page"
import { SectionIndicator } from "@/components/ui/section-indicator"

export default function Practice() {
  return (
    <AppLayout>
      <PracticePage />
      <SectionIndicator />
    </AppLayout>
  )
}

