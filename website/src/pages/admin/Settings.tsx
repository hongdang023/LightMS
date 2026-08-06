import React, { useState, useEffect } from 'react';
import { useCourse } from '../../context/CourseContext';
import { PageHeader } from '../../components/PageHeader';
import { Settings as SettingsIcon, Calendar, Mail, Play, AlertCircle } from 'lucide-react';

export const Settings: React.FC = () => {
  const { 
    batches, 
    updateBatch
  } = useCourse();

  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  // Initialize selected batch
  useEffect(() => {
    if (batches && batches.length > 0) {
      const activeBatch = batches[0];
      setSelectedBatchId(activeBatch.id);
      setStartDate(activeBatch.start_date ? activeBatch.start_date.split('T')[0] : '');
      setEndDate(activeBatch.end_date ? activeBatch.end_date.split('T')[0] : '');
    }
  }, [batches]);

  const handleBatchSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedBatchId(id);
    const batch = batches.find(b => b.id === id);
    if (batch) {
      setStartDate(batch.start_date ? batch.start_date.split('T')[0] : '');
      setEndDate(batch.end_date ? batch.end_date.split('T')[0] : '');
    }
  };

  const handleSaveBatchDates = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatchId) return;
    
    await updateBatch(selectedBatchId, {
      start_date: startDate,
      end_date: endDate
    });

    showToast("Đã cập nhật ngày bắt đầu và kết thúc của khóa học thành công! 🎉");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleTriggerFunction = async (type: 'onboarding' | 'reminder' | 'reward') => {
    setLoading(type);
    try {
      let endpoint = '';
      if (type === 'onboarding') {
        endpoint = 'https://wfruhgqmrksywrlcqjbr.supabase.co/functions/v1/send-onboarding-emails';
      } else {
        endpoint = `https://wfruhgqmrksywrlcqjbr.supabase.co/functions/v1/auto-remind-rewards?type=${type}`;
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sb_publishable_SD38fPdlB-ufk1CT99WPFA_usFrIVqP'
        }
      });

      const data = await res.json();
      if (res.ok) {
        if (data.processedCount > 0 || (data.results && data.results.length > 0)) {
          showToast(`Đã trigger thành công! Đã gửi mail cho học viên. Chi tiết trong inbox của bạn.`);
        } else {
          showToast(`Trigger thành công: ${data.message || 'Không có mail nào cần gửi lúc này.'}`);
        }
      } else {
        showToast(`Lỗi trigger: ${data.error || 'Yêu cầu thất bại'}`);
      }
    } catch (err) {
      showToast(`Lỗi kết nối tới Edge Function: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6 select-text text-slate-800">
      <PageHeader 
        title="Cài Đặt Hệ Thống" 
        description="Quản lý ngày khai giảng lớp học và cấu hình các tác vụ gửi email tự động"
        icon={<SettingsIcon className="w-6 h-6 text-[#214C54]" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Course Dates Config */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-150 pb-3">
            <Calendar className="w-5 h-5 text-[#214C54]" />
            <h3 className="font-bold text-[#15333B] text-base">Cấu hình Lịch Khai giảng Lớp học</h3>
          </div>

          <form onSubmit={handleSaveBatchDates} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">Chọn Lớp học / Batch</label>
              <select 
                value={selectedBatchId}
                onChange={handleBatchSelectChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs bg-white focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54]/20 font-bold"
              >
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">Ngày khai giảng (Start Date)</label>
                <input 
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs bg-white focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54]/20 font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">Ngày kết thúc (End Date)</label>
                <input 
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs bg-white focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54]/20 font-bold"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-[#214C54] hover:bg-[#15333B] text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer border-0"
            >
              Lưu thiết lập Lớp học 💾
            </button>
          </form>
        </div>

        {/* Right Column: Automated Email Trigger & Test Panel */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-150 pb-3">
            <Mail className="w-5 h-5 text-[#214C54]" />
            <h3 className="font-bold text-[#15333B] text-base">Hệ thống Email Tự động (Edge Functions)</h3>
          </div>

          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-amber-800 text-xs font-semibold leading-relaxed">
              <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
              <div>
                Vì tài khoản của bạn đang dùng gói Resend miễn phí, toàn bộ email test gửi cho học viên sẽ tự động chuyển tiếp về hòm thư <strong>dangtuyethong2324@gmail.com</strong> của bạn (kèm thẻ [TEST] trong tiêu đề) để tránh lỗi API.
              </div>
            </div>

            <div className="space-y-3.5 pt-2">
              {/* Task 1: Onboarding Email trigger */}
              <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <span className="text-xs font-bold text-[#15333B] block">1. Gửi email Onboarding thủ công</span>
                  <span className="text-[10px] text-gray-500">Kích hoạt Edge Function gửi email onboarding cho học viên</span>
                </div>
                <button 
                  onClick={() => handleTriggerFunction('onboarding')}
                  disabled={loading !== null}
                  className="px-4 py-2 bg-[#214C54] hover:bg-[#15333B] disabled:bg-gray-200 disabled:text-gray-400 text-white font-extrabold text-[10px] rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer border-0"
                >
                  <Play className="w-3.5 h-3.5" /> {loading === 'onboarding' ? 'Đang chạy...' : 'Kích hoạt ngay'}
                </button>
              </div>

              {/* Task 2: Reminder Email trigger */}
              <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <span className="text-xs font-bold text-[#15333B] block">2. Nhắc nhở tự động học chậm (Reminder)</span>
                  <span className="text-[10px] text-gray-500">Chạy lúc 8:00 AM sáng thứ Hai hàng tuần (Live Class &lt; 50%)</span>
                </div>
                <button 
                  onClick={() => handleTriggerFunction('reminder')}
                  disabled={loading !== null}
                  className="px-4 py-2 bg-[#214C54] hover:bg-[#15333B] disabled:bg-gray-200 disabled:text-gray-400 text-white font-extrabold text-[10px] rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer border-0"
                >
                  <Play className="w-3.5 h-3.5" /> {loading === 'reminder' ? 'Đang chạy...' : 'Kích hoạt ngay'}
                </button>
              </div>

              {/* Task 3: Reward Email trigger */}
              <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <span className="text-xs font-bold text-[#15333B] block">3. Tuyên dương tự động xuất sắc (Reward)</span>
                  <span className="text-[10px] text-gray-500">Chạy lúc 20:00 PM tối Chủ nhật (Đạt 100% Onboarding &amp; Live Class)</span>
                </div>
                <button 
                  onClick={() => handleTriggerFunction('reward')}
                  disabled={loading !== null}
                  className="px-4 py-2 bg-[#214C54] hover:bg-[#15333B] disabled:bg-gray-200 disabled:text-gray-400 text-white font-extrabold text-[10px] rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer border-0"
                >
                  <Play className="w-3.5 h-3.5" /> {loading === 'reward' ? 'Đang chạy...' : 'Kích hoạt ngay'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#15333B] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center justify-between gap-4 border border-teal-800/30 animate-slide-up select-text">
          <span className="text-xs font-bold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-white ml-2 cursor-pointer border-0 bg-transparent">✕</button>
        </div>
      )}
    </div>
  );
};
