import React, { useEffect, useRef, useState } from 'react';
import { EXERCISES_LIBRARY } from '../data/gymData';
import { Play, Pause, RefreshCw, Flame, Activity, Zap, CheckCircle2, ChevronRight, Award } from 'lucide-react';

export const ExerciseMotionViewer = () => {
  const [selectedExercise, setSelectedExercise] = useState(EXERCISES_LIBRARY[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [repCount, setRepCount] = useState(0);
  const [showHeatmap, setShowHeatmap] = useState(true);

  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Animation phase state (0 to 1 smooth sinusoidal oscillation)
  const phaseRef = useRef(0);
  const prevCycleRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localPhase = phaseRef.current;

    const render = () => {
      // Resize support
      const width = canvas.width;
      const height = canvas.height;

      // Clear dark canvas background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Draw glowing background grid
      ctx.strokeStyle = '#18181B';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Increment phase if playing
      if (isPlaying) {
        localPhase += 0.025 * speed;
        if (localPhase >= Math.PI * 2) {
          localPhase -= Math.PI * 2;
        }
        phaseRef.current = localPhase;
      }

      // Calculate smooth movement sine curve (0 = top position, 1 = bottom/extended position)
      const motionVal = (Math.sin(localPhase - Math.PI / 2) + 1) / 2;

      // Rep tracking logic
      if (motionVal > 0.9) {
        prevCycleRef.current = true;
      }
      if (motionVal < 0.1 && prevCycleRef.current) {
        setRepCount((prev) => prev + 1);
        prevCycleRef.current = false;
      }

      const centerX = width / 2;
      const centerY = height / 2 + 20;

      // Draw Ground Shadow
      ctx.beginPath();
      ctx.ellipse(centerX, height - 40, 100 + motionVal * 20, 12, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fill();

      // Render custom animated exercise mechanics based on type
      ctx.save();
      
      const type = selectedExercise.canvasAnimationType;

      if (type === 'squat') {
        drawSquatMechanics(ctx, centerX, centerY, motionVal, showHeatmap);
      } else if (type === 'bench_press') {
        drawBenchPressMechanics(ctx, centerX, centerY, motionVal, showHeatmap);
      } else if (type === 'deadlift') {
        drawDeadliftMechanics(ctx, centerX, centerY, motionVal, showHeatmap);
      } else if (type === 'hiit_jump') {
        drawJumpingMechanics(ctx, centerX, centerY, motionVal, showHeatmap);
      } else if (type === 'dumbbell_curl') {
        drawBicepCurlMechanics(ctx, centerX, centerY, motionVal, showHeatmap);
      } else {
        drawSquatMechanics(ctx, centerX, centerY, motionVal, showHeatmap);
      }

      ctx.restore();

      // Draw Live Motion Telemetry Stats on Canvas
      ctx.fillStyle = '#E2E8F0';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`Target: ${selectedExercise.primaryMuscle}`, 20, 30);
      ctx.fillStyle = '#38BDF8';
      ctx.fillText(`Phase depth: ${Math.round(motionVal * 100)}%`, 20, 50);

      // Loop animation frame
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [selectedExercise, isPlaying, speed, showHeatmap]);

  const handleReset = () => {
    phaseRef.current = 0;
    setRepCount(0);
  };

  return (
    <section id="motion-exercises" className="py-24 bg-black text-white relative overflow-hidden border-t border-white/5">
      {/* Background glow gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-block mb-3">
            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase border-l-2 border-[#D4AF37] pl-3 flex items-center gap-2">
              <Activity className="w-4 h-4" /> 3D Biomechanics & Velocity Lab
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase mb-4">
            PRECISION <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F5D77F] to-[#C5A059]">BIOMECHANICS.</span>
          </h2>
          <p className="text-white/50 text-base sm:text-lg font-light">
            Interactive kinematic engine detailing bar path, joint angles, and active muscle recruitment for peak lift performance.
          </p>
        </div>

        {/* Exercise Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {EXERCISES_LIBRARY.map((ex) => {
            const isActive = ex.id === selectedExercise.id;
            return (
              <button
                key={ex.id}
                onClick={() => {
                  setSelectedExercise(ex);
                  setRepCount(0);
                  phaseRef.current = 0;
                }}
                className={`px-5 py-2.5 rounded-none font-extrabold text-xs uppercase tracking-widest transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#B9FF00] text-black shadow-lg shadow-[#B9FF00]/10 scale-105'
                    : 'bg-zinc-950 border border-white/10 text-white/50 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Zap className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-[#B9FF00]'}`} />
                {ex.name}
              </button>
            );
          })}
        </div>

        {/* Main Canvas & Data Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Canvas Interactive Screen */}
          <div className="lg:col-span-7 bg-zinc-950 rounded-3xl border border-white/10 p-4 sm:p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B9FF00] animate-pulse" />
                <span className="text-[10px] font-bold text-white/80 uppercase tracking-[0.2em]">
                  LIVE KINETIC FEED
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    showHeatmap ? 'bg-[#B9FF00]/10 border border-[#B9FF00] text-[#B9FF00]' : 'bg-white/5 text-white/40'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 inline mr-1" />
                  Heatmap
                </button>
                <button
                  onClick={handleReset}
                  className="p-2 rounded-full bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Reset Counter"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Canvas Container */}
            <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-black border border-white/10">
              <canvas
                ref={canvasRef}
                width={640}
                height={420}
                className="w-full h-full block"
              />

              {/* Rep Badge Overlay */}
              <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-2 text-right">
                <div className="text-[9px] uppercase font-bold text-white/40 tracking-widest">Completed Reps</div>
                <div className="text-2xl font-black italic text-[#B9FF00] tracking-tight">{repCount}</div>
              </div>
            </div>

            {/* Canvas Controls Bar */}
            <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-5 py-2.5 bg-[#B9FF00] text-black font-black text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-black" /> Pause Motion
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-black" /> Play Motion
                    </>
                  )}
                </button>
              </div>

              {/* Speed Controller */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40 font-bold uppercase tracking-wider">Speed:</span>
                {[0.5, 1, 1.5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`px-2.5 py-1 text-xs font-bold cursor-pointer ${
                      speed === s ? 'bg-white/10 text-[#B9FF00]' : 'bg-white/5 text-white/40 hover:text-white'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Exercise Details & Form Steps */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-bold uppercase tracking-wider">
                  {selectedExercise.category}
                </span>
                <span className="text-xs font-bold text-[#B9FF00] flex items-center gap-1">
                  <Flame className="w-4 h-4" /> ~{selectedExercise.caloriesPerMin} cal/min
                </span>
              </div>

              <h3 className="text-2xl font-black italic uppercase text-white mb-2">{selectedExercise.name}</h3>
              <p className="text-xs text-white/50 mb-6 leading-relaxed">
                Targeting <span className="text-[#B9FF00] font-bold">{selectedExercise.primaryMuscle}</span> with support from{' '}
                {selectedExercise.secondaryMuscles.join(', ')}.
              </p>

              {/* Muscle Breakdown Badges */}
              <div className="mb-6 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">Target Muscle Group</div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#B9FF00]/10 border border-[#B9FF00] text-[#B9FF00] text-xs font-bold">
                    🔥 {selectedExercise.primaryMuscle} (Primary)
                  </span>
                  {selectedExercise.secondaryMuscles.map((sec, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-medium">
                      {sec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reps Goal */}
              <div className="p-4 rounded-2xl bg-black border border-white/10 flex items-center justify-between mb-6">
                <span className="text-xs text-white/40 font-bold uppercase tracking-wider">Recommended Routine</span>
                <span className="text-sm font-black italic text-white flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#B9FF00]" /> {selectedExercise.repsTarget}
                </span>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                  <ChevronRight className="w-4 h-4 text-[#B9FF00]" /> Execution Steps
                </h4>
                <ol className="space-y-2.5">
                  {selectedExercise.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs text-white/70 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-[#B9FF00] text-black font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Pro Form Tips */}
              <div className="mt-6 pt-6 border-t border-white/10 space-y-2">
                <div className="text-xs font-bold text-[#B9FF00] uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Pro Form Cues
                </div>
                <ul className="text-xs text-white/50 space-y-1 pl-5 list-disc">
                  {selectedExercise.tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

function drawSquatMechanics(ctx, cx, cy, motionVal, showHeatmap) {
  const headY = cy - 110 + motionVal * 50;
  const hipY = cy - 20 + motionVal * 70;
  const kneeY = cy + 40 + motionVal * 20;
  const ankleY = cy + 100;
  const kneeXOffset = 25 + motionVal * 30;

  ctx.beginPath();
  ctx.arc(cx, headY, 16, 0, Math.PI * 2);
  ctx.fillStyle = '#F8FAFC';
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(cx, headY + 16);
  ctx.lineTo(cx, hipY);
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.stroke();

  const barY = headY + 22;
  ctx.beginPath();
  ctx.moveTo(cx - 80, barY);
  ctx.lineTo(cx + 80, barY);
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 8;
  ctx.stroke();

  ctx.fillStyle = '#E2E8F0';
  ctx.fillRect(cx - 86, barY - 20, 10, 40);
  ctx.fillRect(cx + 76, barY - 20, 10, 40);

  if (showHeatmap && motionVal > 0.2) {
    ctx.shadowColor = '#A3E635';
    ctx.shadowBlur = 20 * motionVal;
  }

  [-1, 1].forEach((dir) => {
    ctx.beginPath();
    ctx.moveTo(cx, hipY);
    ctx.lineTo(cx + dir * kneeXOffset, kneeY);
    ctx.strokeStyle = showHeatmap ? '#A3E635' : '#E2E8F0';
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx + dir * kneeXOffset, kneeY);
    ctx.lineTo(cx + dir * 30, ankleY);
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 12;
    ctx.stroke();
  });

  ctx.shadowBlur = 0;
}

function drawBenchPressMechanics(ctx, cx, cy, motionVal, showHeatmap) {
  ctx.fillStyle = '#1E293B';
  ctx.fillRect(cx - 120, cy + 20, 240, 20);

  const headX = cx - 90;
  const hipX = cx + 50;
  const barY = cy - 80 + motionVal * 80;

  ctx.beginPath();
  ctx.moveTo(headX, cy + 10);
  ctx.lineTo(hipX, cy + 10);
  ctx.strokeStyle = showHeatmap && motionVal > 0.3 ? '#A3E635' : '#38BDF8';
  ctx.lineWidth = 20;
  ctx.lineCap = 'round';
  if (showHeatmap) {
    ctx.shadowColor = '#A3E635';
    ctx.shadowBlur = 15 * motionVal;
  }
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.beginPath();
  ctx.arc(headX - 15, cy + 10, 15, 0, Math.PI * 2);
  ctx.fillStyle = '#F8FAFC';
  ctx.fill();

  const shoulderX = headX + 30;
  const elbowY = cy + 10 + motionVal * 20;

  ctx.beginPath();
  ctx.moveTo(shoulderX, cy + 10);
  ctx.lineTo(shoulderX, elbowY);
  ctx.lineTo(shoulderX, barY);
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 12;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx - 100, barY);
  ctx.lineTo(cx + 100, barY);
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 8;
  ctx.stroke();

  ctx.fillStyle = '#E2E8F0';
  ctx.fillRect(cx - 106, barY - 20, 10, 40);
  ctx.fillRect(cx + 96, barY - 20, 10, 40);
}

function drawDeadliftMechanics(ctx, cx, cy, motionVal, showHeatmap) {
  const hipY = cy - 20 + motionVal * 40;
  const headY = cy - 100 + motionVal * 60;
  const barY = cy + 60 - (1 - motionVal) * 50;

  ctx.beginPath();
  ctx.arc(cx - motionVal * 20, headY, 16, 0, Math.PI * 2);
  ctx.fillStyle = '#F8FAFC';
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(cx - motionVal * 20, headY + 16);
  ctx.lineTo(cx, hipY);
  ctx.strokeStyle = showHeatmap && motionVal > 0.2 ? '#A3E635' : '#38BDF8';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  if (showHeatmap) {
    ctx.shadowColor = '#A3E635';
    ctx.shadowBlur = 15;
  }
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.beginPath();
  ctx.moveTo(cx - 80, barY);
  ctx.lineTo(cx + 80, barY);
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 8;
  ctx.stroke();

  ctx.fillStyle = '#E2E8F0';
  ctx.fillRect(cx - 86, barY - 22, 12, 44);
  ctx.fillRect(cx + 74, barY - 22, 12, 44);

  ctx.beginPath();
  ctx.moveTo(cx - motionVal * 15, headY + 30);
  ctx.lineTo(cx, barY);
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 10;
  ctx.stroke();
}

function drawJumpingMechanics(ctx, cx, cy, motionVal, showHeatmap) {
  const jumpHeight = motionVal * 70;
  const bodyY = cy - jumpHeight;

  ctx.beginPath();
  ctx.arc(cx, bodyY - 80, 16, 0, Math.PI * 2);
  ctx.fillStyle = '#F8FAFC';
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(cx, bodyY - 64);
  ctx.lineTo(cx, bodyY);
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 14;
  ctx.stroke();

  const armAngle = motionVal * Math.PI;
  ctx.beginPath();
  ctx.moveTo(cx, bodyY - 50);
  ctx.lineTo(cx - Math.sin(armAngle) * 50, bodyY - 50 - Math.cos(armAngle) * 40);
  ctx.moveTo(cx, bodyY - 50);
  ctx.lineTo(cx + Math.sin(armAngle) * 50, bodyY - 50 - Math.cos(armAngle) * 40);
  ctx.strokeStyle = showHeatmap ? '#A3E635' : '#E2E8F0';
  ctx.lineWidth = 12;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx, bodyY);
  ctx.lineTo(cx - 20, bodyY + 60);
  ctx.moveTo(cx, bodyY);
  ctx.lineTo(cx + 20, bodyY + 60);
  ctx.strokeStyle = '#64748B';
  ctx.lineWidth = 14;
  ctx.stroke();
}

function drawBicepCurlMechanics(ctx, cx, cy, motionVal, showHeatmap) {
  const elbowY = cy + 20;
  const shoulderY = cy - 60;
  const handY = cy + 60 - motionVal * 90;

  ctx.beginPath();
  ctx.arc(cx, cy - 90, 16, 0, Math.PI * 2);
  ctx.fillStyle = '#F8FAFC';
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(cx, cy - 74);
  ctx.lineTo(cx, cy + 60);
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 16;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx, shoulderY);
  ctx.lineTo(cx + 25, elbowY);
  ctx.strokeStyle = '#64748B';
  ctx.lineWidth = 14;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx + 25, elbowY);
  ctx.lineTo(cx + 25, handY);
  ctx.strokeStyle = showHeatmap && motionVal > 0.3 ? '#A3E635' : '#E2E8F0';
  ctx.lineWidth = 14;
  if (showHeatmap) {
    ctx.shadowColor = '#A3E635';
    ctx.shadowBlur = 20 * motionVal;
  }
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#E2E8F0';
  ctx.beginPath();
  ctx.arc(cx + 25, handY, 12, 0, Math.PI * 2);
  ctx.fill();
}
