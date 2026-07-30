import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutUsSection } from './components/AboutUsSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { BookTrialSection } from './components/BookTrialSection';
import { BookTrialModal } from './components/BookTrialModal';
import { CheckoutModal } from './components/CheckoutModal';
import { ClassesAndSchedule } from './components/ClassesAndSchedule';
import { FacilityShowcase } from './components/FacilityShowcase';
import { TestimonialsSection } from './components/TestimonialsSection';
import { MembershipCalculator } from './components/MembershipCalculator';
import { ContactSection } from './components/ContactSection';
import { VideoModal } from './components/VideoModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { UserForgotPasswordPage } from './pages/UserForgotPasswordPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminForgotPasswordPage } from './pages/AdminForgotPasswordPage';
import { Footer } from './components/Footer';
import { apiService } from './services/api';

export default function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userProfileOpen, setUserProfileOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedCheckoutPlan, setSelectedCheckoutPlan] = useState(null);
  
  // User state (Completely separate from Admin)
  const [user, setUser] = useState(null);
  // Admin state (Completely separate from User)
  const [adminUser, setAdminUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Automatically open Login Modal after successful Password Reset redirection
  useEffect(() => {
    if (location.state?.openLoginModal) {
      setAuthModalOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Restore User Session on mount if token exists
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('token');
      if (token && !user) {
        try {
          const profile = await apiService.getMe();
          setUser(profile);
        } catch (err) {
          console.error('Failed to restore user session:', err);
          apiService.logout();
          setUser(null);
        }
      }
    };
    restoreSession();
  }, []);

  const handleOpenProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token && !user) {
      setAuthModalOpen(true);
      return;
    }
    setUserProfileOpen(true);
    if (token) {
      setProfileLoading(true);
      try {
        const profile = await apiService.getMe();
        if (profile) {
          setUser(profile);
        }
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      } finally {
        setProfileLoading(false);
      }
    }
  };

  const [videoModalData, setVideoModalData] = useState({
    isOpen: false,
    videoUrl: '',
    title: '',
  });

  const handleOpenVideo = (videoUrl, title) => {
    setVideoModalData({
      isOpen: true,
      videoUrl,
      title,
    });
  };

  const handleCloseVideo = () => {
    setVideoModalData({
      isOpen: false,
      videoUrl: '',
      title: '',
    });
  };

  const handleUserLogout = () => {
    apiService.logout();
    setUser(null);
    setUserProfileOpen(false);
    window.location.href = '/';
  };

  const handleSavePlan = async (title, content) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    const newPlan = {
      id: 'plan_' + Date.now(),
      title,
      content,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    setUser({
      ...user,
      savedPlans: [newPlan, ...(user.savedPlans || [])],
    });

    try {
      await apiService.savePlan({ userId: user.id, title, content });
    } catch (err) {
      console.error('Failed to persist saved plan to Express server:', err);
    }
  };

  const handleDeleteSavedPlan = (planId) => {
    if (!user) return;
    setUser({
      ...user,
      savedPlans: (user.savedPlans || []).filter((p) => p.id !== planId),
    });
  };

  return (
    <>
      <Routes>
        {/* LANDING PAGE ROUTE */}
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-black text-white font-sans selection:bg-[#D4AF37] selection:text-black antialiased">
              {/* Navigation Header */}
              <Navbar
                user={user}
                onOpenAuth={() => setAuthModalOpen(true)}
                onOpenProfile={handleOpenProfile}
                onLogout={handleUserLogout}
              />

              {/* Hero Section */}
              <HeroSection />

              {/* About Us Section */}
              <AboutUsSection />

              {/* Why Choose Us Section */}
              <WhyChooseUs onOpenTrial={() => setTrialModalOpen(true)} />

              {/* Book Your Free Trial Section */}
              <BookTrialSection user={user} />

              {/* Classes & Schedule Section */}
              <ClassesAndSchedule onOpenVideo={handleOpenVideo} />

              {/* Facility Showcase */}
              <FacilityShowcase onOpenVideo={handleOpenVideo} />

              {/* Testimonials / Client Feedback Section */}
              <TestimonialsSection />

              {/* Membership Pricing & Custom Builder */}
              <MembershipCalculator
                onJoinPlan={(plan) => {
                  setSelectedCheckoutPlan(plan);
                  setCheckoutModalOpen(true);
                }}
                onBookTrial={() => setTrialModalOpen(true)}
              />

              {/* Contact Section */}
              <ContactSection />

              {/* Footer */}
              <Footer />

              {/* Modals */}
              <VideoModal
                isOpen={videoModalData.isOpen}
                videoUrl={videoModalData.videoUrl}
                title={videoModalData.title}
                onClose={handleCloseVideo}
              />

              <BookTrialModal
                isOpen={trialModalOpen}
                onClose={() => setTrialModalOpen(false)}
                user={user}
              />

              <CheckoutModal
                isOpen={checkoutModalOpen}
                onClose={() => setCheckoutModalOpen(false)}
                selectedPlan={selectedCheckoutPlan}
                user={user}
              />

              <AuthModal
                isOpen={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
                onSuccess={(loggedUser) => {
                  setUser(loggedUser);
                  setAuthModalOpen(false);
                }}
              />

              <AdminPortalModal
                isOpen={adminModalOpen}
                onClose={() => setAdminModalOpen(false)}
                currentUser={adminUser}
                onLogout={() => {
                  apiService.adminLogout();
                  setAdminUser(null);
                  navigate('/admin/login');
                }}
              />
            </div>
          }
        />

        {/* USER PROFILE & DASHBOARD ROUTES */}
        <Route
          path="/forgot-password"
          element={<UserForgotPasswordPage />}
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <UserDashboardPage
                user={user}
                setUser={setUser}
                onDeleteSavedPlan={handleDeleteSavedPlan}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <UserDashboardPage
                user={user}
                setUser={setUser}
                onDeleteSavedPlan={handleDeleteSavedPlan}
              />
            </ProtectedRoute>
          }
        />

        {/* DEDICATED ADMIN AUTHENTICATION ROUTES */}
        <Route
          path="/admin/login"
          element={<AdminLoginPage onAdminLoginSuccess={(admin) => setAdminUser(admin)} />}
        />

        <Route
          path="/admin/forgot-password"
          element={<AdminForgotPasswordPage />}
        />

        {/* PROTECTED ADMIN DASHBOARD ROUTE */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboardPage currentAdmin={adminUser} setAdmin={setAdminUser} />
            </AdminRoute>
          }
        />
      </Routes>

      {/* GLOBAL USER PROFILE MODAL */}
      <UserProfileModal
        isOpen={userProfileOpen}
        onClose={() => setUserProfileOpen(false)}
        user={user}
        loading={profileLoading}
        onLogout={handleUserLogout}
        onDeleteSavedPlan={handleDeleteSavedPlan}
      />
    </>
  );
}
