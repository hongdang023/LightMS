import React from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { PageHeader } from '../../components/PageHeader';
import { Shield, TrendingUp } from 'lucide-react';

interface StudentDashboardProps {
  onPageChange: (page: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onPageChange }) => {
  const { activeUser, lessons, assignments, submissions, users, modules, courses, calendarEvents } = useDatabase();

  const currentCourse = courses.find(c => c.title.toLowerCase().includes('201')) || courses[0];
  let filteredModules = currentCourse 
    ? modules.filter(m => m.course_id === currentCourse.id)
    : modules;

  if (filteredModules.length === 0 && modules.length > 0) {
    const fallbackCourseId = modules[0].course_id;
    filteredModules = modules.filter(m => m.course_id === fallbackCourseId);
  }

  const filteredLessons = currentCourse
    ? lessons.filter(l => filteredModules.some(m => m.id === l.module_id))
    : lessons;

  // Helper to determine if a lesson has started
  const isLessonStarted = (lesson: typeof filteredLessons[0]): boolean => {
    if (!lesson.start_date) return true;
    const start = new Date(lesson.start_date).getTime();
    // System virtual date mock is June 25, 2026
    const now = new Date('2026-06-25T23:39:06+07:00').getTime();
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
    
    // Onboarding Week is now displayed on the right column widgets

    // Add uncompleted class assignments for started lessons
    assignments.forEach(assignment => {
      const lesson = filteredLessons.find(l => l.id === assignment.lesson_id);
      if (!lesson) return;
      
      // Check if lesson has started
      if (!isLessonStarted(lesson)) return;

      // Check if student has submitted
      const hasSub = submissions.some(
        s => s.assignment_id === assignment.id && s.student_id === activeUser.id && s.status !== 'draft'
      );

      if (!hasSub) {
        // Calculate due date (lesson start_date + 3 days)
        let dueDateStr = 'N/A';
        if (lesson.start_date) {
          const start = new Date(lesson.start_date);
          const due = new Date(start.getTime() + 3 * 24 * 60 * 60 * 1000);
          dueDateStr = due.toLocaleDateString('vi-VN');
        }
        
        list.push({
          id: assignment.id,
          title: `Bài tập ${lesson.title}`,
          desc: assignment.description,
          dueDate: dueDateStr,
          type: 'syllabus',
          progress: null,
          pageTarget: 'syllabus'
        });
      }
    });

    return list;
  }, [onboardingProgress, onboardingDueDate, assignments, filteredLessons, submissions, activeUser.id]);

  // 3. Find the nearest session from calendar events dynamically
  const nearestLesson = React.useMemo(() => {
    // Keep it consistent with system virtual mock date
    const mockNow = new Date('2026-06-25T23:39:06+07:00').getTime();
    
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

  // 4. Calculate Rank and Voyage progress percentage
  const leaderboard = React.useMemo(() => {
    return [...users]
      .filter(u => u.role === 'student')
      .sort((a, b) => b.nautical_miles - a.nautical_miles);
  }, [users]);

  const userRankIndex = React.useMemo(() => {
    return leaderboard.findIndex(u => u.id === activeUser.id) + 1;
  }, [leaderboard, activeUser.id]);


  const getRankTitle = (miles: number) => {
    if (miles >= 5000) return 'Huyền thoại biển cả 👑';
    if (miles >= 3001) return 'Thuyền trưởng 🧭';
    if (miles >= 1501) return 'Thuyền phó ⚔️';
    if (miles >= 501) return 'Hoa tiêu 🗺️';
    return 'Thủy thủ tập sự ⛵';
  };

  return (
    <div className="space-y-8 animate-fade-in select-none">
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
        <div className="space-y-6">
          
          {/* Card: Bài tập chưa hoàn thành */}
          <div className="card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
                <h3 className="font-extrabold text-lg text-[#15333B] flex items-center gap-2">
                  🎯 Bài tập chưa hoàn thành
                </h3>
                <span className={`badge-pill text-[10px] font-extrabold ${(pendingAssignments.length === 0 && onboardingProgress.isCompleted) ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'badge-warning'}`}>
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
                <div className="space-y-4">
                  {/* Onboarding progress row (if not completed) */}
                  {!onboardingProgress.isCompleted && (
                    <div 
                      onClick={() => onPageChange('onboarding')}
                      className="p-5 rounded-2xl border border-yellow-200 bg-yellow-50/20 hover:border-yellow-300 hover:bg-yellow-50/40 hover:shadow-md transition-all cursor-pointer group flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                      <div className="space-y-1.5 flex-1 w-full">
                        <div className="flex items-center gap-2.5">
                          <span className="w-5.5 h-5.5 rounded-full border-2 border-yellow-400 flex-shrink-0 flex items-center justify-center">
                            <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full" />
                          </span>
                          <h4 className="font-bold text-sm text-[#15333B] group-hover:text-yellow-700 transition-colors">
                            Thử thách tuần Onboarding
                          </h4>
                        </div>
                        <p className="text-xs text-[#3E5E63] pl-8 leading-relaxed line-clamp-2">
                          Hoàn thành các nhiệm vụ Onboarding để kích hoạt tư duy chiến binh và thiết lập môi trường.
                        </p>
                        
                        {/* Mini Progress Bar */}
                        <div className="pl-8 pt-2 max-w-md w-full">
                          <div className="flex justify-between items-end mb-1">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tiến độ Onboarding</span>
                            <span className="text-xs font-black text-[#214C54]">{onboardingProgress.percent}% ({onboardingProgress.completed}/{onboardingProgress.total})</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
                            <div 
                              className="h-full bg-gradient-to-r from-[#214C54] to-[#EAB308] transition-all duration-500 rounded-full"
                              style={{ width: `${onboardingProgress.percent}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Due Date Indicator & Action Button */}
                      <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0 shrink-0 gap-3">
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Hạn nộp</span>
                          <span className="text-xs font-extrabold text-yellow-700 bg-yellow-50 border border-yellow-200 px-2 py-0.5 rounded-md mt-0.5 inline-block">
                            📅 {onboardingDueDate}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-[#214C54] group-hover:translate-x-1 transition-transform sm:block hidden">
                          Tiếp tục làm ➔
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Pending assignments */}
                  {pendingAssignments.map((assignment) => (
                    <div 
                      key={assignment.id} 
                      onClick={() => onPageChange(assignment.pageTarget)}
                      className="p-5 rounded-2xl border border-gray-150 bg-white hover:border-[#214C54]/30 hover:bg-[#214C54]/5 hover:shadow-md transition-all cursor-pointer group flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2.5">
                          <span className="w-5.5 h-5.5 rounded-full border-2 border-gray-300 group-hover:border-[#214C54] transition-colors flex-shrink-0 flex items-center justify-center">
                            <span className="w-2.5 h-2.5 bg-transparent rounded-full group-hover:bg-[#214C54] transition-colors" />
                          </span>
                          <h4 className="font-bold text-sm text-[#15333B] group-hover:text-[#214C54] transition-colors">
                            {assignment.title}
                          </h4>
                        </div>
                        <p className="text-xs text-[#3E5E63] pl-8 leading-relaxed line-clamp-2">
                          {assignment.desc}
                        </p>
                      </div>

                      {/* Due Date Indicator & Action Button */}
                      <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0 shrink-0 gap-3">
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Hạn nộp</span>
                          <span className="text-xs font-extrabold text-red-600 bg-red-50 border border-red-200/50 px-2 py-0.5 rounded-md mt-0.5 inline-block">
                            📅 {assignment.dueDate}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-[#214C54] group-hover:translate-x-1 transition-transform sm:block hidden">
                          Làm bài ngay ➔
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {pendingAssignments.length > 0 && (
              <div className="pt-4 border-t border-gray-100 mt-6 text-center">
                <button 
                  onClick={() => onPageChange('syllabus')}
                  className="text-xs text-[#214C54] hover:text-[#15333B] font-extrabold bg-transparent border-0 cursor-pointer"
                >
                  Xem toàn bộ danh sách Syllabus ➔
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Nearest Session & Progress Info */}
        <div className="space-y-6">
          {/* Card: Nearest Session (Requirement 2) */}
          <div className="card bg-gradient-to-br from-[#214C54]/5 to-transparent border-[#214C54]/15">
            <h3 className="font-extrabold text-sm text-[#15333B] border-b border-gray-150 pb-3 mb-4 flex items-center gap-1.5 uppercase tracking-wider">
              📅 Buổi học gần nhất
            </h3>

            {nearestLesson && lessonDateDetails ? (
              <div className="space-y-5">
                <div className="flex gap-4 items-start">
                  {/* Calendar Widget Graphic */}
                  <div className="flex flex-col items-center bg-white border border-[#214C54]/20 rounded-xl overflow-hidden min-w-[65px] shadow-sm shrink-0">
                    <span className="bg-[#B91C1C] text-white w-full text-[9px] font-black text-center py-1 uppercase tracking-wider">
                      {lessonDateDetails.weekday.split(' ')[0] || 'Lịch'}
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
                    <p className="text-xs text-gray-500 font-semibold mt-0.5">
                      Thời gian: {nearestLesson.time && nearestLesson.endTime ? `${nearestLesson.time} - ${nearestLesson.endTime}` : (nearestLesson.allDay || nearestLesson.time === '00:00' ? 'Cả ngày' : nearestLesson.time)}
                    </p>

                  </div>
                </div>

                {/* Direct Action Zoom Link */}
                <a 
                  href="https://daymai.vn/meet/0388148327"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full btn btn-accent text-xs font-black shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/20 transform hover:-translate-y-0.5 transition-all text-center py-3 flex items-center justify-center gap-2 group animate-pulse"
                >
                  <span className="text-sm">📽️</span>
                  <span>Tham gia Zoom Class ngay</span>
                </a>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400 text-xs">
                Chưa có buổi học tiếp theo được lên lịch.
              </div>
            )}
          </div>

          {/* Card: Giải đấu hiện tại & Bảng vinh danh */}
          <div className="card p-0 overflow-hidden bg-white shadow-sm border border-gray-100">
            {/* Header / Giải đấu */}
            <div className="bg-gradient-to-br from-[#fef9c3] to-white border-b border-[#ca8a04]/20 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm bg-gradient-to-br from-[#ca8a04] to-[#92400e]">
                  ⛵
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#92400e]">
                    Giải Đấu Hiện Tại
                  </div>
                  <div className="text-base font-black text-[#15333B] leading-tight">
                    {getRankTitle(activeUser.nautical_miles)}
                  </div>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-xl border border-[#ca8a04]/30 px-3 py-2.5 flex items-center justify-between">
                <div className="text-xs font-bold text-[#15333B]">
                  Vị trí: <span className="text-[#92400e] font-black">#{userRankIndex}</span>
                </div>
                {userRankIndex <= 3 && (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-100 rounded-full px-2 py-0.5 shadow-sm">
                    <TrendingUp size={10} /> Đang thăng hạng
                  </div>
                )}
              </div>
            </div>

            {/* Mini Leaderboard */}
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-extrabold text-[#15333B] flex items-center gap-1.5 uppercase tracking-wider">
                  <Shield size={14} className="text-[#3E5E63]" /> Top Thủy Thủ
                </h4>
                <span className="text-[10px] text-gray-400 font-semibold">⚓ Hải lý</span>
              </div>
              
              <div className="space-y-2">
                {leaderboard.slice(0, 3).map((student, idx) => (
                  <div key={student.id} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${student.id === activeUser.id ? 'bg-[#fef9c3]/50' : ''}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shadow-sm ${idx === 0 ? 'bg-gradient-to-br from-[#ffd700] to-[#f59e0b] text-[#78350f] border-2 border-[#d97706]' : idx === 1 ? 'bg-gradient-to-br from-[#e5e7eb] to-[#9ca3af] text-[#374151] border-2 border-gray-400' : idx === 2 ? 'bg-gradient-to-br from-[#fed7aa] to-[#f97316] text-[#7c2d12] border-2 border-orange-400' : 'bg-white border border-gray-200 text-gray-400'}`}>
                      {idx + 1}
                    </span>
                    <img src={student.avatar_url} alt={student.full_name} className="w-6 h-6 rounded-full object-cover border border-gray-200" />
                    <span className="flex-1 text-xs font-bold text-[#15333B] truncate">
                      {student.full_name} {student.id === activeUser.id && <span className="text-[9px] bg-[#214C54] text-white px-1.5 py-0.5 rounded-full ml-1">BẠN</span>}
                    </span>
                    <span className={`text-xs font-black tabular-nums ${idx === 0 ? 'text-yellow-600' : 'text-[#214C54]'}`}>
                      {student.nautical_miles}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 mt-4 border-t border-gray-100 text-center">
                <button 
                  onClick={() => onPageChange('walloffame')}
                  className="text-xs text-[#214C54] hover:text-[#15333B] font-extrabold"
                >
                  Xem Bảng Xếp Hạng ➔
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

