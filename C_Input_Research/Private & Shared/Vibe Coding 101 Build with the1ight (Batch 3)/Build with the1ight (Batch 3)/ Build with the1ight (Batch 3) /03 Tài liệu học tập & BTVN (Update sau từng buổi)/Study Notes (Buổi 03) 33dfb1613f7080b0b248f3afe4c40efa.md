# Study Notes (Buổi 03)

# 📝 Tư duy Thiết kế & Công cụ Prototype: Từ Nỗi đau đến Aha Moment

## 🎯 1. Tóm tắt chung (Executive Summary)

Buổi học tập trung vào việc định nghĩa lại vai trò của thiết kế (Design) trong phát triển sản phẩm, chuyển dịch từ tư duy thẩm mỹ thuần túy sang tư duy giải quyết vấn đề. Nội dung cốt lõi hướng dẫn cách thấu hiểu "nỗi đau" của người dùng để thiết kế các điểm chạm cảm xúc (Aha Moments) thông qua ba lớp trải nghiệm UI, UX và CX. Đồng thời, buổi học cũng giới thiệu phương pháp tạo Prototype "xấu nhưng đủ" và cách tận dụng các công cụ AI hiện đại để hiện thực hóa ý tưởng sản phẩm một cách nhanh chóng và hiệu quả.

## 💡 2. Các điểm nhấn quan trọng (Key Takeaways)

- **Design bắt đầu từ nỗi đau:** Điểm khởi đầu của một thiết kế tốt không phải là màu sắc hay font chữ, mà là một người đang gặp khó khăn cụ thể.
- **Sự khác biệt giữa Đẹp và Tốt:** Design đẹp tập trung vào thẩm mỹ, nhưng Design tốt phải đảm bảo tính tiện dụng (Usability) và dẫn dắt người dùng giải quyết vấn đề mà họ không nhận ra mình đang bị dẫn dắt.
- **Thang đo Aha (Aha Ladder):** Sự thành công của sản phẩm phụ thuộc vào việc rút ngắn khoảng cách từ lúc người dùng bắt đầu sử dụng đến khi họ đạt được "Aha Moment" – khoảnh khắc nhận ra giá trị thực sự.
- **Nguyên lý Prototype:** Tốc độ học hỏi tỉ lệ nghịch với độ hoàn thiện của Prototype. Hãy làm "xấu-nhưng-đủ" để nhận phản hồi nhanh nhất thay vì cố gắng hoàn hảo ngay từ đầu.
- **Cấu trúc trải nghiệm:** UI (nhìn thấy) \subset UX (cảm thấy) \subset CX (nhớ lại).

## 📖 3. Nội dung chi tiết

### 3.1. Bản chất của Design và Design Thinking

- **Định nghĩa:** Design tốt là phải dẫn dắt được người dùng từ trạng thái "đang đau" đến "hết đau" một cách mượt mà.
- **Design Thinking:** Không phải là một đường thẳng mà là một vòng xoáy hỗn loạn. Mỗi vòng lặp giúp hiểu sâu hơn về nỗi đau của người dùng. Khi gặp bế tắc, điểm neo duy nhất là quay lại "Không gian vấn đề" (Problem Space).
- **Nguyên tắc sáng tạo:** Đừng thiết kế lại những gì đã có trừ khi bạn có thể làm nó tốt hơn cái cũ.

### 3.2. Ba lớp của Trải nghiệm (UI ⊂ UX ⊂ CX)

| Lớp | Tên gọi | Định nghĩa |
| --- | --- | --- |
| **UI** | User Interface | Cái người dùng nhìn thấy: Màu sắc, nút bấm, bố cục. Đây là lớp ngoài cùng. |
| **UX** | User Experience | Cái người dùng cảm thấy: Hành trình đi qua nhiều màn hình để đạt mục tiêu. |
| **CX** | Customer Experience | Cái người dùng nhớ lại: Toàn bộ mối quan hệ với sản phẩm theo thời gian (từ lúc biết đến khi giới thiệu bạn bè). |
- **Nhiệm vụ của Design:** Dắt người dùng vào vòng lặp giá trị.
    - *Dắt lộ liễu (Nên tránh):* Dùng Popup ép đăng ký, đếm ngược giả tạo, nút từ chối mờ nhạt (Dark patterns). Khiến người dùng cảm thấy bị lừa.
    - *Dắt khéo (Nên làm):* Giá trị xuất hiện trước khi yêu cầu cam kết, luồng đi tự nhiên, người dùng tự muốn đi tiếp vì thấy có lợi.

