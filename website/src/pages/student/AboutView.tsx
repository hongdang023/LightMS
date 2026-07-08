import React, { useState, useEffect } from 'react';
import { AnchorIcon, RouteIcon, GiftIcon } from '../../components/Icons';
import { PageHeader } from '../../components/PageHeader';
import { useDatabase } from '../../context/DatabaseContext';
import { Save, Undo, Plus, Trash2, BookOpen } from 'lucide-react';

interface AboutViewProps {
  onPageChange: (page: string) => void;
  isEditMode?: boolean;
}

interface PlatformButton {
  icon: string;
  title: string;
  subtitle: string;
  url: string;
}

interface BenefitClub {
  icon: string;
  name: string;
  desc: string;
  links: { label: string; url: string }[];
}

export const AboutView: React.FC<AboutViewProps> = ({ onPageChange, isEditMode = false }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'platforms' | 'benefits'>('overview');
  const { aboutContent, updateAboutContent } = useDatabase();

  // Local draft states for raw fields
  const [draftOverview, setDraftOverview] = useState('');
  const [draftSchedule, setDraftSchedule] = useState('');
  const [draftBenefits, setDraftBenefits] = useState('');

  // Local draft states for newly editable fields
  const [draftQuote, setDraftQuote] = useState('');
  const [draftGachDauDong, setDraftGachDauDong] = useState<string[]>([]);
  const [draftTruCot1, setDraftTruCot1] = useState({ title: '', subtitle: '', desc: '' });
  const [draftTruCot2, setDraftTruCot2] = useState({ title: '', subtitle: '', desc: '' });
  const [draftTruCot3, setDraftTruCot3] = useState({ title: '', subtitle: '', desc: '' });
  const [draftOutro, setDraftOutro] = useState('');
  const [draftSdtNote, setDraftSdtNote] = useState('');
  const [draftOfficeHourDesc, setDraftOfficeHourDesc] = useState('');
  const [draftLuuYGold, setDraftLuuYGold] = useState('');

  // Video Loom & Platform Buttons state management
  const [draftVideoUrl, setDraftVideoUrl] = useState('');
  const [draftPlatformButtons, setDraftPlatformButtons] = useState<PlatformButton[]>([]);

  // Benefits Tab Clubs state management
  const [draftBenefitClubs, setDraftBenefitClubs] = useState<BenefitClub[]>([]);

  const [activeEditorId, setActiveEditorId] = useState<string | null>(null);

  // Helper to load state from localStorage or fallback to default
  const getStoredItem = (key: string, fallback: string) => {
    return localStorage.getItem(key) || fallback;
  };

  const getStoredArray = (key: string, fallback: string[]) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  };

  const getStoredObject = <T,>(key: string, fallback: T): T => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  };

  // Sync draft states when context or localStorage loads
  useEffect(() => {
    // Overview main text
    let initialOverview = aboutContent.overviewText || '';
    if (initialOverview.trim().startsWith('[') && initialOverview.trim().endsWith(']')) {
      try {
        const parsed = JSON.parse(initialOverview);
        if (Array.isArray(parsed) && parsed[0]?.content) {
          initialOverview = parsed[0].content;
        }
      } catch (e) {
        // Fallback
      }
    }
    setDraftOverview(initialOverview);
    setDraftSchedule(aboutContent.scheduleText || '');
    setDraftBenefits(aboutContent.benefitsText || '');

    // Video Loom Url
    setDraftVideoUrl(getStoredItem('about_draft_video_url', 'https://drive.google.com/file/d/1bhtSzABAjKHPB_1LzzTG0wxiscAilC0a/view?usp=sharing'));

    // Invalidate old platform buttons cache if names are long
    const cachedPlatforms = localStorage.getItem('about_draft_platform_buttons');
    if (cachedPlatforms) {
      try {
        const parsed = JSON.parse(cachedPlatforms);
        if (Array.isArray(parsed) && parsed.some(p => p.title.includes('học liệu tổng hợp') || p.title.includes('lớp học'))) {
          localStorage.removeItem('about_draft_platform_buttons');
        }
      } catch (e) {}
    }

    // Dynamic Platform Buttons
    setDraftPlatformButtons(getStoredObject<PlatformButton[]>('about_draft_platform_buttons', [
      { icon: '📒', title: 'LightMS', subtitle: 'Nền tảng tổng hợp toàn bộ học liệu của lớp', url: 'https://app.notion.com/p/f152df46dabf83ceb8788165361bf772?pvs=21' },
      { icon: '📅', title: 'Google Calendar', subtitle: 'Nhắc lịch học và các sự kiện của lớp', url: 'https://calendar.google.com/calendar/u/0?cid=NjMyNjQwNzkyZDc1YzM1ZGM2YWNhMzA2MjVlMWMzNWRlM2Y2ZDRkYmY3OTlmNTBmOTI0MmExMzg4ZDc5NjllZEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t' },
      { icon: '💬', title: 'Telegram', subtitle: 'Nền tảng nhắn tin giao lưu của lớp', url: 'https://t.me/+C8OUa6qqgNsyYjQ9' },
      { icon: '👥', title: 'Facebook Group', subtitle: 'Nơi nộp Bài tập về nhà và nhận góp ý', url: 'https://www.facebook.com/groups/27216190438021089' }
    ]));

    // Invalidate old cache
    const cachedClubs = localStorage.getItem('about_draft_benefit_clubs');
    if (cachedClubs) {
      try {
        const parsed = JSON.parse(cachedClubs);
        // Invalidate if Office Hour card still present, or too many/few cards
        if (Array.isArray(parsed) && (parsed.length !== 3 || parsed.some((c: any) => c.name === 'Office Hour'))) {
          localStorage.removeItem('about_draft_benefit_clubs');
        }
      } catch (e) {}
    }

    // Dynamic Benefit Clubs (Benefits Tab)
    setDraftBenefitClubs(getStoredObject<BenefitClub[]>('about_draft_benefit_clubs', [
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
    ]));

    // Quotes & Lists
    setDraftQuote(getStoredItem('about_draft_quote', '"Bạn không cần biết code, không cần có team. Chỉ cần bạn – và một vấn đề bạn muốn giải quyết."'));
    setDraftGachDauDong(getStoredArray('about_draft_gach_dau_dong', [
      'Học cách nâng cấp sản phẩm của mình từ prototype chạy được đến một sản phẩm có cấu trúc hệ thống.',
      'Hiểu tech sâu hơn để tự tin xây sản phẩm với AI (IDE, GitHub, backend, deploy, MCP và automation,..).',
      'Và đặc biệt, có mentor kèm và một cộng đồng bạn học đồng hành cùng bạn trong suốt hành trình.'
    ]));

    // 3 Trụ Cột
    setDraftTruCot1(getStoredObject('about_draft_tru_cot_1', {
      title: '1. Tư duy đúng 🧠',
      subtitle: 'MINDSET & PRODUCT LOGIC',
      desc: 'Hiểu đúng về sản phẩm – từ lý thuyết đến thực tế. Tư duy như một PM thật sự: đặt câu hỏi đúng, viết Problem Statement, đặt giả định và kiểm chứng từng bước.'
    }));
    setDraftTruCot2(getStoredObject('about_draft_tru_cot_2', {
      title: '2. Công cụ đúng 🧰',
      subtitle: 'TOOLING & PROTOTYPING',
      desc: 'Đào sâu hơn vào IDE và các thuật ngữ kĩ thuật để giúp bạn biến sản phẩm của mình từ một prototype chạy được đến xây sản phẩm có cấu trúc hệ thống.'
    }));
    setDraftTruCot3(getStoredObject('about_draft_tru_cot_3', {
      title: '3. Thử nghiệm đúng 🔬',
      subtitle: 'BUILD – TEST – LEARN',
      desc: 'Tự tay xây và học được bài học thật từ người dùng thật, không cần chờ code hay kỹ thuật cao.'
    }));

    // Outro cam kết
    setDraftOutro(getStoredItem('about_draft_outro', 'Vibe Coding 201 là một hành trình học – làm – launch thật sự.\n\nVà bạn sẽ rời khỏi lớp học với:\n- 1 sản phẩm thật có cấu trúc do chính bạn tự xây dựng\n- Tư duy đúng để lặp lại quy trình này lần nữa\n\nLà một người xây sản phẩm, mình biết cái cảm giác lôi đứa con tinh thần từ trong đầu ra ngoài nó đẹp như thế nào.\nMình muốn trong 30 ngày, bạn sẽ làm được và có được trải nghiệm này.\n\nThân gửi,\nĐội ngũ The1ight'));

    // SĐT Liên hệ & Office hour
    setDraftSdtNote(getStoredItem('about_draft_sdt_note', 'Nếu chưa nhận được, vui lòng liên hệ **Ms. Đặng Hồng (Quản lý lớp học)** qua SĐT **0985679417** hoặc [Messenger](https://www.facebook.com/danghong.harunoyuki)'));
    setDraftOfficeHourDesc(getStoredItem('about_draft_office_hour_desc', 'Học viên có các vấn đề cần hỏi đáp chuyên sâu hoặc muốn nhận tư vấn trực tiếp từ thầy giáo có thể đăng ký tham gia Office Hour.'));

    // Lưu ý màu vàng
    setDraftLuuYGold(getStoredItem('about_draft_luu_y_gold', '⚠️ **Lưu ý:** Đây là các hoạt động phụ trợ bên ngoài khoá học để các học viên giao lưu với nhau, bạn **KHÔNG BẮT BUỘC** phải tham gia ngay đầu khoá học.'));
  }, [aboutContent]);

  const handleSave = () => {
    // Save primary fields
    updateAboutContent({
      overviewText: draftOverview,
      scheduleText: draftSchedule,
      benefitsText: draftBenefits,
    });

    // Save secondary dynamic fields locally
    localStorage.setItem('about_draft_quote', draftQuote);
    localStorage.setItem('about_draft_gach_dau_dong', JSON.stringify(draftGachDauDong));
    localStorage.setItem('about_draft_tru_cot_1', JSON.stringify(draftTruCot1));
    localStorage.setItem('about_draft_tru_cot_2', JSON.stringify(draftTruCot2));
    localStorage.setItem('about_draft_tru_cot_3', JSON.stringify(draftTruCot3));
    localStorage.setItem('about_draft_outro', draftOutro);
    localStorage.setItem('about_draft_sdt_note', draftSdtNote);
    localStorage.setItem('about_draft_office_hour_desc', draftOfficeHourDesc);
    localStorage.setItem('about_draft_luu_y_gold', draftLuuYGold);
    localStorage.setItem('about_draft_video_url', draftVideoUrl);
    localStorage.setItem('about_draft_platform_buttons', JSON.stringify(draftPlatformButtons));
    localStorage.setItem('about_draft_benefit_clubs', JSON.stringify(draftBenefitClubs));

    alert('Đã lưu tất cả thay đổi trên trang thành công! 🎉');
  };

  const handleCancel = () => {
    const keys = [
      'about_draft_quote', 'about_draft_gach_dau_dong', 'about_draft_tru_cot_1',
      'about_draft_tru_cot_2', 'about_draft_tru_cot_3', 'about_draft_outro',
      'about_draft_sdt_note', 'about_draft_office_hour_desc', 'about_draft_luu_y_gold',
      'about_draft_video_url', 'about_draft_platform_buttons', 'about_draft_benefit_clubs'
    ];
    keys.forEach(k => localStorage.removeItem(k));
    
    // Reset inputs
    window.location.reload();
  };

  // Add a new platform button to the grid
  const handleAddPlatformButton = () => {
    setDraftPlatformButtons([
      ...draftPlatformButtons,
      { icon: '🔗', title: 'Tên tài nguyên mới', subtitle: 'Mô tả ngắn', url: 'https://' }
    ]);
  };

  // Delete a platform button from the grid
  const handleDeletePlatformButton = (indexToDelete: number) => {
    setDraftPlatformButtons(draftPlatformButtons.filter((_, idx) => idx !== indexToDelete));
  };

  // Add a new Benefit Club Card
  const handleAddBenefitClub = () => {
    setDraftBenefitClubs([
      ...draftBenefitClubs,
      {
        icon: '🎁',
        name: 'Tên quyền lợi mới',
        desc: 'Mô tả ngắn về quyền lợi khi tham gia.',
        links: [
          { label: 'Nút liên kết 1', url: 'https://' }
        ]
      }
    ]);
  };

  // Delete a Benefit Club Card
  const handleDeleteBenefitClub = (indexToDelete: number) => {
    setDraftBenefitClubs(draftBenefitClubs.filter((_, idx) => idx !== indexToDelete));
  };

  // Add a new CTA Link button inside a specific Benefit Club
  const handleAddClubLink = (clubIndex: number) => {
    const next = [...draftBenefitClubs];
    next[clubIndex].links.push({ label: 'Nút mới', url: 'https://' });
    setDraftBenefitClubs(next);
  };

  // Remove a CTA Link button inside a specific Benefit Club
  const handleDeleteClubLink = (clubIndex: number, linkIndex: number) => {
    const next = [...draftBenefitClubs];
    next[clubIndex].links = next[clubIndex].links.filter((_, idx) => idx !== linkIndex);
    setDraftBenefitClubs(next);
  };

  const applyFormatting = (editorId: string, format: 'bold' | 'italic' | 'underline' | 'clear') => {
    const editor = document.getElementById(editorId) as HTMLDivElement;
    if (!editor) return;

    editor.focus();

    if (format === 'bold') {
      document.execCommand('bold', false);
    } else if (format === 'italic') {
      document.execCommand('italic', false);
    } else if (format === 'underline') {
      document.execCommand('underline', false);
    } else if (format === 'clear') {
      document.execCommand('removeFormat', false);
    }

    // Trigger state sync
    const html = editor.innerHTML;
    const cleanText = html
      .replace(/<b>(.*?)<\/b>/gi, '**$1**')
      .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<i>(.*?)<\/i>/gi, '*$1*')
      .replace(/<em>(.*?)<\/em>/gi, '*$1*')
      .replace(/<u>(.*?)<\/u>/gi, '<u>$1</u>')
      .replace(/<div><br><\/div>/gi, '\n')
      .replace(/<div>(.*?)<\/div>/gi, '\n$1')
      .replace(/<br>/gi, '\n')
      .replace(/&nbsp;/g, ' ')
      .trim();

    if (editorId === 'editor-overview') setDraftOverview(cleanText);
    if (editorId === 'editor-schedule') setDraftSchedule(cleanText);
    if (editorId === 'editor-benefits') setDraftBenefits(cleanText);
    if (editorId === 'editor-quote') setDraftQuote(cleanText);
    if (editorId === 'editor-outro') setDraftOutro(cleanText);
    if (editorId === 'editor-sdt-note') setDraftSdtNote(cleanText);
    if (editorId === 'editor-office-hour') setDraftOfficeHourDesc(cleanText);
    if (editorId === 'editor-luu-y') setDraftLuuYGold(cleanText);
  };

  const renderRichText = (text: string): React.ReactNode => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const isQuote = line.startsWith('> ');
      if (isQuote) {
        line = line.substring(2);
      }

      // Parser for inline markdown styling (Bold, Italic, Underline, Link)
      const regex = /\[(.*?)\]\((.*?)\)|\*\*(.*?)\*\*|\*(.*?)\*|<u>(.*?)<\/u>|<em[^>]*>(.*?)<\/em>/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        if (match[1] && match[2]) {
          parts.push(<a key={match.index} href={match[2]} target="_blank" rel="noreferrer" className="text-sky-600 hover:underline font-bold">{match[1]}</a>);
        } else if (match[3]) {
          parts.push(<strong key={match.index} className="font-extrabold text-[#15333B]">{match[3]}</strong>);
        } else if (match[4]) {
          parts.push(<em key={match.index} className="italic text-[#3E5E63]">{match[4]}</em>);
        } else if (match[5]) {
          parts.push(<u key={match.index} className="underline">{match[5]}</u>);
        } else if (match[6]) {
          parts.push(<em key={match.index} className="italic text-[#3E5E63]">{match[6]}</em>);
        }
        lastIndex = regex.lastIndex;
      }
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      const parsedLine = parts.length > 0 ? <>{parts}</> : line;

      if (isQuote) {
        return (
          <blockquote key={idx} className="border-l-4 border-yellow-500 pl-4 py-2 my-2 bg-yellow-50 rounded-r-lg text-gray-700 italic shadow-sm">
            {parsedLine}
          </blockquote>
        );
      }

      return (
        <div key={idx} className="min-h-[1.5em] my-1 text-[#3E5E63]">
          {parsedLine}
        </div>
      );
    });
  };

  const renderEditorToolbar = (editorId: string) => (
    <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-xl border border-slate-200/60 shadow-inner mb-2 select-none">
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          applyFormatting(editorId, 'bold');
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
          applyFormatting(editorId, 'italic');
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
          applyFormatting(editorId, 'underline');
        }}
        className="w-7 h-7 flex items-center justify-center text-sm underline hover:bg-white rounded-lg text-slate-700 transition-colors border border-transparent hover:border-slate-200/80 hover:shadow-sm"
        title="Gạch chân (Underline)"
      >
        U
      </button>
      <div className="w-px h-5 bg-gray-300 mx-1.5"></div>
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          applyFormatting(editorId, 'clear');
        }}
        className="w-7 h-7 flex items-center justify-center text-sm hover:bg-white rounded-lg text-rose-600 transition-colors border border-transparent hover:border-slate-200/80 hover:shadow-sm"
        title="Xóa định dạng"
      >
        Tx
      </button>
      <span className="text-[9px] text-gray-400 ml-auto italic hidden sm:inline pr-1">Nhấn Enter để xuống dòng</span>
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in pb-20">
      <PageHeader 
        title="Giới thiệu khoá học"
        description="Tổng quan về khoá học tại The1ight"
        helpTitle="Giới thiệu"
        helpSummary="Tất cả thông tin cần biết trước khi bắt đầu khoá học."
        helpPurpose="Giúp bạn hiểu rõ lộ trình, phương pháp học và cách lấy tối đa giá trị từ khoá học này."
      />
      
      <div className="card space-y-6">

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-150 gap-2 select-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-[#214C54] text-[#214C54]'
                : 'border-transparent text-gray-500 hover:text-[#214C54]'
            }`}
          >
            <AnchorIcon active={activeTab === 'overview'} className="w-4 h-4" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'schedule'
                ? 'border-[#214C54] text-[#214C54]'
                : 'border-transparent text-gray-500 hover:text-[#214C54]'
            }`}
          >
            <RouteIcon active={activeTab === 'schedule'} className="w-4 h-4" />
            <span>Lộ trình học</span>
          </button>
          <button
            onClick={() => setActiveTab('platforms')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'platforms'
                ? 'border-[#214C54] text-[#214C54]'
                : 'border-transparent text-gray-500 hover:text-[#214C54]'
            }`}
          >
            <BookOpen className={`w-4 h-4 ${activeTab === 'platforms' ? 'text-[#214C54]' : 'text-gray-500'}`} />
            <span>Nền tảng học tập</span>
          </button>
          <button
            onClick={() => setActiveTab('benefits')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'benefits'
                ? 'border-[#214C54] text-[#214C54]'
                : 'border-transparent text-gray-500 hover:text-[#214C54]'
            }`}
          >
            <GiftIcon active={activeTab === 'benefits'} className="w-4 h-4" />
            <span>Quyền lợi</span>
          </button>
        </div>


        {/* Tab Content */}
        <div className="rich-text space-y-4 text-sm leading-relaxed min-h-[300px]">
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="p-5 md:p-6 bg-gradient-to-r from-[#214C54]/5 to-[#214C54]/10 border border-[#214C54]/15 rounded-2xl text-[#15333B] relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#214C54]/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
                <div className="font-semibold text-[#15333B] md:text-[15px] leading-relaxed relative z-10">
                  {isEditMode ? (
                    <div className="space-y-2">
                      {activeEditorId === 'editor-overview' && renderEditorToolbar('editor-overview')}
                      <div
                        id="editor-overview"
                        contentEditable
                        suppressContentEditableWarning
                        onFocus={() => setActiveEditorId('editor-overview')}
                        onInput={(e) => {
                          const html = e.currentTarget.innerHTML;
                          const cleanText = html
                            .replace(/<b>(.*?)<\/b>/gi, '**$1**')
                            .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
                            .replace(/<i>(.*?)<\/i>/gi, '*$1*')
                            .replace(/<em>(.*?)<\/em>/gi, '*$1*')
                            .replace(/<u>(.*?)<\/u>/gi, '<u>$1</u>')
                            .replace(/<div><br><\/div>/gi, '\n')
                            .replace(/<div>(.*?)<\/div>/gi, '\n$1')
                            .replace(/<br>/gi, '\n')
                            .replace(/&nbsp;/g, ' ')
                            .trim();
                          setDraftOverview(cleanText);
                        }}
                        className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none min-h-[100px] text-sm text-[#3E5E63] font-semibold focus:ring-1 focus:ring-[#214C54]"
                        dangerouslySetInnerHTML={{
                          __html: draftOverview
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                            .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
                            .split('\n').join('<br>')
                        }}
                      />
                    </div>
                  ) : (
                    renderRichText(draftOverview)
                  )}
                </div>
              </div>



              <p className="font-bold text-sm md:text-[15px] text-[#15333B] pt-2">
                Không giống như các khoá dạy làm sản phẩm truyền thống, ở <strong>Build With The1ight</strong>, bạn sẽ:
              </p>
              
              {isEditMode ? (
                <div className="space-y-2 border border-dashed border-gray-250 p-3 rounded-xl bg-gray-50/50">
                  <span className="text-[10px] font-bold text-gray-400 block">3 GẠCH ĐẦU DÒNG QUYÊN LỢI:</span>
                  {draftGachDauDong.map((item, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const next = [...draftGachDauDong];
                        next[idx] = e.target.value;
                        setDraftGachDauDong(next);
                      }}
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-[#3E5E63] font-semibold bg-white"
                      placeholder={`Quyền lợi thứ ${idx + 1}`}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 pl-1 pt-1">
                  {draftGachDauDong.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 bg-slate-50/60 border border-slate-150/80 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</span>
                      <div className="font-semibold text-xs md:text-sm text-[#3E5E63] leading-relaxed">{renderRichText(item)}</div>
                    </div>
                  ))}
                </div>
              )}

              <h3 className="font-extrabold text-sm md:text-base text-[#15333B] pt-6 flex items-center gap-2">
                <span>🎯</span> Tư duy sản phẩm qua 3 trụ cột:
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                {/* Trụ Cột 1 */}
                <div className="p-4 bg-white rounded-2xl border-t-4 border-t-[#214C54] border border-gray-150 flex flex-col justify-start shadow-sm hover:shadow-md transition-all duration-300">
                  {isEditMode ? (
                    <div className="space-y-2">
                      <input 
                        type="text"
                        value={draftTruCot1.title}
                        onChange={(e) => setDraftTruCot1({ ...draftTruCot1, title: e.target.value })}
                        className="w-full text-xs font-bold text-[#214C54] bg-white border border-gray-200 rounded px-2 py-1"
                      />
                      <input 
                        type="text"
                        value={draftTruCot1.subtitle}
                        onChange={(e) => setDraftTruCot1({ ...draftTruCot1, subtitle: e.target.value })}
                        className="w-full text-[10px] font-semibold text-gray-400 bg-white border border-gray-200 rounded px-2 py-1 uppercase"
                      />
                      <textarea 
                        value={draftTruCot1.desc}
                        onChange={(e) => setDraftTruCot1({ ...draftTruCot1, desc: e.target.value })}
                        className="w-full text-xs text-[#3E5E63] bg-white border border-gray-200 rounded px-2 py-1 resize-none"
                        rows={3}
                      />
                    </div>
                  ) : (
                    <>
                      <div>
                        <span className="font-black text-sm text-[#214C54] block mb-1">{draftTruCot1.title}</span>
                        <span className="text-[10px] text-[#214C54]/60 font-black block uppercase tracking-wider mb-3.5">{draftTruCot1.subtitle}</span>
                      </div>
                      <p className="text-xs md:text-sm text-[#3E5E63] leading-relaxed font-medium">{draftTruCot1.desc}</p>
                    </>
                  )}
                </div>

                {/* Trụ Cột 2 */}
                <div className="p-4 bg-white rounded-2xl border-t-4 border-t-[#EAB308] border border-gray-150 flex flex-col justify-start shadow-sm hover:shadow-md transition-all duration-300">
                  {isEditMode ? (
                    <div className="space-y-2">
                      <input 
                        type="text"
                        value={draftTruCot2.title}
                        onChange={(e) => setDraftTruCot2({ ...draftTruCot2, title: e.target.value })}
                        className="w-full text-xs font-bold text-[#214C54] bg-white border border-gray-200 rounded px-2 py-1"
                      />
                      <input 
                        type="text"
                        value={draftTruCot2.subtitle}
                        onChange={(e) => setDraftTruCot2({ ...draftTruCot2, subtitle: e.target.value })}
                        className="w-full text-[10px] font-semibold text-gray-400 bg-white border border-gray-200 rounded px-2 py-1 uppercase"
                      />
                      <textarea 
                        value={draftTruCot2.desc}
                        onChange={(e) => setDraftTruCot2({ ...draftTruCot2, desc: e.target.value })}
                        className="w-full text-xs text-[#3E5E63] bg-white border border-gray-200 rounded px-2 py-1 resize-none"
                        rows={3}
                      />
                    </div>
                  ) : (
                    <>
                      <div>
                        <span className="font-black text-sm text-[#EAB308] block mb-1">{draftTruCot2.title}</span>
                        <span className="text-[10px] text-[#EAB308]/75 font-black block uppercase tracking-wider mb-3.5">{draftTruCot2.subtitle}</span>
                      </div>
                      <p className="text-xs md:text-sm text-[#3E5E63] leading-relaxed font-medium">{draftTruCot2.desc}</p>
                    </>
                  )}
                </div>

                {/* Trụ Cột 3 */}
                <div className="p-4 bg-white rounded-2xl border-t-4 border-t-[#00B2E2] border border-gray-150 flex flex-col justify-start shadow-sm hover:shadow-md transition-all duration-300">
                  {isEditMode ? (
                    <div className="space-y-2">
                      <input 
                        type="text"
                        value={draftTruCot3.title}
                        onChange={(e) => setDraftTruCot3({ ...draftTruCot3, title: e.target.value })}
                        className="w-full text-xs font-bold text-[#214C54] bg-white border border-gray-200 rounded px-2 py-1"
                      />
                      <input 
                        type="text"
                        value={draftTruCot3.subtitle}
                        onChange={(e) => setDraftTruCot3({ ...draftTruCot3, subtitle: e.target.value })}
                        className="w-full text-[10px] font-semibold text-gray-400 bg-white border border-gray-200 rounded px-2 py-1 uppercase"
                      />
                      <textarea 
                        value={draftTruCot3.desc}
                        onChange={(e) => setDraftTruCot3({ ...draftTruCot3, desc: e.target.value })}
                        className="w-full text-xs text-[#3E5E63] bg-white border border-gray-200 rounded px-2 py-1 resize-none"
                        rows={3}
                      />
                    </div>
                  ) : (
                    <>
                      <div>
                        <span className="font-black text-sm text-[#00B2E2] block mb-1">{draftTruCot3.title}</span>
                        <span className="text-[10px] text-[#00B2E2]/60 font-black block uppercase tracking-wider mb-3.5">{draftTruCot3.subtitle}</span>
                      </div>
                      <p className="text-xs md:text-sm text-[#3E5E63] leading-relaxed font-medium">{draftTruCot3.desc}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Editable Outro footer */}
              <div className="pt-6 border-t border-gray-100 mt-8 relative">
                {isEditMode ? (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-gray-400">PHẦN CAM KẾT & CHỮ KÝ OUTRO:</span>
                    {activeEditorId === 'editor-outro' && renderEditorToolbar('editor-outro')}
                    <div
                      id="editor-outro"
                      contentEditable
                      suppressContentEditableWarning
                      onFocus={() => setActiveEditorId('editor-outro')}
                      onInput={(e) => {
                        const html = e.currentTarget.innerHTML;
                        const cleanText = html
                          .replace(/<b>(.*?)<\/b>/gi, '**$1**')
                          .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
                          .replace(/<i>(.*?)<\/i>/gi, '*$1*')
                          .replace(/<em>(.*?)<\/em>/gi, '*$1*')
                          .replace(/<u>(.*?)<\/u>/gi, '<u>$1</u>')
                          .replace(/<div><br><\/div>/gi, '\n')
                          .replace(/<div>(.*?)<\/div>/gi, '\n$1')
                          .replace(/<br>/gi, '\n')
                          .replace(/&nbsp;/g, ' ')
                          .trim();
                        setDraftOutro(cleanText);
                      }}
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none min-h-[100px] text-xs font-semibold focus:ring-1 focus:ring-[#214C54]"
                      dangerouslySetInnerHTML={{
                        __html: draftOutro
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em>$1</em>')
                          .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
                          .split('\n').join('<br>')
                      }}
                    />
                  </div>
                ) : (
                  <div className="bg-[#214C54]/5 border border-[#214C54]/10 rounded-2xl p-6 md:p-8 space-y-4">
                    <div className="text-sm md:text-[15px] font-semibold text-[#15333B] leading-relaxed space-y-3">
                      {draftOutro.split('\n\n').map((paragraph, pIdx) => {
                        const lines = paragraph.split('\n');
                        const isBulletList = lines.some(line => line.trim().startsWith('-'));
                        
                        if (isBulletList) {
                          return (
                            <ul key={pIdx} className="list-none space-y-2.5 my-3.5 pl-1">
                              {lines.map((line, lIdx) => {
                                const cleanLine = line.replace(/^-\s*/, '');
                                return (
                                  <li key={lIdx} className="flex items-center gap-2.5 text-sm text-[#214C54] font-bold">
                                    <span className="w-2 h-2 rounded-full bg-[#EAB308] shrink-0" />
                                    {renderRichText(cleanLine)}
                                  </li>
                                );
                              })}
                            </ul>
                          );
                        }

                        // Check if it's the personal signature note
                        const isPersonalNote = paragraph.trim().startsWith('*') || paragraph.trim().includes('Thân gửi,') || paragraph.trim().includes('Đội ngũ The1ight');
                        if (isPersonalNote) {
                          return (
                            <div key={pIdx} className="border-l-2 border-slate-300 pl-4 py-1.5 my-4 italic text-slate-500 font-medium text-xs md:text-sm">
                              {renderRichText(paragraph.replace(/^\*\s*/, ''))}
                            </div>
                          );
                        }

                        return (
                          <p key={pIdx} className="leading-relaxed">
                            {renderRichText(paragraph)}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-8 animate-fade-in text-left">
              <div>
                {isEditMode ? (
                  <div className="p-4 bg-[#214C54]/5 border border-l-4 border-[#214C54] rounded-xl text-sm text-[#3E5E63]">
                    {activeEditorId === 'editor-schedule' && renderEditorToolbar('editor-schedule')}
                    <div
                      id="editor-schedule"
                      contentEditable
                      suppressContentEditableWarning
                      onFocus={() => setActiveEditorId('editor-schedule')}
                      onInput={(e) => {
                        const html = e.currentTarget.innerHTML;
                        const cleanText = html
                          .replace(/<b>(.*?)<\/b>/gi, '**$1**')
                          .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
                          .replace(/<i>(.*?)<\/i>/gi, '*$1*')
                          .replace(/<em>(.*?)<\/em>/gi, '*$1*')
                          .replace(/<u>(.*?)<\/u>/gi, '<u>$1</u>')
                          .replace(/<div><br><\/div>/gi, '\n')
                          .replace(/<div>(.*?)<\/div>/gi, '\n$1')
                          .replace(/<br>/gi, '\n')
                          .replace(/&nbsp;/g, ' ')
                          .trim();
                        setDraftSchedule(cleanText);
                      }}
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none min-h-[120px] text-sm text-[#3E5E63] font-semibold focus:ring-1 focus:ring-[#214C54]"
                      dangerouslySetInnerHTML={{
                        __html: draftSchedule
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em>$1</em>')
                          .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
                          .split('\n').join('<br>')
                      }}
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="font-extrabold text-base text-[#15333B] flex items-center gap-2">
                      <span>⚓</span> Lộ trình học:
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {draftSchedule.split('\n\n').filter(p => p.trim().includes('Chặng')).map((stage, idx) => {
                        const cleanStage = stage.replace(/^⚓\s*/, '').replace(/^Lịch trình toàn khoá học:\s*/, '').trim();
                        if (!cleanStage) return null;
                        const parts = cleanStage.split(' - ');
                        const titlePart = parts[0] || '';
                        const descPart = parts.slice(1).join(' - ') || '';
                        
                        const icons = ['🚀', '⛵', '💻', '🎓'];
                        const borderColors = ['border-t-[#DC2626]', 'border-t-[#7C3AED]', 'border-t-[#EA580C]', 'border-t-[#B45309]'];
                        
                        return (
                          <div key={idx} className={`p-5 rounded-2xl border-t-4 ${borderColors[idx % 4]} border border-gray-150 bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300`}>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">{icons[idx % 4]}</span>
                                <h4 className="font-black text-[#15333B] text-sm md:text-[15px]">{titlePart}</h4>
                              </div>
                              <p className="text-xs md:text-sm text-[#3E5E63] leading-relaxed font-semibold mb-4">{descPart}</p>
                            </div>
                            
                            {idx === 1 && (
                              <button 
                                onClick={() => onPageChange('onboarding')}
                                className="self-start text-[10px] font-bold text-[#FFD94C] bg-[#15333B] px-2.5 py-1.5 rounded-lg hover:bg-[#214C54] cursor-pointer transition-colors"
                              >
                                Đi đến Onboarding ➔
                              </button>
                            )}
                            
                            {idx === 2 && (
                              <button 
                                onClick={() => onPageChange('syllabus')}
                                className="self-start text-[10px] font-bold text-[#FFD94C] bg-[#15333B] px-2.5 py-1.5 rounded-lg hover:bg-[#214C54] cursor-pointer transition-colors"
                              >
                                Đi đến Lộ trình học ➔
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'platforms' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div>
                <h3 className="font-extrabold text-base text-[#15333B] mb-3"> Các nền tảng học tập:</h3>

                {/* Editable Dynamic Platform Buttons */}
                <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {draftPlatformButtons.map((btn, idx) => (
                        <div key={idx} className={isEditMode ? "relative bg-white rounded-lg border border-gray-100 p-2 group shadow-sm hover:shadow transition-shadow" : "flex flex-col"}>
                          {isEditMode ? (
                            <div className="space-y-1.5">
                              <div className="flex gap-1.5">
                                <input
                                  type="text"
                                  value={btn.icon}
                                  onChange={(e) => {
                                    const next = [...draftPlatformButtons];
                                    next[idx].icon = e.target.value;
                                    setDraftPlatformButtons(next);
                                  }}
                                  className="w-8 border border-gray-200 rounded text-center text-xs py-0.5"
                                  placeholder="Icon"
                                />
                                <input
                                  type="text"
                                  value={btn.title}
                                  onChange={(e) => {
                                    const next = [...draftPlatformButtons];
                                    next[idx].title = e.target.value;
                                    setDraftPlatformButtons(next);
                                  }}
                                  className="flex-1 border border-gray-200 rounded px-2 text-xs font-bold text-gray-700 py-0.5"
                                  placeholder="Tên tài nguyên"
                                />
                              </div>
                              <input
                                type="text"
                                value={btn.subtitle}
                                onChange={(e) => {
                                    const next = [...draftPlatformButtons];
                                    next[idx].subtitle = e.target.value;
                                    setDraftPlatformButtons(next);
                                }}
                                className="w-full border border-gray-200 rounded px-2 text-[10px] py-0.5"
                                placeholder="Mô tả phụ"
                              />
                              <input
                                type="text"
                                value={btn.url}
                                onChange={(e) => {
                                    const next = [...draftPlatformButtons];
                                    next[idx].url = e.target.value;
                                    setDraftPlatformButtons(next);
                                }}
                                className="w-full border border-gray-200 rounded px-2 text-[9px] text-[#214C54] py-0.5"
                                placeholder="Link URL"
                              />
                              <button
                                type="button"
                                onClick={() => handleDeletePlatformButton(idx)}
                                className="absolute top-1 right-1 text-red-500 hover:text-red-700 p-0.5"
                                title="Xóa tài nguyên này"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col justify-between h-full p-4 bg-white rounded-2xl border border-gray-150 shadow-sm hover:shadow-md transition-all duration-300">
                              <div className="flex items-start gap-3">
                                <span className="text-2xl shrink-0 mt-0.5">{btn.icon}</span>
                                <div className="flex-1 min-w-0">
                                   <span className="text-sm font-extrabold text-[#15333B] block">{btn.title}</span>
                                   <span className="text-xs text-gray-400 block mt-1 leading-relaxed">{btn.subtitle}</span>
                                </div>
                              </div>
                              
                              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                                {btn.title.toLowerCase().includes('lightms') ? (
                                   <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">Không có nút</span>
                                ) : btn.title.toLowerCase().includes('calendar') ? (
                                  <button
                                    onClick={() => onPageChange('calendar')}
                                    className="text-xs font-bold text-[#FFD94C] bg-[#15333B] px-2.5 py-1.5 rounded-lg hover:bg-[#214C54] transition-colors"
                                  >
                                    Đăng ký / Xem Lịch học ➔
                                  </button>
                                ) : btn.title.toLowerCase().includes('telegram') ? (
                                  <a
                                    href={btn.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs font-bold text-[#FFD94C] bg-[#15333B] px-2.5 py-1.5 rounded-lg hover:bg-[#214C54] transition-colors"
                                  >
                                    Tham gia Telegram ➔
                                  </a>
                                ) : (
                                  <a
                                    href={btn.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs font-bold text-[#FFD94C] bg-[#15333B] px-2.5 py-1.5 rounded-lg hover:bg-[#214C54] transition-colors"
                                  >
                                    Đi đến Facebook Group ➔
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {isEditMode && (
                      <button
                        type="button"
                        onClick={handleAddPlatformButton}
                        className="w-full flex items-center justify-center gap-1 py-2 border border-dashed border-[#214C54]/40 hover:border-[#214C54] rounded-xl text-xs text-[#214C54] font-bold bg-white transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Thêm tài nguyên học tập</span>
                      </button>
                    )}
                  </div>

                  {/* SĐT notes edit */}
                  <div className="pt-2 border-t border-gray-100">
                    {isEditMode ? (
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-bold text-gray-400">HƯỚNG DẪN LIÊN HỆ:</span>
                        {activeEditorId === 'editor-sdt-note' && renderEditorToolbar('editor-sdt-note')}
                        <div
                          id="editor-sdt-note"
                          contentEditable
                          suppressContentEditableWarning
                          onFocus={() => setActiveEditorId('editor-sdt-note')}
                          onInput={(e) => {
                            const html = e.currentTarget.innerHTML;
                            const cleanText = html
                              .replace(/<b>(.*?)<\/b>/gi, '**$1**')
                              .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
                              .replace(/<i>(.*?)<\/i>/gi, '*$1*')
                              .replace(/<em>(.*?)<\/em>/gi, '*$1*')
                              .replace(/<u>(.*?)<\/u>/gi, '<u>$1</u>')
                              .replace(/<a href="(.*?)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
                              .replace(/<div><br><\/div>/gi, '\n')
                              .replace(/<div>(.*?)<\/div>/gi, '\n$1')
                              .replace(/<br>/gi, '\n')
                              .trim();
                            setDraftSdtNote(cleanText);
                          }}
                          className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none text-xs"
                          dangerouslySetInnerHTML={{
                            __html: draftSdtNote
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              .replace(/\*(.*?)\*/g, '<em>$1</em>')
                              .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
                              .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-sky-600 hover:underline">$1</a>')
                              .split('\n').join('<br>')
                          }}
                        />
                      </div>
                    ) : (
                      <p className="text-[10px] text-gray-500">
                        {renderRichText(draftSdtNote)}
                      </p>
                    )}
                  </div>
              </div>

              <div>
                <h3 className="font-extrabold text-base text-[#15333B] mb-3">👨‍🏫 Hoạt động hỗ trợ học tập:</h3>
                <div className="bg-white border border-[#214C54]/20 rounded-2xl p-4 shadow-sm flex items-start gap-4">
                  <div className="text-3xl pt-1">💬</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[#15333B] text-sm">Office Hour với Trainer</h4>
                    {isEditMode ? (
                      <div className="space-y-1.5 mt-2">
                        {activeEditorId === 'editor-office-hour' && renderEditorToolbar('editor-office-hour')}
                        <div
                          id="editor-office-hour"
                          contentEditable
                          suppressContentEditableWarning
                          onFocus={() => setActiveEditorId('editor-office-hour')}
                          onInput={(e) => {
                            const html = e.currentTarget.innerHTML;
                            const cleanText = html
                              .replace(/<b>(.*?)<\/b>/gi, '**$1**')
                              .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
                              .replace(/<i>(.*?)<\/i>/gi, '*$1*')
                              .replace(/<em>(.*?)<\/em>/gi, '*$1*')
                              .replace(/<u>(.*?)<\/u>/gi, '<u>$1</u>')
                              .replace(/<div><br><\/div>/gi, '\n')
                              .replace(/<div>(.*?)<\/div>/gi, '\n$1')
                              .replace(/<br>/gi, '\n')
                              .trim();
                            setDraftOfficeHourDesc(cleanText);
                          }}
                          className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none text-xs text-[#3E5E63] font-semibold"
                          dangerouslySetInnerHTML={{
                            __html: draftOfficeHourDesc
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              .replace(/\*(.*?)\*/g, '<em>$1</em>')
                              .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
                              .split('\n').join('<br>')
                          }}
                        />
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 mt-1">{draftOfficeHourDesc}</p>
                    )}
                    <a 
                      href="https://t.me/+C8OUa6qqgNsyYjQ9" 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-block text-xs font-bold text-[#FFD94C] bg-[#15333B] px-3 py-1.5 rounded-md mt-3 hover:bg-[#214C54] transition-colors"
                    >
                      👉 Đăng ký Office Hour tại Light Support
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'benefits' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div>
                <h3 className="font-extrabold text-base text-[#15333B] mb-4">🎁 Quyền lợi học viên:</h3>
                
                {/* Editable Dynamic Benefit Clubs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {draftBenefitClubs.map((club, clubIdx) => (
                    <div key={clubIdx} className="relative flex flex-col justify-between p-5 bg-white rounded-2xl border border-gray-150 shadow-sm p-4 group hover:shadow-md transition-all duration-300">
                      {isEditMode ? (
                        <div className="flex-1 space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={club.icon}
                              onChange={(e) => {
                                const next = [...draftBenefitClubs];
                                next[clubIdx].icon = e.target.value;
                                setDraftBenefitClubs(next);
                              }}
                              className="w-8 border border-gray-200 rounded text-center text-sm py-1"
                              placeholder="Icon"
                            />
                            <input
                              type="text"
                              value={club.name}
                              onChange={(e) => {
                                const next = [...draftBenefitClubs];
                                next[clubIdx].name = e.target.value;
                                setDraftBenefitClubs(next);
                              }}
                              className="flex-1 border border-gray-200 rounded px-2 text-sm font-bold text-[#15333B] py-1"
                              placeholder="Tên nhóm / quyền lợi"
                            />
                          </div>

                          <textarea
                            value={club.desc}
                            onChange={(e) => {
                              const next = [...draftBenefitClubs];
                              next[clubIdx].desc = e.target.value;
                              setDraftBenefitClubs(next);
                            }}
                            className="w-full border border-gray-200 rounded px-2 text-xs py-1.5 resize-none"
                            placeholder="Mô tả chi tiết quyền lợi"
                            rows={3}
                          />

                          {/* CTA Links management */}
                          <div className="space-y-1.5 bg-gray-50/50 p-2 rounded-lg border border-gray-100">
                            <span className="text-[9px] font-bold text-gray-400 block">DANH SÁCH CTA BUTTONS:</span>
                            {club.links.map((link, linkIdx) => (
                              <div key={linkIdx} className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  value={link.label}
                                  onChange={(e) => {
                                    const next = [...draftBenefitClubs];
                                    next[clubIdx].links[linkIdx].label = e.target.value;
                                    setDraftBenefitClubs(next);
                                  }}
                                  className="w-32 border border-gray-200 rounded px-2 text-[10px] py-0.5 bg-white font-semibold"
                                  placeholder="Tên nút"
                                />
                                <input
                                  type="text"
                                  value={link.url}
                                  onChange={(e) => {
                                    const next = [...draftBenefitClubs];
                                    next[clubIdx].links[linkIdx].url = e.target.value;
                                    setDraftBenefitClubs(next);
                                  }}
                                  className="flex-1 border border-gray-200 rounded px-2 text-[9px] py-0.5 bg-white"
                                  placeholder="Link URL"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleDeleteClubLink(clubIdx, linkIdx)}
                                  className="text-red-500 hover:text-red-700 p-0.5"
                                  title="Xóa nút này"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => handleAddClubLink(clubIdx)}
                              className="text-[9px] font-extrabold text-[#214C54] hover:underline flex items-center gap-0.5 mt-1"
                            >
                              <Plus className="w-3 h-3" /> Thêm CTA Button
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteBenefitClub(clubIdx)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1"
                            title="Xóa thẻ quyền lợi này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2.5 mb-3 border-b border-gray-150 pb-2.5">
                              <span className="text-2xl shrink-0">{club.icon}</span>
                              <h4 className="font-extrabold text-[#15333B] text-sm md:text-[15px]">{club.name}</h4>
                            </div>
                            <p className="text-xs md:text-sm text-[#3E5E63] leading-relaxed font-semibold mb-4">{club.desc}</p>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3 select-none">
                            {club.links.map((link, idx) => (
                              <a
                                key={idx}
                                href={link.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] font-bold text-[#FFD94C] bg-[#15333B] px-2.5 py-1.5 rounded-lg hover:bg-[#214C54] transition-colors"
                              >
                                {link.label}
                              </a>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {isEditMode && (
                  <button
                    type="button"
                    onClick={handleAddBenefitClub}
                    className="w-full flex items-center justify-center gap-1 py-3 border border-dashed border-[#214C54]/40 hover:border-[#214C54] rounded-2xl text-xs text-[#214C54] font-bold bg-white transition-colors mt-4"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm thẻ quyền lợi cộng đồng</span>
                  </button>
                )}
              </div>

                {/* Lưu Ý Gold */}
                <div className="mt-6">
                  {isEditMode ? (
                    <div className="space-y-1.5 bg-[#FFD94C]/10 border border-[#FFD94C]/30 rounded-2xl p-4">
                      <span className="text-[9px] font-bold text-[#554300]">CẢNH BÁO / LƯU Ý MÀU VÀNG:</span>
                      {activeEditorId === 'editor-luu-y' && renderEditorToolbar('editor-luu-y')}
                      <div
                        id="editor-luu-y"
                        contentEditable
                        suppressContentEditableWarning
                        onFocus={() => setActiveEditorId('editor-luu-y')}
                        onInput={(e) => {
                          const html = e.currentTarget.innerHTML;
                          const cleanText = html
                            .replace(/<b>(.*?)<\/b>/gi, '**$1**')
                            .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
                            .replace(/<i>(.*?)<\/i>/gi, '*$1*')
                            .replace(/<em>(.*?)<\/em>/gi, '*$1*')
                            .replace(/<u>(.*?)<\/u>/gi, '<u>$1</u>')
                            .replace(/<div><br><\/div>/gi, '\n')
                            .replace(/<div>(.*?)<\/div>/gi, '\n$1')
                            .replace(/<br>/gi, '\n')
                            .trim();
                          setDraftLuuYGold(cleanText);
                        }}
                        className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none text-xs font-semibold"
                        dangerouslySetInnerHTML={{
                          __html: draftLuuYGold
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                            .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
                            .split('\n').join('<br>')
                        }}
                      />
                    </div>
                  ) : (
                    <div className="p-4 bg-[#FFD94C]/10 border border-[#FFD94C]/30 rounded-2xl text-[11px] text-[#554300] font-medium animate-fade-in">
                      {renderRichText(draftLuuYGold)}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      {/* Sticky Bottom Action Bar during Edit Mode */}
      {isEditMode && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-250 py-3 px-6 shadow-xl z-50 flex items-center justify-end gap-3 animate-slide-up select-none">
          <span className="text-xs text-amber-700 font-bold mr-auto hidden sm:inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200/50 px-3 py-1.5 rounded-xl">
            ⚠️ Chế độ Admin: Nhớ nhấn "Lưu thay đổi" để hệ thống cập nhật vào Database!
          </span>
          
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow active:scale-95 duration-200 cursor-pointer"
          >
            <Undo className="w-3.5 h-3.5" />
            <span>Hoàn tác</span>
          </button>
          
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 bg-[#214C54] hover:bg-[#15333B] text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow active:scale-95 duration-200 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Lưu thay đổi</span>
          </button>
        </div>
      )}
    </div>
  );
};
