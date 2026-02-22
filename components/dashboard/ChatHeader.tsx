"use client";

import React, { useEffect, useState } from 'react';
import { Share, Menu, MoreVertical, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ChatHeaderProps {
  onOpenMenu?: () => void;
  title?: string;
  onRename?: (nextTitle: string) => void;
  onDelete?: () => void;
  waddiModel?: 'lite' | 'pro';
  onChangeWaddiModel?: (model: 'lite' | 'pro') => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  onOpenMenu,
  title = "Ama",
  onRename,
  onDelete,
  waddiModel = 'lite',
  onChangeWaddiModel,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState(title);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isEditingTitle) {
      setEditingTitle(title);
    }
  }, [isEditingTitle, title]);

  const submitRename = () => {
    const nextTitle = editingTitle.trim();
    if (!nextTitle) {
      setEditingTitle(title);
      setIsEditingTitle(false);
      return;
    }
    onRename?.(nextTitle);
    setIsEditingTitle(false);
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const copyShareLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Failed to copy share link:", error);
    }
  };

  const currentModel = waddiModel === "lite"
    ? { label: "Waddi Lite", description: "Fast everyday planning" }
    : { label: "Waddi Pro", description: "Deeper planning and insights" };

  return (
    <>
      <div className="min-h-16 py-2 flex items-center justify-between px-4 mt-0 sm:px-6 bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-30">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMenu}
            className="md:hidden p-2 -ml-2 text-muted-foreground hover:bg-secondary rounded-xl transition-colors"
          >
            <Menu size={20} />
          </button>
          {isEditingTitle ? (
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
                  setEditingTitle(title);
                  setIsEditingTitle(false);
                }
              }}
              className="h-8 w-56 max-w-[50vw] text-sm"
              maxLength={80}
              autoFocus
            />
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="text-left px-1 py-1 hover:bg-secondary rounded-md transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-base font-bold leading-tight">{currentModel.label}</div>
                    <ChevronDown size={16} className="text-muted-foreground shrink-0" />
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem onClick={() => onChangeWaddiModel?.("lite")} className="py-2">
                  <div className="flex w-full items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-bold leading-tight">Waddi Lite</div>
                      <div className="text-[10px] text-muted-foreground leading-tight mt-0.5">Fast everyday planning</div>
                    </div>
                    {waddiModel === "lite" && <span className="text-primary text-xs font-bold">✓</span>}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onChangeWaddiModel?.("pro")} className="py-2">
                  <div className="flex w-full items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-bold leading-tight">Waddi Pro</div>
                      <div className="text-[10px] text-muted-foreground leading-tight mt-0.5">Deeper planning and insights</div>
                    </div>
                    {waddiModel === "pro" && <span className="text-primary text-xs font-bold">✓</span>}
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsShareOpen(true)}
            className="hidden sm:flex items-center gap-2 rounded-xl border-border py-2.5 px-4 h-auto font-bold text-sm"
          >
            <Share size={14} />
            Share
          </Button>
          <button
            onClick={() => setIsShareOpen(true)}
            className="sm:hidden p-2 text-muted-foreground hover:bg-secondary rounded-lg transition-colors"
          >
            <Share size={18} />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 text-muted-foreground hover:bg-secondary rounded-lg transition-colors">
                <MoreVertical size={18} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem
                onClick={() => {
                  setEditingTitle(title);
                  setIsEditingTitle(true);
                }}
              >
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setIsDeleteOpen(true)}
                className="text-red-600 focus:text-red-700"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove this chat and start a new one.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={isShareOpen}
        onOpenChange={(open) => {
          setIsShareOpen(open);
          if (!open) setCopied(false);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share chat</DialogTitle>
            <DialogDescription>
              Send this link so someone can open this chat.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Input value={shareUrl} readOnly />
          </div>
          <DialogFooter>
            <Button type="button" onClick={copyShareLink}>
              {copied ? "Copied" : "Copy link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatHeader;
