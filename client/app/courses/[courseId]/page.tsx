import { AppLayout } from "@/components/layout/app-layout"
import { CourseDetailPage } from "@/components/courses/course-detail-page"

export default function CourseDetail({ params }: { params: { courseId: string } }) {
  return (
    <AppLayout>
      <CourseDetailPage courseId={Number.parseInt(params.courseId)} />
    </AppLayout>
  )
}
