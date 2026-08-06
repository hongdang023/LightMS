import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCourse } from '../context/CourseContext';
import { useGamification } from '../context/GamificationContext';
import { useCommunity } from '../context/CommunityContext';
import { getDemographics } from '../components/admin/StudentDemographics';

export const useStudentManagementData = () => {
  const { users } = useAuth();
  const { lessons } = useCourse();
  const { nauticalTransactions } = useGamification();
  const { onboardingDays, addNotification } = useCommunity();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'risk' | 'outstanding' | 'guest'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'overview' | 'onboarding'>('list');
  const [expandedDays, setExpandedDays] = useState<{[key: number]: boolean}>({});

  // Bulk email states
  const [isBulkEmailModalOpen, setIsBulkEmailModalOpen] = useState(false);
  const [bulkRecipientGroup, setBulkRecipientGroup] = useState<'all' | 'risk' | 'outstanding'>('all');
  const [bulkSubject, setBulkSubject] = useState('');
  const [bulkBody, setBulkBody] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const students = users.filter(u => u.role === 'student');
  const activeStudent = users.find(s => s.id === selectedStudentId);

  const liveClassAssignments = lessons.filter(l => !!l.assignment_description);
  const totalLiveClassCount = liveClassAssignments.length || 3;

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

  const getOnboardingCompletedCount = (student: any) => {
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
    return (nauticalTransactions || []).filter(
      t => t.student_id === studentId && 
      t.action_type === 'lesson_complete' &&
      liveClassAssignments.some(la => la.id === t.reference_id)
    ).length;
  };

  const getStudentStatus = (student: any) => {
    const onboardingDone = getOnboardingCompletedCount(student);
    const visits = student.visits || 1;
    const now = new Date().getTime();
    
    const studentStart = student.created_at ? new Date(student.created_at).getTime() : now;
    const daysActive = Math.max(1, Math.floor((now - studentStart) / (24 * 60 * 60 * 1000)));

    const onboardingDeadline = studentStart + 7 * 24 * 60 * 60 * 1000;
    const onboardingOverdue = now > onboardingDeadline && onboardingDone < 7;

    const startedLiveClassAssignments = liveClassAssignments.filter(l => {
      if (!l.start_date) return false;
      return now >= new Date(l.start_date).getTime();
    });

    const dueLiveClassAssignments = liveClassAssignments.filter(l => {
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

  const filteredStudents = (() => {
    return students.filter(student => {
      const status = getStudentStatus(student);
      const matchesTab = activeTab === 'all' || status === activeTab;
      const matchesSearch = student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            student.gmail.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  })();

  const triggerCommendation = (name: string) => {
    setToastMessage(`Đã gửi thư khen ngợi và tuyên dương học viên **${name}** xuất sắc! 🎉`);
    addNotification('Tuyên dương học viên', `Học viên ${name} được vinh danh vì thành tích xuất sắc!`, 'system');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const getMailtoLink = (student: any) => {
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
      <a href="${window.location.origin}" style="display: inline-block; background-color: #214C54; color: #ffffff; padding: 8px 18px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 11px; box-shadow: 0 2px 4px rgba(33,76,84,0.2);">
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
          percentage: students.length > 0 ? Math.round((count / students.length) * 100) : 0
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
      percentage: students.length > 0 ? Math.round((count / students.length) * 100) : 0,
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

  return {
    students,
    activeStudent,
    totalLiveClassCount,
    onboardingDays,
    lessons,
    nauticalTransactions,
    selectedStudentId,
    setSelectedStudentId,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    toastMessage,
    setToastMessage,
    viewMode,
    setViewMode,
    expandedDays,
    setExpandedDays,
    isBulkEmailModalOpen,
    setIsBulkEmailModalOpen,
    bulkRecipientGroup,
    bulkSubject,
    setBulkSubject,
    bulkBody,
    setBulkBody,
    copySuccess,
    filteredStudents,
    stats,
    triggerCommendation,
    getMailtoLink,
    updateEmailTemplate,
    handleCopyHtml,
    handleSendBulkEmail,
    openBulkEmailModal,
    getTasksForDay,
    getStudentCurrentStopTask,
    getOnboardingCompletedCount,
    getLiveClassCompletedCount,
    getStudentStatus
  };
};