### 3.3. Thang đo Aha (Aha Ladder)

Để một sản phẩm được chấp nhận (Adoption), người dùng phải đi qua các cung bậc:

1. **Problem (Nỗi đau):** Người dùng đang gặp vấn đề cụ thể.
2. **Aha 1 - "Nó hiểu mình":** Sản phẩm dùng đúng ngôn ngữ và bối cảnh của người dùng.
3. **Aha 2 - "Nó làm được thật":** Người dùng tự tay thực hiện và thấy kết quả thực tế (ví dụ: Notion kéo thả khối đầu tiên, Figma thấy người khác cùng chỉnh sửa real-time).
4. **Aha 3 - "Không muốn quay lại cách cũ":** Hình thành thói quen mới (ví dụ: ChatGPT đưa câu trả lời đúng ngay lần đầu thay vì phải tìm trên Google).
5. **Adoption:** Người dùng vào vòng lặp giá trị và bắt đầu ở lại (Retention).

### 3.4. Các góc nhìn Design (Zoom Levels)

- **Zoom Xa - Customer Journey (CX):** Toàn bộ lộ trình người dùng từ lúc nghe tên sản phẩm đến khi giới thiệu người khác.
- **Zoom Vừa - User Stories:** Các phân đoạn giá trị cụ thể (Ví dụ: "Là một người dùng X, tôi muốn Y, để đạt được Z").
- **Zoom Gần - User Flow (UX):** Từng bước bấm cụ thể. Nguyên tắc: Càng ít bước trước Aha Moment càng tốt. Nếu một Story không tạo ra Aha Moment, Story đó có thể không cần thiết.

### 3.5. Prototype và Công cụ AI

- **Triết lý:** Prototype là phiên bản mô phỏng để kiểm tra giả định. Càng đẹp thì càng chậm và ít vòng lặp. Cần tập trung vào việc "Hoàn thành quan trọng hơn hoàn hảo".
- **Phân loại Prototype:**
    - *Truyền thống:* Từ Low-fi (giấy, wireframe) đến High-fi (Figma pixel-perfect).
    - *Kỷ nguyên AI:* Tập trung vào UI Only (test vị trí Aha), Logic Integrated (test luồng hoạt động), và Back-end Integrated (kết nối dữ liệu thật).
- **Công cụ AI (Cập nhật đến 2026):** Bao gồm Lovable, v0, Bolt, Claude Artifacts, Google AI Studio... giúp người non-tech tạo sản phẩm nhanh chóng.

## 🚀 4. Hành động cần làm (Action Items)

### 4.1. Bài tập về nhà Phần 1: Nghịch thử và Kiểm thử (30-60 phút)

- **Nhiệm vụ:** Chọn ít nhất 2 công cụ AI trong danh sách (Lovable, v0, Figma Make, Canva Code, Bolt, Claude Artifacts, Google AI Studio).
- **Yêu cầu:**
    - Prompt tạo 1 màn hình duy nhất cho MVP.
    - Bắt buộc chỉnh sửa prompt ít nhất 3 lần để học cách điều khiển tool.
- **Đầu ra:** Chụp ảnh màn hình, kèm prompt cuối và 1 câu cảm nhận về ưu/nhược điểm của mỗi tool, đăng lên nhóm Facebook với hashtag `#Buoi_3_Part_1`.

### 4.2. Bài tập về nhà Phần 2: Bản đồ Aha Moment (30 phút)

- **Nhiệm vụ:** Hoàn thiện sơ đồ tư duy cho sản phẩm dựa trên bài tập buổi 2.
- **Yêu cầu:**
    1. Chốt 1 vấn đề đau nhất: Viết dưới dạng "X đang khổ vì Y, hiện tại đang phải Z".
    2. Định nghĩa MVP: Làm đúng 1 việc giúp bớt khổ (không quá 3 tính năng).
    3. Vẽ Customer Journey qua 5 giai đoạn: Biết đến \rightarrow Thử \rightarrow Onboarding \rightarrow Dùng lặp lại \rightarrow Giới thiệu.
    4. Rải Aha Moment: Xác định tính năng nào tạo ra Aha ở từng giai đoạn.
- **Đầu ra:** Thêm vào cuối bài tập buổi 2, đăng lên nhóm Facebook với hashtag `#Buoi_3_Part_2`.

### 4.3. Khảo sát cuối buổi

- Hoàn thành khảo sát ẩn danh (3 câu hỏi) để cải thiện chất lượng khóa học.