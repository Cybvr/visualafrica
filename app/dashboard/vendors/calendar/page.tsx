"use client";

import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { VENDOR_DASHBOARD_DATA } from '@/lib/vendor-dashboard-data';

export default function VendorCalendarPage() {
    const { calendarEvents } = VENDOR_DASHBOARD_DATA;
    const days = Array.from({ length: 35 }, (_, i) => i - 3); // Mock days layout

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900">Calendar</h2>
                    <p className="text-slate-500 mt-1">Manage your availability and bookings.</p>
                </div>
                <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-black flex items-center gap-2 transition-colors">
                    <Plus size={18} />
                    Block Dates
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-8">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black text-slate-900">February 2026</h3>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-slate-50 rounded-lg border border-slate-100 transition-colors"><ChevronLeft size={20} /></button>
                        <button className="p-2 hover:bg-slate-50 rounded-lg border border-slate-100 transition-colors"><ChevronRight size={20} /></button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-px bg-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="bg-slate-50 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {day}
                        </div>
                    ))}
                    {days.map((day, i) => (
                        <div key={i} className={`bg-white min-h-[120px] p-4 relative ${day <= 0 ? 'bg-slate-50/50' : ''}`}>
                            <span className={`text-sm font-bold ${day <= 0 ? 'text-slate-300' : 'text-slate-900'} ${day === 14 ? 'w-7 h-7 bg-primary text-white flex items-center justify-center rounded-full -ml-1.5 -mt-1.5' : ''}`}>
                                {day > 0 && day <= 28 ? day : ''}
                            </span>
                            {day > 0 && calendarEvents[day as keyof typeof calendarEvents] && (
                                <div className="mt-2 p-2 bg-orange-50 border border-orange-100 rounded-lg">
                                    <div className="text-[10px] font-black text-orange-600 uppercase mb-0.5">{calendarEvents[day as keyof typeof calendarEvents].type}</div>
                                    <div className="text-[11px] font-bold text-slate-900 leading-tight">{calendarEvents[day as keyof typeof calendarEvents].title}</div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
