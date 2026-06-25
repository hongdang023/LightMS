-- The1ight LMS: Seed Data cho khoá Vibe Coding 101 (Batch 3)
-- Xóa dữ liệu cũ nếu chạy lại (tuỳ chọn, cẩn thận trên production)
-- DELETE FROM lesson_skills;
-- DELETE FROM assignments;
-- DELETE FROM lessons;
-- DELETE FROM modules;
-- DELETE FROM batches;
-- DELETE FROM courses;
-- DELETE FROM skills;

-- Bật extension uuid-ossp nếu chưa có
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TẠO KHÓA HỌC
DO $$ 
DECLARE
    course_id uuid := uuid_generate_v4();
    batch_id uuid := uuid_generate_v4();
    mod_onboarding_id uuid := uuid_generate_v4();
    mod_mindset_id uuid := uuid_generate_v4();
    mod_build_id uuid := uuid_generate_v4();
    mod_automation_id uuid := uuid_generate_v4();
    mod_pitching_id uuid := uuid_generate_v4();
    
    skill_problem_id uuid := uuid_generate_v4();
    skill_ux_id uuid := uuid_generate_v4();
    skill_lean_id uuid := uuid_generate_v4();
    skill_ai_id uuid := uuid_generate_v4();
    skill_ui_id uuid := uuid_generate_v4();
    
    lesson_b1_id uuid := uuid_generate_v4();
    lesson_b2_id uuid := uuid_generate_v4();
    lesson_b3_id uuid := uuid_generate_v4();
    lesson_b4_id uuid := uuid_generate_v4();
    lesson_b5_id uuid := uuid_generate_v4();
    lesson_b6_id uuid := uuid_generate_v4();
