import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminPortalModal } from '../components/AdminPortalModal';
import { apiService } from '../services/api';

export const AdminDashboardPage = ({ currentAdmin, setAdmin }) => {
  const [adminUser, setAdminUser] = useState(currentAdmin || null);
  const [loading, setLoading] = useState(!currentAdmin);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    const fetchAdminInfo = async () => {
      try {
        const profile = await apiService.getAdminProfile();
        if (active) {
          setAdminUser(profile);
          if (setAdmin) setAdmin(profile);
        }
      } catch (err) {
        console.error('Failed to verify admin profile:', err);
        apiService.adminLogout();
        navigate('/admin/login');
      } finally {
        if (active) setLoading(false);
      }
    };

    if (!currentAdmin) {
      fetchAdminInfo();
    } else {
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [currentAdmin, navigate, setAdmin]);

  const handleLogout = () => {
    apiService.adminLogout();
    if (setAdmin) setAdmin(null);
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-white/50 uppercase tracking-widest font-mono">Authenticating Admin Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#D4AF37] selection:text-black">
      <AdminPortalModal
        isOpen={true}
        onClose={() => navigate('/admin/login')}
        currentUser={adminUser}
        onLogout={handleLogout}
      />
    </div>
  );
};
