import { EnglishChatInterface } from "@/components/chat/english-chat-interface";
import { AppLayout } from "@/components/layout/app-layout";
import { Shell } from "@/components/shell";

export const metadata = {
  title: "English Learning Chat - EngBot",
  description: "Chat with an AI assistant to improve your English skills with real-time grammar correction and suggestions",
};

export default function ChatPage() {
  return (
    <AppLayout>
      <Shell className="px-0 py-0 max-w-none">
        <div className="flex flex-col w-full h-[calc(100vh-4rem)]">
          <div className="px-4 py-4 border-b bg-background">
            <h1 className="text-2xl font-bold">English Learning Chat</h1>
            <p className="text-muted-foreground">
              Chat with EngBot to improve your English skills. The AI will correct your grammar and offer suggestions.
            </p>
          </div>
          <div className="flex-1 overflow-hidden">
            <EnglishChatInterface className="h-full rounded-none border-0" />
          </div>
        </div>
      </Shell>
    </AppLayout>
  );
}
