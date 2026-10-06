export interface PlatformButton {
  icon: string;
  title: string;
  subtitle: string;
  url: string;
}

export interface BenefitClub {
  icon: string;
  name: string;
  desc: string;
  links: { label: string; url: string }[];
}

export interface TruCot {
  title: string;
  subtitle: string;
  desc: string;
}

export const DEFAULT_VIDEO_URL = 'https://youtu.be/pzsBYMMg0Dc';

export const DEFAULT_PLATFORM_BUTTONS: PlatformButton[] = [
  { icon: '📒', title: 'LightMS', subtitle: 'Nền tảng tổng hợp toàn bộ học liệu của lớp', url: '' },
  { icon: '📅', title: 'Google Calendar', subtitle: 'Nhắc lịch học và các sự kiện của lớp', url: 'https://calendar.google.com/calendar/u/0?cid=ZWQ4ZGE1M2QzMThmMDM4ZTY1MzcxYjY4NmJhYTNiM2QyYTg2MDZhZDk2MmIxMTFlODhhODAxZGZiODY4NjE0NkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t' },
  { icon: '💬', title: 'Zalo Group', subtitle: 'Nền tảng nhắn tin giao lưu & đăng ký Office Hour của lớp', url: 'https://zalo.me/g/zcsfkw4u0vzlna8jq5pi' },
  { icon: '👥', title: 'Facebook Group', subtitle: 'Nơi nộp Bài tập về nhà và nhận góp ý', url: 'https://www.facebook.com/groups/2251571492466555' }
];

export const DEFAULT_BENEFIT_CLUBS: BenefitClub[] = [
  {
    icon: '🔄',
    name: 'Học lại miễn phí',
    desc: 'Quyền lợi nâng cấp tư duy và cập nhật công nghệ hoàn toàn miễn phí ở các khoá học tiếp theo.',
    links: []
  },
  {
    icon: '🎪',
    name: '1ight Club',
    desc: 'Cộng đồng tự chủ sự nghiệp cùng AI trả phí chuyên sâu.',
    links: [
      { label: 'Group Facebook', url: 'https://www.facebook.com/groups/1342256920980058' },
      { label: 'Zalo Group', url: 'https://zalo.me/g/zcsfkw4u0vzlna8jq5pi' }
    ]
  },
  {
    icon: '🎖️',
    name: 'Alumni Club',
    desc: 'Không gian dành riêng cho cựu học sinh các khoá học tại The1ight.',
    links: [
      { label: 'Group Facebook', url: 'https://www.facebook.com/groups/1634104510891968' },
      { label: 'Zalo Chat', url: 'https://zalo.me/g/zcsfkw4u0vzlna8jq5pi' }
    ]
  }
];

export const DEFAULT_QUOTE = '"Ghi chú hôm nay, là lợi thế của ngày mai."';

export const DEFAULT_GACH_DAU_DONG: string[] = [
  'Xây dựng hệ thống ghi chú và quản lý tri thức cá nhân (Second Brain) bền vững với Obsidian.',
  'Làm chủ quy trình CODE (Capture, Organize, Distill, Express) biến thông tin thô thành tri thức sống.',
  'Tận dụng sức mạnh của AI để tổng hợp, kết nối và sản xuất nội dung nhanh chóng, chính xác.'
];

export const DEFAULT_TRU_COT_1: TruCot = {
  title: '1. Xây dựng nền tảng (Foundation Setup) 🏗️',
  subtitle: 'VAULT ARCHITECTURE & CORE PLUGINS',
  desc: 'Tự tay thiết kế Vault Obsidian chuẩn mực, giao diện Home page trực quan cùng bộ plugins tối ưu cho luồng làm việc hàng ngày.'
};

export const DEFAULT_TRU_COT_2: TruCot = {
  title: '2. Quy trình CODE & Xử lý tri thức 🧠',
  subtitle: 'CAPTURE - ORGANIZE - DISTILL - EXPRESS',
  desc: 'Biến thông tin rải rác thành tài sản tri thức có cấu trúc theo phương pháp Zettelkasten, PARA và Progressive Summarization.'
};

export const DEFAULT_TRU_COT_3: TruCot = {
  title: '3. Phối hợp & Làm việc cùng AI 🤖',
  subtitle: 'SECOND BRAIN WITH AI AGENTS',
  desc: 'Tích hợp AI trực tiếp vào kho tri thức cá nhân, đối thoại cùng ghi chú và biến ý tưởng thành sản phẩm thực tế.'
};

export const DEFAULT_OUTRO = 'Obsidian 101 là hành trình giúp bạn chuyển hóa từ người tiêu thụ thông tin thụ động sang người kiến tạo tri thức chủ động.\n\nVà bạn sẽ rời khỏi khóa học với:\n- 1 hệ thống Second Brain hoàn chỉnh chạy hoàn toàn trên máy của bạn (Local & Bền vững)\n- Tư duy và phương pháp xử lý tri thức chuẩn xác kết hợp sức mạnh AI\n\nGhi chú hôm nay, là lợi thế của ngày mai.\n\nThân gửi,\nĐội ngũ The1ight & Trainer';

