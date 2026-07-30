import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { UserProfileModal } from '../components/UserProfileModal';
import { Footer } from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

export const UserDashboardPage = ({ user, setUser, onDeleteSavedPlan }) => {
  const navigate = useNavigate();
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleLogout = () => {
    apiService.logout();
    setUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#D4AF37] selection:text-black antialiased flex flex-col">
      <Navbar
        user={user}
        onOpenAuth={() => navigate('/')}
        onOpenProfile={() => setProfileModalOpen(true)}
        onLogout={handleLogout}
      />

      <main className="flex-1 pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Render User Dashboard */}
        <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-black font-black text-2xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black italic uppercase text-white">
                    {user?.name || 'ATHLETE DASHBOARD'}
                  </h1>
                  <span className="px-3 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37] text-[#D4AF37] text-[10px] font-black uppercase tracking-widest">
                    USER PORTAL
                  </span>
                </div>
                <p className="text-xs text-white/50">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={() => {
                apiService.logout();
                setUser(null);
                navigate('/');
              }}
              className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-xs uppercase tracking-wider hover:bg-red-500 hover:text-white transition-all cursor-pointer self-start sm:self-auto"
            >
              Sign Out
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-black border border-white/10 space-y-1">
              <div className="text-xs text-white/40 font-bold uppercase">Membership Tier</div>
              <div className="text-lg font-black text-[#F5D76E]">{user?.membershipPlan || 'PRO ATHLETE PASS'}</div>
            </div>
            <div className="p-5 rounded-2xl bg-black border border-white/10 space-y-1">
              <div className="text-xs text-white/40 font-bold uppercase">24/7 Facility Keycard</div>
              <div className="text-lg font-black text-emerald-400">ACTIVE & VERIFIED</div>
            </div>
            <div className="p-5 rounded-2xl bg-black border border-white/10 space-y-1">
              <div className="text-xs text-white/40 font-bold uppercase">Saved Workout Plans</div>
              <div className="text-lg font-black text-white">{user?.savedPlans?.length || 0} Plans</div>
            </div>
          </div>

          {/* Saved Plans Listing */}
          <div className="space-y-4">
            <h3 className="text-lg font-black italic uppercase text-white">Your Saved Fitness Plans</h3>
            {!user?.savedPlans || user.savedPlans.length === 0 ? (
              <div className="p-8 rounded-2xl bg-black border border-white/5 text-center italic text-xs text-white/40">
                No saved workout or nutrition plans yet. Use the AI Fitness Coach to generate and save plans.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.savedPlans.map((plan) => (
                  <div key={plan.id} className="p-5 rounded-2xl bg-black border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white uppercase">{plan.title}</h4>
                      <button
                        onClick={() => onDeleteSavedPlan && onDeleteSavedPlan(plan.id)}
                        className="text-white/30 hover:text-red-400 text-xs font-bold"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="text-xs text-white/70">{plan.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={user}
        onLogout={handleLogout}
        onDeleteSavedPlan={onDeleteSavedPlan}
      />
    </div>
  );
};
