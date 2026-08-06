import React from 'react';

interface FormStep4Props {
  formData: {
    product_idea: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  isSubmitting: boolean;
  errors: { [key: string]: string };
}

export const FormStep4ProductIdea: React.FC<FormStep4Props> = ({
  formData,
  setFormData,
  isSubmitting,
  errors,
}) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1.5">
          Ý tưởng sản phẩm dự kiến xây dựng
        </label>
        <textarea
          required
          disabled={isSubmitting}
          value={formData.product_idea}
          onChange={(e) => setFormData({ ...formData, product_idea: e.target.value })}
          rows={5}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54] text-sm font-semibold transition-all disabled:opacity-50"
          placeholder="VD: Một ứng dụng theo dõi chi tiêu mini kết nối Google Sheet để quản lý tài chính cá nhân tự động bằng AI..."
        />
        {errors.product_idea && (
          <span className="text-[10px] text-red-500 font-bold mt-1 block">
            {errors.product_idea}
          </span>
        )}
      </div>
    </div>
  );
};
