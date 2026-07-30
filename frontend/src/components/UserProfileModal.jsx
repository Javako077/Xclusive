import React from 'react';
import { X, Bookmark, LogOut, Calendar, Award, Trash2 } from 'lucide-react';

export const UserProfileModal = ({
  isOpen,
  onClose,
  user,
  onLogout,
  onDeleteSavedPlan,
  loading = false,
}) => {
  if (!isOpen) return null;

  const displayUser = user || {
    name: 'Athlete Member',
    email: 'athlete@xclusivegym.com',
    membershipPlan: 'VIP PRO PASS',
    joinDate: '2026',
    savedPlans: [],
  };

  const isLoadingState = loading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-zinc-950 border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-black/50 border border-white/10 text-white/50 hover:text-white transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {isLoadingState ? (
          /* ========================================================= */
          /* SKELETON LOADING STATE (FAST & HIGH-END SHIMMER) */
          /* ========================================================= */
          <div className="animate-pulse space-y-6 py-2">
            {/* Header Skeleton */}
            <div className="flex items-center gap-4 pb-6 border-b border-white/10">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-[#D4AF37]/20 shrink-0" />
              <div className="space-y-2.5 flex-1">
                <div className="h-6 w-44 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 rounded-lg" />
                <div className="h-3 w-56 bg-zinc-900/80 rounded-md" />
                <div className="h-3 w-36 bg-zinc-900/50 rounded-md" />
              </div>
            </div>

            {/* Saved Plans Skeleton */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-4 w-48 bg-zinc-900 rounded-md" />
                <div className="h-3 w-16 bg-zinc-900/60 rounded-md" />
              </div>
              <div className="p-4 h-24 rounded-2xl bg-zinc-900/50 border border-white/5 space-y-2">
                <div className="h-4 w-32 bg-zinc-800 rounded-md" />
                <div className="h-3 w-full bg-zinc-900/70 rounded-md" />
                <div className="h-3 w-2/3 bg-zinc-900/40 rounded-md" />
              </div>
              <div className="p-4 h-20 rounded-2xl bg-zinc-900/30 border border-white/5 space-y-2">
                <div className="h-4 w-28 bg-zinc-800/80 rounded-md" />
                <div className="h-3 w-3/4 bg-zinc-900/50 rounded-md" />
              </div>
            </div>

            {/* Footer Actions Skeleton */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <div className="h-3.5 w-40 bg-zinc-900/60 rounded-md" />
              <div className="h-9 w-28 bg-red-950/30 border border-red-500/20 rounded-xl" />
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* LOADED USER PROFILE CONTENT */
          /* ========================================================= */
          <>
            {/* User Header */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-black font-black text-2xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/20 shrink-0">
                {displayUser.name ? displayUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black italic uppercase text-white">{displayUser.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37] text-[#D4AF37] text-[9px] font-black uppercase tracking-widest">
                    VERIFIED ATHLETE
                  </span>
                </div>
                <p className="text-xs text-white/50">{displayUser.email}</p>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-white/40 uppercase tracking-wider font-bold">
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-[#D4AF37]" /> {displayUser.membershipPlan || 'VIP PRO PASS'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-white/40" /> Member since {displayUser.joinDate || '2026'}
                  </span>
                </div>
              </div>
            </div>

            {/* Saved Workout Plans */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-black italic uppercase text-white flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-[#D4AF37]" /> Saved Workout & Nutrition Plans
                </h4>
                <span className="text-xs text-white/40 font-bold">{displayUser.savedPlans?.length || 0} Saved</span>
              </div>

              {!displayUser.savedPlans || displayUser.savedPlans.length === 0 ? (
                <div className="p-6 rounded-2xl bg-black border border-white/5 text-center">
                  <p className="text-xs text-white/40 mb-2">No saved plans yet.</p>
                  <p className="text-[11px] text-white/30">
                    Save custom workout & nutrition plans to store them here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {displayUser.savedPlans.map((plan) => (
                    <div key={plan.id} className="p-4 rounded-2xl bg-black border border-white/10 flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs font-bold text-white uppercase">{plan.title}</div>
                        <div className="text-[10px] text-white/40 mt-0.5">{plan.createdAt}</div>
                        <p className="text-[11px] text-white/70 line-clamp-2 mt-2 leading-relaxed">
                          {plan.content}
                        </p>
                      </div>
                      {onDeleteSavedPlan && (
                        <button
                          onClick={() => onDeleteSavedPlan(plan.id)}
                          className="p-1.5 rounded-lg bg-zinc-900 text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Delete Plan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <div className="text-xs text-white/40">
                24/7 Facility Keycard: <span className="text-[#D4AF37] font-bold">ACTIVE</span>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all cursor-pointer flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
