import type { Course, Batch, BatchEnrollment, Lesson, CalendarEvent, OnboardingDay } from '../types/database';
import { VIBE_201_LESSONS } from './vibeLessons';
import { VIBE_7DAY_ONBOARDING_DAYS } from './vibeOnboardingDays';
import { VIBE_201_CALENDAR_EVENTS } from './vibeCalendarEvents';

export { VIBE_7DAY_ONBOARDING_DAYS, VIBE_201_CALENDAR_EVENTS };

export { VIBE_201_LESSONS };

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-vibe-201',
    slug: 'vibe-coding-201',
    title: 'Vibe Coding 201: Build Scalable Product with AI',
    description: 'Khóa học chuyên sâu hướng dẫn xây dựng và scale sản phẩm số hoàn chỉnh từ ý tưởng đến triển khai bằng AI coding agents, Cloudflare Edge & modern stack.',
    tagline: 'Làm chủ tư duy kiến trúc và quy trình phát triển sản phẩm với AI Agents',
    cover_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    level: 'Intermediate',
    category: 'AI Software Development',
    is_active: true,
  },
  {
    id: 'course-obsidian-101',
    slug: 'obsidian-101',
    title: 'Obsidian 101: Xây một hệ thống ghi chú và xử lý tri thức với Obsidian và AI',
    description: 'Xây một hệ thống ghi chú và xử lý tri thức với Obsidian và AI. Chuyển đổi từ ghi chú rời rạc thành hệ thống tri thức sống, tối ưu hóa hiệu suất làm việc với AI.',
    tagline: 'Từ ghi chú rời rạc → Hệ thống tri thức sống → Làm việc hiệu suất hơn với AI',
    cover_image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80',
    level: 'Beginner',
    category: 'Productivity & AI Knowledge',
    is_active: true,
  },
  {
    id: 'course-vibe-101',
    slug: 'vibe-coding-101',
    title: 'Vibe Coding 101: Nhập môn AI & Tạo sản phẩm đầu tiên',
    description: 'Khởi đầu hành trình làm quen với lập trình tương tác cùng AI, xây dựng landing page, web app đơn giản và tư duy Prompt Engineering thực chiến.',
    tagline: 'Từ người không biết code đến tự tay làm ra sản phẩm đầu tiên trong 1 tuần',
    cover_image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    level: 'Beginner',
    category: 'AI Foundations',
    is_active: false,
  },
  {
    id: 'course-mobile-agents',
    slug: 'mobile-agents',
    title: 'Mobile Agents: Xây dựng Ứng dụng Di động với AI',
    description: 'Phát triển ứng dụng mobile đa nền tảng (iOS / Android) với React Native, Expo và AI Agents tự động hóa workflow.',
    tagline: 'Đưa ý tưởng ứng dụng của bạn lên màn hình điện thoại trong thời gian kỷ lục',
    cover_image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
    level: 'Advanced',
    category: 'Mobile & AI Agents',
    is_active: false,
  },
];

export const INITIAL_BATCHES: Batch[] = [
  // Vibe Coding 201 Batches (Dữ liệu thật)
  {
    id: 'batch-vibe201-k2',
    course_id: 'course-vibe-201',
    batch_code: 'K2',
    name: 'Vibe Coding 201 - Khóa 2',
    access_code: 'VIBE201-K2-888',
    start_date: '15/09/2026',
    end_date: '15/11/2026',
    max_students: 50,
    is_active: true,
  },
  {
    id: 'batch-vibe201-k1',
    course_id: 'course-vibe-201',
    batch_code: 'K1',
    name: 'Vibe Coding 201 - Khóa 1 (Đã kết thúc)',
    access_code: 'VIBE201-K1-OLD',
    start_date: '01/06/2026',
    end_date: '01/08/2026',
    max_students: 50,
    is_active: false,
  },
  // Obsidian 101 Batches (Dữ liệu thật)
  {
    id: 'batch-obs101-k1',
    course_id: 'course-obsidian-101',
    batch_code: 'K1',
    name: 'Obsidian 101 - Khóa 1',
    access_code: 'OBS101-K1-999',
    start_date: '06/10/2026',
    end_date: '01/11/2026',
    max_students: 80,
    is_active: true,
  },
  // Các khóa chưa có dữ liệu thật (Khóa lại)
  {
    id: 'batch-vibe101-k3',
    course_id: 'course-vibe-101',
    batch_code: 'K3',
    name: 'Vibe Coding 101 - Khóa 3',
    access_code: 'VIBE101-K3-ARCHIVE',
    start_date: '01/03/2026',
    end_date: '31/05/2026',
    max_students: 100,
    is_active: false,
  },
  {
    id: 'batch-mobile-k1',
    course_id: 'course-mobile-agents',
    batch_code: 'K1',
    name: 'Mobile Agents - Khóa 1',
    access_code: 'MOBILE-K1-777',
    start_date: '01/11/2026',
    end_date: '15/12/2026',
    max_students: 40,
    is_active: false,
  },
];


