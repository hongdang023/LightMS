# LightMS - B4: UI Design System

> **Last Updated:** 2026-08-07 | **Status:** ✅ Synced với codebase hiện tại

Tài liệu này quy định hệ thống thiết kế giao diện (UI Design System) cho LightMS. Triết lý thiết kế được lấy cảm hứng từ **Canvas LMS** (tối giản, Card-based, sử dụng không gian trắng) nhưng được "thổi hồn" bởi **Theme Hải trình Cướp biển** độc đáo với hình ảnh **Ngọn hải đăng (Lighthouse)** làm biểu tượng trung tâm.

> **Version:** 1.1 | **Cập nhật:** 2026-08-07
> **Nguyên tắc:** Mọi quy định phải map 1:1 sang CSS variable hoặc Tailwind class trong codebase.

## 0. Branding Logo (Nhận diện Thương hiệu)
- **Logo chính:** Hình ảnh ngọn hải đăng (The Lighthouse), tượng trưng cho sự soi đường chỉ lối và định hướng học tập rõ ràng.
- Toàn bộ tên hệ thống hiển thị là **LightMS**.

---

## 1. Colors & Branding (Hệ thống Màu sắc)

### 1.1. Brand Colors (Màu thương hiệu)

- **Primary Teal:** `#214C54` | CSS: `var(--primary-teal)`
  - _Ứng dụng:_ Navbar, Primary Buttons, đường viền active, icon chính.
- **Dark Slate:** `#15333B` | CSS: `var(--dark-slate)`
  - _Ứng dụng:_ Màu chữ chính (Heading, Body text), Footer.
- **Muted Teal:** `#3E5E63` | CSS: `var(--muted-teal)`
  - _Ứng dụng:_ Chữ phụ (Secondary text), viền thẻ (Card borders), viền nút Secondary.

### 1.2. Accent Colors (Màu nhấn & Gamification)

- **Light Gold:** `#FFD94C` | CSS: `var(--light-gold)`
  - _Ứng dụng:_ Highlight text, viền thẻ nội dung quan trọng.
- **Deep Gold / Amber:** `#EAB308` | CSS: `var(--deep-gold)`
  - _Ứng dụng:_ **Dành riêng cho Gamification** — Badge Huy hiệu, điểm Hải lý, nút Gamification CTA, trạng thái Mastery. **Không dùng cho generic success.**

### 1.3. Background Colors (Màu nền)

- **Canvas Gray:** `#F0F0F0` | CSS: `var(--canvas-gray)`
  - _Ứng dụng:_ Nền tổng thể của app. Cards trắng (`#FFFFFF`) nổi bật trên nền này.
- **Cream:** `#FDF5DA` | CSS: `var(--cream)`
  - _Ứng dụng:_ Nền Scaffolding, Alert Mastery, bình luận được Verified.

### 1.4. Semantic Colors (Màu ngữ nghĩa)

- **Success:** `#10B981` | CSS: `var(--success)` — Nộp bài thành công, hoàn thành task.
- **Warning:** `#F59E0B` | CSS: `var(--warning)` — Deadline sắp đến, cảnh báo nhẹ.
- **Danger:** `#EF4444` | CSS: `var(--danger)` — Hành động xóa, hủy, lỗi hệ thống.

---

## 2. Buttons & Actions (Nút bấm & Tương tác)

### 2.1. Phân cấp Nút bấm (Button Hierarchy)

- **`primary` — Hành động chính:**
  - Nền `#214C54`, Chữ trắng. Hover: nền `#15333B` + `shadow-md` + `-translate-y-0.5`.
  - Chỉ **1 Primary Button** trên mỗi màn hình. VD: "Nộp bài", "Lưu cài đặt".

- **`secondary` — Hành động phụ:**
  - Nền **trong suốt (transparent)**, Viền `1px solid #3E5E63`, Chữ `#3E5E63`. Hover: nền `#F0F0F0`.
  - VD: "Hủy", "Quay lại", "Xem bản nháp".

