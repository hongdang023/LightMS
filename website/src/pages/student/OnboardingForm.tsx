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
    bio: activeUser.bio || 'Thủy thủ mới gia nhập hải trình.'
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Mascot quotes per step
  const mascotQuotes = [
    'Ahoy! Ta cần danh tính của ngươi để ghi chép vào sổ thủy thủ đoàn. Điền đầy đủ thông tin liên hệ nhé! 🦜',
    'Cho ta biết ngành nghề và lĩnh vực của ngươi để giảng viên dễ dàng hỗ trợ! 🦜',
    'Đây là phần quan trọng nhất! Khai báo ý tưởng sản phẩm số của ngươi để bắt đầu! 🦜'
  ];

  const validateStep = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (step === 1) {
      if (!formData.full_name.trim()) newErrors.full_name = 'Họ và tên không được để trống';
      if (!formData.phone_number.trim()) newErrors.phone_number = 'Số điện thoại không được để trống';
      if (!formData.telegram_id.trim()) newErrors.telegram_id = 'Telegram ID không được để trống';
      if (!formData.facebook_url.trim()) newErrors.facebook_url = 'Facebook URL không được để trống';
    } else if (step === 2) {
      if (!formData.industry.trim()) newErrors.industry = 'Ngành nghề không được để trống';
      if (!formData.current_job.trim()) newErrors.current_job = 'Công việc hiện tại không được để trống';
    } else if (step === 3) {
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

    // Call update profile with completed fields
    // The rules engine inside updateProfile will automatically award +50 miles and badge if all fields are valid.
    updateProfile(activeUser.id, {
      ...formData,
      gmail: activeUser.gmail, // keep original gmail
      is_profile_completed: true // set true
    });

    // Show celebration screen before redirecting
    setCelebrate(true);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#F0F0F0] flex items-center justify-center p-4 md:p-8 select-none font-sans overflow-x-hidden">
      
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
                // Trigger page refresh or app reroute
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
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        
        {/* Decorative Side Panel */}
        <div className="md:w-[220px] bg-gradient-to-br from-[#15333B] to-[#214C54] p-6 md:p-8 text-white flex flex-col justify-between shrink-0">
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
              { num: 2, name: 'Lĩnh vực & Trình độ' },
              { num: 3, name: 'Sản phẩm & Cam kết' }
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
        <form onSubmit={handleSubmit} className="flex-1 p-6 md:p-8 flex flex-col justify-between text-left bg-white">
          
          <div className="space-y-6">
            
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 text-xs font-black text-[#214C54]/50 uppercase tracking-widest mb-1">
                <Compass className="w-4 h-4 text-[#214C54]" />
                Bước {step} / 3
              </div>
              <h2 className="text-2xl font-black text-[#15333B] tracking-tight">
                {step === 1 && 'Hồ sơ liên lạc'}
                {step === 2 && 'Định vị năng lực'}
                {step === 3 && 'Cam kết hải trình'}
              </h2>
              <p className="text-xs text-[#3E5E63] leading-relaxed mt-1">
                {step === 1 && 'Hãy cung cấp thông tin liên hệ chính xác để giảng viên và bot hệ thống hỗ trợ bạn kịp thời.'}
                {step === 2 && 'Chia sẻ một chút về trình độ kỹ thuật và lĩnh vực làm việc hiện tại của bạn.'}
                {step === 3 && 'Nêu ý tưởng sản phẩm số dự định build cùng lời cam kết hành động tạo động lực.'}
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
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1.5">Lĩnh vực chuyên môn</label>
                    <input
                      type="text"
                      required
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54] text-sm font-semibold transition-all"
                      placeholder="VD: Marketing, Business, Tech..."
                    />
                    {errors.industry && <span className="text-[10px] text-red-500 font-bold mt-1 block">{errors.industry}</span>}
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1.5">Chức danh / Công việc hiện tại</label>
                    <input
                      type="text"
                      required
                      value={formData.current_job}
                      onChange={(e) => setFormData({ ...formData, current_job: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54] text-sm font-semibold transition-all"
                      placeholder="VD: Marketing Specialist, PM..."
                    />
                    {errors.current_job && <span className="text-[10px] text-red-500 font-bold mt-1 block">{errors.current_job}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 Fields */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1.5">Ý tưởng sản phẩm dự kiến xây dựng</label>
                  <textarea
                    required
                    value={formData.product_idea}
                    onChange={(e) => setFormData({ ...formData, product_idea: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54] text-sm font-semibold transition-all"
                    placeholder="VD: Một ứng dụng theo dõi chi tiêu mini kết nối Google Sheet..."
                  />
                  {errors.product_idea && <span className="text-[10px] text-red-500 font-bold mt-1 block">{errors.product_idea}</span>}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Mascot Speech box for the Step */}
          <div className="bg-[#FDF5DA] border border-[#EAB308]/40 p-4 rounded-2xl flex items-start gap-3 mt-6">
            <span className="text-2xl shrink-0">🦜</span>
            <p className="text-xs text-[#15333B] leading-relaxed font-semibold">
              {mascotQuotes[step - 1]}
            </p>
          </div>

          {/* Navigation Actions */}
          <div className="flex justify-between gap-4 border-t border-gray-100 pt-6 mt-6">
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
              <div /> // spacing placeholder
            )}

            {step < 3 ? (
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
