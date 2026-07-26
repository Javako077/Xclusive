import React from 'react';
import { Award, Target, Flame, Shield, Users, Trophy, ArrowRight } from 'lucide-react';

export const AboutUsSection = () => {
  const pillars = [
    {
      icon: <Target className="w-6 h-6 text-[#D4AF37]" />,
      title: 'Biomechanical Science',
      description: 'Every rack, platform, and cable vector is calibrated for optimum joint safety, neuromuscular drive, and maximum hypertrophy strength transfer.',
    },
    {
      icon: <Award className="w-6 h-6 text-[#D4AF37]" />,
      title: 'Olympic-Grade Equipment',
      description: 'Equipped with Eleiko competition bars, custom Rogers Athletic power racks, and Atlantis selectorized machines engineered for elite performance.',
    },
    {
      icon: <Users className="w-6 h-6 text-[#D4AF37]" />,
      title: 'High Performance Facilities',
      description: 'Designed to provide uninterrupted access to competition-grade equipment, specialized lifting zones, and optimal training atmospheres.',
    },
    {
      icon: <Flame className="w-6 h-6 text-[#D4AF37]" />,
      title: '360° Metabolic Recovery',
      description: 'From Finnish cedar saunas and cold plunge tubs to hyperbaric oxygen chambers and percussion therapy suites, recover faster to train harder.',
    },
  ];

  const stats = [
    { label: 'FACILITY SPACE', value: '50,000 SQ FT' },
    { label: 'OLYMPIC PLATFORMS', value: '40 ELEIKO RACKS' },
    { label: 'ATHLETES TRAINED', value: '10,000+' },
    { label: 'GOAL SUCCESS RATE', value: '98.4%' },
  ];

  return (
    <section id="about" className="py-24 bg-black text-white relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block mb-3">
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase border-l-2 border-[#D4AF37] pl-3 flex items-center gap-2">
              <Trophy className="w-4 h-4" /> The Xclusive Standard
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase mb-4">
            REDEFINING <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F5D77F] to-[#C5A059]">ATHLETIC EXCELLENCE.</span>
          </h2>
          <p className="text-white/60 text-base sm:text-lg font-light leading-relaxed">
            Xclusive Athletic Lab was built with a singular vision: to destroy generic, commercial gym mediocrity and replace it with a world-class training ground for serious athletes and dedicated fitness seekers.
          </p>
        </div>

        {/* Story Banner Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-bold uppercase tracking-wider">
              <Shield className="w-4 h-4 text-[#D4AF37]" /> Founded By World-Class Athletes
            </div>
            <h3 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tight text-white">
              WHERE SCIENCE MEETS UNYIELDING IRON.
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Established in 2020 by former Olympic powerlifters and biomechanics researchers, Xclusive Athletic Lab combines high-density barbell platforms, advanced velocity-based training sensors, and sport-specific conditioning zones.
            </p>
            <p className="text-white/70 text-sm leading-relaxed">
              We eliminate clutter and crowds to give every member uninterrupted access to competition-grade equipment, tailored sports nutrition programming, and 24/7 keycard entry.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="#memberships"
                className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] via-[#F5D77F] to-[#C5A059] text-black font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer shadow-xl shadow-[#D4AF37]/20"
              >
                View Memberships <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200"
                alt="Xclusive Gym High Performance Facility"
                className="w-full h-[450px] object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-black/80 backdrop-blur-md border border-white/10">
                <div className="text-xs font-black uppercase text-[#D4AF37] tracking-widest mb-1">
                  PREMIUM ATMOSPHERE
                </div>
                <div className="text-lg font-bold text-white">
                  Acoustically tuned soundscapes, medical-grade air filtration & competition lighting.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {pillars.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-zinc-950 border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h4 className="text-xl font-black italic uppercase text-white mb-3">{item.title}</h4>
              <p className="text-xs text-white/50 leading-relaxed font-light">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-8 rounded-3xl bg-zinc-950 border border-white/10">
          {stats.map((s, idx) => (
            <div key={idx} className="text-center py-4 border-r border-white/10 last:border-0">
              <div className="text-3xl sm:text-4xl font-black italic text-[#D4AF37]">{s.value}</div>
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
