import React, { createContext, useContext, useState, useEffect } from 'react';

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
  bio: string;
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
  rubric_checklist: { item: string; checked: boolean }[];
  scaffolding: {
    template_url?: string;
    reference_link?: string;
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
  updateProfile: (profileId: string, updates: Partial<Profile>) => void;
  isAuthenticated: boolean;
  loginWithGmail: (email: string, role?: UserRole) => Profile | null;
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
  addDiscussionPost: (topicId: string, title: string, content: string, tags?: string[]) => void;
  upvoteDiscussionPost: (postId: string) => void;
  upvoteSubmission: (submissionId: string) => void;

  // New Admin mutation functions
  addAnnouncement: (title: string, content: string, sendEmail: boolean) => void;
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
  updateModule: (id: string, updates: Partial<Module>) => void;
  addLesson: (lesson: Lesson) => void;
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
    id: 'badge-profile-card',
    name: 'Thẻ Căn Cước Thủy Thủ',
    icon: '🪪',
    description: 'Khai báo thông tin cá nhân đầy đủ 100% trong Hồ sơ cá nhân.',
    condition: 'Hoàn thành hồ sơ cá nhân với đầy đủ các trường thông tin.'
  },
  {
    id: 'badge-full-sail',
    name: 'Cánh Buồm No Gió',
    icon: '⛵',
    description: 'Khởi đầu thuận lợi. Tự động nhận được khi hoàn thành xuất sắc toàn bộ bài tập của Tuần lễ Onboarding.',
    condition: 'Đạt điểm "Meets Expectations" hoặc "Excellent" cho các bài tập thuộc Module 0.'
  },
  {
    id: 'badge-iron-anchor',
    name: 'Mỏ Neo Thép',
    icon: '⚓',
    description: 'Tượng trưng cho sự kiên định. Nhận được khi có chuỗi nộp bài đúng hạn (Streak) 3 lần liên tiếp.',
    condition: 'Có 3 bài nộp liên tiếp ở trạng thái "submitted" hoặc "graded" và được ghi nhận trước hạn chót.'
  },
  {
    id: 'badge-lifebuoy',
    name: 'Phao Cứu Sinh',
    icon: '🛟',
    description: 'Dành cho những "thiên thần cộng đồng". Nhận được khi tổng số Upvotes thu về từ các bình luận đạt mốc 50.',
    condition: 'Tích lũy 50 upvotes từ các comment hữu ích trên các bài nộp khác.'
  },
  {
    id: 'badge-lighthouse',
    name: 'Ngọn Hải Đăng',
    icon: '🗼',
    description: 'Dành cho sự xuất sắc. Nhận được khi bài nộp đạt điểm "Excellent" và được Mentor "Verified" (ghim) lên top Discussion.',
    condition: 'Đạt điểm "Excellent" ở bất kỳ bài tập nào và được ghim/verified.'
  },
  {
    id: 'badge-treasure-map',
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
    id: 'course-vibe-101',
    title: 'Vibe Coding 201: Build scalable product with AI',
    description: 'Vibe Coding 201 là khóa học 9 buổi nâng cao giúp bạn học cách xây dựng sản phẩm có khả năng scale, thiết lập PRD kỹ thuật, làm chủ IDE/CLI, thiết kế MCP và xây dựng hệ thống automation kết hợp n8n.',
    cover_image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop'
  }
];

const SEED_BATCHES: Batch[] = [
  {
    id: 'batch-3',
    course_id: 'course-vibe-101',
    name: 'Batch 3',
    // We set start date to a future date so the class has not started yet
    start_date: '2026-07-01',
    end_date: '2026-08-31',
    mentor_id: 'profile-admin-hong'
  }
];

const SEED_MODULES: Module[] = [
  { id: 'mod-0', course_id: 'course-vibe-101', title: 'Phần 0: Onboarding & Kick-off', order_index: 1 },
  { id: 'mod-1', course_id: 'course-vibe-101', title: 'Phần 1: Tư duy Sản phẩm & Vấn đề', order_index: 2 },
  { id: 'mod-2', course_id: 'course-vibe-101', title: 'Phần 2: IDE, CLI & MCP Product Building', order_index: 3 },
  { id: 'mod-3', course_id: 'course-vibe-101', title: 'Phần 3: Version Control & Backend Decision', order_index: 4 },
  { id: 'mod-4', course_id: 'course-vibe-101', title: 'Phần 4: Deployment & Automation Workspace', order_index: 5 }
];

