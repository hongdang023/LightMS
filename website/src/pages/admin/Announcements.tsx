import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { PageHeader } from '../../components/PageHeader';
import { Megaphone, Trash2, Edit3, Send, Clock, PlusCircle, X, Check, Mail } from 'lucide-react';

export const Announcements: React.FC = () => {
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement, users } = useDatabase();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitWithEmail, setSubmitWithEmail] = useState(false);
  const [selectedMediaFiles, setSelectedMediaFiles] = useState<string[]>([]);

  // Email Preview Modal states
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setSubmitWithEmail(false);
    setSelectedMediaFiles([]);
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleEditClick = (ann: typeof announcements[0]) => {
    setEditingId(ann.id);
    setTitle(ann.title);
    setContent(ann.content);
    setSubmitWithEmail(ann.send_email);
    setSelectedMediaFiles(ann.media_urls || []);
    setIsFormOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setSelectedMediaFiles(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveMedia = (idxToRemove: number) => {
    setSelectedMediaFiles(prev => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const getHtmlEmail = (subject: string, bodyText: string) => {
    const formattedBody = bodyText
      .split('\n\n')
      .map(p => `<p style="margin: 0 0 12px; line-height: 1.6; color: #3E5E63;">${p.replace(/\n/g, '<br />')}</p>`)
      .join('');

    return `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FDF5DA; padding: 25px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1.5px solid #ffd94c;">
  <div style="background-color: #15333B; padding: 15px; border-radius: 12px 12px 0 0; text-align: center; border-bottom: 4px solid #ffd94c;">
    <h1 style="color: #ffd94c; margin: 0; font-size: 18px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase;">
      🦜 VẸT LẮM MỒM - THE1IGHT 🦜
    </h1>
  </div>
  <div style="background-color: #ffffff; padding: 25px; border-radius: 0 0 12px 12px; border-top: none; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
    <h2 style="color: #214C54; margin-top: 0; font-size: 15px; font-weight: 800; border-bottom: 2px solid #F0F0F0; padding-bottom: 8px;">
      ${subject}
    </h2>
    ${formattedBody}
    <div style="margin-top: 25px; padding-top: 15px; border-top: 2px solid #F0F0F0; text-align: center;">
      <a href="${window.location.origin}" style="display: inline-block; background-color: #214C54; color: #ffffff; padding: 8px 18px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 11px; box-shadow: 0 2px 4px rgba(33,76,84,0.2);">
        XEM THÔNG BÁO TRÊN LIGHTMS 🚀
      </a>
    </div>
  </div>
  <div style="text-align: center; margin-top: 12px; font-size: 9px; color: #3E5E63; font-weight: 600;">
    Bản tin được gửi từ hạm đội vận hành LightMS. Chúc các thủy thủ thuận buồm xuôi gió!
  </div>
</div>
    `.trim();
  };

  const handleCopyEmailFormat = async () => {
    const html = getHtmlEmail(emailSubject, emailBody);
    try {
      const blobHtml = new Blob([html], { type: 'text/html' });
      const blobText = new Blob([emailBody], { type: 'text/plain' });
      const item = new ClipboardItem({
        'text/html': blobHtml,
        'text/plain': blobText
      });
      await navigator.clipboard.write([item]);
      setCopySuccess(true);
    } catch (err) {
      navigator.clipboard.writeText(html);
      setCopySuccess(true);
    }
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleOpenEmailModal = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Vui lòng điền đầy đủ tiêu đề và nội dung thông báo!');
      return;
    }
    setEmailSubject(`[The1ight] [Thông Báo] ${title}`);
    setEmailBody(content + `\n\nHãy truy cập vào hệ thống LightMS để theo dõi chi tiết nhé!\n\nChúc các thủy thủ thuận buồm xuôi gió! ⛵⚓`);
    setIsEmailModalOpen(true);
  };

  const handleSendBulkEmail = () => {
    const studentProfiles = users.filter((p: any) => p.role === 'student');
    const emails = studentProfiles.map((s: any) => s.gmail).filter(Boolean).join(',');
    if (!emails) {
      alert('Không có học viên nào nhận email!');
      return;
    }
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&bcc=${emails}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(gmailUrl, '_blank');

    if (editingId) {
      updateAnnouncement(editingId, {
        title,
        content,
        send_email: true,
        media_urls: selectedMediaFiles
      });
    } else {
      addAnnouncement(title, content, true, selectedMediaFiles);
    }

    setToastMessage(`Đã mở Gmail gửi thông báo thành công!`);
    setTimeout(() => setToastMessage(null), 3000);
    setIsEmailModalOpen(false);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editingId) {
      updateAnnouncement(editingId, {
        title,
        content,
        send_email: submitWithEmail,
        media_urls: selectedMediaFiles
      });
    } else {
      addAnnouncement(title, content, submitWithEmail, selectedMediaFiles);
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

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Đính kèm ảnh / video</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-3 pb-3">
                    <span className="text-xl">📁</span>
                    <p className="text-xs font-bold text-gray-500 mt-1">Chọn ảnh hoặc video từ thiết bị</p>
                    <p className="text-[9px] text-gray-400">Hỗ trợ tải lên nhiều file cùng lúc</p>
                  </div>
                  <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
                </label>
              </div>

              {/* Selected files preview */}
              {selectedMediaFiles.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {selectedMediaFiles.map((dataUrl, idx) => {
                    const isVideo = dataUrl.startsWith('data:video') || dataUrl.includes('.mp4') || dataUrl.includes('.mov');
                    return (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                        {isVideo ? (
                          <video src={dataUrl} className="w-full h-full object-cover" />
                        ) : (
                          <img src={dataUrl} alt="" className="w-full h-full object-cover" />
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveMedia(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4.5 h-4.5 flex items-center justify-center text-[9px] font-bold hover:bg-red-600 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
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
                onClick={() => setSubmitWithEmail(false)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#214C54] hover:bg-[#15333B] rounded-lg shadow-sm flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer animate-none"
              >
                <Send size={14} />
                <span>{editingId ? 'Cập Nhật & Lưu' : 'Đăng Thông Báo'}</span>
              </button>

              <button
                type="button"
                onClick={handleOpenEmailModal}
                className="px-4 py-2 text-xs font-bold text-white bg-[#0f766e] hover:bg-[#115e59] rounded-lg shadow-sm flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Mail size={14} />
                <span>{editingId ? 'Cập Nhật & Gửi Email Hàng Loạt' : 'Đăng & Gửi Email Hàng Loạt'}</span>
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

                {/* Attached media files */}
                {ann.media_urls && ann.media_urls.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-3 mb-4 max-w-lg">
                    {ann.media_urls.map((url, idx) => {
                      const isVideo = url.startsWith('data:video') || url.includes('.mp4') || url.includes('.mov');
                      return (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                          {isVideo ? (
                            <video src={url} controls className="w-full h-full object-cover" />
                          ) : (
                            <img src={url} alt="" className="w-full h-full object-cover cursor-pointer" onClick={() => window.open(url, '_blank')} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

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

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#15333B] text-white border border-[#ffd94c] px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce font-extrabold text-xs">
          <span>🦜</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Email Preview & Config Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 bg-[#15333B]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-gray-100 animate-scale-up">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xl">✉️</span>
                <div>
                  <h3 className="font-extrabold text-sm text-[#15333B] uppercase tracking-wider">Cấu Hình Email Thông Báo</h3>
                  <p className="text-[10px] text-gray-500 font-semibold">Soạn thảo nội dung và xem trước hiển thị theo Brand Guidelines.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsEmailModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0 text-left">
              
              {/* Left Column: Form Settings */}
              <div className="w-full md:w-1/2 p-6 flex flex-col gap-4 overflow-y-auto border-r border-gray-100">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block text-left">Tiêu đề Email (Subject):</label>
                  <input 
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#214C54]/20 focus:border-[#214C54] transition-all text-[#15333B]"
                    placeholder="Nhập tiêu đề email..."
                  />
                </div>

                <div className="flex-1 flex flex-col space-y-1 min-h-[200px]">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block text-left">Nội dung Email (Body):</label>
                  <textarea 
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full flex-1 bg-gray-50 border border-gray-250 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#214C54]/20 focus:border-[#214C54] transition-all text-[#15333B] resize-none leading-relaxed"
                    placeholder="Nhập nội dung email..."
                  />
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-between gap-3 shrink-0">
                  <button 
                    type="button"
                    onClick={handleCopyEmailFormat}
                    className="btn border border-teal-600 text-[#214C54] hover:bg-teal-50/50 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer bg-white"
                  >
                    {copySuccess ? 'Đã sao chép! ✓' : 'Sao chép định dạng 📋'}
                  </button>
                  
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={() => setIsEmailModalOpen(false)}
                      className="btn border border-gray-300 text-gray-700 text-xs font-bold px-4 py-2 hover:bg-gray-50 rounded-xl cursor-pointer bg-white"
                    >
                      Hủy
                    </button>
                    <button 
                      type="button"
                      onClick={handleSendBulkEmail}
                      className="btn bg-[#214C54] text-white text-xs font-extrabold px-4 py-2 flex items-center gap-1.5 rounded-xl shadow-md cursor-pointer border-0"
                    >
                      Gửi qua Gmail 🚀
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Brand Guidelines Preview */}
              <div className="hidden md:flex flex-1 flex-col bg-gray-50 p-6 overflow-y-auto">
                <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 text-left">Xem trước Email (Brand Guidelines)</div>
                <div className="bg-[#FDF5DA] p-6 rounded-2xl border border-[#ffd94c] flex-1 flex flex-col justify-start min-h-[300px]">
                  <div className="bg-[#15333B] p-4 rounded-t-xl text-center border-b-4 border-[#ffd94c]">
                    <span className="text-[#ffd94c] font-black text-xs tracking-wider block">
                      🦜 VẸT LẮM MỒM - THE1IGHT 🦜
                    </span>
                  </div>
                  <div className="bg-white p-5 rounded-b-xl flex-1 shadow-sm text-left">
                    <h5 className="text-[#214C54] font-black text-xs border-b border-gray-150 pb-2 mb-3">
                      {emailSubject || '(Không có tiêu đề)'}
                    </h5>
                    <div className="text-[11px] text-gray-700 font-medium leading-relaxed space-y-3 whitespace-pre-line">
                      {emailBody || '(Không có nội dung)'}
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                      <span className="inline-block bg-[#214C54] text-white px-4 py-2 rounded-lg font-bold text-[10px] shadow-sm select-none">
                        XEM THÔNG BÁO TRÊN LIGHTMS 🚀
                      </span>
                    </div>
                  </div>
                  <div className="text-center mt-3 text-[9px] text-[#3E5E63] font-semibold">
                    Bản tin được gửi từ hạm đội vận hành LightMS. Chúc các thủy thủ thuận buồm xuôi gió!
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
};
