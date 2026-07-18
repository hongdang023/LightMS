import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ONBOARDING_DAYS_DATA } from '../data/onboardingData';

const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// ==========================================
// Database TypeScript Schemas
// ==========================================

export type UserRole = 'student' | 'mentor' | 'admin';
export type TechLevel = 'non-tech' | 'low-code' | 'coder';
export type MasteryLevel = 'none' | 'needs_improvement' | 'meets_expectations' | 'excellent';
export type SubmissionStatus = 'draft' | 'submitted' | 'graded';

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  role: UserRole;
  telegram_id: string;
  gmail: string;
  phone_number?: string;
  facebook_url?: string;
  industry?: string;
  current_job?: string;
  tech_level?: TechLevel;
  product_idea?: string;
  weekly_hours_commitment?: number;
  motivation_bet?: string;
  is_profile_completed: boolean;
  nautical_miles: number;
  visits: number;
  referral_source?: string;
  current_role?: string;
  work_field?: string;
  living_region?: string;
  gender?: string;
  age_group?: string;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  cover_image: string;
}

export interface Batch {
  id: string;
  course_id: string;
  name: string;
  start_date: string;
  end_date: string;
  mentor_id: string;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  order_index: number;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  type: 'video' | 'document';
  content: string;
  video_url: string;
  order_index: number;
  start_date?: string;
  target?: string;
  demo?: string;
  scope?: string;
  has_materials?: boolean;
  slide_url?: string;
  study_note_url?: string;
  key_concepts?: string[];
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  levels: {
    1: string; // Novice
    2: string; // Advanced Beginner
    3: string; // Competent
    4: string; // Proficient
    5: string; // Expert
  };
}

export interface LessonSkill {
  lesson_id: string;
  skill_id: string;
}

export interface MasteryRecord {
  student_id: string;
  skill_id: string;
  mastery_level: MasteryLevel;
  last_updated: string;
}

export interface Assignment {
  id: string;
  lesson_id: string;
  description: string;
  rubric_checklist: { item: string; checked: boolean; is_optional?: boolean }[];
  scaffolding?: {
    template_url?: string;
    reference_link?: string;
    items?: { label: string; url: string }[];
  };
}

export interface Submission {
  id: string;
  assignment_id: string;
  batch_id: string;
  student_id: string;
  content: string;
  status: SubmissionStatus;
  created_at: string;
  upvotes_count?: number;
  upvoted_by?: string[];
  media_urls?: string[];
}

export interface DiscussionTopic {
  id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: string;
}

export interface DiscussionPost {
  id: string;
  topic_id: string;
  author_id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  upvotes_count: number;
  upvoted_by: string[];
  media_urls?: string[];
}

export interface Feedback {
  id: string;
  submission_id: string;
  mentor_id: string;
  content: string;
  mastery_level: 'needs_improvement' | 'meets_expectations' | 'excellent';
  created_at: string;
}

export interface Comment {
  id: string;
  submission_id: string;
  batch_id: string;
  author_id: string;
  content: string;
  upvotes_count: number;
  is_verified: boolean;
  created_at: string;
  upvoted_by?: string[]; // list of profile ids who upvoted
}

export interface NauticalMilesTransaction {
  id: string;
  student_id: string;
  amount: number;
  action_type: 'profile_completion' | 'lesson_complete' | 'assignment_submitted' | 'assignment_graded' | 'comment_added' | 'comment_upvoted' | 'comment_verified' | 'post_created' | 'post_upvoted' | 'submission_kudos';
  reference_id?: string;
  description: string;
  created_at: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  condition: string;
}

export interface ProfileBadge {
  student_id: string;
  badge_id: string;
  unlocked_at: string;
}

export interface NotificationLog {
  id: string;
  title: string;
  message: string;
  type: 'telegram' | 'system';
  created_at: string;
}

export interface Announcement {
  id: string;
  course_id?: string;
  batch_id?: string;
  title: string;
  content: string;
  author: string;
  created_by: string;
  send_email: boolean;
  sent_email_at?: string;
  media_urls?: string[];
  created_at: string;
  isNew?: boolean;
}

export interface OnboardingDay {
  day: number;
  title: string;
  intro: string;
  objective: string;
  checklist: string;
  takeaway: string;
  email_subject?: string;
  email_body?: string;
  companionHint?: string;
  bonusResources?: string;
}

export interface OnboardingUnlockSchedule {
  day: number;
  scheduled_at: string; // ISO string
  unlock_email_sent: boolean;
}

export type EventType = 'kick-off' | 'office-hour' | 'live-class' | 'onboarding' | 'capstone' | 'class-bonding';

export const EVENT_TYPE_CONFIG: Record<EventType, { label: string; color: string; bg: string; textColor: string }> = {
  'kick-off':     { label: 'Kick-off Meeting', color: '#DC2626', bg: 'bg-red-600',    textColor: 'text-white' },
  'office-hour':  { label: 'Office Hour',      color: '#2563EB', bg: 'bg-blue-600',   textColor: 'text-white' },
  'live-class':   { label: 'Live Class',        color: '#EA580C', bg: 'bg-orange-600', textColor: 'text-white' },
  'onboarding':   { label: 'Onboarding',        color: '#7C3AED', bg: 'bg-violet-600', textColor: 'text-white' },
  'capstone':     { label: 'Capstone',           color: '#B45309', bg: 'bg-amber-700',  textColor: 'text-white' },
  'class-bonding':{ label: 'Class Bonding',     color: '#16A34A', bg: 'bg-green-600',  textColor: 'text-white' },
};

export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  endTime?: string;   // end time e.g. '22:30'
  allDay?: boolean;
  date?: number; // specific date
  month?: number; // specific month (0-indexed)
  year?: number; // specific year
  dayOfWeek?: number; // 1 (Mon) - 7 (Sun)
  startRecur?: number; // timestamp
  endRecur?: number; // timestamp
  colorClass: string;
  dotColorClass?: string;
  type: 'class' | 'community' | 'other';
  eventType?: EventType; // new: 6-category event type
  details?: string;
}

export interface AboutContent {
  overviewText: string;
  scheduleText: string;
  benefitsText: string;
}

// ==========================================
// Context State Type
// ==========================================

interface DatabaseContextType {
  // Authentication & Session
  activeUser: Profile;
  switchUser: (role: UserRole) => void;
  users: Profile[];
  updateProfile: (profileId: string, updates: Partial<Profile>) => Promise<boolean>;
  isAuthenticated: boolean;
  loginWithGmail: (email: string, role?: UserRole) => Profile | null;
  loginWithSupabaseGoogle: (role?: UserRole) => Promise<void>;
  logout: () => void;
  
  // Data lists
  courses: Course[];
  batches: Batch[];
  modules: Module[];
  lessons: Lesson[];
  skills: Skill[];
  lessonSkills: LessonSkill[];
  masteryRecords: MasteryRecord[];
  assignments: Assignment[];
  submissions: Submission[];
  feedbacks: Feedback[];
  comments: Comment[];
  nauticalTransactions: NauticalMilesTransaction[];
  badges: Badge[];
  profileBadges: ProfileBadge[];
  notifications: NotificationLog[];
  topics: DiscussionTopic[];
  discussionPosts: DiscussionPost[];

  // Admin and Dynamic Content states
  announcements: Announcement[];
  calendarEvents: CalendarEvent[];
  onboardingDays: OnboardingDay[];
  onboardingUnlockSchedules: OnboardingUnlockSchedule[];
  aboutContent: AboutContent;

  // Action mutations (Rules Engine internally triggered)
  submitAssignment: (assignmentId: string, content: string) => void;
  gradeSubmission: (submissionId: string, feedbackContent: string, grade: 'needs_improvement' | 'meets_expectations' | 'excellent') => void;
  addComment: (submissionId: string, commentText: string) => void;
  upvoteComment: (commentId: string) => void;
  verifyComment: (commentId: string) => void;
  completeLesson: (lessonId: string) => void;
  addNotification: (title: string, message: string, type?: 'telegram' | 'system') => void;
  addTopic: (name: string, description: string) => void;
  addDiscussionPost: (topicId: string, title: string, content: string, tags?: string[], mediaUrls?: string[]) => void;
  upvoteDiscussionPost: (postId: string) => void;
  upvoteSubmission: (submissionId: string) => void;

