import React, { useState } from 'react';
import { KeyRound, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { useCourse } from '../context/CourseContext';
import { useToast } from '../context/ToastContext';
import { Button } from './ui/Button';
import type { Course, Batch } from '../types/database';

interface AccessCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetCourse?: Course | null;
  targetBatch?: Batch | null;
  onSuccessNavigate?: () => void;
}

export const AccessCodeModal: React.FC<AccessCodeModalProps> = ({
  isOpen,
  onClose,
  targetCourse,
  targetBatch,
  onSuccessNavigate,
}) => {
  const { enrollWithAccessCode } = useCourse();
  const { showToast } = useToast();
  const [accessCode, setAccessCode] = useState(targetBatch?.access_code || '');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) {
      setErrorMsg('Vui lòng nhập mã kích hoạt.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    setTimeout(() => {
      const result = enrollWithAccessCode(accessCode.trim(), targetBatch?.id);
      setIsSubmitting(false);

      if (result.success) {
        setIsSuccess(true);
        showToast(result.message, 'success');
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
          if (onSuccessNavigate) onSuccessNavigate();
        }, 1000);
      } else {
        setErrorMsg(result.message);
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#15333B]/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting || isSuccess}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-[#15333B] hover:bg-gray-100 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-[#ECFDF5] text-[#10B981] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#10B981]/30">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <h3 className="text-xl font-bold text-[#15333B] mb-2">Mở khóa thành công!</h3>
            <p className="text-sm text-[#3E5E63]">
              Đang chuẩn bị đưa bạn vào lớp học...
            </p>
          </div>
        ) : (
          <div>
            {/* Header Icon & Title */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] border border-[#214C54]/20 flex items-center justify-center text-[#214C54]">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#15333B]">Nhập Mã Kích Hoạt</h3>
                <p className="text-xs text-[#3E5E63]">
                  {targetCourse?.title ? targetCourse.title : 'Kích hoạt quyền truy cập lớp học'}
                </p>
              </div>
            </div>

            {targetBatch && (
              <div className="mb-4 p-3.5 bg-[#F0F0F0] border border-gray-200 rounded-xl flex items-center justify-between text-xs">
                <div className="text-[#3E5E63]">
                  Lớp: <span className="font-bold text-[#15333B]">{targetBatch.name}</span>
                </div>
                <div className="flex items-center gap-1 text-[#214C54] font-mono font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {targetBatch.batch_code}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#15333B] uppercase tracking-wider mb-2">
                  Mã kích hoạt của bạn
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={accessCode}
                    onChange={(e) => {
                      setAccessCode(e.target.value.toUpperCase());
                      setErrorMsg(null);
                    }}
                    placeholder="VD: VIBE201-K3-888"
                    className="w-full px-4 py-3 bg-[#F0F0F0] border border-gray-300 rounded-xl text-[#15333B] font-mono text-center tracking-widest text-lg placeholder:text-gray-400 focus:outline-none focus:border-[#214C54] focus:bg-white focus:ring-2 focus:ring-[#214C54]/10 transition-all uppercase"
                    autoFocus
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-[#FEF2F2] border border-[#EF4444]/30 rounded-xl flex items-center gap-2 text-[#EF4444] text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={onClose}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                  disabled={!accessCode.trim()}
                  className="flex-1"
                >
                  Kích hoạt ngay
                </Button>
              </div>
            </form>

            <div className="mt-5 pt-4 border-t border-gray-100 text-center">
              <p className="text-[11px] text-[#3E5E63]">
                Chưa có mã kích hoạt? Vui lòng liên hệ Ban Tổ Chức The1ight để được cấp quyền.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
