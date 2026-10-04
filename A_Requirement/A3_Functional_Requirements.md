# LightMS - Functional Requirements (Yêu cầu chức năng)

> **Last Updated:** 2026-10-01 | **Status:** ✅ Multi-Course Ecosystem & Access Code Activation Sync

Dựa trên User Stories và Sitemap đã chốt, dưới đây là chi tiết các Yêu cầu chức năng (Functional Requirements) cho LightMS.

---

## 1. Phân hệ Học viên (Student Portal)

### 1.0. Quản lý Khóa học & Mã kích hoạt (Course Hub)

- **FR-STU-18 (Course Catalog & Access Code Activation):**
  - Hệ thống phải hiển thị danh sách tất cả các khóa học trong hệ sinh thái (Vibe Coding 101, Vibe Coding 201, Obsidian 101, Mobile Agents...).
  - Đối với các khóa học/lớp học học viên chưa tham gia, hệ thống phải cung cấp ô/modal nhập **Mã kích hoạt (Access Code)**.
  - Sau khi học viên nhập đúng mã kích hoạt, hệ thống sẽ tự động ghi danh (enroll) học viên vào Batch tương ứng và mở khóa toàn bộ quyền truy cập vào không gian học tập của Batch đó.

### 1.1. Bảng điều khiển (Trang chủ)

- **FR-STU-01 (Today's Tasks):** Hệ thống phải hiển thị danh sách các công việc/bài học cần hoàn thành trong ngày của Batch hiện tại.
- **FR-STU-02 (Learning Progress):** Hệ thống phải cung cấp thanh tiến độ (Progress Bar) trực quan để học viên biết mình đang ở đâu trong lộ trình học.
- **FR-STU-03 (Calendar Sync):** Cung cấp nút "Add to Calendar" để học viên tự động đồng bộ lịch học của Batch vào Google Calendar cá nhân.

### 1.2. Học tập & Thực hành (Lộ trình học)

- **FR-STU-05 (All-in-one Lessons):** Mỗi bài học phải tích hợp đầy đủ nội dung: Video bài giảng, tài liệu (slide, pdf), yêu cầu bài tập và nút điều hướng làm bài, xác nhận hoàn thành trên cùng một giao diện.
- **FR-STU-06 (Assignment Submission):** Học viên đăng bài tập trực tiếp lên Facebook Group của lớp và bấm nút "Hoàn thành bài tập" trên hệ thống để ghi nhận trạng thái hoàn thành.
- **FR-STU-07 (View Feedback):** Học viên có thể xem phản hồi đánh giá của Admin ngay tại khu vực bài tập.

### 1.3. Cộng đồng & Hỗ trợ (Hỏi đáp & Hỗ trợ)

- **FR-STU-11 (FAQ Knowledge Base):** Cung cấp hệ thống câu hỏi thường gặp (FAQ) phân nhóm theo category, có tính năng tìm kiếm nhanh và nội dung chi tiết dạng accordion sections.
- **FR-STU-12 (Live Support Link):** Có nút bấm chuyển hướng trực tiếp đến phòng hỗ trợ Light Support trên Telegram.
- **FR-STU-13 (Wall of Fame):** Hiển thị bảng vinh danh kết hợp Leaderboard (xếp hạng theo Hải lý riêng của Batch) và gạch dưới top 3 nổi bật.
- **FR-STU-17 (Onboarding Profile Form):** Học viên điền form khai báo thông tin cá nhân lần đầu để hoàn thiện Profile và mở khóa Huy hiệu.

---

## 2. Phân hệ Ban vận hành

### 2.1. Cấp Toàn cục

- **FR-AD-01 (Tổng quan hệ thống):** Cung cấp các chỉ số trọng yếu tinh gọn: số học viên đang học, số lớp đang mở.
- **FR-AD-26 (Quản lý Khóa học & Lớp):** Quản trị viên quản lý danh mục khóa học và các lớp. Cho phép mở lớp mới với tính năng sao chép nhanh 1 chạm (kế thừa toàn bộ khung bài học và tài liệu từ lớp trước).
- **FR-AD-27 (Cấp mã kích hoạt):** Hiển thị mã kích hoạt độc quyền của từng lớp với nút sao chép nhanh 1 chạm.

### 2.2. Không gian Lớp học

- **FR-AD-28 (Cô lập dữ liệu lớp học):** Khi chọn một lớp cụ thể, toàn bộ giao diện và dữ liệu (học liệu, lịch học, thành viên, bài nộp) được cô lập hoàn toàn cho lớp đó. Thanh điều hướng có đường dẫn và bộ chọn nhanh để chuyển đổi giữa các lớp.
- **FR-AD-29 (Quản lý liên kết học liệu trực tiếp):** Quản lý học liệu từng buổi theo dạng liên kết trực tiếp (không lưu trữ file): ô nhập đường dẫn video xem lại, bài giảng, ghi chú Notion, trợ lý AI. Hỗ trợ lưu tức thời khi dán liên kết.
- **FR-AD-13 (Chế độ xem thử của học viên):** Quản trị viên có thể kiểm tra trực tiếp giao diện hiển thị và thử nghiệm các đường dẫn tương tự như một học viên trong lớp.
- **FR-AD-22 (Lịch học trực tuyến):** Quản lý lịch các buổi học trực tuyến và đường dẫn phòng học riêng cho từng lớp.
- **FR-AD-30 (Phân công nhân sự):** Chỉ định giảng viên và trợ giảng phụ trách cho lớp học.
- **FR-AD-10 (Theo dõi bài nộp):** Theo dõi bài nộp của học viên trong lớp: kiểm tra liên kết bài đăng trên Facebook Group, ghi nhận trạng thái hoàn thành và gửi phản hồi hỗ trợ.



---

## 3. Yêu cầu Giao diện Di động (Mobile Responsive UI)

- **FR-SYS-01 (Responsive Navigation Drawer):** Thanh Sidebar điều hướng tự động chuyển thành Drawer ẩn trên thiết bị di động (< 768px).
- **FR-SYS-02 (Adaptive Screen Layouts):** Giao diện của tất cả các trang tự động chuyển sang bố cục một cột (Single-column layout).
- **FR-SYS-03 (Touch Target Optimization):** Kích thước vùng chạm tối thiểu 44x44px.
