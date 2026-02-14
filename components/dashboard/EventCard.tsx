"use client";
import React from 'react';
import { SharedEvent } from '@/lib/shared-data';
import { Calendar, MapPin, User, Users } from 'lucide-react';

interface EventCardProps {
  event: SharedEvent;
  onClick?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const [imgSrc, setImgSrc] = React.useState(
    event.image && event.image.trim() !== '' ? event.image : '/placeholder.png'
  );

  const handleImageError = () => {
    setImgSrc('/placeholder.png');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planning':
        return 'bg-blue-600/90';
      case 'Confirmed':
        return 'bg-green-600/90';
      case 'Completed':
        return 'bg-slate-600/90';
      default:
        return 'bg-slate-600/90';
    }
  };

  const formatBudget = (budget: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(budget);
  };

  return (
    <div
      className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-orange-600/5 transition-all group cursor-pointer flex flex-col h-full relative"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imgSrc}
          alt={event.eventName}
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 ${getStatusColor(event.status)} backdrop-blur-sm text-[10px] font-black uppercase tracking-widest rounded-full text-white shadow-sm`}>
            {event.status}
          </span>
        </div>

        <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
          <Users size={10} className="text-orange-500" />
          <span className="text-[10px] font-bold text-slate-900">{event.guestCount}</span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h4 className="font-black text-slate-900 leading-tight mb-2 line-clamp-2 min-h-[2.5rem]">{event.eventName}</h4>

        <div className="mt-auto space-y-2">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-tight">
            <User size={14} className="text-orange-600" />
            {event.hostName}
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-tight">
            <Calendar size={14} className="text-orange-600" />
            {event.date}
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-tight">
            <MapPin size={14} className="text-orange-600" />
            {event.location}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-50">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Budget</p>
            <p className="text-sm font-black text-orange-600">{formatBudget(event.budget)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
