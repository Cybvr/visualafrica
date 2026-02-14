import React from 'react';
import { Plus, Video, Image as ImageIcon, MoreHorizontal, Pencil, Trash2, X } from 'lucide-react';
import { VENDOR_DASHBOARD_DATA, PortfolioItem } from '@/lib/vendor-dashboard-data';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function VendorPortfolioPage() {
    const [items, setItems] = React.useState<PortfolioItem[]>(VENDOR_DASHBOARD_DATA.portfolioItems);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [currentItem, setCurrentItem] = React.useState<Partial<PortfolioItem>>({});
    const [isEditing, setIsEditing] = React.useState(false);

    const handleOpenModal = (item?: PortfolioItem) => {
        if (item) {
            setCurrentItem(item);
            setIsEditing(true);
        } else {
            setCurrentItem({ type: 'Gallery', date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) });
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (isEditing) {
            setItems(items.map(i => i.id === currentItem.id ? (currentItem as PortfolioItem) : i));
        } else {
            const newItem = { ...currentItem, id: `p-${Date.now()}` } as PortfolioItem;
            setItems([newItem, ...items]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        setItems(items.filter(i => i.id !== id));
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900">Portfolio</h2>
                    <p className="text-slate-500 mt-1">Showcase your best work to potential clients.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-black flex items-center gap-2 transition-colors"
                >
                    <Plus size={18} />
                    Add Item
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map(item => (
                    <div key={item.id} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg transition-all">
                        <div className="aspect-[4/3] relative overflow-hidden">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                            />
                            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                                {item.type === 'Video' ? <Video size={12} /> : <ImageIcon size={12} />}
                                {item.type}
                            </div>
                            <div className="absolute top-4 right-4">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="p-2 bg-white rounded-xl shadow-lg text-slate-900 hover:bg-slate-50 transition-colors">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[120px]">
                                        <DropdownMenuItem onClick={() => handleOpenModal(item)} className="rounded-xl flex items-center gap-2 font-bold cursor-pointer">
                                            <Pencil size={14} /> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDelete(item.id)} className="rounded-xl flex items-center gap-2 text-red-600 font-bold focus:text-red-600 focus:bg-red-50 cursor-pointer">
                                            <Trash2 size={14} /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.date}</div>
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">{item.title}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* CRUD Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 space-y-8 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black text-slate-900">{isEditing ? 'Edit Portfolio Item' : 'New Portfolio Item'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Title</label>
                                <input
                                    type="text"
                                    value={currentItem.title || ''}
                                    onChange={e => setCurrentItem({ ...currentItem, title: e.target.value })}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                                    placeholder="e.g. Wedding Ceremony Highlights"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</label>
                                    <select
                                        value={currentItem.type}
                                        onChange={e => setCurrentItem({ ...currentItem, type: e.target.value as any })}
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold appearance-none"
                                    >
                                        <option value="Gallery">Gallery</option>
                                        <option value="Video">Video</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</label>
                                    <input
                                        type="text"
                                        value={currentItem.date || ''}
                                        onChange={e => setCurrentItem({ ...currentItem, date: e.target.value })}
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                                        placeholder="Jan 2026"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Image URL</label>
                                <input
                                    type="text"
                                    value={currentItem.image || ''}
                                    onChange={e => setCurrentItem({ ...currentItem, image: e.target.value })}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                                    placeholder="https://images.unsplash.com/..."
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            className="w-full bg-primary hover:bg-primary/90 text-white py-5 rounded-[2rem] font-black shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                        >
                            {isEditing ? 'Save Changes' : 'Create Item'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
