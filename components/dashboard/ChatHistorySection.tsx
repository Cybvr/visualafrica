"use client";

import React, { useMemo, useState } from "react";
import { MdMoreHoriz } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Input } from "../ui/input";

type ChatHistoryItem = {
  id: string;
  title: string;
};

interface ChatHistorySectionProps {
  items: ChatHistoryItem[];
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  variant?: "default" | "whatsapp";
  showHeader?: boolean;
}

const ChatHistorySection: React.FC<ChatHistorySectionProps> = ({
  items,
  onRename,
  onDelete,
  variant = "default",
  showHeader = true,
}) => {
  const router = useRouter();
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const deleteTarget = useMemo(
    () => items.find((item) => item.id === deleteTargetId) ?? null,
    [items, deleteTargetId]
  );

  const startRename = (chat: ChatHistoryItem) => {
    setEditingChatId(chat.id);
    setEditingTitle(chat.title);
  };

  const closeRename = () => {
    setEditingChatId(null);
    setEditingTitle("");
  };

  const submitRename = () => {
    if (!editingChatId) return;

    const nextTitle = editingTitle.trim();
    if (!nextTitle) return;

    onRename(editingChatId, nextTitle);
    closeRename();
  };

  const confirmDelete = () => {
    if (!deleteTargetId) return;
    onDelete(deleteTargetId);
    setDeleteTargetId(null);
  };

  const initialsFor = (title: string) =>
    title
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() || "")
      .join("");

  const dicebearSeedFor = (value: string) =>
    encodeURIComponent(value || "chat");

  return (
    <>
      <div className={variant === "whatsapp" ? "space-y-2" : "mt-5"}>
        {showHeader && (
          <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-widest text-foreground">
            Chat History
          </div>
        )}
        <div className={variant === "whatsapp" ? "space-y-2" : "space-y-0.5"}>
          {items.map((chat) => (
            <div
              key={chat.id}
              className={variant === "whatsapp"
                ? "group w-full rounded-2xl transition-all bg-card/60 hover:bg-card flex items-center gap-3 px-3 py-2 overflow-hidden"
                : "group w-full rounded-lg transition-all hover:bg-card flex items-center gap-1 px-2 py-1"
              }
            >
              {variant === "whatsapp" && (
                <div className="w-10 h-10 rounded-full shrink-0 border border-border bg-secondary overflow-hidden flex items-center justify-center">
                  <img
                    src={`https://api.dicebear.com/7.x/bottts/svg?seed=${dicebearSeedFor(chat.id || chat.title)}&backgroundColor=E9D5FF&baseColor=7C3AED`}
                    alt={chat.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        parent.textContent = initialsFor(chat.title);
                        parent.className = "w-10 h-10 rounded-full shrink-0 border border-border bg-secondary text-xs font-black text-foreground flex items-center justify-center";
                      }
                    }}
                  />
                </div>
              )}
              {editingChatId === chat.id ? (
                <Input
                  value={editingTitle}
                  onChange={(event) => setEditingTitle(event.target.value)}
                  onBlur={submitRename}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      submitRename();
                    }
                    if (event.key === "Escape") {
                      closeRename();
                    }
                  }}
                  className={variant === "whatsapp" ? "h-9 flex-1" : "h-8 flex-1"}
                  maxLength={80}
                  autoFocus
                />
              ) : (
                <button
                  type="button"
                  onClick={() => router.push(`/dashboard/hosts/chat/${chat.id}`)}
                  className={variant === "whatsapp"
                    ? "flex-1 min-w-0 text-left leading-tight"
                    : "flex-1 text-left text-sm font-medium leading-tight text-foreground group-hover:text-foreground truncate px-1 py-1"
                  }
                >
                  <div className={variant === "whatsapp" ? "text-sm font-semibold text-foreground truncate" : ""}>
                    {chat.title}
                  </div>
                  {variant === "whatsapp" && (
                    <div className="text-xs text-foreground truncate">Last message preview…</div>
                  )}
                </button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label={`Actions for ${chat.title}`}
                    className="h-7 w-7 inline-flex items-center justify-center rounded-md text-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <MdMoreHoriz size={18} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem disabled>Share</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => startRename(chat)}>Rename</DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setDeleteTargetId(chat.id)}
                    className="text-red-600 focus:text-red-700"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </div>
      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete chat?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `This will remove "${deleteTarget.title}" from your chat history.`
                : "This will remove this chat from your chat history."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ChatHistorySection;