- **`gamification` — CTA Gamification:**
  - Nền `#EAB308`, Chữ `#15333B`. Hover: nền đậm hơn + `shadow-glow`.
  - **Chỉ dùng trong context Gamification.** VD: "Nhận thưởng", "Mở khóa badge".

- **`danger` — Hành động xóa/hủy:**
  - Nền `#EF4444`, Chữ trắng. Hover: nền `#DC2626`.
  - Luôn kèm dialog xác nhận trước khi thực thi.

- **`ghost` — Hành động ẩn/thứ yếu:**
  - Nền trong suốt, Chữ `#3E5E63`. Hover: nền `#F0F0F0`, không shadow.
  - Icon-only actions, subtle text links, hành động ít ưu tiên.

### 2.2. Trạng thái (States)

- **Disabled:** Opacity `50%` (`opacity-50`), `pointer-events: none`. Áp dụng đồng nhất qua mọi variant.
- **Loading:** Spinner nhỏ thay thế leftIcon, text giữ nguyên.

### 2.3. Tiêu chuẩn Nút bấm Cao cấp

- **Border Radius:** `rounded-xl` (12px) — mặc định cho mọi button. Không dùng `rounded-full` hay `rounded-none`.
- **Shadows:** `shadow-sm` thường → `shadow-md` + `-translate-y-0.5` khi hover (`transition-all duration-200`).
- **Padding:** `sm`: `py-1.5 px-3` | `md`: `py-2 px-4` | `lg`: `py-3 px-6`.
- **Active state:** `scale-95`. Icon mũi tên: `group-hover:translate-x-1`.

---

## 3. Typography & Formats (Định dạng & Font chữ)

### 3.1. Font Families

- **Font chính:** `Inter` — CSS: `var(--font-sans)`. Import từ Google Fonts (weights: 300–800).
- **Font code:** `JetBrains Mono` — CSS: `var(--font-mono)`. Dành cho block code và pre-formatted text.

> ⚠️ **Đã chốt:** Không dùng Roboto hay Fira Code. Codebase đang dùng Inter + JetBrains Mono.

### 3.2. Text Hierarchy (Phân cấp chữ)

- **H1 (Page Title):** `1.75rem` | `font-weight: 800` | `var(--dark-slate)`. Mobile: `1.5rem`.
- **H2 (Section Title):** `1.5rem` | `font-weight: 700` | `var(--dark-slate)`.
- **H3 (Card Title):** `1.25rem` | `font-weight: 600` | `var(--dark-slate)`.
- **H4:** `1.125rem` | `font-weight: 600` | `var(--dark-slate)`.
- **H6 (Label/Tag):** `0.875rem` | `font-weight: 600` | `var(--muted-teal)` | uppercase | `letter-spacing: 0.05em`.
- **Body Text:** `1rem` | Regular | `var(--dark-slate)`. Line-height: `1.7`.
- **Small Text (Meta):** `0.875rem` | `var(--muted-teal)`. Ngày giờ, tác giả, số Upvote.

### 3.3. Rich-Text Format

- **Blockquote:** Viền trái `4px solid var(--deep-gold)`, nền `var(--cream)`, padding `12px 16px`, radius `0 12px 12px 0`.
- **Code inline:** Nền `#E2E8F0`, padding `2px 6px`, radius `4px`, font `var(--font-mono)`.
- **Code block:** Nền `var(--dark-slate)`, chữ `#F8FAFC`, padding `16px`, radius `12px`.
- **Bold text:** Dùng màu `var(--primary-teal)` thay vì đen tuyền.

---

## 4. Alerts & Notifications (Thông báo & Cảnh báo)

