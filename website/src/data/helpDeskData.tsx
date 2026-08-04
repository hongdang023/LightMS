import React from 'react';
import { 
  BookOpen, 
  Compass, 
  Award, 
  MessageSquare, 
  BookMarked,
  Layers
} from 'lucide-react';

export interface FAQSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface FAQArticle {
  id: string;
  category: string;
  q: string;
  description: string;
  lastUpdated: string;
  sections: FAQSection[];
}

export interface CategoryInfo {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

export const categories: CategoryInfo[] = [
  { 
    id: 'materials-schedule', 
    label: 'Học liệu & Lịch học', 
    description: 'Nơi lưu trữ tài liệu học tập, slide bài giảng, video ghi hình và link phòng học Zoom cố định.',
    icon: <BookOpen className="w-6 h-6 text-white" /> 
  },
  { 
    id: 'methods', 
    label: 'Phương pháp học tập', 
    description: 'Hướng dẫn vượt ngợp khi đối diện với tài liệu tiếng Anh, chiến thuật học thực chiến, cách sử dụng AI.',
    icon: <Compass className="w-6 h-6 text-white" /> 
  },
  { 
    id: 'gamification', 
    label: 'Hải lý & Vinh danh', 
    description: 'Giải thích hệ thống Kudos ghi nhận, hải lý tích lũy, cơ chế leo rank và bảng vinh danh.',
    icon: <Award className="w-6 h-6 text-white" /> 
  },
  { 
    id: 'support-community', 
    label: 'Cộng đồng & Hỗ trợ', 
    description: 'Kết nối Telegram Support 24/7 và thông tin hỗ trợ từ Ban tổ chức.',
    icon: <MessageSquare className="w-6 h-6 text-white" /> 
  }
];

// Helper to keep onPageChange callback dynamic in React element
export const getFaqs = (onPageChange?: (page: string) => void): FAQArticle[] => [
  {
    id: 'recording-notes',
    category: 'materials-schedule',
    q: "Tôi có thể tìm học liệu (Recording, Study Notes,…) ở đâu?",
    description: "Tìm các đường link học tập và tài liệu tại NavItem \"Lộ trình học\".",
    lastUpdated: "9 Tháng 7, 2026",
    sections: [
      {
        id: 'roadmap-links',
        title: "Tìm các đường link trên tại NavItem \"Lộ trình học\"",
        content: (
          <p>
            Tất cả các liên kết học liệu quan trọng (Notion học tập của lớp, Facebook Group, và Messenger Chat) đều có thể dễ dàng tìm thấy tại mục <strong>Lộ trình học</strong> trên thanh điều hướng.
          </p>
        )
      }
    ]
  },
  {
    id: 'overwhelmed-english',
    category: 'methods',
    q: "Khoá học có quá nhiều tài liệu cần đọc, nhiều thuật ngữ chuyên ngành. Làm sao để hết ngợp?",
    description: "Cung cấp cẩm nang và tài liệu định hướng tư duy giúp bạn vượt qua cảm giác bị quá tải kiến thức.",
    lastUpdated: "3 Tháng 7, 2026",
    sections: [
      {
        id: 'dont-panic',
        title: "1. Đừng lo lắng, bạn không cô đơn",
        content: (
          <p>
            Việc tiếp cận khối lượng kiến thức chuẩn quốc tế và thuật ngữ chuyên ngành trong thời gian ngắn 
            thường tạo cảm giác ngợp cho hơn 80% học viên mới. Đây là phản ứng tâm lý hoàn toàn bình thường khi bạn bước ra khỏi vùng an toàn.
          </p>
        )
      },
      {
        id: 'guide-link',
        title: "2. Tài liệu Hướng dẫn vượt ngợp",
        content: (
          <div className="space-y-3">
            <p>Ban tổ chức đã thiết kế riêng một cẩm nang trực quan trên Canva để giúp bạn gỡ rối tâm lý và định hình lộ trình đọc tài liệu hiệu quả:</p>
            <a 
              href="https://canva.link/wgmj35t6pzf2pby" 
              target="_blank" 
              rel="noreferrer" 
              className="inline-flex items-center gap-2 font-bold text-xs bg-[#214C54] text-white px-4 py-2.5 rounded-xl hover:bg-[#15333B] transition-all shadow-sm hover:shadow"
            >
              <BookMarked className="w-4 h-4" />
              📖 Xem Hướng dẫn vượt ngợp (Canva Link)
            </a>
          </div>
        )
      }
    ]
  },
  {
    id: 'schedule-reminder',
    category: 'materials-schedule',
    q: "Tìm lịch học và Zoom ở đâu? BTC có nhắc lịch học không?",
    description: "Lịch học định kỳ, phòng học Zoom cố định toàn khóa và cách tích hợp lịch học vào Google Calendar cá nhân.",
    lastUpdated: "4 Tháng 7, 2026",
    sections: [
      {
        id: 'read-schedule',
        title: "1. Xem lịch trình tổng quan",
        content: (
          <p>
            Lịch trình chi tiết đã được tích hợp sẵn trong hệ thống LightMS ở tab <strong>Lịch học</strong> 
            hoặc bạn có thể xem lại tại phần <strong>Lịch trình & Kết nối</strong> trong mục Giới thiệu khóa học.
          </p>
        )
      },
      {
        id: 'calendar-integration',
        title: "2. Tích hợp lịch hẹn Google Calendar & Zoom Link",
        content: (
          <div className="space-y-2 text-[#3E5E63]">
            <p>• <strong>Nhắc lịch:</strong> Đội ngũ The1ight sẽ gửi lời mời Google Calendar tới địa chỉ email của bạn ở đầu khoá học. Hãy nhấn <strong>Yes (Đồng ý tham gia)</strong> để lịch tự động đồng bộ vào điện thoại và máy tính của bạn.</p>
            <p>• <strong>Link Zoom phòng học:</strong> Link phòng học sẽ được thiết lập <strong>CỐ ĐỊNH</strong> suốt khóa học và đính kèm trực tiếp trong phần mô tả của từng sự kiện trên Google Calendar.</p>
          </div>
        )
      }
    ]
  },
  {
    id: 'tracking-progress',
    category: 'methods',
    q: "Tôi muốn Tracking tiến độ học tập để duy trì động lực, tôi nên làm gì?",
    description: "Giới thiệu bảng tính công khai giúp theo dõi bài tập, tích lũy điểm và thi đua lành mạnh cùng tập thể lớp.",
    lastUpdated: "1 Tháng 7, 2026",
    sections: [
      {
        id: 'public-tracking-sheet',
        title: "1. Bảng tính Tracking Tiến độ Công khai",
        content: (
          <div className="space-y-3">
            <p>
              Để duy trì động lực học tập trực tuyến, chúng tôi vận hành một bảng tính theo dõi tiến độ công khai của toàn bộ lớp học. 
              Tại đây bạn có thể thấy tình trạng nộp BTVN, tích lũy hải trình và thứ hạng Kudos của mình:
            </p>
            <button 
              onClick={() => onPageChange?.('dashboard')}
              className="inline-flex items-center gap-2 font-bold text-xs bg-[#214C54] text-white px-4 py-2.5 rounded-xl hover:bg-[#15333B] transition-all shadow-sm hover:shadow"
            >
              <Layers className="w-4 h-4" />
              📊 Bảng Tracking Tiến độ & Leo Rank lớp học
            </button>
          </div>
        )
      }
    ]
  },
  {
    id: 'kudos-purpose',
    category: 'gamification',
    q: "Kudos là gì? Vì sao cần Phòng tiếp lửa vinh danh?",
    description: "Tìm hiểu văn hóa ghi nhận nỗ lực (Kudos) và cách Kudos thúc đẩy cộng đồng học tập bền bỉ.",
    lastUpdated: "2 Tháng 7, 2026",
    sections: [
      {
        id: 'what-is-kudos',
        title: "1. Định nghĩa Kudos",
        content: (
          <p>
            Hành trình xây dựng sản phẩm và học tập công nghệ là một chặng đường dài đầy thách thức. 
            Kudos là những lời khen ngợi, lời cảm ơn hoặc sự công nhận nhanh dành cho nỗ lực vượt qua khó khăn của chính bạn hoặc của đồng đội học viên.
          </p>
        )
      },
      {
        id: 'when-to-kudos',
        title: "2. Bạn nên trao Kudos khi nào?",
        content: (
          <div className="space-y-2">
            <p>Chúng tôi khuyến khích các bạn chủ động tạo bài Kudos tại <strong>Bảng vinh danh</strong> cho:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#3E5E63]">
              <li><strong>Chính bản thân:</strong> Ghi nhận khi bạn vừa hoàn thành một bài tập khó hoặc vượt qua sự trì hoãn của bản thân.</li>
              <li><strong>Bạn đồng hành:</strong> Khi nhận được sự hỗ trợ sửa lỗi code, giải thích khái niệm từ bạn cùng lớp.</li>
              <li><strong>Mentor & Đội ngũ hỗ trợ:</strong> Nhờ những buổi Office Hour tâm huyết hoặc sự gỡ rối kỹ thuật kịp thời.</li>
            </ul>
          </div>
        )
      }
    ]
  },
  {
    id: 'contact-support',
    category: 'support-community',
    q: "Nếu gặp vấn đề kỹ thuật hoặc bài học, tôi liên hệ ai và bằng cách nào?",
    description: "3 phương thức nhận phản hồi và giải đáp thắc mắc hiệu quả từ Mentor và Quản lý lớp học.",
    lastUpdated: "9 Tháng 7, 2026",
    sections: [
      {
        id: 'three-channels',
        title: "1. Ba kênh nhận hỗ trợ đắc lực",
        content: (
          <div className="space-y-3">
            <p>Motto của lớp học là <strong>“Hỏi ngu còn hơn không hỏi”</strong>. Đừng ngần ngại sử dụng các phương án sau:</p>
            <ol className="list-decimal pl-5 space-y-3 text-xs text-[#3E5E63]">
              <li>
                <strong className="text-[#15333B]">Cách 01 (Khuyến khích nhất):</strong> Đặt câu hỏi tại 
                <a href="https://t.me/+C8OUa6qqgNsyYjQ9" target="_blank" rel="noreferrer" className="text-[#214C54] font-bold hover:underline mx-1">Telegram Support 24/7</a>. 
                Nơi Mentor và các học viên khác hoạt động rất sôi nổi để gỡ rối nhanh.
              </li>
              <li>
                <strong className="text-[#15333B]">Cách 02 (Hỗ trợ vận hành):</strong> Liên hệ trực tiếp với Ms. Đặng Hồng (Quản lý lớp học) qua SĐT <strong>0985679417</strong> hoặc qua trang 
                <a href="https://www.facebook.com/danghong.harunoyuki" target="_blank" rel="noreferrer" className="text-[#214C54] font-bold hover:underline mx-1">Messenger</a>.
              </li>
              <li>
                <strong className="text-[#15333B]">Cách 03:</strong> Tham gia buổi <strong>Office Hour</strong> hàng tuần để thảo luận 1-1 trực tiếp cùng giảng viên.
              </li>
            </ol>
          </div>
        )
      }
    ]
  },
  {
    id: 'why-telegram-support',
    category: 'support-community',
    q: "Tôi ít dùng mạng xã hội, vì sao nên tham gia Telegram Support?",
    description: "Lợi ích thực tế của việc kết nối cộng đồng học tập chung trong việc giải đáp nhanh và tiếp thu kiến thức thụ động.",
    lastUpdated: "9 Tháng 7, 2026",
    sections: [
      {
        id: 'community-benefits',
        title: "1. Giá trị của việc học tập cộng đồng",
        content: (
          <div className="space-y-2 text-xs">
            <p>• <strong>Học hỏi thụ động:</strong> Đọc các đoạn hội thoại giải đáp lỗi của bạn học giúp bạn tích lũy kinh nghiệm xử lý lỗi trước khi tự mình gặp phải.</p>
            <p>• <strong>Phản hồi siêu tốc:</strong> Đội ngũ hỗ trợ kỹ thuật và bạn học online liên tục sẽ giúp gỡ lỗi ngay lập tức, giữ mạch học không bị gián đoạn.</p>
            <p>• <strong>Phân chia kênh thông minh:</strong> Các chủ đề được chia nhỏ giúp bạn học nhanh chóng mà không lo bị ngập tin nhắn rác.</p>
          </div>
        )
      }
    ]
  },
  {
    id: 'busy-strategy',
    category: 'methods',
    q: "Kiến thức quá nặng và tôi rất bận. Có chiến thuật nào giúp tôi theo kịp lớp?",
    description: "Gợi ý chiến thuật học ngược thực chiến từ đội ngũ giúp tối ưu hóa thời gian học cho học viên bận rộn.",
    lastUpdated: "4 Tháng 7, 2026",
    sections: [
      {
        id: 'dont-watch-recordings',
        title: "1. Đề nghị: Ngừng xem lại toàn bộ Video Recording!",
        content: (
          <div className="space-y-3">
            <div className="p-3.5 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-xs font-bold text-red-800 flex items-start gap-2">
              <span className="text-base">⚠️</span>
              <div>
                Thay vì dành 2-3 tiếng để xem lại từ đầu đến cuối video bài giảng, hãy đổi sang phương pháp học thực chiến.
              </div>
            </div>
            <p className="text-xs text-[#3E5E63]">
              <strong>Bắt tay vào làm BTVN ngay:</strong> Khi gặp khó khăn ở bước nào, bạn mới mở video hoặc học liệu tìm kiếm đúng phần kiến thức đó để giải quyết. Điều này giúp não bộ tiếp thu kiến thức chủ động và ghi nhớ sâu sắc hơn.
            </p>
          </div>
        )
      },
      {
        id: 'ai-notebooklm',
        title: "2. Tra cứu nhanh qua AI NotebookLM",
        content: (
          <div className="space-y-2">
            <p>
              Ban tổ chức đã xây dựng sẵn một cuốn sổ tay thông minh tích hợp toàn bộ học liệu khóa học vào NotebookLM của Google. 
              Bạn có thể trò chuyện trực tiếp để hỏi đáp nhanh về lý thuyết lẫn thực hành:
            </p>
            <a 
              href="https://notebook.google.com/notebook/f2632a96-7fb3-4e23-b67d-1040f4451a3e" 
              target="_blank" 
              rel="noreferrer" 
              className="inline-flex items-center gap-2 font-bold text-xs bg-[#15333B] text-[#FFD94C] px-3.5 py-2 rounded-xl hover:bg-[#214C54] transition-all"
            >
              🚀 Truy cập Google NotebookLM
            </a>
          </div>
        )
      }
    ]
  },
  {
    id: 'past-courses-recording',
    category: 'support-community',
    q: "Tôi muốn học nâng cao và xem lại bài giảng các khóa cũ thì làm thế nào?",
    description: "Cung cấp quyền truy cập tài liệu, bài giảng ghi hình của các khóa học trước như Automation, IDE.",
    lastUpdated: "3 Tháng 7, 2026",
    sections: [
      {
        id: 'past-notion-link',
        title: "1. Liên kết Kho dữ liệu Khóa trước",
        content: (
          <div className="space-y-3">
            <p>
              Học viên xuất sắc muốn học vượt hoặc tham khảo các module chuyên sâu (Automation, Advanced IDE,...) 
              từ các khóa trước hoàn toàn có thể truy cập hệ thống lưu trữ Notion tổng quan dưới đây:
            </p>
            <a 
              href="https://app.notion.com/p/T-ng-h-p-h-c-li-u-Vibe-Coding-201-Batch-01-2f83d83cf6bd80f98898e00229718aec" 
              target="_blank" 
              rel="noreferrer" 
              className="inline-flex items-center gap-2 font-bold text-xs bg-[#214C54] text-white px-4 py-2.5 rounded-xl hover:bg-[#15333B] transition-all shadow-sm hover:shadow"
            >
              <Layers className="w-4 h-4" />
              🔗 Danh mục bài giảng & Học liệu khóa trước
            </a>
          </div>
        )
      }
    ]
  }
];
