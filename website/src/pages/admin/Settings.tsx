import React, { useState, useEffect } from 'react';
import { useCourse } from '../../context/CourseContext';
import { PageHeader } from '../../components/PageHeader';
import { Settings as SettingsIcon, Calendar, KeyRound, ShieldCheck, Check, CheckCircle2, X } from 'lucide-react';

export const Settings: React.FC = () => {
  const { 
    courses,
    batches, 
    activeBatch,
    activeCourse,
    updateBatch
  } = useCourse();

  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [courseName, setCourseName] = useState<string>('');
  const [batchCode, setBatchCode] = useState<string>('');
  const [batchName, setBatchName] = useState<string>('');
  const [accessCode, setAccessCode] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize selected batch
  useEffect(() => {
    if (batches && batches.length > 0) {
      const targetBatch = (activeBatch && batches.find(b => b.id === activeBatch.id)) || batches[0];
      setSelectedBatchId(targetBatch.id);
      loadBatchData(targetBatch);
    }
  }, [batches, activeBatch?.id]);

  const loadBatchData = (batch: any) => {
    const parentCourse = courses.find(c => c.id === batch.course_id) || activeCourse;
    const initialCourseName = parentCourse?.title?.split(':')[0]?.trim() || 'Vibe Coding 201';
    
    let initialBatchCode = batch.batch_code || 'Khóa 1';
    if (batch.name && batch.name.includes(' - ')) {
      const parts = batch.name.split(' - ');
      initialBatchCode = parts[parts.length - 1].trim();
    }

    setCourseName(initialCourseName);
    setBatchCode(initialBatchCode);
    setBatchName(batch.name || `${initialCourseName} - ${initialBatchCode}`);
    setAccessCode(batch.access_code || '');
    setStartDate(batch.start_date ? batch.start_date.split('T')[0] : '');
    setEndDate(batch.end_date ? batch.end_date.split('T')[0] : '');
    setIsActive(batch.is_active !== false);
  };

  const handleCourseNameChange = (val: string) => {
    setCourseName(val);
    setBatchName(batchCode ? `${val.trim()} - ${batchCode.trim()}` : val);
  };

  const handleBatchCodeChange = (val: string) => {
    setBatchCode(val);
    setBatchName(courseName ? `${courseName.trim()} - ${val.trim()}` : val);
  };

  const handleSaveBatchSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatchId) return;
    
    await updateBatch(selectedBatchId, {
      name: batchName,
      batch_code: batchCode,
      access_code: accessCode.trim().toUpperCase(),
      start_date: startDate,
      end_date: endDate,
      is_active: isActive
    });

    showToast("Đã lưu thiết lập Lớp học thành công!");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6 select-text text-slate-800 max-w-7xl mx-auto animate-fade-in">
      <PageHeader 
        title="Cài Đặt Lớp Học & Hệ Thống" 
        description="Quản lý thời gian đào tạo, thông tin và mã kích hoạt (Access Code) cho từng lớp học"
        icon={<SettingsIcon className="w-6 h-6 text-[#214C54]" />}
      />

      <form onSubmit={handleSaveBatchSettings} className="space-y-6">
        {/* Active Batch Context Banner (replaces redundant dropdown) */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-4 h-4 text-[#214C54]" />
            <span className="text-xs font-black text-gray-500 uppercase tracking-wider">Cài đặt cho lớp:</span>
          </div>
          {activeBatch ? (
            <span className="text-sm font-bold text-[#214C54] bg-teal-50 border border-teal-200 px-4 py-1.5 rounded-xl">
              {activeBatch.name}
            </span>
          ) : (
            <span className="text-xs text-amber-600 font-semibold">
              Chưa chọn lớp — vui lòng chọn lớp từ sidebar
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Schedule & Dates Config */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-150 pb-3">
              <Calendar className="w-5 h-5 text-[#214C54]" />
              <h3 className="font-bold text-[#15333B] text-base">Thời Gian & Lịch Đào Tạo</h3>
            </div>

            <div className="space-y-4">
              {/* Course Name & Batch Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">
                    Tên khoá học
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="Ví dụ: Vibe Coding 201"
                    value={courseName}
                    onChange={(e) => handleCourseNameChange(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs bg-white focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54]/20 font-bold text-[#15333B]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">
                    Số Batch / Khóa số
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="Ví dụ: Khóa 2 hoặc K2"
                    value={batchCode}
                    onChange={(e) => handleBatchCodeChange(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs bg-white focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54]/20 font-bold text-[#15333B]"
                  />
                </div>
              </div>

              {/* Combined Display Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">
                  Tên hiển thị của Lớp (Ghép tự động)
                </label>
                <input 
                  type="text"
                  required
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs bg-teal-50/40 border-teal-200 focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54]/20 font-extrabold text-[#214C54]"
                />
                <p className="text-[10px] text-gray-500">
                  Tên hiển thị được tạo từ <b>[Tên khoá]</b> - <b>[Số batch]</b> và dùng để hiển thị trên toàn hệ thống.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">Ngày khai giảng</label>
                  <input 
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs bg-white focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54]/20 font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">Ngày kết thúc</label>
                  <input 
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs bg-white focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54]/20 font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Access Code & Enrollment Config */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-150 pb-3">
              <KeyRound className="w-5 h-5 text-[#214C54]" />
              <h3 className="font-bold text-[#15333B] text-base">Mã Kích Hoạt (Access Code) & Trạng Thái</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">Mã kích hoạt của Lớp</label>
                <input 
                  type="text"
                  required
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="w-full font-mono uppercase tracking-wider border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54]/20 font-black text-[#15333B]"
                />
                <p className="text-[10px] text-gray-500">
                  Học viên dùng mã này tại Cổng kích hoạt để tự động ghi danh vào lớp.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-wider block">Trạng thái lớp học</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="isActive" 
                      checked={isActive} 
                      onChange={() => setIsActive(true)}
                      className="accent-[#214C54]"
                    />
                    <span className="text-xs font-bold text-gray-700">Đang kích hoạt (Cho phép ghi danh)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="isActive" 
                      checked={!isActive} 
                      onChange={() => setIsActive(false)}
                      className="accent-[#214C54]"
                    />
                    <span className="text-xs font-bold text-gray-500">Tạm khóa / Đã kết thúc</span>
                  </label>
                </div>
              </div>

              <div className="bg-teal-50/50 border border-teal-200/60 rounded-2xl p-4 flex gap-3 text-teal-900 text-xs font-medium leading-relaxed mt-4">
                <ShieldCheck className="w-5 h-5 shrink-0 text-[#214C54]" />
                <div>
                  Mọi thay đổi về mã kích hoạt và ngày bắt đầu sẽ có hiệu lực ngay lập tức với các học viên mới ghi danh.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button 
            type="submit"
            className="px-8 py-3 bg-[#214C54] hover:bg-[#15333B] text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer border-0 flex items-center gap-2"
          >
            <Check size={16} />
            <span>Lưu Thiết Lập Lớp Học</span>
          </button>
        </div>
      </form>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#15333B] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center justify-between gap-3 border border-teal-800/30 animate-slide-up select-text">
          <CheckCircle2 size={16} className="text-emerald-400 stroke-[1.5] shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-white ml-2 cursor-pointer border-0 bg-transparent flex items-center justify-center">
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
};
