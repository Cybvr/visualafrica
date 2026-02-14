
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ItineraryCard: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 h-full shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-slate-900">Itinerary</h3>
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-slate-400 hover:bg-slate-50 rounded-full border border-slate-100">
            <ChevronLeft size={18} />
          </button>
          <button className="p-1.5 text-slate-400 hover:bg-slate-50 rounded-full border border-slate-100">
            <ChevronRight size={18} />
          </button>
          <button className="text-orange-600 font-bold text-sm ml-2 hover:underline">Manage</button>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h4 className="text-slate-900 font-bold text-lg mb-4">May 29, 2025</h4>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-slate-50/80 rounded-2xl border border-slate-100/50">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                🍽️
              </div>
              <div>
                <p className="font-bold text-slate-900">Breakfast</p>
                <p className="text-slate-500 text-sm">8am – 9:30pm</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors rounded-2xl group cursor-pointer">
              <div className="w-12 h-12 bg-slate-100 group-hover:bg-white transition-colors rounded-xl flex items-center justify-center shrink-0">
                💼
              </div>
              <div>
                <p className="font-bold text-slate-900">General Session</p>
                <p className="text-slate-500 text-sm">9:30am – 12pm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryCard;