export const DEFAULT_SDT_NOTE = 'Nếu chưa nhận được, vui lòng liên hệ **Ms. Đặng Hồng (Quản lý lớp học)** qua SĐT **0985679417** hoặc [Messenger](https://www.facebook.com/danghong.harunoyuki)';

export const DEFAULT_OFFICE_HOUR_DESC = 'Học viên có các vấn đề cần hỏi đáp chuyên sâu hoặc muốn nhận tư vấn trực tiếp từ thầy giáo có thể đăng ký tham gia Office Hour tại nhóm Zalo của lớp.';

export const DEFAULT_LUU_Y_GOLD = '⚠️ **Lưu ý:** Đây là các hoạt động phụ trợ bên ngoài khoá học để các học viên giao lưu với nhau, bạn **KHÔNG BẮT BUỘC** phải tham gia ngay đầu khoá học.';

// ── Course-Specific Default About Contents ──────────────────────────────────

export const DEFAULT_OBSIDIAN_ABOUT_CONTENT = {
  overviewText: '',
  scheduleText: `Chặng 1: Khởi Động & Onboarding (06/10 - 11/10) - Kick-off lớp học, làm quen bạn học, thiết lập tinh thần học tập và chuỗi thử thách Onboarding Week để chuẩn bị nền tảng.

Chặng 2: Nền tảng & Thu nạp tri thức - Xây dựng hệ thống học tập, ghi chú và phương pháp thực chiến.

Chặng 3: Tổ chức & Ứng dụng AI - Phối hợp và làm việc chuyên sâu với AI Agents.

Chặng 4: Pitching Day & Tốt nghiệp - Tổng kết hành trình, chia sẻ showcase sản phẩm hoàn chỉnh và nhận chứng nhận tốt nghiệp.`,
  benefitsText: '',
  videoUrl: DEFAULT_VIDEO_URL,
  platformButtons: DEFAULT_PLATFORM_BUTTONS,
  benefitClubs: DEFAULT_BENEFIT_CLUBS,
  quote: DEFAULT_QUOTE,
  gachDauDong: DEFAULT_GACH_DAU_DONG,
  truCot1: DEFAULT_TRU_COT_1,
  truCot2: DEFAULT_TRU_COT_2,
  truCot3: DEFAULT_TRU_COT_3,
  outro: DEFAULT_OUTRO,
  sdtNote: DEFAULT_SDT_NOTE,
  officeHourDesc: DEFAULT_OFFICE_HOUR_DESC,
  luuYGold: DEFAULT_LUU_Y_GOLD
};

