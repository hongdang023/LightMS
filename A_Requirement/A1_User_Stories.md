# LightMS - User Stories

> **Last Updated:** 2026-08-07 | **Status:** ✅ Stable

Dựa trên triết lý outcome-based và các Jobs To Be Done (JTBD) đã định nghĩa, dưới đây là danh sách User Stories (US) cho hệ thống LightMS. Các User Story được chia theo 2 nhóm người dùng chính và đánh mã số để dễ dàng theo dõi.

## 1. Stakeholder: Học viên (Student)

### Functional Stories

- **US-STU-01**: Là một học viên, tôi muốn biết chính xác mình đang ở đâu trong chương trình, để không bị lạc giữa các tài liệu, bài tập và hoạt động khác nhau. _(Từ JTBD #1)_
- **US-STU-03**: Là một học viên, tôi muốn tìm recording, study note và tài liệu liên quan trong vài giây, để không mất thời gian tìm kiếm trên nhiều nền tảng khi bỏ lỡ buổi học hoặc cần ôn tập. _(Từ JTBD #3)_
- **US-STU-04**: Là một học viên, tôi muốn thấy ngay những việc cần làm hôm nay khi đăng nhập vào hệ thống, để duy trì tiến độ học tập mà không cần suy nghĩ quá nhiều. _(Từ JTBD #4)_
- **US-STU-05**: Là một học viên, tôi muốn nhận được câu trả lời hoặc hướng dẫn nhanh chóng khi gặp vấn đề, để không bị mắc kẹt quá lâu trong quá trình học hoặc làm sản phẩm. _(Từ JTBD #5)_

### Emotional Stories

- **US-STU-06**: Là một học viên, tôi muốn nhìn thấy những thành quả và tiến bộ của bản thân qua thời gian, để duy trì động lực học tập. _(Từ JTBD #6)_
- **US-STU-07**: Là một học viên, tôi muốn biết mình vẫn có thể bắt kịp chương trình khi bỏ lỡ một vài hoạt động, để không cảm thấy áp lực hoặc muốn bỏ cuộc. _(Từ JTBD #7)_

### Social Stories

- **US-STU-09**: Là một học viên, tôi muốn được cộng đồng ghi nhận khi hoàn thành thử thách hoặc có kết quả tốt, để cảm thấy những nỗ lực của mình có ý nghĩa. _(Từ JTBD #10)_

---

## 2. Stakeholder: Admin & Giảng viên vận hành

### Functional Stories

- **US-AD-01**: Là một admin, tôi muốn biết ai đang học tốt, ai chậm tiến độ và ai có nguy cơ bỏ học theo từng Batch, để can thiệp đúng lúc. _(Từ JTBD #1)_
- **US-AD-02**: Là một admin, tôi muốn tự động hóa các tác vụ lặp lại (quản lý lịch học, bài tập, học liệu theo lớp), để dành thời gian cho những hoạt động tạo giá trị cao hơn. _(Từ JTBD #2)_
- **US-AD-03**: Là một admin, tôi muốn có một hệ thống tập trung để quản lý toàn bộ link recording, study notes và tài nguyên học tập theo từng lớp, để giảm thất lạc thông tin. _(Từ JTBD #3)_
- **US-AD-04**: Là một admin, tôi muốn có dữ liệu về mức độ tham gia, hoàn thành bài tập và kết quả học tập khi một batch kết thúc, để đánh giá và cải thiện chương trình. _(Từ JTBD #4)_
- **US-AD-05**: Là một admin, tôi muốn hệ thống vận hành trơn tru khi scale nhiều Batch và khóa học cùng lúc, để không phải tăng tương ứng số lượng nhân sự vận hành. _(Từ JTBD #5)_

#### Quản trị Đa lớp & Mã kích hoạt (Batch Workspace & Access Code)
- **US-AD-15 (Batch Isolation & Focus)**: Là một admin/trainer, tôi muốn khi chọn vào một Batch cụ thể (ví dụ: Vibe Coding 201 - Khóa 3), tôi chỉ nhìn thấy tài liệu, lịch học, học viên và nhân sự của riêng Batch đó, với giao diện tối giản (Apple-like minimalism), để hoàn toàn tập trung và không nhầm lẫn với các khóa khác.
- **US-AD-16 (1-Click Batch Clone)**: Là một admin, khi mở Batch mới (ví dụ Khóa 4), tôi muốn sao chép toàn bộ khung bài học và tài liệu nền từ Batch trước chỉ với 1 click, để không tốn thời gian nhập liệu thủ công từ đầu.
- **US-AD-17 (Clean Access Code Management)**: Là một admin, tôi muốn xem mã kích hoạt (Access Code) của Batch trên một thẻ sạch sẽ, có nút sao chép nhanh 1 chạm để gửi ngay cho học viên ghi danh mà không cần qua nhiều bước phức tạp.

#### Soạn & Quản lý Học liệu Trực tiếp (Direct Link Syllabus)
- **US-AD-18 (Direct Link Syllabus Management)**: Là một trainer/admin, tôi muốn mỗi buổi học trong Batch chỉ quản lý bằng các ô dán link bên ngoài (Link Recording, Link Slide, Link Study Note Notion, Link Bot AI), dán là lưu ngay (Inline Edit) thay vì phải upload file nặng nề.
- **US-AD-19 (WYSIWYG Student Preview)**: Là một admin, tôi muốn giao diện soạn giáo trình hiển thị sạch đẹp tương tự như học viên nhìn thấy (Student Mode), có thể bấm kiểm tra mở link ngay tại chỗ để đảm bảo không bị gãy link trước giờ học.

#### Lịch học & Đội ngũ Phụ trách theo Batch (Schedule & Staff)
- **US-AD-20 (Dedicated Batch Schedule)**: Là một admin, tôi muốn thiết lập lịch các buổi Live Zoom/Google Meet với ngày giờ và link tham gia riêng cho từng Batch, để học viên của lớp nhận đúng lịch mà không bị trùng với lớp khác.
- **US-AD-21 (Batch Staff Assignment)**: Là một admin, tôi muốn chỉ định Trainer chính và TA phụ trách cho từng Batch bằng thao tác chọn người đơn giản, để phân rõ trách nhiệm hỗ trợ học viên và theo dõi tiến độ nộp bài.

#### Học viên & Quản lý Bài nộp (Zero-Friction Submission Tracking)
- **US-AD-22 (Focused Submissions Monitor)**: Là một trainer/TA, tôi muốn mở danh sách bài nộp của riêng Batch mình, xem link Facebook Group của học viên, theo dõi tiến độ hoàn thành bài tập và để lại phản hồi (feedback) hỗ trợ trên một giao diện phẳng, mượt mà.


### Emotional Stories

- **US-AD-06**: Là một admin, tôi muốn có một không gian làm việc tối giản, thoáng đãng (Apple-like Cleanliness), hiển thị đúng những thông tin trọng yếu mà không bị quá tải bởi quá nhiều badge hay dữ liệu thừa. _(Từ JTBD #6)_
- **US-AD-07**: Là một admin, tôi muốn hệ thống tự động hỗ trợ học viên tìm câu trả lời và nguồn lực khi tôi không thể theo sát từng người, để yên tâm về trải nghiệm học tập của họ. _(Từ JTBD #7)_

### Social Stories

- **US-AD-09**: Là một admin, tôi muốn hệ thống giúp ghi nhận và lan tỏa những thành tựu của học viên theo từng Batch, để tạo ra các câu chuyện thành công và động lực cho toàn cộng đồng. _(Từ JTBD #9)_
