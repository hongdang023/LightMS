import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { BrandLogo } from '../../components/BrandLogo';
import { ChevronRight, ChevronLeft, Award, Sparkles, Compass, Check } from 'lucide-react';

export const OnboardingForm: React.FC = () => {
  const { activeUser, updateProfile } = useDatabase();
  const [step, setStep] = useState(1);
  const [celebrate, setCelebrate] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    full_name: activeUser.full_name || '',
    phone_number: activeUser.phone_number || '',
    telegram_id: activeUser.telegram_id || '',
    facebook_url: activeUser.facebook_url || '',
    industry: activeUser.industry || '',
    current_job: activeUser.current_job || '',
    product_idea: activeUser.product_idea || '',
    bio: activeUser.bio || 'Thủy thủ mới gia nhập hải trình.',
    
    // New fields (now single values for dropdowns)
    referral_source: activeUser.referral_source || '',
    current_role: activeUser.current_role || '',
    work_field: activeUser.work_field || '',
    living_region: activeUser.living_region || '',
    gender: activeUser.gender || '',
    age_group: activeUser.age_group || ''
  });

  // Separate states for "Other" text inputs
  const [otherReferral, setOtherReferral] = useState('');
  const [otherRole, setOtherRole] = useState('');
  const [otherField, setOtherField] = useState('');
  const [otherGender, setOtherGender] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Mascot quotes per step
  const mascotQuotes = [
    'Ahoy! Ta cần danh tính của ngươi để ghi chép vào sổ thủy thủ đoàn. Điền đầy đủ thông tin liên hệ nhé! 🦜',
    'Chọn chính xác vai trò và lĩnh vực từ danh sách thả xuống để ta sắp xếp nhóm phù hợp nhé! 🦜',
    'Khảo sát nhanh để hiểu rõ hơn về lộ trình hoạt động và hành trang đi biển của ngươi nhé! 🦜',
    'Đây là phần quan trọng nhất! Khai báo ý tưởng sản phẩm số của ngươi để bắt đầu! 🦜'
  ];

  const getProcessedData = () => {
    let referral_source = formData.referral_source;
    if (referral_source === 'Other' && otherReferral.trim()) {
      referral_source = `Other: ${otherReferral.trim()}`;
    }

    let current_role = formData.current_role;
    if (current_role === 'Other' && otherRole.trim()) {
      current_role = `Other: ${otherRole.trim()}`;
    }

    let work_field = formData.work_field;
    if (work_field === 'Other' && otherField.trim()) {
      work_field = `Other: ${otherField.trim()}`;
    }

    let gender = formData.gender;
    if (gender === 'Other' && otherGender.trim()) {
      gender = `Other: ${otherGender.trim()}`;
    }

    return {
      ...formData,
      referral_source,
      current_role,
      work_field,
      gender
    };
  };

  const validateStep = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (step === 1) {
      if (!formData.full_name.trim()) newErrors.full_name = 'Họ và tên không được để trống';
      if (!formData.phone_number.trim()) newErrors.phone_number = 'Số điện thoại không được để trống';
      if (!formData.telegram_id.trim()) newErrors.telegram_id = 'Telegram ID không được để trống';
      if (!formData.facebook_url.trim()) newErrors.facebook_url = 'Facebook URL không được để trống';
    } else if (step === 2) {
      if (!formData.current_role) {
        newErrors.current_role = 'Vui lòng chọn vai trò hiện tại của bạn';
      } else if (formData.current_role === 'Other' && !otherRole.trim()) {
        newErrors.current_role = 'Vui lòng nhập vai trò cụ thể';
      }

      if (!formData.work_field) {
        newErrors.work_field = 'Vui lòng chọn lĩnh vực của bạn';
      } else if (formData.work_field === 'Other' && !otherField.trim()) {
        newErrors.work_field = 'Vui lòng nhập lĩnh vực cụ thể';
      }
    } else if (step === 3) {
      if (!formData.referral_source) {
        newErrors.referral_source = 'Vui lòng chọn nguồn biết tới khóa học';
      } else if (formData.referral_source === 'Other' && !otherReferral.trim()) {
        newErrors.referral_source = 'Vui lòng điền cụ thể nguồn biết tới';
      }

      if (!formData.living_region) {
        newErrors.living_region = 'Vui lòng chọn khu vực sinh sống';
      }

      if (!formData.gender) {
        newErrors.gender = 'Vui lòng chọn giới tính';
      } else if (formData.gender === 'Other' && !otherGender.trim()) {
        newErrors.gender = 'Vui lòng điền giới tính cụ thể';
      }

      if (!formData.age_group) {
        newErrors.age_group = 'Vui lòng chọn nhóm tuổi';
      }
    } else if (step === 4) {
      if (!formData.product_idea.trim()) newErrors.product_idea = 'Ý tưởng sản phẩm không được để trống';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    const finalData = getProcessedData();

    // Map industry and job roles from selected values for backward compatibility
    const industry = finalData.work_field;
    const current_job = finalData.current_role;

    updateProfile(activeUser.id, {
      ...finalData,
      industry,
      current_job,
      gmail: activeUser.gmail,
      is_profile_completed: true
    });

    setCelebrate(true);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#F0F0F0] flex items-center justify-center p-4 md:p-8 select-none font-sans overflow-x-hidden font-medium">
      
      {/* Background nautical pattern overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(circle, #214C54 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} 
      />

      {/* Celebration overlay */}
      {celebrate && (
        <div className="fixed inset-0 z-50 bg-[#15333B] flex items-center justify-center p-4 animate-fade-in">
          <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-2xl text-center flex flex-col items-center">
            
            <div className="w-24 h-24 bg-[#EAB308]/20 rounded-full flex items-center justify-center mb-6 border border-[#EAB308]/30 animate-bounce">
              <Award className="w-12 h-12 text-[#FFD94C]" />
            </div>

            <h2 className="text-3xl font-black text-white mb-3">Khởi Hành Thuận Gió!</h2>
            <p className="text-sm text-white/70 mb-6 leading-relaxed">
              Chúc mừng thủy thủ <span className="font-bold text-[#FFD94C]">{formData.full_name}</span> đã điền xong hồ sơ cá nhân và kích hoạt thẻ căn cước!
            </p>

            <div className="bg-[#214C54]/40 border border-[#3E5E63] rounded-2xl p-5 mb-8 w-full space-y-3.5 text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FFD94C]/20 flex items-center justify-center text-sm font-bold text-[#FFD94C]">⛵</div>
                <div>
                  <span className="text-xs text-white/50 block">Phần thưởng khởi động</span>
                  <span className="text-sm font-bold text-white">+50 Hải lý tích lũy</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-sm">🎫</div>
                <div>
                  <span className="text-xs text-white/50 block">Mở khóa huy hiệu</span>
                  <span className="text-sm font-bold text-white">Huy hiệu Thẻ căn cước</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                window.location.reload();
              }}
              className="w-full py-4 bg-[#EAB308] hover:bg-[#CA8A04] text-[#15333B] font-black rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Bước vào Dashboard
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Onboarding Card */}
      <div className="relative z-10 w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        
        {/* Decorative Side Panel */}
        <div className="md:w-[240px] bg-gradient-to-br from-[#15333B] to-[#214C54] p-6 md:p-8 text-white flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <BrandLogo size={32} lighthouseColor="#FFD94C" sunbeamColor="#FFF" waveColor="#00B2E2" />
              <span className="text-sm font-black tracking-wider uppercase">LightMS</span>
            </div>
            
            <div className="space-y-4">
              <div className="h-0.5 bg-white/10" />
              <p className="text-xs text-white/60 font-bold tracking-widest uppercase">Hải trình bắt đầu</p>
              <h3 className="text-lg font-bold leading-snug">Thiết lập tài khoản của bạn</h3>
            </div>
          </div>

          {/* Stepper indicators */}
          <div className="space-y-3 mt-8 md:mt-0">
            {[
              { num: 1, name: 'Thông tin liên hệ' },
              { num: 2, name: 'Vai trò & Lĩnh vực' },
              { num: 3, name: 'Khảo sát cá nhân' },
              { num: 4, name: 'Sản phẩm & Cam kết' }
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-3 text-left">
                <div className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center border transition-all ${
                  step === s.num
                    ? 'bg-[#FFD94C] text-[#15333B] border-[#FFD94C] shadow-sm'
                    : step > s.num
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-white/20 text-white/40'
                }`}>
                  {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
                </div>
                <span className={`text-xs font-semibold ${step === s.num ? 'text-white font-black' : 'text-white/40'}`}>
                  {s.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content Panel */}
        <form onSubmit={handleSubmit} className="flex-1 p-6 md:p-8 flex flex-col justify-between text-left bg-white min-h-[580px]">
          
          <div className="space-y-6">
            
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 text-xs font-black text-[#214C54]/50 uppercase tracking-widest mb-1">
                <Compass className="w-4 h-4 text-[#214C54]" />
                Bước {step} / 4
              </div>
              <h2 className="text-2xl font-black text-[#15333B] tracking-tight">
                {step === 1 && 'Hồ sơ liên lạc'}
                {step === 2 && 'Định vị năng lực'}
                {step === 3 && 'Khảo sát học viên'}
                {step === 4 && 'Cam kết hải trình'}
              </h2>
              <p className="text-xs text-[#3E5E63] leading-relaxed mt-1">
                {step === 1 && 'Hãy cung cấp thông tin liên hệ chính xác để giảng viên và bot hệ thống hỗ trợ bạn kịp thời.'}
                {step === 2 && 'Chọn vai trò và lĩnh vực hoạt động chính từ danh sách thả xuống.'}
                {step === 3 && 'Một số thông tin khảo sát giúp ban tổ chức đồng hành hiệu quả hơn cùng bạn.'}
                {step === 4 && 'Nêu ý tưởng sản phẩm số dự định build cùng lời cam kết hành động tạo động lực.'}
              </p>
            </div>

            {/* Step 1 Fields */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1.5">Họ và tên</label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54] text-sm font-semibold transition-all"
                    placeholder="Nguyễn Văn A"
                  />
                  {errors.full_name && <span className="text-[10px] text-red-500 font-bold mt-1 block">{errors.full_name}</span>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1.5">Số điện thoại (Zalo)</label>
                    <input
                      type="text"
                      required
                      value={formData.phone_number}
                      onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54] text-sm font-semibold transition-all"
                      placeholder="0901234567"
                    />
                    {errors.phone_number && <span className="text-[10px] text-red-500 font-bold mt-1 block">{errors.phone_number}</span>}
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1.5">Telegram ID (Bot báo bài)</label>
                    <input
                      type="text"
                      required
                      value={formData.telegram_id}
                      onChange={(e) => setFormData({ ...formData, telegram_id: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54] text-sm font-semibold transition-all"
                      placeholder="@username"
                    />
                    {errors.telegram_id && <span className="text-[10px] text-red-500 font-bold mt-1 block">{errors.telegram_id}</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1.5">Đường link Facebook cá nhân</label>
                  <input
                    type="url"
                    required
                    value={formData.facebook_url}
                    onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54] text-sm font-semibold transition-all"
                    placeholder="https://facebook.com/username"
                  />
                  {errors.facebook_url && <span className="text-[10px] text-red-500 font-bold mt-1 block">{errors.facebook_url}</span>}
                </div>
              </div>
            )}

            {/* Step 2 Fields */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-in pr-1">
                {/* Current Role Dropdown */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Vai trò hiện tại của bạn? <span className="text-red-500">*</span></label>
                  <select
                    value={formData.current_role}
                    onChange={(e) => setFormData({ ...formData, current_role: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54] text-sm font-semibold transition-all bg-white"
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

                  {formData.current_role === 'Other' && (
                    <input
                      type="text"
                      required
                      value={otherRole}
                      onChange={(e) => setOtherRole(e.target.value)}
                      className="w-full mt-3 px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#214C54] focus:outline-none text-sm font-semibold"
                      placeholder="Nhập vai trò cụ thể của bạn..."
                    />
                  )}
                  {errors.current_role && <span className="text-[10px] text-red-500 font-bold mt-1 block">{errors.current_role}</span>}
                </div>

                {/* Work Field Dropdown */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Bạn đang học/làm trong lĩnh vực gì? <span className="text-red-500">*</span></label>
                  <select
                    value={formData.work_field}
                    onChange={(e) => setFormData({ ...formData, work_field: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54] text-sm font-semibold transition-all bg-white"
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

                  {formData.work_field === 'Other' && (
                    <input
                      type="text"
                      required
                      value={otherField}
                      onChange={(e) => setOtherField(e.target.value)}
                      className="w-full mt-3 px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#214C54] focus:outline-none text-sm font-semibold"
                      placeholder="Nhập lĩnh vực cụ thể của bạn..."
                    />
                  )}
                  {errors.work_field && <span className="text-[10px] text-red-500 font-bold mt-1 block">{errors.work_field}</span>}
                </div>
              </div>
            )}

            {/* Step 3 Fields */}
            {step === 3 && (
              <div className="space-y-5 animate-fade-in max-h-[380px] overflow-y-auto pr-1">
                
                {/* Referral Source Dropdown */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Bạn biết tới khoá học này từ đâu? <span className="text-red-500">*</span></label>
                  <select
                    value={formData.referral_source}
                    onChange={(e) => setFormData({ ...formData, referral_source: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54] text-sm font-semibold transition-all bg-white"
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

                  {formData.referral_source === 'Other' && (
                    <input
                      type="text"
                      required
                      value={otherReferral}
                      onChange={(e) => setOtherReferral(e.target.value)}
                      className="w-full mt-3 px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#214C54] focus:outline-none text-sm font-semibold"
                      placeholder="Nhập nguồn giới thiệu cụ thể..."
                    />
                  )}
                  {errors.referral_source && <span className="text-[10px] text-red-500 font-bold mt-1 block">{errors.referral_source}</span>}
                </div>

                {/* Living Region Dropdown */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Hiện tại bạn đang sinh sống ở khu vực nào? <span className="text-red-500">*</span></label>
                  <select
                    value={formData.living_region}
                    onChange={(e) => setFormData({ ...formData, living_region: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54] text-sm font-semibold transition-all bg-white"
                  >
                    <option value="">-- Chọn khu vực --</option>
                    <option value="Miền Bắc Việt Nam">Miền Bắc Việt Nam</option>
                    <option value="Miền Trung Việt Nam">Miền Trung Việt Nam</option>
                    <option value="Miền Nam Việt Nam">Miền Nam Việt Nam</option>
                    <option value="Ngoài lãnh thổ Việt Nam">Ngoài lãnh thổ Việt Nam</option>
                  </select>
                  {errors.living_region && <span className="text-[10px] text-red-500 font-bold mt-1 block">{errors.living_region}</span>}
                </div>

                {/* Gender Dropdown */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Bạn là: <span className="text-red-500">*</span></label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54] text-sm font-semibold transition-all bg-white"
                  >
                    <option value="">-- Chọn giới tính --</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Other">Other (Khác)...</option>
                  </select>

                  {formData.gender === 'Other' && (
                    <input
                      type="text"
                      required
                      value={otherGender}
                      onChange={(e) => setOtherGender(e.target.value)}
                      className="w-full mt-3 px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#214C54] focus:outline-none text-sm font-semibold"
                      placeholder="Nhập giới tính của bạn..."
                    />
                  )}
                  {errors.gender && <span className="text-[10px] text-red-500 font-bold mt-1 block">{errors.gender}</span>}
                </div>

                {/* Age Group Dropdown */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Bạn năm nay bao nhiêu tuổi? <span className="text-red-500">*</span></label>
                  <select
                    value={formData.age_group}
                    onChange={(e) => setFormData({ ...formData, age_group: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54] text-sm font-semibold transition-all bg-white"
                  >
                    <option value="">-- Chọn độ tuổi --</option>
                    <option value="Dưới 18 tuổi">Dưới 18 tuổi</option>
                    <option value="18 - 24 tuổi">18 - 24 tuổi</option>
                    <option value="25 - 30 tuổi">25 - 30 tuổi</option>
                    <option value="31 - 45 tuổi">31 - 45 tuổi</option>
                    <option value="46 - 55 tuổi">46 - 55 tuổi</option>
                    <option value="Trên 55 tuổi">Trên 55 tuổi</option>
                  </select>
                  {errors.age_group && <span className="text-[10px] text-red-500 font-bold mt-1 block">{errors.age_group}</span>}
                </div>
              </div>
            )}

            {/* Step 4 Fields */}
            {step === 4 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1.5">Ý tưởng sản phẩm dự kiến xây dựng</label>
                  <textarea
                    required
                    value={formData.product_idea}
                    onChange={(e) => setFormData({ ...formData, product_idea: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54] text-sm font-semibold transition-all"
                    placeholder="VD: Một ứng dụng theo dõi chi tiêu mini kết nối Google Sheet để quản lý tài chính cá nhân tự động bằng AI..."
                  />
                  {errors.product_idea && <span className="text-[10px] text-red-500 font-bold mt-1 block">{errors.product_idea}</span>}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Mascot Speech box for the Step */}
          <div className="bg-[#FDF5DA] border border-[#EAB308]/40 p-4 rounded-2xl flex items-start gap-3 mt-6 shrink-0">
            <span className="text-2xl shrink-0">🦜</span>
            <p className="text-xs text-[#15333B] leading-relaxed font-semibold">
              {mascotQuotes[step - 1]}
            </p>
          </div>

          {/* Navigation Actions */}
          <div className="flex justify-between gap-4 border-t border-gray-100 pt-6 mt-6 shrink-0">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="py-3 px-5 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl font-bold text-xs transition-all flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Quay lại
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="py-3 px-6 bg-[#214C54] hover:bg-[#15333B] text-white rounded-xl font-bold text-xs shadow-sm hover:shadow transition-all flex items-center gap-1 ml-auto"
              >
                Tiếp tục
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="py-3 px-6 bg-[#EAB308] hover:bg-[#CA8A04] text-[#15333B] rounded-xl font-black text-xs shadow-sm hover:shadow transition-all flex items-center gap-1.5 ml-auto"
              >
                Hoàn thành & Kích hoạt Thẻ căn cước
                <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
