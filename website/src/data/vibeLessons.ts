import type { Lesson } from "../types/database";

export const VIBE_201_LESSONS: Lesson[] = [
  {
    "id": "c786a9e5-1cc5-416c-9cbc-3839869404e3",
    "course_id": "course-vibe-201",
    "title": "Buổi 0: Kick-off Meeting",
    "type": "video",
    "content": "Tìm hiểu về khóa học Vibe Coding 201, giảng viên và văn hóa học tập chủ động. Định vị lộ trình Onboarding.",
    "video_url": "https://daymai.vn/vc/6a51206f8c50bda09b07b0b8",
    "order_index": 1,
    "start_date": "2026-07-18T20:30:00+07:00",
    "target": "Buổi 0: Kick-off Meeting",
    "has_materials": true,
    "slide_url": "https://canva.link/11vxkaq4ogzlvet",
    "study_note_url": "https://docs.google.com/document/d/1FuGpB8Ogwo5FA04M9sDyWd_zu4Clq4dys9WqohjbhZ8/edit?usp=sharing",
    "key_concepts": [],
    "supporting_resources": [],
    "assignment_description": "",
    "assignment_rubric_checklist": []
  },
  {
    "id": "1c69ea64-b83b-4519-a545-5030a8360163",
    "course_id": "course-vibe-201",
    "title": "Buổi 1: AI Codes. Bạn Owns. - Từ idea mơ hồ đến Product Seed",
    "type": "video",
    "content": "Thay đổi căn tính (Identity Shift): Ngừng tự nhủ \"Tôi không biết code\", thay vào đó hãy trở thành Product Builder sở hữu các quyết định chiến lược.\nQuản trị Triple Debt: Nhận diện và ngăn chặn ba loại nợ (Nhận thức, Ý định, Vận hành) phát sinh khi tốc độ xây dựng của AI vượt quá tốc độ suy nghĩ của con người.\nSở hữu Outcome (Kết quả): Chuyển trọng tâm từ việc đếm số lượng tính năng (Feature ship) sang đo lường sự thay đổi hành vi của người dùng (User behavior).\nCấu trúc Product Seed: Một sản phẩm vững chắc cần 5 thành phần kiểm chứng được: Target User, Core Pain, Desired Outcome, Success Signal, và MVP.",
    "video_url": "https://daymai.vn/vc/6a51d590b27fed03b70cba72",
    "order_index": 2,
    "start_date": "2026-07-29T20:30:00+07:00",
    "target": "Buổi 1: AI Codes. Bạn Owns. - Từ idea mơ hồ đến Product Seed",
    "has_materials": true,
    "slide_url": "https://canva.link/lbrdh9zqf1beajt",
    "study_note_url": "https://docs.google.com/document/d/1FuGpB8Ogwo5FA04M9sDyWd_zu4Clq4dys9WqohjbhZ8/edit?usp=sharing'",
    "key_concepts": [
      "Product Seed",
      "Product Hypothesis"
    ],
    "supporting_resources": [
      {
        "url": "https://gemini.google.com/gem/1093w9uY5z5Cj5o28dxDBBXOBOIfRlx-b?usp=sharing",
        "label": "Gems Product Seed Generator"
      },
      {
        "url": "https://drive.google.com/file/d/1Q5odipK3Mn7Z8DV2IurErM3I8cCp796A/view?usp=drive_link",
        "label": "Product Seed Prompting Template"
      },
      {
        "url": "https://padlet.com/dangtuyethong2324/vibe-coding-201-batch-02-z7yk4l9ojhninj1z",
        "label": "Padlet luyện tập trên lớp"
      }
    ],
    "assignment_description": "Nộp Product Seed version 1.0\n\nBước 01: Viết nội dung của Product Seed.\n- Target User: Nghề, tuổi, địa lý, thu nhập, tình huống. (VD: NV VP 25-35, HCMC, 15-30M/tháng, dùng Excel track chi tiêu)\n- Core Pain: Quan sát ở 3+ user thật. (VD: Cuối tháng không nhớ tiền hao ở đâu)\n- Desired Outcome: Thay đổi hành vi quan sát được. (VD: Phát hiện 2-3 khoản hao tiền đủ sớm để điều chỉnh)\n- Success Signal: Đo hành vi, không đo cảm nhận. (VD: Quay lại kiểm tra spending lần 2 không cần nhắc)\n- MVP / Test: 1 AI feature nhỏ nhất để bắt đầu. (VD: 1 form + Claude API: paste 20 giao dịch, trả top 3 khoản chi)\n\nBước 02: Check lại với AI qua 05 cổng kiểm định\n\nBước 03: Đăng nội dung Product Seed của bạn lên Group Facebook của lớp, gắn hastag #BTVN_Ngay1",
    "assignment_rubric_checklist": [
      {
        "item": "User đủ cụ thể: Tuyển được 5 user trong 1 tuần.",
        "checked": false,
        "is_optional": false
      },
      {
        "item": "Pain quan sát được: Nhìn thấy trong hành vi, không chỉ suy đoán.",
        "checked": false,
        "is_optional": false
      },
      {
        "item": "Outcome đối hành vi: User làm khác trước, không phải cảm nhận.",
        "checked": false,
        "is_optional": false
      },
      {
        "item": "Signal check nhanh: Đo được ngay lập tức, không chờ retention/NPS.",
        "checked": false,
        "is_optional": false
      },
      {
        "item": "Validation thật: Action đầu tiên có user THẬT dùng và feedback.",
        "checked": false,
        "is_optional": false
      }
    ]
  },
  {
    "id": "a1ba6fd1-5e99-4b0a-9ac1-3d667d63d96e",
    "course_id": "course-vibe-201",
    "title": "Buổi 2: PRD kỹ thuật & 4 Flow",
    "type": "video",
    "content": "Nội dung trọng tâm của buổi học là sự dịch chuyển tư duy từ việc viết PRD truyền thống dành cho con người (sếp, ban giám đốc) sang viết PRD như một \"bản hợp đồng\" dành riêng cho AI. \nThay vì sa đà vào kể chuyện hay thuyết phục, PRD cho AI cần sự tinh gọn (thường trong 1 trang), cấu trúc chặt chẽ và ngôn ngữ kỹ thuật chính xác để AI có thể thực thi ngay lập tức. \nFramework chủ đạo được giới thiệu là cấu trúc PRD 3 lớp: Why (Tại sao), What (Cái gì), và How (Như thế nào), giúp chuyển hóa một ý tưởng mơ hồ thành một \"Product Seed\" có thể kiểm chứng.\n",
    "video_url": "https://daymai.vn/vc/6a51d5be177b1e1f3c0a961a",
    "order_index": 3,
    "start_date": "2026-08-01T20:30:00+07:00",
    "target": "Buổi 2: PRD kỹ thuật & 4 Flow",
    "has_materials": true,
    "slide_url": "https://canva.link/x3aocmwf1i1hk6y",
    "study_note_url": "https://docs.google.com/document/d/1FuGpB8Ogwo5FA04M9sDyWd_zu4Clq4dys9WqohjbhZ8/edit?usp=sharing'",
    "key_concepts": [
      "Product Requirements Document (PRD)"
    ],
    "supporting_resources": [
      {
        "url": "https://notebook.google.com/notebook/f2632a96-7fb3-4e23-b67d-1040f4451a3e",
        "label": "NotebookLM Vibe Coding 201"
      },
      {
        "url": "https://drive.google.com/file/d/1_8QJAA5qBdGLngHY-3RkYQvjzcg4jHtI/view?usp=sharing",
        "label": "PRD Prompting Template (v3.0)"
      },
      {
        "url": "https://padlet.com/dangtuyethong2324/vibe-coding-201-batch-02-z7yk4l9ojhninj1z",
        "label": "Padlet của lớp (Batch 02)"
      }
    ],
    "assignment_description": "Nộp PRD version 1.0\nBước 01 · Viết nội dung PRD v1.0 · 3 lớp\n\nLớp WHY: Copy 3 items từ Product Seed M1. Nguyên văn.\n\nLớp WHAT: 2-3 User Stories + AC binary + Scope OUT ≥3 items. Áp dụng 5x5 ceiling.\n\nLớp HOW: User Flow + Data Flow. HARDCODE tiếng Việt cho enum values.\n\nSuccess Metrics: Split Primary + Threshold + Timeframe.\n\nBước 02 · Đăng lên Facebook group\n\nPost: PRD v1.0 (3 lớp + HARDCODE + Success Metrics).\n\nHashtag: #BTVN_Ngay2\n\nFormat: markdown paste vào post hoặc screenshot.",
    "assignment_rubric_checklist": [
      {
        "item": "Gate 1 · WHY: Copy nguyên văn 3 items từ Seed, không paraphrase (Pass = 3 dòng khớp Seed items 1-3)",
        "checked": false,
        "is_optional": false
      },
      {
        "item": "Gate 2 · WHAT · Stories: 2-3 stories, không hơn (5x5 ceiling) (Pass = Đúng 3 stories · fit happy path)",
        "checked": false,
        "is_optional": false
      },
      {
        "item": "Gate 3 · WHAT · AC: Mỗi AC binary testable, có endpoint hoặc số (Pass = Không có \"responsive\", \"user-friendly\")",
        "checked": false,
        "is_optional": false
      },
      {
        "item": "Gate 4 · WHAT · Scope OUT: ≥3 items OUT explicit (Pass = Kể được 3 thứ KHÔNG build)",
        "checked": false,
        "is_optional": false
      },
      {
        "item": "Gate 5 · HOW · Flows: User + Data Flow rõ? Business/System có nếu cần (Pass = Ít nhất 2 flows bắt buộc)",
        "checked": false,
        "is_optional": false
      },
      {
        "item": "Gate 6 · HARDCODE: Enum values tiếng Việt ghi cứng (Pass = Không có \"Food & Dining\", \"Bills\" tiếng Anh)",
        "checked": false,
        "is_optional": false
      },
      {
        "item": "Gate 7 · Success Metrics: Success Signal từ Seed Item 4 có trong PRD assembled (Pass = Primary + Threshold + Timeframe · tracked via AC)",
        "checked": false,
        "is_optional": false
      }
    ]
  },
  {
    "id": "9bd3fd2c-ee49-4176-b951-42e70d4f48ff",
    "course_id": "course-vibe-201",
    "title": "Buổi 3: VS Code và Claude Code",
    "type": "video",
    "content": "Sử dụng Visual Studio Code (VS Code) làm môi trường phát triển tích hợp (IDE) và Claude Code làm trợ lý lập trình chính. \n\nHướng dẫn cách thiết lập không gian làm việc, quản lý ngữ cảnh (context) của AI để tránh tình trạng AI \"tự chế biến\" nội dung, và quy trình sử dụng các công cụ bổ trợ như Google AI Studio để hiện thực hóa giao diện người dùng (UI) một cách nhanh chóng.\n",
    "video_url": "https://daymai.vn/vc/6a7064823b8cb7f1c304e8ca",
    "order_index": 4,
    "start_date": "2026-08-05T20:30:00+07:00",
    "target": "Buổi 3: VS Code và Claude Code",
    "has_materials": true,
    "slide_url": "https://canva.link/93c95ekgzh1b55h",
    "study_note_url": "https://docs.google.com/document/d/1FuGpB8Ogwo5FA04M9sDyWd_zu4Clq4dys9WqohjbhZ8/edit?usp=sharing'",
    "key_concepts": [
      "IDE",
      "Extensions",
      "CLI",
      "Terminal"
    ],
    "supporting_resources": [
      {
        "url": "https://notebook.google.com/notebook/f2632a96-7fb3-4e23-b67d-1040f4451a3e",
        "label": "NotebookLM Vibe Coding 201"
      }
    ],
    "assignment_description": "Bước 1 — Tạo MVP với Google AI Studio\n- Lấy PRD: Lấy PRD từ Module 2.\n- Thao tác trên Google AI Studio:\n+ Mở website aistudio.google.com và đăng nhập.\n+ Dán toàn bộ PRD làm mô tả kèm yêu cầu rõ: \"Chỉ dựng bản V0 theo đúng user stories + acceptance criteria; chưa cần đăng nhập/DB\".\n+ Tải lên Google AI Studio để sinh bản đầu tiên.\n- Kiểm tra và tinh chỉnh: Chờ sinh giao diện và preview. Nếu chưa đúng ý, gõ thêm 1-2 câu tinh chỉnh bám sát PRD.\n\nBước 2 — Tải mã nguồn\n- Download code: Tải xuống source code mà AI tạo ra.\n- Thao tác file: Bấm Export/Download để tải file .zip. Giải nén ra thư mục và đặt tên rõ ràng (ví dụ: my-app).\n\nBước 3 — Mở & chạy (VS Code)\n- Import mã nguồn: Mở VS Code, chọn Open Folder và trỏ tới thư mục vừa giải nén.\n- Khởi động: Mở Terminal (dùng phím tắt Ctrl + \\``), gõ lệnh claude` để khởi động.\n- Sử dụng Claude Code: Dùng Claude Code cài dependencies, chạy và đưa câu lệnh: \"Đọc dự án này và chạy nó giúp mình\".\n- Vòng lặp tự sửa: Nếu có lỗi xảy ra, yêu cầu \"Đọc lỗi và sửa để app chạy\". Sau đó, mở địa chỉ local để xem kết quả.\n\nBước 4 — Chia sẻ lên Facebook \n- Chụp lại giao diện ứng dụng đang chạy thực tế trên máy.\n- Đăng bài lên Facebook với hashtag #BTVN_Ngay3 kèm theo hình ảnh đã chụp và bày tỏ cảm nghĩ cá nhân (nêu rõ các điểm thú vị hoặc điểm khó khi làm bài).",
    "assignment_rubric_checklist": [
      {
        "item": "Gate 1 · AI Studio: Lấy PRD từ Module 2, dán vào aistudio.google.com với yêu cầu dựng bản V0 đúng user stories + acceptance criteria, chưa cần đăng nhập/DB và tinh chỉnh bám sát PRD",
        "checked": false,
        "is_optional": false
      },
      {
        "item": "Gate 2 · Download Code: Bấm Export/Download để tải source code dạng file .zip, giải nén và đặt tên thư mục rõ ràng (ví dụ: my-app)",
        "checked": false,
        "is_optional": false
      },
      {
        "item": "Gate 3 · VS Code Setup: Mở thư mục bằng VS Code, mở Terminal (Ctrl + `) và gõ lệnh claude để khởi động",
        "checked": false,
        "is_optional": false
      },
      {
        "item": "Gate 4 · Run Project: Yêu cầu 'Đọc dự án này và chạy nó giúp mình' để cài đặt dependencies và vận hành ứng dụng",
        "checked": false,
        "is_optional": false
      },
      {
        "item": "Gate 5 · Debug & Local Test: Thực hiện vòng lặp tự sửa 'Đọc lỗi và sửa để app chạy' khi có sự cố và kiểm tra thành công trên địa chỉ local",
        "checked": false,
        "is_optional": false
      }
    ]
  },
  {
    "id": "8695373a-7625-4883-8a47-4a73c84cb3df",
    "course_id": "course-vibe-201",
    "title": "Buổi 4: MCP for Product Building",
    "type": "video",
    "content": "Nội dung trọng tâm xoay quanh Model Context Protocol (MCP) – một chuẩn kết nối giúp AI Agent tương tác với các công cụ, dữ liệu và khả năng bên ngoài. \n\nHướng dẫn cách lựa chọn, sử dụng MCP server an toàn\nDemo ứng dụng thực tế thông qua việc chuyển đổi tài liệu yêu cầu sản phẩm (PRD) thành giao diện người dùng (UI) bằng công cụ Google Stitch MCP.\n",
    "video_url": "https://daymai.vn/vc/6a51d5be177b1e1f3c0a961c",
    "order_index": 5,
    "start_date": "2026-08-08T20:30:00+07:00",
    "target": "Buổi 4: MCP for Product Building",
    "has_materials": true,
    "slide_url": "https://canva.link/mwdryrn8yfg3qzw",
    "study_note_url": "https://docs.google.com/document/d/1FuGpB8Ogwo5FA04M9sDyWd_zu4Clq4dys9WqohjbhZ8/edit?usp=sharing'",
    "key_concepts": [
      "Model Context Protocol (MCP)"
    ],
    "supporting_resources": [
      {
        "url": "https://notebook.google.com/notebook/f2632a96-7fb3-4e23-b67d-1040f4451a3e",
        "label": "NotebookLM Vibe Coding 201"
      },
      {
        "url": "https://drive.google.com/file/d/1UaHF8IZPRYrq17SeMv6SX0wwiasAIYzD/view?usp=drive_link",
        "label": "Prompting Package"
      },
      {
        "url": "https://mcpservers.org/category/database",
        "label": "MCP Servers"
      }
    ],
    "assignment_description": "Bước 1: Chuẩn bị tài liệu PRD cá nhân.\nBước 2: Mở VS Code và xác minh kết nối Stitch.\nBước 3: Yêu cầu Stitch tạo phiên bản V0 của giao diện.\nBước 4: So sánh và yêu cầu AI tinh chỉnh (Refine).\nBước 5: Chụp màn hình UI cuối cùng và chia sẻ trên Group Facebook với hashtag BTVN_Ngay4 kèm cảm nhận:\n- MCP thêm capability gì cho Claude?\n- Bạn đã yêu cầu AI sửa điểm gì? Đâu là điểm thú vị/khó khăn nhất?\n",
    "assignment_rubric_checklist": [
      {
        "item": "Tiêu chí 1 · Chuẩn bị PRD: Tài liệu PRD cá nhân đã được chuẩn bị đầy đủ và sẵn sàng để làm đầu vào cho bài tập",
        "checked": false,
        "is_optional": false
      },
      {
        "item": "Tiêu chí 2 · Môi trường VS Code & Stitch: Đã mở VS Code thành công và xác minh chính xác kết nối với Stitch",
        "checked": false,
        "is_optional": false
      },
      {
        "item": "Tiêu chí 3 · Tạo phiên bản V0: Đã đưa yêu cầu cho Stitch để tạo thành công phiên bản V0 của giao diện dựa trên PRD",
        "checked": false,
        "is_optional": false
      },
      {
        "item": "Tiêu chí 4 · So sánh và Tinh chỉnh (Refine): Đã thực hiện so sánh kết quả thực tế với yêu cầu và đưa ra các câu lệnh tinh chỉnh để AI tối ưu giao diện",
        "checked": false,
        "is_optional": false
      },
      {
        "item": "Tiêu chí 5 · Hoàn thiện mã nguồn & Vận hành: Đã kiểm tra tính toàn vẹn của mã nguồn ứng dụng sau quá trình tinh chỉnh và đảm bảo sẵn sàng chạy thử",
        "checked": false,
        "is_optional": false
      }
    ]
  },
  {
    "id": "a10719c6-edf1-4233-9438-f2e95c5b21c7",
    "course_id": "course-vibe-201",
    "title": "Buổi 5: Skills for Product Building",
    "type": "video",
    "content": "Nội dung cốt lõi của buổi học xoay quanh khái niệm Agent Skills, phương pháp đóng gói các chỉ dẫn (prompts) phức tạp thành các kỹ năng chuyên biệt để AI có thể thực thi một cách nhất quán và hiệu quả",
    "video_url": "https://daymai.vn/vc/6a7064823b8cb7f1c304e8ce",
    "order_index": 6,
    "start_date": "2026-08-19T20:30:00+07:00",
    "target": "Buổi 5: Skills for Product Building",
    "has_materials": true,
    "slide_url": "https://canva.link/ghuuev3h88zg4gi",
    "study_note_url": "https://docs.google.com/document/d/1FuGpB8Ogwo5FA04M9sDyWd_zu4Clq4dys9WqohjbhZ8/edit?tab=t.fazaa9q6hsvc",
    "key_concepts": [
      "Agent Skills"
    ],
    "supporting_resources": [
      {
        "url": "https://notebook.google.com/notebook/f2632a96-7fb3-4e23-b67d-1040f4451a3e",
        "label": "NotebookLM Vibe Coding 201"
      },
      {
        "url": "https://github.com/anthropics/skills/tree/main/skills",
        "label": "Skills Repo của Anthropic"
      },
      {
        "url": "https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md",
        "label": "Skills Creator"
      },
      {
        "url": "github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md",
        "label": "Frontend Designing Skils"
      }
    ],
    "assignment_description": "Thêm và sử dụng Anthropic frontend-design Skill\n- Bước 01: Chọn 1 trang (page) trong ứng dụng hiện tại của bạn\n- Bước 02: Yêu cầu Claude cải thiện giao diện của trang đó bằng cách sử dụng Skill này\n- Bước 03: Chạy lại ứng dụng để kiểm tra kết quả thay đổi\n- Bước 04: Nộp bài (Submit) gồm 3 phần trên Facebook Group và gắn hastag #BTVN_Ngay5\n+ Screenshot Before: Ảnh chụp màn hình giao diện trước khi cải thiện\n+ Screenshot After: Ảnh chụp màn hình giao diện sau khi Claude đã tối ưu hóa\n+ Reflection: Viết một đoạn chia sẻ ngắn về việc Skill này đã thay đổi cách Claude tư duy và thực hiện thiết kế như thế nào",
    "assignment_rubric_checklist": [
      {
        "item": "Tính thẩm mỹ & Tính chuyên nghiệp: Trang ứng dụng sau khi sửa (After) phải có sự nâng cấp trực quan rõ rệt so với trước (Before) về mặt phối màu (Color), phân cấp kiểu chữ (Typography) và khoảng cách (Spacing/Padding)",
        "checked": false,
        "is_optional": false
      },
      {
        "item": "Bố cục có chủ đích: Giao diện mới phải giúp người dùng dễ dàng thao tác hơn, các thành phần quan trọng (như nút kêu gọi hành động, thông tin cốt lõi) được làm nổi bật và đặt ở vị trí hợp lý hơn",
        "checked": false,
        "is_optional": false
      },
      {
        "item": "Không lỗi giao diện: Code do Claude tối ưu hóa bằng Skill hoạt động trơn tru, không làm vỡ bố cục, không bị chồng chéo phần tử.",
        "checked": false,
        "is_optional": false
      },
      {
        "item": "Bảo toàn tính năng: Việc nâng cấp giao diện không làm ảnh hưởng hay phá hỏng các logic chức năng vốn có của trang.",
        "checked": false,
        "is_optional": false
      },
      {
        "item": "Chỉ rõ sự thay đổi trong tư duy của AI: Thay vì chỉ nhận xét chung chung là \"Claude làm nhanh và đẹp hơn\", bạn cần chỉ ra điểm khác biệt cốt lõi (ví dụ: Claude đã biết đặt câu hỏi để làm rõ đối tượng sử dụng, hoặc tự phân tích cấu trúc layout trước khi viết code thay vì lao vào code ngay như trước)",
        "checked": false,
        "is_optional": false
      }
    ]
  },
  {
    "id": "34a95f25-be91-4627-943f-2e9ccdb1c747",
    "course_id": "course-vibe-201",
    "title": "Buổi 6: Backend và Database",
    "type": "video",
    "content": "Nội dung chính xoay quanh việc giải mã cấu trúc Backend trong framework Nextjs, vai trò của Prisma như một lớp \"phiên dịch\" dữ liệu và sự tiện lợi của SQLite – một cơ sở dữ liệu dạng file nhẹ nhàng, phù hợp cho Vibe Coding. \n",
    "video_url": "https://daymai.vn/vc/6a87eff48b5d870a650770e6",
    "order_index": 7,
    "start_date": "2026-08-22T20:30:00+07:00",
    "target": "Buổi 6: Backend và Database",
    "has_materials": true,
    "slide_url": "https://canva.link/kkzr2gcf2gx3kun",
    "study_note_url": "https://docs.google.com/document/d/1FuGpB8Ogwo5FA04M9sDyWd_zu4Clq4dys9WqohjbhZ8/edit?tab=t.fazaa9q6hsvc#heading=h.4w0s3r7beozs",
    "key_concepts": [
      "Backend",
      "Tech Stack",
      "Database",
      "CRUD"
    ],
    "supporting_resources": [
      {
        "url": "https://notebook.google.com/notebook/f2632a96-7fb3-4e23-b67d-1040f4451a3e",
        "label": "NotebookLM Vibe Coding 201"
      }
    ],
    "assignment_description": "Biến một feature thành persistent feature\n\nBước 01: Chọn 1 entity trong app hiện tại để setup backend. Cần có 03 tool layers (Next.js, Prisma, SQLite) và 04 thao tác của CRUD.\n\nBước 02: Nộp bài trên Group Facebook của lớp với hashtag #BTVN_Ngay6 gồm:\n- Screenshot application.\n- Screenshot dữ liệu sau khi refresh.\n- 3–5 dòng mô tả về cách làm bài của bạn, và cảm nhận sau khi set-up xong.",
    "assignment_rubric_checklist": [
      {
        "item": "Một feature nhỏ nhưng có persistence thật quan trọng hơn một app lớn nhưng chỉ dùng mock data.",
        "checked": false,
        "is_optional": false
      }
    ]
  },
  {
    "id": "352d4c69-bafd-4dbf-b234-abad86c07ad8",
    "course_id": "course-vibe-201",
    "title": "Buổi 7: GitHub Version Control",
    "type": "video",
    "content": "Buổi học nhấn mạnh vào tư duy Atomic Commit (commit nguyên tử) và việc sử dụng MCP (Model Context Protocol) để kết nối trực tiếp AI với kho lưu trữ mã nguồn (Repository). Mục tiêu cuối cùng là xây dựng một quy trình code nhanh nhưng đảm bảo an toàn tuyệt đối và có khả năng phục hồi cao.",
    "video_url": "https://daymai.vn/vc/6a87eff58b5d870a650770ea",
    "order_index": 8,
    "start_date": "2026-08-26T20:30:00+07:00",
    "target": "Buổi 7: GitHub Version Control",
    "has_materials": true,
    "slide_url": "https://canva.link/qlbeup2gv6dvfzj",
    "study_note_url": "https://docs.google.com/document/d/1FuGpB8Ogwo5FA04M9sDyWd_zu4Clq4dys9WqohjbhZ8/edit?tab=t.y5dtpon2s54i",
    "key_concepts": [
      "GitHub"
    ],
    "supporting_resources": [
      {
        "url": "https://drive.google.com/file/d/1BfOhtGD1uLwPY7lJjS9xPpGGL0MdzqV_/view?usp=drive_link",
        "label": "GitHub Vibe Skills Setup"
      },
      {
        "url": "https://drive.google.com/file/d/17P1sM-F4JWa64LSi8xXMOqQWCnsxagQO/view?usp=drive_link",
        "label": "GitHub Pat Setup"
      },
      {
        "url": "https://notebook.google.com/notebook/f2632a96-7fb3-4e23-b67d-1040f4451a3e",
        "label": "NotebookLM Vibe Coding 201"
      }
    ],
    "assignment_description": "1. Push Code: Đẩy code lên GitHub cá nhân của bạn.\n\n2. Chụp ảnh file Skill /vibe-git mà bạn vừa tạo bằng AI và đăng lên Group Facebook của lớp với hashtag #BTVN_Ngay7\n\n3. Chia sẻ điều tâm đắc nhất bạn học được hôm nay (ví dụ: \"Git Rebase không đáng sợ như mình nghĩ\").",
    "assignment_rubric_checklist": [
      {
        "item": "Push Code thành công: Đẩy được code lên repository GitHub cá nhân (có link repo hoặc ảnh commit).",
        "checked": false,
        "is_optional": false
      },
      {
        "item": "Tạo Skill bằng AI: Có ảnh chụp màn hình rõ nét file Skill `/vibe-git` đã cấu hình.",
        "checked": false,
        "is_optional": false
      },
      {
        "item": "Chia sẻ lên Community: Đăng bài vào Group Facebook kèm ảnh chiến tích và ít nhất 1 bài học tâm đắc.",
        "checked": false,
        "is_optional": false
      }
    ]
  },
  {
    "id": "f7fa3d41-a0ef-4b39-8a3c-09457425963d",
    "course_id": "course-vibe-201",
    "title": "Buổi 8: Deploy & Infra Landscape",
    "type": "video",
    "content": "Nội dung cốt lõi xoay quanh việc thiết lập hạ tầng với VPS (Virtual Private Server) để đảm bảo tính ổn định 24/7 và sử dụng Docker để đóng gói ứng dụng, loại bỏ sự khác biệt giữa các môi trường hệ điều hành.\n",
    "video_url": "https://daymai.vn/vc/6a777de4608e6d6c460f1fe1",
    "order_index": 9,
    "start_date": "2026-08-29T20:30:00+07:00",
    "target": "Buổi 8: Deploy & Infra Landscape",
    "has_materials": true,
    "slide_url": "https://canva.link/0g2aqsisdk9tnci",
    "study_note_url": "https://docs.google.com/document/d/1FuGpB8Ogwo5FA04M9sDyWd_zu4Clq4dys9WqohjbhZ8/edit?tab=t.o3ujsiz2xdmi",
    "key_concepts": [
      "VPS",
      "Docker",
      "Production Process"
    ],
    "supporting_resources": [
      {
        "url": "https://drive.google.com/file/d/1TKiY3D0XqPj34W5dGXsanDCXEBUoPH3K/view?usp=drive_link",
        "label": "Hướng dẫn_ setup VPS và host app Next.js"
      },
      {
        "url": "https://drive.google.com/file/d/1J7fPUjWcu7m8Yx-hXXyibmxAgKEMhA0h/view?usp=drive_link",
        "label": "SSH Key Setup Guide - Tạo key SSH"
      },
      {
        "url": "https://notebook.google.com/notebook/f2632a96-7fb3-4e23-b67d-1040f4451a3e",
        "label": "NotebookLM Vibe Coding 201"
      }
    ],
    "assignment_description": "Bước 1: Chuẩn bị và Deploy ứng dụng\n- Triển khai ứng dụng Next.js sử dụng Docker Compose trên VPS.\n\nBước 2: Cấu hình mạng và bảo mật\n- Gán subdomain cho ứng dụng và kích hoạt chứng chỉ HTTPS.\n\nBước 3: Kiểm tra tính bền vững của dữ liệu (Persistence)\n- Tạo dữ liệu thử nghiệm (data test).\n- Thực hiện restart hoặc recreate container.\n- Kiểm tra và xác nhận dữ liệu vẫn được bảo toàn nguyên vẹn.\n\nBước 4: Sao lưu và Phục hồi (Backup & Recovery)\n- Tạo bản backup (sao lưu) của hệ thống/dữ liệu.\n- Tiến hành restore (khôi phục) vào môi trường test và kiểm chứng hoạt động.\n\nBước 5: Hoàn thiện và Nộp bài\n- Lưu ý quan trọng: Tuyệt đối không để lộ hoặc nộp API keys, passwords, secrets trong mã nguồn hay ảnh chụp màn hình.\n- Đăng bài tập lên group Facebook của lớp kèm theo hashtag: #BTVN_Ngay8.",
    "assignment_rubric_checklist": [
      {
        "item": "Architecture: Nộp sơ đồ kiến trúc thể hiện rõ luồng: Domain → VPS → Proxy → App → DB.",
        "checked": false,
        "is_optional": false
      },
      {
        "item": "Deployment: Cung cấp ảnh chụp màn hình hoặc đoạn logs chứng minh các container đang chạy ổn định.",
        "checked": false,
        "is_optional": false
      },
      {
        "item": "Persistence: Cung cấp minh chứng cho thấy dữ liệu vẫn còn đầy đủ sau khi thay thế/tạo lại container.",
        "checked": false,
        "is_optional": false
      },
      {
        "item": "Recovery: Cung cấp bằng chứng thực tế cho thấy quá trình restore dữ liệu/hệ thống đã thành công.",
        "checked": false,
        "is_optional": false
      },
      {
        "item": "Người khác có thể truy cập thành công vào ứng dụng qua tên miền.",
        "checked": false,
        "is_optional": false
      },
      {
        "item": "Bạn có khả năng khôi phục lại hệ thống khi xảy ra sự cố.",
        "checked": false,
        "is_optional": false
      }
    ]
  },
  {
    "id": "6acc4c45-e51a-4fdf-a1ca-25847522bdd8",
    "course_id": "course-vibe-201",
    "title": "Buổi 9: Automation with n8n",
    "type": "video",
    "content": "Buổi học tập trung vào vai trò của N8N trong hệ sinh thái phát triển sản phẩm - một nền tảng low-code mạnh mẽ, giúp kết nối các ứng dụng và tự động hóa các tác vụ nghiệp vụ mà không cần viết quá nhiều mã nguồn. \n\nNội dung bao gồm từ khái niệm cơ bản (Node, Trigger, Connection) đến các kỹ thuật nâng cao như xử lý dữ liệu JSON, thiết kế logic rẽ nhánh, và tích hợp AI Agent để tạo ra các \"Agentic Workflow\". \n\nNgoài ra, buổi học cũng nhấn mạnh quy trình tích hợp an toàn giữa ứng dụng (Next.js) và N8N thông qua Webhook và Secret Key.\n",
    "video_url": "https://daymai.vn/vc/6a87eff58b5d870a650770ec",
    "order_index": 10,
    "start_date": "2026-09-05T20:30:00+07:00",
    "target": "Buổi 9: Automation with n8n",
    "has_materials": true,
    "slide_url": "https://canva.link/69nwr7smvzb84pd",
    "study_note_url": "https://docs.google.com/document/d/1FuGpB8Ogwo5FA04M9sDyWd_zu4Clq4dys9WqohjbhZ8/edit?tab=t.mbz9ywgnq5mh",
    "key_concepts": [
      "n8n",
      "Node",
      "Trigger",
      "Connection",
      "Agentic Workflow"
    ],
    "supporting_resources": [
      {
        "url": "https://notebook.google.com/notebook/f2632a96-7fb3-4e23-b67d-1040f4451a3e",
        "label": "NotebookLM Vibe Coding 201"
      }
    ],
    "assignment_description": "Bước 01: Xây dựng Workflow n8n & tích hợp vào ứng dụng.\nBước 02: Kích hoạt từ một sự kiện trong ứng dụng để tạo ra kết quả có thể quan sát được.\n\nGợi ý: Workflow tối thiểu\n\n[ Trigger ] --> [ Bước xử lý dữ liệu ] --> [ Condition ] (nếu tình huống cần phân nhánh) --> [ Action ] (tạo ra kết quả)\n\nBước 03: \n- Chia sẻ màn hình screenshot toàn bộ workflow trên n8n lên Facebook Group của lớp và gắn hashtag #BTVN_Ngay9.\n- Chia sẻ cảm nghĩ của bạn:\n1. Ứng dụng của bạn là gì?\n2. Sự kiện nào kích hoạt workflow?\n3. Workflow tạo ra kết quả gì?",
    "assignment_rubric_checklist": [
      {
        "item": "Trigger & Integration: Đã cấu hình node Trigger nhận đúng sự kiện từ ứng dụng và kiểm tra test call thành công.",
        "checked": false,
        "is_optional": false
      },
      {
        "item": "Data Processing: Đã thiết lập ít nhất một bước chuẩn hóa, lọc hoặc xử lý dữ liệu đầu vào trước khi chuyển tiếp.",
        "checked": false,
        "is_optional": false
      },
      {
        "item": "Conditional Logic: Đã cấu hình node phân nhánh (Condition/If) và kiểm tra dữ liệu hoạt động chính xác ở các nhánh.",
        "checked": false,
        "is_optional": false
      },
      {
        "item": "Action & Output: Node Action thực thi thành công và tạo ra kết quả trực quan quan sát được trên ứng dụng hoặc kênh đích.",
        "checked": false,
        "is_optional": false
      },
      {
        "item": "End-to-End Test: Luồng n8n chạy tự động, thông suốt từ bước kích hoạt trên giao diện đến khi tạo kết quả mà không phát sinh lỗi.",
        "checked": false,
        "is_optional": false
      }
    ]
  },
  {
    "id": "193c4f96-2f66-4140-9e0d-aeb19a2a84bd",
    "course_id": "course-vibe-201",
    "title": "Buổi 10: Demo Personal Operating System",
    "type": "video",
    "content": "Buổi học đặc biệt theo nhu cầu học viên: Demo trực tiếp kiến trúc và cách xây dựng một hệ thống Personal Operating System tích hợp AI, tự động hóa quy trình quản lý thông tin, công việc và tri thức cá nhân.",
    "video_url": "https://daymai.vn/vc/6a87eff58b5d870a650770ee",
    "order_index": 11,
    "start_date": "2026-09-19T20:30:00+07:00",
    "target": "Buổi 10: Demo Personal Operating System",
    "has_materials": true,
    "slide_url": "https://canva.link/eur5elhlxkmdg2s",
    "study_note_url": "https://docs.google.com/document/d/1FuGpB8Ogwo5FA04M9sDyWd_zu4Clq4dys9WqohjbhZ8/edit?tab=t.mrx8spd5gnpj",
    "key_concepts": [
      "Personal Operating System"
    ],
    "supporting_resources": [
      {
        "url": "https://notebook.google.com/notebook/f2632a96-7fb3-4e23-b67d-1040f4451a3e",
        "label": "NotebookLM Vibe Coding 201"
      },
      {
        "url": "https://drive.google.com/file/d/1CndaGAG8pTIQRFGU8EpOxoPz2ti5ixu9/view?usp=drive_link",
        "label": "Hướng dẫn cài Hermes Agent lên VPS của mình"
      }
    ],
    "assignment_description": "",
    "assignment_rubric_checklist": []
  }
];
