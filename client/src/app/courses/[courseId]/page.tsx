import { AppLayout } from "@/components/layout/app-layout";
import { CourseDetailPage } from "@/components/courses/course-detail-page";

export default async function CourseDetail({
	params,
}: {
	params: Promise<{ courseId: string }>;
}) {
	// Await and destructure params
	const { courseId } = await params;

	return (
		<AppLayout>
			<CourseDetailPage courseId={Number.parseInt(courseId)} />
		</AppLayout>
	);
}
