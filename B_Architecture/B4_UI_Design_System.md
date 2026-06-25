# LightMS - B4: UI Design System

Tài liệu này quy định hệ thống thiết kế giao diện (UI Design System) cho LightMS. Triết lý thiết kế được lấy cảm hứng từ **Canvas LMS** (tối giản, Card-based, sử dụng không gian trắng) nhưng được "thổi hồn" bởi **Theme Hải trình Cướp biển** độc đáo với hình ảnh **Ngọn hải đăng (Lighthouse)** làm biểu tượng trung tâm. Đặc biệt, giao diện sẽ có sự dẫn dắt của linh vật **"Vẹt lắm mồm"** xuyên suốt trải nghiệm học tập để hệ thống Gamification trở nên sống động.

## 0. Branding Logo (Nhận diện Thương hiệu)
- **Logo chính:** Hình ảnh ngọn hải đăng (The Lighthouse), tượng trưng cho sự soi đường chỉ lối và định hướng học tập rõ ràng.
- Toàn bộ tên hệ thống hiển thị là **LightMS**.

---

## 1. Colors & Branding (Hệ thống Màu sắc)

Hệ thống màu sắc được trích xuất từ bảng màu thương hiệu (Theme Hải trình) với tông màu Xanh biển sâu (Teal/Ocean) làm chủ đạo và Vàng ánh kim (Gold) làm điểm nhấn cho các thành tựu.

### 1.1. Brand Colors (Màu thương hiệu)

- **Primary Teal:** `#214C54`
  - _Ứng dụng:_ Màu chủ đạo cho Navbar, Primary Buttons, các đường viền active, icon chính. Thể hiện sự chuyên nghiệp, sâu sắc của "đại dương kiến thức".
- **Dark Slate (Navy/Deep Teal):** `#15333B`
  - _Ứng dụng:_ Dùng cho màu chữ chính (Typography: Heading, Body text mạnh), Footer, hoặc nền sidebar (Dark mode). Mang lại độ tương phản cao, dễ đọc.
- **Muted Teal:** `#3E5E63`
  - _Ứng dụng:_ Dùng cho màu chữ phụ (Secondary text), các nút Secondary, hoặc viền thẻ (Card borders).

### 1.2. Accent Colors (Màu nhấn & Gamification)

- **Light Gold / Yellow:** `#FFD94C`
  - _Ứng dụng:_ Màu nhấn phụ, dùng cho các thông báo (warnings nhẹ), highlight text, hoặc viền các thẻ chứa nội dung quan trọng.
- **Deep Gold / Amber:** `#EAB308`
  - _Ứng dụng:_ Màu nhấn chính cho Gamification. Dùng cho các icon Huy hiệu (Badges), điểm số Hải lý, nút CTA (Call-to-Action) đặc biệt như "Nộp bài ngay", hoặc trạng thái đạt "Mastery".

### 1.3. Background Colors (Màu nền)

- **Canvas Gray:** `#F0F0F0`
  - _Ứng dụng:_ Màu nền tảng của toàn bộ ứng dụng (App Background). Các thẻ nội dung (Cards) màu trắng (`#FFFFFF`) sẽ nổi bật rõ ràng trên nền xám nhạt này theo đúng phong cách Canvas.
- **Cream / Soft Yellow:** `#FDF5DA`
  - _Ứng dụng:_ Màu nền nhẹ cho các khu vực Scaffolding (Template mẫu), bảng Alert cảnh báo, hoặc nền các bình luận được "Verified".

---

## 2. Buttons & Actions (Nút bấm & Tương tác)

Theo triết lý Zero Friction, các nút bấm phải rõ ràng mục đích, kích thước đủ lớn (Touch-friendly) và có phân cấp thị giác (Visual Hierarchy) rõ ràng.

### 2.1. Phân cấp Nút bấm (Button Hierarchy)

- **Primary Button (Hành động chính):**
  - _Màu sắc:_ Nền `#214C54`, Chữ trắng (`#FFFFFF`). Khi Hover: Chuyển sang `#15333B`.
  - _Sử dụng:_ Chỉ có 1 Primary Button trên mỗi màn hình (VD: "Nộp bài", "Lưu cài đặt").
