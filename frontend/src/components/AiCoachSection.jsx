import React, { useState } from 'react';
import { Bot, Sparkles, Send, Copy, Check, Bookmark, Flame, Zap, RefreshCw, UserCheck, ShieldAlert } from 'lucide-react';
import { apiService } from '../services/api';

export const AiCoachSection = ({ user, onOpenAuth, onSavePlan }) => {
  const [prompt, setPrompt] = useState('');
  const [goal, setGoal] = useState('Hypertrophy & Muscle Gain');
  const [experience, setExperience] = useState('Intermediate');
  const [focusArea, setFocusArea] = useState('Full Body / Powerlifting');

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const presetQueries = [
    'Design a 4-day Upper/Lower hypertrophy split focusing on chest & back.',
    'Calculate macros for a 180lb athlete aiming for clean bulk (300 calorie surplus).',
    'What is the optimal biomechanical form for heavy conventional deadlifts to minimize lower back strain?',
    'Build a 20-minute high-intensity conditioning workout using kettlebells and rowing machine.',
  ];

  const handleGenerate = async (queryToRun) => {
    const finalPrompt = queryToRun || prompt;
    if (!finalPrompt.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setCopied(false);
    setSaved(false);

    try {
      const reply = await apiService.askAiCoach({
        prompt: finalPrompt,
        goal,
        experienceLevel: experience,
        focusArea,
      });

      setResponse(reply);
    } catch (err) {
      console.error('AI Coach Error:', err);
      setErrorMsg(err.message || 'Unable to connect to APEX AI Coach. Please check your network or try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (!user) {
      onOpenAuth();
      return;
    }
    if (!response) return;

    onSavePlan(`AI Strategy: ${goal} (${new Date().toLocaleDateString()})`, response);
    setSaved(true);
  };

  return (
    <section id="ai-coach" className="py-24 bg-black relative overflow-hidden border-t border-white/10">
      {/* Background glow effects */}
      <div className="absolute top-1/2 -left-40 w-96 h-96 bg-[#B9FF00]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B9FF00]/10 border border-[#B9FF00]/30 rounded-full text-[#B9FF00] text-xs font-black uppercase tracking-widest mb-4">
              <Bot className="w-4 h-4" />
              <span>GEMINI 3.6 FLASH POWERED</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black italic uppercase tracking-tight text-white">
              APEX <span className="text-[#B9FF00]">AI ATHLETE COACH</span>
            </h2>
            <p className="text-white/60 max-w-xl text-sm sm:text-base mt-2">
              Instant AI workout programming, macro calculations, exercise form feedback, and sports science analysis personalized to your physiology.
            </p>
          </div>

          {user ? (
            <div className="mt-4 md:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-white/10 rounded-xl text-xs font-bold text-white/80">
              <UserCheck className="w-4 h-4 text-[#B9FF00]" />
              <span>LOGGED IN AS <span className="text-white font-black">{user.name}</span></span>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="mt-4 md:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-[#B9FF00] text-black font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>Log In To Save AI Plans</span>
            </button>
          )}
        </div>

        {/* Main interactive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-zinc-950 border border-white/10 rounded-3xl space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-white/90 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#B9FF00]" />
                Athlete Parameters
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-white/60 font-bold mb-1 uppercase tracking-wider">Primary Objective</label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#B9FF00] cursor-pointer"
                  >
                    <option value="Hypertrophy & Muscle Gain">Hypertrophy & Muscle Gain</option>
                    <option value="Maximum Strength (Powerlifting)">Maximum Strength (Powerlifting)</option>
                    <option value="Fat Loss & Lean Conditioning">Fat Loss & Lean Conditioning</option>
                    <option value="Athletic Mobility & Recovery">Athletic Mobility & Recovery</option>
                    <option value="Caloric & Macro Calculation">Caloric & Macro Calculation</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/60 font-bold mb-1 uppercase tracking-wider">Experience</label>
                    <select
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#B9FF00] cursor-pointer"
                    >
                      <option value="Beginner">Beginner (&lt; 1 yr)</option>
                      <option value="Intermediate">Intermediate (1-3 yrs)</option>
                      <option value="Advanced / Elite">Advanced (&gt; 3 yrs)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/60 font-bold mb-1 uppercase tracking-wider">Focus Area</label>
                    <select
                      value={focusArea}
                      onChange={(e) => setFocusArea(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#B9FF00] cursor-pointer"
                    >
                      <option value="Full Body">Full Body</option>
                      <option value="Upper Body Push/Pull">Upper Body Push/Pull</option>
                      <option value="Legs & Posterior Chain">Legs & Posterior Chain</option>
                      <option value="Core & Conditioning">Core & Conditioning</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Prompt Input Box */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-white/60 mb-1 uppercase tracking-wider">Custom Prompt or Question</label>
                <textarea
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask anything, e.g. 'Build a 3-day workout plan focusing on chest hypertrophy with rep ranges and rest periods...'"
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#B9FF00] resize-none"
                />

                <button
                  onClick={() => handleGenerate()}
                  disabled={loading || !prompt.trim()}
                  className="w-full mt-3 py-3 bg-[#B9FF00] text-black font-black text-xs uppercase tracking-widest rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#B9FF00]/20 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Synthesizing Strategy...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Query AI Coach</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick preset prompts */}
            <div className="p-6 bg-zinc-950/60 border border-white/10 rounded-3xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-white/40 block">Quick Preset Athlete Queries</span>
              <div className="space-y-2">
                {presetQueries.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPrompt(q);
                      handleGenerate(q);
                    }}
                    className="w-full text-left p-3 rounded-xl bg-black/50 border border-white/5 hover:border-[#B9FF00]/40 text-xs text-white/70 hover:text-white transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <span className="line-clamp-1">{q}</span>
                    <Sparkles className="w-3.5 h-3.5 text-white/20 group-hover:text-[#B9FF00] shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Response Output Column */}
          <div className="lg:col-span-7">
            <div className="h-full min-h-[480px] bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#B9FF00] animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-widest text-white/80">APEX AI ATHLETIC ADVISORY OUTPUT</span>
                  </div>

                  {response && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopy}
                        className="px-3 py-1.5 bg-black border border-white/10 rounded-lg text-xs font-bold text-white/70 hover:text-white hover:border-white/30 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-[#B9FF00]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                      </button>

                      <button
                        onClick={handleSave}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          saved
                            ? 'bg-[#B9FF00] text-black'
                            : 'bg-black border border-white/10 text-white/70 hover:text-white hover:border-white/30'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>{saved ? 'Saved to Portal' : 'Save Plan'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {errorMsg && (
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-red-300">Connection Failure</span>
                      <span>{errorMsg}</span>
                    </div>
                  </div>
                )}

                {!response && !loading && !errorMsg && (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto text-[#B9FF00]">
                      <Bot className="w-8 h-8" />
                    </div>
                    <div className="max-w-md mx-auto">
                      <h4 className="text-lg font-bold text-white mb-1">Awaiting Athlete Request</h4>
                      <p className="text-xs text-white/50">
                        Select an objective, customize your parameters, and submit your prompt to receive tailored workout split, nutrition macros, or technique breakdown.
                      </p>
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="py-24 text-center space-y-4">
                    <RefreshCw className="w-10 h-10 text-[#B9FF00] animate-spin mx-auto" />
                    <p className="text-xs font-bold uppercase tracking-widest text-white/60 animate-pulse">
                      Analyzing biomechanics & sports science algorithms...
                    </p>
                  </div>
                )}

                {response && !loading && (
                  <div className="prose prose-invert max-w-none text-xs sm:text-sm text-white/90 leading-relaxed space-y-3 font-sans">
                    {response.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="whitespace-pre-line">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom footer bar */}
              <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40 uppercase tracking-wider font-bold">
                <span>Model: Gemini 3.6 Flash</span>
                <span>Response Time: &lt; 800ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
