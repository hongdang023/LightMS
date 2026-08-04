import React from 'react';
import { Trash2, Plus } from 'lucide-react';
import type { PlatformButton } from '../../data/aboutViewData';

interface PlatformsTabProps {
  isEditMode: boolean;
  activeEditorId: string | null;
  setActiveEditorId: (id: string | null) => void;
  draftPlatformButtons: PlatformButton[];
  setDraftPlatformButtons: (val: PlatformButton[]) => void;
  draftSdtNote: string;
  setDraftSdtNote: (val: string) => void;
  draftOfficeHourDesc: string;
  setDraftOfficeHourDesc: (val: string) => void;
  onPageChange: (page: string) => void;
  handleAddPlatformButton: () => void;
  handleDeletePlatformButton: (idx: number) => void;
  renderRichText: (text: string) => React.ReactNode;
  renderEditorToolbar: (editorId: string) => React.ReactNode;
}

export const PlatformsTab: React.FC<PlatformsTabProps> = ({
  isEditMode,
  activeEditorId,
  setActiveEditorId,
  draftPlatformButtons,
  setDraftPlatformButtons,
  draftSdtNote,
  setDraftSdtNote,
  draftOfficeHourDesc,
  setDraftOfficeHourDesc,
  onPageChange,
  handleAddPlatformButton,
  handleDeletePlatformButton,
  renderRichText,
  renderEditorToolbar,
}) => {
  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div>
        <h3 className="font-extrabold text-base text-[#15333B] mb-3"> Các nền tảng học tập:</h3>

        {/* Editable Dynamic Platform Buttons */}
        <div className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {draftPlatformButtons.map((btn, idx) => (
              <div key={idx} className={isEditMode ? "relative bg-white rounded-lg border border-gray-100 p-2 group shadow-sm hover:shadow transition-shadow" : "flex flex-col"}>
                {isEditMode ? (
                  <div className="space-y-1.5">
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={btn.icon}
                        onChange={(e) => {
                          const next = [...draftPlatformButtons];
                          next[idx].icon = e.target.value;
                          setDraftPlatformButtons(next);
                        }}
                        className="w-8 border border-gray-200 rounded text-center text-xs py-0.5"
                        placeholder="Icon"
                      />
                      <input
                        type="text"
                        value={btn.title}
                        onChange={(e) => {
                          const next = [...draftPlatformButtons];
                          next[idx].title = e.target.value;
                          setDraftPlatformButtons(next);
                        }}
                        className="flex-1 border border-gray-200 rounded px-2 text-xs font-bold text-gray-700 py-0.5"
                        placeholder="Tên tài nguyên"
                      />
                    </div>
                    <input
                      type="text"
                      value={btn.subtitle}
                      onChange={(e) => {
                        const next = [...draftPlatformButtons];
                        next[idx].subtitle = e.target.value;
                        setDraftPlatformButtons(next);
                      }}
                      className="w-full border border-gray-200 rounded px-2 text-[10px] py-0.5"
                      placeholder="Mô tả phụ"
                    />
                    <input
                      type="text"
                      value={btn.url}
                      onChange={(e) => {
                        const next = [...draftPlatformButtons];
                        next[idx].url = e.target.value;
                        setDraftPlatformButtons(next);
                      }}
                      className="w-full border border-gray-200 rounded px-2 text-[9px] text-[#214C54] py-0.5"
                      placeholder="Link URL"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeletePlatformButton(idx)}
                      className="absolute top-1 right-1 text-red-500 hover:text-red-700 p-0.5"
                      title="Xóa tài nguyên này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col justify-between h-full p-4 bg-white rounded-2xl border border-gray-150 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl shrink-0 mt-0.5">{btn.icon}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-extrabold text-[#15333B] block">{btn.title}</span>
                        <span className="text-xs text-gray-400 block mt-1 leading-relaxed">{btn.subtitle}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                      {btn.title.toLowerCase().includes('lightms') ? (
                        <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">Không có nút</span>
                      ) : btn.title.toLowerCase().includes('calendar') ? (
                        <button
                          onClick={() => onPageChange('calendar')}
                          className="text-xs font-bold text-[#FFD94C] bg-[#15333B] px-2.5 py-1.5 rounded-lg hover:bg-[#214C54] transition-colors"
                        >
                          Đăng ký / Xem Lịch học ➔
                        </button>
                      ) : btn.title.toLowerCase().includes('telegram') ? (
                        <a
                          href={btn.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-[#FFD94C] bg-[#15333B] px-2.5 py-1.5 rounded-lg hover:bg-[#214C54] transition-colors"
                        >
                          Tham gia Telegram ➔
                        </a>
                      ) : (
                        <a
                          href={btn.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-[#FFD94C] bg-[#15333B] px-2.5 py-1.5 rounded-lg hover:bg-[#214C54] transition-colors"
                        >
                          Đi đến Facebook Group ➔
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {isEditMode && (
            <button
              type="button"
              onClick={handleAddPlatformButton}
              className="w-full flex items-center justify-center gap-1 py-2 border border-dashed border-[#214C54]/40 hover:border-[#214C54] rounded-xl text-xs text-[#214C54] font-bold bg-white transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm tài nguyên học tập</span>
            </button>
          )}
        </div>

        {/* SĐT notes edit */}
        <div className="pt-2 border-t border-gray-100">
          {isEditMode ? (
            <div className="space-y-1.5">
              <span className="text-[9px] font-bold text-gray-400">HƯỚNG DẪN LIÊN HỆ:</span>
              {activeEditorId === 'editor-sdt-note' && renderEditorToolbar('editor-sdt-note')}
              <div
                id="editor-sdt-note"
                contentEditable
                suppressContentEditableWarning
                onFocus={() => setActiveEditorId('editor-sdt-note')}
                onInput={(e) => {
                  const html = e.currentTarget.innerHTML;
                  const cleanText = html
                    .replace(/<b>(.*?)<\/b>/gi, '**$1**')
                    .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
                    .replace(/<i>(.*?)<\/i>/gi, '*$1*')
                    .replace(/<em>(.*?)<\/em>/gi, '*$1*')
                    .replace(/<u>(.*?)<\/u>/gi, '<u>$1</u>')
                    .replace(/<a href="(.*?)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
                    .replace(/<div><br><\/div>/gi, '\n')
                    .replace(/<div>(.*?)<\/div>/gi, '\n$1')
                    .replace(/<br>/gi, '\n')
                    .trim();
                  setDraftSdtNote(cleanText);
                }}
                className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none text-xs"
                dangerouslySetInnerHTML={{
                  __html: draftSdtNote
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
                    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-sky-650 hover:underline">$1</a>')
                    .split('\n').join('<br>')
                }}
              />
            </div>
          ) : (
            <p className="text-[10px] text-gray-500">
              {renderRichText(draftSdtNote)}
            </p>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-extrabold text-base text-[#15333B] mb-3">👨‍🏫 Hoạt động hỗ trợ học tập:</h3>
        <div className="bg-white border border-[#214C54]/20 rounded-2xl p-4 shadow-sm flex items-start gap-4">
          <div className="text-3xl pt-1">💬</div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-[#15333B] text-sm">Office Hour với Trainer</h4>
            {isEditMode ? (
              <div className="space-y-1.5 mt-2">
                {activeEditorId === 'editor-office-hour' && renderEditorToolbar('editor-office-hour')}
                <div
                  id="editor-office-hour"
                  contentEditable
                  suppressContentEditableWarning
                  onFocus={() => setActiveEditorId('editor-office-hour')}
                  onInput={(e) => {
                    const html = e.currentTarget.innerHTML;
                    const cleanText = html
                      .replace(/<b>(.*?)<\/b>/gi, '**$1**')
                      .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
                      .replace(/<i>(.*?)<\/i>/gi, '*$1*')
                      .replace(/<em>(.*?)<\/em>/gi, '*$1*')
                      .replace(/<u>(.*?)<\/u>/gi, '<u>$1</u>')
                      .replace(/<div><br><\/div>/gi, '\n')
                      .replace(/<div>(.*?)<\/div>/gi, '\n$1')
                      .replace(/<br>/gi, '\n')
                      .trim();
                    setDraftOfficeHourDesc(cleanText);
                  }}
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none text-xs text-[#3E5E63] font-semibold"
                  dangerouslySetInnerHTML={{
                    __html: draftOfficeHourDesc
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
                      .split('\n').join('<br>')
                  }}
                />
              </div>
            ) : (
              <p className="text-xs text-gray-500 mt-1">{draftOfficeHourDesc}</p>
            )}
            <a 
              href="https://t.me/+C8OUa6qqgNsyYjQ9" 
              target="_blank" 
              rel="noreferrer"
              className="inline-block text-xs font-bold text-[#FFD94C] bg-[#15333B] px-3 py-1.5 rounded-md mt-3 hover:bg-[#214C54] transition-colors"
            >
              👉 Đăng ký Office Hour tại Light Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
