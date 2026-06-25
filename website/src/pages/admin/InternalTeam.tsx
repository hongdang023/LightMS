import React from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Shield } from 'lucide-react';

export const InternalTeam: React.FC = () => {
  const team = [
    { name: 'Đặng Tuyết Hồng', email: 'dangtuyethong2324@gmail.com', role: 'Admin / Owner', permission: 'Toàn quyền hệ thống, quản lý khóa học, chấm bài tập, cấu hình RLS.', status: 'Active' },
    { name: 'Mentor Liam', email: 'liam@the1ight.com', role: 'Mentor', permission: 'Xem thông tin học viên, sử dụng SpeedGrader chấm bài tập, viết feedback.', status: 'Active' },
    { name: 'Support John', email: 'john@the1ight.com', role: 'Support Staff', permission: 'Xem thông tin liên hệ, trả lời FAQs, hỗ trợ kỹ thuật, không có quyền chấm bài.', status: 'Active' }
  ];

  return (
    <div className="space-y-8 animate-fade-in select-none">
      <PageHeader
        title="Quản lý Nhân sự Nội bộ"
        description="Quản lý đội ngũ Mentor, Admin và cấp quyền quản trị."
        icon={<Shield size={32} strokeWidth={1.5} />}
      />

      <div className="card space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <span className="text-xs text-[#214C54] font-extrabold uppercase tracking-wider">Bảo mật phân quyền (RLS)</span>
          <h2 className="text-xl font-black text-[#15333B] mt-1">Đội Ngũ Nội Bộ & Phân Quyền Vai Trò</h2>
        </div>

        <p className="text-sm text-[#3E5E63] leading-relaxed">
          Dưới đây là danh sách nhân sự tham gia vận hành dự án LightMS. Quyền truy cập dữ liệu được quản lý chặt chẽ thông qua chính sách Row Level Security (RLS) của Supabase PostgreSQL ở tầng database.
        </p>

        {/* Roles Table */}
        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[9px] tracking-wider">
                <th className="p-4">Thành viên</th>
                <th className="p-4">Vai trò (Role)</th>
                <th className="p-4">Quyền truy cập dữ liệu</th>
                <th className="p-4 text-center">Trạng thái</th>
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
                    <span className="bg-green-100 text-green-800 text-[8px] font-black uppercase px-2 py-0.5 rounded-full">
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
