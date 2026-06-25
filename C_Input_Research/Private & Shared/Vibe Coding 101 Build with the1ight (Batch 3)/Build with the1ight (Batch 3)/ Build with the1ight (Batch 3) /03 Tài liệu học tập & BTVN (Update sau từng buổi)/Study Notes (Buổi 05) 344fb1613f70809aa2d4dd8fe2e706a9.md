# Study Notes (Buổi 05)

# 📝 BUỔI 5: KIẾN THỨC KỸ THUẬT NỀN TẢNG ĐỂ XÂY DỰNG SẢN PHẨM

## 🎯 1. Tóm tắt chung (Executive Summary)

Buổi học thứ 5 tập trung vào việc trang bị những kiến thức kỹ thuật cốt lõi nhưng dễ tiếp cận để xây dựng sản phẩm. Nội dung trọng tâm xoay quanh việc hiểu rõ cấu trúc "tảng băng trôi" của một ứng dụng phần mềm, từ luồng vận hành kinh doanh (Business Flow - L1) đến hệ thống dữ liệu (System & Data - L3). Mục tiêu cuối cùng là giúp học viên nắm vững cách thức các thành phần như FE, BE, API và Database kết nối với nhau, từ đó có thể tự tin thiết kế và triển khai sản phẩm thực tế với sự hỗ trợ của AI.

## 💡 2. Các điểm nhấn quan trọng (Key Takeaways)

- **Quy luật con vịt (The Duck Law):** Một sản phẩm tốt giống như con vịt đang bơi: trên mặt nước thì bình thản, ung dung (UI/UX mượt mà), nhưng dưới mặt nước là đôi chân đang đạp liên tục (các hệ thống kỹ thuật vận hành phức tạp).
- **Mô hình 4 tầng kiến trúc (L0 - L3):** Hiểu rõ sự chuyển tiếp từ Ý tưởng (L0) -> Luồng kinh doanh (L1) -> Luồng người dùng (L2) -> Hệ thống & Dữ liệu (L3).
- **API vs. Webhook:** Phân biệt cơ chế giao tiếp "chủ động yêu cầu" (API - Pull) và "tự động đẩy dữ liệu" khi có sự kiện (Webhook - Push).
- **Tư duy "Walk with AI":** AI không chỉ là công cụ hỗ trợ mà là người đồng hành trong mọi bước từ viết prompt, thiết kế logic đến debug hệ thống.

## 📖 3. Nội dung chi tiết

### Tầng sâu kỹ thuật của kiến trúc phần mềm

Để xây dựng sản phẩm, người làm sản phẩm cần nhìn thấy những gì "không thể thấy bằng mắt thường". Buổi học sử dụng hình ảnh tảng băng trôi để phân loại:

- **Phần nổi:** Những gì người dùng thấy (L2 - User Flow: màn hình, thao tác).
- **Phần chìm:** Những gì diễn ra bên dưới (L1 - Business Flow: quy trình, các bên tham gia; L3 - System & Data: API, Backend, Database).

### L1 - Business Flow (Luồng vận hành kinh doanh)

Đây là tầng nhìn nhận các bên tham gia vào một hoạt động kinh doanh và trình tự tương tác giữa họ.

- **BPMN (Business Process Model and Notation):** Sơ đồ thể hiện luồng công việc giữa các Actor (ví dụ: Khách hàng, Bồi bàn, Đầu bếp trong kịch bản đặt món).
- **Công cụ Mermaid:** Sử dụng AI để vẽ sơ đồ BPMN từ User Stories trong bản PRD.
- **Cách làm:** Liệt kê các Actor -> Vẽ sơ đồ Swim Lane thể hiện luồng chính (Happy Path) và các trường hợp lỗi (Edge Cases).

### L3 - System & Data (Hệ thống và Dữ liệu)

Tầng này tập trung vào cách ứng dụng vận hành về mặt kỹ thuật:

- **Frontend (FE):** Giao diện người dùng tương tác.
- **Backend (BE):** Phần xử lý logic bên dưới.
- **Database (Cơ sở dữ liệu):** Nơi lưu trữ thông tin lâu dài.
- **ERD (Entity-Relationship Diagram):** Sơ đồ thể hiện mối quan hệ giữa các thực thể dữ liệu.

### Ngôn ngữ cầu nối: API và Webhooks

| **Khái niệm** | **Cơ chế** | **Mô tả** |
| --- | --- | --- |
| **API** | **Pull (Kéo)** | Hệ thống A chủ động gửi yêu cầu để lấy hoặc gửi thông tin từ/đến hệ thống B. |
| **Webhooks** | **Push (Đẩy)** | Hệ thống B tự động đẩy dữ liệu sang hệ thống A ngay khi có một sự kiện cụ thể xảy ra. |

### Lựa chọn Cơ sở dữ liệu (Database)

Buổi học so sánh 3 công cụ phổ biến cho người mới bắt đầu:

- **Google Sheets:** Dễ dùng nhất, nhưng bảo mật kém, dễ mất quyền truy cập và bị chậm khi vượt quá 10.000 bản ghi.
- **Airtable:** Giao diện đẹp, dễ chỉnh sửa nhưng khó mở rộng (bản miễn phí giới hạn 1.000 bản ghi).
- **Supabase:** Cơ sở dữ liệu quan hệ (Relational Database) mạnh mẽ, bảo mật cao, khả năng mở rộng lên tới hàng tỷ bản ghi nhưng khó học hơn.

### Quy trình 4 bước để xây dựng ứng dụng (Build App)

1. **Thiết kế tư duy (Define Problem):** Xác định vấn đề cho ai, use-case là gì. Dùng AI để kiểm chứng tính cấp thiết của vấn đề.
2. **Viết PRD ngắn gọn:** Xác định User Flow rõ ràng (User - Feature - Flow) để tránh lạc hướng.
3. **Xây dựng giao diện (UI):** Sử dụng các công cụ như Lovable, Framer, V0.dev dựa trên bản PRD.
4. **Gắn Backend đơn giản:** Kết nối Supabase (Auth, Database), Make (Automation, AI logic) hoặc Google Sheets để xử lý dữ liệu.

## 🚀 4. Hành động cần làm (Action Items)

- **Xác định phạm vi sản phẩm (Scope):** Bắt tay vào xác định bài toán cụ thể cho sản phẩm cá nhân.
- **Thực hiện 4 bước xây dựng:** Áp dụng quy trình từ Design Thinking (L0) đến gắn Backend (L3) như hướng dẫn tại slide 39.
- **Tham khảo tài liệu bổ sung:**
    - Đọc bài viết về các Prompt đã dùng để build sản phẩm ví dụ.
    - Xem video giải thích cơ chế **Vibe Coding** và hệ thống Backend.
    - Nghiên cứu cách build sản phẩm trên 5 công cụ khác nhau từ link cung cấp.
- **Tương tác AI:** Sử dụng GPT xuyên suốt các bước để viết prompt, logic và sửa lỗi (debug).