  // New Admin mutation functions
  addAnnouncement: (title: string, content: string, sendEmail: boolean, mediaUrls?: string[]) => void;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateCalendarEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteCalendarEvent: (id: string) => void;
  shiftCalendarEvents: (startDateStr: string, daysToShift: number) => void;
  updateOnboardingDay: (dayNumber: number, updates: Partial<OnboardingDay>) => void;
  updateOnboardingUnlockSchedule: (dayNumber: number, scheduledAt: string) => void;
  updateAboutContent: (updates: Partial<AboutContent>) => void;
  updateLesson: (id: string, updates: Partial<Lesson>) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  updateModule: (id: string, updates: Partial<Module>) => void;
  updateBatch: (id: string, updates: Partial<Batch>) => void;
  addLesson: (lesson: Lesson) => void;
  incrementVisits: (userId: string) => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

// ==========================================
// Seed Initial Data (based on actual requirements and C2)
// ==========================================

const SEED_SKILLS: Skill[] = [
  {
    id: 'skill-problem',
    name: 'Năng lực Đặc tả Vấn đề & PRD (Problem Statement & PRD)',
    description: 'Tập trung vào khả năng đào sâu nguyên nhân gốc rễ (Root Cause) và sử dụng (PRD) để giao việc cho AI.',
    levels: {
      1: 'Novice: Nhảy thẳng vào chốt hạ giải pháp (Convergent quá sớm). Viết yêu cầu mơ hồ bằng các câu lệnh cộc lốc (1-shot prompt).',
      2: 'Advanced Beginner: Áp dụng 5W1H và 5 Whys nhưng còn cứng nhắc. Viết được PRD nhưng MVP vẫn ôm đồm quá nhiều tính năng, chưa biết cách "scoping" nhỏ lại.',
      3: 'Competent (Mục tiêu khóa học): Áp dụng nhuần nhuyễn công thức Problem Statement: "[User] needs to [User\'s need] because [insights]". Dùng 5 Whys tìm ra đúng vấn đề gốc rễ. Viết PRD 5 phần tinh gọn (nhỏ nhất đủ để test) và đánh giá rõ 4 rủi ro (Value, Feasibility, Usability, Viability) trước khi làm.',
      4: 'Proficient: Có khả năng tự phân tách Use Case thành các User Story sắc bén. Biến PRD thành ngôn ngữ cực chuẩn để máy hiểu nhanh gấp nhiều lần người.',
      5: 'Expert: Trực giác nhạy bén, tự nhìn ra cơ hội thị trường. Biết khi nào cần làm Feature Delivery, khi nào cần Redefine MVP hoặc Growth Strategy.'
    }
  },
  {
    id: 'skill-ux',
    name: 'Năng lực Thiết kế Hành trình & Aha Moment (UX & Aha Moment)',
    description: 'Đánh giá khả năng "dắt khéo" người dùng đi từ nỗi đau đến khoảnh khắc nhận ra giá trị (Aha) một cách tự nhiên nhất.',
    levels: {
      1: 'Novice: Thiết kế "Dắt lộ liễu" bằng các popup ép đăng ký, dark pattern, khiến user cảm thấy bị lừa và bỏ đi.',
      2: 'Advanced Beginner: Hiểu khái niệm Aha Moment nhưng luồng User Flow còn dài, chứa nhiều "bước thừa" trước khi user nhận được giá trị.',
      3: 'Competent (Mục tiêu khóa học): Thiết kế theo chuỗi thu hẹp: Journey → Story → Flow → Aha. Rút ngắn được luồng User Flow để dẫn dắt user đạt được 3 cấp độ Aha: "Ồ hiểu mình" -> "Ồ làm được thật" -> "Ồ không muốn quay lại cách cũ".',
      4: 'Proficient: Nắm bắt trọn vẹn Customer Journey (CX bao trùm UX) từ trước khi dùng app đến khi giới thiệu bạn bè (Adoption).',
      5: 'Expert: Tạo ra các điểm chạm mượt mà dẫn đến thói quen dùng lặp lại, hình thành vòng lặp Viral Loop hoặc Retention tự nhiên.'
    }
  },
  {
    id: 'skill-lean',
    name: 'Năng lực Kiểm chứng Tinh gọn (Lean Validation & Build-Measure-Learn)',
    description: 'Đo lường tư duy "Hoàn thiện quan trọng hơn hoàn hảo" và dũng cảm đi tìm sự thật từ người dùng thông qua The Mom Test.',
    levels: {
      1: 'Novice: Sợ test, tự làm tự ngắm hoặc làm theo tư duy Waterfall (lên kế hoạch 6 tháng mới ra mắt rồi phát hiện sai hướng).',
      2: 'Advanced Beginner: Có mang sản phẩm đi test nhưng chỉ đi tìm "sự đồng thuận" hoặc lời khen thay vì sự thật.',
      3: 'Competent (Mục tiêu khóa học): Áp dụng vòng lặp Lean Startup siêu tốc: Build - Measure - Learn. Thực hành xuất sắc Usability Test với tư cách là người điều phối (Facilitator) khách quan, rạch ròi giữa Sự thật, Niềm tin và Sự đồng thuận.',
      4: 'Proficient: Vận hành mượt mà quy trình Dual track Agile (vừa Discovery khám phá vấn đề, vừa Delivery thực thi giải pháp). Dám thay đổi toàn bộ mô hình (Pivot) nếu giả định sai.',
      5: 'Expert: Hoàn thiện Lean Model Canvas và nắm vững Mô hình 3M (Market, Message, Medium). Ra quyết định 100% dựa trên dữ liệu thực tế thay vì hàng ngàn giả thiết trong đầu.'
    }
  },
  {
    id: 'skill-ai',
    name: 'Năng lực Giao tiếp & Phối hợp AI (Vibe Coding & AI Agent)',
    description: 'Năng lực dùng AI như một đồng đội (Agent), làm chủ IDE và thiết lập hệ thống tự động hóa.',
    levels: {
      1: 'Novice: Nhắm mắt "Accept All" mọi code AI viết mà không đọc Diff, mắc bẫy Dunning-Kruger (không biết output sai vì quá tự tin). Bị giới hạn hoàn toàn trên giao diện Web Chat.',
      2: 'Advanced Beginner: Biết dùng CREATE framework để giao vai trò cho AI. Tuy nhiên, chat quá dài trong một luồng khiến AI bị tràn Context Window dẫn đến "lú" hoặc ảo giác.',
      3: 'Competent (Mục tiêu khóa học): Coi AI là Đồng đội. Chuyển lên dùng IDE (Antigravity/Cursor) quản lý code. Luôn tự hỏi 3 câu kiểm tra trước khi chốt: "Assumption là gì? Fail ở đâu? Chưa nghĩ tới gì?". Quản lý token tốt bằng file CLAUDE.md ngắn gọn.',
      4: 'Proficient: Biết dùng Terminal và CLI (Claude Code) để quản lý đa tác vụ. Đóng gói thành công các quy trình lặp lại thành "Skills" (Self-trigger, Self-contained, Self-verify) cho AI tự chạy.',
      5: 'Expert: Mở khóa "tay chân" cho AI bằng cách cài đặt MCPs (Model Context Protocol) kết nối với database, Linear, Github, hoặc tự viết Scripts tự động hóa (Make/N8N).'
    }
  },
  {
    id: 'skill-ui',
    name: 'Năng lực Thiết kế UI & Prototyping (UI Design & Prototyping)',
    description: 'Năng lực xây dựng phiên bản kiểm chứng với tiêu chí "Cân nặng tỉ lệ nghịch với tốc độ học".',
    levels: {
      1: 'Novice: Dành quá nhiều thời gian làm UI pixel-perfect cực đẹp nhưng luồng bị đứt gãy. Nhầm lẫn giữa việc làm "cái đẹp" với làm "cái dùng được".',
      2: 'Advanced Beginner: Dùng các tool (v0, Stitch, Figma) để tạo UI tĩnh (UI Only). Tuy nhiên sản phẩm chưa có logic, không thao tác (bấm) thật được.',
      3: 'Competent (Mục tiêu khóa học): Tuân thủ nguyên lý Prototype là "xấu-nhưng-đủ". Chuyển mượt mà từ bản UI (Google Stitch) sang Functional UI có logic hoạt động (Google AI Studio/Lovable) dựa vào PRD.',
      4: 'Proficient: Xây dựng Full MVP có "ký ức". Biết gen ERD thành SQL và kết nối thành công với Database (Supabase) thực hiện các lệnh CRUD.',
      5: 'Expert: Làm chủ System Flow toàn diện (từ L1 - Business Flow đến L3 - System Flow). Đóng gói sản phẩm qua GitHub và deploy mượt mà lên môi trường Live bằng Vercel với đầy đủ bảo mật biến môi trường (.env).'
    }
  }
];

const SEED_BADGES: Badge[] = [
  {
    id: 'bada0000-0000-0000-0000-000000000001',
    name: 'Thẻ Căn Cước Thủy Thủ',
    icon: '🪪',
    description: 'Khai báo thông tin cá nhân đầy đủ 100% trong Hồ sơ cá nhân.',
    condition: 'Hoàn thành hồ sơ cá nhân với đầy đủ các trường thông tin.'
  },
  {
    id: 'bada0000-0000-0000-0000-000000000101',
    name: 'Huy hiệu: Thủy thủ tập sự',
    icon: '⛵',
    description: 'Mốc khởi đầu hải trình vượt biển lớn của The1ight.',
    condition: 'Tích lũy từ 0 Hải lý trở lên (Có sẵn khi tham gia).'
  },
  {
    id: 'bada0000-0000-0000-0000-000000000002',
    name: 'Cánh Buồm No Gió',
    icon: '💨',
    description: 'Khởi đầu thuận lợi. Tự động nhận được khi hoàn thành xuất sắc toàn bộ bài tập của Tuần lễ Onboarding.',
    condition: 'Đạt điểm "Meets Expectations" hoặc "Excellent" cho các bài tập thuộc Module 0.'
  },
  {
    id: 'bada0000-0000-0000-0000-000000000102',
    name: 'Huy hiệu: Hoa tiêu',
    icon: '🗺️',
    description: 'Mốc Hải trình thứ hai. Hoa tiêu có khả năng định vị trên đại dương.',
    condition: 'Tích lũy từ 501 Hải lý trở lên.'
  },
  {
    id: 'bada0000-0000-0000-0000-000000000003',
    name: 'Mỏ Neo Thép',
    icon: '⚓',
    description: 'Tượng trưng cho sự kiên định. Nhận được khi có chuỗi nộp bài đúng hạn (Streak) 3 lần liên tiếp.',
    condition: 'Có 3 bài nộp liên tiếp ở trạng thái "submitted" hoặc "graded" và được ghi nhận trước hạn chót.'
  },
  {
    id: 'bada0000-0000-0000-0000-000000000103',
    name: 'Huy hiệu: Thuyền phó',
    icon: '⚔️',
    description: 'Mốc Hải trình thứ ba. Thuyền phó thiện chiến, quản lý thủy thủ đoàn.',
    condition: 'Tích lũy từ 1501 Hải lý trở lên.'
  },
  {
    id: 'bada0000-0000-0000-0000-000000000004',
    name: 'Phao Cứu Sinh',
    icon: '🛟',
    description: 'Dành cho những "thiên thần cộng đồng". Nhận được khi tổng số Upvotes thu về từ các bình luận đạt mốc 50.',
    condition: 'Tích lũy 50 upvotes từ các comment hữu ích trên các bài nộp khác.'
  },
  {
    id: 'bada0000-0000-0000-0000-000000000104',
    name: 'Huy hiệu: Thuyền trưởng',
    icon: '🧭',
    description: 'Mốc Hải trình thứ tư. Làm chủ hải trình, dẫn dắt con tàu.',
    condition: 'Tích lũy từ 3001 Hải lý trở lên.'
  },
  {
    id: 'bada0000-0000-0000-0000-000000000005',
    name: 'Ngọn Hải Đăng',
    icon: '🗼',
    description: 'Dành cho sự xuất sắc. Nhận được khi bài nộp đạt điểm "Excellent" và được Mentor "Verified" (ghim) lên top Discussion.',
    condition: 'Đạt điểm "Excellent" ở bất kỳ bài tập nào và được ghim/verified.'
  },
  {
    id: 'bada0000-0000-0000-0000-000000000105',
    name: 'Huy hiệu: Huyền thoại biển cả',
    icon: '👑',
    description: 'Cột mốc tối thượng. Một huyền thoại vĩ đại được cả đại dương kính nể.',
    condition: 'Tích lũy từ 5000 Hải lý trở lên.'
  },
  {
    id: 'bada0000-0000-0000-0000-000000000006',
    name: 'Bản Đồ Kho Báu',
    icon: '🗺️',
    description: 'Huy hiệu tốt nghiệp vinh quang. Nhận được khi hoàn thành 100% Lộ trình khóa học (Syllabus) với các chuẩn đầu ra đều ở mức Đạt trở lên.',
    condition: 'Hoàn thành tất cả các bài tập của syllabus ở mức Đạt trở lên.'
  }
];

// ==========================================
// Seed Initial Data (based on actual requirements and C2)
// ==========================================

const SEED_COURSES: Course[] = [
  {
    id: '3f26048a-6689-400e-99fc-e0499161d934',
    title: 'Vibe Coding 201: Build scalable product with AI',
    description: 'Vibe Coding 201 là khóa học 9 buổi nâng cao giúp bạn học cách xây dựng sản phẩm có khả năng scale, thiết lập PRD kỹ thuật, làm chủ IDE/CLI, thiết kế MCP và xây dựng hệ thống automation kết hợp n8n.',
    cover_image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop'
  }
];

const SEED_BATCHES: Batch[] = [
  {
    id: 'e574fea2-9260-4961-8b1d-79ef7e16f784',
    course_id: '3f26048a-6689-400e-99fc-e0499161d934',
    name: 'Batch 3',
    // We set start date to a future date so the class has not started yet
    start_date: '2026-07-01',
    end_date: '2026-08-31',
    mentor_id: 'c6b8a8b1-321a-4d2a-89a1-5d9f0f9b6b8a'
  }
];

const SEED_MODULES: Module[] = [
  { id: '2501b807-c771-48d2-a886-2be99eb8f8e9', course_id: '3f26048a-6689-400e-99fc-e0499161d934', title: 'Phần 0: Onboarding & Kick-off', order_index: 1 },
  { id: '8d29e4f3-9212-403b-8c7d-c25f6de6835a', course_id: '3f26048a-6689-400e-99fc-e0499161d934', title: 'Phần 1: Tư duy Sản phẩm & Vấn đề', order_index: 2 },
  { id: '1db2992d-70f2-48c5-9f6e-c67a71f7198e', course_id: '3f26048a-6689-400e-99fc-e0499161d934', title: 'Phần 2: IDE, CLI & MCP Product Building', order_index: 3 },
  { id: 'faa519f6-b31c-4ae7-9377-46c041b9c065', course_id: '3f26048a-6689-400e-99fc-e0499161d934', title: 'Phần 3: Version Control & Backend Decision', order_index: 4 },
  { id: '13ded8da-92ef-4e27-b516-6493ee8743d8', course_id: '3f26048a-6689-400e-99fc-e0499161d934', title: 'Phần 4: Deployment & Automation Workspace', order_index: 5 }
];

const SEED_LESSONS: Lesson[] = [
  // Phần 0
  {
    id: 'c786a9e5-1cc5-416c-9cbc-3839869404e3',
    module_id: '2501b807-c771-48d2-a886-2be99eb8f8e9',
    title: 'Buổi 0: Kick-off Meeting',
    type: 'video',
    content: 'Tìm hiểu về khóa học Vibe Coding 201, giảng viên và văn hóa học tập chủ động. Định vị lộ trình Onboarding.',
    video_url: 'https://drive.google.com/file/d/kickoff-meeting-vibe-201',
    order_index: 1,
    start_date: '2026-07-18', // Kick-off Meeting
    target: 'Kích hoạt tư duy học chủ động, hướng dẫn luật chơi hải lý và giới thiệu công cụ',
    demo: 'Demo giao diện LMS và giới thiệu các thử thách onboarding',
    scope: 'Giới thiệu tổng quan, chưa đi vào code',
    has_materials: true
  },
  
  // Phần 1
  {
    id: '1c69ea64-b83b-4519-a545-5030a8360163',
    module_id: '8d29e4f3-9212-403b-8c7d-c25f6de6835a',
    title: 'Buổi 1: Mindset: Từ MVP đến product có thể scale',
    type: 'video',
    content: 'MVP vs scalable product vs internal workspace system. Các điểm gãy sau prototype: codebase rối, data chưa rõ, auth/permission, deploy tạm, thiếu version control, khó debug, thiếu automation. Tech literacy map cho non-tech: frontend, backend, database, API, auth, deploy, server, automation. Cách học tech với AI: hỏi đúng, kiểm chứng output, không bị thuật ngữ kéo đi.',
    video_url: 'https://drive.google.com/file/d/buoi-1-mindset-scale',
    order_index: 2,
    start_date: '2026-07-29', // Buổi 1
    target: 'Giúp học viên hiểu gap giữa prototype/MVP và product hoặc workspace system đáng tin hơn.',
    demo: 'So sánh một prototype đẹp nhưng mong manh với một product/workspace system có cấu trúc hơn.',
    scope: 'Giữ tính mindset + framework. Không đi quá sâu vào từng công nghệ trong buổi này.',
    has_materials: false // Class hasn't started, no materials yet
  },
  {
    id: 'a1ba6fd1-5e99-4b0a-9ac1-3d667d63d96e',
    module_id: '8d29e4f3-9212-403b-8c7d-c25f6de6835a',
    title: 'Buổi 2: PRD kỹ thuật & 4 Flow',
    type: 'video',
    content: 'PRD v2: problem, user, goal, success criteria, main use case, out-of-scope, user stories, acceptance criteria. Main flow vs secondary flow vs edge case. 4 flow: User Flow, Business Flow, System Flow, Data Flow. Cách dùng AI/skill để review PRD và phát hiện gap.',
    video_url: 'https://drive.google.com/file/d/buoi-2-prd-technical',
    order_index: 3,
    start_date: '2026-08-01', // Buổi 2
    target: 'Biến ý tưởng/product request thành spec đủ rõ để AI/IDE/agent build đúng hơn.',
    demo: 'Chuyển một app mẫu từ PRD thường sang PRD kỹ thuật; vẽ 4 flow bằng Mermaid/diagrams.net hoặc tool tương đương.',
    scope: 'Buổi này là nền để các buổi backend/deploy/automation không bị loạn.',
    has_materials: false
  },
  
  // Phần 2
  {
    id: '9bd3fd2c-ee49-4176-b951-42e70d4f48ff',
    module_id: '1db2992d-70f2-48c5-9f6e-c67a71f7198e',
    title: 'Buổi 3: IDE + CLI Product Cockpit',
    type: 'video',
    content: 'Cấu phần IDE: file tree, editor, agent panel, terminal, source control/diff. Workflow giao việc cho agent: context, task breakdown, plan, diff review, accept/reject, run/test/debug. Khi nào dùng IDE, khi nào dùng CLI. Cách yêu cầu AI giải thích lỗi terminal/build log. Cách giới hạn scope để agent không sửa quá rộng.',
    video_url: 'https://drive.google.com/file/d/buoi-3-ide-cli-cockpit',
    order_index: 4,
    start_date: '2026-08-05', // Buổi 3
    target: 'Dạy cách làm việc với IDE/CLI để AI build có kiểm soát thay vì sửa lung tung. (học cả Cursor, Antigravity, Codex & Claude Code). Riêng Claude code có thể tách 1 buổi nếu muốn',
    demo: 'Mở repo/app mẫu; yêu cầu agent thêm một feature nhỏ; review diff; chạy local; sửa lỗi; commit nháp.',
    scope: 'Chọn một IDE chính để demo. Các IDE khác chỉ overview.',
    has_materials: false
  },
  {
    id: '8695373a-7625-4883-8a47-4a73c84cb3df',
    module_id: '1db2992d-70f2-48c5-9f6e-c67a71f7198e',
    title: 'Buổi 4: Skills for Product Building',
    type: 'video',
    content: 'Skill là gì, khác prompt thường ở đâu. Skill cho brainstorm product, sharpen problem statement, MVP scoping, PRD review, acceptance criteria. Skill cho QA app, browser testing, pitch review, build review checklist. Ví dụ Superpowers hoặc MVP/product framework skill. Cách gọi skill đúng lúc trong IDE/agent workflow.',
    video_url: 'https://drive.google.com/file/d/buoi-4-skills-playbook',
    order_index: 5,
    start_date: '2026-08-12', // Buổi 5 in calendar
    target: 'Dạy skill như playbook tái sử dụng để AI hỗ trợ brainstorm, scope, QA, review và cải thiện sản phẩm ổn định hơn.',
    demo: 'Dùng skill để review PRD v2; tạo test checklist; dùng browser/testing skill để kiểm tra một flow sản phẩm.',
    scope: 'Nên tách riêng vì phần Skills khóa cũ bị dồn với MCP nên dễ quá tải.',
    has_materials: false
  },
  {
    id: 'a10719c6-edf1-4233-9438-f2e95c5b21c7',
    module_id: '1db2992d-70f2-48c5-9f6e-c67a71f7198e',
    title: 'Buổi 5: MCP for Product Building',
    type: 'video',
    content: 'MCP trong bức tranh agent/tool. MCP vs Skill vs API vs CLI vs Script. MCP cho design/prototype, browser/app testing, database/schema/docs, repo/GitHub, file/workspace context. Decision rule: khi nào MCP đáng dùng, khi nào không cần.',
    video_url: 'https://drive.google.com/file/d/buoi-5-mcp-integration',
    order_index: 6,
    start_date: '2026-08-08', // Buổi 4 in calendar
    target: 'Dạy MCP theo use case product: agent chạm vào tool/data/context để làm việc thật hơn.',
    demo: 'Agent dùng browser để test flow; dùng database/docs context để đề xuất schema hoặc kiểm tra lỗi; đọc repo/context để trả lời câu hỏi product/technical.',
    scope: 'Không đi sâu subagents, orchestration, remote agent setup. Các phần đó để workshop/khóa sau.',
    has_materials: false
  },
  
  // Phần 3
  {
    id: '34a95f25-be91-4627-943f-2e9ccdb1c747',
    module_id: 'faa519f6-b31c-4ae7-9377-46c041b9c065',
    title: 'Buổi 6: GitHub & Version Control',
    type: 'video',
    content: 'Repo, commit, branch, pull request ở mức non-tech cần hiểu. Issue -> change -> review -> commit -> deploy. AI review code/change. Rollback mindset. Repo hygiene: README, env example, folder structure, issue template, changelog đơn giản.',
    video_url: 'https://drive.google.com/file/d/buoi-6-github-versioning',
    order_index: 7,
    start_date: '2026-08-15', // Buổi 6
    target: 'Dùng GitHub như hệ thống kiểm soát thay đổi, không chỉ là nơi lưu code.',
    demo: 'Tạo issue cho bug/feature; agent sửa code; review diff; commit/push; trigger deploy.',
    scope: 'Không cần dạy Git command line sâu. Ưu tiên mental model + workflow thực dụng.',
    has_materials: false
  },
  {
    id: '352d4c69-bafd-4dbf-b234-abad86c07ad8',
    module_id: 'faa519f6-b31c-4ae7-9377-46c041b9c065',
    title: 'Buổi 7: Backend Decision Layer',
    type: 'video',
    content: 'Data layer trong app/product. Khi nào dùng Google Sheets, Firebase, Supabase, backend/API custom, hoặc chưa cần backend thật. So sánh theo độ dễ bắt đầu, realtime, auth, permission, SQL/noSQL, cost/free tier, scale, lock-in, AI/agent friendliness. Schema, CRUD, auth, permission/RLS ở mức non-tech cần hiểu.',
    video_url: 'https://drive.google.com/file/d/buoi-7-backend-layers',
    order_index: 8,
    start_date: '2026-08-19', // Buổi 7
    target: 'Giúp học viên biết chọn Google Sheets, Firebase, Supabase, hay backend thật theo nhu cầu sản phẩm.',
    demo: 'Một use case đơn giản được triển khai hoặc mô phỏng bằng Google Sheets/Firebase/Supabase để thấy trade-off; chọn một path chính để demo kỹ.',
    scope: 'Nên dạy decision-first, sau đó chọn một path demo chính để tránh quá rộng.',
    has_materials: false
  },
  
  // Phần 4
  {
    id: 'f7fa3d41-a0ef-4b39-8a3c-09457425963d',
    module_id: '13ded8da-92ef-4e27-b516-6493ee8743d8',
    title: 'Buổi 8: Deploy & Infra Landscape',
    type: 'video',
    content: 'Vercel: managed app hosting. Cloudflare: DNS/CDN/security/Pages/Workers/Tunnel. VPS: thuê server riêng, linh hoạt hơn nhưng phải tự chịu trách nhiệm. Docker: đóng gói app/service để chạy ổn định giữa môi trường khác nhau. SSH, env vars, secrets, domain, logs, local vs production. Khi nào không nên tự host.',
    video_url: 'https://drive.google.com/file/d/buoi-8-deploy-infra',
    order_index: 9,
    start_date: '2026-08-22', // Buổi 8
    target: 'Cho học viên hiểu bản đồ deploy/infra: Vercel, Cloudflare, VPS, Docker khác nhau ra sao và nên chọn gì.',
    demo: 'Deploy app lên Vercel; giải thích/trỏ domain qua Cloudflare; demo SSH vào VPS hoặc mô phỏng flow; demo Docker chạy service đơn giản.',
    scope: 'Không biến thành Docker/VPS hardcore. Mục tiêu là hiểu bản đồ và biết chọn đường.',
    has_materials: false
  },
  {
    id: '6acc4c45-e51a-4fdf-a1ca-25847522bdd8',
    module_id: '13ded8da-92ef-4e27-b516-6493ee8743d8',
    title: 'Buổi 9: Automation with n8n',
    type: 'video',
    content: 'Automation layer là gì. n8n cho form -> sheet/database -> notification; app data -> report; file upload -> OCR/summary; feedback -> action list; daily/weekly digest. Local n8n vs cloud/self-host/server n8n. Webhook, trigger, credential, node, workflow. Khi nào dùng n8n, khi nào dùng code/API/script.',
    video_url: 'https://drive.google.com/file/d/buoi-9-n8n-automation',
    order_index: 10,
    start_date: '2026-08-26', // Buổi 9
    target: 'Dùng automation để nối các mảnh sản phẩm/workspace và giảm việc lặp.',
    demo: 'Workflow mẫu: input/form -> data store -> Telegram/email/Slack notification -> summary. Có thể nối với Personal Work OS Lite.',
    scope: 'Core nên ưu tiên local/cloud demo; self-host/VPS để optional nếu lớp đủ nền.',
    has_materials: false
  }
];

const SEED_LESSON_SKILLS: LessonSkill[] = [
  { lesson_id: '1c69ea64-b83b-4519-a545-5030a8360163', skill_id: 'skill-problem' },
  { lesson_id: 'a1ba6fd1-5e99-4b0a-9ac1-3d667d63d96e', skill_id: 'skill-problem' },
  { lesson_id: '9bd3fd2c-ee49-4176-b951-42e70d4f48ff', skill_id: 'skill-ai' },
  { lesson_id: '8695373a-7625-4883-8a47-4a73c84cb3df', skill_id: 'skill-ai' },
  { lesson_id: 'a10719c6-edf1-4233-9438-f2e95c5b21c7', skill_id: 'skill-ai' },
  { lesson_id: '34a95f25-be91-4627-943f-2e9ccdb1c747', skill_id: 'skill-ui' },
  { lesson_id: '352d4c69-bafd-4dbf-b234-abad86c07ad8', skill_id: 'skill-ui' },
  { lesson_id: 'f7fa3d41-a0ef-4b39-8a3c-09457425963d', skill_id: 'skill-ui' },
  { lesson_id: '6acc4c45-e51a-4fdf-a1ca-25847522bdd8', skill_id: 'skill-ai' }
];

const SEED_ASSIGNMENTS: Assignment[] = [
  {
    id: 'ae000000-0000-0000-0000-000000000001',
    lesson_id: '1c69ea64-b83b-4519-a545-5030a8360163',
    description: 'MVP-to-Scale Gap Checklist cho project cá nhân; chọn project chính để đi xuyên suốt khóa.',
    rubric_checklist: [
      { item: 'Xác định rõ ràng 3 rủi ro kỹ thuật chính của dự án', checked: false },
      { item: 'Đưa ra checklist chuẩn bị scale từ MVP thô ban đầu', checked: false }
    ],
    scaffolding: {
      template_url: 'https://docs.google.com/spreadsheets/d/1nrOIqOfdtw83xzOYyRvEg1LETUd1h25fO57ZqL79Ji0/edit'
    }
  },
  {
    id: 'ae000000-0000-0000-0000-000000000002',
    lesson_id: 'a1ba6fd1-5e99-4b0a-9ac1-3d667d63d96e',
    description: 'PRD v2 + 4 flow draft cho main use case của project.',
    rubric_checklist: [
      { item: 'PRD v2 bao gồm đầy đủ Problem, User, Goal, Success Criteria, User Stories', checked: false },
      { item: 'Vẽ đủ và đúng 4 flow kỹ thuật bằng Mermaid hoặc công cụ tương đương', checked: false }
    ],
    scaffolding: {
      reference_link: 'https://the1ight.notion.site/PRD-Template-Vibe-Coding-101'
    }
  },
  {
    id: 'ae000000-0000-0000-0000-000000000003',
    lesson_id: '9bd3fd2c-ee49-4176-b951-42e70d4f48ff',
    description: 'Thêm hoặc sửa một feature nhỏ trong project bằng IDE/CLI workflow; ghi lại task/prompt và diff chính.',
    rubric_checklist: [
      { item: 'Sử dụng thành công IDE hoặc CLI (Cursor, Claude Code, Antigravity...) để thay đổi code', checked: false },
      { item: 'Ghi lại chi tiết prompt giao việc cho agent và tóm tắt cách review/chạy thử code', checked: false },
      { item: 'Chụp hình hoặc copy phần code diff chính sau khi thay đổi', checked: false }
    ],
    scaffolding: {}
  },
  {
    id: 'ae000000-0000-0000-0000-000000000004',
    lesson_id: '8695373a-7625-4883-8a47-4a73c84cb3df',
    description: 'Dùng ít nhất 1 skill để cải thiện PRD/app; nộp before/after.',
    rubric_checklist: [
      { item: 'Chọn được ít nhất 1 skill phù hợp để cải thiện sản phẩm', checked: false },
      { item: 'Nêu rõ sự khác biệt hoặc cải tiến cụ thể giữa trước và sau khi dùng skill (Before vs After)', checked: false }
    ],
    scaffolding: {}
  },
  {
    id: 'ae000000-0000-0000-0000-000000000005',
    lesson_id: 'a10719c6-edf1-4233-9438-f2e95c5b21c7',
    description: 'Chọn 1 MCP/MCP-like workflow để audit/test một phần project. Nếu setup nặng, dùng guided demo + worksheet.',
    rubric_checklist: [
      { item: 'Xác định đúng use case cần dùng MCP và cấu hình thành công công cụ bổ trợ', checked: false },
      { item: 'Mô tả chi tiết kết quả audit/test hoặc dữ liệu thu thập được thông qua MCP', checked: false }
    ],
    scaffolding: {}
  },
  {
    id: 'ae000000-0000-0000-0000-000000000006',
    lesson_id: '34a95f25-be91-4627-943f-2e9ccdb1c747',
    description: 'Một change trong project được track từ issue đến commit; repo có README hoặc project notes tối thiểu.',
    rubric_checklist: [
      { item: 'Tạo Issue mô tả tính năng/bug và liên kết với branch/PR tương ứng', checked: false },
      { item: 'Thực hiện commit và push thay đổi lên GitHub theo đúng chuẩn đặt tên', checked: false },
      { item: 'Repo GitHub có tài liệu README.md hoặc Project Notes cơ bản hướng dẫn chạy local', checked: false }
    ],
    scaffolding: {}
  },
  {
    id: 'ae000000-0000-0000-0000-000000000007',
    lesson_id: '352d4c69-bafd-4dbf-b234-abad86c07ad8',
    description: 'Backend decision matrix + data model/schema draft cho main use case.',
    rubric_checklist: [
      { item: 'Có bảng so sánh trade-off giữa các phương án Backend (Sheets, Firebase, Supabase, API custom...)', checked: false },
      { item: 'Thiết kế cấu trúc bảng (schema) với đầy đủ trường dữ liệu, kiểu dữ liệu và mối quan hệ giữa các bảng cho tính năng chính', checked: false }
    ],
    scaffolding: {}
  },
  {
    id: 'ae000000-0000-0000-0000-000000000008',
    lesson_id: 'f7fa3d41-a0ef-4b39-8a3c-09457425963d',
    description: 'Deployment plan cho project: platform, domain/DNS, env vars, rủi ro cần lưu ý.',
    rubric_checklist: [
      { item: 'Xác định rõ platform deploy (Vercel, Cloudflare Pages, VPS...) phù hợp với tech stack', checked: false },
      { item: 'Liệt kê đầy đủ các biến môi trường (.env) cần cấu hình trên môi trường production', checked: false },
      { item: 'Đưa ra phương án dự phòng (rollback plan) và giám sát logs nếu xảy ra lỗi', checked: false }
    ],
    scaffolding: {}
  },
  {
    id: 'ae000000-0000-0000-0000-000000000009',
    lesson_id: '6acc4c45-e51a-4fdf-a1ca-25847522bdd8',
    description: 'Một workflow n8n chạy được hoặc automation design đủ rõ nếu setup chưa kịp.',
    rubric_checklist: [
      { item: 'Xác định rõ Trigger node và các Action nodes trong quy trình', checked: false },
      { item: 'Thiết lập thành công kết nối (Credentials) và truyền nhận dữ liệu giữa các node chính xác', checked: false },
      { item: 'Chạy thử workflow thành công hoặc có bản mô tả luồng tự động hóa chi tiết, logic', checked: false }
    ],
    scaffolding: {}
  }
];

// Seed profiles
const SEED_PROFILES: Profile[] = [
  {
    id: 'c6b8a8b1-321a-4d2a-89a1-5d9f0f9b6b8a',
    full_name: 'Đặng Tuyết Hồng',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop',
    role: 'admin',
    telegram_id: '@dangtuyethong',
    gmail: 'dangtuyethong2324@gmail.com',
    phone_number: '0901234567',
    facebook_url: 'https://facebook.com/dangtuyethong2324',
    is_profile_completed: true,
    nautical_miles: 0,
    visits: 1,
    created_at: new Date('2024-09-01').toISOString()
  }
];

const SEED_MASTERY_RECORDS: MasteryRecord[] = [];

const SEED_SUBMISSIONS: Submission[] = [];

const SEED_TOPICS: DiscussionTopic[] = [
  {
    id: 'topic-onboarding',
    name: 'Onboarding Week',
    description: 'Nơi thảo luận và nộp các bài tập trong tuần Onboarding.',
    created_by: 'c6b8a8b1-321a-4d2a-89a1-5d9f0f9b6b8a',
    created_at: new Date('2024-09-01T00:00:00Z').toISOString()
  },
  {
    id: 'topic-live-class',
    name: 'Live Class',
    description: 'Nơi thảo luận và nộp bài tập của các buổi học trực tuyến (Live Sessions).',
    created_by: 'c6b8a8b1-321a-4d2a-89a1-5d9f0f9b6b8a',
    created_at: new Date('2024-09-01T00:00:00Z').toISOString()
  }
];

const SEED_POSTS: DiscussionPost[] = [];

const SEED_COMMENTS: Comment[] = [];

const SEED_TRANSACTIONS: NauticalMilesTransaction[] = [];

const SEED_PROFILE_BADGES: ProfileBadge[] = [];

const SEED_NOTIFICATIONS: NotificationLog[] = [];

const SEED_ANNOUNCEMENTS: Announcement[] = [];

const SEED_ONBOARDING_DAYS: OnboardingDay[] = ONBOARDING_DAYS_DATA;

const getPastDateString = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0] + 'T09:00:00.000Z';
};

