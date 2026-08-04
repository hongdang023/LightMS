import React from 'react';
import { Trash2, Plus } from 'lucide-react';
import type { BenefitClub } from '../../data/aboutViewData';

interface BenefitsTabProps {
  isEditMode: boolean;
  activeEditorId: string | null;
  setActiveEditorId: (id: string | null) => void;
  draftBenefitClubs: BenefitClub[];
  setDraftBenefitClubs: (val: BenefitClub[]) => void;
  draftLuuYGold: string;
  setDraftLuuYGold: (val: string) => void;
  handleAddBenefitClub: () => void;
  handleDeleteBenefitClub: (idx: number) => void;
  handleAddClubLink: (clubIdx: number) => void;
  handleDeleteClubLink: (clubIdx: number, linkIdx: number) => void;
  renderRichText: (text: string) => React.ReactNode;
  renderEditorToolbar: (editorId: string) => React.ReactNode;
}

export const BenefitsTab: React.FC<BenefitsTabProps> = ({
  isEditMode,
  activeEditorId,
  setActiveEditorId,
  draftBenefitClubs,
  setDraftBenefitClubs,
  draftLuuYGold,
  setDraftLuuYGold,
  handleAddBenefitClub,
  handleDeleteBenefitClub,
  handleAddClubLink,
  handleDeleteClubLink,
  renderRichText,
  renderEditorToolbar,
}) => {
  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div>
        <h3 className="font-extrabold text-base text-[#15333B] mb-4">🎁 Quyền lợi học viên:</h3>
        
        {/* Editable Dynamic Benefit Clubs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {draftBenefitClubs.map((club, clubIdx) => (
            <div key={clubIdx} className="relative flex flex-col justify-between p-5 bg-white rounded-2xl border border-gray-150 shadow-sm group hover:shadow-md transition-all duration-300">
              {isEditMode ? (
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={club.icon}
                      onChange={(e) => {
                        const next = [...draftBenefitClubs];
                        next[clubIdx].icon = e.target.value;
                        setDraftBenefitClubs(next);
                      }}
                      className="w-8 border border-gray-200 rounded text-center text-sm py-1"
                      placeholder="Icon"
                    />
                    <input
                      type="text"
                      value={club.name}
                      onChange={(e) => {
                        const next = [...draftBenefitClubs];
                        next[clubIdx].name = e.target.value;
                        setDraftBenefitClubs(next);
                      }}
                      className="flex-1 border border-gray-200 rounded px-2 text-sm font-bold text-[#15333B] py-1"
                      placeholder="Tên nhóm / quyền lợi"
                    />
                  </div>

                  <textarea
                    value={club.desc}
                    onChange={(e) => {
                      const next = [...draftBenefitClubs];
                      next[clubIdx].desc = e.target.value;
                      setDraftBenefitClubs(next);
                    }}
                    className="w-full border border-gray-200 rounded px-2 text-xs py-1.5 resize-none"
                    placeholder="Mô tả chi tiết quyền lợi"
                    rows={3}
                  />

                  {/* CTA Links management */}
                  <div className="space-y-1.5 bg-gray-50/50 p-2 rounded-lg border border-gray-100">
                    <span className="text-[9px] font-bold text-gray-400 block">DANH SÁCH CTA BUTTONS:</span>
                    {club.links.map((link, linkIdx) => (
                      <div key={linkIdx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => {
                            const next = [...draftBenefitClubs];
                            next[clubIdx].links[linkIdx].label = e.target.value;
                            setDraftBenefitClubs(next);
                          }}
                          className="w-32 border border-gray-200 rounded px-2 text-[10px] py-0.5 bg-white font-semibold"
                          placeholder="Tên nút"
                        />
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) => {
                            const next = [...draftBenefitClubs];
                            next[clubIdx].links[linkIdx].url = e.target.value;
                            setDraftBenefitClubs(next);
                          }}
                          className="flex-1 border border-gray-200 rounded px-2 text-[9px] py-0.5 bg-white"
                          placeholder="Link URL"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteClubLink(clubIdx, linkIdx)}
                          className="text-red-500 hover:text-red-700 p-0.5"
                          title="Xóa nút này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddClubLink(clubIdx)}
                      className="text-[9px] font-extrabold text-[#214C54] hover:underline flex items-center gap-0.5 mt-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Thêm CTA Button
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteBenefitClub(clubIdx)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1"
                    title="Xóa thẻ quyền lợi này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-3 border-b border-gray-150 pb-2.5">
                      <span className="text-2xl shrink-0">{club.icon}</span>
                      <h4 className="font-extrabold text-[#15333B] text-sm md:text-[15px]">{club.name}</h4>
                    </div>
                    <p className="text-xs md:text-sm text-[#3E5E63] leading-relaxed font-semibold mb-4">{club.desc}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3 select-none">
                    {club.links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-bold text-[#FFD94C] bg-[#15333B] px-2.5 py-1.5 rounded-lg hover:bg-[#214C54] transition-colors"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {isEditMode && (
          <button
            type="button"
            onClick={handleAddBenefitClub}
            className="w-full flex items-center justify-center gap-1 py-3 border border-dashed border-[#214C54]/40 hover:border-[#214C54] rounded-2xl text-xs text-[#214C54] font-bold bg-white transition-colors mt-4"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm thẻ quyền lợi cộng đồng</span>
          </button>
        )}
      </div>

      {/* Lưu Ý Gold */}
      <div className="mt-6">
        {isEditMode ? (
          <div className="space-y-1.5 bg-[#FFD94C]/10 border border-[#FFD94C]/30 rounded-2xl p-4">
            <span className="text-[9px] font-bold text-[#554300]">CẢNH BÁO / LƯU Ý MÀU VÀNG:</span>
            {activeEditorId === 'editor-luu-y' && renderEditorToolbar('editor-luu-y')}
            <div
              id="editor-luu-y"
              contentEditable
              suppressContentEditableWarning
              onFocus={() => setActiveEditorId('editor-luu-y')}
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
                setDraftLuuYGold(cleanText);
              }}
              className="w-full bg-white border border-gray-200 rounded-xl p-3 outline-none text-xs font-semibold"
              dangerouslySetInnerHTML={{
                __html: draftLuuYGold
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
                  .split('\n').join('<br>')
              }}
            />
          </div>
        ) : (
          <div className="p-4 bg-[#FFD94C]/10 border border-[#FFD94C]/30 rounded-2xl text-[11px] text-[#554300] font-medium animate-fade-in">
            {renderRichText(draftLuuYGold)}
          </div>
        )}
      </div>
    </div>
  );
};
