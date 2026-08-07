import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCourse } from '../context/CourseContext';
import { useGamification } from '../context/GamificationContext';
import { useCommunity } from '../context/CommunityContext';
// No lucide-react imports

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange: _onPageChange }) => {
  const { activeUser } = useAuth();
  const { lessons } = useCourse();
  const { nauticalTransactions } = useGamification();
  const { onboardingDays } = useCommunity();
  const isStudent = activeUser.role === 'student';

  // Get current page display title
  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard': return 'Home';
      case 'about': return 'About';
      case 'onboarding': return 'Onboarding';
      case 'syllabus': return 'Syllabus';

      case 'calendar': return 'Schedule';
      case 'walloffame': return 'Leaderboard';
      case 'helpdesk': return 'Support';
      case 'profile': return 'Profile';
      case 'admin-dashboard': return 'System Overview';
      case 'course-builder': return 'Course Builder';
      case 'admin-calendar': return 'Calendar Management';
      case 'speedgrader': return 'SpeedGrader';
      case 'student-mgmt': return 'Students';
      case 'internal-team': return 'Team';
      default: return 'LightMS';
    }
  };

  // Progress bar calculation
  const totalItems = (lessons || []).length + 7;
  const completedMainLessons = (lessons || []).filter(lesson => {
    return (nauticalTransactions || []).some(
      t => t.student_id === activeUser.id && t.action_type === 'lesson_complete' && t.reference_id === lesson.id
    );
  }).length;

  const completedOnboardingDays = (onboardingDays || []).length > 0
    ? (onboardingDays || []).filter(day => {
        const lines = day.checklist.split('\n');
        const requiredTasks: string[] = [];
        let taskIdx = 0;
        lines.forEach(line => {
          const trimmed = line.trim();
          if (trimmed.startsWith('- [ ]')) {
            taskIdx++;
            const rawLabel = trimmed.replace('- [ ]', '').trim();
            const isOptional = rawLabel.toLowerCase().includes('optional');
            if (!isOptional) {
              requiredTasks.push(`day-${day.day}-task-${taskIdx}`);
            }
          }
        });
        if (requiredTasks.length === 0) return true;
        return requiredTasks.every(key => !!activeUser.onboarding_tasks?.[key]);
      }).length
    : Array.from({ length: 7 }, (_, i) => i + 1).filter(day => {
        return (nauticalTransactions || []).some(
          t => t.student_id === activeUser.id && 
          t.action_type === 'lesson_complete' && 
          (t.reference_id === `onboarding-day-${day}` || t.reference_id === `00000000-0000-0000-0000-0000000000d${day}`)
        );
      }).length;

  const totalCompleted = completedMainLessons + completedOnboardingDays;
  const progressPercent = totalItems > 0 ? Math.min(100, Math.round((totalCompleted / totalItems) * 100)) : 0;

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm z-30 select-none">
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold text-[#15333B] tracking-tight">
          {getPageTitle()}
        </h2>
        <p className="text-xs text-[#3E5E63] font-semibold mt-0.5">
          {isStudent ? 'Thủy thủ đoàn' : 'Ban vận hành'} • {activeUser.full_name}
        </p>
      </div>

      {/* Center Sailing Progress (Only for student mode) */}
      {isStudent && (
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
    </header>
  );
};
