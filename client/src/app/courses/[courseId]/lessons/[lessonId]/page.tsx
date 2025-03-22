import { FullScreenLayout } from "@/components/layout/full-screen-layout";
import { LessonPage } from "@/components/lessons/lesson-page";

export default async function Lesson({
	params,
}: {
	params: Promise<{ courseId: string; lessonId: string }>;
}) {
	// Await and destructure params
	const { courseId, lessonId } = await params;

	return (
		<FullScreenLayout>
			<LessonPage
				courseId={Number.parseInt(courseId)}
				lessonId={Number.parseInt(lessonId)}
			/>
		</FullScreenLayout>
	);
}
