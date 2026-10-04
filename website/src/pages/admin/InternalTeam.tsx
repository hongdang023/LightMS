import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCourse } from '../../context/CourseContext';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '../../components/ui/Button';
import { Shield, Trash2, X, UserPlus, AlertTriangle, CheckCircle2, Edit2, Phone, Facebook, ExternalLink } from 'lucide-react';

interface TeamMember {
  name: string;
  email: string;
  phone?: string;
  facebook?: string;
  role: 'Trainer' | 'Teaching Assistant';
  status: 'Active' | 'Inactive';
}

const DEFAULT_TEAM: TeamMember[] = [
  { name: 'Đặng Tuyết Hồng', email: 'dangtuyethong2324@gmail.com', phone: '0985679417', facebook: 'https://www.facebook.com/danghong.harunoyuki', role: 'Trainer', status: 'Active' },
  { name: 'Linh BTL', email: 'linhblt.20@gmail.com', phone: '0912345678', facebook: '', role: 'Teaching Assistant', status: 'Active' },
  { name: 'Khuê Vũ', email: 'khuevu.thucj4fun@gmail.com', phone: '0923456789', facebook: '', role: 'Teaching Assistant', status: 'Active' },
  { name: 'Nguyễn Nhất Quang', email: 'quangnhatnguyen2403@gmail.com', phone: '0934567890', facebook: '', role: 'Trainer', status: 'Active' }
];

const normalizeTeamData = (raw: any[]): TeamMember[] => {
  return raw.map(item => ({
    name: item.name || '',
    email: item.email || '',
    phone: item.phone || '',
    facebook: item.facebook || '',
    role: item.role === 'Teaching Assistant' ? 'Teaching Assistant' : 'Trainer',
    status: item.status === 'Inactive' ? 'Inactive' : 'Active'
  }));
};

