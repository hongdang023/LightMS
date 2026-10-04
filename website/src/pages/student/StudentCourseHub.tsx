import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  ArrowRight, 
  X, 
  LogOut, 
  CheckCircle2, 
  KeyRound,
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useCourse } from '../../context/CourseContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { BrandLogo } from '../../components/BrandLogo';
import { Button } from '../../components/ui/Button';
import type { Course, Batch } from '../../types/database';

interface StudentCourseHubProps {
  onEnterClass: (page?: string) => void;
}

const FALLBACK_COVER = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';

export const StudentCourseHub: React.FC<StudentCourseHubProps> = ({ onEnterClass }) => {
  const { 
    courses, 
    activeCourse, 
    activeBatch, 
    getBatchesForCourse, 
    isUserEnrolledInBatch, 
    selectCourseAndBatch,
    enrollWithAccessCode
  } = useCourse();
  const { activeUser, logout } = useAuth();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCourseForModal, setSelectedCourseForModal] = useState<Course | null>(null);
  const [accessCodeInput, setAccessCodeInput] = useState<string>('');
  const [accessCodeError, setAccessCodeError] = useState<string | null>(null);
  const [isSubmittingCode, setIsSubmittingCode] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Filter courses based on search query
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  // Count enrolled batches for a course
  const getEnrolledBatches = (courseId: string) => {
    const courseBatches = getBatchesForCourse(courseId);
    return courseBatches.filter(b => isUserEnrolledInBatch(b.id));
  };

  const handleOpenCourseModal = (course: Course) => {
    setSelectedCourseForModal(course);
    setAccessCodeInput('');
    setAccessCodeError(null);
  };

  const handleEnterBatch = (course: Course, batch: Batch) => {
    selectCourseAndBatch(course, batch);
    setSelectedCourseForModal(null);
    showToast(`Đã chọn ${course.title} • ${batch.name}`, 'info');
    onEnterClass('dashboard');
  };

  const handleActivateAccessCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCodeInput.trim()) {
      setAccessCodeError('Vui lòng nhập mã kích hoạt.');
      return;
    }

    setIsSubmittingCode(true);
    setAccessCodeError(null);

    setTimeout(() => {
      const result = enrollWithAccessCode(accessCodeInput.trim(), undefined);
      setIsSubmittingCode(false);

      if (result.success && result.batch) {
        showToast(result.message, 'success');
        setSelectedCourseForModal(null);
        onEnterClass('dashboard');
      } else {
        setAccessCodeError(result.message);
      }
    }, 300);
  };

  // Determine if user has an active course for the returning user view
  const userHasEnrolledCourse = !!(activeCourse && activeBatch && isUserEnrolledInBatch(activeBatch.id));
  const otherCourses = courses.filter(c => c.id !== activeCourse?.id);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F0F0] text-[#15333B] flex flex-col font-sans">
      {/* ── Top Navigation Header (Exact Stitch Design) ───────────────────── */}
      <header className="bg-[#15333B] text-white px-4 sm:px-8 py-2.5 shadow-md sticky top-0 z-30 border-b border-[#3E5E63]/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo size={32} lighthouseColor="#FFFFFF" sunbeamColor="#FFC72C" waveColor="#00B2E2" />
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-wide text-white">LightMS</span>
              <span className="px-2 py-0.5 rounded-full bg-[#214C54] text-[10px] font-bold text-[#FFD94C] border border-[#FFD94C]/30 hidden sm:inline-block">
                Cổng Lựa Chọn Hải Trình
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {activeUser && (
              <div className="relative" ref={dropdownRef}>
                {/* Avatar Profile Pill Button — Exact Image 2 */}
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-full hover:bg-white/10 transition-colors focus:outline-none"
                >
                  <img
                    src={activeUser.avatar_url}
                    alt={activeUser.full_name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-[#214C54]"
                  />
                  <div className="text-left hidden sm:flex flex-col justify-center">
                    <p className="text-xs font-bold text-white leading-tight mb-0">
                      {activeUser.full_name}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium leading-tight mb-0">
                      {activeUser.role === 'admin' ? 'Admin' : 'Học viên'}
                    </p>
                  </div>
                  <ChevronRight
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                      dropdownOpen ? 'rotate-90 text-white' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-[#15333B] text-white rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-fade-in z-50">
                    {/* User Info Header */}
                    <div className="px-4 py-3.5 flex items-center gap-3 border-b border-[#3E5E63]/60">
                      <img
                        src={activeUser.avatar_url}
                        alt={activeUser.full_name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-[#FFD94C] shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-extrabold text-sm text-white truncate mb-0">
                          {activeUser.full_name}
                        </p>
                        <p className="text-[11px] text-[#FFD94C] font-semibold mb-0">
                          {activeUser.role === 'admin' ? 'Admin' : 'Học viên'} • {activeUser.nautical_miles || 0} Hải lý
                        </p>
                        <p className="text-[10px] text-gray-400 font-mono truncate mb-0">
                          {activeUser.gmail}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="py-1.5">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Body ────────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* Section Header & Subtitle */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#214C54] uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#EAB308]" />
                THE1IGHT ECOSYSTEM
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#15333B] tracking-tight mb-1">
                {userHasEnrolledCourse ? 'Cổng Lựa Chọn Hải Trình' : 'Hải Trình Khóa Học'}
              </h1>
              <p className="text-[#3E5E63] text-xs sm:text-sm">
                Chọn khóa học và lớp học (Batch) để tiếp tục hải trình rèn luyện.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm khóa học..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#F0F0F0] border border-gray-200 rounded-xl text-xs text-[#15333B] placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#214C54] transition-all"
              />
            </div>
          </div>
        </div>

        {/* ── VIEW 1: Returning Student Layout with Priority Course (Screen 2) ─── */}
        {userHasEnrolledCourse && !searchQuery ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Featured Active Course Card */}
            <div className="lg:col-span-6 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-[#3E5E63] uppercase tracking-wider">
                    KHÓA HỌC ƯU TIÊN
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] border border-[#10B981]/40 text-[#10B981] text-[11px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Đang tham gia ({activeBatch?.batch_code})
                  </span>
                </div>

                <div className="relative h-52 w-full rounded-xl overflow-hidden bg-gray-100 mb-4 group cursor-pointer" onClick={() => handleOpenCourseModal(activeCourse)}>
                  <img
                    src={activeCourse.cover_image}
                    alt={activeCourse.title}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_COVER; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-black text-base md:text-lg leading-tight text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                      {activeCourse.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-[#3E5E63] mb-4 line-clamp-2">
                  {activeCourse.description}
                </p>
              </div>

              <Button
                variant="primary"
                size="md"
                className="w-full justify-between"
                onClick={() => handleEnterBatch(activeCourse, activeBatch)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                <span>Vào học</span>
              </Button>
            </div>

            {/* Right: Other Courses in the Ecosystem */}
            <div className="lg:col-span-6 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold text-[#3E5E63] uppercase tracking-wider">
                    CÁC HẢI TRÌNH TIẾP THEO
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    Khám phá thêm
                  </span>
                </div>

                <div className="space-y-3.5">
                  {otherCourses.map(course => {
                    const isCourseActive = course.is_active !== false;
                    const enrolledCount = isCourseActive ? getEnrolledBatches(course.id).length : 0;

                    return (
                      <div
                        key={course.id}
                        onClick={() => {
                          if (!isCourseActive) return;
                          handleOpenCourseModal(course);
                        }}
                        className={`p-3.5 border rounded-xl transition-all flex items-center justify-between gap-4 group ${
                          isCourseActive
                            ? 'border-gray-200 hover:border-[#214C54]/40 hover:bg-[#F0F0F0]/50 cursor-pointer bg-white'
                            : 'border-dashed border-gray-300 bg-gray-50/80 cursor-not-allowed opacity-75'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-gray-200">
                            <img
                              src={course.cover_image}
                              alt={course.title}
                              onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_COVER; }}
                              className={`w-full h-full object-cover ${!isCourseActive ? 'grayscale contrast-75' : ''}`}
                            />
                            {!isCourseActive && (
                              <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                                <span className="text-[10px] text-white">🔒</span>
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                              <span className="px-1.5 py-0.2 rounded bg-gray-100 text-[#214C54] text-[9px] font-bold">
                                {course.category}
                              </span>
                              {!isCourseActive ? (
                                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-bold">
                                  Chưa cập nhật
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.2 rounded bg-[#FDF5DA] text-[#EAB308] text-[9px] font-bold">
                                  {course.level}
                                </span>
                              )}
                            </div>
                            <h4 className={`text-xs font-bold transition-colors truncate ${isCourseActive ? 'text-[#15333B] group-hover:text-[#214C54]' : 'text-gray-500'}`}>
                              {course.title}
                            </h4>
                          </div>
                        </div>

                        {isCourseActive ? (
                          <Button
                            variant={enrolledCount > 0 ? "primary" : "secondary"}
                            size="sm"
                            className="shrink-0"
                            rightIcon={<ArrowRight className="w-3 h-3" />}
                          >
                            Chọn lớp
                          </Button>
                        ) : (
                          <span className="shrink-0 px-2.5 py-1 text-[11px] font-semibold text-gray-400 bg-gray-200/60 rounded-lg">
                            Đang chuẩn bị
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 text-center">
                <p className="text-[11px] text-gray-400">
                  💡 Bạn có thể đăng ký nhiều khóa học đồng thời trong cùng một tài khoản.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* ── VIEW 2: 4-Card Grid Layout (Screen 1) ─────────────────────────── */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-[#3E5E63] uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#214C54]" />
                Danh Sách Các Hải Trình Sẵn Sàng
              </h2>
              <span className="text-xs text-gray-400 font-medium">
                {filteredCourses.filter(c => c.is_active !== false).length} khóa học khả dụng
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredCourses.map(course => {
                const isCourseActive = course.is_active !== false;
                const enrolledBatches = isCourseActive ? getEnrolledBatches(course.id) : [];
                const isEnrolled = enrolledBatches.length > 0;

                return (
                  <div
                    key={course.id}
                    onClick={() => {
                      if (!isCourseActive) return;
                      handleOpenCourseModal(course);
                    }}
                    className={`group rounded-2xl overflow-hidden shadow-sm transition-all duration-200 flex flex-col justify-between ${
                      isCourseActive
                        ? 'bg-white border border-gray-200 hover:shadow-md hover:-translate-y-1 cursor-pointer'
                        : 'bg-gray-50/80 border border-dashed border-gray-300 cursor-not-allowed opacity-80'
                    }`}
                  >
                    <div>
                      {/* Course Image */}
                      <div className="relative h-36 w-full overflow-hidden bg-gray-100">
                        <img
                          src={course.cover_image}
                          alt={course.title}
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_COVER; }}
                          className={`w-full h-full object-cover transition-transform duration-300 ${
                            isCourseActive ? 'group-hover:scale-105' : 'grayscale contrast-75'
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        {!isCourseActive && (
                          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-slate-900/80 text-amber-300 border border-amber-300/40 text-[10px] font-bold tracking-wide">
                            Chưa cập nhật
                          </div>
                        )}
                      </div>

                      {/* Course Info */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-1.5 py-0.2 rounded bg-gray-100 text-[#214C54] text-[9px] font-bold">
                            {course.category}
                          </span>
                        </div>
                        <h3 className={`text-sm font-bold leading-snug line-clamp-2 transition-colors ${
                          isCourseActive ? 'text-[#15333B] group-hover:text-[#214C54]' : 'text-gray-500'
                        }`}>
                          {course.title}
                        </h3>
                        <p className="text-[11px] text-[#3E5E63] line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      {isCourseActive ? (
                        <Button
                          variant={isEnrolled ? "primary" : "secondary"}
                          size="sm"
                          className="w-full justify-center"
                          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                        >
                          Chọn lớp học
                        </Button>
                      ) : (
                        <div className="w-full py-2 bg-gray-200/60 text-gray-500 text-xs font-semibold rounded-xl text-center">
                          Chưa cập nhật
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* ── MODAL: Batch Selection & Access Code Activation (Matches Image 1) ─── */}
      {selectedCourseForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <span className="px-3 py-1 rounded-full bg-[#E6F4F6] text-[#214C54] text-xs font-bold inline-block mb-2">
                  Hải Trình Đang Chọn
                </span>
                <button
                  onClick={() => setSelectedCourseForModal(null)}
                  className="p-1 text-gray-400 hover:text-[#15333B] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-[#15333B] tracking-tight mb-1.5">
                {selectedCourseForModal.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#3E5E63]">
                Chọn lớp học hoặc kích hoạt lớp mới để tiếp tục lộ trình
              </p>
            </div>

            {/* Batches List */}
            <div>
              <h3 className="text-xs font-bold text-[#15333B] uppercase tracking-wider mb-3">
                CÁC LỚP HỌC THUỘC KHÓA
              </h3>

              <div className="space-y-3">
                {getBatchesForCourse(selectedCourseForModal.id).map(batch => {
                  const isEnrolled = isUserEnrolledInBatch(batch.id);
                  const isBatchActive = batch.is_active;

                  return (
                    <div
                      key={batch.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isBatchActive ? 'border-gray-200 bg-white hover:border-gray-300' : 'border-dashed border-gray-200 bg-gray-50/60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`font-bold text-base ${isBatchActive ? 'text-[#15333B]' : 'text-gray-500'}`}>
                            {batch.name.replace(/\s*\([^)]*\)/g, '')}
                          </span>
                          {isBatchActive ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] text-xs font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                              Đang diễn ra
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
                              Chưa cập nhật
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-[#3E5E63]">
                          {batch.start_date && (
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-gray-400" />
                              {batch.start_date} - {batch.end_date || 'N/A'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div>
                        {!isBatchActive ? (
                          <span className="px-4 py-2 bg-gray-100 text-gray-400 text-xs font-semibold rounded-xl inline-block">
                            Chưa cập nhật
                          </span>
                        ) : isEnrolled ? (
                          <button
                            onClick={() => handleEnterBatch(selectedCourseForModal, batch)}
                            className="px-5 py-2.5 bg-[#214C54] hover:bg-[#15333B] text-white text-sm font-semibold rounded-xl transition-colors shrink-0 shadow-sm"
                          >
                            Vào học
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setAccessCodeInput('');
                              setAccessCodeError(null);
                              inputRef.current?.focus();
                            }}
                            className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-[#15333B] text-sm font-semibold rounded-xl transition-colors shrink-0 shadow-sm flex items-center gap-1.5"
                          >
                            <KeyRound className="w-3.5 h-3.5 text-[#F59E0B]" />
                            <span>Kích hoạt</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Access Code Input Section */}
            <div className="p-4 sm:p-5 bg-[#F9FAFB] border border-gray-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#F59E0B]" />
                <h4 className="text-xs font-bold text-[#15333B]">
                  Kích Hoạt Lớp Học Mới
                </h4>
              </div>

              <form onSubmit={handleActivateAccessCode} className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Nhập mã kích hoạt lớp học..."
                    value={accessCodeInput}
                    onChange={e => {
                      setAccessCodeInput(e.target.value.toUpperCase());
                      setAccessCodeError(null);
                    }}
                    className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-[#15333B] placeholder:text-gray-400 focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54]"
                  />
                  <button
                    type="submit"
                    disabled={!accessCodeInput.trim() || isSubmittingCode}
                    className="px-5 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-[#15333B] font-bold text-xs rounded-xl transition-colors shrink-0 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingCode ? 'Đang kích hoạt...' : 'Nhập mã kích hoạt'}
                  </button>
                </div>

                {accessCodeError && (
                  <p className="text-xs text-[#EF4444] font-medium pt-1">
                    {accessCodeError}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