- **Secondary Button (Hành động phụ):**
  - _Màu sắc:_ Nền Trắng/Trong suốt, Viền `#3E5E63`, Chữ `#3E5E63`.
  - _Sử dụng:_ Các nút "Hủy", "Quay lại", "Xem bản nháp".
- **Gamification / CTA Button:**
  - _Màu sắc:_ Nền `#EAB308`, Chữ `#15333B` hoặc Trắng.
  - _Sử dụng:_ Nút bấm mang tính khích lệ, mở khóa huy hiệu, hoặc "Nhận thưởng".

### 2.2. Trạng thái (States)

- **Disabled (Vô hiệu hóa):** Nền xám nhạt (`#F0F0F0`), Chữ xám (`#9CA3AF`). KHÔNG có hiệu ứng bấm. Dùng khi học viên chưa đủ điều kiện mở khóa bài học.
- **Loading:** Hiển thị Spinner (vòng quay) nhỏ bên trong nút, text đổi thành "Đang xử lý...".

### 2.3. Tiêu chuẩn Thiết kế Nút bấm Cao cấp (Premium Button Guidelines)

- **Border Radius (Độ bo góc):** Các nút bấm phải sử dụng bo góc vừa phải (`rounded-lg` hoặc `rounded-xl`, tương đương 8px - 12px) để mang lại cảm giác thân thiện nhưng vẫn hiện đại, sang trọng. Hạn chế dùng bo tròn hoàn toàn (`rounded-full`) ngoại trừ các Badge trạng thái, và tuyệt đối không dùng nút vuông vức (0px) tạo cảm giác thô cứng.
- **Shadows & Depth (Đổ bóng & Độ sâu):** Sử dụng `shadow-sm` cho các nút ở trạng thái bình thường để tạo độ nổi nhẹ nhàng. Khi hover, tăng lên `shadow-md` kết hợp hiệu ứng nhấc lên (`-translate-y-0.5`) mượt mà (`transition-all duration-300`). Tuyệt đối tránh drop shadow quá đậm hoặc màu đen cứng.
- **Padding & Breathing Room (Không gian thở):** Nút bấm cần không gian thở rộng rãi. Padding dọc tối thiểu `py-2` hoặc `py-2.5`, padding ngang tối thiểu `px-4` hoặc `px-5`. Chữ bên trong nút không bao giờ được phép dính sát mép.
- **Micro-interactions (Vi tương tác):** Hover states không chỉ đổi màu mà nên kết hợp hiệu ứng thay đổi độ sáng hoặc chuyển đổi màu nền tinh tế. Khi bấm (Active state), nút nên có hiệu ứng lún nhẹ (`scale-95`). Nếu nút có chứa Icon, Icon nên có hiệu ứng dịch chuyển (VD: mũi tên trượt nhẹ sang phải `group-hover:translate-x-1`).

---

## 3. Typography & Formats (Định dạng & Font chữ)

Chú trọng vào khả năng đọc (Readability). LMS là nơi học viên phải đọc rất nhiều text (Rich-text), nên khoảng cách dòng (Line-height) và font chữ phải thân thiện với mắt.

### 3.1. Font Families

- **Font chính (Headings & UI):** `Inter` hoặc `Roboto`. Các font Sans-Serif hiện đại, tròn trịa, hiển thị cực nét trên màn hình số.
- **Font phụ (Monospace / Code):** `Fira Code` hoặc `JetBrains Mono`. Dành riêng cho các khối block code hoặc các thẻ pre-formatted trong Rich-text.

### 3.2. Text Hierarchy (Phân cấp chữ)

- **H1 (Page Title):** 28px - 32px | Bold | Màu `#15333B`. Dành cho Tên Khóa học, Tiêu đề Dashboard.
- **H2 (Section Title):** 24px | Semi-Bold | Màu `#214C54`. Tên các Module, Tên Bài học.
- **H3 (Card Title):** 18px - 20px | Medium | Màu `#15333B`. Tiêu đề của từng hộp nội dung.
- **Body Text (Nội dung chính):** 16px | Regular | Màu `#15333B` (hoặc opacity 80% là `#3E5E63` cho chữ bớt gắt). Line-height: `1.6` (để dễ đọc).
- **Small Text (Meta data):** 13px - 14px | Regular | Dành cho ngày giờ, tác giả, số lượt Upvotes.

### 3.3. Rich-Text Format

