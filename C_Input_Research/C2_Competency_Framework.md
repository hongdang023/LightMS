Dưới đây là **Khung năng lực (Competency Framework)** gồm đúng 05 trụ cột quan trọng nhất của khóa học Vibe Coding 101, được thiết kế theo thang đo **Dreyfus 5 cấp độ** (từ Novice đến Expert).

### 1. Năng lực Đặc tả Vấn đề & PRD (Problem Statement & PRD)

_Tập trung vào khả năng đào sâu nguyên nhân gốc rễ (Root Cause) và sử dụng (PRD) để giao việc cho AI._

- **1. Novice:** Nhảy thẳng vào chốt hạ giải pháp (Convergent quá sớm). Viết yêu cầu mơ hồ bằng các câu lệnh cộc lốc (1-shot prompt).
- **2. Advanced Beginner:** Áp dụng 5W1H và 5 Whys nhưng còn cứng nhắc. Viết được PRD nhưng MVP vẫn ôm đồm quá nhiều tính năng, chưa biết cách "scoping" nhỏ lại.
- **3. Competent (Mục tiêu khóa học):** Áp dụng nhuần nhuyễn công thức Problem Statement: _"[User] needs to [User's need] because [insights]"_. Dùng 5 Whys tìm ra đúng vấn đề gốc rễ. Viết PRD 5 phần tinh gọn (nhỏ nhất đủ để test) và đánh giá rõ 4 rủi ro (Value, Feasibility, Usability, Viability) trước khi làm.
- **4. Proficient (Người thông thạo):** Có khả năng tự phân tách Use Case thành các User Story sắc bén. Biến PRD thành ngôn ngữ cực chuẩn để máy hiểu nhanh gấp nhiều lần người.
- **5. Expert (Chuyên gia):** Trực giác nhạy bén, tự nhìn ra cơ hội thị trường. Biết khi nào cần làm Feature Delivery, khi nào cần Redefine MVP hoặc Growth Strategy.

### 2. Năng lực Thiết kế Hành trình & Aha Moment (UX & Aha Moment)

_Đánh giá khả năng "dắt khéo" người dùng đi từ nỗi đau đến khoảnh khắc nhận ra giá trị (Aha) một cách tự nhiên nhất._

- **1. Novice:** Thiết kế "Dắt lộ liễu" bằng các popup ép đăng ký, dark pattern, khiến user cảm thấy bị lừa và bỏ đi.
- **2. Advanced Beginner:** Hiểu khái niệm Aha Moment nhưng luồng User Flow còn dài, chứa nhiều "bước thừa" trước khi user nhận được giá trị.
- **3. Competent:** Thiết kế theo chuỗi thu hẹp: _Journey → Story → Flow → Aha_. Rút ngắn được luồng User Flow để dẫn dắt user đạt được 3 cấp độ Aha: "Ồ hiểu mình" -> "Ồ làm được thật" -> "Ồ không muốn quay lại cách cũ".
- **4. Proficient:** Nắm bắt trọn vẹn Customer Journey (CX bao trùm UX) từ trước khi dùng app đến khi giới thiệu bạn bè (Adoption).
- **5. Expert:** Tạo ra các điểm chạm mượt mà dẫn đến thói quen dùng lặp lại, hình thành vòng lặp Viral Loop hoặc Retention tự nhiên.

### 3. Năng lực Kiểm chứng Tinh gọn (Lean Validation & Build-Measure-Learn)

_Đo lường tư duy "Hoàn thiện quan trọng hơn hoàn hảo" và dũng cảm đi tìm sự thật từ người dùng thông qua The Mom Test._

