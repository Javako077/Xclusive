import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
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
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { Footer } from './components/Footer';
import { apiService } from './services/api';

export default function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userProfileOpen, setUserProfileOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedCheckoutPlan, setSelectedCheckoutPlan] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
              onOpenProfile={() => setUserProfileOpen(true)}
              onOpenAdmin={() => navigate('/admin/dashboard')}
            />

            {/* Hero Section */}
            <HeroSection />

            {/* About Us Section */}
            <AboutUsSection />

            {/* Why Choose Us Section */}
            <WhyChooseUs onOpenTrial={() => setTrialModalOpen(true)} />

            {/* Book Your Free Trial Section */}
            <BookTrialSection />

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
            />

            <CheckoutModal
              isOpen={checkoutModalOpen}
              onClose={() => setCheckoutModalOpen(false)}
              selectedPlan={selectedCheckoutPlan}
            />

            <AuthModal
              isOpen={authModalOpen}
              onClose={() => setAuthModalOpen(false)}
              onSuccess={(loggedUser) => {
                setUser(loggedUser);
                if (loggedUser && loggedUser.role === 'admin') {
                  navigate('/admin/dashboard');
                } else {
                  navigate('/dashboard');
                }
              }}
            />

            <UserProfileModal
              isOpen={userProfileOpen}
              onClose={() => setUserProfileOpen(false)}
              user={user}
              onLogout={() => {
                apiService.logout();
                setUser(null);
              }}
              onDeleteSavedPlan={handleDeleteSavedPlan}
            />

            <AdminPortalModal
              isOpen={adminModalOpen}
              onClose={() => setAdminModalOpen(false)}
              currentUser={user}
              onLogout={() => {
                apiService.logout();
                setUser(null);
              }}
            />
          </div>
        }
      />

      {/* PROTECTED USER DASHBOARD ROUTE */}
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

      {/* PROTECTED ADMIN DASHBOARD ROUTE */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute user={user}>
            <AdminDashboardPage user={user} setUser={setUser} />
          </AdminRoute>
        }
      />
    </Routes>
  );
}