- **Blockquote (Trích dẫn):** Có dải màu viền trái là `#EAB308`, nền `#FDF5DA` để nhấn mạnh các ghi chú quan trọng từ Mentor.
- **Bold/Highlight:** Dùng màu `#214C54` cho chữ bôi đậm thay vì màu đen tuyền.

---

## 4. Alerts & Notifications (Thông báo & Cảnh báo)

Hệ thống thông báo cần tinh tế, không làm phiền trải nghiệm học tập, nhưng phải đủ sức thu hút sự chú ý khi cần thiết (ví dụ: Trễ deadline).

- **Success Alert (Thành công - Mở khóa):**
  - Nền `#FDF5DA`, Text và Icon `#EAB308` (hoặc màu xanh lá cây tiêu chuẩn). Dùng khi nộp bài thành công, nhận điểm Mastery.
- **Info Alert (Thông tin học tập):**
  - Nền `#F0F0F0`, Viền trái màu `#214C54`. Dùng để cung cấp Scaffolding, gợi ý cách làm bài, hoặc hướng dẫn Onboarding.
- **Warning Alert (Cảnh báo - Trễ deadline):**
  - Nền `#FFFBEB` (vàng nhạt), Text `#B45309`. Nhắc nhở học viên sắp đến hạn chót hoặc cần cập nhật hồ sơ.
- **Toast Notifications:**
  - Hiển thị góc dưới cùng bên phải màn hình. Tự động biến mất sau 3 giây. Dùng cho các thao tác phụ như "Đã lưu bản nháp", "Đã copy link".

---

## 5. Theme Integration & Mascot (Tích hợp Chủ đề & Linh vật)

Để làm sống động không khí **Hải trình, Hải tặc và Cướp biển**, UI sẽ lồng ghép các yếu tố đồ họa một cách tinh tế (giữ được sự sang trọng của Elegance mà không làm rối nội dung học):

- **Linh vật "Vẹt lắm mồm" (The Talkative Parrot):**
  - Đóng vai trò là trợ lý ảo (Virtual Assistant). Thường xuyên xuất hiện ở các góc màn hình (dạng Pop-up popover/Tooltip) để nhắc nhở làm bài, báo tin vui khi nhận huy hiệu, hoặc "lải nhải" thúc giục nếu học viên nộp bài trễ.
  - Các lời thoại của Vẹt mang phong cách hài hước, đậm chất cướp biển (Ví dụ: _"Aye aye Thuyền trưởng! Bão bài tập đang đến, hãy giương buồm lên!"_).
- **Premium Iconography & UI Elements (Nautical Elegance):**
  - **Phong cách Icon (Icon Style):** Để tránh cảm giác "AI-generated" hoặc "hoạt hình" rẻ tiền, hệ thống sử dụng **Minimalist Line-art Icons** (độ dày nét 1.5px - 2px) kết hợp phong cách **Duotone** tinh tế (Màu chính: Teal `#214C54`, Màu nhấn: Gold `#EAB308`).
  - **Trọng lượng nét (Stroke Weight):** Độ dày nét (stroke-width) phải hoàn toàn nhất quán trên toàn bộ hệ thống (khuyên dùng 1.5px). Tuyệt đối không mix lẫn lộn icon nét dày và nét mỏng, hoặc icon dạng solid (fill) và dạng line trong cùng một nhóm chức năng để giữ sự thanh lịch.
  - **Tỉ lệ khung hình (Alignment & Size):** Tất cả các icon phải được căn giữa hoàn hảo trong một khung hình (box) chuẩn (VD: 24x24px). Đảm bảo icon thẳng hàng tuyệt đối (optical alignment) với text đi kèm.
  - **Micro-animations (Hiệu ứng động):** Các icon ở vị trí tương tác quan trọng nên có hiệu ứng động tinh tế khi người dùng chú ý tới (hover). Ví dụ: icon mũi tên trượt ngang nhẹ, icon mỏ neo nhấp nhô nhẹ.
  - **Metaphor (Ẩn dụ hàng hải cao cấp):** Các biểu tượng được hình học hóa và cách điệu tối giản từ chủ đề cướp biển/hải trình:
    - _Dashboard:_ Biểu tượng **La bàn (Compass)** thanh mảnh với kim chỉ nam mạ vàng.
    - _Wall of Fame (Leaderboard):_ Hình ảnh **Ngôi sao hàng hải (Nautical Star)** sắc nét. Giao diện Leaderboard lấy cảm hứng từ **Skool và Duolingo**, tập trung vào tính cạnh tranh lành mạnh, phân cấp rõ ràng ai đang dẫn đầu, và tôn vinh nỗ lực bền bỉ.
    - _Learning/Courses:_ Biểu tượng **Bản đồ cuộn (Scroll Map)** hoặc **Kính viễn vọng (Telescope)** dạng nét đứt tinh xảo.
  - Thanh Tiến độ (Progress Bar) được thiết kế giống như một con thuyền lướt trên sóng biển trỏ tới đích đến.

