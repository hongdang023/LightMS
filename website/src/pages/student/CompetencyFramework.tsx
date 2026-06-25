import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { RadarChart } from '../../components/RadarChart';
import { PageHeader } from '../../components/PageHeader';
import { Target } from 'lucide-react';

export const CompetencyFramework: React.FC = () => {
  const { skills, activeUser, masteryRecords } = useDatabase();
  const [selectedSkillId, setSelectedSkillId] = useState<string>('skill-problem');

  const activeSkill = skills.find(s => s.id === selectedSkillId) || skills[0];
  
  // Find active student's level for activeSkill
  const record = masteryRecords.find(r => r.student_id === activeUser.id && r.skill_id === activeSkill.id);
  const currentLevelStr = record ? record.mastery_level : 'none';

  // Map database level string to Dreyfus index (1 to 5)
  const getDreyfusIndex = (lvl: string): number => {
    switch (lvl) {
      case 'excellent': return 5; // Expert
      case 'meets_expectations': return 3; // Competent
      case 'needs_improvement': return 1.5; // Advanced Beginner
      case 'none':
      default: return 0; // Novice
    }
  };

  const currentDreyfusIndex = getDreyfusIndex(currentLevelStr);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in select-none">
      <div className="col-span-1 lg:col-span-12">
        <PageHeader
          title="Bản Đồ Năng Lực"
          description="Theo dõi sự phát triển kỹ năng và chuyên môn của bạn qua từng bài học."
          icon={<Target size={32} strokeWidth={1.5} />}
        />
      </div>

      {/* Left Column: Radar Chart & Skill Buttons (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        <RadarChart studentId={activeUser.id} skills={skills} />

        {/* Skill Selector List */}
        <div className="card space-y-2">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Danh sách Kỹ năng</h4>
          <div className="space-y-1">
            {skills.map((skill) => {
              const isActive = skill.id === selectedSkillId;
              const skillRecord = masteryRecords.find(r => r.student_id === activeUser.id && r.skill_id === skill.id);
              const userLevel = skillRecord ? skillRecord.mastery_level : 'none';
              
              return (
                <button
                  key={skill.id}
                  onClick={() => setSelectedSkillId(skill.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    isActive 
                      ? 'bg-[#214C54] border-[#214C54] text-white shadow' 
                      : 'bg-white border-gray-100 text-[#15333B] hover:border-gray-300'
                  }`}
                >
                  <span className="text-xs font-semibold truncate leading-snug pr-2">
                    {skill.name.split(' (')[0]}
                  </span>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-[#3E5E63]'
                  }`}>
                    Lvl {getDreyfusIndex(userLevel)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column: Dreyfus levels list (7 cols) */}
      <div className="lg:col-span-7 card flex flex-col h-full bg-white border border-gray-200 rounded-2xl shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-100 pb-4 mb-6">
          <span className="text-xs text-[#214C54] font-extrabold uppercase tracking-wider">Tiêu chuẩn Sư phạm Dreyfus 5 Cấp Độ</span>
          <h3 className="font-extrabold text-base text-[#15333B] mt-1">
            {activeSkill.name}
          </h3>
          <p className="text-xs text-[#3E5E63] font-medium mt-1 leading-relaxed">
            {activeSkill.description}
          </p>
        </div>

        {/* Dreyfus Level Cards */}
        <div className="space-y-3.5">
          {Object.entries(activeSkill.levels).map(([lvlIndexStr, desc]) => {
            const lvlIndex = parseInt(lvlIndexStr);
            
            // Check mapping
            let isCurrent = false;
            if (lvlIndex === 1 && currentDreyfusIndex === 0) isCurrent = true;
            if (lvlIndex === 2 && currentDreyfusIndex === 1.5) isCurrent = true;
            if (lvlIndex === 3 && currentDreyfusIndex === 3) isCurrent = true;
            if (lvlIndex === 5 && currentDreyfusIndex === 5) isCurrent = true;

            const isTarget = lvlIndex === 3;

            return (
              <div 
                key={lvlIndex}
                className={`p-4 rounded-xl border transition-all relative overflow-hidden ${
                  isCurrent 
                    ? 'bg-[#FDF5DA] border-[#EAB308] text-[#15333B]' 
                    : isTarget
                      ? 'bg-teal-50/30 border-teal-200/50 text-[#15333B]'
                      : 'bg-gray-50/50 border-gray-100 text-gray-700'
                }`}
              >
                {/* Badges for status */}
                <div className="absolute top-3 right-4 flex items-center gap-1.5 select-none">
                  {isCurrent && (
                    <span className="bg-[#EAB308] text-[#15333B] text-[8px] font-black uppercase px-2 py-0.5 rounded shadow-sm">
                      Năng lực của bạn
                    </span>
                  )}
                  {isTarget && (
                    <span className="bg-[#214C54] text-white text-[8px] font-black uppercase px-2 py-0.5 rounded shadow-sm">
                      Mốc Tốt Nghiệp
                    </span>
                  )}
                </div>

                <div className="flex gap-3">
                  <span className={`text-sm font-black flex items-center justify-center w-7 h-7 rounded-full shrink-0 ${
                    isCurrent 
                      ? 'bg-[#EAB308] text-[#15333B]' 
                      : 'bg-[#214C54]/10 text-[#214C54]'
                  }`}>
                    {lvlIndex}
                  </span>
                  <div className="space-y-0.5 pr-20">
                    <h5 className="font-bold text-xs">
                      {lvlIndex === 1 ? '1. Novice (Người mới)' : 
                       lvlIndex === 2 ? '2. Advanced Beginner (Mới bắt đầu)' :
                       lvlIndex === 3 ? '3. Competent (Người làm việc được)' :
                       lvlIndex === 4 ? '4. Proficient (Người thông thạo)' :
                       '5. Expert (Chuyên gia)'}
                    </h5>
                    <p className="text-xs text-[#3E5E63] font-medium leading-relaxed mt-1">
                      {desc.replace(/Novice:|Advanced Beginner:|Competent \(Mục tiêu khóa học\):|Proficient:|Expert:/, '')}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