const SEED_LESSONS: Lesson[] = [
  // Phần 0
  {
    id: 'les-0',
    module_id: 'mod-0',
    title: 'Buổi 0: Kick-off Meeting',
    type: 'video',
    content: 'Tìm hiểu về khóa học Vibe Coding 201, giảng viên và văn hóa học tập chủ động. Định vị lộ trình Onboarding.',
    video_url: 'https://drive.google.com/file/d/kickoff-meeting-vibe-201',
    order_index: 1,
    start_date: '2026-06-20', // Started in past
    target: 'Kích hoạt tư duy học chủ động, hướng dẫn luật chơi hải lý và giới thiệu công cụ',
    demo: 'Demo giao diện LMS và giới thiệu các thử thách onboarding',
    scope: 'Giới thiệu tổng quan, chưa đi vào code',
    has_materials: true
  },
  
  // Phần 1
  {
    id: 'les-1',
    module_id: 'mod-1',
    title: 'Buổi 1: Mindset: Từ MVP đến product có thể scale',
    type: 'video',
    content: 'MVP vs scalable product vs internal workspace system. Các điểm gãy sau prototype: codebase rối, data chưa rõ, auth/permission, deploy tạm, thiếu version control, khó debug, thiếu automation. Tech literacy map cho non-tech: frontend, backend, database, API, auth, deploy, server, automation. Cách học tech với AI: hỏi đúng, kiểm chứng output, không bị thuật ngữ kéo đi.',
    video_url: 'https://drive.google.com/file/d/buoi-1-mindset-scale',
    order_index: 2,
    start_date: '2026-07-01', // Future date
    target: 'Giúp học viên hiểu gap giữa prototype/MVP và product hoặc workspace system đáng tin hơn.',
    demo: 'So sánh một prototype đẹp nhưng mong manh với một product/workspace system có cấu trúc hơn.',
    scope: 'Giữ tính mindset + framework. Không đi quá sâu vào từng công nghệ trong buổi này.',
    has_materials: false // Class hasn't started, no materials yet
  },
  {
    id: 'les-2',
    module_id: 'mod-1',
    title: 'Buổi 2: PRD kỹ thuật & 4 Flow',
    type: 'video',
    content: 'PRD v2: problem, user, goal, success criteria, main use case, out-of-scope, user stories, acceptance criteria. Main flow vs secondary flow vs edge case. 4 flow: User Flow, Business Flow, System Flow, Data Flow. Cách dùng AI/skill để review PRD và phát hiện gap.',
    video_url: 'https://drive.google.com/file/d/buoi-2-prd-technical',
    order_index: 3,
    start_date: '2026-07-05', // Future date
    target: 'Biến ý tưởng/product request thành spec đủ rõ để AI/IDE/agent build đúng hơn.',
    demo: 'Chuyển một app mẫu từ PRD thường sang PRD kỹ thuật; vẽ 4 flow bằng Mermaid/diagrams.net hoặc tool tương đương.',
    scope: 'Buổi này là nền để các buổi backend/deploy/automation không bị loạn.',
    has_materials: false
  },
  
  // Phần 2
  {
    id: 'les-3',
    module_id: 'mod-2',
    title: 'Buổi 3: IDE + CLI Product Cockpit',
    type: 'video',
    content: 'Cấu phần IDE: file tree, editor, agent panel, terminal, source control/diff. Workflow giao việc cho agent: context, task breakdown, plan, diff review, accept/reject, run/test/debug. Khi nào dùng IDE, khi nào dùng CLI. Cách yêu cầu AI giải thích lỗi terminal/build log. Cách giới hạn scope để agent không sửa quá rộng.',
    video_url: 'https://drive.google.com/file/d/buoi-3-ide-cli-cockpit',
    order_index: 4,
    start_date: '2026-07-08',
    target: 'Dạy cách làm việc với IDE/CLI để AI build có kiểm soát thay vì sửa lung tung (học cả Cursor, Antigravity, Codex & Claude Code).',
    demo: 'Mở repo/app mẫu; yêu cầu agent thêm một feature nhỏ; review diff; chạy local; sửa lỗi; commit nháp.',
    scope: 'Chọn một IDE chính để demo. Các IDE khác chỉ overview.',
    has_materials: false
  },
  {
    id: 'les-4',
    module_id: 'mod-2',
    title: 'Buổi 4: Skills for Product Building',
    type: 'video',
    content: 'Skill là gì, khác prompt thường ở đâu. Skill cho brainstorm product, sharpen problem statement, MVP scoping, PRD review, acceptance criteria. Skill cho QA app, browser testing, pitch review, build review checklist. Ví dụ Superpowers hoặc MVP/product framework skill. Cách gọi skill đúng lúc trong IDE/agent workflow.',
    video_url: 'https://drive.google.com/file/d/buoi-4-skills-playbook',
    order_index: 5,
    start_date: '2026-07-12',
    target: 'Dạy skill như playbook tái sử dụng để AI hỗ trợ brainstorm, scope, QA, review và cải thiện sản phẩm ổn định hơn.',
    demo: 'Dùng skill để review PRD v2; tạo test checklist; dùng browser/testing skill để kiểm tra một flow sản phẩm.',
    scope: 'Nên tách riêng vì phần Skills khóa cũ bị dồn với MCP nên dễ quá tải.',
    has_materials: false
  },
  {
    id: 'les-5',
    module_id: 'mod-2',
    title: 'Buổi 5: MCP for Product Building',
    type: 'video',
    content: 'MCP trong bức tranh agent/tool. MCP vs Skill vs API vs CLI vs Script. MCP cho design/prototype, browser/app testing, database/schema/docs, repo/GitHub, file/workspace context. Decision rule: khi nào MCP đáng dùng, khi nào không cần.',
    video_url: 'https://drive.google.com/file/d/buoi-5-mcp-integration',
    order_index: 6,
    start_date: '2026-07-15',
    target: 'Dạy MCP theo use case product: agent chạm vào tool/data/context để làm việc thật hơn.',
    demo: 'Agent dùng browser để test flow; dùng database/docs context để đề xuất schema hoặc kiểm tra lỗi; đọc repo/context để trả lời câu hỏi product/technical.',
    scope: 'Không đi sâu subagents, orchestration, remote agent setup. Các phần đó để workshop/khóa sau.',
    has_materials: false
  },
  
  // Phần 3
  {
    id: 'les-6',
    module_id: 'mod-3',
    title: 'Buổi 6: GitHub & Version Control',
    type: 'video',
    content: 'Repo, commit, branch, pull request ở mức non-tech cần hiểu. Issue -> change -> review -> commit -> deploy. AI review code/change. Rollback mindset. Repo hygiene: README, env example, folder structure, issue template, changelog đơn giản.',
    video_url: 'https://drive.google.com/file/d/buoi-6-github-versioning',
    order_index: 7,
    start_date: '2026-07-19',
    target: 'Dùng GitHub như hệ thống kiểm soát thay đổi, không chỉ là nơi lưu code.',
    demo: 'Tạo issue cho bug/feature; agent sửa code; review diff; commit/push; trigger deploy.',
    scope: 'Không cần dạy Git command line sâu. Ưu tiên mental model + workflow thực dụng.',
    has_materials: false
  },
  {
    id: 'les-7',
    module_id: 'mod-3',
    title: 'Buổi 7: Backend Decision Layer',
    type: 'video',
    content: 'Data layer trong app/product. Khi nào dùng Google Sheets, Firebase, Supabase, backend/API custom, hoặc chưa cần backend thật. So sánh theo độ dễ bắt đầu, realtime, auth, permission, SQL/noSQL, cost/free tier, scale, lock-in, AI/agent friendliness. Schema, CRUD, auth, permission/RLS ở mức non-tech cần hiểu.',
    video_url: 'https://drive.google.com/file/d/buoi-7-backend-layers',
    order_index: 8,
    start_date: '2026-07-22',
    target: 'Giúp học viên biết chọn Google Sheets, Firebase, Supabase, hay backend thật theo nhu cầu sản phẩm.',
    demo: 'Một use case đơn giản được triển khai hoặc mô phỏng bằng Google Sheets/Firebase/Supabase để thấy trade-off; chọn một path chính để demo kỹ.',
    scope: 'Nên dạy decision-first, sau đó chọn một path demo chính để tránh quá rộng.',
    has_materials: false
  },
  
  // Phần 4
  {
    id: 'les-8',
    module_id: 'mod-4',
    title: 'Buổi 8: Deploy & Infra Landscape',
    type: 'video',
    content: 'Vercel: managed app hosting. Cloudflare: DNS/CDN/security/Pages/Workers/Tunnel. VPS: thuê server riêng, linh hoạt hơn nhưng phải tự chịu trách nhiệm. Docker: đóng gói app/service để chạy ổn định giữa môi trường khác nhau. SSH, env vars, secrets, domain, logs, local vs production. Khi nào không nên tự host.',
    video_url: 'https://drive.google.com/file/d/buoi-8-deploy-infra',
    order_index: 9,
    start_date: '2026-07-26',
    target: 'Cho học viên hiểu bản đồ deploy/infra: Vercel, Cloudflare, VPS, Docker khác nhau ra sao và nên chọn gì.',
    demo: 'Deploy app lên Vercel; giải thích/trỏ domain qua Cloudflare; demo SSH vào VPS hoặc mô phỏng flow; demo Docker chạy service đơn giản.',
    scope: 'Không biến thành Docker/VPS hardcore. Mục tiêu là hiểu bản đồ và biết chọn đường.',
    has_materials: false
  },
  {
    id: 'les-9',
    module_id: 'mod-4',
    title: 'Buổi 9: Automation with n8n',
    type: 'video',
    content: 'Automation layer là gì. n8n cho form -> sheet/database -> notification; app data -> report; file upload -> OCR/summary; feedback -> action list; daily/weekly digest. Local n8n vs cloud/self-host/server n8n. Webhook, trigger, credential, node, workflow. Khi nào dùng n8n, khi nào dùng code/API/script.',
    video_url: 'https://drive.google.com/file/d/buoi-9-n8n-automation',
    order_index: 10,
    start_date: '2026-07-29',
    target: 'Dùng automation để nối các mảnh sản phẩm/workspace và giảm việc lặp.',
    demo: 'Workflow mẫu: input/form -> data store -> Telegram/email/Slack notification -> summary. Có thể nối với Personal Work OS Lite.',
    scope: 'Core nên ưu tiên local/cloud demo; self-host/VPS để optional nếu lớp đủ nền.',
    has_materials: false
  }
];

const SEED_LESSON_SKILLS: LessonSkill[] = [
  { lesson_id: 'les-1', skill_id: 'skill-problem' },
  { lesson_id: 'les-2', skill_id: 'skill-problem' },
  { lesson_id: 'les-3', skill_id: 'skill-ai' },
  { lesson_id: 'les-4', skill_id: 'skill-ai' },
  { lesson_id: 'les-5', skill_id: 'skill-ai' },
  { lesson_id: 'les-6', skill_id: 'skill-ui' },
  { lesson_id: 'les-7', skill_id: 'skill-ui' },
  { lesson_id: 'les-8', skill_id: 'skill-ui' },
  { lesson_id: 'les-9', skill_id: 'skill-ai' }
];

