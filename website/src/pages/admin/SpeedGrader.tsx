import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { PageHeader } from '../../components/PageHeader';
import { GraduationCap } from 'lucide-react';
import type { Submission } from '../../context/DatabaseContext';

export const SpeedGrader: React.FC = () => {
  const { 
    submissions, 
    users, 
    assignments, 
    lessons, 
    feedbacks,
    gradeSubmission, 
    addNotification 
  } = useDatabase();

  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [filterPending, setFilterPending] = useState(true);
  
  // Grading form states
  const [feedbackText, setFeedbackText] = useState('');
  const [rubricGrades, setRubricGrades] = useState<{ [key: string]: boolean }>({});
  const [masteryLevel, setMasteryLevel] = useState<'needs_improvement' | 'meets_expectations' | 'excellent'>('meets_expectations');

  // Filter submissions
  const visibleSubs = submissions.filter(s => {
    if (filterPending) {
      return s.status === 'submitted';
    }
    return true; // show all
  });

  const activeSub = submissions.find(s => s.id === selectedSubId);
  const activeStudent = activeSub ? users.find(u => u.id === activeSub.student_id) : null;
  const activeAssignment = activeSub ? assignments.find(a => a.id === activeSub.assignment_id) : null;
  const activeLesson = activeAssignment ? lessons.find(l => l.id === activeAssignment.lesson_id) : null;
  const activeFeedback = activeSub ? feedbacks.find(f => f.submission_id === activeSub.id) : null;

  const handleSelectSub = (sub: Submission) => {
    setSelectedSubId(sub.id);
    
    // Check if feedback exists (already graded)
    const fb = feedbacks.find(f => f.submission_id === sub.id);
    if (fb) {
      setFeedbackText(fb.content);
      setMasteryLevel(fb.mastery_level);
      // Pre-fill rubrics as checked if graded
      const assg = assignments.find(a => a.id === sub.assignment_id);
      const initialRubrics: typeof rubricGrades = {};
      assg?.rubric_checklist.forEach((_, idx) => {
        initialRubrics[idx] = true;
      });
      setRubricGrades(initialRubrics);
    } else {
      // Reset form for fresh grading
      setFeedbackText('');
      setRubricGrades({});
      setMasteryLevel('meets_expectations');
    }
  };

  const toggleRubricCheck = (idx: number) => {
    if (activeSub?.status === 'graded') return; // Read-only if graded
    setRubricGrades(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSub || !feedbackText.trim()) return;

    gradeSubmission(activeSub.id, feedbackText, masteryLevel);
    
    addNotification('Chấm bài hoàn tất', 'Kết quả đánh giá và tích lũy hải lý đã được gửi tới học viên.', 'system');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-fade-in select-none overflow-hidden space-y-6">
      <PageHeader
        title="SpeedGrader"
        description="Chấm điểm và phản hồi bài tập của học viên."
        icon={<GraduationCap size={32} strokeWidth={1.5} />}
      />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
      
      {/* Left Column: Submissions queue (5 cols) */}
      <div className="lg:col-span-5 flex flex-col h-full bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        
        {/* Header Controls */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-sm text-[#15333B] uppercase tracking-wider">Hộp bài nộp chấm điểm</h3>
            <p className="text-[10px] text-[#3E5E63] font-semibold mt-0.5">Lọc danh sách bài làm của học viên.</p>
          </div>

          <div className="flex bg-white border border-gray-200 rounded-lg p-0.5 text-[10px]">
            <button
              onClick={() => setFilterPending(true)}
              className={`px-2.5 py-1.5 rounded font-bold transition-all ${
                filterPending ? 'bg-[#214C54] text-white' : 'text-gray-400'
              }`}
            >
              Chưa chấm
            </button>
            <button
              onClick={() => setFilterPending(false)}
              className={`px-2.5 py-1.5 rounded font-bold transition-all ${
                !filterPending ? 'bg-[#214C54] text-white' : 'text-gray-400'
              }`}
            >
              Tất cả
            </button>
          </div>
        </div>

        {/* Submissions List queue */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {visibleSubs.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <span className="text-3xl">🛟</span>
              <p className="text-xs text-gray-400 font-semibold italic">Không có bài nộp nào phù hợp bộ lọc.</p>
            </div>
          ) : (
            visibleSubs.map((sub) => {
              const student = users.find(u => u.id === sub.student_id);
              const assg = assignments.find(a => a.id === sub.assignment_id);
              const les = assg ? lessons.find(l => l.id === assg.lesson_id) : null;
              const isSelected = sub.id === selectedSubId;

              return (
                <div
                  key={sub.id}
                  onClick={() => handleSelectSub(sub)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected 
                      ? 'bg-[#214C54]/5 border-[#214C54] shadow-sm'
                      : 'bg-white border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img 
                      src={student?.avatar_url} 
                      alt={student?.full_name} 
                      className="w-8 h-8 rounded-full object-cover border border-gray-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-[#15333B] block leading-tight truncate">{student?.full_name}</span>
                      <span className="text-[9px] text-[#3E5E63] font-bold block truncate mt-0.5">{les?.title}</span>
                      <span className="text-[8px] text-gray-400 font-bold block mt-0.5">
                        {new Date(sub.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 select-none">
                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                      sub.status === 'graded' ? 'bg-green-150 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {sub.status === 'graded' ? 'Graded' : 'Pending'}
                    </span>
                    <span className="text-gray-300">▶</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: SpeedGrader details pane (7 cols) */}
      <div className="lg:col-span-7 flex flex-col h-full bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {!activeSub ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
            <span className="text-5xl">✅</span>
            <div>
              <h4 className="font-extrabold text-sm text-[#15333B]">Chọn bài nộp để chấm điểm</h4>
              <p className="text-xs text-gray-400 max-w-xs mt-1">Bấm vào bất kỳ bài nộp nào ở danh sách bên trái để mở rộng chi tiết bài làm, rubric chấm điểm và feedback.</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Header info */}
            <div className="p-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={activeStudent?.avatar_url} 
                  alt={activeStudent?.full_name} 
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <h4 className="font-extrabold text-xs text-[#15333B]">{activeStudent?.full_name}</h4>
                  <p className="text-[10px] text-gray-400">{activeStudent?.gmail} • Bài làm {activeLesson?.title}</p>
                </div>
              </div>
            </div>

            {/* Scrollable details */}
            <form onSubmit={handleGradeSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              
              {/* Submission Work Content */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Bài làm học viên:</span>
                <div className="text-xs text-[#3E5E63] font-mono leading-relaxed bg-gray-50 border border-gray-150 p-4 rounded-xl whitespace-pre-line break-all">
                  {activeSub.content}
                </div>
              </div>

              {/* Rubric evaluation checkboxes */}
              {activeAssignment && (
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Rubric Đánh Giá (Tick kiểm tra):</span>
                  <div className="space-y-1.5">
                    {activeAssignment.rubric_checklist.map((item, idx) => {
                      const isChecked = !!rubricGrades[idx];
                      const isGraded = activeSub.status === 'graded';
                      return (
                        <div
                          key={idx}
                          onClick={() => toggleRubricCheck(idx)}
                          className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs select-none ${
                            isGraded 
                              ? 'bg-gray-50/50 border-gray-100 text-gray-400 cursor-default'
                              : 'border-gray-100 hover:bg-gray-50 cursor-pointer text-[#3E5E63]'
                          }`}
                        >
                          <button type="button" className="mt-0.5 text-[#214C54]">
                            {isChecked ? <span>☑️</span> : <span>⬜</span>}
                          </button>
                          <span className="font-semibold">{item.item}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Feedback Editor & Grade Selection */}
              <div className="border-t border-gray-100 pt-6 space-y-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Đánh giá của Mentor:</span>
                
                {activeSub.status === 'graded' && activeFeedback ? (
                  /* Graded View */
                  <div className="p-4 bg-gray-50 border rounded-xl space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-extrabold text-[#15333B]">Bài nộp đã đánh giá xong</span>
                      <span className={`badge-pill text-[9px] ${
                        activeFeedback.mastery_level === 'excellent' ? 'badge-success' : 'badge-info'
                      }`}>
                        {activeFeedback.mastery_level === 'excellent' ? 'Xuất sắc ⭐' : 'Đạt chuẩn ✅'}
                      </span>
                    </div>
                    <p className="text-xs text-[#3E5E63] font-semibold leading-relaxed bg-white p-3 rounded border border-gray-100 whitespace-pre-line">
                      {activeFeedback.content}
                    </p>
                  </div>
                ) : (
                  /* Grading Form Inputs */
                  <div className="space-y-4">
                    <div className="form-group">
                      <label className="form-label">Chọn mức độ thành thạo (Mastery Level)</label>
                      <select
                        value={masteryLevel}
                        onChange={(e) => setMasteryLevel(e.target.value as any)}
                        className="form-control text-xs font-semibold"
                        required
                      >
                        <option value="needs_improvement">Cần cải thiện (Needs Improvement) • +100 HL</option>
                        <option value="meets_expectations">Đạt yêu cầu (Meets Expectations) • +100 HL</option>
                        <option value="excellent">Xuất sắc (Excellent / Mastery) • +150 HL • Tự động ghim 🌟</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Nhận xét chi tiết (Feedback Rich-text)</label>
                      <textarea
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Hãy nhận xét theo nguyên tắc Bánh mì kẹp thịt: Khen ngợi -> Chỉ lỗi cần sửa -> Định hướng giải pháp..."
                        className="form-control h-28 text-xs font-medium leading-relaxed"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-accent w-full text-xs font-extrabold flex items-center justify-center gap-1.5"
                    >
                      <span>🚀</span>
                      <span>Hoàn tất chấm điểm & Thưởng Hải lý</span>
                    </button>
                  </div>
                )}
              </div>

            </form>
          </div>
        )}
      </div>

    </div>
    </div>
  );
};
