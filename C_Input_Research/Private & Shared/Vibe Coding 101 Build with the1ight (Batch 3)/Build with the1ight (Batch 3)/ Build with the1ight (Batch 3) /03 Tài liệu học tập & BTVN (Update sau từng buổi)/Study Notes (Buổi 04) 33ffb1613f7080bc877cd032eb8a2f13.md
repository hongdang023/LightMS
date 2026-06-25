# Study Notes (Buổi 04)

# 📝 Buổi 4: Kỹ Thuật Viết Problem Statement và Xây Dựng Bản PRD Toàn Diện

## 🎯 1. Tóm tắt chung (Executive Summary)

Buổi học tập trung vào việc chuyển dịch tư duy từ việc "nhảy ngay vào giải pháp" sang việc thấu hiểu sâu sắc "không gian vấn đề" (Problem Space). Nội dung chính bao gồm cách định nghĩa vấn đề thông qua Problem Statement, sử dụng các khung tư duy như 5W1H và 5-Whys để tìm ra nguyên nhân gốc rễ, và giới thiệu về Product Requirement Document (PRD) – được ví như "tấm bản đồ đạo tặc" để dẫn dắt quá trình phát triển sản phẩm hiệu quả. Mục tiêu cuối cùng là giúp người học viết được vấn đề chuẩn xác để tìm ra giải pháp tối ưu nhất.

## 💡 2. Các điểm nhấn quan trọng (Key Takeaways)

- **Ưu tiên Problem Space:** Phần lớn thời gian phát triển sản phẩm nên được dành cho việc khám phá và định nghĩa vấn đề thay vì vội vã đưa ra giải pháp.
- **Công thức Problem Statement:** Cấu trúc chuẩn bao gồm: `[Người dùng]` cần `[Nhu cầu]` bởi vì `[Insight/Thông tin thấu cảm]`.
- **Truy tìm nguyên nhân gốc rễ (Root Cause):** Sử dụng phương pháp 5-Whys để bóc tách các lớp bề mặt của vấn đề cho đến khi tìm ra nguyên nhân cốt lõi.
- **PRD là công cụ cộng tác:** PRD không chỉ là tài liệu kỹ thuật mà còn là phương tiện để làm việc với máy móc và con người hiệu quả hơn gấp nhiều lần.
- **Sự hỗ trợ của AI:** Các công cụ như ChatGPT, Grok và đặc biệt là Claude (mạnh về yêu cầu kỹ thuật) có thể hỗ trợ đắc lực trong việc cải thiện Problem Statement và xây dựng PRD.

## 📖 3. Nội dung chi tiết

### 3.1. Thấu hiểu không gian vấn đề (Problem Space)

Tài liệu nhấn mạnh mô hình "Double Diamond" (Kim cương kép) trong thiết kế sản phẩm, chia làm hai giai đoạn lớn:

- **Giai đoạn 1 (Problem Space):** Bao gồm Khám phá (Discover) và Định nghĩa (Define). Đây là nơi cần dành nhiều thời gian nhất để hiểu rõ tất cả các vấn đề liên quan, nguyên nhân và tác động hệ quả.
- **Giai đoạn 2 (Solution Space):** Bao gồm Phát triển (Develop) và Chuyển giao (Deliver). Chỉ khi đã xác định đúng vấn đề qua câu hỏi "How might we" (Chúng ta có thể làm thế nào), mới bắt đầu tìm kiếm giải pháp.
- **Thực trạng:** Đa số mọi người đều không biết cách viết ra vấn đề của mình một cách rõ ràng để có thể giải quyết được.

### 3.2. Viết Problem Statement chuẩn xác

Việc định nghĩa vấn đề sai lệch sẽ dẫn đến giải pháp vô ích. Có 4 lỗi phổ biến cần tránh:

1. **Nhảy ngay vào giải pháp:** Ví dụ thay vì nói "Cần chatbot", hãy nói "Người dùng không nhận được phản hồi kịp thời".
2. **Mô tả mơ hồ:** Tránh nói "Không tiện dùng", hãy chỉ rõ "Cái gì khó dùng và với ai".
3. **Không rõ đối tượng cụ thể:** Cần có tên và mô tả vai trò rõ ràng cho đối tượng gặp vấn đề.
4. **Cảm tính, thiếu insight:** Không dựa trên việc "CEO bảo thế" mà phải dựa trên quan sát và số liệu thực tế.

**Cấu trúc mẫu:**

**[Ariana]** là **[một sinh viên mới tốt nghiệp]** người đang cần **[nộp càng nhiều hồ sơ càng tốt mà không bỏ lỡ các tin tuyển dụng mới nhất]** bởi vì **[cô ấy chưa có kinh nghiệm chuyên môn và muốn bắt đầu sự nghiệp càng sớm càng tốt]**.

### 3.3. Các khung tư duy xác định nhu cầu (Frameworks)

Để hiểu sâu vấn đề, buổi học giới thiệu hai khung tư duy chủ đạo:

| Framework | Nội dung chi tiết |
| --- | --- |
| **5W1H** | **Who** (Ai dùng, ai liên quan), **What** (Sản phẩm giải quyết gì), **Where** (Dùng ở đâu, thiết bị gì), **When** (Khi nào dùng, deadline), **Why** (Tại sao cần, giá trị mang lại), **How** (Nguyên tắc thiết kế, đo lường). |
| **5-Whys** | Đặt câu hỏi "Tại sao" liên tiếp ít nhất 5 lần để đào sâu từ hiện tượng bề mặt đến nguyên nhân gốc rễ (Root Cause). |

**Ví dụ về 5-Whys:**

- Vấn đề: Nhân viên bị gãy ngón chân.
- Tại sao: Kiện hàng rơi vào chân -> Nhân viên làm rơi -> Kiện hàng bị trơn trượt khỏi tay -> Kiện hàng vượt quá trọng lượng cho phép -> Cái cân bị sai lệch thông số.
- => Nguyên nhân gốc rễ là cái cân, không phải do nhân viên vụng về.

### 3.4. Product Requirement Document (PRD)

PRD được định nghĩa là "tấm bản đồ đạo tặc", giúp định hướng cho cả đội ngũ và máy móc:

- **Vai trò:** Giúp hiện thực hóa ý tưởng thành mô tả cụ thể về cách làm (HOW).
- **Hiệu quả:** Sử dụng PRD giúp làm việc với máy tính nhanh hơn nhiều lần so với cách làm thủ công.
- **Mẹo ứng dụng AI:** Có thể sử dụng Prompt để AI (như Claude) đóng vai trò một Experience Product Manager giúp cải thiện Problem Statement và phân tích 5-Whys/5W1H.

## 🚀 4. Hành động cần làm (Action Items)

- **Hoàn thành bài tập:** Áp dụng công thức Problem Statement và PRD cho sản phẩm đang xây dựng.

—

Khác

- **Tham gia Office Hour:** Diễn ra từ **9h00 - 10h00 sáng Thứ Bảy** hàng tuần. Cách thức: Vào phòng chat Light Support và vote ngày tham gia.
- **Đăng ký Capstone Day (Vibe Coding 201):**
    - **Pitching Day 01 (Online):** 09h00 - 11h00, Chủ Nhật ngày 12/04.
    - **Pitching Day 02 (Online):** 09h00 - 11h00, Chủ Nhật ngày 19/04.
    - **Cafe Bonding (Offline):** 15h00 - 18h00 ngày 19/04 tại Hà Nội và TP. HCM (Hạn chót đăng ký Offline là 23h59 ngày 15/04).