- **Success Alert:** Nền `#ECFDF5`, Viền trái `#10B981`, Text `#10B981`. Dùng khi nộp bài thành công, hoàn thành task. ⚠️ Không dùng vàng gold cho Success.
- **Mastery Alert (Gamification):** Nền `var(--cream)`, Viền trái `#EAB308`, Text `#EAB308`. Khi nhận Mastery, mở khóa badge.
- **Info Alert:** Nền `var(--canvas-gray)`, Viền trái `var(--primary-teal)`. Scaffolding, hướng dẫn Onboarding.
- **Warning Alert:** Nền `#FFFBEB`, Viền trái `#F59E0B`, Text `#B45309`. Deadline sắp đến.
- **Toast Notifications:** Góc dưới phải màn hình. Tự động ẩn sau **3 giây**.

---

## 5. Theme Integration & Mascot (Tích hợp Chủ đề & Linh vật)

- **Linh vật "Vẹt lắm mồm":** Trợ lý ảo xuất hiện dạng Pop-up/Tooltip ở góc màn hình. Lời thoại đậm chất cướp biển (VD: _"Aye aye Thuyền trưởng! Bão bài tập đang đến!"_).

- **Iconography:**
  - Dùng **Lucide** làm thư viện icon chuẩn. `strokeWidth={1.5}` thống nhất toàn hệ thống.
  - Kích thước chuẩn: `24x24px` thường | `20x20px` trong button/badge | `16x16px` inline.
  - Màu: `var(--primary-teal)` icon chính | `var(--muted-teal)` icon phụ | `var(--deep-gold)` icon Gamification.
  - Micro-animation: mũi tên `group-hover:translate-x-1`, tải lên `group-hover:-translate-y-0.5`.

- **Metaphor hàng hải:**
  - Dashboard: La bàn (Compass).
  - Wall of Fame: Ngôi sao hàng hải (Nautical Star).
  - Courses: Kính viễn vọng (Telescope).

---

## 6. Layout & UX Optimization (Tối ưu hóa Bố cục & Trải nghiệm)

### 6.1. Collapsible Sidebar

- Desktop (≥1024px): Sidebar full (~240px), có thể thu gọn xuống 80px (icon-only).
- Tablet (768–1023px): Mặc định collapsed (80px).
- Mobile (<768px): Ẩn hoàn toàn, chuyển thành Drawer kéo từ mép trái + nút Hamburger trên Header.

### 6.2. Visual Hierarchy (Phân cấp thị giác)

Elevation system dựa trên shadow:

| Tầng | Thành phần | Shadow Token |
|------|-----------|-------------|
| Base | App background | Không shadow |
| Level 1 | Cards, Panels thường | `var(--shadow-sm)` |
| Level 2 | Hover state, Active cards | `var(--shadow-md)` |
| Level 3 | Modals, Dialogs, Dropdowns | `var(--shadow-lg)` |

> **Rule:** Không dùng shadow đen cứng. Luôn dùng shadow rgba với opacity thấp.

### 6.3. Spacing Scale (Hệ thống khoảng cách)

Bội số **4px** theo hệ Tailwind:

| Tailwind | Giá trị | Dùng cho |
|----------|---------|----------|
| `p-1` / `gap-1` | 4px | Icon spacing, tiny gaps |
| `p-2` / `gap-2` | 8px | Button padding nhỏ, icon+text |
| `p-4` / `gap-4` | 16px | Card padding mặc định |
| `p-6` / `gap-6` | 24px | Card padding rộng |
| `mb-8` | 32px | Section separation |
| `mb-10` | 40px | Page Header margin-bottom |

### 6.4. Component Contrast

- Card luôn dùng `bg-white` trên nền `var(--canvas-gray)`.
- Card headers: icon Lucide (20px, `var(--primary-teal)`) ở đầu mỗi section để phân biệt block.
- Viền phân cách: `border border-gray-200` (không dùng `border-gray-300` — quá tối).

### 6.5. Prominent Call-to-Action

CTA nổi bật đặt tại: cuối bài học, góc trên phải header, bottom của form.

### 6.6. Page Header Standards

- `mb-8` hoặc `mb-10` dưới khối Header.
- Description: `max-w-3xl` để tạo negative space.
- Căn **lề trái** tuyệt đối. Icon + Title + Description thẳng hàng.

### 6.7. Admin UI Consistency (WYSIWYG)

