import React from 'react';
import { X, Bookmark, LogOut, Calendar, Award, Trash2 } from 'lucide-react';

export const UserProfileModal = ({
  isOpen,
  onClose,
  user,
  onLogout,
  onDeleteSavedPlan,
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-black/50 border border-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
          <div className="w-16 h-16 rounded-2xl bg-[#B9FF00] text-black font-black text-2xl flex items-center justify-center shadow-lg shadow-[#B9FF00]/20">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-black italic uppercase text-white">{user.name}</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-[#B9FF00]/10 border border-[#B9FF00] text-[#B9FF00] text-[9px] font-black uppercase tracking-widest">
                VERIFIED ATHLETE
              </span>
            </div>
            <p className="text-xs text-white/50">{user.email}</p>
            <div className="flex items-center gap-3 mt-2 text-[10px] text-white/40 uppercase tracking-wider font-bold">
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-[#B9FF00]" /> {user.membershipPlan || 'VIP PRO PASS'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-white/40" /> Member since {user.joinDate || '2026'}
              </span>
            </div>
          </div>
        </div>

        {/* Saved AI Workout Plans */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-black italic uppercase text-white flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-[#B9FF00]" /> Saved AI Workout & Nutrition Plans
            </h4>
            <span className="text-xs text-white/40 font-bold">{user.savedPlans?.length || 0} Saved</span>
          </div>

          {!user.savedPlans || user.savedPlans.length === 0 ? (
            <div className="p-6 rounded-2xl bg-black border border-white/5 text-center">
              <p className="text-xs text-white/40 mb-2">No saved plans yet.</p>
              <p className="text-[11px] text-white/30">
                Generate a routine with <span className="text-[#B9FF00]">APEX AI Coach</span> and click "Save Plan" to store it here.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {user.savedPlans.map((plan) => (
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
            24/7 Facility Keycard: <span className="text-[#B9FF00] font-bold">ACTIVE</span>
          </div>
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="px-5 py-2.5 rounded-none bg-red-500/10 border border-red-500/30 text-red-400 font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all cursor-pointer flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
