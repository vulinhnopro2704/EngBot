import { AppLayout } from "@/components/layout/app-layout"
import { SettingsPage } from "@/components/settings/settings-page"
import { SectionIndicator } from "@/components/ui/section-indicator"

export default function Settings() {
  return (
    <AppLayout>
      <SettingsPage />
      <SectionIndicator />
    </AppLayout>
  )
}
