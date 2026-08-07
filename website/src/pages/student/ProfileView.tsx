import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGamification } from '../../context/GamificationContext';
import { useCommunity } from '../../context/CommunityContext';
import { PageHeader } from '../../components/PageHeader';

interface ProfileViewProps {
  onPageChange?: (page: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onPageChange: _onPageChange }) => {
  const { activeUser, updateProfile, activeAdmin, updateAdminProfile } = useAuth();
  const { nauticalTransactions } = useGamification();
  const { addNotification } = useCommunity();
  const isAdmin = activeUser.role === 'admin';

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

  // Student Form states
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

  // Admin Form states
  const [adminFullName, setAdminFullName] = useState(activeAdmin?.full_name || activeUser.full_name);
  const [adminPhone, setAdminPhone] = useState(activeAdmin?.phone_number || '');
  const [adminTelegramId, setAdminTelegramId] = useState(activeAdmin?.telegram_id || '');
  const [adminRole, setAdminRole] = useState(activeAdmin?.admin_role || 'Operations');
  const [expertiseAreas, setExpertiseAreas] = useState(activeAdmin?.expertise_areas || '');

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

    if (activeAdmin) {
      setAdminFullName(activeAdmin.full_name || activeUser.full_name);
      setAdminPhone(activeAdmin.phone_number || '');
      setAdminTelegramId(activeAdmin.telegram_id || '');
      setAdminRole(activeAdmin.admin_role || 'Operations');
      setExpertiseAreas(activeAdmin.expertise_areas || '');
    }
  }, [activeUser.id, activeAdmin]);

  // Save changes
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isAdmin) {
      const success = await updateAdminProfile(activeUser.id, {
        full_name: adminFullName,
        phone_number: adminPhone,
        telegram_id: adminTelegramId,
        admin_role: adminRole as any,
        expertise_areas: expertiseAreas,
      });

      // Keep user profile full name and phone number synced
      await updateProfile(activeUser.id, {
        full_name: adminFullName,
        phone_number: adminPhone,
      });

      if (success) {
        addNotification('Cập nhật thành công', 'Thông tin quản trị viên của bạn đã được cập nhật!', 'system');
      }
    } else {
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

      const success = await updateProfile(activeUser.id, {
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

      if (success) {
        addNotification('Cập nhật thành công', 'Thông tin hồ sơ thủy thủ của bạn đã được cập nhật!', 'system');
      }
    }
  };

  // Filter transaction list
  const userTx = nauticalTransactions.filter(t => t.student_id === activeUser.id);



  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in select-none">
      
      {/* Form Info */}
      <div className="space-y-6">
        <PageHeader
          title="Hồ sơ cá nhân"
          description={isAdmin ? "Hồ sơ quản trị viên của hệ thống" : "Hồ sơ nghiệp vụ của thủy thủ"}
          helpTitle="Profile"
          helpSummary={isAdmin ? "Thông tin cá nhân quản trị viên và các lớp học phụ trách." : "Thông tin cá nhân, kết quả học tập và huy hiệu bạn đã đạt được."}
          helpPurpose={isAdmin ? "Giúp lưu trữ thông tin liên hệ và phân quyền quản trị của bạn." : "Giúp Mentor hiểu rõ bạn hơn và hệ thống cá nhân hoá trải nghiệm học tập phù hợp với mục tiêu của bạn."}
          action={
            !isAdmin && (
              <span className={`badge-pill text-[9px] ${
                activeUser.is_profile_completed ? 'badge-success' : 'badge-warning'
              }`}>
                {activeUser.is_profile_completed ? 'Hoàn thành 100%' : 'Chưa hoàn thành'}
              </span>
            )
          }
        />

        {isAdmin ? (
          <form onSubmit={handleSave} className="card space-y-5 bg-white border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Họ và tên</label>
                <input
                  type="text"
                  value={adminFullName}
                  onChange={(e) => setAdminFullName(e.target.value)}
                  className="form-control text-xs font-semibold"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gmail liên kết</label>
                <input
                  type="email"
                  value={gmail}
                  className="form-control text-xs font-semibold bg-gray-50 cursor-not-allowed"
                  disabled
                />
              </div>

              <div className="form-group">
                <label className="form-label">Số điện thoại liên hệ</label>
                <input
                  type="text"
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  className="form-control text-xs font-semibold"
                  placeholder="Ví dụ: 0987654321"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Telegram ID</label>
                <input
                  type="text"
                  value={adminTelegramId}
                  onChange={(e) => setAdminTelegramId(e.target.value)}
                  className="form-control text-xs font-semibold"
                  placeholder="Ví dụ: @username"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Vai trò Ban tổ chức</label>
              <select
                value={adminRole}
                onChange={(e) => setAdminRole(e.target.value as any)}
                className="form-control text-xs font-semibold bg-white"
                required
              >
                <option value="Founder">Founder</option>
                <option value="Trainer">Trainer</option>
                <option value="Teaching Assistant (TA)">Teaching Assistant (TA)</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Thế mạnh chuyên môn</label>
              <textarea
                value={expertiseAreas}
                onChange={(e) => setExpertiseAreas(e.target.value)}
                className="form-control text-xs font-semibold"
                rows={3}
                placeholder="Ví dụ: Product Management, AI Engineering, Next.js, UI/UX..."
              />
            </div>

            <button 
              type="submit"
              className="btn btn-primary w-full text-xs font-extrabold"
            >
              Lưu thay đổi hồ sơ Admin
            </button>
          </form>
        ) : (
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
        )}
      </div>

      {/* Badges Shelf & Nautical Transactions / Assigned Batches */}
      <div className="space-y-6">
        {isAdmin ? (
          <div className="card space-y-4 bg-white border-gray-200">
            <h3 className="font-extrabold text-sm text-[#15333B] border-b border-gray-100 pb-3">
              🏫 Lớp học phụ trách
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {!activeAdmin?.assigned_batches || activeAdmin.assigned_batches.length === 0 ? (
                <p className="text-xs text-gray-400 italic">Chưa được phân công lớp học nào.</p>
              ) : (
                activeAdmin.assigned_batches.map((batch, idx) => (
                  <span key={idx} className="px-3 py-1 bg-[#214C54]/10 text-[#214C54] text-xs font-bold rounded-full border border-[#214C54]/20">
                    {batch}
                  </span>
                ))
              )}
            </div>
          </div>
        ) : (
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
        )}
      </div>

    </div>
  );
};
