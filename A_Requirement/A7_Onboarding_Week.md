# LightMS - A7: Onboarding Week Structure (Cấu trúc Tuần Khởi động)

Tài liệu này quy định tiêu chuẩn cấu trúc nội dung cho một bài học/thử thách theo ngày (Daily Challenge) trong Tuần Onboarding (Onboarding Week). Cấu trúc này nhằm mục đích "kích hoạt" học viên, xây dựng thói quen và tạo động lực trước khi bước vào các bài học chuyên môn.

## 1. Triết lý thiết kế (Design Philosophy)

Giao diện và nội dung của Onboarding Week được thiết kế theo luồng tâm lý: **Mindset (Tư duy) -> Action (Hành động) -> Motivation (Động lực) -> Stretch (Mở rộng)**.

## 2. Cấu trúc tiêu chuẩn của một bài Onboarding (Standard Components)

Mỗi bài học trong Tuần Onboarding cần tuân thủ cấu trúc 5 phần dưới đây:

### 2.1. Tiêu đề và Thông điệp mở đầu (Header & Intro)

- **Tiêu đề chính (Title):** Theo định dạng `Ngày [X]: [Chủ đề chính]`. (Ví dụ: _Ngày 1: Khởi động, làm quen với khoá học_).
- **Thông điệp dẫn dắt (Intro Text):** Một đoạn văn ngắn (1-2 câu) giải thích "Why" - tại sao nhiệm vụ của ngày hôm nay lại quan trọng đối với trải nghiệm học tập của học viên, giúp định hình tâm thế (mindset) ngay từ đầu.

### 2.2. Mục tiêu (Objectives)

- **Mô tả bối cảnh:** Khái quát ngắn gọn bối cảnh của ngày học.
- **Danh sách "Bạn sẽ...":** Trình bày dưới dạng danh sách gạch đầu dòng (Bullet points). Nêu rõ các hành động cụ thể và giá trị học viên nhận được (Ví dụ: _Làm quen với lớp học, Đặt ra lý do tại sao, Cam kết hành động_).

### 2.3. Checklist Nhiệm vụ (Core Tasks)

Phần lõi của bài học, thiết kế dạng Checkbox (danh sách có thể tích chọn) để tạo cảm giác hoàn thành (gamification).

- **Đánh số Task rõ ràng:** Bắt đầu bằng `Task 1:`, `Task 2:` kèm theo động từ hành động (Xem, Đọc, Cập nhật, Viết).
- **Tài nguyên đính kèm trực tiếp:** Link tài liệu, video, hoặc nhắc nhở (Ví dụ: link tới `[READ ME FIRST]`).
- **Nhiệm vụ chốt (Call to Action):** Task cuối cùng luôn là một hành động xác nhận, ví dụ: "Cập nhật Hoàn Thành tại Tracking Sheet lớp học".

### 2.4. Ghi nhớ nhỏ (Key Takeaways / Motivational Quote)

- Trình bày dạng Blockquote hoặc Highlight box (kèm icon 📌).
- Nội dung: Một câu nói truyền cảm hứng, lời khuyên thực tế, hoặc một thông điệp động viên giúp học viên ghi nhớ bài học và giữ tinh thần tích cực (Ví dụ: _"Bạn không cần phải 'giỏi' để bắt đầu. Nhưng bạn phải bắt đầu thì mới có thể 'giỏi'."_).

### 2.5. Nhiệm vụ Tùy chọn (Bonus Task)

Phần này dùng để phân hóa học viên, dành cho những ai có nhiều thời gian và muốn tìm hiểu sâu hơn.

- **Điều kiện mở đầu:** Ghi chú rõ đây là nhiệm vụ làm thêm (Ví dụ: _Nếu bạn hoàn thành hết các nhiệm vụ trên và vẫn muốn học thêm một chút_).
- **Nội dung mở rộng:** `Task X:` kèm theo link bài đọc thêm, video tham khảo.
- **Callout giải thích (Tooltip/Info box):** Đặt trong một box nổi bật (kèm icon 💡) để giải thích ngắn gọn tại sao kiến thức bonus này lại giá trị.

---

## 3. Quy chuẩn Game hóa & Khóa theo lịch hẹn (Gamification & Lock Scheduling)

Để tạo động lực học tập giống như chơi game (Game-like experience) và tránh tình trạng học viên "đốt cháy giai đoạn" click trước toàn bộ bài học quá dễ dàng, Onboarding Week tuân thủ các quy tắc vận hành sau:

### 3.1. Giao diện Dạng Thẻ (7 Cards for 7 Days)

- Giao diện Onboarding được trình bày dưới dạng **Danh sách Thẻ (Cards)** với 7 thẻ tương ứng với 7 ngày thử thách trong tuần.
- Các thẻ được thiết kế đẹp mắt, kích thích thị giác, nhấn mạnh sự tương phản (Contrast) để tạo động lực click vào.
- **Trạng thái các Thẻ (Cards):**
  - _Chưa mở khóa (Locked):_ Hiển thị biểu tượng ổ khóa 🔒, làm mờ (opacity thấp), nội dung không thể click. Khi cố gắng tương tác có thể hiện cảnh báo (Tooltip) ngày mở khóa.
  - _Đã mở khóa (Unlocked):_ Thẻ sáng lên, có thể có hiệu ứng hào quang nhẹ hoặc viền màu vàng (Gamification color) để thu hút sự chú ý.
  - _Hoàn thành (Completed):_ Hiển thị dấu tích xanh `CheckCircle2` ở góc tiêu đề và thanh tiến độ chuyển sang màu xanh lá (`bg-emerald-500`) kèm theo nhãn "Đã hoàn thành" để biểu thị trạng thái kết thúc thử thách.

### 3.2. Cơ chế khóa theo lịch hẹn trước (Scheduled Unlocking)

- **Cơ chế đặt lịch bằng tay (Manual Date/Time Scheduling):** Thay vì dùng công thức cố định, Admin/Mentor được toàn quyền cấu hình mốc thời gian (ngày, giờ) mở khóa tự động cụ thể cho từng Ngày trong Onboarding thông qua cơ sở dữ liệu (Supabase/LocalStorage) bằng input chọn ngày giờ trên giao diện Course Builder.
- **Điều kiện mở khóa kết hợp:** Một ngày học chặng thứ X chỉ thực sự mở khóa đối với học viên khi:
  1. Đã đến hoặc vượt qua mốc thời gian mở khóa đã lên lịch (`scheduled_at`).
  2. Học viên đã hoàn thành 100% nhiệm vụ của ngày học trước đó (X-1).
- **Công cụ giả lập và bỏ qua khóa (Developer/Admin Bypass):** Đối với tài khoản vai trò Admin/Mentor hoặc chế độ Development, giao diện hỗ trợ cơ chế bỏ qua giới hạn khóa (`bypassLocks` hoặc `lms_bypass_locks` trong LocalStorage) để thuận tiện cho việc kiểm thử toàn bộ luồng mà không bị chặn bởi thời gian thực tế.

---

## 4. Ứng dụng trong Admin Portal (Course Builder)

Khi Admin tạo bài học thuộc Module Onboarding, hệ thống Course Builder nên cung cấp sẵn một **Rich-text Template** chứa sẵn các Heading (Mục tiêu, Checklist Ngày, Ghi nhớ nhỏ, Bonus Task) và các khối định dạng (Checkbox, Blockquote, Info box) để Admin chỉ cần điền nội dung thay vì phải tự định dạng từ đầu.
