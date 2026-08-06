import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { OnboardingDay } from '../../types/database';
import { DAY_VISUAL_STYLES } from '../../data/onboardingVisuals';

interface DayCardProps {
  dayData: OnboardingDay;
  totalTasks: number;
  completedTasks: number;
  onClick: () => void;
}

export const DayCard: React.FC<DayCardProps> = ({
  dayData,
  totalTasks,
  completedTasks,
  onClick,
}) => {
  const isCompleted = totalTasks > 0 && completedTasks === totalTasks;
  const cardVisual = DAY_VISUAL_STYLES[dayData.day] || DAY_VISUAL_STYLES[1];

  return (
    <button
      onClick={onClick}
      className="relative flex flex-col text-left rounded-3xl overflow-hidden transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-[#214C54]/20 ring-1 ring-black/5 bg-white"
    >
      {/* Header Area with Gradient */}
      <div className={`relative h-28 w-full bg-gradient-to-br ${cardVisual.gradient} p-5 flex items-start justify-between overflow-hidden shrink-0`}>
        {cardVisual.bgPattern}
        
        <div className="relative z-10 bg-white/20 backdrop-blur-sm p-3 rounded-2xl text-white shadow-sm">
          {cardVisual.icon}
        </div>
        
        {/* Status Indicator */}
        <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white shadow-sm border border-white/30">
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          ) : (
            <span className="text-sm font-black">{dayData.day}</span>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#214C54]/50 mb-1">
          Ngày {dayData.day}
        </h3>
        <h4 className="text-lg font-bold text-[#15333B] leading-tight mb-2 line-clamp-2 flex-1 group-hover:text-sky-600 transition-colors">
          {dayData.title.replace(/^Ngày \d+[:\-]?\s*/i, '').trim()}
        </h4>
        
        <p className="text-sm text-[#3E5E63] line-clamp-2 mb-4 leading-relaxed h-10">
          {cardVisual.summary}
        </p>
        
        {/* Progress Bar */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className={isCompleted ? "text-emerald-600" : "text-[#3E5E63]"}>
              {isCompleted ? "Đã hoàn thành" : "Tiến độ"}
            </span>
            <span className="text-[#214C54]">{completedTasks}/{totalTasks}</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-sky-500'}`}
              style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>
    </button>
  );
};
