# LightMS - B2: Database Schema (Thiết kế Cơ sở dữ liệu Cloudflare D1)

> **Last Updated:** 2026-10-01 | **Status:** ✅ Cloudflare D1 SQLite & Drizzle ORM Schema (Multi-Course & Access Code)

Hệ thống sử dụng **Cloudflare D1** (Serverless SQLite Database) làm cơ sở dữ liệu chính, tương tác thông qua **Drizzle ORM**.

---

## 1. Core Tables & Drizzle Definitions

### 1.1. Users & Profiles (`users`)

Lưu trữ thông tin học viên & admin. Xác thực thông qua Cloudflare Worker JWT API.

```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

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
  onboardingTasksJson: text('onboarding_tasks_json').default('{}'), // JSON Stringified
  badgesJson: text('badges_json').default('[]'), // JSON Stringified
  createdAt: text('created_at').notNull(),
});
```

---

### 1.2. Multi-Course & Multi-Batch Management

#### `courses` (Danh mục Khóa học)
```typescript
export const courses = sqliteTable('courses', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(), // e.g. 'vibe-coding-101', 'vibe-coding-201', 'obsidian-101'
  title: text('title').notNull(),
  description: text('description'),
  coverImage: text('cover_image'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
});
```

#### `batches` (Danh sách Lớp học / Batch & Mã kích hoạt)
```typescript
export const batches = sqliteTable('batches', {
  id: text('id').primaryKey(),
  courseId: text('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  batchCode: text('batch_code').notNull(), // e.g. 'K1', 'K2', 'OCT2026'
  title: text('title').notNull(), // e.g. 'Vibe Coding 201 - Khóa 3'
  accessCode: text('access_code').notNull().unique(), // Mã kích hoạt nhập để vào học (VD: 'VIBE201-K3-888')
  startDate: text('start_date'),
  endDate: text('end_date'),
  mentorId: text('mentor_id').references(() => users.id),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
});
```

#### `batch_enrollments` (Ghi danh Học viên theo Batch)
```typescript
export const batchEnrollments = sqliteTable('batch_enrollments', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  batchId: text('batch_id').notNull().references(() => batches.id, { onDelete: 'cascade' }),
  accessCodeUsed: text('access_code_used').notNull(),
  enrolledAt: text('enrolled_at').notNull(),
  status: text('status').notNull().default('active'), // 'active' | 'suspended' | 'completed'
});
```

#### `batch_staff` (Nhân sự phân công theo Batch)
```typescript
export const batchStaff = sqliteTable('batch_staff', {
  id: text('id').primaryKey(),
  batchId: text('batch_id').notNull().references(() => batches.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  roleInBatch: text('role_in_batch').notNull(), // 'lead_trainer' | 'co_trainer' | 'assistant_ta'
  assignedAt: text('assigned_at').notNull(),
});
```

---

### 1.3. Batch Curriculum & Học liệu (Quản lý Link Trực tiếp theo Batch)

#### `lessons` (Bài học & Tài nguyên Links riêng của từng Batch)
> Khi mở Batch mới, hệ thống hỗ trợ 1-click clone toàn bộ danh sách bài học và tài liệu nền từ Batch trước sang Batch mới. Mỗi Batch sở hữu link recording, slide và study note riêng.

```typescript
export const lessons = sqliteTable('lessons', {
  id: text('id').primaryKey(),
  batchId: text('batch_id').notNull().references(() => batches.id, { onDelete: 'cascade' }),
  orderIndex: integer('order_index').notNull(),
  title: text('title').notNull(),
  agenda: text('agenda'), // Tóm tắt nội dung chính
  recordingUrl: text('recording_url'), // Link video recording riêng của buổi live (YouTube, Loom, Zoom...)
  slideUrl: text('slide_url'), // Link Google Slides, Canva...
  studyNoteUrl: text('study_note_url'), // Link Notion / Google Docs...
  aiBotUrl: text('ai_bot_url'), // Link NotebookLM Bot
  assignmentTitle: text('assignment_title'),
  assignmentDescription: text('assignment_description'),
  assignmentResourceUrl: text('assignment_resource_url'),
  assignmentRubricJson: text('assignment_rubric_json').default('[]'),
  createdAt: text('created_at').notNull(),
});
```

---

### 1.4. Batch-Scoped Entities (Lịch học, Bài nộp)

#### `calendar_events` (Lịch học Live Zoom/Meet theo Batch)
```typescript
export const calendarEvents = sqliteTable('calendar_events', {
  id: text('id').primaryKey(),
  batchId: text('batch_id').notNull().references(() => batches.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  eventType: text('event_type').notNull(), // 'Kick-off' | 'Live Class' | 'Office Hour' | 'Capstone'
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  meetingUrl: text('meeting_url'),
  description: text('description'),
});
```

#### `submissions` (Bài nộp & Phản hồi theo Batch)
> Hệ thống **không chấm điểm** mà chỉ quản lý việc nộp bài và phản hồi hỗ trợ: Học viên đăng bài lên Facebook Group và bấm xác nhận nộp bài. Admin/Trainer/TA theo dõi tiến độ nộp bài và gửi phản hồi (Feedback) động viên, giải đáp thắc mắc.

```typescript
export const submissions = sqliteTable('submissions', {
  id: text('id').primaryKey(),
  batchId: text('batch_id').notNull().references(() => batches.id, { onDelete: 'cascade' }),
  lessonId: text('lesson_id').notNull().references(() => lessons.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  facebookPostUrl: text('facebook_post_url'), // Link bài tập trên Facebook Group của lớp
  submissionNote: text('submission_note'),
  status: text('status').notNull().default('submitted'), // 'submitted' (đã nộp) | 'reviewed' (đã phản hồi)
  feedbackText: text('feedback_text'), // Nhận xét / Phản hồi hỗ trợ từ Trainer hoặc TA
  reviewedBy: text('reviewed_by').references(() => users.id),
  submittedAt: text('submitted_at').notNull(),
  reviewedAt: text('reviewed_at'),
});
```


---

## 2. Dynamic Relationships Summary

- **Course** `1 --- N` **Batch**
- **Batch** `1 --- N` **BatchEnrollment** `N --- 1` **User**
- **Batch** `1 --- N` **BatchStaff** `N --- 1` **User**
- **Batch** `1 --- N` **Lesson** (Độc lập theo Batch, hỗ trợ 1-click clone)
- **Batch** `1 --- N` **CalendarEvent**
- **Batch** `1 --- N` **Announcement**
- **Batch** `1 --- N` **Submission**

