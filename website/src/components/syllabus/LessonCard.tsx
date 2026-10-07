import React from 'react';
import type { Lesson } from '../../types/database';
import { Lock, Check, Clock, ArrowRight } from 'lucide-react';

interface LessonCardProps {
  lesson: Lesson;
  locked: boolean;
  completed: boolean;
  isStarted: boolean;
  onSelectLesson: (id: string) => void;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  lesson,
  locked,
  completed,
  isStarted,
  onSelectLesson,
}) => {
  const match = lesson.title.match(/^Buổi\s+(\d+)/i);
  const lessonNumber = match ? match[1] : (lesson.order_index - 1).toString();
  const cleanTitle = lesson.title.replace(/^Buổi\s+\d+\s*:\s*/i, '');

  const renderNumberBadge = () => {
    if (locked) {
      return (
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200 shrink-0 select-none">
          <Lock size={16} className="stroke-[1.5]" />
        </div>
      );
    }

    let bgClass = 'bg-[#214C54]/10 text-[#214C54] border border-[#214C54]/20';
    let statusIcon = null;

    if (completed) {
      bgClass = 'bg-emerald-500 text-white border border-emerald-500 shadow-sm';
      statusIcon = (
        <span className="absolute -top-1 -right-1 bg-emerald-600 text-white rounded-full w-4.5 h-4.5 flex items-center justify-center border-2 border-white select-none">
          <Check size={10} className="stroke-[2.5]" />
        </span>
      );
    } else if (!isStarted) {
      bgClass = 'bg-amber-100 text-amber-800 border border-amber-200';
      statusIcon = (
        <span className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full w-4.5 h-4.5 flex items-center justify-center border-2 border-white select-none">
          <Clock size={10} className="stroke-[2.5]" />
        </span>
      );
    }

    return (
      <div className="relative shrink-0 select-none">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all ${bgClass}`}
        >
          {lessonNumber}
        </div>
        {statusIcon}
      </div>
    );
  };

  return (
    <button
      type="button"
      onClick={() => {
        if (locked) return;
        onSelectLesson(lesson.id);
      }}
      className={`w-full flex items-center justify-between p-5 text-left transition-all bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:border-[#214C54]/30 ${
        locked
          ? 'opacity-50 cursor-not-allowed bg-gray-50'
          : 'cursor-pointer hover:-translate-y-0.5 duration-200'
      }`}
      disabled={locked}
      title={locked ? 'Buổi học này đang bị khóa. Hãy hoàn thành bài tập buổi trước.' : undefined}
    >
      <div className="flex items-center gap-4">
        {renderNumberBadge()}
        <div>
          <h3
            className={`text-base font-black leading-tight ${
              locked ? 'text-gray-400' : 'text-[#15333B]'
            }`}
          >
            {cleanTitle}
          </h3>
          {!isStarted && lesson.start_date && (
            <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
              Dự kiến mở: {new Date(lesson.start_date).toLocaleDateString('vi-VN')}
            </span>
          )}
        </div>
      </div>
      <span
        className={`text-xs font-black shrink-0 flex items-center gap-1 ${
          locked ? 'text-gray-300' : 'text-[#214C54] hover:underline'
        }`}
      >
        {locked ? (
          <>
            <Lock size={12} className="stroke-[1.5]" />
            <span>Đã khóa</span>
          </>
        ) : (
          <>
            <span>Học ngay</span>
            <ArrowRight size={12} className="stroke-[1.5]" />
          </>
        )}
      </span>
    </button>
  );
};
