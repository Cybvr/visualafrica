"use client";

import React from 'react';
import { Plus, Video, Image as ImageIcon, MoreHorizontal, Pencil, Trash2, Upload, Briefcase, MapPin, Save } from 'lucide-react';
import { VENDOR_DASHBOARD_DATA, PortfolioItem } from '@/lib/vendor-dashboard-data';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function VendorProfilePage() {
    const [items, setItems] = React.useState<PortfolioItem[]>(VENDOR_DASHBOARD_DATA.portfolioItems);
    const [currentItem, setCurrentItem] = React.useState<Partial<PortfolioItem> | null>(null);
    const [dragActive, setDragActive] = React.useState(false);

    const [businessProfile, setBusinessProfile] = React.useState({
        name: "Eko Catamaran Charters",
        location: "Victoria Island, Lagos",
        description: "Premium maritime experience provider on Lagos waters. We specialize in luxury catamaran cruises for proposals, birthdays, and corporate events.",
        logo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=300"
    });

    const handleOpenForm = (item?: PortfolioItem) => {
        if (item) {
            setCurrentItem(item);
        } else {
            setCurrentItem({ type: 'Gallery', date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) });
        }
    };

    const handleSave = () => {
        if (!currentItem?.title || !currentItem?.image) return;

        if (currentItem.id) {
            setItems(items.map(i => i.id === currentItem.id ? (currentItem as PortfolioItem) : i));
        } else {
            const newItem = { ...currentItem, id: `p-${Date.now()}` } as PortfolioItem;
            setItems([newItem, ...items]);
        }
        setCurrentItem(null);
    };

    const handleDelete = (id: string) => {
        setItems(items.filter(i => i.id !== id));
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const url = event.target?.result as string;
                    setCurrentItem({
                        ...currentItem,
                        type: file.type.startsWith('video/') ? 'Video' : 'Gallery',
                        image: url,
                        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                    });
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                setCurrentItem({
                    ...currentItem,
                    image: event.target?.result as string,
                    type: file.type.startsWith('video/') ? 'Video' : 'Gallery'
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
        <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">
                {label}
            </Label>
            {children}
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-16">
            {/* Business Profile Section */}
            <section className="bg-card border border-border rounded p-6">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-semibold text-foreground mb-1">Business Profile</h2>
                        <p className="text-sm text-muted-foreground">Manage your business information and how clients see you.</p>
                    </div>

                    <div className="flex flex-col md:flex-row items-start gap-6 pb-6 border-b border-border">
                        <div className="relative group shrink-0">
                            <div className="w-24 h-24 bg-secondary rounded overflow-hidden">
                                <img
                                    src={businessProfile.logo}
                                    alt="business logo"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                    <Briefcase className="text-foreground" size={20} />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3 flex-1">
                            <p className="text-xs text-muted-foreground font-medium">Business Logo</p>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded hover:bg-primary/90 transition-colors">
                                    Update Logo
                                </button>
                                <button className="px-4 py-2 bg-card border border-border text-foreground text-sm font-medium rounded hover:bg-secondary transition-colors">
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField label="Business Name">
                                <Input
                                    value={businessProfile.name}
                                    onChange={(e) => setBusinessProfile({ ...businessProfile, name: e.target.value })}
                                    className="text-sm"
                                />
                            </FormField>
                            <FormField label="Location">
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                    <Input
                                        value={businessProfile.location}
                                        onChange={(e) => setBusinessProfile({ ...businessProfile, location: e.target.value })}
                                        className="pl-10 text-sm"
                                    />
                                </div>
                            </FormField>
                        </div>

                        <FormField label="Business Description">
                            <Textarea
                                rows={4}
                                value={businessProfile.description}
                                onChange={(e) => setBusinessProfile({ ...businessProfile, description: e.target.value })}
                                className="text-sm resize-none"
                            />
                        </FormField>

                        <div className="flex justify-end pt-4">
                            <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 transition-colors">
                                <Save size={16} />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Portfolio Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-foreground">Portfolio</h2>
                        <p className="text-muted-foreground mt-1 text-sm">Showcase your best work to potential clients.</p>
                    </div>
                    {!currentItem && (
                        <button
                            onClick={() => handleOpenForm()}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded font-medium flex items-center gap-2 transition-colors text-sm"
                        >
                            <Plus size={16} />
                            Add Item
                        </button>
                    )}
                </div>

                {/* Form for New/Edit */}
                {currentItem && (
                    <div className="bg-card border border-border rounded p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-foreground">
                                {currentItem.id ? 'Edit Portfolio Item' : 'New Portfolio Item'}
                            </h3>
                        </div>

                        <div
                            className={`relative border-2 border-dashed rounded p-8 transition-colors ${dragActive ? 'border-primary bg-secondary' : 'border-border bg-secondary'
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            {currentItem.image ? (
                                <div className="relative">
                                    <img src={currentItem.image} alt="Preview" className="w-full h-48 object-cover rounded" />
                                    <button
                                        onClick={() => setCurrentItem({ ...currentItem, image: '' })}
                                        className="absolute top-2 right-2 p-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                                    <p className="text-sm font-medium text-foreground mb-1">Drop image or video here</p>
                                    <p className="text-xs text-muted-foreground mb-4">or click to browse your files</p>
                                    <label className="inline-block px-4 py-2 bg-card border border-border hover:bg-secondary rounded font-medium text-sm cursor-pointer transition-colors">
                                        Browse Files
                                        <input type="file" accept="image/*,video/*" onChange={handleFileInput} className="hidden" />
                                    </label>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">Project Title</label>
                                <input
                                    type="text"
                                    value={currentItem.title || ''}
                                    onChange={e => setCurrentItem({ ...currentItem, title: e.target.value })}
                                    className="w-full px-3 py-2 bg-background border border-input rounded outline-none focus:ring-2 focus:ring-ring transition-all text-sm text-foreground"
                                    placeholder="e.g. Waterfront Wedding Gala"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">Date</label>
                                <input
                                    type="text"
                                    value={currentItem.date || ''}
                                    onChange={e => setCurrentItem({ ...currentItem, date: e.target.value })}
                                    className="w-full px-3 py-2 bg-background border border-input rounded outline-none focus:ring-2 focus:ring-ring transition-all text-sm text-foreground"
                                    placeholder="Jan 2026"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">Content Type</label>
                            <select
                                value={currentItem.type}
                                onChange={e => setCurrentItem({ ...currentItem, type: e.target.value as any })}
                                className="w-full px-3 py-2 bg-background border border-input rounded outline-none focus:ring-2 focus:ring-ring transition-all text-sm text-foreground"
                            >
                                <option value="Gallery">Image Gallery</option>
                                <option value="Video">Video Project</option>
                            </select>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={handleSave}
                                disabled={!currentItem.title || !currentItem.image}
                                className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground py-2.5 rounded font-medium transition-colors text-sm"
                            >
                                {currentItem.id ? 'Save Changes' : 'Create Item'}
                            </button>
                            <button
                                onClick={() => setCurrentItem(null)}
                                className="px-6 py-2.5 bg-secondary hover:bg-secondary/80 text-foreground rounded font-medium transition-colors text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Portfolio Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map(item => (
                        <div key={item.id} className="group bg-card rounded border border-border overflow-hidden hover:shadow-lg transition-all">
                            <div className="aspect-[4/3] relative overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                                />
                                <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm text-foreground text-xs font-medium px-2 py-1 rounded flex items-center gap-1.5">
                                    {item.type === 'Video' ? <Video size={12} /> : <ImageIcon size={12} />}
                                    {item.type}
                                </div>
                                <div className="absolute top-3 right-3">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="p-2 bg-card/90 backdrop-blur-sm rounded shadow text-foreground hover:bg-card transition-all">
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded p-1 min-w-[120px]">
                                            <DropdownMenuItem onClick={() => handleOpenForm(item)} className="rounded flex items-center gap-2 font-medium cursor-pointer text-sm">
                                                <Pencil size={14} /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(item.id)} className="rounded flex items-center gap-2 text-destructive font-medium focus:text-destructive focus:bg-destructive/10 cursor-pointer text-sm">
                                                <Trash2 size={14} /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="text-xs text-muted-foreground mb-1">{item.date}</div>
                                <h3 className="text-base font-semibold text-foreground leading-tight">{item.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}