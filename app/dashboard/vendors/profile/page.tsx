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

    // Business Profile State (moved from settings)
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
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {label}
            </Label>
            {children}
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            {/* Business Profile Section */}
            <section className="bg-card border border-border rounded-[3rem] p-10 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-10">
                    <div>
                        <h2 className="text-3xl font-serif font-black tracking-tight text-foreground mb-2">My Profile</h2>
                        <p className="text-sm text-muted-foreground font-medium">Manage your business information and how clients see you.</p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-8 pb-10 border-b border-border/50">
                        <div className="relative group shrink-0">
                            <div className="w-40 h-40 bg-slate-100 rounded-[2.5rem] overflow-hidden">
                                <img
                                    src={businessProfile.logo}
                                    alt="business logo"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                    <Briefcase className="text-white" size={24} />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4 flex-1">
                            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Branding</h5>
                            <div className="flex gap-3">
                                <button className="px-6 py-2.5 bg-primary text-white text-xs font-black rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                                    Update Logo
                                </button>
                                <button className="px-6 py-2.5 bg-card border border-border text-muted-foreground text-xs font-black rounded-full hover:bg-slate-50 transition-all">
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <FormField label="Business Name">
                                <Input
                                    value={businessProfile.name}
                                    onChange={(e) => setBusinessProfile({ ...businessProfile, name: e.target.value })}
                                    className="px-6 py-4 rounded-2xl text-sm font-bold bg-slate-50/50"
                                />
                            </FormField>
                            <FormField label="Location">
                                <div className="relative">
                                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <Input
                                        value={businessProfile.location}
                                        onChange={(e) => setBusinessProfile({ ...businessProfile, location: e.target.value })}
                                        className="pl-14 pr-6 py-4 rounded-2xl text-sm font-bold bg-slate-50/50"
                                    />
                                </div>
                            </FormField>
                        </div>

                        <FormField label="Business Description">
                            <Textarea
                                rows={4}
                                value={businessProfile.description}
                                onChange={(e) => setBusinessProfile({ ...businessProfile, description: e.target.value })}
                                className="px-6 py-4 rounded-2xl text-sm font-bold resize-none bg-slate-50/50"
                            />
                        </FormField>

                        <div className="flex justify-end pt-4">
                            <button className="flex items-center gap-2 px-12 py-5 bg-primary text-white rounded-[2rem] text-sm font-black hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:scale-105 active:scale-95">
                                <Save size={20} />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Portfolio Section */}
            <section className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-serif font-black tracking-tight text-foreground">Portfolio Items</h2>
                        <p className="text-muted-foreground mt-1 text-sm font-medium">Showcase your best work to potential clients.</p>
                    </div>
                    {!currentItem && (
                        <button
                            onClick={() => handleOpenForm()}
                            className="bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-[2rem] font-black flex items-center gap-2 transition-all shadow-lg shadow-primary/20 hover:scale-105"
                        >
                            <Plus size={18} />
                            Add Item
                        </button>
                    )}
                </div>

                {/* Flat Form for New/Edit */}
                {currentItem && (
                    <div className="bg-card border border-border rounded-[3rem] p-10 space-y-8 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-serif font-black text-foreground">
                                {currentItem.id ? 'Edit Portfolio Item' : 'New Portfolio Item'}
                            </h3>
                        </div>

                        <div
                            className={`relative border-2 border-dashed rounded-[2rem] p-12 transition-all ${dragActive ? 'border-primary bg-primary/5' : 'border-border bg-slate-50/50'
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            {currentItem.image ? (
                                <div className="relative">
                                    <img src={currentItem.image} alt="Preview" className="w-full h-64 object-cover rounded-2xl" />
                                    <button
                                        onClick={() => setCurrentItem({ ...currentItem, image: '' })}
                                        className="absolute top-4 right-4 p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors shadow-lg"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <Upload className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                                    <p className="text-lg font-bold text-foreground mb-1">Drop image or video here</p>
                                    <p className="text-sm text-muted-foreground mb-6">or click to browse your files</p>
                                    <label className="inline-block px-8 py-3 bg-white border border-border hover:bg-slate-50 rounded-[2rem] font-black text-sm cursor-pointer transition-all shadow-sm">
                                        Browse Files
                                        <input type="file" accept="image/*,video/*" onChange={handleFileInput} className="hidden" />
                                    </label>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Project Title</label>
                                <input
                                    type="text"
                                    value={currentItem.title || ''}
                                    onChange={e => setCurrentItem({ ...currentItem, title: e.target.value })}
                                    className="w-full px-6 py-4 bg-slate-50 border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-bold"
                                    placeholder="e.g. Waterfront Wedding Gala"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Date</label>
                                <input
                                    type="text"
                                    value={currentItem.date || ''}
                                    onChange={e => setCurrentItem({ ...currentItem, date: e.target.value })}
                                    className="w-full px-6 py-4 bg-slate-50 border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-bold"
                                    placeholder="Jan 2026"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Content Type</label>
                            <select
                                value={currentItem.type}
                                onChange={e => setCurrentItem({ ...currentItem, type: e.target.value as any })}
                                className="w-full px-6 py-4 bg-slate-50 border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-bold"
                            >
                                <option value="Gallery">Image Gallery</option>
                                <option value="Video">Video Project</option>
                            </select>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={handleSave}
                                disabled={!currentItem.title || !currentItem.image}
                                className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-slate-200 disabled:text-slate-400 text-white py-5 rounded-[2rem] font-black transition-all shadow-xl shadow-primary/20 hover:scale-[1.02]"
                            >
                                {currentItem.id ? 'Save Changes' : 'Create Item'}
                            </button>
                            <button
                                onClick={() => setCurrentItem(null)}
                                className="px-12 py-5 bg-slate-100 hover:bg-slate-200 rounded-[2rem] font-black transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Portfolio Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map(item => (
                        <div key={item.id} className="group bg-card rounded-[3rem] border border-border shadow-sm overflow-hidden hover:shadow-2xl transition-all duration-500">
                            <div className="aspect-[4/3] relative overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                                />
                                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 border border-white/10">
                                    {item.type === 'Video' ? <Video size={12} /> : <ImageIcon size={12} />}
                                    {item.type}
                                </div>
                                <div className="absolute top-4 right-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="p-2 bg-card/90 backdrop-blur-md rounded-xl shadow-lg text-foreground hover:bg-primary hover:text-white transition-all">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[140px] border-border">
                                            <DropdownMenuItem onClick={() => handleOpenForm(item)} className="rounded-xl flex items-center gap-2 font-bold cursor-pointer py-3">
                                                <Pencil size={14} className="text-primary" /> Edit Item
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(item.id)} className="rounded-xl flex items-center gap-2 text-red-600 font-bold focus:text-red-600 focus:bg-red-50 cursor-pointer py-3">
                                                <Trash2 size={14} /> Delete Item
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">{item.date}</div>
                                <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors">{item.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}