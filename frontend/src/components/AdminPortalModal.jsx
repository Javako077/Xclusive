import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldAlert,
  Users,
  Calendar,
  MessageSquare,
  DollarSign,
  Search,
  Trash2,
  UserCheck,
  UserX,
  RefreshCw,
  Award,
  Clock,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  FileText,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  Plus,
  Check,
  Ban,
  TrendingUp,
  Activity,
  Megaphone,
  Radio,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { apiService } from '../services/api';

export const AdminPortalModal = ({ isOpen, onClose, currentUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'roles' | 'bookings' | 'content' | 'analytics' | 'notifications' | 'settings'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Data states
  const [statsData, setStatsData] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);
  const [contactsList, setContactsList] = useState([]);
  const [contentList, setContentList] = useState([]);
  const [notificationsList, setNotificationsList] = useState([]);
  const [reportsData, setReportsData] = useState(null);

  // Form states
  const [userSearch, setUserSearch] = useState('');
  const [bookingSearch, setBookingSearch] = useState('');
  
  // Content form
  const [contentTitle, setContentTitle] = useState('');
  const [contentCategory, setContentCategory] = useState('announcement');
  const [contentBody, setContentBody] = useState('');

  // Notification form
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifAudience, setNotifAudience] = useState('all');
  const [notifType, setNotifType] = useState('info');

  // Settings state
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);

  const loadAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, usersRes, bookingsRes, contactsRes, contentRes, notifRes, reportsRes] = await Promise.allSettled([
        apiService.getAdminStats(),
        apiService.getAdminUsers(),
        apiService.getAdminBookings(),
        apiService.getAdminContacts(),
        apiService.fetchAdminContent(),
        apiService.fetchAdminNotifications(),
        apiService.fetchAdminReports(),
      ]);

      if (statsRes.status === 'fulfilled') setStatsData(statsRes.value);
      if (usersRes.status === 'fulfilled') setUsersList(usersRes.value || []);
      if (bookingsRes.status === 'fulfilled') setBookingsList(bookingsRes.value || []);
      if (contactsRes.status === 'fulfilled') setContactsList(contactsRes.value || []);
      if (contentRes.status === 'fulfilled') setContentList(contentRes.value || []);
      if (notifRes.status === 'fulfilled') setNotificationsList(notifRes.value || []);
      if (reportsRes.status === 'fulfilled') setReportsData(reportsRes.value || null);
    } catch (err) {
      console.error('Failed loading admin portal data:', err);
      setError('Unable to retrieve admin data. Please ensure the Express backend is running.');
    } fontally: {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadAdminData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handlers for user management
  const handleRoleChange = async (userId, newRole) => {
    try {
      await apiService.updateAdminUserRole(userId, newRole);
      setUsersList((prev) =>
        prev.map((u) => (u._id === userId || u.id === userId ? { ...u, role: newRole } : u))
      );
      setSuccessMsg(`Role updated to ${newRole.toUpperCase()}`);
      setTimeout(() => setSuccessMsg(null), 2500);
    } catch (err) {
      setError(err.message || 'Failed to update user role');
    }
  };

  const handleToggleBlock = async (userId) => {
    try {
      const res = await apiService.toggleBlockAdminUser(userId);
      setUsersList((prev) =>
        prev.map((u) => (u._id === userId || u.id === userId ? { ...u, isBlocked: res.isBlocked } : u))
      );
      setSuccessMsg(res.message);
      setTimeout(() => setSuccessMsg(null), 2500);
    } catch (err) {
      setError(err.message || 'Failed to toggle block status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user account?')) return;
    try {
      await apiService.deleteAdminUser(userId);
      setUsersList((prev) => prev.filter((u) => u._id !== userId && u.id !== userId));
      setSuccessMsg('User account deleted');
      setTimeout(() => setSuccessMsg(null), 2500);
    } catch (err) {
      setError(err.message || 'Failed to delete user');
    }
  };

  // Booking handlers
  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      await apiService.updateAdminBookingStatus(bookingId, status);
      setBookingsList((prev) =>
        prev.map((b) => (b._id === bookingId || b.id === bookingId ? { ...b, status } : b))
      );
      setSuccessMsg(`Booking status set to ${status.toUpperCase()}`);
      setTimeout(() => setSuccessMsg(null), 2500);
    } catch (err) {
      setError(err.message || 'Failed to update booking status');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to remove this booking record?')) return;
    try {
      await apiService.deleteAdminBooking(bookingId);
      setBookingsList((prev) => prev.filter((b) => b._id !== bookingId && b.id !== bookingId));
      setSuccessMsg('Booking removed');
      setTimeout(() => setSuccessMsg(null), 2500);
    } catch (err) {
      setError(err.message || 'Failed to delete booking');
    }
  };

  // Content handlers
  const handleCreateContent = async (e) => {
    e.preventDefault();
    if (!contentTitle || !contentBody) return;
    try {
      const res = await apiService.createAdminContent({
        title: contentTitle,
        category: contentCategory,
        body: contentBody,
      });
      setContentList([res.content, ...contentList]);
      setContentTitle('');
      setContentBody('');
      setSuccessMsg('Website content item created and published!');
      setTimeout(() => setSuccessMsg(null), 2500);
    } catch (err) {
      setError(err.message || 'Failed to publish content');
    }
  };

  const handleDeleteContent = async (id) => {
    try {
      await apiService.deleteAdminContent(id);
      setContentList((prev) => prev.filter((c) => c._id !== id && c.id !== id));
      setSuccessMsg('Content item removed');
      setTimeout(() => setSuccessMsg(null), 2500);
    } catch (err) {
      setError(err.message || 'Failed to remove content');
    }
  };

  // Notification handlers
  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!notifTitle || !notifMessage) return;
    try {
      const res = await apiService.sendAdminNotification({
        title: notifTitle,
        message: notifMessage,
        targetAudience: notifAudience,
        type: notifType,
      });
      setNotificationsList([res.notification, ...notificationsList]);
      setNotifTitle('');
      setNotifMessage('');
      setSuccessMsg('System announcement broadcasted successfully!');
      setTimeout(() => setSuccessMsg(null), 2500);
    } catch (err) {
      setError(err.message || 'Failed to send notification');
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await apiService.deleteAdminNotification(id);
      setNotificationsList((prev) => prev.filter((n) => n._id !== id && n.id !== id));
      setSuccessMsg('Notification entry deleted');
      setTimeout(() => setSuccessMsg(null), 2500);
    } catch (err) {
      setError(err.message || 'Failed to delete notification');
    }
  };

  // Filtered Lists
  const filteredUsers = usersList.filter(
    (u) =>
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.phone?.includes(userSearch)
  );

  const filteredBookings = bookingsList.filter(
    (b) =>
      b.fullName?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.email?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.slotTime?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.date?.includes(bookingSearch)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-zinc-950 border border-[#D4AF37]/40 rounded-3xl shadow-[0_0_60px_rgba(212,175,55,0.15)] text-white h-[92vh] flex flex-col overflow-hidden">
        
        {/* TOP BAR */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-zinc-950/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] p-0.5 shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center">
              <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#F5D76E]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black italic uppercase tracking-tight text-white">
                  ENTERPRISE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16]">ADMIN DASHBOARD</span>
                </h3>
                <span className="px-2 py-0.5 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F5D76E] text-[9px] font-black uppercase tracking-widest">
                  JWT SECURED
                </span>
              </div>
              <p className="text-[11px] text-white/40">Complete platform governance, member administration, and live telemetry</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadAdminData}
              disabled={loading}
              className="p-2 rounded-xl bg-black border border-white/10 hover:border-[#D4AF37] text-white/70 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#D4AF37]' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {onLogout && (
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                title="Logout Admin Session"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-black border border-white/10 hover:border-white/30 text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MAIN BODY: SIDEBAR + CONTENT */}
        <div className="flex flex-1 overflow-hidden">
          {/* SIDEBAR NAVIGATION */}
          <div className="w-48 sm:w-56 bg-black border-r border-white/10 p-3 space-y-1 overflow-y-auto shrink-0">
            <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white/30">
              Core Modules
            </div>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black shadow-lg shadow-[#D4AF37]/20'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Activity className="w-4 h-4 shrink-0" /> Overview
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black shadow-lg shadow-[#D4AF37]/20'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 shrink-0" /> Users
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10">{usersList.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('roles')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'roles'
                  ? 'bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black shadow-lg shadow-[#D4AF37]/20'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Shield className="w-4 h-4 shrink-0" /> Roles Matrix
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'bookings'
                  ? 'bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black shadow-lg shadow-[#D4AF37]/20'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 shrink-0" /> Bookings
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10">{bookingsList.length}</span>
            </button>

            <div className="px-3 pt-4 pb-1 text-[10px] font-black uppercase tracking-widest text-white/30">
              Content & Tools
            </div>

            <button
              onClick={() => setActiveTab('content')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'content'
                  ? 'bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black shadow-lg shadow-[#D4AF37]/20'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" /> Content CMS
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black shadow-lg shadow-[#D4AF37]/20'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart3 className="w-4 h-4 shrink-0" /> Analytics
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'notifications'
                  ? 'bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black shadow-lg shadow-[#D4AF37]/20'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Bell className="w-4 h-4 shrink-0" /> Broadcasts
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black shadow-lg shadow-[#D4AF37]/20'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" /> Settings
            </button>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto bg-zinc-950 space-y-6">
            {/* Status Messages */}
            {error && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#F5D76E] text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#D4AF37]" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* ========================================================= */}
            {/* 1. OVERVIEW TAB */}
            {/* ========================================================= */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 bg-gradient-to-b from-zinc-900 to-black border border-white/10 rounded-2xl">
                    <div className="flex items-center justify-between text-white/50 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
                      <Users className="w-5 h-5 text-[#F5D76E]" />
                    </div>
                    <div className="text-3xl font-black text-white">{statsData?.stats?.totalUsers ?? usersList.length}</div>
                    <div className="text-[11px] text-[#D4AF37] mt-1 flex items-center gap-1 font-medium">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Active Member Base
                    </div>
                  </div>

                  <div className="p-5 bg-gradient-to-b from-zinc-900 to-black border border-white/10 rounded-2xl">
                    <div className="flex items-center justify-between text-white/50 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Bookings & Orders</span>
                      <Calendar className="w-5 h-5 text-[#F5D76E]" />
                    </div>
                    <div className="text-3xl font-black text-white">{statsData?.stats?.totalBookings ?? bookingsList.length}</div>
                    <div className="text-[11px] text-white/50 mt-1 font-medium">Scheduled Fitness Sessions</div>
                  </div>

                  <div className="p-5 bg-gradient-to-b from-zinc-900 to-black border border-[#D4AF37]/30 rounded-2xl bg-[#D4AF37]/5">
                    <div className="flex items-center justify-between text-white/50 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#F5D76E]">Total Revenue</span>
                      <DollarSign className="w-5 h-5 text-[#F5D76E]" />
                    </div>
                    <div className="text-3xl font-black text-[#F5D76E]">
                      ${statsData?.stats?.estimatedRevenue ?? bookingsList.length * 149 + usersList.length * 199}
                    </div>
                    <div className="text-[11px] text-[#D4AF37] mt-1 font-medium">Gross Platform Revenue</div>
                  </div>

                  <div className="p-5 bg-gradient-to-b from-zinc-900 to-black border border-white/10 rounded-2xl">
                    <div className="flex items-center justify-between text-white/50 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Blocked Accounts</span>
                      <Ban className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="text-3xl font-black text-red-400">
                      {usersList.filter((u) => u.isBlocked).length}
                    </div>
                    <div className="text-[11px] text-red-400/80 mt-1 font-medium">Suspended Access Records</div>
                  </div>
                </div>

                {/* Quick Feeds */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Bookings */}
                  <div className="p-5 bg-black border border-white/10 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#F5D76E]" /> Recent Bookings & Orders
                      </h4>
                      <button onClick={() => setActiveTab('bookings')} className="text-xs text-[#F5D76E] hover:underline font-bold">
                        View All
                      </button>
                    </div>

                    {bookingsList.length === 0 ? (
                      <p className="text-xs text-white/40 italic py-4 text-center">No bookings recorded yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {bookingsList.slice(0, 4).map((b) => (
                          <div key={b._id || b.id} className="p-3 bg-zinc-950 border border-white/5 rounded-xl flex items-center justify-between text-xs">
                            <div>
                              <div className="font-bold text-white">{b.fullName}</div>
                              <div className="text-[10px] text-white/40">{b.planName || 'Trial Pass'} • {b.slotTime}</div>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              b.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}>
                              {b.status || 'Approved'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Registered Users */}
                  <div className="p-5 bg-black border border-white/10 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#F5D76E]" /> Active Members
                      </h4>
                      <button onClick={() => setActiveTab('users')} className="text-xs text-[#F5D76E] hover:underline font-bold">
                        Manage Users
                      </button>
                    </div>

                    {usersList.length === 0 ? (
                      <p className="text-xs text-white/40 italic py-4 text-center">No registered users yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {usersList.slice(0, 4).map((u) => (
                          <div key={u._id || u.id} className="p-3 bg-zinc-950 border border-white/5 rounded-xl flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-xs font-black text-[#F5D76E]">
                                {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <div>
                                <div className="font-bold text-white">{u.name}</div>
                                <div className="text-[10px] text-white/40">{u.email}</div>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-[#D4AF37]/10 text-[#F5D76E] text-[10px] font-bold uppercase">
                              {u.role || 'USER'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 2. USER MANAGEMENT TAB (VIEW, SEARCH, EDIT, DELETE, BLOCK) */}
            {/* ========================================================= */}
            {activeTab === 'users' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black uppercase tracking-wider text-white">User & Access Governance</h4>
                  <span className="text-xs text-white/50">{filteredUsers.length} total athletes found</span>
                </div>

                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search users by name, email, phone number..."
                    className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="overflow-x-auto border border-white/10 rounded-2xl bg-black">
                  <table className="w-full text-left text-xs text-white/70">
                    <thead className="bg-zinc-950 text-[11px] font-black uppercase tracking-wider text-white/40 border-b border-white/10">
                      <tr>
                        <th className="p-3.5">Athlete</th>
                        <th className="p-3.5">Contact</th>
                        <th className="p-3.5">Role</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-white/40 italic">
                            No users match your query.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u) => (
                          <tr key={u._id || u.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-3.5 font-bold text-white">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-xs font-black text-[#F5D76E]">
                                  {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div>
                                  <div>{u.name}</div>
                                  <div className="text-[10px] text-white/40 font-normal">{u.membershipPlan || 'PRO ATHLETE PASS'}</div>
                                </div>
                              </div>
                            </td>

                            <td className="p-3.5 text-white/60">
                              <div className="flex flex-col gap-0.5">
                                <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-white/30" /> {u.email}</span>
                                {u.phone && <span className="flex items-center gap-1 text-[11px] text-white/40"><Phone className="w-3 h-3 text-white/30" /> {u.phone}</span>}
                              </div>
                            </td>

                            <td className="p-3.5">
                              <select
                                value={u.role || 'user'}
                                onChange={(e) => handleRoleChange(u._id || u.id, e.target.value)}
                                className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs font-bold cursor-pointer focus:border-[#D4AF37]"
                              >
                                <option value="user">USER</option>
                                <option value="staff">STAFF</option>
                                <option value="admin">ADMIN</option>
                              </select>
                            </td>

                            <td className="p-3.5">
                              <button
                                onClick={() => handleToggleBlock(u._id || u.id)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all ${
                                  u.isBlocked
                                    ? 'bg-red-500/20 border border-red-500/40 text-red-400'
                                    : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                                }`}
                              >
                                {u.isBlocked ? <Ban className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                                {u.isBlocked ? 'BLOCKED' : 'ACTIVE'}
                              </button>
                            </td>

                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => handleDeleteUser(u._id || u.id)}
                                className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                                title="Delete user"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 3. ROLE MANAGEMENT & PERMISSIONS TAB */}
            {/* ========================================================= */}
            {activeTab === 'roles' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black uppercase tracking-wider text-white">Role & Access Permissions Matrix</h4>
                  <span className="text-xs text-[#F5D76E]">RBAC Authorization Model</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* ADMIN ROLE CARD */}
                  <div className="p-5 bg-gradient-to-b from-zinc-900 to-black border border-[#D4AF37]/50 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#F5D76E] text-xs font-black uppercase">
                        ADMINISTRATOR
                      </span>
                      <Shield className="w-5 h-5 text-[#F5D76E]" />
                    </div>
                    <p className="text-xs text-white/60">Full unrestricted control over system settings, user roles, financial data, and content CMS.</p>
                    <ul className="text-xs space-y-1.5 text-white/80 pt-2 border-t border-white/10">
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Manage User Roles & Accounts</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Block/Unblock User Access</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Approve / Reject Bookings</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Website CMS & Notifications</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Revenue & Financial Reports</li>
                    </ul>
                  </div>

                  {/* STAFF ROLE CARD */}
                  <div className="p-5 bg-gradient-to-b from-zinc-900 to-black border border-blue-500/40 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500 text-blue-400 text-xs font-black uppercase">
                        STAFF / TRAINER
                      </span>
                      <Users className="w-5 h-5 text-blue-400" />
                    </div>
                    <p className="text-xs text-white/60">Operational access for managing class schedules, member bookings, and client inquiry responses.</p>
                    <ul className="text-xs space-y-1.5 text-white/80 pt-2 border-t border-white/10">
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> View Registered Athletes</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Approve / Update Bookings</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> View Contact Inquiries</li>
                      <li className="flex items-center gap-2"><X className="w-3.5 h-3.5 text-red-400" /> Role Promotion/Demotion</li>
                      <li className="flex items-center gap-2"><X className="w-3.5 h-3.5 text-red-400" /> Account Deletion Rights</li>
                    </ul>
                  </div>

                  {/* USER ROLE CARD */}
                  <div className="p-5 bg-gradient-to-b from-zinc-900 to-black border border-white/10 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/70 text-xs font-black uppercase">
                        ATHLETE / USER
                      </span>
                      <UserCheck className="w-5 h-5 text-white/50" />
                    </div>
                    <p className="text-xs text-white/60">Standard client access to book gym trials, view training plans, and message support.</p>
                    <ul className="text-xs space-y-1.5 text-white/80 pt-2 border-t border-white/10">
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Book Class Slots & Trials</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Access AI Fitness Coach</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Save Personal Workout Plans</li>
                      <li className="flex items-center gap-2"><X className="w-3.5 h-3.5 text-red-400" /> Access Admin Console</li>
                      <li className="flex items-center gap-2"><X className="w-3.5 h-3.5 text-red-400" /> Modify System Settings</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 4. BOOKING MANAGEMENT TAB (VIEW, APPROVE, REJECT, CANCEL) */}
            {/* ========================================================= */}
            {activeTab === 'bookings' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black uppercase tracking-wider text-white">Booking Approval & Slot Management</h4>
                  <span className="text-xs text-[#F5D76E]">{filteredBookings.length} bookings total</span>
                </div>

                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    placeholder="Filter bookings by name, slot time, or date..."
                    className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="overflow-x-auto border border-white/10 rounded-2xl bg-black">
                  <table className="w-full text-left text-xs text-white/70">
                    <thead className="bg-zinc-950 text-[11px] font-black uppercase tracking-wider text-white/40 border-b border-white/10">
                      <tr>
                        <th className="p-3.5">Athlete</th>
                        <th className="p-3.5">Session Date & Time</th>
                        <th className="p-3.5">Pass Type</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Approve / Reject</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredBookings.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-white/40 italic">
                            No bookings matching query.
                          </td>
                        </tr>
                      ) : (
                        filteredBookings.map((b) => (
                          <tr key={b._id || b.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-3.5 font-bold text-white">
                              <div>{b.fullName}</div>
                              <div className="text-[10px] text-white/40">{b.email}</div>
                            </td>

                            <td className="p-3.5 font-medium">
                              <div>{b.date}</div>
                              <div className="text-[10px] text-[#F5D76E]">{b.slotTime}</div>
                            </td>

                            <td className="p-3.5">
                              <span className="uppercase text-[10px] font-bold text-white/80">{b.planName || 'Trial Pass'}</span>
                            </td>

                            <td className="p-3.5">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                                b.status === 'approved'
                                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                                  : b.status === 'rejected'
                                  ? 'bg-red-500/15 border border-red-500/30 text-red-400'
                                  : 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
                              }`}>
                                {b.status || 'approved'}
                              </span>
                            </td>

                            <td className="p-3.5 text-right space-x-1">
                              <button
                                onClick={() => handleUpdateBookingStatus(b._id || b.id, 'approved')}
                                className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all text-[10px] font-bold uppercase cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleUpdateBookingStatus(b._id || b.id, 'rejected')}
                                className="px-2 py-1 rounded bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all text-[10px] font-bold uppercase cursor-pointer"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => handleDeleteBooking(b._id || b.id)}
                                className="p-1 rounded bg-zinc-800 text-white/40 hover:text-red-400 cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 5. CONTENT MANAGEMENT (CMS) TAB */}
            {/* ========================================================= */}
            {activeTab === 'content' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black uppercase tracking-wider text-white">Website Content Management System (CMS)</h4>
                  <span className="text-xs text-[#F5D76E]">{contentList.length} items published</span>
                </div>

                {/* Create Content Form */}
                <form onSubmit={handleCreateContent} className="p-5 bg-black border border-white/10 rounded-2xl space-y-4">
                  <h5 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                    <Plus className="w-4 h-4 text-[#F5D76E]" /> Publish Announcement or Promotional Banner
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold uppercase text-white/50 mb-1">Title</label>
                      <input
                        type="text"
                        required
                        value={contentTitle}
                        onChange={(e) => setContentTitle(e.target.value)}
                        placeholder="e.g. Summer Hypertrophy Camp Launch!"
                        className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-white/50 mb-1">Category</label>
                      <select
                        value={contentCategory}
                        onChange={(e) => setContentCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                      >
                        <option value="announcement">Announcement</option>
                        <option value="banner">Banner</option>
                        <option value="class">Class Update</option>
                        <option value="facility">Facility Highlight</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-white/50 mb-1">Body Description</label>
                    <textarea
                      rows={2}
                      required
                      value={contentBody}
                      onChange={(e) => setContentBody(e.target.value)}
                      placeholder="Write announcement or promotional banner details..."
                      className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-xs uppercase tracking-widest rounded-xl hover:opacity-90 cursor-pointer flex items-center gap-1.5 shadow-lg shadow-[#D4AF37]/10"
                  >
                    <Plus className="w-4 h-4" /> Publish to Website
                  </button>
                </form>

                {/* Published Content List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contentList.length === 0 ? (
                    <div className="col-span-full p-8 text-center text-white/40 border border-white/10 rounded-2xl bg-black italic">
                      No CMS content items published yet.
                    </div>
                  ) : (
                    contentList.map((item) => (
                      <div key={item._id || item.id} className="p-4 bg-black border border-white/10 rounded-2xl space-y-2 relative">
                        <div className="flex items-start justify-between">
                          <span className="px-2 py-0.5 rounded bg-[#D4AF37]/10 text-[#F5D76E] text-[10px] font-bold uppercase">
                            {item.category}
                          </span>
                          <button
                            onClick={() => handleDeleteContent(item._id || item.id)}
                            className="text-white/40 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <h4 className="text-sm font-bold text-white">{item.title}</h4>
                        <p className="text-xs text-white/70">{item.body}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 6. REPORTS & ANALYTICS TAB */}
            {/* ========================================================= */}
            {activeTab === 'analytics' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black uppercase tracking-wider text-white">Telemetry & Business Analytics Reports</h4>
                  <span className="text-xs text-emerald-400 font-bold">+24.5% MoM Growth</span>
                </div>

                {/* Revenue Visual Chart (SVG Bar Chart) */}
                <div className="p-5 bg-black border border-white/10 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-[#F5D76E]" /> Monthly Revenue Velocity ($)
                    </h5>
                    <span className="text-xs text-[#F5D76E] font-bold">YTD Total: $55,600</span>
                  </div>

                  <div className="h-44 flex items-end justify-between gap-3 pt-6 px-4 border-b border-white/10">
                    {[
                      { month: 'Jan', revenue: 4200 },
                      { month: 'Feb', revenue: 5800 },
                      { month: 'Mar', revenue: 7100 },
                      { month: 'Apr', revenue: 6400 },
                      { month: 'May', revenue: 8900 },
                      { month: 'Jun', revenue: 10400 },
                      { month: 'Jul', revenue: 12800 },
                    ].map((item) => {
                      const heightPercent = Math.round((item.revenue / 13000) * 100);
                      return (
                        <div key={item.month} className="flex-1 flex flex-col items-center gap-2 group">
                          <span className="text-[10px] text-[#F5D76E] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            ${item.revenue}
                          </span>
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className="w-full bg-gradient-to-t from-[#9A6B16] via-[#D4AF37] to-[#F5D76E] rounded-t-lg shadow-lg shadow-[#D4AF37]/20 group-hover:brightness-125 transition-all"
                          />
                          <span className="text-[10px] text-white/50 font-bold uppercase">{item.month}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Growth & Distribution Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 bg-black border border-white/10 rounded-2xl space-y-3">
                    <h5 className="text-xs font-black uppercase tracking-wider text-white">Membership Pass Distribution</h5>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs text-white/70 mb-1">
                          <span>Pro Athlete Pass</span>
                          <span className="font-bold text-[#F5D76E]">55%</span>
                        </div>
                        <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                          <div className="w-[55%] h-full bg-[#D4AF37]" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-white/70 mb-1">
                          <span>Trial Pass</span>
                          <span className="font-bold text-emerald-400">30%</span>
                        </div>
                        <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                          <div className="w-[30%] h-full bg-emerald-400" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-white/70 mb-1">
                          <span>VIP Pass</span>
                          <span className="font-bold text-purple-400">15%</span>
                        </div>
                        <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                          <div className="w-[15%] h-full bg-purple-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-black border border-white/10 rounded-2xl space-y-3">
                    <h5 className="text-xs font-black uppercase tracking-wider text-white">Key Performance Indicators</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-zinc-950 rounded-xl border border-white/5">
                        <div className="text-[10px] text-white/40 uppercase">Conversion Rate</div>
                        <div className="text-lg font-black text-emerald-400">68.4%</div>
                      </div>
                      <div className="p-3 bg-zinc-950 rounded-xl border border-white/5">
                        <div className="text-[10px] text-white/40 uppercase">Retention Rate</div>
                        <div className="text-lg font-black text-[#F5D76E]">92.1%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 7. BROADCAST NOTIFICATIONS TAB */}
            {/* ========================================================= */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black uppercase tracking-wider text-white">System Announcement Broadcasts</h4>
                  <span className="text-xs text-[#F5D76E]">{notificationsList.length} sent</span>
                </div>

                {/* Broadcast Form */}
                <form onSubmit={handleSendNotification} className="p-5 bg-black border border-white/10 rounded-2xl space-y-4">
                  <h5 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-[#F5D76E]" /> Compose & Broadcast Notice
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold uppercase text-white/50 mb-1">Subject / Title</label>
                      <input
                        type="text"
                        required
                        value={notifTitle}
                        onChange={(e) => setNotifTitle(e.target.value)}
                        placeholder="e.g. Scheduled Facility Upgrades Notice"
                        className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-white/50 mb-1">Target Audience</label>
                      <select
                        value={notifAudience}
                        onChange={(e) => setNotifAudience(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                      >
                        <option value="all">All Members</option>
                        <option value="user">Athletes Only</option>
                        <option value="staff">Staff Only</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-white/50 mb-1">Broadcast Message</label>
                    <textarea
                      rows={2}
                      required
                      value={notifMessage}
                      onChange={(e) => setNotifMessage(e.target.value)}
                      placeholder="Type announcement broadcast body..."
                      className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-[#F5D76E] via-[#D4AF37] to-[#9A6B16] text-black font-black text-xs uppercase tracking-widest rounded-xl hover:opacity-90 cursor-pointer flex items-center gap-1.5 shadow-lg shadow-[#D4AF37]/10"
                  >
                    <Radio className="w-4 h-4" /> Transmit Broadcast
                  </button>
                </form>

                {/* Notifications History */}
                <div className="space-y-3">
                  {notificationsList.length === 0 ? (
                    <div className="p-8 text-center text-white/40 border border-white/10 rounded-2xl bg-black italic">
                      No broadcast notifications sent yet.
                    </div>
                  ) : (
                    notificationsList.map((n) => (
                      <div key={n._id || n.id} className="p-4 bg-black border border-white/10 rounded-2xl flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-xs font-bold text-white">{n.title}</h4>
                            <span className="px-2 py-0.2 rounded bg-white/5 text-white/60 text-[9px] uppercase font-bold">
                              {n.targetAudience}
                            </span>
                          </div>
                          <p className="text-xs text-white/70">{n.message}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteNotification(n._id || n.id)}
                          className="text-white/30 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* 8. SETTINGS & PLATFORM CONFIGURATION TAB */}
            {/* ========================================================= */}
            {activeTab === 'settings' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black uppercase tracking-wider text-white">Platform Settings & Profile Governance</h4>
                  <span className="text-xs text-[#F5D76E]">v1.0 Enterprise Edition</span>
                </div>

                <div className="p-5 bg-black border border-white/10 rounded-2xl space-y-4">
                  <h5 className="text-xs font-black uppercase tracking-wider text-white">Admin Session Details</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-zinc-950 rounded-xl border border-white/5">
                      <span className="text-white/40 block text-[10px] uppercase">Logged In Administrator</span>
                      <span className="font-bold text-white">{currentUser?.name || 'System Admin'}</span>
                    </div>
                    <div className="p-3 bg-zinc-950 rounded-xl border border-white/5">
                      <span className="text-white/40 block text-[10px] uppercase">Security Level</span>
                      <span className="font-bold text-[#F5D76E]">FULL ROOT AUTHORIZATION</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-black border border-white/10 rounded-2xl space-y-4">
                  <h5 className="text-xs font-black uppercase tracking-wider text-white">System Controls</h5>

                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <div>
                      <div className="text-xs font-bold text-white">Maintenance Mode</div>
                      <div className="text-[11px] text-white/40">Temporary lock client portal for scheduled database upgrades</div>
                    </div>
                    <button
                      onClick={() => setMaintenanceMode(!maintenanceMode)}
                      className="text-white cursor-pointer"
                    >
                      {maintenanceMode ? <ToggleRight className="w-8 h-8 text-amber-400" /> : <ToggleLeft className="w-8 h-8 text-white/30" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <div className="text-xs font-bold text-white">Email & Security Telemetry Alerts</div>
                      <div className="text-[11px] text-white/40">Send instant admin alerts on new member registrations & high booking spikes</div>
                    </div>
                    <button
                      onClick={() => setEmailAlerts(!emailAlerts)}
                      className="text-white cursor-pointer"
                    >
                      {emailAlerts ? <ToggleRight className="w-8 h-8 text-[#D4AF37]" /> : <ToggleLeft className="w-8 h-8 text-white/30" />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
