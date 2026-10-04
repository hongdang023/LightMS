import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// ==========================================
// 1. USERS & PROFILES
// ==========================================
export const users = sqliteTable('users', {
  id: text('id').primaryKey(), // UUID v4
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  fullName: text('full_name').notNull(),
  avatarUrl: text('avatar_url'),
  role: text('role').notNull().default('student'), // 'admin' | 'student'
  adminRole: text('admin_role'), // 'Founder' | 'Trainer' | 'TA' | 'Operations'
  phoneNumber: text('phone_number'),
  facebookUrl: text('facebook_url'),
  industry: text('industry'),
  currentJob: text('current_job'),
  productIdea: text('product_idea'),
  isProfileCompleted: integer('is_profile_completed', { mode: 'boolean' }).notNull().default(false),
  nauticalMiles: integer('nautical_miles').notNull().default(0),
  visits: integer('visits').notNull().default(0),
  referralSource: text('referral_source'),
  currentRole: text('current_role'),
  workField: text('work_field'),
  livingRegion: text('living_region'),
  gender: text('gender'),
  ageGroup: text('age_group'),
  onboardingTasksJson: text('onboarding_tasks_json').default('{}'), // Record<string, boolean>
  liveclassTasksJson: text('liveclass_tasks_json').default('{}'),
  badgesJson: text('badges_json').default('[]'), // Array of { badge_id, unlocked_at }
  createdAt: text('created_at').notNull(),
});

// ==========================================
// 2. COURSES (Hệ sinh thái Khóa học)
// ==========================================
export const courses = sqliteTable('courses', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(), // e.g. 'vibe-coding-101', 'vibe-coding-201', 'obsidian-101', 'mobile-agents'
  title: text('title').notNull(),
  description: text('description'),
  coverImage: text('cover_image'),
  tagline: text('tagline'),
  level: text('level').default('Beginner'), // 'Beginner' | 'Intermediate' | 'Advanced'
  category: text('category').default('AI & Productivity'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
});

// ==========================================
// 3. BATCHES (Lớp học / Cohort & Mã kích hoạt Access Code)
// ==========================================
export const batches = sqliteTable('batches', {
  id: text('id').primaryKey(),
  courseId: text('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  batchCode: text('batch_code').notNull(), // e.g. 'K1', 'K2', 'K3'
  title: text('title').notNull(), // e.g. 'Vibe Coding 201 - Khóa 3'
  accessCode: text('access_code').notNull().unique(), // Mã kích hoạt độc bản: 'VIBE201-K3-888'
  startDate: text('start_date'),
  endDate: text('end_date'),
  mentorId: text('mentor_id').references(() => users.id),
  maxStudents: integer('max_students').default(50),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
});

// ==========================================
// 4. BATCH ENROLLMENTS (Học viên tham gia Batch qua Access Code)
// ==========================================
export const batchEnrollments = sqliteTable('batch_enrollments', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  batchId: text('batch_id').notNull().references(() => batches.id, { onDelete: 'cascade' }),
  courseId: text('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  accessCodeUsed: text('access_code_used').notNull(),
  enrolledAt: text('enrolled_at').notNull(),
  status: text('status').notNull().default('active'), // 'active' | 'suspended' | 'completed'
});

// ==========================================
// 5. LESSONS (Nội dung Bài học dùng chung theo Course)
// ==========================================
export const lessons = sqliteTable('lessons', {
  id: text('id').primaryKey(),
  courseId: text('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  type: text('type').notNull().default('video'), // 'video' | 'document'
  content: text('content'),
  videoUrl: text('video_url'),
  orderIndex: integer('order_index').notNull(),
  target: text('target'),
  hasMaterials: integer('has_materials', { mode: 'boolean' }).default(false),
  slideUrl: text('slide_url'),
  studyNoteUrl: text('study_note_url'),
  keyConceptsJson: text('key_concepts_json').default('[]'),
  supportingResourcesJson: text('supporting_resources_json').default('[]'),
  assignmentDescription: text('assignment_description'),
  assignmentRubricJson: text('assignment_rubric_json').default('[]'),
  createdAt: text('created_at').notNull(),
});

// ==========================================
// 6. CALENDAR EVENTS (Lịch học tách riêng theo Batch)
// ==========================================
export const calendarEvents = sqliteTable('calendar_events', {
  id: text('id').primaryKey(),
  batchId: text('batch_id').notNull().references(() => batches.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  eventType: text('event_type').notNull(), // 'Kick-off' | 'Live Class' | 'Office Hour' | 'Capstone'
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  meetingUrl: text('meeting_url'),
  description: text('description'),
  createdAt: text('created_at').notNull(),
});

// ==========================================
// 7. SUBMISSIONS (Bài nộp tách riêng theo Batch)
// ==========================================
export const submissions = sqliteTable('submissions', {
  id: text('id').primaryKey(),
  batchId: text('batch_id').notNull().references(() => batches.id, { onDelete: 'cascade' }),
  lessonId: text('lesson_id').notNull().references(() => lessons.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  facebookPostUrl: text('facebook_post_url'),
  submissionNote: text('submission_note'),
  status: text('status').notNull().default('pending'), // 'pending' | 'graded' | 'mastery'
  feedbackText: text('feedback_text'),
  gradedBy: text('graded_by').references(() => users.id),
  submittedAt: text('submitted_at').notNull(),
  gradedAt: text('graded_at'),
});

// ==========================================
// 9. GAMIFICATION (Nautical Miles & Badges)
// ==========================================
export const nauticalMilesTransactions = sqliteTable('nautical_miles_transactions', {
  id: text('id').primaryKey(),
  studentId: text('student_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  batchId: text('batch_id').references(() => batches.id, { onDelete: 'cascade' }),
  amount: integer('amount').notNull(),
  actionType: text('action_type').notNull(),
  referenceId: text('reference_id'),
  description: text('description').notNull(),
  createdAt: text('created_at').notNull(),
});

export const badges = sqliteTable('badges', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  icon: text('icon').notNull(),
  description: text('description').notNull(),
  condition: text('condition').notNull(),
});

// ==========================================
// 10. ONBOARDING DAYS (Tuần Onboarding theo Course/Batch)
// ==========================================
export const onboardingDays = sqliteTable('onboarding_days', {
  id: text('id').primaryKey(),
  courseId: text('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  batchId: text('batch_id').references(() => batches.id, { onDelete: 'cascade' }),
  day: integer('day').notNull(),
  title: text('title').notNull(),
  intro: text('intro'),
  objective: text('objective'),
  checklist: text('checklist').notNull(),
  takeaway: text('takeaway'),
  emailSubject: text('email_subject'),
  emailBody: text('email_body'),
  companionHint: text('companion_hint'),
  bonusResources: text('bonus_resources'),
  createdAt: text('created_at').notNull(),
});
