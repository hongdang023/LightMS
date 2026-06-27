import React, { useState, useEffect } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { PageHeader } from '../../components/PageHeader';
import { ChevronLeft, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { 
  BookOpen, Wrench, Bot, Compass, Palette, FlaskConical, Anchor, 
  ClipboardList, Target, Pin, CheckCircle2, MessageSquareWarning, Lock
} from 'lucide-react';
import { EditableText } from '../../components/EditableText';

interface OnboardingDay {
  day: number;
  title: string;
  intro: string;
  objective: string;
  checklist: string;
  takeaway: string;
}

export const ONBOARDING_DAYS_DATA: OnboardingDay[] = [
  {
    day: 1,
    title: "Ngày 1: Khởi động, làm quen với khoá học",
    intro: "Tuần Onboarding rất quan trọng cho trải nghiệm học: dù chưa vào học ngay với mình, nhưng sẽ **kích hoạt bạn như một người học chủ động**.",
    objective: "Đến với Onboarding ngày 1, bạn sẽ làm quen với những người bạn học cùng, và tập kết nối với lớp thông qua việc post vào nhóm cộng đồng và group của lớp.\n\nBạn sẽ:\n- Làm quen với lớp học, cộng đồng, và cách hoạt động\n- Đặt ra \"lý do tại sao\" bạn học khóa này\n- Cam kết với chính mình rằng bạn sẽ hành động – không chỉ đọc lý thuyết",
    checklist: "- [ ] **Task 1: Set up nền tảng hỗ trợ học tập** (Đọc toàn bộ hướng dẫn tại [Hướng dẫn sử dụng nền tảng học tập](https://app.notion.com/p/H-ng-d-n-s-d-ng-n-n-t-ng-h-c-t-p-2b92df46dabf8386aba0812020fd78d9?pvs=21))\n- [ ] **Task 2:** Điền [form Khảo sát Onboarding](https://forms.gle/U6CKgyQnxNZh4jbAA) để thầy giáo nắm được thông tin và cập nhật giáo trình phù hợp với nhu cầu của bạn.\n- [ ] **Task 3:** Viết 01 post giới thiệu bản thân trong [Group Facebook](https://www.facebook.com/share/g/1AehPRGe9U/) của lớp và ghi hastag **#OB_Ngay1** ở đầu bài viết.\n\n*Nội dung giới thiệu bao gồm:*\n- Tên bạn, công việc hiện tại (ngành nghề), 01 sản phẩm bạn đã từng build bằng AI.\n- Lý do bạn muốn học khóa này - gắn với nỗi đau càng tốt.\n- Một trở ngại lớn nhất của bạn khi tham gia khóa học này - Bạn dự định khắc phục trở ngại này như thế nào?\n- Một điều bạn hy vọng đạt được sau 1 tháng.\n- Một thuận lợi/lợi thế của riêng bạn khi tham gia khóa học này.\n- **Quan trọng**: Cam kết sẽ dành ra bao nhiêu tiếng/tuần/ngày để học build, vào thời gian trống nào trong tuần.\n- **Tạo động lực cho cá nhân** - Đặt cược, thử thách: Nếu không build được do nguyên nhân chủ quan (ví dụ: lười, không đủ quyết tâm), bạn sẽ chấp nhận bị mất gì (ví dụ: khao trà sữa cả lớp, múa bụng, thuyết trình cuốn sách hay...).\n\n- [ ] **Task 4:** Cập nhật **Hoàn Thành** tại [Tracking Sheet](https://docs.google.com/spreadsheets/d/1MkdyolJBxs8xjvBmRlooO9QmZAnIGZM1oWN_WyD2zJg/edit?usp=sharing) khi hoàn thành nhiệm vụ Ngày 1 🎉\n- [ ] **Task 5 (Optional): Đọc thêm về cách nói chuyện với users và lấy feedback** tại [Substack Article](https://the1ight.substack.com/p/mo-khoa-6-lam-sao-e-thuc-su-noi-chuyen?r=2f46k)",
    takeaway: "> 📌 **Ghi nhớ nhỏ:**\n>\n> Bạn không cần phải “giỏi” để bắt đầu. Nhưng bạn phải bắt đầu thì mới có thể “giỏi”.\n\n> 💡 **Vẹt Lắm Mồm gợi ý:**\n> Kỹ năng tìm hiểu và nói chuyện với User là cực kỳ quan trọng, hãy rèn luyện từ sớm."
  },
  {
    day: 2,
    title: "Ngày 2: Làm quen với viết problem statement",
    intro: "> “Cái khó nhất trên đời không phải là làm cái mình muốn, mà là biết mình muốn gì”\n> \n> — Naval Ravikant\n\n🔑 *Trước khi giải quyết một vấn đề, hãy học cách gọi tên nó rõ ràng.*",
    objective: "Đến với Onboarding ngày 2, bạn sẽ nghiên cứu luôn một thứ quan trọng nhất trong nghề Product: **viết problem statement**. Đây là bước nền tảng cho mọi sản phẩm.\n\n> ⚠️ **Lưu ý:** Problem Statement hôm nay là bản draft thô đầu tiên của bạn. Đừng áp lực phải viết hoàn hảo. Buổi 1 trên lớp sẽ yêu cầu bạn viết lại 10 vấn đề → lọc xuống 1 vấn đề chính. Cái bạn viết hôm nay là bước khởi động để bạn bắt đầu tư duy.",
    checklist: "- [ ] **Task 1:** Xem video hướng dẫn ngắn từ giảng viên: [Link video Loom](https://www.loom.com/share/ae9ee3b4dd7e4f62901e904445bbf3d2?sid=5f0311c9-cf13-46de-98f7-2c5fba17361e)\n- [ ] **Task 2:** Đọc slide và bài viết kèm theo để hiểu bối cảnh:\n  - [Slide: Problem Statement](https://drive.google.com/file/d/12n7bjL99wKAeozI-uAmg_yAYJCC_eaxN/view)\n  - [Bài viết Substack](https://the1ight.substack.com/p/10-nam-lam-san-pham-a-day-toi-nhung?r=2f46k)\n- [ ] **Task 3:** Viết 1 problem statement cho sản phẩm của bạn (1 vấn đề bạn muốn solve)\n  - Post lên [Facebook Group](https://www.facebook.com/groups/27216190438021089) & tag **#OB_Ngay2** ở đầu bài viết.\n  - Nhắn trong phòng chat [Vinh Danh, tiếp lửa](https://m.me/ch/AbZBhshrDpB2lylD/) để mời mọi người đọc và bình luận.\n- [ ] **Task 4:** Comment vào bài post của một Problem Statement hoặc một lời giới thiệu (của Ngày 1) của thuyền viên khác khiến bạn ấn tượng nhất và nêu rõ lý do.\n- [ ] **Task 5:** Cập nhật trạng thái hoàn thành vào [Tracking Sheet](https://docs.google.com/spreadsheets/d/1MkdyolJBxs8xjvBmRlooO9QmZAnIGZM1oWN_WyD2zJg/edit?gid=1843915489#gid=1843915489)\n- [ ] **Task 6 (Optional):** Chủ động đặt 01 câu hỏi nào đó cho thầy giáo và cả lớp ở phòng chat Messenger [Light Support](https://m.me/ch/AbZBhshrDpB2lylD/).",
    takeaway: "> 📌 **Lời nhắc:**\n>\n> Đừng ngại chia sẻ idea còn “chưa chắc chắn”. Mọi sản phẩm tốt đều bắt đầu từ một vấn đề **rất đời thường**. Nếu bạn bí, hãy hỏi trong chat – luôn có người hỗ trợ bạn!\n\n> 💡 **Lời khuyên:**\n> Khóa học sẽ không thể thành công nếu học sinh ngại hỏi và giấu “dốt”. Hãy để mọi thắc mắc được lôi ra ánh sáng."
  },
  {
    day: 3,
    title: "Ngày 3: Làm quen với AI – Đồng đội mới",
    intro: "> *Thực tế là, trong tương lai rất gần, nếu bạn không biết cưỡi rồng, thì những người cưỡi rồng và những con rồng sẽ hoàn toàn có thể \"đốt\" và \"ăn thịt\" bạn.*\n> \n> — The1ight",
    objective: "Hôm nay bạn sẽ bắt đầu làm quen với việc dùng AI như một người trợ lý sản phẩm. Biết cách hỏi để AI giúp bạn rõ vấn đề, gợi ý giải pháp, và thậm chí… viết hộ bạn phần đầu sản phẩm.\n\nĐây là bước khởi động nhẹ. Buổi 2 trên lớp sẽ đi sâu hơn vào AI Prompting, Vibe Coding và cách dùng AI thật sự hiệu quả.",
    checklist: "- [ ] **Task 1:** Xem video giới thiệu từ giảng viên: [Link video Loom](https://www.loom.com/share/8ca2a0f8c79a40aab00264f2905a411f?sid=d1483399-b437-4070-8e46-461d07b2ad87)\n- [ ] **Task 2:** Đọc Series của bài viết hoặc xem video:\n  - [Link bài viết](https://the1ight.substack.com/p/toi-va-ai-nhung-kien-thuc-nen-tang)\n  - [Link video Youtube](https://www.youtube.com/watch?v=6iNyHHFsyjo&t=12s)\n- [ ] **Task 3:** Đọc kỹ phần 2 để hiểu về công thức CREATE và thử dùng AI viết lại Problem Statement hôm qua:\n  - [Link bài phần 2](https://the1ight.substack.com/p/toi-va-ai-02-lam-sao-e-giao-tiep?r=2f46k&utm_medium=ios&triedRedirect=true)\n  - [Link prompt guide](https://davebirss.com/documents/the_prompt_guide.pdf?kuid=e325a127-c321-4309-8bbf-a0ca6fa9da50-1731576573&lid=35290&kref=mFnEIdDR4sYf)\n- [ ] **Task 4:** Viết 3 dòng cảm nhận sau khi thử dùng AI với công thức CREATE ở trên, post lên Facebook Group với hashtag **#OB_Ngay3** và cập nhật [Tracking Sheet](https://docs.google.com/spreadsheets/d/1MkdyolJBxs8xjvBmRlooO9QmZAnIGZM1oWN_WyD2zJg/edit?gid=1843915489#gid=1843915489)\n- [ ] **Task 5 (Optional):** Đọc bài viết [Vibe Coding 2: Agentic AI](https://the1ight.substack.com/p/vibe-coding-2-agentic-ai-cuoc-cach?r=2f46k) và chia sẻ cảm nghĩ lên Facebook Group với hashtag **#OB_Ngay3**.\n- [ ] **Task 6 (Optional): Đọc Tài liệu tham khảo thêm:** [Lenny's Newsletter: Personal AI Copilot](https://www.lennysnewsletter.com/p/build-your-personal-ai-copilot?r=2f46k), [Operators Handbook](https://www.operatorshandbook.com/p/how-to-work-with-ai-getting-the-most?lli=1), [Maxberry Guide to AI Agents 2025](https://www.maxberry.ca/p/how-to-build-ai-agents-2025-guide?lli=1)",
    takeaway: "> 📌 **Lưu ý:**\n>\n> AI chính là người thầy khủng khiếp nhất đồng hành cùng bạn trong hành trình build sản phẩm. Nếu bạn biết để hỏi, thì chắc chắn bạn sẽ biết để hiểu. Chỉ cần bạn biết là bạn đang không biết gì, AI sẽ có thể dạy bạn."
  },
  {
    day: 4,
    title: "Ngày 4: PRD - Tài liệu yêu cầu sản phẩm",
    intro: "> *\"Plans are useless, but planning is indispensable.\"*\n> — Dwight D. Eisenhower\n\n> 💡 **Nguyên lý:** Trước khi build bất cứ thứ gì, bạn cần hiểu: build kiểu gì mới đúng?",
    objective: "Hôm nay bạn sẽ tìm hiểu về PRD - Product Requirements Documents.\n\nĐây là thuật ngữ quan trạng nhất cho toàn bộ khoá học. Khi bạn vibe code ở các buổi sau, bạn sẽ tự nhiên làm Agile mà không cần gọi tên nó — nhưng hiểu nó sẽ giúp bạn biết tại sao mình làm vậy.",
    checklist: "- [ ] **Task 1:** Xem lời khuyên từ giảng viên: [Link Loom](https://www.loom.com/share/5a50410bf85f4e8db861af378a399ffa?sid=765d752f-def9-4238-82ad-8523eddb67d6)\n- [ ] **Task 2:** Xem video buổi học về PRD từ khoá trước:\n  - [Recording tại Daymai.vn](https://daymai.vn/vc/69b959dd8802631b190b3891)\n  - [Slide thuyết trình Canva](https://canva.link/buoi4-prd-problemstatement)\n- [ ] **Task 3:** Viết cảm nghĩ ngắn về những gì mình học được, gắn hashtag **#OB_Ngay4** và post lên Facebook Group.\n- [ ] **Task 4:** Cập nhật **Hoàn Thành** tại [Tracking Sheet](https://docs.google.com/spreadsheets/d/1MkdyolJBxs8xjvBmRlooO9QmZAnIGZM1oWN_WyD2zJg/edit?gid=1843915489#gid=1843915489) 🎉",
    takeaway: "> 📌 **Tips:**\n>\n> Hãy thử hỏi ChatGPT: *\"PRD là gì? Cho tôi 3 ví dụ, 3 phản ví dụ và 3 điều dễ gây hiểu lầm về nó. Các cấu phần chính của PRD là gì?\"* hoặc sử dụng [Gemini Gems Concept Chopper](https://gemini.google.com/gem/1xaEMN8zNA8A6oCj62qEVHjNh5uLKwt2B?usp=sharing) để đào sâu khái niệm."
  },
  {
    day: 5,
    title: "Ngày 5: Design xưa và nay",
    intro: "> “Design is not just what it looks like and feels like. Design is how it works.”\n> \n> — Steve Jobs",
    objective: "Đến với ngày 5, mục tiêu là giúp bạn:\n- Hiểu sự khác biệt giữa quy trình vẽ **prototype truyền thống** (vẽ tay → giấy → Figma) và **prototype hiện đại** (prompt, AI tool).\n- Biết cách tư duy theo user journey và vẽ user flow cho các sản phẩm.",
    checklist: "- [ ] **Task 0:** Xem video hướng dẫn từ giảng viên: [Link Loom](https://www.loom.com/share/29bd2076c7b54c9bb18e1fe02034bdfc?sid=3ae24ec4-4a78-4912-a2dc-3733f6db18c1)\n- [ ] **Task 1:** Đọc bài viết để hiểu cách thiết kế truyền thống:\n  - [Phân biệt Sketch, Wireframe, Mockup, Prototype](https://thinhnotes.com/chuyen-nghe-ba/phan-biet-sketch-wireframe-mockup-va-prototype/)\n  - [Tương lai của design trong phát triển sản phẩm](https://app.notion.com/p/T-ng-lai-c-a-design-trong-ph-t-tri-n-s-n-ph-m-3302df46dabf8069ae36f0f39080ab52?pvs=21)\n  - [Video minh họa vẽ mockup](https://www.youtube.com/watch?v=A2yCB9P8E-8&t=1s)\n- [ ] **Task 2:** Xem video tư duy về User Journey và User Flow: [Link Youtube](https://www.youtube.com/watch?si=PytGxUCdsp7sB8mW&v=DNBIcBdKnQo&feature=youtu.be)\n- [ ] **Task 3:** Đọc bài viết về Figma & AI:\n  - [Is Figma Dead?](https://designbuddy.substack.com/p/is-figma-dead?utm_source=substack&utm_campaign=post_embed&utm_medium=web)\n  - [Review các công cụ AI Prototype](https://the1ight.substack.com/p/vibe-coding-3-review-cac-cong-cu?r=2f46k)\n- [ ] **Task 4:** Xem video trình diễn AI tool:\n  - [Figma Make AI Features (Phút 42 đến 53)](https://www.youtube.com/live/5q8YAUTYAyk?si=ktQYaBPpEl1-gv7X&t=2570)\n  - [Canva Code demo](https://youtu.be/RnVsl3PIx8U?si=9Qtq6gwuZbHdoeq3)\n- [ ] **Task 5:** Chia sẻ lên Group Facebook với hashtag **#OB_Ngay5** và cập nhật [Tracking Sheet](https://docs.google.com/spreadsheets/d/1MkdyolJBxs8xjvBmRlooO9QmZAnIGZM1oWN_WyD2zJg/edit?gid=1843915489#gid=1843915489).",
    takeaway: "> 📌 **Ghi nhớ:**\n>\n> Nguyên tắc bất biến là luôn bắt đầu từ **user problem** trước khi thiết kế UI.\n\n> 💡 **Mở rộng:** Nếu bạn muốn đọc thêm về Design Mindset, hãy tìm đọc:\n> - *Don’t Make Me Think* – Steve Krug\n> - *Designing Your Life* – Bill Burnett & Dave Evans"
  },
  {
    day: 6,
    title: "Ngày 6: PM & User Testing - Validate sản phẩm",
    intro: "> *\"Get out of the building.\"*\n> — Steve Blank\n\n> 💡 **Triết lý:** Build sản phẩm mà không nói chuyện với người dùng, giống như nấu ăn mà không nếm thử.",
    objective: "Hôm nay bạn sẽ tìm hiểu về ngành Product Management và *user testing* — cách kiểm tra xem sản phẩm của bạn có thực sự giải quyết được vấn đề cho người dùng hay không, trước khi bạn đổ quá nhiều thời gian và công sức vào build.",
    checklist: "- [ ] **Task 1:** Xem video buổi học về thế nào là làm Product: [Link video Youtube](https://youtu.be/y0ukmvWTNw4)\n- [ ] **Task 2:** Đọc bài viết [Làm sao để thực sự nói chuyện với users](https://the1ight.substack.com/p/mo-khoa-6-lam-sao-e-thuc-su-noi-chuyen?r=2f46k).\n- [ ] **Task 3:** Tìm hiểu về một số low tech product qua [Thế nào mới gọi là sản phẩm?](https://www.notion.so/Th-n-o-m-i-g-i-l-s-n-ph-m-20afb1613f7080cb8d61e0b84e2d52c4?pvs=21)\n- [ ] **Task 4:** Viết bài chia sẻ ngắn (3–5 dòng) lên Group Facebook và gắn hashtag **#OB_Ngay6**:\n  - Định nghĩa của bạn về một sản phẩm là gì?\n  - Bạn sẽ test sản phẩm của mình với ai?\n  - Bạn sẽ hỏi họ câu gì để biết vấn đề có thực sự tồn tại?\n- [ ] **Task 5:** Cập nhật **Hoàn Thành** tại [Tracking Sheet](https://docs.google.com/spreadsheets/d/1MkdyolJBxs8xjvBmRlooO9QmZAnIGZM1oWN_WyD2zJg/edit?gid=1843915489#gid=1843915489) 🎉",
    takeaway: "> 📌 **Ghi nhớ nhỏ:**\n>\n> Sản phẩm tốt nhất không phải do người thông minh nhất build, mà do người chịu khó lắng nghe nhất build."
  },
  {
    day: 7,
    title: "Ngày 7: MCP, CLI và SDK",
    intro: "🔑 *Làm chủ các khái niệm công nghệ cốt lõi trong thời đại Vibe Coding.*",
    objective: "Ngày cuối trong tuần onboarding, bạn sẽ khám phá cách phần mềm, lập trình viên và các mô hình AI giao tiếp với nhau qua CLI, SDK và MCP.",
    checklist: "- [ ] **Task 1: Xem các video sau:**\n  - [Video 1: MCP, CLI, SDK](https://youtu.be/g9JIUM0MHgQ?si=rp9u4zIBKCaZ0zLP)\n  - [Video 2: Demo thực tế](https://youtu.be/04IqH38SlOI?si=TL79P1H12WaCypN6)\n- [ ] **Task 2: Tìm hiểu thêm về 3 thuật ngữ MCP, CLI và SDK** và dùng ẩn dụ thực tế giải thích sự khác biệt, post lên Facebook Group với hashtag **#OB_Ngay7**.\n- [ ] **Task 3:** Hoàn thành [Khảo sát sau Onboarding Week](https://forms.gle/r9hwfs7fCqnEiggH7).\n- [ ] **Task 4:** Cập nhật tiến độ trên [Tracking Sheet](https://docs.google.com/spreadsheets/d/1MkdyolJBxs8xjvBmRlooO9QmZAnIGZM1oWN_WyD2zJg/edit?gid=1843915489#gid=1843915489).",
    takeaway: "> 📌 **Ghi nhớ:**\n>\n> Nghĩ như một solopreneur sẽ giúp bạn chủ động hơn, xây hệ thống làm việc hiệu quả và có tư duy ownership cao.\n\n> 🎉 **YAY!!! Bạn đã hoàn thành tuần onboarding rồi!**\n> ⏰ Lớp học chính thức đầu tiên sẽ bắt đầu vào thứ Tư đầu tuần tới lúc 20h30!"
  }
];

// Aesthetic banner designs using CSS grids, SVG patterns, and themed color combinations
const DAY_VISUAL_STYLES: {
  [key: number]: {
    icon: React.ReactNode;
    gradient: string;
    summary: string;
    bgPattern: React.ReactNode;
  };
} = {
  1: {
    icon: <BookOpen className="w-6 h-6" />,
    gradient: "from-[#EAB308] to-[#CA8A04]", // Golden Sea Parchment
    summary: "Kết nối cộng đồng & cam kết hành động",
    bgPattern: (
      <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
        <path d="M-10 80 Q20 50 50 80 T110 80 T170 80 T230 80 T295 80" fill="none" stroke="white" strokeWidth="2" />
        <path d="M-10 100 Q20 70 50 100 T110 100 T170 100 T230 100 T295 100" fill="none" stroke="white" strokeWidth="2" />
        <circle cx="240" cy="30" r="15" fill="none" stroke="white" strokeWidth="2" />
        <line x1="240" y1="10" x2="240" y2="50" stroke="white" strokeWidth="2" />
        <line x1="220" y1="30" x2="260" y2="30" stroke="white" strokeWidth="2" />
      </svg>
    )
  },
  2: {
    icon: <Wrench className="w-6 h-6" />,
    gradient: "from-[#0284C7] to-[#0369A1]", // Blueprint Blue
    summary: "Định nghĩa và gọi tên bài toán sản phẩm",
    bgPattern: (
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <circle cx="230" cy="40" r="25" fill="none" stroke="white" strokeWidth="1.5" />
      </svg>
    )
  },
  3: {
    icon: <Bot className="w-6 h-6" />,
    gradient: "from-[#059669] to-[#047857]", // Mystic Emerald Dragon
    summary: "Ứng dụng AI thông minh hỗ trợ Product",
    bgPattern: (
      <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 20 C60 5 90 40 130 20 C170 0 200 35 240 15" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5 5" />
        <path d="M10 50 Q70 20 120 70 T240 40" fill="none" stroke="white" strokeWidth="1.5" />
        <polygon points="210,15 220,5 230,15 220,25" fill="white" />
      </svg>
    )
  },
  4: {
    icon: <Compass className="w-6 h-6" />,
    gradient: "from-[#845EF7] to-[#6741D9]", // Telescope Deep Purple
    summary: "Tìm hiểu tài liệu yêu cầu sản phẩm PRD",
    bgPattern: (
      <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
        <circle cx="150" cy="50" r="35" fill="none" stroke="white" strokeWidth="1.5" />
        <circle cx="150" cy="50" r="5" fill="white" />
        <line x1="150" y1="10" x2="150" y2="90" stroke="white" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="110" y1="50" x2="190" y2="50" stroke="white" strokeWidth="1" strokeDasharray="3 3" />
        <polygon points="150,20 155,45 150,50" fill="white" />
        <polygon points="150,80 145,55 150,50" fill="#FFD94C" />
      </svg>
    )
  },
  5: {
    icon: <Palette className="w-6 h-6" />,
    gradient: "from-[#D946EF] to-[#C026D3]", // Oil Paint Palette Pink/Fuchsia
    summary: "Tư duy thiết kế trải nghiệm User Journey",
    bgPattern: (
      <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="30" r="20" fill="none" stroke="white" strokeWidth="1.5" />
        <circle cx="120" cy="60" r="30" fill="none" stroke="white" strokeWidth="1.5" />
        <circle cx="210" cy="40" r="15" fill="none" stroke="white" strokeWidth="1.5" />
        <path d="M10 80 Q 140 20 280 80" fill="none" stroke="white" strokeWidth="1" />
      </svg>
    )
  },
  6: {
    icon: <FlaskConical className="w-6 h-6" />,
    gradient: "from-[#F97316] to-[#EA580C]", // Bright Amber Sunset
    summary: "Kiểm tra và đo lường độ khớp thị trường",
    bgPattern: (
      <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="20" width="40" height="50" rx="3" fill="none" stroke="white" strokeWidth="2" />
        <line x1="40" y1="35" x2="60" y2="35" stroke="white" strokeWidth="2" />
        <line x1="40" y1="45" x2="60" y2="45" stroke="white" strokeWidth="2" />
        <line x1="40" y1="55" x2="55" y2="55" stroke="white" strokeWidth="2" />
        <circle cx="220" cy="40" r="20" fill="none" stroke="white" strokeWidth="1.5" />
        <line x1="220" y1="20" x2="220" y2="60" stroke="white" strokeWidth="1.5" />
      </svg>
    )
  },
  7: {
    icon: <Anchor className="w-6 h-6" />,
    gradient: "from-[#0D9488] to-[#0F766E]", // Sea Teal Ocean
    summary: "Cơ sở kỹ thuật cho thời đại Vibe Coding",
    bgPattern: (
      <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
        <path d="M150 15 L150 65 M135 30 L165 30" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <circle cx="150" cy="15" r="5" fill="none" stroke="white" strokeWidth="3" />
        <path d="M125 50 C125 70 175 70 175 50" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <path d="M120 50 L115 45 M180 50 L185 45" stroke="white" strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  }
};

interface OnboardingViewProps {
  isEditMode?: boolean;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ isEditMode = false }) => {
  const { 
    activeUser, 
    addNotification, 
    onboardingDays, 
    onboardingUnlockSchedules,
    updateOnboardingDay,
    updateOnboardingUnlockSchedule
  } = useDatabase();

  const toLocalDatetimeString = (isoString: string) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  
  // Date Unlocking Setup
  const courseStartDate = (() => {
    const saved = localStorage.getItem('lms_onboarding_start_date');
    if (saved) return saved;
    const d = new Date();
    d.setDate(d.getDate() - 2);
    return d.toISOString().split('T')[0];
  })();

  const bypassLocks = (() => {
    const saved = localStorage.getItem('lms_bypass_locks');
    return saved === 'true';
  })();

  // Track selected Day view and current view mode
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');

  const [lockedAlert, setLockedAlert] = useState<{ show: boolean; msg: string }>({ show: false, msg: '' });

  // Load checklist checked state from localStorage
  const [checkedTasks, setCheckedTasks] = useState<{ [key: string]: boolean }>(() => {
    const saved = localStorage.getItem('lms_onboarding_tasks_v2');
    return saved ? JSON.parse(saved) : {};
  });

  // Save config changes
  useEffect(() => {
    localStorage.setItem('lms_onboarding_start_date', courseStartDate);
  }, [courseStartDate]);

  useEffect(() => {
    localStorage.setItem('lms_bypass_locks', String(bypassLocks));
  }, [bypassLocks]);

  // Track if profile is completed to auto-check profile task in Day 1
  useEffect(() => {
    if (activeUser.is_profile_completed) {
      setCheckedTasks(prev => {
        const next = { ...prev, 'day-1-task-3': true }; 
        localStorage.setItem('lms_onboarding_tasks_v2', JSON.stringify(next));
        return next;
      });
    }
  }, [activeUser.is_profile_completed]);

  // Helper to extract clean task items from day checklist markdown
  const getTasksForDay = (dayData: OnboardingDay) => {
    const lines = dayData.checklist.split('\n');
    const tasks: { idx: number; label: string; key: string }[] = [];
    let taskIdx = 0;
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('- [ ]')) {
        taskIdx++;
        tasks.push({
          idx: taskIdx,
          label: trimmed.replace('- [ ]', '').trim(),
          key: `day-${dayData.day}-task-${taskIdx}`
        });
      } else if (tasks.length > 0 && line.length > 0) {
        tasks[tasks.length - 1].label += '\n' + line;
      }
    });
    return tasks;
  };

  const isDayCompleted = (day: number) => {
    const dayData = onboardingDays.find(d => d.day === day);
    if (!dayData) return false;
    const tasks = getTasksForDay(dayData);
    if (tasks.length === 0) return true;
    return tasks.every(t => checkedTasks[t.key]);
  };

  // Helper to determine if a day is unlocked based on date AND previous day completion
  const getDayLockStatus = (day: number) => {
    if (bypassLocks || activeUser.role === 'admin') return { isUnlocked: true, daysLeft: 0, unlockDateStr: '', reason: '' };
    
    // 1. Check if previous day is completed
    let prevDayCompleted = true;
    if (day > 1) {
      prevDayCompleted = isDayCompleted(day - 1);
    }
    
    // 2. Check time
    const schedule = onboardingUnlockSchedules.find(s => s.day === day);
    const now = new Date();
    
    const unlockDate = schedule ? new Date(schedule.scheduled_at) : new Date();
    const isTimeUnlocked = now.getTime() >= unlockDate.getTime();
    
    const diffTime = unlockDate.getTime() - now.getTime();
    const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const dateOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' };
    const unlockDateStr = unlockDate.toLocaleString('vi-VN', dateOptions);

    let isUnlocked = prevDayCompleted && isTimeUnlocked;
    
    let reason = '';
    if (!isUnlocked) {
      if (!isTimeUnlocked && !prevDayCompleted) {
        reason = `Ngày này sẽ mở vào lúc ${unlockDateStr} VÀ bạn cần hoàn thành 100% nhiệm vụ của Ngày ${day - 1} trước.`;
      } else if (!isTimeUnlocked) {
        reason = `Chưa đến lúc! Ngày này dự kiến sẽ mở vào lúc ${unlockDateStr}.`;
      } else if (!prevDayCompleted) {
        reason = `Bạn cần hoàn thành tất cả nhiệm vụ của Ngày ${day - 1} trước khi có thể mở khóa ngày này.`;
      }
    }

    return { isUnlocked, daysLeft, unlockDateStr, reason };
  };

  const handleDayCardClick = (day: number) => {
    const status = getDayLockStatus(day);
    if (status.isUnlocked) {
      setSelectedDay(day);
      setViewMode('detail');
      setLockedAlert({ show: false, msg: '' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setLockedAlert({
        show: true,
        msg: `Bình tĩnh nào đồng chí! ${status.reason}`
      });
      // Clear alert after 5s
      setTimeout(() => setLockedAlert({ show: false, msg: '' }), 5000);
    }
  };

  const handleToggleTask = (day: number, taskIdx: number, label: string) => {
    const key = `day-${day}-task-${taskIdx}`;
    
    if (day === 1 && label.includes('giới thiệu bản thân') && !activeUser.is_profile_completed) {
      addNotification(
        'Cần cập nhật hồ sơ cá nhân', 
        'Hãy truy cập tab Hồ Sơ Cá Nhân (Avatar) để cập nhật thông tin giới thiệu bản thân trước!', 
        'system'
      );
      return;
    }

    const nextChecked = !checkedTasks[key];
    const newCheckedState = {
      ...checkedTasks,
      [key]: nextChecked
    };

    setCheckedTasks(newCheckedState);
    localStorage.setItem('lms_onboarding_tasks_v2', JSON.stringify(newCheckedState));

    if (nextChecked) {
      addNotification('Nhiệm vụ hoàn thành!', `Bạn đã check xong một nhiệm vụ của Ngày ${day}!`, 'system');
    }
  };

  const parseInlineMarkdown = (text: string): React.ReactNode => {
    // Strip styling spans/fonts generated automatically by browsers
    let cleanText = text
      .replace(/<span[^>]*>/gi, '')
      .replace(/<\/span>/gi, '')
      .replace(/<font[^>]*>/gi, '')
      .replace(/<\/font>/gi, '');

    // Regex matches: links (markdown & HTML), bold, italics, and underline HTML tags
    const regex = /\[(.*?)\]\((.*?)\)|<a\s+(?:[^>]*?\s+)?href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>|\*\*(.*?)\*\*|\*(.*?)\*|<u>(.*?)<\/u>|<em[^>]*>(.*?)<\/em>/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(cleanText)) !== null) {
      if (match.index > lastIndex) {
        parts.push(cleanText.substring(lastIndex, match.index));
      }
      if (match[1] && match[2]) {
        // Markdown Link
        parts.push(
          <a key={`link-${match.index}`} href={match[2]} target="_blank" rel="noreferrer" className="text-sky-600 hover:text-sky-700 hover:underline font-bold transition-colors">
            {match[1]} <span className="text-[10px] inline-block ml-0.5">🔗</span>
          </a>
        );
      } else if (match[3] && match[4]) {
        // HTML Link
        parts.push(
          <a key={`link-html-${match.index}`} href={match[3]} target="_blank" rel="noreferrer" className="text-sky-600 hover:text-sky-700 hover:underline font-bold transition-colors">
            {match[4]} <span className="text-[10px] inline-block ml-0.5">🔗</span>
          </a>
        );
      } else if (match[5]) {
        // Bold
        const isTaskHeading = match[5].toLowerCase().startsWith('task ');
        parts.push(
          <strong 
            key={`bold-${match.index}`} 
            className={isTaskHeading ? "block text-base font-semibold text-[#214C54] mb-1" : "font-semibold text-[#214C54]"}
          >
            {match[5]}
          </strong>
        );
      } else if (match[6]) {
        // Italic (Markdown style)
        parts.push(
          <em key={`italic-md-${match.index}`} className="italic">
            {match[6]}
          </em>
        );
      } else if (match[7]) {
        // Underline HTML tag
        parts.push(
          <u key={`underline-${match.index}`} className="underline">
            {match[7]}
          </u>
        );
      } else if (match[8]) {
        // Italic (em HTML tag)
        parts.push(
          <em key={`italic-html-${match.index}`} className="italic">
            {match[8]}
          </em>
        );
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    return parts.length > 0 ? <>{parts}</> : text;
  };

  const renderRichText = (text: string): React.ReactNode => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const isQuote = line.startsWith('> ');
      if (isQuote) {
        line = line.substring(2);
      }
      
      const parsedLine = parseInlineMarkdown(line);

      if (isQuote) {
        return (
          <blockquote key={idx} className="border-l-4 border-[#EAB308] pl-4 py-3 my-3 bg-[#FDF5DA] rounded-r-lg text-[#15333B] italic shadow-sm text-base">
            {parsedLine}
          </blockquote>
        );
      }

      return (
        <div key={idx} className="min-h-[1.2em] my-1 text-base leading-relaxed text-[#3E5E63]">
          {parsedLine}
        </div>
      );
    });
  };

  const activeDayData = onboardingDays.find(d => d.day === selectedDay) || onboardingDays[0];

  // Local state for visual task editor
  const [editingTasks, setEditingTasks] = useState<{ id: string; label: string; isOptional: boolean }[]>([]);
  const [focusedTaskId, setFocusedTaskId] = useState<string | null>(null);

  // Synchronize local task list when activeDayData or isEditMode changes
  useEffect(() => {
    if (isEditMode && activeDayData) {
      const lines = activeDayData.checklist.split('\n');
      const parsed: { id: string; label: string; isOptional: boolean }[] = [];
      lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('- [ ]')) {
          const rawLabel = trimmed.replace('- [ ]', '').trim();
          const isOptional = rawLabel.toLowerCase().includes('(optional)');
          parsed.push({
            id: `task-${index}-${activeDayData.day}-${Date.now()}-${Math.random()}`,
            label: rawLabel,
            isOptional: isOptional
          });
        } else if (parsed.length > 0 && line.length > 0) {
          parsed[parsed.length - 1].label += '\n' + line;
        }
      });
      setEditingTasks(parsed);
    }
  }, [activeDayData.day, isEditMode]);

  const saveTasks = (newTasks: { id: string; label: string; isOptional: boolean }[]) => {
    setEditingTasks(newTasks);
    const serialized = newTasks.map(t => {
      let text = t.label;
      const hasOptional = text.toLowerCase().includes('(optional)');
      if (t.isOptional && !hasOptional) {
        text = text + ' (Optional)';
      } else if (!t.isOptional && hasOptional) {
        text = text.replace(/\s*\(optional\)/i, '');
      }
      return `- [ ] ${text}`;
    }).join('\n');
    updateOnboardingDay(activeDayData.day, { checklist: serialized });
  };

  const handleTaskLabelChange = (id: string, newLabel: string) => {
    const updated = editingTasks.map(t => t.id === id ? { ...t, label: newLabel } : t);
    setEditingTasks(updated);
    
    // Auto-save immediately to database/context when typing for instant layout updates
    const serialized = updated.map(t => {
      let text = t.label;
      const hasOptional = text.toLowerCase().includes('(optional)');
      if (t.isOptional && !hasOptional) {
        text = text + ' (Optional)';
      } else if (!t.isOptional && hasOptional) {
        text = text.replace(/\s*\(optional\)/i, '');
      }
      return `- [ ] ${text}`;
    }).join('\n');
    updateOnboardingDay(activeDayData.day, { checklist: serialized });
  };

  const handleTaskLabelBlur = (id: string, finalLabel: string) => {
    const updated = editingTasks.map(t => t.id === id ? { ...t, label: finalLabel } : t);
    saveTasks(updated);
  };

  const handleToggleOptional = (id: string) => {
    const updated = editingTasks.map(t => {
      if (t.id === id) {
        const nextOptional = !t.isOptional;
        let text = t.label;
        const hasOptional = text.toLowerCase().includes('(optional)');
        if (nextOptional && !hasOptional) {
          text = text + ' (Optional)';
        } else if (!nextOptional && hasOptional) {
          text = text.replace(/\s*\(optional\)/i, '');
        }
        return { ...t, label: text, isOptional: nextOptional };
      }
      return t;
    });
    saveTasks(updated);
  };

  const handleAddTask = () => {
    const newTasks = [
      ...editingTasks,
      {
        id: `task-new-${Date.now()}-${Math.random()}`,
        label: `**Task ${editingTasks.length + 1}:** Tên nhiệm vụ mới`,
        isOptional: false
      }
    ];
    saveTasks(newTasks);
  };

  const handleDeleteTask = (id: string) => {
    const newTasks = editingTasks.filter(t => t.id !== id);
    saveTasks(newTasks);
  };

  const handleMoveTask = (index: number, direction: 'up' | 'down') => {
    const newTasks = [...editingTasks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newTasks.length) {
      const temp = newTasks[index];
      newTasks[index] = newTasks[targetIndex];
      newTasks[targetIndex] = temp;
      saveTasks(newTasks);
    }
  };

  const applyFormatting = (taskId: string, format: 'bold' | 'italic' | 'underline' | 'ordered-list' | 'bullet-list' | 'link' | 'clear') => {
    const editor = document.getElementById(`input-${taskId}`) as HTMLDivElement;
    if (!editor) return;

    editor.focus();

    if (format === 'bold') {
      document.execCommand('bold', false);
    } else if (format === 'italic') {
      document.execCommand('italic', false);
    } else if (format === 'underline') {
      document.execCommand('underline', false);
    } else if (format === 'ordered-list') {
      document.execCommand('insertOrderedList', false);
    } else if (format === 'bullet-list') {
      document.execCommand('insertUnorderedList', false);
    } else if (format === 'link') {
      const url = prompt('Nhập địa chỉ liên kết (URL):', 'https://');
      if (url) {
        document.execCommand('createLink', false, url);
      }
    } else if (format === 'clear') {
      document.execCommand('removeFormat', false);
    }

    // Trigger onInput manually to sync state and save
    const html = editor.innerHTML;
    let markdown = html
      .replace(/<span[^>]*>/gi, '')
      .replace(/<\/span>/gi, '')
      .replace(/<font[^>]*>/gi, '')
      .replace(/<\/font>/gi, '')
      .replace(/<b>(.*?)<\/b>/gi, '**$1**')
      .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<i>(.*?)<\/i>/gi, '*$1*')
      .replace(/<em>(.*?)<\/em>/gi, '*$1*')
      .replace(/<u>(.*?)<\/u>/gi, '<u>$1</u>')
      .replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
      .replace(/<ol>([\s\S]*?)<\/ol>/gi, (_, p1) => {
        let idx = 1;
        // Clean inner li tags and make sure we have correct line endings
        return '\n' + p1.replace(/<li>(.*?)<\/li>/gi, () => `${idx++}. $1\n`).trim() + '\n';
      })
      .replace(/<ul>([\s\S]*?)<\/ul>/gi, (_, p1) => {
        return '\n' + p1.replace(/<li>(.*?)<\/li>/gi, '- $1\n').trim() + '\n';
      })
      .replace(/<div><br><\/div>/gi, '\n')
      .replace(/<div>(.*?)<\/div>/gi, '\n$1')
      .replace(/<br>/gi, '\n')
      .replace(/&nbsp;/g, ' ')
      .trim();

    handleTaskLabelChange(taskId, markdown);
  };

  const dayTasks = getTasksForDay(activeDayData);
  const visual = DAY_VISUAL_STYLES[selectedDay] || DAY_VISUAL_STYLES[1];

  return (
    <div className="space-y-5 max-w-5xl mx-auto pb-10 animate-fade-in select-none">
      <PageHeader
        title="Onboarding Week"
        description="Hoàn thành các thử thách thiết lập môi trường, kỹ năng giao tiếp AI và tìm hiểu về PRD."
        helpTitle="Onboarding"
        helpSummary="Hướng dẫn làm quen hệ thống, lộ trình và phương pháp học trong tuần đầu tiên."
        helpPurpose="Giúp bạn khởi động đúng cách — thiết lập toàn bộ nền tảng, hiểu rõ luật chơi và sẵn sàng tâm lý để bước vào khoá học."
      />

      {/* Locked Alert speech box from mascot */}
      {lockedAlert.show && (
        <div className="bg-[#FFFBEB] border-2 border-amber-300 p-4 rounded-2xl flex items-start gap-4 animate-shake shadow-md">
          <span className="text-3xl">🦜</span>
          <div className="space-y-1">
            <span className="text-xs text-amber-700 font-black block uppercase tracking-wider">Bác Vẹt Cảnh Báo Thủy Triều:</span>
            <p className="text-sm text-amber-800 leading-relaxed font-semibold">
              "{lockedAlert.msg}"
            </p>
          </div>
        </div>
      )}

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {onboardingDays.map((dayData) => {
            const status = getDayLockStatus(dayData.day);
            const isUnlocked = status.isUnlocked;
            
            const tasks = getTasksForDay(dayData);
            const totalTasks = tasks.length;
            const completedTasks = tasks.filter(t => checkedTasks[t.key]).length;
            const isCompleted = totalTasks > 0 && completedTasks === totalTasks;
            
            const cardVisual = DAY_VISUAL_STYLES[dayData.day];

            return (
              <button
                key={dayData.day}
                onClick={() => handleDayCardClick(dayData.day)}
                className={`relative flex flex-col text-left rounded-3xl overflow-hidden transition-all duration-300 group
                  ${isUnlocked 
                    ? 'hover:-translate-y-1 hover:shadow-xl hover:shadow-[#214C54]/20 ring-1 ring-black/5 bg-white' 
                    : 'opacity-60 grayscale-[50%] cursor-not-allowed bg-gray-50'
                  }`}
              >
                {/* Header Area with Gradient */}
                <div className={`relative h-28 w-full bg-gradient-to-br ${cardVisual.gradient} p-5 flex items-start justify-between overflow-hidden shrink-0`}>
                  {cardVisual.bgPattern}
                  
                  <div className="relative z-10 bg-white/20 backdrop-blur-sm p-3 rounded-2xl text-white shadow-sm">
                    {cardVisual.icon}
                  </div>
                  
                  {/* Status Indicator */}
                  <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white shadow-sm border border-white/30">
                    {!isUnlocked ? (
                      <Lock className="w-4 h-4" />
                    ) : isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                    ) : (
                      <span className="text-sm font-black">{dayData.day}</span>
                    )}
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#214C54]/50 mb-1">
                    Ngày {dayData.day}
                  </h3>
                  <h4 className="text-lg font-bold text-[#15333B] leading-tight mb-2 line-clamp-2 flex-1 group-hover:text-sky-600 transition-colors">
                    {dayData.title.replace(/^Ngày \d+[:\-]?\s*/i, '').trim()}
                  </h4>
                  
                  <p className="text-sm text-[#3E5E63] line-clamp-2 mb-4 leading-relaxed h-10">
                    {cardVisual.summary}
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs font-semibold mb-2">
                      <span className={isCompleted ? "text-emerald-600" : "text-[#3E5E63]"}>
                        {isCompleted ? "Đã hoàn thành" : "Tiến độ"}
                      </span>
                      <span className="text-[#214C54]">{completedTasks}/{totalTasks}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-sky-500'}`}
                        style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="animate-fade-in max-w-4xl mx-auto space-y-5">
          <button 
            onClick={() => {
              setViewMode('grid');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            className="flex items-center gap-2 text-[#3E5E63] font-semibold mb-4 hover:text-sky-600 transition-colors px-4 py-2 bg-white border border-gray-200 rounded-xl hover:shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" /> Quay lại Bản Đồ Hải Trình
          </button>

          {isEditMode && (
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <span className="text-2xl text-amber-600">⏰</span>
                <div>
                  <span className="text-sm font-bold text-amber-800 block">Thời gian mở khóa tự động (Ngày {activeDayData.day})</span>
                  <span className="text-xs text-amber-600">Đến giờ hẹn hệ thống sẽ tự mở khóa và gửi email thông báo</span>
                </div>
              </div>
              <div>
                <input
                  type="datetime-local"
                  className="border border-amber-300 rounded-xl px-4 py-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-bold"
                  value={(() => {
                    const sched = onboardingUnlockSchedules.find(s => s.day === activeDayData.day);
                    return sched ? toLocalDatetimeString(sched.scheduled_at) : '';
                  })()}
                  onChange={(e) => {
                    if (e.target.value) {
                      updateOnboardingUnlockSchedule(activeDayData.day, new Date(e.target.value).toISOString());
                    }
                  }}
                />
              </div>
            </div>
          )}
          
          <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${visual.gradient} shadow-lg shadow-[#214C54]/10`}>
            {visual.bgPattern}
            <div className="relative z-10 px-8 py-10 md:py-14 text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                  {visual.icon}
                </div>
                <h2 className="text-sm font-black uppercase tracking-widest text-white/80">Ngày {activeDayData.day}</h2>
              </div>
              {isEditMode ? (
                <div className="max-w-2xl bg-white/10 rounded-2xl p-2">
                  <EditableText
                    value={activeDayData.title}
                    onSave={(newValue) => updateOnboardingDay(activeDayData.day, { title: newValue })}
                    className="text-2xl md:text-3xl font-extrabold leading-tight text-white border-none focus:ring-0"
                    minRows={1}
                  />
                </div>
              ) : (
                <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                  {activeDayData.title.replace(/^Ngày \d+[:\-]?\s*/i, '').trim()}
                </h1>
              )}
            </div>
          </div>

          {/* Day Objective */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-sky-500"></div>
            <h3 className="text-xl font-bold text-[#15333B] mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-sky-500" /> Mục tiêu chặng
            </h3>
            <div className="text-[17px] text-[#3E5E63] leading-relaxed w-full">
              {isEditMode ? (
                <EditableText
                  value={activeDayData.objective}
                  onSave={(newValue) => updateOnboardingDay(activeDayData.day, { objective: newValue })}
                  className="text-[#3E5E63] w-full"
                  minRows={4}
                />
              ) : (
                renderRichText(activeDayData.objective)
              )}
            </div>
          </div>

          {/* Task Checklist Panel */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-5 mb-6 gap-4">
              <h2 className="text-2xl font-bold text-[#15333B] flex items-center gap-2">
                <ClipboardList className="w-6 h-6 text-emerald-500" /> Danh sách Nhiệm vụ
              </h2>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm px-4 py-1.5 rounded-full font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Hoàn thành: {dayTasks.filter(t => checkedTasks[t.key]).length} / {dayTasks.length}
              </span>
            </div>
            
            <div className="space-y-3">
              {isEditMode ? (
                <div className="space-y-4 w-full">
                  <div className="space-y-3">
                    {editingTasks.map((task, idx) => (
                      <div key={task.id} className="flex flex-col gap-2 bg-white p-4 rounded-2xl border border-gray-200 hover:border-sky-300 hover:shadow-md transition-all">
                        {/* Formatting toolbar shown only when this task is active */}
                        {focusedTaskId === task.id && (
                          <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-xl border border-slate-200/60 shadow-inner">
                            <button
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                applyFormatting(task.id, 'bold');
                              }}
                              className="w-7 h-7 flex items-center justify-center text-sm font-extrabold hover:bg-white rounded-lg text-slate-700 transition-colors border border-transparent hover:border-slate-200/80 hover:shadow-sm"
                              title="In đậm (Bold)"
                            >
                              B
                            </button>
                            <button
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                applyFormatting(task.id, 'italic');
                              }}
                              className="w-7 h-7 flex items-center justify-center text-sm italic hover:bg-white rounded-lg text-slate-700 transition-colors border border-transparent hover:border-slate-200/80 hover:shadow-sm"
                              title="In nghiêng (Italic)"
                            >
                              I
                            </button>
                            <button
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                applyFormatting(task.id, 'underline');
                              }}
                              className="w-7 h-7 flex items-center justify-center text-sm underline hover:bg-white rounded-lg text-slate-700 transition-colors border border-transparent hover:border-slate-200/80 hover:shadow-sm"
                              title="Gạch chân (Underline)"
                            >
                              U
                            </button>
                            <div className="w-px h-5 bg-gray-300 mx-1"></div>
                            <button
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                applyFormatting(task.id, 'ordered-list');
                              }}
                              className="px-2 h-7 flex items-center justify-center text-[10px] font-black hover:bg-white rounded-lg text-slate-700 transition-colors border border-transparent hover:border-slate-200/80 hover:shadow-sm"
                              title="Danh sách số"
                            >
                              1.2.3.
                            </button>
                            <button
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                applyFormatting(task.id, 'bullet-list');
                              }}
                              className="px-2 h-7 flex items-center justify-center text-xs hover:bg-white rounded-lg text-[#214C54] transition-colors border border-transparent hover:border-slate-200/80 hover:shadow-sm"
                              title="Danh sách điểm"
                            >
                              •••
                            </button>
                            <div className="w-px h-5 bg-gray-300 mx-1"></div>
                            <button
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                applyFormatting(task.id, 'link');
                              }}
                              className="px-2.5 h-7 flex items-center justify-center text-xs hover:bg-white rounded-lg text-slate-700 transition-colors border border-transparent hover:border-slate-200/80 hover:shadow-sm gap-1"
                              title="Gắn link"
                            >
                              🔗 Link
                            </button>
                            <button
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                applyFormatting(task.id, 'clear');
                              }}
                              className="w-7 h-7 flex items-center justify-center text-sm hover:bg-white rounded-lg text-rose-600 transition-colors border border-transparent hover:border-slate-200/80 hover:shadow-sm"
                              title="Xóa định dạng"
                            >
                              Tx
                            </button>
                            <span className="text-[9px] text-gray-400 ml-auto italic hidden sm:inline pr-1">Nhấn Enter để xuống dòng</span>
                          </div>
                        )}

                        <div className="flex items-start gap-3">
                          {/* Reordering */}
                          <div className="flex flex-col gap-1 shrink-0 pt-1.5">
                            <button
                              type="button"
                              onClick={() => handleMoveTask(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
                              title="Di chuyển lên"
                            >
                              <ArrowUp size={14} className="text-[#3E5E63]" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveTask(idx, 'down')}
                              disabled={idx === editingTasks.length - 1}
                              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
                              title="Di chuyển xuống"
                            >
                              <ArrowDown size={14} className="text-[#3E5E63]" />
                            </button>
                          </div>

                          {/* Task Text Area (WYSIWYG contentEditable) */}
                          <div className="flex-1 min-w-0">
                            <div
                              id={`input-${task.id}`}
                              contentEditable
                              suppressContentEditableWarning
                              onInput={(e) => {
                                const target = e.currentTarget;
                                // Convert visual HTML layout to markdown to save state
                                let html = target.innerHTML;
                                
                                // Standardize HTML tags to markdown
                                let markdown = html
                                  .replace(/<span[^>]*>/gi, '')
                                  .replace(/<\/span>/gi, '')
                                  .replace(/<font[^>]*>/gi, '')
                                  .replace(/<\/font>/gi, '')
                                  .replace(/<b>(.*?)<\/b>/gi, '**$1**')
                                  .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
                                  .replace(/<i>(.*?)<\/i>/gi, '*$1*')
                                  .replace(/<em>(.*?)<\/em>/gi, '*$1*')
                                  .replace(/<u>(.*?)<\/u>/gi, '<u>$1</u>')
                                  .replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
                                  .replace(/<ol>([\s\S]*?)<\/ol>/gi, (_, p1) => {
                                    let idx = 1;
                                    return '\n' + p1.replace(/<li>(.*?)<\/li>/gi, () => `${idx++}. $1\n`).trim() + '\n';
                                  })
                                  .replace(/<ul>([\s\S]*?)<\/ul>/gi, (_, p1) => {
                                    return '\n' + p1.replace(/<li>(.*?)<\/li>/gi, '- $1\n').trim() + '\n';
                                  })
                                  .replace(/<div><br><\/div>/gi, '\n')
                                  .replace(/<div>(.*?)<\/div>/gi, '\n$1')
                                  .replace(/<br>/gi, '\n')
                                  .replace(/&nbsp;/g, ' ')
                                  .trim();
                                
                                handleTaskLabelChange(task.id, markdown);
                              }}
                              onBlur={() => {
                                handleTaskLabelBlur(task.id, task.label);
                                setTimeout(() => setFocusedTaskId(null), 200);
                              }}
                              onFocus={() => {
                                setFocusedTaskId(task.id);
                              }}
                              className="w-full bg-transparent focus:outline-none py-1 px-1.5 text-sm text-[#15333B] font-semibold border-b border-transparent focus:border-slate-200 min-h-[2em]"
                              dangerouslySetInnerHTML={{
                                __html: task.label
                                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                  .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
                                  .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-sky-650 hover:underline">$1</a>')
                                  .split('\n').join('<br>')
                              }}
                            />
                          </div>

                          {/* Optional toggle */}
                          <label className="flex items-center gap-1.5 cursor-pointer select-none shrink-0 border border-gray-100 rounded-xl p-2 bg-gray-50 hover:bg-gray-100 transition-colors mt-0.5">
                            <input
                              type="checkbox"
                              checked={task.isOptional}
                              onChange={() => handleToggleOptional(task.id)}
                              className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                            />
                            <span className="text-xs font-bold text-[#3E5E63]">Tùy chọn</span>
                          </label>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all shrink-0 mt-0.5"
                            title="Xóa nhiệm vụ"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleAddTask}
                    className="w-full py-3 border-2 border-dashed border-[#214C54]/30 hover:border-[#214C54]/80 text-[#214C54] hover:bg-[#214C54]/5 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Plus size={14} /> Thêm Nhiệm Vụ Mới
                  </button>
                </div>
              ) : (
                dayTasks.map((task) => {
                  const isCompleted = !!checkedTasks[task.key];
                  return (
                    <div key={task.key} className={`p-4 md:p-5 rounded-2xl border transition-all duration-300 ${isCompleted ? 'bg-emerald-50/50 border-emerald-200 opacity-90' : 'bg-white border-gray-200 hover:border-sky-300 hover:shadow-md'}`}>
                      <label className="flex items-start gap-4 cursor-pointer group">
                        <div className="pt-1 shrink-0">
                          <input 
                            type="checkbox" 
                            checked={isCompleted}
                            onChange={() => handleToggleTask(activeDayData.day, task.idx, task.label)}
                            className="w-5 h-5 rounded-md border-2 border-gray-300 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer transition-colors"
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className={`text-[17px] leading-relaxed transition-all ${isCompleted ? 'text-gray-400 line-through' : 'text-[#3E5E63]'}`}>
                            {renderRichText(task.label)}
                          </div>
                          {/* Hint / Warning if profile is incomplete for Day 1 Task 3 */}
                          {activeDayData.day === 1 && task.label.includes('giới thiệu bản thân') && !isCompleted && (
                            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-800 font-semibold leading-relaxed mt-3 flex items-start gap-2" onClick={(e) => e.preventDefault()}>
                              <MessageSquareWarning className="w-5 h-5 shrink-0 text-amber-600" />
                              <div>Cập nhật thông tin phần "Giới Thiệu Bản Thân" ở Hồ Sơ Cá Nhân (Avatar) đầy đủ sẽ tự động đánh dấu hoàn thành nhiệm vụ này.</div>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Ghi nhớ */}
          {activeDayData.takeaway && (
            <div className="bg-[#FDF5DA] border-l-4 border-[#EAB308] p-6 md:p-8 rounded-r-3xl shadow-sm space-y-4">
              <h4 className="text-xl font-bold text-[#15333B] flex items-center gap-2">
                <Pin className="w-6 h-6 text-amber-600" /> Ghi nhớ cốt lõi
              </h4>
              <div className="text-[17px] text-[#15333B] leading-relaxed space-y-3 w-full">
                {isEditMode ? (
                  <EditableText
                    value={activeDayData.takeaway}
                    onSave={(newValue) => updateOnboardingDay(activeDayData.day, { takeaway: newValue })}
                    className="text-[#15333B] w-full"
                    minRows={3}
                  />
                ) : (
                  renderRichText(activeDayData.takeaway)
                )}
              </div>
            </div>
          )}

          {/* Companion Mascot speech box */}
          {!isEditMode && (
            <div className="bg-white border-2 border-sky-100 p-5 rounded-2xl flex items-start gap-4">
              <span className="text-3xl">🦜</span>
              <div className="space-y-1">
                <span className="text-xs text-sky-700 font-black block uppercase tracking-wider">Bác Vẹt Đồng Hành gợi ý:</span>
                <p className="text-sm text-[#3E5E63] leading-relaxed font-semibold">
                  "Thực hiện xong nhiệm vụ nào thì check ngay vào ô trống bên cạnh để nhận điểm thưởng nhé! Tích tiểu thành đại, hải trình còn dài! Nhớ hoàn thành 100% để mở khóa ngày mai nhé!"
                </p>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

