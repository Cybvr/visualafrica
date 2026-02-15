"use client";

import React, { useState } from 'react';
import { Clock, MapPin, X, Printer, Share2, Plus, Trash2, Pencil } from 'lucide-react';

interface ItineraryEvent {
    id: string;
    time: string;
    title: string;
    loc: string;
    type: string;
}

interface ItineraryDay {
    id: string;
    date: string;
    events: ItineraryEvent[];
}

const INITIAL_ITINERARY: ItineraryDay[] = [
    {
        id: 'day-1',
        date: 'Thursday, May 29',
        events: [
            { id: 'evt-1', time: '10:00 AM', title: 'Arrival at Hotel Kabuki', loc: 'Lekki', type: 'Check-in' },
            { id: 'evt-2', time: '07:00 PM', title: 'Welcome Dinner', loc: 'The Terrace', type: 'Dining' }
        ]
    },
    {
        id: 'day-2',
        date: 'Friday, May 30',
        events: [
            { id: 'evt-3', time: '09:00 AM', title: 'Strategy Workshop', loc: 'Main Hall', type: 'Meeting' },
            { id: 'evt-4', time: '02:00 PM', title: 'Yacht Cruise Departure', loc: 'Lagos Jetty', type: 'Experience' }
        ]
    }
];

interface EditModalProps {
    event: ItineraryEvent | null;
    dayDate: string;
    onClose: () => void;
    onSave: (updated: ItineraryEvent) => void;
}

