import React from 'react';
import type { Lesson } from '../../types/database';
import { EditableText } from '../EditableText';
import { Trash2, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGamification } from '../../context/GamificationContext';

interface LessonAssignmentSectionProps {
  activeLesson: Lesson;
  isEditMode: boolean;
  draftLesson: Lesson | null;
  setDraftLesson: React.Dispatch<React.SetStateAction<Lesson | null>>;
  hasHomework: boolean;
  setHasHomework: React.Dispatch<React.SetStateAction<boolean>>;
  isLessonCompletedByStudent: (lessonId: string) => boolean;
  rubricSelfCheck: { [key: string]: boolean };
  handleSelfCheckToggle: (itemIdx: number) => void;
  handleSubmit: (e: React.FormEvent) => void;
  evidenceUrl: string;
  setEvidenceUrl: (url: string) => void;
}

export const LessonAssignmentSection: React.FC<LessonAssignmentSectionProps> = ({
  activeLesson,
  isEditMode,
  draftLesson,
  setDraftLesson,
  hasHomework,
  setHasHomework,
  isLessonCompletedByStudent,
  rubricSelfCheck,
  handleSelfCheckToggle,
  handleSubmit,
  evidenceUrl,
  setEvidenceUrl,
}) => {
  const { activeUser } = useAuth();
  const { nauticalTransactions } = useGamification();

  const completedTx = (nauticalTransactions || []).find(
    t => t.student_id === activeUser?.id && t.action_type === 'assignment_graded' && t.reference_id === activeLesson.id
  );

  const match = completedTx?.description.match(/Link nộp bài:\s*(https?:\/\/\S+)/);
  const submittedUrl = match ? match[1] : '';
  return (
    <div className="border-t border-gray-100 pt-6 space-y-4">
      <h4 className="text-sm font-black text-[#214C54] uppercase tracking-widest">
        📝 Bài tập về nhà
      </h4>

      {isEditMode && draftLesson ? (
        <div className="space-y-4">
          {/* Switch toggle to activate/deactivate homework */}
          <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-150 rounded-2xl shadow-sm">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-[#214C54] block">Kích hoạt bài tập về nhà</span>
              <span className="text-[10px] text-gray-500 block">
                Bật để thêm yêu cầu nộp bài tập và bộ tiêu chí đánh giá cho buổi học này.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasHomework}
                onChange={(e) => {
                  setHasHomework(e.target.checked);
                  if (e.target.checked && !draftLesson.assignment_description) {
                    setDraftLesson({
                      ...draftLesson,
                      assignment_description: 'Bài tập cho buổi học này.',
                      assignment_rubric_checklist: [],
                    });
                  }
                }}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#214C54]"></div>
            </label>
          </div>

          {hasHomework ? (
            <>
              {/* Description */}
              <div className="p-4 bg-amber-50/40 border border-amber-200/50 rounded-xl w-full">
                <label className="text-[10px] text-[#214C54] font-black uppercase tracking-wider block mb-2">
                  📝 Yêu cầu bài tập:
                </label>
                <EditableText
                  value={draftLesson.assignment_description || ''}
                  onSave={(newValue) =>
                    setDraftLesson({ ...draftLesson, assignment_description: newValue })
                  }
                  className="text-xs text-[#15333B]"
                  minRows={2}
                />
              </div>

              {/* Rubrics */}
              <div className="space-y-3 w-full bg-amber-50/40 border border-amber-200/50 p-4 rounded-xl">
                <span className="text-[10px] font-bold text-[#214C54] uppercase tracking-wider block">
                  📋 Tiêu chí đánh giá (Checklist):
                </span>
                <div className="space-y-2.5">
                  {(draftLesson.assignment_rubric_checklist || []).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-2 items-center bg-white p-3 rounded-xl border border-gray-150 shadow-sm"
                    >
                      <div className="flex flex-col gap-1 flex-1">
                        <input
                          type="text"
                          className="w-full border border-gray-150 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#214C54] font-semibold text-gray-700"
                          value={item.item}
                          placeholder="Nhập nội dung tiêu chí..."
                          onChange={(e) => {
                            const newRubrics = [
                              ...(draftLesson.assignment_rubric_checklist || []),
                            ];
                            newRubrics[idx] = { ...newRubrics[idx], item: e.target.value };
                            setDraftLesson({
                              ...draftLesson,
                              assignment_rubric_checklist: newRubrics,
                            });
                          }}
                        />
                        <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={!!item.is_optional}
                            onChange={(e) => {
                              const newRubrics = [
                                ...(draftLesson.assignment_rubric_checklist || []),
                              ];
                              newRubrics[idx] = {
                                ...newRubrics[idx],
                                is_optional: e.target.checked,
                              };
                              setDraftLesson({
                                ...draftLesson,
                                assignment_rubric_checklist: newRubrics,
                              });
                            }}
                            className="rounded border-gray-300 text-[#214C54] focus:ring-[#214C54] w-3 h-3"
                          />
                          <span>Tiêu chí mở rộng / Không bắt buộc (Optional)</span>
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newRubrics = (
                            draftLesson.assignment_rubric_checklist || []
                          ).filter((_, i) => i !== idx);
                          setDraftLesson({
                            ...draftLesson,
                            assignment_rubric_checklist: newRubrics,
                          });
                        }}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-all cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const newRubrics = [
                      ...(draftLesson.assignment_rubric_checklist || []),
                      { item: 'Tiêu chí đánh giá mới', checked: false, is_optional: false },
                    ];
                    setDraftLesson({ ...draftLesson, assignment_rubric_checklist: newRubrics });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-[#214C54] hover:text-[#15333B] font-black border border-[#214C54]/30 px-3 py-1.5 rounded-lg bg-white shadow-sm hover:shadow active:scale-95 duration-200 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Thêm Tiêu Chi Mới
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 text-center space-y-2">
              <span className="text-2xl animate-bounce">📭</span>
              <span className="text-xs font-bold text-[#214C54] block">
                Buổi học này không có bài tập về nhà.
              </span>
              <span className="text-[10px] text-gray-400 block max-w-xs">
                Gạt công tắc kích hoạt phía trên hoặc bấm nút dưới đây để tạo bài tập mới.
              </span>
              <button
                type="button"
                onClick={() => {
                  setHasHomework(true);
                  setDraftLesson({
                    ...draftLesson,
                    assignment_description: 'Bài tập cho buổi học này.',
                    assignment_rubric_checklist: [],
                  });
                }}
                className="inline-flex items-center gap-1.5 text-xs text-[#214C54] hover:text-[#15333B] font-black border border-[#214C54]/30 px-3 py-1.5 rounded-lg bg-white shadow-sm hover:shadow active:scale-95 duration-200 cursor-pointer mt-2"
              >
                <Plus className="w-3.5 h-3.5" />
                Tạo bài tập về nhà
              </button>
            </div>
          )}
        </div>
      ) : activeLesson.assignment_description ? (
        <div className="space-y-5">
          {/* Requirement description */}
          <div className="p-4 bg-gray-50 border border-gray-150 rounded-2xl">
            <p className="text-sm text-[#15333B] font-semibold leading-relaxed whitespace-pre-wrap">
              {activeLesson.assignment_description}
            </p>
          </div>

          {isLessonCompletedByStudent(activeLesson.id) ? (
            <div className="space-y-4">
              {/* Rubrics Checklist Results */}
              <div className="bg-emerald-500/5 border border-emerald-500/25 p-5 rounded-2xl space-y-3 bg-emerald-500/5">
                <span className="text-[10px] text-emerald-800 font-black uppercase tracking-widest block">
                  🎯 Báo cáo hoàn thành bài tập (Rubrics):
                </span>
                <div className="space-y-2">
                  {(activeLesson.assignment_rubric_checklist || []).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-sm text-[#15333B] font-semibold"
                    >
                      <span className="text-sm leading-none shrink-0">✅</span>
                      <span className="text-[#3E5E63]">
                        {item.item}{' '}
                        {item.is_optional && (
                          <span className="text-xs text-slate-500 italic font-normal">
                            (Optional)
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Completed State Information */}
              <div className="p-4 bg-[#214C54]/5 border border-[#214C54]/10 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <span className="text-xs text-[#214C54] font-black uppercase tracking-wider block mb-0.5">
                    🎉 Trạng thái:
                  </span>
                  <p className="text-sm text-emerald-600 font-bold">
                    Đã hoàn thành bài học và bài tập
                  </p>
                  {submittedUrl && (
                    <div className="mt-2 text-xs font-semibold">
                      <span className="text-[#3E5E63]">Bằng chứng nộp bài: </span>
                      <a
                        href={submittedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary-teal hover:underline break-all font-black"
                      >
                        {submittedUrl}
                      </a>
                    </div>
                  )}
                </div>
                <a
                  href={submittedUrl || "https://www.facebook.com/groups/27216190438021089"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  <span>Xem bài đăng Facebook ↗</span>
                </a>
              </div>
            </div>
          ) : (
            // New completion form
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Facebook Post URL Input */}
              <div className="bg-white border border-gray-250 rounded-2xl p-5 space-y-3 shadow-sm">
                <div>
                  <span className="text-[10px] text-[#214C54] font-black uppercase tracking-widest block">
                    🔗 Link Facebook nộp bài (Bắt buộc):
                  </span>
                  <span className="text-[10px] text-slate-505 block mt-0.5 leading-normal font-medium">
                    Để đảm bảo công bằng và ghi nhận điểm, vui lòng dán link bài đăng bằng chứng nộp bài trên Facebook Group của bạn.
                  </span>
                </div>
                <input
                  type="url"
                  required
                  placeholder="https://www.facebook.com/groups/.../posts/..."
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#214C54] font-semibold text-gray-700 bg-white shadow-sm"
                />
                {evidenceUrl && !/^(https?:\/\/)?(www\.|m\.)?facebook\.com\/.+/i.test(evidenceUrl) && (
                  <p className="text-[10px] text-red-500 font-bold animate-fade-in">
                    ⚠️ Vui lòng nhập đúng đường dẫn bài viết trên Facebook (bắt đầu bằng https://facebook.com hoặc https://www.facebook.com)
                  </p>
                )}
              </div>

              {/* Rubrics self-checklist */}
              {(activeLesson.assignment_rubric_checklist || []).length > 0 && (
                <div className="bg-amber-50/30 border border-amber-200/50 rounded-2xl p-5 space-y-3.5">
                  <div>
                    <span className="text-[10px] text-[#214C54] font-black uppercase tracking-widest block">
                      🎯 Báo cáo hoàn thành bài tập (Rubrics):
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5 leading-normal">
                      Vui lòng tự đối chiếu sản phẩm của bạn với các tiêu chuẩn đầu ra dưới đây
                      trước khi hoàn thành.
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {(activeLesson.assignment_rubric_checklist || []).map((item, idx) => (
                      <label
                        key={idx}
                        className="flex items-start gap-2.5 cursor-pointer text-xs font-semibold text-gray-700 hover:text-gray-900 select-none"
                      >
                        <input
                          type="checkbox"
                          checked={!!rubricSelfCheck[idx]}
                          onChange={() => handleSelfCheckToggle(idx)}
                          className="rounded border-gray-300 text-[#214C54] focus:ring-[#214C54] w-4 h-4 mt-0.5"
                        />
                        <span>
                          {item.item}{' '}
                          {item.is_optional && (
                            <span className="text-[10px] text-slate-500 font-normal italic">
                              (Tùy chọn)
                            </span>
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={!evidenceUrl.trim() || !/^(https?:\/\/)?(www\.|m\.)?facebook\.com\/.+/i.test(evidenceUrl)}
                className={`w-full py-3 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-[0.99] cursor-pointer ${
                  (!evidenceUrl.trim() || !/^(https?:\/\/)?(www\.|m\.)?facebook\.com\/.+/i.test(evidenceUrl))
                    ? 'bg-gray-305 text-gray-400 border border-gray-200 cursor-not-allowed shadow-none'
                    : 'bg-[#214C54] hover:bg-[#15333B]'
                }`}
              >
                🚀 Hoàn thành bài tập & nhận Hải lý
              </button>
            </form>
          )}
        </div>
      ) : (
        <div className="p-4 bg-gray-50 border border-gray-150 rounded-2xl text-center">
          <p className="text-xs text-gray-500 font-medium">Buổi học này chưa có bài tập về nhà.</p>
        </div>
      )}
    </div>
  );
};
