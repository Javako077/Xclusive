import React from 'react';
import { AdminPortalModal } from '../components/AdminPortalModal';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

export const AdminDashboardPage = ({ user, setUser }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#D4AF37] selection:text-black">
      <AdminPortalModal
        isOpen={true}
        onClose={() => navigate('/dashboard')}
        currentUser={user}
        onLogout={() => {
          apiService.logout();
          setUser(null);
          navigate('/');
        }}
      />
    </div>
  );
};
