import { AppLayout } from "@/components/layout/app-layout";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { SectionIndicator } from "@/components/ui/section-indicator";

export default function Home() {
	return (
		<AppLayout>
			<DashboardPage />
			<SectionIndicator />
		</AppLayout>
	);
}
