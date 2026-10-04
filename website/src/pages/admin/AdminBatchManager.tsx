import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  KeyRound, 
  Copy, 
  Check, 
  Calendar, 
  Sparkles, 
  Search,
  ArrowRight,
  ChevronLeft,
  Trash2,
  Edit3,
  BookOpen,
  LogOut,
  ChevronRight,
  Eye,
  GraduationCap
} from 'lucide-react';
import { useCourse } from '../../context/CourseContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { enrollmentService } from '../../services/enrollmentService';
import { BrandLogo } from '../../components/BrandLogo';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import type { Course, Batch } from '../../types/database';

interface AdminBatchManagerProps {
  onPageChange?: (page: string) => void;
}

const FALLBACK_COVER = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';

export const AdminBatchManager: React.FC<AdminBatchManagerProps> = ({ onPageChange }) => {
  const { 
    courses, 
    setCourses,
    batches, 
    setBatches, 
    activeBatch, 
    selectCourseAndBatch 
  } = useCourse();
  const { activeUser, logout } = useAuth();
  const { showToast } = useToast();

  // Navigation flow state: 'courses' (Screen 1) | 'batches' (Screen 2: batches of selected course)
  const [currentView, setCurrentView] = useState<'courses' | 'batches'>('courses');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Search queries
  const [courseSearchQuery, setCourseSearchQuery] = useState('');
  const [batchSearchQuery, setBatchSearchQuery] = useState('');

  // UI States
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Modal States - Course
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseSlug, setCourseSlug] = useState('');
  const [courseTagline, setCourseTagline] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseLevel, setCourseLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [courseCategory, setCourseCategory] = useState('');
  const [courseCover, setCourseCover] = useState('');

  // Modal States - Batch
  const [isCreatingBatch, setIsCreatingBatch] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [batchTitle, setBatchTitle] = useState('');
  const [batchCode, setBatchCode] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Close profile dropdown on click outside
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Filtered Courses
  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(courseSearchQuery.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(courseSearchQuery.toLowerCase())) ||
    (c.category && c.category.toLowerCase().includes(courseSearchQuery.toLowerCase()))
  );

  // Filtered Batches for selected course
  const currentCourseBatches = batches.filter(b => 
    selectedCourse && b.course_id === selectedCourse.id &&
    (b.name.toLowerCase().includes(batchSearchQuery.toLowerCase()) || 
     b.access_code.toLowerCase().includes(batchSearchQuery.toLowerCase()) ||
     b.batch_code.toLowerCase().includes(batchSearchQuery.toLowerCase()))
  );

  // ── Actions ─────────────────────────────────────────────────────────────
  const handleOpenCourseBatches = (course: Course) => {
    setSelectedCourse(course);
    setCurrentView('batches');
    setBatchSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCourses = () => {
    setCurrentView('courses');
    setSelectedCourse(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Đã sao chép mã kích hoạt: ${code}`, 'success');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSelectBatchAndEnter = (batch: Batch, course: Course) => {
    selectCourseAndBatch(course, batch);
    showToast(`Đã vào workspace quản trị: ${course.title} (${batch.name})`, 'success');
    if (onPageChange) {
      onPageChange('admin-dashboard');
    }
  };

  // Generate random access code
  const handleGenerateRandomCode = (courseSlug?: string) => {
    const prefix = (courseSlug || selectedCourse?.slug || 'VIBE')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 7);
    const randomNum = Math.floor(100 + Math.random() * 900);
    const nextBatchNum = currentCourseBatches.length + 1;
    setAccessCode(`${prefix}-K${nextBatchNum}-${randomNum}`);
  };

  // ── Course CRUD ────────────────────────────────────────────────────────
  const handleOpenCreateCourse = () => {
    setCourseTitle('');
    setCourseSlug('');
    setCourseTagline('');
    setCourseDescription('');
    setCourseLevel('Beginner');
    setCourseCategory('AI Development');
    setCourseCover('');
    setEditingCourse(null);
    setIsCreatingCourse(true);
  };

  const handleOpenEditCourse = (course: Course, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCourse(course);
    setCourseTitle(course.title);
    setCourseSlug(course.slug);
    setCourseTagline(course.tagline || '');
    setCourseDescription(course.description || '');
    setCourseLevel(course.level || 'Beginner');
    setCourseCategory(course.category || '');
    setCourseCover(course.cover_image || '');
    setIsCreatingCourse(true);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) {
      showToast('Vui lòng nhập tên khóa học.', 'error');
      return;
    }

    const generatedSlug = courseSlug.trim() || courseTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (editingCourse) {
      // Update
      const updatedCourses = courses.map(c => 
        c.id === editingCourse.id 
          ? {
              ...c,
              title: courseTitle.trim(),
              slug: generatedSlug,
              tagline: courseTagline.trim(),
              description: courseDescription.trim(),
              level: courseLevel,
              category: courseCategory.trim(),
              cover_image: courseCover.trim() || editingCourse.cover_image,
            }
          : c
      );
      setCourses(updatedCourses);
      showToast(`Đã cập nhật khóa học: ${courseTitle}`, 'success');
      if (selectedCourse?.id === editingCourse.id) {
        setSelectedCourse(updatedCourses.find(c => c.id === editingCourse.id) || null);
      }
    } else {
      // Create New
      const newCourse: Course = {
        id: `course-${Date.now()}`,
        title: courseTitle.trim(),
        slug: generatedSlug,
        tagline: courseTagline.trim() || 'Khóa học thực chiến với AI & Modern Stack',
        description: courseDescription.trim(),
        level: courseLevel,
        category: courseCategory.trim() || 'AI Software Development',
        cover_image: courseCover.trim() || FALLBACK_COVER,
        is_active: true,
      };
      setCourses(prev => [...prev, newCourse]);
      showToast(`Đã thêm khóa học mới: ${newCourse.title}`, 'success');
    }

    setIsCreatingCourse(false);
  };

  const handleDeleteCourse = (courseId: string, courseTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Bạn có chắc chắn muốn xóa khóa học "${courseTitle}" và các lớp học liên quan?`)) {
      setCourses(prev => prev.filter(c => c.id !== courseId));
      setBatches(prev => prev.filter(b => b.course_id !== courseId));
      showToast(`Đã xóa khóa học "${courseTitle}"`, 'info');
      if (selectedCourse?.id === courseId) {
        setCurrentView('courses');
        setSelectedCourse(null);
      }
    }
  };

  // ── Batch CRUD ─────────────────────────────────────────────────────────
  const handleOpenCreateBatch = () => {
    if (!selectedCourse) return;
    setEditingBatch(null);
    setBatchTitle(`${selectedCourse.title.split(':')[0]} - Khóa ${currentCourseBatches.length + 1}`);
    setBatchCode(`K${currentCourseBatches.length + 1}`);
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    handleGenerateRandomCode(selectedCourse.slug);
    setIsCreatingBatch(true);
  };

  const handleOpenEditBatch = (batch: Batch, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingBatch(batch);
    setBatchTitle(batch.name);
    setBatchCode(batch.batch_code);
    setAccessCode(batch.access_code);
    setStartDate(batch.start_date || '');
    setEndDate(batch.end_date || '');
    setIsCreatingBatch(true);
  };

  const handleSaveBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    if (!batchTitle.trim() || !accessCode.trim()) {
      showToast('Vui lòng nhập đầy đủ tên lớp và mã kích hoạt.', 'error');
      return;
    }

    if (editingBatch) {
      // Update
      const updated = enrollmentService.updateBatch(editingBatch.id, {
        name: batchTitle.trim(),
        batch_code: batchCode.trim().toUpperCase() || editingBatch.batch_code,
        access_code: accessCode.trim().toUpperCase(),
        start_date: startDate,
        end_date: endDate,
      });
      setBatches(updated);
      showToast(`Đã cập nhật lớp: ${batchTitle}`, 'success');
    } else {
      // Create
      const newBatch = enrollmentService.createBatch({
        course_id: selectedCourse.id,
        batch_code: batchCode.trim().toUpperCase() || `K${currentCourseBatches.length + 1}`,
        name: batchTitle.trim(),
        access_code: accessCode.trim().toUpperCase(),
        start_date: startDate || new Date().toISOString().split('T')[0],
        end_date: endDate,
        is_active: true,
      });
      setBatches(prev => [...prev, newBatch]);
      showToast(`Tạo thành công Lớp: ${newBatch.name}`, 'success');
    }

    setIsCreatingBatch(false);
  };

  const handleDeleteBatch = (batchId: string, batchName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Bạn có chắc chắn muốn xóa lớp "${batchName}"?`)) {
      const updated = enrollmentService.deleteBatch(batchId);
      setBatches(updated);
      showToast(`Đã xóa lớp "${batchName}"`, 'info');
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] text-[#15333B] flex flex-col font-sans">
      {/* ── Top Navigation Header (Deep Teal B4 Standard) ─────────────────── */}
      <header className="bg-[#15333B] text-white px-4 sm:px-8 py-3 shadow-md sticky top-0 z-30 border-b border-[#3E5E63]/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo size={32} lighthouseColor="#FFFFFF" sunbeamColor="#FFC72C" waveColor="#00B2E2" />
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-wide text-white">LightMS</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#214C54] text-[10px] font-bold text-[#FFD94C] border border-[#FFD94C]/30 flex items-center gap-1">
                <Layers className="w-3 h-3 text-[#FFD94C]" />
                Cổng Quản Trị Khóa Học & Lớp
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Link to Student Hub */}
            <button
              onClick={() => onPageChange && onPageChange('course-hub')}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-teal-400" />
              <span>Chế độ xem Học viên</span>
            </button>

            {/* Profile Dropdown */}
            {activeUser && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(prev => !prev)}
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
                    <p className="text-[10px] text-teal-300 font-medium leading-tight mb-0">
                      Quản trị viên
                    </p>
                  </div>
                  <ChevronRight
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                      dropdownOpen ? 'rotate-90 text-white' : ''
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-[#15333B] text-white rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-fade-in z-50">
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
                          Admin Cổng Quản Trị
                        </p>
                        <p className="text-[10px] text-gray-400 font-mono truncate mb-0">
                          {activeUser.gmail}
                        </p>
                      </div>
                    </div>

                    <div className="py-1.5">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          if (onPageChange) onPageChange('course-hub');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        <GraduationCap className="w-4 h-4 text-teal-400" />
                        Xem Cổng Học Viên
                      </button>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
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

      {/* ── Main Workspace Body ────────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">

        {/* ════════════════════════════════════════════════════════════════════
            BƯỚC 1: DANH SÁCH KHÓA HỌC (COURSES VIEW)
        ════════════════════════════════════════════════════════════════════ */}
        {currentView === 'courses' && (
          <>
            {/* Hub Banner */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#214C54] uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#EAB308]" />
                    QUẢN TRỊ HỆ THỐNG LIGHTMS
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#15333B] tracking-tight mb-1">
                    Danh Sách Khóa Học
                  </h1>
                  <p className="text-[#3E5E63] text-xs sm:text-sm">
                    Chọn một khóa học để quản lý các lớp học (Cohorts/Batches), cấp mã kích hoạt và thiết lập lộ trình.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="primary"
                    leftIcon={<Plus className="w-4 h-4" />}
                    onClick={handleOpenCreateCourse}
                  >
                    Thêm Khóa Học Mới
                  </Button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm theo tên khóa, danh mục..."
                    value={courseSearchQuery}
                    onChange={e => setCourseSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-[#F0F0F0] border border-gray-200 rounded-xl text-xs text-[#15333B] placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#214C54] transition-all"
                  />
                </div>
                <div className="text-xs text-[#3E5E63] font-medium self-end sm:self-center">
                  Đang hiển thị <span className="font-bold text-[#15333B]">{filteredCourses.length}</span> khóa học
                </div>
              </div>
            </div>

            {/* Courses Cards Grid - 4 Cards Side-by-Side on Desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredCourses.map(course => {
                const courseBatches = batches.filter(b => b.course_id === course.id);
                const activeBatchesCount = courseBatches.filter(b => b.is_active).length;

                return (
                  <div
                    key={course.id}
                    onClick={() => handleOpenCourseBatches(course)}
                    className="bg-white border border-gray-200 hover:border-[#214C54] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
                  >
                    <div>
                      {/* Cover Image Header */}
                      <div className="relative h-36 w-full overflow-hidden bg-gray-100">
                        <img
                          src={course.cover_image || FALLBACK_COVER}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                        
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md bg-[#15333B]/90 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-wider border border-white/20">
                            {course.category?.split(' ')[0] || 'AI'}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-[#15333B] text-[9px] font-bold">
                            {course.level || 'Beginner'}
                          </span>
                        </div>

                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                          <button
                            onClick={(e) => handleOpenEditCourse(course, e)}
                            className="p-1 rounded-md bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-colors"
                            title="Chỉnh sửa khóa học"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteCourse(course.id, course.title, e)}
                            className="p-1 rounded-md bg-rose-900/60 hover:bg-rose-700 text-rose-200 backdrop-blur-md transition-colors"
                            title="Xóa khóa học"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="absolute bottom-2.5 left-3 right-3">
                          <span className="px-2 py-0.5 rounded-full bg-[#ECFDF5] border border-[#10B981]/40 text-[#10B981] text-[10px] font-bold inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                            {courseBatches.length} Lớp ({activeBatchesCount} đang mở)
                          </span>
                        </div>
                      </div>

                      {/* Course Content */}
                      <div className="p-4">
                        <h2 className="text-sm font-bold text-[#15333B] group-hover:text-[#214C54] transition-colors mb-1.5 line-clamp-2 h-10 leading-snug">
                          {course.title}
                        </h2>
                        <p className="text-[11px] text-[#3E5E63] font-medium line-clamp-2 h-8 leading-relaxed">
                          {course.tagline || course.description}
                        </p>
                      </div>
                    </div>

                    {/* Footer / CTA */}
                    <div className="px-4 pb-4 pt-3 border-t border-gray-100 flex flex-col gap-2.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#3E5E63] font-medium">Mã slug:</span>
                        <span className="font-mono font-bold text-[#15333B] truncate max-w-[130px]">{course.slug}</span>
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full text-[11px] py-2"
                        rightIcon={<ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />}
                        onClick={() => handleOpenCourseBatches(course)}
                      >
                        Quản lý Lớp học
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            BƯỚC 2: QUẢN LÝ LỚP HỌC (BATCHES VIEW CỦA KHÓA ĐÃ CHỌN)
        ════════════════════════════════════════════════════════════════════ */}
        {currentView === 'batches' && selectedCourse && (
          <>
            {/* Back Button & Breadcrumbs */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleBackToCourses}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#214C54] hover:text-[#15333B] transition-colors bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-2xl shadow-black/5 hover:border-gray-300"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Quay lại Danh sách Khóa học</span>
              </button>

              <div className="text-xs font-semibold text-[#3E5E63]">
                Khóa học: <span className="font-bold text-[#15333B]">{selectedCourse.title}</span>
              </div>
            </div>

            {/* Course Context Header Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <img
                    src={selectedCourse.cover_image || FALLBACK_COVER}
                    alt={selectedCourse.title}
                    className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0 hidden sm:block"
                  />
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#214C54] uppercase tracking-wider mb-1">
                      <BookOpen className="w-3.5 h-3.5 text-[#214C54]" />
                      DANH SÁCH LỚP HỌC (BATCHES)
                    </div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-[#15333B] tracking-tight mb-1">
                      {selectedCourse.title}
                    </h1>
                    <p className="text-[#3E5E63] text-xs">
                      {selectedCourse.tagline || selectedCourse.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Button
                    variant="primary"
                    leftIcon={<Plus className="w-4 h-4" />}
                    onClick={handleOpenCreateBatch}
                  >
                    Tạo Lớp (Batch) Mới
                  </Button>
                </div>
              </div>

              {/* Search & Stats Bar */}
              <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm theo tên lớp, Access Code, K1/K2..."
                    value={batchSearchQuery}
                    onChange={e => setBatchSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-[#F0F0F0] border border-gray-200 rounded-xl text-xs text-[#15333B] placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#214C54] transition-all"
                  />
                </div>
                <div className="text-xs text-[#3E5E63] font-medium">
                  Tổng cộng: <span className="font-bold text-[#15333B]">{currentCourseBatches.length}</span> Lớp học
                </div>
              </div>
            </div>

            {/* Batches Grid */}
            {currentCourseBatches.length === 0 ? (
              <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center">
                <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-[#15333B] mb-1">Chưa có lớp học nào cho khóa này</h3>
                <p className="text-xs text-[#3E5E63] mb-4">
                  Bấm nút bên dưới để tạo Lớp học (Batch) đầu tiên và cấp Mã kích hoạt.
                </p>
                <Button
                  variant="primary"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={handleOpenCreateBatch}
                >
                  Tạo Lớp Đầu Tiên
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentCourseBatches.map(batch => {
                  const isCurrentBatch = activeBatch?.id === batch.id;
                  const isEnded = batch.name.toLowerCase().includes('kết thúc') || batch.batch_code === 'K1';

                  return (
                    <div
                      key={batch.id}
                      className={`bg-white rounded-2xl p-6 border transition-all shadow-sm flex flex-col justify-between ${
                        isCurrentBatch 
                          ? 'border-[#214C54] ring-2 ring-[#214C54]/20 shadow-md' 
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      <div>
                        {/* Header: Batch Code & Status */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-lg bg-[#214C54] text-[#FFD94C] font-mono text-xs font-extrabold shadow-xs">
                              {batch.batch_code}
                            </span>
                            {isCurrentBatch && (
                              <Badge variant="mastery" size="sm">
                                Đang quản trị
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              isEnded 
                                ? 'bg-gray-100 text-gray-600 border-gray-200' 
                                : batch.is_active 
                                ? 'bg-[#ECFDF5] text-[#10B981] border-[#10B981]/30' 
                                : 'bg-[#FFFBEB] text-[#F59E0B] border-[#F59E0B]/30'
                            }`}>
                              {isEnded ? 'Đã kết thúc' : batch.is_active ? 'Đang kích hoạt' : 'Chưa mở'}
                            </span>

                            <button
                              onClick={(e) => handleOpenEditBatch(batch, e)}
                              className="p-1 hover:bg-gray-100 text-gray-400 hover:text-[#15333B] rounded-lg transition-colors"
                              title="Chỉnh sửa lớp"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => handleDeleteBatch(batch.id, batch.name, e)}
                              className="p-1 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-lg transition-colors"
                              title="Xóa lớp"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-bold text-[#15333B] mb-4 line-clamp-1">
                          {batch.name}
                        </h3>

                        {/* Access Code Highlight Card */}
                        <div className="p-3 bg-[#F8FAFC] border border-gray-200 rounded-xl mb-4">
                          <div className="text-[10px] uppercase font-bold text-[#3E5E63] tracking-wider mb-1 flex items-center gap-1">
                            <KeyRound className="w-3 h-3 text-[#EAB308]" />
                            Mã kích hoạt (Access Code)
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-sm font-extrabold text-[#15333B] tracking-wider">
                              {batch.access_code || '••••••••••••'}
                            </span>
                            {batch.access_code && (
                              <button
                                onClick={() => handleCopyCode(batch.access_code)}
                                className="p-1.5 hover:bg-white text-[#3E5E63] hover:text-[#15333B] rounded-lg border border-transparent hover:border-gray-200 transition-all shadow-xs"
                                title="Sao chép mã"
                              >
                                {copiedCode === batch.access_code ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Metadata: Dates */}
                        <div className="space-y-1.5 text-xs text-[#3E5E63]">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span>{batch.start_date || 'N/A'} → {batch.end_date || 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      {/* CTA เข้าจัดการ lớp */}
                      <div className="mt-5 pt-4 border-t border-gray-100">
                        <Button
                          variant={isCurrentBatch ? 'primary' : 'primary'}
                          className="w-full"
                          size="md"
                          rightIcon={<ArrowRight className="w-4 h-4" />}
                          onClick={() => handleSelectBatchAndEnter(batch, selectedCourse)}
                        >
                          {isCurrentBatch ? 'Vào Quản Lý Lớp Này' : isEnded ? 'Xem Dữ Liệu Lớp' : 'Quản Lý Lớp Này'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

      </main>

      {/* ════════════════════════════════════════════════════════════════════
          MODAL: THÊM / SỬA KHÓA HỌC
      ════════════════════════════════════════════════════════════════════ */}
      {isCreatingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-extrabold text-[#15333B] mb-1 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#214C54]" />
              {editingCourse ? 'Chỉnh Sửa Khóa Học' : 'Thêm Khóa Học Mới'}
            </h3>
            <p className="text-xs text-[#3E5E63] mb-6">
              Điền thông tin khóa học để hiển thị trong hệ thống LightMS.
            </p>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#15333B] uppercase mb-1.5">
                  Tên Khóa Học *
                </label>
                <input
                  type="text"
                  placeholder="VD: Vibe Coding 301: AI Autonomous Systems"
                  value={courseTitle}
                  onChange={e => setCourseTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F0F0F0] border border-gray-200 rounded-xl text-xs text-[#15333B] focus:bg-white focus:border-[#214C54] focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#15333B] uppercase mb-1.5">
                    Mã Slug (URL)
                  </label>
                  <input
                    type="text"
                    placeholder="VD: vibe-coding-301"
                    value={courseSlug}
                    onChange={e => setCourseSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="w-full px-3.5 py-2.5 bg-[#F0F0F0] border border-gray-200 rounded-xl text-xs font-mono text-[#15333B] focus:bg-white focus:border-[#214C54] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#15333B] uppercase mb-1.5">
                    Trình độ (Level)
                  </label>
                  <select
                    value={courseLevel}
                    onChange={e => setCourseLevel(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#F0F0F0] border border-gray-200 rounded-xl text-xs text-[#15333B] focus:bg-white focus:border-[#214C54] focus:outline-none"
                  >
                    <option value="Beginner">Beginner (Cơ bản)</option>
                    <option value="Intermediate">Intermediate (Trung cấp)</option>
                    <option value="Advanced">Advanced (Nâng cao)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#15333B] uppercase mb-1.5">
                  Danh mục (Category)
                </label>
                <input
                  type="text"
                  placeholder="VD: AI Software Development"
                  value={courseCategory}
                  onChange={e => setCourseCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F0F0F0] border border-gray-200 rounded-xl text-xs text-[#15333B] focus:bg-white focus:border-[#214C54] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#15333B] uppercase mb-1.5">
                  Khẩu hiệu / Tagline ngắn
                </label>
                <input
                  type="text"
                  placeholder="VD: Xây dựng hệ thống tự hành AI đa tác tử"
                  value={courseTagline}
                  onChange={e => setCourseTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F0F0F0] border border-gray-200 rounded-xl text-xs text-[#15333B] focus:bg-white focus:border-[#214C54] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#15333B] uppercase mb-1.5">
                  Mô tả chi tiết
                </label>
                <textarea
                  rows={3}
                  placeholder="Mô tả nội dung và giá trị đầu ra của khóa học..."
                  value={courseDescription}
                  onChange={e => setCourseDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#F0F0F0] border border-gray-200 rounded-xl text-xs text-[#15333B] focus:bg-white focus:border-[#214C54] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#15333B] uppercase mb-1.5">
                  Link ảnh bìa (Cover Image URL)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={courseCover}
                  onChange={e => setCourseCover(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F0F0F0] border border-gray-200 rounded-xl text-xs text-[#15333B] focus:bg-white focus:border-[#214C54] focus:outline-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setIsCreatingCourse(false)}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                >
                  {editingCourse ? 'Lưu Thay Đổi' : 'Tạo Khóa Học'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          MODAL: THÊM / SỬA LỚP HỌC (BATCH)
      ════════════════════════════════════════════════════════════════════ */}
      {isCreatingBatch && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-extrabold text-[#15333B] mb-1 flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#214C54]" />
              {editingBatch ? 'Chỉnh Sửa Lớp Học' : 'Tạo Lớp Học (Batch) Mới'}
            </h3>
            <p className="text-xs text-[#3E5E63] mb-6">
              Thuộc khóa học: <span className="font-bold text-[#15333B]">{selectedCourse.title}</span>
            </p>

            <form onSubmit={handleSaveBatch} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#15333B] uppercase mb-1.5">
                  Tên Lớp Học *
                </label>
                <input
                  type="text"
                  placeholder="VD: Vibe Coding 201 - Khóa 3"
                  value={batchTitle}
                  onChange={e => setBatchTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F0F0F0] border border-gray-200 rounded-xl text-xs text-[#15333B] focus:bg-white focus:border-[#214C54] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#15333B] uppercase mb-1.5">
                  Mã Lớp (Batch Code)
                </label>
                <input
                  type="text"
                  placeholder="VD: K3"
                  value={batchCode}
                  onChange={e => setBatchCode(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 bg-[#F0F0F0] border border-gray-200 rounded-xl text-xs font-mono font-bold text-[#15333B] focus:bg-white focus:border-[#214C54] focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#15333B] uppercase">
                    Mã Kích Hoạt (Access Code) *
                  </label>
                  <button
                    type="button"
                    onClick={() => handleGenerateRandomCode(selectedCourse.slug)}
                    className="text-[11px] text-[#214C54] hover:text-[#15333B] flex items-center gap-1 font-bold"
                  >
                    <Sparkles className="w-3 h-3 text-[#EAB308]" />
                    Tự sinh mã
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="VD: VIBE201-K3-789"
                  value={accessCode}
                  onChange={e => setAccessCode(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 bg-[#F0F0F0] border border-gray-200 rounded-xl text-xs font-mono font-bold text-[#15333B] tracking-wider focus:bg-white focus:border-[#214C54] focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#15333B] uppercase mb-1.5">
                    Ngày Khai Giảng
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F0F0F0] border border-gray-200 rounded-xl text-xs text-[#15333B] focus:bg-white focus:border-[#214C54] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#15333B] uppercase mb-1.5">
                    Ngày Bế Giảng
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F0F0F0] border border-gray-200 rounded-xl text-xs text-[#15333B] focus:bg-white focus:border-[#214C54] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setIsCreatingBatch(false)}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                >
                  {editingBatch ? 'Lưu Thay Đổi' : 'Tạo Lớp Ngay'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
