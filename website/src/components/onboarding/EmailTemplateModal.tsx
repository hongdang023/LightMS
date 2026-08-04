import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import type { OnboardingDay } from '../../context/DatabaseContext';
import { 
  getDefaultEmailSubject,
  getDefaultEmailBody,
  getHtmlEmail
} from '../../data/onboardingVisuals';

interface EmailTemplateModalProps {
  dayData: OnboardingDay;
  profiles: any[];
  onClose: () => void;
  onSave: (subject: string, body: string) => Promise<void>;
  onToast: (message: string) => void;
}

export const EmailTemplateModal: React.FC<EmailTemplateModalProps> = ({
  dayData,
  profiles,
  onClose,
  onSave,
  onToast,
}) => {
  const [emailSubject, setEmailSubject] = useState(
    dayData.email_subject || getDefaultEmailSubject(dayData.day, dayData.title)
  );
  const [emailBody, setEmailBody] = useState(
    dayData.email_body || getDefaultEmailBody(dayData)
  );
  const [copySuccess, setCopySuccess] = useState(false);

  const getBulkEmails = () => {
    if (!profiles) return '';
    const students = profiles.filter((p: any) => p.role === 'student');
    return students.map((s: any) => s.gmail).filter(Boolean).join(',');
  };

  const handleSendBulkEmail = () => {
    const emails = getBulkEmails();
    if (!emails) {
      alert('Không có học viên nào nhận email!');
      return;
    }
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&bcc=${emails}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(gmailUrl, '_blank');
    onToast(`Đã mở Gmail gửi email Ngày ${dayData.day} thành công!`);
    onClose();
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

  const handleSave = async () => {
    await onSave(emailSubject, emailBody);
    onToast(`Đã lưu mẫu email Ngày ${dayData.day} thành công!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in text-slate-800">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col border border-gray-100 overflow-hidden animate-scale-up max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-850">
            <Mail className="w-5 h-5" />
            <h4 className="text-sm font-black text-[#15333B] uppercase tracking-wider font-extrabold">Cấu hình Email Mở khóa: Ngày {dayData.day}</h4>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#15333B]/5 hover:bg-[#15333B]/10 flex items-center justify-center text-[#15333B] transition-colors cursor-pointer border-0"
          >
            ✕
          </button>
        </div>

        {/* Side-by-Side Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          {/* Left Column: Form Editor */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto border-r border-gray-100 flex flex-col">
            {/* Subject Input */}
            <div className="space-y-1.5 shrink-0">
              <label className="text-[11px] font-bold text-[#15333B] block">Tiêu đề Email (Subject):</label>
              <input 
                type="text"
                required
                placeholder="Nhập tiêu đề email..."
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54]/20 transition-all font-bold text-[#15333B]"
              />
            </div>

            {/* Body Textarea */}
            <div className="space-y-1.5 flex-1 flex flex-col min-h-0">
              <label className="text-[11px] font-bold text-[#15333B] block shrink-0">Nội dung Email (Body):</label>
              <textarea 
                required
                placeholder="Nhập nội dung email..."
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs leading-relaxed focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54]/20 resize-none transition-all font-medium text-gray-700 flex-1 min-h-[150px]"
              />
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-gray-100 flex justify-between gap-3 shrink-0">
              <button 
                type="button"
                onClick={handleCopyEmailFormat}
                className="btn border border-teal-600 text-teal-850 hover:bg-teal-50/50 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer bg-white"
              >
                {copySuccess ? 'Đã sao chép! ✓' : 'Sao chép định dạng 📋'}
              </button>
              
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={onClose}
                  className="btn border border-gray-300 text-gray-700 text-xs font-bold px-4 py-2 hover:bg-gray-50 rounded-xl cursor-pointer bg-white"
                >
                  Hủy
                </button>
                <button 
                  type="button"
                  onClick={handleSave}
                  className="btn border border-emerald-600 bg-emerald-50 text-emerald-800 text-xs font-bold px-4 py-2 hover:bg-emerald-100 rounded-xl cursor-pointer"
                >
                  Lưu mẫu
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
            <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Xem trước Email (Brand Guidelines)</div>
            <div className="bg-[#FDF5DA] p-6 rounded-2xl border border-[#ffd94c] flex-1 flex flex-col justify-start min-h-[300px]">
              <div className="bg-[#15333B] p-4 rounded-t-xl text-center border-b-4 border-[#ffd94c]">
                <span className="text-[#ffd94c] font-black text-xs tracking-wider block">
                  🦜 VẸT LẮM MỒM - THE1IGHT 🦜
                </span>
              </div>
              <div className="bg-white p-5 rounded-b-xl flex-1 shadow-sm">
                <h5 className="text-[#214C54] font-black text-xs border-b border-gray-150 pb-2 mb-3">
                  {emailSubject || '(Không có tiêu đề)'}
                </h5>
                <div className="text-[11px] text-gray-700 font-medium leading-relaxed space-y-3 whitespace-pre-line">
                  {emailBody || '(Không có nội dung)'}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                  <span className="inline-block bg-[#214C54] text-white text-[10px] font-black px-4 py-2 rounded-lg cursor-pointer">
                    VÀO HỆ THỐNG LIGHTMS 🚀
                  </span>
                </div>
              </div>
              <div className="text-center mt-3 text-[9px] text-[#3E5E63] font-bold">
                Bản tin được gửi từ hạm đội vận hành LightMS.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
