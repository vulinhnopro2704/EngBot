import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { AppLayout } from "@/components/layout/app-layout";
import { SectionIndicator } from "@/components/ui/section-indicator";

export default function Home() {
	// In a real app, we would check if the user is authenticated
	const isAuthenticated = true;

	if (!isAuthenticated) {
		// redirect("/login")
	}
	return (
		<AppLayout>
			<DashboardPage />
			<SectionIndicator />
		</AppLayout>
	);
}
