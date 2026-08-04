import React from 'react';
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react';

interface TaskEditRowProps {
  task: { id: string; label: string; isOptional: boolean };
  idx: number;
  totalTasks: number;
  focusedTaskId: string | null;
  setFocusedTaskId: (id: string | null) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
  onLabelChange: (id: string, newLabel: string) => void;
  onLabelBlur: (id: string, finalLabel: string) => void;
  onToggleOptional: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskEditRow: React.FC<TaskEditRowProps> = ({
  task,
  idx,
  totalTasks,
  focusedTaskId,
  setFocusedTaskId,
  onMove,
  onLabelChange,
  onLabelBlur,
  onToggleOptional,
  onDelete,
}) => {

  const applyFormatting = (format: 'bold' | 'italic' | 'underline' | 'ordered-list' | 'bullet-list' | 'link' | 'clear') => {
    const editor = document.getElementById(`input-${task.id}`) as HTMLDivElement;
    if (!editor) return;

    editor.focus();

    if (format === 'bold') {
      document.execCommand('bold', false);
    } else if (format === 'italic') {
      document.execCommand('italic', false);
    } else if (format === 'underline') {
      document.execCommand('underline', false);
    } else if (format === 'ordered-list') {
      document.execCommand('insertOrderedList', false);
    } else if (format === 'bullet-list') {
      document.execCommand('insertUnorderedList', false);
    } else if (format === 'link') {
      const url = prompt('Nhập địa chỉ liên kết (URL):', 'https://');
      if (url) {
        document.execCommand('createLink', false, url);
      }
    } else if (format === 'clear') {
      document.execCommand('removeFormat', false);
    }

    // Trigger onInput manually to sync state and save
    const html = editor.innerHTML;
    let markdown = html
      .replace(/<span[^>]*>/gi, '')
      .replace(/<\/span>/gi, '')
      .replace(/<font[^>]*>/gi, '')
      .replace(/<\/font>/gi, '')
      .replace(/<b>(.*?)<\/b>/gi, '**$1**')
      .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<i>(.*?)<\/i>/gi, '*$1*')
      .replace(/<em>(.*?)<\/em>/gi, '*$1*')
      .replace(/<u>(.*?)<\/u>/gi, '<u>$1</u>')
      .replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
      .replace(/<ol>([\s\S]*?)<\/ol>/gi, (_, p1) => {
        let listIdx = 1;
        return '\n' + p1.replace(/<li>(.*?)<\/li>/gi, () => `${listIdx++}. $1\n`).trim() + '\n';
      })
      .replace(/<ul>([\s\S]*?)<\/ul>/gi, (_, p1) => {
        return '\n' + p1.replace(/<li>(.*?)<\/li>/gi, '- $1\n').trim() + '\n';
      })
      .replace(/<div><br><\/div>/gi, '\n')
      .replace(/<div>(.*?)<\/div>/gi, '\n$1')
      .replace(/<br>/gi, '\n')
      .replace(/&nbsp;/g, ' ')
      .trim();

    onLabelChange(task.id, markdown);
  };

