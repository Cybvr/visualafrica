
import React from 'react';
import { ChevronLeft, Star, MapPin, CheckCircle2, MessageSquare, Heart, Share2, Calendar, Globe, Award, ShieldCheck, Zap } from 'lucide-react';
import { Vendor } from '@/lib/vendors-data';

interface VendorDetailProps {
  vendor: Vendor;
  onBack: () => void;
}

const VendorDetail: React.FC<VendorDetailProps> = ({ vendor, onBack }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-32">
      {/* Header / Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-black text-[10px] uppercase tracking-widest"
        >
          <ChevronLeft size={16} />
          Back to Browse
        </button>
        <div className="flex items-center gap-2">
          <button className="p-3 rounded-2xl bg-white border border-slate-100 hover:bg-slate-50 text-slate-500 transition-all"><Share2 size={18} /></button>
          <button className="p-3 rounded-2xl bg-white border border-slate-100 hover:bg-slate-50 text-slate-500 transition-all"><Heart size={18} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Main Hero & Gallery */}
          <div className="space-y-4">
            <div className="aspect-[16/9] rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200 border-4 border-white">
              <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
            </div>
            {vendor.gallery.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {vendor.gallery.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-sm hover:scale-105 transition-transform cursor-pointer">
                    <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Identity */}
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {vendor.categories.map(cat => (
                <span key={cat} className="px-4 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-100">{cat}</span>
              ))}
              <span className="px-4 py-1 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest">Est. {vendor.yearEstablished}</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">{vendor.name}</h1>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 text-slate-900 font-black text-lg">
                <Star size={24} className="fill-orange-500 text-orange-500" />
                {vendor.rating} <span className="text-slate-400 font-bold ml-1">/ 5.0</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 font-bold">
                <MapPin size={24} className="text-orange-600" />
                {vendor.location}
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="text-center space-y-1">
              <p className="text-2xl font-black text-slate-900">{vendor.stats.eventsPlanned}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Events</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-2xl font-black text-slate-900">{vendor.stats.satisfiedClients}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clients</p>
            </div>
            <div className="text-center space-y-1 border-x border-slate-50">
              <p className="text-2xl font-black text-slate-900">{vendor.stats.yearsExperience}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience</p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-2xl font-black text-slate-900">{vendor.stats.uniqueLocations}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Locations</p>
            </div>
          </div>

          {/* Descriptions */}
          <section className="space-y-6">
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <Award size={24} className="text-orange-600" />
              About the Vendor
            </h3>
            <p className="text-slate-600 leading-relaxed text-lg font-medium">{vendor.description}</p>
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 italic text-slate-500 text-sm">
              "{vendor.about}"
            </div>
          </section>

          {/* Whats Included */}
          <section className="bg-white p-12 rounded-[3rem] border border-slate-100 space-y-8 shadow-sm">
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <ShieldCheck size={24} className="text-green-600" />
              Standard Package
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vendor.whatsIncluded.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 text-slate-700 font-bold">
                  <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} className="text-green-500" />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Sticky */}
        <div className="space-y-8">
          <div className="sticky top-24 bg-slate-900 text-white p-10 rounded-[3rem] space-y-8 shadow-2xl shadow-slate-900/30">
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Starting Investment</p>
              <p className="text-4xl font-black text-orange-500">{vendor.price || 'By Request'}</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-slate-400 font-bold uppercase tracking-widest">Response Time</span>
                <span className="font-black flex items-center gap-1.5"><Zap size={14} className="text-orange-500" /> {vendor.responseTime}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-slate-400 font-bold uppercase tracking-widest">Areas Served</span>
                <span className="font-black">{vendor.areaServed.join(', ')}</span>
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-5 rounded-2xl font-black shadow-lg shadow-orange-600/20 transition-all hover:scale-[1.02] active:scale-95">
                Reserve Dates
              </button>
              <button className="w-full bg-white/5 hover:bg-white/10 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all border border-white/10">
                <MessageSquare size={18} />
                Request Custom Quote
              </button>
            </div>

            <p className="text-center text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
              Verified VisualAfrica Partner
            </p>
          </div>

          <div className="bg-orange-50/50 border border-orange-100 p-8 rounded-[2.5rem] space-y-4 shadow-sm text-center">
            <Globe className="mx-auto text-orange-600" size={32} />
            <h4 className="font-black text-slate-900 text-lg leading-tight">Expert Planning Support</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">VisualAfrica agents can negotiate this contract and manage logistics on your behalf.</p>
            <button className="text-orange-600 font-black text-xs uppercase tracking-widest hover:underline pt-2">Unlock Pro Perks →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetail;