// Mặc định ban đầu học viên test đã enroll vào Obsidian 101 - Khóa 1
export const INITIAL_ENROLLMENTS: BatchEnrollment[] = [
  {
    "id": "enroll-vibe201-test",
    "user_id": "student-1",
    "batch_id": "batch-vibe201-k2",
    "course_id": "course-vibe-201",
    "access_code_used": "VIBE201-K2-888",
    "enrolled_at": "2026-09-15T08:00:00Z",
    "status": "active"
  },
  {
    "id": "enroll-vibe-49472419-ad0b-477c-a072-bae0eac513a2",
    "user_id": "49472419-ad0b-477c-a072-bae0eac513a2",
    "batch_id": "batch-vibe201-k2",
    "course_id": "course-vibe-201",
    "access_code_used": "VIBE201-K2-888",
    "enrolled_at": "2026-10-02T01:38:55.87+00:00",
    "status": "active"
  },
  {
    "id": "enroll-vibe-473fdf4c-fc55-4db3-8baa-8a72e75084ad",
    "user_id": "473fdf4c-fc55-4db3-8baa-8a72e75084ad",
    "batch_id": "batch-vibe201-k2",
    "course_id": "course-vibe-201",
    "access_code_used": "VIBE201-K2-888",
    "enrolled_at": "2026-08-08T14:15:54.447+00:00",
    "status": "active"
  },
  {
    "id": "enroll-vibe-157feb49-356b-4b7d-88c0-98e47c2ad683",
    "user_id": "157feb49-356b-4b7d-88c0-98e47c2ad683",
    "batch_id": "batch-vibe201-k2",
    "course_id": "course-vibe-201",
    "access_code_used": "VIBE201-K2-888",
    "enrolled_at": "2026-07-20T10:48:36.643153+00:00",
    "status": "active"
  },
  {
    "id": "enroll-vibe-dad6a889-3810-4198-9636-b1d3b288eaf1",
    "user_id": "dad6a889-3810-4198-9636-b1d3b288eaf1",
    "batch_id": "batch-vibe201-k2",
    "course_id": "course-vibe-201",
    "access_code_used": "VIBE201-K2-888",
    "enrolled_at": "2026-07-19T06:48:46.397862+00:00",
    "status": "active"
  },
  {
    "id": "enroll-vibe-df50b904-84fb-4526-8a84-0027d086cd9d",
    "user_id": "df50b904-84fb-4526-8a84-0027d086cd9d",
    "batch_id": "batch-vibe201-k2",
    "course_id": "course-vibe-201",
    "access_code_used": "VIBE201-K2-888",
    "enrolled_at": "2026-07-19T22:30:48.459967+00:00",
    "status": "active"
  },
  {
    "id": "enroll-vibe-5713126f-0a5d-4bb6-bb36-961964badb3e",
    "user_id": "5713126f-0a5d-4bb6-bb36-961964badb3e",
    "batch_id": "batch-vibe201-k2",
    "course_id": "course-vibe-201",
    "access_code_used": "VIBE201-K2-888",
    "enrolled_at": "2026-07-21T13:26:07.250097+00:00",
    "status": "active"
  },
  {
    "id": "enroll-vibe-832720fc-5309-4a40-918b-2d399078cd22",
    "user_id": "832720fc-5309-4a40-918b-2d399078cd22",
    "batch_id": "batch-vibe201-k2",
    "course_id": "course-vibe-201",
    "access_code_used": "VIBE201-K2-888",
    "enrolled_at": "2026-10-02T01:40:09.766+00:00",
    "status": "active"
  },
  {
    "id": "enroll-vibe-4c26fbe0-e880-4ab5-99d1-19c4c1a813ff",
    "user_id": "4c26fbe0-e880-4ab5-99d1-19c4c1a813ff",
    "batch_id": "batch-vibe201-k2",
    "course_id": "course-vibe-201",
    "access_code_used": "VIBE201-K2-888",
    "enrolled_at": "2026-08-06T07:22:57.141343+00:00",
    "status": "active"
  },
  {
    "id": "enroll-vibe-16865297-16ee-4ac2-bce4-f1a85482c084",
    "user_id": "16865297-16ee-4ac2-bce4-f1a85482c084",
    "batch_id": "batch-vibe201-k2",
    "course_id": "course-vibe-201",
    "access_code_used": "VIBE201-K2-888",
    "enrolled_at": "2026-07-22T13:37:32.02727+00:00",
    "status": "active"
  },
  {
    "id": "enroll-vibe-6849a940-fee3-4538-ac24-32900c691d55",
    "user_id": "6849a940-fee3-4538-ac24-32900c691d55",
    "batch_id": "batch-vibe201-k2",
    "course_id": "course-vibe-201",
    "access_code_used": "VIBE201-K2-888",
    "enrolled_at": "2026-08-29T15:05:20.40066+00:00",
    "status": "active"
  },
  {
    "id": "enroll-vibe-32c0e626-99f7-4bce-b763-4b92a30bdada",
    "user_id": "32c0e626-99f7-4bce-b763-4b92a30bdada",
    "batch_id": "batch-vibe201-k2",
    "course_id": "course-vibe-201",
    "access_code_used": "VIBE201-K2-888",
    "enrolled_at": "2026-07-19T14:54:59.329+00:00",
    "status": "active"
  },
  {
    "id": "enroll-vibe-b8947505-ffae-4fa5-9352-92b6201e13df",
    "user_id": "b8947505-ffae-4fa5-9352-92b6201e13df",
    "batch_id": "batch-vibe201-k2",
    "course_id": "course-vibe-201",
    "access_code_used": "VIBE201-K2-888",
    "enrolled_at": "2026-08-08T14:13:30.366+00:00",
    "status": "active"
  },
  {
    "id": "enroll-vibe-3d38fcca-304e-486b-bbe6-3a60e34736a2",
    "user_id": "3d38fcca-304e-486b-bbe6-3a60e34736a2",
    "batch_id": "batch-vibe201-k2",
    "course_id": "course-vibe-201",
    "access_code_used": "VIBE201-K2-888",
    "enrolled_at": "2026-10-02T10:17:24.682+00:00",
    "status": "active"
  },
  {
    "id": "enroll-vibe-f510bba7-12c8-4790-a820-8a59c83b98b7",
    "user_id": "f510bba7-12c8-4790-a820-8a59c83b98b7",
    "batch_id": "batch-vibe201-k2",
    "course_id": "course-vibe-201",
    "access_code_used": "VIBE201-K2-888",
    "enrolled_at": "2026-07-20T15:04:20.400686+00:00",
    "status": "active"
  },
  {
    "id": "enroll-vibe-3195584e-6674-4252-affa-ad911b6b8fc9",
    "user_id": "3195584e-6674-4252-affa-ad911b6b8fc9",
    "batch_id": "batch-vibe201-k2",
    "course_id": "course-vibe-201",
    "access_code_used": "VIBE201-K2-888",
    "enrolled_at": "2026-07-20T08:13:37.70101+00:00",
    "status": "active"
  },
  {
    "id": "enroll-vibe-69e858d0-8bbf-47b9-a8b2-afbc48b4aff5",
    "user_id": "69e858d0-8bbf-47b9-a8b2-afbc48b4aff5",
    "batch_id": "batch-vibe201-k2",
    "course_id": "course-vibe-201",
    "access_code_used": "VIBE201-K2-888",
    "enrolled_at": "2026-07-22T00:39:20.268+00:00",
    "status": "active"
  },
  {
    "id": "enroll-vibe-92683ce7-776e-46bc-89a7-0d0d5d2512c9",
    "user_id": "92683ce7-776e-46bc-89a7-0d0d5d2512c9",
    "batch_id": "batch-vibe201-k2",
    "course_id": "course-vibe-201",
    "access_code_used": "VIBE201-K2-888",
    "enrolled_at": "2026-09-03T08:37:14.259087+00:00",
    "status": "active"
  },
  {
    "id": "enroll-vibe-a957bcc4-a900-477c-9041-1ae2aa173b3f",
    "user_id": "a957bcc4-a900-477c-9041-1ae2aa173b3f",
    "batch_id": "batch-vibe201-k2",
    "course_id": "course-vibe-201",
    "access_code_used": "VIBE201-K2-888",
    "enrolled_at": "2026-10-02T10:31:10.934+00:00",
    "status": "active"
  },
  {
    "id": "enroll-vibe-55bbba3a-7e9d-4b74-8aff-3afec196be7c",
    "user_id": "55bbba3a-7e9d-4b74-8aff-3afec196be7c",
    "batch_id": "batch-vibe201-k2",
    "course_id": "course-vibe-201",
    "access_code_used": "VIBE201-K2-888",
    "enrolled_at": "2026-07-28T08:23:49.544456+00:00",
    "status": "active"
  },
  {
    "id": "enroll-vibe-fb1821ef-1a2f-4baa-830b-604c2a711197",
    "user_id": "fb1821ef-1a2f-4baa-830b-604c2a711197",
    "batch_id": "batch-vibe201-k2",
    "course_id": "course-vibe-201",
    "access_code_used": "VIBE201-K2-888",
    "enrolled_at": "2026-07-19T01:24:20.20837+00:00",
    "status": "active"
  },
  {
    "id": "enroll-vibe-add498ce-10ab-49ca-8596-94ca6e1d19d6",
    "user_id": "add498ce-10ab-49ca-8596-94ca6e1d19d6",
    "batch_id": "batch-vibe201-k2",
    "course_id": "course-vibe-201",
    "access_code_used": "VIBE201-K2-888",
    "enrolled_at": "2026-07-19T14:16:27.158499+00:00",
    "status": "active"
  },
  {
    "id": "enroll-vibe-31b4fdab-4287-4b39-ae88-a5bec8b65afb",
    "user_id": "31b4fdab-4287-4b39-ae88-a5bec8b65afb",
    "batch_id": "batch-vibe201-k2",
    "course_id": "course-vibe-201",
    "access_code_used": "VIBE201-K2-888",
    "enrolled_at": "2026-10-02T10:44:34.435+00:00",
    "status": "active"
  },
  {
    "id": "enroll-vibe-d3a81268-79b6-475d-a7bd-b4ab94efeed0",
    "user_id": "d3a81268-79b6-475d-a7bd-b4ab94efeed0",
    "batch_id": "batch-vibe201-k2",
    "course_id": "course-vibe-201",
    "access_code_used": "VIBE201-K2-888",
    "enrolled_at": "2026-07-25T07:38:02.443764+00:00",
    "status": "active"
  },
  {
    "id": "enroll-vibe-a5a4fbbe-4580-4682-82e1-daef6974c020",
    "user_id": "a5a4fbbe-4580-4682-82e1-daef6974c020",
    "batch_id": "batch-vibe201-k2",
    "course_id": "course-vibe-201",
    "access_code_used": "VIBE201-K2-888",
    "enrolled_at": "2026-08-05T13:34:40.423073+00:00",
    "status": "active"
  },
  {
    "id": "enroll-vibe-d2130e7b-d5f2-435b-a579-3c58da8f5441",
    "user_id": "d2130e7b-d5f2-435b-a579-3c58da8f5441",
    "batch_id": "batch-vibe201-k2",
    "course_id": "course-vibe-201",
    "access_code_used": "VIBE201-K2-888",
    "enrolled_at": "2026-07-24T21:25:44.058811+00:00",
    "status": "active"
  },
  {
    "id": "enroll-vibe-dbb7dd04-18f3-423d-b615-bb4d657cec8c",
    "user_id": "dbb7dd04-18f3-423d-b615-bb4d657cec8c",
    "batch_id": "batch-vibe201-k2",
    "course_id": "course-vibe-201",
    "access_code_used": "VIBE201-K2-888",
    "enrolled_at": "2026-07-21T01:01:27.00559+00:00",
    "status": "active"
  },
  {
    "id": "enroll-vibe-a9fd38f1-9cce-4ea9-b599-61ab4b5d26c0",
    "user_id": "a9fd38f1-9cce-4ea9-b599-61ab4b5d26c0",
    "batch_id": "batch-vibe201-k2",
    "course_id": "course-vibe-201",
    "access_code_used": "VIBE201-K2-888",
    "enrolled_at": "2026-07-22T04:34:10.956133+00:00",
    "status": "active"
  },
  {
    "id": "enroll-vibe-c25ff8c4-a2e2-4820-ae4f-345f62c0c6af",
    "user_id": "c25ff8c4-a2e2-4820-ae4f-345f62c0c6af",
    "batch_id": "batch-vibe201-k2",
    "course_id": "course-vibe-201",
    "access_code_used": "VIBE201-K2-888",
    "enrolled_at": "2026-07-18T15:35:51.425932+00:00",
    "status": "active"
  },
  {
    "id": "enroll-vibe-fb281fe4-676d-491c-80d7-f5e042567631",
    "user_id": "fb281fe4-676d-491c-80d7-f5e042567631",
    "batch_id": "batch-vibe201-k2",
    "course_id": "course-vibe-201",
    "access_code_used": "VIBE201-K2-888",
    "enrolled_at": "2026-09-20T02:18:59.997128+00:00",
    "status": "active"
  },
  {
    "id": "enroll-vibe-182aa24a-4a6a-4e27-8156-086aef323beb",
    "user_id": "182aa24a-4a6a-4e27-8156-086aef323beb",
    "batch_id": "batch-vibe201-k2",
    "course_id": "course-vibe-201",
    "access_code_used": "VIBE201-K2-888",
    "enrolled_at": "2026-08-05T13:40:09.956562+00:00",
    "status": "active"
  },
  {
    "id": "enroll-vibe-8d03f773-c326-46a2-b4e1-5d4a690ffdaf",
    "user_id": "8d03f773-c326-46a2-b4e1-5d4a690ffdaf",
    "batch_id": "batch-vibe201-k2",
    "course_id": "course-vibe-201",
    "access_code_used": "VIBE201-K2-888",
    "enrolled_at": "2026-08-23T04:32:30.624+00:00",
    "status": "active"
  },
  {
    "id": "enroll-vibe-816b99f9-cebf-4682-bd08-e88269347be8",
    "user_id": "816b99f9-cebf-4682-bd08-e88269347be8",
    "batch_id": "batch-vibe201-k2",
    "course_id": "course-vibe-201",
    "access_code_used": "VIBE201-K2-888",
    "enrolled_at": "2026-07-19T07:06:13.460482+00:00",
    "status": "active"
  },
  {
    "id": "enroll-vibe-56595c13-8459-4f75-88d6-7f3d81b5d4e7",
    "user_id": "56595c13-8459-4f75-88d6-7f3d81b5d4e7",
    "batch_id": "batch-vibe201-k2",
    "course_id": "course-vibe-201",
    "access_code_used": "VIBE201-K2-888",
    "enrolled_at": "2026-07-19T04:51:17.040764+00:00",
    "status": "active"
  },
  {
    "id": "enroll-vibe-d2a07e49-9e27-40dd-9989-88c90d67f761",
    "user_id": "d2a07e49-9e27-40dd-9989-88c90d67f761",
    "batch_id": "batch-vibe201-k2",
    "course_id": "course-vibe-201",
    "access_code_used": "VIBE201-K2-888",
    "enrolled_at": "2026-10-01T16:58:51.857+00:00",
    "status": "active"
  }
];

