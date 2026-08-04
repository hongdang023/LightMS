import React from 'react';
import { Search, Mail, ShieldAlert, Trophy, CheckCircle, Award } from 'lucide-react';

interface StudentTableProps {
  students: any[];
  filteredStudents: any[];
  activeTab: 'all' | 'risk' | 'outstanding' | 'guest';
  setActiveTab: (tab: 'all' | 'risk' | 'outstanding' | 'guest') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedStudentId: string | null;
  setSelectedStudentId: (id: string | null) => void;
  onBulkEmailClick: () => void;
  getOnboardingCompletedCount: (student: any) => number;
  getLiveClassCompletedCount: (studentId: string) => number;
  totalLiveClassCount: number;
  getStudentStatus: (student: any) => 'risk' | 'outstanding' | 'normal' | 'guest';
  getMailtoLink: (student: any) => string;
  triggerCommendation: (name: string) => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  filteredStudents,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  selectedStudentId,
  setSelectedStudentId,
  onBulkEmailClick,
  getOnboardingCompletedCount,
  getLiveClassCompletedCount,
  totalLiveClassCount,
  getStudentStatus,
  getMailtoLink,
  triggerCommendation
}) => {
  const riskStudentsCount = students.filter(s => getStudentStatus(s) === 'risk').length;
  const outstandingStudentsCount = students.filter(s => getStudentStatus(s) === 'outstanding').length;

  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Filters & Search Header */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-sm text-[#15333B] uppercase tracking-wider">Danh sách học viên</h3>
            <p className="text-[10px] text-[#3E5E63] font-semibold mt-0.5">Quản lý kết quả nộp bài tập và tần suất tương tác học tập.</p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Tìm học viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 w-full sm:w-60 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#214C54] font-semibold text-[#15333B]"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-gray-150 p-1 rounded-xl border border-gray-200 w-fit">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                activeTab === 'all' ? 'bg-[#214C54] text-white shadow-sm' : 'text-gray-650 hover:text-gray-900'
              }`}
            >
              Tất cả ({students.length})
            </button>
            <button 
              onClick={() => setActiveTab('risk')}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                activeTab === 'risk' ? 'bg-red-600 text-white shadow-sm' : 'text-red-600 hover:bg-red-50'
              }`}
            >
              <ShieldAlert size={12} /> Cần hỗ trợ ({riskStudentsCount})
            </button>
            <button 
              onClick={() => setActiveTab('outstanding')}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                activeTab === 'outstanding' ? 'bg-amber-500 text-white shadow-sm' : 'text-amber-600 hover:bg-amber-50'
              }`}
            >
              <Trophy size={12} /> Khen thưởng ({outstandingStudentsCount})
            </button>
          </div>

          {/* Bulk Email Button */}
          <button
            onClick={onBulkEmailClick}
            className="btn bg-[#214C54] hover:bg-[#15333B] text-white text-xs font-extrabold px-4 py-2 flex items-center gap-2 rounded-xl shadow-sm self-start sm:self-auto transition-colors"
          >
            <Mail size={14} /> Gửi Email Hàng Loạt
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        {filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-gray-400">
            <span className="text-4xl mb-2">🔍</span>
            <p className="text-xs font-bold">Không tìm thấy học viên nào phù hợp.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 font-extrabold text-[10px] uppercase tracking-wider bg-gray-50/50 sticky top-0 z-10">
                <th className="py-3 px-4">Học Viên</th>
                <th className="py-3 px-4 text-center">BTVN Onboarding</th>
                <th className="py-3 px-4 text-center">BTVN Live Class</th>
                <th className="py-3 px-4 text-center">Visits</th>
                <th className="py-3 px-4">Trạng Thái</th>
                <th className="py-3 px-4 text-right">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150">
              {filteredStudents.map((student) => {
                const onboardingCount = getOnboardingCompletedCount(student);
                const liveClassCount = getLiveClassCompletedCount(student.id);
                const visits = student.visits || 1;
                const status = activeTab === 'guest' ? 'guest' : getStudentStatus(student);
                const isSelected = student.id === selectedStudentId;

                return (
                  <tr 
                    key={student.id}
                    onClick={() => setSelectedStudentId(student.id)}
                    className={`transition-colors cursor-pointer group text-xs ${
                      isSelected 
                        ? 'bg-[#214C54]/5 font-semibold' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Name & Avatar */}
                    <td className="py-3.5 px-4 flex items-center gap-3 min-w-0">
                      <img 
                        src={student.avatar_url} 
                        alt={student.full_name} 
                        className="w-8 h-8 rounded-full object-cover border"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-[#15333B] block leading-tight">{student.full_name}</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5 leading-none">{student.gmail}</span>
                      </div>
                    </td>

                    {/* Onboarding Homework Progress */}
                    <td className="py-3.5 px-4 text-center font-bold text-gray-700">
                      <span className={onboardingCount === 7 ? 'text-green-600' : 'text-gray-500'}>
                        {onboardingCount}/7
                      </span>
                    </td>

                    {/* Live Class Homework Progress */}
                    <td className="py-3.5 px-4 text-center font-bold text-gray-700">
                      <span className={liveClassCount === totalLiveClassCount ? 'text-green-600' : liveClassCount === 0 ? 'text-red-500' : 'text-amber-600'}>
                        {liveClassCount}/{totalLiveClassCount}
                      </span>
                    </td>

                    {/* Visits count */}
                    <td className="py-3.5 px-4 text-center font-extrabold text-gray-700">
                      {visits}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {status === 'guest' && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] bg-gray-150 text-gray-700 font-extrabold flex items-center gap-1 w-fit">
                          Khách
                        </span>
                      )}
                      {status === 'risk' && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] bg-red-100 text-red-850 font-extrabold flex items-center gap-1 w-fit">
                          <ShieldAlert size={10} /> Nguy cơ
                        </span>
                      )}
                      {status === 'outstanding' && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] bg-amber-100 text-amber-850 font-extrabold flex items-center gap-1 w-fit">
                          <Trophy size={10} /> Xuất sắc
                        </span>
                      )}
                      {status === 'normal' && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] bg-green-100 text-green-800 font-extrabold flex items-center gap-1 w-fit">
                          <CheckCircle size={10} /> Bình thường
                        </span>
                      )}
                    </td>

                    {/* Quick Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      {status === 'guest' && (
                        <button 
                          onClick={() => setSelectedStudentId(student.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 text-[10px] font-bold border border-gray-200 transition-colors"
                        >
                          Chi tiết
                        </button>
                      )}
                      {status === 'risk' && (
                        <a 
                          href={getMailtoLink(student)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-[10px] font-bold border border-red-200 transition-colors"
                        >
                          <Mail size={12} /> Hỗ trợ
                        </a>
                      )}
                      {status === 'outstanding' && (
                        <button 
                          onClick={() => triggerCommendation(student.full_name)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 text-[10px] font-bold border border-amber-200 transition-colors"
                        >
                          <Award size={12} /> Tuyên dương
                        </button>
                      )}
                      {status === 'normal' && (
                        <button 
                          onClick={() => setSelectedStudentId(student.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 text-[10px] font-bold border border-gray-200 transition-colors"
                        >
                          Chi tiết
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
