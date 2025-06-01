import { FullScreenLayout } from "@/components/layout/full-screen-layout";
import { LessonPage } from "@/components/lessons/lesson-page";

export default async function Lesson({
	params,
}: {
	params: Promise<{ courseId: string; lessonId: string }>;
}) {
	// Await the params
	const resolvedParams = await params;

	// Convert string params to numbers
	const courseId = parseInt(resolvedParams.courseId);
	const lessonId = parseInt(resolvedParams.lessonId);

	return (
		<FullScreenLayout>
			<LessonPage courseId={courseId} lessonId={lessonId} />
		</FullScreenLayout>
	);
}
