# LightMS - Functional Requirements (Yêu cầu chức năng)

Dựa trên User Stories và Sitemap đã chốt, dưới đây là chi tiết các Yêu cầu chức năng (Functional Requirements) cho LightMS.

## 1. Phân hệ Học viên (Student Portal)

### 1.1. Bảng điều khiển (Dashboard)

- **FR-STU-01 (Today's Tasks):** Hệ thống phải hiển thị danh sách các công việc/bài học cần hoàn thành trong ngày.
- **FR-STU-02 (Learning Progress):** Hệ thống phải cung cấp thanh tiến độ (Progress Bar) trực quan để học viên biết mình đang ở đâu trong lộ trình.
- **FR-STU-03 (Calendar Sync):** Cung cấp nút "Add to Calendar" để học viên tự động đồng bộ lịch học vào Google Calendar cá nhân.
- **FR-STU-04 (Catch-up Suggestions):** Hệ thống tự động gợi ý các nội dung học viên đã bỏ lỡ và đề xuất lộ trình bắt kịp.

### 1.2. Học tập & Thực hành (My Learning)

- **FR-STU-05 (All-in-one Lessons):** Mỗi bài học phải tích hợp đầy đủ nội dung: Video bài giảng, tài liệu (slide, pdf), yêu cầu bài tập và khu vực nộp bài trên cùng một giao diện.
- **FR-STU-06 (Assignment Submission):** Học viên có thể nộp bài trực tiếp thông qua upload file, gửi link hoặc nhập text.
- **FR-STU-07 (View Feedback):** Học viên có thể xem điểm số và nhận xét chi tiết của Mentor ngay tại khu vực nộp bài.

### 1.3. Phòng thảo luận (Discussion Room)

- **FR-STU-08 (Topic Categories):** Học viên có thể xem và tham gia thảo luận theo các chủ đề (Topics) được phân loại sẵn (VD: Light Support, Assignments).
- **FR-STU-09 (Advanced Filtering):** Cung cấp bộ lọc nâng cao để học viên tìm kiếm bài viết theo Chủ đề, Tag (Assignment), hoặc bài có chứa Tích xanh (Verified).
- **FR-STU-10 (Kudos & Interaction):** Học viên có thể thả Kudos (khen ngợi) và bình luận chéo trên các bài đăng để tăng tính tương tác.
- **FR-STU-17 (Auto Tagging):** Các bài nộp của học viên sẽ tự động được chuyển thành thread và gắn tag tương ứng của Assignment đó.

### 1.4. Cộng đồng & Hỗ trợ (Community & Support)

- **FR-STU-11 (FAQ Knowledge Base):** Cung cấp hệ thống câu hỏi thường gặp (FAQ) để giải đáp nhanh.
- **FR-STU-12 (Live Support Link):** Có nút bấm chuyển hướng trực tiếp đến phòng hỗ trợ Light Support trên Telegram.
- **FR-STU-13 (Wall of Fame):** Hiển thị bảng vinh danh những học viên có thành tích xuất sắc.
- **FR-STU-16 (View Announcements):** Học viên có thể xem danh sách các thông báo từ Ban tổ chức khóa học.

### 1.5. Hồ sơ cá nhân (My Profile)

- **FR-STU-14 (Skill Mastery Tracker):** Hiển thị biểu đồ phân tích mức độ thành thạo các kỹ năng cốt lõi (Outcome-based) thay vì chỉ hiển thị điểm số.
- **FR-STU-15 (Badges & Achievements):** Cấp phát và lưu trữ huy hiệu tự động khi học viên đạt được các mốc thành tựu nhất định.

---

## 2. Phân hệ Admin & Mentor (Admin Portal)

### 2.1. Bảng điều khiển (Admin Dashboard)

- **FR-AD-01 (System Overview):** Cung cấp widget báo cáo tổng quan về số lượng học viên online, số bài tập đang chờ chấm, v.v.
- **FR-AD-02 (Alerts & Interventions):** Hiển thị danh sách học viên có nguy cơ (chậm deadline, điểm thấp, không truy cập hệ thống lâu ngày).

### 2.2. Quản lý Khóa học & Nội dung (Course Builder & Resource)

- **FR-AD-03 (Course Builder):** Admin có thể tạo module, bài học, thiết lập "Onboarding Week".
- **FR-AD-04 (Access Restrictions):** Admin có thể cài đặt điều kiện mở khóa bài học (Ví dụ: Bắt buộc hoàn thành Module 1 mới được mở Module 2).
- **FR-AD-05 (Centralized Resource):** Kho lưu trữ tập trung các tài nguyên học tập để dễ dàng gán vào các bài học khác nhau.
- **FR-AD-13 (Reading/Editing Mode Toggle):** Admin có thể chuyển đổi giữa chế độ xem (Reading Mode) và sửa nhanh (Editing Mode) với **giao diện y hệt Student Mode** cho các mục Giới thiệu, Onboarding, Lộ trình học để dễ dàng điều chỉnh các chi tiết nhỏ.
- **FR-AD-14 (Real-time Course Update Sync):** Nội dung chỉnh sửa từ Admin (khi lưu) được đồng bộ tức thời (Real-time) sang giao diện Học viên.
- **FR-AD-15 (Scheduled Onboarding Unlock):** Thiết lập lịch (ngày/giờ) mở khóa tự động cho từng ngày trong Module Onboarding.
- **FR-AD-16 (Auto-unlock Email Notifications):** Mỗi lần mở khóa một ngày Onboarding theo lịch, hệ thống tự động gửi email thông báo đến địa chỉ email của học viên.

### 2.3. Tự động hóa & Rule Engine (Automations)

- **FR-AD-06 (Event-driven Triggers):** Hệ thống cho phép thiết lập các quy tắc tự động (Ví dụ: Quá deadline -> Gửi cảnh báo Telegram; Điểm thấp -> Gửi email tài liệu hỗ trợ).

### 2.8. Quản lý Lịch học (Calendar)

- **FR-AD-22 (Event Schedule Editing):** Admin có mục Calendar trên Sidebar để quản lý và chỉnh sửa lịch trình khóa học cho các cụm sự kiện (Kick-off, Live Class, Office Hour, Onboarding).
- **FR-AD-07 (Calendar Synchronization):** Quản lý luồng đồng bộ lịch trình của cả khóa học tới học viên.
- **FR-AD-17 (Bulk Schedule Shifting & Holiday Insertion):** Hỗ trợ dời lịch hàng loạt và chèn các tuần nghỉ vào lịch trình, các buổi học sau tự động tịnh tiến.

### 2.4. Quản lý Bài tập & Đánh giá (Assignment Management)

- **FR-AD-08 (SpeedGrader):** Giao diện chấm bài tập trung cho Mentor, tích hợp hiển thị bài làm, Rubric chấm điểm và khung nhập Feedback trên cùng một màn hình.
- **FR-AD-09 (Threads Curation):** Công cụ cho phép Mentor "ghim" hoặc chọn lọc các bài xuất sắc trong khu vực Discussion học tập.

### 2.5. Quản lý Học viên & Báo cáo (Student Management & Analytics)

- **FR-AD-10 (Progress & Mastery Tracking):** Phân tích mức độ đạt chuẩn đầu ra (Mastery Levels) của từng cá nhân.
- **FR-AD-11 (Batch Reports):** Xuất báo cáo tỷ lệ hoàn thành, mức độ tương tác và kết quả tổng kết của cả một Batch.
- **FR-AD-12 (Daily Recognition Bot):** Hệ thống tự động tổng hợp thành tựu trong ngày và bắn thông báo vinh danh lên Bot Telegram.

### 2.6. Quản lý Thông báo (Announcements)

- **FR-AD-18 (Create Announcements & NavItem Sync):** Admin có mục Thông báo để soạn và đăng tin. Mỗi lần viết xong bài, thông báo sẽ được cập nhật hiển thị ngay tại NavItem "Thông báo" của học viên.
- **FR-AD-19 (Email Broadcast):** Admin có button chức năng gửi email thông báo hàng loạt cho toàn bộ học viên đối với bài đăng đó.

### 2.7. Quản lý Thảo luận (Discussion Management)

- **FR-AD-20 (Topic Management):** Admin có quyền tạo mới, chỉnh sửa, hoặc ẩn các chủ đề thảo luận (Topics) để định hướng nội dung của lớp học.
- **FR-AD-21 (Verified Answers):** Admin và Mentor có thể gắn thẻ "Verified" (Tích xanh) cho các bình luận hoặc bài giải xuất sắc để học viên khác dễ tìm kiếm.
