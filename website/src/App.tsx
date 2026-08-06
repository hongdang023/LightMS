import { useState, useEffect, lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';
import { GamificationProvider } from './context/GamificationContext';
import { CommunityProvider } from './context/CommunityContext';
import { ToastProvider } from './context/ToastContext';
import { GlobalNavigationSidebar } from './components/GlobalNavigationSidebar';
import { GlobalHeader } from './components/GlobalHeader';
import { ParrotMascot } from './components/ParrotMascot';
import { Login } from './pages/Login';
import { OnboardingForm } from './pages/student/OnboardingForm';
import { AdminOnboardingForm } from './pages/admin/AdminOnboardingForm';
import { ProductTour } from './components/ProductTour';

// Lazy-loaded Pages (Code Splitting)
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard').then(m => ({ default: m.StudentDashboard })));
const AnnouncementsView = lazy(() => import('./pages/student/AnnouncementsView').then(m => ({ default: m.AnnouncementsView })));
const AboutView = lazy(() => import('./pages/student/AboutView').then(m => ({ default: m.AboutView })));
const OnboardingView = lazy(() => import('./pages/student/OnboardingView').then(m => ({ default: m.OnboardingView })));
const SyllabusView = lazy(() => import('./pages/student/SyllabusView').then(m => ({ default: m.SyllabusView })));
const CalendarView = lazy(() => import('./pages/student/CalendarView').then(m => ({ default: m.CalendarView })));
const WallOfFame = lazy(() => import('./pages/student/WallOfFame').then(m => ({ default: m.WallOfFame })));
const HelpDesk = lazy(() => import('./pages/student/HelpDesk').then(m => ({ default: m.HelpDesk })));
const ProfileView = lazy(() => import('./pages/student/ProfileView').then(m => ({ default: m.ProfileView })));

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminProfileView = lazy(() => import('./pages/admin/AdminProfileView').then(m => ({ default: m.AdminProfileView })));
const CourseBuilder = lazy(() => import('./pages/admin/CourseBuilder').then(m => ({ default: m.CourseBuilder })));
const StudentManagement = lazy(() => import('./pages/admin/StudentManagement').then(m => ({ default: m.StudentManagement })));
const InternalTeam = lazy(() => import('./pages/admin/InternalTeam').then(m => ({ default: m.InternalTeam })));
const AdminAnnouncements = lazy(() => import('./pages/admin/Announcements').then(m => ({ default: m.Announcements })));
const AdminCalendarManagement = lazy(() => import('./pages/admin/CalendarManagement').then(m => ({ default: m.CalendarManagement })));
const AdminSettings = lazy(() => import('./pages/admin/Settings').then(m => ({ default: m.Settings })));

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
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
              <div className="w-8 h-8 border-4 border-[#214C54] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-gray-400">Đang tải trang...</span>
            </div>
          }>
            {renderPage()}
          </Suspense>
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
            <ToastProvider>
              <MainAppShell />
            </ToastProvider>
          </CommunityProvider>
        </GamificationProvider>
      </CourseProvider>
    </AuthProvider>
  );
}

export default App;
