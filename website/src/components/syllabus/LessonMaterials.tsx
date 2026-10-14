import React from 'react';
import type { Lesson } from '../../types/database';
import { BookOpen, Presentation, FileText, Play, Lock, Link2, ExternalLink, Plus, Trash2 } from 'lucide-react';

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
      <h4 className="text-sm font-black text-[#214C54] uppercase tracking-widest flex items-center gap-1.5">
        <BookOpen size={16} className="stroke-[1.5]" />
        <span>Tài nguyên học tập</span>
      </h4>

      {isEditMode && draftLesson ? (
        <div className="space-y-4 bg-amber-50/45 border border-amber-200/50 rounded-xl p-4 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold text-[#214C54] block mb-1">Slide Bài Giảng URL:</label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-[#15333B] font-semibold placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:border-[#214C54] bg-white font-mono shadow-2xs"
                placeholder="https://..."
                value={draftLesson.slide_url || ''}
                onChange={(e) => setDraftLesson({ ...draftLesson, slide_url: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#214C54] block mb-1">Study Note URL:</label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-[#15333B] font-semibold placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:border-[#214C54] bg-white font-mono shadow-2xs"
                placeholder="https://..."
                value={draftLesson.study_note_url || ''}
                onChange={(e) => setDraftLesson({ ...draftLesson, study_note_url: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#214C54] block mb-1">Video Recording URL:</label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-[#15333B] font-semibold placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:border-[#214C54] bg-white font-mono shadow-2xs"
                placeholder="https://..."
                value={draftLesson.video_url || ''}
                onChange={(e) => setDraftLesson({ ...draftLesson, video_url: e.target.value })}
              />
            </div>
          </div>

          {/* Supporting Resources Section */}
          <div className="pt-3 border-t border-amber-200/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-[#214C54] flex items-center gap-1.5">
                <Link2 size={13} className="text-[#214C54]" />
                <span>Tài liệu học tập bổ sung khác:</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  const currentList = draftLesson.supporting_resources || [];
                  setDraftLesson({
                    ...draftLesson,
                    supporting_resources: [...currentList, { label: '', url: '' }],
                  });
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#214C54] hover:bg-[#15333B] text-white text-[11px] font-bold rounded-lg transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <Plus size={13} />
                <span>Thêm tài liệu khác</span>
              </button>
            </div>

            {(draftLesson.supporting_resources || []).length === 0 ? (
              <p className="text-[11px] text-gray-500 italic py-1">
                Chưa có tài liệu bổ sung nào. Bấm nút <strong>"Thêm tài liệu khác"</strong> ở trên để bổ sung thêm các link tài nguyên học tập (ví dụ: Template Notion, Github repo, File mẫu...).
              </p>
            ) : (
              <div className="space-y-2">
                {(draftLesson.supporting_resources || []).map((resource, index) => (
                  <div key={index} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white/80 p-2 rounded-lg border border-amber-200/60 shadow-2xs">
                    <input
                      type="text"
                      className="w-full sm:w-1/3 border border-gray-200 rounded-md px-2 py-1 text-xs text-[#15333B] font-semibold placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:border-[#214C54] bg-white"
                      placeholder="Tên tài liệu (vd: Template Obsidian)"
                      value={resource.label}
                      onChange={(e) => {
                        const nextList = [...(draftLesson.supporting_resources || [])];
                        nextList[index] = { ...nextList[index], label: e.target.value };
                        setDraftLesson({ ...draftLesson, supporting_resources: nextList });
                      }}
                    />
                    <input
                      type="text"
                      className="w-full sm:flex-1 border border-gray-200 rounded-md px-2 py-1 text-xs text-[#15333B] font-semibold placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:border-[#214C54] bg-white font-mono"
                      placeholder="https://..."
                      value={resource.url}
                      onChange={(e) => {
                        const nextList = [...(draftLesson.supporting_resources || [])];
                        nextList[index] = { ...nextList[index], url: e.target.value };
                        setDraftLesson({ ...draftLesson, supporting_resources: nextList });
                      }}
                    />
                    <button
                      type="button"
                      title="Xóa link tài liệu này"
                      onClick={() => {
                        const nextList = (draftLesson.supporting_resources || []).filter((_, i) => i !== index);
                        setDraftLesson({ ...draftLesson, supporting_resources: nextList });
                      }}
                      className="self-end sm:self-auto text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-md transition-all cursor-pointer flex items-center justify-center shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              <Presentation size={14} className="stroke-[1.5]" />
              <span>Slide Bài Giảng</span>
              <ExternalLink size={12} className="stroke-[1.5]" />
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-200 text-gray-400 text-xs font-black cursor-not-allowed select-none"
            >
              <Presentation size={14} className="stroke-[1.5]" />
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
              <FileText size={14} className="stroke-[1.5]" />
              <span>Study Note</span>
              <ExternalLink size={12} className="stroke-[1.5]" />
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-200 text-gray-400 text-xs font-black cursor-not-allowed select-none"
            >
              <FileText size={14} className="stroke-[1.5]" />
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
              <Play size={14} className="stroke-[1.5]" />
              <span>Video Recording</span>
              <ExternalLink size={12} className="stroke-[1.5]" />
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-200 text-gray-400 text-xs font-black cursor-not-allowed select-none"
            >
              <Lock size={14} className="stroke-[1.5]" />
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
                <Link2 size={14} className="stroke-[1.5]" />
                <span>{res.label}</span>
                <ExternalLink size={12} className="stroke-[1.5]" />
              </a>
            ))}
        </div>
      )}
    </div>
  );
};