const SEED_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-les-1',
    lesson_id: 'les-1',
    description: 'Hoàn thành bảng MVP-to-Scale Gap Checklist cho dự án cá nhân bạn chọn để theo suốt khóa học.',
    rubric_checklist: [
      { item: 'Xác định rõ ràng 3 rủi ro kỹ thuật chính của dự án', checked: false },
      { item: 'Đưa ra checklist chuẩn bị scale từ MVP thô ban đầu', checked: false }
    ],
    scaffolding: {
      template_url: 'https://docs.google.com/spreadsheets/d/1nrOIqOfdtw83xzOYyRvEg1LETUd1h25fO57ZqL79Ji0/edit'
    }
  },
  {
    id: 'asg-les-2',
    lesson_id: 'les-2',
    description: 'Viết tài liệu PRD v2 và phác thảo 4 luồng dữ liệu/vận hành (User Flow, Business Flow, System Flow, Data Flow) cho main use case của dự án.',
    rubric_checklist: [
      { item: 'PRD v2 bao gồm đầy đủ Problem, User, Goal, Success Criteria, User Stories', checked: false },
      { item: 'Vẽ đủ và đúng 4 flow kỹ thuật bằng Mermaid hoặc công cụ tương đương', checked: false }
    ],
    scaffolding: {
      reference_link: 'https://the1ight.notion.site/PRD-Template-Vibe-Coding-101'
    }
  },
  {
    id: 'asg-les-3',
    lesson_id: 'les-3',
    description: 'Thêm hoặc sửa một feature nhỏ trong project của bạn bằng quy trình IDE/CLI workflow; ghi lại câu lệnh/prompt và phần diff chính.',
    rubric_checklist: [
      { item: 'Sử dụng thành công IDE hoặc CLI (Cursor, Claude Code, Antigravity...) để thay đổi code', checked: false },
      { item: 'Ghi lại chi tiết prompt giao việc cho agent và tóm tắt cách review/chạy thử code', checked: false },
      { item: 'Chụp hình hoặc copy phần code diff chính sau khi thay đổi', checked: false }
    ],
    scaffolding: {}
  },
  {
    id: 'asg-les-4',
    lesson_id: 'les-4',
    description: 'Sử dụng ít nhất 1 skill (như brainstorm, sharpen problem, MVP scoping, PRD review, QA app) để cải thiện tài liệu PRD hoặc ứng dụng của bạn và nộp kết quả before/after.',
    rubric_checklist: [
      { item: 'Chọn được ít nhất 1 skill phù hợp để cải thiện sản phẩm', checked: false },
      { item: 'Nêu rõ sự khác biệt hoặc cải tiến cụ thể giữa trước và sau khi dùng skill (Before vs After)', checked: false }
    ],
    scaffolding: {}
  },
  {
    id: 'asg-les-5',
    lesson_id: 'les-5',
    description: 'Chọn 1 MCP/MCP-like workflow (ví dụ browser testing, DB context, GitHub repo context) để audit/test hoặc hỗ trợ xây dựng một tính năng trong project của bạn.',
    rubric_checklist: [
      { item: 'Xác định đúng use case cần dùng MCP và cấu hình thành công công cụ bổ trợ', checked: false },
      { item: 'Mô tả chi tiết kết quả audit/test hoặc dữ liệu thu thập được thông qua MCP', checked: false }
    ],
    scaffolding: {}
  },
  {
    id: 'asg-les-6',
    lesson_id: 'les-6',
    description: 'Thực hiện thay đổi trong dự án và theo dõi quy trình quản lý: tạo Issue -> tạo Branch -> tạo Pull Request/Commit -> Merge. Đảm bảo kho lưu trữ (Repo) có tài liệu README hoặc Project Notes tối thiểu.',
    rubric_checklist: [
      { item: 'Tạo Issue mô tả tính năng/bug và liên kết với branch/PR tương ứng', checked: false },
      { item: 'Thực hiện commit và push thay đổi lên GitHub theo đúng chuẩn đặt tên', checked: false },
      { item: 'Repo GitHub có tài liệu README.md hoặc Project Notes cơ bản hướng dẫn chạy local', checked: false }
    ],
    scaffolding: {}
  },
  {
    id: 'asg-les-7',
    lesson_id: 'les-7',
    description: 'Lập bảng phân tích quyết định Backend (Backend Decision Matrix) và phác thảo mô hình dữ liệu (Data model/schema draft) cho các luồng chính của dự án.',
    rubric_checklist: [
      { item: 'Có bảng so sánh trade-off giữa các phương án Backend (Sheets, Firebase, Supabase, API custom...)', checked: false },
      { item: 'Thiết kế cấu trúc bảng (schema) với đầy đủ trường dữ liệu, kiểu dữ liệu và mối quan hệ giữa các bảng cho tính năng chính', checked: false }
    ],
    scaffolding: {}
  },
  {
    id: 'asg-les-8',
    lesson_id: 'les-8',
    description: 'Xây dựng kế hoạch triển khai (Deployment Plan) cho dự án cá nhân: lựa chọn nền tảng, cấu hình tên miền/DNS qua Cloudflare, quản lý biến môi trường (.env) và liệt kê các rủi ro cần lưu ý.',
    rubric_checklist: [
      { item: 'Xác định rõ platform deploy (Vercel, Cloudflare Pages, VPS...) phù hợp với tech stack', checked: false },
      { item: 'Liệt kê đầy đủ các biến môi trường (.env) cần cấu hình trên môi trường production', checked: false },
      { item: 'Đưa ra phương án dự phòng (rollback plan) và giám sát logs nếu xảy ra lỗi', checked: false }
    ],
    scaffolding: {}
  },
  {
    id: 'asg-les-9',
    lesson_id: 'les-9',
    description: 'Thiết lập hoặc phác thảo một quy trình tự động hóa (Automation workflow) bằng n8n kết nối các mảnh sản phẩm/workspace để tối ưu hóa quy trình vận hành.',
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
    id: 'profile-admin-hong',
    full_name: 'Đặng Tuyết Hồng',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop',
    role: 'admin',
    telegram_id: '@dangtuyethong',
    bio: 'Founder of The1ight. Đồng hành cùng các bạn trên hải trình tự học và làm sản phẩm số thực chiến.',
    gmail: 'dangtuyethong2324@gmail.com',
    phone_number: '0901234567',
    facebook_url: 'https://facebook.com/dangtuyethong2324',
    is_profile_completed: true,
    nautical_miles: 0,
    created_at: new Date('2024-09-01').toISOString()
  },
  {
    id: 'profile-student-tuyethong',
    full_name: 'Tuyết Hồng',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
    role: 'student',
    telegram_id: '@tuyethong_cym',
    bio: 'Thủy thủ say mê học Vibe Coding để hiện thực hóa ý tưởng Product đầu tay.',
    gmail: 'tuyethong.cym@gmail.com',
    phone_number: '0987654321',
    facebook_url: 'https://facebook.com/tuyethong.cym',
    industry: 'Business Operations',
    current_job: 'Operations Executive',
    tech_level: 'low-code',
    product_idea: 'Một hệ thống LMS mini chuyên biệt cho trẻ em tự học kỹ năng mềm',
    weekly_hours_commitment: 10,
    motivation_bet: 'Nếu nộp bài trễ 1 buổi, tôi sẽ mời cả nhóm Batch 3 trà sữa!',
    is_profile_completed: true,
    nautical_miles: 320, // Preloaded with some points
    created_at: new Date('2024-09-05').toISOString()
  }
];

const SEED_MASTERY_RECORDS: MasteryRecord[] = [
  { student_id: 'profile-student-tuyethong', skill_id: 'skill-problem', mastery_level: 'meets_expectations', last_updated: new Date('2024-09-15').toISOString() },
  { student_id: 'profile-student-tuyethong', skill_id: 'skill-lean', mastery_level: 'needs_improvement', last_updated: new Date('2024-09-18').toISOString() },
  { student_id: 'profile-student-tuyethong', skill_id: 'skill-ai', mastery_level: 'none', last_updated: new Date('2024-09-05').toISOString() },
  { student_id: 'profile-student-tuyethong', skill_id: 'skill-ui', mastery_level: 'none', last_updated: new Date('2024-09-05').toISOString() },
  { student_id: 'profile-student-tuyethong', skill_id: 'skill-ux', mastery_level: 'none', last_updated: new Date('2024-09-05').toISOString() }
];

const SEED_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-tuyethong-les4',
    assignment_id: 'asg-les-4',
    batch_id: 'batch-3',
    student_id: 'profile-student-tuyethong',
    content: 'https://docs.google.com/document/d/tuyethong-prd-draft\n\nEm gửi bản nháp PRD cho dự án LightMS ạ. Em đang tập trung tối ưu hóa luồng User Flow và phân cấp màu sắc theo Design System. Mong chị Hồng góp ý giúp em!',
    status: 'submitted',
    created_at: new Date('2024-09-20T20:30:00Z').toISOString(),
    upvotes_count: 1,
    upvoted_by: ['profile-admin-hong']
  }
];

const SEED_TOPICS: DiscussionTopic[] = [
  {
    id: 'topic-light-support',
    name: 'Light Support',
    description: 'Nơi đăng bài nhờ đồng đội hoặc Mentor hỗ trợ giải quyết khó khăn, gỡ lỗi code hoặc làm rõ spec.',
    created_by: 'profile-admin-hong',
    created_at: new Date('2024-09-01T00:00:00Z').toISOString()
  },
  {
    id: 'topic-assignments',
    name: 'Assignments',
    description: 'Nơi showcase bài tập về nhà của cả lớp. Nhớ Kudos (Upvote) và bình luận đóng góp ý kiến cho đồng đội!',
    created_by: 'profile-admin-hong',
    created_at: new Date('2024-09-01T00:00:00Z').toISOString()
  },
  {
    id: 'topic-general',
    name: 'Thảo luận chung',
    description: 'Nơi giao lưu, chia sẻ kinh nghiệm, cập nhật tin tức và thảo luận tự do ngoài lề bài học.',
    created_by: 'profile-admin-hong',
    created_at: new Date('2024-09-01T00:00:00Z').toISOString()
  }
];

