# LightMS - A6: Quy định về Gamification (Trò chơi hóa)

> **Last Updated:** 2026-08-07 | **Status:** ✅ Synced với B2_Database_Schema

Để duy trì động lực (Emotional) và tăng tính gắn kết cộng đồng (Social), LightMS áp dụng hệ thống Gamification xuyên suốt khóa học. 

**Theme chủ đạo:** 🌊 **"Hải trình vượt biển cùng The1ight"**
Học viên sẽ hóa thân thành những Thủy thủ, cùng nhau vượt qua các vùng biển kiến thức (chương trình), đối mặt với sóng gió (Assignments) để tìm kiếm các kho báu năng lực và vươn lên trở thành những Thuyền trưởng xuất sắc.

---

## 1. Hành vi được hưởng ứng và Cách tính điểm (Hải lý)

Điểm kinh nghiệm trong hệ thống được gọi là **Hải lý (Nautical Miles)**. Tàu đi được càng xa chứng tỏ sự nỗ lực và đóng góp của học viên càng lớn.

### Nhóm 1: Khởi động & Hoàn thiện Hồ sơ (Setting Sail)
- **Hoàn thành khai báo 100% Profile (lần đầu):** +50 Hải lý (`profile_completion`).
- **Hoàn thành mỗi ngày Onboarding (Day 1 - Day 7):** +50 Hải lý / ngày (`onboarding_day_complete`) — check-off hết các task bắt buộc trong ngày.

### Nhóm 2: Tiến độ Học tập (Sailing Speed)
- **Hoàn thành bài học không có bài tập:** +20 Hải lý (`lesson_complete`).
- **Hoàn thành bài học có bài tập** (tự đối chiếu đủ Rubric Checklist): +50 Hải lý (`assignment_graded`).

---


## 2. Bảng xếp hạng (Leaderboard - Skool & Duolingo Style)

Thay vì chỉ có một Wall of Fame nhàm chán, hệ thống áp dụng triết lý thiết kế của **Skool** và **Duolingo**:
- **Trực quan & Cạnh tranh:** Bảng xếp hạng (Leaderboard) thiết kế rõ ràng top 3 dẫn đầu, khuyến khích học viên cạnh tranh lành mạnh.
- **Tôn vinh liên tục:** Hệ thống tự động ghi nhận chuỗi ngày học liên tục (Streak) và điểm số tích lũy, giúp mọi người đều thấy được sự nỗ lực của mình dù không đứng top 1.

---

## 3. Các dạng Huy hiệu (Badges / Achievements)

Huy hiệu được trưng bày trực quan tại khu vực **Bảng vinh danh (Wall of Fame)**:


### Danh sách Huy hiệu Hành động (Action Badges)
Được mở khóa khi thực hiện các hoạt động đặc biệt hoặc hoàn thành các thử thách cụ thể:
- 🪪 **Thẻ Căn Cước Thủy Thủ:** Khai báo thông tin cá nhân đầy đủ 100% trên Hồ sơ.
- ⛵ **Cánh Buồm Khởi Hành:** Đặt chân lên tàu và hoàn thành ngày học Onboarding đầu tiên.
- 🌊 **Vượt Sóng Băng Băng:** Giữ vững phong độ, hoàn thành mốc 3 ngày Onboarding đầu tiên.
- ⚓ **Thủy Thủ Lão Luyện:** Xuất sắc chinh phục trọn vẹn hành trình 7 ngày Onboarding.
- 📝 **Bài Tập Đầu Tay:** Khởi đầu hành trình rèn luyện với bài tập về nhà đầu tiên được hoàn thành.
- ✍️ **Thủy Thủ Chăm Chỉ:** Tinh thần kiên trì rèn luyện, hoàn thành mốc 3 bài tập về nhà.
- 🧑‍✈️ **Thuyền Trưởng Gương Mẫu:** Tinh thần kỷ luật thép. Hoàn thành đầy đủ 100% bài tập về nhà của khóa học.
