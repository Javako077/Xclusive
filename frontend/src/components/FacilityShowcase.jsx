import React, { useState } from 'react';
import { FACILITIES_DATA } from '../data/gymData';
import { Building2, CheckCircle2, Shield, Layers } from 'lucide-react';

export const FacilityShowcase = ({ onOpenVideo }) => {
  const [activeZone, setActiveZone] = useState(FACILITIES_DATA[0]);

  return (
    <section
      id="facilities"
      className="py-24 bg-gradient-to-b from-[#1a1408] via-[#2b210b] to-[#171207] text-white relative border-y-2 border-[#D4AF37]/40 overflow-hidden"
    >
      {/* High-Impact Gold Metallic Radial Background Illumination */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#D4AF3730,transparent_65%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.25),transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-block mb-3">
              <span className="text-black bg-gradient-to-r from-[#D4AF37] via-[#F5D77F] to-[#C5A059] px-3 py-1 rounded-full text-xs font-black tracking-[0.25em] uppercase flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20">
                <Building2 className="w-4 h-4 text-black" /> State-Of-The-Art Gym Floor
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase text-white">
              WORLD-CLASS <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F5D77F] to-[#FFD700] drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]">ZONES.</span>
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
                    ? 'bg-gradient-to-r from-[#D4AF37] via-[#F5D77F] to-[#C5A059] text-black border-[#FFD700] shadow-[0_0_30px_rgba(212,175,55,0.45)] scale-[1.03]'
                    : 'bg-[#120e06]/80 border-[#D4AF37]/30 text-white/60 hover:border-[#D4AF37] hover:text-white hover:bg-[#1a1408]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-black' : 'text-[#D4AF37]'}`}>
                    {zone.sqft.toLocaleString()} SQ FT ZONING
                  </span>
                </div>
                <h3 className={`text-xl font-black italic uppercase mb-1 ${isActive ? 'text-black' : 'text-white'}`}>{zone.name}</h3>
                <p className={`text-xs truncate ${isActive ? 'text-black/80 font-medium' : 'text-white/50'}`}>{zone.tagline}</p>
              </button>
            );
          })}
        </div>

        {/* Active Zone Display Card */}
        <div className="bg-[#0f0c05]/95 border-2 border-[#D4AF37]/50 rounded-3xl overflow-hidden shadow-2xl shadow-[#D4AF37]/20 grid grid-cols-1 lg:grid-cols-12">
          {/* Media Column */}
          <div className="lg:col-span-7 relative min-h-[340px] sm:min-h-[440px] overflow-hidden group">
            <img
              src={activeZone.image}
              alt={activeZone.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0c05] via-[#0f0c05]/40 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6">
              <span className="px-4 py-2 rounded-full bg-black/90 backdrop-blur-md text-[#D4AF37] text-xs font-black uppercase tracking-widest border border-[#D4AF37]/50 shadow-lg">
                {activeZone.tagline}
              </span>
            </div>
          </div>

          {/* Specifications & Details Column */}
          <div className="lg:col-span-5 p-8 flex flex-col justify-between space-y-6 bg-gradient-to-b from-[#151007] to-[#0a0803]">
            <div>
              <h3 className="text-3xl font-black italic uppercase text-white mb-3">
                {activeZone.name}
              </h3>
              <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-6">
                {activeZone.description}
              </p>

              {/* Highlights */}
              <div className="space-y-3 mb-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] flex items-center gap-2">
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
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]/70">
                  Featured Equipment
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeZone.equipment.map((eq, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full bg-[#1e170b] border border-[#D4AF37]/40 text-[#F5D77F] text-xs font-bold"
                    >
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Guarantee */}
            <div className="pt-6 border-t border-[#D4AF37]/30 flex items-center justify-between text-xs text-white/60">
              <span className="flex items-center gap-1.5 text-white/90 font-bold uppercase tracking-wider">
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