  return (
    <div className="flex flex-col gap-2 bg-white p-4 rounded-2xl border border-gray-200 hover:border-sky-300 hover:shadow-md transition-all">
      {/* Formatting toolbar shown only when this task is active */}
      {focusedTaskId === task.id && (
        <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-xl border border-slate-200/60 shadow-inner">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              applyFormatting('bold');
            }}
            className="w-7 h-7 flex items-center justify-center text-sm font-extrabold hover:bg-white rounded-lg text-slate-700 transition-colors border border-transparent hover:border-slate-200/80 hover:shadow-sm"
            title="In đậm (Bold)"
          >
            B
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              applyFormatting('italic');
            }}
            className="w-7 h-7 flex items-center justify-center text-sm italic hover:bg-white rounded-lg text-slate-700 transition-colors border border-transparent hover:border-slate-200/80 hover:shadow-sm"
            title="In nghiêng (Italic)"
          >
            I
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              applyFormatting('underline');
            }}
            className="w-7 h-7 flex items-center justify-center text-sm underline hover:bg-white rounded-lg text-slate-700 transition-colors border border-transparent hover:border-slate-200/80 hover:shadow-sm"
            title="Gạch chân (Underline)"
          >
            U
          </button>
          <div className="w-px h-5 bg-gray-300 mx-1"></div>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              applyFormatting('ordered-list');
            }}
            className="px-2 h-7 flex items-center justify-center text-[10px] font-black hover:bg-white rounded-lg text-slate-700 transition-colors border border-transparent hover:border-slate-200/80 hover:shadow-sm"
            title="Danh sách số"
          >
            1.2.3.
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              applyFormatting('bullet-list');
            }}
            className="px-2 h-7 flex items-center justify-center text-xs hover:bg-white rounded-lg text-[#214C54] transition-colors border border-transparent hover:border-slate-200/80 hover:shadow-sm"
            title="Danh sách điểm"
          >
            •••
          </button>
          <div className="w-px h-5 bg-gray-300 mx-1"></div>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              applyFormatting('link');
            }}
            className="px-2.5 h-7 flex items-center justify-center text-xs hover:bg-white rounded-lg text-slate-700 transition-colors border border-transparent hover:border-slate-200/80 hover:shadow-sm gap-1"
            title="Gắn link"
          >
            🔗 Link
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              applyFormatting('clear');
            }}
            className="w-7 h-7 flex items-center justify-center text-sm hover:bg-white rounded-lg text-rose-600 transition-colors border border-transparent hover:border-slate-200/80 hover:shadow-sm"
            title="Xóa định dạng"
          >
            Tx
          </button>
          <span className="text-[9px] text-gray-400 ml-auto italic hidden sm:inline pr-1">Nhấn Enter để xuống dòng</span>
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Reordering */}
        <div className="flex flex-col gap-1 shrink-0 pt-1.5">
          <button
            type="button"
            onClick={() => onMove(idx, 'up')}
            disabled={idx === 0}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
            title="Di chuyển lên"
          >
            <ArrowUp size={14} className="text-[#3E5E63]" />
          </button>
          <button
            type="button"
            onClick={() => onMove(idx, 'down')}
            disabled={idx === totalTasks - 1}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
            title="Di chuyển xuống"
          >
            <ArrowDown size={14} className="text-[#3E5E63]" />
          </button>
        </div>

        {/* Task Text Area (WYSIWYG contentEditable) */}
        <div className="flex-1 min-w-0">
          <div
            id={`input-${task.id}`}
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => {
              const target = e.currentTarget;
              const html = target.innerHTML;
              
              let markdown = html
                .replace(/\s+style="[^"]*"/gi, '')
                .replace(/<span[^>]*>/gi, '')
                .replace(/<\/span>/gi, '')
                .replace(/<font[^>]*>/gi, '')
                .replace(/<\/font>/gi, '')
                .replace(/<b>(.*?)<\/b>/gi, '**$1**')
                .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
                .replace(/<i>(.*?)<\/i>/gi, '*$1*')
                .replace(/<em>(.*?)<\/em>/gi, '*$1*')
                .replace(/<u>(.*?)<\/u>/gi, '<u>$1</u>')
                .replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
                .replace(/<ol>([\s\S]*?)<\/ol>/gi, (_, p1) => {
                  let listIdx = 1;
                  return '\n' + p1.replace(/<li>(.*?)<\/li>/gi, () => `${listIdx++}. $1\n`).trim() + '\n';
                })
                .replace(/<ul>([\s\S]*?)<\/ul>/gi, (_, p1) => {
                  return '\n' + p1.replace(/<li>(.*?)<\/li>/gi, '- $1\n').trim() + '\n';
                })
                .replace(/<div[^>]*><br[^>]*><\/div>/gi, '\n')
                .replace(/<div[^>]*>(.*?)<\/div>/gi, '\n$1')
                .replace(/<br\s*[^>]*>/gi, '\n')
                .replace(/&nbsp;/g, ' ')
                .replace(/\s+(?:class|id|dir|align|style)="[^"]*"/gi, '')
                .trim();
              
              onLabelChange(task.id, markdown);
            }}
            onBlur={() => {
              onLabelBlur(task.id, task.label);
              setTimeout(() => setFocusedTaskId(null), 200);
            }}
            onFocus={() => {
              setFocusedTaskId(task.id);
            }}
            className="w-full bg-transparent focus:outline-none py-1 px-1.5 text-sm text-[#15333B] font-semibold border-b border-transparent focus:border-slate-200 min-h-[2em]"
            dangerouslySetInnerHTML={{
              __html: task.label
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
                .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-sky-650 hover:underline">$1</a>')
                .split('\n').join('<br>')
            }}
          />
        </div>

        {/* Optional toggle */}
        <label className="flex items-center gap-1.5 cursor-pointer select-none shrink-0 border border-gray-100 rounded-xl p-2 bg-gray-50 hover:bg-gray-100 transition-colors mt-0.5">
          <input
            type="checkbox"
            checked={task.isOptional}
            onChange={() => onToggleOptional(task.id)}
            className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
          />
          <span className="text-xs font-bold text-[#3E5E63]">Tùy chọn</span>
        </label>

        {/* Delete */}
        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all shrink-0 mt-0.5"
          title="Xóa nhiệm vụ"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