export const InternalTeam: React.FC = () => {
  const { activeBatch } = useCourse();
  const storageKey = activeBatch ? `lightms_internal_team_${activeBatch.id}` : 'lightms_internal_team';

  const [team, setTeam] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return DEFAULT_TEAM;
    try {
      return normalizeTeamData(JSON.parse(saved));
    } catch {
      return DEFAULT_TEAM;
    }
  });

  // Reload team when batch changes
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setTeam(normalizeTeamData(JSON.parse(saved)));
      } catch {
        setTeam(DEFAULT_TEAM);
      }
    } else {
      setTeam(DEFAULT_TEAM);
    }
  }, [storageKey]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [facebook, setFacebook] = useState('');
  const [role, setRole] = useState<'Trainer' | 'Teaching Assistant'>('Trainer');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openAddModal = () => {
    setEditingMember(null);
    setName('');
    setEmail('');
    setPhone('');
    setFacebook('');
    setRole('Trainer');
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setName(member.name);
    setEmail(member.email);
    setPhone(member.phone || '');
    setFacebook(member.facebook || '');
    setRole(member.role);
    setStatus(member.status);
    setIsModalOpen(true);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    if (editingMember) {
      const nextTeam = team.map(t => {
        if (t.email === editingMember.email) {
          return {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            facebook: facebook.trim(),
            role,
            status
          };
        }
        return t;
      });
      setTeam(nextTeam);
      localStorage.setItem(storageKey, JSON.stringify(nextTeam));
      showToast(`Đã cập nhật thông tin nhân sự "${name.trim()}" thành công.`);
    } else {
      const newMember: TeamMember = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        facebook: facebook.trim(),
        role,
        status
      };
      const nextTeam = [...team, newMember];
      setTeam(nextTeam);
      localStorage.setItem(storageKey, JSON.stringify(nextTeam));
      showToast(`Đã thêm nhân sự "${newMember.name}" thành công.`);
    }

    setIsModalOpen(false);
    setEditingMember(null);
  };

  const openDeleteModal = (member: TeamMember) => {
    if (member.email === 'dangtuyethong2324@gmail.com') {
      showToast('Không thể xóa tài khoản Admin/Owner chính của hệ thống.');
      return;
    }
    setMemberToDelete(member);
  };

  const confirmDeleteMember = () => {
    if (!memberToDelete) return;
    const nextTeam = team.filter(t => t.email !== memberToDelete.email);
    setTeam(nextTeam);
    localStorage.setItem(storageKey, JSON.stringify(nextTeam));
    showToast(`Đã xóa nhân sự "${memberToDelete.name}" khỏi danh sách.`);
    setMemberToDelete(null);
  };

  return (
    <div className="space-y-8 animate-fade-in select-none">
      <PageHeader
        title={`Quản lý Nhân sự${activeBatch ? ` — ${activeBatch.name}` : ''}`}
        description={`Giảng viên, Trợ giảng và quyền vận hành${activeBatch ? ` lớp ${activeBatch.name}` : ' toàn hệ thống'}.`}
        icon={<Shield size={32} strokeWidth={1.5} />}
        action={
          <Button
            variant="primary"
            size="md"
            leftIcon={<UserPlus size={16} />}
            onClick={openAddModal}
            className="whitespace-nowrap shadow-sm"
          >
            Thêm nhân sự
          </Button>
        }
      />

      {/* Roles Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[9px] tracking-wider">
              <th className="p-4">Thành viên</th>
              <th className="p-4">Vai trò</th>
              <th className="p-4">Thông tin liên hệ</th>
              <th className="p-4 text-center">Trạng thái</th>
              <th className="p-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {team.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400 text-xs">
                  Chưa có nhân sự nào được phân công cho lớp học này.
                </td>
              </tr>
            ) : (
              team.map((t, idx) => (
                <tr key={t.email || idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-[#15333B] block leading-tight">{t.name}</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">{t.email}</span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                      t.role === 'Trainer' 
                        ? 'bg-[#214C54]/10 text-[#214C54]' 
                        : 'bg-amber-100/80 text-amber-800'
                    }`}>
                      {t.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      {t.phone ? (
                        <div className="flex items-center gap-1.5 text-gray-700 font-medium text-xs">
                          <Phone size={13} className="text-[#3E5E63] shrink-0" />
                          <span>{t.phone}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-[11px] block">Chưa có SĐT</span>
                      )}
                      {t.facebook ? (
                        <a
                          href={t.facebook.startsWith('http') ? t.facebook : `https://${t.facebook}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-[#214C54] hover:text-[#15333B] hover:underline font-semibold text-[11px]"
                        >
                          <Facebook size={13} className="text-[#214C54] shrink-0" />
                          <span className="truncate max-w-[160px]">Facebook Profile</span>
                          <ExternalLink size={10} className="text-gray-400 shrink-0" />
                        </a>
                      ) : null}
                    </div>
                  </td>
                  <td className="p-4 text-center select-none">
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                      t.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {t.status === 'Active' ? 'Hoạt động' : 'Tạm khóa'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-1 justify-end">
                      <button
                        type="button"
                        onClick={() => openEditModal(t)}
                        className="p-1.5 text-gray-400 hover:text-[#214C54] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        title="Chỉnh sửa thông tin"
                      >
                        <Edit2 size={16} />
                      </button>
                      {t.email !== 'dangtuyethong2324@gmail.com' ? (
                        <button
                          type="button"
                          onClick={() => openDeleteModal(t)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Xóa nhân sự"
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-medium italic px-1">Owner</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Member Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden transform transition-all animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#e8eef0] text-[#214C54] rounded-lg">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#15333B] text-lg leading-tight">
                    {editingMember ? 'Chỉnh sửa thông tin nhân sự' : 'Thêm nhân sự mới'}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {editingMember ? 'Cập nhật thông tin giảng viên và trợ giảng' : 'Cấp quyền vận hành hệ thống LightMS'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveMember} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Họ và tên</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Mentor Liam"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#214C54] focus:bg-white transition-all text-[#15333B] font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  placeholder="Ví dụ: liam@the1ight.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#214C54] focus:bg-white transition-all text-[#15333B] font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Số điện thoại</label>
                  <input
                    type="tel"
                    placeholder="Ví dụ: 0985 679 417"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#214C54] focus:bg-white transition-all text-[#15333B] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Link Facebook</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: facebook.com/danghong"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#214C54] focus:bg-white transition-all text-[#15333B] font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Vai trò</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'Trainer' | 'Teaching Assistant')}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#214C54] focus:bg-white transition-all text-[#15333B] font-semibold cursor-pointer"
                  >
                    <option value="Trainer">Trainer</option>
                    <option value="Teaching Assistant">Teaching Assistant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Trạng thái</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'Active' | 'Inactive')}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#214C54] focus:bg-white transition-all text-[#15333B] font-semibold cursor-pointer"
                  >
                    <option value="Active">Hoạt động</option>
                    <option value="Inactive">Tạm khóa</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="flex-1"
                >
                  {editingMember ? 'Lưu thay đổi' : 'Xác nhận'}
                </Button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {memberToDelete && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-gray-100 overflow-hidden transform transition-all animate-scale-in p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 text-red-600 rounded-xl shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="font-extrabold text-[#15333B] text-base leading-tight">Xác nhận xóa nhân sự</h3>
                <p className="text-xs text-gray-500 mt-0.5">Thao tác này sẽ gỡ quyền quản trị của thành viên.</p>
              </div>
            </div>

            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-150 text-xs text-gray-700 space-y-1">
              <p>Bạn có chắc chắn muốn xóa nhân sự:</p>
              <p className="font-bold text-[#15333B]">{memberToDelete.name}</p>
              <p className="text-gray-500 text-[11px]">{memberToDelete.email}</p>
            </div>

            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => setMemberToDelete(null)}
                className="flex-1"
              >
                Hủy
              </Button>
              <Button
                type="button"
                variant="danger"
                size="md"
                onClick={confirmDeleteMember}
                className="flex-1"
              >
                Xác nhận xóa
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Toast Notification */}
      {toastMessage && createPortal(
        <div className="fixed bottom-6 right-6 z-50 bg-[#15333B] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 border border-teal-800/30 animate-slide-up text-xs font-bold">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>,
        document.body
      )}
    </div>
  );
};