const getFutureDateString = (daysAhead: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0] + 'T09:00:00.000Z';
};

const SEED_ONBOARDING_UNLOCK_SCHEDULES: OnboardingUnlockSchedule[] = [
  { day: 1, scheduled_at: getPastDateString(5), unlock_email_sent: true },
  { day: 2, scheduled_at: getPastDateString(3), unlock_email_sent: true },
  { day: 3, scheduled_at: getPastDateString(1), unlock_email_sent: true },
  { day: 4, scheduled_at: getFutureDateString(1), unlock_email_sent: false },
  { day: 5, scheduled_at: getFutureDateString(2), unlock_email_sent: false },
  { day: 6, scheduled_at: getFutureDateString(3), unlock_email_sent: false },
  { day: 7, scheduled_at: getFutureDateString(4), unlock_email_sent: false },
  { day: 8, scheduled_at: getFutureDateString(5), unlock_email_sent: false }
];

const SEED_CALENDAR_EVENTS: CalendarEvent[] = [
  // Kick-off Meeting
  { id: 'cal-1', title: 'KICK-OFF MEETING', time: '14:30', endTime: '16:30', date: 18, month: 6, year: 2026, colorClass: 'bg-red-600 text-white', type: 'class', eventType: 'kick-off', details: 'Kick-off Meeting\nOnline via Zoom\nSự kiện khởi động' },
  
  // Onboarding Week
  { id: 'cal-2', title: 'ONBOARDING', time: '00:00', allDay: true, date: 20, month: 6, year: 2026, colorClass: 'bg-violet-600 text-white', type: 'community', eventType: 'onboarding' },
  { id: 'cal-3', title: 'ONBOARDING', time: '00:00', allDay: true, date: 21, month: 6, year: 2026, colorClass: 'bg-violet-600 text-white', type: 'community', eventType: 'onboarding' },
  { id: 'cal-4', title: 'ONBOARDING', time: '00:00', allDay: true, date: 22, month: 6, year: 2026, colorClass: 'bg-violet-600 text-white', type: 'community', eventType: 'onboarding' },
  { id: 'cal-5', title: 'ONBOARDING', time: '00:00', allDay: true, date: 23, month: 6, year: 2026, colorClass: 'bg-violet-600 text-white', type: 'community', eventType: 'onboarding' },
  { id: 'cal-6', title: 'ONBOARDING', time: '00:00', allDay: true, date: 24, month: 6, year: 2026, colorClass: 'bg-violet-600 text-white', type: 'community', eventType: 'onboarding' },
  { id: 'cal-7', title: 'ONBOARDING', time: '00:00', allDay: true, date: 25, month: 6, year: 2026, colorClass: 'bg-violet-600 text-white', type: 'community', eventType: 'onboarding' },
  { id: 'cal-8', title: 'ONBOARDING', time: '00:00', allDay: true, date: 26, month: 6, year: 2026, colorClass: 'bg-violet-600 text-white', type: 'community', eventType: 'onboarding' },

  // Live Classes
  { id: 'cal-live-1', title: 'LIVE CLASS - BUỔI 01', time: '20:30', endTime: '22:30', date: 29, month: 6, year: 2026, colorClass: 'bg-orange-600 text-white', type: 'class', eventType: 'live-class', details: 'Buổi 01: Mindset: MVP -> Product có thể scale\nOnline via Zoom\nSự kiện học thuật' },
  { id: 'cal-live-2', title: 'LIVE CLASS - BUỔI 02', time: '14:30', endTime: '16:30', date: 1, month: 7, year: 2026, colorClass: 'bg-orange-600 text-white', type: 'class', eventType: 'live-class', details: 'Buổi 02: PRD kỹ thuật & 4 flow\nOnline via Zoom\nSự kiện học thuật' },
  { id: 'cal-live-3', title: 'LIVE CLASS - BUỔI 03', time: '20:30', endTime: '22:30', date: 5, month: 7, year: 2026, colorClass: 'bg-orange-600 text-white', type: 'class', eventType: 'live-class', details: 'Buổi 03: IDE (Codex, Visual Studio & Claude Code) + CLI Product Cockpit\nOnline via Zoom\nSự kiện học thuật' },
  { id: 'cal-live-4', title: 'LIVE CLASS - BUỔI 04', time: '14:30', endTime: '16:30', date: 8, month: 7, year: 2026, colorClass: 'bg-orange-600 text-white', type: 'class', eventType: 'live-class', details: 'Buổi 04: MCP for Product Building\nOnline via Zoom\nSự kiện học thuật' },
  { id: 'cal-live-5', title: 'LIVE CLASS - BUỔI 05', time: '20:30', endTime: '22:30', date: 12, month: 7, year: 2026, colorClass: 'bg-orange-600 text-white', type: 'class', eventType: 'live-class', details: 'Buổi 05: Skills for Product Building\nOnline via Zoom\nSự kiện học thuật' },
  { id: 'cal-live-6', title: 'LIVE CLASS - BUỔI 06', time: '14:30', endTime: '16:30', date: 15, month: 7, year: 2026, colorClass: 'bg-orange-600 text-white', type: 'class', eventType: 'live-class', details: 'Buổi 06: GitHub & Version Control\nOnline via Zoom\nSự kiện học thuật' },
  { id: 'cal-live-7', title: 'LIVE CLASS - BUỔI 07', time: '20:30', endTime: '22:30', date: 19, month: 7, year: 2026, colorClass: 'bg-orange-600 text-white', type: 'class', eventType: 'live-class', details: 'Buổi 07: Backend + Database\nOnline via Zoom\nSự kiện học thuật' },
  { id: 'cal-live-8', title: 'LIVE CLASS - BUỔI 08', time: '14:30', endTime: '16:30', date: 22, month: 7, year: 2026, colorClass: 'bg-orange-600 text-white', type: 'class', eventType: 'live-class', details: 'Buổi 08: Deploy & Infra Landscape\nOnline via Zoom\nSự kiện học thuật' },
  { id: 'cal-live-9', title: 'LIVE CLASS - BUỔI 09', time: '20:30', endTime: '22:30', date: 26, month: 7, year: 2026, colorClass: 'bg-orange-600 text-white', type: 'class', eventType: 'live-class', details: 'Buổi 09: Automation with n8n\nOnline via Zoom\nSự kiện học thuật' },
  
  // Tuần nghỉ - Build sản phẩm (27/08 - 04/09)
  { id: 'cal-break-1', title: 'TUẦN NGHỈ - BUILD SẢN PHẨM', time: '00:00', allDay: true, date: 27, month: 7, year: 2026, colorClass: 'bg-gray-500 text-white', type: 'other' },
  { id: 'cal-break-2', title: 'TUẦN NGHỈ - BUILD SẢN PHẨM', time: '00:00', allDay: true, date: 28, month: 7, year: 2026, colorClass: 'bg-gray-500 text-white', type: 'other' },
  { id: 'cal-break-3', title: 'TUẦN NGHỈ - BUILD SẢN PHẨM', time: '00:00', allDay: true, date: 29, month: 7, year: 2026, colorClass: 'bg-gray-500 text-white', type: 'other' },
  { id: 'cal-break-4', title: 'TUẦN NGHỈ - BUILD SẢN PHẨM', time: '00:00', allDay: true, date: 30, month: 7, year: 2026, colorClass: 'bg-gray-500 text-white', type: 'other' },
  { id: 'cal-break-5', title: 'TUẦN NGHỈ - BUILD SẢN PHẨM', time: '00:00', allDay: true, date: 31, month: 7, year: 2026, colorClass: 'bg-gray-500 text-white', type: 'other' },
  { id: 'cal-break-6', title: 'TUẦN NGHỈ - BUILD SẢN PHẨM', time: '00:00', allDay: true, date: 1, month: 8, year: 2026, colorClass: 'bg-gray-500 text-white', type: 'other' },
  { id: 'cal-break-7', title: 'TUẦN NGHỈ - BUILD SẢN PHẨM', time: '00:00', allDay: true, date: 2, month: 8, year: 2026, colorClass: 'bg-gray-500 text-white', type: 'other' },
  { id: 'cal-break-8', title: 'TUẦN NGHỈ - BUILD SẢN PHẨM', time: '00:00', allDay: true, date: 3, month: 8, year: 2026, colorClass: 'bg-gray-500 text-white', type: 'other' },
  { id: 'cal-break-9', title: 'TUẦN NGHỈ - BUILD SẢN PHẨM', time: '00:00', allDay: true, date: 4, month: 8, year: 2026, colorClass: 'bg-gray-500 text-white', type: 'other' },

  // Buổi 10
  { id: 'cal-live-10', title: 'LIVE CLASS - BUỔI 10', time: '14:30', endTime: '16:30', date: 5, month: 8, year: 2026, colorClass: 'bg-orange-600 text-white', type: 'class', eventType: 'live-class', details: 'Buổi 10: Demo hệ thống (theo request của học viên)\nOnline via Zoom\nSự kiện học thuật' },

  // Pitching Days
  { id: 'cal-pitch-1', title: 'PITCHING DAY 01', time: '14:30', endTime: '16:30', date: 12, month: 8, year: 2026, colorClass: 'bg-amber-600 text-white', type: 'class', eventType: 'capstone', details: 'Pitching Day 01\nOnline/Offline' },
  { id: 'cal-pitch-2', title: 'PITCHING DAY 02', time: '20:30', endTime: '22:30', date: 16, month: 8, year: 2026, colorClass: 'bg-amber-600 text-white', type: 'class', eventType: 'capstone', details: 'Pitching Day 02\nOnline/Offline' },
  { id: 'cal-pitch-3', title: 'PITCHING DAY 03', time: '14:30', endTime: '16:30', date: 19, month: 8, year: 2026, colorClass: 'bg-amber-600 text-white', type: 'class', eventType: 'capstone', details: 'Pitching Day 03\nOnline/Offline' },

  // Office Hours
  { id: 'cal-oh-1', title: 'OFFICE HOUR', time: '15:30', endTime: '16:30', date: 2, month: 7, year: 2026, colorClass: 'bg-blue-600 text-white', type: 'community', eventType: 'office-hour', details: 'Office Hour hỗ trợ học tập' },
  { id: 'cal-oh-2', title: 'OFFICE HOUR', time: '15:30', endTime: '16:30', date: 9, month: 7, year: 2026, colorClass: 'bg-blue-600 text-white', type: 'community', eventType: 'office-hour', details: 'Office Hour hỗ trợ học tập' },
  { id: 'cal-oh-3', title: 'OFFICE HOUR', time: '15:30', endTime: '16:30', date: 16, month: 7, year: 2026, colorClass: 'bg-blue-600 text-white', type: 'community', eventType: 'office-hour', details: 'Office Hour hỗ trợ học tập' },
  { id: 'cal-oh-4', title: 'OFFICE HOUR', time: '15:30', endTime: '16:30', date: 23, month: 7, year: 2026, colorClass: 'bg-blue-600 text-white', type: 'community', eventType: 'office-hour', details: 'Office Hour hỗ trợ học tập' },
  { id: 'cal-oh-5', title: 'OFFICE HOUR', time: '15:30', endTime: '16:30', date: 6, month: 8, year: 2026, colorClass: 'bg-blue-600 text-white', type: 'community', eventType: 'office-hour', details: 'Office Hour hỗ trợ học tập' },
  { id: 'cal-oh-6', title: 'OFFICE HOUR', time: '15:30', endTime: '16:30', date: 13, month: 8, year: 2026, colorClass: 'bg-blue-600 text-white', type: 'community', eventType: 'office-hour', details: 'Office Hour hỗ trợ học tập' }
];

