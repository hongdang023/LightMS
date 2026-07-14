import React, { useState, useEffect } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { PageHeader } from '../../components/PageHeader';
import { ChevronLeft, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { 
  BookOpen, Wrench, Bot, Compass, Palette, FlaskConical, Anchor, 
  ClipboardList, Target, CheckCircle2, Lock, Mail
} from 'lucide-react';
import { EditableText } from '../../components/EditableText';

import type { OnboardingDay } from '../../context/DatabaseContext';

// Aesthetic banner designs using CSS grids, SVG patterns, and themed color combinations

const DAY_VISUAL_STYLES: {
  [key: number]: {
    icon: React.ReactNode;
    gradient: string;
    summary: string;
    bgPattern: React.ReactNode;
  };
} = {
  1: {
    icon: <BookOpen className="w-6 h-6" />,
    gradient: "from-[#EAB308] to-[#CA8A04]", // Golden Sea Parchment
    summary: "Kết nối cộng đồng & cam kết hành động",
    bgPattern: (
      <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
        <path d="M-10 80 Q20 50 50 80 T110 80 T170 80 T230 80 T295 80" fill="none" stroke="white" strokeWidth="2" />
        <path d="M-10 100 Q20 70 50 100 T110 100 T170 100 T230 100 T295 100" fill="none" stroke="white" strokeWidth="2" />
        <circle cx="240" cy="30" r="15" fill="none" stroke="white" strokeWidth="2" />
        <line x1="240" y1="10" x2="240" y2="50" stroke="white" strokeWidth="2" />
        <line x1="220" y1="30" x2="260" y2="30" stroke="white" strokeWidth="2" />
      </svg>
    )
  },
  2: {
    icon: <Wrench className="w-6 h-6" />,
    gradient: "from-[#0284C7] to-[#0369A1]", // Blueprint Blue
    summary: "Xác định sản phẩm bạn muốn xây dựng",
    bgPattern: (
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <circle cx="230" cy="40" r="25" fill="none" stroke="white" strokeWidth="1.5" />
      </svg>
    )
  },
  3: {
    icon: <Bot className="w-6 h-6" />,
    gradient: "from-[#059669] to-[#047857]", // Mystic Emerald Dragon
    summary: "Làm quen với IDE, MCP và CLI",
    bgPattern: (
      <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 20 C60 5 90 40 130 20 C170 0 200 35 240 15" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5 5" />
        <path d="M10 50 Q70 20 120 70 T240 40" fill="none" stroke="white" strokeWidth="1.5" />
        <polygon points="210,15 220,5 230,15 220,25" fill="white" />
      </svg>
    )
  },
  4: {
    icon: <Compass className="w-6 h-6" />,
    gradient: "from-[#845EF7] to-[#6741D9]", // Telescope Deep Purple
    summary: "Hiểu về Agent Skills và Agent Rules",
    bgPattern: (
      <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
        <circle cx="150" cy="50" r="35" fill="none" stroke="white" strokeWidth="1.5" />
        <circle cx="150" cy="50" r="5" fill="white" />
        <line x1="150" y1="10" x2="150" y2="90" stroke="white" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="110" y1="50" x2="190" y2="50" stroke="white" strokeWidth="1" strokeDasharray="3 3" />
        <polygon points="150,20 155,45 150,50" fill="white" />
        <polygon points="150,80 145,55 150,50" fill="#FFD94C" />
      </svg>
    )
  },
  5: {
    icon: <Palette className="w-6 h-6" />,
    gradient: "from-[#D946EF] to-[#C026D3]", // Oil Paint Palette Pink/Fuchsia
    summary: "Lưu trữ và quản lý phiên bản với GitHub",
    bgPattern: (
      <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="30" r="20" fill="none" stroke="white" strokeWidth="1.5" />
        <circle cx="120" cy="60" r="30" fill="none" stroke="white" strokeWidth="1.5" />
        <circle cx="210" cy="40" r="15" fill="none" stroke="white" strokeWidth="1.5" />
        <path d="M10 80 Q 140 20 280 80" fill="none" stroke="white" strokeWidth="1" />
      </svg>
    )
  },
  6: {
    icon: <FlaskConical className="w-6 h-6" />,
    gradient: "from-[#F97316] to-[#EA580C]", // Bright Amber Sunset
    summary: "Tìm hiểu cấu trúc Frontend và Backend",
    bgPattern: (
      <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="20" width="40" height="50" rx="3" fill="none" stroke="white" strokeWidth="2" />
        <line x1="40" y1="35" x2="60" y2="35" stroke="white" strokeWidth="2" />
        <line x1="40" y1="45" x2="60" y2="45" stroke="white" strokeWidth="2" />
        <line x1="40" y1="55" x2="55" y2="55" stroke="white" strokeWidth="2" />
        <circle cx="220" cy="40" r="20" fill="none" stroke="white" strokeWidth="1.5" />
        <line x1="220" y1="20" x2="220" y2="60" stroke="white" strokeWidth="1.5" />
      </svg>
    )
  },
  7: {
    icon: <Anchor className="w-6 h-6" />,
    gradient: "from-[#0D9488] to-[#0F766E]", // Sea Teal Ocean
    summary: "Đưa sản phẩm lên Internet với Domain & DNS",
    bgPattern: (
      <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
        <path d="M150 15 L150 65 M135 30 L165 30" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <circle cx="150" cy="15" r="5" fill="none" stroke="white" strokeWidth="3" />
        <path d="M125 50 C125 70 175 70 175 50" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <path d="M120 50 L115 45 M180 50 L185 45" stroke="white" strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  },
  8: {
    icon: <ClipboardList className="w-6 h-6" />,
    gradient: "from-[#EC4899] to-[#DB2777]", // Rose Pink
    summary: "Biết cách tư duy theo User Journey & vẽ User Flow",
    bgPattern: (
      <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="20" width="30" height="20" rx="3" fill="none" stroke="white" strokeWidth="2" />
        <line x1="50" y1="30" x2="100" y2="30" stroke="white" strokeWidth="2" strokeDasharray="3 3" />
        <rect x="100" y="20" width="30" height="20" rx="3" fill="none" stroke="white" strokeWidth="2" />
        <line x1="130" y1="30" x2="180" y2="30" stroke="white" strokeWidth="2" strokeDasharray="3 3" />
        <rect x="180" y="20" width="30" height="20" rx="3" fill="none" stroke="white" strokeWidth="2" />
      </svg>
    )
  }
};

interface OnboardingViewProps {
  isEditMode?: boolean;
  onPageChange?: (page: string) => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ isEditMode = false, onPageChange }) => {
  const { 
    activeUser, 
    addNotification, 
    onboardingDays, 
    onboardingUnlockSchedules,
    updateOnboardingDay,
    updateOnboardingUnlockSchedule,
    users: profiles
  } = useDatabase();

  // Email template config modal states
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailModalDay, setEmailModalDay] = useState<OnboardingDay | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const getDefaultEmailSubject = (dayNum: number, title: string) => {
    return `[The1ight] [Onboarding Week] Thử thách Ngày ${dayNum}: ${title}`;
  };

  const getDefaultEmailBody = (dayData: OnboardingDay) => {
    return `Kẹt kẹt... Alo alo! 🦜

Chào mừng bạn tới ngày học tiếp theo của Onboarding Week!

Hôm nay chúng ta sẽ bắt đầu Thử thách Ngày ${dayData.day}: ${dayData.title}

🎯 MỤC TIÊU:
${dayData.objective}

📝 NHIỆM VỤ:
${dayData.checklist}

✨ ĐIỀU RÚT RA (TAKEAWAY):
${dayData.takeaway}

Hãy truy cập vào hệ thống LightMS để theo dõi chi tiết và cập nhật bài tập nhé!

Chúc các thủy thủ thuận buồm xuôi gió! ⛵⚓`;
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

  const handleOpenEmailModal = (dayData: OnboardingDay) => {
    setEmailModalDay(dayData);
    setEmailSubject(dayData.email_subject || getDefaultEmailSubject(dayData.day, dayData.title));
    setEmailBody(dayData.email_body || getDefaultEmailBody(dayData));
    setIsEmailModalOpen(true);
  };

  const handleSaveEmailTemplate = async () => {
    if (!emailModalDay) return;
    await updateOnboardingDay(emailModalDay.day, {
      email_subject: emailSubject,
      email_body: emailBody
    });
    setToastMessage(`Đã lưu mẫu email Ngày ${emailModalDay.day} thành công!`);
    setTimeout(() => setToastMessage(null), 3000);
    setIsEmailModalOpen(false);
  };

  const getBulkEmails = () => {
    if (!profiles) return '';
    const students = profiles.filter((p: any) => p.role === 'student');
    return students.map((s: any) => s.gmail).filter(Boolean).join(',');
  };

  const handleSendBulkEmail = () => {
    const emails = getBulkEmails();
    if (!emails) {
      alert('Không có học viên nào nhận email!');
      return;
    }
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&bcc=${emails}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(gmailUrl, '_blank');
    setToastMessage(`Đã mở Gmail gửi email Ngày ${emailModalDay?.day} thành công!`);
    setTimeout(() => setToastMessage(null), 3000);
    setIsEmailModalOpen(false);
  };

  const handleCopyEmailFormat = async () => {
    const html = getHtmlEmail(emailSubject, emailBody);
    try {
      const blobHtml = new Blob([html], { type: 'text/html' });
      const blobText = new Blob([emailBody], { type: 'text/plain' });
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

  const toLocalDatetimeString = (isoString: string) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  
  // Date Unlocking Setup
  const courseStartDate = (() => {
    const saved = localStorage.getItem('lms_onboarding_start_date');
    if (saved) return saved;
    const d = new Date();
    d.setDate(d.getDate() - 2);
    return d.toISOString().split('T')[0];
  })();

  const bypassLocks = (() => {
    const saved = localStorage.getItem('lms_bypass_locks');
    return saved === 'true';
  })();

  // Batch Unlock Setup States
  const [bulkStartDate, setBulkStartDate] = useState<string>(() => {
    const saved = localStorage.getItem('lms_onboarding_start_date');
    if (saved) return saved;
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [bulkUnlockTime, setBulkUnlockTime] = useState<string>('09:00');

  const handleApplyBulkUnlockSchedule = async () => {
    const dateParts = bulkStartDate.split('-');
    const timeParts = bulkUnlockTime.split(':');
    if (dateParts.length !== 3 || timeParts.length !== 2) {
      alert('Vui lòng điền đúng định dạng ngày và giờ.');
      return;
    }

    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const day = parseInt(dateParts[2]);
    const hour = parseInt(timeParts[0]);
    const minute = parseInt(timeParts[1]);

    const baseDate = new Date(year, month, day, hour, minute, 0, 0);

    if (isNaN(baseDate.getTime())) {
      alert('Ngày giờ không hợp lệ.');
      return;
    }

    // Update schedules for 7 consecutive days
    for (let d = 1; d <= 7; d++) {
      const scheduledDate = new Date(baseDate.getTime());
      scheduledDate.setDate(baseDate.getDate() + (d - 1));
      await updateOnboardingUnlockSchedule(d, scheduledDate.toISOString());
    }

    localStorage.setItem('lms_onboarding_start_date', bulkStartDate);
    alert('Đã cập nhật lịch mở khóa tự động cho cả 7 ngày Onboarding thành công!');
  };

  // Track selected Day view and current view mode
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');

  const [lockedAlert, setLockedAlert] = useState<{ show: boolean; msg: string }>({ show: false, msg: '' });

  // Load checklist checked state from localStorage
  const [checkedTasks, setCheckedTasks] = useState<{ [key: string]: boolean }>(() => {
    const saved = localStorage.getItem('lms_onboarding_tasks_v2');
    return saved ? JSON.parse(saved) : {};
  });

  // Save config changes
  useEffect(() => {
    localStorage.setItem('lms_onboarding_start_date', courseStartDate);
  }, [courseStartDate]);

  useEffect(() => {
    localStorage.setItem('lms_bypass_locks', String(bypassLocks));
  }, [bypassLocks]);



  // Helper to extract clean task items from day checklist markdown
  const getTasksForDay = (dayData: OnboardingDay) => {
    const lines = dayData.checklist.split('\n');
    const tasks: { idx: number; label: string; key: string; isOptional: boolean; optionalNote: string }[] = [];
    let taskIdx = 0;
    lines.forEach(line => {
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

  const isDayCompleted = (day: number) => {
    const dayData = onboardingDays.find(d => d.day === day);
    if (!dayData) return false;
    const tasks = getTasksForDay(dayData);
    if (tasks.length === 0) return true;
    // Only check required tasks (non-optional ones)
    const requiredTasks = tasks.filter(t => !t.label.toLowerCase().includes('optional'));
    if (requiredTasks.length === 0) return true;
    return requiredTasks.every(t => checkedTasks[t.key]);
  };

  // Helper to determine if a day is unlocked based on date AND previous day completion
  const getDayLockStatus = (_day: number) => {
    return { isUnlocked: true, daysLeft: 0, unlockDateStr: "", reason: "" };
  };

    const handleDayCardClick = (day: number) => {
    const status = getDayLockStatus(day);
    if (status.isUnlocked) {
      setSelectedDay(day);
      setViewMode('detail');
      setLockedAlert({ show: false, msg: '' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setLockedAlert({
        show: true,
        msg: `Bình tĩnh nào đồng chí! ${status.reason}`
      });
      // Clear alert after 5s
      setTimeout(() => setLockedAlert({ show: false, msg: '' }), 5000);
    }
  };

  const handleToggleTask = (day: number, taskIdx: number, label: string) => {
    const key = `day-${day}-task-${taskIdx}`;
    
    if (day === 1 && label.includes('giới thiệu bản thân') && !activeUser.is_profile_completed) {
      addNotification(
        'Cần cập nhật hồ sơ cá nhân', 
        'Hãy truy cập tab Hồ Sơ Cá Nhân (Avatar) để cập nhật thông tin giới thiệu bản thân trước!', 
        'system'
      );
      return;
    }

    const nextChecked = !checkedTasks[key];
    const newCheckedState = {
      ...checkedTasks,
      [key]: nextChecked
    };

    setCheckedTasks(newCheckedState);
    localStorage.setItem('lms_onboarding_tasks_v2', JSON.stringify(newCheckedState));

    if (nextChecked) {
      addNotification('Nhiệm vụ hoàn thành!', `Bạn đã check xong một nhiệm vụ của Ngày ${day}!`, 'system');
    }
  };

  const parseInlineMarkdown = (text: string): React.ReactNode => {
    let cleanText = text
      .replace(/<span[^>]*>/gi, '')
      .replace(/<\/span>/gi, '')
      .replace(/<font[^>]*>/gi, '')
      .replace(/<\/font>/gi, '')
      .replace(/<br[^>]*>/gi, '')
      .replace(/<div[^>]*>/gi, '')
      .replace(/<\/div>/gi, '');

    // Regex matches: links (markdown & HTML), bold, italics, and underline HTML tags
    const regex = /\[(.*?)\]\((.*?)\)|<a\s+(?:[^>]*?\s+)?href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>|\*\*(.*?)\*\*|\*(.*?)\*|<u>(.*?)<\/u>|<em[^>]*>(.*?)<\/em>/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(cleanText)) !== null) {
      if (match.index > lastIndex) {
        parts.push(cleanText.substring(lastIndex, match.index));
      }
      if (match[1] && match[2]) {
        // Markdown Link
        parts.push(
          <a key={`link-${match.index}`} href={match[2]} target="_blank" rel="noreferrer" className="text-sky-600 hover:text-sky-700 hover:underline font-bold transition-colors">
            {match[1]} <span className="text-[10px] inline-block ml-0.5">🔗</span>
          </a>
        );
      } else if (match[3] && match[4]) {
        // HTML Link
        parts.push(
          <a key={`link-html-${match.index}`} href={match[3]} target="_blank" rel="noreferrer" className="text-sky-600 hover:text-sky-700 hover:underline font-bold transition-colors">
            {match[4]} <span className="text-[10px] inline-block ml-0.5">🔗</span>
          </a>
        );
      } else if (match[5]) {
        // Bold
        const isTaskHeading = match[5].toLowerCase().startsWith('task ');
        parts.push(
          <strong 
            key={`bold-${match.index}`} 
            className={isTaskHeading ? "block text-base font-semibold text-[#214C54] mb-1" : "font-semibold text-[#214C54]"}
          >
            {match[5]}
          </strong>
        );
      } else if (match[6]) {
        // Italic (Markdown style)
        parts.push(
          <em key={`italic-md-${match.index}`} className="italic">
            {match[6]}
          </em>
        );
      } else if (match[7]) {
        // Underline HTML tag
        parts.push(
          <u key={`underline-${match.index}`} className="underline">
            {match[7]}
          </u>
        );
      } else if (match[8]) {
        // Italic (em HTML tag)
        parts.push(
          <em key={`italic-html-${match.index}`} className="italic">
            {match[8]}
          </em>
        );
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    return parts.length > 0 ? <>{parts}</> : text;
  };

  const renderRichText = (text: string): React.ReactNode => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const isQuote = line.startsWith('> ');
      if (isQuote) {
        line = line.substring(2);
      }
      
      const parsedLine = parseInlineMarkdown(line);

      if (isQuote) {
        return (
          <blockquote key={idx} className="border-l-4 border-[#EAB308] pl-4 py-3 my-3 bg-[#FDF5DA] rounded-r-lg text-[#15333B] italic shadow-sm text-base">
            {parsedLine}
          </blockquote>
        );
      }

      return (
        <div key={idx} className="min-h-[1.2em] my-1 text-base leading-relaxed text-[#3E5E63]">
          {parsedLine}
        </div>
      );
    });
  };

  const activeDayData = onboardingDays.find(d => d.day === selectedDay) || onboardingDays[0];

  // Local state for visual task editor
  const [editingTasks, setEditingTasks] = useState<{ id: string; label: string; isOptional: boolean }[]>([]);
  const [focusedTaskId, setFocusedTaskId] = useState<string | null>(null);

  // Synchronize local task list when activeDayData or isEditMode changes
  useEffect(() => {
    if (isEditMode && activeDayData) {
      const lines = activeDayData.checklist.split('\n');
      const parsed: { id: string; label: string; isOptional: boolean }[] = [];
      lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('- [ ]')) {
          const rawLabel = trimmed.replace('- [ ]', '').trim();
          const isOptional = rawLabel.toLowerCase().includes('(optional)');
          parsed.push({
            id: `task-${index}-${activeDayData.day}-${Date.now()}-${Math.random()}`,
            label: rawLabel,
            isOptional: isOptional
          });
        } else if (parsed.length > 0 && line.length > 0) {
          parsed[parsed.length - 1].label += '\n' + line;
        }
      });
      setEditingTasks(parsed);
    }
  }, [activeDayData.day, isEditMode]);

  const saveTasks = (newTasks: { id: string; label: string; isOptional: boolean }[]) => {
    setEditingTasks(newTasks);
    const serialized = newTasks.map(t => {
      let text = t.label;
      const hasOptional = text.toLowerCase().includes('(optional)');
      if (t.isOptional && !hasOptional) {
        text = text + ' (Optional)';
      } else if (!t.isOptional && hasOptional) {
        text = text.replace(/\s*\(optional\)/i, '');
      }
      return `- [ ] ${text}`;
    }).join('\n');
    updateOnboardingDay(activeDayData.day, { checklist: serialized });
  };

  const handleTaskLabelChange = (id: string, newLabel: string) => {
    const updated = editingTasks.map(t => t.id === id ? { ...t, label: newLabel } : t);
    setEditingTasks(updated);
    
    // Auto-save immediately to database/context when typing for instant layout updates
    const serialized = updated.map(t => {
      let text = t.label;
      const hasOptional = text.toLowerCase().includes('(optional)');
      if (t.isOptional && !hasOptional) {
        text = text + ' (Optional)';
      } else if (!t.isOptional && hasOptional) {
        text = text.replace(/\s*\(optional\)/i, '');
      }
      return `- [ ] ${text}`;
    }).join('\n');
    updateOnboardingDay(activeDayData.day, { checklist: serialized });
  };

  const handleTaskLabelBlur = (id: string, finalLabel: string) => {
    const updated = editingTasks.map(t => t.id === id ? { ...t, label: finalLabel } : t);
    saveTasks(updated);
  };

  const handleToggleOptional = (id: string) => {
    const updated = editingTasks.map(t => {
      if (t.id === id) {
        const nextOptional = !t.isOptional;
        let text = t.label;
        const hasOptional = text.toLowerCase().includes('(optional)');
        if (nextOptional && !hasOptional) {
          text = text + ' (Optional)';
        } else if (!nextOptional && hasOptional) {
          text = text.replace(/\s*\(optional\)/i, '');
        }
        return { ...t, label: text, isOptional: nextOptional };
      }
      return t;
    });
    saveTasks(updated);
  };

  const handleAddTask = () => {
    const newTasks = [
      ...editingTasks,
      {
        id: `task-new-${Date.now()}-${Math.random()}`,
        label: `**Task ${editingTasks.length + 1}:** Tên nhiệm vụ mới`,
        isOptional: false
      }
    ];
    saveTasks(newTasks);
  };

  const handleDeleteTask = (id: string) => {
    const newTasks = editingTasks.filter(t => t.id !== id);
    saveTasks(newTasks);
  };

  const handleMoveTask = (index: number, direction: 'up' | 'down') => {
    const newTasks = [...editingTasks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newTasks.length) {
      const temp = newTasks[index];
      newTasks[index] = newTasks[targetIndex];
      newTasks[targetIndex] = temp;
      saveTasks(newTasks);
    }
  };

  const applyFormatting = (taskId: string, format: 'bold' | 'italic' | 'underline' | 'ordered-list' | 'bullet-list' | 'link' | 'clear') => {
    const editor = document.getElementById(`input-${taskId}`) as HTMLDivElement;
    if (!editor) return;

    editor.focus();

    if (format === 'bold') {
      document.execCommand('bold', false);
    } else if (format === 'italic') {
      document.execCommand('italic', false);
    } else if (format === 'underline') {
      document.execCommand('underline', false);
    } else if (format === 'ordered-list') {
      document.execCommand('insertOrderedList', false);
    } else if (format === 'bullet-list') {
      document.execCommand('insertUnorderedList', false);
    } else if (format === 'link') {
      const url = prompt('Nhập địa chỉ liên kết (URL):', 'https://');
      if (url) {
        document.execCommand('createLink', false, url);
      }
    } else if (format === 'clear') {
      document.execCommand('removeFormat', false);
    }

    // Trigger onInput manually to sync state and save
    const html = editor.innerHTML;
    let markdown = html
      .replace(/<span[^>]*>/gi, '')
      .replace(/<\/span>/gi, '')
      .replace(/<font[^>]*>/gi, '')
      .replace(/<\/font>/gi, '')
      .replace(/<b>(.*?)<\/b>/gi, '**$1**')
      .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<i>(.*?)<\/i>/gi, '*$1*')
      .replace(/<em>(.*?)<\/em>/gi, '*$1*')
      .replace(/<u>(.*?)<\/u>/gi, '<u>$1</u>')
      .replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
      .replace(/<ol>([\s\S]*?)<\/ol>/gi, (_, p1) => {
        let idx = 1;
        // Clean inner li tags and make sure we have correct line endings
        return '\n' + p1.replace(/<li>(.*?)<\/li>/gi, () => `${idx++}. $1\n`).trim() + '\n';
      })
      .replace(/<ul>([\s\S]*?)<\/ul>/gi, (_, p1) => {
        return '\n' + p1.replace(/<li>(.*?)<\/li>/gi, '- $1\n').trim() + '\n';
      })
      .replace(/<div><br><\/div>/gi, '\n')
      .replace(/<div>(.*?)<\/div>/gi, '\n$1')
      .replace(/<br>/gi, '\n')
      .replace(/&nbsp;/g, ' ')
      .trim();

    handleTaskLabelChange(taskId, markdown);
  };

  const dayTasks = getTasksForDay(activeDayData);
  const visual = DAY_VISUAL_STYLES[selectedDay] || DAY_VISUAL_STYLES[1];

  return (
    <div className="space-y-5 max-w-5xl mx-auto pb-10 animate-fade-in select-none">
      <PageHeader
        title="Onboarding Week"
        description="Hoàn thành các thử thách thiết lập môi trường, kỹ năng giao tiếp AI và tìm hiểu về PRD."
        helpTitle="Onboarding"
        helpSummary="Hướng dẫn làm quen hệ thống, lộ trình và phương pháp học trong tuần đầu tiên."
        helpPurpose="Giúp bạn khởi động đúng cách — thiết lập toàn bộ nền tảng, hiểu rõ luật chơi và sẵn sàng tâm lý để bước vào khoá học."
      />

      {/* Locked Alert speech box from mascot */}
      {lockedAlert.show && (
        <div className="bg-[#FFFBEB] border-2 border-amber-300 p-4 rounded-2xl flex items-start gap-4 animate-shake shadow-md">
          <span className="text-3xl">🦜</span>
          <div className="space-y-1">
            <span className="text-xs text-amber-700 font-black block uppercase tracking-wider">Bác Vẹt Cảnh Báo Thủy Triều:</span>
            <p className="text-sm text-amber-800 leading-relaxed font-semibold">
              "{lockedAlert.msg}"
            </p>
          </div>
        </div>
      )}

      {isEditMode && viewMode === 'grid' && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 shadow-sm mb-6 animate-fade-in select-text">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl text-amber-600">📅</span>
            <div>
              <span className="text-sm font-bold text-amber-800 block">Thiết lập Lịch mở khóa hàng loạt (Onboarding Week)</span>
              <span className="text-xs text-amber-600">Cấu hình nhanh ngày mở khóa cho cả 7 ngày học liên tiếp thay vì cài đặt từng ngày</span>
            </div>
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-amber-700 uppercase block">Ngày bắt đầu (Day 1)</label>
              <input
                type="date"
                className="border border-amber-300 rounded-xl px-4 py-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-bold"
                value={bulkStartDate}
                onChange={(e) => setBulkStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-amber-700 uppercase block">Giờ mở khóa hàng ngày</label>
              <input
                type="time"
                className="border border-amber-300 rounded-xl px-4 py-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-bold"
                value={bulkUnlockTime}
                onChange={(e) => setBulkUnlockTime(e.target.value)}
              />
            </div>
            <button
              onClick={handleApplyBulkUnlockSchedule}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer border-0"
            >
              Áp dụng cho 7 ngày Onboarding
            </button>
          </div>
        </div>
      )}

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {onboardingDays.map((dayData) => {
            const status = getDayLockStatus(dayData.day);
            const isUnlocked = status.isUnlocked;
            
            const tasks = getTasksForDay(dayData);
            const totalTasks = tasks.length;
            const completedTasks = tasks.filter(t => checkedTasks[t.key]).length;
            const isCompleted = totalTasks > 0 && completedTasks === totalTasks;
            
            const cardVisual = DAY_VISUAL_STYLES[dayData.day];

            return (
              <button
                key={dayData.day}
                onClick={() => handleDayCardClick(dayData.day)}
                className={`relative flex flex-col text-left rounded-3xl overflow-hidden transition-all duration-300 group
                  ${isUnlocked 
                    ? 'hover:-translate-y-1 hover:shadow-xl hover:shadow-[#214C54]/20 ring-1 ring-black/5 bg-white' 
                    : 'opacity-60 grayscale-[50%] cursor-not-allowed bg-gray-50'
                  }`}
              >
                {/* Header Area with Gradient */}
                <div className={`relative h-28 w-full bg-gradient-to-br ${cardVisual.gradient} p-5 flex items-start justify-between overflow-hidden shrink-0`}>
                  {cardVisual.bgPattern}
                  
                  <div className="relative z-10 bg-white/20 backdrop-blur-sm p-3 rounded-2xl text-white shadow-sm">
                    {cardVisual.icon}
                  </div>
                  
                  {/* Status Indicator */}
                  <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white shadow-sm border border-white/30">
                    {!isUnlocked ? (
                      <Lock className="w-4 h-4" />
                    ) : isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                    ) : (
                      <span className="text-sm font-black">{dayData.day}</span>
                    )}
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#214C54]/50 mb-1">
                    Ngày {dayData.day}
                  </h3>
                  <h4 className="text-lg font-bold text-[#15333B] leading-tight mb-2 line-clamp-2 flex-1 group-hover:text-sky-600 transition-colors">
                    {dayData.title.replace(/^Ngày \d+[:\-]?\s*/i, '').trim()}
                  </h4>
                  
                  <p className="text-sm text-[#3E5E63] line-clamp-2 mb-4 leading-relaxed h-10">
                    {cardVisual.summary}
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs font-semibold mb-2">
                      <span className={isCompleted ? "text-emerald-600" : "text-[#3E5E63]"}>
                        {isCompleted ? "Đã hoàn thành" : "Tiến độ"}
                      </span>
                      <span className="text-[#214C54]">{completedTasks}/{totalTasks}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-sky-500'}`}
                        style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="animate-fade-in max-w-4xl mx-auto space-y-5">
          <button 
            onClick={() => {
              setViewMode('grid');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            className="flex items-center gap-2 text-[#3E5E63] font-semibold mb-4 hover:text-sky-600 transition-colors px-4 py-2 bg-white border border-gray-200 rounded-xl hover:shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" /> Quay lại Bản Đồ Hải Trình
          </button>

          {isEditMode && (
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <span className="text-2xl text-amber-600">⏰</span>
                <div>
                  <span className="text-sm font-bold text-amber-800 block">Thời gian mở khóa tự động (Ngày {activeDayData.day})</span>
                  <span className="text-xs text-amber-600">Đến giờ hẹn hệ thống sẽ tự mở khóa và gửi email thông báo</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="datetime-local"
                  className="border border-amber-300 rounded-xl px-4 py-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-bold"
                  value={(() => {
                    const sched = onboardingUnlockSchedules.find(s => s.day === activeDayData.day);
                    return sched ? toLocalDatetimeString(sched.scheduled_at) : '';
                  })()}
                  onChange={(e) => {
                    if (e.target.value) {
                      updateOnboardingUnlockSchedule(activeDayData.day, new Date(e.target.value).toISOString());
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleOpenEmailModal(activeDayData)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer border-0"
                >
                  <Mail className="w-4 h-4" /> Mẫu Email Mở Khóa
                </button>
              </div>
            </div>
          )}
          
          <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${visual.gradient} shadow-lg shadow-[#214C54]/10`}>
            {visual.bgPattern}
            <div className="relative z-10 px-8 py-10 md:py-14 text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                  {visual.icon}
                </div>
                <h2 className="text-sm font-black uppercase tracking-widest text-white/80">Ngày {activeDayData.day}</h2>
              </div>
              {isEditMode ? (
                <div className="max-w-2xl bg-white/10 rounded-2xl p-2">
                  <EditableText
                    value={activeDayData.title}
                    onSave={(newValue) => updateOnboardingDay(activeDayData.day, { title: newValue })}
                    className="text-2xl md:text-3xl font-extrabold leading-tight text-white border-none focus:ring-0"
                    minRows={1}
                  />
                </div>
              ) : (
                <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                  {activeDayData.title.replace(/^Ngày \d+[:\-]?\s*/i, '').trim()}
                </h1>
              )}
            </div>
          </div>

          {/* Day Objective */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-sky-500"></div>
            <h3 className="text-xl font-bold text-[#15333B] mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-sky-500" /> Mục tiêu chặng
            </h3>
            <div className="text-[17px] text-[#3E5E63] leading-relaxed w-full">
              {isEditMode ? (
                <EditableText
                  value={activeDayData.objective}
                  onSave={(newValue) => updateOnboardingDay(activeDayData.day, { objective: newValue })}
                  className="text-[#3E5E63] w-full"
                  minRows={4}
                />
              ) : (
                renderRichText(activeDayData.objective)
              )}
            </div>
          </div>

          {/* Task Checklist Panel */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-5 mb-6 gap-4">
              <h2 className="text-2xl font-bold text-[#15333B] flex items-center gap-2">
                <ClipboardList className="w-6 h-6 text-emerald-500" /> Danh sách Nhiệm vụ
              </h2>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm px-4 py-1.5 rounded-full font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Hoàn thành: {dayTasks.filter(t => checkedTasks[t.key]).length} / {dayTasks.length}
              </span>
            </div>
            
            <div className="space-y-3">
              {isEditMode ? (
                <div className="space-y-4 w-full">
                  <div className="space-y-3">
                    {editingTasks.map((task, idx) => (
                      <div key={task.id} className="flex flex-col gap-2 bg-white p-4 rounded-2xl border border-gray-200 hover:border-sky-300 hover:shadow-md transition-all">
                        {/* Formatting toolbar shown only when this task is active */}
                        {focusedTaskId === task.id && (
                          <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-xl border border-slate-200/60 shadow-inner">
                            <button
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                applyFormatting(task.id, 'bold');
                              }}
                              className="w-7 h-7 flex items-center justify-center text-sm font-extrabold hover:bg-white rounded-lg text-slate-700 transition-colors border border-transparent hover:border-slate-200/80 hover:shadow-sm"
                              title="In đậm (Bold)"
                            >
                              B
                            </button>
                            <button
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                applyFormatting(task.id, 'italic');
                              }}
                              className="w-7 h-7 flex items-center justify-center text-sm italic hover:bg-white rounded-lg text-slate-700 transition-colors border border-transparent hover:border-slate-200/80 hover:shadow-sm"
                              title="In nghiêng (Italic)"
                            >
                              I
                            </button>
                            <button
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                applyFormatting(task.id, 'underline');
                              }}
                              className="w-7 h-7 flex items-center justify-center text-sm underline hover:bg-white rounded-lg text-slate-700 transition-colors border border-transparent hover:border-slate-200/80 hover:shadow-sm"
                              title="Gạch chân (Underline)"
                            >
                              U
                            </button>
                            <div className="w-px h-5 bg-gray-300 mx-1"></div>
                            <button
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                applyFormatting(task.id, 'ordered-list');
                              }}
                              className="px-2 h-7 flex items-center justify-center text-[10px] font-black hover:bg-white rounded-lg text-slate-700 transition-colors border border-transparent hover:border-slate-200/80 hover:shadow-sm"
                              title="Danh sách số"
                            >
                              1.2.3.
                            </button>
                            <button
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                applyFormatting(task.id, 'bullet-list');
                              }}
                              className="px-2 h-7 flex items-center justify-center text-xs hover:bg-white rounded-lg text-[#214C54] transition-colors border border-transparent hover:border-slate-200/80 hover:shadow-sm"
                              title="Danh sách điểm"
                            >
                              •••
                            </button>
                            <div className="w-px h-5 bg-gray-300 mx-1"></div>
                            <button
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                applyFormatting(task.id, 'link');
                              }}
                              className="px-2.5 h-7 flex items-center justify-center text-xs hover:bg-white rounded-lg text-slate-700 transition-colors border border-transparent hover:border-slate-200/80 hover:shadow-sm gap-1"
                              title="Gắn link"
                            >
                              🔗 Link
                            </button>
                            <button
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                applyFormatting(task.id, 'clear');
                              }}
                              className="w-7 h-7 flex items-center justify-center text-sm hover:bg-white rounded-lg text-rose-600 transition-colors border border-transparent hover:border-slate-200/80 hover:shadow-sm"
                              title="Xóa định dạng"
                            >
                              Tx
                            </button>
                            <span className="text-[9px] text-gray-400 ml-auto italic hidden sm:inline pr-1">Nhấn Enter để xuống dòng</span>
                          </div>
                        )}

                        <div className="flex items-start gap-3">
                          {/* Reordering */}
                          <div className="flex flex-col gap-1 shrink-0 pt-1.5">
                            <button
                              type="button"
                              onClick={() => handleMoveTask(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
                              title="Di chuyển lên"
                            >
                              <ArrowUp size={14} className="text-[#3E5E63]" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveTask(idx, 'down')}
                              disabled={idx === editingTasks.length - 1}
                              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
                              title="Di chuyển xuống"
                            >
                              <ArrowDown size={14} className="text-[#3E5E63]" />
                            </button>
                          </div>

                          {/* Task Text Area (WYSIWYG contentEditable) */}
                          <div className="flex-1 min-w-0">
                            <div
                              id={`input-${task.id}`}
                              contentEditable
                              suppressContentEditableWarning
                              onInput={(e) => {
                                const target = e.currentTarget;
                                // Convert visual HTML layout to markdown to save state
                                let html = target.innerHTML;
                                
                                // Standardize HTML tags to markdown
                                let markdown = html
                                  .replace(/\s+style="[^"]*"/gi, '')
                                  .replace(/<span[^>]*>/gi, '')
                                  .replace(/<\/span>/gi, '')
                                  .replace(/<font[^>]*>/gi, '')
                                  .replace(/<\/font>/gi, '')
                                  .replace(/<b>(.*?)<\/b>/gi, '**$1**')
                                  .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
                                  .replace(/<i>(.*?)<\/i>/gi, '*$1*')
                                  .replace(/<em>(.*?)<\/em>/gi, '*$1*')
                                  .replace(/<u>(.*?)<\/u>/gi, '<u>$1</u>')
                                  .replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
                                  .replace(/<ol>([\s\S]*?)<\/ol>/gi, (_, p1) => {
                                    let idx = 1;
                                    return '\n' + p1.replace(/<li>(.*?)<\/li>/gi, () => `${idx++}. $1\n`).trim() + '\n';
                                  })
                                  .replace(/<ul>([\s\S]*?)<\/ul>/gi, (_, p1) => {
                                    return '\n' + p1.replace(/<li>(.*?)<\/li>/gi, '- $1\n').trim() + '\n';
                                  })
                                  .replace(/<div[^>]*><br[^>]*><\/div>/gi, '\n')
                                  .replace(/<div[^>]*>(.*?)<\/div>/gi, '\n$1')
                                  .replace(/<br\s*[^>]*>/gi, '\n')
                                  .replace(/&nbsp;/g, ' ')
                                  .replace(/\s+(?:class|id|dir|align|style)="[^"]*"/gi, '')
                                  .trim();
                                
                                handleTaskLabelChange(task.id, markdown);
                              }}
                              onBlur={() => {
                                handleTaskLabelBlur(task.id, task.label);
                                setTimeout(() => setFocusedTaskId(null), 200);
                              }}
                              onFocus={() => {
                                setFocusedTaskId(task.id);
                              }}
                              className="w-full bg-transparent focus:outline-none py-1 px-1.5 text-sm text-[#15333B] font-semibold border-b border-transparent focus:border-slate-200 min-h-[2em]"
                              dangerouslySetInnerHTML={{
                                __html: task.label
                                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                  .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
                                  .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-sky-650 hover:underline">$1</a>')
                                  .split('\n').join('<br>')
                              }}
                            />
                          </div>

                          {/* Optional toggle */}
                          <label className="flex items-center gap-1.5 cursor-pointer select-none shrink-0 border border-gray-100 rounded-xl p-2 bg-gray-50 hover:bg-gray-100 transition-colors mt-0.5">
                            <input
                              type="checkbox"
                              checked={task.isOptional}
                              onChange={() => handleToggleOptional(task.id)}
                              className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                            />
                            <span className="text-xs font-bold text-[#3E5E63]">Tùy chọn</span>
                          </label>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all shrink-0 mt-0.5"
                            title="Xóa nhiệm vụ"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleAddTask}
                    className="w-full py-3 border-2 border-dashed border-[#214C54]/30 hover:border-[#214C54]/80 text-[#214C54] hover:bg-[#214C54]/5 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Plus size={14} /> Thêm Nhiệm Vụ Mới
                  </button>
                </div>
              ) : (
                dayTasks.map((task) => {
                  const isCompleted = !!checkedTasks[task.key];
                  return (
                    <div key={task.key} className={`p-4 md:p-5 rounded-2xl border transition-all duration-300 ${isCompleted ? 'bg-emerald-50/50 border-emerald-200 opacity-90' : task.isOptional ? 'bg-white border-dashed border-gray-200 hover:border-violet-300 hover:shadow-md' : 'bg-white border-gray-200 hover:border-sky-300 hover:shadow-md'}`}>
                      <label className="flex items-start gap-4 cursor-pointer group">
                        <div className="pt-1 shrink-0">
                          <input 
                            type="checkbox" 
                            checked={isCompleted}
                            onChange={() => handleToggleTask(activeDayData.day, task.idx, task.label)}
                            className="w-5 h-5 rounded-md border-2 border-gray-300 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer transition-colors"
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start flex-wrap gap-2">
                            {task.isOptional && (
                              <div className="shrink-0 flex flex-col items-start gap-1">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-100 text-violet-600 border border-violet-200">
                                  ✦ Tùy chọn
                                </span>
                                {task.optionalNote && (
                                  <span className="text-[11px] text-violet-500 italic font-medium">{task.optionalNote}</span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className={`text-[17px] leading-relaxed transition-all ${isCompleted ? 'text-gray-400 line-through' : 'text-[#3E5E63]'}`}>
                            {renderRichText(task.label)}
                          </div>

                        </div>
                      </label>
                    </div>
                  );
                })
              )}
            </div>

            {!isEditMode && isDayCompleted(selectedDay) && (
              <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/20 text-center space-y-4 animate-scale-up">
                <div className="text-4xl">🎉</div>
                <h4 className="text-lg font-black text-emerald-800 uppercase tracking-wider">
                  Hoàn Thành Thử Thách Ngày {selectedDay}!
                </h4>
                <p className="text-sm text-emerald-700 font-medium leading-relaxed max-w-xl mx-auto">
                  {selectedDay < 8 
                    ? "Tuyệt vời! Bạn đã xuất sắc hoàn thành toàn bộ nhiệm vụ của ngày hôm nay. Sẵn sàng cho thử thách tiếp theo chưa?" 
                    : "Chúc mừng! Bạn đã hoàn thành toàn bộ 8 ngày thử thách của Onboarding Week. Hãy cùng lưu danh vào Bảng vinh danh!"}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  {selectedDay < 8 ? (
                    <>
                      <button
                        onClick={() => {
                          const nextDay = selectedDay + 1;
                          const lockStatus = getDayLockStatus(nextDay);
                          if (lockStatus.isUnlocked) {
                            setSelectedDay(nextDay);
                          } else {
                            setLockedAlert({ show: true, msg: lockStatus.reason });
                            setTimeout(() => setLockedAlert({ show: false, msg: '' }), 5000);
                          }
                        }}
                        className="px-6 py-3 bg-[#214C54] hover:bg-[#15333B] text-white font-black text-xs rounded-xl shadow-md hover:shadow-lg transition-all uppercase tracking-wider flex items-center gap-2 border-0 cursor-pointer"
                      >
                        Tiến tới Ngày {selectedDay + 1} ➔
                      </button>
                      <button
                        onClick={() => onPageChange?.('walloffame')}
                        className="px-6 py-3 bg-white border border-[#214C54] text-[#214C54] hover:bg-[#214C54]/5 font-black text-xs rounded-xl shadow-sm hover:shadow-md transition-all uppercase tracking-wider flex items-center gap-2 border-0 cursor-pointer"
                      >
                        🏆 Xem Bảng xếp hạng
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => onPageChange?.('walloffame')}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs rounded-xl shadow-md hover:shadow-lg transition-all uppercase tracking-wider flex items-center gap-2 border-0 cursor-pointer"
                    >
                      🏆 Đi tới Bảng vinh danh
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>



          {/* Companion Mascot speech box */}
          {!isEditMode && (
            <div className="bg-white border-2 border-sky-100 p-5 rounded-2xl flex items-start gap-4">
              <span className="text-3xl">🦜</span>
              <div className="space-y-1">
                <span className="text-xs text-sky-700 font-black block uppercase tracking-wider">Bác Vẹt Đồng Hành gợi ý:</span>
                <div className="text-sm text-[#3E5E63] leading-relaxed font-semibold">
                  {activeDayData.companionHint
                    ? renderRichText(activeDayData.companionHint)
                    : '"Thực hiện xong nhiệm vụ nào thì check ngay vào ô trống bên cạnh để nhận điểm thưởng nhé! Tích tiểu thành đại, hải trình còn dài! Nhớ hoàn thành 100% để mở khóa ngày mai nhé!"'}
                </div>
              </div>
            </div>
          )}

          {/* Bonus Resources card */}
          {!isEditMode && activeDayData.bonusResources && (
            <div className="bg-amber-50/60 border-2 border-amber-100 p-5 rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">💬</span>
                <span className="text-xs text-amber-700 font-black uppercase tracking-wider">Bonus: Tài liệu đọc thêm cho bạn</span>
              </div>
              <div className="space-y-1.5">
                {activeDayData.bonusResources.split('\n').filter((l: string) => l.trim().startsWith('- [')).map((line: string, i: number) => {
                  const match = line.match(/^- \[([^\]]+)\]\(([^)]+)\)/);
                  if (!match) return null;
                  const [, label, url] = match;
                  return (
                    <a key={i} href={url} target="_blank" rel="noreferrer"
                       className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-amber-100 transition-colors group">
                      <span className="text-amber-500 group-hover:text-amber-600 text-sm shrink-0">🔗</span>
                      <span className="text-sm text-sky-600 group-hover:text-sky-700 font-medium group-hover:underline">{label}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}


        </div>
      )}

      {/* Email Modal */}
      {isEmailModalOpen && emailModalDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in text-slate-800">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col border border-gray-100 overflow-hidden animate-scale-up max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-teal-850">
                <Mail className="w-5 h-5" />
                <h4 className="text-sm font-black text-[#15333B] uppercase tracking-wider font-extrabold">Cấu hình Email Mở khóa: Ngày {emailModalDay.day}</h4>
              </div>
              <button 
                onClick={() => setIsEmailModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#15333B]/5 hover:bg-[#15333B]/10 flex items-center justify-center text-[#15333B] transition-colors cursor-pointer border-0"
              >
                ✕
              </button>
            </div>

            {/* Side-by-Side Content */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
              {/* Left Column: Form Editor */}
              <div className="flex-1 p-6 space-y-4 overflow-y-auto border-r border-gray-100 flex flex-col">
                {/* Subject Input */}
                <div className="space-y-1.5 shrink-0">
                  <label className="text-[11px] font-bold text-[#15333B] block">Tiêu đề Email (Subject):</label>
                  <input 
                    type="text"
                    required
                    placeholder="Nhập tiêu đề email..."
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54]/20 transition-all font-bold text-[#15333B]"
                  />
                </div>

                {/* Body Textarea */}
                <div className="space-y-1.5 flex-1 flex flex-col min-h-0">
                  <label className="text-[11px] font-bold text-[#15333B] block shrink-0">Nội dung Email (Body):</label>
                  <textarea 
                    required
                    placeholder="Nhập nội dung email..."
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs leading-relaxed focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54]/20 resize-none transition-all font-medium text-gray-700 flex-1 min-h-[150px]"
                  />
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-gray-100 flex justify-between gap-3 shrink-0">
                  <button 
                    type="button"
                    onClick={handleCopyEmailFormat}
                    className="btn border border-teal-600 text-teal-850 hover:bg-teal-50/50 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer bg-white"
                  >
                    {copySuccess ? 'Đã sao chép! ✓' : 'Sao chép định dạng 📋'}
                  </button>
                  
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={() => setIsEmailModalOpen(false)}
                      className="btn border border-gray-300 text-gray-700 text-xs font-bold px-4 py-2 hover:bg-gray-50 rounded-xl cursor-pointer bg-white"
                    >
                      Hủy
                    </button>
                    <button 
                      type="button"
                      onClick={handleSaveEmailTemplate}
                      className="btn border border-emerald-600 bg-emerald-50 text-emerald-800 text-xs font-bold px-4 py-2 hover:bg-emerald-100 rounded-xl cursor-pointer"
                    >
                      Lưu mẫu
                    </button>
                    <button 
                      type="button"
                      onClick={handleSendBulkEmail}
                      className="btn bg-[#214C54] text-white text-xs font-extrabold px-4 py-2 flex items-center gap-1.5 rounded-xl shadow-md cursor-pointer border-0"
                    >
                      Gửi qua Gmail 🚀
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Brand Guidelines Preview */}
              <div className="hidden md:flex flex-1 flex-col bg-gray-50 p-6 overflow-y-auto">
                <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Xem trước Email (Brand Guidelines)</div>
                <div className="bg-[#FDF5DA] p-6 rounded-2xl border border-[#ffd94c] flex-1 flex flex-col justify-start min-h-[300px]">
                  <div className="bg-[#15333B] p-4 rounded-t-xl text-center border-b-4 border-[#ffd94c]">
                    <span className="text-[#ffd94c] font-black text-xs tracking-wider block">
                      🦜 VẸT LẮM MỒM - THE1IGHT 🦜
                    </span>
                  </div>
                  <div className="bg-white p-5 rounded-b-xl flex-1 shadow-sm">
                    <h5 className="text-[#214C54] font-black text-xs border-b border-gray-150 pb-2 mb-3">
                      {emailSubject || '(Không có tiêu đề)'}
                    </h5>
                    <div className="text-[11px] text-gray-700 font-medium leading-relaxed space-y-3 whitespace-pre-line">
                      {emailBody || '(Không có nội dung)'}
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

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#15333B] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center justify-between gap-4 border border-teal-800/30 animate-slide-up select-text">
          <span className="text-xs font-bold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-white ml-2 cursor-pointer border-0 bg-transparent">✕</button>
        </div>
      )}
    </div>
  );
};

