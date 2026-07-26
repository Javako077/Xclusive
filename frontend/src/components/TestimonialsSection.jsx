import React from 'react';
import { Star, MessageSquareQuote, ExternalLink, ShieldCheck } from 'lucide-react';

const TESTIMONIALS_DATA = [
  {
    id: 't-1',
    name: 'Shubam',
    role: 'Verified Athlete',
    membership: 'Xclusive Pro Member',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    avatarBg: 'from-[#D4AF37] to-[#9A6B16]',
    rating: 5,
    highlights: ['Personalized Training', 'Community Support'],
    quote:
      'Joining Xclusive completely transformed my approach to fitness. The personalized training plans are tailored exactly to my goals, and the supportive community and high-energy atmosphere keep me motivated every single day.',
  },
  {
    id: 't-2',
    name: 'Shrishti',
    role: 'Verified Athlete',
    membership: 'Xclusive VIP Member',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    avatarBg: 'from-[#F5D76E] to-[#D4AF37]',
    rating: 5,
    highlights: ['Personalized Training', 'Results & Coaching', 'Safety First'],
    quote:
      'The expert coaching here is unmatched. I achieved visible strength results safely with proper form guidance. The emphasis on personalized attention, coach expertise, and injury prevention gives me total confidence during every workout.',
  },
  {
    id: 't-3',
    name: 'Anuradha',
    role: 'Verified Athlete',
    membership: 'Xclusive Club Access',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    avatarBg: 'from-[#D4AF37] to-[#C5A059]',
    rating: 5,
    highlights: ['Consistency', 'Professional Coaches', 'Training Variety'],
    quote:
      'The variety in training programs keeps my routine fresh and engaging. Thanks to the professional coaches and flexible environment, I have stayed consistent for months and reached peak physical conditioning.',
  },
];

export const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-24 bg-black text-white relative border-t border-[#D4AF37]/20 overflow-hidden">
      {/* Ambient Radial Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12),transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block mb-3">
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase border-l-2 border-[#D4AF37] pl-3 flex items-center gap-2">
              <MessageSquareQuote className="w-4 h-4 text-[#D4AF37]" /> Client Feedback
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase mb-4 text-white">
            LISTEN WHAT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16]">OUR CLIENTS SAY.</span>
          </h2>
          <p className="text-white/60 text-base sm:text-lg font-light leading-relaxed">
            Real stories of physical transformation, consistency, and athletic achievement from our dedicated community.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {TESTIMONIALS_DATA.map((t) => (
            <div
              key={t.id}
              className="p-8 rounded-3xl bg-zinc-950/90 border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-300 group shadow-2xl flex flex-col justify-between relative overflow-hidden"
            >
              {/* Top Accent Quote Icon */}
              <div className="absolute top-6 right-6 text-white/5 group-hover:text-[#D4AF37]/15 transition-colors pointer-events-none">
                <MessageSquareQuote className="w-16 h-16" />
              </div>

              <div>
                {/* Member Header with Profile Image */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl p-0.5 bg-gradient-to-br from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] shadow-lg shadow-[#D4AF37]/20 shrink-0 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={t.image}
                      alt={t.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-[14px]"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-black italic uppercase text-white group-hover:text-[#F5D76E] transition-colors">
                      {t.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{t.role}</span>
                    </div>
                  </div>
                </div>

                {/* Star Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F5D76E] text-[#F5D76E]" />
                  ))}
                  <span className="text-xs font-bold text-white/50 ml-2">5.0 / 5.0</span>
                </div>

                {/* Testimonial Quote */}
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              {/* Focus Tags Footer */}
              <div className="pt-4 border-t border-white/5">
                <div className="flex flex-wrap gap-1.5">
                  {t.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full bg-[#1c160b] border border-[#D4AF37]/30 text-[#F5D76E] text-[10px] font-bold uppercase tracking-wider"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Google Reviews Banner */}
        <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-gradient-to-r from-zinc-950 via-[#18150c] to-zinc-950 border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white p-2.5 flex items-center justify-center shrink-0 shadow-lg">
              {/* SVG Google G Logo */}
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#F5D76E] text-[#F5D76E]" />
                ))}
                <span className="text-xs font-black text-white ml-1">4.9 / 5.0</span>
              </div>
              <h4 className="text-base font-black italic uppercase text-white">RATED #1 FITNESS CENTER ON GOOGLE</h4>
              <p className="text-xs text-white/60">Based on 250+ verified member reviews & ratings.</p>
            </div>
          </div>

          <a
            href="https://www.google.com/search?q=Xclusive+Gym+Reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-[#D4AF37]/20 cursor-pointer"
          >
            See What People Say About Us On Google <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