// ── Obsidian 101 Lessons ───────────────────────────────────────────────────
export const OBSIDIAN_LESSONS: Lesson[] = [
  {
    id: 'lesson-obs-b1',
    course_id: 'course-obsidian-101',
    title: 'Buổi 1: Foundation Setup',
    type: 'video',
    content: `Xây dựng Vault cá nhân chuẩn mực, thiết kế Home page trực quan và cài đặt các plugins thiết yếu để sử dụng được ngay.
- Cấu trúc thư mục Vault cá nhân tối ưu theo tiêu chuẩn.
- Thiết kế Dashboard/Home page điều hướng trực quan.
- Cài đặt và cấu hình bộ Community Plugins cốt lõi (Dataview, Templater, Calendar...).`,
    video_url: 'https://youtu.be/pzsBYMMg0Dc',
    order_index: 1,
    start_date: '2026-10-13T20:30:00+07:00',
    target: 'Xây vault, Home page và cài các plugins để sử dụng được ngay',
    has_materials: true,
    slide_url: 'https://drive.google.com',
    study_note_url: 'https://app.notion.com',
    key_concepts: ['Vault Architecture', 'Home Page Dashboard', 'Core Community Plugins'],
    supporting_resources: [
      { label: 'Obsidian Hub Community Docs', url: 'https://hub.obsidian.md/' },
      { label: 'Obsidian Plugin Directory', url: 'https://obsidian.md/plugins' }
    ],
    assignment_description: 'Cài đặt Obsidian, khởi tạo Vault cá nhân, thiết lập trang Home page điều hướng và cài đặt ít nhất 3 community plugins cần thiết. Chụp ảnh màn hình Vault của bạn và chia sẻ vào Facebook Group lớp kèm hashtag #OB101_B1.',
    assignment_rubric_checklist: [
      { item: 'Đã cài đặt Obsidian và tạo Vault cá nhân thành công', checked: false, is_optional: false },
      { item: 'Đã tạo Home page có liên kết điều hướng trực quan', checked: false, is_optional: false },
      { item: 'Đã cài đặt và kích hoạt ít nhất 3 Community Plugins', checked: false, is_optional: false },
      { item: 'Đăng bài chia sẻ kèm ảnh chụp màn hình vào Facebook Group với hashtag #OB101_B1', checked: false, is_optional: false }
    ]
  },
  {
    id: 'lesson-obs-b2',
    course_id: 'course-obsidian-101',
    title: 'Buổi 2: Distill - Chắt lọc & Tinh hoa tri thức',
    type: 'video',
    content: `Học phương pháp ghi chú để chuyển hóa thông tin thô từ sách báo, bài viết thành tri thức có thể dùng được.
- Kỹ thuật Progressive Summarization (Tóm tắt lũy tiến).
- Tư duy Zettelkasten & Atomic Notes (Ghi chú nguyên tử).
- Tạo liên kết hai chiều (Bidirectional Links) để kết nối các ý tưởng liên ngành.`,
    video_url: 'https://youtu.be/4SJOdgP0A7g',
    order_index: 2,
    start_date: '2026-10-18T10:00:00+07:00',
    target: 'Cách ghi chú để biến thông tin thô thành tri thức có thể dùng được',
    has_materials: true,
    slide_url: 'https://drive.google.com',
    study_note_url: 'https://app.notion.com',
    key_concepts: ['Progressive Summarization', 'Zettelkasten & Atomic Notes', 'Bidirectional Linking'],
    supporting_resources: [
      { label: 'Hướng dẫn Zettelkasten - Tuấn Mon', url: 'https://tuanmon.com/zettelkasten-co-gi-ma-minh-lai-me-no-den-vay/' },
      { label: 'Building a Second Brain - Forte Labs', url: 'https://fortelabs.com/blog/basboverview/' }
    ],
    assignment_description: 'Chọn 1 cuốn sách hoặc bài viết bạn tâm đắc, viết 3-5 Atomic Notes theo ngôn từ của chính bạn, liên kết chúng với nhau bằng Bidirectional Links [[...]]. Chụp ảnh Graph view hoặc chia sẻ ghi chú lên Facebook Group với hashtag #OB101_B2.',
    assignment_rubric_checklist: [
      { item: 'Viết từ 3-5 Atomic Notes diễn đạt theo ngôn từ của chính mình', checked: false, is_optional: false },
      { item: 'Có liên kết 2 chiều giữa các ghi chú liên quan', checked: false, is_optional: false },
      { item: 'Áp dụng ít nhất 2 cấp độ của Progressive Summarization (In đậm/Highlight)', checked: false, is_optional: false },
      { item: 'Đăng bài nộp vào Facebook Group với hashtag #OB101_B2', checked: false, is_optional: false }
    ]
  },
  {
    id: 'lesson-obs-b3',
    course_id: 'course-obsidian-101',
    title: 'Buổi 3: Capture - Thu nạp thông tin đa lĩnh vực',
    type: 'video',
    content: `Thiết lập hệ thống nạp dữ liệu tự động và nhanh chóng từ nhiều nguồn khác nhau vào bãi tập kết Inbox của Vault.
- Sử dụng Web Clipper, Extension để capture bài viết một chạm.
- Đồng bộ hóa highlight từ Kindle, Readwise, Omnivore, Youtube transcript.
- Thiết lập quy trình phân loại Inbox nhanh chóng hàng ngày.`,
    video_url: 'https://youtu.be/DRLfqFJlosE',
    order_index: 3,
    start_date: '2026-10-20T20:30:00+07:00',
    target: 'Nhanh chóng nạp thông tin đa lĩnh vực lab tuỳ chọn',
    has_materials: true,
    slide_url: 'https://drive.google.com',
    study_note_url: 'https://app.notion.com',
    key_concepts: ['Web Clipper & Capture Workflow', 'Media Synchronizations', 'Inbox Zero for Knowledge'],
    supporting_resources: [
      { label: 'Obsidian Web Clipper Docs', url: 'https://obsidian.md/clipper' }
    ],
    assignment_description: 'Thiết lập quy trình Capture nhanh (Clipper/Readwise/Youtube) về Inbox và thực hiện xử lý 5 tài liệu đầu tiên chuyển từ Inbox vào hệ thống. Đăng bài chia sẻ trải nghiệm lên Facebook Group với hashtag #OB101_B3.',
    assignment_rubric_checklist: [
      { item: 'Đã cài đặt công cụ Capture nhanh vào Vault', checked: false, is_optional: false },
      { item: 'Thu nạp và xử lý thành công ít nhất 5 tài liệu vào Vault', checked: false, is_optional: false },
      { item: 'Đăng bài chia sẻ lên Facebook Group kèm hashtag #OB101_B3', checked: false, is_optional: false }
    ]
  },
  {
    id: 'lesson-obs-b4',
    course_id: 'course-obsidian-101',
    title: 'Buổi 4: Organize - Tổ chức Vault thành hệ thống sống',
    type: 'video',
    content: `Ứng dụng phương pháp PARA và Maps of Content (MOCs) cùng plugin Dataview để biến kho ghi chú thành một hệ thống sống.
- Cấu trúc PARA (Projects, Areas, Resources, Archives) linh hoạt.
- Xây dựng MOCs (Maps of Content) theo chủ đề lớn.
- Tự động hóa bảng biểu, truy vấn thông tin với Dataview queries.`,
    video_url: 'https://youtu.be/AT4ADQYVkyk',
    order_index: 4,
    start_date: '2026-10-25T10:00:00+07:00',
    target: 'Các cách tổ chức vault thành hệ thống sống',
    has_materials: true,
    slide_url: 'https://drive.google.com',
    study_note_url: 'https://app.notion.com',
    key_concepts: ['PARA Method in Obsidian', 'Maps of Content (MOCs)', 'Dataview Automation'],
    supporting_resources: [
      { label: 'Dataview Plugin Guide', url: 'https://blacksmithgu.github.io/obsidian-dataview/' },
      { label: 'PARA Method by Tiago Forte', url: 'https://fortelabs.com/blog/para/' }
    ],
    assignment_description: 'Tổ chức lại Vault theo cấu trúc PARA hoặc MOCs, viết ít nhất 1 câu truy vấn Dataview tự động thống kê Projects hoặc Resources đang làm việc. Post bài nộp kèm ảnh màn hình lên Facebook Group với hashtag #OB101_B4.',
    assignment_rubric_checklist: [
      { item: 'Vault được phân chia theo cấu trúc PARA hoặc MOCs rõ ràng', checked: false, is_optional: false },
      { item: 'Có ít nhất 1 trang MOCs hoặc Dashboard dùng bảng truy vấn Dataview', checked: false, is_optional: false },
      { item: 'Đăng bài lên Facebook Group kèm hashtag #OB101_B4', checked: false, is_optional: false }
    ]
  },
  {
    id: 'lesson-obs-b5',
    course_id: 'course-obsidian-101',
    title: 'Buổi 5: Express - Phối hợp và làm việc cùng AI',
    type: 'video',
    content: `Kết hợp sức mạnh của AI Agents và Local LLMs trực tiếp vào Obsidian để đối thoại với kho tri thức và tạo ra sản phẩm.
- Tích hợp Smart Connections / Text Generator / Copilot vào Vault.
- Phương pháp LLM Wiki & AI Second Brain của Andrej Karpathy.
- Xuất bản sản phẩm đầu ra (Bài viết chuyên sâu, báo cáo, kế hoạch hành động).`,
    video_url: 'https://youtu.be/czONq1sFXqU',
    order_index: 5,
    start_date: '2026-10-27T20:30:00+07:00',
    target: 'Cách phối hợp và làm việc với AI',
    has_materials: true,
    slide_url: 'https://drive.google.com',
    study_note_url: 'https://app.notion.com',
    key_concepts: ['Smart Connections & AI Plugins', 'Karpathy LLM Wiki Architecture', 'Express & Content Generation'],
    supporting_resources: [
      { label: 'Smart Connections Plugin', url: 'https://github.com/brianpetro/obsidian-smart-connections' },
      { label: 'Andrej Karpathy LLM Wiki', url: 'https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f' }
    ],
    assignment_description: 'Tích hợp AI vào Obsidian, thực hiện đối thoại với các ghi chú trong Vault và tạo ra 1 bài viết hoặc kế hoạch hành động hoàn chỉnh từ kho tri thức cá nhân. Đăng sản phẩm lên Facebook Group với hashtag #OB101_B5.',
    assignment_rubric_checklist: [
      { item: 'Tích hợp thành công AI plugin vào Obsidian', checked: false, is_optional: false },
      { item: 'Sử dụng AI kết nối dữ liệu từ các ghi chú để tạo ra sản phẩm đầu ra', checked: false, is_optional: false },
      { item: 'Đăng bài chia sẻ sản phẩm lên Facebook Group với hashtag #OB101_B5', checked: false, is_optional: false }
    ]
  },
  {
    id: 'lesson-obs-pitching',
    course_id: 'course-obsidian-101',
    title: 'Pitching Day: Tổng kết & Trưng bày Second Brain',
    type: 'video',
    content: `Buổi tổng kết hành trình học tập, từng học viên showcase hệ thống Second Brain cá nhân và nhận chứng nhận hoàn thành khóa học.
- Trưng bày cấu trúc Vault, Dashboard, MOCs và luồng AI workflow.
- Nhận phản hồi chuyên sâu từ Trainer và các bạn học.
- Trao chứng nhận và định hướng phát triển hệ thống tri thức dài hạn.`,
    video_url: 'https://youtu.be/pzsBYMMg0Dc',
    order_index: 6,
    start_date: '2026-11-01T10:00:00+07:00',
    target: 'Tổng kết hành trình và chia sẻ sản phẩm cuối khoá',
    has_materials: true,
    slide_url: 'https://drive.google.com',
    study_note_url: 'https://app.notion.com',
    key_concepts: ['Second Brain Showcase', 'Knowledge System Review', 'Graduation & Certification'],
    supporting_resources: [
      { label: 'The1ight Graduation Hall of Fame', url: 'https://the1ight.com' }
    ],
    assignment_description: 'Chuẩn bị bài thuyết trình 3-5 phút hoặc video demo walkthrough hệ thống Second Brain của bạn để trình bày trong buổi Pitching Day. Nộp link video/slide vào Facebook Group với hashtag #OB101_PitchingDay.',
    assignment_rubric_checklist: [
      { item: 'Chuẩn bị video hoặc slide showcase hệ thống Second Brain', checked: false, is_optional: false },
      { item: 'Tham gia trình bày hoặc nộp bài tổng kết cuối khóa', checked: false, is_optional: false },
      { item: 'Đăng bài tổng kết lên Facebook Group kèm hashtag #OB101_PitchingDay', checked: false, is_optional: false }
    ]
  }
];

