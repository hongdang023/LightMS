export type UserRole = 'student' | 'admin';

export type AdminRole = 'Founder' | 'Trainer' | 'Teaching Assistant (TA)' | 'Operations';

export interface Admin {
  id: string;
  full_name: string;
  avatar_url: string;
  gmail: string;
  phone_number?: string;
  admin_role?: AdminRole;
  assigned_batches?: string[];
  expertise_areas?: string;
  is_onboarded?: boolean;
  telegram_id?: string;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  role?: UserRole;
  gmail: string;
  phone_number?: string;
  facebook_url?: string;
  industry?: string;
  current_job?: string;
  product_idea?: string;
  is_profile_completed: boolean;
  nautical_miles: number;
  visits: number;
  referral_source?: string;
  current_role?: string;
  work_field?: string;
  living_region?: string;
  gender?: string;
  age_group?: string;
  onboarding_tasks?: Record<string, boolean>;
  liveclass_tasks?: Record<string, boolean>;
  badges?: { badge_id: string; unlocked_at: string }[];
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

export interface Lesson {
  id: string;
  course_id?: string;
  title: string;
  type?: string;
  content: string;
  video_url: string;
  order_index: number;
  start_date?: string;
  target?: string;
  has_materials?: boolean;
  slide_url?: string;
  study_note_url?: string;
  key_concepts?: string[];
  supporting_resources?: { label: string; url: string }[];
  assignment_description?: string;
  assignment_rubric_checklist?: { item: string; checked: boolean; is_optional?: boolean }[];
}

export interface NauticalMilesTransaction {
  id: string;
  student_id: string;
  amount: number;
  action_type: 'profile_completion' | 'lesson_complete' | 'assignment_submitted' | 'assignment_graded' | 'submission_kudos' | 'onboarding_day_complete';
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

/**
 * @deprecated Không còn dùng junction table profile_badges.
 * Badges học viên được lưu trực tiếp trong profiles.badges (JSONB array).
 * Interface này giữ lại tạm thời để tránh breaking GamificationContext.
 */
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

export type AnnouncementCategory = 'system' | 'leaderboard' | 'content_update' | 'schedule' | 'achievement';

export interface Announcement {
  id: string;
  course_id?: string;
  batch_id?: string;
  title: string;
  content: string;
  created_by: string;
  send_email: boolean;
  sent_email_at?: string;
  media_urls?: string[];
  created_at: string;
  isNew?: boolean;
  category?: AnnouncementCategory;
  is_auto?: boolean;
  target_id?: string;
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
  endTime?: string;
  allDay?: boolean;
  date?: number;
  month?: number;
  year?: number;
  dayOfWeek?: number;
  startRecur?: number;
  endRecur?: number;
  colorClass: string;
  dotColorClass?: string;
  type: 'class' | 'community' | 'other';
  eventType?: EventType;
  details?: string;
}

export interface AboutContent {
  overviewText: string;
  scheduleText: string;
  benefitsText: string;
  // Extended editable fields
  videoUrl?: string;
  platformButtons?: { icon: string; title: string; subtitle: string; url: string }[];
  benefitClubs?: { icon: string; name: string; desc: string; links: { label: string; url: string }[] }[];
  quote?: string;
  gachDauDong?: string[];
  truCot1?: { title: string; subtitle: string; desc: string };
  truCot2?: { title: string; subtitle: string; desc: string };
  truCot3?: { title: string; subtitle: string; desc: string };
  outro?: string;
  sdtNote?: string;
  officeHourDesc?: string;
  luuYGold?: string;
}

export interface HelpDeskFaqSection {
  id: string;
  title: string;
  content: string; // Markdown string
}

export interface HelpDeskFaq {
  id: string;
  category: string;
  question: string;
  description: string;
  last_updated: string;
  sections: HelpDeskFaqSection[];
  order_index: number;
}
