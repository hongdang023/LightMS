import React, { useState, useMemo, useEffect, useRef } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { 
  Search, 
  ArrowLeft, 
  BookOpen, 
  Compass, 
  Award, 
  MessageSquare, 
  ChevronRight, 
  ExternalLink,
  BookMarked,
  Info,
  Layers
} from 'lucide-react';

interface FAQSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface FAQArticle {
  id: string;
  category: string;
  q: string;
  description: string;
  lastUpdated: string;
  sections: FAQSection[];
}

interface CategoryInfo {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

export const HelpDesk: React.FC = () => {
  // Navigation states: 'home' | 'category' | 'article'
  const [viewState, setViewState] = useState<'home' | 'category' | 'article'>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSectionId, setActiveSectionId] = useState<string>('');

  const sectionsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const categories: CategoryInfo[] = [
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
      description: 'Kết nối Messenger Community Chat, Telegram Support 24/7 và thông tin hỗ trợ từ Ban tổ chức.',
      icon: <MessageSquare className="w-6 h-6 text-white" /> 
    }
  ];

  const faqs: FAQArticle[] = [
    {
      id: 'recording-notes',
      category: 'materials-schedule',
      q: "Tôi có thể tìm học liệu (Recording, Study Notes,…) ở đâu?",
      description: "Hướng dẫn chi tiết vị trí lưu trữ và cập nhật tài liệu học tập sau mỗi buổi học.",
      lastUpdated: "4 Tháng 7, 2026",
      sections: [
        {
          id: 'notion-workspace',
          title: "1. Notion Học Tập của Lớp",
          content: (
            <p>
              Học liệu chính thống luôn được cập nhật đầy đủ và trực quan tại 
              Notion của lớp, cụ thể tại mục <strong>03 | Tài liệu học tập & BTVN (Update sau từng buổi)</strong>. 
              Bạn hãy truy cập link Notion được gửi trong email Onboarding để lưu lại.
            </p>
          )
        },
        {
          id: 'notification-channels',
          title: "2. Kênh thông báo chính thức",
          content: (
            <div className="space-y-3">
              <p>Mỗi khi có bài viết hoặc tài liệu mới, đội ngũ vận hành The1ight sẽ thông báo qua các kênh:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <a 
                  href="https://www.facebook.com/share/g/18fRTLTSE3/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-3 p-3 bg-white border border-gray-150 rounded-xl hover:shadow-md transition-shadow group"
                >
                  <span className="text-xl">👥</span>
                  <div className="text-left">
                    <h5 className="font-bold text-xs text-[#15333B] group-hover:underline">Facebook Group</h5>
                    <p className="text-[10px] text-gray-400">Xem tại mục Đáng chú ý</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 ml-auto text-gray-400" />
                </a>
                <a 
                  href="https://m.me/ch/AbYXkhY5TwUcD9zz/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-3 p-3 bg-white border border-gray-150 rounded-xl hover:shadow-md transition-shadow group"
                >
                  <span className="text-xl">💬</span>
                  <div className="text-left">
                    <h5 className="font-bold text-xs text-[#15333B] group-hover:underline">Messenger Chat</h5>
                    <p className="text-[10px] text-gray-400">Phòng chat Bảng tin Ánh sáng</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 ml-auto text-gray-400" />
                </a>
              </div>
            </div>
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
              <a 
                href="https://docs.google.com/spreadsheets/d/1MkdyolJBxs8xjvBmRlooO9QmZAnIGZM1oWN_WyD2zJg/edit?gid=1843915489" 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-2 font-bold text-xs bg-[#214C54] text-white px-4 py-2.5 rounded-xl hover:bg-[#15333B] transition-all shadow-sm hover:shadow"
              >
                <Layers className="w-4 h-4" />
                📊 Bảng Tracking Tiến độ & Leo Rank lớp học
              </a>
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
      description: "4 phương thức nhận phản hồi và giải đáp thắc mắc hiệu quả từ Mentor, AI và Quản lý lớp học.",
      lastUpdated: "4 Tháng 7, 2026",
      sections: [
        {
          id: 'four-channels',
          title: "1. Bốn kênh nhận hỗ trợ đắc lực",
          content: (
            <div className="space-y-3">
              <p>Motto của lớp học là <strong>“Hỏi ngu còn hơn không hỏi”</strong>. Đừng ngần ngại sử dụng các phương án sau:</p>
              <ol className="list-decimal pl-5 space-y-3 text-xs text-[#3E5E63]">
                <li>
                  <strong className="text-[#15333B]">Cách 01 (Khuyến khích nhất):</strong> Đặt câu hỏi tại phòng 
                  <a href="https://m.me/ch/AbZBhshrDpB2lylD/" target="_blank" rel="noreferrer" className="text-[#214C54] font-bold hover:underline mx-1">Light Support</a> 
                  Messenger Community. Nơi Mentor và các học viên khác hoạt động rất sôi nổi để gỡ rối nhanh.
                </li>
                <li>
                  <strong className="text-[#15333B]">Cách 02 (Tận dụng AI):</strong> Hỏi Trợ lý AI được tích hợp. Bạn sẽ được hướng dẫn viết prompt hỏi bài tập hiệu quả tại Onboarding Week.
                </li>
                <li>
                  <strong className="text-[#15333B]">Cách 03 (Hỗ trợ vận hành):</strong> Liên hệ trực tiếp với Ms. Đặng Hồng (Quản lý lớp học) qua SĐT <strong>0985679417</strong> hoặc qua trang 
                  <a href="https://www.facebook.com/danghong.harunoyuki" target="_blank" rel="noreferrer" className="text-[#214C54] font-bold hover:underline mx-1">Messenger</a>.
                </li>
                <li>
                  <strong className="text-[#15333B]">Cách 04:</strong> Tham gia buổi <strong>Office Hour</strong> hàng tuần để thảo luận 1-1 trực tiếp cùng giảng viên.
                </li>
              </ol>
            </div>
          )
        }
      ]
    },
    {
      id: 'why-messenger-community',
      category: 'support-community',
      q: "Tôi ít dùng mạng xã hội, vì sao nên tham gia Messenger Community?",
      description: "Lợi ích thực tế của việc kết nối cộng đồng học tập chung trong việc giải đáp nhanh và tiếp thu kiến thức thụ động.",
      lastUpdated: "30 Tháng 6, 2026",
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
                href="https://notebooklm.google.com/notebook/b0b2b953-c851-4580-9eef-934ff1ff4ac4" 
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
                href="https://www.notion.so/Overall-Syllabus-to-be-updated-264fb1613f7081d4ad7de0541bc29e98" 
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

  // Global search filtering across all articles
  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return faqs.filter(art => 
      art.q.toLowerCase().includes(query) || 
      art.description.toLowerCase().includes(query) ||
      art.sections.some(sec => sec.title.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  // Selected category info
  const selectedCategory = useMemo(() => {
    return categories.find(c => c.id === selectedCategoryId);
  }, [selectedCategoryId]);

  // Articles within selected category
  const categoryArticles = useMemo(() => {
    return faqs.filter(art => art.category === selectedCategoryId);
  }, [selectedCategoryId]);

  // Active article content
  const activeArticle = useMemo(() => {
    return faqs.find(art => art.id === selectedArticleId);
  }, [selectedArticleId]);

  // Intersection observer to highlight current section in Table of Contents
  useEffect(() => {
    if (viewState !== 'article' || !activeArticle) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSectionId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    activeArticle.sections.forEach(sec => {
      const el = sectionsRef.current[sec.id];
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [viewState, activeArticle]);

  const scrollToSection = (id: string) => {
    const el = sectionsRef.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSectionId(id);
    }
  };

  const handleCategoryClick = (catId: string) => {
    setSelectedCategoryId(catId);
    setSearchQuery('');
    setViewState('category');
  };

  const handleArticleClick = (artId: string) => {
    setSelectedArticleId(artId);
    setViewState('article');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in select-none pb-12">
      
      {/* Header component */}
      {viewState === 'home' && (
        <PageHeader
          title="Hỏi đáp & Hỗ trợ"
          description="Trung tâm giải đáp thắc mắc học tập, lịch trình lớp học và hướng dẫn xử lý sự cố."
          helpTitle="Help Center"
          helpSummary="Học liệu, lịch học, Kudos và cổng Telegram Support trực tiếp."
          helpPurpose="Giúp bạn nhanh chóng tháo gỡ mọi vướng mắc kỹ thuật và lý thuyết trên hành trình LightMS."
        />
      )}

      {/* TOP: Back Navigation if inside category or article details */}
      {viewState !== 'home' && (
        <button
          onClick={() => {
            if (viewState === 'article') {
              setViewState(selectedCategoryId ? 'category' : 'home');
            } else {
              setViewState('home');
            }
          }}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#214C54] hover:text-[#15333B] transition-colors bg-white px-3.5 py-2 rounded-xl shadow-sm border border-gray-100 hover:shadow text-left"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Quay lại {viewState === 'article' && selectedCategoryId ? 'danh mục' : 'trang chủ'}
        </button>
      )}

      {/* 1. HOME VIEW */}
      {viewState === 'home' && (
        <div className="space-y-8">
          
          {/* SEARCH HERO BAR */}
          <div className="bg-[#15333B] rounded-3xl p-8 text-center text-white relative overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-[#214C54]/20 to-[#FFD94C]/10 opacity-50 pointer-events-none" />
            <h2 className="text-xl md:text-2xl font-black mb-3 text-white">Tìm kiếm câu trả lời hoặc chọn chủ đề</h2>
            <p className="text-xs text-gray-300 max-w-md mx-auto mb-6">Nhập từ khóa liên quan đến học liệu, Kudos, lịch học hoặc phương pháp học tập để bắt đầu.</p>
            
            {/* Search Input Container */}
            <div className="relative max-w-xl mx-auto">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm bài viết hướng dẫn..."
                className="w-full pl-11 pr-4 py-3 bg-white text-gray-800 rounded-2xl text-sm border-0 focus:ring-2 focus:ring-[#FFD94C] shadow-inner font-medium placeholder-gray-400 transition-all"
              />
            </div>
          </div>

          {/* SEARCH RESULTS OR GRID */}
          {searchQuery.trim() ? (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider text-left">Kết quả tìm kiếm cho "{searchQuery}"</h3>
              {filteredArticles.length > 0 ? (
                <div className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-sm">
                  {filteredArticles.map((art, index) => (
                    <div 
                      key={art.id} 
                      onClick={() => handleArticleClick(art.id)}
                      className={`p-4 hover:bg-gray-50 cursor-pointer flex items-center justify-between transition-colors ${
                        index !== filteredArticles.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                    >
                      <div className="space-y-1 text-left">
                        <h4 className="font-bold text-xs text-[#15333B]">{art.q}</h4>
                        <p className="text-[10px] text-gray-400 font-medium">{art.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-150 shadow-sm">
                  <span className="text-4xl">🔍</span>
                  <p className="text-xs text-gray-400 font-bold mt-3 text-center">Không tìm thấy bài viết nào phù hợp.</p>
                  <p className="text-[10px] text-gray-400 text-center">Hãy thử tìm kiếm với các từ khóa khác như "lịch", "kudos", "ngợp".</p>
                </div>
              )}
            </div>
          ) : (
            /* CATEGORY CARDS GRID */
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider text-left">Duyệt theo chủ đề</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map(cat => {
                  const count = faqs.filter(f => f.category === cat.id).length;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.id)}
                      className="bg-white border border-gray-150 rounded-2xl p-6 hover:shadow-md hover:border-[#214C54]/30 cursor-pointer transition-all flex gap-4 group text-left"
                    >
                      <div className="shrink-0 w-12 h-12 bg-[#214C54] rounded-xl flex items-center justify-center shadow-sm">
                        {cat.icon}
                      </div>
                      <div className="space-y-1 text-left min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-[#15333B] group-hover:text-[#214C54] transition-colors">{cat.label}</h4>
                          <span className="bg-gray-100 text-gray-400 text-[8px] font-bold px-1.5 py-0.5 rounded-full">{count} bài viết</span>
                        </div>
                        <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">{cat.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TELEGRAM DIRECT SUPPORT */}
          <div className="bg-[#214C54]/5 border border-[#214C54]/20 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🛟</span>
              <div className="text-left">
                <h4 className="font-extrabold text-xs text-[#15333B]">Phòng Light Support trên Telegram</h4>
                <p className="text-[10px] text-gray-500 mt-0.5 font-semibold">Tự động kết nối trực tiếp đến trợ lý vận hành lớp để giải đáp trong 5 phút.</p>
              </div>
            </div>
            <a 
              href="https://t.me/the1ight_support" 
              target="_blank" 
              rel="noreferrer"
              className="btn bg-[#FFD94C] text-[#15333B] hover:bg-[#e6c245] border-0 text-xs font-extrabold flex items-center gap-1.5 shrink-0 px-4 py-2 rounded-xl transition-all shadow-sm"
            >
              <span>🚀</span>
              <span>Liên hệ Telegram Support</span>
            </a>
          </div>
        </div>
      )}

      {/* 2. CATEGORY LIST VIEW */}
      {viewState === 'category' && selectedCategory && (
        <div className="space-y-6 text-left">
          <div className="bg-white rounded-3xl p-6 border border-gray-150 text-left shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 bg-[#214C54] rounded-2xl flex items-center justify-center shrink-0">
              {selectedCategory.icon}
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-black text-[#15333B]">{selectedCategory.label}</h2>
              <p className="text-xs text-gray-400 font-semibold">{selectedCategory.description}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm">
            {categoryArticles.length > 0 ? (
              categoryArticles.map((art, index) => (
                <div 
                  key={art.id} 
                  onClick={() => handleArticleClick(art.id)}
                  className={`p-5 hover:bg-gray-50 cursor-pointer flex items-center justify-between transition-colors ${
                    index !== categoryArticles.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="space-y-1 text-left">
                    <h4 className="font-bold text-xs text-[#15333B]">{art.q}</h4>
                    <p className="text-[10px] text-gray-400 font-semibold">{art.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 text-xs font-medium">Chưa có bài viết nào thuộc chủ đề này.</div>
            )}
          </div>
        </div>
      )}

      {/* 3. ARTICLE DETAIL VIEW (2-column layout) */}
      {viewState === 'article' && activeArticle && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-left items-start">
          
          {/* Main Article Content (Left Col - 3/4) */}
          <div className="lg:col-span-3 bg-white border border-gray-150 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
            
            {/* Header info */}
            <div className="border-b border-gray-100 pb-5 space-y-2 text-left">
              <h1 className="text-lg md:text-xl font-black text-[#15333B] leading-tight">{activeArticle.q}</h1>
              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold">
                <span className="bg-[#214C54]/10 text-[#214C54] px-2 py-0.5 rounded">
                  {categories.find(c => c.id === activeArticle.category)?.label}
                </span>
                <span>•</span>
                <span>Cập nhật ngày: {activeArticle.lastUpdated}</span>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-8">
              {activeArticle.sections.map(sec => (
                <div 
                  key={sec.id}
                  id={sec.id}
                  ref={el => { sectionsRef.current[sec.id] = el; }}
                  className="space-y-3 scroll-mt-20 text-left"
                >
                  <h3 className="text-xs font-bold text-[#15333B] border-b border-gray-50 pb-2">{sec.title}</h3>
                  <div className="text-xs text-[#3E5E63] leading-relaxed font-semibold">
                    {sec.content}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Table of Contents (Right Col - 1/4) */}
          <div className="hidden lg:block sticky top-20 bg-white border border-gray-150 rounded-2xl p-5 shadow-sm space-y-4 text-left">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-gray-400" />
              Mục lục bài viết
            </h4>
            <div className="space-y-1">
              {activeArticle.sections.map(sec => {
                const isActive = activeSectionId === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full text-left pl-3 py-1.5 text-[10px] font-bold border-l-2 transition-all block ${
                      isActive 
                        ? 'border-[#214C54] text-[#214C54] bg-[#214C54]/5 font-extrabold' 
                        : 'border-transparent text-gray-400 hover:text-[#15333B] hover:border-gray-200'
                    }`}
                  >
                    {sec.title}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
