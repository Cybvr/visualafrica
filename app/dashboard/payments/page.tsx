"use client";

import React from 'react';
import { CreditCard, FileText, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../../lib/event-data';

const PAYMENTS = [
  { id: 1, vendor: 'The Monarch', type: 'Deposit', amount: 1500000, status: 'Paid', date: 'Oct 01, 2024' },
  { id: 2, vendor: 'Gourmet Flavors', type: 'Service Fee', amount: 500000, status: 'Overdue', date: 'Oct 10, 2024' },
  { id: 3, vendor: 'The Monarch', type: 'Final Payment', amount: 3500000, status: 'Upcoming', date: 'Nov 15, 2024' },
];

const Payments: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Payments & Contracts</h2>
          <p className="text-slate-500 mt-1">Manage your financial obligations and legal documents in one place.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col min-w-[200px]">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Paid</span>
            <span className="text-xl font-black text-green-600">{formatCurrency(1500000)}</span>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col min-w-[200px]">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Remaining</span>
            <span className="text-xl font-black text-slate-900">{formatCurrency(4000000)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <CreditCard size={20} className="text-orange-600" />
            Recent Transactions
          </h3>
          <div className="space-y-4">
            {PAYMENTS.map((p) => (
              <div key={p.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${p.status === 'Paid' ? 'bg-green-50 text-green-600' : p.status === 'Overdue' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400'}`}>
                    {p.status === 'Paid' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{p.vendor}</h4>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">{p.type} • {p.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-900">{formatCurrency(p.amount)}</p>
                  <p className={`text-[10px] font-black uppercase mt-1 ${p.status === 'Paid' ? 'text-green-600' : p.status === 'Overdue' ? 'text-red-600' : 'text-slate-400'}`}>{p.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FileText size={20} className="text-orange-600" />
            Contracts
          </h3>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 space-y-6 shadow-sm">
            {['The Monarch Venue Rental', 'Gourmet Flavors Catering Agreement', 'Lagos Lens Media Contract'].map((doc, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-slate-400 group-hover:text-orange-600" />
                  <span className="text-sm font-bold text-slate-600">{doc}</span>
                </div>
                <button className="p-2 text-slate-300 hover:text-slate-900"><Download size={16} /></button>
              </div>
            ))}
            <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-colors">Upload New Contract</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
