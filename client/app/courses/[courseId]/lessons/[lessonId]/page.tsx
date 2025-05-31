import { FullScreenLayout } from "@/components/layout/full-screen-layout"
import { LessonPage } from "@/components/lessons/lesson-page"

export default function Lesson({ params }: { params: { courseId: string; lessonId: string } }) {
  return (
    <FullScreenLayout>
      <LessonPage courseId={Number.parseInt(params.courseId)} lessonId={Number.parseInt(params.lessonId)} />
    </FullScreenLayout>
  )
}
