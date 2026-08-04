import React, { useState, useEffect } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Shield } from 'lucide-react';



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
  const { users, activeUser, badges, profileBadges } = useDatabase();
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short', year: 'numeric' });
    setLastUpdated(`Cập nhật lúc: ${timeStr} ngày ${dateStr}`);
  }, []);

  // Merge database students and mock classmates, filtering duplicates
  const realStudents = users.filter(u => 
    u.role === 'student' && 
    u.gmail !== 'tuyethong.cym@gmail.com' && 
    u.gmail !== 'dangtuyethong2324@gmail.com'
  );
  const allStudents = [
    ...realStudents,
    ...MOCK_CLASSMATES.filter(m => !realStudents.some(u => u.full_name === m.full_name))
  ];

  // If active user is admin, add them as student for preview purposes
  const isAdminEmail = activeUser.gmail === 'tuyethong.cym@gmail.com' || activeUser.gmail === 'dangtuyethong2324@gmail.com';
  const isActiveUserStudent = activeUser.role === 'student' && !isAdminEmail;
  const displayActiveUser = isActiveUserStudent 
    ? activeUser 
    : { ...activeUser, role: 'student', nautical_miles: 0 }; // Fallback miles for admin if needed for display

  const finalStudents = (allStudents.some(s => s.id === displayActiveUser.id) || !isActiveUserStudent)
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

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 pb-12 animate-fade-in select-none">
      
      {/* ─── Gamification Overview Card ─── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 flex flex-col lg:flex-row gap-8 items-stretch">
        
        {/* Left Section: User Profile & Total Nautical Miles */}
        <div className="flex flex-col items-center justify-center text-center lg:border-r lg:border-gray-100 lg:pr-8 lg:w-1/3 py-4">
          <div className="relative w-28 h-28">
            <div className="absolute inset-0 rounded-full overflow-hidden border-2 border-primary-teal p-1">
              <img
                src={displayActiveUser.avatar_url}
                alt={displayActiveUser.full_name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>

          <h2 className="mt-4 text-xl font-extrabold text-dark-slate flex items-center gap-1.5 justify-center">
            {displayActiveUser.full_name}
            {!isActiveUserStudent && (
              <span className="text-[10px] bg-red-100 text-red-700 font-extrabold px-1.5 py-0.5 rounded-full uppercase">
                Admin
              </span>
            )}
          </h2>
          <p className="text-sm font-black text-primary-teal mt-1">
            ⭐️ {myMiles.toLocaleString()} Hải lý tích lũy
          </p>
        </div>

        {/* Right Section: Badges Showroom */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={16} className="text-primary-teal" />
            <h3 className="text-xs font-black text-dark-slate uppercase tracking-wider">
              Danh sách Huy hiệu Hải trình
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {badges.map((badge) => {
              const unlockedRecord = profileBadges.find(pb => pb.student_id === displayActiveUser.id && pb.badge_id === badge.id);
              const isUnlocked = !!unlockedRecord;
              return (
                <div
                  key={badge.id}
                  className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all duration-200 ${
                    isUnlocked
                      ? 'bg-amber-50/20 border-amber-200 shadow-sm'
                      : 'bg-gray-50/50 border-gray-150 opacity-60'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm shrink-0 border ${
                    isUnlocked ? 'bg-amber-100 border-amber-200' : 'bg-gray-200 border-gray-300 text-gray-400'
                  }`}>
                    {isUnlocked ? badge.icon : '🔒'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className={`text-xs font-bold ${isUnlocked ? 'text-amber-900' : 'text-gray-500'}`}>
                      {badge.name}
                    </h4>
                    <p className="text-[10px] text-gray-400 mt-1 leading-normal">
                      {badge.description}
                    </p>
                    {isUnlocked && unlockedRecord && (
                      <span className="text-[9px] text-emerald-600 font-extrabold mt-1 block">
                        Đã mở khóa: {new Date(unlockedRecord.unlocked_at).toLocaleDateString('vi-VN')}
                      </span>
                    )}
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
                  {student.nautical_miles.toLocaleString()} Hải lý
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
                {myData.nautical_miles.toLocaleString()} Hải lý
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
