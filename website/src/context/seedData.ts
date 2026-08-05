import type {
  Badge,
  Course,
  Batch,
  Lesson,
  Profile,
  NauticalMilesTransaction,
  ProfileBadge,
  NotificationLog,
  Announcement,
  OnboardingDay,
  CalendarEvent,
  AboutContent
} from './DatabaseContext';

export const SEED_BADGES: Badge[] = [
  {
    id: 'bada0000-0000-0000-0000-000000000001',
    name: 'Thẻ Căn Cước Thủy Thủ',
    icon: '🪪',
    description: 'Khai báo thông tin cá nhân đầy đủ 100% trong Hồ sơ cá nhân.',
    condition: 'Hoàn thành hồ sơ cá nhân với đầy đủ các trường thông tin.'
  },
  {
    id: 'bada0000-0000-0000-0000-000000000002',
    name: 'Cánh Buồm No Gió',
    icon: '⛵',
    description: 'Khởi đầu thuận lợi. Tự động nhận được khi hoàn thành 3 ngày học onboarding đầu tiên.',
    condition: 'Hoàn thành 3 ngày học onboarding đầu tiên.'
  },
  {
    id: 'bada0000-0000-0000-0000-000000000003',
    name: 'Thủy Thủ Lão Luyện',
    icon: '⚓',
    description: 'Đã tôi luyện qua thử thách. Nhận được khi hoàn thành trọn vẹn cả 7 ngày onboarding.',
    condition: 'Hoàn thành tất cả 7 ngày học onboarding.'
  },
  {
    id: 'bada0000-0000-0000-0000-000000000004',
    name: 'Chinh Phục Đại Dương',
    icon: '🌊',
    description: 'Kỳ tài giao tiếp. Giải đáp thắc mắc hoặc hỗ trợ các bạn khác, tích lũy được nhiều lượt bình luận chất lượng.',
    condition: 'Có tổng cộng 50 lượt thích (Upvotes) từ bình luận hoặc bài đăng.'
  },
  {
    id: 'bada0000-0000-0000-0000-000000000005',
    name: 'Thuyền Trưởng Gương Mẫu',
    icon: '🧑‍✈️',
    description: 'Tinh thần kỷ luật thép. Hoàn thành tất cả các bài tập về nhà trong khóa học.',
    condition: 'Nộp tất cả bài tập về nhà của các buổi học.'
  },
  {
    id: 'bada0000-0000-0000-0000-000000000006',
    name: 'Bản Đồ Kho Báu',
    icon: '🗺️',
    description: 'Vượt qua mọi thử thách. Nhận được khi xem toàn bộ video các buổi học.',
    condition: 'Đã hoàn thành xem tất cả các video bài giảng.'
  }
];

export const SEED_COURSES: Course[] = [
  {
    id: '3f26048a-6689-400e-99fc-e0499161d934',
    title: 'Vibe Coding 201: Build scalable product with AI',
    description: 'Vibe Coding 201 là khóa học 9 buổi nâng cao giúp bạn học cách xây dựng sản phẩm có khả năng scale, thiết lập PRD kỹ thuật, làm chủ IDE/CLI, thiết kế MCP và xây dựng hệ thống automation kết hợp n8n.',
    cover_image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop'
  }
];

export const SEED_BATCHES: Batch[] = [
  {
    id: 'e574fea2-9260-4961-8b1d-79ef7e16f784',
    course_id: '3f26048a-6689-400e-99fc-e0499161d934',
    name: 'Batch 3',
    start_date: '2026-07-01',
    end_date: '2026-08-31',
    mentor_id: 'c6b8a8b1-321a-4d2a-89a1-5d9f0f9b6b8a'
  }
];

