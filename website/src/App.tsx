import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';
import { GamificationProvider } from './context/GamificationContext';
import { CommunityProvider } from './context/CommunityContext';
import { GlobalNavigationSidebar } from './components/GlobalNavigationSidebar';
import { GlobalHeader } from './components/GlobalHeader';
import { ParrotMascot } from './components/ParrotMascot';
import { Login } from './pages/Login';
import { OnboardingForm } from './pages/student/OnboardingForm';
import { AdminOnboardingForm } from './pages/admin/AdminOnboardingForm';
import { ProductTour } from './components/ProductTour';

// Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { AnnouncementsView } from './pages/student/AnnouncementsView';
import { AboutView } from './pages/student/AboutView';
import { OnboardingView } from './pages/student/OnboardingView';
import { SyllabusView } from './pages/student/SyllabusView';

import { CalendarView } from './pages/student/CalendarView';
import { WallOfFame } from './pages/student/WallOfFame';
import { HelpDesk } from './pages/student/HelpDesk';
import { ProfileView } from './pages/student/ProfileView';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProfileView } from './pages/admin/AdminProfileView';
import { CourseBuilder } from './pages/admin/CourseBuilder';
import { StudentManagement } from './pages/admin/StudentManagement';
import { InternalTeam } from './pages/admin/InternalTeam';
import { Announcements as AdminAnnouncements } from './pages/admin/Announcements';
import { CalendarManagement as AdminCalendarManagement } from './pages/admin/CalendarManagement';
import { Settings as AdminSettings } from './pages/admin/Settings';

import './App.css';

function MainAppShell() {
  const { isAuthenticated, activeUser, activeAdmin, incrementVisits } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated) {
      incrementVisits(activeUser.id);
      if (activeUser.role === 'admin') {
        setCurrentPage('admin-dashboard');
      } else {
        const visitCount = activeUser.visits || 0;
        setCurrentPage(visitCount <= 2 ? 'about' : 'dashboard');
      }
    }
  }, [isAuthenticated, activeUser?.id, activeUser?.role]);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  if (activeUser.role === 'student' && !activeUser.is_profile_completed) {
    return <OnboardingForm onComplete={() => setCurrentPage('about')} />;
  }

  if (activeUser.role === 'admin' && activeAdmin && !activeAdmin.full_name) {
    return <AdminOnboardingForm onComplete={() => setCurrentPage('admin-dashboard')} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <StudentDashboard onPageChange={handlePageChange} />;
      case 'about': return <AboutView onPageChange={handlePageChange} />;
      case 'onboarding': return <OnboardingView onPageChange={handlePageChange} />;
      case 'syllabus': return <SyllabusView />;
      case 'calendar': return <CalendarView onPageChange={handlePageChange} />;
      case 'walloffame': return <WallOfFame />;
      case 'helpdesk': return <HelpDesk />;
      case 'profile': return <ProfileView onPageChange={handlePageChange} />;
      case 'announcements': return <AnnouncementsView onPageChange={handlePageChange} />;
      case 'admin-dashboard': return <AdminDashboard onPageChange={handlePageChange} />;
      case 'admin-profile': return <AdminProfileView />;
      case 'course-builder': return <CourseBuilder />;
      case 'student-management': return <StudentManagement />;
      case 'internal-team': return <InternalTeam />;
      case 'announcements-management': return <AdminAnnouncements />;
      case 'calendar-management': return <AdminCalendarManagement />;
      case 'admin-settings': return <AdminSettings />;
      default: return <StudentDashboard onPageChange={handlePageChange} />;
    }
  };

  return (
    <div className="app-layout flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <ProductTour activeTab={currentPage} onTabChange={handlePageChange} />

      <GlobalNavigationSidebar 
        currentPage={currentPage} 
        onPageChange={handlePageChange}
        isOpen={isSidebarOpen}
      />

      <div className="main-content">
        <GlobalHeader 
          currentPage={currentPage} 
          onPageChange={handlePageChange} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="page-container custom-scrollbar">
          {renderPage()}
        </main>
      </div>

      <ParrotMascot currentPage={currentPage} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CourseProvider>
        <GamificationProvider>
          <CommunityProvider>
            <MainAppShell />
          </CommunityProvider>
        </GamificationProvider>
      </CourseProvider>
    </AuthProvider>
  );
}

export default App;
