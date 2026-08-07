import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGamification } from '../../context/GamificationContext';
import { Shield, HelpCircle } from 'lucide-react';
import { BadgeIcon } from '../../components/ui/BadgeIcon';



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

// ─── Subcomponent: Flip Badge Card ─────────────────────────────────────────
const FlipBadgeCard: React.FC<{
  badge: any;
  isUnlocked: boolean;
  unlockedRecord: any;
}> = ({ badge, isUnlocked, unlockedRecord }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      onClick={() => setIsFlipped(!isFlipped)}
      className="perspective-1000 cursor-pointer h-32 w-full animate-fade-in"
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front Side */}
        <div
          className={`absolute inset-0 backface-hidden flex flex-col items-center justify-between p-3.5 rounded-xl border text-center transition-all duration-200 ${
            isUnlocked
              ? 'bg-gradient-to-b from-amber-50/30 to-amber-100/10 border-amber-200 shadow-sm hover:border-amber-300'
              : 'bg-gray-50/50 border-gray-150 opacity-60'
          }`}
        >
          <div className="flex-1 flex items-center justify-center">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md border-2 transition-transform duration-300 hover:scale-110 ${
              isUnlocked 
                ? 'bg-gradient-to-br from-yellow-100 via-amber-100 to-yellow-200 border-amber-300' 
                : 'bg-gray-100 border-gray-200 text-gray-400'
            }`}>
              <BadgeIcon name={badge.icon} size={28} isUnlocked={isUnlocked} />
            </div>
          </div>

          <h4 className={`text-[10px] font-black tracking-wide mt-2 leading-tight uppercase truncate w-full px-1 ${isUnlocked ? 'text-amber-900' : 'text-gray-400'}`}>
            {badge.name}
          </h4>
        </div>

        {/* Back Side */}
        <div
          className={`absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all duration-200 ${
            isUnlocked
              ? 'bg-gradient-to-b from-amber-50/30 to-amber-100/10 border-amber-200 shadow-sm'
              : 'bg-gray-50/50 border-gray-150 opacity-60'
          }`}
        >
          <p className="text-[10px] text-gray-500 leading-relaxed font-bold">
            {badge.description}
          </p>
          {isUnlocked && unlockedRecord && (
            <span className="text-[9px] text-emerald-600 font-black mt-2 block leading-tight">
              Đã mở khóa: {new Date(unlockedRecord.unlocked_at).toLocaleDateString('vi-VN')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Subcomponent: Rank Trend Badge (Chỉ icon Thăng hạng) ──────────────────────
const RankTrendIndicator: React.FC<{ trend: 'up' | 'down' | 'same' | 'new' }> = ({ trend }) => {
  if (trend === 'up') {
    return (
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-emerald-600 bg-emerald-50 border border-emerald-100 shrink-0" title="Thăng hạng">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
        </svg>
      </span>
    );
  }
  return null;
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const WallOfFame: React.FC = () => {
  const { users, activeUser } = useAuth();
  const { badges, profileBadges, nauticalTransactions } = useGamification();
  const [lastUpdated, setLastUpdated] = useState('');
  
  // Active View Filter Mode: 'alltime' | 'daily' | '7day' | 'all'
  const [viewMode, setViewMode] = useState<'alltime' | 'daily' | '7day' | 'all'>('alltime');

  useEffect(() => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short', year: 'numeric' });
    setLastUpdated(`Cập nhật lúc: ${timeStr} ngày ${dateStr}`);
  }, []);

  const displayActiveUser = activeUser;

  // Real students fetched from profiles table
  const realStudents = users.filter(u => u.role === 'student');
  const finalStudents = realStudents.some(s => s.id === displayActiveUser.id)
    ? realStudents
    : [...realStudents, displayActiveUser];

  // Helper to calculate leaderboard list based exclusively on valid transactions
  const getLeaderboardData = (type: 'daily' | '7day' | 'alltime') => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOf7DaysAgo = new Date();
    startOf7DaysAgo.setDate(startOf7DaysAgo.getDate() - 7);
    startOf7DaysAgo.setHours(0, 0, 0, 0);

    // 7 days before threshold to calculate trend (previous 7-day period rank vs current)
    const startOf14DaysAgo = new Date();
    startOf14DaysAgo.setDate(startOf14DaysAgo.getDate() - 14);
    startOf14DaysAgo.setHours(0, 0, 0, 0);

    // Calculate previous period ranks to compare trend
    const prevRankMap = new Map<string, number>();
    const allStudentPrevPoints = finalStudents.map(s => {
      const sTxs = (nauticalTransactions || []).filter(t => t.student_id === s.id && (t.amount || 0) > 0);
      let pPoints = 0;
      if (type === 'alltime') {
        const prevTxs = sTxs.filter(t => new Date(t.created_at).getTime() < startOfToday.getTime());
        pPoints = prevTxs.reduce((sum, t) => sum + (t.amount || 0), 0);
      } else if (type === '7day') {
        const prevTxs = sTxs.filter(t => {
          const time = new Date(t.created_at).getTime();
          return time >= startOf14DaysAgo.getTime() && time < startOf7DaysAgo.getTime();
        });
        pPoints = prevTxs.reduce((sum, t) => sum + (t.amount || 0), 0);
      } else { // daily
        const yesterdayStart = new Date(startOfToday);
        yesterdayStart.setDate(yesterdayStart.getDate() - 1);
        const prevTxs = sTxs.filter(t => {
          const time = new Date(t.created_at).getTime();
          return time >= yesterdayStart.getTime() && time < startOfToday.getTime();
        });
        pPoints = prevTxs.reduce((sum, t) => sum + (t.amount || 0), 0);
      }
      return { id: s.id, pPoints };
    }).sort((a, b) => b.pPoints - a.pPoints);

    allStudentPrevPoints.forEach((item, idx) => {
      prevRankMap.set(item.id, idx + 1);
    });

    const currentRankedList = finalStudents
      .map(s => {
        const rawTxs = (nauticalTransactions || []).filter(t => t.student_id === s.id && (t.amount || 0) > 0);
        
        // Dedup: loại bỏ duplicate txs cùng description (link bằng chứng, bài học, onboarding)
        const seenDescKeys = new Set<string>();
        // Pass 1: mark which individual buổi have txs (to detect combined overlap)
        const hasIndivB1 = rawTxs.some(t => t.description && t.description.includes('Buổi 1') && !t.description.includes('& 2') && t.description.includes('Link nộp bài:'));
        const hasIndivB2 = rawTxs.some(t => t.description && t.description.includes('Buổi 2') && !t.description.includes('1 &') && !t.description.includes('& 2') && t.description.includes('Link nộp bài:'));
        const studentTxs = rawTxs.filter(t => {
          // Skip combined "Buổi 1 & 2" tx if both individual txs exist
          if (t.amount === 100 && t.description && t.description.includes('& 2') && hasIndivB1 && hasIndivB2) return false;
          const key = t.action_type === 'profile_completion'
            ? 'profile'
            : (t.description || t.id);
          if (seenDescKeys.has(key)) return false;
          seenDescKeys.add(key);
          return true;
        });

        let points = 0;

        const latestTxTime = studentTxs.length > 0 
          ? Math.max(...studentTxs.map(t => new Date(t.created_at).getTime()))
          : Infinity;

        if (type === 'alltime') {
          points = studentTxs.reduce((sum, t) => sum + (t.amount || 0), 0);
        } else {
          const thresholdMs = type === 'daily' ? startOfToday.getTime() : startOf7DaysAgo.getTime();
          const filteredTxs = studentTxs.filter(t => {
            const txTime = new Date(t.created_at).getTime();
            return txTime >= thresholdMs;
          });
          points = filteredTxs.reduce((sum, t) => sum + (t.amount || 0), 0);
        }

        return {
          id: s.id,
          full_name: s.full_name,
          avatar_url: s.avatar_url,
          points,
          nautical_miles: points,
          latestTxTime
        };
      })
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        return a.latestTxTime - b.latestTxTime;
      });

    return currentRankedList.map((student, currentIdx) => {
      const currentRank = currentIdx + 1;
      const prevRank = prevRankMap.get(student.id) || 999;
      let trend: 'up' | 'down' | 'same' | 'new' = 'same';
      
      if (prevRank === 999 && student.points > 0) {
        trend = 'new';
      } else if (currentRank < prevRank) {
        trend = 'up';
      } else if (currentRank > prevRank) {
        trend = 'down';
      } else {
        trend = 'same';
      }

      return {
        ...student,
        trend
      };
    });
  };

  // Profile calculations for active user
  const myMiles = displayActiveUser.nautical_miles;

  const isAdminEmail = activeUser.gmail === 'dangtuyethong2324@gmail.com';
  const isActiveUserStudent = activeUser.role === 'student' && !isAdminEmail;

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 pb-12 animate-fade-in select-none">
      
      {/* ─── Gamification Overview Card ─── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 flex flex-col lg:flex-row gap-8 items-stretch">
        
        {/* Left Section: User Profile & Total Nautical Miles */}
        <div className="flex flex-col items-center justify-center text-center lg:border-r lg:border-gray-100 lg:pr-8 lg:w-1/4 py-4">
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

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {badges.map((badge) => {
              const unlockedRecord = profileBadges.find(pb => pb.student_id === displayActiveUser.id && pb.badge_id === badge.id);
              const isUnlocked = !!unlockedRecord;
              return (
                <FlipBadgeCard
                  key={badge.id}
                  badge={badge}
                  isUnlocked={isUnlocked}
                  unlockedRecord={unlockedRecord}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Leaderboard Control Bar: View Pill Buttons & Tooltip Banner ─── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-3 md:px-5 md:py-3.5 rounded-2xl border border-gray-100 shadow-sm">
        
        {/* Left: View Filter Pill Buttons */}
        <div className="flex items-center gap-1.5 bg-gray-100/80 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setViewMode('alltime')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
              viewMode === 'alltime'
                ? 'bg-white text-primary-teal shadow-xs font-black'
                : 'text-gray-500 hover:text-dark-slate'
            }`}
          >
            🏆 Trọn đời (All-time)
          </button>
          <button
            onClick={() => setViewMode('7day')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
              viewMode === '7day'
                ? 'bg-white text-primary-teal shadow-xs font-black'
                : 'text-gray-500 hover:text-dark-slate'
            }`}
          >
            🗓️ Tuần này (7-day)
          </button>
          <button
            onClick={() => setViewMode('daily')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
              viewMode === 'daily'
                ? 'bg-white text-primary-teal shadow-xs font-black'
                : 'text-gray-500 hover:text-dark-slate'
            }`}
          >
            ⚡ Hôm nay (Daily)
          </button>
          <button
            onClick={() => setViewMode('all')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
              viewMode === 'all'
                ? 'bg-primary-teal text-white shadow-xs font-black'
                : 'text-gray-500 hover:text-dark-slate'
            }`}
          >
            📊 Xem cả 3 cột
          </button>
        </div>

        {/* Right: Info & Last Updated */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto text-[11px] text-gray-400 font-bold tracking-wider px-1">
          <div className="relative group flex items-center gap-1.5 cursor-pointer">
            <span className="uppercase text-dark-slate">Giải thích BXH</span>
            <HelpCircle size={14} className="text-gray-400 hover:text-gray-600 transition-colors" />
            
            {/* Tooltip Card */}
            <div className="absolute right-0 sm:right-auto sm:left-0 bottom-full mb-2.5 hidden group-hover:block w-80 p-4 bg-slate-900 text-white text-[10.5px] font-normal leading-relaxed rounded-xl shadow-lg z-50 border border-slate-800 normal-case select-text">
              <p className="font-black text-amber-400 mb-1.5 uppercase tracking-wider text-[11px] flex items-center gap-1">
                ⚓ BẢNG XẾP HẠNG THEO THỜI GIAN:
              </p>
              <ul className="space-y-1.5 list-disc pl-3.5 text-slate-300 mb-3">
                <li><strong className="text-white">Hôm nay (Daily):</strong> Tổng số Hải lý tích lũy bắt đầu từ 00:00 ngày hôm nay.</li>
                <li><strong className="text-white">Tuần này (7-day):</strong> Tổng số Hải lý tích lũy trong 7 ngày gần nhất.</li>
                <li><strong className="text-white">Trọn đời (All-time):</strong> Toàn bộ số Hải lý tích lũy từ trước đến nay.</li>
              </ul>

              <div className="h-[1px] bg-slate-800 my-2.5" />

              <p className="font-black text-amber-400 mb-1.5 uppercase tracking-wider text-[11px] flex items-center gap-1">
                ⚡ CÁCH TÍCH LŨY HẢI LÝ:
              </p>
              <ul className="space-y-1.5 list-disc pl-3.5 text-slate-300">
                <li><strong className="text-white">Hoàn thiện 100% Hồ sơ:</strong> +50 Hải lý</li>
                <li><strong className="text-white">Hoàn thành ngày Onboarding:</strong> +50 Hải lý / ngày</li>
                <li><strong className="text-white">Hoàn thành bài học thường:</strong> +20 Hải lý</li>
                <li><strong className="text-white">Hoàn thành bài học có bài tập:</strong> +50 Hải lý</li>
              </ul>
              <div className="absolute right-4 sm:right-auto sm:left-4 top-full w-2.5 h-2.5 bg-slate-900 transform rotate-45 -translate-y-1.5 border-r border-b border-slate-800"></div>
            </div>
          </div>

          <span className="text-[10px] text-gray-400 font-semibold">{lastUpdated}</span>
        </div>
      </div>

      {/* ─── Dynamic Leaderboard Columns View ─── */}
      <div className={`grid gap-6 ${
        viewMode === 'all' 
          ? 'grid-cols-1 lg:grid-cols-3' 
          : 'grid-cols-1 max-w-2xl mx-auto'
      }`}>
        
        {/* Column 1: All-time */}
        {(viewMode === 'alltime' || viewMode === 'all') && (
          <LeaderboardColumn
            title="Bảng xếp hạng Trọn đời (All-time)"
            type="alltime"
            data={getLeaderboardData('alltime')}
            activeUserId={displayActiveUser.id}
            isPrefix={false}
          />
        )}

        {/* Column 2: 7-day */}
        {(viewMode === '7day' || viewMode === 'all') && (
          <LeaderboardColumn
            title="Bảng xếp hạng Tuần này (7-day)"
            type="7day"
            data={getLeaderboardData('7day')}
            activeUserId={displayActiveUser.id}
            isPrefix={true}
          />
        )}

        {/* Column 3: Daily */}
        {(viewMode === 'daily' || viewMode === 'all') && (
          <LeaderboardColumn
            title="Bảng xếp hạng Hôm nay (Daily)"
            type="daily"
            data={getLeaderboardData('daily')}
            activeUserId={displayActiveUser.id}
            isPrefix={true}
          />
        )}

      </div>

      {/* ─── Footer note ─── */}
      <p className="text-center text-xs text-gray-400 font-bold max-w-lg mx-auto leading-relaxed">
        ⚓ Điểm số Hải lý được cập nhật tự động khi nộp bài tập, hoàn thành thử thách Onboarding, hoặc đạt cấp độ Mastery. Hãy sẵn sàng cho hải trình tự học và làm sản phẩm số thực chiến!
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
    trend: 'up' | 'down' | 'same' | 'new';
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
  const filteredData = type === 'alltime' 
    ? data 
    : data.filter(s => s.points > 0);
  const top10 = filteredData.slice(0, 10);
  
  // Find active user rank in whole list
  const activeUserRankIndex = filteredData.findIndex(s => s.id === activeUserId);
  const myRank = activeUserRankIndex !== -1 ? activeUserRankIndex + 1 : 999;
  const myData = activeUserRankIndex !== -1 ? filteredData[activeUserRankIndex] : null;

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
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="w-14 text-right">
                  <span className={`text-xs font-black ${
                    type === 'alltime' 
                      ? 'text-dark-slate' 
                      : 'text-primary-teal'
                  }`}>
                    {pointsFormatted}
                  </span>
                </div>
                <div className="w-5 flex justify-center items-center">
                  <RankTrendIndicator trend={student.trend} />
                </div>
              </div>
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
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="w-14 text-right">
                <span className={`text-xs font-black ${
                  type === 'alltime' 
                    ? 'text-dark-slate' 
                    : 'text-primary-teal'
                }`}>
                  {isPrefix ? `+${myData.points.toLocaleString()}` : myData.points.toLocaleString()}
                </span>
              </div>
              <div className="w-5 flex justify-center items-center">
                <RankTrendIndicator trend={myData.trend} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

