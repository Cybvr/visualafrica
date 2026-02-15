"use client";

import React, { useState } from 'react';
import { Settings, User, Bell, Shield, CreditCard, HelpCircle, ChevronRight, Save } from 'lucide-react';

const HostSettingsPage = () => {
    const [activeTab, setActiveTab] = useState('Profile');

    const menuItems = [
        { icon: User, label: 'Profile' },
        { icon: Bell, label: 'Notifications' },
        { icon: Shield, label: 'Security' },
        { icon: CreditCard, label: 'Billing' },
        { icon: HelpCircle, label: 'Support' },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20">
            <div>
                <h2 className="text-4xl font-serif font-black tracking-tight text-foreground">Settings</h2>
                <p className="text-muted-foreground font-medium mt-1">Manage your account preferences and dashboard configurations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="md:col-span-1">
                    <nav className="space-y-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => setActiveTab(item.label)}
                                className={`w-full flex items-center justify-between px-5 py-4 text-sm font-black rounded-2xl transition-all ${activeTab === item.label
                                    ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]'
                                    : 'text-muted-foreground hover:bg-card hover:text-foreground'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon size={20} />
                                    {item.label}
                                </div>
                                {activeTab === item.label && <ChevronRight size={16} />}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="md:col-span-3">
                    <div className="bg-card border border-border rounded-[3rem] p-10 shadow-sm min-h-[500px] animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {activeTab === 'Profile' && (
                            <div className="space-y-10">
                                <div>
                                    <h3 className="text-2xl font-serif font-black text-foreground mb-2">Personal Information</h3>
                                    <p className="text-sm text-muted-foreground font-medium">Update your photo and personal details here.</p>
                                </div>

                                <div className="flex items-center gap-6 pb-8 border-b border-slate-50">
                                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary font-black text-2xl uppercase">
                                        JP
                                    </div>
                                    <div className="space-y-2">
                                        <button className="px-4 py-2 bg-background text-white text-xs font-black rounded-full hover:bg-slate-800 transition-all">
                                            Change Photo
                                        </button>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">JPG, GIF or PNG. 1MB Max.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name</label>
                                        <input
                                            type="text"
                                            defaultValue="Jide Pinheiro"
                                            className="w-full px-6 py-4 bg-card border border-border rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Address</label>
                                        <input
                                            type="email"
                                            defaultValue="jide@visual.ng"
                                            className="w-full px-6 py-4 bg-card border border-border rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Bio</label>
                                        <textarea
                                            rows={3}
                                            placeholder="Tell us about yourself..."
                                            className="w-full px-6 py-4 bg-card border border-border rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="pt-8 block">
                                    <button className="flex items-center gap-2 px-10 py-4 bg-primary text-white rounded-[2rem] text-sm font-black hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95">
                                        <Save size={18} />
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab !== 'Profile' && (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-20 h-20 bg-card rounded-[2rem] flex items-center justify-center text-slate-200">
                                    <Settings size={40} strokeWidth={1} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-serif font-black text-foreground">{activeTab} Settings</h3>
                                    <p className="text-muted-foreground font-medium max-w-xs mx-auto mt-2">
                                        We're currently building out the {activeTab.toLowerCase()} management interface. Check back soon!
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HostSettingsPage;