// ── Obsidian 101 Calendar Events ──────────────────────────────────────────
export const DEFAULT_OBSIDIAN_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-obs-kickoff',
    title: 'Kick-off lớp Obsidian',
    time: '20:30',
    endTime: '22:30',
    allDay: false,
    date: 6,
    month: 9, // October (0-indexed)
    year: 2026,
    dayOfWeek: 2, // Tuesday
    colorClass: 'border-l-4 border-[#DC2626] bg-red-50 text-red-950',
    dotColorClass: 'bg-[#DC2626]',
    type: 'class',
    eventType: 'kick-off',
    details: 'Giới thiệu lộ trình, làm quen và chuẩn bị tinh thần học tập'
  },
  {
    id: 'evt-obs-onboarding-7',
    title: 'Onboarding Week',
    time: 'Cả ngày',
    allDay: true,
    date: 7,
    month: 9, // October (0-indexed)
    year: 2026,
    dayOfWeek: 3, // Wednesday
    colorClass: 'border-l-4 border-[#7C3AED] bg-purple-50 text-purple-950',
    dotColorClass: 'bg-[#7C3AED]',
    type: 'class',
    eventType: 'onboarding',
    details: 'Onboarding Week - Ngày 1: Khởi động, làm quen với khoá học'
  },
  {
    id: 'evt-obs-onboarding-8',
    title: 'Onboarding Week',
    time: 'Cả ngày',
    allDay: true,
    date: 8,
    month: 9, // October
    year: 2026,
    dayOfWeek: 4, // Thursday
    colorClass: 'border-l-4 border-[#7C3AED] bg-purple-50 text-purple-950',
    dotColorClass: 'bg-[#7C3AED]',
    type: 'class',
    eventType: 'onboarding',
    details: 'Onboarding Week - Ngày 2: Vì sao lại xây 2nd Brain?'
  },
  {
    id: 'evt-obs-onboarding-9',
    title: 'Onboarding Week',
    time: 'Cả ngày',
    allDay: true,
    date: 9,
    month: 9, // October
    year: 2026,
    dayOfWeek: 5, // Friday
    colorClass: 'border-l-4 border-[#7C3AED] bg-purple-50 text-purple-950',
    dotColorClass: 'bg-[#7C3AED]',
    type: 'class',
    eventType: 'onboarding',
    details: 'Onboarding Week - Ngày 3'
  },
  {
    id: 'evt-obs-onboarding-10',
    title: 'Onboarding Week',
    time: 'Cả ngày',
    allDay: true,
    date: 10,
    month: 9, // October
    year: 2026,
    dayOfWeek: 6, // Saturday
    colorClass: 'border-l-4 border-[#7C3AED] bg-purple-50 text-purple-950',
    dotColorClass: 'bg-[#7C3AED]',
    type: 'class',
    eventType: 'onboarding',
    details: 'Onboarding Week - Ngày 4'
  },
  {
    id: 'evt-obs-onboarding-11',
    title: 'Onboarding Week',
    time: 'Cả ngày',
    allDay: true,
    date: 11,
    month: 9, // October
    year: 2026,
    dayOfWeek: 7, // Sunday
    colorClass: 'border-l-4 border-[#7C3AED] bg-purple-50 text-purple-950',
    dotColorClass: 'bg-[#7C3AED]',
    type: 'class',
    eventType: 'onboarding',
    details: 'Onboarding Week - Ngày 5'
  },
  {
    id: 'evt-obs-b1',
    title: 'Buổi 1: Foundation Setup',
    time: '20:30',
    endTime: '22:30',
    allDay: false,
    date: 13,
    month: 9,
    year: 2026,
    dayOfWeek: 2, // Tuesday
    colorClass: 'border-l-4 border-[#EA580C] bg-orange-50 text-orange-950',
    dotColorClass: 'bg-[#EA580C]',
    type: 'class',
    eventType: 'live-class',
    details: 'Xây vault, Home page và cài các plugins để sử dụng được ngay'
  },
  {
    id: 'evt-obs-oh-2',
    title: 'Office Hour (Tuần 2)',
    time: '09:00',
    endTime: '10:00',
    allDay: false,
    date: 18,
    month: 9,
    year: 2026,
    dayOfWeek: 7, // Sunday
    colorClass: 'border-l-4 border-[#2563EB] bg-blue-50 text-blue-950',
    dotColorClass: 'bg-[#2563EB]',
    type: 'community',
    eventType: 'office-hour',
    details: 'Hỏi đáp 1-1 cùng thầy giáo (đăng ký trước tại group Zalo lớp)'
  },
  {
    id: 'evt-obs-b2',
    title: 'Buổi 2: Distill',
    time: '10:00',
    endTime: '12:00',
    allDay: false,
    date: 18,
    month: 9,
    year: 2026,
    dayOfWeek: 7, // Sunday
    colorClass: 'border-l-4 border-[#EA580C] bg-orange-50 text-orange-950',
    dotColorClass: 'bg-[#EA580C]',
    type: 'class',
    eventType: 'live-class',
    details: 'Cách ghi chú để biến thông tin thô thành tri thức có thể dùng được'
  },
  {
    id: 'evt-obs-b3',
    title: 'Buổi 3: Capture',
    time: '20:30',
    endTime: '22:30',
    allDay: false,
    date: 20,
    month: 9,
    year: 2026,
    dayOfWeek: 2, // Tuesday
    colorClass: 'border-l-4 border-[#EA580C] bg-orange-50 text-orange-950',
    dotColorClass: 'bg-[#EA580C]',
    type: 'class',
    eventType: 'live-class',
    details: 'Nhanh chóng nạp thông tin đa lĩnh vực lab tuỳ chọn'
  },
  {
    id: 'evt-obs-oh-3',
    title: 'Office Hour (Tuần 3)',
    time: '09:00',
    endTime: '10:00',
    allDay: false,
    date: 25,
    month: 9,
    year: 2026,
    dayOfWeek: 7, // Sunday
    colorClass: 'border-l-4 border-[#2563EB] bg-blue-50 text-blue-950',
    dotColorClass: 'bg-[#2563EB]',
    type: 'community',
    eventType: 'office-hour',
    details: 'Hỏi đáp 1-1 cùng thầy giáo (đăng ký trước tại group Zalo lớp)'
  },
  {
    id: 'evt-obs-b4',
    title: 'Buổi 4: Organize',
    time: '10:00',
    endTime: '12:00',
    allDay: false,
    date: 25,
    month: 9,
    year: 2026,
    dayOfWeek: 7, // Sunday
    colorClass: 'border-l-4 border-[#EA580C] bg-orange-50 text-orange-950',
    dotColorClass: 'bg-[#EA580C]',
    type: 'class',
    eventType: 'live-class',
    details: 'Các cách tổ chức vault thành hệ thống sống'
  },
  {
    id: 'evt-obs-b5',
    title: 'Buổi 5: Express',
    time: '20:30',
    endTime: '22:30',
    allDay: false,
    date: 27,
    month: 9,
    year: 2026,
    dayOfWeek: 2, // Tuesday
    colorClass: 'border-l-4 border-[#EA580C] bg-orange-50 text-orange-950',
    dotColorClass: 'bg-[#EA580C]',
    type: 'class',
    eventType: 'live-class',
    details: 'Cách phối hợp và làm việc với AI'
  },
  {
    id: 'evt-obs-oh-4',
    title: 'Office Hour (Tuần 4)',
    time: '09:00',
    endTime: '10:00',
    allDay: false,
    date: 1,
    month: 10, // November
    year: 2026,
    dayOfWeek: 7, // Sunday
    colorClass: 'border-l-4 border-[#2563EB] bg-blue-50 text-blue-950',
    dotColorClass: 'bg-[#2563EB]',
    type: 'community',
    eventType: 'office-hour',
    details: 'Hỏi đáp 1-1 cùng thầy giáo (đăng ký trước tại group Zalo lớp)'
  },
  {
    id: 'evt-obs-pitching',
    title: 'Pitching Day: Báo cáo Second Brain',
    time: '10:00',
    endTime: '12:00',
    allDay: false,
    date: 1,
    month: 10, // November
    year: 2026,
    dayOfWeek: 7, // Sunday
    colorClass: 'border-l-4 border-[#B45309] bg-amber-50 text-amber-950',
    dotColorClass: 'bg-[#B45309]',
    type: 'class',
    eventType: 'capstone',
    details: 'Tổng kết hành trình và chia sẻ sản phẩm cuối khoá'
  }
];

