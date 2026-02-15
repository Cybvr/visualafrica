"use client";

import React, { useState } from 'react';
import { Settings, User, Shield, CreditCard, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const VendorSettingsPage = () => {
    const [activeTab, setActiveTab] = useState('Account');
    const [emailNotifications, setEmailNotifications] = useState(true);

    const menuItems = [
        { icon: User, label: 'Account' },
        { icon: CreditCard, label: 'Payments' },
        { icon: Shield, label: 'Security' },
    ];

    const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
        <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {label}
            </Label>
            {children}
        </div>
    );

    const EmptyState = ({ tab }: { tab: string }) => (
        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
            <div className="w-24 h-24 rounded-[3rem] flex items-center justify-center text-slate-200">
                <Settings size={48} strokeWidth={1} />
            </div>
            <div>
                <h3 className="text-2xl font-serif font-black text-foreground">{tab}</h3>
                <p className="text-muted-foreground font-medium max-w-xs mx-auto mt-2">
                    The {tab.toLowerCase()} configuration panel is currently being optimized for your business.
                </p>
            </div>
            <button
                onClick={() => setActiveTab('Account')}
                className="text-primary font-black text-xs uppercase tracking-widest hover:underline pt-4"
            >
                Return to Account
            </button>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20">
            <div>
                <h2 className="text-4xl font-black tracking-tight text-foreground">Settings</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                    <nav className="space-y-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => setActiveTab(item.label)}
                                className={`w-full flex items-center justify-between px-5 py-4 text-sm font-black rounded-2xl transition-all ${activeTab === item.label
                                    ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]'
                                    : 'text-muted-foreground hover:bg-slate-50 hover:text-foreground'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon size={18} />
                                    <span>{item.label}</span>
                                </div>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="md:col-span-3">
                    <div className="bg-card border border-border rounded-[3rem] p-10 shadow-sm min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {activeTab === 'Account' && (
                            <div className="space-y-10">
                                <div>
                                    <h3 className="text-2xl font-serif font-black text-foreground mb-2">Account Settings</h3>
                                    <p className="text-sm text-muted-foreground font-medium">Manage your personal information and notification preferences.</p>
                                </div>

                                <div className="space-y-6 pb-10 border-b border-border/50">
                                    <h4 className="text-lg font-black text-foreground">Personal Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <FormField label="Full Name">
                                            <Input defaultValue="John Doe" className="px-6 py-4 rounded-2xl text-sm font-bold" />
                                        </FormField>
                                        <FormField label="Email Address">
                                            <Input type="email" defaultValue="john@ekocharters.com" className="px-6 py-4 rounded-2xl text-sm font-bold" />
                                        </FormField>
                                        <FormField label="Phone Number">
                                            <Input type="tel" defaultValue="+234 801 234 5678" className="px-6 py-4 rounded-2xl text-sm font-bold" />
                                        </FormField>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h4 className="text-lg font-black text-foreground">Notifications</h4>
                                    <div className="flex items-center justify-between p-6 rounded-2xl border border-border">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                                                <Bell size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-foreground">Email Notifications</p>
                                                <p className="text-xs text-muted-foreground font-medium">Receive updates about new offers and bookings</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setEmailNotifications(!emailNotifications)}
                                            className={`relative w-14 h-8 rounded-full transition-all ${emailNotifications ? 'bg-primary' : 'bg-slate-200'}`}
                                        >
                                            <span className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${emailNotifications ? 'translate-x-7' : 'translate-x-1'}`} />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-10 border-t border-border/50">
                                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest italic">Last updated: 2 days ago</p>
                                    <button className="px-12 py-5 bg-primary text-white rounded-[2rem] text-sm font-black hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:scale-105 active:scale-95">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        )}
                        {(activeTab === 'Payments' || activeTab === 'Security') && <EmptyState tab={activeTab} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorSettingsPage;