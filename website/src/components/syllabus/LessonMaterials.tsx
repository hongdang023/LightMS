import React from 'react';
import type { Lesson } from '../../types/database';

interface LessonMaterialsProps {
  lesson: Lesson;
  isEditMode: boolean;
  draftLesson: Lesson | null;
  setDraftLesson: React.Dispatch<React.SetStateAction<Lesson | null>>;
  isLessonStarted: boolean;
  onCompleteLesson: (id: string) => void;
}

export const LessonMaterials: React.FC<LessonMaterialsProps> = ({
  lesson,
  isEditMode,
  draftLesson,
  setDraftLesson,
  isLessonStarted,
  onCompleteLesson,
}) => {
  return (
    <div className="space-y-3.5 pt-4 border-t border-gray-100">
      <h4 className="text-sm font-black text-[#214C54] uppercase tracking-widest">📚 Tài nguyên học tập</h4>

      {isEditMode && draftLesson ? (
        <div className="space-y-3 bg-amber-50/45 border border-amber-200/50 rounded-xl p-4 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold text-[#214C54] block mb-1">Slide Bài Giảng URL:</label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#214C54] bg-white font-mono"
                placeholder="https://..."
                value={draftLesson.slide_url || ''}
                onChange={(e) => setDraftLesson({ ...draftLesson, slide_url: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#214C54] block mb-1">Study Note URL:</label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#214C54] bg-white font-mono"
                placeholder="https://..."
                value={draftLesson.study_note_url || ''}
                onChange={(e) => setDraftLesson({ ...draftLesson, study_note_url: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#214C54] block mb-1">Video Recording URL:</label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#214C54] bg-white font-mono"
                placeholder="https://..."
                value={draftLesson.video_url || ''}
                onChange={(e) => setDraftLesson({ ...draftLesson, video_url: e.target.value })}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2.5">
          {lesson.slide_url ? (
            <a
              href={lesson.slide_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-sm hover:shadow hover:-translate-y-0.5 transition-all transform active:scale-95 duration-200 cursor-pointer"
            >
              <span>📄</span>
              <span>Slide Bài Giảng</span>
              <span>↗</span>
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-200 text-gray-400 text-xs font-black cursor-not-allowed select-none"
            >
              <span>📄</span>
              <span>Slide Bài Giảng</span>
            </button>
          )}

          {lesson.study_note_url ? (
            <a
              href={lesson.study_note_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-sm hover:shadow hover:-translate-y-0.5 transition-all transform active:scale-95 duration-200 cursor-pointer"
            >
              <span>📝</span>
              <span>Study Note</span>
              <span>↗</span>
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-200 text-gray-400 text-xs font-black cursor-not-allowed select-none"
            >
              <span>📝</span>
              <span>Study Note</span>
            </button>
          )}

          {isLessonStarted && lesson.video_url ? (
            <a
              href={lesson.video_url}
              target="_blank"
              rel="noreferrer"
              onClick={() => onCompleteLesson(lesson.id)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#15333B] hover:bg-[#0f2328] text-amber-400 text-xs font-black shadow-sm hover:shadow hover:-translate-y-0.5 transition-all transform active:scale-95 duration-200 cursor-pointer"
            >
              <span>▶️</span>
              <span>Video Recording</span>
              <span>↗</span>
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-200 text-gray-400 text-xs font-black cursor-not-allowed select-none"
            >
              <span>🔒</span>
              <span>Video Recording</span>
            </button>
          )}

          {lesson.supporting_resources &&
            lesson.supporting_resources.map((res, index) => (
              <a
                key={index}
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-sm hover:shadow hover:-translate-y-0.5 transition-all transform active:scale-95 duration-200 cursor-pointer"
              >
                <span>🔗</span>
                <span>{res.label}</span>
                <span>↗</span>
              </a>
            ))}
        </div>
      )}
    </div>
  );
};