// ── Obsidian 101 Onboarding Days ──────────────────────────────────────────
export const DEFAULT_OBSIDIAN_ONBOARDING_DAYS: OnboardingDay[] = [
  {
    day: 1,
    title: "Ngày 1: Khởi động, làm quen với khoá học",
    intro: "Tuần Onboarding rất quan trọng cho trải nghiệm học: dù chưa vào học ngay, nhưng sẽ **kích hoạt bạn như một người học chủ động**.",
    objective: "Làm quen bạn học, kết nối lớp qua cộng đồng/group, đặt \"lý do tại sao\" học, cam kết hành động (không chỉ đọc lý thuyết).",
    checklist: "- [ ] Xem video [Greeting từ giảng viên](https://youtu.be/pzsBYMMg0Dc?si=_r0FxOKXUEGUweIQ).\n- [ ] Điền form [Khảo sát Onboarding](https://forms.gle/GydkVm2kd1DdJJJa6) để giảng viên nắm thông tin và cập nhật giáo trình phù hợp.\n- [ ] Viết 1 post giới thiệu bản thân trong [Facebook Group](https://www.facebook.com/groups/2251571492466555), gắn `#OB_Ngay1` ở đầu bài.\n  💡 *\"Giới thiệu bản thân và chia sẻ thói quen ghi chú của bạn\"* Gợi ý:\n  - Tên + công việc/ngành\n  - Lý do học của bạn\n  - Trở ngại lớn nhất + cách khắc phục\n  - Điều bạn hy vọng đạt sau 1 tháng\n  - Thuận lợi/lợi thế riêng bạn có\n  - Cam kết thời gian dành ra để học và làm bài tập\n  - **Đặt cược nếu không build được 2nd Brain** (khao trà sữa / presentation / múa bụng...).\n  \"Ví dụ: Mình là An, năm nay 20 tuổi, mình có thói quen hay ghi chép ra sổ, hoặc note vào gg docs. Mình đã có kinh nghiệm dùng Notion rồi. Mình cam kết làm bài tập về nhà vào 20h00 - 21h00 Thứ 4 hàng tuần. Nếu không build được, mình sẽ múa bụng.\"",
    takeaway: "> **Lời nhắn nhủ:** \"When you feel stuck in your creative pursuits, it doesn’t mean that there’s something wrong with you. You haven’t lost your touch or run out of creative juice. It just means you don’t yet have enough raw material to work with.\"\n\n> Nếu bạn cảm thấy bế tắc trong quá trình sáng tạo, bạn không phải gặp vấn đề gì đâu. Bạn không hẳn là tự dưng trở nên vô dụng hoặc mất hết khả năng sáng tạo. Bạn chỉ chưa có đủ những nguyên liệu thô cần thiết để tiếp tục công việc.\n> — Tiago Forte - Tác giả lý thuyết về Bộ Não thứ Hai",
    companionHint: "**Lời nhắn nhủ:** \"When you feel stuck in your creative pursuits, it doesn’t mean that there’s something wrong with you. You haven’t lost your touch or run out of creative juice. It just means you don’t yet have enough raw material to work with.\"\n\nNếu bạn cảm thấy bế tắc trong quá trình sáng tạo, bạn không phải gặp vấn đề gì đâu. Bạn không hẳn là tự dưng trở nên vô dụng hoặc mất hết khả năng sáng tạo. Bạn chỉ chưa có đủ những nguyên liệu thô cần thiết để tiếp tục công việc.\n— Tiago Forte - Tác giả lý thuyết về Bộ Não thứ Hai",
    bonusResources: ""
  },
  {
    day: 2,
    title: "Ngày 2: Vì sao lại xây 2nd Brain?",
    intro: "> \"We spend countless hours reading, listening to, and watching other people’s opinions about what we should do, how we should think, and how we should live, but make comparatively little effort applying that knowledge and making it our own\"\n> — Tiago Forte - Building a second brain\n\n> Chúng ta dành hàng tiếng đồng hồ đọc, nghe và hấp thụ những quan điểm của người khác về việc ta nên làm gì, nghĩ gì, sống thế nào, nhưng lại muốn dành rất ít nỗ lực để thực sự áp dụng được những điều này và biến chúng thành của mình.",
    objective: "Hiểu về 2nd Brain để làm gì & Ghi chú thông minh trong kỷ nguyên số?",
    checklist: "- [ ] **Task 1:** Xem video [hướng dẫn ngắn từ giảng viên](https://youtu.be/4SJOdgP0A7g?si=VB_0ZJ9m-ui_SLpJ).\n- [ ] **Task 2:** Đọc bài viết ngắn của Tiago Forte về 2nd brain: [The 7 Benefits of Building a Second Brain](https://fortelabs.com/blog/the-7-benefits-of-building-a-second-brain/)\n- [ ] **Task 3:** Đọc các bài viết sau của Tuấn Mon và Đông Labs:\n  - [Mình ghi chú lại mọi thứ vì đó là điều sáng suốt nhất mình từng làm — Tuấn Mon](https://tuanmon.com/loi-ich-cua-viec-ghi-chu/)\n  - [Obsidian hơn cả một ứng dụng ghi chép — Đông Labs](https://donglabs.vn/obsidian-hon-ca-mot-ung-dung-ghi-chep/)\n  - [Zettelkasten có gì mà mình lại mê nó đến vậy? — Tuấn Mon](https://tuanmon.com/zettelkasten-co-gi-ma-minh-lai-me-no-den-vay/)\n- [ ] **Task 4 (optional - Khuyến khích):** Tìm và download cuốn *Building a Second Brain* (đọc chương 2). Nếu được, đọc thêm cuốn *How to Take Smart Notes* của Sönke Ahrens.\n- [ ] **Task 5:** Viết cảm nghĩ cho các câu hỏi sau & post [Facebook Group](https://www.facebook.com/groups/2251571492466555) `#OB_Ngay2`:\n  - Bạn hiểu 2nd Brain là gì?\n  - Bạn thấy ghi chú có tác dụng gì trong đời sống?\n  - Ghi chú bản điện tử có ưu điểm quan trọng nào so với ghi chép tay trong thời đại số?",
    takeaway: "> **Lời nhắn nhủ:** Một số những ghi chú sẽ có ích cho bạn ngay lúc này, nhưng đừng quên một số sẽ chỉ có ích cho bạn SAU NÀY.\n\n> Để biến những thông tin có ích trong hiện tại trở nên giá trị, chúng ta cần học cách đóng gói chúng lại và gửi đến chúng ta ở thời tương lai. Tất cả đều bắt đầu từ việc viết mọi thứ ra.\n> — Tiago Forte - Tác giả lý thuyết về Bộ Não thứ Hai",
    companionHint: "**Lời nhắn nhủ:** Một số những ghi chú sẽ có ích cho bạn ngay lúc này, nhưng đừng quên một số sẽ chỉ có ích cho bạn SAU NÀY.\n\nĐể biến những thông tin có ích trong hiện tại trở nên giá trị, chúng ta cần học cách đóng gói chúng lại và gửi đến chúng ta ở thời tương lai. Tất cả đều bắt đầu từ việc viết mọi thứ ra.\n— Tiago Forte - Tác giả lý thuyết về Bộ Não thứ Hai",
    bonusResources: "- [Building a Second Brain - Tiago Forte](https://www.buildingasecondbrain.com/)\n- [How to Take Smart Notes - Sönke Ahrens](https://takesmartnotes.com/)"
  },
  {
    day: 3,
    title: "Ngày 3: CODE - Quy trình chắt lọc và hấp thụ ý tưởng",
    intro: "> \"How do I live less in the past, and more in the present? How do I build an investment strategy that is aligned with my mid-term and long-term goals and commitments? What does it look like to move from mindless consumption to mindful creation?\"\n\n> Làm sao để ta có thể bớt nghĩ về quá khứ mà sống nhiều hơn cho hiện tại? Làm sao để ta có chiến lược đầu tư đúng đường lối với các mục tiêu và trách nhiệm trong dài hạn và trung hạn? Cảm giác sẽ thế nào nếu ta thay đổi từ việc tiêu thụ nội dung thụ động sang chủ động sáng tạo nội dung?\n> — Tiago Forte",
    objective: "Hiểu về quy trình CODE (Capture, Organize, Distill, Express) và cách ý tưởng được hình thành và sản xuất.",
    checklist: "- [ ] **Task 1:** Xem [video giới thiệu từ giảng viên](https://youtu.be/DRLfqFJlosE?si=OlTUrT0DMN_4kiI5).\n- [ ] **Task 2:** Xem video về [Nhà Kho Lưu Trữ Ý tưởng và bãi tập kết](https://www.youtube.com/watch?v=AT4ADQYVkyk).\n- [ ] **Task 3:** Đọc summary để hiểu hơn về quy trình CODE:\n  - [Tóm tắt về 2nd Brain — cô Phi Vân](https://www.nguyenphivan.com/post/t%C3%B4i-v%E1%BB%ABa-x%C3%A2y-second-brain-b%E1%BB%99-n%C3%A3o-th%E1%BB%A9-hai-c%E1%BB%A7a-m%C3%ACnh-b%E1%BA%B1ng-ai-v%C3%A0-%C4%91%C3%A2y-l%C3%A0-l%C3%BD-do)\n  - [Tóm tắt từ Forte Labs (BASB Overview)](https://fortelabs.com/blog/basboverview/)\n  - [Tóm tắt qua YouTube](https://youtu.be/K-ssUVyfn5g?si=-b9LtnmMcePiWQXo)\n- [ ] **Task 4:** Viết 3 dòng cảm nhận & post [Facebook Group](https://www.facebook.com/groups/2251571492466555) `#OB_Ngay3`:\n  - Nhà Kho Lưu Trữ Ý tưởng & Bãi tập kết map như thế nào với quy trình của Forte?\n  - Bạn có thực sự đồng ý với quy trình thu nạp thông tin của Forte không? Việc Express (tạo một sản phẩm) có thực sự cần thiết trong việc thu nạp thông tin?",
    takeaway: "> **💬 Quote hay:** \"Writing creates new knowledge that wasn’t there before\" — Viết giúp tạo ra kiến thức mới chưa từng xuất hiện trước đó.\n> — Tiago Forte - Tác giả lý thuyết về Bộ Não thứ Hai",
    companionHint: "**💬 Quote hay:** \"Writing creates new knowledge that wasn’t there before\" — Viết giúp tạo ra kiến thức mới chưa từng xuất hiện trước đó.\n— Tiago Forte - Tác giả lý thuyết về Bộ Não thứ Hai",
    bonusResources: "- [BASB Methodology Guide](https://fortelabs.com/blog/basboverview/)"
  },
  {
    day: 4,
    title: "Ngày 4: Xây bộ não thứ hai cùng AI của Karpathy",
    intro: "> \"I believe that we have reached an inflection point, where technology has become sufficiently advanced and user-friendly that we can integrate it with our biological brains\"\n\n> Tôi tin rằng chúng ta đã đến một giao điểm quan trọng, khi mà công nghệ đã đủ thân thiện và cao cấp để tích hợp nó với bộ não sinh học của chúng ta.\n> — Tiago Forte - Tác giả lý thuyết về Bộ Não thứ Hai",
    objective: "Khám phá cách kết hợp AI (LLM) để xây dựng và tương tác với Second Brain theo phương pháp của Andrej Karpathy.",
    checklist: "- [ ] **Task 1:** Đọc blog về việc dùng AI để xây não thứ hai: [Xây não thứ hai bằng LLM](https://thieunv.substack.com/p/xay-bo-nao-thu-hai-bang-llm).\n- [ ] **Task 2:** Sử dụng NotebookLM hoặc ChatGPT để phân tích bài gốc: [LLM Wiki — Andrej Karpathy](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f).\n- [ ] **Task 3:** Xem video demo về xây Bộ não thứ hai với LLM: [Demo Youtube](https://youtu.be/czONq1sFXqU?si=5Mem1cR6t4_bQCB8).\n- [ ] **Task 4:** Viết 3 dòng cảm nhận & post [Facebook Group](https://www.facebook.com/groups/2251571492466555) `#OB_Ngay4`:\n  - Bạn nghĩ gì về việc dùng AI để xây bộ não thứ hai?\n  - Vì sao bài viết của Karpathy lại khiến mọi người đổ xô vào xây bộ não thứ hai đến vậy?",
    takeaway: "> **Lời nhắn:** \"I believe that we have reached an inflection point, where technology has become sufficiently advanced and user-friendly that we can integrate it with our biological brains\"\n\n> Tôi tin rằng chúng ta đã đến một giao điểm quan trọng, khi mà công nghệ đã đủ thân thiện và cao cấp để tích hợp nó với bộ não sinh học của chúng ta.\n> — Tiago Forte - Tác giả lý thuyết về Bộ Não thứ Hai",
    companionHint: "**Lời nhắn:** \"I believe that we have reached an inflection point, where technology has become sufficiently advanced and user-friendly that we can integrate it with our biological brains\"\n\nTôi tin rằng chúng ta đã đến một giao điểm quan trọng, khi mà công nghệ đã đủ thân thiện và cao cấp để tích hợp nó với bộ não sinh học của chúng ta.\n— Tiago Forte - Tác giả lý thuyết về Bộ Não thứ Hai",
    bonusResources: "- [Andrej Karpathy GitHub Gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)"
  },
  {
    day: 5,
    title: "Ngày 5: AI hay con người mới nên làm chủ bộ não thứ hai?",
    intro: "> \"Cái 'biết' chỉ thật sự 'biết' khi nó đi qua não bạn, được bạn vật lộn, được bạn challenge, được bạn áp dụng vào case thật. Một cái markdown file LLM viết hộ, bạn chưa từng đọc kỹ, không phải 'biết'. Nó chỉ là **lưu trữ ảo giác kiến thức**.\"\n> — Duy Nguyễn - Blogger #Goon's Solo Playbook",
    objective: "Thảo luận sâu về vai trò của con người trong kỷ nguyên AI: AI hay con người mới là chủ nhân đích thực của tri thức?",
    checklist: "- [ ] **Task 1:** Đọc về quan điểm xây bộ não thứ hai: [Hướng dẫn xây dựng Second Brain hiệu quả — Duy Nguyễn](https://goonnguyen.substack.com/p/huong-dan-xay-dung-second-brain-hieu).\n- [ ] **Task 2:** Đọc bài viết thứ hai: [Đừng để AI biến bộ não thứ hai thành... — Hùng H3](https://yoloh3.substack.com/p/ung-e-ai-bien-bo-nao-thu-hai-thanh).\n- [ ] **Task 3:** Đọc bài viết thứ ba: [Cuộc đua xem ai không đi lùi — Curiosity Pocket](https://curiositypocket.substack.com/p/cuoc-ua-xem-ai-khong-i-lui?utm_source=substack&utm_campaign=post_embed&utm_medium=web&embedding_publication_id=2117485).\n- [ ] **Task 4:** Viết 3 dòng cảm nhận & post [Facebook Group](https://www.facebook.com/groups/2251571492466555) `#OB_Ngay5`:\n  - Bạn nghĩ bộ não thứ hai nên để AI xây hay con người phải tự xây? Vì sao?",
    takeaway: "> **Lời nhắn**: \"The attempt to rephrase an argument in our own words confronts us without mercy with all the gaps in our understanding\"\n\n> Mỗi khi bạn nỗ lực diễn đạt một lập luận theo ngôn ngữ của chính mình, những gì bạn chưa hiểu sẽ hiện ra và đối đầu với bạn một cách không khoan nhượng.\n> — Sönke Ahrens - How to Take Smart Notes",
    companionHint: "**Lời nhắn**: \"The attempt to rephrase an argument in our own words confronts us without mercy with all the gaps in our understanding\"\n\nMỗi khi bạn nỗ lực diễn đạt một lập luận theo ngôn ngữ của chính mình, những gì bạn chưa hiểu sẽ hiện ra và đối đầu với bạn một cách không khoan nhượng.\n— Sönke Ahrens - How to Take Smart Notes",
    bonusResources: "- [How to Take Smart Notes Summary](https://takesmartnotes.com/)"
  }
];

