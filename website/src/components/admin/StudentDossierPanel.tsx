import React from 'react';
import type { Profile, Lesson } from '../../types/database';

interface StudentDossierPanelProps {
  activeStudent: Profile | null;
  totalLiveClassCount: number;
  onboardingDays: any[];
  getOnboardingCompletedCount: (student: Profile) => number;
  getLiveClassCompletedCount: (studentId: string) => number;
  getTasksForDay: (day: any) => any[];
  expandedDays: { [key: number]: boolean };
  setExpandedDays: React.Dispatch<React.SetStateAction<{ [key: number]: boolean }>>;
  lessons: Lesson[];
  nauticalTransactions: any[];
}

export const StudentDossierPanel: React.FC<StudentDossierPanelProps> = ({
  activeStudent,
  totalLiveClassCount,
  onboardingDays,
  getOnboardingCompletedCount,
  getLiveClassCompletedCount,
  getTasksForDay,
  expandedDays,
  setExpandedDays,
  lessons,
  nauticalTransactions,
}) => {
  if (!activeStudent) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
        <span className="text-5xl">👤</span>
        <div>
          <h4 className="font-extrabold text-sm text-[#15333B]">Hồ sơ chi tiết học viên</h4>
          <p className="text-xs text-gray-400 max-w-xs mt-1">
            Chọn một học viên từ bảng bên trái để kiểm tra mục tiêu sản phẩm, tech level và cam
            kết học tập.
          </p>
        </div>
      </div>
    );
  }

  const obCount = getOnboardingCompletedCount(activeStudent);
  const lcCount = getLiveClassCompletedCount(activeStudent.id);
  const totalHw = 7 + totalLiveClassCount;
  const completedHw = obCount + lcCount;
  const progressPct = Math.round((completedHw / totalHw) * 100);

  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar text-xs">
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
            ⭐️ {activeStudent.nautical_miles.toLocaleString()} Hải lý
          </span>
        </div>
      </div>

      {/* Progress Summary Block */}
      <div className="bg-[#214C54]/5 border border-[#214C54]/10 rounded-2xl p-4 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-extrabold text-[#15333B]">Tiến độ làm bài tập</span>
          <span className="font-black text-[#214C54]">
            {completedHw}/{totalHw} bài ({progressPct}%)
          </span>
        </div>
        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-550"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="grid grid-cols-2 gap-3 text-[10px] pt-1">
          <div>
            <span className="text-gray-400 font-bold block">BTVN Onboarding:</span>
            <span className="font-extrabold text-gray-700">{obCount}/7</span>
          </div>
          <div>
            <span className="text-gray-400 font-bold block">BTVN Live Class:</span>
            <span className="font-extrabold text-gray-700">
              {lcCount}/{totalLiveClassCount}
            </span>
          </div>
        </div>
      </div>

      {/* Business fields */}
      <div className="space-y-4 text-xs">
        <div>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
            Mục tiêu sản phẩm số:
          </span>
          <p className="p-3 bg-gray-50 border rounded-xl text-[#3E5E63] font-semibold leading-relaxed">
            {activeStudent.product_idea || 'Chưa thiết lập ý tưởng'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
              Vai trò hiện tại:
            </span>
            <span className="font-bold text-[#15333B] block">
              {activeStudent.current_role || activeStudent.current_job || 'Chưa cập nhật'}
            </span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
              Lĩnh vực hoạt động:
            </span>
            <span className="font-bold text-[#15333B] block">
              {activeStudent.work_field || activeStudent.industry || 'Chưa cập nhật'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
              Số điện thoại (Zalo):
            </span>
            <span className="font-bold text-[#15333B] block">
              {activeStudent.phone_number || 'Chưa cập nhật'}
            </span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
              Facebook URL:
            </span>
            {activeStudent.facebook_url ? (
              <a
                href={activeStudent.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#214C54] hover:underline block truncate"
              >
                {activeStudent.facebook_url}
              </a>
            ) : (
              <span className="font-bold text-gray-400 block">Chưa cập nhật</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
              Giới tính:
            </span>
            <span className="font-bold text-[#15333B] block">
              {activeStudent.gender || 'Chưa cập nhật'}
            </span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
              Độ tuổi:
            </span>
            <span className="font-bold text-[#15333B] block">
              {activeStudent.age_group || 'Chưa cập nhật'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
              Khu vực sinh sống:
            </span>
            <span className="font-bold text-[#15333B] block">
              {activeStudent.living_region || 'Chưa cập nhật'}
            </span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
              Nguồn giới thiệu:
            </span>
            <span className="font-bold text-[#15333B] block">
              {activeStudent.referral_source || 'Chưa cập nhật'}
            </span>
          </div>
        </div>

        {/* Detailed Homework Progress Checklist */}
        <div className="border-t border-gray-100 pt-4 space-y-2">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
            Tiến độ chi tiết bài tập:
          </span>
          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
            {/* Onboarding Week Progress */}
            <div className="text-[9px] font-extrabold text-[#214C54] uppercase tracking-wider mb-1 mt-1">
              Chặng 1: Onboarding Week
            </div>
            {onboardingDays.map((day) => {
              const isExpanded = !!expandedDays[day.day];
              const tasks = getTasksForDay(day);
              const requiredTasks = tasks.filter(
                (t) => !t.label.toLowerCase().includes('optional') && !t.isOptional
              );
              const isDayCompleted =
                requiredTasks.length > 0
                  ? requiredTasks.every((t) => !!activeStudent.onboarding_tasks?.[t.key])
                  : true;

              const statusLabel = isDayCompleted ? 'Đã xong' : 'Chưa xong';
              const badgeColor = isDayCompleted
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-400';

              return (
                <div
                  key={`ob-${day.day}`}
                  className="space-y-1 bg-gray-50/50 p-2 rounded-lg border border-gray-100 text-[10px]"
                >
                  <div
                    onClick={() =>
                      setExpandedDays((prev) => ({ ...prev, [day.day]: !prev[day.day] }))
                    }
                    className="flex justify-between items-center text-[10px] cursor-pointer hover:bg-gray-100/55 p-1.5 rounded transition-colors"
                  >
                    <span className="font-bold text-[#15333B] truncate pr-4 flex items-center gap-1.5">
                      <span className="text-[8px] text-gray-400">
                        {isExpanded ? '▼' : '▶'}
                      </span>
                      Ngày {day.day}: {day.title.split(': ')[1] || day.title}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[8px] font-extrabold shrink-0 ${badgeColor}`}
                    >
                      {statusLabel}
                    </span>
                  </div>

                  {isExpanded && (
                    <div className="pl-4 pr-1 py-1 space-y-1 border-l border-gray-200 ml-1.5 mt-1 text-[9px] text-gray-650">
                      {tasks.length === 0 ? (
                        <div className="text-gray-400 italic">Không có nhiệm vụ nào</div>
                      ) : (
                        tasks.map((t) => {
                          const isChecked = !!activeStudent.onboarding_tasks?.[t.key];
                          return (
                            <div
                              key={t.key}
                              className="flex items-center justify-between gap-2 py-0.5"
                            >
                              <span className="truncate">{t.label}</span>
                              <span className="font-bold shrink-0">
                                {isChecked ? '✅' : '❌'}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Live Class Progress */}
            <div className="text-[9px] font-extrabold text-[#214C54] uppercase tracking-wider mb-1 mt-3">
              Chặng 2: Live Classes
            </div>
            {lessons.map((lesson) => {
              const isCompleted = (nauticalTransactions || []).some(
                (t) =>
                  t.student_id === activeStudent.id &&
                  t.action_type === 'lesson_complete' &&
                  t.reference_id === lesson.id
              );
              return (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-2 bg-gray-50/50 rounded-lg border border-gray-100 text-[10px]"
                >
                  <span className="font-bold text-[#15333B] truncate pr-2">
                    {lesson.title}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[8px] font-extrabold shrink-0 ${
                      isCompleted
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {isCompleted ? 'Đã xong' : 'Chưa nộp'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
