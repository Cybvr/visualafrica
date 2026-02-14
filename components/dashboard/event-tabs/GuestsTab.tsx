"use client";

import React from 'react';
import { Globe, Users, Mail, Plus, ExternalLink } from 'lucide-react';

const GuestsTab: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Guest Portal</h2>
                <button className="bg-orange-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Plus size={16} />
                    Add Guest
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card rounded-3xl border border-border p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-foreground">Registration List</h3>
                            <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
                                <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-green-500 rounded-full" /> 12 Going</span>
                                <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-amber-500 rounded-full" /> 48 Pending</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {['Abigail Okafor', 'Bode Thomas', 'Chiamaka Adeleke', 'David Wright'].map((name, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-white border border-transparent hover:border-slate-100 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-orange-100 text-orange-600 font-bold flex items-center justify-center rounded-full">
                                            {name[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{name}</p>
                                            <p className="text-xs text-slate-500 uppercase font-bold tracking-tight">Main Guest</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${i % 2 === 0 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {i % 2 === 0 ? 'Confirmed' : 'Pending'}
                                        </span>
                                        <button className="p-2 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"><Mail size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-3 border border-border text-slate-500 font-bold text-sm rounded-2xl hover:bg-slate-50 transition-colors">
                            Load more guests
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-6 shadow-xl shadow-slate-900/20">
                        <div className="flex items-center justify-between">
                            <Globe className="text-orange-500" size={32} />
                            <div className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-bold uppercase rounded border border-green-500/30">Live</div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">RSVP Website</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">Your custom guest portal is live at:<br /><span className="text-orange-400 font-medium">visualafrica.events/may-offsite</span></p>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex-1 bg-white text-slate-900 py-3 rounded-xl font-bold text-sm hover:bg-slate-100">Edit Site</button>
                            <button className="p-3 bg-slate-800 rounded-xl hover:bg-slate-700"><ExternalLink size={20} /></button>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-3xl p-8 space-y-6">
                        <h3 className="font-bold text-foreground text-lg">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all border border-slate-50 group">
                                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all"><Mail size={20} /></div>
                                <div className="text-left">
                                    <p className="font-bold text-sm text-foreground">Send Email Invite</p>
                                    <p className="text-xs text-slate-400">Remind pending guests</p>
                                </div>
                            </button>
                            <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all border border-slate-50 group">
                                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all"><Users size={20} /></div>
                                <div className="text-left">
                                    <p className="font-bold text-sm text-foreground">Export List</p>
                                    <p className="text-xs text-slate-400">Download CSV/PDF</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuestsTab;
