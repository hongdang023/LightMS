import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useStudentManagementData } from '../../hooks/useStudentManagementData';
import { PageHeader } from '../../components/PageHeader';
import { 
  Users, 
  Mail, 
  Trophy, 
  BarChart3, 
  Sparkles} from 'lucide-react';
import { 
  DemographicsChartCard, 
  HorizontalProgressBarList, 
  DemographicsDonutChart, 
  VerticalProgressBarList 
} from '../../components/admin/StudentDemographics';
import { StudentTable } from '../../components/admin/StudentTable';
import { StudentDossierPanel } from '../../components/admin/StudentDossierPanel';

export const StudentManagement: React.FC = () => {
  const {
    students,
    activeStudent,
    totalLiveClassCount,
    onboardingDays,
    lessons,
    nauticalTransactions,
    selectedStudentId,
    setSelectedStudentId,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    toastMessage,
    setToastMessage,
    viewMode,
    setViewMode,
    expandedDays,
    setExpandedDays,
    isBulkEmailModalOpen,
    setIsBulkEmailModalOpen,
    bulkRecipientGroup,
    bulkSubject,
    setBulkSubject,
    bulkBody,
    setBulkBody,
    copySuccess,
    filteredStudents,
    stats,
    triggerCommendation,
    getMailtoLink,
    updateEmailTemplate,
    handleCopyHtml,
    handleSendBulkEmail,
    openBulkEmailModal,
    getTasksForDay,
    getOnboardingCompletedCount,
    getLiveClassCompletedCount,
    getStudentStatus
  } = useStudentManagementData();

  const [hoveredTask, setHoveredTask] = useState<{
    taskIdx: number;
    isOptional: boolean;
    cleanName: string;
    checkedCount: number;
    totalCount: number;
    taskPercent: number;
    x: number;
    y: number;
  } | null>(null);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-fade-in select-none overflow-hidden space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Quản lý Học viên"
          description="Theo dõi hoạt động, tiến độ bài tập, khen thưởng học viên xuất sắc hoặc cảnh báo học viên cần hỗ trợ."
          icon={<Users size={32} strokeWidth={1.5} />}
        />

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-gray-150 p-1 rounded-xl border border-gray-200 w-fit self-start sm:self-auto shadow-sm">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'list' ? 'bg-[#214C54] text-white shadow-sm' : 'text-gray-655 hover:text-gray-900 hover:bg-gray-200/50'
            }`}
          >
            <Users size={14} /> Danh sách chi tiết
          </button>
          <button
            onClick={() => setViewMode('overview')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'overview' ? 'bg-[#214C54] text-white shadow-sm' : 'text-gray-655 hover:text-gray-900 hover:bg-gray-200/50'
            }`}
          >
            <BarChart3 size={14} /> Tổng quan học viên
          </button>
          <button
            onClick={() => setViewMode('onboarding')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'onboarding' ? 'bg-[#214C54] text-white shadow-sm' : 'text-gray-655 hover:text-gray-900 hover:bg-gray-200/50'
            }`}
          >
            <Sparkles size={14} /> Thống kê Onboarding
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#15333B] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#3E5E63] flex items-center gap-3 animate-scale-up">
          <Trophy className="text-yellow-400 w-5 h-5 animate-bounce" />
          <span className="text-xs font-bold" dangerouslySetInnerHTML={{ __html: toastMessage }}></span>
          <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-white ml-2">✕</button>
        </div>
      )}
      
      {viewMode === 'list' && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* Left Column: Students directory (8 cols) */}
        <div className="lg:col-span-8 h-full">
          <StudentTable
            students={students}
            filteredStudents={filteredStudents}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedStudentId={selectedStudentId}
            setSelectedStudentId={setSelectedStudentId}
            onBulkEmailClick={openBulkEmailModal}
            getOnboardingCompletedCount={getOnboardingCompletedCount}
            getLiveClassCompletedCount={getLiveClassCompletedCount}
            totalLiveClassCount={totalLiveClassCount}
            getStudentStatus={getStudentStatus}
            getMailtoLink={getMailtoLink}
            triggerCommendation={triggerCommendation}
          />
        </div>

        {/* Right Column: Active Student Detailed Dossier (4 cols) */}
        <div className="lg:col-span-4 flex flex-col h-full bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <StudentDossierPanel
            activeStudent={activeStudent || null}
            totalLiveClassCount={totalLiveClassCount}
            onboardingDays={onboardingDays}
            getOnboardingCompletedCount={getOnboardingCompletedCount}
            getLiveClassCompletedCount={getLiveClassCompletedCount}
            getTasksForDay={getTasksForDay}
            expandedDays={expandedDays}
            setExpandedDays={setExpandedDays}
            lessons={lessons}
            nauticalTransactions={nauticalTransactions}
          />
        </div>
      </div>
      )}

      {viewMode === 'overview' && (
        <div className="flex-1 overflow-y-auto custom-scrollbar pb-4 pr-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DemographicsChartCard title="Giới tính (Gender)">
              <DemographicsDonutChart data={stats.genders} />
            </DemographicsChartCard>
            
            <DemographicsChartCard title="Độ tuổi (Age Group)">
              <VerticalProgressBarList data={stats.ageGroups} />
            </DemographicsChartCard>

            <DemographicsChartCard title="Khu vực sinh sống (Living Region)">
              <HorizontalProgressBarList data={stats.regions} />
            </DemographicsChartCard>

            <DemographicsChartCard title="Vai trò hiện tại (Current Role)">
              <HorizontalProgressBarList data={stats.roles} />
            </DemographicsChartCard>

            <DemographicsChartCard title="Lĩnh vực hoạt động (Work Field)">
              <VerticalProgressBarList data={stats.fields} />
            </DemographicsChartCard>

            <DemographicsChartCard title="Nguồn giới thiệu (Referral Source)">
              <HorizontalProgressBarList data={stats.referrals} />
            </DemographicsChartCard>
          </div>
        </div>
      )}

      {viewMode === 'onboarding' && (
        <div className="flex-1 overflow-y-auto custom-scrollbar pb-4 pr-1 space-y-6 animate-fade-in text-xs">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1">Tổng số học viên</span>
              <span className="text-2xl font-black text-[#15333B]">{students.length}</span>
            </div>
            <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1">Hoàn thành toàn bộ Onboarding (7/7)</span>
              <span className="text-2xl font-black text-green-600">
                {students.filter(s => getOnboardingCompletedCount(s) === 7).length} ({students.length > 0 ? Math.round((students.filter(s => getOnboardingCompletedCount(s) === 7).length / students.length) * 100) : 0}%)
              </span>
            </div>
            <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1">Đang làm dở dang</span>
              <span className="text-2xl font-black text-amber-500">
                {students.filter(s => {
                  const done = getOnboardingCompletedCount(s);
                  return done > 0 && done < 7;
                }).length}
              </span>
            </div>
          </div>

          {/* Dashboard Table */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden text-xs">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-150 text-left">
                <thead className="bg-gray-50/75">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-extrabold text-[#15333B] uppercase tracking-wider">Ngày</th>
                    <th className="px-6 py-4 text-[10px] font-extrabold text-[#15333B] uppercase tracking-wider">Chủ đề bài học</th>
                    <th className="px-6 py-4 text-[10px] font-extrabold text-[#15333B] uppercase tracking-wider w-48">Hoàn thành Ngày</th>
                    <th className="px-6 py-4 text-[10px] font-extrabold text-[#15333B] uppercase tracking-wider">Điểm Drop-off Lớn Nhất</th>
                    <th className="px-6 py-4 text-[10px] font-extrabold text-[#15333B] uppercase tracking-wider text-right w-64">Tiến độ từng Task</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {onboardingDays.map(day => {
                    const tasks = getTasksForDay(day);
                    const reqTasks = tasks.filter(t => !t.label.toLowerCase().includes('optional') && !t.isOptional);
                    
                    // Calculate day stats
                    const dayCompletions = students.filter(s => {
                      return reqTasks.length > 0 ? reqTasks.every(t => !!s.onboarding_tasks?.[t.key]) : true;
                    }).length;
                    const dayPercent = students.length > 0 ? Math.round((dayCompletions / students.length) * 100) : 0;

                    // Analyze drop-offs
                    let maxDrop = 0;
                    let maxDropTask: any = null;
                    let previousCompletedCount = students.length;

                    reqTasks.forEach((task) => {
                      const currentCompletedCount = students.filter(s => !!s.onboarding_tasks?.[task.key]).length;
                      const drop = previousCompletedCount - currentCompletedCount;
                      if (drop > maxDrop) {
                        maxDrop = drop;
                        maxDropTask = task;
                      }
                      previousCompletedCount = currentCompletedCount;
                    });

                    const cleanDropTaskName = maxDropTask
                      ? maxDropTask.label
                          .replace(/\*\*Task \d+:\*\*/g, '')
                          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
                          .split('\n')[0]
                          .trim()
                      : '';

                    return (
                      <tr key={`stats-day-${day.day}`} className="hover:bg-teal-50/10 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-black text-[#15333B]">
                          Ngày {day.day}
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-gray-750 max-w-xs truncate" title={day.title}>
                          {day.title.split(': ')[1] || day.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px] font-black text-gray-700">
                              <span>{dayPercent}%</span>
                              <span className="text-[#214C54]">{dayCompletions}/{students.length} HV</span>
                            </div>
                            <div className="w-full bg-gray-150 h-2 rounded-full overflow-hidden">
                              <div 
                                className="bg-[#214C54] h-full rounded-full transition-all duration-550 ease-out" 
                                style={{ width: `${dayPercent}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs">
                          {maxDrop > 0 && maxDropTask ? (
                            <div className="space-y-0.5">
                              <span className="inline-flex items-center gap-1 text-[10px] font-black text-red-650 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded uppercase tracking-wider animate-pulse">
                                ⚠️ Drop {maxDrop} HV
                              </span>
                              <span className="block text-[11px] font-bold text-gray-600 truncate max-w-[200px]" title={`Task ${maxDropTask.idx}: ${cleanDropTaskName}`}>
                                Task {maxDropTask.idx}: {cleanDropTaskName}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[10px] font-extrabold text-emerald-650 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded uppercase tracking-wider">
                              ✅ Ổn định (0 drop)
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {tasks.length === 0 ? (
                              <span className="text-[10px] text-gray-400 italic">Không có task</span>
                            ) : (
                              tasks.map((task) => {
                                const checkedCount = students.filter(s => !!s.onboarding_tasks?.[task.key]).length;
                                const taskPercent = students.length > 0 ? Math.round((checkedCount / students.length) * 100) : 0;
                                const cleanName = task.label
                                  .replace(/\*\*Task \d+:\*\*/g, '')
                                  .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
                                  .split('\n')[0]
                                  .trim();

                                let colorClass = 'bg-red-500 hover:bg-red-650';
                                if (task.isOptional) {
                                  colorClass = 'bg-gray-400 hover:bg-gray-505';
                                } else if (taskPercent >= 80) {
                                  colorClass = 'bg-emerald-550 hover:bg-emerald-600';
                                } else if (taskPercent >= 45) {
                                  colorClass = 'bg-amber-550 hover:bg-amber-600';
                                }

                                return (
                                  <div
                                    key={task.key}
                                    className={`group relative w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black text-white ${colorClass} shadow-sm hover:scale-110 transition-all cursor-help shrink-0`}
                                    onMouseEnter={(e) => {
                                      const rect = e.currentTarget.getBoundingClientRect();
                                      setHoveredTask({
                                        taskIdx: task.idx,
                                        isOptional: !!task.isOptional,
                                        cleanName,
                                        checkedCount,
                                        totalCount: students.length,
                                        taskPercent,
                                        x: rect.left + rect.width / 2,
                                        y: rect.top,
                                      });
                                    }}
                                    onMouseLeave={() => setHoveredTask(null)}
                                  >
                                    {task.idx}
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Email Modal */}
      {isBulkEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in text-xs">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col border border-gray-100 overflow-hidden animate-scale-up max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-teal-850">
                <Mail className="w-5 h-5" />
                <h4 className="text-sm font-black text-[#15333B] uppercase tracking-wider">Gửi Email Hàng Loạt</h4>
              </div>
              <button 
                onClick={() => { setIsBulkEmailModalOpen(false); setBulkSubject(''); setBulkBody(''); }}
                className="w-8 h-8 rounded-full bg-[#15333B]/5 hover:bg-[#15333B]/10 flex items-center justify-center text-[#15333B] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Side-by-Side Content */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0 text-xs">
              {/* Left Column: Form Editor */}
              <form onSubmit={handleSendBulkEmail} className="flex-1 p-6 space-y-4 overflow-y-auto border-r border-gray-100">
                {/* Recipient Group Selector */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#15333B] block">Gửi tới nhóm học viên:</label>
                  <div className="flex flex-wrap gap-3">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                      <input 
                        type="radio" 
                        name="recipientGroup" 
                        value="all" 
                        checked={bulkRecipientGroup === 'all'} 
                        onChange={() => updateEmailTemplate('all')}
                        className="text-[#214C54] focus:ring-[#214C54]"
                      />
                      <span>Tất cả ({students.length} người)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                      <input 
                        type="radio" 
                        name="recipientGroup" 
                        value="risk" 
                        checked={bulkRecipientGroup === 'risk'} 
                        onChange={() => updateEmailTemplate('risk')}
                        className="text-[#214C54] focus:ring-[#214C54]"
                      />
                      <span className="text-red-700">Cần hỗ trợ ({students.filter(s => getStudentStatus(s) === 'risk').length} người)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                      <input 
                        type="radio" 
                        name="recipientGroup" 
                        value="outstanding" 
                        checked={bulkRecipientGroup === 'outstanding'} 
                        onChange={() => updateEmailTemplate('outstanding')}
                        className="text-[#214C54] focus:ring-[#214C54]"
                      />
                      <span className="text-emerald-700">Tuyên dương ({students.filter(s => getStudentStatus(s) === 'outstanding').length} người)</span>
                    </label>
                  </div>
                </div>

                {/* Subject Input */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#15333B] block">Tiêu đề Email (Subject):</label>
                  <input 
                    type="text"
                    required
                    placeholder="Nhập tiêu đề email..."
                    value={bulkSubject}
                    onChange={(e) => setBulkSubject(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54]/20 transition-all font-bold text-[#15333B]"
                  />
                </div>

                {/* Body Textarea */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#15333B] block">Nội dung Email (Body):</label>
                  <textarea 
                    required
                    rows={8}
                    placeholder="Nhập nội dung email gửi cho học viên..."
                    value={bulkBody}
                    onChange={(e) => setBulkBody(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs leading-relaxed focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54]/20 resize-none transition-all font-medium text-gray-700"
                  />
                </div>

                {/* Left Column Actions */}
                <div className="pt-4 border-t border-gray-100 flex justify-between gap-3">
                  <button 
                    type="button"
                    onClick={handleCopyHtml}
                    className="btn border border-teal-600 text-teal-850 hover:bg-teal-50/50 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5"
                  >
                    {copySuccess ? 'Đã sao chép! ✓' : 'Sao chép định dạng 📋'}
                  </button>
                  
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={() => { setIsBulkEmailModalOpen(false); setBulkSubject(''); setBulkBody(''); }}
                      className="btn border border-gray-300 text-gray-700 text-xs font-bold px-4 py-2 hover:bg-gray-50 rounded-xl"
                    >
                      Hủy
                    </button>
                    <button 
                      type="submit"
                      className="btn bg-[#214C54] hover:bg-[#15333B] text-white text-xs font-extrabold px-4 py-2 flex items-center gap-1.5 rounded-xl shadow-md transition-colors"
                    >
                      Gửi qua Gmail 🚀
                    </button>
                  </div>
                </div>
              </form>

              {/* Right Column: Premium Styled Preview */}
              <div className="hidden md:flex flex-1 flex-col bg-gray-50 p-6 overflow-y-auto">
                <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Xem trước Email (Định dạng Brand Guidelines)</div>
                <div className="bg-[#FDF5DA] p-6 rounded-2xl border border-[#ffd94c] flex-1 flex flex-col justify-start">
                  <div className="bg-[#15333B] p-4 rounded-t-xl text-center border-b-4 border-[#ffd94c]">
                    <span className="text-[#ffd94c] font-black text-xs tracking-wider block">
                      🦜 VẸT LẮM MỒM - THE1IGHT 🦜
                    </span>
                  </div>
                  <div className="bg-white p-5 rounded-b-xl flex-1 shadow-sm">
                    <h5 className="text-[#214C54] font-black text-xs border-b border-gray-150 pb-2 mb-3">
                      {bulkSubject || '(Không có tiêu đề)'}
                    </h5>
                    <div className="text-[11px] text-gray-700 font-medium leading-relaxed space-y-3 whitespace-pre-line">
                      {bulkBody || '(Không có nội dung)'}
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                      <span className="inline-block bg-[#214C54] text-white text-[10px] font-black px-4 py-2 rounded-lg cursor-pointer">
                        VÀO HỆ THỐNG LIGHTMS 🚀
                      </span>
                    </div>
                  </div>
                  <div className="text-center mt-3 text-[9px] text-[#3E5E63] font-bold">
                    Bản tin được gửi từ hạm đội vận hành LightMS.
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
      {hoveredTask && createPortal(
        <div
          style={{
            position: 'fixed',
            left: `${hoveredTask.x}px`,
            top: `${hoveredTask.y - 8}px`,
            transform: 'translate(-50%, -100%)',
          }}
          className="flex flex-col items-start bg-[#15333B] text-white text-[10px] p-3 rounded-xl shadow-xl z-[9999] w-64 text-left pointer-events-none whitespace-normal leading-normal"
        >
          <span className="font-extrabold text-teal-400 block mb-1">
            Nhiệm vụ {hoveredTask.taskIdx} {hoveredTask.isOptional ? '(Tùy chọn)' : '(Bắt buộc)'}
          </span>
          <p className="font-semibold text-gray-250 text-[10px] mb-2 line-clamp-3">
            {hoveredTask.cleanName}
          </p>
          <div className="w-full flex justify-between items-center border-t border-white/10 pt-1.5 mt-0.5">
            <span className="font-black text-white">
              Đã tích: {hoveredTask.checkedCount}/{hoveredTask.totalCount} HV
            </span>
            <span className="font-black text-emerald-400">
              {hoveredTask.taskPercent}%
            </span>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-[#15333B] rotate-45 -mt-1"></div>
        </div>,
        document.body
      )}
    </div>
  );
};
