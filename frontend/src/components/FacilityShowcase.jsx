import React, { useState } from 'react';
import { FACILITIES_DATA } from '../data/gymData';
import { Building2, Play, CheckCircle2, Shield, Layers } from 'lucide-react';

export const FacilityShowcase = ({ onOpenVideo }) => {
  const [activeZone, setActiveZone] = useState(FACILITIES_DATA[0]);

  return (
    <section id="facilities" className="py-24 bg-gradient-to-b from-black via-[#18150c] to-black text-white relative border-t border-[#D4AF37]/30 overflow-hidden">
      {/* Ambient Gold Radial Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.18),transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-block mb-3">
              <span className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase border-l-2 border-[#D4AF37] pl-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#D4AF37]" /> State-Of-The-Art Gym Floor
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase">
              WORLD-CLASS <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F5D77F] to-[#C5A059]">ZONES.</span>
            </h2>
          </div>
        </div>

        {/* Zone Selector Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {FACILITIES_DATA.map((zone) => {
            const isActive = zone.id === activeZone.id;
            return (
              <button
                key={zone.id}
                onClick={() => setActiveZone(zone)}
                className={`p-6 rounded-3xl text-left border transition-all duration-300 cursor-pointer relative overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-br from-[#D4AF37]/25 via-zinc-950 to-black border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.25)] scale-[1.02]'
                    : 'bg-zinc-950/70 border-white/10 text-white/40 hover:border-[#D4AF37]/40 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-[#D4AF37]' : 'text-white/30'}`}>
                    {zone.sqft.toLocaleString()} SQ FT POD
                  </span>
                  {isActive && <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37] animate-pulse" />}
                </div>
                <h3 className="text-xl font-black italic uppercase text-white mb-1">{zone.name}</h3>
                <p className="text-xs text-white/50 truncate">{zone.tagline}</p>
              </button>
            );
          })}
        </div>

        {/* Active Zone Display Card */}
        <div className="bg-zinc-950/90 border border-[#D4AF37]/40 rounded-3xl overflow-hidden shadow-2xl shadow-[#D4AF37]/10 grid grid-cols-1 lg:grid-cols-12">
          {/* Media Player Column */}
          <div className="lg:col-span-7 relative min-h-[340px] sm:min-h-[440px] overflow-hidden group">
            <img
              src={activeZone.image}
              alt={activeZone.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            {/* Play Video Trigger Overlay */}
            {activeZone.videoUrl && (
              <button
                onClick={() => onOpenVideo(activeZone.videoUrl, activeZone.name)}
                className="absolute inset-0 flex items-center justify-center group/btn cursor-pointer"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F5D77F] to-[#C5A059] text-black flex items-center justify-center shadow-2xl shadow-[#D4AF37]/40 group-hover/btn:scale-110 transition-transform">
                  <Play className="w-8 h-8 fill-black translate-x-0.5" />
                </div>
              </button>
            )}

            <div className="absolute bottom-6 left-6 right-6">
              <span className="px-4 py-2 rounded-full bg-black/90 backdrop-blur-md text-[#D4AF37] text-xs font-black uppercase tracking-widest border border-[#D4AF37]/40 shadow-lg">
                {activeZone.tagline}
              </span>
            </div>
          </div>

          {/* Specifications & Details Column */}
          <div className="lg:col-span-5 p-8 flex flex-col justify-between space-y-6 bg-gradient-to-b from-zinc-950 to-[#120f08]">
            <div>
              <h3 className="text-3xl font-black italic uppercase text-white mb-3">
                {activeZone.name}
              </h3>
              <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-6">
                {activeZone.description}
              </p>

              {/* Highlights */}
              <div className="space-y-3 mb-6">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#D4AF37]" /> Zone Amenities
                </h4>
                <div className="space-y-2">
                  {activeZone.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-medium text-white/90">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Equipment Tags */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                  Featured Equipment
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeZone.equipment.map((eq, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full bg-black/80 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-medium"
                    >
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Guarantee */}
            <div className="pt-6 border-t border-[#D4AF37]/20 flex items-center justify-between text-xs text-white/40">
              <span className="flex items-center gap-1.5 text-white/80 font-bold uppercase tracking-wider">
                <Shield className="w-4 h-4 text-[#D4AF37]" /> HEPA Air Purified Floor
              </span>
              <span className="font-black italic text-[#D4AF37]">{activeZone.sqft.toLocaleString()} SQ FT</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

