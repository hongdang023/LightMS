import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { PageHeader } from '../../components/PageHeader';

export const ProfileView: React.FC = () => {
  const { activeUser, updateProfile, badges, profileBadges, nauticalTransactions, addNotification } = useDatabase();

  // Helpers to parse fields that can be "Other"
  const initReferral = () => {
    const val = activeUser.referral_source || '';
    if (val.startsWith('Other: ')) {
      return { main: 'Other', other: val.substring(7) };
    }
    const standardOptions = [
      'Substack The1ight',
      'Facebook cá nhân của Trainer Quang Nguyễn',
      'Facebook Fanpage The1ight',
      'Facebook Group cộng đồng (Tự do từ Công sở, Vibe Coder Community)',
      'Cộng đồng 1ight Club',
      'Cộng đồng Alumni Club (Học viên cũ học lại khoá mới)',
      'Người quen giới thiệu'
    ];
    if (val && !standardOptions.includes(val)) {
      return { main: 'Other', other: val };
    }
    return { main: val, other: '' };
  };

  const initRole = () => {
    const val = activeUser.current_role || '';
    if (val.startsWith('Other: ')) {
      return { main: 'Other', other: val.substring(7) };
    }
    const standardOptions = [
      'Học sinh/ Sinh viên',
      'Nhân viên/ Chuyên viên',
      'Quản lý/ Leader',
      'Founder',
      'Freelancer',
      'Đang trong thời gian nghỉ việc/ chuyển ngành'
    ];
    if (val && !standardOptions.includes(val)) {
      return { main: 'Other', other: val };
    }
    return { main: val, other: '' };
  };

  const initField = () => {
    const val = activeUser.work_field || '';
    if (val.startsWith('Other: ')) {
      return { main: 'Other', other: val.substring(7) };
    }
    const standardOptions = [
      'Marketing/ Truyền thông',
      'Tài chính/ Kế toán',
      'Giáo dục',
      'Sản phẩm/ Công nghệ',
      'Sản xuất',
      'FMCG',
      'Nghệ thuật',
      'HR'
    ];
    if (val && !standardOptions.includes(val)) {
      return { main: 'Other', other: val };
    }
    return { main: val, other: '' };
  };

  const initGender = () => {
    const val = activeUser.gender || '';
    if (val.startsWith('Other: ')) {
      return { main: 'Other', other: val.substring(7) };
    }
    const standardOptions = ['Nam', 'Nữ'];
    if (val && !standardOptions.includes(val)) {
      return { main: 'Other', other: val };
    }
    return { main: val, other: '' };
  };

  const refInit = initReferral();
  const roleInit = initRole();
  const fieldInit = initField();
  const genderInit = initGender();

  // Form states
  const [fullName, setFullName] = useState(activeUser.full_name);
  const [gmail, setGmail] = useState(activeUser.gmail || '');
  const [phone, setPhone] = useState(activeUser.phone_number || '');
  const [fbUrl, setFbUrl] = useState(activeUser.facebook_url || '');
  const [idea, setIdea] = useState(activeUser.product_idea || '');

  const [referralSource, setReferralSource] = useState(refInit.main);
  const [otherReferral, setOtherReferral] = useState(refInit.other);

  const [currentRole, setCurrentRole] = useState(roleInit.main);
  const [otherRole, setOtherRole] = useState(roleInit.other);

  const [workField, setWorkField] = useState(fieldInit.main);
  const [otherField, setOtherField] = useState(fieldInit.other);

  const [gender, setGender] = useState(genderInit.main);
  const [otherGender, setOtherGender] = useState(genderInit.other);

  const [livingRegion, setLivingRegion] = useState(activeUser.living_region || '');
  const [ageGroup, setAgeGroup] = useState(activeUser.age_group || '');

  // Sync state when activeUser changes (e.g., login, switch user)
  React.useEffect(() => {
    const ref = initReferral();
    const role = initRole();
    const field = initField();
    const gen = initGender();

    setFullName(activeUser.full_name);
    setGmail(activeUser.gmail || '');
    setPhone(activeUser.phone_number || '');
    setFbUrl(activeUser.facebook_url || '');
    setIdea(activeUser.product_idea || '');
    setReferralSource(ref.main);
    setOtherReferral(ref.other);
    setCurrentRole(role.main);
    setOtherRole(role.other);
    setWorkField(field.main);
    setOtherField(field.other);
    setGender(gen.main);
    setOtherGender(gen.other);
    setLivingRegion(activeUser.living_region || '');
    setAgeGroup(activeUser.age_group || '');
  }, [activeUser.id]);

  // Save changes
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalReferral = referralSource;
    if (referralSource === 'Other' && otherReferral.trim()) {
      finalReferral = `Other: ${otherReferral.trim()}`;
    }

    let finalRole = currentRole;
    if (currentRole === 'Other' && otherRole.trim()) {
      finalRole = `Other: ${otherRole.trim()}`;
    }

    let finalField = workField;
    if (workField === 'Other' && otherField.trim()) {
      finalField = `Other: ${otherField.trim()}`;
    }

    let finalGender = gender;
    if (gender === 'Other' && otherGender.trim()) {
      finalGender = `Other: ${otherGender.trim()}`;
    }

    updateProfile(activeUser.id, {
      full_name: fullName,
      gmail: gmail,
      phone_number: phone,
      facebook_url: fbUrl,
      industry: finalField,
      current_job: finalRole,
      product_idea: idea,
      referral_source: finalReferral,
      current_role: finalRole,
      work_field: finalField,
      living_region: livingRegion,
      gender: finalGender,
      age_group: ageGroup
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
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Facebook Profile URL</label>
              <input
                type="text"
                value={fbUrl}
                onChange={(e) => setFbUrl(e.target.value)}
                className="form-control text-xs font-semibold"
                placeholder="https://facebook.com/username"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Vai trò hiện tại</label>
              <select
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                className="form-control text-xs font-semibold bg-white"
                required
              >
                <option value="">-- Chọn vai trò --</option>
                <option value="Học sinh/ Sinh viên">Học sinh/ Sinh viên</option>
                <option value="Nhân viên/ Chuyên viên">Nhân viên/ Chuyên viên</option>
                <option value="Quản lý/ Leader">Quản lý/ Leader</option>
                <option value="Founder">Founder</option>
                <option value="Freelancer">Freelancer</option>
                <option value="Đang trong thời gian nghỉ việc/ chuyển ngành">Đang trong thời gian nghỉ việc/ chuyển ngành</option>
                <option value="Other">Other (Khác)...</option>
              </select>
              {currentRole === 'Other' && (
                <input
                  type="text"
                  required
                  value={otherRole}
                  onChange={(e) => setOtherRole(e.target.value)}
                  className="form-control text-xs font-semibold mt-2"
                  placeholder="Nhập vai trò cụ thể..."
                />
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Lĩnh vực hoạt động</label>
              <select
                value={workField}
                onChange={(e) => setWorkField(e.target.value)}
                className="form-control text-xs font-semibold bg-white"
                required
              >
                <option value="">-- Chọn lĩnh vực --</option>
                <option value="Marketing/ Truyền thông">Marketing/ Truyền thông</option>
                <option value="Tài chính/ Kế toán">Tài chính/ Kế toán</option>
                <option value="Giáo dục">Giáo dục</option>
                <option value="Sản phẩm/ Công nghệ">Sản phẩm/ Công nghệ</option>
                <option value="Sản xuất">Sản xuất</option>
                <option value="FMCG">FMCG</option>
                <option value="Nghệ thuật">Nghệ thuật</option>
                <option value="HR">HR</option>
                <option value="Other">Other (Khác)...</option>
              </select>
              {workField === 'Other' && (
                <input
                  type="text"
                  required
                  value={otherField}
                  onChange={(e) => setOtherField(e.target.value)}
                  className="form-control text-xs font-semibold mt-2"
                  placeholder="Nhập lĩnh vực cụ thể..."
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Nguồn biết tới khoá học</label>
              <select
                value={referralSource}
                onChange={(e) => setReferralSource(e.target.value)}
                className="form-control text-xs font-semibold bg-white"
                required
              >
                <option value="">-- Chọn nguồn giới thiệu --</option>
                <option value="Substack The1ight">Substack The1ight</option>
                <option value="Facebook cá nhân của Trainer Quang Nguyễn">Facebook cá nhân của Trainer Quang Nguyễn</option>
                <option value="Facebook Fanpage The1ight">Facebook Fanpage The1ight</option>
                <option value="Facebook Group cộng đồng (Tự do từ Công sở, Vibe Coder Community)">Facebook Group cộng đồng (Tự do từ Công sở, Vibe Coder Community)</option>
                <option value="Cộng đồng 1ight Club">Cộng đồng 1ight Club</option>
                <option value="Cộng đồng Alumni Club (Học viên cũ học lại khoá mới)">Cộng đồng Alumni Club (Học viên cũ học lại khoá mới)</option>
                <option value="Người quen giới thiệu">Người quen giới thiệu</option>
                <option value="Other">Other (Khác)...</option>
              </select>
              {referralSource === 'Other' && (
                <input
                  type="text"
                  required
                  value={otherReferral}
                  onChange={(e) => setOtherReferral(e.target.value)}
                  className="form-control text-xs font-semibold mt-2"
                  placeholder="Nhập nguồn cụ thể..."
                />
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Khu vực sinh sống</label>
              <select
                value={livingRegion}
                onChange={(e) => setLivingRegion(e.target.value)}
                className="form-control text-xs font-semibold bg-white"
                required
              >
                <option value="">-- Chọn khu vực --</option>
                <option value="Miền Bắc Việt Nam">Miền Bắc Việt Nam</option>
                <option value="Miền Trung Việt Nam">Miền Trung Việt Nam</option>
                <option value="Miền Nam Việt Nam">Miền Nam Việt Nam</option>
                <option value="Ngoài lãnh thổ Việt Nam">Ngoài lãnh thổ Việt Nam</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Giới tính</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="form-control text-xs font-semibold bg-white"
                required
              >
                <option value="">-- Chọn giới tính --</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Other">Other (Khác)...</option>
              </select>
              {gender === 'Other' && (
                <input
                  type="text"
                  required
                  value={otherGender}
                  onChange={(e) => setOtherGender(e.target.value)}
                  className="form-control text-xs font-semibold mt-2"
                  placeholder="Nhập giới tính..."
                />
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Độ tuổi</label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                className="form-control text-xs font-semibold bg-white"
                required
              >
                <option value="">-- Chọn độ tuổi --</option>
                <option value="Dưới 18 tuổi">Dưới 18 tuổi</option>
                <option value="18 - 24 tuổi">18 - 24 tuổi</option>
                <option value="25 - 30 tuổi">25 - 30 tuổi</option>
                <option value="31 - 45 tuổi">31 - 45 tuổi</option>
                <option value="46 - 55 tuổi">46 - 55 tuổi</option>
                <option value="Trên 55 tuổi">Trên 55 tuổi</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Ý tưởng sản phẩm dự kiến</label>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              className="form-control text-xs font-semibold"
              rows={3}
              placeholder="Ví dụ: Một trang portfolio cá nhân, hay app quản lý phòng khám..."
              required
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
