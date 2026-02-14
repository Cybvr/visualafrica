"use client";
import React from 'react';
import { ChevronLeft, Calendar, MapPin, Users, DollarSign, MessageSquare, Heart, Share2, Award, ShieldCheck, Zap, User } from 'lucide-react';
import { SharedEvent } from '@/lib/shared-data';

interface EventDetailProps {
  event: SharedEvent;
  onBack: () => void;
}

const EventDetail: React.FC<EventDetailProps> = ({ event, onBack }) => {
  const [imgSrc, setImgSrc] = React.useState(
    event.image && event.image.trim() !== '' ? event.image : '/placeholder.png'
  );

  const handleImageError = () => {
    setImgSrc('/placeholder.png');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planning':
        return 'bg-blue-600 text-white';
      case 'Confirmed':
        return 'bg-green-600 text-white';
      case 'Completed':
        return 'bg-slate-600 text-white';
      default:
        return 'bg-slate-600 text-white';
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
    <div className="max-w-6xl mx-auto space-y-10 pb-32">
      {/* Header / Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-black text-[10px] uppercase tracking-widest"
        >
          <ChevronLeft size={16} />
          Back to Events
        </button>
        <div className="flex items-center gap-2">
          <button className="p-3 rounded-2xl bg-white border border-slate-100 hover:bg-slate-50 text-slate-500 transition-all"><Share2 size={18} /></button>
          <button className="p-3 rounded-2xl bg-white border border-slate-100 hover:bg-slate-50 text-slate-500 transition-all"><Heart size={18} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Main Hero Image */}
          <div className="space-y-4">
            <div className="aspect-[16/9] rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200 border-4 border-white">
              <img src={imgSrc} alt={event.eventName} onError={handleImageError} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Identity */}
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <span className={`px-4 py-1 ${getStatusColor(event.status)} rounded-full text-[10px] font-black uppercase tracking-widest`}>
                {event.status}
              </span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">{event.eventName}</h1>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 text-slate-500 font-bold">
                <User size={24} className="text-orange-600" />
                <span className="text-slate-900 font-black">{event.hostName}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 font-bold">
                <Calendar size={24} className="text-orange-600" />
                {event.date}
              </div>
              <div className="flex items-center gap-2 text-slate-500 font-bold">
                <MapPin size={24} className="text-orange-600" />
                {event.location}
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="text-center space-y-1">
              <Users className="mx-auto text-orange-600 mb-2" size={28} />
              <p className="text-2xl font-black text-slate-900">{event.guestCount}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expected Guests</p>
            </div>
            <div className="text-center space-y-1 border-x border-slate-50">
              <DollarSign className="mx-auto text-orange-600 mb-2" size={28} />
              <p className="text-2xl font-black text-slate-900">{formatBudget(event.budget)}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Budget</p>
            </div>
            <div className="text-center space-y-1">
              <Calendar className="mx-auto text-orange-600 mb-2" size={28} />
              <p className="text-2xl font-black text-slate-900">{event.date}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Event Date</p>
            </div>
          </div>

          {/* Description */}
          <section className="space-y-6">
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <Award size={24} className="text-orange-600" />
              About This Event
            </h3>
            <p className="text-slate-600 leading-relaxed text-lg font-medium">{event.description}</p>
          </section>

          {/* Booked Vendors */}
          {event.bookedVendors.length > 0 && (
            <section className="bg-white p-12 rounded-[3rem] border border-slate-100 space-y-8 shadow-sm">
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <ShieldCheck size={24} className="text-green-600" />
                Current Vendors
              </h3>
              <div className="space-y-4">
                {event.bookedVendors.map((vendor, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div className="space-y-1">
                      <p className="font-black text-slate-900">{vendor.service}</p>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">{vendor.status}</p>
                    </div>
                    <p className="text-lg font-black text-orange-600">{vendor.amount}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Sticky */}
        <div className="space-y-8">
          <div className="sticky top-24 bg-slate-900 text-white p-10 rounded-[3rem] space-y-8 shadow-2xl shadow-slate-900/30">
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Event Budget</p>
              <p className="text-4xl font-black text-orange-500">{formatBudget(event.budget)}</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-slate-400 font-bold uppercase tracking-widest">Status</span>
                <span className={`font-black px-3 py-1 rounded-full text-[9px] ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-slate-400 font-bold uppercase tracking-widest">Guest Count</span>
                <span className="font-black flex items-center gap-1.5">
                  <Users size={14} className="text-orange-500" /> {event.guestCount}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-slate-400 font-bold uppercase tracking-widest">Location</span>
                <span className="font-black text-right">{event.location}</span>
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-5 rounded-2xl font-black shadow-lg shadow-orange-600/20 transition-all hover:scale-[1.02] active:scale-95">
                Express Interest
              </button>
              <button className="w-full bg-white/5 hover:bg-white/10 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all border border-white/10">
                <MessageSquare size={18} />
                Contact Host
              </button>
            </div>

            <p className="text-center text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
              Verified Waddi Event
            </p>
          </div>

          <div className="bg-orange-50/50 border border-orange-100 p-8 rounded-[2.5rem] space-y-4 shadow-sm text-center">
            <Zap className="mx-auto text-orange-600" size={32} />
            <h4 className="font-black text-slate-900 text-lg leading-tight">Quick Response Required</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">This host is actively reviewing proposals. Submit your interest early to stand out.</p>
            <button className="text-orange-600 font-black text-xs uppercase tracking-widest hover:underline pt-2">Learn More →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
