import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGamification } from '../../context/GamificationContext';
import { BrandLogo } from '../../components/BrandLogo';
import { ChevronRight, ChevronLeft, Award, Sparkles, Compass, Check } from 'lucide-react';
import { FormStep1PersonalInfo } from '../../components/onboarding/formSteps/FormStep1PersonalInfo';
import { FormStep2RoleAndField } from '../../components/onboarding/formSteps/FormStep2RoleAndField';
import { FormStep3Demographics } from '../../components/onboarding/formSteps/FormStep3Demographics';
import { FormStep4ProductIdea } from '../../components/onboarding/formSteps/FormStep4ProductIdea';

interface OnboardingFormProps {
  onComplete?: () => void;
}

export const OnboardingForm: React.FC<OnboardingFormProps> = ({ onComplete: _onComplete }) => {
  const { activeUser, updateProfile } = useAuth();
  const { addNauticalMiles } = useGamification();
  const [step, setStep] = useState(1);
  const [celebrate, setCelebrate] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    full_name: activeUser.full_name || '',
    phone_number: activeUser.phone_number || '',
    facebook_url: activeUser.facebook_url || '',
    industry: activeUser.industry || '',
    current_job: activeUser.current_job || '',
    product_idea: activeUser.product_idea || '',
    
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep() || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const finalData = getProcessedData();

    // Map industry and job roles from selected values for backward compatibility
    const industry = finalData.work_field;
    const current_job = finalData.current_role;

    const success = await updateProfile(activeUser.id, {
      ...finalData,
      industry,
      current_job,
      gmail: activeUser.gmail,
      is_profile_completed: true
    });

    if (success && !activeUser.is_profile_completed) {
      await addNauticalMiles(
        activeUser.id,
        50,
        'profile_completion',
        'Hoàn thành 100% Hồ sơ cá nhân',
        `profile-${activeUser.id}`
      );
    }

    setIsSubmitting(false);

    if (success) {
      setCelebrate(true);
    } else {
      setSubmitError('Có lỗi xảy ra khi lưu thông tin lên hệ thống. Vui lòng kiểm tra kết nối mạng và thử lại.');
    }
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
              Bắt đầu khám phá
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
              <h3 className="text-lg font-bold leading-snug text-white">Thiết lập tài khoản của bạn</h3>
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
              <FormStep1PersonalInfo
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />
            )}

            {/* Step 2 Fields */}
            {step === 2 && (
              <FormStep2RoleAndField
                formData={formData}
                setFormData={setFormData}
                otherRole={otherRole}
                setOtherRole={setOtherRole}
                otherField={otherField}
                setOtherField={setOtherField}
                errors={errors}
              />
            )}

            {/* Step 3 Fields */}
            {step === 3 && (
              <FormStep3Demographics
                formData={formData}
                setFormData={setFormData}
                otherReferral={otherReferral}
                setOtherReferral={setOtherReferral}
                otherGender={otherGender}
                setOtherGender={setOtherGender}
                errors={errors}
              />
            )}

            {/* Step 4 Fields */}
            {step === 4 && (
              <FormStep4ProductIdea
                formData={formData}
                setFormData={setFormData}
                isSubmitting={isSubmitting}
                errors={errors}
              />
            )}
            
            {submitError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold animate-fade-in">
                {submitError}
              </div>
            )}
          </div>

          {/* Navigation Actions */}
          <div className="flex justify-between gap-4 border-t border-gray-100 pt-6 mt-6 shrink-0">
            {step > 1 ? (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handlePrev}
                className="py-3 px-5 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl font-bold text-xs transition-all flex items-center gap-1 disabled:opacity-50"
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
                disabled={isSubmitting}
                className="py-3 px-6 bg-[#EAB308] hover:bg-[#CA8A04] text-[#15333B] rounded-xl font-black text-xs shadow-sm hover:shadow transition-all flex items-center gap-1.5 ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Đang lưu hồ sơ...' : 'Hoàn thành & Kích hoạt Thẻ căn cước'}
                <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
