import type { OnboardingDay } from '../types/database';

export const VIBE_7DAY_ONBOARDING_DAYS: OnboardingDay[] = [
  {
    day: 1,
    course_id: 'course-vibe-201',
    batch_id: 'batch-vibe201-k2',
    title: 'Ngày 1: Khởi động, làm quen với khoá học',
    intro: 'Tuần Onboarding rất quan trọng cho trải nghiệm học: dù chưa vào học ngay với mình, nhưng sẽ kích hoạt bạn như một người học chủ động.',
    objective: 'Làm quen với lớp học, cộng đồng và cách hoạt động. Đặt ra "lý do tại sao" bạn học khóa này. Cam kết với chính mình rằng bạn sẽ hành động – không chỉ đọc lý thuyết.',
    checklist: `- [ ] **Task 1:** Viết 01 post giới thiệu bản thân trong [Group Facebook](https://www.facebook.com/share/g/1AehPRGe9U/) của lớp và ghi hashtag **#OB_Ngay1** ở đầu bài viết.\n- [ ] **Task 2:** Cung cấp thông tin: Tên bạn, công việc hiện tại (ngành nghề), các sản phẩm bạn đã từng build bằng AI.\n- [ ] **Task 3:** Trở ngại lớn nhất của bạn khi tham gia khóa học này & cách bạn dự định khắc phục.\n- [ ] **Task 4:** Lợi thế của riêng bạn khi tham gia khóa học.\n- [ ] **Task 5 (Quan trọng):** Cam kết số tiếng/tuần/ngày để học build và hình phạt chấp nhận nếu không hoàn thành bài tập.`,
    takeaway: 'Bạn không cần phải “giỏi” để bắt đầu. Nhưng bạn phải bắt đầu thì mới có thể “giỏi”.',
    companionHint: 'Hãy nhớ rằng những thành viên trong lớp sẽ là những users đầu tiên beta test cho sản phẩm của bạn. Một dòng giới thiệu để người ta hiểu bạn hơn, cũng là để bạn hiểu users của mình hơn.',
    bonusResources: 'Tìm hiểu các sản phẩm AI của các bạn học cùng khoá.'
  },
  {
    day: 2,
    course_id: 'course-vibe-201',
    batch_id: 'batch-vibe201-k2',
    title: 'Ngày 2: Xác định sản phẩm bạn muốn xây',
    intro: 'Đây là ngày quan trọng nhất trong toàn khoá học, vì xác định được vấn đề đáng để bạn giải quyết, và đưa ra hình dung về sản phẩm bạn muốn tạo ra cuối khoá học sẽ trở thành động lực giúp bạn đi đến cuối hành trình.',
    objective: 'Tìm hiểu như thế nào là một “sản phẩm”, nắm vững thuật ngữ Problem Statement, PRD và xác định vấn đề bạn muốn giải quyết trong khoá học.',
    checklist: `- [ ] **Task 1:** Tìm hiểu: Như thế nào là một “sản phẩm”? [Link bài viết](https://app.notion.com/p/Th-n-o-m-i-g-i-l-s-n-ph-m-20afb1613f7080cb8d61e0b84e2d52c4?source=copy_link)\n- [ ] **Task 2:** Trả lời câu hỏi và chia sẻ lên [Group Facebook](https://www.facebook.com/groups/27216190438021089) của lớp với hashtag #OB_Ngay2.\n- [ ] **Task 3:** Xem video và slide về thuật ngữ: Problem Statement [Recording Link](https://youtu.be/skbxfJr8MQE)\n- [ ] **Task 4:** Tìm Problem Statement cho sản phẩm của bạn (sử dụng Gemini Gem “Product Discovery”), chia sẻ lên Group Facebook với hashtag #OB_Ngay2.\n- [ ] **Task 5:** Tìm hiểu thêm về PRD - Products Requirement Documents [Recording](https://youtu.be/QRbzd2tCYls) & [PRD Mẫu](https://docs.google.com/document/d/1mDslTv8gzuwdQN7pZ6Ss6g0s5_5oyOO0PCw6FH-1As8/edit?tab=t.0#heading=h.jh0gwzt5ucmt)\n- [ ] **Task 6 (Optional):** Đọc thêm về cách nói chuyện với users và lấy feedback [The1ight Substack](https://the1ight.substack.com/p/mo-khoa-6-lam-sao-e-thuc-su-noi-chuyen?r=2f46k)`,
    takeaway: 'Đừng ngại chia sẻ idea còn “chưa chắc chắn”. Mọi sản phẩm tốt đều bắt đầu từ một vấn đề rất đời thường.',
    companionHint: 'Problem Statement hôm nay là bản draft thô đầu tiên của bạn. Đừng áp lực phải viết hoàn hảo, đây sẽ là kim chỉ nam cho bạn trong suốt khoá học.',
    bonusResources: 'Gemini Gem Product Discovery: https://gemini.google.com/gem/1mkUCEXAJOmcF9Hj75K9rkgWMN520_77X?usp=sharing'
  },
  {
    day: 3,
    course_id: 'course-vibe-201',
    batch_id: 'batch-vibe201-k2',
    title: 'Ngày 3: IDE, MCP và CLI',
    intro: 'Khám phá cách phần mềm, lập trình viên và các mô hình AI giao tiếp với nhau cũng như với hệ thống máy tính thông qua MCP và CLI. Giúp bạn phân biệt rõ bản chất, vị trí và use case thực tế của từng khái niệm.',
    objective: 'Phân biệt rõ ràng 3 khái niệm nền tảng: IDE, MCP và CLI; hiểu cách AI Agents chọn tool cho từng tác vụ.',
    checklist: `- [ ] **Task 1:** Tìm hiểu về 03 thuật ngữ IDE, MCP, và CLI (hỏi ChatGPT/Gemini về định nghĩa, use case, ví dụ & hiểu lầm thường gặp).\n- [ ] **Task 2:** Xem video: Bài giảng của thầy Quang về IDE [Link](https://youtu.be/G8n4vGcGpQk), Bài giảng của thầy Chí về MCP [Link](https://youtu.be/KDriJKjuVP0), CLI vs MCP: Hiểu cách AI Agents chọn tool [Video](https://youtu.be/g9JIUM0MHgQ?si=rp9u4zIBKCaZ0zLP).\n- [ ] **Task 3:** Chia sẻ lên [Group Facebook](https://www.facebook.com/groups/27216190438021089) của lớp với hashtag #OB_Ngay3 (Giải thích IDE, CLI, MCP theo cách hiểu của bạn & kinh nghiệm/dự định áp dụng).`,
    takeaway: 'Hiểu rõ bản chất công cụ giúp bạn chỉ đạo AI chính xác và xây dựng hệ thống bền vững.',
    companionHint: 'Nếu bạn chưa từng dùng CLI hay MCP, đừng lo lắng, các buổi Live Class sẽ hướng dẫn bạn thực hành từng bước.',
    bonusResources: 'Khóa học Giới thiệu & Nâng cao về MCP (Anthropic), CLI cho người mới bắt đầu: https://youtu.be/uwAqEzhyjtw'
  },
  {
    day: 4,
    course_id: 'course-vibe-201',
    batch_id: 'batch-vibe201-k2',
    title: 'Ngày 4: Skills và Rules',
    intro: 'Làm quen với hai thuật ngữ Skills và Rules, được sử dụng rất nhiều khi làm việc với IDE và AI Coding Agents.',
    objective: 'Hiểu rõ khái niệm Agent Skills và Rules, phân biệt Global Rules vs Workspace Rules, học cách viết Rules hiệu quả cho AI.',
    checklist: `- [ ] **Task 1:** Tìm hiểu về thuật ngữ Agent Skills và Rules (hỏi AI về use case, hạn chế, sự khác nhau giữa Global Rules & Workspace/Project Rules).\n- [ ] **Task 2:** Xem video: Bài giảng của thầy Chí về Skills và Rules [Link](https://youtu.be/zHyI6hQAY-U), AI Agent Skills từ IBM Technology [Link](https://youtu.be/Lg-meK5IU8Q), Cách Viết Rules Hiệu Quả [Link](https://www.youtube.com/watch?v=MYnYY8Rlego).\n- [ ] **Task 3:** Chia sẻ lên [Group Facebook](https://www.facebook.com/groups/27216190438021089) của lớp với hashtag #OB_Ngay4 (Giải thích Skills, Rules và các loại Rules theo lời của bạn).`,
    takeaway: 'Rules và Skills là cách bạn truyền đạt tiêu chuẩn chất lượng và kinh nghiệm cho AI Agent.',
    companionHint: 'Đây là bước khởi động nhẹ, buổi học trên lớp sẽ đi sâu hơn vào cách tạo Skills thực chiến.',
    bonusResources: 'Andrej Karpathy Skills repo: https://github.com/multica-ai/andrej-karpathy-skills, Hướng dẫn xây dựng Skills từ Anthropic & Antigravity.'
  },
  {
    day: 5,
    course_id: 'course-vibe-201',
    batch_id: 'batch-vibe201-k2',
    title: 'Ngày 5: GitHub',
    intro: 'Khám phá GitHub - nền tảng dịch vụ lưu trữ mã nguồn dựa trên đám mây, sử dụng hệ thống quản lý phiên bản Git.',
    objective: 'Nắm vững các khái niệm Git, GitHub và Repository, hiểu use case của việc quản lý phiên bản khi xây dựng sản phẩm với AI.',
    checklist: `- [ ] **Task 1:** Tìm hiểu thêm về thuật ngữ Git, GitHub và repository (Vì sao phải biết Git? Repository có use case gì khi build với AI?).\n- [ ] **Task 2:** Xem video: Bài giảng của thầy Chí về Git [Link](https://youtu.be/ipBC4-keBS8), Giới thiệu về GitHub [Video](https://youtu.be/pBy1zgt0XPc), bài viết The1ight Substack [Link](https://substack.com/@the1ight/note/p-203672461).\n- [ ] **Task 3:** Chia sẻ lên [Group Facebook](https://www.facebook.com/groups/27216190438021089) của lớp với hashtag #OB_Ngay5 (Giải thích Git & GitHub bằng lời của bạn và dự định áp dụng).`,
    takeaway: 'Git là chiếc máy thời gian cho code của bạn — giúp bạn tự tin thử nghiệm mà không sợ mất dữ liệu.',
    companionHint: 'Tạo tài khoản GitHub ngay hôm nay để sẵn sàng kết nối với IDE và AI coding tools!',
    bonusResources: 'Video hướng dẫn Git & GitHub thực chiến: https://youtu.be/RGOj5yH7evk'
  },
  {
    day: 6,
    course_id: 'course-vibe-201',
    batch_id: 'batch-vibe201-k2',
    title: 'Ngày 6: Frontend vs Backend',
    intro: 'Khám phá hai khái niệm quan trọng nhất trong kiến trúc ứng dụng web: Frontend và Backend.',
    objective: 'Phân biệt rạch ròi giữa giao diện người dùng (Frontend) và logic xử lý/dữ liệu phía sau (Backend), hiểu vì sao cần nắm cả hai khi làm việc với AI.',
    checklist: `- [ ] **Task 1:** Tìm hiểu về thuật ngữ Frontend & Backend (hỏi AI: sự khác nhau, ví dụ và 3 hiểu lầm thường gặp).\n- [ ] **Task 2:** Xem video bài giảng của thầy giáo về Frontend và Backend [Recording Link](https://youtu.be/XSyBeGZlPSY).\n- [ ] **Task 3:** Chia sẻ lên [Group Facebook](https://www.facebook.com/groups/27216190438021089) của lớp với hashtag #OB_Ngay6 (Giải thích Frontend & Backend và lý do cần hiểu khi xây sản phẩm bằng AI).`,
    takeaway: 'Frontend là vẻ đẹp bên ngoài, Backend là bộ não bên trong. Một sản phẩm hoàn chỉnh cần cả hai phối hợp nhịp nhàng.',
    companionHint: 'Đừng hoang mang bởi các thuật ngữ phức tạp, hãy hình dung Frontend như mặt tiền nhà hàng và Backend như gian bếp nấu nướng!',
    bonusResources: 'Tài liệu và video bổ trợ kiến trúc web Frontend & Backend.'
  },
  {
    day: 7,
    course_id: 'course-vibe-201',
    batch_id: 'batch-vibe201-k2',
    title: 'Ngày 7: Domain & DNS',
    intro: 'Khám phá về Domain và các nền tảng giúp bạn có thể đưa sản phẩm lên Internet và chia sẻ cho người khác dùng.',
    objective: 'Hiểu rõ Domain, DNS, phân biệt các nền tảng triển khai (Vercel, Cloudflare, VPS, Docker) và chọn giải pháp phù hợp cho sản phẩm.',
    checklist: `- [ ] **Task 1:** Tìm hiểu Domain và DNS là gì? Vercel, Cloudflare, VPS, Docker khác nhau thế nào? Nền tảng nào phù hợp cho dự án của bạn?\n- [ ] **Task 2:** Xem các video hướng dẫn về Domain, DNS & Deploy [Video 1](https://youtu.be/hJrQN3n-aXQ), [Video 2](https://youtu.be/acvI1YxHfFw), [Video 3](https://youtu.be/zFXscjUoDDA).\n- [ ] **Task 3:** Chia sẻ lên [Group Facebook](https://www.facebook.com/groups/27216190438021089) của lớp với hashtag #OB_Ngay7 (Giải thích Domain & DNS, chia sẻ kinh nghiệm dùng Cloudflare/Vercel của bạn).`,
    takeaway: 'Đưa sản phẩm lên Internet có tên miền riêng là khoảnh khắc bạn biến ý tưởng thành hiện thực trước mắt cả thế giới.',
    companionHint: 'Chúc mừng bạn đã hoàn thành trọn vẹn 7 ngày Onboarding! Hẹn gặp bạn trong buổi Live Class đầu tiên!',
    bonusResources: 'Tài liệu hướng dẫn trỏ DNS và cấu hình Custom Domain trên Cloudflare & Vercel.'
  }
];
