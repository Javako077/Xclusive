import React, { useState } from 'react';
import { X, Building2, ChevronRight, Check } from 'lucide-react';

export const VirtualTourModal = ({ isOpen, onClose }) => {
  const [currentChapter, setCurrentChapter] = useState(0);

  if (!isOpen) return null;

  const chapters = [
    {
      title: 'Chapter 1: Welcome & Reception Lounge',
      desc: 'Check in via seamless mobile QR scanner, browse fresh protein smoothies at our organic juice bar, and access keycard lockers.',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-stretches-on-a-yoga-mat-42825-large.mp4',
    },
    {
      title: 'Chapter 2: Heavy Iron & Olympic Lifting Bay',
      desc: '12 Rogue Monster power racks, calibrated Eleiko plates, dumbbell racks up to 150 lbs, and heavy impact platforms.',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-training-with-dumbbells-in-a-gym-42838-large.mp4',
    },
    {
      title: 'Chapter 3: Turf Conditioning & Battle Ropes',
      desc: '40-yard sprint turf, Prowler sleds, kettlebells, Concept2 rowers, and assault air bikes.',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-athlete-doing-battle-rope-exercises-in-gym-42820-large.mp4',
    },
    {
      title: 'Chapter 4: Infrared Spa & Recovery Suite',
      desc: 'Infrared cedar saunas, cryotherapy chambers, and percussion massagers for immediate post-workout muscle repair.',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-female-boxer-punching-a-bag-in-a-gym-42822-large.mp4',
    },
  ];

  const activeChapter = chapters[currentChapter];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 relative shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-lime-400" />
            <h3 className="text-xl font-bold text-white">360° Interactive Virtual Tour</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Video Player */}
          <div className="lg:col-span-8 aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative">
            <video
              key={activeChapter.title}
              src={activeChapter.videoUrl}
              autoPlay
              loop
              muted
              controls
              playsInline
              className="w-full h-full object-cover"
            />
          </div>

          {/* Chapters Checklist */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Tour Chapters</div>
            <div className="space-y-2">
              {chapters.map((chap, idx) => {
                const isActive = idx === currentChapter;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentChapter(idx)}
                    className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isActive
                        ? 'bg-lime-400/10 border-lime-400 text-white font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs truncate">{chap.title}</span>
                    {isActive ? <Check className="w-4 h-4 text-lime-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-800">
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeChapter.desc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