const EditModal: React.FC<EditModalProps> = ({ event, dayDate, onClose, onSave }) => {
    const [formData, setFormData] = useState(event || { id: '', time: '12:00 PM', title: '', loc: '', type: 'Event' });

    if (!event) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-3xl max-w-md w-full p-8" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-foreground">Edit Event</h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-muted-foreground">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Event Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Time</label>
                        <input
                            type="time"
                            value={formData.time}
                            onChange={e => setFormData({ ...formData, time: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Location</label>
                        <input
                            type="text"
                            value={formData.loc}
                            onChange={e => setFormData({ ...formData, loc: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-full border border-border text-foreground font-semibold hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

interface DayEditModalProps {
    day: ItineraryDay | null;
    onClose: () => void;
    onSave: (date: string) => void;
}

const DayEditModal: React.FC<DayEditModalProps> = ({ day, onClose, onSave }) => {
    const [date, setDate] = useState(day?.date || '');

    if (!day) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(date);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-3xl max-w-md w-full p-8" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-foreground">Edit Date</h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-muted-foreground">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Date</label>
                        <input
                            type="text"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            placeholder="Thursday, May 29"
                            className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-full border border-border text-foreground font-semibold hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ItineraryTab: React.FC = () => {
    const [days, setDays] = useState(INITIAL_ITINERARY);
    const [editingEvent, setEditingEvent] = useState<{ dayId: string; event: ItineraryEvent } | null>(null);
    const [editingDay, setEditingDay] = useState<ItineraryDay | null>(null);

    const handlePrint = () => {
        window.print();
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Event Itinerary',
                    text: 'Check out this event schedule',
                    url: window.location.href
                });
            } catch (err) {
                console.log('Share cancelled');
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const handleDeleteEvent = (dayId: string, eventId: string) => {
        setDays(prev => {
            const updated = prev.map(day => {
                if (day.id === dayId) {
                    return { ...day, events: day.events.filter(e => e.id !== eventId) };
                }
                return day;
            }).filter(day => day.events.length > 0);
            return updated;
        });
    };

    const handleAddEvent = (dayId: string) => {
        const newEvent: ItineraryEvent = {
            id: `evt-${Date.now()}`,
            time: '12:00 PM',
            title: 'New Event',
            loc: 'Location',
            type: 'Event'
        };
        setDays(prev => prev.map(day =>
            day.id === dayId ? { ...day, events: [...day.events, newEvent] } : day
        ));
    };

    const handleAddDay = () => {
        const newDay: ItineraryDay = {
            id: `day-${Date.now()}`,
            date: 'New Day',
            events: []
        };
        setDays(prev => [...prev, newDay]);
    };

    const handleSaveEvent = (dayId: string, updated: ItineraryEvent) => {
        setDays(prev => prev.map(day => {
            if (day.id === dayId) {
                return {
                    ...day,
                    events: day.events.map(evt => evt.id === updated.id ? updated : evt)
                };
            }
            return day;
        }));
        setEditingEvent(null);
    };

    const handleSaveDay = (dayId: string, newDate: string) => {
        setDays(prev => prev.map(day =>
            day.id === dayId ? { ...day, date: newDate } : day
        ));
        setEditingDay(null);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Full Itinerary</h2>
                <div className="flex gap-3">
                    <button
                        onClick={handleShare}
                        className="bg-card border border-border text-foreground px-6 py-2 rounded-full text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                        <Share2 size={16} />
                        Share
                    </button>
                    <button
                        onClick={handlePrint}
                        className="bg-primary text-foreground px-6 py-2 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                        <Printer size={16} />
                        Print
                    </button>
                </div>
            </div>

            <div className="space-y-12">
                {days.map((day) => (
                    <div key={day.id} className="relative pl-8 md:pl-0">
                        <div className="md:grid md:grid-cols-[160px_1fr] gap-8">
                            <div className="mb-6 md:mb-0 group">
                                <div className="flex items-center gap-2 md:justify-end">
                                    <h3 className="text-foreground font-black text-xl md:text-right sticky top-24">{day.date}</h3>
                                    <button
                                        onClick={() => setEditingDay(day)}
                                        className="opacity-0 group-hover:opacity-100 text-foreground hover:text-foreground transition-opacity"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-6 border-l-2 border-border pl-8 relative pb-8">
                                {day.events.map(event => (
                                    <div key={event.id} className="relative group">
                                        <div className="absolute left-[-41px] top-1 w-5 h-5 bg-white border-4 border-primary rounded-full z-10" />
                                        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between">
                                                <div className="flex gap-6 items-center flex-1">
                                                    <div className="bg-slate-50 p-3 rounded-2xl text-muted-foreground font-bold text-xs uppercase flex flex-col items-center min-w-[70px]">
                                                        <Clock size={16} className="mb-1" />
                                                        {event.time}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-foreground text-lg">{event.title}</h4>
                                                        <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1">
                                                            <MapPin size={14} />
                                                            {event.loc}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setEditingEvent({ dayId: day.id, event })}
                                                        className="p-2 text-slate-300 hover:text-foreground transition-colors"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteEvent(day.id, event.id)}
                                                        className="p-2 text-slate-300 hover:text-red-600 transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={() => handleAddEvent(day.id)}
                                    className="w-full p-4 border-2 border-dashed border-border rounded-3xl text-muted-foreground hover:text-foreground hover:border-primary transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
                                >
                                    <Plus size={18} />
                                    Add Event
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    onClick={handleAddDay}
                    className="w-full p-6 border-2 border-dashed border-border rounded-3xl text-muted-foreground hover:text-foreground hover:border-primary transition-colors flex items-center justify-center gap-2 font-semibold"
                >
                    <Plus size={20} />
                    Add Day
                </button>
            </div>

            {editingEvent && (
                <EditModal
                    event={editingEvent.event}
                    dayDate={days.find(d => d.id === editingEvent.dayId)?.date || ''}
                    onClose={() => setEditingEvent(null)}
                    onSave={(updated) => handleSaveEvent(editingEvent.dayId, updated)}
                />
            )}

            {editingDay && (
                <DayEditModal
                    day={editingDay}
                    onClose={() => setEditingDay(null)}
                    onSave={(newDate) => handleSaveDay(editingDay.id, newDate)}
                />
            )}
        </div>
    );
};

export default ItineraryTab;
