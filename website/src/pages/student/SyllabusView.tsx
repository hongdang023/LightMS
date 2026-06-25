import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { PageHeader } from '../../components/PageHeader';
import type { Lesson } from '../../context/DatabaseContext';
import { EditableText } from '../../components/EditableText';

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
  const [toastMsg, _setToastMsg] = useState<string | null>(null);

  const activeLesson = lessons.find(l => l.id === selectedLessonId) || lessons[0];
  const activeAssignment = assignments.find(a => a.lesson_id === activeLesson.id);
  const activeSubmission = submissions.find(s => s.assignment_id === activeAssignment?.id && s.student_id === activeUser.id);
  const activeFeedback = feedbacks.find(f => f.submission_id === activeSubmission?.id);

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

    // Check if rubrics are completed (Self-evaluation check warning)
    const totalRubrics = activeAssignment.rubric_checklist.length;
    const checkedCount = Object.values(rubricSelfCheck).filter(Boolean).length;
    if (checkedCount < totalRubrics) {
      if (!window.confirm(`⚠️ Bạn chưa tick chọn đủ các tiêu chí tự đánh giá (${checkedCount}/${totalRubrics}). Bạn vẫn muốn nộp chứ?`)) {
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in select-none">
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
      {/* Left Column: Syllabus Tree (5 cols) */}
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

      {/* Right Column: All-in-one Lesson View (8 cols) */}
      <div className="lg:col-span-8 flex flex-col h-full bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Header & Metadata (Tên buổi học & Thời gian) */}
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
            {isEditMode ? (
              <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200">
                <EditableText
                  value={activeLesson.title}
                  onSave={(newValue) => updateLesson(activeLesson.id, { title: newValue })}
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
          {/* Agenda / Nội dung chính */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">📋 Nội dung chính</h4>
            {isEditMode ? (
              <div className="space-y-1.5 w-full">
                <p className="text-[10px] text-amber-600 font-bold">💡 Bạn đang chỉnh sửa Nội dung chính (mỗi dòng hoặc dấu chấm câu tạo thành một đầu mục):</p>
                <EditableText
                  value={activeLesson.content}
                  onSave={(newValue) => updateLesson(activeLesson.id, { content: newValue })}
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
          {agendaItems.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">💡 Key Concepts</h4>
              <div className="flex flex-wrap gap-2">
                {agendaItems.slice(0, 3).map((item, idx) => (
                  <span key={idx} className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200/50 rounded-lg px-2.5 py-1 font-extrabold">
                    🔑 {item.split(':')[0].split(' - ')[0].split(' vs ')[0]}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Learning Materials (Link slide & Link Study Note & Video Recording) */}
          <div className="space-y-3.5 pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">📚 Tài nguyên học tập (Learning Materials)</h4>
            
            {/* CTA Buttons row (Slide + Study Note + Video) */}
            {isEditMode ? (
              <div className="space-y-3 bg-amber-50/45 border border-amber-200/50 rounded-xl p-4 animate-fade-in w-full">
                <p className="text-[10px] text-[#214C54] font-black uppercase tracking-wider">🔗 Cấu hình link tài nguyên học tập:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 block mb-1">Slide Bài Giảng URL:</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#214C54] bg-white font-mono"
                      placeholder="https://..."
                      value={activeLesson.slide_url || ''}
                      onChange={(e) => updateLesson(activeLesson.id, { slide_url: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 block mb-1">Study Note URL:</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#214C54] bg-white font-mono"
                      placeholder="https://..."
                      value={activeLesson.study_note_url || ''}
                      onChange={(e) => updateLesson(activeLesson.id, { study_note_url: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 block mb-1">Video Recording URL:</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#214C54] bg-white font-mono"
                      placeholder="https://..."
                      value={activeLesson.video_url || ''}
                      onChange={(e) => updateLesson(activeLesson.id, { video_url: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* CTA Buttons row (Slide + Study Note + Video) */
              <div className="flex flex-wrap gap-2.5">
                {/* Slide Bài Giảng */}
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
                    title="Chưa có link slide"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-200 text-gray-400 text-xs font-black cursor-not-allowed select-none"
                  >
                    <span>📄</span>
                    <span>Slide Bài Giảng</span>
                  </button>
                )}

                {/* Study Note */}
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
                    title="Chưa có link study note"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-200 text-gray-400 text-xs font-black cursor-not-allowed select-none"
                  >
                    <span>📝</span>
                    <span>Study Note</span>
                  </button>
                )}

                {/* Video Recording */}
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
                    title="Video chưa được mở"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-200 text-gray-400 text-xs font-black cursor-not-allowed select-none"
                  >
                    <span>🔒</span>
                    <span>Video Recording</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Assignments, Tasks & Submissions (BTVN & Tài liệu hỗ trợ làm BTVN) */}
          <div className="border-t border-gray-100 pt-6 space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">📝 Bài tập về nhà (Action Item)</h4>
            
            {!activeAssignment ? (
              <div className="text-center py-6 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
                <p className="text-xs text-[#3E5E63] font-bold">🎉 Buổi học này không có bài tập bắt buộc. Hãy thư giãn!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {isEditMode ? (
                  <div className="p-4 bg-amber-50/40 border border-amber-200/50 rounded-xl w-full">
                    <p className="text-[10px] text-[#214C54] font-black uppercase tracking-wider mb-2">📝 Yêu cầu bài tập:</p>
                    <EditableText
                      value={activeAssignment.description}
                      onSave={(newValue) => updateAssignment(activeAssignment.id, { description: newValue })}
                      className="text-xs text-[#15333B]"
                      minRows={2}
                    />
                  </div>
                ) : (
                  /* Assignment description card (BTVN) */
                  <div className={`p-4 rounded-xl border ${
                    started 
                      ? 'bg-gray-50 border-gray-200 text-[#15333B]' 
                      : 'bg-gray-50/50 border-gray-150 text-gray-400 cursor-not-allowed select-none'
                  }`}>
                    <p className="text-xs font-semibold leading-relaxed">{activeAssignment.description}</p>
                  </div>
                )}

                {/* Sub-Tasks & Nested resources details (Tài liệu hỗ trợ làm BTVN) */}
                <div className="space-y-3 w-full">
                  {isEditMode ? (
                    <div className="space-y-3 bg-amber-50/40 border border-amber-200/50 p-4 rounded-xl w-full">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#214C54] uppercase tracking-wider">📋 Tiêu chí đánh giá & Nhiệm vụ:</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newRubrics = [...activeAssignment.rubric_checklist, { item: 'Nhiệm vụ mới', checked: false }];
                            updateAssignment(activeAssignment.id, { rubric_checklist: newRubrics });
                          }}
                          className="text-[10px] text-[#214C54] font-black bg-white hover:bg-gray-50 border border-gray-200 px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                        >
                          ➕ Thêm nhiệm vụ
                        </button>
                      </div>
                      <div className="space-y-2">
                        {activeAssignment.rubric_checklist.map((item, idx) => (
                          <div key={idx} className="flex gap-2 items-center bg-white p-2 rounded-xl border border-gray-150">
                            <span className="text-xs text-gray-400 font-bold shrink-0">Nhiệm vụ {idx + 1}:</span>
                            <input
                              type="text"
                              className="flex-1 border border-gray-150 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-[#214C54]"
                              value={item.item}
                              onChange={(e) => {
                                const newRubrics = [...activeAssignment.rubric_checklist];
                                newRubrics[idx] = { ...newRubrics[idx], item: e.target.value };
                                updateAssignment(activeAssignment.id, { rubric_checklist: newRubrics });
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newRubrics = activeAssignment.rubric_checklist.filter((_, i) => i !== idx);
                                updateAssignment(activeAssignment.id, { rubric_checklist: newRubrics });
                              }}
                              className="text-red-500 hover:text-red-700 p-1 font-bold text-xs cursor-pointer"
                            >
                              ❌
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Scaffolding URLs editor */}
                      <div className="pt-3 border-t border-amber-200/50 space-y-2">
                        <span className="text-[9px] font-bold text-[#214C54] uppercase tracking-wide block">🔗 Link hỗ trợ làm bài tập (Scaffolding):</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[9px] text-gray-500 font-bold block mb-1">Template Mẫu (Google Sheets) URL:</label>
                            <input
                              type="text"
                              className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#214C54] bg-white font-mono"
                              placeholder="https://..."
                              value={activeAssignment.scaffolding?.template_url || ''}
                              onChange={(e) => {
                                const scaffolding = { ...activeAssignment.scaffolding, template_url: e.target.value };
                                updateAssignment(activeAssignment.id, { scaffolding });
                              }}
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-gray-500 font-bold block mb-1">Bài Làm Mẫu Tham Khảo URL:</label>
                            <input
                              type="text"
                              className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#214C54] bg-white font-mono"
                              placeholder="https://..."
                              value={activeAssignment.scaffolding?.reference_link || ''}
                              onChange={(e) => {
                                const scaffolding = { ...activeAssignment.scaffolding, reference_link: e.target.value };
                                updateAssignment(activeAssignment.id, { scaffolding });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Reading Mode: Checklist of Tasks */
                    <>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Danh sách Nhiệm vụ (Task List):</span>
                      <div className="space-y-3">
                        {activeAssignment.rubric_checklist.map((item, idx) => {
                          const isTask1 = idx === 0;
                          const hasTemplate = isTask1 && activeAssignment.scaffolding?.template_url;
                          const hasReference = isTask1 && activeAssignment.scaffolding?.reference_link;
                          const isChecked = activeSubmission ? true : !!rubricSelfCheck[idx];

                          return (
                            <div key={idx} className="space-y-2">
                              <div 
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
                                  <span className={`font-black block text-[#15333B] mb-0.5 ${isChecked && !activeSubmission ? 'text-gray-400 line-through' : ''}`}>
                                    Nhiệm vụ {idx + 1}:
                                  </span>
                                  <span className={`font-semibold leading-relaxed ${isChecked && !activeSubmission ? 'text-gray-450 line-through italic' : 'text-[#3E5E63]'}`}>
                                    {item.item}
                                  </span>
                                </div>
                              </div>

                              {/* Nested Contextual Resources directly under respective task */}
                              {(hasTemplate || hasReference) && (
                                <div className="ml-7 p-3 bg-[#FDF5DA]/60 border border-[#FFD94C]/35 rounded-xl space-y-1.5">
                                  <span className="text-[9px] font-bold text-amber-800 uppercase tracking-wide block">Tài liệu hỗ trợ làm BTVN:</span>
                                  {hasTemplate && (
                                    <a 
                                      href={activeAssignment.scaffolding.template_url}
                                      target="_blank" 
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1.5 text-[11px] text-[#214C54] hover:underline font-bold"
                                    >
                                      <span>📋 Template Mẫu (Google Sheets)</span>
                                      <span className="text-[9px]">🔗</span>
                                    </a>
                                  )}
                                  {hasReference && (
                                    <a 
                                      href={activeAssignment.scaffolding.reference_link}
                                      target="_blank" 
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1.5 text-[11px] text-[#214C54] hover:underline font-bold"
                                    >
                                      <span>🔗 Bài làm mẫu tham khảo</span>
                                      <span className="text-[9px]">🔗</span>
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                {/* Submission Flow States & Feedback */}
                {activeSubmission ? (
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    {/* Submitted details */}
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

                    {/* Feedback details */}
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
                    {/* Submission text field */}
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
          </div>
        </div>
      </div>

      {/* Floating Success Toast notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#15333B] border border-amber-400 text-white px-4 py-3 rounded-xl shadow-xl animate-fade-in flex items-center gap-2">
          <span className="text-base">✨</span>
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}
    </div>
  );
};
