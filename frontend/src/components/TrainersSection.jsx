import React, { useState } from 'react';
import { TRAINERS_DATA } from '../data/gymData';
import { Star, Award, Play, MessageSquare, Check, X, Sparkles } from 'lucide-react';

export const TrainersSection = ({ onOpenVideo }) => {
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [consultationSuccess, setConsultationSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', goal: 'Strength & Muscle' });

  const handleBookConsultation = (tr) => {
    setSelectedTrainer(tr);
    setConsultationSuccess(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setConsultationSuccess(true);
  };

  return (
    <section id="trainers" className="py-24 bg-black text-white relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block mb-3">
            <span className="text-[#B9FF00] text-xs font-bold tracking-[0.3em] uppercase border-l-2 border-[#B9FF00] pl-3 flex items-center gap-2">
              <Award className="w-4 h-4" /> World-Class Coaching Staff
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase mb-4">
            MASTER <span className="text-[#B9FF00]">COACHES.</span>
          </h2>
          <p className="text-white/50 text-base sm:text-lg font-light">
            Certified powerlifting champions, mobility specialists, and nutrition scientists dedicated to unlocking your peak physique.
          </p>
        </div>

        {/* Trainers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {TRAINERS_DATA.map((tr) => (
            <div
              key={tr.id}
              className="bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden hover:border-[#B9FF00]/50 transition-all duration-300 flex flex-col justify-between group shadow-2xl"
            >
              <div>
                {/* Photo Header */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={tr.image}
                    alt={tr.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1 text-xs font-black text-[#B9FF00]">
                    <Star className="w-3.5 h-3.5 fill-[#B9FF00]" /> {tr.rating}
                  </div>

                  {/* Video Tip Trigger */}
                  {tr.workoutTipVideoUrl && (
                    <button
                      onClick={() => onOpenVideo(tr.workoutTipVideoUrl, `${tr.name} - Pro Workout Tip`)}
                      className="absolute top-3 left-3 p-2.5 rounded-full bg-black/80 text-white hover:text-[#B9FF00] hover:scale-110 transition-all cursor-pointer border border-white/10"
                      title="Watch Coach Video Tip"
                    >
                      <Play className="w-4 h-4 fill-white hover:fill-[#B9FF00]" />
                    </button>
                  )}

                  {/* Name & Title */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-black italic uppercase text-white group-hover:text-[#B9FF00] transition-colors">
                      {tr.name}
                    </h3>
                    <div className="text-xs font-bold text-[#B9FF00] uppercase tracking-wider">{tr.title}</div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-4">
                  <p className="text-xs text-white/50 leading-relaxed line-clamp-3">
                    {tr.bio}
                  </p>

                  {/* Specialties Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {tr.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full bg-black border border-white/10 text-white/70 text-[11px] font-semibold"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Certifications */}
                  <div className="pt-3 border-t border-white/10 space-y-1">
                    <div className="text-[9px] font-bold uppercase tracking-widest text-white/40">
                      Certifications
                    </div>
                    <div className="text-xs text-white/70 font-medium truncate">
                      {tr.certifications.join(' • ')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Consultation Action */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => handleBookConsultation(tr)}
                  className="w-full py-3 rounded-none bg-white/5 border border-white/10 text-white font-black text-xs hover:bg-[#B9FF00] hover:text-black transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-widest"
                >
                  <MessageSquare className="w-4 h-4" /> Book Session
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Consultation Modal */}
      {selectedTrainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setSelectedTrainer(null)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {!consultationSuccess ? (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="flex items-center gap-2 text-lime-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" /> 1-on-1 Consultation Request
                </div>
                <h3 className="text-xl font-bold text-white">Coach {selectedTrainer.name}</h3>
                <p className="text-xs text-slate-400">
                  {selectedTrainer.title} ({selectedTrainer.experienceYears}+ Yrs Experience)
                </p>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jordan Smith"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-lime-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="jordan@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-lime-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Fitness Goal</label>
                    <select
                      value={formData.goal}
                      onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-lime-400"
                    >
                      <option value="Strength & Muscle">Strength & Heavy Muscle Hypertrophy</option>
                      <option value="Fat Loss & Conditioning">Fat Loss & Conditioning</option>
                      <option value="Mobility & Posture">Mobility & Athletic Recovery</option>
                      <option value="Boxing & Power">Boxing Technique & Agility</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-lime-400 text-slate-950 font-bold text-sm uppercase tracking-wider hover:bg-lime-300 transition-all cursor-pointer mt-4 shadow-lg shadow-lime-400/20"
                >
                  Request Consultation
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-lime-400/20 border border-lime-400/50 text-lime-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Consultation Requested!</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Coach {selectedTrainer.name} will contact you at <span className="text-lime-400 font-semibold">{formData.email}</span> within 24 hours to schedule your session.
                </p>
                <button
                  onClick={() => setSelectedTrainer(null)}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 cursor-pointer"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
