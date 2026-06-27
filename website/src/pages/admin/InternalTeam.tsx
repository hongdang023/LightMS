import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Shield, Trash2, X, UserPlus } from 'lucide-react';

interface TeamMember {
  name: string;
  email: string;
  role: string;
  permission: string;
  status: string;
}

const DEFAULT_TEAM: TeamMember[] = [
  { name: 'Đặng Tuyết Hồng', email: 'dangtuyethong2324@gmail.com', role: 'Admin / Owner', permission: 'Toàn quyền hệ thống, quản lý khóa học, chấm bài tập, cấu hình RLS.', status: 'Active' }
];

export const InternalTeam: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('lightms_internal_team');
    return saved ? JSON.parse(saved) : DEFAULT_TEAM;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Mentor');
  const [permission, setPermission] = useState('');
  const [status, setStatus] = useState('Active');

  useEffect(() => {
    localStorage.setItem('lightms_internal_team', JSON.stringify(team));
  }, [team]);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newMember: TeamMember = {
      name,
      email,
      role,
      permission: permission || 'Quyền hạn cơ bản theo vai trò.',
      status
    };

    setTeam([...team, newMember]);
    
    // Reset form
    setName('');
    setEmail('');
    setRole('Mentor');
    setPermission('');
    setStatus('Active');
    setIsModalOpen(false);
  };

  const handleDeleteMember = (emailToDelete: string) => {
    if (emailToDelete === 'dangtuyethong2324@gmail.com') {
      alert('Không thể xóa tài khoản Admin/Owner chính của hệ thống.');
      return;
    }
    if (confirm('Bạn có chắc chắn muốn xóa thành viên này khỏi danh sách quản trị?')) {
      setTeam(team.filter(t => t.email !== emailToDelete));
    }
  };

  return (
    <div className="space-y-8 animate-fade-in select-none">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Quản lý Nhân sự Nội bộ"
          description="Quản lý đội ngũ Mentor, Admin và cấp quyền quản trị."
          icon={<Shield size={32} strokeWidth={1.5} />}
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#214C54] hover:bg-[#1b3e45] text-white font-extrabold text-sm px-5 py-3 rounded-xl transition-all shadow-sm hover:shadow active:scale-95 self-start sm:self-center"
        >
          <UserPlus size={18} />
          <span>Thêm Nhân Sự</span>
        </button>
      </div>

      <div className="card">
        {/* Roles Table */}
        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[9px] tracking-wider">
                <th className="p-4">Thành viên</th>
                <th className="p-4">Vai trò (Role)</th>
                <th className="p-4">Quyền truy cập dữ liệu</th>
                <th className="p-4 text-center">Trạng thái</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {team.map((t, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-[#15333B] block leading-tight">{t.name}</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">{t.email}</span>
                  </td>
                  <td className="p-4 font-semibold text-[#214C54]">
                    {t.role}
                  </td>
                  <td className="p-4 text-gray-500 leading-relaxed max-w-xs">
                    {t.permission}
                  </td>
                  <td className="p-4 text-center select-none">
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                      t.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {t.email !== 'dangtuyethong2324@gmail.com' ? (
                      <button
                        onClick={() => handleDeleteMember(t.email)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa nhân sự"
                      >
                        <Trash2 size={16} />
                      </button>
                    ) : (
                      <span className="text-[10px] text-gray-400 font-medium italic pr-2">Owner</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden transform transition-all animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#e8eef0] text-[#214C54] rounded-lg">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="font-black text-[#15333B] text-lg leading-tight">Thêm Nhân Sự Mới</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Cấp quyền vận hành hệ thống LightMS</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddMember} className="p-6 space-y-4">
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Vai trò (Role)</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#214C54] focus:bg-white transition-all text-[#15333B] font-semibold"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Mentor">Mentor</option>
                    <option value="Support Staff">Support Staff</option>
                    <option value="Observer">Observer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Trạng thái</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#214C54] focus:bg-white transition-all text-[#15333B] font-semibold"
                  >
                    <option value="Active">Hoạt động</option>
                    <option value="Inactive">Tạm khóa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Quyền truy cập dữ liệu</label>
                <textarea
                  placeholder="Mô tả cụ thể quyền truy cập dữ liệu của vai trò này..."
                  value={permission}
                  onChange={(e) => setPermission(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#214C54] focus:bg-white transition-all text-[#15333B] font-medium resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-500 font-bold text-sm rounded-xl transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#214C54] hover:bg-[#1b3e45] text-white font-extrabold text-sm rounded-xl transition-all shadow-sm active:scale-95"
                >
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

