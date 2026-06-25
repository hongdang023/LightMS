import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { PageHeader } from '../../components/PageHeader';
import type { TechLevel } from '../../context/DatabaseContext';

export const ProfileView: React.FC = () => {
  const { activeUser, updateProfile, badges, profileBadges, nauticalTransactions, addNotification } = useDatabase();

  // Form states
  const [fullName, setFullName] = useState(activeUser.full_name);
  const [telegramId, setTelegramId] = useState(activeUser.telegram_id);
  const [bio, setBio] = useState(activeUser.bio || '');
  const [gmail, setGmail] = useState(activeUser.gmail || '');
  const [phone, setPhone] = useState(activeUser.phone_number || '');
  const [fbUrl, setFbUrl] = useState(activeUser.facebook_url || '');
  const [industry, setIndustry] = useState(activeUser.industry || '');
  const [job, setJob] = useState(activeUser.current_job || '');
  const [techLevel, setTechLevel] = useState<TechLevel>(activeUser.tech_level || 'low-code');
  const [idea, setIdea] = useState(activeUser.product_idea || '');
  const [hours, setHours] = useState(activeUser.weekly_hours_commitment || 10);
  const [bet, setBet] = useState(activeUser.motivation_bet || '');

  // Save changes
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateProfile(activeUser.id, {
      full_name: fullName,
      telegram_id: telegramId,
      bio,
      gmail,
      phone_number: phone,
      facebook_url: fbUrl,
      industry,
      current_job: job,
      tech_level: techLevel,
      product_idea: idea,
      weekly_hours_commitment: Number(hours),
      motivation_bet: bet
    });

    addNotification('Cập nhật thành công', 'Thông tin hồ sơ thủy thủ của bạn đã được cập nhật!', 'system');
  };

  // Filter transaction list
  const userTx = nauticalTransactions.filter(t => t.student_id === activeUser.id);

  // Check which badges are unlocked
  const unlockedBadgeIds = profileBadges
    .filter(pb => pb.student_id === activeUser.id)
    .map(pb => pb.badge_id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in select-none">
      
      {/* Left Column: Form Info (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        <PageHeader
          title="Hồ sơ cá nhân"
          description="Hồ sơ nghiệp vụ của thủy thủ"
          helpTitle="Profile"
          helpSummary="Thông tin cá nhân, kết quả học tập và huy hiệu bạn đã đạt được."
          helpPurpose="Giúp Mentor hiểu rõ bạn hơn và hệ thống cá nhân hoá trải nghiệm học tập phù hợp với mục tiêu của bạn."
          action={
            <span className={`badge-pill text-[9px] ${
              activeUser.is_profile_completed ? 'badge-success' : 'badge-warning'
            }`}>
              {activeUser.is_profile_completed ? 'Hoàn thành 100%' : 'Chưa hoàn thành'}
            </span>
          }
        />
        <form onSubmit={handleSave} className="card space-y-5 bg-white border-gray-200">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Họ và tên</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="form-control text-xs font-semibold"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Telegram Username</label>
              <input
                type="text"
                value={telegramId}
                onChange={(e) => setTelegramId(e.target.value)}
                className="form-control text-xs font-semibold"
                placeholder="@username"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Gmail liên kết</label>
              <input
                type="email"
                value={gmail}
                onChange={(e) => setGmail(e.target.value)}
                className="form-control text-xs font-semibold"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Số điện thoại (Zalo)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-control text-xs font-semibold"
                placeholder="Ví dụ: 0987654321"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Facebook Profile URL</label>
            <input
              type="text"
              value={fbUrl}
              onChange={(e) => setFbUrl(e.target.value)}
              className="form-control text-xs font-semibold"
              placeholder="https://facebook.com/username"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Lĩnh vực hoạt động</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="form-control text-xs font-semibold"
                placeholder="Ví dụ: Marketing, Sales, Tài chính..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Công việc hiện tại</label>
              <input
                type="text"
                value={job}
                onChange={(e) => setJob(e.target.value)}
                className="form-control text-xs font-semibold"
                placeholder="Ví dụ: Designer, Accountant..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Trình độ kỹ thuật</label>
              <select
                value={techLevel}
                onChange={(e) => setTechLevel(e.target.value as TechLevel)}
                className="form-control text-xs font-semibold"
              >
                <option value="non-tech">Non-Tech (Hoàn toàn chưa biết code)</option>
                <option value="low-code">Low-code/No-code (Đã biết dùng tool tự động hóa)</option>
                <option value="coder">Coder (Lập trình viên truyền thống)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Số giờ tự học cam kết / tuần</label>
              <input
                type="number"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="form-control text-xs font-semibold"
                min="1"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Ý tưởng sản phẩm dự kiến</label>
            <input
              type="text"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              className="form-control text-xs font-semibold"
              placeholder="Ví dụ: Một trang portfolio cá nhân, hay app quản lý phòng khám..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Motivation Bet (Đặt cược cá nhân tạo động lực)</label>
            <textarea
              value={bet}
              onChange={(e) => setBet(e.target.value)}
              className="form-control h-20 text-xs font-semibold resize-none"
              placeholder="Ví dụ: Nếu trễ bài tập quá 2 lần, tôi xin donate 500k vào quỹ học bổng của lớp..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tiểu sử cá nhân (Bio)</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="form-control h-20 text-xs font-semibold resize-none"
              placeholder="Chia sẻ ngắn gọn về bản thân..."
            />
          </div>

          <button 
            type="submit"
            className="btn btn-primary w-full text-xs font-extrabold"
          >
            Lưu thay đổi hồ sơ
          </button>
        </form>
      </div>

      {/* Right Column: Badges Shelf & Nautical Transactions (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Badges Grid */}
        <div className="card space-y-4">
          <h3 className="font-extrabold text-sm text-[#15333B] flex items-center gap-1.5 border-b border-gray-100 pb-3">
            <span>🎖️</span> Bộ Sưu Tập Huy Hiệu (Badges)
          </h3>
          
          <div className="grid grid-cols-3 gap-3">
            {badges.map((badge) => {
              const isUnlocked = unlockedBadgeIds.includes(badge.id);
              return (
                <div 
                  key={badge.id}
                  title={`${badge.name}: ${badge.description}`}
                  className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${
                    isUnlocked 
                      ? 'bg-amber-50/50 border-[#EAB308] text-[#15333B]' 
                      : 'bg-gray-50/50 border-gray-100 opacity-40 grayscale select-none'
                  }`}
                >
                  <span className="text-3xl filter drop-shadow">{badge.icon}</span>
                  <span className="text-[9px] font-black mt-2 leading-tight truncate w-full">{badge.name}</span>
                  <span className="text-[7px] text-gray-400 font-bold mt-1 line-clamp-1">{isUnlocked ? 'Đã mở' : 'Chưa mở'}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transactions History */}
        <div className="card space-y-4">
          <h3 className="font-extrabold text-sm text-[#15333B] border-b border-gray-100 pb-3">
            ⚓ Nhật Ký Hành Trình Hải Lý
          </h3>
          
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1.5 custom-scrollbar">
            {userTx.length === 0 ? (
              <p className="text-xs text-gray-400 italic">Chưa có giao dịch hải lý nào được ghi nhận.</p>
            ) : (
              userTx.map((tx) => (
                <div key={tx.id} className="flex justify-between items-start p-2.5 bg-gray-50 rounded-lg border border-gray-100 text-xs">
                  <div className="space-y-0.5 min-w-0 pr-4">
                    <span className="font-bold text-[#15333B] block leading-tight truncate">{tx.description}</span>
                    <span className="text-[8px] text-gray-400 font-bold block">{new Date(tx.created_at).toLocaleDateString()}</span>
                  </div>
                  <span className={`font-black shrink-0 ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.amount > 0 ? `+${tx.amount}` : tx.amount} hải lý
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
