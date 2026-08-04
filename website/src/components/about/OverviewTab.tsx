import React from 'react';

interface OverviewTabProps {
  isEditMode: boolean;
  activeEditorId: string | null;
  setActiveEditorId: (id: string | null) => void;
  draftOverview: string;
  setDraftOverview: (val: string) => void;
  draftGachDauDong: string[];
  setDraftGachDauDong: (val: string[]) => void;
  draftTruCot1: { title: string; subtitle: string; desc: string };
  setDraftTruCot1: (val: { title: string; subtitle: string; desc: string }) => void;
  draftTruCot2: { title: string; subtitle: string; desc: string };
  setDraftTruCot2: (val: { title: string; subtitle: string; desc: string }) => void;
  draftTruCot3: { title: string; subtitle: string; desc: string };
  setDraftTruCot3: (val: { title: string; subtitle: string; desc: string }) => void;
  draftOutro: string;
  setDraftOutro: (val: string) => void;
  renderRichText: (text: string) => React.ReactNode;
  renderEditorToolbar: (editorId: string) => React.ReactNode;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  isEditMode,
  activeEditorId,
  setActiveEditorId,
  draftOverview,
  setDraftOverview,
  draftGachDauDong,
  setDraftGachDauDong,
  draftTruCot1,
  setDraftTruCot1,
  draftTruCot2,
  setDraftTruCot2,
  draftTruCot3,
  setDraftTruCot3,
  draftOutro,
  setDraftOutro,
  renderRichText,
  renderEditorToolbar,
}) => {
  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="p-5 md:p-6 bg-gradient-to-r from-[#214C54]/5 to-[#214C54]/10 border border-[#214C54]/15 rounded-2xl text-[#15333B] relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#214C54]/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
        <div className="font-semibold text-[#15333B] md:text-[15px] leading-relaxed relative z-10">
          {isEditMode ? (
            <div className="space-y-2">
              {activeEditorId === 'editor-overview' && renderEditorToolbar('editor-overview')}
              <div
                id="editor-overview"
                contentEditable
                suppressContentEditableWarning
                onFocus={() => setActiveEditorId('editor-overview')}
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
                  setDraftOverview(cleanText);
                }}
                className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none min-h-[100px] text-sm text-[#3E5E63] font-semibold focus:ring-1 focus:ring-[#214C54]"
                dangerouslySetInnerHTML={{
                  __html: draftOverview
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
                    .split('\n').join('<br>')
                }}
              />
            </div>
          ) : (
            renderRichText(draftOverview)
          )}
        </div>
      </div>

      <p className="font-bold text-sm md:text-[15px] text-[#15333B] pt-2">
        Không giống như các khoá dạy làm sản phẩm truyền thống, ở <strong>Build With The1ight</strong>, bạn sẽ:
      </p>
      
      {isEditMode ? (
        <div className="space-y-2 border border-dashed border-gray-250 p-3 rounded-xl bg-gray-50/50">
          <span className="text-[10px] font-bold text-gray-400 block">3 GẠCH ĐẦU DÒNG QUYỀN LỢI:</span>
          {draftGachDauDong.map((item, idx) => (
            <input
              key={idx}
              type="text"
              value={item}
              onChange={(e) => {
                const next = [...draftGachDauDong];
                next[idx] = e.target.value;
                setDraftGachDauDong(next);
              }}
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-[#3E5E63] font-semibold bg-white"
              placeholder={`Quyền lợi thứ ${idx + 1}`}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 pl-1 pt-1">
          {draftGachDauDong.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3.5 bg-slate-50/60 border border-slate-150/80 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm">
              <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</span>
              <div className="font-semibold text-xs md:text-sm text-[#3E5E63] leading-relaxed">{renderRichText(item)}</div>
            </div>
          ))}
        </div>
      )}

      <h3 className="font-extrabold text-sm md:text-base text-[#15333B] pt-6 flex items-center gap-2">
        <span>🎯</span> Tư duy sản phẩm qua 3 trụ cột:
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        {/* Trụ Cột 1 */}
        <div className="p-4 bg-white rounded-2xl border-t-4 border-t-[#214C54] border border-gray-150 flex flex-col justify-start shadow-sm hover:shadow-md transition-all duration-300">
          {isEditMode ? (
            <div className="space-y-2">
              <input 
                type="text"
                value={draftTruCot1.title}
                onChange={(e) => setDraftTruCot1({ ...draftTruCot1, title: e.target.value })}
                className="w-full text-xs font-bold text-[#214C54] bg-white border border-gray-200 rounded px-2 py-1"
              />
              <input 
                type="text"
                value={draftTruCot1.subtitle}
                onChange={(e) => setDraftTruCot1({ ...draftTruCot1, subtitle: e.target.value })}
                className="w-full text-[10px] font-semibold text-gray-400 bg-white border border-gray-200 rounded px-2 py-1 uppercase"
              />
              <textarea 
                value={draftTruCot1.desc}
                onChange={(e) => setDraftTruCot1({ ...draftTruCot1, desc: e.target.value })}
                className="w-full text-xs text-[#3E5E63] bg-white border border-gray-200 rounded px-2 py-1 resize-none"
                rows={3}
              />
            </div>
          ) : (
            <>
              <div>
                <span className="font-black text-sm text-[#214C54] block mb-1">{draftTruCot1.title}</span>
                <span className="text-[10px] text-[#214C54]/60 font-black block uppercase tracking-wider mb-3.5">{draftTruCot1.subtitle}</span>
              </div>
              <p className="text-xs md:text-sm text-[#3E5E63] leading-relaxed font-medium">{draftTruCot1.desc}</p>
            </>
          )}
        </div>

        {/* Trụ Cột 2 */}
        <div className="p-4 bg-white rounded-2xl border-t-4 border-t-[#EAB308] border border-gray-150 flex flex-col justify-start shadow-sm hover:shadow-md transition-all duration-300">
          {isEditMode ? (
            <div className="space-y-2">
              <input 
                type="text"
                value={draftTruCot2.title}
                onChange={(e) => setDraftTruCot2({ ...draftTruCot2, title: e.target.value })}
                className="w-full text-xs font-bold text-[#214C54] bg-white border border-gray-200 rounded px-2 py-1"
              />
              <input 
                type="text"
                value={draftTruCot2.subtitle}
                onChange={(e) => setDraftTruCot2({ ...draftTruCot2, subtitle: e.target.value })}
                className="w-full text-[10px] font-semibold text-gray-400 bg-white border border-gray-200 rounded px-2 py-1 uppercase"
              />
              <textarea 
                value={draftTruCot2.desc}
                onChange={(e) => setDraftTruCot2({ ...draftTruCot2, desc: e.target.value })}
                className="w-full text-xs text-[#3E5E63] bg-white border border-gray-200 rounded px-2 py-1 resize-none"
                rows={3}
              />
            </div>
          ) : (
            <>
              <div>
                <span className="font-black text-sm text-[#EAB308] block mb-1">{draftTruCot2.title}</span>
                <span className="text-[10px] text-[#EAB308]/75 font-black block uppercase tracking-wider mb-3.5">{draftTruCot2.subtitle}</span>
              </div>
              <p className="text-xs md:text-sm text-[#3E5E63] leading-relaxed font-medium">{draftTruCot2.desc}</p>
            </>
          )}
        </div>

        {/* Trụ Cột 3 */}
        <div className="p-4 bg-white rounded-2xl border-t-4 border-t-[#00B2E2] border border-gray-150 flex flex-col justify-start shadow-sm hover:shadow-md transition-all duration-300">
          {isEditMode ? (
            <div className="space-y-2">
              <input 
                type="text"
                value={draftTruCot3.title}
                onChange={(e) => setDraftTruCot3({ ...draftTruCot3, title: e.target.value })}
                className="w-full text-xs font-bold text-[#214C54] bg-white border border-gray-200 rounded px-2 py-1"
              />
              <input 
                type="text"
                value={draftTruCot3.subtitle}
                onChange={(e) => setDraftTruCot3({ ...draftTruCot3, subtitle: e.target.value })}
                className="w-full text-[10px] font-semibold text-gray-400 bg-white border border-gray-200 rounded px-2 py-1 uppercase"
              />
              <textarea 
                value={draftTruCot3.desc}
                onChange={(e) => setDraftTruCot3({ ...draftTruCot3, desc: e.target.value })}
                className="w-full text-xs text-[#3E5E63] bg-white border border-gray-200 rounded px-2 py-1 resize-none"
                rows={3}
              />
            </div>
          ) : (
            <>
              <div>
                <span className="font-black text-sm text-[#00B2E2] block mb-1">{draftTruCot3.title}</span>
                <span className="text-[10px] text-[#00B2E2]/60 font-black block uppercase tracking-wider mb-3.5">{draftTruCot3.subtitle}</span>
              </div>
              <p className="text-xs md:text-sm text-[#3E5E63] leading-relaxed font-medium">{draftTruCot3.desc}</p>
            </>
          )}
        </div>
      </div>

      {/* Editable Outro footer */}
      <div className="pt-6 border-t border-gray-100 mt-8 relative">
        {isEditMode ? (
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-gray-400">PHẦN CAM KẾT & CHỮ KÝ OUTRO:</span>
            {activeEditorId === 'editor-outro' && renderEditorToolbar('editor-outro')}
            <div
              id="editor-outro"
              contentEditable
              suppressContentEditableWarning
              onFocus={() => setActiveEditorId('editor-outro')}
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
                setDraftOutro(cleanText);
              }}
              className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none min-h-[100px] text-xs font-semibold focus:ring-1 focus:ring-[#214C54]"
              dangerouslySetInnerHTML={{
                __html: draftOutro
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
                  .split('\n').join('<br>')
              }}
            />
          </div>
        ) : (
          <div className="bg-[#214C54]/5 border border-[#214C54]/10 rounded-2xl p-6 md:p-8 space-y-4">
            <div className="text-sm md:text-[15px] font-semibold text-[#15333B] leading-relaxed space-y-3">
              {draftOutro.split('\n\n').map((paragraph, pIdx) => {
                const lines = paragraph.split('\n');
                const isBulletList = lines.some(line => line.trim().startsWith('-'));
                
                if (isBulletList) {
                  return (
                    <ul key={pIdx} className="list-none space-y-2.5 my-3.5 pl-1">
                      {lines.map((line, lIdx) => {
                        const cleanLine = line.replace(/^-\s*/, '');
                        return (
                          <li key={lIdx} className="flex items-center gap-2.5 text-sm text-[#214C54] font-bold">
                            <span className="w-2 h-2 rounded-full bg-[#EAB308] shrink-0" />
                            {renderRichText(cleanLine)}
                          </li>
                        );
                      })}
                    </ul>
                  );
                }

                // Check if it's the personal signature note
                const isPersonalNote = paragraph.trim().startsWith('*') || paragraph.trim().includes('Thân gửi,') || paragraph.trim().includes('Đội ngũ The1ight');
                if (isPersonalNote) {
                  return (
                    <div key={pIdx} className="border-l-2 border-slate-300 pl-4 py-1.5 my-4 italic text-slate-500 font-medium text-xs md:text-sm">
                      {renderRichText(paragraph.replace(/^\*\s*/, ''))}
                    </div>
                  );
                }

                return (
                  <p key={pIdx} className="leading-relaxed">
                    {renderRichText(paragraph)}
                  </p>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