- **1. Novice:** Sợ test, tự làm tự ngắm hoặc làm theo tư duy Waterfall (lên kế hoạch 6 tháng mới ra mắt rồi phát hiện sai hướng).
- **2. Advanced Beginner:** Có mang sản phẩm đi test nhưng chỉ đi tìm "sự đồng thuận" hoặc lời khen thay vì sự thật.
- **3. Competent:** Áp dụng vòng lặp Lean Startup siêu tốc: Build - Measure - Learn. Thực hành xuất sắc Usability Test với tư cách là người điều phối (Facilitator) khách quan, rạch ròi giữa Sự thật, Niềm tin và Sự đồng thuận.
- **4. Proficient:** Vận hành mượt mà quy trình Dual track Agile (vừa Discovery khám phá vấn đề, vừa Delivery thực thi giải pháp). Dám thay đổi toàn bộ mô hình (Pivot) nếu giả định sai.
- **5. Expert:** Hoàn thiện Lean Model Canvas và nắm vững Mô hình 3M (Market, Message, Medium). Ra quyết định 100% dựa trên dữ liệu thực tế thay vì hàng ngàn giả thiết trong đầu.

### 4. Năng lực Giao tiếp & Phối hợp AI (Vibe Coding & AI Agent)

_Năng lực dùng AI như một đồng đội (Agent), làm chủ IDE và thiết lập hệ thống tự động hóa._

- **1. Novice:** Nhắm mắt "Accept All" mọi code AI viết mà không đọc Diff, mắc bẫy Dunning-Kruger (không biết output sai vì quá tự tin). Bị giới hạn hoàn toàn trên giao diện Web Chat.
- **2. Advanced Beginner:** Biết dùng CREATE framework để giao vai trò cho AI. Tuy nhiên, chat quá dài trong một luồng khiến AI bị tràn Context Window dẫn đến "lú" hoặc ảo giác.
- **3. Competent:** Coi AI là Đồng đội. Chuyển lên dùng IDE (Antigravity/Cursor) quản lý code. **Luôn tự hỏi 3 câu kiểm tra trước khi chốt:** _"Assumption là gì? Fail ở đâu? Chưa nghĩ tới gì?"_. Quản lý token tốt bằng file `CLAUDE.md` ngắn gọn.
- **4. Proficient:** Biết dùng Terminal và CLI (Claude Code) để quản lý đa tác vụ. Đóng gói thành công các quy trình lặp lại thành "Skills" (Self-trigger, Self-contained, Self-verify) cho AI tự chạy.
- **5. Expert:** Mở khóa "tay chân" cho AI bằng cách cài đặt MCPs (Model Context Protocol) kết nối với database, Linear, Github, hoặc tự viết Scripts tự động hóa (Make/N8N).

### 5. Năng lực Thiết kế UI & Prototyping (UI Design & Prototyping)

_Năng lực xây dựng phiên bản kiểm chứng với tiêu chí "Cân nặng tỉ lệ nghịch với tốc độ học"._

- **1. Novice:** Dành quá nhiều thời gian làm UI pixel-perfect cực đẹp nhưng luồng bị đứt gãy. Nhầm lẫn giữa việc làm "cái đẹp" với làm "cái dùng được".
- **2. Advanced Beginner:** Dùng các tool (v0, Stitch, Figma) để tạo UI tĩnh (UI Only). Tuy nhiên sản phẩm chưa có logic, không thao tác (bấm) thật được.
- **3. Competent:** Tuân thủ nguyên lý Prototype là **"xấu-nhưng-đủ"**. Chuyển mượt mà từ bản UI (Google Stitch) sang Functional UI có logic hoạt động (Google AI Studio/Lovable) dựa vào PRD.
- **4. Proficient:** Xây dựng Full MVP có "ký ức". Biết gen ERD thành SQL và kết nối thành công với Database (Supabase) thực hiện các lệnh CRUD.
- **5. Expert:** Làm chủ System Flow toàn diện (từ L1 - Business Flow đến L3 - System Flow). Đóng gói sản phẩm qua GitHub và deploy mượt mà lên môi trường Live bằng Vercel với đầy đủ bảo mật biến môi trường (.env).
