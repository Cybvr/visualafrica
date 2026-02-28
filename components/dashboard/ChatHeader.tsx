"use client";

import React, { useEffect, useState } from 'react';
import { MessageSquareShare, Menu, MoreVertical, ChevronDown, Store, Download, ImagePlus, Loader2 } from 'lucide-react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
  sharePath?: string;
  onRename?: (nextTitle: string) => void;
  onDelete?: () => void;
  onDownload?: () => void;
  waddiModel?: 'lite' | 'pro';
  onChangeWaddiModel?: (model: 'lite' | 'pro') => void;
  onPublish?: (data: { title: string; city: string; price: string; description: string; category: string; image: string }) => Promise<void>;
  initialPublishData?: { city?: string; price?: string; description?: string; category?: string; image?: string };
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  onOpenMenu,
  title = "Ama",
  sharePath,
  onRename,
  onDelete,
  onDownload,
  waddiModel = 'lite',
  onChangeWaddiModel,
  onPublish,
  initialPublishData,
}) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitle, setEditingTitle] = useState(title);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [publishData, setPublishData] = useState({ title: title, city: '', price: '', description: '', category: '', image: '' });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const storageRef = ref(storage, `store_covers/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(Math.round(progress));
      },
      (error) => {
        console.error("Upload error:", error);
        setIsUploading(false);
        alert("Failed to upload image. Please try again.");
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setPublishData(prev => ({ ...prev, image: downloadURL }));
        setIsUploading(false);
      }
    );
  };

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

  const shareUrl = typeof window !== "undefined" && sharePath
    ? `${window.location.origin}${sharePath}`
    : "";

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

        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={iconActionClass} aria-label="Chat options">
                <MoreVertical size={18} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-card">
              <DropdownMenuItem
                onClick={() => {
                  setPublishData({
                    title,
                    city: initialPublishData?.city || '',
                    price: initialPublishData?.price || '',
                    description: initialPublishData?.description || '',
                    category: initialPublishData?.category || '',
                    image: initialPublishData?.image || ''
                  });
                  setIsPublishOpen(true);
                }}
              >
                <Store size={16} className="mr-2" />
                Publish to Store
              </DropdownMenuItem>
              {sharePath && (
                <DropdownMenuItem onClick={() => setIsShareOpen(true)}>
                  <MessageSquareShare size={16} className="mr-2" />
                  Share Chat
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={onDownload}>
                <Download size={16} className="mr-2" />
                Download Chat
              </DropdownMenuItem>
              <DropdownMenuSeparator />
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
          if (!open) {
            setCopied(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share chat</DialogTitle>
            <DialogDescription>
              Send this link so someone can open a read-only shared page.
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <Input value={publishData.city} onChange={e => setPublishData({ ...publishData, city: e.target.value })} placeholder="e.g. Lagos" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Input value={publishData.category} onChange={e => setPublishData({ ...publishData, category: e.target.value })} placeholder="e.g. Birthday" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                <Input value={publishData.price} onChange={e => setPublishData({ ...publishData, price: e.target.value })} placeholder="49" className="pl-7" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Cover Image</label>
              {publishData.image ? (
                <div className="relative w-full aspect-video rounded-md overflow-hidden border border-border group">
                  <img src={publishData.image} alt="Cover Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" size="sm" onClick={() => setPublishData({ ...publishData, image: '' })}>
                      Remove Image
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-lg cursor-pointer bg-secondary/20 hover:bg-secondary/50 overflow-hidden relative">
                    {isUploading ? (
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        <span className="text-xs font-semibold text-muted-foreground">Uploading... {uploadProgress}%</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                          <ImagePlus className="w-8 h-8 mb-3 text-muted-foreground" />
                          <p className="mb-1 text-sm text-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (Max 5MB)</p>
                        </div>
                        <Input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleImageUpload} />
                      </>
                    )}
                  </label>
                </div>
              )}
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
              <Button variant="outline" onClick={() => setIsPublishOpen(false)} disabled={isPublishing}>Cancel</Button>
              <Button
                onClick={async () => {
                  if (onPublish) {
                    setIsPublishing(true);
                    try {
                      await onPublish(publishData);
                      setIsPublishOpen(false);
                    } catch (error) {
                      console.error("Publish failed:", error);
                    } finally {
                      setIsPublishing(false);
                    }
                  } else {
                    setIsPublishOpen(false);
                    alert("Published to Store!");
                  }
                }}
                disabled={isPublishing || !publishData.title || !publishData.city || !publishData.price || !publishData.category}
              >
                {isPublishing ? "Publishing..." : <><Store className="w-4 h-4 mr-2" /> Publish</>}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatHeader;
