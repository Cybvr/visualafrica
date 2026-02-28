import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { adminDb } from "@/lib/firebase-admin";

interface ShareChatPageProps {
    params: Promise<{ id: string }>;
}

interface ChatMessage {
    id: string;
    role?: string;
    content?: string;
    type?: string;
    timestamp?: { toDate?: () => Date };
}

export async function generateMetadata({ params }: ShareChatPageProps): Promise<Metadata> {
    const { id } = await params;
    const chatSnap = await adminDb.collection("chats").doc(id).get();

    if (!chatSnap.exists || chatSnap.data()?.published !== true) {
        return { title: "Shared Chat Not Found | Waddi" };
    }

    const chatTitle = String(chatSnap.data()?.title || "Shared Chat").trim();
    return {
        title: `${chatTitle} | Waddi`,
        description: "Shared chat conversation from Waddi.",
    };
}

export default async function ShareChatPage({ params }: ShareChatPageProps) {
    const { id } = await params;
    const chatRef = adminDb.collection("chats").doc(id);
    const chatSnap = await chatRef.get();

    if (!chatSnap.exists || chatSnap.data()?.published !== true) {
        notFound();
    }

    const chatTitle = String(chatSnap.data()?.title || "Shared Chat").trim();
    const messagesSnap = await chatRef.collection("messages").orderBy("timestamp", "asc").get();
    const messages: ChatMessage[] = messagesSnap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<ChatMessage, "id">),
    }));

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="mx-auto max-w-3xl px-4 py-10">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Shared chat</p>
                <h1 className="text-2xl font-bold mb-1">{chatTitle || "Shared Chat"}</h1>
                <p className="text-sm text-muted-foreground mb-8">Read-only view</p>

                <div className="space-y-4">
                    {messages.length === 0 && (
                        <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
                            No messages in this chat yet.
                        </div>
                    )}

                    {messages.map((message) => {
                        const role = message.role === "user" ? "You" : "Ama";
                        const content = typeof message.content === "string" && message.content.trim()
                            ? message.content.trim()
                            : `[${message.type || "message"}]`;
                        const ts = message.timestamp?.toDate?.();
                        const time = ts ? ts.toLocaleString("en-US") : "";

                        return (
                            <div key={message.id} className="rounded-xl border border-border bg-card p-4">
                                <div className="mb-1 flex items-center justify-between">
                                    <p className="text-sm font-semibold">{role}</p>
                                    {time ? <p className="text-xs text-muted-foreground">{time}</p> : null}
                                </div>
                                <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