Admin (Course Builder, Onboarding, Thông báo) dùng chung 100% component với Student Mode.

### 6.8. Mobile Responsiveness

- Mobile (<768px): Padding `p-6` → `p-4`. Grid nhiều cột → 1 cột.
- Touch target tối thiểu: `44px` chiều cao cho mọi interactive element.

---

## 7. Design Tokens Reference

Single source of truth — khai báo trong `src/index.css`.

### 7.1. Color Tokens

| Token | Hex | Ứng dụng |
|-------|-----|-----------|
| `--primary-teal` | `#214C54` | Primary button, navbar, active states |
| `--dark-slate` | `#15333B` | Heading text, body text chính |
| `--muted-teal` | `#3E5E63` | Secondary text, card border |
| `--light-gold` | `#FFD94C` | Highlight, warning border nhẹ |
| `--deep-gold` | `#EAB308` | Gamification, badge, mastery |
| `--canvas-gray` | `#F0F0F0` | App background |
| `--cream` | `#FDF5DA` | Scaffolding bg, mastery alert |
| `--white` | `#FFFFFF` | Card background |
| `--success` | `#10B981` | Success states |
| `--warning` | `#F59E0B` | Warning states |
| `--danger` | `#EF4444` | Danger states |

### 7.2. Typography Tokens

| Token | Giá trị |
|-------|---------|
| `--font-sans` | `'Inter', sans-serif` |
| `--font-mono` | `'JetBrains Mono', monospace` |

### 7.3. Border Radius Tokens

| Token | Giá trị | Dùng cho |
|-------|---------|----------|
| `--radius-sm` | `8px` | Form inputs, small badges |
| `--radius-md` | `12px` | Cards, panels, modals |
| `--radius-lg` | `16px` | Large cards, hero sections |
| `--radius-xl` | `24px` | Floating elements, popovers |

### 7.4. Shadow Tokens

| Token | Giá trị | Tầng |
|-------|---------|------|
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.05)` | Cards thường |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.05)` | Cards hover |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.05)` | Modals |
| `--shadow-glow` | `0 0 15px rgba(234,179,8,0.2)` | Gamification glow |

---

## 8. Component Specs (Đặc tả Component)

### 8.1. Badge

File: `src/components/ui/Badge.tsx`

| Variant | Nền | Chữ | Ứng dụng |
|---------|-----|-----|----------|
| `mastery` | `#FDF5DA` | `#EAB308` | Đạt Mastery, thành tích Gamification |
| `submitted` | `#EFF6FF` | `#214C54` | Đã nộp bài, chờ chấm |
| `graded` | `#ECFDF5` | `#10B981` | Đã chấm xong |
| `pending` | `#F0F0F0` | `#6B7280` | Chưa nộp, chờ mở khóa |
| `overdue` | `#FEF2F2` | `#EF4444` | Trễ deadline |
| `info` | `#EFF6FF` | `#3B82F6` | Thông tin chung |
| `warning` | `#FFFBEB` | `#F59E0B` | Cảnh báo |

### 8.2. Card

Không có file riêng — class pattern chuẩn:

```
bg-white rounded-[var(--radius-md)] shadow-[var(--shadow-sm)]
border border-gray-200 p-4 md:p-6
```

Hover (nếu clickable): `hover:shadow-[var(--shadow-md)] transition-shadow duration-200`

### 8.3. Form Input

Pattern chuẩn cho `<input>`, `<textarea>`, `<select>`:

```
w-full px-3 py-2 border border-gray-200 rounded-[var(--radius-sm)]
text-[var(--dark-slate)] bg-white placeholder:text-gray-400
focus:outline-none focus:ring-2 focus:ring-[#214C54] focus:border-transparent
transition-all duration-200
```

Label: `text-sm font-semibold text-[var(--dark-slate)] mb-1 block`

### 8.4. Progress Bar

