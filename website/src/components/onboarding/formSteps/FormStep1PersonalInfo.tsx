import React from 'react';

interface FormStep1Props {
  formData: {
    full_name: string;
    phone_number: string;
    facebook_url: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  errors: { [key: string]: string };
}

export const FormStep1PersonalInfo: React.FC<FormStep1Props> = ({
  formData,
  setFormData,
  errors,
}) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <label className="text-xs font-bold text-[#15333B] block mb-1">
          Họ và tên <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          placeholder="Ví dụ: Nguyễn Văn A"
          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#214C54]/20 focus:border-[#214C54] transition-all ${
            errors.full_name ? 'border-rose-500 bg-rose-50/20' : 'border-gray-200'
          }`}
        />
        {errors.full_name && (
          <span className="text-[10px] text-rose-500 font-bold block mt-1">
            {errors.full_name}
          </span>
        )}
      </div>

      <div>
        <label className="text-xs font-bold text-[#15333B] block mb-1">
          Số điện thoại (Zalo) <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={formData.phone_number}
          onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
          placeholder="Ví dụ: 0912345678"
          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#214C54]/20 focus:border-[#214C54] transition-all ${
            errors.phone_number ? 'border-rose-500 bg-rose-50/20' : 'border-gray-200'
          }`}
        />
        {errors.phone_number && (
          <span className="text-[10px] text-rose-500 font-bold block mt-1">
            {errors.phone_number}
          </span>
        )}
      </div>

      <div>
        <label className="text-xs font-bold text-[#15333B] block mb-1">
          Facebook URL cá nhân <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={formData.facebook_url}
          onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
          placeholder="https://facebook.com/..."
          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#214C54]/20 focus:border-[#214C54] transition-all ${
            errors.facebook_url ? 'border-rose-500 bg-rose-50/20' : 'border-gray-200'
          }`}
        />
        {errors.facebook_url && (
          <span className="text-[10px] text-rose-500 font-bold block mt-1">
            {errors.facebook_url}
          </span>
        )}
      </div>
    </div>
  );
};
