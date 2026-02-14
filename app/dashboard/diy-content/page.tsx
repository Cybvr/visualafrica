"use client";

import React from 'react';
import { FileText, Download, Play, BookOpen, Layers } from 'lucide-react';

const RESOURCES = [
  { title: 'Budget Tracker Template', type: 'Spreadsheet', icon: <Layers />, color: 'text-green-600 bg-green-50' },
  { title: 'Venue Scouting Guide', type: 'PDF', icon: <BookOpen />, color: 'text-blue-600 bg-blue-50' },
  { title: 'Choosing Catering', type: 'Video', icon: <Play />, color: 'text-orange-600 bg-orange-50' },
  { title: 'Event Checklist', type: 'Checklist', icon: <FileText />, color: 'text-purple-600 bg-purple-50' },
];

const DIYContent: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">DIY Content</h2>
          <p className="text-slate-500 text-sm mt-1">Tools and guides to help you plan like a pro.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {RESOURCES.map((res, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group">
            <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center text-2xl ${res.color} group-hover:scale-110 transition-transform`}>
              {res.icon}
            </div>
            <h4 className="font-black text-slate-900 text-lg mb-2">{res.title}</h4>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">{res.type}</p>
            <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-xl text-sm font-bold text-slate-600 transition-all">
              <Download size={16} />
              Access Resource
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DIYContent;
