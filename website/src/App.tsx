import { useState, useEffect } from 'react';
import { DatabaseProvider, useDatabase } from './context/DatabaseContext';
import { GlobalNavigationSidebar } from './components/GlobalNavigationSidebar';
import { GlobalHeader } from './components/GlobalHeader';
import { ParrotMascot } from './components/ParrotMascot';
import { Login } from './pages/Login';
import { OnboardingForm } from './pages/student/OnboardingForm';
import { ProductTour } from './components/ProductTour';

// Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { AnnouncementsView } from './pages/student/AnnouncementsView';
import { AboutView } from './pages/student/AboutView';
import { OnboardingView } from './pages/student/OnboardingView';
import { SyllabusView } from './pages/student/SyllabusView';
import { CompetencyFramework } from './pages/student/CompetencyFramework';
import { CalendarView } from './pages/student/CalendarView';
import { WallOfFame } from './pages/student/WallOfFame';
import { HelpDesk } from './pages/student/HelpDesk';
import { ProfileView } from './pages/student/ProfileView';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CourseBuilder } from './pages/admin/CourseBuilder';
import { StudentManagement } from './pages/admin/StudentManagement';
import { InternalTeam } from './pages/admin/InternalTeam';
import { Announcements as AdminAnnouncements } from './pages/admin/Announcements';
import { CalendarManagement as AdminCalendarManagement } from './pages/admin/CalendarManagement';
import { Settings as AdminSettings } from './pages/admin/Settings';

import './App.css';

function MainAppShell() {
  const { isAuthenticated, activeUser, incrementVisits } = useDatabase();
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated) {
      incrementVisits(activeUser.id);
      if (activeUser.role === 'admin') {
        setCurrentPage('admin-dashboard');
      } else {
        // First-time users (visits <= 2) land on the 'about' tab, others land on 'dashboard'
        if (activeUser.visits <= 2) {
          setCurrentPage('about');
        } else {
          setCurrentPage('dashboard');
        }
      }
    }
  }, [isAuthenticated, activeUser.role]);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    setIsSidebarOpen(false);
  };

  // Route guarding
  if (!isAuthenticated) {
    return <Login />;
  }

  if (activeUser.role !== 'admin' && !activeUser.is_profile_completed) {
    return <OnboardingForm />;
  }

  // Render active page component
  const renderPage = () => {
    switch (currentPage) {
      // Student Portal
      case 'dashboard':
        return <StudentDashboard onPageChange={handlePageChange} />;
      case 'announcements':
        return <AnnouncementsView onPageChange={handlePageChange} />;
      case 'about':
        return <AboutView onPageChange={handlePageChange} />;
      case 'onboarding':
        return <OnboardingView onPageChange={handlePageChange} />;
      case 'syllabus':
        return <SyllabusView onPageChange={handlePageChange} />;
      case 'competency':
        return <CompetencyFramework />;
      case 'calendar':
        return <CalendarView />;
      case 'walloffame':
        return <WallOfFame />;
      case 'help':
        return <HelpDesk onPageChange={handlePageChange} />;
      case 'profile':
        return <ProfileView />;

      // Admin Portal
      case 'admin-dashboard':
        return <AdminDashboard onPageChange={handlePageChange} />;
      case 'admin-announcements':
        return <AdminAnnouncements />;
      case 'course-builder':
        return <CourseBuilder />;
      case 'admin-calendar':
        return <AdminCalendarManagement />;
      case 'student-mgmt':
        return <StudentManagement />;
      case 'internal-team':
        return <InternalTeam />;
      case 'admin-settings':
        return <AdminSettings />;

      default:
        return <StudentDashboard onPageChange={handlePageChange} />;
    }
  };

  return (
    <div className="app-shell">
      {/* Product Onboarding Tour */}
      <ProductTour />

      {/* Global Navigation Sidebar */}
      <GlobalNavigationSidebar 
        currentPage={currentPage} 
        onPageChange={handlePageChange} 
        isOpen={isSidebarOpen}
      />

      {/* Sidebar Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content pane */}
      <div className="main-content">
        <GlobalHeader 
          currentPage={currentPage} 
          onPageChange={handlePageChange} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        
        {/* Scrollable page canvas */}
        <main className="page-container custom-scrollbar">
          {renderPage()}
        </main>
      </div>

      {/* Floating Parrot Mascot Assistant */}
      <ParrotMascot currentPage={currentPage} />
    </div>
  );
}

function App() {
  return (
    <DatabaseProvider>
      <MainAppShell />
    </DatabaseProvider>
  );
}

export default App;
