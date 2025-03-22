import { AppLayout } from "@/components/layout/app-layout"
import { NotebookPage } from "@/components/notebook/notebook-page"
import { SectionIndicator } from "@/components/ui/section-indicator"

export default function Notebook() {
  return (
    <AppLayout>
      <NotebookPage />
      <SectionIndicator />
    </AppLayout>
  )
}