const SEED_POSTS: DiscussionPost[] = [
  {
    id: 'post-help-1',
    topic_id: 'topic-light-support',
    author_id: 'profile-student-sparrow',
    title: 'Lỗi git push bị từ chối (Updates were rejected)',
    content: 'Tôi đang push code lên nhánh main của repo bài tập thì bị báo lỗi: [rejected] - non-fast-forward. Ai biết cách xử lý lỗi này mà không làm mất lịch sử commit không? Tôi xin cảm ơn!',
    tags: ['Buổi 6: GitHub & Version Control', 'Git'],
    created_at: new Date('2024-09-22T10:00:00Z').toISOString(),
    upvotes_count: 3,
    upvoted_by: ['profile-student-tuyethong', 'profile-admin-hong']
  },
  {
    id: 'post-general-1',
    topic_id: 'topic-general',
    author_id: 'profile-student-tuyethong',
    title: 'Chia sẻ một số phím tắt cực hay trên Cursor và VS Code',
    content: 'Sau 3 buổi học với IDE, mình phát hiện ra một số phím tắt giúp viết code nhanh hơn rất nhiều:\n1. Ctrl + L / Cmd + L: Đưa vùng chọn vào Chat panel của Cursor.\n2. Ctrl + I / Cmd + I: Mở inline edit của Cursor ngay tại dòng code.\n3. Alt + Click: Đặt nhiều con trỏ để sửa nhanh nhiều vị trí.\nHy vọng giúp ích cho mọi người!',
    tags: ['Buổi 3: IDE + CLI Product Cockpit', 'Cursor', 'Tips'],
    created_at: new Date('2024-09-23T14:30:00Z').toISOString(),
    upvotes_count: 8,
    upvoted_by: ['profile-student-sparrow', 'profile-admin-hong']
  }
];

const SEED_COMMENTS: Comment[] = [
  {
    id: 'comm-tuyethong-sparrow',
    submission_id: 'sub-sparrow-les4',
    batch_id: 'batch-3',
    author_id: 'profile-student-tuyethong',
    content: 'Ý tưởng định vị kho báu rất hay nha anh Jack! Để giải quyết bài toán Feasibility cho AI, anh có thể tích hợp API của các trạm phao hải văn hoặc các cảm biến độ sâu thử xem.',
    upvotes_count: 5,
    is_verified: false,
    created_at: new Date('2024-09-21T08:15:00Z').toISOString(),
    upvoted_by: ['profile-student-sparrow']
  },
  {
    id: 'comm-help-1-reply',
    submission_id: 'post-help-1',
    batch_id: 'batch-3',
    author_id: 'profile-admin-hong',
    content: 'Chào Jack, lỗi này xảy ra do repo local của bạn chưa cập nhật các commit mới nhất trên remote. Bạn hãy chạy lệnh `git pull origin main` trước nhé. Nếu có conflict thì giải quyết xong rồi mới push lại được.',
    upvotes_count: 2,
    is_verified: true,
    created_at: new Date('2024-09-22T10:15:00Z').toISOString(),
    upvoted_by: ['profile-student-sparrow']
  },
  {
    id: 'comm-general-1-reply',
    submission_id: 'post-general-1',
    batch_id: 'batch-3',
    author_id: 'profile-student-sparrow',
    content: 'Cảm ơn Tuyết Hồng nhé! Cái Cmd + L đúng là cứu cánh, trước toàn copy-paste mỏi cả tay.',
    upvotes_count: 1,
    is_verified: false,
    created_at: new Date('2024-09-23T15:00:00Z').toISOString(),
    upvoted_by: ['profile-student-tuyethong']
  }
];

const SEED_TRANSACTIONS: NauticalMilesTransaction[] = [
  { id: 'tx-1', student_id: 'profile-student-tuyethong', amount: 50, action_type: 'profile_completion', description: 'Đã hoàn thành 100% Hồ sơ cá nhân - Khởi tạo thẻ căn cước', created_at: new Date('2024-09-06').toISOString() },
  { id: 'tx-2', student_id: 'profile-student-tuyethong', amount: 200, action_type: 'comment_verified', description: 'Bình luận giải đáp hữu ích cho đồng đội được Mentor duyệt tích xanh', created_at: new Date('2024-09-12').toISOString() },
  { id: 'tx-3', student_id: 'profile-student-tuyethong', amount: 50, action_type: 'lesson_complete', description: 'Hoàn thành Buổi 1: Tư duy sản phẩm', created_at: new Date('2024-09-13').toISOString() },
  { id: 'tx-4', student_id: 'profile-student-tuyethong', amount: 20, action_type: 'comment_upvoted', description: 'Nhận được 2 lượt Upvotes trên bình luận bài nộp', created_at: new Date('2024-09-21').toISOString() }
];

const SEED_PROFILE_BADGES: ProfileBadge[] = [
  { student_id: 'profile-student-tuyethong', badge_id: 'badge-profile-card', unlocked_at: new Date('2024-09-06').toISOString() }
];

const SEED_NOTIFICATIONS: NotificationLog[] = [
  { id: 'ntf-1', title: 'Thông báo Kick-off', message: 'Hải trình Vibe Coding 101 chính thức giương buồm! Đọc kỹ phần Onboarding nhé các thủy thủ!', type: 'telegram', created_at: new Date('2024-09-06T12:00:00Z').toISOString() },
  { id: 'ntf-2', title: 'Tích xanh cộng đồng', message: 'Tuyết Hồng vừa được Đặng Tuyết Hồng tặng Tích Xanh cho bình luận giải quyết vấn đề rủi ro!', type: 'telegram', created_at: new Date('2024-09-12T15:20:00Z').toISOString() }
];

const SEED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Chào mừng các bạn đến với LightMS!',
    author: 'Admin Team',
    created_by: 'profile-admin-hong',
    send_email: true,
    sent_email_at: new Date('2026-06-20T12:00:00Z').toISOString(),
    content: 'Chào mừng các bạn đến với LightMS - Nền tảng học tập mới của chúng ta. Hệ thống được thiết kế đặc biệt để giúp các bạn có trải nghiệm học tập tốt nhất với giao diện trực quan và dễ sử dụng.\n\nCác bạn hãy vào mục Onboarding để bắt đầu làm quen với hệ thống nhé!\n\nChúc các bạn học tập thật tốt!',
    created_at: new Date('2026-06-20T12:00:00Z').toISOString(),
    isNew: true
  },
  {
    id: 'ann-2',
    title: 'Lịch nghỉ Tết Nguyên Đán 2027',
    author: 'Academic Dept',
    created_by: 'profile-admin-hong',
    send_email: false,
    content: 'Kính gửi các bạn học viên,\n\nLớp chúng ta sẽ nghỉ Tết Nguyên Đán bắt đầu từ ngày 28 âm lịch đến hết mùng 5 âm lịch. Các bài tập có deadline trong thời gian này sẽ được tự động dời sang tuần tiếp theo.\n\nChúc các bạn và gia đình một năm mới an khang thịnh vượng!',
    created_at: new Date('2026-06-22T09:00:00Z').toISOString(),
    isNew: false
  },
  {
    id: 'ann-3',
    title: 'Cập nhật tài liệu môn học tuần 3',
    author: 'Mentor Team',
    created_by: 'profile-admin-hong',
    send_email: false,
    content: 'Chào các bạn,\n\nTài liệu học tập và bài giảng slide cho Tuần 3 đã có sẵn trong mục Syllabus. Các bạn nhớ đọc kỹ tài liệu trước khi lên lớp để chuẩn bị tốt cho buổi thảo luận nhé.\n\nNếu có thắc mắc, các bạn có thể đặt câu hỏi trong phòng Thảo luận.',
    created_at: new Date('2026-06-23T15:30:00Z').toISOString(),
    isNew: false
  }
];

