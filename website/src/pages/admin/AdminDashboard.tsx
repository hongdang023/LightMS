import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { PageHeader } from '../../components/PageHeader';
import { 
  LayoutDashboard, Users, FileText, CheckSquare, 
  Mail, X, ChevronDown, ChevronRight, Trophy, Sparkles
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

interface BarChartProps {
  data: {
    label: string;
    completed: number;
    total: number;
    title: string;
  }[];
  colorClass: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, colorClass }) => {
  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
      <div 
        className="flex items-end justify-between h-36 pt-6 pb-2 px-1 border-b border-gray-150 relative"
        style={{ minWidth: data.length > 8 ? `${data.length * 36}px` : '100%' }}
      >
        {data.map((item, index) => {
          const percentage = item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;
          const uncompleted = item.total - item.completed;
          return (
            <div key={index} className="group relative flex flex-col items-center flex-1 mx-1 h-full justify-end">
              {/* Tooltip on hover */}
              <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center bg-[#15333B] text-white text-[10px] p-2 rounded-lg shadow-lg z-10 w-36 text-center pointer-events-none transition-all left-1/2 transform -translate-x-1/2">
                <span className="font-extrabold mb-1">{item.title}</span>
                <span className="font-bold text-emerald-400">{item.completed} HV hoàn thành</span>
                <span className="font-bold text-rose-400">{uncompleted} HV chưa hoàn thành</span>
                <div className="w-1.5 h-1.5 bg-[#15333B] rotate-45 mt-1 -mb-2"></div>
              </div>
              
              {/* Percentage indicator */}
              <span className="text-[9px] font-black text-gray-500 mb-1">{percentage}%</span>
              
              {/* The bar */}
              <div 
                style={{ height: `${Math.max(percentage, 4)}%` }}
                className={`w-full max-w-[18px] rounded-t-md transition-all duration-300 group-hover:opacity-85 ${colorClass}`}
              ></div>
              
              {/* Label below the bar */}
              <span className="text-[9px] font-extrabold text-[#3E5E63] mt-2 block whitespace-nowrap">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onPageChange }) => {
  const { 
    users, submissions, assignments, 
    onboardingDays, lessons, nauticalTransactions,
    courses, modules
  } = useDatabase();

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter lessons and assignments for the current course (Vibe Coding 201)
  const currentCourse = courses.find(c => c.title.toLowerCase().includes('201')) || courses[0];
  let filteredModules = currentCourse 
    ? modules.filter(m => m.course_id === currentCourse.id)
    : modules;

  if (filteredModules.length === 0 && modules.length > 0) {
    const fallbackCourseId = modules[0].course_id;
    filteredModules = modules.filter(m => m.course_id === fallbackCourseId);
  }

  const courseLessons = lessons;

  const courseAssignments = assignments.filter(a => courseLessons.some(l => l.id === a.lesson_id));

  const students = users.filter(u => u.role === 'student');
  const totalStudents = students.length;
  const pendingGradesCount = submissions.filter(s => s.status === 'submitted' && courseAssignments.some(a => a.id === s.assignment_id)).length;
  const gradedCount = submissions.filter(s => s.status === 'graded' && courseAssignments.some(a => a.id === s.assignment_id)).length;

  // Calculate Assignment Completion Rate
  const totalAssignmentsCount = courseAssignments.length;
  const totalExpectedSubmissions = totalStudents * totalAssignmentsCount;

  // Selected student object
  const selectedStudent = users.find(u => u.id === selectedStudentId);

  const isStudentOnboardingDayCompleted = (studentId: string, day: number) => {
    const student = users.find(u => u.id === studentId);
    if (!student) return false;
    const completedCount = Math.min(7, Math.floor(student.nautical_miles / 50));
    return day <= completedCount;
  };

  // Helper: Check if a student completed a specific lesson assignment
  const isStudentLessonCompleted = (studentId: string, lessonId: string) => {
    const asg = courseAssignments.find(a => a.lesson_id === lessonId);
    if (!asg) return false;
    return submissions.some(s => s.student_id === studentId && s.assignment_id === asg.id && (s.status === 'submitted' || s.status === 'graded'));
  };

  // Helper: Get list of unsubmitted homeworks (bottlenecks) for a student
  const getStudentUnsubmittedLessons = (studentId: string) => {
    return courseLessons.filter(l => {
      const asg = courseAssignments.find(a => a.lesson_id === l.id);
      if (!asg) return false;
      const submitted = submissions.some(s => s.student_id === studentId && s.assignment_id === asg.id);
      return !submitted;
    });
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
    .filter(({ l }) => courseAssignments.some(a => a.lesson_id === l.id))
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
      const lessonCompleted = nauticalTransactions.some(t => t.student_id === studentId && t.action_type === 'lesson_complete' && t.reference_id === l.id);
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

        <div className="group relative overflow-hidden flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-300" onClick={() => onPageChange('speedgrader')}>
          <div className="absolute inset-y-0 left-0 w-1.5 bg-amber-500 rounded-l-2xl"></div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <FileText size={22} />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-extrabold uppercase block tracking-wider">Chờ Chấm Điểm</span>
            <span className="text-base font-black text-[#15333B] mt-0.5 block">{pendingGradesCount} bài nộp</span>
          </div>
        </div>

        <div className="group relative overflow-hidden flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="absolute inset-y-0 left-0 w-1.5 bg-green-500 rounded-l-2xl"></div>
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
            <CheckSquare size={22} />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-extrabold uppercase block tracking-wider">Đã Chấm Điểm</span>
            <span className="text-base font-black text-[#15333B] mt-0.5 block">{gradedCount} bài nộp</span>
          </div>
        </div>
      </div>

      {/* --- STATS SECTIONS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Onboarding Completion Box */}
        <div className="card bg-white p-6 rounded-3xl border border-gray-150 shadow-sm space-y-5">
          <h3 className="font-extrabold text-sm text-[#15333B] uppercase tracking-wider flex items-center gap-2 border-b border-gray-100 pb-3">
            <Sparkles className="text-purple-600 w-5 h-5" /> Thống kê Onboarding Week
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Overall Donut Chart */}
            <div className="col-span-1 flex justify-center">
              <DonutChart 
                completed={onboardingOverallCompletedCount} 
                total={totalStudents} 
                label="Tổng quan Tuần" 
                sublabel="Hoàn thành >= 5 ngày"
                colorHex="#845EF7" 
              />
            </div>
            {/* Day-specific Bar Chart */}
            <div className="col-span-2 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">Chi tiết tiến độ từng ngày</span>
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
            {/* Overall Homework Donut Chart */}
            <div className="col-span-1 flex justify-center">
              <DonutChart 
                completed={submissions.filter(s => s.status === 'graded' && courseAssignments.some(a => a.id === s.assignment_id)).length} 
                total={totalExpectedSubmissions} 
                label="Đã chấm điểm" 
                sublabel="Bài tập đạt chất lượng"
                colorHex="#0CA678" 
              />
            </div>
            {/* Session-specific Bar Chart */}
            <div className="col-span-2 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">Chi tiết tiến độ từng buổi học</span>
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


    </div>
  );
};