```css
/* Track */
height: 8px; background: #E5E7EB; border-radius: 999px; overflow: hidden;

/* Fill — Standard */
background: linear-gradient(to right, var(--primary-teal), var(--muted-teal));
height: 100%; border-radius: 999px; transition: width 0.5s ease-in-out;

/* Fill — Gamification (Hải lý) */
background: linear-gradient(to right, var(--light-gold), var(--deep-gold));
```

### 8.5. Modal / Dialog

- Overlay: `bg-black/50 backdrop-blur-sm`
- Container: `bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] p-6 max-w-lg w-full`
- Header: H3 + icon, `pb-4 border-b border-gray-200`
- Footer: `flex flex-row-reverse gap-2` — Primary bên phải, Secondary/Ghost bên trái

### 8.6. Tooltips & Popovers

Khi hiển thị Tooltip hoặc Popover trên các phần tử nằm trong container giới hạn không gian hoặc có thanh cuộn (chứa thuộc tính `overflow-x-auto`, `overflow-hidden`, `overflow-scroll`, `overflow-auto`), tuân thủ nghiêm ngặt quy tắc sau:
- **Enforced Pattern**: Bắt buộc sử dụng **React Portal** (`createPortal` từ `react-dom`) để render nội dung tooltip ở cấp ngoài cùng (`document.body`).
- **Định vị (Positioning)**: Sử dụng tọa độ `fixed` được tính toán thông qua `getBoundingClientRect()` của phần tử kích hoạt khi hover/focus.
- **Z-Index**: Đặt `z-[9999]` (hoặc tối thiểu lớp z-index cao nhất) cùng với `pointer-events-none` để tránh chặn chuột của người dùng.
- **Mục tiêu**: Tránh tooltip bị cắt mất (clipped) bởi biên giới hạn của container cha.

---

## 9. Anti-Patterns (Không làm)

| ❌ Không làm | ✅ Thay bằng |
|-------------|-------------|
| Dùng vàng gold cho Success alert | `var(--success): #10B981` (xanh lá) |
| `rounded-none` cho button | `rounded-xl` (12px) |
| Drop shadow đen cứng | Shadow rgba opacity thấp từ token |
| Mix Lucide solid + outline cùng nhóm | Thống nhất Lucide outline, `strokeWidth={1.5}` |
| `font-family: Roboto` hoặc `Fira Code` | `var(--font-sans)` hoặc `var(--font-mono)` |
| Hardcode hex brand trực tiếp trong JSX | CSS variable hoặc `bg-[#214C54]` |
| Nhiều hơn 1 Primary button / màn hình | Chỉ 1 Primary, còn lại Secondary/Ghost |
| `variant="amber"` trong `<Button>` | `variant="gamification"` |
| Đặt tooltip/popover tuyệt đối (`absolute`) trực tiếp bên trong container chứa `overflow` | Sử dụng React Portal (`createPortal`) đưa ra ngoài `document.body` và dùng `fixed` positioning |

---

## 10. Đặc tả Thiết kế Badge (Brilliant.org Flat Style)

Để tránh cảm giác hình ảnh "AI-generated" (phức tạp, nhiều bóng đổ giả 3D), toàn bộ 7 Huy hiệu Hành động của hệ thống được chuẩn hóa theo phong cách **Flat Geometric Vector** của Brilliant:

### 📐 Quy chuẩn Visual
- **Khung bao chung (Badge Container)**: Hình tròn hoặc hình lục giác đều bo nhẹ các góc (`border-radius: 20%`), sử dụng đường viền kép (Double Stroke) 1.5px.
- **Tone màu chủ đạo**: Phối màu tối giản duotone:
  - Viền & nét vẽ chính: `#214C54` (`var(--primary-teal)`) để giữ tính kỹ thuật vững chãi.
  - Mảng màu tô (Flat Fill): `#EAB308` (`var(--deep-gold)`) tạo điểm nhấn thành tựu rực rỡ.
  - Nền phụ (Background fill): `#FDF5DA` (Kem nhạt/Soft Cream) hoặc trong suốt.
