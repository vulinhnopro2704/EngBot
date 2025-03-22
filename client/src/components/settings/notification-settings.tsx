"use client"

import { motion } from "framer-motion"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useVocabStore } from "@/lib/store"

export function NotificationSettings() {
  const {
    emailNotifications,
    pushNotifications,
    reminderFrequency,
    toggleEmailNotifications,
    togglePushNotifications,
    updateReminderFrequency,
  } = useVocabStore()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Notification Preferences</h3>
        <p className="text-sm text-muted-foreground">Manage how and when you receive notifications.</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between space-y-0.5">
          <div>
            <Label className="text-base">Email Notifications</Label>
            <p className="text-sm text-muted-foreground">Receive notifications about your progress via email</p>
          </div>
          <Switch checked={emailNotifications} onCheckedChange={toggleEmailNotifications} />
        </div>

        <div className="flex items-center justify-between space-y-0.5">
          <div>
            <Label className="text-base">Push Notifications</Label>
            <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
          </div>
          <Switch checked={pushNotifications} onCheckedChange={togglePushNotifications} />
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="reminder-frequency">Reminder Frequency</Label>
          <p className="text-sm text-muted-foreground">How often would you like to receive practice reminders?</p>
        </div>
        <Select value={reminderFrequency} onValueChange={updateReminderFrequency}>
          <SelectTrigger id="reminder-frequency" className="w-full sm:w-[240px]">
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="never">Never</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="every-other-day">Every Other Day</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  )
}

