import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCourse } from '../../context/CourseContext';
import { useGamification } from '../../context/GamificationContext';
import { PageHeader } from '../../components/PageHeader';
import type { Lesson } from '../../types/database';
import { EditableText } from '../../components/EditableText';
import { X, Save, Undo } from 'lucide-react';
import { LessonMaterials } from '../../components/syllabus/LessonMaterials';
import { LessonAssignmentSection } from '../../components/syllabus/LessonAssignmentSection';
import { LessonCard } from '../../components/syllabus/LessonCard';

export const SyllabusView: React.FC<{ 
  onPageChange?: (page: string) => void;
  isEditMode?: boolean;
}> = ({ isEditMode = false }) => {
  const { activeUser, setProfiles } = useAuth();
  const { lessons, isLessonsLoading, completeLesson, updateLesson } = useCourse();
  const { nauticalTransactions, addNauticalMiles } = useGamification();

  const filteredLessons = lessons;

  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  const [rubricSelfCheck, setRubricSelfCheck] = useState<{ [key: string]: boolean }>({});
  const [evidenceUrl, setEvidenceUrl] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
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

    if (!evidenceUrl.trim()) {
      alert('Vui lòng nhập link bài viết Facebook nộp bài làm bằng chứng!');
      return;
    }

    // Award +50 Nautical Miles using addNauticalMiles
    try {
      await addNauticalMiles(
        activeUser.id,
        50,
        'assignment_graded',
        `Đã hoàn thành bài tập: ${activeLesson.title}. Link nộp bài: ${evidenceUrl.trim()}`,
        activeLesson.id,
        [],
        setProfiles
      );
      completeLesson(activeLesson.id);
      showToast('Đã nộp bài tập và nhận +50 Hải lý thành công! 🚀');
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi nộp bài tập. Vui lòng thử lại!');
    }
  };

  const isLessonCompletedByStudent = (lessonId: string): boolean => {
    return (nauticalTransactions || []).some(
      t => t.student_id === activeUser?.id &&
           (t.action_type === 'lesson_complete' || t.action_type === 'assignment_graded') &&
           t.reference_id === lessonId
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
            <LessonMaterials
              lesson={activeLesson}
              isEditMode={isEditMode}
              draftLesson={draftLesson}
              setDraftLesson={setDraftLesson}
              isLessonStarted={isLessonStarted(activeLesson)}
              onCompleteLesson={completeLesson}
            />

            {/* Assignments / Checklists */}
            <LessonAssignmentSection
              activeLesson={activeLesson}
              isEditMode={isEditMode}
              draftLesson={draftLesson}
              setDraftLesson={setDraftLesson}
              hasHomework={hasHomework}
              setHasHomework={setHasHomework}
              isLessonCompletedByStudent={isLessonCompletedByStudent}
              rubricSelfCheck={rubricSelfCheck}
              handleSelfCheckToggle={handleSelfCheckToggle}
              handleSubmit={handleSubmit}
              evidenceUrl={evidenceUrl}
              setEvidenceUrl={setEvidenceUrl}
            />
            </div>
          )}
        </div>
      ) : (
        // Roadmap View (List of all lessons)
        <div className="space-y-6">
          <PageHeader
            title="Lộ trình học tập"
            description="Lộ trình chi tiết theo từng buổi học. Hoàn thành bài tập để mở khóa buổi tiếp theo và tích lũy Hải lý."
            helpTitle="Lộ trình học tập"
            helpSummary="Danh sách toàn bộ các buổi học trong khóa học."
            helpPurpose="Theo dõi tiến độ, xem bài học đã mở và hoàn thành các thử thách."
          />

          <div className="space-y-3">
            {isLessonsLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="p-5 bg-white border border-gray-200 rounded-2xl animate-pulse flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
              ))
            ) : (
              filteredLessons.map((les) => (
                <LessonCard
                  key={les.id}
                  lesson={les}
                  locked={isLessonLocked(les)}
                  completed={isLessonCompletedByStudent(les.id)}
                  isStarted={isLessonStarted(les)}
                  onSelectLesson={(id) => {
                    setSelectedLessonId(id);
                    setRubricSelfCheck({});
                    setEvidenceUrl('');
                  }}
                />
              ))
            )}
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
