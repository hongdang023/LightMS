# Nghiên cứu Top 3 LMS hàng đầu thế giới & Bài học cho The1ight LMS

Tài liệu này phân tích 3 hệ thống quản trị học tập (LMS) có vị thế hàng đầu trên thế giới. Mục tiêu là phân tích triết lý thiết kế của họ và đúc kết các tính năng cốt lõi có thể tham khảo để đáp ứng các User Stories của **The1ight LMS** (tập trung vào tính cộng đồng, học theo batch, và đánh giá theo outcome-based).

Ba hệ thống được lựa chọn bao gồm:
1. **Canvas LMS** (Hệ thống LMS hàn lâm phổ biến và hiện đại nhất, thay thế Blackboard ở nhiều nơi).
2. **Moodle** (Hệ thống LMS mã nguồn mở lớn nhất, đại diện cho tính tương tác và kiến tạo xã hội).
3. **Docebo** (Đại diện cho Corporate/Modern LMS đề cao Social Learning & AI).

---

## 1. Canvas LMS (Instructure)

### Triết lý hệ thống
- **Student-Centric & Openness (Lấy học viên làm trung tâm & Tính mở):** Canvas được thiết kế tối giản, trực quan nhằm loại bỏ rào cản kỹ thuật để giảng viên và học viên tập trung vào việc học.
- **Outcome-based Focus:** Hỗ trợ cực mạnh việc học và đánh giá dựa trên chuẩn đầu ra (Outcomes) thay vì chỉ chấm điểm (Grades) thông thường.

### Các tính năng có thể học tập cho The1ight LMS
* **Global To-Do List & Dashboard:** *(Đáp ứng US-STU-04)*
  - Màn hình chính tổng hợp danh sách "To-do" (cần làm) từ tất cả các khóa học/batch, sắp xếp theo deadline. Học viên không cần phải bấm vào từng nơi để biết việc cần làm.
* **SpeedGrader:** *(Đáp ứng US-STU-02)*
  - Giao diện chấm bài tối ưu trên một màn hình: Bên trái hiển thị bài nộp trực tiếp (không cần tải về), bên phải là Rubric chấm điểm và khung comment/audio/video feedback.
* **Learning Mastery Gradebook:** *(Đáp ứng US-STU-06)*
  - Thay vì hiển thị điểm số (ví dụ: 8/10), tính năng này thể hiện sự tiến bộ qua các mức độ làm chủ kỹ năng (Mastery levels) như: *Vượt kỳ vọng, Đạt, Cần cải thiện*. Rất phù hợp với triết lý Outcome-based.
* **New Analytics (Dự báo & Phân tích rủi ro):** *(Đáp ứng US-AD-01, US-AD-04)*
  - Cung cấp biểu đồ trực quan, cho phép Admin/Giảng viên dùng tính năng *"Message Students Who..."* để gửi tin nhắn hàng loạt chỉ với 1 click cho những ai chưa nộp bài hoặc có điểm thấp dưới mức kỳ vọng.

---

## 2. Moodle

### Triết lý hệ thống
- **Social Constructionist Pedagogy (Sư phạm kiến tạo xã hội):** Moodle tin rằng con người học tập tốt nhất khi họ kiến tạo nội dung cho người khác xem và trải qua quá trình tương tác, thảo luận, đánh giá đồng cấp (peer review).

### Các tính năng có thể học tập cho The1ight LMS
* **Workshop Activity (Đánh giá đồng cấp):** *(Đáp ứng US-STU-08, US-AD-08)*
  - Tự động hóa quá trình chia bài chéo. Học viên nộp bài, hệ thống phân bổ bài cho các bạn khác chấm theo Rubric chung. Học viên học được rất nhiều từ cách người khác giải quyết vấn đề.
* **Activity Completion & Restrict Access:** *(Đáp ứng US-STU-01, US-AD-02)*
  - Cấu hình điều kiện ràng buộc siêu chi tiết (Ví dụ: "Phải pass bài A và đọc tài liệu B thì mới mở khóa bài C"). Đi kèm là các Progress Bar trực quan thể hiện rõ tiến độ.
