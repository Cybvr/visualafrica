
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const GuestManagementCard: React.FC = () => {
  const data = [
    { name: 'Going', value: 25 },
    { name: 'Pending', value: 75 },
  ];
  const COLORS = ['#ea580c', '#f1f5f9']; // orange-600 and slate-100

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 h-full shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-slate-900">Guest Management</h3>
        <button className="text-orange-600 font-bold text-sm hover:underline">Manage</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-6">
        <div className="relative w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                startAngle={180}
                endAngle={-180}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-slate-900">25%</span>
            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Going</span>
          </div>
        </div>

        <div className="grid grid-cols-2 w-full mt-6 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center">
            <span className="text-2xl font-bold text-orange-600">12</span>
            <span className="text-xs font-semibold text-slate-500 uppercase">Registered</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center">
            <span className="text-2xl font-bold text-slate-400">48</span>
            <span className="text-xs font-semibold text-slate-500 uppercase">Pending</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-50">
        <button className="w-full text-center text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
          View all 60 guests
        </button>
      </div>
    </div>
  );
};

export default GuestManagementCard;
