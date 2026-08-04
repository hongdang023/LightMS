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

export const DEFAULT_VIDEO_URL = 'https://drive.google.com/file/d/1bhtSzABAjKHPB_1LzzTG0wxiscAilC0a/view?usp=sharing';

export const DEFAULT_PLATFORM_BUTTONS: PlatformButton[] = [
  { icon: '📒', title: 'LightMS', subtitle: 'Nền tảng tổng hợp toàn bộ học liệu của lớp', url: 'https://app.notion.com/p/f152df46dabf83ceb8788165361bf772?pvs=21' },
  { icon: '📅', title: 'Google Calendar', subtitle: 'Nhắc lịch học và các sự kiện của lớp', url: 'https://calendar.google.com/calendar/u/0?cid=NjMyNjQwNzkyZDc1YzM1ZGM2YWNhMzA2MjVlMWMzNWRlM2Y2ZDRkYmY3OTlmNTBmOTI0MmExMzg4ZDc5NjllZEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t' },
  { icon: '💬', title: 'Telegram', subtitle: 'Nền tảng nhắn tin giao lưu của lớp', url: 'https://t.me/+C8OUa6qqgNsyYjQ9' },
  { icon: '👥', title: 'Facebook Group', subtitle: 'Nơi nộp Bài tập về nhà và nhận góp ý', url: 'https://www.facebook.com/groups/27216190438021089' }
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
      { label: 'Group Facebook', url: 'https://www.facebook.com/share/g/1BCEoxNoqv/' },
      { label: 'Zalo Group', url: 'https://zalo.me/g/zuydzj265?fbclid=IwZXh0bgNhZW0CMTAAYnJpZBExTnVuakhSOW53WUNmbjE0SXNydGMGYXBwX2lkEDIyMjAzOTE3ODgyMDA4OTIAAR66E6u7YYxLMEoN0f1iKj2StV_GHxTo7TyyiiHN712xPyg_U0qUaru3EftTqA_aem_bap_taXXL7PXNVn0nfLHGA' }
    ]
  },
  {
    icon: '🎖️',
    name: 'Alumni Club',
    desc: 'Không gian dành riêng cho cựu học sinh các khoá học tại The1ight.',
    links: [
      { label: 'Group Facebook', url: 'https://www.facebook.com/share/g/1DJpuDdX9s/' },
      { label: 'Messenger Chat', url: 'https://m.me/cm/AbbnQvQATe0KSg2O/' }
    ]
  }
];

export const DEFAULT_QUOTE = '"Bạn không cần biết code, không cần có team. Chỉ cần bạn – và một vấn đề bạn muốn giải quyết."';

export const DEFAULT_GACH_DAU_DONG: string[] = [
  'Học cách nâng cấp sản phẩm của mình từ prototype chạy được đến một sản phẩm có cấu trúc hệ thống.',
  'Hiểu tech sâu hơn để tự tin xây sản phẩm với AI (IDE, GitHub, backend, deploy, MCP và automation,..).',
  'Và đặc biệt, có mentor kèm và một cộng đồng bạn học đồng hành cùng bạn trong suốt hành trình.'
];

export const DEFAULT_TRU_COT_1: TruCot = {
  title: '1. Tư duy đúng 🧠',
  subtitle: 'MINDSET & PRODUCT LOGIC',
  desc: 'Hiểu đúng về sản phẩm – từ lý thuyết đến thực tế. Tư duy như một PM thật sự: đặt câu hỏi đúng, viết Problem Statement, đặt giả định và kiểm chứng từng bước.'
};

export const DEFAULT_TRU_COT_2: TruCot = {
  title: '2. Công cụ đúng 🧰',
  subtitle: 'TOOLING & PROTOTYPING',
  desc: 'Đào sâu hơn vào IDE và các thuật ngữ kĩ thuật để giúp bạn biến sản phẩm của mình từ một prototype chạy được đến xây sản phẩm có cấu trúc hệ thống.'
};

export const DEFAULT_TRU_COT_3: TruCot = {
  title: '3. Thử nghiệm đúng 🔬',
  subtitle: 'BUILD – TEST – LEARN',
  desc: 'Tự tay xây và học được bài học thật từ người dùng thật, không cần chờ code hay kỹ thuật cao.'
};

export const DEFAULT_OUTRO = 'Vibe Coding 201 là một hành trình học – làm – launch thật sự.\n\nVà bạn sẽ rời khỏi lớp học với:\n- 1 sản phẩm thật có cấu trúc do chính bạn tự xây dựng\n- Tư duy đúng để lặp lại quy trình này lần nữa\n\nLà một người xây sản phẩm, mình biết cái cảm giác lôi đứa con tinh thần từ trong đầu ra ngoài nó đẹp như thế nào.\nMình muốn trong 30 ngày, bạn sẽ làm được và có được trải nghiệm này.\n\nThân gửi,\nĐội ngũ The1ight';

export const DEFAULT_SDT_NOTE = 'Nếu chưa nhận được, vui lòng liên hệ **Ms. Đặng Hồng (Quản lý lớp học)** qua SĐT **0985679417** hoặc [Messenger](https://www.facebook.com/danghong.harunoyuki)';

export const DEFAULT_OFFICE_HOUR_DESC = 'Học viên có các vấn đề cần hỏi đáp chuyên sâu hoặc muốn nhận tư vấn trực tiếp từ thầy giáo có thể đăng ký tham gia Office Hour.';

export const DEFAULT_LUU_Y_GOLD = '⚠️ **Lưu ý:** Đây là các hoạt động phụ trợ bên ngoài khoá học để các học viên giao lưu với nhau, bạn **KHÔNG BẮT BUỘC** phải tham gia ngay đầu khoá học.';
