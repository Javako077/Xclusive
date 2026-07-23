import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutUsSection } from './components/AboutUsSection';
import { ClassesAndSchedule } from './components/ClassesAndSchedule';
import { ExerciseMotionViewer } from './components/ExerciseMotionViewer';
import { FacilityShowcase } from './components/FacilityShowcase';
import { TrainersSection } from './components/TrainersSection';
import { AiCoachSection } from './components/AiCoachSection';
import { InteractiveCalculators } from './components/InteractiveCalculators';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { MembershipCalculator } from './components/MembershipCalculator';
import { ContactSection } from './components/ContactSection';
import { FreePassModal } from './components/FreePassModal';
import { VideoModal } from './components/VideoModal';
import { VirtualTourModal } from './components/VirtualTourModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { Footer } from './components/Footer';
import { apiService } from './services/api';

export default function App() {
  const [freePassOpen, setFreePassOpen] = useState(false);
  const [virtualTourOpen, setVirtualTourOpen] = useState(false);
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
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#B9FF00] selection:text-black antialiased">
      {/* Navigation Header */}
      <Navbar
        onOpenFreePass={() => setFreePassOpen(true)}
        onOpenVirtualTour={() => setVirtualTourOpen(true)}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenProfile={() => setUserProfileOpen(true)}
      />

      {/* Hero Section */}
      <HeroSection
        onOpenFreePass={() => setFreePassOpen(true)}
        onOpenVirtualTour={() => setVirtualTourOpen(true)}
      />

      {/* About Us Section */}
      <AboutUsSection
        onOpenVirtualTour={() => setVirtualTourOpen(true)}
        onOpenFreePass={() => setFreePassOpen(true)}
      />

      {/* Classes & Schedule Section */}
      <ClassesAndSchedule onOpenVideo={handleOpenVideo} />

      {/* Biomechanics & Exercise Motion Viewer */}
      <ExerciseMotionViewer />

      {/* Facility Showcase */}
      <FacilityShowcase
        onOpenVideo={handleOpenVideo}
        onOpenVirtualTour={() => setVirtualTourOpen(true)}
      />

      {/* Master Athletic Trainers */}
      <TrainersSection onOpenVideo={handleOpenVideo} />

      {/* AI Coach Section */}
      <AiCoachSection
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onSavePlan={handleSavePlan}
      />

      {/* Fitness, Macro & 1RM Calculators */}
      <InteractiveCalculators />

      {/* Transformations Slider */}
      <BeforeAfterSlider />

      {/* Membership Pricing & Custom Builder */}
      <MembershipCalculator onOpenFreePass={() => setFreePassOpen(true)} />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <FreePassModal
        isOpen={freePassOpen}
        onClose={() => setFreePassOpen(false)}
      />

      <VideoModal
        isOpen={videoModalData.isOpen}
        videoUrl={videoModalData.videoUrl}
        title={videoModalData.title}
        onClose={handleCloseVideo}
      />

      <VirtualTourModal
        isOpen={virtualTourOpen}
        onClose={() => setVirtualTourOpen(false)}
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
