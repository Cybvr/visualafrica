"use client";

import React from 'react';
import { FileText, Search, Filter, MoreHorizontal, Download, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import { vendors } from '@/lib/vendors-data'; // Re-using vendor data for contracts demo

export default function ContractsPage() {
  // Mock contract status for demo purposes
  const getContractStatus = (index: number) => {
    const statuses = ['Active', 'Pending Signature', 'Expired', 'Draft'];
    const styles = {
      'Active': 'bg-green-100 text-green-700',
      'Pending Signature': 'bg-orange-100 text-orange-700',
      'Expired': 'bg-red-100 text-red-700',
      'Draft': 'bg-slate-100 text-slate-700',
    };
    const status = statuses[index % statuses.length];
    return { status, style: styles[status as keyof typeof styles] };
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Contracts</h2>
          <p className="text-slate-500 mt-1">Manage your agreements and vendor relationships.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
            <Filter size={18} />
            Filter
          </button>
          <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 flex items-center gap-2">
            <FileText size={18} />
            New Contract
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search contracts, vendors..."
          className="w-full bg-white border-none py-4 pl-12 pr-4 rounded-2xl shadow-sm text-slate-900 font-medium focus:ring-2 focus:ring-slate-900 outline-none placeholder:text-slate-400"
        />
      </div>

      <div className="space-y-4">
        {vendors.map((vendor, index) => {
          const { status, style } = getContractStatus(index);
          return (
            <Link
              href={`/dashboard/contracts/${vendor.id}`}
              key={vendor.id}
              className="bg-white p-6 rounded-[2rem] border border-slate-100 hover:shadow-md transition-all group flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0">
                  <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{vendor.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                    <span className="flex items-center gap-1"><FileText size={14} /> Contract #{1000 + index}</span>
                    <span>•</span>
                    <span>{vendor.categories[0]}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 md:gap-12 w-full md:w-auto">
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${style}`}>
                    {status}
                  </span>
                </div>

                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Amount</div>
                  <div className="font-bold text-slate-900">{vendor.price || "Custom Quote"}</div>
                </div>

                <div className="hidden md:flex items-center gap-2">
                  <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                    <Phone size={16} />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                    <Mail size={16} />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
