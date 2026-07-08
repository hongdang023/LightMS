# LightMS - B2: Database Schema (Thiết kế Cơ sở dữ liệu)

Hệ thống sử dụng **PostgreSQL** trên nền tảng **Supabase**. Cấu trúc dưới đây được thiết kế tối ưu cho mô hình Outcome-based Mastery, Action-Oriented và tương tác cộng đồng.

---

## 1. User & Access Management (Quản lý Người dùng)

Do sử dụng Supabase, việc xác thực (Authentication) được quản lý qua bảng mặc định `auth.users` của Supabase. Chúng ta thiết kế bảng `profiles` (hoặc `users` public) liên kết 1-1 với `auth.users` để lưu thông tin nghiệp vụ.

### `profiles` (Hồ sơ người dùng)

| Column Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | PK, FK (`auth.users.id`) | Liên kết với Supabase Auth |
| `full_name` | `text` | NOT NULL | Họ và tên |
| `avatar_url` | `text` | | Link ảnh đại diện |
| `role` | `enum` | `'student', 'mentor', 'admin'` | Phân quyền RLS |
| `telegram_id` | `text` | UNIQUE | Dùng để Bot bắn tin nhắn tự động |
| `bio` | `text` | | Giới thiệu bản thân |
| `gmail` | `text` | | Email liên kết Google Workspace/Calendar |
| `phone_number` | `text` | | Số điện thoại liên hệ (Zalo) |
| `facebook_url` | `text` | | Đường dẫn đến profile Facebook cá nhân |
| `industry` | `text` | | Lĩnh vực hoạt động chuyên môn |
| `current_job` | `text` | | Công việc/Chức danh hiện tại |
| `tech_level` | `enum` | `'non-tech', 'low-code', 'coder'` | Trình độ kỹ thuật của học viên |
| `product_idea` | `text` | | Ý tưởng sản phẩm số dự kiến xây dựng |
| `weekly_hours_commitment` | `int` | | Số giờ cam kết tự học/build mỗi tuần |
| `motivation_bet` | `text` | | Đặt cược cá nhân tạo động lực cam kết |
| `is_profile_completed` | `boolean` | DEFAULT `false` | Đánh dấu đã khai báo đầy đủ 100% profile |
| `nautical_miles` | `int` | DEFAULT 0 | Tổng số Hải lý (Điểm tích lũy Gamification) |
| `referral_source` | `text` | | Bạn biết tới khoá học này từ đâu? (Lựa chọn từ danh sách) |
| `current_role` | `text` | | Vai trò hiện tại của bạn? (Lựa chọn từ danh sách) |
| `work_field` | `text` | | Bạn đang học/làm trong lĩnh vực gì? (Lựa chọn từ danh sách) |
| `living_region` | `text` | | Hiện tại bạn đang sinh sống ở khu vực nào? (Lựa chọn từ danh sách) |
| `gender` | `text` | | Giới tính (Nam, Nữ, Other) |
| `age_group` | `text` | | Bạn năm nay bao nhiêu tuổi? (Lựa chọn từ danh sách) |
| `created_at` | `timestamptz` | DEFAULT `now()` | |

### `enrollments` (Ghi danh / Tham gia Batch)

| Column Name  | Type          | Constraints              | Description                    |
| :----------- | :------------ | :----------------------- | :----------------------------- |
| `id`         | `uuid`        | PK                       |                                |
| `student_id` | `uuid`        | FK (`profiles.id`)       | Học viên                       |
| `batch_id`   | `uuid`        | FK (`batches.id`)        | Lớp học (Batch)                |
| `status`     | `enum`        | `'active', 'graduated'`  | Trạng thái học tập             |
| `joined_at`  | `timestamptz` | DEFAULT `now()`          |                                |

---

## 2. Course, Cohorts & Learning Materials (Khóa học & Lớp học)

### `courses` (Khóa học)

| Column Name   | Type   | Constraints | Description                      |
| :------------ | :----- | :---------- | :------------------------------- |
| `id`          | `uuid` | PK          |                                  |
| `title`       | `text` | NOT NULL    | Tên khóa học                     |
| `description` | `text` |             | Giới thiệu tổng quan (Rich-text) |
| `cover_image` | `text` |             | Ảnh bìa                          |

### `batches` (Lớp học / Cohorts)

| Column Name  | Type   | Constraints       | Description                                  |
| :----------- | :----- | :---------------- | :------------------------------------------- |
| `id`         | `uuid` | PK                |                                              |
| `course_id`  | `uuid` | FK (`courses.id`) | Batch này thuộc Khóa học nào                 |
| `name`       | `text` | NOT NULL          | Tên lớp (VD: DA-Batch 1)                     |
| `start_date` | `date` |                   | Ngày khai giảng                              |
| `end_date`   | `date` |                   | Ngày bế giảng                                |
| `mentor_id`  | `uuid` | FK (`profiles.id`)| Mentor phụ trách chính                       |

