import { AppLayout } from "@/components/layout/app-layout";
import { NotebookDashboard } from "@/components/notebook/notebook-dashboard";
import { SectionIndicator } from "@/components/ui/section-indicator";

export default function NotebookPage() {
	return (
		<AppLayout>
			<div className="mx-auto p-4 w-full">
				<h1 className="text-3xl font-bold mb-6">Vocabulary Notebook</h1>
				<NotebookDashboard />
			</div>
			<SectionIndicator />
		</AppLayout>
	);
}