const SEED_ONBOARDING_DAYS: OnboardingDay[] = [
  {
    day: 1,
    title: "Ngày 1: Khởi động, làm quen với khoá học",
    intro: "Tuần Onboarding rất quan trọng cho trải nghiệm học: dù chưa vào học ngay với mình, nhưng sẽ **kích hoạt bạn như một người học chủ động**.",
    objective: "Đến với Onboarding ngày 1, bạn sẽ làm quen với những người bạn học cùng, và tập kết nối với lớp thông qua việc post vào nhóm cộng đồng và group của lớp.\n\nBạn sẽ:\n- Làm quen với lớp học, cộng đồng, và cách hoạt động\n- Đặt ra \"lý do tại sao\" bạn học khóa này\n- Cam kết với chính mình rằng bạn sẽ hành động – không chỉ đọc lý thuyết",
    checklist: "- [ ] **Task 1: Set up nền tảng hỗ trợ học tập** (Đọc toàn bộ hướng dẫn tại [Hướng dẫn sử dụng nền tảng học tập](https://app.notion.com/p/H-ng-d-n-s-d-ng-n-n-t-ng-h-c-t-p-2b92df46dabf8386aba0812020fd78d9?pvs=21))\n- [ ] **Task 2:** Điền [form Khảo sát Onboarding](https://forms.gle/U6CKgyQnxNZh4jbAA) để thầy giáo nắm được thông tin và cập nhật giáo trình phù hợp với nhu cầu của bạn.\n- [ ] **Task 3:** Viết 01 post giới thiệu bản thân trong [Group Facebook](https://www.facebook.com/share/g/1AehPRGe9U/) của lớp và ghi hastag **#OB_Ngay1** ở đầu bài viết.\n\n*Nội dung giới thiệu bao gồm:*\n- Tên bạn, công việc hiện tại (ngành nghề), 01 sản phẩm bạn đã từng build bằng AI.\n- Lý do bạn muốn học khóa này - gắn với nỗi đau càng tốt.\n- Một trở ngại lớn nhất của bạn khi tham gia khóa học này - Bạn dự định khắc phục trở ngại này như thế nào?\n- Một điều bạn hy vọng đạt được sau 1 tháng.\n- Một thuận lợi/lợi thế của riêng bạn khi tham gia khóa học này.\n- **Quan trọng**: Cam kết sẽ dành ra bao nhiêu tiếng/tuần/ngày để học build, vào thời gian trống nào trong tuần.\n- **Tạo động lực cho cá nhân** - Đặt cược, thử thách: Nếu không build được do nguyên nhân chủ quan (ví dụ: lười, không đủ quyết tâm), bạn sẽ chấp nhận bị mất gì (ví dụ: khao trà sữa cả lớp, múa bụng, thuyết trình cuốn sách hay...).\n\n- [ ] **Task 4:** Cập nhật **Hoàn Thành** tại [Tracking Sheet](https://docs.google.com/spreadsheets/d/1MkdyolJBxs8xjvBmRlooO9QmZAnIGZM1oWN_WyD2zJg/edit?usp=sharing) khi hoàn thành nhiệm vụ Ngày 1 🎉\n- [ ] **Task 5 (Optional): Đọc thêm về cách nói chuyện với users và lấy feedback** tại [Substack Article](https://the1ight.substack.com/p/mo-khoa-6-lam-sao-e-thuc-su-noi-chuyen?r=2f46k)",
    takeaway: "> 📌 **Ghi nhớ nhỏ:**\n>\n> Bạn không cần phải “giỏi” để bắt đầu. Nhưng bạn phải bắt đầu thì mới có thể “giỏi”.\n\n> 💡 **Vẹt Lắm Mồm gợi ý:**\n> Kỹ năng tìm hiểu và nói chuyện với User là cực kỳ quan trọng, hãy rèn luyện từ sớm."
  },
  {
    day: 2,
    title: "Ngày 2: Làm quen với viết problem statement",
    intro: "> “Cái khó nhất trên đời không phải là làm cái mình muốn, mà là biết mình muốn gì”\n> \n> — Naval Ravikant\n\n🔑 *Trước khi giải quyết một vấn đề, hãy học cách gọi tên nó rõ ràng.*",
    objective: "Đến với Onboarding ngày 2, bạn sẽ nghiên cứu luôn một thứ quan trọng nhất trong nghề Product: **viết problem statement**. Đây là bước nền tảng cho mọi sản phẩm.\n\n> ⚠️ **Lưu ý:** Problem Statement hôm nay là bản draft thô đầu tiên của bạn. Đừng áp lực phải viết hoàn hảo. Buổi 1 trên lớp sẽ yêu cầu bạn viết lại 10 vấn đề → lọc xuống 1 vấn đề chính. Cái bạn viết hôm nay là bước khởi động để bạn bắt đầu tư duy.",
    checklist: "- [ ] **Task 1:** Xem video hướng dẫn ngắn từ giảng viên: [Link video Loom](https://www.loom.com/share/ae9ee3b4dd7e4f62901e904445bbf3d2?sid=5f0311c9-cf13-46de-98f7-2c5fba17361e)\n- [ ] **Task 2:** Đọc slide và bài viết kèm theo để hiểu bối cảnh:\n  - [Slide: Problem Statement](https://drive.google.com/file/d/12n7bjL99wKAeozI-uAmg_yAYJCC_eaxN/view)\n  - [Bài viết Substack](https://the1ight.substack.com/p/10-nam-lam-san-pham-a-day-toi-nhung?r=2f46k)\n- [ ] **Task 3:** Viết 1 problem statement cho sản phẩm của bạn (1 vấn đề bạn muốn solve)\n  - Post lên [Facebook Group](https://www.facebook.com/groups/27216190438021089) & tag **#OB_Ngay2** ở đầu bài viết.\n  - Nhắn trong phòng chat [Vinh Danh, tiếp lửa](https://m.me/ch/AbZBhshrDpB2lylD/) để mời mọi người đọc và bình luận.\n- [ ] **Task 4:** Comment vào bài post của một Problem Statement hoặc một lời giới thiệu (của Ngày 1) của thuyền viên khác khiến bạn ấn tượng nhất và nêu rõ lý do.\n- [ ] **Task 5:** Cập nhật trạng thái hoàn thành vào [Tracking Sheet](https://docs.google.com/spreadsheets/d/1MkdyolJBxs8xjvBmRlooO9QmZAnIGZM1oWN_WyD2zJg/edit?gid=1843915489#gid=1843915489)\n- [ ] **Task 6 (Optional):** Chủ động đặt 01 câu hỏi nào đó cho thầy giáo và cả lớp ở phòng chat Messenger [Light Support](https://m.me/ch/AbZBhshrDpB2lylD/).",
    takeaway: "> 📌 **Lời nhắc:**\n>\n> Đừng ngại chia sẻ idea còn “chưa chắc chắn”. Mọi sản phẩm tốt đều bắt đầu từ một vấn đề **rất đời thường**. Nếu bạn bí, hãy hỏi trong chat – luôn có người hỗ trợ bạn!\n\n> 💡 **Lời khuyên:**\n> Khóa học sẽ không thể thành công nếu học sinh ngại hỏi và giấu “dốt”. Hãy để mọi thắc mắc được lôi ra ánh sáng."
  },
  {
    day: 3,
    title: "Ngày 3: Làm quen với AI – Đồng đội mới",
    intro: "> *Thực tế là, trong tương lai rất gần, nếu bạn không biết cưỡi rồng, thì những người cưỡi rồng và những con rồng sẽ hoàn toàn có thể \"đốt\" và \"ăn thịt\" bạn.*\n> \n> — The1ight",
    objective: "Hôm nay bạn sẽ bắt đầu làm quen với việc dùng AI như một người trợ lý sản phẩm. Biết cách hỏi để AI giúp bạn rõ vấn đề, gợi ý giải pháp, và thậm chí… viết hộ bạn phần đầu sản phẩm.\n\nĐây là bước khởi động nhẹ. Buổi 2 trên lớp sẽ đi sâu hơn vào AI Prompting, Vibe Coding và cách dùng AI thật sự hiệu quả.",
    checklist: "- [ ] **Task 1:** Xem video giới thiệu từ giảng viên: [Link video Loom](https://www.loom.com/share/8ca2a0f8c79a40aab00264f2905a411f?sid=d1483399-b437-4070-8e46-461d07b2ad87)\n- [ ] **Task 2:** Đọc Series của bài viết hoặc xem video:\n  - [Link bài viết](https://the1ight.substack.com/p/toi-va-ai-nhung-kien-thuc-nen-tang)\n  - [Link video Youtube](https://www.youtube.com/watch?v=6iNyHHFsyjo&t=12s)\n- [ ] **Task 3:** Đọc kỹ phần 2 để hiểu về công thức CREATE và thử dùng AI viết lại Problem Statement hôm qua:\n  - [Link bài phần 2](https://the1ight.substack.com/p/toi-va-ai-02-lam-sao-e-giao-tiep?r=2f46k&utm_medium=ios&triedRedirect=true)\n  - [Link prompt guide](https://davebirss.com/documents/the_prompt_guide.pdf?kuid=e325a127-c321-4309-8bbf-a0ca6fa9da50-1731576573&lid=35290&kref=mFnEIdDR4sYf)\n- [ ] **Task 4:** Viết 3 dòng cảm nhận sau khi thử dùng AI với công thức CREATE ở trên, post lên Facebook Group với hashtag **#OB_Ngay3** và cập nhật [Tracking Sheet](https://docs.google.com/spreadsheets/d/1MkdyolJBxs8xjvBmRlooO9QmZAnIGZM1oWN_WyD2zJg/edit?gid=1843915489#gid=1843915489)\n- [ ] **Task 5 (Optional):** Đọc bài viết [Vibe Coding 2: Agentic AI](https://the1ight.substack.com/p/vibe-coding-2-agentic-ai-cuoc-cach?r=2f46k) và chia sẻ cảm nghĩ lên Facebook Group với hashtag **#OB_Ngay3**.\n- [ ] **Task 6 (Optional): Đọc Tài liệu tham khảo thêm:** [Lenny's Newsletter: Personal AI Copilot](https://www.lennysnewsletter.com/p/build-your-personal-ai-copilot?r=2f46k), [Operators Handbook](https://www.operatorshandbook.com/p/how-to-work-with-ai-getting-the-most?lli=1), [Maxberry Guide to AI Agents 2025](https://www.maxberry.ca/p/how-to-build-ai-agents-2025-guide?lli=1)",
    takeaway: "> 📌 **Lưu ý:**\n>\n> AI chính là người thầy khủng khiếp nhất đồng hành cùng bạn trong hành trình build sản phẩm. Nếu bạn biết để hỏi, thì chắc chắn bạn sẽ biết để hiểu. Chỉ cần bạn biết là bạn đang không biết gì, AI sẽ có thể dạy bạn."
  },
  {
    day: 4,
    title: "Ngày 4: PRD - Tài liệu yêu cầu sản phẩm",
    intro: "> *\"Plans are useless, but planning is indispensable.\"*\n> — Dwight D. Eisenhower\n\n> 💡 **Nguyên lý:** Trước khi build bất cứ thứ gì, bạn cần hiểu: build kiểu gì mới đúng?",
    objective: "Hôm nay bạn sẽ tìm hiểu về PRD - Product Requirements Documents.\n\nĐây là thuật ngữ quan trạng nhất cho toàn bộ khoá học. Khi bạn vibe code ở các buổi sau, bạn sẽ tự nhiên làm Agile mà không cần gọi tên nó — nhưng hiểu nó sẽ giúp bạn biết tại sao mình làm vậy.",
    checklist: "- [ ] **Task 1:** Xem lời khuyên từ giảng viên: [Link Loom](https://www.loom.com/share/5a50410bf85f4e8db861af378a399ffa?sid=765d752f-def9-4238-82ad-8523eddb67d6)\n- [ ] **Task 2:** Xem video buổi học về PRD từ khoá trước:\n  - [Recording tại Daymai.vn](https://daymai.vn/vc/69b959dd8802631b190b3891)\n  - [Slide thuyết trình Canva](https://canva.link/buoi4-prd-problemstatement)\n- [ ] **Task 3:** Viết cảm nghĩ ngắn về những gì mình học được, gắn hashtag **#OB_Ngay4** và post lên Facebook Group.\n- [ ] **Task 4:** Cập nhật **Hoàn Thành** tại [Tracking Sheet](https://docs.google.com/spreadsheets/d/1MkdyolJBxs8xjvBmRlooO9QmZAnIGZM1oWN_WyD2zJg/edit?gid=1843915489#gid=1843915489) 🎉",
    takeaway: "> 📌 **Tips:**\n>\n> Hãy thử hỏi ChatGPT: *\"PRD là gì? Cho tôi 3 ví dụ, 3 phản ví dụ và 3 điều dễ gây hiểu lầm về nó. Các cấu phần chính của PRD là gì?\"* hoặc sử dụng [Gemini Gems Concept Chopper](https://gemini.google.com/gem/1xaEMN8zNA8A6oCj62qEVHjNh5uLKwt2B?usp=sharing) để đào sâu khái niệm."
  },
  {
    day: 5,
    title: "Ngày 5: Design xưa và nay",
    intro: "> “Design is not just what it looks like and feels like. Design is how it works.”\n> \n> — Steve Jobs",
    objective: "Đến với ngày 5, mục tiêu là giúp bạn:\n- Hiểu sự khác biệt giữa quy trình vẽ **prototype truyền thống** (vẽ tay → giấy → Figma) và **prototype hiện đại** (prompt, AI tool).\n- Biết cách tư duy theo user journey và vẽ user flow cho các sản phẩm.",
    checklist: "- [ ] **Task 0:** Xem video hướng dẫn từ giảng viên: [Link Loom](https://www.loom.com/share/29bd2076c7b54c9bb18e1fe02034bdfc?sid=3ae24ec4-4a78-4912-a2dc-3733f6db18c1)\n- [ ] **Task 1:** Đọc bài viết để hiểu cách thiết kế truyền thống:\n  - [Phân biệt Sketch, Wireframe, Mockup, Prototype](https://thinhnotes.com/chuyen-nghe-ba/phan-biet-sketch-wireframe-mockup-va-prototype/)\n  - [Tương lai của design trong phát triển sản phẩm](https://app.notion.com/p/T-ng-lai-c-a-design-trong-ph-t-tri-n-s-n-ph-m-3302df46dabf8069ae36f0f39080ab52?pvs=21)\n  - [Video minh họa vẽ mockup](https://www.youtube.com/watch?v=A2yCB9P8E-8&t=1s)\n- [ ] **Task 2:** Xem video tư duy về User Journey và User Flow: [Link Youtube](https://www.youtube.com/watch?si=PytGxUCdsp7sB8mW&v=DNBIcBdKnQo&feature=youtu.be)\n- [ ] **Task 3:** Đọc bài viết về Figma & AI:\n  - [Is Figma Dead?](https://designbuddy.substack.com/p/is-figma-dead?utm_source=substack&utm_campaign=post_embed&utm_medium=web)\n  - [Review các công cụ AI Prototype](https://the1ight.substack.com/p/vibe-coding-3-review-cac-cong-cu?r=2f46k)\n- [ ] **Task 4:** Xem video trình diễn AI tool:\n  - [Figma Make AI Features (Phút 42 đến 53)](https://www.youtube.com/live/5q8YAUTYAyk?si=ktQYaBPpEl1-gv7X&t=2570)\n  - [Canva Code demo](https://youtu.be/RnVsl3PIx8U?si=9Qtq6gwuZbHdoeq3)\n- [ ] **Task 5:** Chia sẻ lên Group Facebook với hashtag **#OB_Ngay5** và cập nhật [Tracking Sheet](https://docs.google.com/spreadsheets/d/1MkdyolJBxs8xjvBmRlooO9QmZAnIGZM1oWN_WyD2zJg/edit?gid=1843915489#gid=1843915489).",
    takeaway: "> 📌 **Ghi nhớ:**\n>\n> Nguyên tắc bất biến là luôn bắt đầu từ **user problem** trước khi thiết kế UI.\n\n> 💡 **Mở rộng:** Nếu bạn muốn đọc thêm về Design Mindset, hãy tìm đọc:\n> - *Don’t Make Me Think* – Steve Krug\n> - *Designing Your Life* – Bill Burnett & Dave Evans"
  },
  {
    day: 6,
    title: "Ngày 6: PM & User Testing - Validate sản phẩm",
    intro: "> *\"Get out of the building.\"*\n> — Steve Blank\n\n> 💡 **Triết lý:** Build sản phẩm mà không nói chuyện với người dùng, giống như nấu ăn mà không nếm thử.",
    objective: "Hôm nay bạn sẽ tìm hiểu về ngành Product Management và *user testing* — cách kiểm tra xem sản phẩm của bạn có thực sự giải quyết được vấn đề cho người dùng hay không, trước khi bạn đổ quá nhiều thời gian và công sức vào build.",
    checklist: "- [ ] **Task 1:** Xem video buổi học về thế nào là làm Product: [Link video Youtube](https://youtu.be/y0ukmvWTNw4)\n- [ ] **Task 2:** Đọc bài viết [Làm sao để thực sự nói chuyện với users](https://the1ight.substack.com/p/mo-khoa-6-lam-sao-e-thuc-su-noi-chuyen?r=2f46k).\n- [ ] **Task 3:** Tìm hiểu về một số low tech product qua [Thế nào mới gọi là sản phẩm?](https://www.notion.so/Th-n-o-m-i-g-i-l-s-n-ph-m-20afb1613f7080cb8d61e0b84e2d52c4?pvs=21)\n- [ ] **Task 4:** Viết bài chia sẻ ngắn (3–5 dòng) lên Group Facebook và gắn hashtag **#OB_Ngay6**:\n  - Định nghĩa của bạn về một sản phẩm là gì?\n  - Bạn sẽ test sản phẩm của mình với ai?\n  - Bạn sẽ hỏi họ câu gì để biết vấn đề có thực sự tồn tại?\n- [ ] **Task 5:** Cập nhật **Hoàn Thành** tại [Tracking Sheet](https://docs.google.com/spreadsheets/d/1MkdyolJBxs8xjvBmRlooO9QmZAnIGZM1oWN_WyD2zJg/edit?gid=1843915489#gid=1843915489) 🎉",
    takeaway: "> 📌 **Ghi nhớ nhỏ:**\n>\n> Sản phẩm tốt nhất không phải do người thông minh nhất build, mà do người chịu khó lắng nghe nhất build."
  },
  {
    day: 7,
    title: "Ngày 7: MCP, CLI và SDK",
    intro: "🔑 *Làm chủ các khái niệm công nghệ cốt lõi trong thời đại Vibe Coding.*",
    objective: "Ngày cuối trong tuần onboarding, bạn sẽ khám phá cách phần mềm, lập trình viên và các mô hình AI giao tiếp với nhau qua CLI, SDK và MCP.",
    checklist: "- [ ] **Task 1: Xem các video sau:**\n  - [Video 1: MCP, CLI, SDK](https://youtu.be/g9JIUM0MHgQ?si=rp9u4zIBKCaZ0zLP)\n  - [Video 2: Demo thực tế](https://youtu.be/04IqH38SlOI?si=TL79P1H12WaCypN6)\n- [ ] **Task 2: Tìm hiểu thêm về 3 thuật ngữ MCP, CLI và SDK** và dùng ẩn dụ thực tế giải thích sự khác biệt, post lên Facebook Group với hashtag **#OB_Ngay7**.\n- [ ] **Task 3:** Hoàn thành [Khảo sát sau Onboarding Week](https://forms.gle/r9hwfs7fCqnEiggH7).\n- [ ] **Task 4:** Cập nhật tiến độ trên [Tracking Sheet](https://docs.google.com/spreadsheets/d/1MkdyolJBxs8xjvBmRlooO9QmZAnIGZM1oWN_WyD2zJg/edit?gid=1843915489#gid=1843915489).",
    takeaway: "> 📌 **Ghi nhớ:**\n>\n> Nghĩ như một solopreneur sẽ giúp bạn chủ động hơn, xây hệ thống làm việc hiệu quả và có tư duy ownership cao.\n\n> 🎉 **YAY!!! Bạn đã hoàn thành tuần onboarding rồi!**\n> ⏰ Lớp học chính thức đầu tiên sẽ bắt đầu vào thứ Tư đầu tuần tới lúc 20h30!"
  }
];

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
  { day: 7, scheduled_at: getFutureDateString(4), unlock_email_sent: false }
];

