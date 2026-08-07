import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCourse } from '../../context/CourseContext';
import { useGamification } from '../../context/GamificationContext';
import { useCommunity } from '../../context/CommunityContext';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '../../components/ui/Button';
import { Shield, Calendar, Video, BookOpen, Trophy } from 'lucide-react';

// Helper to extract logical first sentence/step summary
const getShortDescription = (desc: string): string => {
  if (!desc) return '';
  const firstLine = desc.split('\n')[0].trim();
  const match = firstLine.match(/^([^.\-+:—]+(?:—[^.\-+:—]+)?)/);
  if (match) {
    const clean = match[1].trim();
    if (clean.length > 5) {
      return clean.endsWith('.') ? clean : `${clean}.`;
    }
  }
  return firstLine.length > 60 ? `${firstLine.substring(0, 60)}...` : firstLine;
};

// Helper to format weekday names to clean short Vietnamese representations
const getWeekdayShort = (weekday: string): string => {
  const normalized = weekday.toLowerCase();
  if (normalized.includes('chủ nhật')) return 'Chủ Nhật';
  if (normalized.includes('thứ hai')) return 'Thứ 2';
  if (normalized.includes('thứ ba')) return 'Thứ 3';
  if (normalized.includes('thứ tư')) return 'Thứ 4';
  if (normalized.includes('thứ năm')) return 'Thứ 5';
  if (normalized.includes('thứ sáu')) return 'Thứ 6';
  if (normalized.includes('thứ bảy')) return 'Thứ 7';
  return weekday;
};

// Helper to determine badge style consistently based on due date
const getDeadlineBadgeStyle = (_dueDateStr: string): string => {
  // Single unified neutral style for all due dates to keep absolute visual consistency
  return 'text-[#3E5E63] bg-gray-50 border-gray-200';
};

