import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCommunity } from '../../context/CommunityContext';
import { useGamification } from '../../context/GamificationContext';
import { PageHeader } from '../../components/PageHeader';
import { ChevronLeft, Plus, ClipboardList, Target, CheckCircle2, Mail } from 'lucide-react';
import { EditableText } from '../../components/EditableText';
import type { OnboardingDay } from '../../types/database';
import { 
  DAY_VISUAL_STYLES,
  renderRichText
} from '../../data/onboardingVisuals';
import { DayCard } from '../../components/onboarding/DayCard';
import { TaskEditRow } from '../../components/onboarding/TaskEditRow';
import { EmailTemplateModal } from '../../components/onboarding/EmailTemplateModal';

interface OnboardingViewProps {
  isEditMode?: boolean;
  onPageChange?: (page: string) => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ isEditMode = false, onPageChange }) => {
  const { activeUser, users: profiles, updateProfile } = useAuth();
  const { onboardingDays, updateOnboardingDay, addNotification } = useCommunity();
  const { addNauticalMiles, nauticalTransactions } = useGamification();

  // Email template config modal states
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailModalDay, setEmailModalDay] = useState<OnboardingDay | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleOpenEmailModal = (dayData: OnboardingDay) => {
    setEmailModalDay(dayData);
    setIsEmailModalOpen(true);
  };

  const handleSaveEmailTemplate = async (subject: string, body: string) => {
    if (!emailModalDay) return;
    await updateOnboardingDay(emailModalDay.day, {
      email_subject: subject,
      email_body: body
    });
  };



  // Track selected Day view and current view mode
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');

  // Load checklist checked state from localStorage and database (DB is Source of Truth if not empty)
  const [checkedTasks, setCheckedTasks] = useState<{ [key: string]: boolean }>(() => {
    const db = activeUser?.onboarding_tasks;
    if (db && Object.keys(db).length > 0) {
      return db;
    }
    const saved = localStorage.getItem('lms_onboarding_tasks_v2');
    return saved ? JSON.parse(saved) : {};
  });

  // Sync from DB if updated elsewhere (DB is Source of Truth)
  useEffect(() => {
    if (activeUser?.onboarding_tasks && Object.keys(activeUser.onboarding_tasks).length > 0) {
      setCheckedTasks(activeUser.onboarding_tasks);
      localStorage.setItem('lms_onboarding_tasks_v2', JSON.stringify(activeUser.onboarding_tasks));
    }
  }, [activeUser?.onboarding_tasks]);

  // Auto sync local tasks to database on mount ONLY IF database is empty (no onboarding tasks at all)
  useEffect(() => {
    if (activeUser?.id) {
      const db = activeUser.onboarding_tasks || {};
      if (Object.keys(db).length === 0) {
        const saved = localStorage.getItem('lms_onboarding_tasks_v2');
        const local = saved ? JSON.parse(saved) : {};
        if (Object.keys(local).length > 0) {
          updateProfile(activeUser.id, { onboarding_tasks: local });
        }
      }
    }
  }, [activeUser?.id]);


  // Helper to extract clean task items from day checklist markdown
  const getTasksForDay = (dayData: OnboardingDay) => {
    const lines = dayData.checklist.split('\n');
    const tasks: { idx: number; label: string; key: string; isOptional: boolean; optionalNote: string }[] = [];
    let taskIdx = 0;
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('- [ ]')) {
        taskIdx++;
        const rawLabel = trimmed.replace('- [ ]', '').trim();
        // Detect optional and extract the note after it
        const optionalMatch = rawLabel.match(/\(optional[^)]*\)/i);
        const isOptional = !!optionalMatch;
        const optionalNote = optionalMatch ? optionalMatch[0].replace(/^\(optional\s*[-–]?\s*/i, '').replace(/\)$/, '').trim() : '';
        const cleanLabel = rawLabel.replace(/\(optional[^)]*\)/i, '').trim().replace(/^[-–:]+\s*/, '').trim();
        tasks.push({
          idx: taskIdx,
          label: cleanLabel,
          key: `day-${dayData.day}-task-${taskIdx}`,
          isOptional,
          optionalNote
        });
      } else if (tasks.length > 0 && line.length > 0) {
        tasks[tasks.length - 1].label += '\n' + line;
      }
    });
    return tasks;
  };

  const isDayCompleted = (day: number) => {
    const dayData = onboardingDays.find(d => d.day === day);
    if (!dayData) return false;
    const tasks = getTasksForDay(dayData);
    if (tasks.length === 0) return true;
    // Only check required tasks (non-optional ones)
    const requiredTasks = tasks.filter(t => !t.label.toLowerCase().includes('optional'));
    if (requiredTasks.length === 0) return true;
    return requiredTasks.every(t => checkedTasks[t.key]);
  };



  const handleDayCardClick = (day: number) => {
    setSelectedDay(day);
    setViewMode('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleTask = (day: number, taskIdx: number, label: string) => {
    const key = `day-${day}-task-${taskIdx}`;
    
    if (day === 1 && label.includes('giới thiệu bản thân') && !activeUser.is_profile_completed) {
      addNotification(
        'Cần cập nhật hồ sơ cá nhân', 
        'Hãy truy cập tab Hồ Sơ Cá Nhân (Avatar) để cập nhật thông tin giới thiệu bản thân trước!', 
        'system'
      );
      return;
    }

    const nextChecked = !checkedTasks[key];
    const newCheckedState = {
      ...checkedTasks,
      [key]: nextChecked
    };

    setCheckedTasks(newCheckedState);
    localStorage.setItem('lms_onboarding_tasks_v2', JSON.stringify(newCheckedState));
    updateProfile(activeUser.id, { onboarding_tasks: newCheckedState });

    if (nextChecked) {
      addNotification('Nhiệm vụ hoàn thành!', `Bạn đã check xong một nhiệm vụ của Ngày ${day}!`, 'system');
      
      // Check if all required tasks for this day are completed
      const dayData = onboardingDays.find(d => d.day === day);
      if (dayData) {
        const tasks = getTasksForDay(dayData);
        const requiredTasks = tasks.filter(t => !t.label.toLowerCase().includes('optional') && !t.isOptional);
        if (requiredTasks.length > 0) {
          const allCompleted = requiredTasks.every(t => {
            if (t.key === key) return true;
            return !!newCheckedState[t.key];
          });
          
          if (allCompleted) {
            const onboardingDayUuid = `00000000-0000-0000-0000-0000000000d${day}`;
            const alreadyLogged = (nauticalTransactions || []).some(
              t => t.student_id === activeUser.id && t.action_type === 'lesson_complete' && (t.reference_id === onboardingDayUuid || t.reference_id === `onboarding-day-${day}`)
            );
            if (!alreadyLogged) {
              addNauticalMiles(
                activeUser.id, 
                50, 
                'lesson_complete', 
                `Hoàn thành Onboarding Ngày ${day}`, 
                onboardingDayUuid
              );
              addNotification(
                'Thử thách hoàn thành!', 
                `Tuyệt vời! Bạn đã hoàn thành tất cả nhiệm vụ bắt buộc của Ngày ${day} và nhận thêm 50 hải lý! ⛵`, 
                'system'
              );
            }
          }
        }
      }
    }
  };



  const activeDayData = onboardingDays.find(d => d.day === selectedDay) || onboardingDays[0];

  // Local state for visual task editor
  const [editingTasks, setEditingTasks] = useState<{ id: string; label: string; isOptional: boolean }[]>([]);
  const [focusedTaskId, setFocusedTaskId] = useState<string | null>(null);

  // Synchronize local task list when activeDayData or isEditMode changes
  useEffect(() => {
    if (isEditMode && activeDayData) {
      const lines = activeDayData.checklist.split('\n');
      const parsed: { id: string; label: string; isOptional: boolean }[] = [];
      lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('- [ ]')) {
          const rawLabel = trimmed.replace('- [ ]', '').trim();
          const isOptional = rawLabel.toLowerCase().includes('(optional)');
          parsed.push({
            id: `task-${index}-${activeDayData.day}-${Date.now()}-${Math.random()}`,
            label: rawLabel,
            isOptional: isOptional
          });
        } else if (parsed.length > 0 && line.length > 0) {
          parsed[parsed.length - 1].label += '\n' + line;
        }
      });
      setEditingTasks(parsed);
    }
  }, [activeDayData.day, isEditMode]);

  const saveTasks = (newTasks: { id: string; label: string; isOptional: boolean }[]) => {
    setEditingTasks(newTasks);
    const serialized = newTasks.map(t => {
      let text = t.label;
      const hasOptional = text.toLowerCase().includes('(optional)');
      if (t.isOptional && !hasOptional) {
        text = text + ' (Optional)';
      } else if (!t.isOptional && hasOptional) {
        text = text.replace(/\s*\(optional\)/i, '');
      }
      return `- [ ] ${text}`;
    }).join('\n');
    updateOnboardingDay(activeDayData.day, { checklist: serialized });
  };

  const handleTaskLabelChange = (id: string, newLabel: string) => {
    const updated = editingTasks.map(t => t.id === id ? { ...t, label: newLabel } : t);
    setEditingTasks(updated);
    
    // Auto-save immediately to database/context when typing for instant layout updates
    const serialized = updated.map(t => {
      let text = t.label;
      const hasOptional = text.toLowerCase().includes('(optional)');
      if (t.isOptional && !hasOptional) {
        text = text + ' (Optional)';
      } else if (!t.isOptional && hasOptional) {
        text = text.replace(/\s*\(optional\)/i, '');
      }
      return `- [ ] ${text}`;
    }).join('\n');
    updateOnboardingDay(activeDayData.day, { checklist: serialized });
  };

  const handleTaskLabelBlur = (id: string, finalLabel: string) => {
    const updated = editingTasks.map(t => t.id === id ? { ...t, label: finalLabel } : t);
    saveTasks(updated);
  };

  const handleToggleOptional = (id: string) => {
    const updated = editingTasks.map(t => {
      if (t.id === id) {
        const nextOptional = !t.isOptional;
        let text = t.label;
        const hasOptional = text.toLowerCase().includes('(optional)');
        if (nextOptional && !hasOptional) {
          text = text + ' (Optional)';
        } else if (!nextOptional && hasOptional) {
          text = text.replace(/\s*\(optional\)/i, '');
        }
        return { ...t, label: text, isOptional: nextOptional };
      }
      return t;
    });
    saveTasks(updated);
  };

  const handleAddTask = () => {
    const newTasks = [
      ...editingTasks,
      {
        id: `task-new-${Date.now()}-${Math.random()}`,
        label: `**Task ${editingTasks.length + 1}:** Tên nhiệm vụ mới`,
        isOptional: false
      }
    ];
    saveTasks(newTasks);
  };

  const handleDeleteTask = (id: string) => {
    const newTasks = editingTasks.filter(t => t.id !== id);
    saveTasks(newTasks);
  };

  const handleMoveTask = (index: number, direction: 'up' | 'down') => {
    const newTasks = [...editingTasks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newTasks.length) {
      const temp = newTasks[index];
      newTasks[index] = newTasks[targetIndex];
      newTasks[targetIndex] = temp;
      saveTasks(newTasks);
    }
  };



  const dayTasks = getTasksForDay(activeDayData);
  const visual = DAY_VISUAL_STYLES[selectedDay] || DAY_VISUAL_STYLES[1];

  return (
    <div className="space-y-5 max-w-5xl mx-auto pb-10 animate-fade-in select-none">
      <PageHeader
        title="Onboarding Week"
        description="Hoàn thành các thử thách thiết lập môi trường, kỹ năng giao tiếp AI và tìm hiểu về PRD."
        helpTitle="Onboarding"
        helpSummary="Hướng dẫn làm quen hệ thống, lộ trình và phương pháp học trong tuần đầu tiên."
        helpPurpose="Giúp bạn khởi động đúng cách — thiết lập toàn bộ nền tảng, hiểu rõ luật chơi và sẵn sàng tâm lý để bước vào khoá học."
      />

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {onboardingDays.map((dayData) => {
            const tasks = getTasksForDay(dayData);
            const totalTasks = tasks.length;
            const completedTasks = tasks.filter(t => checkedTasks[t.key]).length;

            return (
              <DayCard
                key={dayData.day}
                dayData={dayData}
                totalTasks={totalTasks}
                completedTasks={completedTasks}
                onClick={() => handleDayCardClick(dayData.day)}
              />
            );
          })}
        </div>
      ) : (
        <div className="animate-fade-in max-w-4xl mx-auto space-y-5">
          <button 
            onClick={() => {
              setViewMode('grid');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            className="flex items-center gap-2 text-[#3E5E63] font-semibold mb-4 hover:text-sky-600 transition-colors px-4 py-2 bg-white border border-gray-200 rounded-xl hover:shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" /> Quay lại Bản Đồ Hải Trình
          </button>

          {isEditMode && (
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <span className="text-2xl text-amber-600">✉️</span>
                <div>
                  <span className="text-sm font-bold text-amber-800 block">Mẫu Email Thông Báo (Ngày {activeDayData.day})</span>
                  <span className="text-xs text-amber-600">Soạn và gửi email thông báo thủ công cho học viên</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleOpenEmailModal(activeDayData)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer border-0"
                >
                  <Mail className="w-4 h-4" /> Mẫu Email Thông Báo
                </button>
              </div>
            </div>
          )}
          
          <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${visual.gradient} shadow-lg shadow-[#214C54]/10`}>
            {visual.bgPattern}
            <div className="relative z-10 px-8 py-10 md:py-14 text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                  {visual.icon}
                </div>
                <h2 className="text-sm font-black uppercase tracking-widest text-white/80">Ngày {activeDayData.day}</h2>
              </div>
              {isEditMode ? (
                <div className="max-w-2xl bg-white/10 rounded-2xl p-2">
                  <EditableText
                    value={activeDayData.title}
                    onSave={(newValue) => updateOnboardingDay(activeDayData.day, { title: newValue })}
                    className="text-2xl md:text-3xl font-extrabold leading-tight text-white border-none focus:ring-0"
                    minRows={1}
                  />
                </div>
              ) : (
                <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                  {activeDayData.title.replace(/^Ngày \d+[:\-]?\s*/i, '').trim()}
                </h1>
              )}
            </div>
          </div>

          {/* Day Objective */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-sky-500"></div>
            <h3 className="text-xl font-bold text-[#15333B] mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-sky-500" /> Mục tiêu chặng
            </h3>
            <div className="text-[17px] text-[#3E5E63] leading-relaxed w-full">
              {isEditMode ? (
                <EditableText
                  value={activeDayData.objective}
                  onSave={(newValue) => updateOnboardingDay(activeDayData.day, { objective: newValue })}
                  className="text-[#3E5E63] w-full"
                  minRows={4}
                />
              ) : (
                renderRichText(activeDayData.objective)
              )}
            </div>
          </div>

          {/* Task Checklist Panel */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-5 mb-6 gap-4">
              <h2 className="text-2xl font-bold text-[#15333B] flex items-center gap-2">
                <ClipboardList className="w-6 h-6 text-emerald-500" /> Danh sách Nhiệm vụ
              </h2>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm px-4 py-1.5 rounded-full font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Hoàn thành: {dayTasks.filter(t => checkedTasks[t.key]).length} / {dayTasks.length}
              </span>
            </div>
            
            <div className="space-y-3">
              {isEditMode ? (
                <div className="space-y-4 w-full">
                  <div className="space-y-3">
                    {editingTasks.map((task, idx) => (
                      <TaskEditRow
                        key={task.id}
                        task={task}
                        idx={idx}
                        totalTasks={editingTasks.length}
                        focusedTaskId={focusedTaskId}
                        setFocusedTaskId={setFocusedTaskId}
                        onMove={handleMoveTask}
                        onLabelChange={handleTaskLabelChange}
                        onLabelBlur={handleTaskLabelBlur}
                        onToggleOptional={handleToggleOptional}
                        onDelete={handleDeleteTask}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleAddTask}
                    className="w-full py-3 border-2 border-dashed border-[#214C54]/30 hover:border-[#214C54]/80 text-[#214C54] hover:bg-[#214C54]/5 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Plus size={14} /> Thêm Nhiệm Vụ Mới
                  </button>
                </div>
              ) : (
                dayTasks.map((task) => {
                  const isCompleted = !!checkedTasks[task.key];
                  return (
                    <div key={task.key} className={`p-4 md:p-5 rounded-2xl border transition-all duration-300 ${isCompleted ? 'bg-emerald-50/50 border-emerald-200 opacity-90' : task.isOptional ? 'bg-white border-dashed border-gray-200 hover:border-violet-300 hover:shadow-md' : 'bg-white border-gray-200 hover:border-sky-300 hover:shadow-md'}`}>
                      <label className="flex items-start gap-4 cursor-pointer group">
                        <div className="pt-1 shrink-0">
                          <input 
                            type="checkbox" 
                            checked={isCompleted}
                            onChange={() => handleToggleTask(activeDayData.day, task.idx, task.label)}
                            className="w-5 h-5 rounded-md border-2 border-gray-300 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-2 cursor-pointer transition-colors"
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start flex-wrap gap-2">
                            {task.isOptional && (
                              <div className="shrink-0 flex flex-col items-start gap-1">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-100 text-violet-600 border border-violet-200">
                                  ✦ Tùy chọn
                                </span>
                                {task.optionalNote && (
                                  <span className="text-[11px] text-violet-500 italic font-medium">{task.optionalNote}</span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className={`text-[17px] leading-relaxed transition-all ${isCompleted ? 'text-gray-400 line-through' : 'text-[#3E5E63]'}`}>
                            {renderRichText(task.label)}
                          </div>

                        </div>
                      </label>
                    </div>
                  );
                })
              )}
            </div>

            {!isEditMode && isDayCompleted(selectedDay) && (
              <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/20 text-center space-y-4 animate-scale-up">
                <div className="text-4xl">🎉</div>
                <h4 className="text-lg font-black text-emerald-800 uppercase tracking-wider">
                  Hoàn Thành Thử Thách Ngày {selectedDay}!
                </h4>
                <p className="text-sm text-emerald-700 font-medium leading-relaxed max-w-xl mx-auto">
                  {selectedDay < 8 
                    ? "Tuyệt vời! Bạn đã xuất sắc hoàn thành toàn bộ nhiệm vụ của ngày hôm nay. Sẵn sàng cho thử thách tiếp theo chưa?" 
                    : "Chúc mừng! Bạn đã hoàn thành toàn bộ 8 ngày thử thách của Onboarding Week. Hãy cùng lưu danh vào Bảng vinh danh!"}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  {selectedDay < 8 ? (
                    <>
                      <button
                        onClick={() => {
                          setSelectedDay(selectedDay + 1);
                        }}
                        className="px-6 py-3 bg-[#214C54] hover:bg-[#15333B] text-white font-black text-xs rounded-xl shadow-md hover:shadow-lg transition-all uppercase tracking-wider flex items-center gap-2 border-0 cursor-pointer"
                      >
                        Tiến tới Ngày {selectedDay + 1} ➔
                      </button>
                      <button
                        onClick={() => onPageChange?.('walloffame')}
                        className="px-6 py-3 bg-white border border-[#214C54] text-[#214C54] hover:bg-[#214C54]/5 font-black text-xs rounded-xl shadow-sm hover:shadow-md transition-all uppercase tracking-wider flex items-center gap-2 border-0 cursor-pointer"
                      >
                        🏆 Xem Bảng xếp hạng
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => onPageChange?.('walloffame')}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs rounded-xl shadow-md hover:shadow-lg transition-all uppercase tracking-wider flex items-center gap-2 border-0 cursor-pointer"
                    >
                      🏆 Đi tới Bảng vinh danh
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>



          {/* Companion Mascot speech box */}
          {!isEditMode && (
            <div className="bg-white border-2 border-sky-100 p-5 rounded-2xl flex items-start gap-4">
              <span className="text-3xl">🦜</span>
              <div className="space-y-1">
                <span className="text-xs text-sky-700 font-black block uppercase tracking-wider">Bác Vẹt Đồng Hành gợi ý:</span>
                <div className="text-sm text-[#3E5E63] leading-relaxed font-semibold">
                  {activeDayData.companionHint
                    ? renderRichText(activeDayData.companionHint)
                    : '"Thực hiện xong nhiệm vụ nào thì check ngay vào ô trống bên cạnh để nhận điểm thưởng nhé! Tích tiểu thành đại, hải trình còn dài! Nhớ hoàn thành 100% để mở khóa ngày mai nhé!"'}
                </div>
              </div>
            </div>
          )}

          {/* Bonus Resources card */}
          {!isEditMode && activeDayData.bonusResources && (
            <div className="bg-amber-50/60 border-2 border-amber-100 p-5 rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">💬</span>
                <span className="text-xs text-amber-700 font-black uppercase tracking-wider">Bonus: Tài liệu đọc thêm cho bạn</span>
              </div>
              <div className="space-y-1.5">
                {activeDayData.bonusResources.split('\n').filter((l: string) => l.trim().startsWith('- [')).map((line: string, i: number) => {
                  const match = line.match(/^- \[([^\]]+)\]\(([^)]+)\)/);
                  if (!match) return null;
                  const [, label, url] = match;
                  return (
                    <a key={i} href={url} target="_blank" rel="noreferrer"
                       className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-amber-100 transition-colors group">
                      <span className="text-amber-500 group-hover:text-amber-600 text-sm shrink-0">🔗</span>
                      <span className="text-sm text-sky-600 group-hover:text-sky-700 font-medium group-hover:underline">{label}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}


        </div>
      )}

      {/* Email Modal */}
      {isEmailModalOpen && emailModalDay && (
        <EmailTemplateModal
          dayData={emailModalDay}
          profiles={profiles}
          onClose={() => setIsEmailModalOpen(false)}
          onSave={handleSaveEmailTemplate}
          onToast={(msg) => {
            setToastMessage(msg);
            setTimeout(() => setToastMessage(null), 3000);
          }}
        />
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#15333B] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center justify-between gap-4 border border-teal-800/30 animate-slide-up select-text">
          <span className="text-xs font-bold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-white ml-2 cursor-pointer border-0 bg-transparent">✕</button>
        </div>
      )}
    </div>
  );
};

