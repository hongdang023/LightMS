# LightMS - Functional Requirements (Yêu cầu chức năng)

Dựa trên User Stories và Sitemap đã chốt, dưới đây là chi tiết các Yêu cầu chức năng (Functional Requirements) cho LightMS.

## 1. Phân hệ Học viên (Student Portal)

### 1.1. Bảng điều khiển (Trang chủ)

- **FR-STU-01 (Today's Tasks):** Hệ thống phải hiển thị danh sách các công việc/bài học cần hoàn thành trong ngày.
- **FR-STU-02 (Learning Progress):** Hệ thống phải cung cấp thanh tiến độ (Progress Bar) trực quan để học viên biết mình đang ở đâu trong lộ trình.
- **FR-STU-03 (Calendar Sync):** Cung cấp nút "Add to Calendar" để học viên tự động đồng bộ lịch học vào Google Calendar cá nhân.

### 1.2. Học tập & Thực hành (Lộ trình học)

- **FR-STU-05 (All-in-one Lessons):** Mỗi bài học phải tích hợp đầy đủ nội dung: Video bài giảng, tài liệu (slide, pdf), yêu cầu bài tập và nút điều hướng làm bài, xác nhận hoàn thành trên cùng một giao diện.
- **FR-STU-06 (Assignment Submission):** Học viên đăng bài tập trực tiếp lên Facebook Group của lớp và bấm nút "Hoàn thành bài tập" trên hệ thống để ghi nhận trạng thái hoàn thành.
- **FR-STU-07 (View Feedback):** Học viên có thể xem phản hồi đánh giá của Mentor ngay tại khu vực bài tập.
### 1.3. Cộng đồng & Hỗ trợ (Hỏi đáp & Hỗ trợ)

- **FR-STU-11 (FAQ Knowledge Base):** Cung cấp hệ thống câu hỏi thường gặp (FAQ) để giải đáp nhanh.
- **FR-STU-12 (Live Support Link):** Có nút bấm chuyển hướng trực tiếp đến phòng hỗ trợ Light Support trên Telegram.
- **FR-STU-13 (Wall of Fame):** Hiển thị bảng vinh danh những học viên có thành tích xuất sắc.
- **FR-STU-16 (View Announcements):** Học viên có thể xem danh sách các thông báo từ Ban tổ chức khóa học.

### 1.5. Hồ sơ cá nhân (My Profile)

- **FR-STU-15 (Badges & Achievements):** Cấp phát và lưu trữ huy hiệu tự động khi học viên đạt được các mốc thành tựu nhất định.

---

## 2. Phân hệ Admin & Mentor (Admin Portal)

### 2.1. Bảng điều khiển (Tổng quan hệ thống)

- **FR-AD-01 (System Overview):** Cung cấp widget báo cáo tổng quan về số lượng học viên online, số bài tập đang chờ chấm, v.v.

### 2.2. Quản lý Khóa học & Nội dung (Soạn lộ trình)

- **FR-AD-03 (Course Builder):** Admin có thể tạo module, bài học, thiết lập "Onboarding Week".
- **FR-AD-04 (Access Restrictions):** Admin có thể cài đặt điều kiện mở khóa bài học (Ví dụ: Bắt buộc hoàn thành Module 1 mới được mở Module 2).
- **FR-AD-05 (Centralized Resource):** Kho lưu trữ tập trung các tài nguyên học tập để dễ dàng gán vào các bài học khác nhau.
- **FR-AD-13 (Reading/Editing Mode Toggle):** Admin có thể chuyển đổi giữa chế độ xem (Reading Mode) và sửa nhanh (Editing Mode) với **giao diện y hệt Student Mode** cho các mục Giới thiệu, Onboarding, Lộ trình học để dễ dàng điều chỉnh các chi tiết nhỏ.
- **FR-AD-14 (Real-time Course Update Sync):** Nội dung chỉnh sửa từ Admin (khi lưu) được đồng bộ tức thời (Real-time) sang giao diện Học viên.
- **FR-AD-15 (Scheduled Onboarding Unlock):** Thiết lập lịch (ngày/giờ) mở khóa tự động cho từng ngày trong Module Onboarding.
- **FR-AD-16 (Auto-unlock Email Notifications):** Mỗi lần mở khóa một ngày Onboarding theo lịch, hệ thống tự động gửi email thông báo đến địa chỉ email của học viên.

### 2.3. Quản lý Lịch học

- **FR-AD-22 (Event Schedule Editing):** Admin có mục Lịch học trên Sidebar để quản lý và chỉnh sửa lịch trình khóa học cho các cụm sự kiện (Kick-off, Live Class, Office Hour, Onboarding).
- **FR-AD-07 (Calendar Synchronization):** Quản lý luồng đồng bộ lịch trình của cả khóa học tới học viên.
- **FR-AD-17 (Bulk Schedule Shifting & Holiday Insertion):** Hỗ trợ dời lịch hàng loạt và chèn các tuần nghỉ vào lịch trình, các buổi học sau tự động tịnh tiến.

### 2.4. Quản lý Bài tập & Đánh giá (Chấm bài tập)

- **FR-AD-09 (Threads Curation):** Công cụ cho phép Mentor "ghim" hoặc chọn lọc các bài nộp xuất sắc làm mẫu cho lớp học.

### 2.5. Quản lý Học viên & Báo cáo (Quản lý học viên)

- **FR-AD-10 (Progress & Mastery Tracking):** Phân tích mức độ đạt chuẩn đầu ra (Mastery Levels) của từng cá nhân.
- **FR-AD-11 (Batch Reports):** Xuất báo cáo tỷ lệ hoàn thành, mức độ tương tác và kết quả tổng kết của cả một Batch.
- **FR-AD-02 (Alerts & Interventions):** Hiển thị danh sách học viên có nguy cơ (chậm deadline, điểm thấp, không truy cập hệ thống lâu ngày) thông qua tab lọc "Cần hỗ trợ" trên màn hình Quản lý học viên.
- **FR-AD-23 (Student Group Bulk Email):** Cho phép Admin soạn thảo theo mẫu và gửi email hàng loạt tới các nhóm đối tượng học viên (Tất cả, Cần hỗ trợ, Xuất sắc).

### 2.6. Quản lý Thông báo

- **FR-AD-18 (Create Announcements & NavItem Sync):** Admin có mục Thông báo để soạn và đăng tin. Mỗi lần viết xong bài, thông báo sẽ được cập nhật hiển thị ngay tại NavItem "Thông báo" của học viên.
- **FR-AD-19 (Email Broadcast):** Admin có button chức năng gửi email thông báo hàng loạt cho toàn bộ học viên đối với bài đăng đó.

---

## 3. Yêu cầu Giao diện Di động (Mobile Responsive UI)

- **FR-SYS-01 (Responsive Navigation Drawer):** Thanh Sidebar điều hướng phải tự động chuyển thành Drawer ẩn trên thiết bị di động (màn hình < 768px), cho phép đóng mở qua nút Hamburger trên Header hoặc chạm vùng ngoài (backdrop).
- **FR-SYS-02 (Adaptive Screen Layouts):** Giao diện của tất cả các trang (Dashboard, Lộ trình học, Hỏi đáp, Bảng vinh danh, Hồ sơ cá nhân) phải tự động chuyển sang bố cục một cột (Single-column layout) và căn lề tương thích với màn hình hẹp.
- **FR-SYS-03 (Touch Target Optimization):** Các nút tương tác, đường liên kết, và các thẻ tab lựa chọn trên di động phải có kích thước vùng chạm tối thiểu 44x44px để dễ dàng tương tác bằng ngón tay.
