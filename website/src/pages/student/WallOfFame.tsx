import React, { useState, useEffect } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Shield, Lock, HelpCircle } from 'lucide-react';

// ─── Level Configuration with Pirate Theme ──────────────────────────────────
interface LevelDef {
  level: number;
  name: string;
  minMiles: number;
  perk: string;
}

const LEVELS: LevelDef[] = [
  { level: 1, name: 'Thủy thủ tập sự', minMiles: 0, perk: 'Gia nhập thủy thủ đoàn' },
  { level: 2, name: 'Hoa tiêu', minMiles: 501, perk: 'Xem Lịch hoạt động lớp học & Mở khóa Kho tài nguyên' },
  { level: 3, name: 'Thuyền phó', minMiles: 1501, perk: 'Được quyền duyệt bài viết nhanh' },
  { level: 4, name: 'Thuyền trưởng', minMiles: 3001, perk: 'Cơ hội làm Mentor trợ giảng' },
  { level: 5, name: 'Huyền thoại biển cả', minMiles: 5000, perk: 'Vinh danh Bảng Vàng vĩnh viễn' },
];

const getStudentLevel = (miles: number): LevelDef => {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (miles >= LEVELS[i].minMiles) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
};

// ─── Mock Classmates to make Leaderboard active & alive ───────────────────────
const MOCK_CLASSMATES: { id: string; full_name: string; avatar_url: string; role: string; nautical_miles: number }[] = [];


// ─── Points Helper (Deterministic scaling) ──────────────────────────────────
const getPointsForType = (student: { id: string; nautical_miles: number }, type: 'daily' | '7day' | 'alltime'): number => {
  if (type === 'alltime') {
    return student.nautical_miles;
  }
  
  const seed = student.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  if (type === '7day') {
    const factor = 0.15 + (seed % 15) / 100; // 15% to 29%
    return Math.floor(student.nautical_miles * factor);
  }
  
  // daily points
  const factor = 0.02 + (seed % 8) / 100; // 2% to 9%
  return Math.floor(student.nautical_miles * factor);
};

