import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { PageHeader } from '../../components/PageHeader';
import { Users } from 'lucide-react';

export const StudentManagement: React.FC = () => {
  const { users, submissions, masteryRecords, skills } = useDatabase();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const students = users.filter(u => u.role === 'student');
  const activeStudent = students.find(s => s.id === selectedStudentId);

  const getCompletedCount = (studentId: string) => {
    return submissions.filter(s => s.student_id === studentId && s.status === 'graded').length;
  };

  const getRankTitle = (miles: number) => {
    if (miles >= 5000) return 'Huyền thoại 👑';
    if (miles >= 3001) return 'Thuyền trưởng 🧭';
    if (miles >= 1501) return 'Thuyền phó ⚔️';
    if (miles >= 501) return 'Hoa tiêu 🗺️';
    return 'Thủy thủ tập sự ⛵';
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-fade-in select-none overflow-hidden space-y-6">
      <PageHeader
        title="Quản lý Học viên"
        description="Xem danh sách, phân loại và quản lý tiến độ của toàn bộ học viên."
        icon={<Users size={32} strokeWidth={1.5} />}
      />
      
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* Left Column: Students directory (7 cols) */}
        <div className="lg:col-span-7 flex flex-col h-full bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-extrabold text-sm text-[#15333B] uppercase tracking-wider">Danh sách Thủy thủ đoàn (Batch 3)</h3>
            <p className="text-[10px] text-[#3E5E63] font-semibold mt-0.5">Theo dõi hồ sơ năng lực và tích lũy hải lý.</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
          {students.map((student) => {
            const completedCount = getCompletedCount(student.id);
            const isSelected = student.id === selectedStudentId;

            return (
              <div 
                key={student.id}
                onClick={() => setSelectedStudentId(student.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected 
                    ? 'bg-[#214C54]/5 border-[#214C54] shadow-sm' 
                    : 'bg-white border-gray-100 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img 
                    src={student.avatar_url} 
                    alt={student.full_name} 
                    className="w-9 h-9 rounded-full object-cover border"
                  />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-[#15333B] block leading-tight">{student.full_name}</span>
                    <span className="text-[9px] text-[#3E5E63] font-bold block truncate mt-0.5">{student.gmail}</span>
                    <span className="text-[8px] bg-gray-100 text-gray-500 font-extrabold px-1.5 py-0.5 rounded inline-block mt-1">
                      {student.tech_level?.toUpperCase() || 'NON-TECH'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-5 text-right shrink-0 select-none">
                  <div>
                    <span className="text-[9px] text-gray-400 font-bold block">Chấp thuận bài</span>
                    <span className="text-xs font-bold text-[#15333B]">{completedCount} bài</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 font-bold block">Tổng Hải lý</span>
                    <span className="text-sm font-black text-[#214C54]">⚓ {student.nautical_miles}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Active Student Detailed Dossier (5 cols) */}
      <div className="lg:col-span-5 flex flex-col h-full bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {!activeStudent ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
            <span className="text-5xl">👤</span>
            <div>
              <h4 className="font-extrabold text-sm text-[#15333B]">Hồ sơ chi tiết thủy thủ</h4>
              <p className="text-xs text-gray-400 max-w-xs mt-1">Chọn một học viên ở danh sách bên trái để kiểm tra mục tiêu sản phẩm, tech level và cam kết motivation bet.</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
            {/* Header info card */}
            <div className="flex flex-col items-center text-center pb-4 border-b border-gray-100 space-y-2">
              <img 
                src={activeStudent.avatar_url} 
                alt={activeStudent.full_name} 
                className="w-16 h-16 rounded-full object-cover border-2 border-[#214C54]"
              />
              <div>
                <h4 className="font-extrabold text-sm text-[#15333B]">{activeStudent.full_name}</h4>
                <span className="text-xs text-gray-400 block">{activeStudent.gmail}</span>
                <span className="text-[10px] text-[#214C54] font-bold block mt-1">
                  ⚔️ {getRankTitle(activeStudent.nautical_miles)}
                </span>
              </div>
            </div>

            {/* Business fields from B2 Schema */}
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Mục tiêu sản phẩm số:</span>
                <p className="p-3 bg-gray-50 border rounded-xl text-[#3E5E63] font-semibold leading-relaxed">
                  {activeStudent.product_idea || 'Chưa thiết lập ý tưởng'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Lĩnh vực hoạt động:</span>
                  <span className="font-bold text-[#15333B] block">{activeStudent.industry || 'Chưa cập nhật'}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Chức vụ hiện tại:</span>
                  <span className="font-bold text-[#15333B] block">{activeStudent.current_job || 'Chưa cập nhật'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Telegram username:</span>
                  <span className="font-mono text-[#15333B] block font-bold">{activeStudent.telegram_id}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Cam kết thời gian:</span>
                  <span className="font-bold text-[#15333B] block">{activeStudent.weekly_hours_commitment || 0} giờ / tuần</span>
                </div>
              </div>

              <div>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Motivation Bet (Đặt cược cam kết):</span>
                <p className="p-3 bg-amber-50/50 border border-amber-200/50 rounded-xl text-amber-900 font-semibold leading-relaxed">
                  {activeStudent.motivation_bet || 'Không đặt cược'}
                </p>
              </div>

              {/* Mastery records checklist */}
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Đánh giá năng lực hiện tại:</span>
                <div className="space-y-1.5">
                  {skills.map(skill => {
                    const rec = masteryRecords.find(r => r.student_id === activeStudent.id && r.skill_id === skill.id);
                    const lvl = rec ? rec.mastery_level : 'none';
                    return (
                      <div key={skill.id} className="flex justify-between items-center bg-gray-50/50 p-2.5 rounded-lg border border-gray-100">
                        <span className="font-bold text-[10px] text-[#15333B] truncate pr-4">{skill.name.split(' (')[0]}</span>
                        <span className={`badge-pill text-[8px] font-black shrink-0 ${
                          lvl === 'excellent' ? 'badge-success' : lvl === 'meets_expectations' ? 'badge-info' : 'badge-danger'
                        }`}>
                          {lvl === 'excellent' ? 'Lvl 5 (Excellent)' : lvl === 'meets_expectations' ? 'Lvl 3 (Meets)' : lvl === 'needs_improvement' ? 'Lvl 1.5 (Needs)' : 'Lvl 0 (None)'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
    </div>
  );
};