### `batch_schedules` (Lịch trình chi tiết của Lớp)

Bảng này ánh xạ bài học vào ngày thực tế của lớp, cho phép chèn lịch nghỉ và dời lịch tự động (auto-shifting).

| Column Name      | Type      | Constraints           | Description                                  |
| :--------------- | :-------- | :-------------------- | :------------------------------------------- |
| `id`             | `uuid`        | PK                    |                                              |
| `batch_id`       | `uuid`        | FK (`batches.id`)     | Thuộc lớp nào                                |
| `lesson_id`      | `uuid`        | FK (`lessons.id`)     | Bài học tương ứng (có thể NULL nếu là tuần nghỉ)|
| `scheduled_at`   | `timestamptz` | NOT NULL              | Ngày/giờ dự kiến học hoặc mở khóa (Onboarding)|
| `unlock_email_sent`| `boolean`   | DEFAULT `false`       | Cờ đánh dấu đã gửi email tự động hay chưa    |
| `is_holiday`     | `boolean`     | DEFAULT `false`       | Đánh dấu đây là một tuần/ngày nghỉ lễ        |
| `notes`          | `text`        |                       | Ghi chú thêm về lịch trình này               |

### `modules` (Chương / Phần)

| Column Name   | Type   | Constraints       | Description                      |
| :------------ | :----- | :---------------- | :------------------------------- |
| `id`          | `uuid` | PK                |                                  |
| `course_id`   | `uuid` | FK (`courses.id`) | Khóa học chứa module này         |
| `title`       | `text` | NOT NULL          | Tên module (VD: Tuần Onboarding) |
| `order_index` | `int`  |                   | Thứ tự sắp xếp                   |
| `unlock_at`   | `timestamptz` |            | Hẹn giờ mở khóa tự động (nếu có) |

### `lessons` (Bài học)

| Column Name   | Type   | Constraints           | Description                        |
| :------------ | :----- | :-------------------- | :--------------------------------- |
| `id`          | `uuid` | PK                    |                                    |
| `module_id`   | `uuid` | FK (`modules.id`)     | Module chứa bài học này            |
| `title`       | `text` | NOT NULL              | Tên bài học                        |
| `type`        | `enum` | `'video', 'document'` | Phân loại bài học                  |
| `content`     | `text` |                       | Nội dung text/tài liệu (Rich-text) |
| `video_url`   | `text` |                       | Đường link bảo mật xem video       |
| `order_index` | `int`  |                       | Thứ tự hiển thị                    |
| `start_date`  | `date` |                       | Ngày học/mở khóa                   |
| `target`      | `text` |                       | Mục tiêu của bài học               |
| `has_materials`| `boolean`| DEFAULT `false`    | Trạng thái có tài liệu học tập     |
| `slide_url`   | `text` |                       | Đường link tài liệu Slide          |
| `study_note_url`| `text`|                       | Đường link tài liệu Study Notes    |

---

## 3. Progress Tracking (Theo dõi Tiến độ học tập)

Hệ thống không sử dụng bảng `skills` để đánh giá theo chuẩn năng lực (Outcome-based). Thay vào đó, tiến trình và kết quả học tập của Học viên được tính toán hoàn toàn tự động dựa trên **mức độ hoàn thành bài tập về nhà (Assignments)**. 

Học viên được xem là hoàn thành một bài học/bài tập khi có một bản ghi trong bảng `submissions` có trạng thái `status` là `'submitted'` hoặc `'graded'`. Điểm số và mức độ hoàn thành được ghi nhận trực tiếp qua thuộc tính đánh giá trong bảng `feedbacks`.

---

---

## 4. Assignments & Action-Oriented (Bài tập & Thực hành)

### `assignments` (Yêu cầu Bài tập)

| Column Name        | Type    | Constraints       | Description                                                   |
| :----------------- | :------ | :---------------- | :------------------------------------------------------------ |
| `id`               | `uuid`  | PK                |                                                               |
| `lesson_id`        | `uuid`  | FK (`lessons.id`) | Đi kèm bài học nào (Prerequisites)                            |
| `description`      | `text`  | NOT NULL          | Đề bài (Rich-text)                                            |
| `rubric_checklist` | `jsonb` |                   | Dùng để Tự đánh giá (VD: `[{"item": "X", "checked": false}]`) |
| `scaffolding`      | `jsonb` |                   | Chứa Template mẫu hoặc Link bài mẫu tham khảo                 |

