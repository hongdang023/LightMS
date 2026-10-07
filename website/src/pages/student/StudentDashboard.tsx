import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCourse } from '../../context/CourseContext';
import { useGamification } from '../../context/GamificationContext';
import { useCommunity } from '../../context/CommunityContext';
import { enrollmentService } from '../../services/enrollmentService';
import { ChevronDown, ChevronUp, Video, ArrowRight, Trophy, Clock } from 'lucide-react';

interface StudentDashboardProps {
  onPageChange: (page: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onPageChange }) => {
  const { activeUser, users } = useAuth();
  const { lessons, activeCourse, activeBatch } = useCourse();
  const { nauticalTransactions } = useGamification();
  const { calendarEvents, onboardingDays } = useCommunity();
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredLessons = lessons;

  // Helper to determine if a lesson has started
  const isLessonStarted = (lesson: typeof filteredLessons[0]): boolean => {
    if (!lesson.start_date) return true;
    const start = new Date(lesson.start_date).getTime();
    const now = new Date().getTime();
    return now >= start;
  };

  // 1. Calculate Onboarding Week progress & completion
  const onboardingProgress = useMemo(() => {
    try {
      const saved = localStorage.getItem('lms_onboarding_tasks_v2');
      const checkedTasks = saved ? JSON.parse(saved) : {};
      
      const dayList = onboardingDays && onboardingDays.length > 0 ? onboardingDays : [];
      let completedCount = 0;
      let totalTasks = 0;

      if (dayList.length > 0) {
        dayList.forEach((day: { day: number; checklist: string }) => {
          const lines = day.checklist.split('\n');
          let taskIdx = 0;
          lines.forEach((line: string) => {
            const trimmed = line.trim();
            if (trimmed.startsWith('- [ ]')) {
              taskIdx++;
              totalTasks++;
              if (checkedTasks[`day-${day.day}-task-${taskIdx}`]) {
                completedCount++;
              }
            }
          });
        });
      } else {
        const taskCounts = [0, 5, 5, 4, 4, 4];
        for (let day = 1; day <= 5; day++) {
          const count = taskCounts[day];
          totalTasks += count;
          for (let t = 1; t <= count; t++) {
            if (checkedTasks[`day-${day}-task-${t}`]) {
              completedCount++;
            }
          }
        }
      }

      return {
        completed: completedCount,
        total: totalTasks,
        percent: totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0,
        isCompleted: completedCount === totalTasks && totalTasks > 0
      };
    } catch {
      return { completed: 0, total: 22, percent: 0, isCompleted: false };
    }
  }, [onboardingDays]);

  const onboardingDueDate = useMemo(() => {
    const startSaved = localStorage.getItem('lms_onboarding_start_date');
    const start = startSaved ? new Date(startSaved) : new Date();
    const due = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
    const d = due.getDate().toString().padStart(2, '0');
    const m = (due.getMonth() + 1).toString().padStart(2, '0');
    return `${d}/${m}`;
  }, []);

  // 2. Fetch assignments list
  const allAssignments = useMemo(() => {
    const list: any[] = [];
    
    // Include onboarding if not completed
    if (!onboardingProgress.isCompleted) {
      list.push({
        id: 'onboarding-task',
        sessionLabel: 'ONBOARDING',
        title: 'Thử thách tuần Onboarding - Khởi động & thiết lập môi trường',
        dueDate: onboardingDueDate,
        type: 'onboarding',
        pageTarget: 'onboarding',
        isCompleted: false
      });
    }

    filteredLessons.forEach((lesson, index) => {
      if (!lesson.assignment_description) return;
      if (!isLessonStarted(lesson)) return;

      const hasCompleted = (nauticalTransactions || []).some(
        t => t.student_id === activeUser.id && 
             (t.action_type === 'lesson_complete' || t.action_type === 'assignment_graded') && 
             t.reference_id === lesson.id
      );

      let dueDateStr = '01/08';
      if (lesson.start_date) {
        const start = new Date(lesson.start_date);
        const due = new Date(start.getTime() + 3 * 24 * 60 * 60 * 1000);
        const d = due.getDate().toString().padStart(2, '0');
        const m = (due.getMonth() + 1).toString().padStart(2, '0');
        dueDateStr = `${d}/${m}`;
      }
      
      const numStr = (index + 1).toString().padStart(2, '0');

      list.push({
        id: lesson.id,
        sessionLabel: `BUỔI ${numStr}`,
        title: lesson.title,
        dueDate: dueDateStr,
        type: 'syllabus',
        pageTarget: 'syllabus',
        isCompleted: hasCompleted
      });
    });

    return list;
  }, [onboardingProgress, onboardingDueDate, filteredLessons, nauticalTransactions, activeUser.id]);

  const completedTaskCount = useMemo(() => {
    return allAssignments.filter(a => a.isCompleted).length;
  }, [allAssignments]);

  const visibleAssignments = useMemo(() => {
    return isExpanded ? allAssignments : allAssignments.slice(0, 3);
  }, [allAssignments, isExpanded]);

  // 3. Find the nearest session
  const nearestLesson = useMemo(() => {
    const mockNow = new Date().getTime();
    const eventsWithTimestamps = calendarEvents
      .filter(e => e.date !== undefined && e.month !== undefined && e.year !== undefined)
      .map(e => {
        const [hours, minutes] = (e.time && e.time !== 'Cả ngày' && e.time !== '00:00') ? e.time.split(':').map(Number) : [9, 0];
        const timestamp = new Date(e.year!, e.month!, e.date!, hours, minutes).getTime();
        return { ...e, timestamp };
      })
      .sort((a, b) => a.timestamp - b.timestamp);

    const next = eventsWithTimestamps.find(e => e.timestamp >= mockNow);
    if (!next && eventsWithTimestamps.length > 0) {
      return eventsWithTimestamps[eventsWithTimestamps.length - 1];
    }
    return next;
  }, [calendarEvents]);

  const lessonDateDetails = useMemo(() => {
    if (!nearestLesson || nearestLesson.date === undefined || nearestLesson.month === undefined || nearestLesson.year === undefined) {
      return { day: '27', month: 'T9', weekdayShort: 'CN' };
    }
    const dateObj = new Date(nearestLesson.year, nearestLesson.month, nearestLesson.date);
    const day = dateObj.getDate().toString();
    const month = `T${dateObj.getMonth() + 1}`;
    const weekday = dateObj.toLocaleDateString('vi-VN', { weekday: 'short' });
    const weekdayShort = weekday.includes('Chủ') ? 'CN' : weekday;
    return { day, month, weekdayShort };
  }, [nearestLesson]);

  const currentBatchId = useMemo(() => {
    if (activeBatch?.id) return activeBatch.id;
    return activeCourse?.slug === 'vibe-coding-201' ? 'batch-vibe201-k2' : 'batch-obs101-k1';
  }, [activeBatch?.id, activeCourse?.slug]);

  // 4. Leaderboard & Rank calculation strictly scoped to active batch
  const leaderboard = useMemo(() => {
    const batchEnrollments = enrollmentService.getEnrollmentsForBatch(currentBatchId);
    const enrolledUserIds = new Set(batchEnrollments.map(e => e.user_id));

    return [...users]
      .filter(u => u.role === 'student' && u.gmail !== 'dangtuyethong2324@gmail.com' && enrolledUserIds.has(u.id))
      .sort((a, b) => (b.nautical_miles || 0) - (a.nautical_miles || 0));
  }, [users, currentBatchId]);

  const userRankIndex = useMemo(() => {
    const idx = leaderboard.findIndex(u => u.id === activeUser.id);
    return idx >= 0 ? idx + 1 : 1;
  }, [leaderboard, activeUser.id]);

  return (
    <div className="space-y-6 animate-fade-in select-none max-w-7xl mx-auto pb-8">
      {/* Header Greeting Section */}
      <div className="pt-2">
        <h1 className="text-3xl font-extrabold text-[#15333B] tracking-tight">
          Chào mừng, {activeUser.full_name}!
        </h1>
      </div>

      {/* Main Grid Section (Equal Height Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: NHIỆM VỤ HỌC TẬP (~65% -> 8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 md:p-7 shadow-sm border border-gray-150/80 flex flex-col justify-between h-full space-y-6">
          <div className="space-y-6 flex-1">
            {/* Card Title Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5 text-[#15333B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                <h2 className="text-sm font-extrabold text-[#15333B] tracking-wider uppercase">
                  Nhiệm vụ học tập
                </h2>
              </div>
              <span className="px-3 py-1 bg-gray-100/80 text-gray-500 rounded-full text-xs font-bold">
                {completedTaskCount}/{allAssignments.length} hoàn thành
              </span>
            </div>

            {/* Task Items List */}
            <div className="space-y-3.5">
              {visibleAssignments.map((task) => (
                <div 
                  key={task.id}
                  onClick={() => onPageChange(task.pageTarget)}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50/80 transition-all border border-transparent hover:border-gray-150 cursor-pointer gap-3"
                >
                  {/* Left Task Title & Status Circle */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-[#214C54] flex items-center justify-center shrink-0 transition-colors">
                      {task.isCompleted && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                      <span className="text-xs font-bold text-gray-400 tracking-wide uppercase shrink-0">
                        {task.sessionLabel}
                      </span>
                      <span className="text-gray-300 font-light hidden sm:inline">•</span>
                      <h3 className="text-sm font-bold text-[#15333B] group-hover:text-[#214C54] transition-colors truncate max-w-md">
                        {task.title}
                      </h3>
                    </div>
                  </div>

                  {/* Right Date & Action Button */}
                  <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end pl-8 sm:pl-0">
                    <span className="text-xs font-medium text-gray-400">
                      {task.dueDate}
                    </span>
                    <button className="px-4 py-1.5 rounded-full bg-gray-100 group-hover:bg-[#214C54] text-gray-700 group-hover:text-white transition-all text-xs font-bold border border-gray-200 group-hover:border-[#214C54] flex items-center gap-1.5">
                      <span>{task.type === 'onboarding' ? 'Tiếp tục làm' : 'Làm bài'}</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Collapsible Expand Button */}
          {allAssignments.length > 3 && (
            <div className="pt-3 border-t border-gray-100 text-center shrink-0">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs font-bold text-gray-500 hover:text-[#15333B] inline-flex items-center gap-1 transition-colors"
              >
                <span>{isExpanded ? 'Thu gọn' : `Xem thêm ${allAssignments.length - 3} bài tập sau`}</span>
                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          )}
        </div>

        {/* Right Column: 2 Cards Equal Height (~35% -> 4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-6 h-full">
          
          {/* Card 1: LỊCH HỌC TIẾP THEO */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-150/80 flex flex-col justify-between flex-1 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-xs font-extrabold text-gray-400 tracking-wider uppercase">
                Lịch học tiếp theo
              </h3>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-orange-50 text-orange-600 rounded-full text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                <span>Sắp diễn ra</span>
              </div>
            </div>

            {/* Session Time & Title */}
            <div className="flex items-center gap-3.5 my-auto py-2">
              <div className="w-13 h-13 bg-gray-100/90 rounded-2xl flex flex-col items-center justify-center shrink-0 p-2 text-center min-w-[52px]">
                <span className="text-[10px] font-extrabold text-gray-400 uppercase leading-tight">
                  {lessonDateDetails.month}
                </span>
                <span className="text-lg font-black text-[#15333B] leading-none">
                  {lessonDateDetails.day}
                </span>
              </div>
              <div>
                <h4 className="font-extrabold text-base text-[#15333B] leading-snug">
                  {nearestLesson?.title || 'Office Hour'}
                </h4>
                <p className="text-xs font-medium text-gray-400 mt-0.5">
                  {lessonDateDetails.weekdayShort}, {nearestLesson?.time && nearestLesson?.endTime ? `${nearestLesson.time} - ${nearestLesson.endTime}` : '15:30 - 16:30'}
                </p>
              </div>
            </div>

            {/* Zoom Action Button */}
            <button 
              onClick={() => window.open("https://daymai.vn/meet/0388148327", "_blank", "noopener,noreferrer")}
              className="w-full py-3 px-4 rounded-xl bg-[#15333B] hover:bg-[#214C54] text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Video size={16} />
              <span>Vào Zoom Class ngay</span>
            </button>
          </div>

          {/* Card 2: XẾP HẠNG CỦA BẠN */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-150/80 flex flex-col justify-between flex-1 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-1.5">
                <Trophy size={16} className="text-[#EAB308] stroke-[1.5]" />
                <h3 className="text-xs font-extrabold text-gray-400 tracking-wider uppercase">
                  Xếp hạng của bạn
                </h3>
              </div>
            </div>

            {/* Highlighted Personal Rank Banner */}
            {leaderboard.length === 0 ? (
              <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4 text-center my-auto flex flex-col items-center">
                <Clock size={24} className="text-gray-400 mb-1 stroke-[1.5]" />
                <h4 className="font-extrabold text-xs text-[#15333B]">
                  Khóa học chưa bắt đầu
                </h4>
                <p className="text-[11px] text-gray-500 font-medium mt-1">
                  Chưa có thủy thủ nào tham gia lớp này. Bảng xếp hạng sẽ mở khi khóa học khởi tranh!
                </p>
              </div>
            ) : (
              <div className="bg-cyan-50/70 border border-cyan-100 rounded-2xl p-4 flex items-center justify-between my-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#B9E6FE] text-[#0369A1] font-extrabold text-sm flex items-center justify-center shrink-0">
                    #{userRankIndex}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#15333B]">
                      {activeUser.full_name}
                    </h4>
                    <p className="text-xs font-medium text-gray-400">
                      {leaderboard.length} Thủy thủ
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-[#15333B] block leading-none">
                    {activeUser.nautical_miles ?? 0}
                  </span>
                  <span className="text-[9px] font-extrabold text-gray-400 tracking-wider uppercase block mt-1">
                    HẢI LÝ
                  </span>
                </div>
              </div>
            )}

            {/* Leaderboard CTA Button */}
            <button
              onClick={() => onPageChange('walloffame')}
              className="w-full py-2.5 px-4 rounded-full border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <span>Vào Bảng vinh danh</span>
              <ArrowRight size={14} className="stroke-[1.5]" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};


