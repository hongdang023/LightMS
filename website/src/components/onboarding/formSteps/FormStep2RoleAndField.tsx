import React from 'react';

interface FormStep2Props {
  formData: {
    current_role: string;
    work_field: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  otherRole: string;
  setOtherRole: React.Dispatch<React.SetStateAction<string>>;
  otherField: string;
  setOtherField: React.Dispatch<React.SetStateAction<string>>;
  errors: { [key: string]: string };
}

export const FormStep2RoleAndField: React.FC<FormStep2Props> = ({
  formData,
  setFormData,
  otherRole,
  setOtherRole,
  otherField,
  setOtherField,
  errors,
}) => {
  return (
    <div className="space-y-5 animate-fade-in pr-1">
      {/* Current Role Dropdown */}
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-2">
          Vai trò hiện tại của bạn? <span className="text-red-500">*</span>
        </label>
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
          <option value="Đang trong thời gian nghỉ việc/ chuyển ngành">
            Đang trong thời gian nghỉ việc/ chuyển ngành
          </option>
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
        {errors.current_role && (
          <span className="text-[10px] text-red-500 font-bold mt-1 block">
            {errors.current_role}
          </span>
        )}
      </div>

      {/* Work Field Dropdown */}
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-2">
          Bạn đang học/làm trong lĩnh vực gì? <span className="text-red-500">*</span>
        </label>
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
        {errors.work_field && (
          <span className="text-[10px] text-red-500 font-bold mt-1 block">
            {errors.work_field}
          </span>
        )}
      </div>
    </div>
  );
};