### `submissions` (Bài nộp của Học viên)

| Column Name     | Type          | Constraints                      | Description                                  |
| :-------------- | :------------ | :------------------------------- | :------------------------------------------- |
| `id`            | `uuid`        | PK                               |                                              |
| `assignment_id` | `uuid`        | FK (`assignments.id`)            | Nộp cho bài tập nào                          |
| `batch_id`      | `uuid`        | FK (`batches.id`)                | Giới hạn hiển thị trong Batch này            |
| `student_id`    | `uuid`        | FK (`profiles.id`)               | Người nộp                                    |
| `content`       | `text`        |                                  | Bài làm (Rich-text: có chèn ảnh/link)        |
| `status`        | `enum`        | `'draft', 'submitted', 'graded'` | Trạng thái (Trigger mở khóa video tiếp theo) |
| `upvotes_count` | `int`         | DEFAULT 0                        | Số lượng Kudos (thả tim) nhận được           |
| `upvoted_by`    | `text[]`      |                                  | Danh sách ID học viên đã thả tim             |
| `created_at`    | `timestamptz` | DEFAULT `now()`                  |                                              |

### `feedbacks` (Đánh giá của Mentor)

| Column Name     | Type   | Constraints                                              | Description                   |
| :-------------- | :----- | :------------------------------------------------------- | :---------------------------- |
| `id`            | `uuid` | PK                                                       |                               |
| `submission_id` | `uuid` | UNIQUE, FK (`submissions.id`)                            | Feedback cho bài nào          |
| `mentor_id`     | `uuid` | FK (`profiles.id`)                                       | Mentor chấm                   |
| `content`       | `text` | NOT NULL                                                 | Nhận xét chi tiết (Rich-text) |
| `mastery_level` | `enum` | `'needs_improvement', 'meets_expectations', 'excellent'` | Kết quả Đạt / Chưa đạt        |

---

## 5. Community & Discussion (Cộng đồng)

Hệ thống thảo luận bao gồm bình luận dưới các bài nộp bài tập (`submissions`), các bài nộp hoạt động như các threads thảo luận riêng biệt.

### `comments` (Bình luận)

| Column Name     | Type          | Constraints           | Description               |
| :-------------- | :------------ | :-------------------- | :------------------------ |
| `id`            | `uuid`        | PK                    |                           |
| `submission_id` | `uuid`        | FK (`submissions.id`) | Bình luận vào bài nộp nào |
| `batch_id`      | `uuid`        | FK (`batches.id`)     | Giới hạn hiển thị trong Batch |
| `author_id`     | `uuid`        | FK (`profiles.id`)    | Người bình luận           |
| `content`       | `text`        | NOT NULL              | Nội dung (Rich-text)      |
| `upvotes_count` | `int`         | DEFAULT 0             | Tổng số lượt thả tim      |
| `is_verified`   | `boolean`     | DEFAULT false         | Tích xanh (cho lên Top)   |
| `upvoted_by`    | `text[]`      |                      | Danh sách ID học viên đã thả tim |
| `created_at`    | `timestamptz` | DEFAULT `now()`       |                           |

---

## 6. Gamification & Rewards (Hệ thống Trò chơi hóa)

Để vận hành hệ thống phần thưởng, chúng ta định nghĩa thêm các bảng quản lý giao dịch Hải lý và Huy hiệu học viên.

### `nautical_miles_transactions` (Lịch sử giao dịch Hải lý)

| Column Name   | Type          | Constraints            | Description                                                |
| :------------ | :------------ | :--------------------- | :--------------------------------------------------------- |
| `id`          | `uuid`        | PK                     |                                                            |
| `student_id`  | `uuid`        | FK (`profiles.id`)     | Thủy thủ nhận điểm                                         |
| `amount`      | `int`         | NOT NULL               | Số Hải lý cộng/trừ (Ví dụ: +50, -10)                       |
| `action_type` | `text`        | NOT NULL               | Loại hành động (VD: 'profile_completion', 'assignment_graded') |
| `reference_id`| `uuid`        |                        | Khóa ngoại tham chiếu (VD: ID bài nộp, ID comment)          |
| `description` | `text`        | NOT NULL               | Nội dung chi tiết giao dịch (VD: "Hoàn thành Onboarding")  |
| `created_at`  | `timestamptz` | DEFAULT `now()`        | Thời điểm thực hiện                                        |

### `badges` (Danh mục Huy hiệu)

