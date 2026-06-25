# LightMS - A7: Onboarding Week Structure (Cấu trúc Tuần Khởi động)

Tài liệu này quy định tiêu chuẩn cấu trúc nội dung cho một bài học/thử thách theo ngày (Daily Challenge) trong Tuần Onboarding (Onboarding Week). Cấu trúc này nhằm mục đích "kích hoạt" học viên, xây dựng thói quen và tạo động lực trước khi bước vào các bài học chuyên môn.

## 1. Triết lý thiết kế (Design Philosophy)
Giao diện và nội dung của Onboarding Week được thiết kế theo luồng tâm lý: **Mindset (Tư duy) -> Action (Hành động) -> Motivation (Động lực) -> Stretch (Mở rộng)**.

## 2. Cấu trúc tiêu chuẩn của một bài Onboarding (Standard Components)

Mỗi bài học trong Tuần Onboarding cần tuân thủ cấu trúc 5 phần dưới đây:

### 2.1. Tiêu đề và Thông điệp mở đầu (Header & Intro)
- **Tiêu đề chính (Title):** Theo định dạng `Ngày [X]: [Chủ đề chính]`. (Ví dụ: *Ngày 1: Khởi động, làm quen với khoá học*).
- **Thông điệp dẫn dắt (Intro Text):** Một đoạn văn ngắn (1-2 câu) giải thích "Why" - tại sao nhiệm vụ của ngày hôm nay lại quan trọng đối với trải nghiệm học tập của học viên, giúp định hình tâm thế (mindset) ngay từ đầu.

### 2.2. Mục tiêu (Objectives)
- **Mô tả bối cảnh:** Khái quát ngắn gọn bối cảnh của ngày học.
- **Danh sách "Bạn sẽ...":** Trình bày dưới dạng danh sách gạch đầu dòng (Bullet points). Nêu rõ các hành động cụ thể và giá trị học viên nhận được (Ví dụ: *Làm quen với lớp học, Đặt ra lý do tại sao, Cam kết hành động*).

### 2.3. Checklist Nhiệm vụ (Core Tasks)
Phần lõi của bài học, thiết kế dạng Checkbox (danh sách có thể tích chọn) để tạo cảm giác hoàn thành (gamification).
- **Đánh số Task rõ ràng:** Bắt đầu bằng `Task 1:`, `Task 2:` kèm theo động từ hành động (Xem, Đọc, Cập nhật, Viết).
- **Tài nguyên đính kèm trực tiếp:** Link tài liệu, video, hoặc nhắc nhở (Ví dụ: link tới `[READ ME FIRST]`).
- **Nhiệm vụ chốt (Call to Action):** Task cuối cùng luôn là một hành động xác nhận, ví dụ: "Cập nhật Hoàn Thành tại Tracking Sheet lớp học".

### 2.4. Ghi nhớ nhỏ (Key Takeaways / Motivational Quote)
- Trình bày dạng Blockquote hoặc Highlight box (kèm icon 📌).
- Nội dung: Một câu nói truyền cảm hứng, lời khuyên thực tế, hoặc một thông điệp động viên giúp học viên ghi nhớ bài học và giữ tinh thần tích cực (Ví dụ: *"Bạn không cần phải 'giỏi' để bắt đầu. Nhưng bạn phải bắt đầu thì mới có thể 'giỏi'."*).

### 2.5. Nhiệm vụ Tùy chọn (Bonus Task)
Phần này dùng để phân hóa học viên, dành cho những ai có nhiều thời gian và muốn tìm hiểu sâu hơn.
- **Điều kiện mở đầu:** Ghi chú rõ đây là nhiệm vụ làm thêm (Ví dụ: *Nếu bạn hoàn thành hết các nhiệm vụ trên và vẫn muốn học thêm một chút*).
- **Nội dung mở rộng:** `Task X:` kèm theo link bài đọc thêm, video tham khảo.
- **Callout giải thích (Tooltip/Info box):** Đặt trong một box nổi bật (kèm icon 💡) để giải thích ngắn gọn tại sao kiến thức bonus này lại giá trị.

---

## 3. Quy chuẩn Game hóa & Khóa theo lịch hẹn (Gamification & Lock Scheduling)

Để tạo động lực học tập giống như chơi game (Game-like experience) và tránh tình trạng học viên "đốt cháy giai đoạn" click trước toàn bộ bài học quá dễ dàng, Onboarding Week tuân thủ các quy tắc vận hành sau:

### 3.1. Giao diện Dạng Thẻ (7 Cards for 7 Days)
*   Giao diện Onboarding được trình bày dưới dạng **Danh sách Thẻ (Cards)** với 7 thẻ tương ứng với 7 ngày thử thách trong tuần.
*   Các thẻ được thiết kế đẹp mắt, kích thích thị giác, nhấn mạnh sự tương phản (Contrast) để tạo động lực click vào.
*   **Trạng thái các Thẻ (Cards):**
    *   *Chưa mở khóa (Locked):* Hiển thị biểu tượng ổ khóa 🔒, làm mờ (opacity thấp), nội dung không thể click. Khi cố gắng tương tác có thể hiện cảnh báo (Tooltip) ngày mở khóa.
    *   *Đã mở khóa (Unlocked):* Thẻ sáng lên, có thể có hiệu ứng hào quang nhẹ hoặc viền màu vàng (Gamification color) để thu hút sự chú ý.
    *   *Hoàn thành (Completed):* Hiển thị biểu tượng mỏ neo ⚓ hoặc dấu tick xanh sau khi học viên check toàn bộ nhiệm vụ trong ngày. Thẻ có thể chuyển sang màu nền tối (`#214C54`) để đánh dấu sự hoàn tất.

### 3.2. Cơ chế khóa theo lịch hẹn trước (Scheduled Unlocking)
*   **Công thức mở khóa:** Ngày chặng thứ $X$ sẽ tự động mở khóa vào đúng thời gian: `Ngày khai giảng + (X - 1) ngày`.
*   Ví dụ: Nếu ngày khai giảng là `25/06`, Ngày 1 mở ngay lập tức, Ngày 2 mở vào `26/06`, Ngày 3 mở vào `27/06`,...
*   **Kiểm thử và giả lập (Simulation Tools):** Giao diện luôn tích hợp bảng điều khiển giả lập ngày khai giảng (Simulated Start Date) và nút bỏ qua giới hạn (Bypass Locks) chỉ hiển thị cho Admin/Mentor hoặc chế độ Dev để dễ dàng kiểm nghiệm luồng mở khóa mà không cần chờ thời gian thực tế trôi qua.

---

## 4. Ứng dụng trong Admin Portal (Course Builder)
Khi Admin tạo bài học thuộc Module Onboarding, hệ thống Course Builder nên cung cấp sẵn một **Rich-text Template** chứa sẵn các Heading (Mục tiêu, Checklist Ngày, Ghi nhớ nhỏ, Bonus Task) và các khối định dạng (Checkbox, Blockquote, Info box) để Admin chỉ cần điền nội dung thay vì phải tự định dạng từ đầu.
