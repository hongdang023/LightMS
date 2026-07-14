export interface OnboardingDay {
  day: number;
  title: string;
  intro: string;
  objective: string;
  checklist: string;
  takeaway: string;
  companionHint?: string;
  bonusResources?: string;
  email_subject?: string;
  email_body?: string;
}

export const ONBOARDING_DAYS_DATA: OnboardingDay[] = [
  {
    day: 1,
    title: "Ngày 1: Khởi động, làm quen với khoá học",
    intro: "Tuần Onboarding rất quan trọng cho trải nghiệm học: dù chưa vào học ngay với mình, nhưng sẽ **kích hoạt bạn như một người học chủ động**.",
    objective: "Đến với Onboarding ngày 1, bạn sẽ làm quen với những người bạn học cùng, và tập kết nối với lớp thông qua việc post vào nhóm cộng đồng và group của lớp.\n\nBạn sẽ:\n- Làm quen với lớp học, cộng đồng, và cách hoạt động\n- Đặt ra \"lý do tại sao\" bạn học khóa này\n- Cam kết với chính mình rằng bạn sẽ hành động – không chỉ đọc lý thuyết",
    checklist: "- [ ] **Task 1:** Viết 01 post giới thiệu bản thân trong [Group Facebook](https://www.facebook.com/share/g/1AehPRGe9U/) của lớp và ghi hastag **#OB_Ngay1** ở đầu bài viết.\n\n  *Gợi ý: Hãy nhớ rằng, trong phần lớn trường hợp, chúng ta không build sản phẩm chỉ cho một mình dùng. Chính vì vậy, nhiều khả năng những thành viên trong lớp sẽ là những users đầu tiên beta test cho sản phẩm của bạn. Một dòng giới thiệu để người ta hiểu bạn hơn, cũng là một dòng thông tin để bạn hiểu users của mình hơn.*\n\n  *Nội dung giới thiệu bao gồm:*\n  - Tên bạn, công việc hiện tại (ngành nghề)\n  - Các sản phẩm bạn đã từng build bằng AI\n  - Một trở ngại lớn nhất của bạn khi tham gia khóa học này - Bạn dự định khắc phục trở ngại này như thế nào?\n  - Một lợi thế của riêng bạn khi tham gia khóa học này\n  - **Quan trọng**: Cam kết sẽ dành ra bao nhiêu tiếng/tuần/ngày để học build, vào thời gian trống nào trong tuần. Nếu không hoàn thành bài tập về nhà, bạn sẽ chấp nhận làm gì? (VD: múa bụng, mời cả lớp trà sữa,…)\n- [ ] **Task 2:** Tìm hiểu: Như thế nào là một “sản phẩm”?\n      Link bài viết: ‣[Link](https://app.notion.com/p/Th-n-o-m-i-g-i-l-s-n-ph-m-20afb1613f7080cb8d61e0b84e2d52c4?source=copy_link)\n- [ ] **Task 3:** Trả lời câu hỏi dưới đây. Chia sẻ lên [Group Facebook](https://www.facebook.com/groups/27216190438021089) của lớp và gắn hastag #OB_Ngay1.\n  - Trước đây bạn nghĩ sản phẩm là gì? Sau khi đọc bài viết, suy nghĩ đó đã thay đổi như thế nào?\n  - Đâu là mấu chốt để tạo ra một sản phẩm thành công?",
    takeaway: "",
    companionHint: "Bạn không cần phải “giỏi” để bắt đầu. Nhưng bạn phải bắt đầu thì mới có thể “giỏi”.",
    bonusResources: ""
  },
  {
    day: 2,
    title: "Ngày 2: Xác định sản phẩm bạn muốn xây",
    intro: "",
    objective: "Đây là ngày quan trọng nhất trong toàn khoá học, vì xác định được vấn đề đáng để bạn giải quyết, và đưa ra hình dung về sản phẩm bạn muốn tạo ra cuối khoá học sẽ trở thành động lực giúp bạn đi đến cuối hành trình.",
    checklist: "- [ ] **Task 1:** Xem video và slide bên dưới để thêm về thuật ngữ: **_Problem Statement_**\n  - Recording: [Link](https://youtu.be/skbxfJr8MQE)\n- [ ] **Task 2:** Tìm Problem Statement cho sản phẩm của bạn.\n  Mời bạn trải nghiệm Gemini Gems **“Product Discovery”** hỗ trợ bạn đánh giá và đào sâu vấn đề: [Link](https://gemini.google.com/gem/1mkUCEXAJOmcF9Hj75K9rkgWMN520_77X?usp=sharing)\n\n  Viết problem statement cho 01 vấn đề bạn muốn giải quyết và hình dung của bạn về sản phẩm cuối khoá bạn muốn build. Chia sẻ lên [Group Facebook](https://www.facebook.com/groups/27216190438021089) của lớp và gắn hastag #OB_Ngay2.\n\n  *Gợi ý nội dung:*\n  - Tên sản phẩm/dịch vụ\n  - Problem Statement (Viết theo đúng công thức được học ở Task 3).\n  - Vì sao bạn phải xây được sản phẩm trên? (VD: Nếu không xây được thì tôi sẽ mất thêm 10tr để thuê người làm, …)\n\n  *Lưu ý:* Problem Statement hôm nay là bản draft thô đầu tiên của bạn. Đừng áp lực phải viết hoàn hảo. Tuy nhiên, đây sẽ là kim chỉ nam cho bạn hoàn thành khoá học, giúp thầy giáo hỗ trợ bạn xây sản phẩm tốt nhất có thể. Đối với các học viên cũ từ khoá Vibe Coding 101, hãy coi đây là cơ hội để bạn nâng cấp và làm rõ vấn đề bạn muốn giải quyết.\n- [ ] **Task 3:** Tìm hiểu thêm về thuật ngữ: **_PRD - Products Requirement Documents_**\n  - Recording: [Link](https://youtu.be/QRbzd2tCYls)\n  - PRD Mẫu: [Link](https://docs.google.com/document/d/1mDslTv8gzuwdQN7pZ6Ss6g0s5_5oyOO0PCw6FH-1As8/edit?tab=t.0#heading=h.jh0gwzt5ucmt)\n- [ ] **Task 4:** Trả lời các câu hỏi dưới đây. Chia sẻ lên [Group Facebook](https://www.facebook.com/groups/27216190438021089) của lớp và gắn hashtag #OB_Ngay2.\n  - PRD là gì? Gồm các cấu phần chính nào?\n  - Vì sao khi xây sản phẩm cần có PRD?",
    takeaway: "",
    companionHint: "Đừng ngại chia sẻ idea còn “chưa chắc chắn”. Mọi sản phẩm tốt đều bắt đầu từ một vấn đề **rất đời thường**.\n\n👉 Nếu bạn bí, hãy hỏi trong [Telegram](https://t.me/+C8OUa6qqgNsyYjQ9) – luôn có người hỗ trợ bạn!",
    bonusResources: ""
  },
  {
    day: 3,
    title: "Ngày 3: IDE, MCP và CLI",
    intro: "",
    objective: "Ngày 3 trong tuần onboarding, bạn sẽ khám phá cách phần mềm, lập trình viên và các mô hình AI giao tiếp với nhau cũng như với hệ thống máy tính thông qua MCP và CLI. Mục tiêu là giúp bạn phân biệt rõ bản chất, vị trí và use case thực tế của từng khái niệm.",
    checklist: "- [ ] **Task 1:** Tìm hiểu thêm về 03 thuật ngữ IDE, MCP, và CLI\n\n  *Tips: Hỏi Chat GPT/ Gemini:*\n  - *“IDE/MCP/CLI là gì? Cho tôi 3 ví dụ và 3 điều dễ gây hiểu lầm về mỗi thuật ngữ trên.”*\n  - *“Đâu là use case và hạn chế của IDE/MCP/CLI?”*\n  - *“Phân biệt cho tôi 03 thuật ngữ IDE, CLI và MCP.\"*\n- [ ] **Task 2:** Xem video sau:\n  - Bải giảng của thầy Quang về IDE: [Link](https://youtu.be/G8n4vGcGpQk)\n  - [Bài giảng của thầy Chí](https://youtu.be/KDriJKjuVP0) về MCP\n  - **CLI vs MCP: Hiểu cách AI Agents chọn tool cho tác vụ:** [Video](https://youtu.be/g9JIUM0MHgQ?si=rp9u4zIBKCaZ0zLP)\n- [ ] **Task 3:** Chia sẻ lên [Group Facebook](https://www.facebook.com/groups/27216190438021089) của lớp và gắn hastag #OB_Ngay3.\n  - Giải thích bằng lời của bạn IDE là gì? CLI là gì? MCP là gì? Lấy ví dụ cho từng thuật ngữ.\n  - Bạn đã từng dùng IDE/CLI/MCP chưa?\n    - Nếu rồi, bạn từng dùng trong hoàn cảnh nào?\n    - Nếu chưa, bạn mong muốn áp dụng ra sao cho sản phẩm của bạn?",
    takeaway: "",
    companionHint: "Thực hiện xong nhiệm vụ nào thì check ngay vào ô trống bên cạnh nhé! Tích tiểu thành đại, hải trình còn dài! Nhớ hoàn thành 100% để tích lũy kiến thức tốt nhất nhé!",
    bonusResources: "- [Khoá học Giới thiệu về MCP (Anthropic - Công ty tạo ra Claude)](https://anthropic.skilljar.com/introduction-to-model-context-protocol)\n- [Khoá học Nâng cao về MCP (Anthropic - Công ty tạo ra Claude)](https://anthropic.skilljar.com/model-context-protocol-advanced-topics)\n- [CLI cho người mới bắt đầu](https://youtu.be/uwAqEzhyjtw?si=saJUwggZJUeFxav4)"
  },
  {
    day: 4,
    title: "Ngày 4: Skills và Rules",
    intro: "",
    objective: "Hôm nay bạn sẽ bắt đầu làm quen với hai thuật ngữ Skills và Rules, được sử dụng rất nhiều khi làm việc với IDE. Đây là bước khởi động nhẹ. Buổi học trên lớp sẽ đi sâu hơn vào Skills và cách dùng Skills thật sự hiệu quả.",
    checklist: "- [ ] **Task 1:** Tìm hiểu thêm về 03 thuật ngữ Skills và Rules\n\n  *Tips: Hỏi Chat GPT/ Gemini:*\n  - *“Agent Skills và Rules là gì? Cho tôi 3 ví dụ, và 3 điều dễ gây hiểu lầm về nó. Phân biệt cho tôi 2 thuật ngữ Agent Skills và Rules.”*\n  - *“Đâu là use case và hạn chế của Agent Skills và Agent Rules?”*\n  - *“Global Rules khác gì Workspace/Project Rules?”*\n- [ ] **Task 2:** Xem video sau:\n  - Bài giảng của thầy Chí về Skills và Rules: [Link](https://youtu.be/zHyI6hQAY-U)\n  - Giải thích về AI Agent Skills (IBM Technology): [Link](https://youtu.be/Lg-meK5IU8Q?si=UP-N4Ni_c1SnOnH-)\n  - Cách Viết Rules Hiệu Quả Cho AI Agent: [Link](https://www.youtube.com/watch?v=MYnYY8Rlego)\n- [ ] **Task 3:** Chia sẻ lên [Group Facebook](https://www.facebook.com/groups/27216190438021089) của lớp và gắn hastag #OB_Ngay4.\n  - Giải thích bằng lời của bạn Skills là gì? Rules là gì? Có mấy loại Rules?\n  - Bạn đã từng dùng Skills/Rules chưa?\n    - Nếu rồi, bạn từng dùng trong hoàn cảnh nào?\n    - Nếu chưa, bạn mong muốn áp dụng ra sao cho sản phẩm của bạn?",
    takeaway: "",
    companionHint: "Hãy nhớ rằng Rules là luật chơi do bạn tạo ra để AI tuân thủ, còn Skills là các kỹ năng thực thi. Làm chủ hai yếu tố này sẽ nâng hiệu suất coding của bạn lên một tầm cao mới!",
    bonusResources: "- [Andrej Karpathy Skills](https://github.com/multica-ai/andrej-karpathy-skills)\n- [Complete Guide to Building Skills for Claude](https://claude.com/blog/complete-guide-to-building-skills-for-claude)\n- [Skills Explained](https://claude.com/blog/skills-explained)\n- [How to Create Skills – Key Steps, Limitations and Examples](https://claude.com/blog/how-to-create-skills-key-steps-limitations-and-examples)\n- [Introduction to Agent Skills](https://anthropic.skilljar.com/introduction-to-agent-skills)\n- [What are AI Coding Rules?](https://www.agentrulegen.com/guides/what-are-ai-coding-rules)\n- [Antigravity Rules Workflows](https://antigravity.google/docs/rules-workflows)"
  },
  {
    day: 5,
    title: "Ngày 5: GitHub",
    intro: "",
    objective: "Hôm nay, bạn sẽ khám phá về GitHub - một nền tảng dịch vụ lưu trữ mã nguồn dựa trên đám mây, sử dụng hệ thống quản lý phiên bản Git.",
    checklist: "- [ ] **Task 1:** Tìm hiểu thêm về thuật ngữ Git, GitHub và repository.\n\n  *Gợi ý: Hỏi Chat GPT/ Gemini:*\n  - *”Git là gì? Vì sao lại phải biết về Git?”*\n  - *“GitHub là gì? Cho tôi 3 ví dụ và 3 điều dễ gây hiểu lầm về nó. Đâu là use case và hạn chế của nó?\"*\n  - *”Repository trên GitHub là gì? Nó có use case gì khi tôi muốn xây dựng sản phẩm với AI?”*\n- [ ] **Task 2:** Xem video sau:\n  - [**Bài giảng của thầy Chí về Git**](https://youtu.be/ipBC4-keBS8)\n  - Giới thiệu về GitHub: [Video](https://youtu.be/pBy1zgt0XPc?si=Sr4x98oDH0aZBt-Q)\n  - [Link](https://substack.com/@the1ight/note/p-203672461?utm_source=notes-share-action&r=2ibecv)\n- [ ] **Task 3:** Chia sẻ lên [Group Facebook](https://www.facebook.com/groups/27216190438021089) của lớp và gắn hastag #OB_Ngay5\n  - Giải thích bằng lời của bạn Git là gì? GitHub là gì?\n  - Bạn đã từng dùng Git/GitHub chưa?\n    - Nếu rồi, bạn từng dùng trong hoàn cảnh nào?\n    - Nếu chưa, bạn mong muốn áp dụng ra sao cho sản phẩm của bạn?",
    takeaway: "",
    companionHint: "Git & GitHub giống như cỗ máy thời gian và tủ lưu trữ bảo mật cho mã nguồn của bạn. Đừng lo lắng nếu ban đầu cảm thấy phức tạp, bạn sẽ làm quen nhanh thôi!",
    bonusResources: "- [Git & GitHub Video Tutorial](https://youtu.be/RGOj5yH7evk?si=OZ_IzuCDdtUV1xoK)"
  },
  {
    day: 6,
    title: "Ngày 6: Frontend vs. Backend",
    intro: "",
    objective: "Hôm nay, bạn sẽ khám phá về hai thuật ngữ Frontend và Backend.",
    checklist: "- [ ] **Task 1:** Tìm hiểu về thuật ngữ Frontend & Backend\n\n  *Gợi ý: Hỏi Chat GPT/ Gemini:*\n  - *”Frontend là gì? Backend là gì? Hai khái niệm này khác gì nhau? Cho tôi 03 ví dụ, và 03 điều dễ gây hiểu lầm về hai khái niệm này?”*\n- [ ] **Task 2:** Xem video bài giảng của thầy giáo về Frontend và Backend\n  - Recording: [Link](https://youtu.be/XSyBeGZlPSY)\n- [ ] **Task 3:** Chia sẻ lên [Group Facebook](https://www.facebook.com/groups/27216190438021089) của lớp và gắn hastag #OB_Ngay6\n  - Giải thích bằng lời của bạn Frontend là gì? Backend là gì?\n  - Vì sao bạn lại cần phải hiểu về Frontend và Backend khi xây dựng sản phẩm bằng AI?",
    takeaway: "",
    companionHint: "Hãy hình dung Frontend là bề nổi của tảng băng trôi (giao diện người dùng nhìn thấy) và Backend là phần chìm khổng lồ dưới nước (logic xử lý dữ liệu). Cả hai kết hợp tạo nên một sản phẩm hoàn chỉnh!",
    bonusResources: "- [Software architecture for non-technical builders](https://blog.ravi-mehta.com/p/software-architecture?r=2f46k&utm_medium=ios&triedRedirect=true)\n- [Frontend Development Crash Course](https://youtu.be/Rd6F5wHIysM?si=2dwAHz2nHDUjmIFM)\n- [Frontend vs Backend – What's the Difference?](https://youtu.be/i_bPeTZVlg0?si=JANCBlxJsJm47l9D)\n- [Web Development Overview](https://youtu.be/YR30uzwWoDM?si=Jl0n1iFI5NW1TJj2)\n- [Full Stack Web Development Introduction](https://youtu.be/bKJdWKm4aik?si=Fn81KFGLuciwDlSK)"
  },
  {
    day: 7,
    title: "Ngày 7: Domain & DNS",
    intro: "",
    objective: "Hôm nay, bạn sẽ khám phá về Domain và các nền tảng giúp bạn có thể chia sẻ sản phẩm cho người khác.",
    checklist: "- [ ] **Task 1:** Thử trả lời các câu hỏi (bằng cách Google, hỏi AI,…)\n\n  *Gợi ý: Hỏi Chat GPT/ Gemini:*\n  - *Domain và DNS là gì?*\n  - *Vercel, Cloudflare, VPS, Docker khác nhau thế nào? Bản chất của các thuật ngữ này là gì? Cách hoạt động của mỗi nền tảng như thế nào?*\n  - *Nền tảng nào sẽ phù hợp để sử dụng cho dự án của tôi? Sử dụng để làm gì?*\n- [ ] **Task 2:** Xem các video sau:\n  - [Link](https://youtu.be/hJrQN3n-aXQ?si=Y4I4xn001W3r6WXK)\n  - [Link](https://youtu.be/acvI1YxHfFw?si=Z9JxHwcKV_9GZ2o2)\n  - [Link](https://youtu.be/zFXscjUoDDA?si=15tDKFoYudWGQ0N7)\n- [ ] **Task 3:** Chia sẻ lên [Group Facebook](https://www.facebook.com/groups/27216190438021089) của lớp và gắn hastag #OB_Ngay7\n  - Giải thích bằng lời của bạn Domain là gì? DNS là gì? Bạn đã từng mua domain riêng chưa?\n  - Bạn đã từng dùng Cloudflare hoặc Vercel chưa?\n    - Nếu rồi, bạn từng dùng trong hoàn cảnh nào?\n    - Nếu chưa, bạn mong muốn áp dụng ra sao cho sản phẩm của bạn?\n- [ ] **Task 4:** Hoàn thành [Form khảo sát sau Onboarding Week](https://forms.gle/mYY61QWA7BVjSWwm7)",
    takeaway: "",
    companionHint: "Khi sản phẩm chạy được ở máy cá nhân (Localhost), việc cấu hình Domain và đưa lên Vercel/Cloudflare chính là cách bạn mang đứa con tinh thần của mình ra mắt thế giới rộng lớn!",
    bonusResources: ""
  },
  {
    day: 8,
    title: "Bonus: User Journey và User Flow",
    intro: "> “Design is not just what it looks like and feels like. Design is how it works.”\n> \n> — Steve Jobs",
    objective: "Biết cách tư duy theo user journey và vẽ user flow cho các sản phẩm.\nPhần này sẽ không đi sâu trong khoá. Bonus thêm cho các học viên chăm chỉ ^^",
    checklist: "- [ ] **Task 1:** Xem video này để bạn biết cách tư duy về User Journey và User Flow từ trước khi vẽ Mockup cho mình.\n  - 👉 [Link video](https://www.youtube.com/watch?si=PytGxUCdsp7sB8mW&v=DNBIcBdKnQo&feature=youtu.be)\n  - 👉 [Link video](https://www.youtube.com/watch?v=dsviXwJwslI)\n- [ ] **Task 2:** Tìm hiểu về thuật ngữ Aha Moment\n  - 👉 [Link video](https://www.youtube.com/watch?v=N8g3KlizrKI)\n- [ ] **Task 3:** Từ Problem Statement bạn viết ở Ngày 2, vẽ thử User Journey cho sản phẩm của bạn. Ở mỗi điểm chạm, thử trả lời câu hỏi:\n  - User đang cảm thấy gì?\n  - Họ muốn đạt được điều gì ở giai đoạn này?\n  - Với mỗi giai đoạn: Aha là gì? Feature nào tạo aha? Nếu aha không xảy ra, chuyện gì sẽ xảy ra?\n- [ ] **Task 4:** Chia sẻ lên [Group Facebook](https://www.facebook.com/groups/27216190438021089) của lớp và gắn hastag #OB_Ngay2.\n- [ ] **Task 5 (optional - Dành cho các học viên xây sản phẩm cho người khác dùng):** Đọc thêm về cách nói chuyện với users và lấy feedback tại [Link](https://the1ight.substack.com/p/mo-khoa-6-lam-sao-e-thuc-su-noi-chuyen?r=2f46k)\n\n  *Trả lời thêm các câu hỏi:*\n  - Bạn sẽ test sản phẩm của mình với ai? (ai là người dùng tiềm năng?)\n  - Bạn sẽ hỏi họ câu gì để biết vấn đề có thực sự tồn tại?\n  - Bạn sẽ dùng cách nào để test? (phỏng vấn, khảo sát, cho dùng thử prototype?)",
    takeaway: "",
    companionHint: "Nguyên tắc bất biến: luôn bắt đầu từ **user problem** trước khi thiết kế.",
    bonusResources: "- [Don’t Make Me Think – Steve Krug](https://eng317hannah.wordpress.ncsu.edu/files/2020/01/Krug_Steve_Dont_make_me_think_revisited___a_cz-lib.org_.pdf)\n- [Designing Your Life](https://www.amazon.com/Designing-Your-Life-Well-Lived-Joyful/dp/1101875321)\n- [Designing Your Work Life](https://www.amazon.com/Designing-Your-Work-Life-Happiness/dp/0525655247)"
  }
];
