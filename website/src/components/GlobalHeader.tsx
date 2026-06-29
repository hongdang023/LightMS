import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, LogOut, UserCircle, LayoutDashboard } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';

interface GlobalHeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

// Map page id → { label, parent }
const PAGE_META: Record<string, { label: string; parent?: string; parentId?: string }> = {
  dashboard:      { label: 'Trang chủ' },
  about:          { label: 'Giới thiệu' },
  onboarding:     { label: 'Onboarding' },
  syllabus:       { label: 'Lộ trình học' },
  discussion:     { label: 'Phòng thảo luận' },
  calendar:       { label: 'Lịch học' },
  walloffame:     { label: 'Bảng vinh danh' },
  help:           { label: 'Hỏi đáp & Hỗ trợ' },
  profile:        { label: 'Hồ sơ cá nhân' },
  'admin-dashboard': { label: 'Tổng quan hệ thống' },
  'course-builder':  { label: 'Soạn lộ trình' },
  'speedgrader':     { label: 'Chấm bài tập' },
  'student-mgmt':    { label: 'Quản lý học viên' },
  'internal-team':   { label: 'Quản lý nhân sự' },
};

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({ currentPage, onPageChange }) => {
  const { activeUser, switchUser, lessons, nauticalTransactions, logout } = useDatabase();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isStudent = activeUser.role === 'student';
  const isAdmin = activeUser.role === 'admin' || activeUser.role === 'mentor';

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Breadcrumbs
  const pageMeta = PAGE_META[currentPage];
  const breadcrumbs: { label: string; id?: string }[] = [{ label: 'LightMS' }];
  if (pageMeta) breadcrumbs.push({ label: pageMeta.label, id: currentPage });

  // Progress bar
  const completedLessons = nauticalTransactions
    .filter(t => t.student_id === activeUser.id && t.action_type === 'lesson_complete')
    .map(t => t.reference_id || '');
  const uniqueCompleted = Array.from(new Set(completedLessons));
  const progressPercent = lessons.length > 0 ? Math.min(100, Math.round((uniqueCompleted.length / lessons.length) * 100)) : 0;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-0 flex items-center justify-between shadow-sm z-30 select-none h-14 shrink-0">

      {/* LEFT: Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm">
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-300" />}
            {crumb.id ? (
              <span className="font-bold text-[#15333B]">{crumb.label}</span>
            ) : (
              <span
                className="text-gray-400 font-semibold cursor-pointer hover:text-[#214C54] transition-colors"
                onClick={() => onPageChange(isStudent ? 'dashboard' : 'admin-dashboard')}
              >
                {crumb.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* CENTER: Sailing Progress Bar (student only) */}
      {isStudent && (
        <div className="flex-1 max-w-xs mx-8 hidden lg:flex flex-col items-center">
          <div className="w-full flex justify-between items-center text-[9px] text-gray-400 font-bold mb-1">
            <span>0%</span>
            <span className="text-[#214C54] font-extrabold">Hải trình: {progressPercent}%</span>
            <span>100%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full relative overflow-visible border border-gray-200">
            <div
              className="h-full bg-gradient-to-r from-[#214C54] to-[#3E5E63] rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
            <div
              className="absolute -top-2.5 text-sm transition-all duration-1000 ease-out"
              style={{ left: `calc(${progressPercent}% - 8px)` }}
            >
              ⛵
            </div>
          </div>
        </div>
      )}

      {/* RIGHT: Avatar Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          id="header-profile-dropdown"
          onClick={() => setDropdownOpen(prev => !prev)}
          className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          <img
            src={activeUser.avatar_url}
            alt={activeUser.full_name}
            className="w-8 h-8 rounded-full object-cover border-2 border-[#214C54]"
          />
          <div className="text-left hidden sm:block">
            <p className="text-xs font-extrabold text-[#15333B] leading-tight">{activeUser.full_name.split(' ').slice(-1)[0]}</p>
            <p className="text-[9px] text-gray-400 font-semibold leading-tight">
              {isStudent ? 'Học viên' : 'Admin / Mentor'}
            </p>
          </div>
          <ChevronRight className={`w-3.5 h-3.5 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-90' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-[#15333B] text-white rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-fade-in z-50">
            {/* User Info Header */}
            <div className="px-4 py-4 flex items-center gap-3 border-b border-[#3E5E63]/60">
              <div className="relative shrink-0">
                <img
                  src={activeUser.avatar_url}
                  alt={activeUser.full_name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#FFD94C]"
                />
              </div>
              <div className="min-w-0">
                {/* Tên — lớn nhất, bold nhất */}
                <p className="font-extrabold text-[15px] text-white leading-tight truncate">
                  {activeUser.full_name.split(' ').slice(-1)[0]}
                </p>
                {/* Vai trò — cỡ trung, màu gold nhạt */}
                <p className="text-[11px] text-[#FFD94C]/80 font-semibold leading-tight mt-0.5">
                  {isStudent ? 'Học viên' : 'Admin / Mentor'}
                </p>
                {/* Email — nhỏ nhất, mono, mờ nhất */}
                <p className="text-[10px] text-[#3E5E63] font-mono leading-tight mt-0.5 truncate">
                  {activeUser.gmail}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="py-1.5">
              <button
                onClick={() => { onPageChange('profile'); setDropdownOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-white/80 hover:bg-[#214C54] hover:text-white transition-colors"
              >
                <UserCircle className="w-4 h-4 text-[#FFD94C]" />
                Hồ sơ cá nhân
              </button>

              {/* Switch View — Admin only */}
              {isAdmin && (
                <button
                  onClick={() => {
                    const isAdminPage = [
                      'admin-dashboard',
                      'admin-announcements',
                      'course-builder',
                      'admin-calendar',
                      'speedgrader',
                      'student-mgmt',
                      'internal-team'
                    ].includes(currentPage);
                    
                    if (isAdminPage) {
                      onPageChange('dashboard');
                    } else {
                      onPageChange('admin-dashboard');
                    }
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-white/80 hover:bg-[#214C54] hover:text-white transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#FFD94C]" />
                  {[
                    'admin-dashboard',
                    'admin-announcements',
                    'course-builder',
                    'admin-calendar',
                    'speedgrader',
                    'student-mgmt',
                    'internal-team'
                  ].includes(currentPage) ? 'Góc độ Học viên' : 'Admin Portal'}
                </button>
              )}
              {isStudent && (import.meta.env.DEV || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (
                <button
                  onClick={() => {
                    switchUser('admin');
                    onPageChange('admin-dashboard');
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-white/80 hover:bg-[#214C54] hover:text-white transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#FFD94C]" />
                  Admin Portal
                </button>
              )}

              <div className="border-t border-[#3E5E63]/60 my-1" />

              <button
                onClick={() => {
                  logout();
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/15 hover:text-red-300 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Đăng xuất
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
