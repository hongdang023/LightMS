# Study Notes (Buổi 07)

# 📝 Buổi 07: Từ Vibe Coding đến IDE & AI Agent – Làm Chủ Quy Trình Phát Triển Sản Phẩm

## 🎯 1. Tóm tắt chung (Executive Summary)

Buổi học tập trung vào sự chuyển dịch từ việc sử dụng các công cụ Vibe Coding trên nền tảng Web (như Lovable, Bolt) sang làm việc trực tiếp trên IDE (Môi trường phát triển tích hợp) và AI Agent tại máy cục bộ (Local). Mục tiêu chính là giúp người học hiểu rõ cấu trúc của một AI Agent, cách vận hành IDE Antigravity, và kỹ năng điều phối Agent như một "Captain" (Thuyền trưởng) thực thụ. Nội dung cũng đi sâu vào việc tối ưu hóa chi phí sử dụng mô hình Claude và quản lý ngữ cảnh (Context) để duy trì hiệu suất làm việc bền vững cho AI.

## 💡 2. Các điểm nhấn quan trọng (Key Takeaways)

- **Sự khác biệt về vị thế:** Vibe Coding trên Web giống như việc đưa giấy qua khe cửa cho đầu bếp, trong khi dùng IDE là trực tiếp đứng trong bếp để quan sát và điều chỉnh từng nồi nấu.
- **Vai trò của người dùng:** Bạn không còn là người trực tiếp viết code mà đóng vai trò "Captain" – người giao việc, đánh giá kế hoạch, kiểm tra sự thay đổi (diff) và quyết định chấp nhận (accept) hoặc từ chối (reject) kết quả của Agent.
- **Cấu trúc AI Agent:** Một Agent hoàn chỉnh bao gồm 4 yếu tố: Intelligence (Não bộ/LLM), Tools (Tay chân/Công cụ), Memory (Trí nhớ), và Knowledge (Ngữ cảnh/Dữ liệu).
- **Nguyên tắc "1 Project = 1 Root Folder":** Luôn mở đúng thư mục gốc của dự án trong IDE để Agent có cái nhìn chính xác nhất về cấu trúc file và Git.
- **Quản lý Context là chìa khóa:** Hiểu về Token và giới hạn của "Context Window" để tránh tình trạng AI bị "lú" hoặc lặp lại lỗi cũ.

## 3. Nội dung chi tiết

### 3.1. Hạn chế của Vibe Coding trên Web và Giải pháp IDE

Khi dự án phát triển lớn dần, các công cụ Web bắt đầu bộc lộ những điểm yếu chí mạng:

- **Giới hạn ngữ cảnh:** Chat càng dài, Agent càng dễ quên các chỉnh sửa trước đó hoặc lặp lại lỗi cũ.
- **Khó kiểm soát:** Người dùng không biết code nằm ở đâu, khó tinh chỉnh theo ý muốn và bị kẹt trong một model sẵn có.
- **Rào cản tính năng:** Việc thêm các tính năng lớn hoặc thay đổi yêu cầu mới (requirement) trở nên phức tạp và tốn thời gian.

**Giải pháp IDE + Agent trên máy Local:** Cho phép người dùng can thiệp sâu vào "bếp" của dự án. AI Agent lúc này đóng vai trò là phụ bếp, còn bạn là người chỉ huy, có quyền xem xét từng dòng code thay đổi (Diff), sửa lỗi ngay lập tức và linh hoạt chọn lựa mô hình AI phù hợp.

### 3.2. Giải phẫu AI Agent và Giao diện Antigravity

Một AI Agent mạnh mẽ không chỉ có "não" (mô hình ngôn ngữ) mà còn cần các bộ phận hỗ trợ:

- **Intelligence (Não):** Các model như GPT, Claude Sonnet, Gemini Pro. Có giới hạn kiến thức (Knowledge cutoff) và rủi ro bịa đặt thông tin (hallucinate).
- **Tools (Tay chân):** Khả năng thực hiện nhiệm vụ như nghiên cứu mạng, đọc file, kết nối MCP servers (Gmail, Slack, GitHub) và tự động hóa qua lệnh bash.
- **Memory (Trí nhớ):** Chia làm trí nhớ ngắn hạn (5-10 câu chat) và dài hạn (theo ngày/tuần).
- **Knowledge (Dữ liệu):** Ngữ cảnh cụ thể của dự án qua các tài liệu lưu trữ.