export const SEED_LESSONS: Lesson[] = [
  // Phần 0
  {
    id: 'c786a9e5-1cc5-416c-9cbc-3839869404e3',
    course_id: '3f26048a-6689-400e-99fc-e0499161d934',
    title: 'Buổi 0: Kick-off Meeting',
    type: 'video',
    content: 'Tìm hiểu về khóa học Vibe Coding 201, giảng viên và văn hóa học tập chủ động. Định vị lộ trình Onboarding.',
    video_url: 'https://drive.google.com/file/d/kickoff-meeting-vibe-201',
    order_index: 1,
    start_date: '2026-07-18',
    target: 'Kích hoạt tư duy học chủ động, hướng dẫn luật chơi hải lý và giới thiệu công cụ',
    has_materials: true
  },
  
  // Phần 1
  {
    id: '1c69ea64-b83b-4519-a545-5030a8360163',
    course_id: '3f26048a-6689-400e-99fc-e0499161d934',
    title: 'Buổi 1: Mindset: MVP -> Product có thể scale',
    type: 'video',
    content: 'Thay đổi căn tính (Identity Shift): Ngừng tự nhủ "Tôi không biết code", thay vào đó hãy trở thành Product Builder sở hữu các quyết định chiến lược.\nQuản trị Triple Debt: Nhận diện và ngăn chặn ba loại nợ (Nhận thức, Ý định, Vận hành) phát sinh khi tốc độ xây dựng của AI vượt quá tốc độ suy nghĩ của con người.\nSở hữu Outcome (Kết quả): Chuyển trọng tâm từ việc đếm số lượng tính năng (Feature ship) sang đo lường sự thay đổi hành vi của người dùng (User behavior).\nCấu trúc Product Seed: Một sản phẩm vững chắc cần 5 thành phần kiểm chứng được: Target User, Core Pain, Desired Outcome, Success Signal, và MVP.',
    video_url: 'https://daymai.vn/vc/6a51d590b27fed03b70cba72',
    order_index: 2,
    start_date: '2026-07-29',
    target: 'Giúp học viên hiểu gap giữa prototype/MVP và product hoặc workspace system đáng tin hơn.',
    has_materials: true,
    slide_url: 'https://canva.link/lbrdh9zqf1beajt',
    study_note_url: 'https://docs.google.com/document/d/1FuGpB8Ogwo5FA04M9sDyWd_zu4Clq4dys9WqohjbhZ8/edit?usp=sharing',
    key_concepts: ['Product Seed', 'Product Hypothesis'],
    assignment_description: `Nộp Product Seed version 1.0\n\nBước 01: Viết nội dung của Product Seed.\n- Target User: Nghề, tuổi, địa lý, thu nhập, tình huống. (VD: NV VP 25-35, HCMC, 15-30M/tháng, dùng Excel track chi tiêu)\n- Core Pain: Quan sát ở 3+ user thật. (VD: Cuối tháng không nhớ tiền hao ở đâu)\n- Desired Outcome: Thay đổi hành vi quan sát được. (VD: Phát hiện 2-3 khoản hao tiền đủ sớm để điều chỉnh)\n- Success Signal: Đo hành vi, không đo cảm nhận. (VD: Quay lại kiểm tra spending lần 2 không cần nhắc)\n- MVP / Test: 1 AI feature nhỏ nhất để bắt đầu. (VD: 1 form + Claude API: paste 20 giao dịch, trả top 3 khoản chi)\n\nBước 02: Check lại với AI qua 05 cổng kiểm định\n\nBước 03: Đăng nội dung Product Seed của bạn lên Group Facebook của lớp, gắn hastag #BTVN_Ngay1`,
    assignment_rubric_checklist: [
      { item: 'User đủ cụ thể: Tuyển được 5 user trong 1 tuần.', checked: false },
      { item: 'Pain quan sát được: Nhìn thấy trong hành vi, không chỉ suy đoán.', checked: false },
      { item: 'Outcome đối hành vi: User làm khác trước, không phải cảm nhận.', checked: false },
      { item: 'Signal check nhanh: Đo được ngay lập tức, không chờ retention/NPS.', checked: false },
      { item: 'Validation thật: Action đầu tiên có user THẬT dùng và feedback.', checked: false }
    ],
    supporting_resources: [
      {
        label: 'Gems Product Seed Generator',
        url: 'https://gemini.google.com/gem/1093w9uY5z5Cj5o28dxDBBXOBOIfRlx-b?usp=sharing'
      },
      {
        label: 'Product Seed Prompting Template',
        url: 'https://drive.google.com/file/d/1Q5odipK3Mn7Z8DV2IurErM3I8cCp796A/view?usp=drive_link'
      },
      {
        label: 'Padlet luyện tập trên lớp',
        url: 'https://padlet.com/dangtuyethong2324/vibe-coding-201-batch-02-z7yk4l9ojhninj1z'
      }
    ]
  },
  {
    id: 'a1ba6fd1-5e99-4b0a-9ac1-3d667d63d96e',
    course_id: '3f26048a-6689-400e-99fc-e0499161d934',
    title: 'Buổi 2: PRD kỹ thuật & 4 flow',
    type: 'video',
    content: 'Cách thiết lập PRD kỹ thuật chuẩn chỉnh cho sản phẩm AI. Làm quen và làm chủ 4 loại Flow cơ bản trong thiết kế phần mềm (User Flow, Data Flow, Logic Flow, System Flow) để giao tiếp hiệu quả với AI IDE.',
    video_url: 'https://daymai.vn/vc/6a51d5be177b1e1f3c0a961a',
    order_index: 3,
    start_date: '2026-08-01',
    target: 'Làm chủ tư duy phân tách hệ thống, xây dựng tài liệu kỹ thuật PRD và sơ đồ flow rõ ràng để AI có thể thực thi chính xác.',
    has_materials: true,
    study_note_url: 'https://notebook.google.com/notebook/f2632a96-7fb3-4e23-b67d-1040f4451a3e',
    assignment_description: `Nộp PRD version 1.0\n\nBước 01 · Viết nội dung PRD v1.0 · 3 lớp\n- Lớp WHY: Copy 3 items từ Product Seed M1. Nguyên văn.\n- Lớp WHAT: 2-3 User Stories + AC binary + Scope OUT ≥3 items. Áp dụng 5x5 ceiling.\n- Lớp HOW: User Flow + Data Flow. HARDCODE tiếng Việt cho enum values.\n- Success Metrics: Split Primary + Threshold + Timeframe.\n\nBước 02 · Đăng lên Facebook group\n- Post: PRD v1.0 (3 lớp + HARDCODE + Success Metrics).\n- Hashtag: #BTVN_Ngay2 — Chi track và feedback.\n- Format: markdown paste vào post hoặc screenshot.`,
    assignment_rubric_checklist: [
      { item: 'Gate 1 · WHY: Copy nguyên văn 3 items từ Seed, không paraphrase (Pass = 3 dòng khớp Seed items 1-3)', checked: false },
      { item: 'Gate 2 · WHAT · Stories: 2-3 stories, không hơn (5x5 ceiling) (Pass = Đúng 3 stories · fit happy path)', checked: false },
      { item: 'Gate 3 · WHAT · AC: Mỗi AC binary testable, có endpoint hoặc số (Pass = Không có "responsive", "user-friendly")', checked: false },
      { item: 'Gate 4 · WHAT · Scope OUT: ≥3 items OUT explicit (Pass = Kể được 3 thứ KHÔNG build)', checked: false },
      { item: 'Gate 5 · HOW · Flows: User + Data Flow rõ? Business/System có nếu cần (Pass = Ít nhất 2 flows bắt buộc)', checked: false },
      { item: 'Gate 6 · HARDCODE: Enum values tiếng Việt ghi cứng (Pass = Không có "Food & Dining", "Bills" tiếng Anh)', checked: false },
      { item: 'Gate 7 · Success Metrics: Success Signal từ Seed Item 4 có trong PRD assembled (Pass = Primary + Threshold + Timeframe · tracked via AC)', checked: false }
    ],
    supporting_resources: [
      {
        label: 'NotebookLM Vibe Coding 201',
        url: 'https://notebook.google.com/notebook/f2632a96-7fb3-4e23-b67d-1040f4451a3e'
      },
      {
        label: 'PRD Prompting Template v3.0',
        url: 'https://drive.google.com/file/d/1_8QJAA5qBdGLngHY-3RkYQvjzcg4jHtI/view?usp=drive_link'
      },
      {
        label: 'Padlet của lớp (Batch 02)',
        url: 'https://padlet.com/dangtuyethong2324/vibe-coding-201-batch-02-z7yk4l9ojhninj1z'
      }
    ]
  },
  
  // Phần 2
  {
    id: '9bd3fd2c-ee49-4176-b951-42e70d4f48ff',
    course_id: '3f26048a-6689-400e-99fc-e0499161d934',
    title: 'Buổi 3: IDE (Codex, Visual Studio & Claude Code) + CLI Product Cockpit',
    type: 'video',
    content: '',
    video_url: '',
    order_index: 4,
    start_date: '2026-08-05',
    target: '',
    has_materials: false
  },
  {
    id: '8695373a-7625-4883-8a47-4a73c84cb3df',
    course_id: '3f26048a-6689-400e-99fc-e0499161d934',
    title: 'Buổi 4: MCP for Product Building',
    type: 'video',
    content: '',
    video_url: '',
    order_index: 5,
    start_date: '2026-08-08',
    target: '',
    has_materials: false
  },
  {
    id: 'a10719c6-edf1-4233-9438-f2e95c5b21c7',
    course_id: '3f26048a-6689-400e-99fc-e0499161d934',
    title: 'Buổi 5: Skills for Product Building',
    type: 'video',
    content: '',
    video_url: '',
    order_index: 6,
    start_date: '2026-08-19',
    target: '',
    has_materials: false
  },
  
  // Phần 3
  {
    id: '34a95f25-be91-4627-943f-2e9ccdb1c747',
    course_id: '3f26048a-6689-400e-99fc-e0499161d934',
    title: 'Buổi 6: GitHub & Version Control',
    type: 'video',
    content: '',
    video_url: '',
    order_index: 7,
    start_date: '2026-08-22',
    target: '',
    has_materials: false
  },
  {
    id: '352d4c69-bafd-4dbf-b234-abad86c07ad8',
    course_id: '3f26048a-6689-400e-99fc-e0499161d934',
    title: 'Buổi 7: Backend + Database',
    type: 'video',
    content: '',
    video_url: '',
    order_index: 8,
    start_date: '2026-08-26',
    target: '',
    has_materials: false
  },
  
  // Phần 4
  {
    id: 'f7fa3d41-a0ef-4b39-8a3c-09457425963d',
    course_id: '3f26048a-6689-400e-99fc-e0499161d934',
    title: 'Buổi 8: Deploy & Infra Landscape',
    type: 'video',
    content: '',
    video_url: '',
    order_index: 9,
    start_date: '2026-08-29',
    target: '',
    has_materials: false
  },
  {
    id: '6acc4c45-e51a-4fdf-a1ca-25847522bdd8',
    course_id: '3f26048a-6689-400e-99fc-e0499161d934',
    title: 'Buổi 9: Automation with n8n',
    type: 'video',
    content: '',
    video_url: '',
    order_index: 10,
    start_date: '2026-09-05',
    target: '',
    has_materials: false
  },
  {
    id: 'a10719c6-edf1-4233-9438-f2e95c5b21c9',
    course_id: '3f26048a-6689-400e-99fc-e0499161d934',
    title: 'Buổi 10: Demo hệ thống (theo request của học viên)',
    type: 'video',
    content: '',
    video_url: '',
    order_index: 11,
    start_date: '2026-09-12',
    target: '',
    has_materials: false
  }
];