const SEED_ABOUT_CONTENT: AboutContent = {
  overviewText: `Vibe Coding 201 là khoá học dành cho cựu học viên 101 và non-tech builder đã từng build bằng AI, nhưng muốn hiểu tech sâu hơn để tự tin xây sản phẩm với AI.`,
  scheduleText: `⚓ Lịch trình toàn khoá học:\n\nChặng 1: Kick-off Meeting - Cột mốc đầu tiên để bạn làm quen với đội ngũ điều phối, lộ trình khoá học và các nền tảng học tập.\n\nChặng 2: Onboarding Week - Chuỗi thử thách 07 ngày liên tục giúp làm quen với tinh thần học tập, trang bị kiến thức/mindset nền tảng và hình thành thói quen học tập hằng ngày.\n\nChặng 3: Live Class - Các buổi học online trực tiếp nghe giảng từ giảng viên kết hợp các buổi Office Hour hỗ trợ ngoài giờ học.\n\nChặng 4: Capstone Project - Chia sẻ sản phẩm của mình cho cả lớp vào cuối khoá học để nhận Certificate tốt nghiệp.`,
  benefitsText: `🎁 Quyền lợi học viên:\n- 1. Office Hour: Nhận hỗ trợ giải đáp thắc mắc trực tiếp ngoài giờ học từ giảng viên.\n- 2. Học lại khoá mới free: Nâng cấp tư duy và công nghệ hoàn toàn miễn phí.\n- 3. Tham gia Miễn phí 1ight Club: Cộng đồng tự chủ sự nghiệp cùng AI chuyên sâu.\n- 4. Tham gia Alumni Club: Không gian dành riêng cho cựu học sinh các khoá học tại The1ight.`
};