- **Nét vẽ (Iconography Details)**: Nét line dày (`stroke-width: 2px`), dạng nét đứt hoặc nét liền mạch đơn giản, không đổ bóng, không chuyển sắc (gradients).

### 🏷️ Chi tiết thiết kế Vector cho 7 Badges

#### 1. 🪪 Huy hiệu "Thẻ Căn Cước Thủy Thủ"
- **Khái niệm hình ảnh**: Một chiếc thẻ thủy thủ nằm nghiêng, kết hợp các nét kẻ sọc ngang biểu trưng cho thông tin hồ sơ và một chấm tròn biểu trưng cho avatar.
- **Thiết kế**: 
  - Khung bao: Lục giác đều nét teal mảnh.
  - Icon chính: Khung chữ nhật nằm ngang (`rx: 4px`) được vẽ nét teal, bên trong có 3 đường line vàng ngang phẳng và 1 hình tròn vàng đặc biểu trưng cho chân dung.

#### 2. ⛵ Huy hiệu "Cánh Buồm Khởi Hành"
- **Khái niệm hình ảnh**: Một cánh buồm tam giác căng gió, tối giản theo cấu trúc hình học phẳng.
- **Thiết kế**:
  - Khung bao: Tròn viền teal.
  - Icon chính: Một đường ngang biểu diễn mặt nước, bên trên là một cánh buồm tam giác lớn màu vàng được bo nhẹ đỉnh, kết hợp một cột buồm dọc thẳng màu teal.

#### 3. 🌊 Huy hiệu "Vượt Sóng Băng Băng"
- **Khái niệm hình ảnh**: Những làn sóng biển hình học nhấp nhô nối đuôi nhau.
- **Thiết kế**:
  - Khung bao: Tròn viền teal.
  - Icon chính: 3 đường sóng lượn song song nghiêng nhẹ 15 độ được vẽ bằng nét line teal dày (`stroke-width: 2.5px`), mảng tô dưới chân các con sóng sử dụng màu vàng phẳng.

#### 4. ⚓ Huy hiệu "Thủy Thủ Lão Luyện"
- **Khái niệm hình ảnh**: Biểu tượng mỏ neo hàng hải cách điệu tối giản.
- **Thiết kế**:
  - Khung bao: Lục giác đều viền teal.
  - Icon chính: Trục dọc mỏ neo thẳng đứng màu teal kết hợp cung tròn đáy màu vàng phẳng có hai mũi tên nhọn bo góc ở hai đầu cung.

#### 5. 📝 Huy hiệu "Bài Tập Đầu Tay"
- **Khái niệm hình ảnh**: Một trang giấy bài nộp có dấu tích hoàn thành lớn.
- **Thiết kế**:
  - Khung bao: Tròn viền teal.
  - Icon chính: Một tờ giấy trắng bo góc màu teal, bên trong có các dòng kẻ, đè lên trên là một dấu tích vương miện hoặc tích check (`✓`) lớn màu vàng đậm rực rỡ chiếm 50% diện tích badge.

#### 6. ✍️ Huy hiệu "Thủy Thủ Chăm Chỉ"
- **Khái niệm hình ảnh**: Quyển sổ hải trình mở và cây bút lông/bút vẽ.
- **Thiết kế**:
  - Khung bao: Lục giác đều viền teal.
  - Icon chính: Hai trang sổ mở phẳng màu vàng kem, bên trên vẽ chéo một chiếc bút line teal đơn giản.

#### 7. 🧑‍✈️ Huy hiệu "Thuyền Trưởng Gương Mẫu"
- **Khái niệm hình ảnh**: Chiếc mũ thuyền trưởng/bánh lái tàu biểu trưng cho kỷ luật thép.
- **Thiết kế**:
  - Khung bao: Tròn viền teal kép dày.
  - Icon chính: Bánh lái tàu 8 nan tròn đối xứng vẽ bằng nét teal mảnh, trục tâm bánh lái là một hình sao 8 cánh hàng hải màu vàng rực rỡ nằm chính giữa.
