import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { Markdown } from 'tiptap-markdown';
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { normalizeHtmlToMarkdown } from '../../data/onboardingVisuals';

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
  const initialContent = normalizeHtmlToMarkdown(task.label);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        blockquote: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-sky-600 underline font-semibold',
        },
      }),
      Markdown.configure({
        html: false,
        transformPastedText: true,
        transformCopiedText: true,
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor: currentEditor }) => {
      const md = (currentEditor.storage as any).markdown?.getMarkdown() || currentEditor.getText();
      onLabelChange(task.id, md);
    },
    onBlur: ({ editor: currentEditor }) => {
      const md = (currentEditor.storage as any).markdown?.getMarkdown() || currentEditor.getText();
      onLabelBlur(task.id, md);
      setTimeout(() => {
        setFocusedTaskId(null);
      }, 200);
    },
    onFocus: () => {
      setFocusedTaskId(task.id);
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[2em] text-sm text-[#15333B] font-semibold py-1 px-1.5 leading-relaxed',
      },
    },
  });

  useEffect(() => {
    if (editor) {
      const normalized = normalizeHtmlToMarkdown(task.label);
      const currentMd = (editor.storage as any).markdown?.getMarkdown() || '';
      if (normalized !== currentMd && !editor.isFocused) {
        editor.commands.setContent(normalized);
      }
    }
  }, [task.label, editor]);

  return (
    <div className="flex flex-col gap-2 bg-white p-4 rounded-2xl border border-gray-200 hover:border-sky-300 hover:shadow-md transition-all">
      {/* Formatting toolbar shown only when this task is active */}
      {focusedTaskId === task.id && editor && (
        <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-xl border border-slate-200/60 shadow-inner">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleBold().run();
            }}
            className={`w-7 h-7 flex items-center justify-center text-sm font-extrabold rounded-lg transition-colors border ${
              editor.isActive('bold')
                ? 'bg-[#214C54]/15 text-[#214C54] border-[#214C54]/30 shadow-xs'
                : 'text-slate-700 hover:bg-white border-transparent hover:border-slate-200/80 hover:shadow-sm'
            }`}
            title="In đậm (Bold)"
          >
            B
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleItalic().run();
            }}
            className={`w-7 h-7 flex items-center justify-center text-sm italic rounded-lg transition-colors border ${
              editor.isActive('italic')
                ? 'bg-[#214C54]/15 text-[#214C54] border-[#214C54]/30 shadow-xs'
                : 'text-slate-700 hover:bg-white border-transparent hover:border-slate-200/80 hover:shadow-sm'
            }`}
            title="In nghiêng (Italic)"
          >
            I
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleUnderline().run();
            }}
            className={`w-7 h-7 flex items-center justify-center text-sm underline rounded-lg transition-colors border ${
              editor.isActive('underline')
                ? 'bg-[#214C54]/15 text-[#214C54] border-[#214C54]/30 shadow-xs'
                : 'text-slate-700 hover:bg-white border-transparent hover:border-slate-200/80 hover:shadow-sm'
            }`}
            title="Gạch chân (Underline)"
          >
            U
          </button>
          <div className="w-px h-5 bg-gray-300 mx-1"></div>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleOrderedList().run();
            }}
            className={`px-2 h-7 flex items-center justify-center text-[10px] font-black rounded-lg transition-colors border ${
              editor.isActive('orderedList')
                ? 'bg-[#214C54]/15 text-[#214C54] border-[#214C54]/30 shadow-xs'
                : 'text-slate-700 hover:bg-white border-transparent hover:border-slate-200/80 hover:shadow-sm'
            }`}
            title="Danh sách số"
          >
            1.2.3.
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleBulletList().run();
            }}
            className={`px-2 h-7 flex items-center justify-center text-xs rounded-lg transition-colors border ${
              editor.isActive('bulletList')
                ? 'bg-[#214C54]/15 text-[#214C54] border-[#214C54]/30 shadow-xs'
                : 'text-[#214C54] hover:bg-white border-transparent hover:border-slate-200/80 hover:shadow-sm'
            }`}
            title="Danh sách điểm"
          >
            •••
          </button>
          <div className="w-px h-5 bg-gray-300 mx-1"></div>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              if (editor.isActive('link')) {
                editor.chain().focus().unsetLink().run();
                return;
              }
              const url = prompt('Nhập địa chỉ liên kết (URL):', 'https://');
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            className={`px-2.5 h-7 flex items-center justify-center text-xs rounded-lg transition-colors border gap-1 ${
              editor.isActive('link')
                ? 'bg-[#214C54]/15 text-[#214C54] border-[#214C54]/30 shadow-xs'
                : 'text-slate-700 hover:bg-white border-transparent hover:border-slate-200/80 hover:shadow-sm'
            }`}
            title="Gắn link"
          >
            🔗 Link
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().unsetAllMarks().clearNodes().run();
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

        {/* Task Text Area (TipTap Editor) */}
        <div className="flex-1 min-w-0 border-b border-transparent focus-within:border-slate-200 transition-colors">
          <EditorContent editor={editor} />
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
