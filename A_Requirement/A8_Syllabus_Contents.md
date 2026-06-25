# The1ight LMS - A8: Syllabus Contents & Structure (Cấu trúc Syllabus)

Tài liệu này quy định tiêu chuẩn tổ chức và trình bày nội dung cho các bài học (Lessons) trong phần **Syllabus**, được tối ưu hóa từ bảng theo dõi truyền thống sang định dạng "All-in-one" chuẩn LMS quốc tế.

## 1. Phân tích cách tổ chức thông tin hiện tại
Dựa trên hình ảnh bảng quản lý hiện tại, thông tin của một buổi học đang được lưu trữ theo dạng bảng (Tabular view) với các trường dữ liệu:
- **Thông tin cơ bản:** Buổi học (Số thứ tự), Nội dung (Tiêu đề), Thời gian (Lịch học).
- **Nội dung chính:** Các gạch đầu dòng tóm tắt kiến thức (Agenda).
- **Tài nguyên học tập:** Link Recording, Link Slide, Link Study Note, Link AI Bot (NotebookLM).
- **Thực hành (Action):** BTVN (Bài tập về nhà) và Tài liệu hỗ trợ làm BTVN.

*Đánh giá:* Định dạng bảng dàn ngang (như Notion/Google Sheets) cực kỳ hiệu quả cho Admin và Giảng viên để quản lý tổng thể tiến độ. Tuy nhiên, đối với Học viên (đặc biệt khi truy cập bằng thiết bị di động), bảng ngang gây ra sự phân mảnh thông tin, khó thao tác và không tối ưu cho việc nộp bài tập trực tiếp.

## 2. Tiêu chuẩn Trình bày Syllabus (Chuẩn LMS Quốc tế)
Để tối ưu trải nghiệm "Zero Friction" theo định hướng của hệ thống (như đã quy định tại `A2_Sitemap.md`), thông tin của mỗi buổi học sẽ được "giải nén" từ dạng bảng thành một **Trang bài học cuộn dọc (Vertical All-in-one Lesson Page)**. 

Cấu trúc chuẩn của một trang bài học hiển thị cho học viên bao gồm 4 phần chính:

### 2.1. Header & Metadata (Thông tin bối cảnh)
Hiển thị ngay đầu trang để học viên nắm bắt bức tranh toàn cảnh của buổi học.
- **Tiêu đề:** `Buổi [X]: [Tên bài học]` (VD: *Buổi 1: Tư duy sản phẩm trong thời đại AI*).
- **Thời gian (Schedule):** Thời gian diễn ra. Kèm theo nút **[Thêm vào Lịch]**.
- **Nội dung chính (Agenda):** Danh sách bullet points (3-5 ý) về những kiến thức cốt lõi sẽ được cover trong buổi này.

### 2.2. Learning Materials (Tài nguyên Học tập)
Khu vực tập trung toàn bộ học liệu. Thay vì để link text đơn điệu, UI sẽ hiển thị dưới dạng các thẻ (Cards) tài liệu hoặc nút bấm trực quan.
- **Video Recording:** Hiển thị trực tiếp khung phát video (Embed Player) hoặc Nút xem video nổi bật (đối với Cloudflare Player).
- **Tài liệu đính kèm (Attachments):** Trình bày dạng danh sách có icon dễ nhận diện.
  - 📄 **Slide bài giảng** 
  - 📝 **Study Notes** 
  - 🤖 **Trợ lý AI (NotebookLM)**: Link truy cập Bot hỏi đáp riêng của khóa học.

### 2.3. Assignments (Bài tập & Thực hành)
Đây là khu vực quan trọng nhất để kích hoạt hành động (Action-Oriented). Chuyển đổi cột "BTVN" thành một khu vực tương tác (Action Zone).
- **Danh sách Nhiệm vụ (Task List):** Các yêu cầu bài tập được chia nhỏ và đánh số (Task 1, Task 2...).
- **Tài liệu bổ trợ ngữ cảnh (Contextual Resources):** Cột "Tài liệu hỗ trợ làm BTVN" ở định dạng cũ thường bị tách rời khỏi yêu cầu. Ở chuẩn mới, tài liệu hỗ trợ sẽ được đặt **ngay dưới (nested)** từng yêu cầu bài tập tương ứng, giúp học viên không bị nhầm lẫn.
- **Khu vực Nộp bài (Submission Workspace):** Ngay bên dưới yêu cầu bài tập, tích hợp sẵn khung soạn thảo Rich-text hoặc nút Upload File/Link để học viên nộp bài.

### 2.4. Feedback & Community (Phản hồi & Thảo luận)
- **Nhận xét của Mentor (Feedback):** Khu vực hiển thị trạng thái chấm bài, điểm số và nhận xét chi tiết của Mentor trả trực tiếp vào bài nộp.
- **Thảo luận (Discussion):** Tích hợp nút xem luồng (Thread) thảo luận của cộng đồng lớp học về bài tập này.

---

## 3. Lợi ích của cấu trúc mới
1. **Tập trung hóa (All-in-one):** Mọi thứ (Video, Slide, Bài tập, Nộp bài) diễn ra trên cùng một màn hình (Zero Context Switching).
2. **Mobile-First:** Cuộn dọc theo luồng (Đọc mục tiêu -> Xem tài liệu -> Làm bài -> Nộp bài) phù hợp hoàn hảo với thói quen sử dụng điện thoại.
3. **Action-Oriented:** Biến cột BTVN thành các hành động (Call-to-Action) có thể tương tác (điền form, nộp bài, check hoàn thành), giúp tăng tỷ lệ hoàn thành khóa học.
