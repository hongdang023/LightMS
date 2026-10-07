import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCourse } from '../../context/CourseContext';
import { useGamification } from '../../context/GamificationContext';
import { PageHeader } from '../../components/PageHeader';
import type { Lesson } from '../../types/database';
import { EditableText } from '../../components/EditableText';
import { X, Save, Undo, Lightbulb, Key, Plus, BookOpen, ClipboardCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { LessonMaterials } from '../../components/syllabus/LessonMaterials';
import { LessonAssignmentSection } from '../../components/syllabus/LessonAssignmentSection';
import { LessonCard } from '../../components/syllabus/LessonCard';

export const SyllabusView: React.FC<{ 
  onPageChange?: (page: string) => void;
  isEditMode?: boolean;
}> = ({ isEditMode = false }) => {
  const { activeUser, users: profiles, setProfiles, updateProfile } = useAuth();
  const { lessons, isLessonsLoading, completeLesson, updateLesson, addLesson } = useCourse();
  const { nauticalTransactions, addNauticalMiles, unlockBadge } = useGamification();

  const filteredLessons = lessons;

  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  const [rubricSelfCheck, setRubricSelfCheck] = useState<{ [key: string]: boolean }>({});
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Local drafts for editable states when in Editing Mode (allows Cancel / Save)
  const [draftLesson, setDraftLesson] = useState<Lesson | null>(null);
  const [hasHomework, setHasHomework] = useState(false);
  const [newConceptInput, setNewConceptInput] = useState('');

  // State for Add Lesson Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonDate, setNewLessonDate] = useState('');

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

  const handleSave = async () => {
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
      const { error } = await updateLesson(draftLesson.id, updates);
      if (error) {
        showToast(`Lỗi khi lưu dữ liệu: ${error.message || 'Vui lòng thử lại!'}`);
      } else {
        showToast('Đã lưu mọi thay đổi thành công!');
      }
    }
  };

  const handleCancel = () => {
    if (activeLesson) {
      setDraftLesson({ ...activeLesson });
      setHasHomework(!!activeLesson.assignment_description);
      setNewConceptInput('');
      showToast('Đã hoàn tác các thay đổi chưa lưu.');
    }
  };

  // Checks if a lesson's scheduled date has arrived
  const isLessonStarted = (lesson: Lesson): boolean => {
    if (!lesson.start_date) return true;
    const start = new Date(lesson.start_date).getTime();
    const now = new Date().getTime();
    return now >= start;
  };

  // Checks if admin has uploaded at least one real learning material
  const hasLessonMaterials = (lesson: Lesson): boolean => {
    return !!(lesson.video_url?.trim() || lesson.slide_url?.trim() || lesson.study_note_url?.trim());
  };

  // Checks if a lesson is locked for students:
  // Locked when: (1) scheduled date hasn't arrived yet, OR (2) no materials uploaded
  // Admin always has full access.
  const isLessonLocked = (lesson: Lesson): boolean => {
    if (activeUser?.role === 'admin') return false;

    // Locked if the lesson hasn't started yet
    if (!isLessonStarted(lesson)) return true;

    // Locked if no learning materials have been uploaded yet
    if (!hasLessonMaterials(lesson)) return true;

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
      if (!window.confirm(`Bạn chưa tick chọn đủ các tiêu chí bắt buộc (${checkedRequiredCount}/${requiredRubrics.length}). Bạn vẫn muốn hoàn thành chứ?`)) {
        return;
      }
    }

    if (!evidenceUrl.trim()) {
      alert('Vui lòng nhập link bài viết Facebook nộp bài làm bằng chứng!');
      return;
    }

    // Award +50 Nautical Miles using addNauticalMiles & persist liveclass_tasks
    try {
      const res = await addNauticalMiles(
        activeUser.id,
        50,
        'assignment_graded',
        `Đã hoàn thành bài tập: ${activeLesson.title}. Link nộp bài: ${evidenceUrl.trim()}`,
        activeLesson.id,
        profiles,
        setProfiles
      );
      if (res && res.error) {
        alert(`Lỗi khi nộp bài vào cơ sở dữ liệu: ${res.error.message || 'Vui lòng kiểm tra quyền RLS'}`);
        return;
      }

      // Update liveclass_tasks in student profile on Supabase
      const updatedLiveTasks = {
        ...(activeUser.liveclass_tasks || {}),
        [activeLesson.id]: true,
        [`${activeLesson.id}_evidence_url`]: evidenceUrl.trim(),
        [`${activeLesson.id}_rubrics`]: rubricSelfCheck,
        [`${activeLesson.id}_completed_at`]: new Date().toISOString()
      };
      await updateProfile(activeUser.id, { liveclass_tasks: updatedLiveTasks });

      // Gamification badge checks
      if (unlockBadge) {
        // 1. Badge "Bài Tập Đầu Tay"
        unlockBadge(activeUser.id, 'bada0000-0000-0000-0000-000000000005', false, profiles, setProfiles);

        // Count total completed assignments
        const hwLessons = lessons.filter(l => !!l.assignment_description);
        const completedHwCount = hwLessons.filter(l => l.id === activeLesson.id || !!updatedLiveTasks[l.id]).length;

        // 2. Badge "Thủy Thủ Chăm Chỉ" (>= 3 homeworks)
        if (completedHwCount >= 3) {
          unlockBadge(activeUser.id, 'bada0000-0000-0000-0000-000000000006', false, profiles, setProfiles);
        }

        // 3. Badge "Thuyền Trưởng Gương Mẫu" (100% homeworks)
        if (hwLessons.length > 0 && completedHwCount >= hwLessons.length) {
          unlockBadge(activeUser.id, 'bada0000-0000-0000-0000-000000000007', false, profiles, setProfiles);
        }
      }

      completeLesson(activeLesson.id);
      showToast('Đã nộp bài tập và nhận +50 Hải lý thành công!');
    } catch (err: any) {
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
        .split(/\r?\n+/)
        .flatMap(line => {
          const trimmed = line.replace(/^[\s•*-]+/, '').trim();
          if (!trimmed) return [];
          // Split by sentence boundary (period + space + capital letter), avoiding file extensions like .md, .json, etc.
          return trimmed.split(/(?<=\b\w{2,}\.)\s+(?=[A-ZÀÁẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬĐÈÉẺẼẸÊẾỀỂỄỆÌÍỈĨỊÒÓỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÙÚỦŨỤƯỨỪỬỮỰỲÝỶỸỴ])/);
        })
        .map(item => item.replace(/^[\s•*-]+/, '').trim())
        .filter(item => item.length > 0 && !/^Buổi\s+\d+/i.test(item))
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



  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle.trim()) {
      alert('Vui lòng nhập tiêu đề buổi học!');
      return;
    }

    const nextOrder = filteredLessons.length + 1;
    const titleWithPrefix = newLessonTitle.trim().startsWith('Buổi') 
      ? newLessonTitle.trim() 
      : `Buổi ${nextOrder}: ${newLessonTitle.trim()}`;

    const res = await addLesson({
      title: titleWithPrefix,
      content: 'Nội dung chi tiết của buổi học đang được biên soạn.',
      video_url: '',
      order_index: nextOrder,
      start_date: newLessonDate ? new Date(newLessonDate).toISOString() : undefined,
      target: 'Mục tiêu của buổi học này.',
      has_materials: true,
      slide_url: '',
      study_note_url: '',
      key_concepts: [],
      supporting_resources: [],
      assignment_description: '',
      assignment_rubric_checklist: [],
    });

    if (res.error) {
      showToast('Có lỗi xảy ra khi tạo buổi học!');
    } else {
      showToast('Đã thêm buổi học mới thành công!');
      setIsAddModalOpen(false);
      setNewLessonTitle('');
      setNewLessonDate('');
      if (res.data) {
        setSelectedLessonId(res.data.id);
      }
    }
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

          {isEditMode && draftLesson ? (
            <div className="space-y-2 p-5 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <label className="text-xs font-black text-[#214C54] uppercase tracking-wider block">
                Tiêu đề buổi học
              </label>
              <EditableText
                value={draftLesson.title}
                onSave={(newValue) => setDraftLesson({ ...draftLesson, title: newValue })}
                className="text-xl font-black text-[#15333B] w-full"
              />
              <p className="text-xs text-gray-400 font-medium">
                Buổi học số {
                  draftLesson.title.match(/^Buổi\s+(\d+)/i) 
                    ? draftLesson.title.match(/^Buổi\s+(\d+)/i)![1] 
                    : (draftLesson.order_index - 1).toString()
                } - Khám phá các học phần và bài tập trên hải trình của bạn.
              </p>
            </div>
          ) : (
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
          )}

          {isLessonLocked(activeLesson) && !isEditMode && activeUser?.role !== 'admin' ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center space-y-3">
              {!isLessonStarted(activeLesson) ? (
                <>
                  <span className="text-4xl animate-bounce">⏳</span>
                  <h3 className="text-base font-black text-[#214C54]">Buổi học chưa diễn ra</h3>
                  <p className="text-xs text-gray-500 max-w-md leading-relaxed">
                    Nội dung buổi học sẽ mở vào ngày {activeLesson.start_date ? new Date(activeLesson.start_date).toLocaleDateString('vi-VN') : 'khai giảng'}. Vui lòng quay lại sau!
                  </p>
                </>
              ) : (
                <>
                  <span className="text-4xl">🔒</span>
                  <h3 className="text-base font-black text-[#214C54]">Học liệu chưa sẵn sàng</h3>
                  <p className="text-xs text-gray-500 max-w-md leading-relaxed">
                    Buổi học đã diễn ra nhưng giảng viên chưa upload học liệu (recording/slide/ghi chú). Vui lòng chờ thêm một chút!
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
            {/* Admin-only warning banners */}
            {activeUser?.role === 'admin' && !isLessonStarted(activeLesson) && (
              <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-3.5 flex items-center gap-3">
                <span className="text-lg shrink-0">⏳</span>
                <div className="text-xs text-amber-800">
                  <p className="font-bold">Buổi học chưa diễn ra đối với học viên</p>
                  <p className="text-[11px] text-amber-700 font-medium">
                    Học viên sẽ chỉ xem được nội dung này sau ngày {activeLesson.start_date ? new Date(activeLesson.start_date).toLocaleDateString('vi-VN') : 'khai giảng'}. Bạn có thể chuẩn bị sẵn slide, bài tập và học liệu ngay bây giờ.
                  </p>
                </div>
              </div>
            )}
            {activeUser?.role === 'admin' && isLessonStarted(activeLesson) && !hasLessonMaterials(activeLesson) && (
              <div className="bg-rose-50/60 border border-rose-200/60 rounded-xl p-3.5 flex items-center gap-3">
                <span className="text-lg shrink-0">🔒</span>
                <div className="text-xs text-rose-800">
                  <p className="font-bold">Học liệu chưa được upload — Học viên đang bị khoá</p>
                  <p className="text-[11px] text-rose-700 font-medium">
                    Buổi này đã diễn ra nhưng chưa có recording/slide/ghi chú. Thêm ít nhất 1 học liệu để mở khoá cho học viên.
                  </p>
                </div>
              </div>
            )}
            {/* Agenda */}
            <div className="space-y-2.5">
              <h4 className="text-sm font-black text-[#214C54] uppercase tracking-widest flex items-center gap-1.5">
                <BookOpen size={16} className="stroke-[1.5]" />
                <span>Nội dung chính</span>
              </h4>
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
              <h4 className="text-sm font-black text-[#214C54] uppercase tracking-widest flex items-center gap-1.5">
                <Lightbulb size={16} />
                <span>Khái niệm cốt lõi</span>
              </h4>
              {isEditMode && draftLesson ? (
                <div className="space-y-2.5 w-full">
                  <div className="flex flex-wrap gap-2 p-2 bg-gray-50 border border-gray-200 rounded-xl">
                    {(draftLesson.key_concepts || defaultKeyConcepts).map((concept, idx) => (
                      <span 
                        key={idx} 
                        className="inline-flex items-center gap-1.5 text-[10px] bg-amber-50 text-amber-800 border border-amber-200/50 rounded-lg px-2.5 py-1 font-extrabold"
                      >
                        <Key size={12} />
                        <span>{concept}</span>
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
                    <span key={idx} className="inline-flex items-center gap-1.5 text-[10px] bg-amber-50 text-amber-800 border border-amber-200/50 rounded-lg px-2.5 py-1 font-extrabold">
                      <Key size={12} />
                      <span>{concept}</span>
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

            {/* Survey Section (Hidden for Kick-off Meeting & Pitching Day) */}
            {!(
              (activeLesson.title && /kick-off|pitching/i.test(activeLesson.title)) ||
              (activeLesson.id && /kick-off|pitching/i.test(activeLesson.id))
            ) && (
              <div className="border-t border-gray-100 pt-6 space-y-3">
                <h4 className="text-sm font-black text-[#214C54] uppercase tracking-widest flex items-center gap-1.5">
                  <ClipboardCheck size={16} className="stroke-[1.5]" />
                  <span>Khảo sát buổi học</span>
                </h4>
                <p className="text-xs text-slate-500 leading-normal">
                  Hãy dành 1 phút để giúp chúng tôi cải thiện chất lượng giảng dạy cho các buổi học sau nhé.
                </p>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSdF81_cCcZU68_t9OzCMce2BN_Q3sWs8sODHsTs0g6YP6BpGQ/viewform"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#724AE8] hover:bg-[#5b37c7] text-white text-xs font-black rounded-xl w-full sm:w-auto shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer"
                >
                  <ClipboardCheck size={14} className="stroke-[1.5]" />
                  <span>Điền Form Khảo Sát Buổi Học</span>
                </a>
              </div>
            )}
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
            action={
              (isEditMode || activeUser?.role === 'admin') ? (
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => setIsAddModalOpen(true)}
                >
                  Thêm buổi học
                </Button>
              ) : undefined
            }
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

      {/* Modal: Thêm buổi học mới */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-scale-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-black text-[#15333B] flex items-center gap-2">
                <Plus size={18} className="stroke-[1.5]" />
                <span>Thêm buổi học mới</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLesson} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#214C54] block mb-1.5">
                  Tên / Chủ đề buổi học <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Xây dựng Knowledge Graph thông minh"
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54] font-medium"
                />
                <span className="text-[10px] text-gray-400 block mt-1">
                  Hệ thống sẽ tự động thêm tiền tố "Buổi {filteredLessons.length + 1}:" nếu bạn không nhập.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-[#214C54] block mb-1.5">
                  Ngày bắt đầu / Dự kiến mở
                </label>
                <input
                  type="date"
                  value={newLessonDate}
                  onChange={(e) => setNewLessonDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54] font-medium"
                />
                <span className="text-[10px] text-gray-400 block mt-1">
                  Để trống nếu muốn mở ngay lập tức cho học viên.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Tạo buổi học
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Action Bar at the bottom of the page */}
      {isEditMode && selectedLessonId && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 py-3 px-6 shadow-lg z-40 flex items-center justify-end gap-3 transition-all duration-200 animate-slide-up">
          <span className="text-xs text-amber-700 font-bold mr-auto hidden sm:inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200/50 px-3 py-1.5 rounded-xl">
            <AlertCircle size={14} className="stroke-[1.5]" />
            <span>Bạn đang ở chế độ chỉnh sửa. Nhớ lưu lại các nội dung đã thay đổi!</span>
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
          <CheckCircle2 size={16} className="text-amber-400 stroke-[1.5]" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}
    </div>
  );
};
