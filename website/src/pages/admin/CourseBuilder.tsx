import React, { useState } from 'react';
import { AboutView } from '../student/AboutView';
import { OnboardingView } from '../student/OnboardingView';
import { SyllabusView } from '../student/SyllabusView';
import { Eye, Edit2, Anchor, Sparkles, BookOpen } from 'lucide-react';

export const CourseBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'about' | 'onboarding' | 'syllabus'>('about');
  const [isEditMode, setIsEditMode] = useState(false);

  const tabs = [
    { id: 'about' as const, label: '01. Giới thiệu khoá học', icon: <Anchor className="w-4 h-4" /> },
    { id: 'onboarding' as const, label: '02. Tuần Onboarding (7 Ngày)', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'syllabus' as const, label: '03. Lộ trình Học (Syllabus)', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">

      {/* ── Page Header + Mode Toggle ──────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <span className="text-[10px] bg-[#214C54]/10 text-[#214C54] px-2 py-0.5 rounded font-extrabold uppercase tracking-wider font-mono">
            Admin Console
          </span>
          <h2 className="text-xl font-extrabold text-[#15333B] mt-1">Soạn lộ trình</h2>
          <p className="text-xs text-[#3E5E63] mt-0.5">
            Xem trước và chỉnh sửa nội dung giới thiệu, onboarding và lộ trình học — y hệt giao diện học viên.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-1 bg-gray-100 p-1.5 rounded-2xl self-start md:self-auto border border-gray-200">
          <button
            onClick={() => setIsEditMode(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              !isEditMode
                ? 'bg-white text-[#214C54] shadow-sm border border-gray-200'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Reading Mode</span>
          </button>
          <button
            onClick={() => setIsEditMode(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              isEditMode
                ? 'bg-[#214C54] text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Editing Mode</span>
          </button>
        </div>
      </div>

      {/* ── Tab Bar ────────────────────────────────────────────────────────── */}
      <div className="flex border-b border-gray-200 gap-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-[#214C54] text-[#214C54]'
                : 'border-transparent text-gray-500 hover:text-[#214C54]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab Content ────────────────────────────────────────────────────── */}
      {/* ALWAYS renders the actual student component, passing down isEditMode */}
      <div className="min-h-[500px]">

        {/* ABOUT TAB */}
        {activeTab === 'about' && (
          <AboutView onPageChange={() => {}} isEditMode={isEditMode} />
        )}

        {/* ONBOARDING TAB */}
        {activeTab === 'onboarding' && (
          <OnboardingView isEditMode={isEditMode} />
        )}

        {/* SYLLABUS TAB */}
        {activeTab === 'syllabus' && (
          <SyllabusView isEditMode={isEditMode} />
        )}
      </div>

    </div>
  );
};