**Giao diện Antigravity bao gồm:**

- **File Tree (Trái):** Quản lý danh sách file/folder.
- **Editor (Giữa):** Vùng đọc và chỉnh sửa code, hiển thị Diff (Xanh: thêm, Đỏ: xóa).
- **Agent Panel (Phải):** Nơi giao tiếp, giao task và phê duyệt thay đổi.
- **Terminal (Dưới):** Chạy lệnh và theo dõi lỗi build.

### 3.3. Claude Code và Bài toán Chi phí 20 USD

Buổi học đưa ra các lựa chọn công cụ tùy theo nhu cầu và ngân sách:

- **Antigravity (IDE):** Giao diện trực quan, phù hợp cho người mới và các task về UI. Cung cấp quota miễn phí.
- **Claude Code (CLI):** Hoạt động trên Terminal, không có UI, mạnh mẽ cho các task lớn liên quan đến nhiều file.
- **Khuyến nghị sử dụng:**
    - *Miễn phí:* Dùng Antigravity.
    - *Trả phí:* Dùng Claude Code Pro (20 USD) để lập kế hoạch (planning) và Cursor Pro để thực thi (execution). Lưu ý: Claude Max có chi phí lên đến 100 USD cho trải nghiệm cao cấp nhất.

### 3.4. Kỹ năng Review và Reject

Việc duyệt code của Agent không được thực hiện mù quáng. Kỹ năng "Reject" là bắt buộc khi:

- Agent đề xuất sửa quá nhiều file không liên quan.
- Thay đổi sai logic nghiệp vụ hoặc thêm các thư viện (dependency) không cần thiết.
- Code lạ không rõ nguồn gốc. **Lưu ý:** Khi Reject, cần giải thích ngắn gọn lý do để Agent thực hiện lại đúng phạm vi yêu cầu.

### 3.5. Quản lý Context và Token (Nâng cao)

Mọi hoạt động giao tiếp với AI đều tiêu tốn Token và làm đầy "Context Window" (chiếc cốc chứa nước). Khi cốc đầy, thông tin cũ sẽ tràn ra khiến AI mất trí nhớ.

| Model | Giới hạn Context Window |
| --- | --- |
| Claude Sonnet | ~200k token |
| Gemini 2.5 Pro | ~2M token (lớn nhất, phù hợp dự án nhiều file) |
| GPT-4o | ~128k token |

**5 Quy tắc vàng quản lý Context:**

1. **CLAUDE.md ngắn gọn:** Chỉ để từ 5-15 gạch đầu dòng quan trọng.
2. **Một mục đích cho mỗi phiên chat:** Xong task thì dùng lệnh `/clear` hoặc mở chat mới.
3. **Chỉ đích danh file:** Thay vì nói "sửa trang chủ", hãy yêu cầu "sửa src/pages/Home.tsx".
4. **Chia nhỏ task:** Đừng giao 5 việc một lúc, hãy giao từng việc để Agent tập trung.
5. **Reset khi có lỗi lặp lại:** Đừng cố giải thích thêm khi AI đã "lú", hãy xóa bộ nhớ và bắt đầu lại.

## 🚀 4. Hành động cần làm (Action Items)

1. **Kết nối GitHub:** Thực hiện clone dự án từ GitHub về máy cục bộ. Đảm bảo lưu file PRD vào thư mục `docs`.
2. **Cài đặt Antigravity:** Tải ứng dụng, mở đúng workspace có thư mục `.git`.
3. **Thực thi với AI Agent:**
    - Yêu cầu Agent lập kế hoạch (plan) kỹ trước khi phê duyệt.
    - Yêu cầu Agent đóng vai trò QA để tự phát hiện và sửa lỗi.
4. **Kiểm tra và Deploy:** Kiểm tra hiển thị tại Local, sau đó push code lên GitHub và kiểm tra kết quả cuối cùng trên Vercel.
5. **Nghiên cứu thêm:** Tìm hiểu sâu hơn về cơ chế Agent để tối ưu hóa việc sử dụng Token và Context.