interface StudentDashboardProps {
  onPageChange: (page: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onPageChange }) => {
  const { activeUser, users } = useAuth();
  const { lessons } = useCourse();
  const { nauticalTransactions } = useGamification();
  const { calendarEvents } = useCommunity();

  const filteredLessons = lessons;

  // Helper to determine if a lesson has started
  const isLessonStarted = (lesson: typeof filteredLessons[0]): boolean => {
    if (!lesson.start_date) return true;
    const start = new Date(lesson.start_date).getTime();
    // Use actual current time
    const now = new Date().getTime();
    return now >= start;

  };

  // 1. Calculate Onboarding Week progress & completion
  const onboardingProgress = React.useMemo(() => {
    try {
      const saved = localStorage.getItem('lms_onboarding_tasks_v2');
      const checkedTasks = saved ? JSON.parse(saved) : {};
      
      const taskCounts = [0, 4, 5, 4, 4, 5, 5, 4]; // Tasks per day (1 to 7)
      let completedCount = 0;
      let totalTasks = 0;
      for (let day = 1; day <= 7; day++) {
        const count = taskCounts[day];
        totalTasks += count;
        for (let t = 1; t <= count; t++) {
          if (checkedTasks[`day-${day}-task-${t}`]) {
            completedCount++;
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
      return { completed: 0, total: 31, percent: 0, isCompleted: false };
    }
  }, []);

  const onboardingDueDate = React.useMemo(() => {
    const startSaved = localStorage.getItem('lms_onboarding_start_date');
    const start = startSaved ? new Date(startSaved) : new Date();
    // Due date is start + 7 days
    const due = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
    return due.toLocaleDateString('vi-VN');
  }, []);

  // 2. Fetch uncompleted assignments
  const pendingAssignments = React.useMemo(() => {
    const list: any[] = [];
    
    // Add uncompleted class assignments for started lessons
    filteredLessons.forEach(lesson => {
      if (!lesson.assignment_description) return;
      
      // Check if lesson has started
      if (!isLessonStarted(lesson)) return;

      // Check if student has completed
      const hasCompleted = (nauticalTransactions || []).some(
        t => t.student_id === activeUser.id && t.action_type === 'lesson_complete' && t.reference_id === lesson.id
      );

      if (!hasCompleted) {
        // Calculate due date (lesson start_date + 3 days)
        let dueDateStr = 'N/A';
        if (lesson.start_date) {
          const start = new Date(lesson.start_date);
          const due = new Date(start.getTime() + 3 * 24 * 60 * 60 * 1000);
          dueDateStr = due.toLocaleDateString('vi-VN');
        }
        
        list.push({
          id: lesson.id,
          title: `Bài tập ${lesson.title}`,
          desc: lesson.assignment_description,
          dueDate: dueDateStr,
          type: 'syllabus',
          progress: null,
          pageTarget: 'syllabus'
        });
      }
    });

    return list;
  }, [onboardingProgress, onboardingDueDate, filteredLessons, nauticalTransactions, activeUser.id]);

  // 3. Find the nearest session from calendar events dynamically
  const nearestLesson = React.useMemo(() => {
    // Use actual current time
    const mockNow = new Date().getTime();

    
    // Convert calendarEvents to a list of events with actual timestamps
    const eventsWithTimestamps = calendarEvents
      .filter(e => e.date !== undefined && e.month !== undefined && e.year !== undefined)
      .map(e => {
        const [hours, minutes] = (e.time && e.time !== 'Cả ngày' && e.time !== '00:00') ? e.time.split(':').map(Number) : [9, 0];
        const timestamp = new Date(e.year!, e.month!, e.date!, hours, minutes).getTime();
        return { ...e, timestamp };
      })
      .sort((a, b) => a.timestamp - b.timestamp);

    // Find the first event starting on or after mockNow
    const next = eventsWithTimestamps.find(e => e.timestamp >= mockNow);

    // Default to the last scheduled event if none in future
    if (!next && eventsWithTimestamps.length > 0) {
      return eventsWithTimestamps[eventsWithTimestamps.length - 1];
    }
    
    return next;
  }, [calendarEvents]);

  // Get formatted date details for nearest lesson
  const lessonDateDetails = React.useMemo(() => {
    if (!nearestLesson || nearestLesson.date === undefined || nearestLesson.month === undefined || nearestLesson.year === undefined) return null;
    const dateObj = new Date(nearestLesson.year, nearestLesson.month, nearestLesson.date);
    const day = dateObj.getDate();
    const month = `Th${dateObj.getMonth() + 1}`;
    const weekday = dateObj.toLocaleDateString('vi-VN', { weekday: 'long' });
    return { day, month, weekday };
  }, [nearestLesson]);

  // Look up lesson details from course lessons context if calendar event doesn't have details
  const lessonDetailsFromLessons = React.useMemo(() => {
    if (!nearestLesson || !lessons) return null;
    const matchDigits = nearestLesson.title?.match(/\d+/);
    if (!matchDigits) return null;
    const lessonNum = parseInt(matchDigits[0], 10);
    return lessons.find(l => {
      const lMatch = l.title?.match(/\d+/);
      return lMatch && parseInt(lMatch[0], 10) === lessonNum;
    });
  }, [nearestLesson, lessons]);

  const lessonTopicName = React.useMemo(() => {
    let rawTopic = '';
    if (nearestLesson?.details) {
      // Split by literal \n or actual newlines to get the first line
      const firstLine = nearestLesson.details.split(/\\n|\n/)[0].trim();
      // Remove prefixes like "Buổi 04:"
      const parts = firstLine.split(':');
      rawTopic = parts.length > 1 ? parts.slice(1).join(':').trim() : firstLine;
    } else if (lessonDetailsFromLessons) {
      const parts = lessonDetailsFromLessons.title.split(':');
      rawTopic = parts.length > 1 ? parts.slice(1).join(':').trim() : lessonDetailsFromLessons.title;
    }
    return rawTopic || null;
  }, [nearestLesson, lessonDetailsFromLessons]);

  // 4. Calculate Rank and Voyage progress percentage
  const leaderboard = React.useMemo(() => {
    return [...users]
      .filter(u => 
        u.role === 'student' && 
        u.gmail !== 'dangtuyethong2324@gmail.com'
      )
      .sort((a, b) => b.nautical_miles - a.nautical_miles);
  }, [users]);

  const userRankIndex = React.useMemo(() => {
    return leaderboard.findIndex(u => u.id === activeUser.id) + 1;
  }, [leaderboard, activeUser.id]);



  return (
    <div className="space-y-4 animate-fade-in select-none">
      <PageHeader 
        title={`Chào mừng, ${activeUser.full_name}!`}
        description="Trạng thái hiện tại của hải trình và các nhiệm vụ cần hoàn thành hôm nay."
        helpTitle="Dashboard học tập"
        helpSummary="Bảng điều khiển trung tâm theo dõi toàn bộ tiến độ học tập của bạn."
        helpPurpose="Giúp bạn nắm ngay tình trạng học tập, các bài tập chưa làm và các mốc quan trọng — không cần tìm kiếm ở đâu khác."
      />

      {/* Grid Content */}
      <div className="dashboard-grid">
        {/* Left Column: Tasks & Assignments (Requirement 1) */}
        <div className="flex flex-col h-full">
          
          {/* Card: Bài tập chưa hoàn thành */}
          <div className="card flex flex-col justify-between flex-1" style={{ padding: '1.25rem' }}>
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <h3 className="font-extrabold text-base text-[#15333B] flex items-center gap-2">
                  <BookOpen size={18} className="text-[#214C54]" strokeWidth={1.5} />
                  Bài tập chưa hoàn thành
                </h3>
                <span className={`badge-pill text-[9px] font-extrabold ${(pendingAssignments.length === 0 && onboardingProgress.isCompleted) ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'badge-warning'}`}>
                  {pendingAssignments.length + (onboardingProgress.isCompleted ? 0 : 1)} nhiệm vụ còn lại
                </span>
              </div>

              {pendingAssignments.length === 0 && onboardingProgress.isCompleted ? (
                <div className="bg-emerald-50/50 border-2 border-emerald-100 rounded-3xl p-8 text-center space-y-4">
                  <span className="text-5xl block">🎉</span>
                  <h4 className="font-extrabold text-[#065f46] text-lg">Rất tốt! Không còn bài tập nào chưa nộp!</h4>
                  <p className="text-sm text-[#047857] max-w-md mx-auto font-medium leading-relaxed">
                    Bạn đã hoàn thành xuất sắc tất cả bài tập và thử thách Onboarding. Hãy nghỉ ngơi, chuẩn bị tinh thần cho những hải trình tiếp theo! ⚓
                  </p>
                </div>
              ) : (
                 <div className="divide-y divide-gray-100">
                  {/* Onboarding progress row (if not completed) */}
                  {!onboardingProgress.isCompleted && (
                    <div 
                      onClick={() => onPageChange('onboarding')}
                      className="pb-4 hover:opacity-95 transition-all cursor-pointer group flex flex-col gap-2.5"
                    >
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-5.5 h-5.5 rounded-full border-2 border-yellow-400 flex-shrink-0 flex items-center justify-center">
                              <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full" />
                            </span>
                            <h4 className="font-extrabold text-sm text-[#15333B] group-hover:text-yellow-700 transition-colors">
                              Thử thách tuần Onboarding
                            </h4>
                          </div>
                          <span className={`text-[10px] font-black border px-2 py-0.5 rounded-md flex items-center gap-1 ${getDeadlineBadgeStyle(onboardingDueDate)}`}>
                            📅 Hạn nộp: {onboardingDueDate}
                          </span>
                        </div>
                        
                        <p className="text-xs text-gray-500 font-medium pl-[30px] leading-relaxed">
                          Hoàn thành các nhiệm vụ khởi động và thiết lập môi trường.
                        </p>
                      </div>

                      {/* Progress bar and Action Button Inline */}
                      <div className="pl-[30px] flex justify-between items-center gap-4 mt-2">
                        <div className="flex-1 max-w-sm flex items-center gap-3">
                          <span className="text-[11px] font-extrabold text-[#3E5E63] shrink-0">Tiến độ: {onboardingProgress.percent}%</span>
                          <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden border border-gray-300/40">
                            <div 
                              className="h-full bg-gradient-to-r from-[#214C54] to-[#EAB308] transition-all duration-500 rounded-full"
                              style={{ width: `${onboardingProgress.percent}%` }}
                            />
                          </div>
                        </div>
                        <span className="px-3.5 py-1.5 rounded-xl bg-[#214C54]/5 text-[#214C54] group-hover:bg-[#214C54] group-hover:text-white transition-all text-xs font-bold inline-flex items-center gap-1 shrink-0">
                          Tiếp tục làm ➔
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Pending assignments */}
                  {pendingAssignments.map((assignment, index) => (
                    <div 
                      key={assignment.id} 
                      onClick={() => onPageChange(assignment.pageTarget)}
                      className={`${(!onboardingProgress.isCompleted || index > 0) ? 'pt-4' : ''} pb-4 hover:opacity-95 transition-all cursor-pointer group flex flex-col gap-2`}
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-5.5 h-5.5 rounded-full border-2 border-gray-300 group-hover:border-[#214C54] transition-colors flex-shrink-0 flex items-center justify-center">
                              <span className="w-2.5 h-2.5 bg-transparent group-hover:bg-[#214C54] transition-colors rounded-full" />
                            </span>
                            <h4 className="font-extrabold text-sm text-[#15333B] group-hover:text-[#214C54] transition-colors">
                              {assignment.title}
                            </h4>
                          </div>
                          <span className={`text-[10px] font-black border px-2 py-0.5 rounded-md flex items-center gap-1 ${getDeadlineBadgeStyle(assignment.dueDate)}`}>
                            📅 Hạn nộp: {assignment.dueDate}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium pl-[30px] leading-relaxed">
                          {getShortDescription(assignment.desc)}
                        </p>
                      </div>

                      {/* Action Button */}
                      <div className="flex justify-end mt-2 pr-1">
                        <span className="px-3.5 py-1.5 rounded-xl bg-[#214C54]/5 text-[#214C54] group-hover:bg-[#214C54] group-hover:text-white transition-all text-xs font-bold inline-flex items-center gap-1">
                          Làm bài ngay ➔
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {pendingAssignments.length > 0 && (
              <div className="pt-4 border-t border-gray-100 mt-4 flex justify-center">
                <Button 
                  variant="secondary"
                  size="sm"
                  onClick={() => onPageChange('syllabus')}
                  rightIcon={<span className="group-hover:translate-x-1 transition-transform">➔</span>}
                >
                  Xem toàn bộ danh sách Syllabus
                </Button>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Nearest Session & Progress Info */}
        <div className="space-y-6">
          {/* Card: Nearest Session (Requirement 2) */}
          <div className="card bg-gradient-to-br from-[#214C54]/5 to-transparent border-[#214C54]/15" style={{ padding: '1.25rem' }}>
            <h3 className="font-extrabold text-xs text-[#15333B] border-b border-gray-150 pb-2 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
              <Calendar size={14} className="text-[#214C54]" strokeWidth={1.5} />
              Buổi học gần nhất
            </h3>

            {nearestLesson && lessonDateDetails ? (
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  {/* Calendar Widget Graphic */}
                  <div className="flex flex-col items-center bg-white border border-[#214C54]/20 rounded-xl overflow-hidden min-w-[65px] shadow-sm shrink-0">
                    <span className="bg-[#B91C1C] text-white w-full text-[10px] font-black text-center py-1 uppercase tracking-wider">
                      {getWeekdayShort(lessonDateDetails.weekday)}
                    </span>
                    <span className="text-2xl font-black text-[#214C54] py-1">
                      {lessonDateDetails.day}
                    </span>
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase pb-1">
                      {lessonDateDetails.month}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm text-[#15333B] leading-snug">
                      {nearestLesson.title}
                    </h4>
                    {lessonTopicName && (
                      <p className="text-xs text-[#214C54] font-bold leading-snug">
                        {lessonTopicName}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      Thời gian: {nearestLesson.time && nearestLesson.endTime ? `${nearestLesson.time} - ${nearestLesson.endTime}` : (nearestLesson.allDay || nearestLesson.time === '00:00' ? 'Cả ngày' : nearestLesson.time)}
                    </p>

                  </div>
                </div>

                {/* Direct Action Zoom Link */}
                {!nearestLesson.title?.toLowerCase().includes('onboarding') && (
                  <Button 
                    variant="primary"
                    className="w-full text-xs font-black text-center py-2 flex items-center justify-center gap-2"
                    leftIcon={<Video size={16} strokeWidth={1.5} />}
                    onClick={() => window.open("https://daymai.vn/meet/0388148327", "_blank", "noopener,noreferrer")}
                  >
                    Tham gia Zoom Class ngay
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400 text-xs">
                Chưa có buổi học tiếp theo được lên lịch.
              </div>
            )}
          </div>

          {/* Card: Giải đấu hiện tại & Bảng vinh danh */}
          <div className="card p-0 overflow-hidden bg-white shadow-sm border border-gray-100" style={{ padding: 0 }}>
            {/* Header / Giải đấu */}
            <div className="bg-[#FDF5DA] border-b border-[#EAB308]/20 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm bg-[#EAB308]">
                  <Trophy size={20} className="text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-[#3E5E63]">
                    Hải Lý Tích Lũy
                  </div>
                  <div className="text-sm font-black text-[#15333B] leading-tight">
                    {activeUser.nautical_miles.toLocaleString()} Hải lý
                  </div>
                </div>
              </div>
            </div>

            {/* Mini Leaderboard */}
            <div className="p-4 pb-6">
              <div className="flex justify-between items-center mb-2.5">
                <h4 className="text-xs font-extrabold text-[#15333B] flex items-center gap-1.5 uppercase tracking-wider">
                  <Shield size={14} className="text-[#3E5E63]" /> Top Thủy Thủ
                </h4>
                <span className="text-[10px] text-gray-400 font-semibold">⚓ Hải lý</span>
              </div>
              
              <div className="space-y-1.5">
                {leaderboard.slice(0, 3).map((student, idx) => (
                  <div key={student.id} className={`flex items-center gap-2 px-2 py-1 rounded-lg ${student.id === activeUser.id ? 'bg-[#EAB308]/15 border border-[#EAB308]/30 shadow-sm' : ''}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${idx === 0 ? 'bg-[#EAB308] text-[#15333B]' : idx === 1 ? 'bg-[#E5E7EB] text-[#374151]' : idx === 2 ? 'bg-[#fed7aa]/60 text-[#7c2d12]' : 'bg-gray-100 text-gray-400'}`}>
                      {idx + 1}
                    </span>
                    <img src={student.avatar_url} alt={student.full_name} className="w-6 h-6 rounded-full object-cover border border-gray-200" />
                    <span className="flex-1 text-xs font-bold text-[#15333B] truncate">
                      {student.full_name} {student.id === activeUser.id && <span className="text-[9px] bg-[#214C54] text-white px-1.5 py-0.5 rounded-full ml-1">BẠN</span>}
                    </span>
                    <span className="text-xs font-medium text-gray-500 tabular-nums">
                      {student.nautical_miles}
                    </span>
                  </div>
                ))}

                {userRankIndex > 3 && (
                  <>
                    <div className="flex items-center justify-center py-1">
                      <div className="h-[1px] w-full border-t border-dashed border-gray-200" />
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-[#EAB308]/15 border border-[#EAB308]/30 shadow-sm">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black bg-gray-100 text-gray-400">
                        {userRankIndex}
                      </span>
                      <img src={activeUser.avatar_url} alt={activeUser.full_name} className="w-6 h-6 rounded-full object-cover border border-[#EAB308]/30" />
                      <span className="flex-1 text-xs font-bold text-[#15333B] truncate">
                        {activeUser.full_name} <span className="text-[9px] bg-[#214C54] text-white px-1.5 py-0.5 rounded-full ml-1">BẠN</span>
                      </span>
                      <span className="text-xs font-medium text-gray-500 tabular-nums">
                        {activeUser.nautical_miles}
                      </span>
                    </div>
                  </>
                )}
              </div>
              
              <div className="pt-3 mt-3 border-t border-gray-100 text-center">
                <Button 
                  variant="secondary"
                  size="sm"
                  onClick={() => onPageChange('walloffame')}
                  rightIcon={<span className="group-hover:translate-x-1 transition-transform">➔</span>}
                >
                  Xem Bảng Xếp Hạng
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

