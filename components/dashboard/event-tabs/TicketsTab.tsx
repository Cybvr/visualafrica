"use client";

import * as React from 'react';
import { Ticket, Plus, Trash2, Save, MoreHorizontal } from 'lucide-react';
import { SharedEvent } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { updateEvent } from '@/lib/firestore-service';
import { toast } from 'sonner';

interface TicketsTabProps {
    event: SharedEvent;
}

const TicketsTab: React.FC<TicketsTabProps> = ({ event }) => {
    const [ticketPrice, setTicketPrice] = React.useState(String(event.ticketPrice || ''));
    const [tickets, setTickets] = React.useState(event.tickets || []);
    const [isSaving, setIsSaving] = React.useState(false);
    const [editingTierId, setEditingTierId] = React.useState<string | null>(null);
    const [editValues, setEditValues] = React.useState<{ name: string; price: string; quantity: string }>({ name: '', price: '', quantity: '' });

    React.useEffect(() => {
        setTicketPrice(String(event.ticketPrice || ''));
        setTickets(event.tickets || []);
    }, [event]);

    const handleSaveBasePrice = async () => {
        if (!event.id) return;
        setIsSaving(true);
        try {
            await updateEvent(event.id, {
                ticketPrice: Number(ticketPrice) || 0
            });
            toast.success('Default price updated');
        } catch (error) {
            console.error('Failed to update ticketPrice:', error);
            toast.error('Failed to save changes');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddTier = async () => {
        if (!event.id) return;
        const newTierId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const newTier = {
            id: newTierId,
            name: "New Tier",
            price: Number(ticketPrice) || 0,
            quantity: 100
        };
        const nextTickets = [...tickets, newTier];
        setTickets(nextTickets);
        try {
            await updateEvent(event.id, { tickets: nextTickets });
            setEditingTierId(newTierId);
            setEditValues({ name: newTier.name, price: String(newTier.price), quantity: String(newTier.quantity) });
            toast.success('New ticket tier added');
        } catch (error) {
            console.error('Failed to add tier:', error);
            toast.error('Failed to add tier');
        }
    };

    const handleStartEdit = (tier: any) => {
        setEditingTierId(tier.id);
        setEditValues({ name: tier.name, price: String(tier.price), quantity: String(tier.quantity) });
    };

    const handleCancelEdit = () => {
        setEditingTierId(null);
    };

    const handleSaveEdit = async (id: string) => {
        if (!event.id) return;
        const nextTickets = tickets.map(t => t.id === id ? {
            ...t,
            name: editValues.name,
            price: Number(editValues.price) || 0,
            quantity: Number(editValues.quantity) || 0
        } : t);

        setTickets(nextTickets);
        try {
            await updateEvent(event.id, { tickets: nextTickets });
            setEditingTierId(null);
            toast.success('Tier updated');
        } catch (error) {
            console.error('Failed to update tier:', error);
            toast.error('Failed to update tier');
        }
    };

    const handleRemoveTier = async (id: string) => {
        if (!event.id) return;
        const nextTickets = tickets.filter(t => t.id !== id);
        setTickets(nextTickets);
        try {
            await updateEvent(event.id, { tickets: nextTickets });
            toast.success('Tier removed');
        } catch (error) {
            console.error('Failed to remove tier:', error);
            toast.error('Failed to remove tier');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pt-2">
            {/* Quick Price Config */}
            <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-border/50 pb-2 gap-3">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-tight">Main Event Access</h3>
                    <span className="text-[10px] text-muted-foreground font-medium bg-secondary px-2 py-0.5 rounded-full uppercase tracking-widest">Global Default</span>
                </div>

                <div className="bg-card border border-border rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center gap-4 justify-between shadow-sm">
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-foreground">Base Attendance Fee</p>
                        <p className="text-xs text-muted-foreground">The default price shown on your public event page</p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-32">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm">₦</span>
                            <Input
                                type="number"
                                value={ticketPrice}
                                onChange={(e) => setTicketPrice(e.target.value)}
                                className="pl-7 h-9 bg-secondary/20 border-border text-sm font-semibold"
                                placeholder="0"
                            />
                        </div>
                        <Button
                            size="sm"
                            onClick={handleSaveBasePrice}
                            disabled={isSaving}
                            className="h-9 gap-2 font-bold px-4"
                        >
                            <Save size={14} />
                            Save
                        </Button>
                    </div>
                </div>
            </section>

            {/* Ticket Tiers Table */}
            <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-border/50 pb-2 gap-3">
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-tight">Ticketing Tiers</h3>
                    <Button variant="ghost" size="sm" onClick={handleAddTier} className="text-primary font-bold h-8 gap-1 hover:bg-primary/5">
                        <Plus size={16} />
                        New Tier
                    </Button>
                </div>

                <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-secondary/50">
                            <TableRow className="hover:bg-transparent border-border">
                                <TableHead className="h-10 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Tier Name</TableHead>
                                <TableHead className="h-10 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider w-32">Price (₦)</TableHead>
                                <TableHead className="h-10 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider w-24">Stock</TableHead>
                                <TableHead className="h-10 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider w-24 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tickets.length > 0 ? tickets.map((tier) => (
                                <TableRow key={tier.id} className="border-border group transition-colors">
                                    {editingTierId === tier.id ? (
                                        <>
                                            <TableCell className="px-4 py-2">
                                                <Input
                                                    value={editValues.name}
                                                    onChange={e => setEditValues({ ...editValues, name: e.target.value })}
                                                    className="h-8 text-sm"
                                                />
                                            </TableCell>
                                            <TableCell className="px-4 py-2">
                                                <Input
                                                    type="number"
                                                    value={editValues.price}
                                                    onChange={e => setEditValues({ ...editValues, price: e.target.value })}
                                                    className="h-8 text-sm"
                                                />
                                            </TableCell>
                                            <TableCell className="px-4 py-2">
                                                <Input
                                                    type="number"
                                                    value={editValues.quantity}
                                                    onChange={e => setEditValues({ ...editValues, quantity: e.target.value })}
                                                    className="h-8 text-sm"
                                                />
                                            </TableCell>
                                            <TableCell className="px-4 py-2 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="h-8 px-2 text-muted-foreground">Cancel</Button>
                                                    <Button size="sm" onClick={() => handleSaveEdit(tier.id)} className="h-8 px-3 font-bold">Save</Button>
                                                </div>
                                            </TableCell>
                                        </>
                                    ) : (
                                        <>
                                            <TableCell className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5 text-primary border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
                                                        <Ticket size={14} />
                                                    </div>
                                                    <p className="text-sm font-semibold text-foreground">{tier.name}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-sm font-bold text-foreground">
                                                ₦{(Number(tier.price) || 0).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-sm text-muted-foreground font-medium">
                                                {tier.quantity}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleStartEdit(tier)}
                                                        className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                                                    >
                                                        <Save size={14} className="rotate-0 transition-transform" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRemoveTier(tier.id)}
                                                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </>
                                    )}
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="px-4 py-12 text-center text-muted-foreground border-none">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center">
                                                <Ticket size={24} className="opacity-20" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-bold text-foreground">No ticket tiers yet</p>
                                                <p className="text-xs max-w-[240px] mx-auto">Tiers you add through Yinka chat or the "New Tier" button will appear here.</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </section>
        </div>
    );
};

export default TicketsTab;
