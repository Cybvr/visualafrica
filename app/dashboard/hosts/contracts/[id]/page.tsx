"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Mail, Phone, MapPin, FileText, Download, Send, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { vendors } from '@/lib/vendors-data';
import Link from 'next/link';

// Mock messages data
const MOCK_MESSAGES = [
    { id: 1, sender: 'vendor', text: 'Hello! Thanks for reaching out regarding your event.', time: '10:30 AM' },
    { id: 2, sender: 'user', text: 'Hi, I wanted to ask about your availability for December 15th.', time: '10:35 AM' },
    { id: 3, sender: 'vendor', text: 'Yes, we are available! Would you like to schedule a call to discuss the details?', time: '10:45 AM' },
];

export default function ContractDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const vendor = vendors.find(v => v.id === id);
    const [activeTab, setActiveTab] = useState('overview');

    if (!vendor) {
        return <div className="p-10 text-center">Contract/Vendor not found</div>;
    }

    const renderOverview = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
                <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 mb-4">About {vendor.name}</h3>
                    <p className="text-slate-600 leading-relaxed">{vendor.description}</p>

                    <div className="mt-8 grid grid-cols-2 gap-6">
                        <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Location</div>
                            <div className="flex items-center gap-2 font-medium text-slate-900">
                                <MapPin size={16} className="text-orange-500" />
                                {vendor.location}
                            </div>
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Response Time</div>
                            <div className="flex items-center gap-2 font-medium text-slate-900">
                                <Clock size={16} className="text-blue-500" />
                                {vendor.responseTime}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 mb-6">Pricing & Packages</h3>
                    <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50/50">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-bold text-lg text-slate-900">Standard Package</h4>
                                <p className="text-sm text-slate-500 mt-1">Includes all base services</p>
                            </div>
                            <div className="font-black text-xl text-slate-900">{vendor.price || "Custom"}</div>
                        </div>
                        <ul className="space-y-3">
                            {vendor.whatsIncluded.map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                    <CheckCircle2 size={16} className="text-green-500 bg-green-50 rounded-full flex-shrink-0 mt-0.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </div>

            <div className="space-y-6">
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm text-center">
                    <div className="w-24 h-24 mx-auto bg-slate-100 rounded-full mb-4 overflow-hidden">
                        <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900">{vendor.vendor.name}</h3>
                    <p className="text-sm text-slate-500 mb-6">Verified Vendor</p>
                    <div className="flex justify-center gap-3">
                        <button className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">
                            Contact
                        </button>
                        <button className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors">
                            Website
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderMessages = () => (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden h-[600px] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                        <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900">{vendor.vendor.name}</h4>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs text-slate-500 font-medium">Online</span>
                        </div>
                    </div>
                </div>
                <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50">
                    <Phone size={18} />
                </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/30">
                {MOCK_MESSAGES.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl p-4 ${msg.sender === 'user'
                                ? 'bg-orange-600 text-white rounded-br-none'
                                : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none shadow-sm'
                            }`}>
                            <p className="text-sm">{msg.text}</p>
                            <p className={`text-[10px] mt-2 font-medium opacity-70 ${msg.sender === 'user' ? 'text-white' : 'text-slate-400'}`}>{msg.time}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-white border-t border-slate-100">
                <div className="flex gap-3">
                    <input type="text" placeholder="Type your message..." className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-orange-100 outline-none" />
                    <button className="w-12 h-12 bg-orange-600 text-white rounded-xl flex items-center justify-center hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/20">
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );

    const renderContract = () => (
        <div className="space-y-8">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-black text-slate-900">Contract Details</h3>
                        <p className="text-slate-500 mt-1">Agreement #100{vendor.id}</p>
                    </div>
                    <span className="px-4 py-1.5 bg-green-100 text-green-700 text-xs font-black rounded-full uppercase tracking-wider">Active</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Contract Value</div>
                        <div className="text-2xl font-black text-slate-900">{vendor.price || "Custom Quote"}</div>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Start Date</div>
                        <div className="text-lg font-bold text-slate-900">Oct 24, 2024</div>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Payment Status</div>
                        <div className="text-lg font-bold text-green-600 flex items-center gap-2">
                            <CheckCircle2 size={18} />
                            Paid in Full
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="text-xl font-black text-slate-900 mb-6">Documents</h3>
                <div className="space-y-4">
                    {['Signed Contract.pdf', 'Invoice #INV-2024-001.pdf', 'Service Level Agreement.pdf'].map((doc, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                                    <FileText size={20} />
                                </div>
                                <span className="font-bold text-slate-700">{doc}</span>
                            </div>
                            <button className="text-slate-400 group-hover:text-slate-900 transition-colors">
                                <Download size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <Link href="/dashboard/hosts/contracts" className="text-sm font-bold text-slate-400 hover:text-orange-600 transition-colors mb-2 inline-flex items-center gap-1">
                        ← Back to Contracts
                    </Link>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
                        {vendor.name}
                        <span className="text-lg font-medium text-slate-400 font-normal">/ Contract</span>
                    </h2>
                </div>
            </div>

            <div>
                <div className="flex gap-2 p-1 bg-white rounded-2xl border border-slate-100 w-fit mb-8">
                    {['overview', 'messages', 'contract'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab
                                    ? 'bg-slate-900 text-white shadow-md'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                } capitalize`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="min-h-[500px]">
                    {activeTab === 'overview' && renderOverview()}
                    {activeTab === 'messages' && renderMessages()}
                    {activeTab === 'contract' && renderContract()}
                </div>
            </div>
        </div>
    );
}
