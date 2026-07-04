import React, { useState, useEffect } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { PageHeader } from '../../components/PageHeader';
import type { Lesson, Assignment } from '../../context/DatabaseContext';
import { EditableText } from '../../components/EditableText';
import { Trash2, Plus, X, Save, Undo, Link as LinkIcon } from 'lucide-react';

export const SyllabusView: React.FC<{ 
  onPageChange?: (page: string) => void;
  isEditMode?: boolean;
}> = ({ onPageChange, isEditMode = false }) => {
  const { 
    modules, 
    lessons, 
    assignments, 
    submissions, 
    feedbacks, 
    submitAssignment, 
    completeLesson,
    activeUser,
    updateLesson,
    updateAssignment,
    deleteAssignment,
    courses,
    users
  } = useDatabase();

  const currentCourse = courses.find(c => c.title.toLowerCase().includes('201')) || courses[0];
  let filteredModules = currentCourse 
    ? modules.filter(m => m.course_id === currentCourse.id)
    : modules;

  if (filteredModules.length === 0 && modules.length > 0) {
    const fallbackCourseId = modules[0].course_id;
    filteredModules = modules.filter(m => m.course_id === fallbackCourseId);
  }

  const filteredLessons = currentCourse
    ? lessons.filter(l => filteredModules.some(m => m.id === l.module_id))
    : lessons;

  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  const [submissionText, setSubmissionText] = useState('');
  const [reflectionText, setReflectionText] = useState('');
  const [rubricSelfCheck, setRubricSelfCheck] = useState<{ [key: string]: boolean }>({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Local drafts for editable states when in Editing Mode (allows Cancel / Save)
  const [draftLesson, setDraftLesson] = useState<Lesson | null>(null);
  const [draftAssignment, setDraftAssignment] = useState<Assignment | null>(null);
  const [hasHomework, setHasHomework] = useState(false);
  const [newConceptInput, setNewConceptInput] = useState('');

  const activeLesson = filteredLessons.find(l => l.id === selectedLessonId) || filteredLessons[0];
  const activeAssignment = assignments.find(a => a.lesson_id === activeLesson?.id);
  const activeSubmission = submissions.find(s => s.assignment_id === activeAssignment?.id && s.student_id === activeUser?.id);
  const activeFeedback = feedbacks.find(f => f.submission_id === activeSubmission?.id);

  let displayLink = activeSubmission?.content || '';
  let displayReflection = '';
  if (activeSubmission?.content) {
    try {
      const parsed = JSON.parse(activeSubmission.content);
      if (parsed && typeof parsed === 'object' && parsed.url) {
        displayLink = parsed.url;
        displayReflection = parsed.reflection || '';
      }
    } catch (e) {
      // Fallback for raw text URLs
    }
  }

  // Initialize draft when active lesson or edit mode changes
  useEffect(() => {
    if (isEditMode && selectedLessonId && activeLesson) {
      setDraftLesson({ ...activeLesson });
      if (activeAssignment) {
        setDraftAssignment({ ...activeAssignment });
        setHasHomework(true);
      } else {
        setDraftAssignment({
          id: `asg-${activeLesson.id}`,
          lesson_id: activeLesson.id,
          description: 'Bài tập cho buổi học này.',
          rubric_checklist: [],
          scaffolding: { items: [] }
        });
        setHasHomework(false);
      }
    } else {
      setDraftLesson(null);
      setDraftAssignment(null);
      setHasHomework(false);
    }
    setNewConceptInput('');
  }, [selectedLessonId, isEditMode, activeLesson, activeAssignment]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSave = () => {
    if (draftLesson) {
      updateLesson(draftLesson.id, {
        title: draftLesson.title,
        content: draftLesson.content,
        key_concepts: draftLesson.key_concepts,
        slide_url: draftLesson.slide_url,
        study_note_url: draftLesson.study_note_url,
        video_url: draftLesson.video_url,
      });
    }
    if (hasHomework && draftAssignment) {
      updateAssignment(draftAssignment.id, {
        lesson_id: draftAssignment.lesson_id,
        description: draftAssignment.description,
        rubric_checklist: draftAssignment.rubric_checklist,
        scaffolding: draftAssignment.scaffolding,
      });
    } else if (!hasHomework && activeAssignment) {
      deleteAssignment(activeAssignment.id);
    }
    showToast('Đã lưu mọi thay đổi thành công!');
  };

  const handleCancel = () => {
    if (activeLesson) {
      setDraftLesson({ ...activeLesson });
      if (activeAssignment) {
        setDraftAssignment({ ...activeAssignment });
        setHasHomework(true);
      } else {
        setDraftAssignment(null);
        setHasHomework(false);
      }
      setNewConceptInput('');
      showToast('Đã hoàn tác các thay đổi chưa lưu.');
    }
  };

  // Parse current system date (June 25, 2026)
  const isLessonStarted = (lesson: Lesson): boolean => {
    if (!lesson.start_date) return true;
    const start = new Date(lesson.start_date).getTime();
    const now = new Date('2026-06-25T23:39:06+07:00').getTime();
    return now >= start;
  };

  // Checks if a lesson is locked based on prerequisite:
  const isLessonLocked = (lesson: Lesson): boolean => {
    if (activeUser?.role === 'admin') return false; // Admin never locked
    // Lesson 0 is never locked
    if (lesson.order_index === 1) return false;

    // Find previous lesson by order_index
    const prevLesson = filteredLessons.find(l => l.order_index === lesson.order_index - 1);
    if (!prevLesson) return false;

    // Find if previous lesson has an assignment
    const prevAssignment = assignments.find(a => a.lesson_id === prevLesson.id);
    if (!prevAssignment) return false;

    // Find if student has submitted a submission for that assignment
    const prevSubmission = submissions.find(s => s.assignment_id === prevAssignment.id && s.student_id === activeUser?.id);
    const hasSubmitted = prevSubmission && prevSubmission.status !== 'draft';

    return !hasSubmitted;
  };



  const handleSelfCheckToggle = (itemIdx: number) => {
    setRubricSelfCheck(prev => ({
      ...prev,
      [itemIdx]: !prev[itemIdx]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssignment || !submissionText.trim()) return;

    // Check if rubrics are completed (Self-evaluation check warning, excluding optional checklist items)
    const requiredRubrics = activeAssignment.rubric_checklist.filter(r => !r.is_optional);
    const checkedRequiredCount = requiredRubrics.filter((r) => {
      const globalIdx = activeAssignment.rubric_checklist.findIndex(original => original.item === r.item);
      return !!rubricSelfCheck[globalIdx];
    }).length;

    if (checkedRequiredCount < requiredRubrics.length) {
      if (!window.confirm(`⚠️ Bạn chưa tick chọn đủ các tiêu chí bắt buộc (${checkedRequiredCount}/${requiredRubrics.length}). Bạn vẫn muốn nộp chứ?`)) {
        return;
      }
    }

    const submissionPayload = JSON.stringify({
      url: submissionText.trim(),
      reflection: reflectionText.trim()
    });

    submitAssignment(activeAssignment.id, submissionPayload);

    setSubmissionText('');
    setReflectionText('');
    showToast('Đã nộp bài tập & đăng lên Phòng thảo luận! 🚀');
  };

  const isLessonCompletedByStudent = (lessonId: string): boolean => {
    const hasSubmission = submissions.some(s => {
      const asg = assignments.find(a => a.lesson_id === lessonId);
      return s.assignment_id === asg?.id && s.student_id === activeUser?.id;
    });
    return hasSubmission;
  };

  const hasMaterials = activeLesson ? activeLesson.has_materials !== false : false;

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

  // Helper function to extract all scaffolding links dynamically
  const getScaffoldingItems = (asg: Assignment) => {
    const items: { label: string; url: string }[] = [];
    if (asg.scaffolding?.items) {
      return asg.scaffolding.items;
    }
    if (asg.scaffolding?.template_url) {
      items.push({ label: '📋 Template Mẫu (Google Sheets)', url: asg.scaffolding.template_url });
    }
    if (asg.scaffolding?.reference_link) {
      items.push({ label: '🔗 Bài làm mẫu tham khảo', url: asg.scaffolding.reference_link });
    }
    return items;
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

                  {isLessonStarted(activeLesson) && hasMaterials && activeLesson.video_url ? (
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
                </div>
              )}
            </div>

            {/* Assignments / Checklists */}
            <div className="border-t border-gray-100 pt-6 space-y-4">
              <h4 className="text-sm font-black text-[#214C54] uppercase tracking-widest">📝 Bài tập về nhà</h4>
              
              {isEditMode && draftAssignment ? (
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
                        onChange={(e) => setHasHomework(e.target.checked)}
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
                          value={draftAssignment.description}
                          onSave={(newValue) => setDraftAssignment({ ...draftAssignment, description: newValue })}
                          className="text-xs text-[#15333B]"
                          minRows={2}
                        />
                      </div>

                      {/* Rubrics */}
                      <div className="space-y-3 w-full bg-amber-50/40 border border-amber-200/50 p-4 rounded-xl">
                        <span className="text-[10px] font-bold text-[#214C54] uppercase tracking-wider block">📋 Tiêu chí đánh giá (Checklist):</span>
                        <div className="space-y-2.5">
                          {(draftAssignment.rubric_checklist || []).map((item, idx) => (
                            <div key={idx} className="flex gap-2 items-center bg-white p-3 rounded-xl border border-gray-150 shadow-sm">
                              <div className="flex flex-col gap-1 flex-1">
                                <input
                                  type="text"
                                  className="w-full border border-gray-150 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#214C54] font-semibold text-gray-700"
                                  value={item.item}
                                  placeholder="Nhập nội dung tiêu chí..."
                                  onChange={(e) => {
                                    const newRubrics = [...(draftAssignment.rubric_checklist || [])];
                                    newRubrics[idx] = { ...newRubrics[idx], item: e.target.value };
                                    setDraftAssignment({ ...draftAssignment, rubric_checklist: newRubrics });
                                  }}
                                />
                                <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 cursor-pointer select-none">
                                  <input 
                                    type="checkbox"
                                    checked={!!item.is_optional}
                                    onChange={(e) => {
                                      const newRubrics = [...(draftAssignment.rubric_checklist || [])];
                                      newRubrics[idx] = { ...newRubrics[idx], is_optional: e.target.checked };
                                      setDraftAssignment({ ...draftAssignment, rubric_checklist: newRubrics });
                                    }}
                                    className="rounded border-gray-300 text-[#214C54] focus:ring-[#214C54] w-3 h-3"
                                  />
                                  <span>Tiêu chí mở rộng / Không bắt buộc (Optional)</span>
                                </label>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const newRubrics = (draftAssignment.rubric_checklist || []).filter((_, i) => i !== idx);
                                  setDraftAssignment({ ...draftAssignment, rubric_checklist: newRubrics });
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
                            const newRubrics = [...(draftAssignment.rubric_checklist || []), { item: 'Tiêu chí đánh giá mới', checked: false, is_optional: false }];
                            setDraftAssignment({ ...draftAssignment, rubric_checklist: newRubrics });
                          }}
                          className="inline-flex items-center gap-1.5 text-xs text-[#214C54] hover:text-[#15333B] font-black border border-[#214C54]/30 px-3 py-1.5 rounded-lg bg-white shadow-sm hover:shadow active:scale-95 transition-all duration-200 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Thêm Tiêu Chí Mới
                        </button>
                      </div>

                      {/* Scaffolding Resources */}
                      <div className="space-y-3 w-full bg-amber-50/40 border border-amber-200/50 p-4 rounded-xl">
                        <span className="text-[10px] font-bold text-[#214C54] uppercase tracking-wider block">🛠️ Tài nguyên Scaffolding hỗ trợ bài làm:</span>
                        <div className="space-y-3">
                          {getScaffoldingItems(draftAssignment).map((item, idx) => (
                            <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-gray-150 shadow-sm relative">
                              <div>
                                <label className="text-[9px] font-bold text-gray-500 block mb-1">Tên nhãn tài nguyên:</label>
                                <input
                                  type="text"
                                  className="w-full border border-gray-150 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-[#214C54] font-semibold text-gray-700"
                                  value={item.label}
                                  onChange={(e) => {
                                    const newItems = [...getScaffoldingItems(draftAssignment)];
                                    newItems[idx] = { ...newItems[idx], label: e.target.value };
                                    setDraftAssignment({ ...draftAssignment, scaffolding: { items: newItems } });
                                  }}
                                />
                              </div>
                              <div className="pr-8">
                                <label className="text-[9px] font-bold text-gray-500 block mb-1">Đường dẫn liên kết (URL):</label>
                                <input
                                  type="text"
                                  className="w-full border border-gray-150 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-[#214C54] font-semibold text-gray-700 font-mono"
                                  value={item.url}
                                  onChange={(e) => {
                                    const newItems = [...getScaffoldingItems(draftAssignment)];
                                    newItems[idx] = { ...newItems[idx], url: e.target.value };
                                    setDraftAssignment({ ...draftAssignment, scaffolding: { items: newItems } });
                                  }}
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const newItems = getScaffoldingItems(draftAssignment).filter((_, i) => i !== idx);
                                  setDraftAssignment({ ...draftAssignment, scaffolding: { items: newItems } });
                                }}
                                className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-all cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                          
                          <button
                            type="button"
                            onClick={() => {
                              const newItems = [...getScaffoldingItems(draftAssignment), { label: 'Tài nguyên hỗ trợ mới', url: 'https://...' }];
                              setDraftAssignment({ ...draftAssignment, scaffolding: { items: newItems } });
                            }}
                            className="inline-flex items-center gap-1.5 text-xs text-[#214C54] hover:text-[#15333B] font-black border border-[#214C54]/30 px-3 py-1.5 rounded-lg bg-white shadow-sm hover:shadow active:scale-95 transition-all duration-200 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Thêm Tài Nguyên Hỗ Trợ
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 text-center space-y-2">
                      <span className="text-2xl animate-bounce">📭</span>
                      <span className="text-xs font-bold text-[#214C54] block">Buổi học này không có bài tập về nhà.</span>
                      <span className="text-[10px] text-gray-400 block max-w-xs">Gạt công tắc kích hoạt phía trên hoặc bấm nút dưới đây để tạo bài tập mới.</span>
                      <button
                        type="button"
                        onClick={() => setHasHomework(true)}
                        className="inline-flex items-center gap-1.5 text-xs text-[#214C54] hover:text-[#15333B] font-black border border-[#214C54]/30 px-3 py-1.5 rounded-lg bg-white shadow-sm hover:shadow active:scale-95 transition-all duration-200 cursor-pointer mt-2"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Tạo bài tập về nhà
                      </button>
                    </div>
                  )}
                </div>
              ) : activeAssignment ? (
                <div className="space-y-5">
                  {/* Requirement description */}
                  <div className="p-4 bg-gray-50 border border-gray-150 rounded-2xl">
                    <p className="text-sm text-[#15333B] font-semibold leading-relaxed whitespace-pre-wrap">{activeAssignment.description}</p>
                  </div>

                  {/* Scaffolding Resources Links */}
                  {getScaffoldingItems(activeAssignment).length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] text-gray-455 font-bold uppercase tracking-wider block">🛠️ Tài nguyên hỗ trợ:</span>
                      <div className="flex flex-wrap gap-2.5">
                        {getScaffoldingItems(activeAssignment).map((item, idx) => (
                          <a
                            key={idx}
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-[11px] font-black text-[#214C54] transition-all cursor-pointer shadow-sm"
                          >
                            <LinkIcon className="w-3 h-3 text-[#214C54]" />
                            {item.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rubrics check / Submission state */}
                  {activeSubmission && activeSubmission.status !== 'draft' ? (
                    <div className="space-y-4">
                      {/* Rubrics Checklist Results */}
                      <div className="bg-emerald-500/5 border border-emerald-500/25 p-5 rounded-2xl space-y-3">
                        <span className="text-[10px] text-emerald-800 font-black uppercase tracking-widest block">🎯 Báo cáo hoàn thành bài tập (Rubrics):</span>
                        <div className="space-y-2">
                          {activeAssignment.rubric_checklist.map((item, idx) => {
                            const selfChecked = activeSubmission.content ? true : false;
                            return (
                              <div key={idx} className="flex items-start gap-2.5 text-sm text-[#15333B] font-semibold">
                                <span className="text-sm leading-none shrink-0">{selfChecked ? '✅' : '❌'}</span>
                                <span className={selfChecked ? 'text-[#3E5E63]' : 'text-gray-400 line-through'}>
                                  {item.item} {item.is_optional && <span className="text-xs text-slate-500 italic font-normal">(Optional)</span>}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Submitted Text / URL Details */}
                      <div className="p-4 bg-gray-50 border border-gray-150 rounded-2xl space-y-3">
                        <div>
                          <span className="text-xs text-[#214C54] font-black uppercase tracking-wider block mb-1">🔗 Sản phẩm đã nộp:</span>
                          <a
                            href={displayLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-[#214C54] hover:underline font-bold break-all flex items-center gap-1"
                          >
                            {displayLink}
                            <span>↗</span>
                          </a>
                        </div>
                        {displayReflection && (
                          <div className="border-t border-gray-200/60 pt-2.5">
                            <span className="text-xs text-[#214C54] font-black uppercase tracking-wider block mb-1">💬 Cảm nhận của bạn:</span>
                            <p className="text-sm text-gray-600 font-semibold leading-relaxed whitespace-pre-wrap">{displayReflection}</p>
                          </div>
                        )}
                      </div>

                      {/* Grade & Feedback card */}
                      {activeSubmission.status === 'graded' && activeFeedback ? (
                        <div className="bg-amber-500/5 border border-amber-500/25 rounded-2xl p-5 space-y-4">
                          <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                            <div>
                              <span className="text-xs text-amber-800 font-black uppercase tracking-widest block">🏆 Kết quả chấm điểm:</span>
                              <span className="text-sm text-[#3E5E63] font-semibold">Được chấm bởi {users.find(u => u.id === activeFeedback.mentor_id)?.full_name || 'Giảng viên'}</span>
                            </div>
                            <div className="bg-amber-400 text-[#15333B] font-black rounded-xl px-3.5 py-1 text-sm shadow-sm">
                              Mastery Level: {
                                activeFeedback.mastery_level === 'excellent' ? 'Xuất sắc 🌟' :
                                activeFeedback.mastery_level === 'meets_expectations' ? 'Đạt yêu cầu ✅' :
                                activeFeedback.mastery_level === 'needs_improvement' ? 'Cần cải thiện ⚠️' : 'Chưa đạt ❌'
                              }
                            </div>
                          </div>

                          <div className="space-y-2.5">
                            <span className="text-xs text-amber-800 font-black uppercase tracking-widest block">💬 Phản hồi của giảng viên:</span>
                            <p className="text-sm text-[#15333B] font-semibold leading-relaxed whitespace-pre-wrap">{activeFeedback.content}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 border border-gray-150 p-4 rounded-2xl flex items-center justify-center text-sm text-gray-400 font-semibold select-none">
                          ⏳ Bài nộp đang chờ được chấm và đánh giá năng lực.
                        </div>
                      )}
                    </div>
                  ) : (
                    // New submission form
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Rubrics self-checklist */}
                      <div className="bg-amber-50/30 border border-amber-200/50 rounded-2xl p-5 space-y-3.5">
                        <div>
                          <span className="text-[10px] text-[#214C54] font-black uppercase tracking-widest block">🎯 Báo cáo hoàn thành bài tập (Rubrics):</span>
                          <span className="text-[10px] text-slate-500 block mt-0.5 leading-normal">
                            Vui lòng tự đối chiếu sản phẩm của bạn với các tiêu chuẩn đầu ra dưới đây trước khi gửi nộp.
                          </span>
                        </div>

                        <div className="space-y-2.5">
                          {activeAssignment.rubric_checklist.map((item, idx) => (
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

                      {/* Submission Link Input */}
                      <div className="space-y-2">
                        <label className="text-[10px] text-gray-455 font-bold uppercase tracking-wider block">🔗 Đường dẫn sản phẩm (Facebook post, Loom video, GitHub, Notion...):</label>
                        <input 
                          type="url"
                          required
                          className="w-full border border-gray-200 focus:outline-none focus:border-[#214C54] rounded-xl px-4 py-3 text-xs font-semibold text-gray-700 placeholder:text-gray-400 placeholder:font-normal transition-all"
                          placeholder="Nhập đường link bài làm của bạn..."
                          value={submissionText}
                          onChange={(e) => setSubmissionText(e.target.value)}
                        />
                      </div>

                      {/* Reflection Input */}
                      <div className="space-y-2">
                        <label className="text-[10px] text-gray-455 font-bold uppercase tracking-wider block">💬 Chia sẻ cảm nhận & Bài học rút ra (Reflection):</label>
                        <textarea
                          required
                          rows={4}
                          className="w-full border border-gray-200 focus:outline-none focus:border-[#214C54] rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 placeholder:text-gray-400 placeholder:font-normal transition-all"
                          placeholder="Bạn học được gì khi làm bài tập này? Có khó khăn gì đã vượt qua hay điều gì thú vị?"
                          value={reflectionText}
                          onChange={(e) => setReflectionText(e.target.value)}
                        />
                      </div>

                      {isLessonStarted(activeLesson) ? (
                        <button 
                          type="submit"
                          className="bg-[#214C54] hover:bg-[#15333B] text-white w-full text-xs font-black flex items-center justify-center gap-1.5 py-3 rounded-xl shadow-sm hover:shadow hover:-translate-y-0.5 transition-all transform active:scale-95 duration-200 select-none cursor-pointer"
                        >
                          <span className="text-xs">🚀</span>
                          <span>Nộp bài & đăng thảo luận</span>
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

                  {/* Discussion Thread Button Card */}
                  <div className="bg-[#214C54]/5 border border-gray-200 p-4 rounded-xl flex items-center justify-between gap-4 mt-4 shadow-sm">
                    <div className="flex items-start gap-2.5">
                      <span className="text-xl">💬</span>
                      <div>
                        <span className="text-xs font-black text-[#15333B] block">Thảo luận lớp học</span>
                        <p className="text-[10px] text-[#3E5E63] font-semibold leading-normal">
                          Tham gia đặt câu hỏi hoặc xem các thảo luận của đồng môn về buổi học này.
                        </p>
                      </div>
                    </div>
                    {onPageChange ? (
                      <button
                        type="button"
                        onClick={() => onPageChange('discussion')}
                        className="bg-white hover:bg-gray-50 text-[#214C54] border border-[#214C54]/30 px-3.5 py-1.5 rounded-lg text-xs font-black shadow-sm transition-all hover:shadow hover:-translate-y-0.5 duration-200 transform active:scale-95 shrink-0 select-none cursor-pointer"
                      >
                        Mở Thảo Luận ➔
                      </button>
                    ) : (
                      <button
                        disabled
                        className="bg-gray-100 text-gray-400 border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-black cursor-not-allowed shrink-0"
                      >
                        Không khả dụng
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-450 italic">Buổi học này không có bài tập về nhà.</p>
              )}
            </div>
          </div>
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
            {filteredLessons.map((les) => {
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
                    setSubmissionText('');
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
            })}
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
