import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCourse } from '../../context/CourseContext';
import { useGamification } from '../../context/GamificationContext';
import { useCommunity } from '../../context/CommunityContext';
import { PageHeader } from '../../components/PageHeader';
import { 
  LayoutDashboard, Users, CheckSquare, 
  Mail, X, ChevronDown, ChevronRight, Trophy, Sparkles, ShieldAlert
} from 'lucide-react';

interface AdminDashboardProps {
  onPageChange: (page: string) => void;
}

import { DonutChart, BarChart } from '../../components/admin/dashboard/AdminStatGrid';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onPageChange }) => {
  const { users } = useAuth();
  const { lessons } = useCourse();
  const { nauticalTransactions } = useGamification();
  const { onboardingDays, addNotification } = useCommunity();

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const courseLessons = lessons;
  const lessonsWithAssignments = courseLessons.filter(l => !!l.assignment_description);

  const students = users.filter(u => u.role === 'student');
  const totalStudents = students.length;

  // Total completions of lessons that have assignments
  const totalCompletedAssignments = (nauticalTransactions || []).filter(
    t => t.action_type === 'lesson_complete' && 
         lessonsWithAssignments.some(l => l.id === t.reference_id)
  ).length;



  // Calculate Assignment Completion Rate
  const totalAssignmentsCount = lessonsWithAssignments.length;
  const totalExpectedSubmissions = totalStudents * totalAssignmentsCount;

  // Selected student object
  const selectedStudent = users.find(u => u.id === selectedStudentId);

  const isStudentOnboardingDayCompleted = (studentId: string, dayNum: number) => {
    const student = users.find(u => u.id === studentId);
    if (!student) return false;
    const dayData = onboardingDays.find(d => d.day === dayNum);
    if (!dayData) return false;

    const lines = dayData.checklist.split('\n');
    const requiredKeys: string[] = [];
    let taskIdx = 0;
    lines.forEach((line: string) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('- [ ]')) {
        taskIdx++;
        const rawLabel = trimmed.replace('- [ ]', '').trim();
        const isOptional = /\(optional[^)]*\)/i.test(rawLabel);
        if (!isOptional) {
          requiredKeys.push(`day-${dayNum}-task-${taskIdx}`);
        }
      }
    });

    if (requiredKeys.length === 0) return true;
    return requiredKeys.every(key => !!student.onboarding_tasks?.[key]);
  };

  // Helper: Check if a student completed a specific lesson assignment
  const isStudentLessonCompleted = (studentId: string, lessonId: string) => {
    return (nauticalTransactions || []).some(
      t => t.student_id === studentId && t.action_type === 'lesson_complete' && t.reference_id === lessonId
    );
  };

  // Helper: Get list of unsubmitted homeworks (bottlenecks) for a student
  const getStudentUnsubmittedLessons = (studentId: string) => {
    return courseLessons.filter(l => {
      if (!l.assignment_description) return false;
      return !isStudentLessonCompleted(studentId, l.id);
    });
  };

  // Helper: Determine student status (risk, outstanding, normal)
  const getStudentStatus = (student: any) => {
    let onboardingDone = 0;
    for (let d = 1; d <= 7; d++) {
      if (isStudentOnboardingDayCompleted(student.id, d)) onboardingDone++;
    }
    
    const visits = student.visits || 1;
    const now = new Date().getTime();
    const studentStart = student.created_at ? new Date(student.created_at).getTime() : now;
    const daysActive = Math.max(1, Math.floor((now - studentStart) / (24 * 60 * 60 * 1000)));

    const onboardingDeadline = studentStart + 7 * 24 * 60 * 60 * 1000;
    const onboardingOverdue = now > onboardingDeadline && onboardingDone < 7;

    const startedLiveClassAssignments = lessonsWithAssignments.filter(l => {
      if (!l.start_date) return false;
      return now >= new Date(l.start_date).getTime();
    });

    const dueLiveClassAssignments = lessonsWithAssignments.filter(l => {
      if (!l.start_date) return false;
      const start = new Date(l.start_date).getTime();
      const deadline = start + 3 * 24 * 60 * 60 * 1000;
      return now >= deadline;
    });

    const liveClassDoneForStarted = (nauticalTransactions || []).filter(
      t => t.student_id === student.id && 
      t.action_type === 'lesson_complete' &&
      startedLiveClassAssignments.some(la => la.id === t.reference_id)
    ).length;

    const liveClassDoneForDue = (nauticalTransactions || []).filter(
      t => t.student_id === student.id && 
      t.action_type === 'lesson_complete' &&
      dueLiveClassAssignments.some(la => la.id === t.reference_id)
    ).length;

    const expectedVisits = Math.min(4, daysActive);
    const visitsAtRisk = visits < expectedVisits;

    const liveClassAtRisk = dueLiveClassAssignments.length > 0 && 
      (liveClassDoneForDue / dueLiveClassAssignments.length) < 0.5;

    const isAtRisk = onboardingOverdue || liveClassAtRisk || visitsAtRisk;

    const expectedOutstandingVisits = Math.min(8, Math.max(2, daysActive));
    const visitsOutstanding = visits >= expectedOutstandingVisits;

    const liveClassOutstanding = startedLiveClassAssignments.length === 0 || 
      (liveClassDoneForStarted === startedLiveClassAssignments.length);

    const isOutstanding = onboardingDone === 7 && liveClassOutstanding && visitsOutstanding;

    if (isAtRisk) return 'risk';
    if (isOutstanding) return 'outstanding';
    return 'normal';
  };

  const riskStudents = students.filter(s => getStudentStatus(s) === 'risk');
  const outstandingStudents = students.filter(s => getStudentStatus(s) === 'outstanding');
  const countNeedingSupport = riskStudents.length;
  const countNeedingReward = outstandingStudents.length;

  const triggerCommendation = (name: string) => {
    setToastMessage(`Đã gửi thư khen ngợi và tuyên dương học viên **${name}** xuất sắc! 🎉`);
    addNotification('Tuyên dương học viên', `Học viên ${name} được vinh danh vì thành tích xuất sắc!`, 'system');
    setTimeout(() => setToastMessage(null), 4000);
  };

  // --- STATS CALCULATIONS ---

  // 1. Overall Onboarding Completion (completed >= 5 days)
  const onboardingOverallCompletedCount = students.filter(s => {
    let completedDays = 0;
    for (let d = 1; d <= 7; d++) {
      if (isStudentOnboardingDayCompleted(s.id, d)) completedDays++;
    }
    return completedDays >= 5; // consider completed if done at least 5 days
  }).length;

  // Onboarding days progress data for Bar Chart
  const onboardingBarData = onboardingDays.map(d => {
    const completed = students.filter(s => isStudentOnboardingDayCompleted(s.id, d.day)).length;
    return {
      label: `N${d.day}`,
      completed,
      total: totalStudents,
      title: d.title.includes(': ') ? d.title.split(': ')[1] : d.title
    };
  });

  // Live Class lessons progress data for Bar Chart (Only show lessons that have assignments)
  const liveClassBarData = courseLessons
    .map((l, index) => ({ l, originalIndex: index }))
    .filter(({ l }) => !!l.assignment_description)
    .map(({ l, originalIndex }) => {
      const completed = students.filter(s => isStudentLessonCompleted(s.id, l.id)).length;
      const match = l.title.match(/Buổi\s+(\d+)/i);
      const label = match ? `B${match[1]}` : `B${originalIndex}`;
      return {
        label,
        completed,
        total: totalStudents,
        title: l.title
      };
    });

  // Mailto link builder
  const getMailtoLink = (student: typeof students[0], missingCount: number) => {
    const emailSubject = encodeURIComponent(`[LightMS] Hỗ trợ học tập Hải trình Vibe Coding - Thủy thủ ${student.full_name}`);
    const emailBody = encodeURIComponent(
      `Chào thủy thủ ${student.full_name},\n\n` +
      `Vẹt Lắm Mồm thấy bạn đang có chút chậm tiến độ so với lớp (Bạn hiện đang còn ${missingCount} bài tập chưa nộp hoặc cần hỗ trợ gỡ rối).\n\n` +
      `Thuyền trưởng muốn hỏi thăm xem bạn có đang gặp rào cản hay khó khăn gì không? Hãy nhắn tin trực tiếp trên chat nhóm hỗ trợ Light Support hoặc đặt lịch hẹn Office Hour để Mentor hỗ trợ bạn gỡ rối nhanh nhất nhé.\n\n` +
      `Quyết tâm giương buồm vượt đại dương nào!\n\n` +
      `Thân ái,\n` +
      `Đội ngũ The1ight`
    );
    return `mailto:${student.gmail}?subject=${emailSubject}&body=${emailBody}`;
  };

  const getRecommendedAction = () => {
    const studentsWithBottlenecks = students
      .map((s) => {
        const unsubmitted = getStudentUnsubmittedLessons(s.id);
        return {
          student: s,
          unsubmitted,
          missingCount: unsubmitted.length,
        };
      })
      .filter((item) => item.missingCount > 0)
      .sort((a, b) => b.missingCount - a.missingCount);

    if (studentsWithBottlenecks.length > 0) {
      const target = studentsWithBottlenecks[0];
      return {
        type: 'support',
        title: 'Hỗ trợ học viên chậm tiến độ',
        description: `Thủy thủ **${target.student.full_name}** đang bị chậm ${target.missingCount} bài tập (nghẽn tại: ${target.unsubmitted[0]?.title || 'bài học'}).`,
        actionLabel: 'Gửi email hỗ trợ',
        actionLink: getMailtoLink(target.student, target.missingCount),
        isEmail: true
      };
    }

    if (outstandingStudents.length > 0) {
      const target = outstandingStudents[0];
      return {
        type: 'commend',
        title: 'Khen thưởng học viên xuất sắc',
        description: `Thủy thủ **${target.full_name}** đã hoàn thành xuất sắc tất cả ngày Onboarding và có tương tác tích cực.`,
        actionLabel: 'Tuyên dương ngay',
        onClick: () => triggerCommendation(target.full_name),
        isEmail: false
      };
    }

    const liveClassStats = liveClassBarData.filter(d => d.total > 0);
    if (liveClassStats.length > 0) {
      const sortedLiveClass = [...liveClassStats].sort((a, b) => (a.completed / a.total) - (b.completed / b.total));
      const worstLesson = sortedLiveClass[0];
      const rate = Math.round((worstLesson.completed / worstLesson.total) * 100);
      if (rate < 70) {
        return {
          type: 'improve_liveclass',
          title: 'Cải thiện tỷ lệ nộp bài tập',
          description: `Buổi học **${worstLesson.title}** đang có tỷ lệ hoàn thành thấp (${rate}% với ${worstLesson.completed}/${worstLesson.total} học viên).`,
          actionLabel: 'Xem lộ trình',
          onClick: () => onPageChange('curriculum'),
          isEmail: false
        };
      }
    }

    const onboardingStats = onboardingBarData.filter(d => d.total > 0);
    if (onboardingStats.length > 0) {
      const sortedOnboarding = [...onboardingStats].sort((a, b) => (a.completed / a.total) - (b.completed / b.total));
      const worstDay = sortedOnboarding[0];
      const rate = Math.round((worstDay.completed / worstDay.total) * 100);
      return {
        type: 'improve_onboarding',
        title: 'Tối ưu tài liệu Onboarding',
        description: `Ngày **${worstDay.label}** (${worstDay.title}) có tỷ lệ hoàn thành thấp nhất (${rate}%). Cần cải thiện tài liệu hướng dẫn hoặc task checklist.`,
        actionLabel: 'Quản lý học viên',
        onClick: () => onPageChange('students'),
        isEmail: false
      };
    }

    return {
      type: 'generic',
      title: 'Tổ chức Office Hour',
      description: 'Lên lịch một buổi Q&A trực tuyến tuần này để giải đáp thắc mắc và thúc đẩy động lực học tập cho cả lớp.',
      actionLabel: 'Quản lý lịch học',
      onClick: () => onPageChange('calendar'),
      isEmail: false
    };
  };

  const recommendation = getRecommendedAction();

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
            completed
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
      const lessonCompleted = (nauticalTransactions || []).some(t => t.student_id === studentId && t.action_type === 'lesson_complete' && t.reference_id === l.id);
      let assignmentStatus: 'none' | 'not_submitted' | 'submitted' | 'graded' | 'draft' = 'none';
      if (l.assignment_description) {
        assignmentStatus = lessonCompleted ? 'graded' : 'not_submitted';
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





  return (
    <div className="space-y-8 animate-fade-in select-none">
      <PageHeader
        title="Tổng quan hệ thống"
        description="Theo dõi toàn bộ hoạt động của học viên và trạng thái khóa học."
        icon={<LayoutDashboard size={32} strokeWidth={1.5} />}
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Thủy Thủ Đoàn */}
        <div className="group relative overflow-hidden flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="absolute inset-y-0 left-0 w-1.5 bg-teal-500 rounded-l-2xl"></div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
            <Users size={22} />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-extrabold uppercase block tracking-wider">Thủy Thủ Đoàn</span>
            <span className="text-base font-black text-[#15333B] mt-0.5 block">{totalStudents} học viên</span>
          </div>
        </div>

        {/* Card 2: Cần Hỗ Trợ */}
        <div className="group relative overflow-hidden flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="absolute inset-y-0 left-0 w-1.5 bg-red-550 rounded-l-2xl"></div>
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-650 shrink-0">
            <ShieldAlert size={22} />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-extrabold uppercase block tracking-wider">Cần Hỗ Trợ</span>
            <span className="text-base font-black text-[#15333B] mt-0.5 block">{countNeedingSupport} học viên</span>
          </div>
        </div>

        {/* Card 3: Cần Khen Thưởng */}
        <div className="group relative overflow-hidden flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-150 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="absolute inset-y-0 left-0 w-1.5 bg-amber-500 rounded-l-2xl"></div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-650 shrink-0">
            <Trophy size={22} />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-extrabold uppercase block tracking-wider">Cần Khen Thưởng</span>
            <span className="text-base font-black text-[#15333B] mt-0.5 block">{countNeedingReward} học viên</span>
          </div>
        </div>
      </div>

      {/* Recommended Action Card */}
      <div className="bg-gradient-to-r from-[#1E3E45]/90 to-[#2A5C66]/90 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-lg text-white space-y-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-[#FFD94C] text-[#15333B] text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider">GỢI Ý TỪ HỆ THỐNG</span>
            <span className="text-xs text-white/60 font-semibold">• Phân tích thời gian thực</span>
          </div>
          <h4 className="text-base font-black text-[#FFD94C] flex items-center gap-1.5 mt-1">
            {recommendation.title}
          </h4>
          <p className="text-xs text-white/80 font-medium max-w-2xl leading-relaxed">
            {recommendation.description}
          </p>
        </div>

        {recommendation.isEmail ? (
          <a
            href={recommendation.actionLink}
            className="btn bg-[#FFD94C] hover:bg-[#FFE375] text-[#15333B] text-xs font-black px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 self-start md:self-auto"
          >
            <Mail size={14} /> {recommendation.actionLabel}
          </a>
        ) : (
          <button
            onClick={recommendation.onClick}
            className="btn bg-[#FFD94C] hover:bg-[#FFE375] text-[#15333B] text-xs font-black px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 self-start md:self-auto cursor-pointer"
          >
            {recommendation.type === 'commend' && <Trophy size={14} />}
            {recommendation.actionLabel}
          </button>
        )}
      </div>

      {/* --- STATS SECTIONS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Onboarding Completion Box */}
        <div className="card bg-white p-6 rounded-3xl border border-gray-150 shadow-sm space-y-5">
          <h3 className="font-extrabold text-sm text-[#15333B] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-3">
            <Sparkles className="text-purple-600 w-5 h-5" /> Thống kê Onboarding Week
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="col-span-1 flex justify-center">
              <DonutChart
                completed={onboardingOverallCompletedCount}
                total={totalStudents}
                label="Tổng quan Tuần"
                sublabel="Hoàn thành >= 5 ngày"
                colorHex="#845EF7"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">
                Chi tiết tiến độ từng ngày
              </span>
              <BarChart data={onboardingBarData} colorClass="bg-purple-500" />
            </div>
          </div>
        </div>

        {/* Live Class Homework Completion Box */}
        <div className="card bg-white p-6 rounded-3xl border border-gray-150 shadow-sm space-y-5">
          <h3 className="font-extrabold text-sm text-[#15333B] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-3">
            <CheckSquare className="text-teal-600 w-5 h-5" /> Thống kê Bài tập Live Class
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="col-span-1 flex justify-center">
              <DonutChart
                completed={totalCompletedAssignments}
                total={totalExpectedSubmissions}
                label="Đã hoàn thành"
                sublabel="Bài tập đạt chất lượng"
                colorHex="#0CA678"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">
                Chi tiết tiến độ từng buổi học
              </span>
              <BarChart data={liveClassBarData} colorClass="bg-teal-500" />
            </div>
          </div>
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
                          <span className="text-[10px] bg-red-100 text-red-800 px-2 py-1 rounded-lg font-bold">Chưa hoàn thành ❌</span>
                        )}
                        {lesson.assignmentStatus === 'graded' && (
                          <span className="text-[10px] bg-green-100 text-green-800 px-2 py-1 rounded-lg font-bold">Đã hoàn thành ✓</span>
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


    </div>
  );
};


