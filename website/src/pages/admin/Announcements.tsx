import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { PageHeader } from '../../components/PageHeader';
import { Megaphone, Trash2, Edit3, Send, Clock, PlusCircle, X, Check } from 'lucide-react';

export const Announcements: React.FC = () => {
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useDatabase();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sendEmail, setSendEmail] = useState(false);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setSendEmail(false);
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleEditClick = (ann: typeof announcements[0]) => {
    setEditingId(ann.id);
    setTitle(ann.title);
    setContent(ann.content);
    setSendEmail(ann.send_email);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editingId) {
      updateAnnouncement(editingId, {
        title,
        content,
        send_email: sendEmail
      });
    } else {
      addAnnouncement(title, content, sendEmail);
    }
    resetForm();
  };

  // Helper to format date
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('vi-VN', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in select-none">
      <PageHeader
        title="Quản lý Thông báo"
        description="Đăng tin tức mới cho khóa học và gửi email thông báo hàng loạt cho học viên."
        helpTitle="Thông báo"
        helpSummary="Soạn thảo thông báo và gửi email tự động."
        helpPurpose="Giúp kết nối thông tin giữa Ban điều hành và toàn thể thủy thủ đoàn một cách tức thời."
        action={
          !isFormOpen && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="btn bg-[#214C54] hover:bg-[#15333B] text-white shadow-sm text-xs font-extrabold flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all transform hover:-translate-y-0.5 animate-pulse"
            >
              <PlusCircle size={16} />
              <span>Viết Thông Báo</span>
            </button>
          )
        }
      />

      {isFormOpen && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 animate-fade-in">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-5">
            <h3 className="font-extrabold text-base text-[#15333B] flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-[#214C54]" />
              {editingId ? 'Chỉnh sửa thông báo' : 'Tạo thông báo mới'}
            </h3>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Tiêu đề thông báo</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề..."
                required
                className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#214C54]/20 focus:border-[#214C54] transition-all text-[#15333B]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Nội dung thông báo (Markdown / Text)</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Nhập nội dung chi tiết..."
                required
                rows={6}
                className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#214C54]/20 focus:border-[#214C54] transition-all text-[#15333B] resize-y leading-relaxed"
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-teal-50/50 border border-[#214C54]/10 rounded-xl">
              <input
                type="checkbox"
                id="sendEmail"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="w-4 h-4 rounded text-[#214C54] focus:ring-[#214C54] cursor-pointer"
              />
              <label htmlFor="sendEmail" className="text-xs font-semibold text-[#15333B] cursor-pointer select-none">
                Gửi email thông báo hàng loạt cho toàn bộ học viên khi đăng tin
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-xs font-bold text-gray-500 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-[#214C54] hover:bg-[#15333B] rounded-lg shadow-sm flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Send size={14} />
                <span>{editingId ? 'Cập Nhật & Lưu' : 'Đăng Thông Báo'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-400 italic">
            Chưa có thông báo nào được đăng tải. Hãy nhấp Viết Thông Báo để bắt đầu!
          </div>
        ) : (
          announcements.map((ann) => (
            <div 
              key={ann.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex gap-6 items-start hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-[#214C54] flex-shrink-0">
                <Megaphone size={20} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-[#15333B] truncate">{ann.title}</h3>
                    {ann.send_email && (
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-green-50 text-green-700 border border-green-200/50 flex items-center gap-1">
                        <Check size={10} strokeWidth={3} />
                        Email Broadcast
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEditClick(ann)}
                      className="p-1.5 text-gray-400 hover:text-[#214C54] hover:bg-gray-50 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Bạn có chắc chắn muốn xóa thông báo này?')) {
                          deleteAnnouncement(ann.id);
                        }
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed mb-4 whitespace-pre-wrap">{ann.content}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 font-semibold border-t border-gray-50 pt-3">
                  <div className="flex items-center">
                    <Clock size={13} className="mr-1.5 text-gray-300" />
                    Đăng lúc: <span className="text-gray-600 ml-1">{formatDate(ann.created_at)}</span>
                  </div>
                  {ann.sent_email_at && (
                    <div className="text-green-600">
                      📧 Đã gửi mail vào: {formatDate(ann.sent_email_at)}
                    </div>
                  )}
                  <div className="ml-auto">
                    Tác giả: <span className="text-gray-700">{ann.author}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
