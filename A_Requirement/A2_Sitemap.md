# The1ight LMS - Sitemap & Official Nav Items

Sitemap này quy định tên chính thức của các thanh điều hướng (Nav Items) hiển thị trên giao diện của Học viên (Student Portal) và Admin/Mentor (Admin Portal). Cấu trúc được tối ưu dựa trên triết lý Outcome-based và thiết kế Zero Friction.

## 1. Phân hệ Học viên (Student Portal)

Danh sách các Nav Items chính thức trên thanh điều hướng bên (Sidebar) - sử dụng bộ icon phẳng 2D Line-art tối giản (duotone Teal/Gold):

- **Trang chủ** (Icon: Compass / La bàn)
  - Daily Tasks: Hiển thị ngay các công việc/bài học cần làm hôm nay. _(US-STU-04)_
  - Learning Progress: Thanh tiến độ tổng quan lộ trình học. _(US-STU-01)_

- **Thông báo** (Icon: Megaphone / Loa truyền tin)
  - Nơi hiển thị các tin mới nhất của lớp. Lúc ấn vào từng thông báo thì sẽ được điều hướng để đọc cả bài.

- **Giới thiệu** (Icon: Logbook / Nhật ký hải trình)
  - Phần thông tin giới thiệu cơ bản về khóa học (Read Me First).

- **Onboarding** (Icon: Set Sail / Cánh buồm khởi hành)
  - Hướng dẫn làm quen hệ thống, lộ trình và phương pháp học trong tuần đầu tiên.

- **Lộ trình học** (Icon: Scroll Map / Bản đồ cuộn)
  - Danh sách các module và bài học cốt lõi. Bên trong mỗi bài học sẽ tích hợp (All-in-one):
    - _Nội dung & Tài liệu:_ Link xem video ngoài, study notes, slide. _(US-STU-03)_
    - _Bài tập (Assignments):_ Yêu cầu bài tập và khu vực nộp bài ngay bên dưới. _(US-STU-02)_
    - _Phản hồi (Feedback):_ Điểm số và nhận xét của Mentor trả trực tiếp vào bài nộp. _(US-STU-02)_

- **Phòng thảo luận** (Icon: Tavern Banner / Lá cờ hội quán)
  - Mỗi lần nộp bài sẽ tự động hiện lên thành các thread chung tại đây. Học viên có thể xem, comment và hỏi đáp trực tiếp vào bài tập của nhau để thảo luận. _(US-STU-08)_

- **Lịch học** (Icon: Astrolabe / Dụng cụ đo tinh tú)
  - Xem tổng quan lịch trình khóa học kèm nút tự động đồng bộ (Add to Calendar) vào lịch cá nhân.

- **Bảng vinh danh** (Icon: Nautical Star / Sao hàng hải 8 cánh)
  - Khu vực ghi nhận kết quả tốt và thành tựu xuất sắc của học viên. _(US-STU-09)_

- **Hỏi đáp & Hỗ trợ** (Icon: Lifebuoy / Phao cứu sinh)
  - Cung cấp danh sách FAQ. Kèm theo button dẫn link trực tiếp vào phòng Light Support trên Telegram. _(US-STU-05)_

- **Profile** (Icon: Captain / Thuyền trưởng) *(Thường nằm góc màn hình ở Avatar)*
  - Thông tin cá nhân.
  - Thành tựu của tôi (My Achievements): Huy hiệu và các cột mốc đã đạt. _(US-STU-06)_

---

## 2. Phân hệ Admin (Admin Portal)

Danh sách các Nav Items chính thức dành cho Ban vận hành và Đội ngũ học thuật:

- **Tổng quan hệ thống** (Icon: Grid Dashboard)
  - **Tổng quan hệ thống:** Hiển thị các hoạt động đang diễn ra cùng lúc để kiểm soát tránh quá tải. _(US-AD-06)_

- **Thông báo** (Icon: Megaphone / Loa truyền tin)
  - Khu vực viết và quản lý các bài thông báo của khóa học. Mỗi lần viết xong sẽ cập nhật ngay tại NavItem "Thông báo" của học viên.
  - Tích hợp button gửi email thông báo cho toàn bộ học viên. _(US-AD-12)_

- **Soạn lộ trình** (Icon: Plan Rules / Thước kẻ)
  - Cấu hình nội dung cho các trang Giới thiệu, Onboarding, Lộ trình học (module/bài học/bài tập). Tích hợp chế độ **Reading Mode / Editing Mode với giao diện y hệt Student Mode** để Admin có thể xem trước và điều chỉnh các chi tiết nhỏ dễ dàng hơn. _(US-AD-13)_
  - Thiết lập lịch (ngày/giờ) mở khoá tự động (Unlock Scheduling) cho từng ngày của Onboarding. Mỗi lần mở khóa sẽ gửi email tự động đến học viên. _(US-AD-15)_
  - Quản lý tài nguyên lưu trữ tập trung. _(US-AD-03)_

- **Lịch học** (Icon: Astrolabe / Dụng cụ đo tinh tú)
  - Chỉnh sửa lịch trình khóa học cho các sự kiện/cụm hoạt động (Kick-off, Live Class, Office Hour, Onboarding). _(US-AD-14)_

- **Chấm bài tập** (Icon: Checkbox Sheet)
  - Nơi Mentor theo dõi tiến độ nộp bài, chấm điểm và đánh giá mức độ Mastery cho từng học viên.

- **Quản lý học viên** (Icon: Crew Silhouette)
  - Quản lý thông tin cá nhân, liên hệ và lịch sử học tập.
  - Theo dõi tiến độ học tập và mức độ đạt chuẩn đầu ra (Mastery Levels) của từng cá nhân.
  - **Risk Alerts (Cảnh báo rủi ro):** Tích hợp bộ lọc riêng "Cần hỗ trợ" (Risk filter) để phát hiện và hiển thị các học viên học chậm, có nguy cơ bỏ học để can thiệp kịp thời. _(US-AD-01)_
  - **Group Bulk Email:** Tích hợp bộ tạo mẫu và gửi email hàng loạt theo nhóm học viên (Tất cả, Cần hỗ trợ, Xuất sắc).

- **Quản lý nhân sự** (Icon: Shield / Cờ hiệu)
  - Phân quyền (Roles) cho hệ thống: Ai được làm Admin toàn quyền, ai làm Mentor (chỉ chấm bài), ai làm Support.
  - Quản lý danh sách nhân sự tham gia vận hành dự án.
