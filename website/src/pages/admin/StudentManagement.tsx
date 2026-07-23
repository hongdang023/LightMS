import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { PageHeader } from '../../components/PageHeader';
import { Users, Mail, Award, CheckCircle, Search, Trophy, ShieldAlert, BarChart3, Sparkles } from 'lucide-react';

// Custom components & helpers for Demographics Overview
const getDemographics = (student: any) => {
  return {
    current_role: student.current_role || student.current_job || 'Chưa cập nhật',
    work_field: student.work_field || student.industry || 'Chưa cập nhật',
    gender: student.gender || 'Chưa cập nhật',
    age_group: student.age_group || 'Chưa cập nhật',
    living_region: student.living_region || 'Chưa cập nhật',
    referral_source: student.referral_source || 'Chưa cập nhật'
  };
};

const DemographicsChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
      <h4 className="font-extrabold text-xs text-[#15333B] uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">{title}</h4>
      <div className="flex-1 flex items-center justify-center min-h-[160px] w-full">
        {children}
      </div>
    </div>
  );
};

const HorizontalProgressBarList: React.FC<{
  data: { label: string; count: number; percentage: number }[];
  colorClass?: string;
}> = ({ data, colorClass = 'bg-amber-500' }) => {
  return (
    <div className="w-full space-y-3">
      {data.map((item, idx) => (
        <div key={idx} className="space-y-1">
          <div className="flex justify-between items-center text-[10px] font-bold">
            <span className="text-gray-700 truncate max-w-[180px]" title={item.label}>{item.label}</span>
            <span className="text-[#15333B] font-extrabold">{item.count} HV ({item.percentage}%)</span>
          </div>
          <div className="w-full bg-gray-150 h-2 rounded-full overflow-hidden">
            <div
              style={{ width: `${item.percentage}%` }}
              className={`h-full rounded-full transition-all duration-500 ease-out ${colorClass}`}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const DemographicsDonutChart: React.FC<{
  data: { label: string; count: number; percentage: number; colorHex: string }[];
}> = ({ data }) => {
  const radius = 32;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  
  let accumulatedPercentage = 0;

  return (
    <div className="flex items-center justify-center gap-6 w-full">
      <div className="relative w-24 h-24 flex-shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="transparent"
            stroke="#F3F4F6"
            strokeWidth={strokeWidth}
          />
          {data.map((item, idx) => {
            const strokeDashoffset = circumference - (item.percentage / 100) * circumference;
            const strokeDasharray = `${circumference}`;
            const rotationOffset = (accumulatedPercentage / 100) * circumference;
            accumulatedPercentage += item.percentage;
            
            return (
              <circle
                key={idx}
                cx="40"
                cy="40"
                r={radius}
                fill="transparent"
                stroke={item.colorHex}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                style={{
                  transformOrigin: '40px 40px',
                  transform: `rotate(${(rotationOffset / circumference) * 360}deg)`,
                }}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Tổng</span>
          <span className="text-sm font-black text-[#15333B]">{data.reduce((sum, item) => sum + item.count, 0)} HV</span>
        </div>
      </div>
      
      <div className="flex-1 space-y-2">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.colorHex }}></span>
            <div className="flex justify-between w-full text-[10px] font-bold text-gray-700">
              <span>{item.label}</span>
              <span className="text-[#15333B] font-extrabold">{item.count} ({item.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const VerticalProgressBarList: React.FC<{
  data: { label: string; count: number; percentage: number }[];
  colorClass?: string;
}> = ({ data, colorClass = 'bg-amber-500' }) => {
  return (
    <div className="flex items-end justify-around h-36 w-full pt-4 border-b border-gray-150 pb-1">
      {data.map((item, idx) => (
        <div key={idx} className="group relative flex flex-col items-center flex-1 min-w-0 mx-1 h-full justify-end">
          <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center bg-[#15333B] text-white text-[9px] px-2 py-1 rounded-lg shadow-lg z-10 w-24 text-center pointer-events-none transition-all">
            <span className="font-extrabold truncate w-full">{item.label}</span>
            <span className="font-bold text-emerald-400">{item.count} HV ({item.percentage}%)</span>
            <div className="w-1.5 h-1.5 bg-[#15333B] rotate-45 mt-1 -mb-2"></div>
          </div>
          
          <span className="text-[9px] font-black text-gray-500 mb-1">{item.percentage}%</span>
          
          <div
            style={{ height: `${Math.max(item.percentage, 5)}%` }}
            className={`w-full max-w-[16px] rounded-t-md transition-all duration-300 group-hover:opacity-85 ${colorClass}`}
          ></div>
          
          <span className="text-[8px] font-extrabold text-[#3E5E63] mt-2 block truncate w-full text-center" title={item.label}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export const StudentManagement: React.FC = () => {
  const { users, submissions, lessons, assignments, onboardingDays, addNotification } = useDatabase();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'risk' | 'outstanding' | 'guest'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'overview' | 'onboarding'>('list');
  const [expandedDays, setExpandedDays] = useState<{[key: number]: boolean}>({});

  // Helper to extract clean task items from day checklist markdown
  const getTasksForDay = (dayData: any) => {
    const lines = dayData.checklist.split('\n');
    const tasks: { idx: number; label: string; key: string; isOptional: boolean; optionalNote: string }[] = [];
    let taskIdx = 0;
    lines.forEach((line: string) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('- [ ]')) {
        taskIdx++;
        const rawLabel = trimmed.replace('- [ ]', '').trim();
        // Detect optional and extract the note after it
        const optionalMatch = rawLabel.match(/\(optional[^)]*\)/i);
        const isOptional = !!optionalMatch;
        const optionalNote = optionalMatch ? optionalMatch[0].replace(/^\(optional\s*[-–]?\s*/i, '').replace(/\)$/, '').trim() : '';
        const cleanLabel = rawLabel.replace(/\(optional[^)]*\)/i, '').trim().replace(/^[-–:]+\s*/, '').trim();
        tasks.push({
          idx: taskIdx,
          label: cleanLabel,
          key: `day-${dayData.day}-task-${taskIdx}`,
          isOptional,
          optionalNote
        });
      } else if (tasks.length > 0 && line.length > 0) {
        tasks[tasks.length - 1].label += '\n' + line;
      }
    });
    return tasks;
  };

  const getStudentCurrentStopTask = (student: any) => {
    for (let d = 1; d <= 7; d++) {
      const dayData = onboardingDays.find(day => day.day === d);
      if (!dayData) continue;
      const tasks = getTasksForDay(dayData);
      const requiredTasks = tasks.filter(t => !t.label.toLowerCase().includes('optional') && !t.isOptional);
      const firstUnchecked = requiredTasks.find(t => !student.onboarding_tasks?.[t.key]);
      if (firstUnchecked) {
        return firstUnchecked.key;
      }
    }
    return null;
  };

  // Bulk email states
  const [isBulkEmailModalOpen, setIsBulkEmailModalOpen] = useState(false);
  const [bulkRecipientGroup, setBulkRecipientGroup] = useState<'all' | 'risk' | 'outstanding'>('all');
  const [bulkSubject, setBulkSubject] = useState('');
  const [bulkBody, setBulkBody] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const students = users.filter(u => u.role === 'student');
  const guests = users.filter(u => u.role === 'guest');
  const activeStudent = users.find(s => s.id === selectedStudentId);

  const liveClassAssignments = assignments.filter(a => {
    const lesson = lessons.find(l => l.id === a.lesson_id);
    return !!lesson;
  });
  const totalLiveClassCount = liveClassAssignments.length || 3;

  // Helpers to get homework counts
  const getOnboardingCompletedCount = (student: typeof students[0]) => {
    let completedDays = 0;
    onboardingDays.forEach(day => {
      const tasks = getTasksForDay(day);
      if (tasks.length === 0) {
        completedDays++;
        return;
      }
      const requiredTasks = tasks.filter(t => !t.label.toLowerCase().includes('optional') && !t.isOptional);
      if (requiredTasks.length === 0) {
        completedDays++;
        return;
      }
      const allChecked = requiredTasks.every(t => !!student.onboarding_tasks?.[t.key]);
      if (allChecked) {
        completedDays++;
      }
    });
    return completedDays;
  };

  const getLiveClassCompletedCount = (studentId: string) => {
    return submissions.filter(
      s => s.student_id === studentId && 
      liveClassAssignments.some(la => la.id === s.assignment_id) && 
      (s.status === 'graded' || s.status === 'submitted')
    ).length;
  };

  // Determine student status
  const getStudentStatus = (student: typeof students[0]) => {
    const onboardingDone = getOnboardingCompletedCount(student);
    const visits = student.visits || 1;
    const now = new Date().getTime();
    
    // Parse student registration date to calculate active days
    const studentStart = student.created_at ? new Date(student.created_at).getTime() : now;
    const daysActive = Math.max(1, Math.floor((now - studentStart) / (24 * 60 * 60 * 1000)));

    // Onboarding is overdue if they haven't finished after 7 days
    const onboardingDeadline = studentStart + 7 * 24 * 60 * 60 * 1000;
    const onboardingOverdue = now > onboardingDeadline && onboardingDone < 7;

    // Filter live class assignments whose lesson's start date has passed
    const startedLiveClassAssignments = liveClassAssignments.filter(a => {
      const lesson = lessons.find(l => l.id === a.lesson_id);
      if (!lesson || !lesson.start_date) return false;
      return now >= new Date(lesson.start_date).getTime();
    });

    // Filter live class assignments whose deadline has passed (start_date + 3 days)
    const dueLiveClassAssignments = liveClassAssignments.filter(a => {
      const lesson = lessons.find(l => l.id === a.lesson_id);
      if (!lesson || !lesson.start_date) return false;
      const start = new Date(lesson.start_date).getTime();
      const deadline = start + 3 * 24 * 60 * 60 * 1000;
      return now >= deadline;
    });

    const liveClassDoneForStarted = submissions.filter(
      s => s.student_id === student.id && 
      startedLiveClassAssignments.some(la => la.id === s.assignment_id) && 
      (s.status === 'graded' || s.status === 'submitted')
    ).length;

    const liveClassDoneForDue = submissions.filter(
      s => s.student_id === student.id && 
      dueLiveClassAssignments.some(la => la.id === s.assignment_id) && 
      (s.status === 'graded' || s.status === 'submitted')
    ).length;

    // At risk if:
    // 1. Onboarding is overdue
    // 2. Or completed less than 50% of the live class assignments that are already due
    // 3. Or visits is less than expected visits (min of 4 or days active)
    const expectedVisits = Math.min(4, daysActive);
    const visitsAtRisk = visits < expectedVisits;
    
    const liveClassAtRisk = dueLiveClassAssignments.length > 0 && 
      (liveClassDoneForDue / dueLiveClassAssignments.length) < 0.5;

    const isAtRisk = onboardingOverdue || liveClassAtRisk || visitsAtRisk;

    // Outstanding if:
    // 1. Onboarding is completed (7/7)
    // 2. Completed 100% of all started live class assignments
    // 3. Visits meet expected outstanding visits (min of 8 or days active)
    const expectedOutstandingVisits = Math.min(8, Math.max(2, daysActive));
    const visitsOutstanding = visits >= expectedOutstandingVisits;

    const liveClassOutstanding = startedLiveClassAssignments.length === 0 || 
      (liveClassDoneForStarted === startedLiveClassAssignments.length);

    const isOutstanding = onboardingDone === 7 && liveClassOutstanding && visitsOutstanding;

    if (isAtRisk) return 'risk';
    if (isOutstanding) return 'outstanding';
    return 'normal';
  };

  // Filter students based on active tab and search query
  const filteredStudents = (() => {
    if (activeTab === 'guest') {
      return guests.filter(guest => 
        guest.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        guest.gmail.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return students.filter(student => {
      const status = getStudentStatus(student);
      const matchesTab = activeTab === 'all' || status === activeTab;
      const matchesSearch = student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            student.gmail.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  })();

  const getRankTitle = (miles: number) => {
    if (miles >= 5000) return 'Huyền thoại biển cả 👑';
    if (miles >= 3001) return 'Thuyền trưởng 🧭';
    if (miles >= 1501) return 'Thuyền phó ⚔️';
    if (miles >= 501) return 'Hoa tiêu 🗺️';
    return 'Thủy thủ tập sự ⛵';
  };

  // Commendation actions
  const triggerCommendation = (name: string) => {
    setToastMessage(`Đã gửi thư khen ngợi và tuyên dương học viên **${name}** xuất sắc! 🎉`);
    addNotification('Tuyên dương học viên', `Học viên ${name} được vinh danh vì thành tích xuất sắc!`, 'system');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const getMailtoLink = (student: typeof students[0]) => {
    const emailSubject = encodeURIComponent(`[LightMS] Cảnh báo tiến độ học tập - Học viên ${student.full_name}`);
    const emailBody = encodeURIComponent(
      `Chào bạn ${student.full_name},\n\n` +
      `Thầy cô thấy bạn đang gặp chút chậm trễ về tiến độ bài tập và lượt truy cập tương tác trên hệ thống học tập.\n\n` +
      `Đừng ngần ngại nhắn tin trên nhóm hỗ trợ hoặc liên hệ trực tiếp để được Mentor hướng dẫn vượt qua khó khăn nhé!\n\n` +
      `Thân ái,\n` +
      `Ban vận hành LightMS`
    );
    return `mailto:${student.gmail}?subject=${emailSubject}&body=${emailBody}`;
  };

  const getBulkEmails = () => {
    if (bulkRecipientGroup === 'risk') {
      const riskStudents = students.filter(s => getStudentStatus(s) === 'risk');
      return riskStudents.map(s => s.gmail).join(',');
    }
    if (bulkRecipientGroup === 'outstanding') {
      const outstandingStudents = students.filter(s => getStudentStatus(s) === 'outstanding');
      return outstandingStudents.map(s => s.gmail).join(',');
    }
    return students.map(s => s.gmail).join(',');
  };

  const updateEmailTemplate = (group: 'all' | 'risk' | 'outstanding') => {
    setBulkRecipientGroup(group);
    if (group === 'risk') {
      setBulkSubject('[The1ight] Alo alo! Vẹt lắm mồm báo động đỏ hỗ trợ học tập đâyyy! 🦜🚨');
      setBulkBody(
        `Kẹt kẹt... Reng reng! 🦜\n\n` +
        `Chào các đồng chí thủy thủ,\n\n` +
        `Vẹt Lắm Mồm từ hạm đội The1ight bay qua và phát hiện ra hạm đội của chúng ta đang có một vài thành viên hơi "chìm" dưới sóng bài tập một chút nhé! (Tiến độ bài tập hoặc lượt tương tác đang hơi chậm rồi đấy nha, kẹt kẹt!).\n\n` +
        `Thuyền trưởng Đặng Tuyết Hồng và Mentor đang lo sốt vó lên rồi đây này! Đừng sợ, có khó khăn hay rào cản gì cứ la lên để Vẹt truyền tin hoặc nhắn trực tiếp trên kênh hỗ trợ Light Support nhé. Hãy chủ động đặt lịch Office Hour ngay để Mentor kéo bạn lên thuyền đi tiếp nào!\n\n` +
        `Giương buồm lên và lướt sóng thôi! Quyết tâm không để bị bỏ lại phía sau! 🦜⚓️`
      );
    } else if (group === 'outstanding') {
      setBulkSubject('[The1ight] Loa loa loa! Vẹt lắm mồm vinh danh Thủy thủ xuất sắc đâyyy! 🦜🏆');
      setBulkBody(
        `Cục ta cục tác... Kẹt kẹt! 🦜\n\n` +
        `Chào các siêu thủy thủ xuất sắc,\n\n` +
        `Vẹt Lắm Mồm từ hạm đội The1ight xin được hét thật to vinh danh các chiến thần vì đã càn quét sạch sẽ toàn bộ thử thách bài tập vừa qua! Quá xuất sắc, quá đỉnh chóp!\n\n` +
        `Thuyền trưởng Đặng Tuyết Hồng gửi ngàn tim và Mentor đang vỗ tay bôm bốp khen ngợi tinh thần giương buồm không mệt mỏi của bạn. Hãy tiếp tục giữ vững phong độ này để giật cup quán quân Hải trình Vibe Coding nhé!\n\n` +
        `Bay cao bay xa cùng The1ight thôi nào! 🦜✨`
      );
    } else {
      setBulkSubject('[The1ight] Vẹt lắm mồm từ hạm đội The1ight gửi lời chào thủy thủ đoàn! 🦜');
      setBulkBody(
        `Kẹt kẹt... Alo alo! 🦜\n\n` +
        `Chào toàn thể thủy thủ đoàn hạm đội LightMS,\n\n` +
        `Vẹt Lắm Mồm bay lượn vòng quanh hòn đảo học tập và muốn gửi lời chúc năng lượng siêu cấp đến tất cả các bạn! Dù đang đi nhanh hay đi chậm, chỉ cần chúng ta không dừng lại, đích đến chắc chắn sẽ ở ngay trước mắt.\n\n` +
        `Đừng quên check lịch học, hoàn thành bài tập và hú hét trên kênh hỗ trợ khi cần nhé!\n\n` +
        `Chúc cả nhà một tuần học tập rực rỡ! 🦜⚓️`
      );
    }
  };

  const getHtmlEmail = (subject: string, bodyText: string) => {
    const formattedBody = bodyText
      .split('\n\n')
      .map(p => `<p style="margin: 0 0 12px; line-height: 1.6; color: #3E5E63;">${p.replace(/\n/g, '<br />')}</p>`)
      .join('');

    return `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FDF5DA; padding: 25px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1.5px solid #ffd94c;">
  <div style="background-color: #15333B; padding: 15px; border-radius: 12px 12px 0 0; text-align: center; border-bottom: 4px solid #ffd94c;">
    <h1 style="color: #ffd94c; margin: 0; font-size: 18px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase;">
      🦜 VẸT LẮM MỒM - THE1IGHT 🦜
    </h1>
  </div>
  <div style="background-color: #ffffff; padding: 25px; border-radius: 0 0 12px 12px; border-top: none; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
    <h2 style="color: #214C54; margin-top: 0; font-size: 15px; font-weight: 800; border-bottom: 2px solid #F0F0F0; padding-bottom: 8px;">
      ${subject}
    </h2>
    ${formattedBody}
    <div style="margin-top: 25px; padding-top: 15px; border-top: 2px solid #F0F0F0; text-align: center;">
      <a href="http://localhost:5173" style="display: inline-block; background-color: #214C54; color: #ffffff; padding: 8px 18px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 11px; box-shadow: 0 2px 4px rgba(33,76,84,0.2);">
        VÀO HỆ THỐNG LIGHTMS 🚀
      </a>
    </div>
  </div>
  <div style="text-align: center; margin-top: 12px; font-size: 9px; color: #3E5E63; font-weight: 600;">
    Bản tin được gửi từ hạm đội vận hành LightMS. Chúc các thủy thủ thuận buồm xuôi gió!
  </div>
</div>
    `.trim();
  };

  const handleCopyHtml = async () => {
    const html = getHtmlEmail(bulkSubject, bulkBody);
    try {
      const blobHtml = new Blob([html], { type: 'text/html' });
      const blobText = new Blob([bulkBody], { type: 'text/plain' });
      const item = new ClipboardItem({
        'text/html': blobHtml,
        'text/plain': blobText
      });
      await navigator.clipboard.write([item]);
      setCopySuccess(true);
    } catch (err) {
      // Fallback to raw HTML copy if ClipboardItem is not supported
      navigator.clipboard.writeText(html);
      setCopySuccess(true);
    }
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleSendBulkEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const emails = getBulkEmails();
    if (!emails) {
      alert('Không có người nhận trong nhóm này!');
      return;
    }
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&bcc=${emails}&su=${encodeURIComponent(bulkSubject)}&body=${encodeURIComponent(bulkBody)}`;
    window.open(gmailUrl, '_blank');
    
    let groupLabel = 'Tất cả học viên';
    if (bulkRecipientGroup === 'risk') groupLabel = 'Học viên cần hỗ trợ';
    if (bulkRecipientGroup === 'outstanding') groupLabel = 'Học viên cần vinh danh';

    setToastMessage(`Đã mở Gmail gửi tới nhóm **${groupLabel}** thành công!`);
    addNotification('Gửi mail hàng loạt', `Admin vừa gửi email hàng loạt cho nhóm ${groupLabel}.`, 'system');
    
    setIsBulkEmailModalOpen(false);
    setBulkSubject('');
    setBulkBody('');
  };

  const openBulkEmailModal = () => {
    setIsBulkEmailModalOpen(true);
    updateEmailTemplate('all');
  };

  const stats = (() => {
    const rolesMap: Record<string, number> = {};
    const fieldsMap: Record<string, number> = {};
    const gendersMap: Record<string, number> = {};
    const ageGroupsMap: Record<string, number> = {};
    const regionsMap: Record<string, number> = {};
    const referralsMap: Record<string, number> = {};

    students.forEach(student => {
      const demo = getDemographics(student);
      
      rolesMap[demo.current_role] = (rolesMap[demo.current_role] || 0) + 1;
      fieldsMap[demo.work_field] = (fieldsMap[demo.work_field] || 0) + 1;
      gendersMap[demo.gender] = (gendersMap[demo.gender] || 0) + 1;
      ageGroupsMap[demo.age_group] = (ageGroupsMap[demo.age_group] || 0) + 1;
      regionsMap[demo.living_region] = (regionsMap[demo.living_region] || 0) + 1;
      referralsMap[demo.referral_source] = (referralsMap[demo.referral_source] || 0) + 1;
    });

    const formatMap = (map: Record<string, number>) => {
      return Object.entries(map)
        .map(([label, count]) => ({
          label,
          count,
          percentage: Math.round((count / students.length) * 100)
        }))
        .sort((a, b) => b.count - a.count);
    };

    const gendersColorMap: Record<string, string> = {
      'Nam': '#10B981', 
      'Nữ': '#F43F5E', 
      'Other': '#F59E0B',
      'Chưa cập nhật': '#9CA3AF'
    };

    const formattedGenders = Object.entries(gendersMap).map(([label, count]) => ({
      label,
      count,
      percentage: Math.round((count / students.length) * 100),
      colorHex: gendersColorMap[label] || '#6B7280'
    })).sort((a, b) => b.count - a.count);

    return {
      roles: formatMap(rolesMap),
      fields: formatMap(fieldsMap),
      genders: formattedGenders,
      ageGroups: formatMap(ageGroupsMap),
      regions: formatMap(regionsMap),
      referrals: formatMap(referralsMap)
    };
  })();

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-fade-in select-none overflow-hidden space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Quản lý Học viên"
          description="Theo dõi hoạt động, tiến độ bài tập, khen thưởng học viên xuất sắc hoặc cảnh báo học viên cần hỗ trợ."
          icon={<Users size={32} strokeWidth={1.5} />}
        />

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-gray-150 p-1 rounded-xl border border-gray-200 w-fit self-start sm:self-auto shadow-sm">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'list' ? 'bg-[#214C54] text-white shadow-sm' : 'text-gray-655 hover:text-gray-900 hover:bg-gray-200/50'
            }`}
          >
            <Users size={14} /> Danh sách chi tiết
          </button>
          <button
            onClick={() => setViewMode('overview')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'overview' ? 'bg-[#214C54] text-white shadow-sm' : 'text-gray-655 hover:text-gray-900 hover:bg-gray-200/50'
            }`}
          >
            <BarChart3 size={14} /> Tổng quan học viên
          </button>
          <button
            onClick={() => setViewMode('onboarding')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'onboarding' ? 'bg-[#214C54] text-white shadow-sm' : 'text-gray-655 hover:text-gray-900 hover:bg-gray-200/50'
            }`}
          >
            <Sparkles size={14} /> Thống kê Onboarding
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#15333B] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#3E5E63] flex items-center gap-3 animate-scale-up">
          <Trophy className="text-yellow-400 w-5 h-5 animate-bounce" />
          <span className="text-xs font-bold" dangerouslySetInnerHTML={{ __html: toastMessage }}></span>
          <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-white ml-2">✕</button>
        </div>
      )}
      
      {viewMode === 'list' && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* Left Column: Students directory (8 cols) */}
        <div className="lg:col-span-8 flex flex-col h-full bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          
          {/* Filters & Search Header */}
          <div className="p-4 bg-gray-50 border-b border-gray-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-sm text-[#15333B] uppercase tracking-wider">Danh sách học viên</h3>
                <p className="text-[10px] text-[#3E5E63] font-semibold mt-0.5">Quản lý kết quả nộp bài tập và tần suất tương tác học tập.</p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Tìm học viên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 w-full sm:w-60 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#214C54] font-semibold text-[#15333B]"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-gray-150 p-1 rounded-xl border border-gray-200 w-fit">
                <button 
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    activeTab === 'all' ? 'bg-[#214C54] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Tất cả ({students.length})
                </button>
                <button 
                  onClick={() => setActiveTab('risk')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                    activeTab === 'risk' ? 'bg-red-600 text-white shadow-sm' : 'text-red-600 hover:bg-red-50'
                  }`}
                >
                  <ShieldAlert size={12} /> Cần hỗ trợ ({students.filter(s => getStudentStatus(s) === 'risk').length})
                </button>
                <button 
                  onClick={() => setActiveTab('outstanding')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                    activeTab === 'outstanding' ? 'bg-amber-500 text-white shadow-sm' : 'text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  <Trophy size={12} /> Khen thưởng ({students.filter(s => getStudentStatus(s) === 'outstanding').length})
                </button>
                <button 
                  onClick={() => setActiveTab('guest')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                    activeTab === 'guest' ? 'bg-gray-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Users size={12} /> Khách truy cập ({guests.length})
                </button>
              </div>

              {/* Bulk Email Button */}
              <button
                onClick={openBulkEmailModal}
                className="btn btn-primary text-xs font-extrabold px-4 py-2 flex items-center gap-2 rounded-xl shadow-sm self-start sm:self-auto"
              >
                <Mail size={14} /> Gửi Email Hàng Loạt
              </button>
            </div>
          </div>

          {/* Students Table */}
          <div className="flex-1 overflow-auto custom-scrollbar">
            {filteredStudents.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400">
                <span className="text-4xl mb-2">🔍</span>
                <p className="text-xs font-bold">Không tìm thấy học viên nào phù hợp.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 font-extrabold text-[10px] uppercase tracking-wider bg-gray-50/50 sticky top-0 z-10">
                    <th className="py-3 px-4">Học Viên</th>
                    <th className="py-3 px-4 text-center">BTVN Onboarding</th>
                    <th className="py-3 px-4 text-center">BTVN Live Class</th>
                    <th className="py-3 px-4 text-center">Visits</th>
                    <th className="py-3 px-4">Trạng Thái</th>
                    <th className="py-3 px-4 text-right">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150">
                  {filteredStudents.map((student) => {
                    const onboardingCount = getOnboardingCompletedCount(student);
                    const liveClassCount = getLiveClassCompletedCount(student.id);
                    const visits = student.visits || 1;
                    const status = activeTab === 'guest' ? 'guest' : getStudentStatus(student);
                    const isSelected = student.id === selectedStudentId;

                    return (
                      <tr 
                        key={student.id}
                        onClick={() => setSelectedStudentId(student.id)}
                        className={`transition-colors cursor-pointer group text-xs ${
                          isSelected 
                            ? 'bg-[#214C54]/5 font-semibold' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {/* Name & Avatar */}
                        <td className="py-3.5 px-4 flex items-center gap-3 min-w-0">
                          <img 
                            src={student.avatar_url} 
                            alt={student.full_name} 
                            className="w-8 h-8 rounded-full object-cover border"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-[#15333B] block leading-tight">{student.full_name}</span>
                            <span className="text-[10px] text-gray-400 block mt-0.5 leading-none">{student.gmail}</span>
                          </div>
                        </td>

                        {/* Onboarding Homework Progress */}
                        <td className="py-3.5 px-4 text-center font-bold text-gray-700">
                          <span className={onboardingCount === 7 ? 'text-green-600' : 'text-gray-500'}>
                            {onboardingCount}/7
                          </span>
                        </td>

                        {/* Live Class Homework Progress */}
                        <td className="py-3.5 px-4 text-center font-bold text-gray-700">
                          <span className={liveClassCount === totalLiveClassCount ? 'text-green-600' : liveClassCount === 0 ? 'text-red-500' : 'text-amber-600'}>
                            {liveClassCount}/{totalLiveClassCount}
                          </span>
                        </td>

                        {/* Visits count */}
                        <td className="py-3.5 px-4 text-center font-extrabold text-gray-700">
                          {visits}
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-4">
                          {status === 'guest' && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] bg-gray-150 text-gray-700 font-extrabold flex items-center gap-1 w-fit">
                              Khách
                            </span>
                          )}
                          {status === 'risk' && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] bg-red-100 text-red-850 font-extrabold flex items-center gap-1 w-fit">
                              <ShieldAlert size={10} /> Nguy cơ
                            </span>
                          )}
                          {status === 'outstanding' && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] bg-amber-100 text-amber-850 font-extrabold flex items-center gap-1 w-fit">
                              <Trophy size={10} /> Xuất sắc
                            </span>
                          )}
                          {status === 'normal' && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] bg-green-100 text-green-800 font-extrabold flex items-center gap-1 w-fit">
                              <CheckCircle size={10} /> Bình thường
                            </span>
                          )}
                        </td>

                        {/* Quick Actions */}
                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          {status === 'guest' && (
                            <button 
                              onClick={() => setSelectedStudentId(student.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 text-[10px] font-bold border border-gray-200 transition-colors"
                            >
                              Chi tiết
                            </button>
                          )}
                          {status === 'risk' && (
                            <a 
                              href={getMailtoLink(student)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-[10px] font-bold border border-red-200 transition-colors"
                            >
                              <Mail size={12} /> Hỗ trợ
                            </a>
                          )}
                          {status === 'outstanding' && (
                            <button 
                              onClick={() => triggerCommendation(student.full_name)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 text-[10px] font-bold border border-amber-200 transition-colors"
                            >
                              <Award size={12} /> Tuyên dương
                            </button>
                          )}
                          {status === 'normal' && (
                            <button 
                              onClick={() => setSelectedStudentId(student.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 text-[10px] font-bold border border-gray-200 transition-colors"
                            >
                              Chi tiết
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Column: Active Student Detailed Dossier (4 cols) */}
        <div className="lg:col-span-4 flex flex-col h-full bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          {!activeStudent ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
              <span className="text-5xl">👤</span>
              <div>
                <h4 className="font-extrabold text-sm text-[#15333B]">Hồ sơ chi tiết học viên</h4>
                <p className="text-xs text-gray-400 max-w-xs mt-1">Chọn một học viên từ bảng bên trái để kiểm tra mục tiêu sản phẩm, tech level và cam kết học tập.</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
              {/* Header info card */}
              <div className="flex flex-col items-center text-center pb-4 border-b border-gray-100 space-y-2">
                <img 
                  src={activeStudent.avatar_url} 
                  alt={activeStudent.full_name} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#214C54]"
                />
                <div>
                  <h4 className="font-extrabold text-sm text-[#15333B]">{activeStudent.full_name}</h4>
                  <span className="text-xs text-gray-400 block">{activeStudent.gmail}</span>
                  <span className="text-[10px] text-[#214C54] font-bold block mt-1">
                    ⚔️ {getRankTitle(activeStudent.nautical_miles)}
                  </span>
                </div>
              </div>

              {/* Progress Summary Block */}
              {(() => {
                const obCount = getOnboardingCompletedCount(activeStudent);
                const lcCount = getLiveClassCompletedCount(activeStudent.id);
                const totalHw = 7 + totalLiveClassCount;
                const completedHw = obCount + lcCount;
                const progressPct = Math.round((completedHw / totalHw) * 100);

                return (
                  <div className="bg-[#214C54]/5 border border-[#214C54]/10 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-extrabold text-[#15333B]">Tiến độ làm bài tập</span>
                      <span className="font-black text-[#214C54]">{completedHw}/{totalHw} bài ({progressPct}%)</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-550" 
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-[10px] pt-1">
                      <div>
                        <span className="text-gray-400 font-bold block">BTVN Onboarding:</span>
                        <span className="font-extrabold text-gray-700">{obCount}/7</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-bold block">BTVN Live Class:</span>
                        <span className="font-extrabold text-gray-700">{lcCount}/{totalLiveClassCount}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Business fields */}
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Mục tiêu sản phẩm số:</span>
                  <p className="p-3 bg-gray-50 border rounded-xl text-[#3E5E63] font-semibold leading-relaxed">
                    {activeStudent.product_idea || 'Chưa thiết lập ý tưởng'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Vai trò hiện tại:</span>
                    <span className="font-bold text-[#15333B] block">{activeStudent.current_role || activeStudent.current_job || 'Chưa cập nhật'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Lĩnh vực hoạt động:</span>
                    <span className="font-bold text-[#15333B] block">{activeStudent.work_field || activeStudent.industry || 'Chưa cập nhật'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Số điện thoại (Zalo):</span>
                    <span className="font-bold text-[#15333B] block">{activeStudent.phone_number || 'Chưa cập nhật'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Facebook URL:</span>
                    {activeStudent.facebook_url ? (
                      <a 
                        href={activeStudent.facebook_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-bold text-[#214C54] hover:underline block truncate"
                      >
                        {activeStudent.facebook_url}
                      </a>
                    ) : (
                      <span className="font-bold text-gray-400 block">Chưa cập nhật</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Giới tính:</span>
                    <span className="font-bold text-[#15333B] block">{activeStudent.gender || 'Chưa cập nhật'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Độ tuổi:</span>
                    <span className="font-bold text-[#15333B] block">{activeStudent.age_group || 'Chưa cập nhật'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Khu vực sinh sống:</span>
                    <span className="font-bold text-[#15333B] block">{activeStudent.living_region || 'Chưa cập nhật'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Nguồn giới thiệu:</span>
                    <span className="font-bold text-[#15333B] block">{activeStudent.referral_source || 'Chưa cập nhật'}</span>
                  </div>
                </div>

                {/* Detailed Homework Progress Checklist */}
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Tiến độ chi tiết bài tập:</span>
                  <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                    {/* Onboarding Week Progress */}
                    <div className="text-[9px] font-extrabold text-[#214C54] uppercase tracking-wider mb-1 mt-1">Chặng 1: Onboarding Week</div>
                    {onboardingDays.map(day => {
                      const isExpanded = !!expandedDays[day.day];
                      const tasks = getTasksForDay(day);
                      const requiredTasks = tasks.filter(t => !t.label.toLowerCase().includes('optional') && !t.isOptional);
                      const isDayCompleted = requiredTasks.length > 0 
                        ? requiredTasks.every(t => !!activeStudent.onboarding_tasks?.[t.key]) 
                        : true;
                      const currentStopKey = getStudentCurrentStopTask(activeStudent);
                      
                      const statusLabel = isDayCompleted ? "Đã xong" : "Chưa xong";
                      const badgeColor = isDayCompleted ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400";
                      
                      return (
                        <div key={`ob-${day.day}`} className="space-y-1 bg-gray-50/50 p-2 rounded-lg border border-gray-100">
                          <div 
                            onClick={() => setExpandedDays(prev => ({ ...prev, [day.day]: !prev[day.day] }))}
                            className="flex justify-between items-center text-[10px] cursor-pointer hover:bg-gray-100/50 p-1.5 rounded transition-colors"
                          >
                            <span className="font-bold text-[#15333B] truncate pr-4 flex items-center gap-1.5">
                              <span className="text-[8px] text-gray-400">{isExpanded ? '▼' : '▶'}</span>
                              Ngày {day.day}: {day.title.split(': ')[1] || day.title}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold shrink-0 ${badgeColor}`}>
                              {statusLabel}
                            </span>
                          </div>
                          
                          {isExpanded && (
                            <div className="pl-4 pr-1 py-1 space-y-1 border-l border-gray-200 ml-1.5 mt-1 text-[9px] text-gray-600">
                              {tasks.length === 0 ? (
                                <div className="text-gray-400 italic">Không có nhiệm vụ nào</div>
                              ) : (
                                tasks.map(t => {
                                  const isChecked = !!activeStudent.onboarding_tasks?.[t.key];
                                  const isStop = t.key === currentStopKey;
                                  
                                  return (
                                    <div 
                                      key={t.key} 
                                      className={`flex items-start gap-2 p-1.5 rounded transition-all ${
                                        isStop 
                                          ? 'bg-amber-50 border border-amber-200 text-amber-900 font-semibold' 
                                          : isChecked 
                                            ? 'text-gray-400 line-through' 
                                            : ''
                                      }`}
                                    >
                                      <span className={`font-bold shrink-0 ${isChecked ? 'text-green-600' : isStop ? 'text-amber-600' : 'text-gray-400'}`}>
                                        {isChecked ? '✓' : '○'}
                                      </span>
                                      <div className="flex-1">
                                        <span>Task {t.idx} ({isChecked ? 'Đã xong' : 'Chưa xong'})</span>
                                        {t.isOptional && (
                                          <span className="ml-1 text-[7px] bg-gray-100 text-gray-450 px-1 py-0.5 rounded shrink-0 font-bold">Optional</span>
                                        )}
                                        {isStop && (
                                          <span className="ml-1.5 px-1 py-0.5 rounded text-[7px] font-extrabold bg-amber-500 text-white animate-pulse inline-block">Đang dừng tại đây</span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Live Class Progress */}
                    <div className="text-[9px] font-extrabold text-[#214C54] uppercase tracking-wider mb-1 mt-3">Chặng 2: Live Class</div>
                    {lessons.map(lesson => {
                      const asg = assignments.find(a => a.lesson_id === lesson.id);
                      if (!asg) return null;
                      const sub = submissions.find(s => s.student_id === activeStudent.id && s.assignment_id === asg.id);

                      let statusLabel = "Chưa nộp";
                      let badgeColor = "bg-gray-100 text-gray-400";
                      if (sub) {
                        if (sub.status === 'graded') {
                          statusLabel = "Đã chấm";
                          badgeColor = "bg-green-100 text-green-700";
                        } else if (sub.status === 'submitted') {
                          statusLabel = "Đã nộp";
                          badgeColor = "bg-amber-100 text-amber-700";
                        } else {
                          statusLabel = "Nháp";
                          badgeColor = "bg-blue-100 text-blue-700";
                        }
                      }

                      return (
                        <div key={lesson.id} className="flex justify-between items-center bg-gray-50/50 p-2.5 rounded-lg border border-gray-100 text-[10px]">
                          <span className="font-bold text-[#15333B] truncate pr-4">{lesson.title}</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold shrink-0 ${badgeColor}`}>
                            {statusLabel}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
      )}

      {viewMode === 'overview' && (
        <div className="flex-1 overflow-y-auto custom-scrollbar pb-4 pr-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DemographicsChartCard title="Giới tính (Gender)">
              <DemographicsDonutChart data={stats.genders} />
            </DemographicsChartCard>
            
            <DemographicsChartCard title="Độ tuổi (Age Group)">
              <VerticalProgressBarList data={stats.ageGroups} />
            </DemographicsChartCard>

            <DemographicsChartCard title="Khu vực sinh sống (Living Region)">
              <HorizontalProgressBarList data={stats.regions} />
            </DemographicsChartCard>

            <DemographicsChartCard title="Vai trò hiện tại (Current Role)">
              <HorizontalProgressBarList data={stats.roles} />
            </DemographicsChartCard>

            <DemographicsChartCard title="Lĩnh vực hoạt động (Work Field)">
              <VerticalProgressBarList data={stats.fields} />
            </DemographicsChartCard>

            <DemographicsChartCard title="Nguồn giới thiệu (Referral Source)">
              <HorizontalProgressBarList data={stats.referrals} />
            </DemographicsChartCard>
          </div>
        </div>
      )}

      {viewMode === 'onboarding' && (
        <div className="flex-1 overflow-y-auto custom-scrollbar pb-4 pr-1 space-y-6 animate-fade-in">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1">Tổng số học viên</span>
              <span className="text-2xl font-black text-[#15333B]">{students.length}</span>
            </div>
            <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1">Hoàn thành toàn bộ Onboarding (7/7)</span>
              <span className="text-2xl font-black text-green-600">
                {students.filter(s => getOnboardingCompletedCount(s) === 7).length} ({students.length > 0 ? Math.round((students.filter(s => getOnboardingCompletedCount(s) === 7).length / students.length) * 100) : 0}%)
              </span>
            </div>
            <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1">Đang làm dở dang</span>
              <span className="text-2xl font-black text-amber-500">
                {students.filter(s => {
                  const done = getOnboardingCompletedCount(s);
                  return done > 0 && done < 7;
                }).length}
              </span>
            </div>
          </div>

          {/* Dashboard Table */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-150 text-left">
                <thead className="bg-gray-50/75">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-extrabold text-[#15333B] uppercase tracking-wider">Ngày</th>
                    <th className="px-6 py-4 text-[10px] font-extrabold text-[#15333B] uppercase tracking-wider">Chủ đề bài học</th>
                    <th className="px-6 py-4 text-[10px] font-extrabold text-[#15333B] uppercase tracking-wider w-48">Hoàn thành Ngày</th>
                    <th className="px-6 py-4 text-[10px] font-extrabold text-[#15333B] uppercase tracking-wider">Điểm Drop-off Lớn Nhất</th>
                    <th className="px-6 py-4 text-[10px] font-extrabold text-[#15333B] uppercase tracking-wider text-right w-64">Tiến độ từng Task</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {onboardingDays.map(day => {
                    const tasks = getTasksForDay(day);
                    const reqTasks = tasks.filter(t => !t.label.toLowerCase().includes('optional') && !t.isOptional);
                    
                    // Calculate day stats
                    const dayCompletions = students.filter(s => {
                      return reqTasks.length > 0 ? reqTasks.every(t => !!s.onboarding_tasks?.[t.key]) : true;
                    }).length;
                    const dayPercent = students.length > 0 ? Math.round((dayCompletions / students.length) * 100) : 0;

                    // Analyze drop-offs
                    let maxDrop = 0;
                    let maxDropTask: any = null;
                    let previousCompletedCount = students.length;

                    reqTasks.forEach((task) => {
                      const currentCompletedCount = students.filter(s => !!s.onboarding_tasks?.[task.key]).length;
                      const drop = previousCompletedCount - currentCompletedCount;
                      if (drop > maxDrop) {
                        maxDrop = drop;
                        maxDropTask = task;
                      }
                      previousCompletedCount = currentCompletedCount;
                    });

                    const cleanDropTaskName = maxDropTask
                      ? maxDropTask.label
                          .replace(/\*\*Task \d+:\*\*/g, '')
                          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
                          .split('\n')[0]
                          .trim()
                      : '';

                    return (
                      <tr key={`stats-day-${day.day}`} className="hover:bg-teal-50/10 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-black text-[#15333B]">
                          Ngày {day.day}
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-gray-750 max-w-xs truncate" title={day.title}>
                          {day.title.split(': ')[1] || day.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px] font-black text-gray-700">
                              <span>{dayPercent}%</span>
                              <span className="text-[#214C54]">{dayCompletions}/{students.length} HV</span>
                            </div>
                            <div className="w-full bg-gray-150 h-2 rounded-full overflow-hidden">
                              <div 
                                className="bg-[#214C54] h-full rounded-full transition-all duration-500 ease-out" 
                                style={{ width: `${dayPercent}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs">
                          {maxDrop > 0 && maxDropTask ? (
                            <div className="space-y-0.5">
                              <span className="inline-flex items-center gap-1 text-[10px] font-black text-red-650 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded uppercase tracking-wider animate-pulse">
                                ⚠️ Drop {maxDrop} HV
                              </span>
                              <span className="block text-[11px] font-bold text-gray-600 truncate max-w-[200px]" title={`Task ${maxDropTask.idx}: ${cleanDropTaskName}`}>
                                Task {maxDropTask.idx}: {cleanDropTaskName}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[10px] font-extrabold text-emerald-650 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded uppercase tracking-wider">
                              ✅ Ổn định (0 drop)
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {tasks.length === 0 ? (
                              <span className="text-[10px] text-gray-400 italic">Không có task</span>
                            ) : (
                              tasks.map((task) => {
                                const checkedCount = students.filter(s => !!s.onboarding_tasks?.[task.key]).length;
                                const taskPercent = students.length > 0 ? Math.round((checkedCount / students.length) * 100) : 0;
                                const cleanName = task.label
                                  .replace(/\*\*Task \d+:\*\*/g, '')
                                  .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
                                  .split('\n')[0]
                                  .trim();

                                let colorClass = 'bg-red-500 hover:bg-red-600';
                                if (task.isOptional) {
                                  colorClass = 'bg-gray-400 hover:bg-gray-500';
                                } else if (taskPercent >= 80) {
                                  colorClass = 'bg-emerald-500 hover:bg-emerald-600';
                                } else if (taskPercent >= 45) {
                                  colorClass = 'bg-amber-500 hover:bg-amber-600';
                                }

                                return (
                                  <div
                                    key={task.key}
                                    className={`group relative w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black text-white ${colorClass} shadow-sm hover:scale-110 transition-all cursor-help shrink-0`}
                                  >
                                    {task.idx}
                                    <div className="absolute bottom-full right-0 mb-2 hidden group-hover:flex flex-col items-start bg-[#15333B] text-white text-[10px] p-3 rounded-xl shadow-xl z-20 w-64 text-left pointer-events-none whitespace-normal leading-normal">
                                      <span className="font-extrabold text-teal-400 block mb-1">
                                        Nhiệm vụ {task.idx} {task.isOptional ? '(Tùy chọn)' : '(Bắt buộc)'}
                                      </span>
                                      <p className="font-semibold text-gray-200 text-[10px] mb-2 line-clamp-3">
                                        {cleanName}
                                      </p>
                                      <div className="w-full flex justify-between items-center border-t border-white/10 pt-1.5 mt-0.5">
                                        <span className="font-black text-white">
                                          Đã tích: {checkedCount}/{students.length} HV
                                        </span>
                                        <span className="font-black text-emerald-400">
                                          {taskPercent}%
                                        </span>
                                      </div>
                                      <div className="absolute right-2 top-full w-2 h-2 bg-[#15333B] rotate-45 -mt-1"></div>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Email Modal */}
      {isBulkEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col border border-gray-100 overflow-hidden animate-scale-up max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-teal-850">
                <Mail className="w-5 h-5" />
                <h4 className="text-sm font-black text-[#15333B] uppercase tracking-wider">Gửi Email Hàng Loạt</h4>
              </div>
              <button 
                onClick={() => { setIsBulkEmailModalOpen(false); setBulkSubject(''); setBulkBody(''); }}
                className="w-8 h-8 rounded-full bg-[#15333B]/5 hover:bg-[#15333B]/10 flex items-center justify-center text-[#15333B] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Side-by-Side Content */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
              {/* Left Column: Form Editor */}
              <form onSubmit={handleSendBulkEmail} className="flex-1 p-6 space-y-4 overflow-y-auto border-r border-gray-100">
                {/* Recipient Group Selector */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#15333B] block">Gửi tới nhóm học viên:</label>
                  <div className="flex flex-wrap gap-3">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                      <input 
                        type="radio" 
                        name="recipientGroup" 
                        value="all" 
                        checked={bulkRecipientGroup === 'all'} 
                        onChange={() => updateEmailTemplate('all')}
                        className="text-[#214C54] focus:ring-[#214C54]"
                      />
                      <span>Tất cả ({students.length} người)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                      <input 
                        type="radio" 
                        name="recipientGroup" 
                        value="risk" 
                        checked={bulkRecipientGroup === 'risk'} 
                        onChange={() => updateEmailTemplate('risk')}
                        className="text-[#214C54] focus:ring-[#214C54]"
                      />
                      <span className="text-red-700">Cần hỗ trợ ({students.filter(s => getStudentStatus(s) === 'risk').length} người)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                      <input 
                        type="radio" 
                        name="recipientGroup" 
                        value="outstanding" 
                        checked={bulkRecipientGroup === 'outstanding'} 
                        onChange={() => updateEmailTemplate('outstanding')}
                        className="text-[#214C54] focus:ring-[#214C54]"
                      />
                      <span className="text-emerald-700">Tuyên dương ({students.filter(s => getStudentStatus(s) === 'outstanding').length} người)</span>
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
                    rows={8}
                    placeholder="Nhập nội dung email gửi cho học viên..."
                    value={bulkBody}
                    onChange={(e) => setBulkBody(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs leading-relaxed focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54]/20 resize-none transition-all font-medium text-gray-700"
                  />
                </div>

                {/* Left Column Actions */}
                <div className="pt-4 border-t border-gray-100 flex justify-between gap-3">
                  <button 
                    type="button"
                    onClick={handleCopyHtml}
                    className="btn border border-teal-600 text-teal-850 hover:bg-teal-50/50 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5"
                  >
                    {copySuccess ? 'Đã sao chép! ✓' : 'Sao chép định dạng 📋'}
                  </button>
                  
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={() => { setIsBulkEmailModalOpen(false); setBulkSubject(''); setBulkBody(''); }}
                      className="btn border border-gray-300 text-gray-700 text-xs font-bold px-4 py-2 hover:bg-gray-50 rounded-xl"
                    >
                      Hủy
                    </button>
                    <button 
                      type="submit"
                      className="btn btn-primary text-xs font-extrabold px-4 py-2 flex items-center gap-1.5 rounded-xl shadow-md"
                    >
                      Gửi qua Gmail 🚀
                    </button>
                  </div>
                </div>
              </form>

              {/* Right Column: Premium Styled Preview */}
              <div className="hidden md:flex flex-1 flex-col bg-gray-50 p-6 overflow-y-auto">
                <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Xem trước Email (Định dạng Brand Guidelines)</div>
                <div className="bg-[#FDF5DA] p-6 rounded-2xl border border-[#ffd94c] flex-1 flex flex-col justify-start">
                  <div className="bg-[#15333B] p-4 rounded-t-xl text-center border-b-4 border-[#ffd94c]">
                    <span className="text-[#ffd94c] font-black text-xs tracking-wider block">
                      🦜 VẸT LẮM MỒM - THE1IGHT 🦜
                    </span>
                  </div>
                  <div className="bg-white p-5 rounded-b-xl flex-1 shadow-sm">
                    <h5 className="text-[#214C54] font-black text-xs border-b border-gray-150 pb-2 mb-3">
                      {bulkSubject || '(Không có tiêu đề)'}
                    </h5>
                    <div className="text-[11px] text-gray-700 font-medium leading-relaxed space-y-3 whitespace-pre-line">
                      {bulkBody || '(Không có nội dung)'}
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                      <span className="inline-block bg-[#214C54] text-white text-[10px] font-black px-4 py-2 rounded-lg cursor-pointer">
                        VÀO HỆ THỐNG LIGHTMS 🚀
                      </span>
                    </div>
                  </div>
                  <div className="text-center mt-3 text-[9px] text-[#3E5E63] font-bold">
                    Bản tin được gửi từ hạm đội vận hành LightMS.
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
