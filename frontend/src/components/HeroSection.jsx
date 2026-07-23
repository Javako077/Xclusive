import React, { useState, useRef } from 'react';
import { HERO_VIDEOS } from '../data/gymData';
import { Play, Pause, Volume2, VolumeX, Shield, Zap, ArrowRight, Flame } from 'lucide-react';

export const HeroSection = ({ onOpenFreePass, onOpenVirtualTour }) => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const currentVideo = HERO_VIDEOS[activeVideoIndex];

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section id="hero" className="relative min-h-screen pt-28 pb-20 flex items-center bg-black overflow-hidden">
      {/* Video Background with dark overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          key={currentVideo.id}
          src={currentVideo.url}
          poster={currentVideo.poster}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover scale-105 filter brightness-50 contrast-125 opacity-40"
        />
        {/* Dark radial & linear overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,#B9FF0022,transparent_60%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-8 space-y-8">
            <div className="inline-block">
              <span className="text-[#B9FF00] text-xs font-bold tracking-[0.4em] uppercase border-l-2 border-[#B9FF00] pl-3">
                Engineering Human Potential
              </span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.88] uppercase italic tracking-tighter">
              BEYOND <br />
              <span className="text-[#B9FF00]">LIMITS.</span>
            </h1>

            <p className="text-white/60 text-base sm:text-lg max-w-xl font-light leading-relaxed">
              Experience the future of athletic conditioning in our hyper-focused environmental pods. Science-led strength training and recovery suites for those who demand peak output.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <button
                onClick={onOpenFreePass}
                className="bg-[#B9FF00] text-black px-8 py-4 font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform flex items-center gap-3 cursor-pointer shadow-xl shadow-[#B9FF00]/10"
              >
                <Flame className="w-4 h-4 fill-black" /> Start Training
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenVirtualTour}
                className="group flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/80 hover:text-white cursor-pointer"
              >
                <span>View Facility Pods</span>
                <div className="w-10 h-[1px] bg-white/30 group-hover:w-16 group-hover:bg-[#B9FF00] transition-all"></div>
              </button>
            </div>

            {/* Key Stats Bar */}
            <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-white/10">
              <div className="flex flex-col">
                <span className="text-3xl font-black italic text-white">1,200</span>
                <span className="text-[10px] uppercase tracking-widest text-white/40">Daily Intensity (kcal)</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black italic text-[#B9FF00]">84%</span>
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

          {/* Video Control Widget & Video Switcher */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#B9FF00]" />
                  <span className="text-[10px] font-extrabold text-white tracking-[0.2em] uppercase">POD FEED LIVE</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
                    title={isPlaying ? 'Pause Video' : 'Play Video'}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
                    title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Select Zone Stream:</div>
                <div className="grid grid-cols-1 gap-2">
                  {HERO_VIDEOS.map((vid, idx) => {
                    const isSelected = idx === activeVideoIndex;
                    return (
                      <button
                        key={vid.id}
                        onClick={() => {
                          setActiveVideoIndex(idx);
                          setIsPlaying(true);
                        }}
                        className={`w-full p-3.5 rounded-xl border text-left transition-all duration-200 flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#B9FF00]/10 border-[#B9FF00] text-white font-bold'
                            : 'bg-black/60 border-white/5 text-white/50 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <span className="text-xs uppercase tracking-wider truncate">{vid.title}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-[#B9FF00] animate-pulse" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Environmental Pod Status */}
            <div className="p-4 rounded-2xl bg-zinc-950/60 border border-white/10 flex items-center gap-3 text-xs text-white/70">
              <Shield className="w-5 h-5 text-[#B9FF00] shrink-0" />
              <span>Oxygen-regulated pods, climate precision & Eleiko/Rogue certified.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
