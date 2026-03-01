"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Star, MapPin, CheckCircle2, MessageSquare, Heart, Share2, ShieldCheck, Zap, Video, Image as ImageIcon, Pencil, Upload } from 'lucide-react';
import { type Vendor } from '@/lib/types';
import { useAuth } from '@/components/providers/auth-provider';
import { updateVendor } from '@/lib/firestore-service';
import { uploadImage } from '@/lib/upload-service';
import { useSavedVendors } from '@/hooks/use-saved-vendors';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface VendorDetailProps {
  vendor: Vendor;
}

const VendorDetail: React.FC<VendorDetailProps> = ({ vendor }) => {
  const router = useRouter();
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === "admin";
  const { savedVendorIds, toggleSavedVendor } = useSavedVendors(profile?.uid);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [editName, setEditName] = React.useState(vendor.name || "");
  const [editImage, setEditImage] = React.useState(vendor.image || "");
  const [editDescription, setEditDescription] = React.useState(vendor.description || "");
  const [editPrice, setEditPrice] = React.useState(
    vendor.price === null || vendor.price === undefined
      ? ""
      : String(vendor.price)
  );
  const [editFeatured, setEditFeatured] = React.useState(Boolean(vendor.featured));
  const onBack = () => router.back();
  const hasGallery = vendor.gallery?.length > 0;
  const heroImage = hasGallery ? vendor.gallery[0]?.url : vendor.image;

  const handleAdminSave = async () => {
    if (!vendor.id) return;
    setIsSaving(true);
    try {
      await updateVendor(vendor.id, {
        name: editName.trim(),
        image: editImage.trim() || "/placeholder.png",
        description: editDescription.trim(),
        shortDescription: editDescription.trim().slice(0, 140),
        price: editPrice.trim() === "" ? null : Number(editPrice),
        featured: editFeatured,
      });
      setIsEditOpen(false);
      router.refresh();
    } catch (error: any) {
      console.error("Admin vendor update failed:", error);
      const code = error?.code ? ` (${error.code})` : "";
      const msg = error?.message ? `\n${error.message}` : "";
      alert(`Failed to update vendor${code}.${msg}`);
      toast.error(`Failed to update vendor${code}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditFileUpload = async (file?: File) => {
    if (!file) return;
    setIsUploading(true);
    try {
      if (!user) {
        toast.error("You must be signed in to upload images");
        return;
      }
      const url = await uploadImage(file, `vendors/${Date.now()}-${file.name}`);
      setEditImage(url);
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      console.error("Admin vendor image upload failed:", error);
      toast.error(error?.code ? `Upload failed (${error.code})` : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Header / Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-bold"
        >
          <ChevronLeft size={16} />
          Back
        </button>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => setIsEditOpen(true)}
              className="p-2 rounded-full bg-card border border-border hover:bg-accent text-muted-foreground transition-all"
              aria-label="Edit vendor"
            >
              <Pencil size={18} />
            </button>
          )}
          <button className="p-2 rounded-full bg-card border border-border hover:bg-accent text-muted-foreground transition-all">
            <Share2 size={18} />
          </button>
          <button className="p-2 rounded-full bg-card border border-border hover:bg-accent text-muted-foreground transition-all">
            <Heart size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Gallery / Cover Image */}
          {hasGallery ? (
            <div className="grid grid-cols-3 gap-3">
              {vendor.gallery.slice(0, 3).map((img, idx) => (
                <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-border hover:scale-105 transition-transform cursor-pointer">
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="aspect-[16/7] rounded-lg overflow-hidden border border-border bg-muted">
              <img
                src={heroImage || '/placeholder.png'}
                alt={vendor.name}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
              />
            </div>
          )}

          {/* Identity & Stats Combined */}
          <div className="bg-card p-6 rounded-lg border border-border space-y-4">
            <div className="flex flex-wrap gap-2">
              {vendor.categories.map(cat => (
                <span key={cat} className="px-3 py-1 bg-secondary text-foreground rounded-full text-xs font-bold">{cat}</span>
              ))}
              <span className="px-3 py-1 bg-secondary text-foreground rounded-full text-xs font-bold">Est. {vendor.yearEstablished}</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">{vendor.name}</h1>
            <div className="flex items-center gap-4 pb-4 border-b border-border">
              <div className="flex items-center gap-1 text-foreground font-medium text-sm">
                <Star size={16} className="fill-primary text-primary" />
                {vendor.rating} <span className="text-muted-foreground font-medium ml-1">/ 5.0</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground font-medium text-sm">
                <MapPin size={16} className="text-accent" />
                {vendor.location}
              </div>
            </div>

            {/* Inline Stats */}
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center space-y-1">
                <p className="text-lg font-bold text-foreground">{vendor.stats.eventsPlanned}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Events</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-lg font-bold text-foreground">{vendor.stats.satisfiedClients}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Clients</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-lg font-bold text-foreground">{vendor.stats.yearsExperience}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Experience</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-lg font-bold text-foreground">{vendor.stats.uniqueLocations}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Locations</p>
              </div>
            </div>
          </div>

          {/* About & Package Combined */}
          <div className="bg-card p-6 rounded-lg border border-border space-y-4">
            <h3 className="text-lg font-bold text-foreground">About & Services</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">{vendor.description}</p>

            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <ShieldCheck size={16} className="text-green-600" />
                What's Included
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {vendor.whatsIncluded.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-foreground text-sm">
                    <CheckCircle2 size={12} className="text-green-500 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Portfolio Section - 3 Columns */}
          {vendor.portfolio && vendor.portfolio.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Zap size={18} className="text-accent" />
                Recent Work
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {vendor.portfolio.slice(0, 6).map(item => (
                  <div key={item.id} className="group bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all">
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                      />
                      <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
                        {item.type === 'Video' ? <Video size={10} /> : <ImageIcon size={10} />}
                        {item.type}
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-xs font-bold text-foreground truncate">{item.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Sticky - More Compact */}
        <div className="space-y-4">
          <div className="sticky top-20 bg-card p-5 rounded-lg border border-border space-y-4">
            <div>
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">Starting Price</p>
              <p className="text-xl font-black text-foreground">{vendor.price || 'By Request'}</p>
            </div>

            <div className="space-y-2 pt-3 border-t border-border">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Response</span>
                <span className="font-bold flex items-center gap-1"><Zap size={12} className="text-primary" /> {vendor.responseTime}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Serves</span>
                <span className="font-bold text-right">{vendor.areaServed[0]}</span>
              </div>
            </div>

            <div className="space-y-2 pt-3">
              <button
                onClick={() => toggleSavedVendor(vendor.id)}
                className={`w-full py-2.5 rounded-lg font-bold text-sm shadow-sm hover:shadow-md transition-all ${savedVendorIds.has(vendor.id)
                  ? 'bg-foreground text-background hover:bg-foreground/90'
                  : 'bg-primary hover:bg-primary/90 text-white'
                  }`}
              >
                {savedVendorIds.has(vendor.id) ? 'Saved' : 'Save Vendor'}
              </button>
              <Link
                href={`/dashboard/hosts/inbox?vendorId=${vendor.id}`}
                className="w-full bg-card hover:bg-accent text-foreground py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all border border-border"
              >
                <MessageSquare size={14} />
                Contact Vendor
              </Link>
            </div>

            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck size={12} className="text-green-600" />
                Verified Partner
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Vendor</DialogTitle>
            <DialogDescription>
              Update basic vendor details.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Name</label>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Vendor name"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Photo URL</label>
              <div
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const file = e.dataTransfer.files?.[0];
                  await handleEditFileUpload(file);
                }}
                onClick={() => document.getElementById("adminEditFileInput")?.click()}
                className="relative border-2 border-dashed border-border rounded-xl p-4 bg-secondary/20 hover:bg-secondary/30 transition-colors cursor-pointer"
              >
                <input
                  id="adminEditFileInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    await handleEditFileUpload(file);
                  }}
                />
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Upload size={16} />
                  {isUploading ? "Uploading..." : "Drag & drop image or click to upload"}
                </div>
              </div>
              <input
                value={editImage}
                onChange={(e) => setEditImage(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Description</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Vendor description"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Price</label>
              <input
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                type="number"
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Leave empty for By Request"
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <input
                id="vendor-featured-toggle"
                type="checkbox"
                checked={editFeatured}
                onChange={(e) => setEditFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              <label htmlFor="vendor-featured-toggle" className="text-sm font-semibold text-foreground">
                Featured vendor
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleAdminSave} disabled={isSaving || !editName.trim()}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorDetail;
