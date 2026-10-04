# The1ight LMS - Sitemap & Official Nav Items

> **Last Updated:** 2026-10-01 | **Status:** ✅ Multi-Course Ecosystem & Access Code Activation Sync

Sitemap này quy định tên chính thức của các thanh điều hướng (Nav Items) hiển thị trên giao diện của Học viên (Student Portal) và Ban vận hành (Admin Portal). Cấu trúc được tối ưu dựa trên triết lý Outcome-based và thiết kế Zero Friction, hỗ trợ hệ sinh thái Đa khóa học & Đa lớp.

---

## 1. Phân hệ Học viên (Student Portal)

### 1.0. Trang Hub Khóa học & Kích hoạt (Course Hub)
- **Trang chủ Khóa học (Course Catalog / Hub):**
  - Hiển thị danh sách toàn bộ các khóa học trong hệ sinh thái (Vibe Coding 101, Vibe Coding 201, Obsidian 101, Mobile Agents...).
  - Thẻ khóa học hiển thị trạng thái:
    - 🟢 **Đã kích hoạt / Vào lớp**: Chuyển đến không gian học tập của Batch tương ứng.
    - 🔒 **Chưa kích hoạt / Nhập mã**: Nút bấm mở **Modal Nhập Mã Kích Hoạt (Access Code Activation Modal)** để học viên điền mã gia nhập lớp.

---

### 1.1. Không gian Học tập theo Course/Batch (Course Workspace)

Sau khi nhấp "Vào lớp", Sidebar sẽ hiển thị danh mục học tập của Course/Batch đó:

- **Giới thiệu** (Icon: Logbook / Nhật ký hải trình)
  - Phần thông tin giới thiệu cơ bản về khóa học (Read Me First).

- **Dashboard học tập** (Icon: Compass / La bàn)
  - Daily Tasks: Hiển thị ngay các công việc/bài học cần làm hôm nay. _(US-STU-04)_
  - Learning Progress: Thanh tiến độ tổng quan lộ trình học của Batch. _(US-STU-01)_

- **Onboarding** (Icon: Set Sail / Cánh buồm khởi hành)
  - Hướng dẫn làm quen hệ thống, lộ trình và phương pháp học trong tuần đầu tiên.

- **Lộ trình học** (Icon: Scroll Map / Bản đồ cuộn)
  - Danh sách các bài học cốt lõi (dùng chung cho Course).
  - Tích hợp video, tài liệu, đề bài bài tập và nút xác nhận hoàn thành. _(US-STU-02, US-STU-03)_

- **Lịch học** (Icon: Astrolabe / Dụng cụ đo tinh tú)
  - Lịch học riêng của Batch (Kick-off, Live Class, Office Hour) kèm nút đồng bộ Add to Calendar.

- **Bảng vinh danh** (Icon: Nautical Star / Sao hàng hải 8 cánh)
  - Leaderboard xếp hạng Hải lý riêng của Batch + Bộ sưu tập Huy hiệu cá nhân.

- **Hỏi đáp & Hỗ trợ** (Icon: Lifebuoy / Phao cứu sinh)
  - FAQ khóa học & Link trực tiếp nhóm Telegram hỗ trợ.

- **Hồ sơ cá nhân** (Icon: User Circle)
  - Quản lý thông tin cá nhân và tài khoản học viên.

---

## 2. Phân hệ Ban vận hành (Admin Portal)

Cấu trúc điều hướng của Ban vận hành tuân thủ triết lý tối giản (Apple-like Minimalism), ngôn ngữ 100% thuần Tiếng Việt theo đúng tiêu chuẩn [B5_Tone_of_Voices.md](file:///Users/danghong/Documents/The1ight/LightMS/B_Architecture/B5_Tone_of_Voices.md), phân định rõ ràng giữa **Quản trị Tổng thể** và **Không gian Lớp học**:

### 2.1. Cấp Toàn cục
Thanh điều hướng chính của Quản trị viên gồm 4 mục tinh gọn:
- **Tổng quan** (Icon: Layout Dashboard)
  - Số liệu trọng yếu toàn hệ thống: Học viên đang học, số lớp đang mở.
- **Khóa học & Lớp** (Icon: Layers)
  - Danh mục các khóa học (Vibe Coding 201, 101, Obsidian...) và danh sách các lớp theo từng khóa.
  - Nút bấm tinh gọn: **[+ Mở lớp mới]** (Hỗ trợ sao chép nhanh 1 chạm từ lớp trước).
  - Chọn một lớp để tiến vào **Không gian Lớp học**.
- **Người dùng** (Icon: Users)
  - Quản lý danh sách toàn bộ học viên, giảng viên và trợ giảng trên toàn hệ thống.
- **Cài đặt** (Icon: Settings)

---

### 2.2. Không gian Lớp học
> Xuất hiện khi Quản trị viên bấm chọn một lớp cụ thể (Ví dụ: `Vibe Coding 201 - Lớp 3`). Thanh điều hướng phía trên (Header) hiển thị đường dẫn kèm bộ chọn nhanh: `Quản trị > Vibe Coding 201 > [Lớp 3 ▾]`.

Thanh điều hướng bên trái (Sidebar) của lớp học gồm 5 mục tối giản:
- **1. Tổng quan lớp** (Icon: Key)
  - Mã kích hoạt lớp học kèm nút sao chép 1 chạm. Sĩ số và thời gian đào tạo.
- **2. Lộ trình học** (Icon: Book Open)
  - Danh sách các buổi học của lớp.
  - Quản lý trực tiếp các liên kết học liệu: Đường dẫn video xem lại, đường dẫn bài giảng, đường dẫn ghi chú Notion, đường dẫn trợ lý AI.
  - Chỉnh sửa trực tiếp (Dán liên kết là lưu ngay) và nút xem thử dưới góc nhìn học viên.
- **3. Lịch học** (Icon: Calendar)
  - Thiết lập lịch các buổi học trực tuyến và đường dẫn phòng học riêng cho lớp này.
- **4. Bài nộp** (Icon: Clipboard Check)
  - Theo dõi danh sách học viên nộp bài: Xem liên kết bài làm trên Facebook Group, kiểm tra trạng thái hoàn thành và gửi phản hồi hỗ trợ.
- **5. Thành viên** (Icon: User Check)
  - Danh sách học viên trong lớp và chỉ định giảng viên, trợ giảng phụ trách.


