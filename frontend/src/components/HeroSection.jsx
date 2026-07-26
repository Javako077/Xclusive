import React, { useState, useEffect } from 'react';
import { ArrowRight, Flame, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 'slide-1',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1920',
    eyebrow: 'Engineering Human Potential',
    titleLine1: 'BEYOND',
    titleLine2: 'LIMITS.',
    description: 'Experience the future of athletic conditioning. Science-led strength training, personalized coaching, and premium recovery suites for those who demand peak physical output.',
    tag: 'Athletic Conditioning Pod',
  },
  {
    id: 'slide-2',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1920',
    eyebrow: 'State-Of-The-Art Equipment',
    titleLine1: 'PURE',
    titleLine2: 'POWER.',
    description: 'Train with Eleiko barbell platforms, custom dumbbell suites, and biomechanically engineered pods designed for ultimate performance and safety.',
    tag: 'Heavy Barbell Platforms',
  },
  {
    id: 'slide-3',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=1920',
    eyebrow: 'Where Fitness Becomes A Lifestyle',
    titleLine1: 'ATHLETE',
    titleLine2: 'MASTERY.',
    description: 'Unleash your full athletic capacity with customized 1-on-1 coaching, movement-based philosophy, and 24/7 keycard access.',
    tag: 'Elite Personal Coaching',
  },
];

export const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const activeSlide = HERO_SLIDES[currentSlide];

  return (
    <section id="hero" className="relative min-h-screen pt-28 pb-20 flex items-center bg-black overflow-hidden select-none">
      {/* Sliding Background Images with Bright & Clear Visibility */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 scale-105 transition-transform duration-[6000ms]' : 'opacity-0 scale-100 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.titleLine1}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter brightness-85 contrast-110 opacity-70"
              />
            </div>
          );
        })}

        {/* Soft gradient overlays for maximum image visibility + clear legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(212,175,55,0.15),transparent_60%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Hero Copy (Left Column) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Eyebrow badge */}
            <div className="inline-block">
              <span className="text-[#D4AF37] text-xs font-bold tracking-[0.4em] uppercase border-l-2 border-[#D4AF37] pl-3 transition-all">
                {activeSlide.eyebrow}
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.88] uppercase italic tracking-tighter transition-all duration-500">
              {activeSlide.titleLine1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16]">
                {activeSlide.titleLine2}
              </span>
            </h1>

            <p className="text-white/80 text-base sm:text-lg max-w-xl font-light leading-relaxed min-h-[72px] transition-all">
              {activeSlide.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <a
                href="#memberships"
                className="bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black px-8 py-4 font-black uppercase text-xs tracking-widest hover:opacity-90 transition-all flex items-center gap-3 cursor-pointer shadow-xl shadow-[#D4AF37]/20"
              >
                <Flame className="w-4 h-4 fill-black" /> Start Training
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#facilities"
                className="group flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/80 hover:text-white cursor-pointer"
              >
                <span>Explore Facilities</span>
                <div className="w-10 h-[1px] bg-white/30 group-hover:w-16 group-hover:bg-[#D4AF37] transition-all"></div>
              </a>
            </div>

            {/* Key Stats Bar */}
            <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-white/10">
              <div className="flex flex-col">
                <span className="text-3xl font-black italic text-white">1,200</span>
                <span className="text-[10px] uppercase tracking-widest text-white/40">Daily Intensity (kcal)</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black italic text-[#F5D76E]">84%</span>
                <span className="text-[10px] uppercase tracking-widest text-white/40">Avg. Peak Effort</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black italic text-white">02:40</span>
                <span className="text-[10px] uppercase tracking-widest text-white/40">Rest Intervals</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black italic text-white">24/7</span>
                <span className="text-[10px] uppercase tracking-widest text-white/40">VIP Access</span>
              </div>
            </div>
          </div>

          {/* Featured Image Showcase Card (Right Column) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#D4AF37]/50 bg-zinc-950/80 p-2 shadow-2xl shadow-[#D4AF37]/20 group">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <img
                  src={activeSlide.image}
                  alt={activeSlide.tag}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-[#D4AF37]/40 text-[#F5D76E] text-[10px] font-black uppercase tracking-wider">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>FEATURED GALLERY</span>
                </div>

                {/* Slide Counter */}
                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold">
                  0{currentSlide + 1} / 0{HERO_SLIDES.length}
                </div>

                {/* Bottom Tag */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-white bg-black/70 px-3 py-1 rounded-lg border border-white/10">
                    {activeSlide.tag}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {HERO_SLIDES.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1.5 rounded-full transition-all ${
                          idx === currentSlide ? 'w-6 bg-[#F5D76E]' : 'w-1.5 bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Manual Navigation Controls */}
              <div className="flex items-center justify-between p-3">
                <button
                  onClick={handlePrev}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>

                <div className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                  AUTO SLIDE ACTIVE
                </div>

                <button
                  onClick={handleNext}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
