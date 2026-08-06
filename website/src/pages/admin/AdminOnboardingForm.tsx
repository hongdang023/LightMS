import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { BrandLogo } from '../../components/BrandLogo';
import { ChevronRight, ShieldCheck, Sparkles } from 'lucide-react';
import type { AdminRole } from '../../types/database';

export const AdminOnboardingForm: React.FC = () => {
  const { activeAdmin, updateAdminProfile } = useDatabase();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    full_name: activeAdmin?.full_name || '',
    gmail: activeAdmin?.gmail || '',
    phone_number: activeAdmin?.phone_number || '',
    admin_role: (activeAdmin?.admin_role || 'Operations') as AdminRole,
    assigned_batches: activeAdmin?.assigned_batches || ['Vibe Coding 201'],
    expertise_areas: activeAdmin?.expertise_areas || '',
    telegram_id: activeAdmin?.telegram_id || ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const availableRoles: { key: AdminRole; label: string; desc: string }[] = [
    { key: 'Founder', label: 'Founder / Head Leader', desc: 'Định hướng khóa học & phát triển sản phẩm' },
    { key: 'Trainer', label: 'Trainer / Giảng viên chính', desc: 'Đứng lớp Live Class & thiết kế lộ trình' },
    { key: 'Teaching Assistant (TA)', label: 'Teaching Assistant (TA)', desc: 'Hỗ trợ giải đáp & kềm cặp bài tập học viên' },
    { key: 'Operations', label: 'Operations / Vận hành', desc: 'Điều phối lớp học, điểm danh & hỗ trợ chung' }
  ];

  const availableBatches = ['Vibe Coding 201', 'AI Product Cockpit', 'Vibe Coding 101'];

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Họ và tên không được để trống';
    if (!formData.phone_number.trim()) newErrors.phone_number = 'Số điện thoại không được để trống';
    if (!formData.expertise_areas.trim()) newErrors.expertise_areas = 'Vui lòng nhập thế mạnh chuyên môn';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBatchToggle = (batch: string) => {
    setFormData(prev => {
      const current = prev.assigned_batches;
      if (current.includes(batch)) {
        return { ...prev, assigned_batches: current.filter(b => b !== batch) };
      } else {
        return { ...prev, assigned_batches: [...current, batch] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting || !activeAdmin) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const success = await updateAdminProfile(activeAdmin.id, {
      ...formData,
      is_onboarded: true
    });

    setIsSubmitting(false);

    if (!success) {
      setSubmitError('Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 select-none py-12">
      <div className="max-w-2xl w-full bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-fade-in">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#15333B] to-[#214C54] p-8 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 translate-x-4 -translate-y-4">
            <ShieldCheck size={180} />
          </div>
          <BrandLogo variant="light" size="md" className="mb-4" />
          <h1 className="text-2xl font-black flex items-center gap-2">
            <span>Chào mừng Quản trị viên!</span>
            <Sparkles size={20} className="text-amber-400" />
          </h1>
          <p className="text-xs text-gray-300 font-semibold mt-1">
            Vui lòng hoàn thành thông tin vận hành ban đầu để bắt đầu quản lý lớp học.
          </p>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {submitError && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl">
              {submitError}
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label text-xs font-bold text-dark-slate block mb-1">Họ và tên Admin *</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                className="form-control text-xs font-semibold w-full"
                placeholder="Ví dụ: Đặng Tuyết Hồng"
              />
              {errors.full_name && <span className="text-[10px] text-red-500 font-bold block mt-1">{errors.full_name}</span>}
            </div>

            <div>
              <label className="form-label text-xs font-bold text-dark-slate block mb-1">Gmail liên hệ *</label>
              <input
                type="email"
                value={formData.gmail}
                disabled
                className="form-control text-xs font-semibold w-full bg-gray-50 text-gray-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="form-label text-xs font-bold text-dark-slate block mb-1">Số điện thoại *</label>
              <input
                type="text"
                value={formData.phone_number}
                onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
                className="form-control text-xs font-semibold w-full"
                placeholder="Ví dụ: 0985679417"
              />
              {errors.phone_number && <span className="text-[10px] text-red-500 font-bold block mt-1">{errors.phone_number}</span>}
            </div>

            <div>
              <label className="form-label text-xs font-bold text-dark-slate block mb-1">Telegram ID (Hỗ trợ khẩn)</label>
              <input
                type="text"
                value={formData.telegram_id}
                onChange={e => setFormData({ ...formData, telegram_id: e.target.value })}
                className="form-control text-xs font-semibold w-full"
                placeholder="Ví dụ: @danghong"
              />
            </div>
          </div>

          {/* Admin Role Selection */}
          <div className="space-y-2">
            <label className="form-label text-xs font-bold text-dark-slate block">Vai trò Quản trị chính *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableRoles.map(role => (
                <div
                  key={role.key}
                  onClick={() => setFormData({ ...formData, admin_role: role.key })}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    formData.admin_role === role.key
                      ? 'border-[#214C54] bg-[#214C54]/5 shadow-sm'
                      : 'border-gray-100 hover:border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#15333B]">{role.label}</span>
                    {formData.admin_role === role.key && (
                      <span className="w-4 h-4 rounded-full bg-[#214C54] text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-500 font-medium mt-1 leading-tight">{role.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned Batches */}
          <div className="space-y-2">
            <label className="form-label text-xs font-bold text-dark-slate block">Lớp / Cohort phụ trách</label>
            <div className="flex flex-wrap gap-2">
              {availableBatches.map(b => {
                const isSelected = formData.assigned_batches.includes(b);
                return (
                  <button
                    type="button"
                    key={b}
                    onClick={() => handleBatchToggle(b)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#15333B] text-white border-[#15333B]'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {isSelected ? `✓ ${b}` : `+ ${b}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Expertise Areas */}
          <div>
            <label className="form-label text-xs font-bold text-dark-slate block mb-1">
              Thế mạnh chuyên môn (Tự điền) *
            </label>
            <textarea
              rows={3}
              value={formData.expertise_areas}
              onChange={e => setFormData({ ...formData, expertise_areas: e.target.value })}
              className="form-control text-xs font-semibold w-full"
              placeholder="Ví dụ: Prompt Engineering, Vibe Coding, Next.js & Supabase, Automation n8n..."
            />
            {errors.expertise_areas && <span className="text-[10px] text-red-500 font-bold block mt-1">{errors.expertise_areas}</span>}
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black shadow-md hover:shadow-lg transition-all"
            >
              <span>{isSubmitting ? 'Đang lưu...' : 'Hoàn tất khảo sát Admin'}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