| Column Name   | Type   | Constraints | Description                                       |
| :------------ | :----- | :---------- | :------------------------------------------------ |
| `id`          | `uuid` | PK          |                                                   |
| `name`        | `text` | NOT NULL    | Tên huy hiệu (VD: Cánh buồm no gió, Thẻ căn cước) |
| `icon`        | `text` | NOT NULL    | Biểu tượng cảm xúc hoặc link hình ảnh             |
| `description` | `text` |             | Điều kiện mở khóa và ý nghĩa                      |

### `profile_badges` (Học viên sở hữu Huy hiệu)

| Column Name  | Type          | Constraints           | Description          |
| :----------- | :------------ | :-------------------- | :------------------- |
| `student_id` | `uuid`        | PK, FK (`profiles.id`)| Thủy thủ sở hữu      |
| `badge_id`   | `uuid`        | PK, FK (`badges.id`)  | Huy hiệu đã mở khóa  |
| `unlocked_at`| `timestamptz` | DEFAULT `now()`       | Thời điểm mở khóa    |

---

## 7. Announcements (Thông báo)

### `announcements` (Thông báo của Khóa học/Lớp học)

| Column Name     | Type          | Constraints            | Description                                  |
| :-------------- | :------------ | :--------------------- | :------------------------------------------- |
| `id`            | `uuid`        | PK                     |                                              |
| `course_id`     | `uuid`        | FK (`courses.id`)      | Thông báo chung cho toàn khóa học (nếu có)   |
| `batch_id`      | `uuid`        | FK (`batches.id`)      | Thông báo riêng cho lớp học (nếu có)         |
| `title`         | `text`        | NOT NULL               | Tiêu đề thông báo                            |
| `content`       | `text`        | NOT NULL               | Nội dung thông báo (Rich-text)               |
| `created_by`    | `uuid`        | FK (`profiles.id`)     | Admin/Mentor tạo thông báo                   |
| `send_email`    | `boolean`     | DEFAULT `false`        | Cờ đánh dấu có gửi email tự động hay không   |
| `sent_email_at` | `timestamptz` |                        | Thời điểm đã gửi email (NULL nếu chưa gửi)   |
| `media_urls`    | `text[]`      | DEFAULT `'{}'`         | Danh sách link ảnh/video đính kèm thông báo  |
| `created_at`    | `timestamptz` | DEFAULT `now()`        |                                              |

---

## 8. Onboarding & Calendar Schedule (Lịch học & Onboarding)

### `onboarding_days` (Chi tiết ngày Onboarding)

| Column Name   | Type          | Constraints        | Description                                  |
| :------------ | :------------ | :----------------- | :------------------------------------------- |
| `day`         | `int`         | PK                 | Số ngày (Từ 1 đến 7)                         |
| `title`       | `text`        | NOT NULL           | Tiêu đề ngày học                             |
| `description` | `text`        |                    | Mô tả ngắn về nhiệm vụ                       |
| `task`        | `text`        |                    | Chi tiết thử thách cần làm                   |
| `scheduled_at`| `timestamptz` |                    | Thời điểm mở khóa tự động                    |

### `calendar_events` (Lịch học và sự kiện lớp học)

| Column Name   | Type          | Constraints        | Description                                  |
| :------------ | :------------ | :----------------- | :------------------------------------------- |
| `id`          | `uuid`        | PK                 |                                              |
| `title`       | `text`        | NOT NULL           | Tiêu đề buổi học/sự kiện                     |
| `time`        | `text`        | NOT NULL           | Giờ bắt đầu (Ví dụ: '20:00')                 |
| `end_time`    | `text`        |                    | Giờ kết thúc (Ví dụ: '22:00')                |
| `all_day`     | `boolean`     | DEFAULT `false`    | Sự kiện cả ngày                              |
| `date`        | `int`         |                    | Ngày cụ thể trong tháng (1-31)               |
| `month`       | `int`         |                    | Tháng cụ thể (0-11)                          |
| `year`        | `int`         |                    | Năm cụ thể                                   |
| `day_of_week` | `int`         |                    | Thứ trong tuần (1: Thứ hai - 7: Chủ nhật)    |
| `start_recur` | `bigint`      |                    | Timestamp bắt đầu lặp sự kiện                |
| `end_recur`   | `bigint`      |                    | Timestamp kết thúc lặp sự kiện               |
| `color_class` | `text`        |                    | CSS Class quy định màu sắc hiển thị          |
| `type`        | `text`        |                    | Loại chính: 'class', 'community', 'other'    |
| `event_type`  | `text`        |                    | Phân loại: 'kick-off', 'office-hour', 'live-class', 'onboarding', 'capstone', 'class-bonding' |
| `details`     | `text`        |                    | Chi tiết nội dung/link mô tả sự kiện         |
