"use client";

import React from 'react';
import { Settings, User, Bell, Shield, CreditCard, Briefcase, HelpCircle } from 'lucide-react';

const VendorSettingsPage = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            <div>
                <h2 className="text-4xl font-black tracking-tight text-slate-900">Vendor Settings</h2>
                <p className="text-slate-500 font-medium mt-1">Manage your business profile, service offerings, and account preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <nav className="space-y-1">
                        {[
                            { icon: Briefcase, label: 'Business Profile', active: true },
                            { icon: User, label: 'Personal Info', active: false },
                            { icon: Bell, label: 'Notifications', active: false },
                            { icon: CreditCard, label: 'Payments', active: false },
                            { icon: Shield, label: 'Security', active: false },
                            { icon: HelpCircle, label: 'Support', active: false },
                        ].map((item) => (
                            <button
                                key={item.label}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all ${item.active
                                        ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20'
                                        : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white border border-slate-100 rounded-[2rem] p-8 space-y-8">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 mb-6">Business Details</h3>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-wider text-slate-400">Business Name</label>
                                    <input
                                        type="text"
                                        defaultValue="Luxury Catamaran Events"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-orange-600/20 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-wider text-slate-400">Business Description</label>
                                    <textarea
                                        rows={4}
                                        defaultValue="Premium maritime experience provider on Lagos waters."
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-orange-600/20 outline-none transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-50">
                            <button className="px-8 py-4 bg-slate-900 text-white rounded-xl text-sm font-black hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20">
                                Save Business Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorSettingsPage;
