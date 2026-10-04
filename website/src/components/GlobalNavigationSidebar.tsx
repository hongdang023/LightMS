import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Settings, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCourse } from '../context/CourseContext';
import { BrandLogo } from './BrandLogo';
import {
  HomeIcon,
  AboutIcon,
  OnboardingIcon,
  SyllabusIcon,
  ScheduleIcon,
  LeaderboardIcon,
  SupportIcon,
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
  const { activeUser } = useAuth();
  const { courses, batches, activeBatch, selectCourseAndBatch } = useCourse();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const isAdminPage = [
    'admin-dashboard',
    'course-builder',
    'admin-calendar',
    'admin-batches',
    'student-mgmt',
    'internal-team',
    'admin-settings'
  ].includes(currentPage);

  const showAdminSidebar = activeUser.role === 'admin' && isAdminPage;

  // IN_BATCH = admin has selected a batch AND is inside the workspace (not on the hub/batches page)
  const inBatchWorkspace = showAdminSidebar && currentPage !== 'admin-batches' && !!activeBatch;

  // Navigation Items for Student Portal
  const studentNav = [
    { id: 'about', label: 'Giới thiệu', icon: AboutIcon },
    { id: 'dashboard', label: 'Dashboard học tập', icon: HomeIcon },
    { id: 'onboarding', label: 'Onboarding', icon: OnboardingIcon },
    { id: 'syllabus', label: 'Lộ trình học', icon: SyllabusIcon },
    { id: 'calendar', label: 'Lịch học', icon: ScheduleIcon },
    { id: 'walloffame', label: 'Bảng vinh danh', icon: LeaderboardIcon },
    { id: 'helpdesk', label: 'Hỏi đáp & Hỗ trợ', icon: SupportIcon },
  ];

  // Navigation Items for IN_BATCH workspace (6 batch-scoped items)
  const batchWorkspaceNav = [
    { id: 'admin-dashboard', label: 'Tổng quan', icon: AdminDashboardIcon },
    { id: 'course-builder', label: 'Soạn lộ trình', icon: CourseBuilderIcon },
    { id: 'admin-calendar', label: 'Lịch học', icon: ScheduleIcon },
    { id: 'student-mgmt', label: 'Quản lý học viên', icon: StudentsIcon },
    { id: 'internal-team', label: 'Quản lý nhân sự', icon: InternalTeamIcon },
    { id: 'admin-settings', label: 'Cài đặt', icon: Settings },
  ];

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
              {showAdminSidebar ? 'Cổng Quản Trị' : 'Student Portal'}
            </p>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          HUB MODE: Admin is on /admin/batches — chọn lớp để vào
      ══════════════════════════════════════════════════════════════ */}
      {showAdminSidebar && !inBatchWorkspace && (
        <div className="flex-1 flex flex-col px-4 py-6 gap-2">
          {!isCollapsed && (
            <p className="text-[10px] uppercase font-bold text-teal-300/60 tracking-wider mb-1">
              Chọn lớp để quản lý
            </p>
          )}

          {/* Hub button */}
          <button
            onClick={() => onPageChange('admin-batches')}
            className={`w-full flex items-center rounded-xl text-sm font-semibold transition-all duration-200 border-l-4 ${
              isCollapsed ? 'justify-center py-3' : 'gap-3.5 px-4 py-3'
            } ${
              currentPage === 'admin-batches'
                ? 'bg-[#214C54] text-[#FFD94C] shadow-md border-[#FFD94C]'
                : 'text-gray-300 hover:bg-[#214C54]/30 hover:text-white border-transparent'
            }`}
            title={isCollapsed ? 'Quản lý Lớp & Mã' : ''}
          >
            <Layers className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="animate-fade-in truncate">Quản lý Lớp & Mã</span>}
          </button>

          {/* Quick-access batch list */}
          {!isCollapsed && batches.length > 0 && (
            <div className="mt-3 space-y-1">
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-1 mb-2">
                Truy cập nhanh
              </p>
              {batches.slice(0, 6).map(b => {
                const c = courses.find(course => course.id === b.course_id);
                return (
                  <button
                    key={b.id}
                    onClick={() => {
                      if (c) selectCourseAndBatch(c, b);
                      onPageChange('admin-dashboard');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-[#214C54]/40 hover:text-white transition-all border border-transparent hover:border-teal-500/20 text-left"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${b.is_active ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                    <span className="truncate">{c?.title.split(':')[0] || 'Lớp'} — {b.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          IN_BATCH WORKSPACE: Batch đã chọn, hiện 6 mục nghiệp vụ
      ══════════════════════════════════════════════════════════════ */}
      {inBatchWorkspace && (
        <>
          {/* Batch Context Header */}
          <div className={`border-b border-[#3E5E63]/30 bg-[#112930]/60 ${isCollapsed ? 'px-2 py-3' : 'px-4 pt-3 pb-3'}`}>
            {!isCollapsed ? (
              <div className="space-y-1.5">
                {/* ← Back to hub */}
                <button
                  onClick={() => onPageChange('admin-batches')}
                  className="flex items-center gap-1 text-[10px] font-bold text-amber-300 hover:text-amber-200 transition-colors"
                >
                  <ChevronLeft size={12} />
                  Đổi lớp
                </button>
                {/* Active batch name — simple text, no dropdown */}
                <p className="text-xs font-bold text-white truncate leading-tight">
                  {activeBatch?.name || '—'}
                </p>
              </div>
            ) : (
              <button
                onClick={() => onPageChange('admin-batches')}
                title={`Đổi lớp (hiện: ${activeBatch?.name})`}
                className="w-full flex items-center justify-center p-2.5 rounded-xl bg-[#15333B] border border-teal-500/40 text-teal-400 hover:border-teal-400 hover:text-white transition-colors"
              >
                <Layers size={16} />
              </button>
            )}
          </div>

          {/* 6 Batch-scoped Nav Items */}
          <nav className={`flex-1 overflow-y-auto py-6 space-y-1.5 custom-scrollbar transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-4'}`}>
            {batchWorkspaceNav.map((item) => {
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
                  <IconComponent active={isActive} className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="animate-fade-in truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════
          STUDENT PORTAL NAV
      ══════════════════════════════════════════════════════════════ */}
      {!showAdminSidebar && (
        <nav className={`flex-1 overflow-y-auto py-6 space-y-1.5 custom-scrollbar transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-4'}`}>
          {studentNav.map((item) => {
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
                <IconComponent active={isActive} className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="animate-fade-in truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      )}

    </aside>
  );
};
