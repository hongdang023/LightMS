# The1ight LMS - Non-Functional Requirements (Yêu cầu phi chức năng)

Dưới đây là các yêu cầu phi chức năng (NFR) nhằm đảm bảo hệ thống The1ight LMS vận hành trơn tru, bảo mật, dễ mở rộng và mang lại trải nghiệm người dùng tối ưu nhất.

## 1. Usability & User Experience (Tính khả dụng & Trải nghiệm người dùng)
- **NFR-UX-01 (Zero Friction & Elegance):** Giao diện phải được thiết kế tối giản, loại bỏ các bước click thừa nhưng vẫn phải đảm bảo tính thẩm mỹ cao cấp (Elegance). Bắt buộc sử dụng các thư viện Rich-Text Editor hiện đại để trình bày nội dung bài tập, feedback rõ ràng, đẹp mắt. Áp dụng triết lý "All-in-one Lessons" để học viên không phải chuyển trang liên tục.
- **NFR-UX-02 (Mobile Responsiveness):** Nền tảng phải hoạt động mượt mà trên thiết bị di động, đặc biệt đối với việc xem To-do list, đọc tài liệu và tham gia thảo luận chéo.
- **NFR-UX-03 (Accessibility):** Tuân thủ các tiêu chuẩn trợ năng cơ bản (WCAG) để đảm bảo độ tương phản màu sắc và hỗ trợ điều hướng bằng bàn phím.
- **NFR-UX-04 (Admin UI Consistency/WYSIWYG):** Giao diện Edit Mode/Reading Mode ở luồng Admin cho các mục Giới thiệu, Onboarding, Lộ trình học phải có thiết kế y hệt giao diện Student Mode. Mục đích để Admin nhìn thấy chính xác những gì học viên thấy, giúp điều chỉnh các chi tiết nhỏ dễ dàng.

## 2. Performance (Hiệu suất)
- **NFR-PF-01 (Page Load Time):** Thời gian tải các trang cốt lõi (Dashboard, Bài học) không được vượt quá 2 giây ở kết nối mạng tiêu chuẩn.
- **NFR-PF-02 (External Video Offloading):** Hệ thống không gánh việc stream video trực tiếp để tiết kiệm tài nguyên. Video sẽ được cung cấp qua đường link bảo mật dẫn tới nền tảng ngoài (Cloudflare), đảm bảo tốc độ tải trang cốt lõi của LMS luôn ở mức tối đa.
- **NFR-PF-03 (Concurrent Users):** Hệ thống phải đảm bảo hoạt động ổn định khi có nhiều học viên (toàn bộ Batch) cùng truy cập để nộp bài hoặc thảo luận vào giờ cao điểm.

## 3. Scalability (Khả năng mở rộng)
- **NFR-SC-01 (Auto-scaling):** Kiến trúc hệ thống phải hỗ trợ tự động mở rộng tài nguyên máy chủ khi số lượng học viên, số lượng Batch tăng lên gấp nhiều lần.
- **NFR-SC-02 (Operational Scalability):** Tối đa hóa công năng của "Rule Engine" (Automations) để khi số lượng học viên tăng lên, khối lượng công việc thủ công của Admin/Mentor không bị tăng theo tỷ lệ thuận.

## 4. Security & Privacy (Bảo mật & Quyền riêng tư)
- **NFR-SE-01 (Authentication):** Hệ thống cần áp dụng các chuẩn xác thực an toàn (ví dụ: OAuth 2.0, JWT). Ưu tiên tính năng đăng nhập nhanh qua Google (Single Sign-On).
- **NFR-SE-02 (Role-based Access Control - RBAC):** Phân quyền truy cập chặt chẽ giữa các vai trò (Học viên, Mentor, Admin) để tránh truy cập trái phép vào dữ liệu điểm số, tài nguyên admin.
- **NFR-SE-03 (Data Privacy):** Bảo vệ thông tin cá nhân của học viên, tuân thủ các quy định về bảo mật dữ liệu. Dữ liệu nhạy cảm (mật khẩu) phải được mã hóa một chiều.
- **NFR-SE-04 (Content Protection):** Hạn chế tối đa khả năng tải lậu video bản quyền của khóa học (ví dụ: sử dụng HLS streaming hoặc các công nghệ chống download video cơ bản).

## 5. Integration & Interoperability (Tích hợp & Tương tác hệ thống)
- **NFR-IN-01 (Telegram Integration):** Tích hợp sâu với Telegram API để hỗ trợ gửi thông báo (Triggers), cập nhật vinh danh (Wall of Fame) và nhận câu hỏi hỗ trợ.
- **NFR-IN-02 (Calendar Integration):** Có khả năng xuất lịch trình dưới dạng file `.ics` hoặc tích hợp thẳng qua Google Calendar API.
- **NFR-IN-03 (Third-party Tools):** Sẵn sàng API để kết nối với các công cụ CRM hoặc Email Marketing (ví dụ: Mailchimp, ActiveCampaign) phục vụ chuỗi Email Onboarding.

## 6. Reliability & Availability (Tính tin cậy & Độ sẵn sàng)
- **NFR-RE-01 (Uptime):** Đảm bảo hệ thống đạt mức độ sẵn sàng tối thiểu 99.9% (Uptime).
- **NFR-RE-02 (Backup & Recovery):** Tự động sao lưu cơ sở dữ liệu định kỳ (hàng ngày) và có kịch bản khôi phục (Disaster Recovery) trong vòng 2 giờ nếu xảy ra sự cố nghiêm trọng.
