"use client";

import React, { useEffect, useState } from 'react';
import { Share, Menu, MoreVertical, ChevronDown, Store, Download } from 'lucide-react';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ChatHeaderProps {
  onOpenMenu?: () => void;
  title?: string;
  onRename?: (nextTitle: string) => void;
  onDelete?: () => void;
  onDownload?: () => void;
  waddiModel?: 'lite' | 'pro';
  onChangeWaddiModel?: (model: 'lite' | 'pro') => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  onOpenMenu,
  title = "Ama",
  onRename,
  onDelete,
  onDownload,
  waddiModel = 'lite',
  onChangeWaddiModel,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState(title);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [publishData, setPublishData] = useState({ title: title, city: '', price: '', description: '' });

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
  const iconActionClass = "h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors";

  return (
    <>
      <div className="min-h-16 py-2 flex items-center justify-between px-4 mt-0 sm:px-6 bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-30">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMenu}
            className={`md:hidden -ml-2 ${iconActionClass}`}
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

        <TooltipProvider delayDuration={120}>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setIsPublishOpen(true)}
                  className={iconActionClass}
                >
                  <Store size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent>Publish to Store</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setIsShareOpen(true)}
                  className={iconActionClass}
                >
                  <Share size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent>Share Chat</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onDownload}
                  className={iconActionClass}
                >
                  <Download size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent>Download Chat</TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <button className={iconActionClass}>
                      <MoreVertical size={18} />
                    </button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>More</TooltipContent>
              </Tooltip>
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
        </TooltipProvider>
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
          if (!open) {
            setCopied(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share chat</DialogTitle>
            <DialogDescription>
              Send this link so someone can open this chat.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input value={shareUrl} readOnly />
          </div>
          <DialogFooter className="sm:justify-between flex-row-reverse" style={{ justifyContent: 'flex-start' }}>
            <Button type="button" onClick={copyShareLink}>
              {copied ? "Copied" : "Copy link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isPublishOpen}
        onOpenChange={setIsPublishOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Publish to Store</DialogTitle>
            <DialogDescription>
              Add details to publish this chat as a reusable kit in the Store.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Kit Title</label>
              <Input value={publishData.title} onChange={e => setPublishData({ ...publishData, title: e.target.value })} placeholder="e.g. Lagos Birthday Kit" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <Input value={publishData.city} onChange={e => setPublishData({ ...publishData, city: e.target.value })} placeholder="e.g. Lagos" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Price</label>
                <Input value={publishData.price} onChange={e => setPublishData({ ...publishData, price: e.target.value })} placeholder="e.g. $49" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={publishData.description}
                onChange={e => setPublishData({ ...publishData, description: e.target.value })}
                placeholder="Describe what's included..."
              />
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsPublishOpen(false)}>Cancel</Button>
              <Button onClick={() => {
                // Mock API call
                setIsPublishOpen(false);
                alert("Published to Store!");
              }}>
                <Store className="w-4 h-4 mr-2" /> Publish
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatHeader;