// ─── Custom SVG Medal component for Ranks 1, 2, 3 ──────────────────────────────
const RankMedal: React.FC<{ rank: number }> = ({ rank }) => {
  if (rank === 1) {
    return (
      <div className="relative flex items-center justify-center w-8 h-8 shrink-0">
        <svg className="absolute top-[18px] w-5 h-5 text-yellow-600 drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7 10l2 11 3-3 3 3 2-11H7z" />
        </svg>
        <div className="absolute w-7 h-7 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-500 border border-yellow-200 flex items-center justify-center text-xs font-black text-amber-950 shadow-sm">
          1
        </div>
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="relative flex items-center justify-center w-8 h-8 shrink-0">
        <svg className="absolute top-[18px] w-5 h-5 text-slate-400 drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7 10l2 11 3-3 3 3 2-11H7z" />
        </svg>
        <div className="absolute w-7 h-7 rounded-full bg-gradient-to-br from-slate-200 via-gray-300 to-slate-400 border border-slate-100 flex items-center justify-center text-xs font-black text-slate-800 shadow-sm">
          2
        </div>
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="relative flex items-center justify-center w-8 h-8 shrink-0">
        <svg className="absolute top-[18px] w-5 h-5 text-amber-700 drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7 10l2 11 3-3 3 3 2-11H7z" />
        </svg>
        <div className="absolute w-7 h-7 rounded-full bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 border border-amber-500 flex items-center justify-center text-xs font-black text-amber-50 shadow-sm">
          3
        </div>
      </div>
    );
  }
  return (
    <div className="w-8 h-8 flex items-center justify-center text-xs font-semibold text-gray-400 shrink-0">
      {rank}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const WallOfFame: React.FC = () => {
  const { users, activeUser } = useDatabase();
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short', year: 'numeric' });
    setLastUpdated(`Cập nhật lúc: ${timeStr} ngày ${dateStr}`);
  }, []);

  // Merge database students and mock classmates, filtering duplicates
  const realStudents = users.filter(u => u.role === 'student');
  const allStudents = [
    ...realStudents,
    ...MOCK_CLASSMATES.filter(m => !realStudents.some(u => u.full_name === m.full_name))
  ];

  // If active user is admin, add them as student for preview purposes
  const isActiveUserStudent = activeUser.role === 'student';
  const displayActiveUser = isActiveUserStudent 
    ? activeUser 
    : { ...activeUser, role: 'student', nautical_miles: 320 }; // Fallback preview miles for admin

  const finalStudents = allStudents.some(s => s.id === displayActiveUser.id)
    ? allStudents
    : [...allStudents, displayActiveUser];

  // Helper to calculate leaderboard list
  const getLeaderboardData = (type: 'daily' | '7day' | 'alltime') => {
    return finalStudents
      .map(s => ({
        id: s.id,
        full_name: s.full_name,
        avatar_url: s.avatar_url,
        points: getPointsForType(s, type),
        nautical_miles: s.nautical_miles
      }))
      .sort((a, b) => b.points - a.points || b.nautical_miles - a.nautical_miles);
  };

  // Profile calculations for active user
  const myMiles = displayActiveUser.nautical_miles;
  const currentLvl = getStudentLevel(myMiles);
  const nextLvlIndex = LEVELS.findIndex(l => l.level === currentLvl.level) + 1;
  const nextLvl = nextLvlIndex < LEVELS.length ? LEVELS[nextLvlIndex] : null;

  let milesNeeded = 0;
  let progressPercent = 100;
  if (nextLvl) {
    milesNeeded = nextLvl.minMiles - myMiles;
    const levelRange = nextLvl.minMiles - currentLvl.minMiles;
    const earnedInLevel = myMiles - currentLvl.minMiles;
    progressPercent = Math.min(100, Math.max(0, (earnedInLevel / levelRange) * 100));
  }

  // Calculate dynamic percentages for each level based on finalStudents
  const levelDistribution = LEVELS.map(l => {
    const count = finalStudents.filter(s => getStudentLevel(s.nautical_miles).level === l.level).length;
    const pct = finalStudents.length > 0 ? Math.round((count / finalStudents.length) * 100) : 0;
    return { ...l, percent: pct };
  });

  // SVG configurations for Circular Progress
  const svgSize = 110;
  const strokeWidth = 4;
  const center = svgSize / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 pb-12 animate-fade-in select-none">
      
      {/* ─── Level Progression Card ─── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 flex flex-col lg:flex-row gap-8 items-stretch">
        
        {/* Left Section: User Profile & Circular Progress */}
        <div className="flex flex-col items-center justify-center text-center lg:border-r lg:border-gray-100 lg:pr-8 lg:w-1/3">
          <div className="relative animate-bounce-slow" style={{ width: svgSize, height: svgSize }}>
            <svg className="w-full h-full transform -rotate-90">
              {/* Background Track */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                className="text-gray-100"
                strokeWidth={strokeWidth}
                stroke="currentColor"
                fill="transparent"
              />
              {/* Progress Arc */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                className="text-primary-teal"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            
            {/* Avatar inside */}
            <div className="absolute inset-[6px] rounded-full overflow-hidden border border-gray-55">
              <img
                src={displayActiveUser.avatar_url}
                alt={displayActiveUser.full_name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Level Badge bottom right */}
            <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-primary-teal text-white flex items-center justify-center text-xs font-black border-2 border-white shadow-md">
              {currentLvl.level}
            </div>
          </div>

          <h2 className="mt-4 text-xl font-extrabold text-dark-slate flex items-center gap-1.5 justify-center">
            {displayActiveUser.full_name}
            {!isActiveUserStudent && (
              <span className="text-[10px] bg-red-100 text-red-700 font-extrabold px-1.5 py-0.5 rounded-full uppercase">
                Mentor/Admin
              </span>
            )}
          </h2>
          <p className="text-sm font-bold text-muted-teal mt-0.5">{currentLvl.name}</p>

          <div className="mt-4 flex items-center justify-center">
            {nextLvl ? (
              <div className="relative group flex items-center gap-1 cursor-pointer bg-gray-50 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">
                <span className="text-xs text-gray-500 font-semibold">
                  Còn <strong className="text-deep-gold font-extrabold">{milesNeeded}</strong> Hải lý để lên cấp
                </span>
                <HelpCircle size={13} className="text-gray-400" />
                
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-dark-slate text-white text-xs py-2 px-3 rounded-lg shadow-xl w-60 z-20 leading-relaxed text-center font-normal">
                  Bạn đang ở Cấp {currentLvl.level} ({myMiles} Hải lý). Cấp {nextLvl.level} ({nextLvl.name}) yêu cầu tối thiểu {nextLvl.minMiles} Hải lý.
                </div>
              </div>
            ) : (
              <span className="text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-full font-bold flex items-center gap-1">
                🏆 Đã đạt cấp độ tối đa!
              </span>
            )}
          </div>
        </div>

        {/* Right Section: 9 Levels Distribution */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={16} className="text-primary-teal" />
            <h3 className="text-xs font-black text-dark-slate uppercase tracking-wider">
              Danh sách Cấp độ Hải Trình
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {levelDistribution.map((lvl) => {
              const isUnlocked = myMiles >= lvl.minMiles;
              return (
                <div
                  key={lvl.level}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                    isUnlocked
                      ? 'bg-[#fefaf0]/60 border-[#ffd94c]/30 shadow-sm'
                      : 'bg-white border-gray-100 opacity-60'
                  }`}
                >
                  {/* Status Indicator */}
                  {isUnlocked ? (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-500 text-amber-950 font-black flex items-center justify-center text-sm shadow-sm shrink-0 border border-amber-300">
                      {lvl.level}
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 text-gray-400 flex items-center justify-center shrink-0">
                      <Lock size={13} />
                    </div>
                  )}

                  {/* Level details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-dark-slate truncate">
                        Cấp {lvl.level} - {lvl.name}
                      </h4>
                      <span className="text-[10px] text-gray-400 font-semibold whitespace-nowrap ml-2">
                        {lvl.percent}% thành viên
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-teal font-medium mt-0.5 truncate">
                      {lvl.perk}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Last Updated Banner ─── */}
      <div className="flex justify-between items-center text-[11px] text-gray-400 font-bold tracking-wider px-2">
        <span className="uppercase">Bảng xếp hạng thủy thủ đoàn</span>
        <span>{lastUpdated}</span>
      </div>

      {/* ─── Leaderboard Columns ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Daily */}
        <LeaderboardColumn
          title="Hôm nay (Daily)"
          type="daily"
          data={getLeaderboardData('daily')}
          activeUserId={displayActiveUser.id}
          isPrefix={true}
        />

        {/* Column 2: 7-day */}
        <LeaderboardColumn
          title="Tuần này (7-day)"
          type="7day"
          data={getLeaderboardData('7day')}
          activeUserId={displayActiveUser.id}
          isPrefix={true}
        />

        {/* Column 3: All-time */}
        <LeaderboardColumn
          title="Trọn đời (All-time)"
          type="alltime"
          data={getLeaderboardData('alltime')}
          activeUserId={displayActiveUser.id}
          isPrefix={false}
        />

      </div>

      {/* ─── Footer note ─── */}
      <p className="text-center text-xs text-gray-400 font-bold max-w-lg mx-auto leading-relaxed">
        ⚓ Điểm số Hải lý được cập nhật tự động khi nộp bài tập, tương tác thảo luận, hoặc đạt cấp độ Mastery. Hãy sẵn sàng cho hải trình tự học và làm sản phẩm số thực chiến!
      </p>
    </div>
  );
};

// ─── Subcomponent: Leaderboard Column ─────────────────────────────────────────
interface LeaderboardColumnProps {
  title: string;
  type: 'daily' | '7day' | 'alltime';
  data: Array<{
    id: string;
    full_name: string;
    avatar_url: string;
    points: number;
    nautical_miles: number;
  }>;
  activeUserId: string;
  isPrefix: boolean;
}

const LeaderboardColumn: React.FC<LeaderboardColumnProps> = ({
  title,
  type,
  data,
  activeUserId,
  isPrefix,
}) => {
  const top10 = data.slice(0, 10);
  
  // Find active user rank in whole list
  const activeUserRankIndex = data.findIndex(s => s.id === activeUserId);
  const myRank = activeUserRankIndex !== -1 ? activeUserRankIndex + 1 : 999;
  const myData = activeUserRankIndex !== -1 ? data[activeUserRankIndex] : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
      
      {/* Title */}
      <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
        <h3 className="font-extrabold text-sm text-dark-slate">
          {title}
        </h3>
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
          {type === 'alltime' ? 'Hải lý' : 'Hải lý mới'}
        </span>
      </div>

      {/* Ranks list */}
      <div className="divide-y divide-gray-50 flex-1">
        {top10.map((student, idx) => {
          const rank = idx + 1;
          const isMe = student.id === activeUserId;
          const pointsFormatted = isPrefix 
            ? `+${student.points.toLocaleString()}` 
            : student.points.toLocaleString();

          return (
            <div
              key={student.id}
              className={`flex items-center gap-3 px-5 py-3 transition-colors ${
                isMe ? 'bg-primary-teal/5' : 'hover:bg-gray-50/50'
              }`}
            >
              <RankMedal rank={rank} />
              
              <img
                src={student.avatar_url}
                alt={student.full_name}
                className="w-8 h-8 rounded-full object-cover border border-gray-100"
              />
              
              <div className="flex-1 min-w-0">
                <span className={`text-xs font-bold block truncate ${
                  isMe ? 'text-primary-teal' : 'text-dark-slate'
                }`}>
                  {student.full_name}
                </span>
                <span className="text-[10px] font-semibold text-gray-400">
                  Cấp {getStudentLevel(student.nautical_miles).level}
                </span>
              </div>

              <span className={`text-xs font-black shrink-0 ${
                type === 'alltime' 
                  ? 'text-dark-slate' 
                  : 'text-primary-teal'
              }`}>
                {pointsFormatted}
              </span>
            </div>
          );
        })}

        {/* Empty placeholder if no students */}
        {top10.length === 0 && (
          <div className="py-12 text-center text-xs text-gray-400 font-medium">
            Chưa có thủy thủ nào lọt top
          </div>
        )}
      </div>

      {/* Your Rank Footer */}
      {myData && (
        <div className="bg-gray-50 border-t border-gray-100 px-5 py-3.5 mt-auto">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            Thứ hạng của bạn
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center text-xs font-black text-dark-slate shrink-0">
              {myRank}
            </div>
            
            <img
              src={myData.avatar_url}
              alt={myData.full_name}
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
            />
            
            <div className="flex-1 min-w-0">
              <span className="text-xs font-extrabold text-dark-slate block truncate">
                {myData.full_name} (Bạn)
              </span>
              <span className="text-[10px] font-semibold text-gray-400">
                Cấp {getStudentLevel(myData.nautical_miles).level}
              </span>
            </div>

            <span className={`text-xs font-black shrink-0 ${
              type === 'alltime' 
                ? 'text-dark-slate' 
                : 'text-primary-teal'
            }`}>
              {isPrefix ? `+${myData.points.toLocaleString()}` : myData.points.toLocaleString()}
            </span>
          </div>
        </div>
      )}

    </div>
  );
};