export const SEED_PROFILES: Profile[] = [
  {
    id: 'c6b8a8b1-321a-4d2a-89a1-5d9f0f9b6b8a',
    full_name: 'Đặng Tuyết Hồng',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop',
    role: 'admin',
    gmail: 'dangtuyethong2324@gmail.com',
    phone_number: '0901234567',
    facebook_url: 'https://facebook.com/dangtuyethong2324',
    is_profile_completed: true,
    nautical_miles: 0,
    visits: 1,
    created_at: new Date('2024-09-01').toISOString()
  }
];
export const SEED_TRANSACTIONS: NauticalMilesTransaction[] = [];
export const SEED_PROFILE_BADGES: ProfileBadge[] = [];
export const SEED_NOTIFICATIONS: NotificationLog[] = [];
export const SEED_ANNOUNCEMENTS: Announcement[] = [];
export const SEED_ONBOARDING_DAYS: OnboardingDay[] = [];

export const SEED_CALENDAR_EVENTS: CalendarEvent[] = [
  { id: 'cal-1', title: 'KICK-OFF MEETING', time: '14:30', endTime: '16:30', date: 18, month: 6, year: 2026, colorClass: 'bg-red-600 text-white', type: 'class', eventType: 'kick-off', details: 'Kick-off Meeting\nOnline via Zoom\nSự kiện khởi động' },
  { id: 'cal-2', title: 'ONBOARDING', time: '05:00', allDay: true, date: 20, month: 6, year: 2026, colorClass: 'bg-violet-600 text-white', type: 'community', eventType: 'onboarding' },
  { id: 'cal-3', title: 'ONBOARDING', time: '05:00', allDay: true, date: 21, month: 6, year: 2026, colorClass: 'bg-violet-600 text-white', type: 'community', eventType: 'onboarding' },
  { id: 'cal-4', title: 'ONBOARDING', time: '05:00', allDay: true, date: 22, month: 6, year: 2026, colorClass: 'bg-violet-600 text-white', type: 'community', eventType: 'onboarding' },
  { id: 'cal-5', title: 'ONBOARDING', time: '05:00', allDay: true, date: 23, month: 6, year: 2026, colorClass: 'bg-violet-600 text-white', type: 'community', eventType: 'onboarding' },
  { id: 'cal-6', title: 'ONBOARDING', time: '05:00', allDay: true, date: 24, month: 6, year: 2026, colorClass: 'bg-violet-600 text-white', type: 'community', eventType: 'onboarding' },
  { id: 'cal-7', title: 'ONBOARDING', time: '05:00', allDay: true, date: 25, month: 6, year: 2026, colorClass: 'bg-violet-600 text-white', type: 'community', eventType: 'onboarding' },
  { id: 'cal-8', title: 'ONBOARDING', time: '05:00', allDay: true, date: 26, month: 6, year: 2026, colorClass: 'bg-violet-600 text-white', type: 'community', eventType: 'onboarding' },
  { id: 'cal-live-1', title: 'LIVE CLASS - BUỔI 01', time: '20:30', endTime: '22:30', date: 29, month: 6, year: 2026, colorClass: 'bg-orange-600 text-white', type: 'class', eventType: 'live-class', details: 'Buổi 01: Mindset: MVP -> Product có thể scale\nOnline via Zoom\nSự kiện học thuật' },
  { id: 'cal-live-2', title: 'LIVE CLASS - BUỔI 02', time: '14:30', endTime: '16:30', date: 1, month: 7, year: 2026, colorClass: 'bg-orange-600 text-white', type: 'class', eventType: 'live-class', details: 'Buổi 02: PRD kỹ thuật & 4 flow\nOnline via Zoom\nSự kiện học thuật' },
  { id: 'cal-live-3', title: 'LIVE CLASS - BUỔI 03', time: '20:30', endTime: '22:30', date: 5, month: 7, year: 2026, colorClass: 'bg-orange-600 text-white', type: 'class', eventType: 'live-class', details: 'Buổi 03: IDE (Codex, Visual Studio & Claude Code) + CLI Product Cockpit\nOnline via Zoom\nSự kiện học thuật' },
  { id: 'cal-live-4', title: 'LIVE CLASS - BUỔI 04', time: '14:30', endTime: '16:30', date: 8, month: 7, year: 2026, colorClass: 'bg-orange-600 text-white', type: 'class', eventType: 'live-class', details: 'Buổi 04: MCP for Product Building\nOnline via Zoom\nSự kiện học thuật' },
  { id: 'cal-live-5', title: 'LIVE CLASS - BUỔI 05', time: '20:30', endTime: '22:30', date: 19, month: 7, year: 2026, colorClass: 'bg-orange-600 text-white', type: 'class', eventType: 'live-class', details: 'Buổi 05: Skills for Product Building\nOnline via Zoom\nSự kiện học thuật' },
  { id: 'cal-live-6', title: 'LIVE CLASS - BUỔI 06', time: '14:30', endTime: '16:30', date: 22, month: 7, year: 2026, colorClass: 'bg-orange-600 text-white', type: 'class', eventType: 'live-class', details: 'Buổi 06: GitHub & Version Control\nOnline via Zoom\nSự kiện học thuật' },
  { id: 'cal-live-7', title: 'LIVE CLASS - BUỔI 07', time: '20:30', endTime: '22:30', date: 26, month: 7, year: 2026, colorClass: 'bg-orange-600 text-white', type: 'class', eventType: 'live-class', details: 'Buổi 07: Backend + Database\nOnline via Zoom\nSự kiện học thuật' },
  { id: 'cal-live-8', title: 'LIVE CLASS - BUỔI 08', time: '14:30', endTime: '16:30', date: 29, month: 7, year: 2026, colorClass: 'bg-orange-600 text-white', type: 'class', eventType: 'live-class', details: 'Buổi 08: Deploy & Infra Landscape\nOnline via Zoom\nSự kiện học thuật' },
  { id: 'cal-live-9', title: 'LIVE CLASS - BUỔI 09', time: '14:30', endTime: '16:30', date: 5, month: 8, year: 2026, colorClass: 'bg-orange-600 text-white', type: 'class', eventType: 'live-class', details: 'Buổi 09: Automation with n8n\nOnline via Zoom\nSự kiện học thuật' },
  { id: 'cal-break-1', title: 'TUẦN NGHỈ - BUILD SẢN PHẨM', time: '00:00', allDay: true, date: 12, month: 7, year: 2026, colorClass: 'bg-gray-500 text-white', type: 'other' },
  { id: 'cal-break-2', title: 'TUẦN NGHỈ - BUILD SẢN PHẨM', time: '00:00', allDay: true, date: 13, month: 7, year: 2026, colorClass: 'bg-gray-500 text-white', type: 'other' },
  { id: 'cal-break-3', title: 'TUẦN NGHỈ - BUILD SẢN PHẨM', time: '00:00', allDay: true, date: 14, month: 7, year: 2026, colorClass: 'bg-gray-500 text-white', type: 'other' },
  { id: 'cal-break-4', title: 'TUẦN NGHỈ - BUILD SẢN PHẨM', time: '00:00', allDay: true, date: 15, month: 7, year: 2026, colorClass: 'bg-gray-500 text-white', type: 'other' },
  { id: 'cal-break-5', title: 'TUẦN NGHỈ - BUILD SẢN PHẨM', time: '00:00', allDay: true, date: 16, month: 7, year: 2026, colorClass: 'bg-gray-500 text-white', type: 'other' },
  { id: 'cal-holiday-1', title: 'NGHỈ QUỐC KHÁNH', time: '00:00', allDay: true, date: 1, month: 8, year: 2026, colorClass: 'bg-red-700 text-white', type: 'other' },
  { id: 'cal-holiday-2', title: 'NGHỈ QUỐC KHÁNH', time: '00:00', allDay: true, date: 2, month: 8, year: 2026, colorClass: 'bg-red-700 text-white', type: 'other' },
  { id: 'cal-holiday-3', title: 'NGHỈ QUỐC KHÁNH', time: '00:00', allDay: true, date: 3, month: 8, year: 2026, colorClass: 'bg-red-700 text-white', type: 'other' },
  { id: 'cal-live-10', title: 'LIVE CLASS - BUỔI 10', time: '14:30', endTime: '16:30', date: 12, month: 8, year: 2026, colorClass: 'bg-orange-600 text-white', type: 'class', eventType: 'live-class', details: 'Buổi 10: Demo hệ thống (theo request của học viên)\nOnline via Zoom\nSự kiện học thuật' },
  { id: 'cal-pitch-1', title: 'PITCHING DAY 01', time: '20:30', endTime: '22:30', date: 16, month: 8, year: 2026, colorClass: 'bg-amber-600 text-white', type: 'class', eventType: 'capstone', details: 'Pitching Day 01\nOnline/Offline' },
  { id: 'cal-pitch-2', title: 'PITCHING DAY 02', time: '14:30', endTime: '16:30', date: 19, month: 8, year: 2026, colorClass: 'bg-amber-600 text-white', type: 'class', eventType: 'capstone', details: 'Pitching Day 02\nOnline/Offline' },
  { id: 'cal-pitch-3', title: 'PITCHING DAY 03', time: '20:30', endTime: '22:30', date: 23, month: 8, year: 2026, colorClass: 'bg-amber-600 text-white', type: 'class', eventType: 'capstone', details: 'Pitching Day 03\nOnline/Offline' },
  { id: 'cal-oh-1', title: 'OFFICE HOUR', time: '15:30', endTime: '16:30', date: 19, month: 6, year: 2026, colorClass: 'bg-blue-600 text-white', type: 'community', eventType: 'office-hour', details: 'Office Hour hỗ trợ học tập' },
  { id: 'cal-oh-2', title: 'OFFICE HOUR', time: '15:30', endTime: '16:30', date: 26, month: 6, year: 2026, colorClass: 'bg-blue-600 text-white', type: 'community', eventType: 'office-hour', details: 'Office Hour hỗ trợ học tập' },
  { id: 'cal-oh-3', title: 'OFFICE HOUR', time: '15:30', endTime: '16:30', date: 2, month: 7, year: 2026, colorClass: 'bg-blue-600 text-white', type: 'community', eventType: 'office-hour', details: 'Office Hour hỗ trợ học tập' },
  { id: 'cal-oh-4', title: 'OFFICE HOUR', time: '15:30', endTime: '16:30', date: 9, month: 7, year: 2026, colorClass: 'bg-blue-600 text-white', type: 'community', eventType: 'office-hour', details: 'Office Hour hỗ trợ học tập' },
  { id: 'cal-oh-7', title: 'OFFICE HOUR', time: '15:30', endTime: '16:30', date: 30, month: 7, year: 2026, colorClass: 'bg-blue-600 text-white', type: 'community', eventType: 'office-hour', details: 'Office Hour hỗ trợ học tập' },
  { id: 'cal-oh-8', title: 'OFFICE HOUR', time: '15:30', endTime: '16:30', date: 6, month: 8, year: 2026, colorClass: 'bg-blue-600 text-white', type: 'community', eventType: 'office-hour', details: 'Office Hour hỗ trợ học tập' },
  { id: 'cal-oh-9', title: 'OFFICE HOUR', time: '15:30', endTime: '16:30', date: 13, month: 8, year: 2026, colorClass: 'bg-blue-600 text-white', type: 'community', eventType: 'office-hour', details: 'Office Hour hỗ trợ học tập' },
  { id: 'cal-oh-10', title: 'OFFICE HOUR', time: '15:30', endTime: '16:30', date: 20, month: 8, year: 2026, colorClass: 'bg-blue-600 text-white', type: 'community', eventType: 'office-hour', details: 'Office Hour hỗ trợ học tập' }
];

