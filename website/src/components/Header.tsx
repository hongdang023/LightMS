import React from 'react';
import { useDatabase } from '../context/DatabaseContext';
// No lucide-react imports

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange }) => {
  const { activeUser, switchUser, lessons, nauticalTransactions } = useDatabase();

  // Get current page display title
  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard': return 'Home';
      case 'about': return 'About';
      case 'onboarding': return 'Onboarding';
      case 'syllabus': return 'Syllabus';
      case 'competency': return 'Skills';
      case 'discussion': return 'Discussions';
      case 'calendar': return 'Schedule';
      case 'walloffame': return 'Leaderboard';
      case 'help': return 'Support';
      case 'profile': return 'Profile';
      case 'admin-dashboard': return 'System Overview';
      case 'course-builder': return 'Course Builder';
      case 'speedgrader': return 'SpeedGrader';
      case 'student-mgmt': return 'Students';
      case 'internal-team': return 'Team';
      default: return 'LightMS';
    }
  };

  // Calculate learning progress (completed lessons)
  const completedLessons = nauticalTransactions
    .filter(t => t.student_id === 'profile-student-tuyethong' && t.action_type === 'lesson_complete')
    .map(t => t.reference_id || '');
    
  // Deduplicate
  const uniqueCompleted = Array.from(new Set(completedLessons));
  const progressPercent = Math.min(100, Math.round((uniqueCompleted.length / lessons.length) * 100));

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm z-30 select-none">
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold text-[#15333B] tracking-tight">
          {getPageTitle()}
        </h2>
        <p className="text-xs text-[#3E5E63] font-semibold mt-0.5">
          {activeUser.role === 'student' ? 'Thủy thủ đoàn' : 'Ban vận hành'} • {activeUser.full_name}
        </p>
      </div>

      {/* Center Sailing Progress (Only for student mode) */}
      {activeUser.role === 'student' && (
        <div className="flex-1 max-w-md mx-8 flex flex-col items-center">
          <div className="w-full flex justify-between items-center text-[10px] text-[#3E5E63] font-bold mb-1">
            <span>Khởi hành (0%)</span>
            <span className="text-[#214C54]">Hải trình hoàn thành: {progressPercent}%</span>
            <span>Kho báu (100%)</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full relative overflow-visible shadow-inner border border-gray-200">
            {/* Wave fill background */}
            <div 
              className="h-full bg-gradient-to-r from-[#214C54] to-[#3E5E63] rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
            {/* Sailing Ship Icon */}
            <div 
              className="absolute -top-3.5 transition-all duration-1000 ease-out text-base animate-bounce-slow"
              style={{ left: `calc(${progressPercent}% - 8px)` }}
            >
              ⛵
            </div>
          </div>
        </div>
      )}

      {/* Role Switcher Floating Controls */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500 font-bold hidden sm:inline">Phân vai thử nghiệm:</span>
        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 shadow-inner">
          <button
            onClick={() => {
              switchUser('student');
              onPageChange('dashboard');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
              activeUser.role === 'student'
                ? 'bg-[#214C54] text-white shadow'
                : 'text-[#3E5E63] hover:text-[#15333B]'
            }`}
          >
            <span>👤</span>
            <span>Học viên</span>
          </button>
          
          <button
            onClick={() => {
              switchUser('admin');
              onPageChange('admin-dashboard');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
              activeUser.role === 'admin'
                ? 'bg-[#EAB308] text-[#15333B] shadow'
                : 'text-[#3E5E63] hover:text-[#15333B]'
            }`}
          >
            <span>🛡️</span>
            <span>Mentor / Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};
