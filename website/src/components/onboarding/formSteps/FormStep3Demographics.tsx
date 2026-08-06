import React from 'react';

interface FormStep3Props {
  formData: {
    referral_source: string;
    living_region: string;
    gender: string;
    age_group: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  otherReferral: string;
  setOtherReferral: React.Dispatch<React.SetStateAction<string>>;
  otherGender: string;
  setOtherGender: React.Dispatch<React.SetStateAction<string>>;
  errors: { [key: string]: string };
}

export const FormStep3Demographics: React.FC<FormStep3Props> = ({
  formData,
  setFormData,
  otherReferral,
  setOtherReferral,
  otherGender,
  setOtherGender,
  errors,
}) => {
  return (
    <div className="space-y-5 animate-fade-in max-h-[380px] overflow-y-auto pr-1">
      {/* Referral Source Dropdown */}
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-2">
          Bạn biết tới khoá học này từ đâu? <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.referral_source}
          onChange={(e) => setFormData({ ...formData, referral_source: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54] text-sm font-semibold transition-all bg-white"
        >
          <option value="">-- Chọn nguồn giới thiệu --</option>
          <option value="Substack The1ight">Substack The1ight</option>
          <option value="Facebook cá nhân của Trainer Quang Nguyễn">
            Facebook cá nhân của Trainer Quang Nguyễn
          </option>
          <option value="Facebook Fanpage The1ight">Facebook Fanpage The1ight</option>
          <option value="Facebook Group cộng đồng (Tự do từ Công sở, Vibe Coder Community)">
            Facebook Group cộng đồng (Tự do từ Công sở, Vibe Coder Community)
          </option>
          <option value="Cộng đồng 1ight Club">Cộng đồng 1ight Club</option>
          <option value="Cộng đồng Alumni Club (Học viên cũ học lại khoá mới)">
            Cộng đồng Alumni Club (Học viên cũ học lại khoá mới)
          </option>
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
        {errors.referral_source && (
          <span className="text-[10px] text-red-500 font-bold mt-1 block">
            {errors.referral_source}
          </span>
        )}
      </div>

      {/* Living Region Dropdown */}
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-2">
          Hiện tại bạn đang sinh sống ở khu vực nào? <span className="text-red-500">*</span>
        </label>
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
        {errors.living_region && (
          <span className="text-[10px] text-red-500 font-bold mt-1 block">
            {errors.living_region}
          </span>
        )}
      </div>

      {/* Gender Dropdown */}
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-2">
          Bạn là: <span className="text-red-500">*</span>
        </label>
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
        {errors.gender && (
          <span className="text-[10px] text-red-500 font-bold mt-1 block">{errors.gender}</span>
        )}
      </div>

      {/* Age Group Dropdown */}
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-2">
          Bạn năm nay bao nhiêu tuổi? <span className="text-red-500">*</span>
        </label>
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
        {errors.age_group && (
          <span className="text-[10px] text-red-500 font-bold mt-1 block border-0">
            {errors.age_group}
          </span>
        )}
      </div>
    </div>
  );
};