const SEED_CALENDAR_EVENTS: CalendarEvent[] = [
  { id: 'cal-1', title: 'KICK-OFF MEETING', time: '20:00', endTime: '21:30', date: 19, month: 6, year: 2026, colorClass: 'bg-red-600 text-white', type: 'class', eventType: 'kick-off' },
  { id: 'cal-2', title: 'ONBOARDING', time: '00:00', allDay: true, date: 20, month: 6, year: 2026, colorClass: 'bg-violet-600 text-white', type: 'community', eventType: 'onboarding' },
  { id: 'cal-3', title: 'ONBOARDING', time: '00:00', allDay: true, date: 21, month: 6, year: 2026, colorClass: 'bg-violet-600 text-white', type: 'community', eventType: 'onboarding' },
  { id: 'cal-4', title: 'ONBOARDING', time: '00:00', allDay: true, date: 22, month: 6, year: 2026, colorClass: 'bg-violet-600 text-white', type: 'community', eventType: 'onboarding' },
  { id: 'cal-5', title: 'ONBOARDING', time: '00:00', allDay: true, date: 23, month: 6, year: 2026, colorClass: 'bg-violet-600 text-white', type: 'community', eventType: 'onboarding' },
  { id: 'cal-6', title: 'ONBOARDING', time: '00:00', allDay: true, date: 24, month: 6, year: 2026, colorClass: 'bg-violet-600 text-white', type: 'community', eventType: 'onboarding' },
  { id: 'cal-7', title: 'ONBOARDING', time: '00:00', allDay: true, date: 25, month: 6, year: 2026, colorClass: 'bg-violet-600 text-white', type: 'community', eventType: 'onboarding' },
  { id: 'cal-8', title: 'ONBOARDING', time: '00:00', allDay: true, date: 26, month: 6, year: 2026, colorClass: 'bg-violet-600 text-white', type: 'community', eventType: 'onboarding' },
  { id: 'cal-9', title: 'OFFICE HOUR', time: '20:00', endTime: '21:00', dayOfWeek: 2, startRecur: new Date(2026, 6, 27).getTime(), endRecur: new Date(2026, 7, 31).getTime(), colorClass: 'bg-blue-600 text-white', type: 'community', eventType: 'office-hour' },
  { id: 'cal-10', title: 'LIVE CLASS', time: '20:30', endTime: '22:30', dayOfWeek: 4, startRecur: new Date(2026, 6, 27).getTime(), endRecur: new Date(2026, 7, 31).getTime(), colorClass: 'bg-orange-600 text-white', type: 'class', eventType: 'live-class', details: 'Thứ 5 — 20:30-22:30\nOnline via Zoom\nSự kiện học thuật' },
  { id: 'cal-11', title: 'LIVE CLASS', time: '14:30', endTime: '16:30', dayOfWeek: 7, startRecur: new Date(2026, 6, 27).getTime(), endRecur: new Date(2026, 7, 26).getTime(), colorClass: 'bg-orange-600 text-white', type: 'class', eventType: 'live-class', details: 'Chủ Nhật — 14:30-16:30\nOnline via Zoom\nSự kiện học thuật' }
];

