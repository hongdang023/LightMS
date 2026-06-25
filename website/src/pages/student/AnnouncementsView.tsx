import React, { useState } from 'react';
import { ChevronRight, ArrowLeft, Megaphone, Clock, User } from 'lucide-react';
import { useDatabase } from '../../context/DatabaseContext';

interface AnnouncementsViewProps {
  onPageChange: (page: string) => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({ onPageChange: _onPageChange }) => {
  const { announcements } = useDatabase();
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
      <div className="p-8 max-w-4xl mx-auto animate-fade-in">
        <button 
          onClick={() => setSelectedId(null)}
          className="flex items-center text-[#3E5E63] hover:text-[#214C54] transition-colors mb-6 font-medium"
        >
          <ArrowLeft size={18} className="mr-2" />
          Quay lại danh sách thông báo
        </button>
        
        <article className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <header className="mb-8 pb-8 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#E8F3F4] text-[#214C54] text-xs font-semibold uppercase tracking-wider">
                Tin Tức
              </span>
              <span className="flex items-center text-gray-500 text-sm">
                <Clock size={14} className="mr-1.5" />
                {formatDate(selectedAnnouncement.created_at)}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-[#15333B] leading-tight mb-4">
              {selectedAnnouncement.title}
            </h1>
            
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#214C54] to-[#3E5E63] flex items-center justify-center text-white font-bold mr-3">
                {selectedAnnouncement.author.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{selectedAnnouncement.author}</p>
                <p className="text-xs">Đăng tải thông báo</p>
              </div>
            </div>
          </header>
          
          <div className="prose prose-teal max-w-none">
            {selectedAnnouncement.content.split('\n').map((paragraph, idx) => (
              paragraph.trim() ? <p key={idx} className="mb-4 text-gray-700 leading-relaxed">{paragraph}</p> : <br key={idx} />
            ))}
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#15333B] tracking-tight mb-2 flex items-center gap-3">
            <Megaphone className="w-8 h-8 text-[#FFC72C]" />
            Bảng Thông Báo
          </h1>
          <p className="text-[#3E5E63]">Cập nhật tin tức, sự kiện và thông tin quan trọng nhất từ lớp học.</p>
        </div>
      </div>

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <p className="text-sm text-gray-400 italic text-center py-12">Chưa có thông báo nào được đăng tải.</p>
        ) : (
          announcements.map((announcement) => (
            <div 
              key={announcement.id}
              onClick={() => setSelectedId(announcement.id)}
              className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:border-[#214C54]/30 transition-all cursor-pointer flex gap-6 items-start"
            >
              <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center ${announcement.isNew ? 'bg-[#FFD94C]/20 text-[#EAB308]' : 'bg-gray-100 text-gray-400'}`}>
                <Megaphone size={20} className={announcement.isNew ? 'animate-pulse' : ''} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-[#15333B] truncate group-hover:text-[#214C54] transition-colors">
                      {announcement.title}
                    </h3>
                    {announcement.isNew && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600 uppercase tracking-wider">
                        Mới
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap ml-4 flex items-center">
                    <Clock size={14} className="mr-1.5" />
                    {formatDate(announcement.created_at)}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-3 truncate">{announcement.content}</p>
                
                <div className="flex items-center text-xs font-medium text-gray-500">
                  <User size={14} className="mr-1" />
                  Đăng bởi: <span className="text-gray-900 ml-1">{announcement.author}</span>
                </div>
              </div>
              
              <div className="flex-shrink-0 h-full flex items-center self-stretch opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">
                <ChevronRight className="text-[#214C54]" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