// ==========================================
// Context Provider Implementation
// ==========================================

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Clear legacy mock data cache from LocalStorage for Supabase version
  useEffect(() => {
    const isCleared = localStorage.getItem('lms_cache_cleared_v2');
    if (!isCleared) {
      const keysToRemove = [
        'lms_profiles', 
        'lms_submissions', 
        'lms_comments', 
        'lms_feedbacks', 
        'lms_discussion_posts', 
        'lms_discussion_topics', 
        'lms_nautical_transactions',
        'lms_profile_badges',
        'lms_active_user_id',
        'lms_is_authenticated'
      ];
      keysToRemove.forEach(k => localStorage.removeItem(k));
      localStorage.setItem('lms_cache_cleared_v2', 'true');
      window.location.reload();
    }
  }, []);
  // ── MASTER VERSION GUARD ─────────────────────────────────────────────────
  // Bump DB_VERSION whenever a breaking schema/seed change is made.
  // This auto-clears ALL localStorage so stale cached data never blocks updates.
  const DB_VERSION = 'lms_v21';
  const storedDbVersion = localStorage.getItem('lms_db_version');
  if (storedDbVersion !== DB_VERSION) {
    // Wipe everything except the active user preference
    const savedUserId = localStorage.getItem('lms_active_user_id');
    localStorage.clear();
    if (savedUserId) localStorage.setItem('lms_active_user_id', savedUserId);
    localStorage.setItem('lms_db_version', DB_VERSION);
    window.location.reload();
  }
  // ─────────────────────────────────────────────────────────────────────────

  // Load initial states from LocalStorage or use preloaded seed data
  const [activeUserId, setActiveUserId] = useState<string>(() => {
    return localStorage.getItem('lms_active_user_id') || 'f28c5a4d-7a6c-4b5b-86d7-e23a6b8c9d0e';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('lms_is_authenticated') === 'true';
  });

  const safeParse = <T,>(key: string, fallback: T): T => {
    try {
      const value = localStorage.getItem(key);
      if (!value || value === 'undefined') return fallback;
      return JSON.parse(value);
    } catch (e) {
      console.error(`Error parsing localStorage key "${key}":`, e);
      localStorage.removeItem(key);
      return fallback;
    }
  };

  const [profiles, setProfiles] = useState<Profile[]>(() => 
    safeParse('lms_profiles', SEED_PROFILES)
  );

  const [submissions, setSubmissions] = useState<Submission[]>(() => 
    safeParse('lms_submissions', SEED_SUBMISSIONS)
  );

  const [feedbacks, setFeedbacks] = useState<Feedback[]>(() => 
    safeParse('lms_feedbacks', [])
  );

  const [comments, setComments] = useState<Comment[]>(() => 
    safeParse('lms_comments', SEED_COMMENTS)
  );

  const [masteryRecords, setMasteryRecords] = useState<MasteryRecord[]>(() => 
    safeParse('lms_mastery_records', SEED_MASTERY_RECORDS)
  );

  const [nauticalTransactions, setNauticalTransactions] = useState<NauticalMilesTransaction[]>(() => 
    safeParse('lms_nautical_transactions', SEED_TRANSACTIONS)
  );

  const [profileBadges, setProfileBadges] = useState<ProfileBadge[]>(() => 
    safeParse('lms_profile_badges', SEED_PROFILE_BADGES)
  );

  const [notifications, setNotifications] = useState<NotificationLog[]>(() => 
    safeParse('lms_notifications', SEED_NOTIFICATIONS)
  );

  // Bump version to force reload the new syllabus lessons, modules, and assignments
  const SYLLABUS_VERSION = 'v201_v5';
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const currentVersion = localStorage.getItem('lms_syllabus_version');
    if (currentVersion !== SYLLABUS_VERSION) {
      localStorage.setItem('lms_syllabus_version', SYLLABUS_VERSION);
      localStorage.setItem('lms_lessons', JSON.stringify(SEED_LESSONS));
      localStorage.setItem('lms_modules', JSON.stringify(SEED_MODULES));
      localStorage.setItem('lms_assignments', JSON.stringify(SEED_ASSIGNMENTS));
      return SEED_LESSONS;
    }
    return safeParse('lms_lessons', SEED_LESSONS);
  });

  const [modules, setModules] = useState<Module[]>(() => 
    safeParse('lms_modules', SEED_MODULES)
  );

  const [assignments, setAssignments] = useState<Assignment[]>(() => 
    safeParse('lms_assignments', SEED_ASSIGNMENTS)
  );

  const [topics, setTopics] = useState<DiscussionTopic[]>(() => {
    const cached = safeParse('lms_discussion_topics', SEED_TOPICS);
    if (cached.some(t => t.id === 'topic-light-support')) {
      localStorage.setItem('lms_discussion_topics', JSON.stringify(SEED_TOPICS));
      return SEED_TOPICS;
    }
    return cached;
  });

  const [discussionPosts, setDiscussionPosts] = useState<DiscussionPost[]>(() => 
    safeParse('lms_discussion_posts', SEED_POSTS)
  );

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => 
    safeParse('lms_announcements', SEED_ANNOUNCEMENTS)
  );

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => 
    safeParse('lms_calendar_events', SEED_CALENDAR_EVENTS)
  );

  const [onboardingDays, setOnboardingDays] = useState<OnboardingDay[]>(() => {
    const parsed = safeParse('lms_onboarding_days', SEED_ONBOARDING_DAYS);
    const hasOutdatedTitle = parsed.some(d => d.day === 2 && d.title.includes("Làm quen với viết"));
    const hasOutdatedChecklist = parsed.some(d => d.checklist.includes("Xác nhận hoàn thành"));
    const isMissingDay8 = parsed.length < 8;
    const isMissingTelegramTask = !parsed.some(d => d.day === 1 && d.checklist.includes("Telegram"));
    if (hasOutdatedTitle || hasOutdatedChecklist || isMissingDay8 || isMissingTelegramTask) {
      localStorage.removeItem('lms_onboarding_days');
      return SEED_ONBOARDING_DAYS;
    }
    return parsed;
  });

  const [onboardingUnlockSchedules, setOnboardingUnlockSchedules] = useState<OnboardingUnlockSchedule[]>(() => {
    const parsed = safeParse('lms_onboarding_unlock_schedules', SEED_ONBOARDING_UNLOCK_SCHEDULES);
    if (parsed.length < 8) {
      localStorage.removeItem('lms_onboarding_unlock_schedules');
      return SEED_ONBOARDING_UNLOCK_SCHEDULES;
    }
    return parsed;
  });

  const [aboutContent, setAboutContent] = useState<AboutContent>(() => 
    safeParse('lms_about_content', SEED_ABOUT_CONTENT)
  );

  const [batches, setBatches] = useState<Batch[]>(() => 
    safeParse('lms_batches', SEED_BATCHES)
  );

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('lms_active_user_id', activeUserId);
  }, [activeUserId]);

  useEffect(() => {
    localStorage.setItem('lms_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('lms_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('lms_feedbacks', JSON.stringify(feedbacks));
  }, [feedbacks]);

  useEffect(() => {
    localStorage.setItem('lms_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('lms_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('lms_calendar_events', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    localStorage.setItem('lms_onboarding_days', JSON.stringify(onboardingDays));
  }, [onboardingDays]);

  useEffect(() => {
    localStorage.setItem('lms_onboarding_unlock_schedules', JSON.stringify(onboardingUnlockSchedules));
  }, [onboardingUnlockSchedules]);

  useEffect(() => {
    localStorage.setItem('lms_about_content', JSON.stringify(aboutContent));
  }, [aboutContent]);

  useEffect(() => {
    localStorage.setItem('lms_mastery_records', JSON.stringify(masteryRecords));
  }, [masteryRecords]);

  useEffect(() => {
    localStorage.setItem('lms_nautical_transactions', JSON.stringify(nauticalTransactions));
  }, [nauticalTransactions]);

  useEffect(() => {
    localStorage.setItem('lms_batches', JSON.stringify(batches));
  }, [batches]);

  useEffect(() => {
    localStorage.setItem('lms_profile_badges', JSON.stringify(profileBadges));
  }, [profileBadges]);

  useEffect(() => {
    localStorage.setItem('lms_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('lms_discussion_topics', JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    localStorage.setItem('lms_discussion_posts', JSON.stringify(discussionPosts));
  }, [discussionPosts]);

  useEffect(() => {
    localStorage.setItem('lms_lessons', JSON.stringify(lessons));
  }, [lessons]);

  useEffect(() => {
    localStorage.setItem('lms_modules', JSON.stringify(modules));
  }, [modules]);

  useEffect(() => {
    localStorage.setItem('lms_assignments', JSON.stringify(assignments));
  }, [assignments]);

  // ── Supabase Auth Synchronization ────────────────────────────────────────
  useEffect(() => {
    // Check for active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSupabaseSession(session);
    });

    // Listen to authentication changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      handleSupabaseSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // ── Sync Database State from Supabase ──────────────────────────────────
  const fetchDatabaseState = async () => {
    try {
      console.log('Bắt đầu tải dữ liệu thực tế từ Supabase...');
      
      const [
        resProfiles,
        resModules,
        resLessons,
        resAssignments,
        resSubmissions,
        resFeedbacks,
        resComments,
        resNauticalMiles,
        resProfileBadges,
        resAnnouncements,
        resCalendarEvents,
        resOnboardingDays,
        resUnlockSchedules,
        resBatches,
      ] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('modules').select('*').order('order_index', { ascending: true }),
        supabase.from('lessons').select('*').order('order_index', { ascending: true }),
        supabase.from('assignments').select('*'),
        supabase.from('submissions').select('*').order('created_at', { ascending: false }),
        supabase.from('feedbacks').select('*'),
        supabase.from('comments').select('*').order('created_at', { ascending: true }),
        supabase.from('nautical_miles_transactions').select('*').order('created_at', { ascending: false }),
        supabase.from('profile_badges').select('*'),
        supabase.from('announcements').select('*').order('created_at', { ascending: false }),
        supabase.from('calendar_events').select('*'),
        supabase.from('onboarding_days').select('*').order('day', { ascending: true }),
        supabase.from('onboarding_unlock_schedules').select('*').order('day', { ascending: true }),
        supabase.from('batches').select('*'),
      ]);

      const resTopics = { data: [] };
      const resDiscussionPosts = { data: [] };

      if (resProfiles.data && resProfiles.data.length > 0) {
        setProfiles(prev => {
          const fetchedProfiles = resProfiles.data as Profile[];
          const newProfiles = fetchedProfiles.map(dbP => {
            const existing = prev.find(p => p.id === dbP.id);
            // Nếu local đang lưu là admin (được cấp quyền ở quá trình đăng nhập) thì bảo toàn quyền admin
            if (existing && existing.role === 'admin' && dbP.role !== 'admin') {
              return { ...dbP, role: 'admin' as UserRole };
            }
            return dbP;
          });
          
          // Giữ lại profile đang được active ở local (nhưng do lỗi insert chưa kịp lên DB)
          prev.forEach(p => {
            if (!newProfiles.some(np => np.id === p.id)) {
              newProfiles.push(p);
            }
          });
          
          return newProfiles;
        });
      }
      if (resModules.data && resModules.data.length > 0) setModules(resModules.data);
      if (resLessons.data && resLessons.data.length > 0) setLessons(resLessons.data);
      if (resAssignments.data && resAssignments.data.length > 0) setAssignments(resAssignments.data);
      
      // Submissions, feedbacks, comments can be empty array if no student worked yet
      if (resSubmissions.data) setSubmissions(resSubmissions.data);
      if (resFeedbacks.data) setFeedbacks(resFeedbacks.data);
      if (resComments.data) setComments(resComments.data);
      if (resNauticalMiles.data) setNauticalTransactions(resNauticalMiles.data);
      if (resProfileBadges.data) setProfileBadges(resProfileBadges.data);
      if (resAnnouncements.data) setAnnouncements(resAnnouncements.data);
      if (resCalendarEvents.data) setCalendarEvents(resCalendarEvents.data);
      if (resOnboardingDays.data && resOnboardingDays.data.length > 0) setOnboardingDays(resOnboardingDays.data);
      if (resUnlockSchedules.data && resUnlockSchedules.data.length > 0) setOnboardingUnlockSchedules(resUnlockSchedules.data);
      if (resTopics.data && resTopics.data.length > 0) setTopics(resTopics.data);
      if (resDiscussionPosts.data) setDiscussionPosts(resDiscussionPosts.data);
      if (resBatches.data && resBatches.data.length > 0) setBatches(resBatches.data);

      console.log('Đã tải xong toàn bộ dữ liệu thực tế từ Supabase.');
    } catch (e) {
      console.error('Lỗi khi tải dữ liệu từ Supabase:', e);
    }
  };

  useEffect(() => {
    fetchDatabaseState();
  }, [isAuthenticated]);

  const handleSupabaseSession = async (session: any) => {
    if (session?.user) {
      const user = session.user;
      const userEmail = user.email || '';
      const userId = user.id;

      // Check if profile exists on Supabase Database
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      let activeProfile: Profile;

      // Check admin emails list
      const adminEmails = ['dangtuyethong2324@gmail.com'];
      const isAdminEmail = adminEmails.includes(userEmail.toLowerCase());

      // Read requested role from localStorage
      const preferredRole = localStorage.getItem('lms_signing_in_role') as UserRole || 'student';
      if (localStorage.getItem('lms_signing_in_role')) {
        localStorage.removeItem('lms_signing_in_role');
      }

      const finalRoleRequested = (isAdminEmail || preferredRole === 'admin') ? 'admin' : 'student';

      if (error || !profile) {
        // Create new profile locally & on Supabase
        const newProfile: Profile = {
          id: userId,
          full_name: user.user_metadata?.full_name || userEmail.split('@')[0],
          avatar_url: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userEmail)}`,
          role: finalRoleRequested,
          telegram_id: '',
          gmail: userEmail,
          phone_number: '',
          facebook_url: '',
          is_profile_completed: false,
          nautical_miles: 0,
          visits: 1,
          created_at: new Date().toISOString()
        };

        // Attempt to insert into Supabase
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { visits, ...profileToInsert } = newProfile;
        const { data: insertedData, error: insertError } = await supabase
          .from('profiles')
          .insert([profileToInsert])
          .select()
          .maybeSingle();

        if (insertError) {
          console.error('Lỗi khi lưu profile mới lên Supabase:', insertError);
          activeProfile = newProfile;
        } else {
          activeProfile = (insertedData as Profile) || newProfile;
        }
      } else {
        activeProfile = profile as Profile;
        // Automatically upgrade/sync role if requested role is admin
        if (activeProfile.role !== finalRoleRequested && finalRoleRequested === 'admin') {
          activeProfile.role = 'admin'; // Override in memory immediately for correct routing
          // Try to sync with DB
          await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', userId);
        }
      }

      // Sync React State
      setProfiles(prev => {
        const exists = prev.some(p => p.id === activeProfile.id);
        if (exists) {
          return prev.map(p => p.id === activeProfile.id ? activeProfile : p);
        }
        return [...prev, activeProfile];
      });

      setActiveUserId(activeProfile.id);
      setIsAuthenticated(true);
      localStorage.setItem('lms_active_user_id', activeProfile.id);
      localStorage.setItem('lms_is_authenticated', 'true');
    }
  };

  const loginWithSupabaseGoogle = async (role: UserRole = 'student') => {
    localStorage.setItem('lms_signing_in_role', role);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      console.error('Lỗi Supabase signInWithOAuth:', error.message);
      throw error;
    }
  };

  // Derived Active User object
  const activeUser = profiles.find(p => p.id === activeUserId) || profiles[0];

  // Auto unlock current level badges on activeUser changes (silently on load)
  useEffect(() => {
    if (!activeUser || !activeUser.id) return;
    
    // Auto-unlock silently based on profile completion
    if (activeUser.is_profile_completed) {
      unlockBadge(activeUser.id, 'bada0000-0000-0000-0000-000000000001', true);
    }

    const miles = activeUser.nautical_miles || 0;
    // Auto-unlock silently based on miles
    if (miles >= 5000) unlockBadge(activeUser.id, 'bada0000-0000-0000-0000-000000000105', true);
    if (miles >= 3001) unlockBadge(activeUser.id, 'bada0000-0000-0000-0000-000000000104', true);
    if (miles >= 1501) unlockBadge(activeUser.id, 'bada0000-0000-0000-0000-000000000103', true);
    if (miles >= 501) unlockBadge(activeUser.id, 'bada0000-0000-0000-0000-000000000102', true);
    if (miles >= 0) unlockBadge(activeUser.id, 'bada0000-0000-0000-0000-000000000101', true);
  }, [activeUser?.id, activeUser?.nautical_miles, activeUser?.is_profile_completed]);

  // Switch role action helper
  const switchUser = (role: UserRole) => {
    if (role === 'admin' || role === 'mentor') {
      setActiveUserId('c6b8a8b1-321a-4d2a-89a1-5d9f0f9b6b8a');
    } else {
      setActiveUserId('f28c5a4d-7a6c-4b5b-86d7-e23a6b8c9d0e');
    }
  };

  const loginWithGmail = (email: string, role: UserRole = 'student'): Profile | null => {
    const cleanEmail = email.trim().toLowerCase();
    const existingUser = profiles.find(p => p.gmail.toLowerCase() === cleanEmail);
    
    if (existingUser) {
      setActiveUserId(existingUser.id);
      setIsAuthenticated(true);
      localStorage.setItem('lms_active_user_id', existingUser.id);
      localStorage.setItem('lms_is_authenticated', 'true');
      return existingUser;
    } else {
      // Create a new profile with selected role (UUID format)
      const newId = generateUUID();
      const newProfile: Profile = {
        id: newId,
        full_name: email.split('@')[0], // default name from email prefix
        avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
        role: role,
        telegram_id: '',
        gmail: cleanEmail,
        phone_number: '',
        facebook_url: '',
        is_profile_completed: false,
        nautical_miles: 0,
        visits: 1,
        created_at: new Date().toISOString()
      };
      
      setProfiles(prev => [...prev, newProfile]);
      setActiveUserId(newId);
      setIsAuthenticated(true);
      localStorage.setItem('lms_active_user_id', newId);
      localStorage.setItem('lms_is_authenticated', 'true');
      return newProfile;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    localStorage.removeItem('lms_is_authenticated');
  };

  // Profile management
  const updateProfile = async (profileId: string, updates: Partial<Profile>): Promise<boolean> => {
    let completedNow = false;

    setProfiles(prev => prev.map(p => {
      if (p.id === profileId) {
        const updated = { ...p, ...updates };
        
        // Rules Engine check: profile completion
        // If explicitly set to true in updates, or satisfies all requirements
        const fulfillsAllRequirements = !!(updated.gmail && updated.phone_number && updated.facebook_url && updated.industry && updated.current_job && updated.product_idea);
        
        if (updates.is_profile_completed === true || (!p.is_profile_completed && fulfillsAllRequirements)) {
          if (!p.is_profile_completed) {
            completedNow = true;
          }
          updated.is_profile_completed = true;
        }
        
        return updated;
      }
      return p;
    }));

    if (completedNow) {
      // Award miles
      addNauticalMiles(profileId, 50, 'profile_completion', 'Hoàn thành 100% hồ sơ cá nhân lần đầu');
      
      // Award badge
      unlockBadge(profileId, 'bada0000-0000-0000-0000-000000000001');
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profileId);
      if (error) {
        console.error('Lỗi khi cập nhật profile lên Supabase:', error);
        return false;
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // Helper to add Nautical Miles
  const addNauticalMiles = async (studentId: string, amount: number, actionType: NauticalMilesTransaction['action_type'], description: string, referenceId?: string) => {
    // Add transaction
    const newTx: NauticalMilesTransaction = {
      id: generateUUID(),
      student_id: studentId,
      amount,
      action_type: actionType,
      reference_id: referenceId,
      description,
      created_at: new Date().toISOString()
    };
    setNauticalTransactions(prev => [newTx, ...prev]);

    // Update profile balance
    setProfiles(prev => prev.map(p => {
      if (p.id === studentId) {
        const newMiles = p.nautical_miles + amount;
        
        // Cập nhật nốt nautical_miles của profile lên Supabase
        supabase.from('profiles').update({ nautical_miles: newMiles }).eq('id', studentId).then(({ error }) => {
          if (error) console.error('Lỗi khi cập nhật nautical_miles của profile:', error);
        });

        // Auto unlock level milestone badges (with notification)
        if (newMiles >= 5000) unlockBadge(studentId, 'bada0000-0000-0000-0000-000000000105', false);
        else if (newMiles >= 3001) unlockBadge(studentId, 'bada0000-0000-0000-0000-000000000104', false);
        else if (newMiles >= 1501) unlockBadge(studentId, 'bada0000-0000-0000-0000-000000000103', false);
        else if (newMiles >= 501) unlockBadge(studentId, 'bada0000-0000-0000-0000-000000000102', false);
        else if (newMiles >= 0) unlockBadge(studentId, 'bada0000-0000-0000-0000-000000000101', false);

        return { ...p, nautical_miles: newMiles };
      }
      return p;
    }));

    try {
      const { error } = await supabase
        .from('nautical_miles_transactions')
        .insert([newTx]);
      if (error) console.error('Lỗi khi lưu nautical miles transaction lên Supabase:', error);
    } catch (e) {
      console.error(e);
    }
  };

  // Helper to unlock badge
  const unlockBadge = async (studentId: string, badgeId: string, silent: boolean = false) => {
    const alreadyUnlocked = profileBadges.some(pb => pb.student_id === studentId && pb.badge_id === badgeId);
    if (alreadyUnlocked) return;

    const newPB = { student_id: studentId, badge_id: badgeId, unlocked_at: new Date().toISOString() };

    setProfileBadges(prev => {
      const exists = prev.some(pb => pb.student_id === studentId && pb.badge_id === badgeId);
      if (exists) return prev;
      
      const badge = SEED_BADGES.find(b => b.id === badgeId);
      
      if (!silent) {
        addNotification(
          'Huy hiệu được mở khóa!',
          `Chúc mừng bạn đã mở khóa huy hiệu ${badge?.icon} "${badge?.name}"!`,
          'system'
        );

        // Telegram notification mimic
        const student = profiles.find(p => p.id === studentId);
        addNotification(
          '📢 Telegram Wall of Fame Bot',
          `⚓ THÀNH TỰU HẢI TRÌNH: Thủy thủ ${student?.full_name} (${student?.gmail}) vừa xuất sắc thu về Huy hiệu ${badge?.icon} **${badge?.name}**! Gió đang thổi căng buồm!`,
          'telegram'
        );
      }

      return [...prev, newPB];
    });

    try {
      const { error } = await supabase
        .from('profile_badges')
        .insert([newPB]);
      if (error) console.error('Lỗi khi lưu profile badge lên Supabase:', error);
    } catch (e) {
      console.error(e);
    }
  };

  // Helper to add notification log
  const addNotification = (title: string, message: string, type: 'telegram' | 'system' = 'system') => {
    const newLog: NotificationLog = {
      id: `ntf-${Math.random().toString(36).substr(2, 9)}`,
      title,
      message,
      type,
      created_at: new Date().toISOString()
    };
    setNotifications(prev => [newLog, ...prev]);
  };

  // ==========================================
  // Student Actions
  // ==========================================

  const submitAssignment = (assignmentId: string, content: string) => {
    const existingIndex = submissions.findIndex(s => s.assignment_id === assignmentId && s.student_id === activeUserId);
    const id = existingIndex >= 0 ? submissions[existingIndex].id : generateUUID();
    
    const newSubmission: Submission = {
      id,
      assignment_id: assignmentId,
      batch_id: 'b0000003-0000-0000-0000-000000000003',
      student_id: activeUserId,
      content,
      status: 'submitted',
      created_at: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      setSubmissions(prev => prev.map((s, idx) => idx === existingIndex ? newSubmission : s));
    } else {
      setSubmissions(prev => [newSubmission, ...prev]);
      
      // Award Nautical Miles
      addNauticalMiles(activeUserId, 50, 'assignment_submitted', 'Nộp bài tập đúng hạn', id);
      
      // Rules Engine check: Iron Anchor Streak
      const studentSubs = [...submissions, newSubmission]
        .filter(s => s.student_id === activeUserId && s.status !== 'draft')
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        
      if (studentSubs.length >= 3) {
        unlockBadge(activeUserId, 'bada0000-0000-0000-0000-000000000003');
      }

      addNotification(
        'Nộp bài thành công',
        'Bài làm của bạn đã được đưa lên luồng thảo luận chung để chờ đánh giá.',
        'system'
      );

      // Telegram notification mimic
      addNotification(
        '📢 Telegram Notification Bot',
        `📝 Nộp Bài Tập: Thủy thủ ${activeUser.full_name} (${activeUser.gmail}) vừa thả neo nộp bài tập. Chờ Mentor Đặng Tuyết Hồng duyệt!`,
        'telegram'
      );
    }

    // Upsert lên Supabase
    supabase.from('submissions').upsert({
      id,
      assignment_id: assignmentId,
      batch_id: 'b0000003-0000-0000-0000-000000000003',
      student_id: activeUserId,
      content,
      status: 'submitted',
      created_at: newSubmission.created_at
    }).then(({ error }) => {
      if (error) console.error('Lỗi khi nộp bài tập lên Supabase:', error.message);
    });
  };

  const completeLesson = (lessonId: string) => {
    // Add NM for learning completion
    addNauticalMiles(activeUserId, 5, 'lesson_complete', `Đã học xong: ${lessons.find(l => l.id === lessonId)?.title || lessonId}`);
    
    // Check for Treasure Map badge
    // (requires all lessons to be completed, or simply mimics completion logic here)
    const completedLessonTx = nauticalTransactions.filter(t => t.student_id === activeUserId && t.action_type === 'lesson_complete');
    if (completedLessonTx.length + 1 >= SEED_LESSONS.length) {
      unlockBadge(activeUserId, 'bada0000-0000-0000-0000-000000000006');
    }
  };

  const addComment = async (submissionId: string, commentText: string) => {
    const newComment: Comment = {
      id: generateUUID(),
      submission_id: submissionId,
      batch_id: 'b0000003-0000-0000-0000-000000000003',
      author_id: activeUserId,
      content: commentText,
      upvotes_count: 0,
      is_verified: false,
      created_at: new Date().toISOString(),
      upvoted_by: []
    };

    setComments(prev => [...prev, newComment]);

    const { error } = await supabase.from('comments').insert([newComment]);
    if (error) console.error('Lỗi khi lưu comment lên Supabase:', error.message);
    
    // Reward for active crew collaboration
    addNauticalMiles(activeUserId, 5, 'comment_added', 'Bình luận thảo luận chéo bài nộp đồng đội', newComment.id);
  };

  const upvoteComment = async (commentId: string) => {
    let updatedComment: Comment | null = null;
    
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        const upvotedByList = c.upvoted_by || [];
        const index = upvotedByList.indexOf(activeUserId);
        
        let diff = 1;
        let newList = [...upvotedByList];
        
        if (index >= 0) {
          diff = -1;
          newList.splice(index, 1);
        } else {
          newList.push(activeUserId);
        }

        const newUpvotes = c.upvotes_count + diff;
        
        // Award miles to comment author if upvoted
        if (diff > 0 && c.author_id !== activeUserId) {
          addNauticalMiles(c.author_id, 10, 'comment_upvoted', 'Bình luận nhận được 1 Upvote từ đồng đội', c.id);
          
          // Badge Check: Lifebuoy (50 upvotes)
          const authorComments = prev.filter(x => x.author_id === c.author_id);
          const totalUpvotes = authorComments.reduce((acc, curr) => acc + curr.upvotes_count, 0) + 1;
          if (totalUpvotes >= 50) {
            unlockBadge(c.author_id, 'bada0000-0000-0000-0000-000000000004');
          }
        }

        updatedComment = { ...c, upvotes_count: newUpvotes, upvoted_by: newList };
        return updatedComment;
      }
      return c;
    }));

    if (updatedComment) {
      const { error } = await supabase
        .from('comments')
        .update({
          upvotes_count: (updatedComment as Comment).upvotes_count,
          upvoted_by: (updatedComment as Comment).upvoted_by
        })
        .eq('id', commentId);
      if (error) console.error('Lỗi khi cập nhật upvote comment lên Supabase:', error.message);
    }
  };

  // ==========================================
  // Mentor / Admin Actions
  // ==========================================

  const gradeSubmission = (
    submissionId: string,
    feedbackContent: string,
    grade: 'needs_improvement' | 'meets_expectations' | 'excellent'
  ) => {
    // 1. Add feedback record
    const newFeedback: Feedback = {
      id: `fb-${Math.random().toString(36).substr(2, 9)}`,
      submission_id: submissionId,
      mentor_id: activeUserId,
      content: feedbackContent,
      mastery_level: grade,
      created_at: new Date().toISOString()
    };
    setFeedbacks(prev => [newFeedback, ...prev]);

    // 2. Update submission status to 'graded'
    let studentId = '';
    let assignmentId = '';
    setSubmissions(prev => prev.map(s => {
      if (s.id === submissionId) {
        studentId = s.student_id;
        assignmentId = s.assignment_id;
        return { ...s, status: 'graded' };
      }
      return s;
    }));

    if (!studentId) return;

    // 3. Award Nautical Miles based on grade
    const amount = grade === 'excellent' ? 150 : 100;
    addNauticalMiles(studentId, amount, 'assignment_graded', `Bài tập được đánh giá: ${grade === 'excellent' ? 'Xuất sắc (Mastery)' : 'Đạt (Meets Expectations)'}`, submissionId);

    // 4. Update competency framework level (MasteryRecord)
    // Find skill mapped to this lesson/assignment
    const mappedSkills = SEED_LESSON_SKILLS.filter(ls => {
      // Find lesson associated with assignment
      const assg = SEED_ASSIGNMENTS.find(a => a.id === assignmentId);
      return ls.lesson_id === assg?.lesson_id;
    });

    if (mappedSkills.length > 0) {
      setMasteryRecords(prev => {
        let updated = [...prev];
        mappedSkills.forEach(ms => {
          const idx = updated.findIndex(r => r.student_id === studentId && r.skill_id === ms.skill_id);
          
          let nextLevel: MasteryLevel = 'meets_expectations';
          if (grade === 'excellent') nextLevel = 'excellent';
          if (grade === 'needs_improvement') nextLevel = 'needs_improvement';

          if (idx >= 0) {
            updated[idx] = {
              ...updated[idx],
              mastery_level: nextLevel,
              last_updated: new Date().toISOString()
            };
          } else {
            updated.push({
              student_id: studentId,
              skill_id: ms.skill_id,
              mastery_level: nextLevel,
              last_updated: new Date().toISOString()
            });
          }
        });
        return updated;
      });
    }

    // 5. Special badge checks
    if (grade === 'excellent') {
      unlockBadge(studentId, 'bada0000-0000-0000-0000-000000000005');
    }

    // 6. Notify student
    const studentObj = profiles.find(p => p.id === studentId);
    addNotification(
      'Bài nộp đã được chấm điểm',
      `Mentor Đặng Tuyết Hồng đã đánh giá bài tập của bạn ở mức: ${grade === 'excellent' ? 'Xuất sắc ⭐' : 'Đạt ✅'}. Xem feedback chi tiết ngay!`,
      'system'
    );

    // Telegram Bot mimic
    addNotification(
      '📢 Telegram Wall of Fame Bot',
      `🏆 MASTERY UPDATE: Thủy thủ ${studentObj?.full_name} (${studentObj?.gmail}) vừa đạt chứng nhận **${grade === 'excellent' ? 'Xuất sắc (Mastery)' : 'Đạt (Meets Expectations)'}** cho thử thách PRD/Automation! Được thưởng +${amount} Hải lý!`,
      'telegram'
    );

    // 7. Auto-post mentor feedback as a comment under the student's submission post on Discussion Board
    const commentId = generateUUID();
    const gradeLabel = grade === 'excellent' ? 'Xuất sắc ⭐' : grade === 'meets_expectations' ? 'Đạt yêu cầu ✅' : 'Cần cải thiện ⚠️';
    const newComment: Comment = {
      id: commentId,
      submission_id: submissionId,
      batch_id: 'b0000003-0000-0000-0000-000000000003',
      author_id: activeUserId,
      content: `📝 **Đánh giá từ Mentor (${gradeLabel}):**\n\n${feedbackContent}`,
      upvotes_count: 0,
      is_verified: true,
      created_at: new Date().toISOString(),
      upvoted_by: []
    };

    setComments(prev => [...prev, newComment]);

    supabase.from('comments').insert([newComment]).then(({ error }) => {
      if (error) console.error('Lỗi khi lưu comment tự động lên Supabase:', error.message);
    });

    // 8. Tự động tạo thông báo (Announcement) và gửi email cho học viên
    const assg = assignments.find(a => a.id === assignmentId);
    const les = assg ? lessons.find(l => l.id === assg.lesson_id) : null;
    const lessonTitle = les?.title || 'Bài tập';
    const studentName = studentObj?.full_name || 'Học viên';
    const studentGmail = studentObj?.gmail;

    const newAnn: Announcement = {
      id: `ann-${Math.random().toString(36).substr(2, 9)}`,
      title: `[Nhận xét bài tập] ${lessonTitle} - ${studentName}`,
      content: `Chào ${studentName},\n\nBài tập "${lessonTitle}" của bạn đã được giáo viên nhận xét chi tiết.\n\n- Mức độ thành thạo: ${gradeLabel}\n- Nội dung nhận xét: ${feedbackContent}\n\nBạn hãy vào xem chi tiết bài làm và nhận xét tại mục Lộ trình học nhé!`,
      author: 'Giáo viên',
      created_by: activeUserId,
      send_email: true,
      sent_email_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      isNew: true
    };

    setAnnouncements(prev => [newAnn, ...prev]);

    supabase.from('announcements').insert([newAnn]).then(({ error }) => {
      if (error) console.error('Lỗi khi lưu thông báo nhận xét bài lên Supabase:', error.message);
    });

    if (studentGmail) {
      addNotification(
        '📢 Email Bot',
        `📧 ĐÃ GỬI EMAIL: [Nhận xét bài tập: ${lessonTitle}] tới học viên: ${studentName} (${studentGmail})`,
        'telegram'
      );
    }

    // Lưu feedback lên Supabase và cập nhật status của submission
    supabase.from('feedbacks').insert([newFeedback]).then(({ error }) => {
      if (error) console.error('Lỗi khi lưu feedback lên Supabase:', error.message);
    });
    supabase.from('submissions').update({ status: 'graded' }).eq('id', submissionId).then(({ error }) => {
      if (error) console.error('Lỗi khi cập nhật status của submission trên Supabase:', error.message);
    });
  };

  const verifyComment = (commentId: string) => {
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        if (c.is_verified) return c; // already verified
        
        // Award massive miles to verified savior
        addNauticalMiles(c.author_id, 200, 'comment_verified', 'Nhận Tích Xanh (Verified) cứu nét đồng đội từ Mentor', commentId);
        
        // Notify Author
        const authorObj = profiles.find(p => p.id === c.author_id);
        addNotification(
          'Đồng đội cứu net!',
          `Mentor đã trao Tích Xanh "Verified" cho câu trả lời của bạn. +200 Hải lý danh giá!`,
          'system'
        );

        // Telegram Bot mimic
        addNotification(
          '📢 Telegram Wall of Fame Bot',
          `🛟 CỨU NÉT THÀNH CÔNG: Thủy thủ ${authorObj?.full_name} (${authorObj?.gmail}) vừa nhận Tích Xanh lá cờ hiệu từ Mentor Đặng Tuyết Hồng vì pha giải cứu đồng đội xuất sắc!`,
          'telegram'
        );

        // Cập nhật trạng thái is_verified lên Supabase
        supabase.from('comments').update({ is_verified: true }).eq('id', commentId).then(({ error }) => {
          if (error) console.error('Lỗi khi lưu verify comment lên Supabase:', error.message);
        });

        return { ...c, is_verified: true };
      }
      return c;
    }));
  };

  const addTopic = async (name: string, description: string) => {
    const newTopic: DiscussionTopic = {
      id: `topic-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      created_by: activeUserId,
      created_at: new Date().toISOString()
    };
    setTopics(prev => [...prev, newTopic]);

    const { error } = await supabase.from('discussion_topics').insert([newTopic]);
    if (error) console.error('Lỗi khi thêm topic lên Supabase:', error.message);

    addNotification(
      'Thêm chủ đề thảo luận mới',
      `Mentor ${activeUser.full_name} đã tạo chủ đề thảo luận: "${name}"`,
      'system'
    );
  };

  const addDiscussionPost = async (topicId: string, title: string, content: string, tags: string[] = [], mediaUrls: string[] = []) => {
    const newPost: DiscussionPost = {
      id: `post-${Math.random().toString(36).substr(2, 9)}`,
      topic_id: topicId,
      author_id: activeUserId,
      title,
      content,
      tags,
      created_at: new Date().toISOString(),
      upvotes_count: 0,
      upvoted_by: [],
      media_urls: mediaUrls
    };
    setDiscussionPosts(prev => [newPost, ...prev]);

    const { error } = await supabase.from('discussion_posts').insert([newPost]);
    if (error) console.error('Lỗi khi thêm bài viết thảo luận lên Supabase:', error.message);

    // Reward for active crew collaboration: +10 Nautical Miles
    addNauticalMiles(activeUserId, 10, 'post_created', `Đăng bài thảo luận mới: "${title}"`, newPost.id);

    addNotification(
      'Đăng bài mới thành công',
      `Bạn vừa đăng bài: "${title}"`,
      'system'
    );
  };

  const upvoteDiscussionPost = async (postId: string) => {
    let updatedPost: DiscussionPost | null = null;

    setDiscussionPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const upvotedByList = p.upvoted_by || [];
        const index = upvotedByList.indexOf(activeUserId);
        
        let diff = 1;
        let newList = [...upvotedByList];
        
        if (index >= 0) {
          diff = -1;
          newList.splice(index, 1);
        } else {
          newList.push(activeUserId);
        }

        const newUpvotes = p.upvotes_count + diff;
        
        // Award miles to post author if upvoted
        if (diff > 0 && p.author_id !== activeUserId) {
          addNauticalMiles(p.author_id, 10, 'post_upvoted', 'Bài đăng nhận được 1 Upvote từ đồng đội', p.id);
        }

        updatedPost = { ...p, upvotes_count: newUpvotes, upvoted_by: newList };
        return updatedPost;
      }
      return p;
    }));

    if (updatedPost) {
      const { error } = await supabase
        .from('discussion_posts')
        .update({
          upvotes_count: (updatedPost as DiscussionPost).upvotes_count,
          upvoted_by: (updatedPost as DiscussionPost).upvoted_by
        })
        .eq('id', postId);
      if (error) console.error('Lỗi khi cập nhật upvote bài viết lên Supabase:', error.message);
    }
  };

  const upvoteSubmission = (submissionId: string) => {
    setSubmissions(prev => prev.map(s => {
      if (s.id === submissionId) {
        const upvotedByList = s.upvoted_by || [];
        const index = upvotedByList.indexOf(activeUserId);
        
        let diff = 1;
        let newList = [...upvotedByList];
        
        if (index >= 0) {
          diff = -1;
          newList.splice(index, 1);
        } else {
          newList.push(activeUserId);
        }

        const newUpvotes = (s.upvotes_count || 0) + diff;
        
        // Award miles to submission author if upvoted (Kudos)
        if (diff > 0 && s.student_id !== activeUserId) {
          addNauticalMiles(s.student_id, 15, 'submission_kudos', 'Nhận Kudos từ bạn học cho bài nộp', s.id);
        }

        // Cập nhật lên Supabase
        supabase.from('submissions').update({
          upvotes_count: newUpvotes,
          upvoted_by: newList
        }).eq('id', submissionId).then(({ error }) => {
          if (error) console.error('Lỗi khi cập nhật upvote submission lên Supabase:', error.message);
        });

        return { ...s, upvotes_count: newUpvotes, upvoted_by: newList };
      }
      return s;
    }));
  };

  // ==========================================
  // Admin Action Mutation Implementations
  // ==========================================

  const addAnnouncement = (title: string, content: string, sendEmail: boolean, mediaUrls: string[] = []) => {
    const newAnn: Announcement = {
      id: `ann-${Math.random().toString(36).substr(2, 9)}`,
      title,
      content,
      author: activeUser.role === 'admin' ? 'Admin Team' : activeUser.full_name,
      created_by: activeUserId,
      send_email: sendEmail,
      sent_email_at: sendEmail ? new Date().toISOString() : undefined,
      media_urls: mediaUrls,
      created_at: new Date().toISOString(),
      isNew: true
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    addNotification('Thông báo mới', `Thông báo "${title}" đã được đăng tải`, 'system');

    if (sendEmail) {
      const studentProfiles = profiles.filter(p => p.role === 'student');
      const studentNames = studentProfiles.map(p => `${p.full_name} (${p.gmail})`).join(', ');
      addNotification(
        '📢 Email Broadcast Bot',
        `📧 ĐÃ GỬI EMAIL: [Thông báo: ${title}] tới toàn thể học viên: ${studentNames}`,
        'telegram'
      );
    }

    // Lưu lên Supabase
    supabase.from('announcements').insert([newAnn]).then(({ error }) => {
      if (error) console.error('Lỗi khi lưu thông báo lên Supabase:', error.message);
    });
  };

  const updateAnnouncement = (id: string, updates: Partial<Announcement>) => {
    setAnnouncements(prev => prev.map(a => {
      if (a.id === id) {
        const updated = { ...a, ...updates };
        if (updates.send_email && !a.send_email) {
          updated.sent_email_at = new Date().toISOString();
          const studentProfiles = profiles.filter(p => p.role === 'student');
          const studentNames = studentProfiles.map(p => `${p.full_name} (${p.gmail})`).join(', ');
          addNotification(
            '📢 Email Broadcast Bot',
            `📧 ĐÃ GỬI EMAIL: [Thông báo cập nhật: ${a.title}] tới toàn thể học viên: ${studentNames}`,
            'telegram'
          );
        }
        return updated;
      }
      return a;
    }));
    addNotification('Cập nhật thông báo', 'Thông báo đã được chỉnh sửa thành công', 'system');

    // Cập nhật lên Supabase
    supabase.from('announcements').update(updates).eq('id', id).then(({ error }) => {
      if (error) console.error('Lỗi khi cập nhật thông báo trên Supabase:', error.message);
    });
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    addNotification('Xóa thông báo', 'Đã gỡ bỏ thông báo', 'system');

    // Xóa trên Supabase
    supabase.from('announcements').delete().eq('id', id).then(({ error }) => {
      if (error) console.error('Lỗi khi xóa thông báo trên Supabase:', error.message);
    });
  };

  const addCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `cal-${Math.random().toString(36).substr(2, 9)}`
    };
    setCalendarEvents(prev => [...prev, newEvent]);
    addNotification('Thêm lịch sự kiện', `Sự kiện "${event.title}" đã được thêm vào lịch trình`, 'system');

    // Lưu lên Supabase
    supabase.from('calendar_events').insert([newEvent]).then(({ error }) => {
      if (error) console.error('Lỗi khi lưu sự kiện lịch lên Supabase:', error.message);
    });
  };

  const updateCalendarEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setCalendarEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    addNotification('Cập nhật lịch sự kiện', 'Lịch trình sự kiện đã được điều chỉnh', 'system');

    // Cập nhật lên Supabase
    supabase.from('calendar_events').update(updates).eq('id', id).then(({ error }) => {
      if (error) console.error('Lỗi khi cập nhật sự kiện lịch trên Supabase:', error.message);
    });
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents(prev => prev.filter(e => e.id !== id));
    addNotification('Xóa lịch sự kiện', 'Đã gỡ bỏ sự kiện khỏi lịch trình', 'system');

    // Xóa trên Supabase
    supabase.from('calendar_events').delete().eq('id', id).then(({ error }) => {
      if (error) console.error('Lỗi khi xóa sự kiện lịch trên Supabase:', error.message);
    });
  };

  const shiftCalendarEvents = (startDateStr: string, daysToShift: number) => {
    const cutoffTime = new Date(startDateStr + 'T00:00:00').getTime();
    
    setCalendarEvents(prev => prev.map(event => {
      if (event.date && event.month !== undefined && event.year !== undefined) {
        const eventTime = new Date(event.year, event.month, event.date).getTime();
        if (eventTime >= cutoffTime) {
          const d = new Date(event.year, event.month, event.date);
          d.setDate(d.getDate() + daysToShift);
          return {
            ...event,
            date: d.getDate(),
            month: d.getMonth(),
            year: d.getFullYear()
          };
        }
      }
      
      if (event.startRecur && event.endRecur) {
        let updatedStart = event.startRecur;
        let updatedEnd = event.endRecur;
        
        if (event.startRecur >= cutoffTime) {
          updatedStart += daysToShift * 24 * 60 * 60 * 1000;
        }
        if (event.endRecur >= cutoffTime) {
          updatedEnd += daysToShift * 24 * 60 * 60 * 1000;
        }
        
        return {
          ...event,
          startRecur: updatedStart,
          endRecur: updatedEnd
        };
      }
      
      return event;
    }));

    setOnboardingUnlockSchedules(prev => prev.map(s => {
      const unlockTime = new Date(s.scheduled_at).getTime();
      if (unlockTime >= cutoffTime) {
        const d = new Date(s.scheduled_at);
        d.setDate(d.getDate() + daysToShift);
        return {
          ...s,
          scheduled_at: d.toISOString(),
          unlock_email_sent: false
        };
      }
      return s;
    }));

    addNotification(
      'Dời lịch hàng loạt', 
      `Đã dời toàn bộ lịch học và lịch mở khóa từ ngày ${startDateStr} tiến thêm ${daysToShift} ngày!`, 
      'system'
    );
  };

  const updateOnboardingDay = (dayNumber: number, updates: Partial<OnboardingDay>) => {
    setOnboardingDays(prev => prev.map(d => d.day === dayNumber ? { ...d, ...updates } : d));
    addNotification('Cập nhật Onboarding', `Đã cập nhật thông tin Ngày ${dayNumber}`, 'system');

    // Cập nhật trên Supabase
    supabase.from('onboarding_days').update(updates).eq('day', dayNumber).then(({ error }) => {
      if (error) console.error('Lỗi khi cập nhật onboarding_day trên Supabase:', error.message);
    });
  };

  const updateOnboardingUnlockSchedule = async (dayNumber: number, scheduledAt: string) => {
    setOnboardingUnlockSchedules(prev => prev.map(s => s.day === dayNumber ? { ...s, scheduled_at: scheduledAt, unlock_email_sent: false } : s));
    addNotification('Hẹn giờ mở khóa', `Đã đặt lịch mở khóa Ngày ${dayNumber} vào lúc ${new Date(scheduledAt).toLocaleString()}`, 'system');
    
    try {
      const { error } = await supabase
        .from('onboarding_unlock_schedules')
        .upsert({
          day: dayNumber,
          scheduled_at: scheduledAt,
          unlock_email_sent: false
        });
      if (error) {
        console.error('Lỗi khi lưu lịch mở khóa lên Supabase:', error.message);
      }
    } catch (e) {
      console.error('Lỗi kết nối Supabase khi lưu lịch mở khóa:', e);
    }
  };

  const updateAboutContent = (updates: Partial<AboutContent>) => {
    setAboutContent(prev => ({ ...prev, ...updates }));
    addNotification('Cập nhật Giới thiệu', 'Thông tin giới thiệu khóa học đã được cập nhật', 'system');
  };

  const updateLesson = (id: string, updates: Partial<Lesson>) => {
    setLessons(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
    addNotification('Cập nhật bài học', 'Nội dung bài học đã được cập nhật', 'system');

    // Cập nhật trên Supabase
    supabase.from('lessons').update(updates).eq('id', id).then(({ error }) => {
      if (error) console.error('Lỗi khi cập nhật lesson trên Supabase:', error.message);
    });
  };

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    setAssignments(prev => {
      const exists = prev.some(a => a.id === id);
      if (exists) {
        // Cập nhật trên Supabase
        supabase.from('assignments').update(updates).eq('id', id).then(({ error }) => {
          if (error) console.error('Lỗi khi cập nhật assignment trên Supabase:', error.message);
        });
        return prev.map(a => a.id === id ? { ...a, ...updates } : a);
      } else {
        // If not exists (e.g. dynamic lesson additions), create it
        const newAssignment: Assignment = {
          id: id,
          lesson_id: updates.lesson_id || '',
          description: updates.description || '',
          rubric_checklist: updates.rubric_checklist || [],
          scaffolding: updates.scaffolding || {}
        };
        // Lưu lên Supabase
        supabase.from('assignments').insert([newAssignment]).then(({ error }) => {
          if (error) console.error('Lỗi khi thêm assignment mới trên Supabase:', error.message);
        });
        return [...prev, newAssignment];
      }
    });
    addNotification('Cập nhật bài tập', 'Chi tiết bài tập đã được cập nhật', 'system');
  };

  const deleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
    addNotification('Xóa bài tập', 'Đã xóa bài tập thành công', 'system');

    supabase.from('assignments').delete().eq('id', id).then(({ error }) => {
      if (error) console.error('Lỗi khi xóa bài tập trên Supabase:', error.message);
    });
  };

  const updateModule = (id: string, updates: Partial<Module>) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    addNotification('Cập nhật chương học', 'Thông tin chương học đã được cập nhật', 'system');

    // Cập nhật trên Supabase
    supabase.from('modules').update(updates).eq('id', id).then(({ error }) => {
      if (error) console.error('Lỗi khi cập nhật module trên Supabase:', error.message);
    });
  };

  const updateBatch = (id: string, updates: Partial<Batch>) => {
    setBatches(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    addNotification('Cập nhật lớp học', 'Đã cập nhật ngày khai giảng/kết thúc lớp học', 'system');

    // Cập nhật trên Supabase
    supabase.from('batches').update(updates).eq('id', id).then(({ error }) => {
      if (error) console.error('Lỗi khi cập nhật batch trên Supabase:', error.message);
    });
  };

  const addLesson = (lesson: Lesson) => {
    setLessons(prev => [...prev, lesson]);
    addNotification('Thêm bài giảng', `Bài giảng "${lesson.title}" đã được thêm thành công`, 'system');

    // Lưu bài giảng lên Supabase
    supabase.from('lessons').insert([lesson]).then(({ error }) => {
      if (error) console.error('Lỗi khi thêm bài giảng lên Supabase:', error.message);
    });
  };

  // ==========================================
  // Background Cron checking for Onboarding unlock schedules
  // ==========================================
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const now = new Date();
      let updatedSchedules = false;
      
      setOnboardingUnlockSchedules(prev => {
        const next = prev.map(s => {
          const unlockTime = new Date(s.scheduled_at);
          if (unlockTime <= now && !s.unlock_email_sent) {
            updatedSchedules = true;
            
            addNotification(
              'Mở khóa ngày học mới ⛵', 
              `Hệ thống tự động mở khóa Ngày ${s.day}: ${onboardingDays.find(d => d.day === s.day)?.title || ''}`, 
              'system'
            );
            
            const studentProfiles = profiles.filter(p => p.role === 'student');
            const studentNames = studentProfiles.map(p => `${p.full_name} (${p.gmail})`).join(', ');
            
            addNotification(
              '📢 Email Auto-Unlock Bot',
              `📧 EMAIL TỰ ĐỘNG GỬI: [Mở khóa Ngày ${s.day} Onboarding] đã được gửi tới: ${studentNames}`,
              'telegram'
            );
            
            // Đồng bộ trạng thái đã gửi email lên Supabase
            supabase
              .from('onboarding_unlock_schedules')
              .update({ unlock_email_sent: true })
              .eq('day', s.day)
              .then(({ error }) => {
                if (error) {
                  console.error('Lỗi khi cập nhật unlock_email_sent trên Supabase:', error.message);
                }
              });

            return { ...s, unlock_email_sent: true };
          }
          return s;
        });
        
        if (updatedSchedules) {
          return next;
        }
        return prev;
      });
    }, 5000);
    
    return () => clearInterval(checkInterval);
  }, [onboardingDays, profiles]);

  const incrementVisits = (userId: string) => {
    setProfiles(prev => prev.map(p => {
      if (p.id === userId) {
        const newVisits = (p.visits || 0) + 1;
        return { ...p, visits: newVisits };
      }
      return p;
    }));
  };

  return (
    <DatabaseContext.Provider value={{
      activeUser,
      switchUser,
      users: profiles,
      updateProfile,
      isAuthenticated,
      loginWithGmail,
      loginWithSupabaseGoogle,
      logout,
      courses: SEED_COURSES,
      batches,
      modules,
      lessons,
      skills: SEED_SKILLS,
      lessonSkills: SEED_LESSON_SKILLS,
      masteryRecords,
      assignments,
      submissions,
      feedbacks,
      comments,
      nauticalTransactions,
      badges: SEED_BADGES,
      profileBadges,
      notifications,
      topics: [
        {
          id: 'topic-onboarding',
          name: 'Onboarding Week',
          description: 'Nơi thảo luận và nộp các bài tập trong tuần Onboarding.',
          created_by: 'admin',
          created_at: new Date().toISOString()
        },
        {
          id: 'topic-live-class',
          name: 'Live Class',
          description: 'Nơi thảo luận và nộp bài tập của các buổi học trực tuyến (Live Sessions).',
          created_by: 'admin',
          created_at: new Date().toISOString()
        }
      ],
      discussionPosts,
      announcements,
      calendarEvents,
      onboardingDays,
      onboardingUnlockSchedules,
      aboutContent,
      submitAssignment,
      gradeSubmission,
      addComment,
      upvoteComment,
      verifyComment,
      completeLesson,
      addNotification,
      addTopic,
      addDiscussionPost,
      upvoteDiscussionPost,
      upvoteSubmission,
      addAnnouncement,
      updateAnnouncement,
      deleteAnnouncement,
      addCalendarEvent,
      updateCalendarEvent,
      deleteCalendarEvent,
      shiftCalendarEvents,
      updateOnboardingDay,
      updateOnboardingUnlockSchedule,
      updateAboutContent,
      updateLesson,
      updateAssignment,
      deleteAssignment,
      updateModule,
      updateBatch,
      addLesson,
      incrementVisits
    }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