const SEED_ABOUT_CONTENT: AboutContent = {
  overviewText: `Build With The1ight (BWT1L) là gì?\nKhóa học dành cho dân văn phòng và người làm nghề tự do (freelancer), giúp bạn học cách xây sản phẩm đầu tay, kiểm định ý tưởng, và khai phá khả năng tạo thu nhập từ chính sản phẩm số do mình xây dựng.`,
  scheduleText: `⚓ Lộ trình hành trình vượt biển:\n\nChặng 1: Kick-off Meeting - Lập kế hoạch, kết nối đồng đội và thống nhất mục tiêu.\n\nChặng 2: Onboarding Week - Làm quen công cụ, thiết lập tài khoản và chuẩn bị tâm thế cướp biển.\n\nChặng 3: 09 buổi học Live Class - Học liệu (Recording, Slide,...) được update sau mỗi buổi học. Đăng ký Office Hour để trao đổi trực tiếp.\n\nChặng 4: Capstone Project - Bài tốt nghiệp cuối khóa, thử nghiệm thực tế và pitching trước mentor.`,
  benefitsText: `🎁 Quyền lợi của bạn:\n- Nhận phản hồi trực tiếp từ mentor Đặng Tuyết Hồng\n- Mở khóa các bài học chuyên sâu về AI, n8n, Supabase\n- Tham gia cộng đồng cướp biển cực kỳ năng động và thiện chiến!`
};

