"use client";

import React, { useState } from 'react';
import { Settings, User, Bell, Shield, CreditCard, HelpCircle, Briefcase, ChevronRight, Save, MapPin, Search, FileText, TrendingUp, Star, ClipboardList } from 'lucide-react';
import { VENDOR_DASHBOARD_DATA } from '@/lib/vendor-dashboard-data';
import Link from 'next/link';

const VendorSettingsPage = () => {
    const [activeTab, setActiveTab] = useState('Business Profile');

    const menuItems = [
        { icon: Briefcase, label: 'Business Profile' },
        { icon: TrendingUp, label: 'Performance' },
        { icon: User, label: 'Personal Info' },
        { icon: Bell, label: 'Notifications' },
        { icon: CreditCard, label: 'Payments' },
        { icon: Shield, label: 'Security' },
        { icon: HelpCircle, label: 'Support' },
    ];

    const { stats, leads } = VENDOR_DASHBOARD_DATA;

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20">
            <div>
                <h2 className="text-4xl font-serif font-black tracking-tight text-foreground">Vendor Settings</h2>
                <p className="text-muted-foreground font-medium mt-1">Manage your business profile, service offerings, and account preferences.</p>
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
                                    : 'text-muted-foreground hover:bg-slate-50 hover:text-foreground'
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
                    <div className="bg-card border border-border rounded-[3rem] p-10 shadow-sm min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {activeTab === 'Business Profile' && (
                            <div className="space-y-10">
                                <div>
                                    <h3 className="text-2xl font-serif font-black text-foreground mb-2">Business Profile</h3>
                                    <p className="text-sm text-muted-foreground font-medium">This information will be displayed publicly on your vendor profile.</p>
                                </div>

                                <div className="flex items-center gap-8 pb-10 border-b border-slate-50">
                                    <div className="relative group">
                                        <div className="w-32 h-32 bg-slate-100 rounded-[2.5rem] overflow-hidden">
                                            <img
                                                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=300"
                                                alt="business logo"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                                <Briefcase className="text-white" size={24} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Branding</h4>
                                        <div className="flex gap-3">
                                            <button className="px-5 py-2.5 bg-background text-white text-xs font-black rounded-full hover:bg-slate-800 transition-all">
                                                Update Logo
                                            </button>
                                            <button className="px-5 py-2.5 bg-card border border-border text-muted-foreground text-xs font-black rounded-full hover:bg-slate-50 transition-all">
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Business Name</label>
                                            <input
                                                type="text"
                                                defaultValue="Eko Catamaran Charters"
                                                className="w-full px-6 py-4 bg-slate-50 border border-border rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Location</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                                <input
                                                    type="text"
                                                    defaultValue="Victoria Island, Lagos"
                                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-border rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Business Description</label>
                                        <textarea
                                            rows={5}
                                            defaultValue="Premium maritime experience provider on Lagos waters. We specialize in luxury catamaran cruises for proposals, birthdays, and corporate events."
                                            className="w-full px-6 py-4 bg-slate-50 border border-border rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="pt-8 flex items-center justify-between border-t border-slate-50">
                                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest italic">Last updated: 2 days ago</p>
                                    <button className="flex items-center gap-2 px-12 py-5 bg-primary text-white rounded-[2rem] text-sm font-black hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:scale-105 active:scale-95">
                                        <Save size={20} />
                                        Save Profile
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Performance' && (
                            <div className="space-y-10">
                                <div>
                                    <h3 className="text-2xl font-serif font-black text-foreground mb-2">Performance Overview</h3>
                                    <p className="text-sm text-muted-foreground font-medium">Monitor your business growth and engagement metrics.</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <Link href="/dashboard/vendors/offers" className="bg-background p-6 rounded-[2rem] border border-border shadow-sm hover:shadow-md transition-all group">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <Search size={24} />
                                            </div>
                                            <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">New</span>
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-4xl font-black text-foreground">{leads.length}</h3>
                                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Active Offers</p>
                                        </div>
                                    </Link>

                                    <Link href="/dashboard/vendors/jobs" className="bg-background p-6 rounded-[2rem] border border-border shadow-sm hover:shadow-md transition-all group">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                                <ClipboardList size={24} />
                                            </div>
                                            <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">Active</span>
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-4xl font-black text-foreground">{stats.activeBookings}</h3>
                                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Active Jobs</p>
                                        </div>
                                    </Link>

                                    <div className="bg-background p-6 rounded-[2rem] border border-border shadow-sm hover:shadow-md transition-all group cursor-pointer">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-12 h-12 bg-accent text-accent rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                                <TrendingUp size={24} />
                                            </div>
                                            <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">+{stats.growth}%</span>
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-4xl font-black text-foreground">{stats.monthlyRevenue}</h3>
                                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Monthly Revenue</p>
                                        </div>
                                    </div>

                                    <div className="bg-background p-6 rounded-[2rem] border border-border shadow-sm hover:shadow-md transition-all group cursor-pointer">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center group-hover:bg-yellow-600 group-hover:text-white transition-colors">
                                                <Star size={24} />
                                            </div>
                                            <span className="bg-yellow-100 text-yellow-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">Excellent</span>
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-4xl font-black text-foreground">{stats.avgRating}</h3>
                                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Average Rating</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab !== 'Business Profile' && activeTab !== 'Performance' && (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                                <div className="w-24 h-24 bg-slate-50 rounded-[3rem] flex items-center justify-center text-slate-200">
                                    <Settings size={48} strokeWidth={1} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-serif font-black text-foreground">{activeTab}</h3>
                                    <p className="text-muted-foreground font-medium max-w-xs mx-auto mt-2">
                                        The {activeTab.toLowerCase()} configuration panel is currently being optimized for your business.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setActiveTab('Business Profile')}
                                    className="text-primary font-black text-xs uppercase tracking-widest hover:underline pt-4"
                                >
                                    Return to Profile
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorSettingsPage;
