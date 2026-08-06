import React from 'react';
import type { OnboardingDay } from '../../types/database';
import { renderRichText } from '../../data/onboardingVisuals';

interface DayDetailHeaderProps {
  activeDayData: OnboardingDay;
  isEditMode: boolean;
  onBackToGrid: () => void;
  onOpenEmailModal?: (day: OnboardingDay) => void;
  isDayCompleted: boolean;
  selectedDay: number;
}

export const DayDetailHeader: React.FC<DayDetailHeaderProps> = ({
  activeDayData,
  isEditMode,
  onBackToGrid,
  onOpenEmailModal,
  isDayCompleted,
  selectedDay,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToGrid}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#214C54] hover:text-[#15333B] hover:underline cursor-pointer"
        >
          ← Quay lại danh sách 8 ngày
        </button>

        {isEditMode && onOpenEmailModal && (
          <button
            type="button"
            onClick={() => onOpenEmailModal(activeDayData)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#214C54] hover:bg-[#15333B] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <span>✉️ Sửa Mẫu Email Ngày {selectedDay}</span>
          </button>
        )}
      </div>

      <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-[#214C54] uppercase tracking-wider">
            THỬ THÁCH NGÀY {activeDayData.day}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-extrabold ${
              isDayCompleted
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {isDayCompleted ? '✓ Đã hoàn thành' : '⏳ Đang thực hiện'}
          </span>
        </div>

        <h2 className="text-xl font-black text-[#15333B]">{activeDayData.title}</h2>
        <div className="text-xs text-[#3E5E63] font-semibold leading-relaxed">
          {renderRichText(activeDayData.objective)}
        </div>
      </div>
    </div>
  );
};
