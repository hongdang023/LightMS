import React from 'react';

interface ScheduleTabProps {
  isEditMode: boolean;
  activeEditorId: string | null;
  setActiveEditorId: (id: string | null) => void;
  draftSchedule: string;
  setDraftSchedule: (val: string) => void;
  onPageChange: (page: string) => void;
  renderEditorToolbar: (editorId: string) => React.ReactNode;
}

export const ScheduleTab: React.FC<ScheduleTabProps> = ({
  isEditMode,
  activeEditorId,
  setActiveEditorId,
  draftSchedule,
  setDraftSchedule,
  onPageChange,
  renderEditorToolbar,
}) => {
  return (
    <div className="space-y-8 animate-fade-in text-left">
      <div>
        {isEditMode ? (
          <div className="p-4 bg-[#214C54]/5 border border-l-4 border-[#214C54] rounded-xl text-sm text-[#3E5E63]">
            {activeEditorId === 'editor-schedule' && renderEditorToolbar('editor-schedule')}
            <div
              id="editor-schedule"
              contentEditable
              suppressContentEditableWarning
              onFocus={() => setActiveEditorId('editor-schedule')}
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
                  .replace(/&nbsp;/g, ' ')
                  .trim();
                setDraftSchedule(cleanText);
              }}
              className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none min-h-[120px] text-sm text-[#3E5E63] font-semibold focus:ring-1 focus:ring-[#214C54]"
              dangerouslySetInnerHTML={{
                __html: draftSchedule
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
                  .split('\n').join('<br>')
              }}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-extrabold text-base text-[#15333B] flex items-center gap-2">
              <span>⚓</span> Lộ trình học:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {draftSchedule.split('\n\n').filter(p => p.trim().includes('Chặng')).map((stage, idx) => {
                const cleanStage = stage.replace(/^⚓\s*/, '').replace(/^Lịch trình toàn khoá học:\s*/, '').trim();
                if (!cleanStage) return null;
                const parts = cleanStage.split(' - ');
                const titlePart = parts[0] || '';
                const descPart = parts.slice(1).join(' - ') || '';
                
                const icons = ['🚀', '⛵', '💻', '🎓'];
                const borderColors = ['border-t-[#DC2626]', 'border-t-[#7C3AED]', 'border-t-[#EA580C]', 'border-t-[#B45309]'];
                
                return (
                  <div key={idx} className={`p-5 rounded-2xl border-t-4 ${borderColors[idx % 4]} border border-gray-150 bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{icons[idx % 4]}</span>
                        <h4 className="font-black text-[#15333B] text-sm md:text-[15px]">{titlePart}</h4>
                      </div>
                      <p className="text-xs md:text-sm text-[#3E5E63] leading-relaxed font-semibold mb-4">{descPart}</p>
                    </div>
                    
                    {idx === 1 && (
                      <button 
                        onClick={() => onPageChange('onboarding')}
                        className="self-start text-[10px] font-bold text-[#FFD94C] bg-[#15333B] px-2.5 py-1.5 rounded-lg hover:bg-[#214C54] cursor-pointer transition-colors"
                      >
                        Đi đến Onboarding ➔
                      </button>
                    )}
                    
                    {idx === 2 && (
                      <button 
                        onClick={() => onPageChange('syllabus')}
                        className="self-start text-[10px] font-bold text-[#FFD94C] bg-[#15333B] px-2.5 py-1.5 rounded-lg hover:bg-[#214C54] cursor-pointer transition-colors"
                      >
                        Đi đến Lộ trình học ➔
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
