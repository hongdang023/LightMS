-- The1ight LMS: Seed Data cho khoá Vibe Coding 201: Build scalable product with AI (Batch 3)
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
    mod_ide_mcp_id uuid := uuid_generate_v4();
    mod_vc_backend_id uuid := uuid_generate_v4();
    mod_deploy_auto_id uuid := uuid_generate_v4();
    
    lesson_b0_id uuid := uuid_generate_v4();
    lesson_b1_id uuid := uuid_generate_v4();
    lesson_b2_id uuid := uuid_generate_v4();
    lesson_b3_id uuid := uuid_generate_v4();
    lesson_b4_id uuid := uuid_generate_v4();
    lesson_b5_id uuid := uuid_generate_v4();
    lesson_b6_id uuid := uuid_generate_v4();
    lesson_b7_id uuid := uuid_generate_v4();
    lesson_b8_id uuid := uuid_generate_v4();
    lesson_b9_id uuid := uuid_generate_v4();
BEGIN
    INSERT INTO courses (id, title, description, cover_image)
    VALUES (
        course_id, 
        'Vibe Coding 201: Build scalable product with AI', 
        'Vibe Coding 201 là khóa học 9 buổi nâng cao giúp bạn học cách xây dựng sản phẩm có khả năng scale, thiết lập PRD kỹ thuật, làm chủ IDE/CLI, thiết kế MCP và xây dựng hệ thống automation kết hợp n8n.', 
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop'
    );

    -- 2. TẠO BATCH (LỚP HỌC)
    INSERT INTO batches (id, course_id, name, start_date, end_date)
    VALUES (
        batch_id, 
        course_id, 
        'Batch 3', 
        '2026-07-01', 
        '2026-08-31'  
    );

    -- 3. TẠO MODULES
    INSERT INTO modules (id, course_id, title, order_index) VALUES 
    (mod_onboarding_id, course_id, 'Phần 0: Onboarding & Kick-off', 1),
    (mod_mindset_id, course_id, 'Phần 1: Tư duy Sản phẩm & Vấn đề', 2),
    (mod_ide_mcp_id, course_id, 'Phần 2: IDE, CLI & MCP Product Building', 3),
    (mod_vc_backend_id, course_id, 'Phần 3: Version Control & Backend Decision', 4),
    (mod_deploy_auto_id, course_id, 'Phần 4: Deployment & Automation Workspace', 5);

    -- 4. TẠO LESSONS
    -- Phần 0
    INSERT INTO lessons (id, module_id, title, type, content, video_url, order_index, start_date, target, has_materials) VALUES 
    (
        lesson_b0_id, 
        mod_onboarding_id, 
        'Buổi 0: Kick-off Meeting', 
        'video', 
        'Tìm hiểu về khóa học Vibe Coding 201, giảng viên và văn hóa học tập chủ động. Định vị lộ trình Onboarding.', 
        'https://drive.google.com/file/d/kickoff-meeting-vibe-201', 
        1, 
        '2026-06-20', 
        'Kích hoạt tư duy học chủ động, hướng dẫn luật chơi hải lý và giới thiệu công cụ', 
        true
    );

    -- Phần 1
    INSERT INTO lessons (id, module_id, title, type, content, video_url, order_index, start_date, target, has_materials) VALUES 
    (
        lesson_b1_id, 
        mod_mindset_id, 
        'Buổi 1: Mindset: Từ MVP đến product có thể scale', 
        'video', 
        'MVP vs scalable product vs internal workspace system. Các điểm gãy sau prototype: codebase rối, data chưa rõ, auth/permission, deploy tạm, thiếu version control, khó debug, thiếu automation. Tech literacy map cho non-tech: frontend, backend, database, API, auth, deploy, server, automation. Cách học tech với AI: hỏi đúng, kiểm chứng output, không bị thuật ngữ kéo đi.', 
        'https://drive.google.com/file/d/buoi-1-mindset-scale', 
        2, 
        '2026-07-01', 
        'Giúp học viên hiểu gap giữa prototype/MVP và product hoặc workspace system đáng tin hơn.', 
        false
    ),
    (
        lesson_b2_id, 
        mod_mindset_id, 
        'Buổi 2: PRD kỹ thuật & 4 Flow', 
        'video', 
        'PRD v2: problem, user, goal, success criteria, main use case, out-of-scope, user stories, acceptance criteria. Main flow vs secondary flow vs edge case. 4 flow: User Flow, Business Flow, System Flow, Data Flow. Cách dùng AI/skill để review PRD và phát hiện gap.', 
        'https://drive.google.com/file/d/buoi-2-prd-technical', 
        3, 
        '2026-07-05', 
        'Biến ý tưởng/product request thành spec đủ rõ để AI/IDE/agent build đúng hơn.', 
        false
    );

    -- Phần 2
    INSERT INTO lessons (id, module_id, title, type, content, video_url, order_index, start_date, target, has_materials) VALUES 
    (
        lesson_b3_id, 
        mod_ide_mcp_id, 
        'Buổi 3: IDE + CLI Product Cockpit', 
        'video', 
        'Cấu phần IDE: file tree, editor, agent panel, terminal, source control/diff. Workflow giao việc cho agent: context, task breakdown, plan, diff review, accept/reject, run/test/debug. Khi nào dùng IDE, khi nào dùng CLI. Cách yêu cầu AI giải thích lỗi terminal/build log. Cách giới hạn scope để agent không sửa quá rộng.', 
        'https://drive.google.com/file/d/buoi-3-ide-cli-cockpit', 
        4, 
        '2026-07-08', 
        'Dạy cách làm việc với IDE/CLI để AI build có kiểm soát thay vì sửa lung tung. (học cả Cursor, Antigravity, Codex & Claude Code). Riêng Claude code có thể tách 1 buổi nếu muốn', 
        false
    ),
    (
        lesson_b4_id, 
        mod_ide_mcp_id, 
        'Buổi 4: Skills for Product Building', 
        'video', 
        'Skill là gì, khác prompt thường ở đâu. Skill cho brainstorm product, sharpen problem statement, MVP scoping, PRD review, acceptance criteria. Skill cho QA app, browser testing, pitch review, build review checklist. Ví dụ Superpowers hoặc MVP/product framework skill. Cách gọi skill đúng lúc trong IDE/agent workflow.', 
        'https://drive.google.com/file/d/buoi-4-skills-playbook', 
        5, 
        '2026-07-12', 
        'Dạy skill như playbook tái sử dụng để AI hỗ trợ brainstorm, scope, QA, review và cải thiện sản phẩm ổn định hơn.', 
        false
    ),
    (
        lesson_b5_id, 
        mod_ide_mcp_id, 
        'Buổi 5: MCP for Product Building', 
        'video', 
        'MCP trong bức tranh agent/tool. MCP vs Skill vs API vs CLI vs Script. MCP cho design/prototype, browser/app testing, database/schema/docs, repo/GitHub, file/workspace context. Decision rule: khi nào MCP đáng dùng, khi nào không cần.', 
        'https://drive.google.com/file/d/buoi-5-mcp-integration', 
        6, 
        '2026-07-15', 
        'Dạy MCP theo use case product: agent chạm vào tool/data/context để làm việc thật hơn.', 
        false
    );

    -- Phần 3
    INSERT INTO lessons (id, module_id, title, type, content, video_url, order_index, start_date, target, has_materials) VALUES 
    (
        lesson_b6_id, 
        mod_vc_backend_id, 
        'Buổi 6: GitHub & Version Control', 
        'video', 
        'Repo, commit, branch, pull request ở mức non-tech cần hiểu. Issue -> change -> review -> commit -> deploy. AI review code/change. Rollback mindset. Repo hygiene: README, env example, folder structure, issue template, changelog đơn giản.', 
        'https://drive.google.com/file/d/buoi-6-github-versioning', 
        7, 
        '2026-07-19', 
        'Dùng GitHub như hệ thống kiểm soát thay đổi, không chỉ là nơi lưu code.', 
        false
    ),
    (
        lesson_b7_id, 
        mod_vc_backend_id, 
        'Buổi 7: Backend Decision Layer', 
        'video', 
        'Data layer trong app/product. Khi nào dùng Google Sheets, Firebase, Supabase, backend/API custom, hoặc chưa cần backend thật. So sánh theo độ dễ bắt đầu, realtime, auth, permission, SQL/noSQL, cost/free tier, scale, lock-in, AI/agent friendliness. Schema, CRUD, auth, permission/RLS ở mức non-tech cần hiểu.', 
        'https://drive.google.com/file/d/buoi-7-backend-layers', 
        8, 
        '2026-07-22', 
        'Giúp học viên biết chọn Google Sheets, Firebase, Supabase, hay backend thật theo nhu cầu sản phẩm.', 
        false
    );

    -- Phần 4
    INSERT INTO lessons (id, module_id, title, type, content, video_url, order_index, start_date, target, has_materials) VALUES 
    (
        lesson_b8_id, 
        mod_deploy_auto_id, 
        'Buổi 8: Deploy & Infra Landscape', 
        'video', 
        'Vercel: managed app hosting. Cloudflare: DNS/CDN/security/Pages/Workers/Tunnel. VPS: thuê server riêng, linh hoạt hơn nhưng phải tự chịu trách nhiệm. Docker: đóng gói app/service để chạy ổn định giữa môi trường khác nhau. SSH, env vars, secrets, domain, logs, local vs production. Khi nào không nên tự host.', 
        'https://drive.google.com/file/d/buoi-8-deploy-infra', 
        9, 
        '2026-07-26', 
        'Cho học viên hiểu bản đồ deploy/infra: Vercel, Cloudflare, VPS, Docker khác nhau ra sao và nên chọn gì.', 
        false
    ),
    (
        lesson_b9_id, 
        mod_deploy_auto_id, 
        'Buổi 9: Automation with n8n', 
        'video', 
        'Automation layer là gì. n8n cho form -> sheet/database -> notification; app data -> report; file upload -> OCR/summary; feedback -> action list; daily/weekly digest. Local n8n vs cloud/self-host/server n8n. Webhook, trigger, credential, node, workflow. Khi nào dùng n8n, khi nào dùng code/API/script.', 
        'https://drive.google.com/file/d/buoi-9-n8n-automation', 
        10, 
        '2026-07-29', 
        'Dùng automation để nối các mảnh sản phẩm/workspace và giảm việc lặp.', 
        false
    );

    -- 7. TẠO ASSIGNMENTS (BÀI TẬP)
    INSERT INTO assignments (id, lesson_id, description, rubric_checklist, scaffolding) VALUES 
    (
        uuid_generate_v4(), 
        lesson_b1_id, 
        'Hoàn thành bảng MVP-to-Scale Gap Checklist cho dự án cá nhân bạn chọn để theo suốt khóa học.', 
        '[{"item": "Xác định rõ ràng 3 rủi ro kỹ thuật chính của dự án", "checked": false}, {"item": "Đưa ra checklist chuẩn bị scale từ MVP thô ban đầu", "checked": false}]'::jsonb,
        '{"template_url": "https://docs.google.com/spreadsheets/d/1nrOIqOfdtw83xzOYyRvEg1LETUd1h25fO57ZqL79Ji0/edit"}'::jsonb
    ),
    (
        uuid_generate_v4(), 
        lesson_b2_id, 
        'Viết tài liệu PRD v2 và phác thảo 4 luồng dữ liệu/vận hành (User Flow, Business Flow, System Flow, Data Flow) cho main use case của dự án.', 
        '[{"item": "PRD v2 bao gồm đầy đủ Problem, User, Goal, Success Criteria, User Stories", "checked": false}, {"item": "Vẽ đủ và đúng 4 flow kỹ thuật bằng Mermaid hoặc công cụ tương đương", "checked": false}]'::jsonb,
        '{"reference_link": "https://the1ight.notion.site/PRD-Template-Vibe-Coding-101"}'::jsonb
    ),
    (
        uuid_generate_v4(), 
        lesson_b3_id, 
        'Thêm hoặc sửa một feature nhỏ trong project của bạn bằng quy trình IDE/CLI workflow; ghi lại câu lệnh/prompt và phần diff chính.', 
        '[{"item": "Sử dụng thành công IDE hoặc CLI (Cursor, Claude Code, Antigravity...) để thay đổi code", "checked": false}, {"item": "Ghi lại chi tiết prompt giao việc cho agent và tóm tắt cách review/chạy thử code", "checked": false}, {"item": "Chụp hình hoặc copy phần code diff chính sau khi thay đổi", "checked": false}]'::jsonb,
        '{}'::jsonb
    ),
    (
        uuid_generate_v4(), 
        lesson_b4_id, 
        'Sử dụng ít nhất 1 skill (như brainstorm, sharpen problem, MVP scoping, PRD review, QA app) để cải thiện tài liệu PRD hoặc ứng dụng của bạn và nộp kết quả before/after.', 
        '[{"item": "Chọn được ít nhất 1 skill phù hợp để cải thiện sản phẩm", "checked": false}, {"item": "Nêu rõ sự khác biệt hoặc cải tiến cụ thể giữa trước và sau khi dùng skill (Before vs After)", "checked": false}]'::jsonb,
        '{}'::jsonb
    ),
    (
        uuid_generate_v4(), 
        lesson_b5_id, 
        'Chọn 1 MCP/MCP-like workflow (ví dụ browser testing, DB context, GitHub repo context) để audit/test hoặc hỗ trợ xây dựng một tính năng trong project của bạn.', 
        '[{"item": "Xác định đúng use case cần dùng MCP và cấu hình thành công công cụ bổ trợ", "checked": false}, {"item": "Mô tả chi tiết kết quả audit/test hoặc dữ liệu thu thập được thông qua MCP", "checked": false}]'::jsonb,
        '{}'::jsonb
    ),
    (
        uuid_generate_v4(), 
        lesson_b6_id, 
        'Thực hiện thay đổi trong dự án và theo dõi quy trình quản lý: tạo Issue -> tạo Branch -> tạo Pull Request/Commit -> Merge. Đảm bảo kho lưu trữ (Repo) có tài liệu README hoặc Project Notes tối thiểu.', 
        '[{"item": "Tạo Issue mô tả tính năng/bug và liên kết với branch/PR tương ứng", "checked": false}, {"item": "Thực hiện commit và push thay đổi lên GitHub theo đúng chuẩn đặt tên", "checked": false}, {"item": "Repo GitHub có tài liệu README.md hoặc Project Notes cơ bản hướng dẫn chạy local", "checked": false}]'::jsonb,
        '{}'::jsonb
    ),
    (
        uuid_generate_v4(), 
        lesson_b7_id, 
        'Lập bảng phân tích quyết định Backend (Backend Decision Matrix) và phác thảo mô hình dữ liệu (Data model/schema draft) cho các luồng chính của dự án.', 
        '[{"item": "Có bảng so sánh trade-off giữa các phương án Backend (Sheets, Firebase, Supabase, API custom...)", "checked": false}, {"item": "Thiết kế cấu trúc bảng (schema) với đầy đủ trường dữ liệu, kiểu dữ liệu và mối quan hệ giữa các bảng cho tính năng chính", "checked": false}]'::jsonb,
        '{}'::jsonb
    ),
    (
        uuid_generate_v4(), 
        lesson_b8_id, 
        'Xây dựng kế hoạch triển khai (Deployment Plan) cho dự án cá nhân: lựa chọn nền tảng, cấu hình tên miền/DNS qua Cloudflare, quản lý biến môi trường (.env) và liệt kê các rủi ro cần lưu ý.', 
        '[{"item": "Xác định rõ platform deploy (Vercel, Cloudflare Pages, VPS...) phù hợp với tech stack", "checked": false}, {"item": "Liệt kê đầy đủ các biến môi trường (.env) cần cấu hình trên môi trường production", "checked": false}, {"item": "Đưa ra phương án dự phòng (rollback plan) và giám sát logs nếu xảy ra lỗi", "checked": false}]'::jsonb,
        '{}'::jsonb
    ),
    (
        uuid_generate_v4(), 
        lesson_b9_id, 
        'Thiết lập hoặc phác thảo một quy trình tự động hóa (Automation workflow) bằng n8n kết nối các mảnh sản phẩm/workspace để tối ưu hóa quy trình vận hành.', 
        '[{"item": "Xác định rõ Trigger node và các Action nodes trong quy trình", "checked": false}, {"item": "Thiết lập thành công kết nối (Credentials) và truyền nhận dữ liệu giữa các node chính xác", "checked": false}, {"item": "Chạy thử workflow thành công hoặc có bản mô tả luồng tự động hóa chi tiết, logic", "checked": false}]'::jsonb,
        '{}'::jsonb
    );

END $$;
