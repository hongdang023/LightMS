import React, { useState, useEffect } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { PageHeader } from '../../components/PageHeader';
import { Settings as SettingsIcon, Calendar, Mail, Play, CheckCircle2, AlertCircle } from 'lucide-react';

export const Settings: React.FC = () => {
  const { 
    batches, 
    updateBatch, 
    onboardingUnlockSchedules, 
    updateOnboardingUnlockSchedule,
    onboardingDays
  } = useDatabase();

  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [previewEmailDay, setPreviewEmailDay] = useState<number | null>(null);

  const getEmailPreviewData = (dayNum: number) => {
    const dayData = onboardingDays.find(d => d.day === dayNum);
    if (!dayData) return { subject: '', html: '' };

    const subject = dayData.email_subject || `[The1ight] [Onboarding Week] Thử thách Ngày ${dayNum}: ${dayData.title}`;
    
    const defaultBody = `Kẹt kẹt... Alo alo! 🦜\n\nChào mừng bạn tới ngày học tiếp theo của Onboarding Week!\n\nHôm nay chúng ta sẽ bắt đầu Thử thách Ngày ${dayNum}: ${dayData.title}\n\n🎯 MỤC TIÊU:\n${dayData.objective}\n\n📝 NHIỆM VỤ:\n${dayData.checklist}\n\n✨ ĐIỀU RÚT RA (TAKEAWAY):\n${dayData.takeaway}\n\nHãy truy cập vào hệ thống LightMS để theo dõi chi tiết và cập nhật bài tập nhé!\n\nChúc các thủy thủ thuận buồm xuôi gió! ⛵⚓`;
    const bodyText = dayData.email_body || defaultBody;

    const formattedBody = bodyText
      .split('\n\n')
      .map(p => `<p style="margin: 0 0 12px; line-height: 1.6; color: #3E5E63;">${p.replace(/\n/g, '<br />')}</p>`)
      .join('');

    const htmlContent = `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FDF5DA; padding: 20px; border-radius: 12px; max-width: 100%; border: 1.5px solid #ffd94c;">
  <div style="background-color: #15333B; padding: 12px; border-radius: 8px 8px 0 0; text-align: center; border-bottom: 4px solid #ffd94c;">
    <h1 style="color: #ffd94c; margin: 0; font-size: 14px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase;">
      🦜 VẸT LẮM MỒM - THE1IGHT 🦜
    </h1>
  </div>
  <div style="background-color: #ffffff; padding: 20px; border-radius: 0 0 8px 8px; border-top: none;">
    <h2 style="color: #214C54; margin-top: 0; font-size: 13px; font-weight: 800; border-bottom: 2px solid #F0F0F0; padding-bottom: 8px;">
      ${subject}
    </h2>
    ${formattedBody}
  </div>
</div>
    `.trim();

    return { subject, html: htmlContent };
  };

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
        subtitle="Quản lý ngày khai giảng lớp học và cấu hình các tác vụ gửi email tự động"
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
                  <span className="text-xs font-bold text-[#15333B] block">1. Lịch mở khóa hàng ngày (Onboarding)</span>
                  <span className="text-[10px] text-gray-500">Mở khóa bài học & gửi mail tự động mỗi 5 phút</span>
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
                  <span className="text-[10px] text-gray-500">Chạy lúc 20:00 PM tối Chủ nhật (Đạt 100% Onboarding & Live Class)</span>
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

      {/* Onboarding schedules detail grid */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-gray-150 pb-3">
          <Mail className="w-5 h-5 text-[#214C54]" />
          <h3 className="font-bold text-[#15333B] text-base">Chi tiết lịch mở khóa & Trạng thái Email gửi đi</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-[#3E5E63] font-bold">
                <th className="py-2.5 px-3">Ngày</th>
                <th className="py-2.5 px-3">Tên thử thách</th>
                <th className="py-2.5 px-3">Giờ mở khóa dự kiến</th>
                <th className="py-2.5 px-3">Trạng thái gửi email</th>
                <th className="py-2.5 px-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {onboardingUnlockSchedules.map((schedule) => {
                const day = onboardingDays.find(d => d.day === schedule.day);
                // Convert ISO string to YYYY-MM-DDTHH:MM for datetime-local input safely
                const dateVal = schedule.scheduled_at 
                  ? new Date(new Date(schedule.scheduled_at).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) 
                  : '';
                
                return (
                  <tr key={schedule.day} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-3 px-3 font-bold text-[#214C54]">Ngày {schedule.day}</td>
                    <td className="py-3 px-3 font-semibold text-gray-700">{day ? day.title : 'Đang tải...'}</td>
                    <td className="py-3 px-3">
                      <input 
                        type="datetime-local"
                        value={dateVal}
                        onChange={async (e) => {
                          const newDate = new Date(e.target.value).toISOString();
                          await updateOnboardingUnlockSchedule(schedule.day, newDate);
                          showToast(`Đã đổi lịch mở khóa Ngày ${schedule.day}! ⏰`);
                        }}
                        className="border border-gray-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-[#214C54] font-bold text-slate-700 bg-white"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold flex items-center gap-1 w-max ${
                        schedule.unlock_email_sent 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {schedule.unlock_email_sent ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Đã gửi email
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3" /> Chờ gửi
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setPreviewEmailDay(schedule.day)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-slate-700 font-extrabold text-[10px] rounded-lg transition-all cursor-pointer border-0"
                      >
                        Xem thư 👁️
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Email Modal */}
      {previewEmailDay !== null && (() => {
        const { subject, html } = getEmailPreviewData(previewEmailDay);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-3xl p-6 max-w-xl w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl relative select-text">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-extrabold text-[#15333B] text-base">Xem trước Email: Ngày {previewEmailDay}</h3>
                <button 
                  onClick={() => setPreviewEmailDay(null)}
                  className="text-gray-400 hover:text-gray-700 text-lg font-bold border-0 bg-transparent cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-1.5 text-xs">
                <span className="font-black text-gray-400 uppercase block">Tiêu đề email:</span>
                <span className="font-bold text-slate-800 bg-slate-50 p-2.5 rounded-xl block border border-slate-100">{subject}</span>
              </div>
              <div className="space-y-1.5">
                <span className="font-black text-gray-400 uppercase text-xs block">Nội dung thư gửi học viên:</span>
                <div 
                  className="border rounded-2xl p-4 bg-slate-50 overflow-x-auto"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>
              <div className="flex justify-end pt-2">
                <button 
                  onClick={() => setPreviewEmailDay(null)}
                  className="px-5 py-2.5 bg-[#214C54] hover:bg-[#15333B] text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer border-0"
                >
                  Đóng lại
                </button>
              </div>
            </div>
          </div>
        );
      })()}

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
