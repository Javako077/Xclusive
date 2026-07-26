import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutUsSection } from './components/AboutUsSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { ClassesAndSchedule } from './components/ClassesAndSchedule';
import { FacilityShowcase } from './components/FacilityShowcase';
import { TestimonialsSection } from './components/TestimonialsSection';
import { MembershipCalculator } from './components/MembershipCalculator';
import { ContactSection } from './components/ContactSection';
import { VideoModal } from './components/VideoModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { Footer } from './components/Footer';
import { apiService } from './services/api';

export default function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userProfileOpen, setUserProfileOpen] = useState(false);
  const [user, setUser] = useState(null);

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
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#D4AF37] selection:text-black antialiased">
      {/* Navigation Header */}
      <Navbar
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenProfile={() => setUserProfileOpen(true)}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* About Us Section */}
      <AboutUsSection />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Classes & Schedule Section */}
      <ClassesAndSchedule onOpenVideo={handleOpenVideo} />

      {/* Facility Showcase */}
      <FacilityShowcase onOpenVideo={handleOpenVideo} />

      {/* Testimonials / Client Feedback Section */}
      <TestimonialsSection />

      {/* Membership Pricing & Custom Builder */}
      <MembershipCalculator onOpenAuth={() => setAuthModalOpen(true)} />

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

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(loggedUser) => setUser(loggedUser)}
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
    </div>
  );
}

