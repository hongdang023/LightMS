import React from 'react';
import type { OnboardingDay } from '../../types/database';
import { renderRichText } from '../../data/onboardingVisuals';

interface DayBonusResourcesProps {
  activeDayData: OnboardingDay;
  isEditMode: boolean;
}

export const DayBonusResources: React.FC<DayBonusResourcesProps> = ({
  activeDayData,
  isEditMode,
}) => {
  if (isEditMode) return null;

  return (
    <div className="space-y-4">
      {/* Companion Mascot speech box */}
      <div className="bg-white border-2 border-sky-100 p-5 rounded-2xl flex items-start gap-4">
        <span className="text-3xl">🦜</span>
        <div className="space-y-1">
          <span className="text-xs text-sky-700 font-black block uppercase tracking-wider">
            Bác Vẹt Đồng Hành gợi ý:
          </span>
          <div className="text-sm text-[#3E5E63] leading-relaxed font-semibold">
            {activeDayData.companionHint
              ? renderRichText(activeDayData.companionHint)
              : '"Thực hiện xong nhiệm vụ nào thì check ngay vào ô trống bên cạnh để nhận điểm thưởng nhé! Tích tiểu thành đại, hải trình còn dài! Nhớ hoàn thành 100% để mở khóa ngày mai nhé!"'}
          </div>
        </div>
      </div>

      {/* Bonus Resources card */}
      {activeDayData.bonusResources && (
        <div className="bg-amber-50/60 border-2 border-amber-100 p-5 rounded-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">💬</span>
            <span className="text-xs text-amber-700 font-black uppercase tracking-wider">
              Bonus: Tài liệu đọc thêm cho bạn
            </span>
          </div>
          <div className="space-y-1.5">
            {activeDayData.bonusResources
              .split('\n')
              .filter((l: string) => l.trim().startsWith('- ['))
              .map((line: string, i: number) => {
                const match = line.match(/^- \[([^\]]+)\]\(([^)]+)\)/);
                if (!match) return null;
                const [, label, url] = match;
                return (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-amber-100 transition-colors group"
                  >
                    <span className="text-amber-500 group-hover:text-amber-600 text-sm shrink-0">
                      🔗
                    </span>
                    <span className="text-sm text-sky-600 group-hover:text-sky-700 font-medium group-hover:underline">
                      {label}
                    </span>
                  </a>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};
