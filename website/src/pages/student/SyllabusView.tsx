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
    updateAssignment
  } = useDatabase();

  const [selectedLessonId, setSelectedLessonId] = useState<string>('les-0');
  const [submissionText, setSubmissionText] = useState('');
  const [rubricSelfCheck, setRubricSelfCheck] = useState<{ [key: string]: boolean }>({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Local drafts for editable states when in Editing Mode (allows Cancel / Save)
  const [draftLesson, setDraftLesson] = useState<Lesson | null>(null);
  const [draftAssignment, setDraftAssignment] = useState<Assignment | null>(null);
  const [newConceptInput, setNewConceptInput] = useState('');

  const activeLesson = lessons.find(l => l.id === selectedLessonId) || lessons[0];
  const activeAssignment = assignments.find(a => a.lesson_id === activeLesson.id);
  const activeSubmission = submissions.find(s => s.assignment_id === activeAssignment?.id && s.student_id === activeUser.id);
  const activeFeedback = feedbacks.find(f => f.submission_id === activeSubmission?.id);

  // Initialize draft when active lesson or edit mode changes
  useEffect(() => {
    if (isEditMode && activeLesson) {
      setDraftLesson({ ...activeLesson });
      if (activeAssignment) {
        setDraftAssignment({ ...activeAssignment });
      } else {
        setDraftAssignment({
          id: `asg-${activeLesson.id}`,
          lesson_id: activeLesson.id,
          description: 'Bài tập cho buổi học này.',
          rubric_checklist: [],
          scaffolding: { items: [] }
        });
      }
    } else {
      setDraftLesson(null);
      setDraftAssignment(null);
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
    if (draftAssignment) {
      updateAssignment(draftAssignment.id, {
        lesson_id: draftAssignment.lesson_id,
        description: draftAssignment.description,
        rubric_checklist: draftAssignment.rubric_checklist,
        scaffolding: draftAssignment.scaffolding,
      });
    }
    showToast('Đã lưu mọi thay đổi thành công!');
  };

  const handleCancel = () => {
    if (activeLesson) {
      setDraftLesson({ ...activeLesson });
      if (activeAssignment) {
        setDraftAssignment({ ...activeAssignment });
      } else {
        setDraftAssignment(null);
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
    if (activeUser.role === 'admin') return false; // Admin never locked
    // Lesson 0 is never locked
    if (lesson.order_index === 1) return false;

    // Find previous lesson by order_index
    const prevLesson = lessons.find(l => l.order_index === lesson.order_index - 1);
    if (!prevLesson) return false;

    // Find if previous lesson has an assignment
    const prevAssignment = assignments.find(a => a.lesson_id === prevLesson.id);
    if (!prevAssignment) return false;

    // Find if student has submitted a submission for that assignment
    const prevSubmission = submissions.find(s => s.assignment_id === prevAssignment.id && s.student_id === activeUser.id);
    const hasSubmitted = prevSubmission && prevSubmission.status !== 'draft';

    return !hasSubmitted;
  };

  const handleLessonSelect = (lesson: Lesson) => {
    const locked = isLessonLocked(lesson);
    if (locked) return; // Cannot select locked lesson details
    setSelectedLessonId(lesson.id);
    
    // Reset submission inputs
    setSubmissionText('');
    setRubricSelfCheck({});
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

    submitAssignment(activeAssignment.id, submissionText);
    setSubmissionText('');
  };

  const isLessonCompletedByStudent = (lessonId: string): boolean => {
    const hasSubmission = submissions.some(s => {
      const asg = assignments.find(a => a.lesson_id === lessonId);
      return s.assignment_id === asg?.id && s.student_id === activeUser.id;
    });
    return hasSubmission;
  };

  const started = isLessonStarted(activeLesson);
  const hasMaterials = activeLesson.has_materials !== false;

  // Split description into bullet points for the Agenda list
  const agendaItems = activeLesson.content
    .split(/[.\n]+/)
    .map(item => item.trim())
    .filter(item => item.length > 0 && !item.toLowerCase().includes('buổi') && !item.toLowerCase().includes('tìm hiểu về'));

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in select-none pb-20">
      <div className="col-span-1 lg:col-span-12">
        <PageHeader
          title="Lộ trình học"
          description="Khám phá các học phần và bài tập trên hải trình của bạn."
          helpTitle="Syllabus"
          helpSummary="Danh sách các module và bài học cốt lõi của khoá học."
          helpPurpose="Giúp bạn biết mình đang ở đâu trong lộ trình, nộp bài và nhận phản hồi ngay tại chỗ."
        />
      </div>
      
      {/* Sidebar: Modules & Lessons */}
      <div className="lg:col-span-4 flex flex-col h-full bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {modules.map((mod) => {
            const moduleLessons = lessons.filter(l => l.module_id === mod.id);
            return (
              <div key={mod.id} className="space-y-1.5">
                <h4 className="text-xs font-black text-[#214C54] uppercase tracking-wide px-1.5">{mod.title}</h4>
                <div className="space-y-1">
                  {moduleLessons.map((les) => {
                    const locked = isLessonLocked(les);
                    const isSelected = les.id === selectedLessonId;
                    const completed = isLessonCompletedByStudent(les.id);
                    const isStarted = isLessonStarted(les);
                    
                    return (
                      <button
                        key={les.id}
                        onClick={() => handleLessonSelect(les)}
                        disabled={locked}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all group relative ${
                          locked 
                            ? 'bg-gray-50 border-gray-100 text-gray-400 opacity-50 cursor-not-allowed'
                            : isSelected
                              ? 'bg-[#214C54] border-[#214C54] text-white shadow'
                              : 'bg-white border-gray-100 text-[#15333B] hover:border-gray-300'
                        }`}
                        title={locked ? `Khóa (Cần hoàn thành bài tập buổi trước)` : les.title}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <span className="text-xs shrink-0">
                            {locked ? (
                              <span className="text-xs">🔒</span>
                            ) : !isStarted ? (
                              <span className="text-xs text-gray-400">⏳</span>
                            ) : completed ? (
                              '✅'
                            ) : (
                              <span className={`text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border ${
                                isSelected ? 'border-white/40 text-white' : 'border-gray-300 text-gray-500'
                              }`}>
                                {les.order_index}
                              </span>
                            )}
                          </span>
                          <span className={`text-[10px] font-semibold truncate leading-tight ${!isStarted ? 'text-gray-450 italic' : ''}`}>
                            {les.title.replace(/^(Buổi \d+:\s*)/, '').replace(/^(Buổi \d+\s*-\s*)/, '')}{!isStarted && ' (Chưa mở)'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: All-in-one Lesson View */}
      <div className="lg:col-span-8 flex flex-col h-full bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Header & Metadata */}
        <div className="p-5 border-b border-gray-200 bg-gray-50 flex items-center gap-4">
          {activeLesson.start_date && (
            <div className="flex flex-col items-center justify-center border border-gray-200 rounded-xl px-3 py-2 min-w-[4rem] shrink-0 bg-white shadow-sm">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                {new Date(activeLesson.start_date).getDay() === 0 ? 'CN' : `THỨ ${new Date(activeLesson.start_date).getDay() + 1}`}
              </span>
              <span className="text-2xl font-black text-[#15333B] leading-none my-1">
                {new Date(activeLesson.start_date).getDate()}
              </span>
              <span className="text-[11px] font-bold text-[#214C54] uppercase">
                TH{new Date(activeLesson.start_date).getMonth() + 1}
              </span>
            </div>
          )}
          <div className="flex-1">
            {!started && (
              <span className="text-[9px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold uppercase mb-1 inline-block">
                ⏳ Lớp chưa bắt đầu
              </span>
            )}
            {isEditMode && draftLesson ? (
              <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200">
                <EditableText
                  value={draftLesson.title}
                  onSave={(newValue) => setDraftLesson({ ...draftLesson, title: newValue })}
                  className="text-sm font-extrabold text-[#15333B] leading-tight focus:ring-0 focus:border-none"
                  minRows={1}
                />
              </div>
            ) : (
              <h3 className="font-extrabold text-lg text-[#15333B] leading-tight">{activeLesson.title}</h3>
            )}
          </div>
        </div>

        {/* Lesson Body Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* Agenda */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">📋 Nội dung chính</h4>
            {isEditMode && draftLesson ? (
              <div className="space-y-1.5 w-full">
                <EditableText
                  value={draftLesson.content}
                  onSave={(newValue) => setDraftLesson({ ...draftLesson, content: newValue })}
                  className="text-xs text-[#3E5E63] w-full"
                  minRows={4}
                />
              </div>
            ) : agendaItems.length > 0 ? (
              <ul className="space-y-2.5 pl-5 list-disc text-xs text-[#3E5E63] font-semibold leading-relaxed">
                {agendaItems.map((item, idx) => (
                  <li key={idx} className="pl-0.5">
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-[#3E5E63] font-semibold leading-relaxed">{activeLesson.content}</p>
            )}
          </div>

          {/* Key Concepts */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">💡 Khái niệm cốt lõi</h4>
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
                    placeholder="Nhập khái niệm mới rồi nhấn Enter hoặc bấm Thêm..."
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
              <p className="text-xs text-[#3E5E63] italic">Chưa có khái niệm cốt lõi</p>
            )}
          </div>

          {/* Learning Materials */}
          <div className="space-y-3.5 pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">📚 Tài nguyên học tập</h4>
            
            {isEditMode && draftLesson ? (
              <div className="space-y-3 bg-amber-50/45 border border-amber-200/50 rounded-xl p-4 animate-fade-in w-full">
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

                {started && hasMaterials && activeLesson.video_url ? (
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
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">📝 Bài tập về nhà</h4>
            
            {isEditMode && draftAssignment ? (
              <div className="space-y-4">
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

                {/* Rubrics (Tiêu chí đánh giá) */}
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

                  <div className="pt-1.5 flex justify-start">
                    <button
                      type="button"
                      onClick={() => {
                        const newRubrics = [...(draftAssignment.rubric_checklist || []), { item: '', checked: false, is_optional: false }];
                        setDraftAssignment({ ...draftAssignment, rubric_checklist: newRubrics });
                      }}
                      className="text-[10px] text-[#214C54] font-black bg-white hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Thêm tiêu chí đánh giá
                    </button>
                  </div>

                  {/* Scaffolding Dynamic Items Editor */}
                  <div className="pt-4 border-t border-amber-200/50 space-y-3">
                    <span className="text-[10px] font-bold text-[#214C54] uppercase tracking-wide block">🔗 Tài liệu hỗ trợ học viên:</span>
                    
                    <div className="space-y-2">
                      {(draftAssignment.scaffolding?.items || getScaffoldingItems(draftAssignment)).map((item, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row gap-2 bg-white p-3 rounded-xl border border-gray-150 shadow-sm relative group">
                          <div className="flex-1">
                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Tên tài liệu:</label>
                            <input
                              type="text"
                              className="w-full border border-gray-150 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-[#214C54] font-semibold text-gray-700"
                              placeholder="Ví dụ: Template Mẫu (Google Sheets)"
                              value={item.label}
                              onChange={(e) => {
                                const list = [...(draftAssignment.scaffolding?.items || getScaffoldingItems(draftAssignment))];
                                list[idx] = { ...list[idx], label: e.target.value };
                                setDraftAssignment({ 
                                  ...draftAssignment, 
                                  scaffolding: { ...draftAssignment.scaffolding, items: list } 
                                });
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Đường dẫn liên kết (Link):</label>
                            <input
                              type="text"
                              className="w-full border border-gray-150 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-[#214C54] font-mono text-gray-600"
                              placeholder="https://..."
                              value={item.url}
                              onChange={(e) => {
                                const list = [...(draftAssignment.scaffolding?.items || getScaffoldingItems(draftAssignment))];
                                list[idx] = { ...list[idx], url: e.target.value };
                                setDraftAssignment({ 
                                  ...draftAssignment, 
                                  scaffolding: { ...draftAssignment.scaffolding, items: list } 
                                });
                              }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const list = (draftAssignment.scaffolding?.items || getScaffoldingItems(draftAssignment)).filter((_, i) => i !== idx);
                              setDraftAssignment({ 
                                ...draftAssignment, 
                                scaffolding: { ...draftAssignment.scaffolding, items: list } 
                              });
                            }}
                            className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-all cursor-pointer self-end sm:mb-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="pt-1.5 flex justify-start">
                      <button
                        type="button"
                        onClick={() => {
                          const currentItems = draftAssignment.scaffolding?.items || getScaffoldingItems(draftAssignment);
                          setDraftAssignment({ 
                            ...draftAssignment, 
                            scaffolding: { 
                              ...draftAssignment.scaffolding, 
                              items: [...currentItems, { label: '', url: '' }] 
                            } 
                          });
                        }}
                        className="text-[10px] text-[#214C54] font-black bg-white hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Thêm tài liệu hỗ trợ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Reading Mode: Normal assignment rendering */
              <>
                {!activeAssignment ? (
                  <div className="text-center py-6 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
                    <p className="text-xs text-[#3E5E63] font-bold">🎉 Buổi học này không có bài tập bắt buộc. Hãy thư giãn!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className={`p-4 rounded-xl border ${
                      started 
                        ? 'bg-gray-50 border-gray-200 text-[#15333B]' 
                        : 'bg-gray-50/50 border-gray-150 text-gray-400 cursor-not-allowed select-none'
                    }`}>
                      <p className="text-xs font-semibold leading-relaxed">{activeAssignment.description}</p>
                    </div>

                    {/* Checklists (Tiêu chí đánh giá) */}
                    <div className="space-y-3 w-full">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Tiêu chí đánh giá:</span>
                      <div className="space-y-3">
                        {activeAssignment.rubric_checklist.map((item, idx) => {
                          const isChecked = activeSubmission ? true : !!rubricSelfCheck[idx];

                          return (
                            <div 
                              key={idx}
                              onClick={() => {
                                if (started && !activeSubmission) handleSelfCheckToggle(idx);
                              }}
                              className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs transition-all ${
                                activeSubmission
                                  ? 'border-emerald-100 bg-emerald-50/20 text-[#15333B]'
                                  : started 
                                    ? 'border-gray-100 hover:bg-gray-50 cursor-pointer select-none' 
                                    : 'border-gray-100 text-gray-400 bg-gray-50/30 cursor-not-allowed select-none'
                              }`}
                            >
                              <input 
                                type="checkbox"
                                checked={isChecked}
                                disabled={!started || !!activeSubmission}
                                onChange={() => {}} // toggled by parent div click
                                className="mt-0.5 rounded border-gray-300 accent-[#214C54] cursor-pointer disabled:cursor-not-allowed w-4 h-4"
                              />
                              <div className="flex-1">
                                <span className={`font-semibold leading-relaxed ${isChecked && !activeSubmission ? 'text-gray-450 line-through italic' : 'text-[#3E5E63]'}`}>
                                  {item.item}
                                </span>
                                {item.is_optional && (
                                  <span className="text-[9px] bg-gray-100 text-gray-500 border border-gray-250 px-1.5 py-0.5 rounded font-bold uppercase ml-2 inline-block">
                                    Không bắt buộc
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Scaffolding Resources Links */}
                    <div className="p-4 bg-[#FDF5DA]/60 border border-[#FFD94C]/35 rounded-xl space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide block">Tài liệu hỗ trợ:</span>
                        {getScaffoldingItems(activeAssignment).filter(item => item.url).length === 0 && (
                          <span className="text-[9px] bg-amber-100 text-amber-800 border border-amber-250 px-1.5 py-0.5 rounded font-bold uppercase">
                            Không có
                          </span>
                        )}
                      </div>
                      {getScaffoldingItems(activeAssignment).filter(item => item.url).length > 0 && (
                        <div className="flex flex-col gap-2">
                          {getScaffoldingItems(activeAssignment).map((item, idx) => {
                            if (!item.url) return null;
                            return (
                              <a 
                                key={idx}
                                href={item.url}
                                target="_blank" 
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-[#214C54] hover:underline font-bold"
                              >
                                <LinkIcon className="w-3.5 h-3.5 text-amber-600" />
                                <span>{item.label || 'Tài liệu hỗ trợ'}</span>
                                <span className="text-[9px]">↗</span>
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Submission Flow States & Feedback */}
                    {activeSubmission ? (
                      <div className="space-y-4 pt-4 border-t border-gray-100">
                        <div className="bg-[#214C54]/5 border border-[#214C54]/20 p-4 rounded-xl space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-extrabold text-[#214C54] flex items-center gap-1.5">
                              ✅ ĐÃ NỘP BÀI THÀNH CÔNG
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold">
                              {new Date(activeSubmission.created_at).toLocaleString('vi-VN')}
                            </span>
                          </div>
                          <p className="text-xs text-[#3E5E63] font-mono break-all whitespace-pre-line bg-white/50 p-2.5 rounded border border-gray-100 leading-relaxed">
                            {activeSubmission.content}
                          </p>
                        </div>

                        {activeSubmission.status === 'graded' && activeFeedback ? (
                          <div className="bg-[#FDF5DA] border border-[#FFD94C] p-4 rounded-xl space-y-3 shadow-sm">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">👩‍🏫</span>
                                <div>
                                  <span className="text-xs font-black text-[#15333B] block">Đặng Tuyết Hồng (Mentor)</span>
                                  <span className="text-[9px] text-gray-400 font-bold block">Nhận xét bài nộp</span>
                                </div>
                              </div>
                              <span className={`badge-pill text-[9px] ${
                                activeFeedback.mastery_level === 'excellent' 
                                  ? 'badge-success' 
                                  : activeFeedback.mastery_level === 'meets_expectations' 
                                    ? 'badge-info' 
                                    : 'badge-danger'
                              }`}>
                                {activeFeedback.mastery_level === 'excellent' ? 'Xuất sắc ⭐' : activeFeedback.mastery_level === 'meets_expectations' ? 'Đạt chuẩn ✅' : 'Cần cải thiện ⚠️'}
                              </span>
                            </div>
                            <p className="text-xs text-[#3E5E63] leading-relaxed font-semibold bg-white/40 p-3 rounded-lg border border-[#FFD94C]/20 whitespace-pre-line">
                              {activeFeedback.content}
                            </p>
                          </div>
                        ) : (
                          <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex items-center gap-2">
                            <span className="animate-pulse">⏳</span>
                            <p className="text-xs text-[#3E5E63] font-bold">Đang chờ Mentor Đặng Tuyết Hồng kiểm tra và đánh giá Khung năng lực.</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Form to Submit */
                      <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-gray-100">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Bài Làm Của Bạn (Rich-text / URL):</label>
                          <textarea
                            value={submissionText}
                            disabled={!started}
                            onChange={(e) => setSubmissionText(e.target.value)}
                            placeholder={started ? "Dán đường link Google Doc chứa bài làm hoặc file sơ đồ của bạn kèm ghi chú..." : "Bài tập chưa mở. Bạn chỉ có thể nộp sau khi lớp học chính thức bắt đầu."}
                            className={`form-control h-28 text-xs font-mono resize-none leading-relaxed ${
                              !started ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' : ''
                            }`}
                            required
                          />
                        </div>

                        {started ? (
                          <button 
                            type="submit"
                            className="bg-[#214C54] hover:bg-[#15333B] text-white w-full text-xs font-black flex items-center justify-center gap-1.5 py-3 rounded-xl shadow-sm hover:shadow hover:-translate-y-0.5 transition-all transform active:scale-95 duration-200 select-none cursor-pointer"
                          >
                            <span className="text-xs">🚀</span>
                            <span>Nộp bài ngay</span>
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
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action Bar at the bottom of the page */}
      {isEditMode && (
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
