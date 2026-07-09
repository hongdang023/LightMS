import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { BrandLogo } from './BrandLogo';
import {
  HomeIcon,
  AboutIcon,
  OnboardingIcon,
  SyllabusIcon,
  ScheduleIcon,
  LeaderboardIcon,
  SupportIcon,
  AnnouncementsIcon,
  AdminDashboardIcon,
  CourseBuilderIcon,
  StudentsIcon,
  InternalTeamIcon
} from './Icons';

interface GlobalNavigationSidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isOpen?: boolean;
}

export const GlobalNavigationSidebar: React.FC<GlobalNavigationSidebarProps> = ({ currentPage, onPageChange, isOpen }) => {
  const { activeUser } = useDatabase();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const isAdminPage = [
    'admin-dashboard',
    'admin-announcements',
    'course-builder',
    'admin-calendar',
    'student-mgmt',
    'internal-team',
    'admin-settings'
  ].includes(currentPage);

  const showAdminSidebar = activeUser.role === 'admin' && isAdminPage;

  // Navigation Items for Student Portal (using premium SVG icons)
  const studentNav = [
    { id: 'about', label: 'Giới thiệu', icon: AboutIcon },
    { id: 'dashboard', label: 'Dashboard học tập', icon: HomeIcon },
    { id: 'announcements', label: 'Thông báo', icon: AnnouncementsIcon },
    { id: 'onboarding', label: 'Onboarding', icon: OnboardingIcon },
    { id: 'syllabus', label: 'Lộ trình học', icon: SyllabusIcon },
    { id: 'calendar', label: 'Lịch học', icon: ScheduleIcon },
    { id: 'walloffame', label: 'Bảng vinh danh', icon: LeaderboardIcon },
    { id: 'help', label: 'Hỏi đáp & Hỗ trợ', icon: SupportIcon },
  ];

  // Navigation Items for Admin Portal (using premium SVG icons)
  const adminNav = [
    { id: 'admin-dashboard', label: 'Tổng quan hệ thống', icon: AdminDashboardIcon },
    { id: 'admin-announcements', label: 'Thông báo', icon: AnnouncementsIcon },
    { id: 'course-builder', label: 'Soạn lộ trình', icon: CourseBuilderIcon },
    { id: 'admin-calendar', label: 'Lịch học', icon: ScheduleIcon },
    { id: 'student-mgmt', label: 'Quản lý học viên', icon: StudentsIcon },
    { id: 'internal-team', label: 'Quản lý nhân sự', icon: InternalTeamIcon },
    { id: 'admin-settings', label: 'Cài đặt', icon: Settings },
  ];

  const currentNav = showAdminSidebar ? adminNav : studentNav;

  return (
    <aside className={`fixed md:relative top-0 bottom-0 left-0 z-40 bg-[#15333B] text-white flex flex-col h-screen border-r border-[#3E5E63]/30 select-none transition-all duration-300 ease-in-out ${
      isCollapsed ? 'md:w-20' : 'md:w-72'
    } ${
      isOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0 w-72 md:w-auto'
    }`}>
      
      {/* Floating Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-[#15333B] hover:bg-[#214C54] border border-[#3E5E63] text-white hidden md:flex items-center justify-center z-50 shadow-md transition-colors"
        title={isCollapsed ? "Mở rộng thanh bên" : "Thu hẹp thanh bên"}
      >
        {isCollapsed ? <ChevronRight size={14} strokeWidth={3} /> : <ChevronLeft size={14} strokeWidth={3} />}
      </button>

      {/* Brand Logo Header */}
      <div className={`border-b border-[#3E5E63]/20 flex items-center transition-all duration-300 ${isCollapsed ? 'justify-center p-4' : 'p-6 gap-3'}`}>
        <BrandLogo size={36} lighthouseColor="#FFFFFF" sunbeamColor="#FFC72C" waveColor="#00B2E2" />
        {!isCollapsed && (
          <div className="animate-fade-in">
            <h1 className="font-extrabold text-lg tracking-wide bg-gradient-to-r from-white to-[#FFD94C] bg-clip-text text-transparent">
              LightMS
            </h1>
            <p className="text-[10px] text-[#3E5E63] font-semibold tracking-widest uppercase">
              {showAdminSidebar ? 'Admin Portal' : 'Student Portal'}
            </p>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <nav className={`flex-1 overflow-y-auto py-6 space-y-1.5 custom-scrollbar transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        {currentNav.map((item) => {
          const isActive = currentPage === item.id;
          const IconComponent = item.icon;
          
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => onPageChange(item.id)}
              title={isCollapsed ? item.label : ''}
              className={`w-full flex items-center rounded-xl text-sm font-semibold transition-all duration-200 group relative border-l-4 ${
                isCollapsed ? 'justify-center py-3' : 'gap-3.5 px-4 py-3'
              } ${
                isActive 
                  ? 'bg-[#214C54] text-[#FFD94C] shadow-md border-[#FFD94C]' 
                  : 'text-gray-300 hover:bg-[#214C54]/30 hover:text-white border-transparent'
              }`}
            >
              <IconComponent 
                active={isActive} 
                className="w-5 h-5 flex-shrink-0" 
              />
              {!isCollapsed && <span className="animate-fade-in truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

    </aside>
  );
};


