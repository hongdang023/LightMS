import React from 'react';
import { Plus } from 'lucide-react';
import { renderRichText } from '../../data/onboardingVisuals';
import { TaskEditRow } from './TaskEditRow';

interface DayTaskChecklistProps {
  isEditMode: boolean;
  activeDay: number;
  dayTasks: {
    idx: number;
    label: string;
    key: string;
    isOptional: boolean;
    optionalNote: string;
  }[];
  checkedTasks: { [key: string]: boolean };
  onToggleTask: (day: number, taskIdx: number, label: string) => void;

  // Edit Mode Props
  editingTasks: { id: string; label: string; isOptional: boolean }[];
  focusedTaskId: string | null;
  setFocusedTaskId: (id: string | null) => void;
  onTaskLabelChange: (id: string, label: string) => void;
  onTaskLabelBlur: (id: string, label: string) => void;
  onToggleOptional: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onMoveTask: (index: number, direction: 'up' | 'down') => void;
  onAddTask: () => void;
}

export const DayTaskChecklist: React.FC<DayTaskChecklistProps> = ({
  isEditMode,
  activeDay,
  dayTasks,
  checkedTasks,
  onToggleTask,
  editingTasks,
  focusedTaskId,
  setFocusedTaskId,
  onTaskLabelChange,
  onTaskLabelBlur,
  onToggleOptional,
  onDeleteTask,
  onMoveTask,
  onAddTask,
}) => {
  return (
    <div className="space-y-3">
      {isEditMode ? (
        <div className="space-y-3 bg-[#214C54]/5 border-2 border-dashed border-[#214C54]/20 p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-[#214C54] uppercase tracking-wider">
              📝 Quản lý danh sách nhiệm vụ (Admin Mode)
            </span>
            <span className="text-[10px] text-[#214C54]/60 font-semibold">
              Kéo thả / Đổi vị trí / Đổi tên nhiệm vụ
            </span>
          </div>

          <div className="space-y-2">
            {editingTasks.map((task, index) => (
              <TaskEditRow
                key={task.id}
                task={task}
                idx={index}
                totalTasks={editingTasks.length}
                focusedTaskId={focusedTaskId}
                setFocusedTaskId={setFocusedTaskId}
                onMove={onMoveTask}
                onLabelChange={onTaskLabelChange}
                onLabelBlur={onTaskLabelBlur}
                onToggleOptional={() => onToggleOptional(task.id)}
                onDelete={() => onDeleteTask(task.id)}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={onAddTask}
            className="w-full py-3 border-2 border-dashed border-[#214C54]/30 hover:border-[#214C54]/80 text-[#214C54] hover:bg-[#214C54]/5 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus size={14} /> Thêm Nhiệm Vụ Mới
          </button>
        </div>
      ) : (
        dayTasks.map((task) => {
          const isCompleted = !!checkedTasks[task.key];
          return (
            <div
              key={task.key}
              className={`p-4 md:p-5 rounded-2xl border transition-all duration-300 ${
                isCompleted
                  ? 'bg-emerald-50/50 border-emerald-200 opacity-90'
                  : task.isOptional
                    ? 'bg-white border-dashed border-gray-200 hover:border-violet-300 hover:shadow-md'
                    : 'bg-white border-gray-200 hover:border-sky-300 hover:shadow-md'
              }`}
            >
              <label className="flex items-start gap-4 cursor-pointer group">
                <div className="pt-1 shrink-0">
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => onToggleTask(activeDay, task.idx, task.label)}
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
                          <span className="text-[11px] text-violet-500 italic font-medium">
                            {task.optionalNote}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div
                    className={`text-[17px] leading-relaxed transition-all ${
                      isCompleted ? 'text-gray-400 line-through' : 'text-[#3E5E63]'
                    }`}
                  >
                    {renderRichText(task.label)}
                  </div>
                </div>
              </label>
            </div>
          );
        })
      )}
    </div>
  );
};
