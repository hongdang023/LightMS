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
const StudentCourseHub = lazy(() => import('./pages/student/StudentCourseHub').then(m => ({ default: m.StudentCourseHub })));
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard').then(m => ({ default: m.StudentDashboard })));
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
const AdminBatchManager = lazy(() => import('./pages/admin/AdminBatchManager').then(m => ({ default: m.AdminBatchManager })));
const StudentManagement = lazy(() => import('./pages/admin/StudentManagement').then(m => ({ default: m.StudentManagement })));
const InternalTeam = lazy(() => import('./pages/admin/InternalTeam').then(m => ({ default: m.InternalTeam })));
const AdminCalendarManagement = lazy(() => import('./pages/admin/CalendarManagement').then(m => ({ default: m.CalendarManagement })));
const AdminSettings = lazy(() => import('./pages/admin/Settings').then(m => ({ default: m.Settings })));

import './App.css';

function MainAppShell() {
  const { isAuthenticated, activeUser, activeAdmin, incrementVisits } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Synchronize state when browser Back/Forward navigation occurs
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const pathToPageMap: { [key: string]: string } = {
        '/': 'dashboard',
        '/courses': 'course-hub',
        '/about': 'about',
        '/onboarding': 'onboarding',
        '/syllabus': 'syllabus',
        '/calendar': 'calendar',
        '/walloffame': 'walloffame',
        '/helpdesk': 'helpdesk',
        '/profile': 'profile',
        '/admin': 'admin-dashboard',
        '/admin/profile': 'admin-profile',
        '/admin/batches': 'admin-batches',
        '/admin/course-builder': 'course-builder',
        '/admin/student-mgmt': 'student-mgmt',
        '/admin/internal-team': 'internal-team',
        '/admin/calendar': 'admin-calendar',
        '/admin/settings': 'admin-settings',
      };
      
      if (isAuthenticated && activeUser) {
        if (activeUser.role === 'admin') {
          if (path.startsWith('/admin')) {
            setCurrentPage(pathToPageMap[path] || 'admin-dashboard');
          } else {
            setCurrentPage('admin-dashboard');
          }
        } else {
          if (path.startsWith('/admin')) {
            setCurrentPage('dashboard');
          } else {
            setCurrentPage(pathToPageMap[path] || 'dashboard');
          }
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAuthenticated, activeUser]);

  useEffect(() => {
    if (isAuthenticated && activeUser) {
      incrementVisits(activeUser.id);
      
      const path = window.location.pathname;
      const pathToPageMap: { [key: string]: string } = {
        '/': 'dashboard',
        '/courses': 'course-hub',
        '/about': 'about',
        '/onboarding': 'onboarding',
        '/syllabus': 'syllabus',
        '/calendar': 'calendar',
        '/walloffame': 'walloffame',
        '/helpdesk': 'helpdesk',
        '/profile': 'profile',
        '/admin': 'admin-dashboard',
        '/admin/profile': 'admin-profile',
        '/admin/batches': 'admin-batches',
        '/admin/course-builder': 'course-builder',
        '/admin/student-mgmt': 'student-mgmt',
        '/admin/internal-team': 'internal-team',
        '/admin/calendar': 'admin-calendar',
        '/admin/settings': 'admin-settings',
      };

      if (activeUser.role === 'admin') {
        if (path.startsWith('/admin')) {
          // /admin (root) redirects to /admin/batches (the batch hub)
          if (path === '/admin') {
            setCurrentPage('admin-batches');
            window.history.replaceState(null, '', '/admin/batches');
          } else {
            setCurrentPage(pathToPageMap[path] || 'admin-batches');
          }
        } else {
          setCurrentPage('admin-batches');
          window.history.replaceState(null, '', '/admin/batches');
        }
      } else {
        // Student role - block all admin paths
        if (path.startsWith('/admin')) {
          setCurrentPage('course-hub');
          window.history.replaceState(null, '', '/courses');
        } else {
          // If accessing root or /courses, show course-hub gateway
          if (path === '/' || path === '/courses') {
            setCurrentPage('course-hub');
          } else {
            setCurrentPage(pathToPageMap[path] || 'course-hub');
          }
        }
      }
    }
  }, [isAuthenticated, activeUser?.id, activeUser?.role]);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const pageToPathMap: { [key: string]: string } = {
      'course-hub': '/courses',
      'dashboard': '/',
      'about': '/about',
      'onboarding': '/onboarding',
      'syllabus': '/syllabus',
      'calendar': '/calendar',
      'walloffame': '/walloffame',
      'helpdesk': '/helpdesk',
      'profile': '/profile',
      'admin-dashboard': '/admin',
      'admin-profile': '/admin/profile',
      'admin-batches': '/admin/batches',
      'course-builder': '/admin/course-builder',
      'student-mgmt': '/admin/student-mgmt',
      'internal-team': '/admin/internal-team',
      'admin-calendar': '/admin/calendar',
      'admin-settings': '/admin/settings',
    };
    const targetPath = pageToPathMap[page] || '/';
    window.history.pushState(null, '', targetPath);
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  if (!activeUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 space-y-3">
        <div className="w-8 h-8 border-4 border-[#214C54] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold text-gray-400">Đang tải cấu hình...</span>
      </div>
    );
  }

  if (activeUser.role === 'student' && !activeUser.is_profile_completed) {
    return <OnboardingForm onComplete={() => setCurrentPage('about')} />;
  }

  if (activeUser.role === 'admin' && activeAdmin && !activeAdmin.full_name) {
    return <AdminOnboardingForm onComplete={() => setCurrentPage('admin-dashboard')} />;
  }

  // Full-page Course Gateway (before entering course workspace or when switching courses)
  if (currentPage === 'course-hub') {
    return (
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F0F0F0] space-y-3">
          <div className="w-8 h-8 border-4 border-[#214C54] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-[#3E5E63]">Đang tải danh mục khóa học...</span>
        </div>
      }>
        <StudentCourseHub onEnterClass={(p) => handlePageChange(p || 'dashboard')} />
      </Suspense>
    );
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
      case 'admin-dashboard': return <AdminDashboard onPageChange={handlePageChange} />;
      case 'admin-profile': return <AdminProfileView />;
      case 'admin-batches': return <AdminBatchManager onPageChange={handlePageChange} />;

      case 'course-builder': return <CourseBuilder />;
      case 'student-mgmt': return <StudentManagement />;
      case 'internal-team': return <InternalTeam />;
      case 'admin-calendar': return <AdminCalendarManagement />;
      case 'admin-settings': return <AdminSettings />;
      default: return <StudentDashboard onPageChange={handlePageChange} />;
    }
  };

  // Full-page Hub for batch selection (no sidebar, no header)
  if (currentPage === 'admin-batches' && activeUser.role === 'admin') {
    return (
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F0F0F0] space-y-3">
          <div className="w-8 h-8 border-4 border-[#214C54] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-[#3E5E63]">Đang tải...</span>
        </div>
      }>
        <AdminBatchManager onPageChange={handlePageChange} />
      </Suspense>
    );
  }

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