export const SEED_ABOUT_CONTENT: AboutContent = {
  overviewText: `Vibe Coding 201 là khoá học dành cho cựu học viên 101 và non-tech builder đã từng build bằng AI, nhưng muốn hiểu tech sâu hơn để tự tin xây sản phẩm với AI.`,
  scheduleText: `⚓ Lịch trình toàn khoá học:\n\nChặng 1: Kick-off Meeting - Cột mốc đầu tiên để bạn làm quen với đội ngũ điều phối, lộ trình khoá học và các nền tảng học tập.\n\nChặng 2: Onboarding Week - Chuỗi thử thách 07 ngày liên tục giúp làm quen với tinh thần học tập, trang bị kiến thức/mindset nền tảng và hình thành thói quen học tập hằng ngày.\n\nChặng 3: Live Class - Các buổi học online trực tiếp nghe giảng từ giảng viên kết hợp các buổi Office Hour hỗ trợ ngoài giờ học.\n\nChặng 4: Capstone Project - Chia sẻ sản phẩm của mình cho cả lớp vào cuối khoá học để nhận Certificate tốt nghiệp.`,
  benefitsText: `🎁 Quyền lợi học viên:\n- 1. Office Hour: Nhận hỗ trợ giải đáp thắc mắc trực tiếp ngoài giờ học từ giảng viên.\n- 2. Học lại khoá mới free: Nâng cấp tư duy và công nghệ hoàn toàn miễn phí.\n- 3. Tham gia Miễn phí 1ight Club: Cộng đồng tự chủ sự nghiệp cùng AI chuyên sâu.\n- 4. Tham gia Alumni Club: Không gian dành riêng cho cựu học sinh các khoá học tại The1ight.`
};
