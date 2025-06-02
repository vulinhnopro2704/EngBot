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
    <Shell>
      <div className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-center mb-2">English Learning Chat</h1>
        <p className="text-muted-foreground text-center mb-8">
          Chat with EngBot to improve your English skills. The AI will correct your grammar and offer suggestions.
        </p>
        <EnglishChatInterface />
      </div>
    </Shell>
    </AppLayout>
  );
}
