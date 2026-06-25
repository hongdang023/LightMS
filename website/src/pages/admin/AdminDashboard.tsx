import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { PageHeader } from '../../components/PageHeader';
import { 
  LayoutDashboard, Users, FileText, CheckSquare, BarChart3, AlertTriangle, 
  Mail, X, ChevronDown, ChevronRight, Milestone, Trophy, AlertCircle, Sparkles
} from 'lucide-react';

interface AdminDashboardProps {
  onPageChange: (page: string) => void;
}

// Custom Premium SVG Donut Chart Component
interface DonutChartProps {
  completed: number;
  total: number;
  label: string;
  sublabel: string;
  colorHex?: string;
  emptyColorHex?: string;
}

const DonutChart: React.FC<DonutChartProps> = ({ 
  completed, 
  total, 
  label, 
  sublabel,
  colorHex = '#214C54', 
  emptyColorHex = '#F3F4F6' 
}) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const radius = 32;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-5 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-3 transition-all hover:shadow-md">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="transparent"
            stroke={emptyColorHex}
            strokeWidth={strokeWidth}
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="transparent"
            stroke={colorHex}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-black text-[#15333B]">{percentage}%</span>
          <span className="text-[9px] text-gray-400 font-bold uppercase">{completed}/{total} HV</span>
        </div>
      </div>
      <div className="text-center space-y-0.5">
        <span className="text-[11px] font-black text-[#15333B] block uppercase tracking-wider">{label}</span>
        <span className="text-[9px] text-[#3E5E63] font-bold block">{sublabel}</span>
      </div>
    </div>
  );
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onPageChange }) => {
  const { 
    users, submissions, assignments, onboardingUnlockSchedules, 
    onboardingDays, lessons, addNotification 
  } = useDatabase();

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  
  // Interactive filters states
  const [selectedOnboardingDay, setSelectedOnboardingDay] = useState<number>(1);
  const [selectedLessonId, setSelectedLessonId] = useState<string>('les-1');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'top' | 'lagging' | 'bottlenecks'>('top');

  // Bulk email states
  const [isBulkEmailModalOpen, setIsBulkEmailModalOpen] = useState(false);
  const [bulkRecipientGroup, setBulkRecipientGroup] = useState<'all' | 'lagging'>('all');
  const [bulkSubject, setBulkSubject] = useState('');
  const [bulkBody, setBulkBody] = useState('');

  const students = users.filter(u => u.role === 'student');
  const totalStudents = students.length;
  const pendingGradesCount = submissions.filter(s => s.status === 'submitted').length;
  const gradedCount = submissions.filter(s => s.status === 'graded').length;

  // Calculate Assignment Completion Rate
  const totalAssignmentsCount = assignments.length;
  const totalExpectedSubmissions = totalStudents * totalAssignmentsCount;
  const actualSubmissions = submissions.filter(s => s.status === 'submitted' || s.status === 'graded').length;
  const completionRate = totalExpectedSubmissions > 0 ? Math.round((actualSubmissions / totalExpectedSubmissions) * 100) : 0;

  // Calculate Average Batch Progress (max unlocked onboarding day)
  const now = new Date();
  const unlockedDays = onboardingUnlockSchedules.filter(s => {
    const scheduledDate = s.scheduled_at ? new Date(s.scheduled_at) : null;
    return scheduledDate && scheduledDate <= now;
  });
  const maxUnlockedDay = unlockedDays.reduce((max, s) => s.day > max ? s.day : max, 0);

  let progressText = `Ngày ${maxUnlockedDay || 1}/7`;
  let progressSubtext = 'Tuần lễ Onboarding';
  if (maxUnlockedDay >= 7) {
    progressText = 'Live Class';
    progressSubtext = 'Chương trình chính';
  }

  // Lagging status is evaluated inside laggingDetails

  // Selected student object
  const selectedStudent = users.find(u => u.id === selectedStudentId);

  // Helper: Check if a student completed a specific onboarding day
  const isStudentOnboardingDayCompleted = (studentId: string, day: number) => {
    if (studentId === 'profile-student-tuyethong') {
      return day <= 5;
    }
    return day <= 1; // Jack Sparrow only completed Day 1
  };

  // Helper: Check if a student completed a specific lesson assignment
  const isStudentLessonCompleted = (studentId: string, lessonId: string) => {
    const asg = assignments.find(a => a.lesson_id === lessonId);
    if (!asg) return false;
    return submissions.some(s => s.student_id === studentId && s.assignment_id === asg.id && (s.status === 'submitted' || s.status === 'graded'));
  };

  // Helper: Get list of unsubmitted homeworks (bottlenecks) for a student
  const getStudentUnsubmittedLessons = (studentId: string) => {
    return lessons.filter(l => {
      const asg = assignments.find(a => a.lesson_id === l.id);
      if (!asg) return false;
      const submitted = submissions.some(s => s.student_id === studentId && s.assignment_id === asg.id);
      return !submitted;
    });
  };

  // --- STATS CALCULATIONS FOR PIE CHARTS ---

  // 1. Overall Onboarding Completion (completed >= 5 days)
  const onboardingOverallCompletedCount = students.filter(s => {
    let completedDays = 0;
    for (let d = 1; d <= 7; d++) {
      if (isStudentOnboardingDayCompleted(s.id, d)) completedDays++;
    }
    return completedDays >= 5; // consider completed if done at least 5 days
  }).length;

  // 2. Selected Day Onboarding Completion
  const onboardingSelectedDayCompletedCount = students.filter(s => 
    isStudentOnboardingDayCompleted(s.id, selectedOnboardingDay)
  ).length;

  // 3. Selected Lesson Homework Completion
  const selectedLesson = lessons.find(l => l.id === selectedLessonId);
  const lessonSelectedCompletedCount = students.filter(s => 
    isStudentLessonCompleted(s.id, selectedLessonId)
  ).length;

  // --- TAB 1: TOP PERFORMERS ---
  const topPerformers = [...students].sort((a, b) => b.nautical_miles - a.nautical_miles);

  // --- TAB 2: LAGGING STUDENTS ---
  const laggingDetails = students.map(s => {
    const unsubmitted = getStudentUnsubmittedLessons(s.id);
    const completedOnboardingCount = onboardingDays.filter(d => isStudentOnboardingDayCompleted(s.id, d.day)).length;
    
    // Lagging condition: nautical miles < 100 OR has more than 3 unsubmitted homeworks
    const isLagging = s.nautical_miles < 100 || unsubmitted.length > 2;

    return {
      student: s,
      unsubmitted,
      completedOnboardingCount,
      isLagging
    };
  }).filter(item => item.isLagging);

  // --- TAB 3: HOMEWORK BOTTLENECKS ---
  const homeworkBottlenecks = lessons.map(l => {
    const unsubmittedCount = students.filter(s => !isStudentLessonCompleted(s.id, l.id)).length;
    
    let level: 'low' | 'medium' | 'high' = 'low';
    if (unsubmittedCount === totalStudents) level = 'high';
    else if (unsubmittedCount > 0) level = 'medium';

    return {
      lesson: l,
      unsubmittedCount,
      level
    };
  }).sort((a, b) => b.unsubmittedCount - a.unsubmittedCount);

  // Trigger Commendation toast
  const triggerCommendation = (name: string) => {
    setToastMessage(`Đã tuyên dương thủy thủ **${name}** trên Bảng Vàng Danh Vọng thành công!`);
    addNotification('Tuyên dương học viên', `Admin Đặng Tuyết Hồng vừa tuyên dương thủy thủ xuất sắc ${name}!`, 'system');
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Generate detailed progress helper for modal
  const getStudentProgress = (studentId: string) => {
    const onboardingDetail = onboardingDays.map(d => {
      const completed = isStudentOnboardingDayCompleted(studentId, d.day);
      const tasks = d.checklist
        .split('\n')
        .filter(line => line.trim().startsWith('- [ ]') || line.trim().startsWith('- [x]'))
        .map(line => {
          const name = line.replace(/-\s+\[[ x]\]\s+/, '').replace(/\*\*/g, '').trim();
          return {
            name,
            completed: completed ? true : (studentId === 'profile-student-sparrow' && d.day === 1)
          };
        });

      return {
        day: d.day,
        title: d.title,
        completed,
        tasks
      };
    });

    const lessonsDetail = lessons.map(l => {
      const lessonCompleted = studentId === 'profile-student-tuyethong' && l.id === 'les-1';
      const asg = assignments.find(a => a.lesson_id === l.id);
      let assignmentStatus: 'none' | 'not_submitted' | 'submitted' | 'graded' | 'draft' = 'none';
      if (asg) {
        const sub = submissions.find(s => s.student_id === studentId && s.assignment_id === asg.id);
        assignmentStatus = sub ? sub.status : 'not_submitted';
      }

      return {
        id: l.id,
        title: l.title,
        completed: lessonCompleted,
        assignmentStatus
      };
    });

    return {
      onboarding: onboardingDetail,
      lessons: lessonsDetail
    };
  };

  // Mailto link builder
  const getMailtoLink = (student: typeof students[0], missingCount: number) => {
    const emailSubject = encodeURIComponent(`[LightMS] Hỗ trợ học tập Hải trình Vibe Coding - Thủy thủ ${student.full_name}`);
    const emailBody = encodeURIComponent(
      `Chào thủy thủ ${student.full_name},\n\n` +
      `Thầy/Cô và ban vận hành lớp học thấy bạn đang có chút chậm tiến độ so với lớp (Bạn hiện đang còn ${missingCount} bài tập chưa nộp hoặc cần hỗ trợ gỡ rối).\n\n` +
      `Thuyền trưởng Đặng Tuyết Hồng muốn hỏi thăm xem bạn có đang gặp rào cản hay khó khăn gì không? Hãy nhắn tin trực tiếp trên chat nhóm hỗ trợ Light Support hoặc đặt lịch hẹn Office Hour để Mentor hỗ trợ bạn gỡ rối nhanh nhất nhé.\n\n` +
      `Quyết tâm giương buồm vượt đại dương nào!\n\n` +
      `Thân ái,\n` +
      `Đặng Tuyết Hồng - LightMS`
    );
    return `mailto:${student.gmail}?subject=${emailSubject}&body=${emailBody}`;
  };

  const getBulkEmails = () => {
    if (bulkRecipientGroup === 'lagging') {
      return laggingDetails.map(item => item.student.gmail).join(',');
    }
    return students.map(s => s.gmail).join(',');
  };

  const handleSendBulkEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const emails = getBulkEmails();
    if (!emails) {
      alert('Không có người nhận trong nhóm này!');
      return;
    }
    const mailto = `mailto:?bcc=${emails}&subject=${encodeURIComponent(bulkSubject)}&body=${encodeURIComponent(bulkBody)}`;
    window.open(mailto, '_blank');
    
    setToastMessage(`Đã mở ứng dụng Mail gửi tới nhóm **${bulkRecipientGroup === 'all' ? 'Tất cả học viên' : 'Học viên chậm tiến độ'}** thành công!`);
    addNotification('Gửi mail hàng loạt', `Admin vừa gửi email hàng loạt cho nhóm ${bulkRecipientGroup === 'all' ? 'Tất cả học viên' : 'Học viên chậm tiến độ'}.`, 'system');
    
    setIsBulkEmailModalOpen(false);
    setBulkSubject('');
    setBulkBody('');
  };

  return (
    <div className="space-y-8 animate-fade-in select-none">
      <PageHeader
        title="Tổng quan hệ thống"
        description="Theo dõi toàn bộ hoạt động của học viên và trạng thái khóa học."
        icon={<LayoutDashboard size={32} strokeWidth={1.5} />}
        action={
          <button
            onClick={() => setIsBulkEmailModalOpen(true)}
            className="btn btn-primary text-xs font-extrabold px-4 py-2 flex items-center gap-2 rounded-xl shadow-sm"
          >
            <Mail size={14} /> Gửi Email Hàng Loạt
          </button>
        }
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-teal-800 text-white px-5 py-3 rounded-2xl shadow-2xl border border-teal-700 flex items-center gap-3 animate-scale-up">
          <Trophy className="text-yellow-400 w-5 h-5 animate-bounce" />
          <span className="text-xs font-bold" dangerouslySetInnerHTML={{ __html: toastMessage }}></span>
          <button onClick={() => setToastMessage(null)} className="text-teal-300 hover:text-white ml-2">
            <X size={14} />
          </button>
        </div>
      )}
      
      {/* Admin Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
        <div className="card flex items-center gap-4 bg-white shadow-sm border border-gray-100 hover:border-teal-500/20 transition-all">
          <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
            <Users size={22} />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-extrabold uppercase block tracking-wider">Thủy Thủ Đoàn</span>
            <span className="text-lg font-black text-[#15333B]">{totalStudents} học viên</span>
          </div>
        </div>

        <div className="card flex items-center gap-4 bg-white shadow-sm border border-gray-100 cursor-pointer hover:border-[#214C54]/30 hover:shadow transition-all" onClick={() => onPageChange('speedgrader')}>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <FileText size={22} />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-extrabold uppercase block tracking-wider">Chờ Chấm Điểm</span>
            <span className="text-lg font-black text-[#15333B]">{pendingGradesCount} bài nộp</span>
          </div>
        </div>

        <div className="card flex items-center gap-4 bg-white shadow-sm border border-gray-100 hover:border-green-500/20 transition-all">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
            <CheckSquare size={22} />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-extrabold uppercase block tracking-wider">Đã Chấm Điểm</span>
            <span className="text-lg font-black text-[#15333B]">{gradedCount} bài nộp</span>
          </div>
        </div>

        <div className="card flex items-center gap-4 bg-white shadow-sm border border-gray-100 hover:border-purple-500/20 transition-all">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <Milestone size={22} />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-extrabold uppercase block tracking-wider">Tiến Độ Lớp Học</span>
            <span className="text-lg font-black text-[#15333B] block leading-none mb-0.5">{progressText}</span>
            <span className="text-[9px] text-gray-500 font-bold block">{progressSubtext}</span>
          </div>
        </div>

        <div className="card flex items-center gap-4 bg-white shadow-sm border border-gray-100 hover:border-blue-500/20 transition-all">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <BarChart3 size={22} />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-extrabold uppercase block tracking-wider">Tỷ Lệ Hoàn Thành</span>
            <span className="text-lg font-black text-[#15333B]">{completionRate}%</span>
          </div>
        </div>
      </div>

      {/* --- NEW STATS PIE CHARTS SECTIONS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Onboarding Completion Box */}
        <div className="card bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-[#15333B] flex items-center gap-2 border-b border-gray-100 pb-3">
            <Sparkles className="text-[#214C54] w-5 h-5" /> Thống kê Onboarding Week
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Overall Donut Chart */}
            <DonutChart 
              completed={onboardingOverallCompletedCount} 
              total={totalStudents} 
              label="Tổng quan Tuần" 
              sublabel="Hoàn thành >= 5 ngày"
              colorHex="#7C3AED" 
            />
            {/* Day-specific Donut Chart with Dropdown */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">Chọn Ngày Onboarding</label>
                <div className="relative">
                  <select 
                    value={selectedOnboardingDay} 
                    onChange={(e) => setSelectedOnboardingDay(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:border-purple-500 font-bold text-[#15333B] appearance-none cursor-pointer"
                  >
                    {onboardingDays.map(d => (
                      <option key={d.day} value={d.day}>Ngày {d.day}: {d.title.split(': ')[1] || d.title}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                    <ChevronDown size={14} />
                  </div>
                </div>
              </div>
              
              <DonutChart 
                completed={onboardingSelectedDayCompletedCount} 
                total={totalStudents} 
                label={`Chi tiết Ngày ${selectedOnboardingDay}`} 
                sublabel="Hoàn thành checklist"
                colorHex="#845EF7" 
              />
            </div>
          </div>
        </div>

        {/* Live Class Homework Completion Box */}
        <div className="card bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-[#15333B] flex items-center gap-2 border-b border-gray-100 pb-3">
            <CheckSquare className="text-[#214C54] w-5 h-5" /> Thống kê Bài tập Live Class
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Overall Homework Donut Chart */}
            <DonutChart 
              completed={submissions.filter(s => s.status === 'graded').length} 
              total={totalExpectedSubmissions} 
              label="Đã chấm điểm toàn khóa" 
              sublabel="Bài tập đạt chất lượng"
              colorHex="#10B981" 
            />
            {/* Session-specific Donut Chart with Dropdown */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">Chọn Buổi học</label>
                <div className="relative">
                  <select 
                    value={selectedLessonId} 
                    onChange={(e) => setSelectedLessonId(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:border-teal-500 font-bold text-[#15333B] appearance-none cursor-pointer"
                  >
                    {lessons.map((l, idx) => (
                      <option key={l.id} value={l.id}>Buổi {idx + 1}: {l.title}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                    <ChevronDown size={14} />
                  </div>
                </div>
              </div>

              <DonutChart 
                completed={lessonSelectedCompletedCount} 
                total={totalStudents} 
                label={selectedLesson ? `Chi tiết Buổi học` : 'Chi tiết buổi'} 
                sublabel="Đã nộp bài / Đã chấm"
                colorHex="#0D9488" 
              />
            </div>
          </div>
        </div>

      </div>

      {/* --- NEW OVERVIEW AND FILTER PANEL (PERFORMANCE OVERSEER) --- */}
      <div className="card bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        {/* Tab Selection */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-2 gap-4">
          <div>
            <h3 className="font-extrabold text-base text-[#15333B] flex items-center gap-2">
              <BarChart3 className="text-[#214C54] w-5 h-5" /> Hệ thống Giám sát & Phân loại học viên
            </h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Giám sát điểm số, khen thưởng và phát hiện điểm nghẽn</p>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-100 p-1.5 rounded-xl border border-gray-200/60 self-start sm:self-auto">
            <button 
              onClick={() => setActiveTab('top')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${
                activeTab === 'top' 
                  ? 'bg-white text-teal-800 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Trophy size={13} /> Thủy Thủ Xuất Sắc
            </button>
            <button 
              onClick={() => setActiveTab('lagging')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${
                activeTab === 'lagging' 
                  ? 'bg-white text-red-800 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <AlertCircle size={13} /> Cần Hỗ Trợ
            </button>
            <button 
              onClick={() => setActiveTab('bottlenecks')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${
                activeTab === 'bottlenecks' 
                  ? 'bg-white text-amber-800 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <AlertTriangle size={13} /> Điểm Nghẽn Học Tập
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="animate-fade-in text-xs">
          
          {/* TAB 1: TOP PERFORMERS */}
          {activeTab === 'top' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-extrabold text-[10px] uppercase tracking-wider">
                    <th className="py-3 px-2">Học Viên</th>
                    <th className="py-3 px-2">Tích Lũy</th>
                    <th className="py-3 px-2">Hoàn Thành Onboarding</th>
                    <th className="py-3 px-2">Đánh Giá</th>
                    <th className="py-3 px-2 text-right">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {topPerformers.map((s, idx) => {
                    const completedOnboardingCount = onboardingDays.filter(d => isStudentOnboardingDayCompleted(s.id, d.day)).length;
                    
                    return (
                      <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-2 flex items-center gap-3">
                          <img src={s.avatar_url} alt={s.full_name} className="w-8 h-8 rounded-full object-cover border" />
                          <div>
                            <span className="font-bold text-[#15333B] block">{s.full_name}</span>
                            <span className="text-[9px] text-gray-400 block">{s.gmail}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 font-black text-teal-800">{s.nautical_miles} Hải lý</td>
                        <td className="py-3 px-2 font-bold text-gray-600">{completedOnboardingCount}/7 ngày</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                            idx === 0 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-teal-100 text-teal-800'
                          }`}>
                            {idx === 0 ? '🏆 Thuyền trưởng xuất sắc' : '⭐ Thủy thủ tích cực'}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <button 
                            onClick={() => triggerCommendation(s.full_name)}
                            className="btn border border-[#214C54] hover:bg-[#214C54] hover:text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-all"
                          >
                            Tuyên Dương 🏆
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: LAGGING STUDENTS */}
          {activeTab === 'lagging' && (
            <div className="space-y-4">
              {laggingDetails.length === 0 ? (
                <p className="text-xs text-gray-400 italic text-center py-6">🎉 Hiện tại không có thủy thủ nào bị chậm trễ hoặc dồn bài.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {laggingDetails.map(({ student, unsubmitted, completedOnboardingCount }) => (
                    <div key={student.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 first:pt-0 last:pb-0">
                      <div className="flex items-start gap-3">
                        <img src={student.avatar_url} alt={student.full_name} className="w-10 h-10 rounded-full object-cover border" />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-[#15333B] text-sm">{student.full_name}</span>
                            <span className="text-[9px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-extrabold">Cần can thiệp gấp</span>
                          </div>
                          <p className="text-[10px] text-gray-400 font-bold">
                            Tích lũy: <span className="text-red-700">{student.nautical_miles} Hải lý</span> • Hoàn thành Onboarding: {completedOnboardingCount}/7 ngày
                          </p>
                          
                          {/* Homework progress track (visual indicators instead of cluttered badges) */}
                          <div className="pt-2">
                            <span className="text-[9px] text-gray-400 font-extrabold uppercase block tracking-wider mb-1.5">Tiến trình bài tập lớp (Buổi 1 - 9):</span>
                            <div className="flex flex-wrap items-center gap-1.5">
                              {lessons.map((lesson, index) => {
                                const asg = assignments.find(a => a.lesson_id === lesson.id);
                                let statusColor = 'bg-gray-50 text-gray-400 border-gray-200';
                                let statusText = `Buổi ${index + 1}: ${lesson.title} - Chưa mở khóa hoặc không có bài tập`;

                                if (asg) {
                                  const sub = submissions.find(s => s.student_id === student.id && s.assignment_id === asg.id);
                                  if (sub) {
                                    if (sub.status === 'graded') {
                                      statusColor = 'bg-green-100 text-green-800 border-green-200';
                                      statusText = `Buổi ${index + 1}: ${lesson.title} - Đã chấm điểm ✓`;
                                    } else if (sub.status === 'submitted') {
                                      statusColor = 'bg-teal-100 text-teal-800 border-teal-200';
                                      statusText = `Buổi ${index + 1}: ${lesson.title} - Đã nộp, chờ chấm ⏳`;
                                    } else if (sub.status === 'draft') {
                                      statusColor = 'bg-amber-100 text-amber-800 border-amber-200';
                                      statusText = `Buổi ${index + 1}: ${lesson.title} - Đang làm nháp 📝`;
                                    }
                                  } else {
                                    statusColor = 'bg-red-50 text-red-700 border-red-100';
                                    statusText = `Buổi ${index + 1}: ${lesson.title} - Chưa nộp bài ❌`;
                                  }
                                }

                                return (
                                  <div 
                                    key={lesson.id}
                                    title={statusText}
                                    className={`w-7 h-7 rounded-lg border flex items-center justify-center font-black text-[10px] cursor-help transition-all hover:scale-110 shadow-sm ${statusColor}`}
                                  >
                                    {index + 1}
                                  </div>
                                );
                              })}
                            </div>
                            <span className="text-[9px] text-red-600 font-bold block mt-1.5">
                              * Bạn có {unsubmitted.length} bài tập chưa nộp (ô màu đỏ). Di chuột vào từng ô để xem tên bài học.
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 self-center flex-shrink-0">
                        <button 
                          onClick={() => setSelectedStudentId(student.id)}
                          className="btn border border-gray-300 hover:bg-gray-50 text-gray-700 text-[10px] font-extrabold px-3.5 py-2 rounded-xl shadow-sm whitespace-nowrap"
                        >
                          Chi Tiết Tiến Độ
                        </button>
                        <a 
                          href={getMailtoLink(student, unsubmitted.length)}
                          className="btn bg-[#214C54] hover:bg-[#15333B] text-white text-[10px] font-extrabold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm whitespace-nowrap"
                        >
                          <Mail size={12} /> Hối Thúc Nộp Bài
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: HOMEWORK BOTTLENECKS */}
          {activeTab === 'bottlenecks' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-[11px] text-amber-900 leading-relaxed">
                💡 **Gợi ý dành cho Mentor:** Dưới đây là danh sách bài tập được xếp thứ tự giảm dần theo số lượng học viên chưa nộp bài. Những bài tập ở trên cùng chính là **điểm nghẽn** nơi học viên đang bị dồn bài nhiều nhất. Mentor nên chủ động mở Office Hour hoặc bổ sung study note hỗ trợ riêng các bài này!
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-extrabold text-[10px] uppercase tracking-wider">
                      <th className="py-3 px-2">Buổi học & Bài tập</th>
                      <th className="py-3 px-2">Số Học Viên Chưa Nộp</th>
                      <th className="py-3 px-2">Mức Độ Tồn Đọng</th>
                      <th className="py-3 px-2 text-right">Trạng Thái Thống Kê</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {homeworkBottlenecks.map((item, idx) => (
                      <tr key={item.lesson.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-2">
                          <span className="text-[10px] text-gray-400 font-bold block">BUỔI {idx + 1}</span>
                          <span className="font-bold text-[#15333B] block leading-tight">{item.lesson.title}</span>
                          <p className="text-[9px] text-gray-400 truncate max-w-[400px] mt-0.5">{assignments.find(a => a.lesson_id === item.lesson.id)?.description || 'Không có mô tả bài tập'}</p>
                        </td>
                        <td className="py-3 px-2 font-black text-red-800 text-sm">
                          {item.unsubmittedCount} / {totalStudents} học viên
                        </td>
                        <td className="py-3 px-2">
                          {item.level === 'high' && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] bg-red-100 text-red-800 font-black uppercase">Nghiêm trọng (100% trễ) 🔴</span>
                          )}
                          {item.level === 'medium' && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] bg-amber-100 text-amber-800 font-black uppercase">Cần lưu ý 🟡</span>
                          )}
                          {item.level === 'low' && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] bg-green-100 text-green-800 font-black uppercase">Thông thoáng 🟢</span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-right text-[10px] text-gray-500 font-bold">
                          {item.unsubmittedCount === 0 ? 'Hoàn thành tốt ✓' : `${item.unsubmittedCount} người bị dồn bài ⏳`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Interactive Student Progress Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] border border-gray-100 overflow-hidden animate-scale-up">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-teal-550 to-teal-650 text-[#15333B] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img 
                  src={selectedStudent.avatar_url} 
                  alt={selectedStudent.full_name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-teal-100"
                />
                <div>
                  <h4 className="text-lg font-black text-[#15333B]">{selectedStudent.full_name}</h4>
                  <p className="text-[10px] text-[#3E5E63] font-bold">
                    {selectedStudent.gmail} • Tích lũy: {selectedStudent.nautical_miles} Hải lý
                  </p>
                </div>
              </div>
              <button 
                onClick={() => { setSelectedStudentId(null); setExpandedDay(null); }}
                className="w-8 h-8 rounded-full bg-[#15333B]/5 hover:bg-[#15333B]/10 flex items-center justify-center text-[#15333B] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50">
              
              {/* Onboarding Stage Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="font-extrabold text-sm text-[#15333B] flex items-center gap-1.5">
                    🚀 Chặng 1: Onboarding Week (7 Ngày)
                  </h5>
                </div>
                
                <div className="space-y-2.5">
                  {getStudentProgress(selectedStudent.id).onboarding.map(day => (
                    <div 
                      key={day.day} 
                      className={`border rounded-xl bg-white overflow-hidden transition-all duration-200 ${
                        day.completed ? 'border-green-200' : 'border-gray-200'
                      }`}
                    >
                      {/* Day Header */}
                      <div 
                        className={`p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50/80 ${
                          day.completed ? 'bg-green-50/10' : ''
                        }`}
                        onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                      >
                        <div className="flex items-center gap-2">
                          {day.completed ? (
                            <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold">✓</span>
                          ) : (
                            <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-[10px] font-bold">!</span>
                          )}
                          <span className="text-xs font-bold text-[#15333B]">
                            Ngày {day.day}: {day.title.split(': ')[1] || day.title}
                          </span>
                        </div>
                        {expandedDay === day.day ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </div>

                      {/* Day Expandable Checklist */}
                      {expandedDay === day.day && (
                        <div className="p-3 border-t border-gray-100 bg-gray-50/30 space-y-2 text-[11px]">
                          {day.tasks.length === 0 ? (
                            <p className="text-gray-400 italic">Không có nhiệm vụ.</p>
                          ) : (
                            day.tasks.map((task, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-gray-700">
                                <span className={`mt-0.5 font-bold ${task.completed ? 'text-green-600' : 'text-red-500'}`}>
                                  {task.completed ? '✓' : '✗'}
                                </span>
                                <span className={task.completed ? 'line-through text-gray-400' : 'font-medium'}>
                                  {task.name}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Class Stage Details */}
              <div className="space-y-4">
                <h5 className="font-extrabold text-sm text-[#15333B] flex items-center gap-1.5">
                  📚 Chặng 2: Live Class & Bài tập
                </h5>

                <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
                  {getStudentProgress(selectedStudent.id).lessons.map((lesson, index) => (
                    <div 
                      key={lesson.id} 
                      className={`p-3 border rounded-xl bg-white flex items-center justify-between gap-4 ${
                        lesson.completed ? 'border-teal-200' : 'border-gray-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] text-gray-400 font-bold block">BUỔI {index + 1}</span>
                        <span className="text-xs font-bold text-[#15333B] block leading-tight">{lesson.title}</span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                            lesson.completed ? 'bg-teal-50 text-[#214C54]' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {lesson.completed ? 'Đã xem bài học ✓' : 'Chưa xem ✗'}
                          </span>
                        </div>
                      </div>

                      {/* Assignment status badge */}
                      <div>
                        {lesson.assignmentStatus === 'none' && (
                          <span className="text-[10px] text-gray-400 italic">Không có bài tập</span>
                        )}
                        {lesson.assignmentStatus === 'not_submitted' && (
                          <span className="text-[10px] bg-red-100 text-red-800 px-2 py-1 rounded-lg font-bold">Chưa nộp ❌</span>
                        )}
                        {lesson.assignmentStatus === 'submitted' && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-1 rounded-lg font-bold flex items-center gap-1">Chờ chấm ⏳</span>
                        )}
                        {lesson.assignmentStatus === 'graded' && (
                          <span className="text-[10px] bg-green-100 text-green-800 px-2 py-1 rounded-lg font-bold">Đã chấm điểm ✓</span>
                        )}
                        {lesson.assignmentStatus === 'draft' && (
                          <span className="text-[10px] bg-gray-100 text-gray-800 px-2 py-1 rounded-lg font-bold">Nháp 📝</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-white flex justify-between gap-3">
              <a 
                href={getMailtoLink(selectedStudent, getStudentUnsubmittedLessons(selectedStudent.id).length)}
                className="btn btn-primary text-xs font-extrabold px-4 py-2 flex items-center gap-2 rounded-xl"
              >
                <Mail size={14} /> Gửi Email Can Thiệp Hỗ Trợ
              </a>
              <button 
                onClick={() => { setSelectedStudentId(null); setExpandedDay(null); }}
                className="btn border border-gray-300 text-gray-700 text-xs font-bold px-4 py-2 hover:bg-gray-50 rounded-xl"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Bulk Email Modal */}
      {isBulkEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl flex flex-col border border-gray-100 overflow-hidden animate-scale-up">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-teal-850">
                <Mail className="w-5 h-5" />
                <h4 className="text-sm font-black text-[#15333B] uppercase tracking-wider">Gửi Email Hàng Loạt</h4>
              </div>
              <button 
                onClick={() => { setIsBulkEmailModalOpen(false); setBulkSubject(''); setBulkBody(''); }}
                className="w-8 h-8 rounded-full bg-[#15333B]/5 hover:bg-[#15333B]/10 flex items-center justify-center text-[#15333B] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSendBulkEmail} className="p-6 space-y-4">
              {/* Recipient Group Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#15333B] block">Gửi tới nhóm học viên:</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                    <input 
                      type="radio" 
                      name="recipientGroup" 
                      value="all" 
                      checked={bulkRecipientGroup === 'all'} 
                      onChange={() => setBulkRecipientGroup('all')}
                      className="text-[#214C54] focus:ring-[#214C54]"
                    />
                    <span>Tất cả học viên ({students.length} người)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                    <input 
                      type="radio" 
                      name="recipientGroup" 
                      value="lagging" 
                      checked={bulkRecipientGroup === 'lagging'} 
                      onChange={() => setBulkRecipientGroup('lagging')}
                      className="text-[#214C54] focus:ring-[#214C54]"
                    />
                    <span className="text-red-700">Chậm tiến độ ({laggingDetails.length} người)</span>
                  </label>
                </div>
              </div>

              {/* Subject Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#15333B] block">Tiêu đề Email (Subject):</label>
                <input 
                  type="text"
                  required
                  placeholder="Nhập tiêu đề email..."
                  value={bulkSubject}
                  onChange={(e) => setBulkSubject(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54]/20 transition-all font-bold text-[#15333B]"
                />
              </div>

              {/* Body Textarea */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#15333B] block">Nội dung Email (Body):</label>
                <textarea 
                  required
                  rows={6}
                  placeholder="Nhập nội dung email gửi cho học viên..."
                  value={bulkBody}
                  onChange={(e) => setBulkBody(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs leading-relaxed focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54]/20 resize-none transition-all font-medium text-gray-700"
                />
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => { setIsBulkEmailModalOpen(false); setBulkSubject(''); setBulkBody(''); }}
                  className="btn border border-gray-300 text-gray-700 text-xs font-bold px-4 py-2 hover:bg-gray-50 rounded-xl"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary text-xs font-extrabold px-5 py-2 flex items-center gap-2 rounded-xl shadow-md"
                >
                  Gửi Email Hàng Loạt 🚀
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};


