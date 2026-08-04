import React, { useState, useEffect } from 'react';
import { AnchorIcon, RouteIcon, GiftIcon } from '../../components/Icons';
import { PageHeader } from '../../components/PageHeader';
import { useDatabase } from '../../context/DatabaseContext';
import { Save, Undo, BookOpen } from 'lucide-react';
import {
  DEFAULT_VIDEO_URL,
  DEFAULT_PLATFORM_BUTTONS,
  DEFAULT_BENEFIT_CLUBS,
  DEFAULT_QUOTE,
  DEFAULT_GACH_DAU_DONG,
  DEFAULT_TRU_COT_1,
  DEFAULT_TRU_COT_2,
  DEFAULT_TRU_COT_3,
  DEFAULT_OUTRO,
  DEFAULT_SDT_NOTE,
  DEFAULT_OFFICE_HOUR_DESC,
  DEFAULT_LUU_Y_GOLD
} from '../../data/aboutViewData';
import type { 
  PlatformButton, 
  BenefitClub 
} from '../../data/aboutViewData';
import { OverviewTab } from '../../components/about/OverviewTab';
import { ScheduleTab } from '../../components/about/ScheduleTab';
import { PlatformsTab } from '../../components/about/PlatformsTab';
import { BenefitsTab } from '../../components/about/BenefitsTab';

interface AboutViewProps {
  onPageChange: (page: string) => void;
  isEditMode?: boolean;
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
    setDraftVideoUrl(getStoredItem('about_draft_video_url', DEFAULT_VIDEO_URL));

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
    setDraftPlatformButtons(getStoredObject<PlatformButton[]>('about_draft_platform_buttons', DEFAULT_PLATFORM_BUTTONS));

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
    setDraftBenefitClubs(getStoredObject<BenefitClub[]>('about_draft_benefit_clubs', DEFAULT_BENEFIT_CLUBS));

    // Quotes & Lists
    setDraftQuote(getStoredItem('about_draft_quote', DEFAULT_QUOTE));
    setDraftGachDauDong(getStoredArray('about_draft_gach_dau_dong', DEFAULT_GACH_DAU_DONG));

    // 3 Trụ Cột
    setDraftTruCot1(getStoredObject('about_draft_tru_cot_1', DEFAULT_TRU_COT_1));
    setDraftTruCot2(getStoredObject('about_draft_tru_cot_2', DEFAULT_TRU_COT_2));
    setDraftTruCot3(getStoredObject('about_draft_tru_cot_3', DEFAULT_TRU_COT_3));

    // Outro cam kết
    setDraftOutro(getStoredItem('about_draft_outro', DEFAULT_OUTRO));

    // SĐT Liên hệ & Office hour
    setDraftSdtNote(getStoredItem('about_draft_sdt_note', DEFAULT_SDT_NOTE));
    setDraftOfficeHourDesc(getStoredItem('about_draft_office_hour_desc', DEFAULT_OFFICE_HOUR_DESC));

    // Lưu ý màu vàng
    setDraftLuuYGold(getStoredItem('about_draft_luu_y_gold', DEFAULT_LUU_Y_GOLD));
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
            <OverviewTab
              isEditMode={isEditMode}
              activeEditorId={activeEditorId}
              setActiveEditorId={setActiveEditorId}
              draftOverview={draftOverview}
              setDraftOverview={setDraftOverview}
              draftGachDauDong={draftGachDauDong}
              setDraftGachDauDong={setDraftGachDauDong}
              draftTruCot1={draftTruCot1}
              setDraftTruCot1={setDraftTruCot1}
              draftTruCot2={draftTruCot2}
              setDraftTruCot2={setDraftTruCot2}
              draftTruCot3={draftTruCot3}
              setDraftTruCot3={setDraftTruCot3}
              draftOutro={draftOutro}
              setDraftOutro={setDraftOutro}
              renderRichText={renderRichText}
              renderEditorToolbar={renderEditorToolbar}
            />
          )}

          {activeTab === 'schedule' && (
            <ScheduleTab
              isEditMode={isEditMode}
              activeEditorId={activeEditorId}
              setActiveEditorId={setActiveEditorId}
              draftSchedule={draftSchedule}
              setDraftSchedule={setDraftSchedule}
              onPageChange={onPageChange}
              renderEditorToolbar={renderEditorToolbar}
            />
          )}

          {activeTab === 'platforms' && (
            <PlatformsTab
              isEditMode={isEditMode}
              activeEditorId={activeEditorId}
              setActiveEditorId={setActiveEditorId}
              draftPlatformButtons={draftPlatformButtons}
              setDraftPlatformButtons={setDraftPlatformButtons}
              draftSdtNote={draftSdtNote}
              setDraftSdtNote={setDraftSdtNote}
              draftOfficeHourDesc={draftOfficeHourDesc}
              setDraftOfficeHourDesc={setDraftOfficeHourDesc}
              onPageChange={onPageChange}
              handleAddPlatformButton={handleAddPlatformButton}
              handleDeletePlatformButton={handleDeletePlatformButton}
              renderRichText={renderRichText}
              renderEditorToolbar={renderEditorToolbar}
            />
          )}

          {activeTab === 'benefits' && (
            <BenefitsTab
              isEditMode={isEditMode}
              activeEditorId={activeEditorId}
              setActiveEditorId={setActiveEditorId}
              draftBenefitClubs={draftBenefitClubs}
              setDraftBenefitClubs={setDraftBenefitClubs}
              draftLuuYGold={draftLuuYGold}
              setDraftLuuYGold={setDraftLuuYGold}
              handleAddBenefitClub={handleAddBenefitClub}
              handleDeleteBenefitClub={handleDeleteBenefitClub}
              handleAddClubLink={handleAddClubLink}
              handleDeleteClubLink={handleDeleteClubLink}
              renderRichText={renderRichText}
              renderEditorToolbar={renderEditorToolbar}
            />
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