---

## 6. Layout & UX Optimization (Tối ưu hóa Bố cục & Trải nghiệm)

Để đảm bảo hệ thống dễ sử dụng, hiện đại và thân thiện với người dùng, UI Design System bổ sung các nguyên tắc tối ưu hóa trải nghiệm (UX) sau:

### 6.1. Collapsible Sidebar (Thanh điều hướng thu gọn)

- **Implement Collapsible Sidebar:** Thiết lập thanh điều hướng bên trái thành dạng có thể thu gọn (collapsible).

### 6.2. Establish Strong Visual Hierarchy (Phân cấp thị giác rõ rệt)

### 6.3. Optimize Spacing & Whitespace (Tối ưu hóa Khoảng cách & Không gian trống)

- **Khoảng cách nhất quán:** Áp dụng hệ thống khoảng cách nhất quán (padding, margin theo bội số chuẩn).

### 6.4. Enhance Component Contrast (Tăng cường độ tương phản Component)

- **Tách biệt nội dung:** Tăng cường độ tương phản cho các thành phần UI bằng cách sử dụng background-color khác biệt cho các Card

* Sử dụng các icon set đồng bộ ở phần header của mỗi Card để tách biệt rạch ròi các block nội dung.

- _Mục đích:_ Giúp các thành phần không bị lẫn vào nhau, định hình rõ ranh giới của từng khối thông tin.

### 6.5. Integrate Prominent Call-to-Action (Tích hợp CTA nổi bật)

- **Vị trí chiến lược:** Thêm các nút hành động (CTA) có độ nổi bật cao (theo chuẩn Primary / Gamification Buttons) tại các vị trí dễ thấy và logic theo dòng chảy trải nghiệm (ví dụ: cuối bài học, góc trên bên phải).
- _Mục đích:_ Điều hướng người dùng thực hiện các mục tiêu cụ thể (VD: "Làm bài tập", "Nộp bài ngay", "Khám phá bài học tiếp theo") một cách mượt mà và chủ động.

### 6.6. Page Header Standards (Tiêu chuẩn Tiêu đề Trang)

- **Maximize Negative Space:** Mở rộng khoảng cách (margin-bottom lớn, ví dụ `mb-8` hoặc `mb-10`) xung quanh khối Header. Hạn chế độ rộng tối đa của phần mô tả (`max-w-3xl`) để tạo không gian trống (negative space) hào phóng bên phải, giảm tải áp lực thị giác.
- **Implement Subtle Visual Elements:** Chỉ sử dụng các icon dạng nét mảnh (outline) từ bộ thư viện chuẩn (Lucide) với màu sắc nhã nhặn để trang trí tiêu đề, duy trì sự nhất quán và phong cách "Zen".
- **Standardize UI Alignment:** Thiết lập quy tắc căn lề nhất quán: Toàn bộ khối Page Header luôn được căn lề trái (left-aligned) đồng bộ trên toàn hệ thống. Mọi yếu tố từ Icon, Title đến Description đều phải thẳng hàng.

### 6.7. Admin UI Consistency (WYSIWYG)

- **Edit Mode & Reading Mode:** Đối với phân hệ Admin (như Course Builder, Onboarding, Thông báo), giao diện xem và chỉnh sửa phải sử dụng chung hệ thống Component với Student Mode.
- _Mục đích:_ Mang lại trải nghiệm WYSIWYG (What You See Is What You Get) chân thực nhất, giúp Admin dễ dàng căn chỉnh các chi tiết nhỏ mà không gặp rủi ro "bên tạo một kiểu, bên xem một kiểu".
