import React from 'react';
import { Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

const WHY_CHOOSE_US_DATA = [
  {
    number: '01',
    title: 'Personalized Training',
    description: "Every athlete's body and journey is unique. We design custom-tailored workout & nutrition roadmaps aligned with your specific fitness goals, structural biomechanics, and real-time physical progression to ensure maximum result velocity without plateaus.",
  },
  {
    number: '02',
    title: 'Our Coaches',
    description: 'Our team consists of veteran athletic trainers, strength specialists, and exercise physiologists dedicated to your growth. With master-level expertise across functional conditioning and injury prevention, you receive elite-level 1-on-1 mentorship.',
  },
  {
    number: '03',
    title: 'Movement-Based Philosophy',
    description: 'We prioritize longevity and athletic mastery over quick cosmetic fixes. Our core training methodology integrates multi-joint compound strength, joint mobility, body mechanics, and functional skill development to build a powerful, resilient body.',
  },
  {
    number: '04',
    title: 'Flexible Timings',
    description: 'Fitness should adapt to your active lifestyle, not disrupt it. Enjoy flexible class schedules and 24/7 keycard facility access that seamlessly integrate into early morning, afternoon, or late-night training routines.',
  },
  {
    number: '05',
    title: 'Limitless Possibilities',
    description: 'From heavy barbell platforms and Olympic lifting pods to high-intensity athletic conditioning and infrared recovery suites—experience an all-inclusive fitness ecosystem designed to unlock every dimension of human potential.',
  },
  {
    number: '06',
    title: 'Trial Sessions',
    description: 'Test-drive our world-class gym floor, high-performance equipment, and premium recovery amenities firsthand before making any long-term commitment. Experience the Xclusive difference with zero pressure and complete transparency.',
  },
];

export const WhyChooseUs = ({ onOpenTrial }) => {
  return (
    <section id="why-us" className="py-24 bg-black text-white relative border-t border-[#D4AF37]/20 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.12),transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block mb-3">
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase border-l-2 border-[#D4AF37] pl-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" /> What Makes Us Different
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase mb-4 text-white">
            WHY CHOOSE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16]">XCLUSIVE.</span>
          </h2>
          <p className="text-white/60 text-base sm:text-lg font-light leading-relaxed">
            A movement-first performance experience engineered around individual progression, expert guidance, and flexible scheduling.
          </p>
        </div>

        {/* Numbered Feature List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {WHY_CHOOSE_US_DATA.map((item) => (
            <div
              key={item.number}
              className="p-8 rounded-3xl bg-zinc-950/80 border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-300 group shadow-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] flex flex-col justify-between relative overflow-hidden"
            >
              {/* Subtle Corner Accent Glow */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#D4AF37]/10 rounded-full blur-xl group-hover:bg-[#D4AF37]/25 transition-all pointer-events-none" />

              <div>
                {/* Large Stylized Number */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-5xl sm:text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] drop-shadow-[0_2px_4px_#000000]">
                    {item.number}
                  </span>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]/40 group-hover:bg-[#D4AF37] group-hover:shadow-[0_0_10px_#D4AF37] transition-all" />
                </div>

                <div className="w-12 h-0.5 bg-gradient-to-r from-[#D4AF37] to-transparent mb-4 group-hover:w-20 transition-all duration-300" />

                {/* Heading */}
                <h3 className="text-xl sm:text-2xl font-black italic uppercase text-white mb-3 group-hover:text-[#F5D76E] transition-colors">
                  {item.title}
                </h3>

                {/* Descriptive Paragraph */}
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>

              {/* Bottom Subtle Check */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]/70 group-hover:text-[#D4AF37] transition-colors">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Xclusive Guarantee</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner Bottom */}
        <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-zinc-950 via-[#18150c] to-zinc-950 border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div>
            <h3 className="text-2xl font-black italic uppercase text-white mb-1">READY TO EXPERIENCE THE XCLUSIVE DIFFERENCE?</h3>
            <p className="text-xs text-white/60">Claim your personalized trial session and consult with an expert athletic advisor today.</p>
          </div>
          <button
            onClick={() => {
              if (onOpenTrial) onOpenTrial();
              else {
                const el = document.getElementById('trial');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-8 py-4 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-[#D4AF37]/20 cursor-pointer"
          >
            Book A Trial Session <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
