import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { PageHeader } from '../../components/PageHeader';
import { ShieldCheck, Mail, Phone, Send, CheckCircle2, Bookmark, Save } from 'lucide-react';
import type { AdminRole } from '../../types/database';

export const AdminProfileView: React.FC = () => {
  const { activeAdmin, updateAdminProfile, addNotification } = useDatabase();

  const [fullName, setFullName] = useState(activeAdmin?.full_name || '');
  const [gmail] = useState(activeAdmin?.gmail || '');
  const [phone, setPhone] = useState(activeAdmin?.phone_number || '');
  const [telegramId, setTelegramId] = useState(activeAdmin?.telegram_id || '');
  const [adminRole, setAdminRole] = useState<AdminRole>(activeAdmin?.admin_role || 'Operations');
  const [assignedBatches, setAssignedBatches] = useState<string[]>(activeAdmin?.assigned_batches || ['Vibe Coding 201']);
  const [expertiseAreas, setExpertiseAreas] = useState(activeAdmin?.expertise_areas || '');

  const availableRoles: AdminRole[] = ['Founder', 'Trainer', 'Teaching Assistant (TA)', 'Operations'];
  const availableBatches = ['Vibe Coding 201', 'AI Product Cockpit', 'Vibe Coding 101'];

  const handleBatchToggle = (batch: string) => {
    if (assignedBatches.includes(batch)) {
      setAssignedBatches(assignedBatches.filter(b => b !== batch));
    } else {
      setAssignedBatches([...assignedBatches, batch]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAdmin) return;

    const success = await updateAdminProfile(activeAdmin.id, {
      full_name: fullName,
      phone_number: phone,
      telegram_id: telegramId,
      admin_role: adminRole,
      assigned_batches: assignedBatches,
      expertise_areas: expertiseAreas
    });

    if (success) {
      addNotification('Cập nhật thành công', 'Thông tin quản trị viên của bạn đã được cập nhật!', 'system');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in select-none max-w-6xl mx-auto">
      
      {/* Left Column: Form Details (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        <PageHeader
          title="Hồ sơ Quản trị viên"
          description="Quản lý thông tin điều phối và phân quyền vận hành"
          helpTitle="Admin Profile"
          helpSummary="Cập nhật vai trò ban tổ chức, lớp phụ trách và thế mạnh chuyên môn."
          action={
            <span className="badge-pill text-[9px] bg-emerald-100 text-emerald-800 font-extrabold flex items-center gap-1">
              <CheckCircle2 size={12} />
              <span>Admin Verified</span>
            </span>
          }
        />

        <form onSubmit={handleSave} className="card space-y-5 bg-white border-gray-200 p-6 rounded-2xl shadow-sm">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label text-xs font-bold text-dark-slate block mb-1">Họ và tên Admin</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="form-control text-xs font-semibold w-full"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label text-xs font-bold text-dark-slate block mb-1">Email đăng nhập</label>
              <input
                type="email"
                value={gmail}
                disabled
                className="form-control text-xs font-semibold w-full bg-gray-50 text-gray-400 cursor-not-allowed"
              />
            </div>

            <div className="form-group">
              <label className="form-label text-xs font-bold text-dark-slate block mb-1">Số điện thoại liên hệ</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-control text-xs font-semibold w-full"
                placeholder="0985679417"
              />
            </div>

            <div className="form-group">
              <label className="form-label text-xs font-bold text-dark-slate block mb-1">Telegram Username</label>
              <input
                type="text"
                value={telegramId}
                onChange={(e) => setTelegramId(e.target.value)}
                className="form-control text-xs font-semibold w-full"
                placeholder="@username"
              />
            </div>
          </div>

          {/* Admin Role Selection */}
          <div className="form-group">
            <label className="form-label text-xs font-bold text-dark-slate block mb-1.5">Vai trò Quản trị chính</label>
            <div className="grid grid-cols-2 gap-2">
              {availableRoles.map(role => (
                <button
                  type="button"
                  key={role}
                  onClick={() => setAdminRole(role)}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                    adminRole === role
                      ? 'bg-[#15333B] text-white border-[#15333B] shadow-sm'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Assigned Batches */}
          <div className="form-group">
            <label className="form-label text-xs font-bold text-dark-slate block mb-1.5">Lớp / Cohort phụ trách</label>
            <div className="flex flex-wrap gap-2">
              {availableBatches.map(b => {
                const isSelected = assignedBatches.includes(b);
                return (
                  <button
                    type="button"
                    key={b}
                    onClick={() => handleBatchToggle(b)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#214C54] text-white border-[#214C54]'
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
          <div className="form-group">
            <label className="form-label text-xs font-bold text-dark-slate block mb-1">Thế mạnh chuyên môn (Tự điền)</label>
            <textarea
              rows={3}
              value={expertiseAreas}
              onChange={(e) => setExpertiseAreas(e.target.value)}
              className="form-control text-xs font-semibold w-full"
              placeholder="Nhập các chuyên môn hỗ trợ học viên..."
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black shadow-md hover:shadow-lg transition-all"
            >
              <Save size={16} />
              <span>Lưu thay đổi</span>
            </button>
          </div>

        </form>
      </div>

      {/* Right Column: Admin Preview Card (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-gradient-to-br from-[#15333B] via-[#214C54] to-[#15333B] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
          
          <div className="flex items-center gap-4">
            <img
              src={activeAdmin?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
              alt={fullName}
              className="w-16 h-16 rounded-full border-2 border-white/20 object-cover"
            />
            <div>
              <h3 className="text-lg font-black text-white">{fullName || 'Admin User'}</h3>
              <span className="inline-block mt-1 bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {adminRole}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10 space-y-3 text-xs">
            <div className="flex items-center gap-2.5 text-gray-300">
              <Mail size={14} className="text-amber-400" />
              <span>{gmail}</span>
            </div>
            {phone && (
              <div className="flex items-center gap-2.5 text-gray-300">
                <Phone size={14} className="text-amber-400" />
                <span>{phone}</span>
              </div>
            )}
            {telegramId && (
              <div className="flex items-center gap-2.5 text-gray-300">
                <Send size={14} className="text-amber-400" />
                <span>{telegramId}</span>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Thế mạnh chuyên môn:</span>
            <p className="text-xs text-gray-200 font-semibold leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10">
              {expertiseAreas || 'Chưa cập nhật chuyên môn'}
            </p>
          </div>

          <div className="mt-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Lớp đang điều phối:</span>
            <div className="flex flex-wrap gap-1.5">
              {assignedBatches.map(b => (
                <span key={b} className="text-[10px] font-bold bg-white/10 text-white px-2.5 py-1 rounded-lg">
                  {b}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
