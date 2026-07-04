import React, { useState, useEffect } from 'react';
import { ChevronRight, ArrowLeft, Megaphone, Clock } from 'lucide-react';
import { useDatabase } from '../../context/DatabaseContext';

interface AnnouncementsViewProps {
  onPageChange: (page: string) => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({ onPageChange: _onPageChange }) => {
  const { announcements } = useDatabase();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Track read announcements via localStorage
  const [readIds, setReadIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lms_read_announcements');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('lms_read_announcements', JSON.stringify(readIds));
  }, [readIds]);

  const handleSelectAnnouncement = (id: string) => {
    setSelectedId(id);
    if (!readIds.includes(id)) {
      setReadIds(prev => [...prev, id]);
    }
  };

  const selectedAnnouncement = announcements.find(a => a.id === selectedId);

  // Helper to format date
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  if (selectedAnnouncement) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto animate-fade-in text-left">
        <button 
          onClick={() => setSelectedId(null)}
          className="flex items-center text-[#3E5E63] hover:text-[#214C54] transition-colors mb-6 text-sm font-bold"
        >
          <ArrowLeft size={16} className="mr-2" />
          Quay lại danh sách thông báo
        </button>
        
        <article className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
          <header className="mb-6 pb-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#E8F3F4] text-[#214C54] text-xs font-bold uppercase tracking-wider">
                Tin Tức
              </span>
              <span className="flex items-center text-gray-500 text-xs font-semibold">
                <Clock size={13} className="mr-1" />
                {formatDate(selectedAnnouncement.created_at)}
              </span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#15333B] leading-tight mb-4">
              {selectedAnnouncement.title}
            </h1>
            
          </header>
          
          <div className="text-sm md:text-base text-gray-700 leading-relaxed space-y-4">
            {selectedAnnouncement.content.split('\n').map((paragraph, idx) => (
              paragraph.trim() ? <p key={idx}>{paragraph}</p> : <div key={idx} className="h-2" />
            ))}
          </div>

          {/* Attached media files */}
          {selectedAnnouncement.media_urls && selectedAnnouncement.media_urls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 border-t border-gray-100 pt-6">
              {selectedAnnouncement.media_urls.map((url, idx) => {
                const isVideo = url.startsWith('data:video') || url.includes('.mp4') || url.includes('.mov');
                return (
                  <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                    {isVideo ? (
                      <video src={url} controls className="w-full h-full object-cover" />
                    ) : (
                      <img src={url} alt="" className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform" onClick={() => window.open(url, '_blank')} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </article>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto animate-fade-in text-left">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#15333B] tracking-tight mb-1.5 flex items-center gap-2.5">
            <Megaphone className="w-7 h-7 text-[#FFC72C] flex-shrink-0" />
            Bảng Thông Báo
          </h1>
          <p className="text-xs md:text-sm text-[#3E5E63] font-medium">Cập nhật tin tức, sự kiện và thông tin quan trọng nhất từ lớp học.</p>
        </div>
      </div>

      <div className="space-y-3.5">
        {announcements.length === 0 ? (
          <p className="text-sm text-gray-400 italic text-center py-12">Chưa có thông báo nào được đăng tải.</p>
        ) : (
          announcements.map((announcement) => {
            const isUnread = !readIds.includes(announcement.id);
            return (
              <div 
                key={announcement.id}
                onClick={() => handleSelectAnnouncement(announcement.id)}
                className="group bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:border-[#214C54]/30 transition-all cursor-pointer flex gap-4 items-center relative"
              >
                {/* Indicator dot for unread announcements */}
                {isUnread && (
                  <div className="absolute top-5 right-5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" title="Thông báo chưa đọc" />
                )}

                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${isUnread ? 'bg-[#FFD94C]/20 text-[#EAB308]' : 'bg-gray-50 text-gray-400'}`}>
                  <Megaphone size={18} className={isUnread ? 'animate-bounce' : ''} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`text-base font-bold text-[#15333B] truncate group-hover:text-[#214C54] transition-colors max-w-sm sm:max-w-md ${isUnread ? 'font-extrabold' : ''}`}>
                        {announcement.title}
                      </h3>
                      {isUnread && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-black bg-red-100 text-red-600 uppercase tracking-widest">
                          Chưa đọc
                        </span>
                      )}
                      {announcement.media_urls && announcement.media_urls.length > 0 && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-black bg-teal-50 text-teal-600 border border-teal-200/50 flex items-center gap-0.5">
                          📎 {announcement.media_urls.length} đính kèm
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 font-semibold flex items-center shrink-0">
                      <Clock size={12} className="mr-1" />
                      {formatDate(announcement.created_at)}
                    </span>
                  </div>
                  
                  <p className="text-xs md:text-sm text-gray-500 mb-2.5 line-clamp-1">{announcement.content}</p>
                </div>
                
                <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">
                  <ChevronRight size={18} className="text-[#214C54]" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
