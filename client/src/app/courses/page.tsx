import { AppLayout } from "@/components/layout/app-layout"
import { CoursesPage } from "@/components/courses/courses-page"
import { SectionIndicator } from "@/components/ui/section-indicator"

export default function Courses() {
  return (
    <AppLayout>
      <CoursesPage />
      <SectionIndicator />
    </AppLayout>
  )
}

