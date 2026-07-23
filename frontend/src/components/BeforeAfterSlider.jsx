import React, { useState, useRef } from 'react';
import { TRANSFORMATIONS_DATA } from '../data/gymData';
import { Trophy, MoveHorizontal } from 'lucide-react';

export const BeforeAfterSlider = () => {
  const [sliderPos, setSliderPos] = useState(50);
  const [activeIdx, setActiveIdx] = useState(0);
  const isDraggingRef = useRef(false);
  const containerRef = useRef(null);

  const currentTf = TRANSFORMATIONS_DATA[activeIdx];

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPos(percentage);
  };

  const handleMouseDown = () => {
    isDraggingRef.current = true;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleMouseMove = (e) => {
    if (isDraggingRef.current) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <section className="py-24 bg-black text-white relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-block mb-3">
            <span className="text-[#B9FF00] text-xs font-bold tracking-[0.3em] uppercase border-l-2 border-[#B9FF00] pl-3 flex items-center gap-2">
              <Trophy className="w-4 h-4" /> Real Results
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase mb-4">
            ATHLETE <span className="text-[#B9FF00]">TRANSFORMATIONS.</span>
          </h2>
          <p className="text-white/50 text-base sm:text-lg font-light">
            Drag the slider to reveal verified before and after physical progress achieved with our master coaches.
          </p>
        </div>

        {/* Member Selector Switcher */}
        <div className="flex justify-center gap-3 mb-10">
          {TRANSFORMATIONS_DATA.map((tf, idx) => (
            <button
              key={tf.id}
              onClick={() => {
                setActiveIdx(idx);
                setSliderPos(50);
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeIdx === idx
                  ? 'bg-[#B9FF00] text-black shadow-lg shadow-[#B9FF00]/10'
                  : 'bg-zinc-950 border border-white/10 text-white/40 hover:text-white'
              }`}
            >
              {tf.name} ({tf.durationWeeks} WEEKS)
            </button>
          ))}
        </div>

        {/* Interactive Comparison Canvas Slider */}
        <div className="max-w-4xl mx-auto bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative aspect-video sm:aspect-[16/9] rounded-2xl overflow-hidden cursor-ew-resize select-none border border-white/10"
          >
            {/* After Image (Full width background) */}
            <img
              src={currentTf.afterImage}
              alt="After Transformation"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-[#B9FF00] text-black font-black text-xs px-3.5 py-1.5 rounded-full shadow uppercase tracking-widest">
              AFTER ({currentTf.durationWeeks} WEEKS)
            </div>

            {/* Before Image (Clipped overlay) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={currentTf.beforeImage}
                alt="Before Transformation"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: containerRef.current?.getBoundingClientRect().width || '100%' }}
              />
              <div className="absolute top-4 left-4 bg-black/80 text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow uppercase tracking-widest border border-white/10">
                BEFORE
              </div>
            </div>

            {/* Slider Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-[#B9FF00] shadow-[0_0_15px_rgba(185,255,0,0.8)]"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#B9FF00] text-black flex items-center justify-center shadow-2xl border-2 border-black font-bold">
                <MoveHorizontal className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Member Stats */}
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div>
              <h3 className="text-xl font-black italic uppercase text-white">{currentTf.name}, {currentTf.age}</h3>
              <div className="text-xs font-bold text-[#B9FF00] uppercase tracking-wider mt-0.5">{currentTf.goal}</div>
              <div className="text-xs text-white/40 uppercase tracking-widest mt-1">Program: {currentTf.programUsed}</div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-black border border-white/10 flex-1 text-center">
                <div className="text-[9px] font-bold uppercase tracking-widest text-white/40">Fat Loss / Weight</div>
                <div className="text-base font-black italic text-white mt-0.5">{currentTf.weightChange}</div>
              </div>
              <div className="p-3 rounded-2xl bg-black border border-white/10 flex-1 text-center">
                <div className="text-[9px] font-bold uppercase tracking-widest text-white/40">Body Comp</div>
                <div className="text-base font-black italic text-[#B9FF00] mt-0.5">{currentTf.bodyFatChange}</div>
              </div>
            </div>

            <div className="text-xs text-white/70 italic border-l-2 border-[#B9FF00] pl-4 py-1">
              "{currentTf.quote}"
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