BEGIN
    INSERT INTO courses (id, title, description, cover_image)
    VALUES (
        course_id, 
        'Vibe Coding 101: Build with the1ight', 
        'Build With The1ight (BWT1L) là khóa học 8 buổi dành cho dân văn phòng và người làm nghề tự do, giúp bạn học cách xây sản phẩm đầu tay, kiểm định ý tưởng, và khai phá khả năng tạo thu nhập từ chính sản phẩm số do mình xây dựng. Học tư duy của một Product Manager thực chiến và ứng dụng AI.', 
        'https://example.com/vibe-coding-cover.png'
    );

    -- 2. TẠO BATCH (LỚP HỌC)
    INSERT INTO batches (id, course_id, name, start_date, end_date)
    VALUES (
        batch_id, 
        course_id, 
        'Batch 3', 
        '2024-09-06', 
        '2024-10-31'  
    );

    -- 3. TẠO MODULES
    INSERT INTO modules (id, course_id, title, order_index) VALUES 
    (mod_onboarding_id, course_id, 'Phần 0: Onboarding & Kick-off', 1),
    (mod_mindset_id, course_id, 'Phần 1: Tư duy Sản phẩm & Vấn đề', 2),
    (mod_build_id, course_id, 'Phần 2: Prototype & Kiến thức Kỹ thuật', 3),
    (mod_automation_id, course_id, 'Phần 3: Automation & Go to Market', 4),
    (mod_pitching_id, course_id, 'Phần 4: Pitching & Launch', 5);

    -- 4. TẠO LESSONS
    -- Phần 0
    INSERT INTO lessons (id, module_id, title, type, content, video_url, order_index) VALUES 
    (uuid_generate_v4(), mod_onboarding_id, 'Buổi 0: Kick-off Meeting', 'video', 'Tìm hiểu về khóa học, giảng viên và văn hóa học tập của lớp', 'https://drive.google.com/...', 1);

    -- Phần 1
    INSERT INTO lessons (id, module_id, title, type, content, video_url, order_index) VALUES 
    (lesson_b1_id, mod_mindset_id, 'Buổi 1: Tư duy sản phẩm trong thời đại AI', 'video', 'Khái niệm nền tảng về Product Management và mindset.', 'https://drive.google.com/...', 2),
    (lesson_b2_id, mod_mindset_id, 'Buổi 2: Product Framework và cách áp dụng', 'video', 'Review các framework cần biết khi làm sản phẩm.', 'https://drive.google.com/...', 3),
    (lesson_b4_id, mod_mindset_id, 'Buổi 4: Viết Problem Statement & PRD', 'video', 'Viết Problem Statement & PRD.', 'https://drive.google.com/...', 4);

    -- Phần 2
    INSERT INTO lessons (id, module_id, title, type, content, video_url, order_index) VALUES 
    (lesson_b3_id, mod_build_id, 'Buổi 3: Design. Prompt. Prototype', 'video', 'Cách giao tiếp với AI rồng cưng.', 'https://drive.google.com/...', 5),
    (lesson_b5_id, mod_build_id, 'Buổi 5: Kiến thức kỹ thuật nền tảng', 'video', 'Kiến thức frontend, backend, DB, API.', 'https://drive.google.com/...', 6);

    -- Phần 3
    INSERT INTO lessons (id, module_id, title, type, content, video_url, order_index) VALUES 
    (lesson_b6_id, mod_automation_id, 'Buổi 6: Tự động hoá với Make và AI', 'video', 'Làm việc với Make/n8n.', 'https://drive.google.com/...', 7),
    (uuid_generate_v4(), mod_automation_id, 'Buổi 7: Automation 2', 'video', 'Advanced automation với Make/n8n.', 'https://drive.google.com/...', 8),
    (uuid_generate_v4(), mod_automation_id, 'Buổi 8: Chiến lược Go to Market', 'video', 'Học cách nghĩ chiến lược đưa sản phẩm ra thị trường.', 'https://drive.google.com/...', 9);

    -- Phần 4
    INSERT INTO lessons (id, module_id, title, type, content, video_url, order_index) VALUES 
    (uuid_generate_v4(), mod_pitching_id, 'Buổi 9: Cách để giao tiếp với users', 'document', 'Học cách kiểm nghiệm sản phẩm thật với người dùng.', '', 10),
    (uuid_generate_v4(), mod_pitching_id, 'Buổi 10: Pitching Day 1', 'video', 'Trình bày sản phẩm', 'https://drive.google.com/...', 11),
    (uuid_generate_v4(), mod_pitching_id, 'Buổi 11: Pitching Day 2', 'video', 'Trình bày sản phẩm', 'https://drive.google.com/...', 12),
    (uuid_generate_v4(), mod_pitching_id, 'Buổi 12: Pitching Day 3', 'video', 'Trình bày sản phẩm', 'https://drive.google.com/...', 13);

    -- 5. TẠO SKILLS (COMPETENCY FRAMEWORK)
    INSERT INTO skills (id, name, description) VALUES 
    (skill_problem_id, 'Problem Statement & PRD', 'Kỹ năng xác định vấn đề và viết tài liệu yêu cầu sản phẩm'),
    (skill_ux_id, 'UX & Aha Moment', 'Kỹ năng thiết kế trải nghiệm và tìm ra điểm giá trị cốt lõi'),
    (skill_lean_id, 'Lean Validation', 'Kỹ năng kiểm chứng ý tưởng tinh gọn'),
    (skill_ai_id, 'AI Collaboration', 'Kỹ năng làm việc với AI để lập trình và tối ưu quy trình'),
    (skill_ui_id, 'UI/Prototyping', 'Kỹ năng làm wireframe và bản mẫu giao diện');

    -- 6. MAPPING LESSONS VÀO SKILLS
    INSERT INTO lesson_skills (lesson_id, skill_id) VALUES 
    (lesson_b1_id, skill_problem_id),
    (lesson_b2_id, skill_lean_id),
    (lesson_b3_id, skill_ai_id),
    (lesson_b3_id, skill_ui_id),
    (lesson_b4_id, skill_problem_id),
    (lesson_b4_id, skill_ux_id),
    (lesson_b5_id, skill_ai_id),
    (lesson_b6_id, skill_ai_id);

    -- 7. TẠO ASSIGNMENTS (BÀI TẬP)
    INSERT INTO assignments (id, lesson_id, description, rubric_checklist, scaffolding) VALUES 
    (
        uuid_generate_v4(), 
        lesson_b4_id, 
        'Nộp Problem Statement và PRD sơ bộ cho ý tưởng sản phẩm của bạn.', 
        '[{"item": "Xác định rõ Pain Point của user", "checked": false}, {"item": "Có Persona cụ thể", "checked": false}, {"item": "Có danh sách Features (User Stories) cốt lõi (MVP)", "checked": false}]'::jsonb,
        '{"template_url": "https://docs.google.com/spreadsheets/d/1nrOIqOfdtw83xzOYyRvEg1LETUd1h25fO57ZqL79Ji0/edit"}'::jsonb
    ),
    (
        uuid_generate_v4(), 
        lesson_b6_id, 
        'Tạo một flow automation cơ bản với Make/n8n kết nối 2 ứng dụng (ví dụ: Google Sheets -> Telegram).', 
        '[{"item": "Flow chạy thành công không có lỗi", "checked": false}, {"item": "Có kết nối ít nhất 1 AI node (ChatGPT/Claude)", "checked": false}]'::jsonb,
        '{"reference_link": "https://chatgpt.com/g/g-68d2c73b46d48191ba1d8382e64a220a-thuyen-truong-jack-sparrow-n8n"}'::jsonb
    );

END $$;

-- Hoàn tất!
