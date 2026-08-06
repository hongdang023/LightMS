import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCourse } from '../../context/CourseContext';
import { useGamification } from '../../context/GamificationContext';
import { PageHeader } from '../../components/PageHeader';
import type { Lesson } from '../../types/database';
import { EditableText } from '../../components/EditableText';
import { Trash2, Plus, X, Save, Undo } from 'lucide-react';

export const SyllabusView: React.FC<{ 
  onPageChange?: (page: string) => void;
  isEditMode?: boolean;
}> = ({ isEditMode = false }) => {
  const { activeUser } = useAuth();
  const { lessons, isLessonsLoading, completeLesson, updateLesson } = useCourse();
  const { nauticalTransactions } = useGamification();

  const filteredLessons = lessons;

  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  const [rubricSelfCheck, setRubricSelfCheck] = useState<{ [key: string]: boolean }>({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Local drafts for editable states when in Editing Mode (allows Cancel / Save)
  const [draftLesson, setDraftLesson] = useState<Lesson | null>(null);
  const [hasHomework, setHasHomework] = useState(false);
  const [newConceptInput, setNewConceptInput] = useState('');

  const activeLesson = filteredLessons.find(l => l.id === selectedLessonId) || filteredLessons[0];

  // Initialize draft when active lesson or edit mode changes
  useEffect(() => {
    if (isEditMode && selectedLessonId && activeLesson) {
      setDraftLesson({ ...activeLesson });
      setHasHomework(!!activeLesson.assignment_description);
    } else {
      setDraftLesson(null);
      setHasHomework(false);
    }
    setNewConceptInput('');
  }, [selectedLessonId, isEditMode, activeLesson]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSave = () => {
    if (draftLesson) {
      const updates: Partial<Lesson> = {
        title: draftLesson.title,
        content: draftLesson.content,
        key_concepts: draftLesson.key_concepts,
        slide_url: draftLesson.slide_url,
        study_note_url: draftLesson.study_note_url,
        video_url: draftLesson.video_url,
      };
      if (hasHomework) {
        updates.assignment_description = draftLesson.assignment_description || 'Bài tập cho buổi học này.';
        updates.assignment_rubric_checklist = draftLesson.assignment_rubric_checklist || [];
      } else {
        updates.assignment_description = '';
        updates.assignment_rubric_checklist = [];
      }
      updateLesson(draftLesson.id, updates);
    }
    showToast('Đã lưu mọi thay đổi thành công!');
  };

  const handleCancel = () => {
    if (activeLesson) {
      setDraftLesson({ ...activeLesson });
      setHasHomework(!!activeLesson.assignment_description);
      setNewConceptInput('');
      showToast('Đã hoàn tác các thay đổi chưa lưu.');
    }
  };

  // Parse current system date (June 25, 2026)
  const isLessonStarted = (lesson: Lesson): boolean => {
    if (!lesson.start_date) return true;
    const start = new Date(lesson.start_date).getTime();
    const now = new Date().getTime();
    return now >= start;
  };

  // Checks if a lesson is locked based on prerequisite:
  const isLessonLocked = (lesson: Lesson): boolean => {
    if (activeUser?.role === 'admin') return false; // Admin never locked
    // Lesson 0 is never locked
    if (lesson.order_index === 1) return false;

    // If the lesson has not started yet, it is locked
    if (!isLessonStarted(lesson)) return true;

    return false;
  };



  const handleSelfCheckToggle = (itemIdx: number) => {
    setRubricSelfCheck(prev => ({
      ...prev,
      [itemIdx]: !prev[itemIdx]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLesson.assignment_description) return;

    // Check if rubrics are completed (Self-evaluation check warning, excluding optional checklist items)
    const checklist = activeLesson.assignment_rubric_checklist || [];
    const requiredRubrics = checklist.filter(r => !r.is_optional);
    const checkedRequiredCount = requiredRubrics.filter((r) => {
      const globalIdx = checklist.findIndex(original => original.item === r.item);
      return !!rubricSelfCheck[globalIdx];
    }).length;

    if (checkedRequiredCount < requiredRubrics.length) {
      if (!window.confirm(`⚠️ Bạn chưa tick chọn đủ các tiêu chí bắt buộc (${checkedRequiredCount}/${requiredRubrics.length}). Bạn vẫn muốn hoàn thành chứ?`)) {
        return;
      }
    }

    completeLesson(activeLesson.id);
    showToast('Đã ghi nhận hoàn thành bài tập! 🚀');
  };

  const isLessonCompletedByStudent = (lessonId: string): boolean => {
    return (nauticalTransactions || []).some(
      t => t.student_id === activeUser?.id && t.action_type === 'lesson_complete' && t.reference_id === lessonId
    );
  };

  // Split description into bullet points for the Agenda list
  const agendaItems = activeLesson?.content
    ? activeLesson.content
        .split(/[.\n]+/)
        .map(item => item.trim())
        .filter(item => item.length > 0 && !item.toLowerCase().includes('buổi') && !item.toLowerCase().includes('tìm hiểu về'))
    : [];

  const defaultKeyConcepts = agendaItems.slice(0, 3).map(item => 
    item.split(':')[0].split(' - ')[0].split(' vs ')[0].trim()
  );

  // Concept Chip management
  const handleAddConcept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftLesson || !newConceptInput.trim()) return;
    const currentConcepts = draftLesson.key_concepts || defaultKeyConcepts;
    if (currentConcepts.includes(newConceptInput.trim())) return;
    
    setDraftLesson({
      ...draftLesson,
      key_concepts: [...currentConcepts, newConceptInput.trim()]
    });
    setNewConceptInput('');
  };

  const handleRemoveConcept = (conceptToRemove: string) => {
    if (!draftLesson) return;
    const currentConcepts = draftLesson.key_concepts || defaultKeyConcepts;
    setDraftLesson({
      ...draftLesson,
      key_concepts: currentConcepts.filter(c => c !== conceptToRemove)
    });
  };



  return (
    <div className="space-y-6 animate-fade-in select-none pb-20 max-w-5xl mx-auto text-left">
      {selectedLessonId && activeLesson ? (
        // Detail View for the active lesson
        <div className="space-y-6">
          <button
            type="button"
            onClick={() => setSelectedLessonId('')}
            className="flex items-center gap-1.5 text-xs font-black text-[#214C54] hover:text-[#15333B] hover:underline transition-all select-none cursor-pointer"
          >
            ← Quay lại lộ trình học
          </button>

          <PageHeader
            title={activeLesson.title.replace(/^Buổi\s+\d+\s*:\s*/i, '')}
            description={`Buổi học số ${
              activeLesson.title.match(/^Buổi\s+(\d+)/i) 
                ? activeLesson.title.match(/^Buổi\s+(\d+)/i)![1] 
                : (activeLesson.order_index - 1).toString()
            } - Khám phá các học phần và bài tập trên hải trình của bạn.`}
            helpTitle="Chi tiết buổi học"
            helpSummary={activeLesson.target || 'Nội dung chi tiết của buổi học.'}
            helpPurpose="Giúp bạn học lý thuyết, tiếp cận tài nguyên và làm bài tập về nhà."
          />

          {!isLessonStarted(activeLesson) ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center space-y-3">
              <span className="text-4xl animate-bounce">⏳</span>
              <h3 className="text-base font-black text-[#214C54]">Buổi học chưa diễn ra</h3>
              <p className="text-xs text-gray-500 max-w-md leading-relaxed">
                Nội dung chi tiết, tài nguyên học tập và bài tập về nhà của buổi học này sẽ được cập nhật sớm. Vui lòng quay lại sau!
              </p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
            {/* Agenda */}
            <div className="space-y-2.5">
              <h4 className="text-sm font-black text-[#214C54] uppercase tracking-widest">📋 Nội dung chính</h4>
              {isEditMode && draftLesson ? (
                <div className="space-y-1.5 w-full">
                  <EditableText
                    value={draftLesson.content}
                    onSave={(newValue) => setDraftLesson({ ...draftLesson, content: newValue })}
                    className="text-xs text-[#3E5E63] w-full animate-fade-in"
                    minRows={4}
                  />
                </div>
              ) : agendaItems.length > 0 ? (
                <ul className="space-y-2.5 pl-5 list-disc text-sm text-[#3E5E63] font-semibold leading-relaxed">
                  {agendaItems.map((item, idx) => (
                    <li key={idx} className="pl-0.5">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[#3E5E63] font-semibold leading-relaxed">{activeLesson.content}</p>
              )}
            </div>

            {/* Key Concepts */}
            <div className="space-y-2">
              <h4 className="text-sm font-black text-[#214C54] uppercase tracking-widest">💡 Khái niệm cốt lõi</h4>
              {isEditMode && draftLesson ? (
                <div className="space-y-2.5 w-full">
                  <div className="flex flex-wrap gap-2 p-2 bg-gray-50 border border-gray-200 rounded-xl">
                    {(draftLesson.key_concepts || defaultKeyConcepts).map((concept, idx) => (
                      <span 
                        key={idx} 
                        className="inline-flex items-center gap-1.5 text-[10px] bg-amber-50 text-amber-800 border border-amber-200/50 rounded-lg px-2.5 py-1 font-extrabold"
                      >
                        🔑 {concept}
                        <button 
                          type="button" 
                          onClick={() => handleRemoveConcept(concept)}
                          className="text-amber-600 hover:text-amber-800 font-bold hover:bg-amber-100/55 rounded-full w-3.5 h-3.5 flex items-center justify-center cursor-pointer transition-all"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                    {(draftLesson.key_concepts || defaultKeyConcepts).length === 0 && (
                      <span className="text-[10px] text-gray-400 italic font-semibold p-1">Chưa có khái niệm nào. Thêm ở ô dưới!</span>
                    )}
                  </div>
                  
                  <form onSubmit={handleAddConcept} className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#214C54] bg-white font-semibold text-gray-700 placeholder:text-gray-400 placeholder:font-normal"
                      value={newConceptInput}
                      onChange={(e) => setNewConceptInput(e.target.value)}
                      placeholder="Nhập khái niệm mới rồi nhấn Enter..."
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-[#214C54] text-white rounded-lg text-xs font-bold hover:bg-[#15333B] transition-all cursor-pointer shadow-sm"
                    >
                      Thêm
                    </button>
                  </form>
                </div>
              ) : (activeLesson.key_concepts || defaultKeyConcepts).length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {(activeLesson.key_concepts || defaultKeyConcepts).map((concept, idx) => (
                    <span key={idx} className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200/50 rounded-lg px-2.5 py-1 font-extrabold">
                      🔑 {concept}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#3E5E63] italic">Chưa có khái niệm cốt lõi</p>
              )}
            </div>

            {/* Learning Materials */}
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
                  {activeLesson.slide_url ? (
                    <a
                      href={activeLesson.slide_url}
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

                  {activeLesson.study_note_url ? (
                    <a
                      href={activeLesson.study_note_url}
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

                  {isLessonStarted(activeLesson) && activeLesson.video_url ? (

                    <a
                      href={activeLesson.video_url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => completeLesson(activeLesson.id)}
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
                  {activeLesson.supporting_resources && activeLesson.supporting_resources.map((res, index) => (
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

            {/* Assignments / Checklists */}
            <div className="border-t border-gray-100 pt-6 space-y-4">
              <h4 className="text-sm font-black text-[#214C54] uppercase tracking-widest">📝 Bài tập về nhà</h4>
              
              {isEditMode && draftLesson ? (
                <div className="space-y-4">
                  {/* Switch toggle to activate/deactivate homework */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-150 rounded-2xl shadow-sm">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-[#214C54] block">Kích hoạt bài tập về nhà</span>
                      <span className="text-[10px] text-gray-500 block">Bật để thêm yêu cầu nộp bài tập và bộ tiêu chí đánh giá cho buổi học này.</span>
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
                              assignment_rubric_checklist: []
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
                        <label className="text-[10px] text-[#214C54] font-black uppercase tracking-wider block mb-2">📝 Yêu cầu bài tập:</label>
                        <EditableText
                          value={draftLesson.assignment_description || ''}
                          onSave={(newValue) => setDraftLesson({ ...draftLesson, assignment_description: newValue })}
                          className="text-xs text-[#15333B]"
                          minRows={2}
                        />
                      </div>

                      {/* Rubrics */}
                      <div className="space-y-3 w-full bg-amber-50/40 border border-amber-200/50 p-4 rounded-xl">
                        <span className="text-[10px] font-bold text-[#214C54] uppercase tracking-wider block">📋 Tiêu chí đánh giá (Checklist):</span>
                        <div className="space-y-2.5">
                          {(draftLesson.assignment_rubric_checklist || []).map((item, idx) => (
                            <div key={idx} className="flex gap-2 items-center bg-white p-3 rounded-xl border border-gray-150 shadow-sm">
                              <div className="flex flex-col gap-1 flex-1">
                                <input
                                  type="text"
                                  className="w-full border border-gray-150 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#214C54] font-semibold text-gray-700"
                                  value={item.item}
                                  placeholder="Nhập nội dung tiêu chí..."
                                  onChange={(e) => {
                                    const newRubrics = [...(draftLesson.assignment_rubric_checklist || [])];
                                    newRubrics[idx] = { ...newRubrics[idx], item: e.target.value };
                                    setDraftLesson({ ...draftLesson, assignment_rubric_checklist: newRubrics });
                                  }}
                                />
                                <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 cursor-pointer select-none">
                                  <input 
                                    type="checkbox"
                                    checked={!!item.is_optional}
                                    onChange={(e) => {
                                      const newRubrics = [...(draftLesson.assignment_rubric_checklist || [])];
                                      newRubrics[idx] = { ...newRubrics[idx], is_optional: e.target.checked };
                                      setDraftLesson({ ...draftLesson, assignment_rubric_checklist: newRubrics });
                                    }}
                                    className="rounded border-gray-300 text-[#214C54] focus:ring-[#214C54] w-3 h-3"
                                  />
                                  <span>Tiêu chí mở rộng / Không bắt buộc (Optional)</span>
                                </label>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const newRubrics = (draftLesson.assignment_rubric_checklist || []).filter((_, i) => i !== idx);
                                  setDraftLesson({ ...draftLesson, assignment_rubric_checklist: newRubrics });
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
                            const newRubrics = [...(draftLesson.assignment_rubric_checklist || []), { item: 'Tiêu chí đánh giá mới', checked: false, is_optional: false }];
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
                      <span className="text-xs font-bold text-[#214C54] block">Buổi học này không có bài tập về nhà.</span>
                      <span className="text-[10px] text-gray-400 block max-w-xs">Gạt công tắc kích hoạt phía trên hoặc bấm nút dưới đây để tạo bài tập mới.</span>
                      <button
                        type="button"
                        onClick={() => {
                          setHasHomework(true);
                          setDraftLesson({
                            ...draftLesson,
                            assignment_description: 'Bài tập cho buổi học này.',
                            assignment_rubric_checklist: []
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
                    <p className="text-sm text-[#15333B] font-semibold leading-relaxed whitespace-pre-wrap">{activeLesson.assignment_description}</p>
                  </div>

                  {isLessonCompletedByStudent(activeLesson.id) ? (
                    <div className="space-y-4">
                      {/* Rubrics Checklist Results */}
                      <div className="bg-emerald-500/5 border border-emerald-500/25 p-5 rounded-2xl space-y-3 bg-emerald-500/5">
                        <span className="text-[10px] text-emerald-800 font-black uppercase tracking-widest block">🎯 Báo cáo hoàn thành bài tập (Rubrics):</span>
                        <div className="space-y-2">
                          {(activeLesson.assignment_rubric_checklist || []).map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-sm text-[#15333B] font-semibold">
                              <span className="text-sm leading-none shrink-0">✅</span>
                              <span className="text-[#3E5E63]">
                                {item.item} {item.is_optional && <span className="text-xs text-slate-500 italic font-normal">(Optional)</span>}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Completed State Information */}
                      <div className="p-4 bg-[#214C54]/5 border border-[#214C54]/10 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <span className="text-xs text-[#214C54] font-black uppercase tracking-wider block mb-0.5">🎉 Trạng thái:</span>
                          <p className="text-sm text-emerald-600 font-bold">Đã hoàn thành bài học và bài tập</p>
                        </div>
                        <a
                          href="https://www.facebook.com/groups/27216190438021089"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                        >
                          <span>Xem Facebook Group ↗</span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    // New completion form
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Rubrics self-checklist */}
                      {(activeLesson.assignment_rubric_checklist || []).length > 0 && (
                        <div className="bg-amber-50/30 border border-amber-200/50 rounded-2xl p-5 space-y-3.5">
                          <div>
                            <span className="text-[10px] text-[#214C54] font-black uppercase tracking-widest block">🎯 Báo cáo hoàn thành bài tập (Rubrics):</span>
                            <span className="text-[10px] text-slate-500 block mt-0.5 leading-normal">
                              Vui lòng tự đối chiếu sản phẩm của bạn với các tiêu chuẩn đầu ra dưới đây trước khi hoàn thành.
                            </span>
                          </div>

                          <div className="space-y-2.5">
                            {(activeLesson.assignment_rubric_checklist || []).map((item, idx) => (
                              <label key={idx} className="flex items-start gap-2.5 cursor-pointer text-xs font-semibold text-gray-700 hover:text-gray-900 select-none">
                                <input 
                                  type="checkbox"
                                  checked={!!rubricSelfCheck[idx]}
                                  onChange={() => handleSelfCheckToggle(idx)}
                                  className="rounded border-gray-300 text-[#214C54] focus:ring-[#214C54] w-4 h-4 mt-0.5"
                                />
                                <span className={rubricSelfCheck[idx] ? 'text-gray-900 font-black' : ''}>
                                  {item.item} {item.is_optional && <span className="text-[10px] text-slate-500 italic font-normal">(Optional)</span>}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Facebook Group Navigation Button */}
                      <div className="bg-blue-50/50 border border-blue-200/50 rounded-2xl p-5 space-y-3">
                        <div>
                          <span className="text-[10px] text-blue-800 font-black uppercase tracking-widest block">👥 Đăng bài tập lên Facebook Group lớp:</span>
                          <span className="text-[10px] text-slate-500 block mt-0.5 leading-normal">
                            Hãy đăng sản phẩm bài tập của bạn lên Facebook Group để cùng thảo luận và nhận góp ý từ lớp.
                          </span>
                        </div>
                        <a
                          href="https://www.facebook.com/groups/27216190438021089"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-black rounded-xl w-full shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer"
                        >
                          <span>🚀 Đi tới Facebook Group Lớp</span>
                        </a>
                      </div>

                      {isLessonStarted(activeLesson) ? (
                        <button 
                          type="submit"
                          className="bg-[#214C54] hover:bg-[#15333B] text-white w-full text-xs font-black flex items-center justify-center gap-1.5 py-3 rounded-xl shadow-sm hover:shadow hover:-translate-y-0.5 transition-all transform active:scale-95 duration-200 select-none cursor-pointer"
                        >
                          <span>✅ Xác nhận đã hoàn thành bài tập & bài học</span>
                        </button>
                      ) : (
                        <button 
                          type="button"
                          disabled
                          className="bg-gray-300 text-gray-500 w-full text-xs font-extrabold flex items-center justify-center gap-1.5 py-3 rounded-xl border border-gray-300 cursor-not-allowed"
                        >
                          <span>Khóa nộp bài (Lớp chưa bắt đầu)</span>
                          <span>🔒</span>
                        </button>
                      )}
                    </form>
                  )}


                </div>
              ) : (
                <p className="text-xs text-gray-450 italic">Buổi học này không có bài tập về nhà.</p>
              )}
            </div>

            {/* Survey Section */}
            <div className="border-t border-gray-100 pt-6 space-y-3">
              <h4 className="text-sm font-black text-[#214C54] uppercase tracking-widest">📝 Khảo sát buổi học</h4>
              <p className="text-xs text-slate-500 leading-normal">
                Hãy dành 1 phút để giúp chúng tôi cải thiện chất lượng giảng dạy cho các buổi học sau nhé.
              </p>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSdF81_cCcZU68_t9OzCMce2BN_Q3sWs8sODHsTs0g6YP6BpGQ/viewform"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#724AE8] hover:bg-[#5b37c7] text-white text-xs font-black rounded-xl w-full sm:w-auto shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer"
              >
                <span>📝 Điền Form Khảo Sát Buổi Học</span>
              </a>
            </div>
          </div>
          )}
        </div>
      ) : (
        // List View of all lessons as Cards
        <div className="space-y-6">
          <PageHeader
            title="Lộ trình học"
            description="Khám phá các học phần và bài tập trên hải trình của bạn."
            helpTitle="Syllabus"
            helpSummary="Danh sách các buổi học và bài tập cốt lõi của khoá học."
            helpPurpose="Giúp bạn biết mình đang ở đâu trong lộ trình, nộp bài và nhận phản hồi ngay tại chỗ."
          />

          <div className="grid grid-cols-1 gap-4">
            {isLessonsLoading ? (
              // Skeleton loading state
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-full p-5 bg-white border border-gray-200 rounded-2xl shadow-sm animate-pulse flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
              ))
            ) : (
              filteredLessons.map((les) => {
              const locked = isLessonLocked(les);
              const completed = isLessonCompletedByStudent(les.id);
              const isStarted = isLessonStarted(les);

              // Parse numbers and titles
              const match = les.title.match(/^Buổi\s+(\d+)/i);
              const lessonNumber = match ? match[1] : (les.order_index - 1).toString();
              const cleanTitle = les.title.replace(/^Buổi\s+\d+\s*:\s*/i, '');

              // Number Badge Renderer
              const renderNumberBadge = () => {
                if (locked) {
                  return (
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200 shrink-0 select-none">
                      🔒
                    </div>
                  );
                }

                let bgClass = "bg-[#214C54]/10 text-[#214C54] border border-[#214C54]/20";
                let statusIcon = null;

                if (completed) {
                  bgClass = "bg-emerald-500 text-white border border-emerald-500 shadow-sm";
                  statusIcon = <span className="absolute -top-1 -right-1 bg-emerald-600 text-white rounded-full w-4.5 h-4.5 flex items-center justify-center text-[9px] font-bold border-2 border-white select-none">✓</span>;
                } else if (!isStarted) {
                  bgClass = "bg-amber-100 text-amber-800 border border-amber-200";
                  statusIcon = <span className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full w-4.5 h-4.5 flex items-center justify-center text-[9px] font-bold border-2 border-white select-none">⏳</span>;
                }

                return (
                  <div className="relative shrink-0 select-none">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all ${bgClass}`}>
                      {lessonNumber}
                    </div>
                    {statusIcon}
                  </div>
                );
              };

              return (
                <button
                  key={les.id}
                  type="button"
                  onClick={() => {
                    if (locked) return;
                    setSelectedLessonId(les.id);
                    setRubricSelfCheck({});
                  }}
                  className={`w-full flex items-center justify-between p-5 text-left transition-all bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:border-[#214C54]/30 ${
                    locked ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer hover:-translate-y-0.5 duration-200'
                  }`}
                  disabled={locked}
                  title={locked ? 'Buổi học này đang bị khóa. Hãy hoàn thành bài tập buổi trước.' : undefined}
                >
                  <div className="flex items-center gap-4">
                    {renderNumberBadge()}
                    <div>
                      <h3 className={`text-base font-black leading-tight ${locked ? 'text-gray-400' : 'text-[#15333B]'}`}>
                        {cleanTitle}
                      </h3>
                      {!isStarted && les.start_date && (
                        <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
                          Dự kiến mở: {new Date(les.start_date).toLocaleDateString('vi-VN')}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs font-black shrink-0 ${locked ? 'text-gray-300' : 'text-[#214C54] hover:underline'}`}>
                    {locked ? '🔒 Đã khóa' : 'Học ngay ➔'}
                  </span>
                </button>
              );
            }))
            }
          </div>
        </div>
      )}

      {/* Action Bar at the bottom of the page */}
      {isEditMode && selectedLessonId && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 py-3 px-6 shadow-lg z-40 flex items-center justify-end gap-3 transition-all duration-200 animate-slide-up">
          <span className="text-xs text-amber-700 font-bold mr-auto hidden sm:inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200/50 px-3 py-1.5 rounded-xl">
            ⚠️ Bạn đang ở chế độ chỉnh sửa. Nhớ lưu lại các nội dung đã thay đổi!
          </span>
          
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow active:scale-95 duration-200 cursor-pointer"
          >
            <Undo className="w-3.5 h-3.5" />
            <span>Hủy</span>
          </button>
          
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 bg-[#214C54] hover:bg-[#15333B] text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow active:scale-95 duration-200 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Lưu thay đổi</span>
          </button>
        </div>
      )}

      {/* Floating Success Toast notification */}
      {toastMsg && (
        <div className="fixed bottom-20 right-6 z-50 bg-[#15333B] border border-amber-400 text-white px-4 py-3 rounded-xl shadow-xl animate-fade-in flex items-center gap-2">
          <span className="text-base">✨</span>
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}
    </div>
  );
};
