import { AppLayout } from "@/components/layout/app-layout";
import { CourseDetailPage } from "@/components/courses/course-detail-page";

export default async function CourseDetail({
	params,
}: {
	params: Promise<{ courseId: string }>;
}) {
	const { courseId } = await params;
	console.log("CourseId: " + courseId);
	return (
		<AppLayout>
			<CourseDetailPage courseId={Number.parseInt(courseId)} />
		</AppLayout>
	);
}
