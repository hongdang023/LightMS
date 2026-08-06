import React, { useState, useMemo, useEffect, useRef } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { 
  Search, 
  ArrowLeft, 
  ChevronRight, 
  Info
} from 'lucide-react';
import { categories } from '../../data/helpDeskData';
import { useCommunity } from '../../context/CommunityContext';

interface HelpDeskProps {
  onPageChange?: (page: string) => void;
}

// Simple markdown-to-HTML renderer (supports **bold**, [text](url), bullet lists, numbered lists, line breaks)
function renderMarkdown(text: string): React.ReactNode {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Parse inline formatting
    const parseInline = (str: string): React.ReactNode[] => {
      const parts: React.ReactNode[] = [];
      const regex = /\*\*(.+?)\*\*|\[(.+?)\]\((https?:\/\/[^)]+)\)/g;
      let last = 0;
      let m: RegExpExecArray | null;
      while ((m = regex.exec(str)) !== null) {
        if (m.index > last) parts.push(str.slice(last, m.index));
        if (m[1]) parts.push(<strong key={m.index}>{m[1]}</strong>);
        else if (m[2]) parts.push(<a key={m.index} href={m[3]} target="_blank" rel="noreferrer" className="text-[#214C54] font-bold hover:underline">{m[2]}</a>);
        last = m.index + m[0].length;
      }
      if (last < str.length) parts.push(str.slice(last));
      return parts;
    };
    if (line.startsWith('- ')) return <p key={i} className="flex gap-1.5"><span>•</span><span>{parseInline(line.slice(2))}</span></p>;
    const numMatch = line.match(/^(\d+)\. (.+)$/);
    if (numMatch) return <p key={i} className="flex gap-1.5"><span>{numMatch[1]}.</span><span>{parseInline(numMatch[2])}</span></p>;
    if (line.startsWith('→ ')) return <p key={i} className="text-[#214C54] font-semibold">{parseInline(line.slice(2))}</p>;
    if (line.trim() === '') return <br key={i} />;
    return <p key={i}>{parseInline(line)}</p>;
  });
}

export const HelpDesk: React.FC<HelpDeskProps> = ({ onPageChange: _onPageChange }) => {
  const { helpDeskFaqs } = useCommunity();

  // Navigation states: 'home' | 'category' | 'article'
  const [viewState, setViewState] = useState<'home' | 'category' | 'article'>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSectionId, setActiveSectionId] = useState<string>('');

  const sectionsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Use DB-backed faqs, falling back to empty while loading
  const faqs = helpDeskFaqs;


  // Global search filtering across all articles
  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return faqs.filter(art =>
      art.question.toLowerCase().includes(query) ||
      art.description.toLowerCase().includes(query) ||
      art.sections.some(sec => sec.title.toLowerCase().includes(query))
    );
  }, [faqs, searchQuery]);

  // Selected category info
  const selectedCategory = useMemo(() => {
    return categories.find(c => c.id === selectedCategoryId);
  }, [selectedCategoryId]);

  // Articles within selected category
  const categoryArticles = useMemo(() => {
    return faqs.filter(art => art.category === selectedCategoryId);
  }, [faqs, selectedCategoryId]);

  // Active article content
  const activeArticle = useMemo(() => {
    return faqs.find(art => art.id === selectedArticleId);
  }, [faqs, selectedArticleId]);

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
                        <h4 className="font-bold text-xs text-[#15333B]">{art.question}</h4>
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
            <div className="flex flex-wrap gap-2">
              <a 
                href="https://t.me/+C8OUa6qqgNsyYjQ9" 
                target="_blank" 
                rel="noreferrer"
                className="btn bg-[#FFD94C] text-[#15333B] hover:bg-[#e6c245] border-0 text-xs font-extrabold flex items-center gap-1.5 shrink-0 px-4 py-2 rounded-xl transition-all shadow-sm"
              >
                <span>🚀</span>
                <span>Liên hệ Telegram Support</span>
              </a>
              <a 
                href="https://www.facebook.com/danghong.harunoyuki" 
                target="_blank" 
                rel="noreferrer"
                className="btn bg-[#214C54] text-white hover:bg-[#15333B] border-0 text-xs font-extrabold flex items-center gap-1.5 shrink-0 px-4 py-2 rounded-xl transition-all shadow-sm"
              >
                <span>👩‍💼</span>
                <span>Liên hệ Quản lý lớp học</span>
              </a>
            </div>
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
                    <h4 className="font-bold text-xs text-[#15333B]">{art.question}</h4>
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
              <h1 className="text-lg md:text-xl font-black text-[#15333B] leading-tight">{activeArticle.question}</h1>
              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold">
                <span className="bg-[#214C54]/10 text-[#214C54] px-2 py-0.5 rounded">
                  {categories.find(c => c.id === activeArticle.category)?.label}
                </span>
                <span>•</span>
                <span>Cập nhật ngày: {activeArticle.last_updated}</span>
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
                  <div className="text-xs text-[#3E5E63] leading-relaxed font-semibold space-y-2">
                    {renderMarkdown(sec.content)}
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