// ==========================================
// Context Provider Implementation
// ==========================================

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ── MASTER VERSION GUARD ─────────────────────────────────────────────────
  // Bump DB_VERSION whenever a breaking schema/seed change is made.
  // This auto-clears ALL localStorage so stale cached data never blocks updates.
  const DB_VERSION = 'lms_v4';
  const storedDbVersion = localStorage.getItem('lms_db_version');
  if (storedDbVersion !== DB_VERSION) {
    // Wipe everything except the active user preference
    const savedUserId = localStorage.getItem('lms_active_user_id');
    localStorage.clear();
    if (savedUserId) localStorage.setItem('lms_active_user_id', savedUserId);
    localStorage.setItem('lms_db_version', DB_VERSION);
  }
  // ─────────────────────────────────────────────────────────────────────────

  // Load initial states from LocalStorage or use preloaded seed data
  const [activeUserId, setActiveUserId] = useState<string>(() => {
    return localStorage.getItem('lms_active_user_id') || 'profile-student-tuyethong';
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
  const SYLLABUS_VERSION = 'v201_v3';
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

  const [topics, setTopics] = useState<DiscussionTopic[]>(() => 
    safeParse('lms_discussion_topics', SEED_TOPICS)
  );

  const [discussionPosts, setDiscussionPosts] = useState<DiscussionPost[]>(() => 
    safeParse('lms_discussion_posts', SEED_POSTS)
  );

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => 
    safeParse('lms_announcements', SEED_ANNOUNCEMENTS)
  );

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => 
    safeParse('lms_calendar_events', SEED_CALENDAR_EVENTS)
  );

  const [onboardingDays, setOnboardingDays] = useState<OnboardingDay[]>(() => 
    safeParse('lms_onboarding_days', SEED_ONBOARDING_DAYS)
  );

  const [onboardingUnlockSchedules, setOnboardingUnlockSchedules] = useState<OnboardingUnlockSchedule[]>(() => 
    safeParse('lms_onboarding_unlock_schedules', SEED_ONBOARDING_UNLOCK_SCHEDULES)
  );

  const [aboutContent, setAboutContent] = useState<AboutContent>(() => 
    safeParse('lms_about_content', SEED_ABOUT_CONTENT)
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

  // Derived Active User object
  const activeUser = profiles.find(p => p.id === activeUserId) || profiles[1];

  // Switch role action helper
  const switchUser = (role: UserRole) => {
    if (role === 'admin' || role === 'mentor') {
      setActiveUserId('profile-admin-hong');
    } else {
      setActiveUserId('profile-student-tuyethong');
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
      // Create a new profile with selected role
      const newId = `profile-${role}-${Date.now()}`;
      const newProfile: Profile = {
        id: newId,
        full_name: email.split('@')[0], // default name from email prefix
        avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
        role: role,
        telegram_id: '',
        bio: role === 'admin' ? 'Giảng viên / Quản trị viên mới.' : 'Thủy thủ mới gia nhập hải trình.',
        gmail: cleanEmail,
        phone_number: '',
        facebook_url: '',
        is_profile_completed: false,
        nautical_miles: 0,
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

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('lms_is_authenticated');
  };

  // Profile management
  const updateProfile = (profileId: string, updates: Partial<Profile>) => {
    setProfiles(prev => prev.map(p => {
      if (p.id === profileId) {
        const updated = { ...p, ...updates };
        
        // Rules Engine check: profile completion
        if (!p.is_profile_completed && updated.gmail && updated.phone_number && updated.facebook_url && updated.industry && updated.current_job && updated.product_idea && updated.weekly_hours_commitment && updated.motivation_bet) {
          updated.is_profile_completed = true;
          
          // Award miles
          addNauticalMiles(profileId, 50, 'profile_completion', 'Hoàn thành 100% hồ sơ cá nhân lần đầu');
          
          // Award badge
          unlockBadge(profileId, 'badge-profile-card');
        }
        
        return updated;
      }
      return p;
    }));
  };

  // Helper to add Nautical Miles
  const addNauticalMiles = (studentId: string, amount: number, actionType: NauticalMilesTransaction['action_type'], description: string, referenceId?: string) => {
    // Add transaction
    const newTx: NauticalMilesTransaction = {
      id: `tx-${Math.random().toString(36).substr(2, 9)}`,
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
        return { ...p, nautical_miles: newMiles };
      }
      return p;
    }));
  };

  // Helper to unlock badge
  const unlockBadge = (studentId: string, badgeId: string) => {
    setProfileBadges(prev => {
      const exists = prev.some(pb => pb.student_id === studentId && pb.badge_id === badgeId);
      if (exists) return prev;
      
      const badge = SEED_BADGES.find(b => b.id === badgeId);
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

      return [...prev, { student_id: studentId, badge_id: badgeId, unlocked_at: new Date().toISOString() }];
    });
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
    const id = existingIndex >= 0 ? submissions[existingIndex].id : `sub-${Math.random().toString(36).substr(2, 9)}`;
    
    const newSubmission: Submission = {
      id,
      assignment_id: assignmentId,
      batch_id: 'batch-3',
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
        unlockBadge(activeUserId, 'badge-iron-anchor');
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
  };

  const completeLesson = (lessonId: string) => {
    // Add NM for learning completion
    addNauticalMiles(activeUserId, 5, 'lesson_complete', `Đã học xong: ${lessons.find(l => l.id === lessonId)?.title || lessonId}`);
    
    // Check for Treasure Map badge
    // (requires all lessons to be completed, or simply mimics completion logic here)
    const completedLessonTx = nauticalTransactions.filter(t => t.student_id === activeUserId && t.action_type === 'lesson_complete');
    if (completedLessonTx.length + 1 >= SEED_LESSONS.length) {
      unlockBadge(activeUserId, 'badge-treasure-map');
    }
  };

  const addComment = (submissionId: string, commentText: string) => {
    const newComment: Comment = {
      id: `comm-${Math.random().toString(36).substr(2, 9)}`,
      submission_id: submissionId,
      batch_id: 'batch-3',
      author_id: activeUserId,
      content: commentText,
      upvotes_count: 0,
      is_verified: false,
      created_at: new Date().toISOString(),
      upvoted_by: []
    };

    setComments(prev => [...prev, newComment]);
    
    // Reward for active crew collaboration
    addNauticalMiles(activeUserId, 5, 'comment_added', 'Bình luận thảo luận chéo bài nộp đồng đội', newComment.id);
  };

  const upvoteComment = (commentId: string) => {
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
            unlockBadge(c.author_id, 'badge-lifebuoy');
          }
        }

        return { ...c, upvotes_count: newUpvotes, upvoted_by: newList };
      }
      return c;
    }));
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
      unlockBadge(studentId, 'badge-lighthouse');
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

        return { ...c, is_verified: true };
      }
      return c;
    }));
  };

  const addTopic = (name: string, description: string) => {
    const newTopic: DiscussionTopic = {
      id: `topic-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      created_by: activeUserId,
      created_at: new Date().toISOString()
    };
    setTopics(prev => [...prev, newTopic]);
    addNotification(
      'Thêm chủ đề thảo luận mới',
      `Mentor ${activeUser.full_name} đã tạo chủ đề thảo luận: "${name}"`,
      'system'
    );
  };

  const addDiscussionPost = (topicId: string, title: string, content: string, tags: string[] = []) => {
    const newPost: DiscussionPost = {
      id: `post-${Math.random().toString(36).substr(2, 9)}`,
      topic_id: topicId,
      author_id: activeUserId,
      title,
      content,
      tags,
      created_at: new Date().toISOString(),
      upvotes_count: 0,
      upvoted_by: []
    };
    setDiscussionPosts(prev => [newPost, ...prev]);

    // Reward for active crew collaboration: +10 Nautical Miles
    addNauticalMiles(activeUserId, 10, 'post_created', `Đăng bài thảo luận mới: "${title}"`, newPost.id);

    addNotification(
      'Đăng bài mới thành công',
      `Bạn vừa đăng bài: "${title}"`,
      'system'
    );
  };

  const upvoteDiscussionPost = (postId: string) => {
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

        return { ...p, upvotes_count: newUpvotes, upvoted_by: newList };
      }
      return p;
    }));
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

        return { ...s, upvotes_count: newUpvotes, upvoted_by: newList };
      }
      return s;
    }));
  };

  // ==========================================
  // Admin Action Mutation Implementations
  // ==========================================

  const addAnnouncement = (title: string, content: string, sendEmail: boolean) => {
    const newAnn: Announcement = {
      id: `ann-${Math.random().toString(36).substr(2, 9)}`,
      title,
      content,
      author: activeUser.role === 'admin' ? 'Admin Team' : activeUser.full_name,
      created_by: activeUserId,
      send_email: sendEmail,
      sent_email_at: sendEmail ? new Date().toISOString() : undefined,
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
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    addNotification('Xóa thông báo', 'Đã gỡ bỏ thông báo', 'system');
  };

  const addCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `cal-${Math.random().toString(36).substr(2, 9)}`
    };
    setCalendarEvents(prev => [...prev, newEvent]);
    addNotification('Thêm lịch sự kiện', `Sự kiện "${event.title}" đã được thêm vào lịch trình`, 'system');
  };

  const updateCalendarEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setCalendarEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    addNotification('Cập nhật lịch sự kiện', 'Lịch trình sự kiện đã được điều chỉnh', 'system');
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents(prev => prev.filter(e => e.id !== id));
    addNotification('Xóa lịch sự kiện', 'Đã gỡ bỏ sự kiện khỏi lịch trình', 'system');
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
  };

  const updateOnboardingUnlockSchedule = (dayNumber: number, scheduledAt: string) => {
    setOnboardingUnlockSchedules(prev => prev.map(s => s.day === dayNumber ? { ...s, scheduled_at: scheduledAt, unlock_email_sent: false } : s));
    addNotification('Hẹn giờ mở khóa', `Đã đặt lịch mở khóa Ngày ${dayNumber} vào lúc ${new Date(scheduledAt).toLocaleString()}`, 'system');
  };

  const updateAboutContent = (updates: Partial<AboutContent>) => {
    setAboutContent(prev => ({ ...prev, ...updates }));
    addNotification('Cập nhật Giới thiệu', 'Thông tin giới thiệu khóa học đã được cập nhật', 'system');
  };

  const updateLesson = (id: string, updates: Partial<Lesson>) => {
    setLessons(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
    addNotification('Cập nhật bài học', 'Nội dung bài học đã được cập nhật', 'system');
  };

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    setAssignments(prev => {
      const exists = prev.some(a => a.id === id);
      if (exists) {
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
        return [...prev, newAssignment];
      }
    });
    addNotification('Cập nhật bài tập', 'Chi tiết bài tập đã được cập nhật', 'system');
  };

  const updateModule = (id: string, updates: Partial<Module>) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    addNotification('Cập nhật chương học', 'Thông tin chương học đã được cập nhật', 'system');
  };

  const addLesson = (lesson: Lesson) => {
    setLessons(prev => [...prev, lesson]);
    addNotification('Thêm bài giảng', `Bài giảng "${lesson.title}" đã được thêm thành công`, 'system');
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

  return (
    <DatabaseContext.Provider value={{
      activeUser,
      switchUser,
      users: profiles,
      updateProfile,
      isAuthenticated,
      loginWithGmail,
      logout,
      courses: SEED_COURSES,
      batches: SEED_BATCHES,
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
      topics,
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
      updateModule,
      addLesson
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