export const DEFAULT_VIBE_ABOUT_CONTENT = {
  overviewText: 'Vibe Coding 201 là khoá học dành cho cựu học viên 101 và non-tech builder đã từng build bằng AI, nhưng muốn hiểu tech sâu hơn để tự tin xây sản phẩm với AI.',
  scheduleText: `Chặng 1: Kick-off Meeting - Cột mốc đầu tiên để bạn làm quen với đội ngũ điều phối, lộ trình khoá học và các nền tảng học tập để sẵn sàng cho hải trình xây dựng sản phẩm sắp tới.

Chặng 2: Onboarding Week - Chuỗi thử thách 07 ngày liên tục được thiết kế để: giúp bạn làm quen với tinh thần học tập của khoá (chủ động - kết nối - sẻ chia), trang bị những kiến thức và mindset nền tảng về khoá học, hình thành thói quen học tập hằng ngày thông qua các thử thách nhỏ. (Lưu ý: Onboarding Week không phải Live Class. Đây là chuỗi các bài tập cá nhân, học viên có thể tự sắp xếp thời gian hoàn thành bài tập phù hợp với lịch trình cá nhân của mình).

Chặng 3: Live Class - Các buổi học online nghe giảng trực tiếp từ giảng viên. Office Hour: Các buổi hỗ trợ ngoài giờ học, giảng viên sẽ hỗ trợ giải đáp thắc mắc của các học viên (cần book lịch trước trên Telegram để được hỗ trợ).

Chặng 4: Capstone - Bài tốt nghiệp cuối khoá - Các học viên sẽ chia sẻ sản phẩm của mình cho cả lớp vào cuối khoá học. Đây là điều kiện để được nhận Certificate (Chứng nhận hoàn thành khoá học).`,
  benefitsText: '',
  videoUrl: 'https://daymai.vn/vc/6a51206f8c50bda09b07b0b8',
  platformButtons: [
    { icon: '✈️', title: 'Telegram', subtitle: 'Nền tảng nhắn tin giao lưu của lớp', url: 'https://t.me/+C8OUa6qqgNsyYjQ9' },
    { icon: '👥', title: 'Facebook Group', subtitle: 'Nơi nộp Bài tập về nhà và nhận góp ý từ giảng viên & bạn học', url: 'https://www.facebook.com/groups/27216190438021089' },
    { icon: '✉️', title: 'Email', subtitle: 'Cập nhật các thông tin mới nhất về lớp', url: '' },
    { icon: '📒', title: 'LightMS', subtitle: 'Nền tảng tổng hợp toàn bộ học liệu của lớp', url: '' },
    { icon: '📅', title: 'Google Calendar (optional)', subtitle: 'Nhắc lịch học và các sự kiện của lớp', url: 'https://calendar.google.com/calendar/u/0?cid=ZWQ4ZGE1M2QzMThmMDM4ZTY1MzcxYjY4NmJhYTNiM2QyYTg2MDZhZDk2MmIxMTFlODhhODAxZGZiODY4NjE0NkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t' }
  ],
  benefitClubs: [
    {
      icon: '💬',
      name: 'Office Hour',
      desc: 'Các buổi hỗ trợ ngoài giờ học, giảng viên sẽ hỗ trợ giải đáp thắc mắc của các học viên. Cần book lịch trước trên Telegram để được hỗ trợ.',
      links: [
        { label: 'Telegram Group', url: 'https://t.me/+C8OUa6qqgNsyYjQ9' }
      ]
    },
    {
      icon: '🔄',
      name: 'Học lại khoá mới free',
      desc: 'Nâng cấp tư duy và công nghệ hoàn toàn miễn phí ở các khoá học tiếp theo.',
      links: []
    },
    {
      icon: '🎪',
      name: 'Tham gia Miễn phí 1ight Club',
      desc: 'Cộng đồng Tự chủ sự nghiệp cùng AI trả phí.',
      links: [
        { label: 'Group Facebook', url: 'https://www.facebook.com/share/g/1BCEoxNoqv/' },
        { label: 'Zalo Group', url: 'https://zalo.me/g/zuydzj265' }
      ]
    },
    {
      icon: '🎖️',
      name: 'Tham gia Alumni Club',
      desc: 'Không gian dành riêng cho cựu học sinh các khoá học tại The1ight.',
      links: [
        { label: 'Group Facebook', url: 'https://www.facebook.com/share/g/1DJpuDdX9s/' },
        { label: 'Messenger', url: 'https://m.me/cm/AbbnQvQATe0KSg2O/' }
      ]
    }
  ],
  quote: '"Bạn không cần biết code, không cần có team. Chỉ cần bạn – và một vấn đề bạn muốn giải quyết."',
  gachDauDong: [
    'Học cách nâng cấp sản phẩm của mình từ prototype chạy được đến một sản phẩm có cấu trúc hệ thống.',
    'Hiểu tech sâu hơn để tự tin xây sản phẩm với AI (IDE, GitHub, backend, deploy, MCP và automation,..).',
    'Và đặc biệt, có mentor kèm và một cộng đồng bạn học đồng hành cùng bạn trong suốt hành trình.'
  ],
  truCot1: {
    title: '1. Tư duy đúng 🧠',
    subtitle: 'MINDSET & PRODUCT LOGIC',
    desc: 'Hiểu đúng về sản phẩm – từ lý thuyết đến thực tế. Tư duy như một Product Manager: đặt câu hỏi đúng, viết Problem Statement, đặt giả định và kiểm chứng từng bước.'
  },
  truCot2: {
    title: '2. Công cụ đúng 🧰',
    subtitle: 'TOOLING & PROTOTYPING',
    desc: 'Đào sâu hơn vào IDE và các thuật ngữ kĩ thuật để giúp bạn biến sản phẩm của mình từ một prototype chạy được đến xây sản phẩm có cấu trúc hệ thống.'
  },
  truCot3: {
    title: '3. Thử nghiệm đúng 🔬',
    subtitle: 'BUILD – TEST – LEARN',
    desc: 'Tự tay xây và học được bài học thật từ người dùng thật, không cần chờ code hay kỹ thuật cao.'
  },
  outro: 'Vibe Coding 201 là một hành trình học – làm – launch thật sự.\n\nVà bạn sẽ rời khỏi lớp học với:\n- 1 sản phẩm thật có cấu trúc do chính bạn tự xây dựng\n- Tư duy đúng để lặp lại quy trình này lần nữa\n\nLà một người xây sản phẩm, mình biết cái cảm giác lôi đứa con tinh thần từ trong đầu ra ngoài nó đẹp như thế nào.\n\nMình muốn trong 30 ngày, bạn sẽ làm được và có được trải nghiệm này.\n\nThân gửi,\nĐội ngũ The1ight',
  sdtNote: 'Nếu chưa nhận được, vui lòng liên hệ **Ms. Đặng Hồng (Quản lý lớp học)** qua SĐT **0985679417** hoặc [Messenger](https://www.facebook.com/danghong.harunoyuki)',
  officeHourDesc: 'Học viên có các vấn đề cần hỏi đáp chuyên sâu hoặc muốn nhận tư vấn trực tiếp từ thầy giáo có thể đăng ký tham gia Office Hour tại nhóm Telegram của lớp.',
  luuYGold: '⚠️ **Lưu ý:** Đây là các hoạt động phụ trợ bên ngoài khoá học để các học viên giao lưu với nhau, bạn **KHÔNG BẮT BUỘC** phải tham gia ngay đầu khoá học.'
};
