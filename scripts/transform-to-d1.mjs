import fs from 'fs';
import path from 'path';

function escapeSql(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 1 : 0;
  if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
  return `'${String(val).replace(/'/g, "''")}'`;
}

async function transform() {
  console.log('🔄 Đang chuyển đổi và tối ưu dữ liệu Multi-Course & Multi-Batch -> SQL cho Cloudflare D1...');

  const profiles = JSON.parse(fs.readFileSync('backup/supabase_profiles.json', 'utf8'));
  const admins = JSON.parse(fs.readFileSync('backup/supabase_admins.json', 'utf8'));
  const badges = JSON.parse(fs.readFileSync('backup/supabase_badges.json', 'utf8'));
  const calendarEvents = JSON.parse(fs.readFileSync('backup/supabase_calendar_events.json', 'utf8'));
  const obsidianOnboarding = JSON.parse(fs.readFileSync('website/public/data/onboardingData.json', 'utf8'));

  let sql = `-- ====================================================================
-- Migration Seed Script: Supabase & Mock Courses to Cloudflare D1
-- Multi-Course & Multi-Batch Isolation (Vibe Coding 201 + Obsidian 101)
-- Generated automatically: ${new Date().toISOString()}
-- ====================================================================

`;

  // 1. COURSES
  sql += `-- ==========================================
-- 1. COURSES
-- ==========================================
INSERT OR REPLACE INTO courses (id, slug, title, description, cover_image, tagline, level, category, is_active, created_at)
VALUES (
  'course-vibe-201',
  'vibe-coding-201',
  'Vibe Coding 201: Build Scalable Product with AI',
  'Khóa học chuyên sâu hướng dẫn xây dựng và scale sản phẩm số hoàn chỉnh từ ý tưởng đến triển khai bằng AI coding agents, Cloudflare Edge & modern stack.',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  'Làm chủ tư duy kiến trúc và quy trình phát triển sản phẩm với AI Agents',
  'Intermediate',
  'AI Software Development',
  1,
  datetime('now')
);

-- Backward-compat course row for old UUID
INSERT OR REPLACE INTO courses (id, slug, title, description, cover_image, is_active, created_at)
VALUES (
  '3f26048a-6689-400e-99fc-e0499161d934',
  'vibe-coding-201-legacy',
  'Vibe Coding 201 (Legacy UUID)',
  'Alias mapped to Vibe Coding 201',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  1,
  datetime('now')
);

INSERT OR REPLACE INTO courses (id, slug, title, description, cover_image, tagline, level, category, is_active, created_at)
VALUES (
  'course-obsidian-101',
  'obsidian-101',
  'Obsidian 101: Xây một hệ thống ghi chú và xử lý tri thức với Obsidian và AI',
  'Xây một hệ thống ghi chú và xử lý tri thức với Obsidian và AI. Chuyển đổi từ ghi chú rời rạc thành hệ thống tri thức sống, tối ưu hóa hiệu suất làm việc với AI.',
  'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80',
  'Từ ghi chú rời rạc → Hệ thống tri thức sống → Làm việc hiệu suất hơn với AI',
  'Beginner',
  'Productivity & AI Knowledge',
  1,
  datetime('now')
);
\n`;

  // 2. USERS (Profiles + Admins + Test user + Obsidian mock students)
  sql += `-- ==========================================
-- 2. USERS & PROFILES (Preserving 34 real students)
-- ==========================================
`;

  const adminMap = new Map();
  for (const a of admins) {
    if (a.gmail) adminMap.set(a.gmail.toLowerCase(), a);
  }

  const profilesByEmail = new Map();
  for (const p of profiles) {
    const email = (p.gmail || `${p.id}@placeholder.lightms`).toLowerCase();
    if (!profilesByEmail.has(email)) {
      profilesByEmail.set(email, p);
    } else {
      const existing = profilesByEmail.get(email);
      const existingTasksCount = Object.keys(existing.onboarding_tasks || {}).length;
      const currentTasksCount = Object.keys(p.onboarding_tasks || {}).length;
      if (currentTasksCount > existingTasksCount || (p.visits || 0) > (existing.visits || 0)) {
        profilesByEmail.set(email, p);
      }
    }
  }

  for (const [email, p] of profilesByEmail.entries()) {
    const adminMatch = adminMap.get(email);
    const role = adminMatch ? 'admin' : (p.role || 'student');
    const adminRole = adminMatch?.admin_role || (role === 'admin' ? 'Operations' : null);

    sql += `INSERT OR REPLACE INTO users (
      id, email, password_hash, full_name, avatar_url, role, admin_role,
      phone_number, facebook_url, industry, current_job, product_idea,
      is_profile_completed, nautical_miles, visits, referral_source,
      current_role, work_field, living_region, gender, age_group,
      onboarding_tasks_json, liveclass_tasks_json, badges_json, created_at
    ) VALUES (
      ${escapeSql(p.id)}, ${escapeSql(email)}, ${escapeSql('oauth_managed')}, ${escapeSql(p.full_name || 'Học viên')}, ${escapeSql(p.avatar_url)},
      ${escapeSql(role)}, ${escapeSql(adminRole)}, ${escapeSql(p.phone_number)}, ${escapeSql(p.facebook_url)}, ${escapeSql(p.industry)},
      ${escapeSql(p.current_job)}, ${escapeSql(p.product_idea)}, ${p.is_profile_completed ? 1 : 0}, ${p.nautical_miles || 0}, ${p.visits || 0},
      ${escapeSql(p.referral_source)}, ${escapeSql(p.current_role)}, ${escapeSql(p.work_field)}, ${escapeSql(p.living_region)},
      ${escapeSql(p.gender)}, ${escapeSql(p.age_group)}, ${escapeSql(p.onboarding_tasks || {})}, ${escapeSql(p.liveclass_tasks || {})},
      ${escapeSql(p.badges || [])}, ${escapeSql(p.created_at || new Date().toISOString())}
    );\n`;
  }

  // Add admins not already in profiles
  for (const a of admins) {
    const email = (a.gmail || '').toLowerCase();
    if (email && !profilesByEmail.has(email)) {
      sql += `INSERT OR REPLACE INTO users (
        id, email, password_hash, full_name, avatar_url, role, admin_role,
        phone_number, facebook_url, is_profile_completed, nautical_miles, visits,
        onboarding_tasks_json, liveclass_tasks_json, badges_json, created_at
      ) VALUES (
        ${escapeSql(a.id)}, ${escapeSql(email)}, ${escapeSql('oauth_managed')}, ${escapeSql(a.full_name || 'Admin')}, ${escapeSql(a.avatar_url)},
        'admin', ${escapeSql(a.admin_role || 'Operations')}, ${escapeSql(a.phone_number)}, NULL, 1, 0, 0,
        '{}', '{}', '[]', ${escapeSql(a.created_at || new Date().toISOString())}
      );\n`;
    }
  }

  // Add test student 'student-1'
  sql += `INSERT OR REPLACE INTO users (
    id, email, password_hash, full_name, avatar_url, role, admin_role,
    is_profile_completed, nautical_miles, visits, created_at
  ) VALUES (
    'student-1', 'test.student@the1ight.com', 'oauth_managed', 'Học Viên Thử Nghiệm',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=student-1', 'student', NULL,
    1, 100, 10, datetime('now')
  );\n`;

  // 3. BATCHES
  sql += `\n-- ==========================================
-- 3. BATCHES
-- ==========================================
INSERT OR REPLACE INTO batches (id, course_id, batch_code, title, access_code, start_date, end_date, max_students, is_active, created_at)
VALUES (
  'batch-vibe201-k2',
  'course-vibe-201',
  'K2',
  'Vibe Coding 201 - Khóa 2',
  'VIBE201-K2-888',
  '2026-07-01',
  '2026-08-31',
  50,
  1,
  datetime('now')
);

-- Legacy batch alias row
INSERT OR REPLACE INTO batches (id, course_id, batch_code, title, access_code, start_date, end_date, max_students, is_active, created_at)
VALUES (
  'e574fea2-9260-4961-8b1d-79ef7e16f784',
  'course-vibe-201',
  'K3',
  'Vibe Coding 201 - Khóa 3',
  'VIBE201-K3-PROD',
  '2026-07-01',
  '2026-08-31',
  50,
  1,
  datetime('now')
);

INSERT OR REPLACE INTO batches (id, course_id, batch_code, title, access_code, start_date, end_date, max_students, is_active, created_at)
VALUES (
  'batch-obs101-k1',
  'course-obsidian-101',
  'K1',
  'Obsidian 101 - Khóa 1',
  'OBS101-K1-999',
  '2026-10-06',
  '2026-11-01',
  80,
  1,
  datetime('now')
);
\n`;

  // 4. BADGES
  sql += `\n-- ==========================================
-- 4. BADGES
-- ==========================================
`;
  for (const bg of badges) {
    sql += `INSERT OR REPLACE INTO badges (id, name, icon, description, condition) VALUES (${escapeSql(bg.id)}, ${escapeSql(bg.name)}, ${escapeSql(bg.icon)}, ${escapeSql(bg.description)}, ${escapeSql(bg.condition || bg.description)});\n`;
  }

  // 5. BATCH ENROLLMENTS
  sql += `\n-- ==========================================
-- 5. BATCH ENROLLMENTS (Isolated per batch)
-- ==========================================
`;
  // Enroll all 34 real students into Vibe Coding 201 Batch K2
  for (const [email, p] of profilesByEmail.entries()) {
    const userId = p.id;
    const enrollId = `enroll-vibe201-${userId}`;
    sql += `INSERT OR REPLACE INTO batch_enrollments (id, user_id, batch_id, course_id, access_code_used, enrolled_at, status)
VALUES (${escapeSql(enrollId)}, ${escapeSql(userId)}, 'batch-vibe201-k2', 'course-vibe-201', 'VIBE201-K2-888', ${escapeSql(p.created_at || new Date().toISOString())}, 'active');\n`;
  }

  // Enroll test student 'student-1' into Vibe 201 batch
  sql += `INSERT OR REPLACE INTO batch_enrollments (id, user_id, batch_id, course_id, access_code_used, enrolled_at, status)
VALUES ('enroll-test-vibe201', 'student-1', 'batch-vibe201-k2', 'course-vibe-201', 'VIBE201-K2-888', datetime('now'), 'active');\n`;

  // Note: Obsidian 101 has not started yet and has 0 initial enrollments. Real enrollments will occur via access code.

  // 6. CALENDAR EVENTS (Vibe 201: 42 events, Obsidian 101: 7 events)
  sql += `\n-- ==========================================
-- 6. CALENDAR EVENTS (Scoped to batchId)
-- ==========================================
`;
  // Vibe 201 Events
  for (const ev of calendarEvents) {
    const startTime = `${ev.year || 2026}-${String(ev.month || 7).padStart(2, '0')}-${String(ev.date || 1).padStart(2, '0')}T${ev.time || '00:00'}:00Z`;
    const endTime = `${ev.year || 2026}-${String(ev.month || 7).padStart(2, '0')}-${String(ev.date || 1).padStart(2, '0')}T${ev.end_time || '23:59'}:00Z`;
    sql += `INSERT OR REPLACE INTO calendar_events (id, batch_id, title, event_type, start_time, end_time, meeting_url, description, created_at)
VALUES (${escapeSql(ev.id)}, 'batch-vibe201-k2', ${escapeSql(ev.title || 'Event')}, ${escapeSql(ev.event_type || ev.type || 'Live Class')}, ${escapeSql(startTime)}, ${escapeSql(endTime)}, NULL, ${escapeSql(ev.details)}, datetime('now'));\n`;
  }

  // Obsidian 101 Events
  const obsidianCalendar = [
    { id: 'evt-obs-kickoff', title: 'Kick-off lớp Obsidian', event_type: 'kick-off', startTime: '2026-10-06T20:30:00Z', endTime: '2026-10-06T22:30:00Z', details: 'Khai giảng và làm quen phương pháp Second Brain' },
    { id: 'evt-obs-b1', title: 'Buổi 1: Foundation Setup', event_type: 'live-class', startTime: '2026-10-13T20:30:00Z', endTime: '2026-10-13T22:30:00Z', details: 'Xây dựng Vault cá nhân chuẩn mực và Home page' },
    { id: 'evt-obs-b2', title: 'Buổi 2: Distill', event_type: 'live-class', startTime: '2026-10-18T10:00:00Z', endTime: '2026-10-18T12:00:00Z', details: 'Chắt lọc tri thức với Progressive Summarization' },
    { id: 'evt-obs-b3', title: 'Buổi 3: Capture', event_type: 'live-class', startTime: '2026-10-20T20:30:00Z', endTime: '2026-10-20T22:30:00Z', details: 'Thu nạp thông tin đa lĩnh vực' },
    { id: 'evt-obs-b4', title: 'Buổi 4: Organize', event_type: 'live-class', startTime: '2026-10-25T10:00:00Z', endTime: '2026-10-25T12:00:00Z', details: 'Tổ chức vault thành hệ thống sống' },
    { id: 'evt-obs-b5', title: 'Buổi 5: Express', event_type: 'live-class', startTime: '2026-10-27T20:30:00Z', endTime: '2026-10-27T22:30:00Z', details: 'Phối hợp và làm việc chuyên sâu với AI' },
    { id: 'evt-obs-pitching', title: 'Pitching Day: Second Brain', event_type: 'capstone', startTime: '2026-11-01T10:00:00Z', endTime: '2026-11-01T12:00:00Z', details: 'Báo cáo và trao chứng nhận tốt nghiệp' }
  ];

  for (const ev of obsidianCalendar) {
    sql += `INSERT OR REPLACE INTO calendar_events (id, batch_id, title, event_type, start_time, end_time, meeting_url, description, created_at)
VALUES (${escapeSql(ev.id)}, 'batch-obs101-k1', ${escapeSql(ev.title)}, ${escapeSql(ev.event_type)}, ${escapeSql(ev.startTime)}, ${escapeSql(ev.endTime)}, NULL, ${escapeSql(ev.details)}, datetime('now'));\n`;
  }

  // 7. ONBOARDING DAYS (Scoped to courseId)
  sql += `\n-- ==========================================
-- 7. ONBOARDING DAYS (Scoped to courseId)
-- ==========================================
`;
  for (const day of obsidianOnboarding) {
    const dayId = `onboarding-obs-${day.day}`;
    sql += `INSERT OR REPLACE INTO onboarding_days (
      id, course_id, batch_id, day, title, intro, objective, checklist, takeaway, companion_hint, bonus_resources, created_at
    ) VALUES (
      ${escapeSql(dayId)}, 'course-obsidian-101', 'batch-obs101-k1', ${day.day}, ${escapeSql(day.title)},
      ${escapeSql(day.intro)}, ${escapeSql(day.objective)}, ${escapeSql(day.checklist)}, ${escapeSql(day.takeaway)},
      ${escapeSql(day.companionHint)}, ${escapeSql(day.bonusResources)}, datetime('now')
    );\n`;
  }

  // Vibe Coding 201 Onboarding Days
  const vibeOnboardingDays = [
    {
      day: 1,
      title: 'Ngày 1: Khởi động, làm quen với khoá học',
      intro: 'Tuần Onboarding rất quan trọng cho trải nghiệm học: dù chưa vào học ngay với mình, nhưng sẽ kích hoạt bạn như một người học chủ động.',
      objective: 'Làm quen với lớp học, cộng đồng và cách hoạt động. Đặt ra "lý do tại sao" bạn học khóa này. Cam kết với chính mình rằng bạn sẽ hành động – không chỉ đọc lý thuyết.',
      checklist: '- [ ] **Task 1:** Viết 01 post giới thiệu bản thân trong [Group Facebook](https://www.facebook.com/share/g/1AehPRGe9U/) của lớp và ghi hashtag **#OB_Ngay1** ở đầu bài viết.\n- [ ] **Task 2:** Cung cấp thông tin: Tên bạn, công việc hiện tại (ngành nghề), các sản phẩm bạn đã từng build bằng AI.\n- [ ] **Task 3:** Trở ngại lớn nhất của bạn khi tham gia khóa học này & cách bạn dự định khắc phục.\n- [ ] **Task 4:** Lợi thế của riêng bạn khi tham gia khóa học.\n- [ ] **Task 5 (Quan trọng):** Cam kết số tiếng/tuần/ngày để học build và hình phạt chấp nhận nếu không hoàn thành bài tập.',
      takeaway: 'Bạn không cần phải “giỏi” để bắt đầu. Nhưng bạn phải bắt đầu thì mới có thể “giỏi”.',
      companionHint: 'Hãy nhớ rằng những thành viên trong lớp sẽ là những users đầu tiên beta test cho sản phẩm của bạn. Một dòng giới thiệu để người ta hiểu bạn hơn, cũng là để bạn hiểu users của mình hơn.',
      bonusResources: 'Tìm hiểu các sản phẩm AI của các bạn học cùng khoá.'
    },
    {
      day: 2,
      title: 'Ngày 2: Xác định sản phẩm bạn muốn xây',
      intro: 'Đây là ngày quan trọng nhất trong toàn khoá học, vì xác định được vấn đề đáng để bạn giải quyết, và đưa ra hình dung về sản phẩm bạn muốn tạo ra cuối khoá học sẽ trở thành động lực giúp bạn đi đến cuối hành trình.',
      objective: 'Tìm hiểu như thế nào là một “sản phẩm”, nắm vững thuật ngữ Problem Statement, PRD và xác định vấn đề bạn muốn giải quyết trong khoá học.',
      checklist: '- [ ] **Task 1:** Tìm hiểu: Như thế nào là một “sản phẩm”? [Link bài viết](https://app.notion.com/p/Th-n-o-m-i-g-i-l-s-n-ph-m-20afb1613f7080cb8d61e0b84e2d52c4?source=copy_link)\n- [ ] **Task 2:** Trả lời câu hỏi và chia sẻ lên [Group Facebook](https://www.facebook.com/groups/27216190438021089) của lớp với hashtag #OB_Ngay2.\n- [ ] **Task 3:** Xem video và slide về thuật ngữ: Problem Statement [Recording Link](https://youtu.be/skbxfJr8MQE)\n- [ ] **Task 4:** Tìm Problem Statement cho sản phẩm của bạn (sử dụng Gemini Gem “Product Discovery”), chia sẻ lên Group Facebook với hashtag #OB_Ngay2.\n- [ ] **Task 5:** Tìm hiểu thêm về PRD - Products Requirement Documents [Recording](https://youtu.be/QRbzd2tCYls) & [PRD Mẫu](https://docs.google.com/document/d/1mDslTv8gzuwdQN7pZ6Ss6g0s5_5oyOO0PCw6FH-1As8/edit?tab=t.0#heading=h.jh0gwzt5ucmt)\n- [ ] **Task 6 (Optional):** Đọc thêm về cách nói chuyện với users và lấy feedback [The1ight Substack](https://the1ight.substack.com/p/mo-khoa-6-lam-sao-e-thuc-su-noi-chuyen?r=2f46k)',
      takeaway: 'Đừng ngại chia sẻ idea còn “chưa chắc chắn”. Mọi sản phẩm tốt đều bắt đầu từ một vấn đề rất đời thường.',
      companionHint: 'Problem Statement hôm nay là bản draft thô đầu tiên của bạn. Đừng áp lực phải viết hoàn hảo, đây sẽ là kim chỉ nam cho bạn trong suốt khoá học.',
      bonusResources: 'Gemini Gem Product Discovery: https://gemini.google.com/gem/1mkUCEXAJOmcF9Hj75K9rkgWMN520_77X?usp=sharing'
    },
    {
      day: 3,
      title: 'Ngày 3: IDE, MCP và CLI',
      intro: 'Khám phá cách phần mềm, lập trình viên và các mô hình AI giao tiếp với nhau cũng như với hệ thống máy tính thông qua MCP và CLI. Giúp bạn phân biệt rõ bản chất, vị trí và use case thực tế của từng khái niệm.',
      objective: 'Phân biệt rõ ràng 3 khái niệm nền tảng: IDE, MCP và CLI; hiểu cách AI Agents chọn tool cho từng tác vụ.',
      checklist: '- [ ] **Task 1:** Tìm hiểu về 03 thuật ngữ IDE, MCP, và CLI (hỏi ChatGPT/Gemini về định nghĩa, use case, ví dụ & hiểu lầm thường gặp).\n- [ ] **Task 2:** Xem video: Bài giảng của thầy Quang về IDE [Link](https://youtu.be/G8n4vGcGpQk), Bài giảng của thầy Chí về MCP [Link](https://youtu.be/KDriJKjuVP0), CLI vs MCP: Hiểu cách AI Agents chọn tool [Video](https://youtu.be/g9JIUM0MHgQ?si=rp9u4zIBKCaZ0zLP).\n- [ ] **Task 3:** Chia sẻ lên [Group Facebook](https://www.facebook.com/groups/27216190438021089) của lớp với hashtag #OB_Ngay3 (Giải thích IDE, CLI, MCP theo cách hiểu của bạn & kinh nghiệm/dự định áp dụng).',
      takeaway: 'Hiểu rõ bản chất công cụ giúp bạn chỉ đạo AI chính xác và xây dựng hệ thống bền vững.',
      companionHint: 'Nếu bạn chưa từng dùng CLI hay MCP, đừng lo lắng, các buổi Live Class sẽ hướng dẫn bạn thực hành từng bước.',
      bonusResources: 'Khóa học Giới thiệu & Nâng cao về MCP (Anthropic), CLI cho người mới bắt đầu: https://youtu.be/uwAqEzhyjtw'
    },
    {
      day: 4,
      title: 'Ngày 4: Skills và Rules',
      intro: 'Làm quen với hai thuật ngữ Skills và Rules, được sử dụng rất nhiều khi làm việc với IDE và AI Coding Agents.',
      objective: 'Hiểu rõ khái niệm Agent Skills và Rules, phân biệt Global Rules vs Workspace Rules, học cách viết Rules hiệu quả cho AI.',
      checklist: '- [ ] **Task 1:** Tìm hiểu về thuật ngữ Agent Skills và Rules (hỏi AI về use case, hạn chế, sự khác nhau giữa Global Rules & Workspace/Project Rules).\n- [ ] **Task 2:** Xem video: Bài giảng của thầy Chí về Skills và Rules [Link](https://youtu.be/zHyI6hQAY-U), AI Agent Skills từ IBM Technology [Link](https://youtu.be/Lg-meK5IU8Q), Cách Viết Rules Hiệu Quả [Link](https://www.youtube.com/watch?v=MYnYY8Rlego).\n- [ ] **Task 3:** Chia sẻ lên [Group Facebook](https://www.facebook.com/groups/27216190438021089) của lớp với hashtag #OB_Ngay4 (Giải thích Skills, Rules và các loại Rules theo lời của bạn).',
      takeaway: 'Rules và Skills là cách bạn truyền đạt tiêu chuẩn chất lượng và kinh nghiệm cho AI Agent.',
      companionHint: 'Đây là bước khởi động nhẹ, buổi học trên lớp sẽ đi sâu hơn vào cách tạo Skills thực chiến.',
      bonusResources: 'Andrej Karpathy Skills repo: https://github.com/multica-ai/andrej-karpathy-skills, Hướng dẫn xây dựng Skills từ Anthropic & Antigravity.'
    },
    {
      day: 5,
      title: 'Ngày 5: GitHub',
      intro: 'Khám phá GitHub - nền tảng dịch vụ lưu trữ mã nguồn dựa trên đám mây, sử dụng hệ thống quản lý phiên bản Git.',
      objective: 'Nắm vững các khái niệm Git, GitHub và Repository, hiểu use case của việc quản lý phiên bản khi xây dựng sản phẩm với AI.',
      checklist: '- [ ] **Task 1:** Tìm hiểu thêm về thuật ngữ Git, GitHub và repository (Vì sao phải biết Git? Repository có use case gì khi build với AI?).\n- [ ] **Task 2:** Xem video: Bài giảng của thầy Chí về Git [Link](https://youtu.be/ipBC4-keBS8), Giới thiệu về GitHub [Video](https://youtu.be/pBy1zgt0XPc), bài viết The1ight Substack [Link](https://substack.com/@the1ight/note/p-203672461).\n- [ ] **Task 3:** Chia sẻ lên [Group Facebook](https://www.facebook.com/groups/27216190438021089) của lớp với hashtag #OB_Ngay5 (Giải thích Git & GitHub bằng lời của bạn và dự định áp dụng).',
      takeaway: 'Git là chiếc máy thời gian cho code của bạn — giúp bạn tự tin thử nghiệm mà không sợ mất dữ liệu.',
      companionHint: 'Tạo tài khoản GitHub ngay hôm nay để sẵn sàng kết nối với IDE và AI coding tools!',
      bonusResources: 'Video hướng dẫn Git & GitHub thực chiến: https://youtu.be/RGOj5yH7evk'
    },
    {
      day: 6,
      title: 'Ngày 6: Frontend vs Backend',
      intro: 'Khám phá hai khái niệm quan trọng nhất trong kiến trúc ứng dụng web: Frontend và Backend.',
      objective: 'Phân biệt rạch ròi giữa giao diện người dùng (Frontend) và logic xử lý/dữ liệu phía sau (Backend), hiểu vì sao cần nắm cả hai khi làm việc với AI.',
      checklist: '- [ ] **Task 1:** Tìm hiểu về thuật ngữ Frontend & Backend (hỏi AI: sự khác nhau, ví dụ và 3 hiểu lầm thường gặp).\n- [ ] **Task 2:** Xem video bài giảng của thầy giáo về Frontend và Backend [Recording Link](https://youtu.be/XSyBeGZlPSY).\n- [ ] **Task 3:** Chia sẻ lên [Group Facebook](https://www.facebook.com/groups/27216190438021089) của lớp với hashtag #OB_Ngay6 (Giải thích Frontend & Backend và lý do cần hiểu khi xây sản phẩm bằng AI).',
      takeaway: 'Frontend là vẻ đẹp bên ngoài, Backend là bộ não bên trong. Một sản phẩm hoàn chỉnh cần cả hai phối hợp nhịp nhàng.',
      companionHint: 'Đừng hoang mang bởi các thuật ngữ phức tạp, hãy hình dung Frontend như mặt tiền nhà hàng và Backend như gian bếp nấu nướng!',
      bonusResources: 'Tài liệu và video bổ trợ kiến trúc web Frontend & Backend.'
    },
    {
      day: 7,
      title: 'Ngày 7: Domain & DNS',
      intro: 'Khám phá về Domain và các nền tảng giúp bạn có thể đưa sản phẩm lên Internet và chia sẻ cho người khác dùng.',
      objective: 'Hiểu rõ Domain, DNS, phân biệt các nền tảng triển khai (Vercel, Cloudflare, VPS, Docker) và chọn giải pháp phù hợp cho sản phẩm.',
      checklist: '- [ ] **Task 1:** Tìm hiểu Domain và DNS là gì? Vercel, Cloudflare, VPS, Docker khác nhau thế nào? Nền tảng nào phù hợp cho dự án của bạn?\n- [ ] **Task 2:** Xem các video hướng dẫn về Domain, DNS & Deploy [Video 1](https://youtu.be/hJrQN3n-aXQ), [Video 2](https://youtu.be/acvI1YxHfFw), [Video 3](https://youtu.be/zFXscjUoDDA).\n- [ ] **Task 3:** Chia sẻ lên [Group Facebook](https://www.facebook.com/groups/27216190438021089) của lớp với hashtag #OB_Ngay7 (Giải thích Domain & DNS, chia sẻ kinh nghiệm dùng Cloudflare/Vercel của bạn).',
      takeaway: 'Đưa sản phẩm lên Internet có tên miền riêng là khoảnh khắc bạn biến ý tưởng thành hiện thực trước mắt cả thế giới.',
      companionHint: 'Chúc mừng bạn đã hoàn thành trọn vẹn 7 ngày Onboarding! Hẹn gặp bạn trong buổi Live Class đầu tiên!',
      bonusResources: 'Tài liệu hướng dẫn trỏ DNS và cấu hình Custom Domain trên Cloudflare & Vercel.'
    }
  ];

  for (const day of vibeOnboardingDays) {
    const dayId = `onboarding-vibe-${day.day}`;
    sql += `INSERT OR REPLACE INTO onboarding_days (
      id, course_id, batch_id, day, title, intro, objective, checklist, takeaway, companion_hint, bonus_resources, created_at
    ) VALUES (
      ${escapeSql(dayId)}, 'course-vibe-201', 'batch-vibe201-k2', ${day.day}, ${escapeSql(day.title)},
      ${escapeSql(day.intro)}, ${escapeSql(day.objective)}, ${escapeSql(day.checklist)}, ${escapeSql(day.takeaway)},
      ${escapeSql(day.companionHint)}, ${escapeSql(day.bonusResources)}, datetime('now')
    );\n`;
  }

  const outSqlPath = path.resolve('backup', 'seed_d1_from_supabase.sql');
  fs.writeFileSync(outSqlPath, sql, 'utf8');
  console.log(`✅ Đã tạo thành công file D1 SQL Seed chuẩn hóa: ${outSqlPath}`);
}

transform();
