import { useState, useEffect } from 'react';
import { DatabaseProvider, useDatabase } from './context/DatabaseContext';
import { GlobalNavigationSidebar } from './components/GlobalNavigationSidebar';
import { GlobalHeader } from './components/GlobalHeader';
import { ParrotMascot } from './components/ParrotMascot';
import { Login } from './pages/Login';
import { OnboardingForm } from './pages/student/OnboardingForm';

// Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { AnnouncementsView } from './pages/student/AnnouncementsView';
import { AboutView } from './pages/student/AboutView';
import { OnboardingView } from './pages/student/OnboardingView';
import { SyllabusView } from './pages/student/SyllabusView';
import { CompetencyFramework } from './pages/student/CompetencyFramework';
import { DiscussionBoard } from './pages/student/DiscussionBoard';
import { CalendarView } from './pages/student/CalendarView';
import { WallOfFame } from './pages/student/WallOfFame';
import { HelpDesk } from './pages/student/HelpDesk';
import { ProfileView } from './pages/student/ProfileView';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CourseBuilder } from './pages/admin/CourseBuilder';
import { SpeedGrader } from './pages/admin/SpeedGrader';
import { StudentManagement } from './pages/admin/StudentManagement';
import { InternalTeam } from './pages/admin/InternalTeam';
import { Announcements as AdminAnnouncements } from './pages/admin/Announcements';
import { CalendarManagement as AdminCalendarManagement } from './pages/admin/CalendarManagement';

import './App.css';

function MainAppShell() {
  const { isAuthenticated, activeUser } = useDatabase();
  const [currentPage, setCurrentPage] = useState<string>('dashboard');

  useEffect(() => {
    if (isAuthenticated) {
      if (activeUser.role === 'admin') {
        setCurrentPage('admin-dashboard');
      } else {
        setCurrentPage('dashboard');
      }
    }
  }, [isAuthenticated, activeUser.role]);

  // Route guarding
  if (!isAuthenticated) {
    return <Login />;
  }

  if (activeUser.role === 'student' && !activeUser.is_profile_completed) {
    return <OnboardingForm />;
  }

  // Render active page component
  const renderPage = () => {
    switch (currentPage) {
      // Student Portal
      case 'dashboard':
        return <StudentDashboard onPageChange={setCurrentPage} />;
      case 'announcements':
        return <AnnouncementsView onPageChange={setCurrentPage} />;
      case 'about':
        return <AboutView onPageChange={setCurrentPage} />;
      case 'onboarding':
        return <OnboardingView />;
      case 'syllabus':
        return <SyllabusView onPageChange={setCurrentPage} />;
      case 'competency':
        return <CompetencyFramework />;
      case 'discussion':
        return <DiscussionBoard />;
      case 'calendar':
        return <CalendarView />;
      case 'walloffame':
        return <WallOfFame />;
      case 'help':
        return <HelpDesk />;
      case 'profile':
        return <ProfileView />;

      // Admin Portal
      case 'admin-dashboard':
        return <AdminDashboard onPageChange={setCurrentPage} />;
      case 'admin-announcements':
        return <AdminAnnouncements />;
      case 'course-builder':
        return <CourseBuilder />;
      case 'admin-calendar':
        return <AdminCalendarManagement />;
      case 'speedgrader':
        return <SpeedGrader />;
      case 'student-mgmt':
        return <StudentManagement />;
      case 'internal-team':
        return <InternalTeam />;

      default:
        return <StudentDashboard onPageChange={setCurrentPage} />;
    }
  };

  return (
    <div className="app-shell">
      {/* Global Navigation Sidebar */}
      <GlobalNavigationSidebar currentPage={currentPage} onPageChange={setCurrentPage} />

      {/* Main content pane */}
      <div className="main-content">
        <GlobalHeader currentPage={currentPage} onPageChange={setCurrentPage} />
        
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