* **Gamification với Badges:** *(Đáp ứng US-STU-09, US-AD-09)*
  - Cấp huy hiệu số (Badges) tự động dựa trên các tiêu chí hoàn thành, giúp ghi nhận nỗ lực của học viên. Những badge này có thể chia sẻ ra ngoài mạng xã hội.

---

## 3. Docebo (Đại diện cho Social & Modern Learning)

### Triết lý hệ thống
- **Social Learning & Flow of Work:** Đưa việc học thoát khỏi mô hình bài giảng truyền thống cứng nhắc. Khuyến khích tạo ra môi trường học tập xã hội liên tục và cá nhân hóa nhờ AI.

### Các tính năng có thể học tập cho The1ight LMS
* **Discover, Coach & Share:** *(Đáp ứng US-STU-05, US-STU-10)*
  - Cho phép học viên đặt câu hỏi, học viên xuất sắc hoặc chuyên gia vào trả lời. Câu trả lời hay được upvote, biến các cuộc thảo luận thành một kho tri thức chung (Knowledge Base).
* **Automated Enrollment Rules:** *(Đáp ứng US-AD-02, US-AD-05)*
  - Rule engine tự động: "Nếu học viên trượt bài test 2 lần, tự động gửi email cho Admin và mở khóa tài liệu ôn tập". Điều này giúp scale dễ dàng mà không tốn công vận hành bằng tay.
* **Centralized Content Repository (Kho học liệu tập trung):** *(Đáp ứng US-AD-03, US-STU-03)*
  - Video, PDF, tài nguyên được quản lý ở một kho tổng trung tâm. Khi update một file ở kho, mọi khóa học/batch đang dùng file đó đều tự động cập nhật, tránh rác và thất lạc thông tin.
* **User-Generated Content & Leaderboards:** *(Đáp ứng US-AD-09)*
  - Tích hợp bảng xếp hạng vinh danh những thành viên chia sẻ kiến thức hữu ích nhất, tạo chất xúc tác cho văn hóa học tập cộng đồng.

---

## Bảng Mapping Tính năng vào User Stories The1ight

| User Story | Vấn đề của người dùng | Giải pháp đề xuất học hỏi từ Top LMS |
|:---|:---|:---|
| **US-STU-01** | Theo dõi hành trình học | Progress Bar và tính năng "Activity Completion" ràng buộc (Moodle). |
| **US-STU-02** | Nộp bài & nhận phản hồi | Màn hình "SpeedGrader" chia đôi: Bài nộp và Rubric + Feedback (Canvas). |
| **US-STU-03, AD-03** | Tìm lại / Quản lý học liệu | Xây dựng "Centralized Content Repository" + Global Search (Docebo). |
| **US-STU-04** | Biết việc cần làm hôm nay | "Global To-Do list" trên Dashboard, gom nhóm theo deadline (Canvas). |
| **US-STU-05, STU-10** | Hỗ trợ & Cộng đồng | Chức năng "Coach & Share", Q&A có upvote xếp hạng (Docebo). |
| **US-STU-06** | Cảm nhận sự tiến bộ | "Learning Mastery Gradebook" đánh giá mức độ đạt kỹ năng (Canvas). |
| **US-STU-08, AD-08** | Học từ người khác | Activity "Workshop" cho phép chấm bài chéo / Peer Review (Moodle). |
| **US-STU-09, AD-09** | Công nhận nỗ lực | "Badges" tự động & Bảng xếp hạng (Leaderboards) chia sẻ được (Docebo, Moodle). |
| **US-AD-01, AD-04** | Theo dõi sức khỏe batch | Analytics Dashboard kết hợp trigger "Message students who..." (Canvas). |
| **US-AD-02, AD-05** | Tự động hóa vận hành | "Automated Rules engine" kích hoạt action dựa trên event (Docebo, Moodle). |
| **US-AD-06, AD-07** | Kiểm soát & Tự tin hỗ trợ | Admin Dashboard dạng Widgets có thể tùy biến luồng công việc (Docebo). |
