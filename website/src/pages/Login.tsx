import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { BrandLogo } from '../components/BrandLogo';
import { Shield, User, ArrowRight, X } from 'lucide-react';

export const Login: React.FC = () => {
  const { loginWithGmail } = useDatabase();
  const [showChooser, setShowChooser] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [error, setError] = useState('');
  const [parrotText, setParrotText] = useState(
    'Ahoy! Ta là Vẹt gác cổng đây! Hãy đăng nhập bằng Gmail của ngươi để bước lên boong tàu LightMS nào! 🦜'
  );

  // Preseeded accounts for quick testing
  const preseededAccounts = [
    {
      name: 'Đặng Tuyết Hồng',
      email: 'dangtuyethong2324@gmail.com',
      role: 'Admin',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop',
      desc: 'Founder & Giảng viên'
    },
    {
      name: 'Tuyết Hồng',
      email: 'tuyethong.cym@gmail.com',
      role: 'Học viên',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
      desc: 'Đã hoàn thành Onboarding'
    },
    {
      name: 'Jack Sparrow',
      email: 'jacksparrow@the1ight.com',
      role: 'Học viên',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop',
      desc: 'Thuyền trưởng tàu Ngọc Trai Đen'
    }
  ];

  const handleAccountSelect = (email: string) => {
    const user = loginWithGmail(email);
    if (user) {
      setError('');
      setShowChooser(false);
    } else {
      setError('Đăng nhập thất bại. Vui lòng thử lại.');
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customEmail)) {
      setError('Địa chỉ email không hợp lệ. Hãy điền đúng định dạng Gmail!');
      setParrotText('Arrr! Ngươi đang gõ cái gì thế kia? Điền đúng địa chỉ Gmail đi thủy thủ ơi! 🦜');
      return;
    }
    
    const user = loginWithGmail(customEmail);
    if (user) {
      setError('');
      setShowChooser(false);
    } else {
      setError('Có lỗi xảy ra khi khởi tạo tài khoản.');
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#15333B] flex items-center justify-center p-4 overflow-hidden select-none font-sans">
      
      {/* ── Background & Lighthouse Beam Animation ── */}
      <div className="absolute inset-0 z-0">
        {/* Deep ocean background gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0b1c20] via-[#15333B] to-[#214C54]" />
        
        {/* Lighthouse sweeping beam */}
        <div 
          className="absolute top-1/4 left-1/2 w-[2000px] h-[300px] bg-gradient-to-r from-[#FFD94C]/10 to-transparent blur-3xl pointer-events-none origin-left animate-pulse-slow"
          style={{
            transform: 'translateX(-50%) rotate(-15deg)',
          }}
        />
        
        {/* Subtle grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      {/* ── Login Card ── */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-2xl flex flex-col items-center text-center transition-all duration-300 hover:border-white/20">
        
        {/* Lighthouse Logo & Brand */}
        <div className="mb-6 relative">
          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center shadow-lg border border-white/10">
            <BrandLogo size={64} lighthouseColor="#FFD94C" sunbeamColor="#FFF" waveColor="#00B2E2" />
          </div>
          {/* Decorative light ring */}
          <div className="absolute inset-0 rounded-3xl border-2 border-[#FFD94C]/30 scale-110 blur-[2px]" />
        </div>

        <h1 className="text-3xl font-black text-white tracking-tight mb-2">
          Hải Trình <span className="text-[#FFD94C]">LightMS</span>
        </h1>
        <p className="text-sm text-white/60 mb-8 leading-relaxed max-w-xs">
          Hệ thống quản lý học tập Mastery-based dành cho Solopreneurs và Product Builders.
        </p>

        {/* ── Google Sign In Button ── */}
        <button
          onClick={() => {
            setShowChooser(true);
            setParrotText('Hô hô! Đúng rồi đấy! Click chọn một tài khoản Gmail từ pop-up Google để lên boong tàu thôi! 🦜');
          }}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 group"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Đăng nhập bằng Google
        </button>

        {/* Brand footer inside card */}
        <div className="mt-8 flex items-center gap-2 text-xs text-white/40">
          <Shield className="w-3.5 h-3.5 text-[#FFD94C]" />
          <span>Xác thực Google OAuth an toàn</span>
        </div>
      </div>

      {/* ── Mascot & Dialog Section ── */}
      <div className="absolute bottom-6 right-6 z-20 hidden md:flex flex-col items-end max-w-xs pointer-events-none">
        <div className="mb-3 bg-[#FDF5DA] border-2 border-[#EAB308] text-[#15333B] text-xs font-semibold p-4 rounded-2xl shadow-xl relative pointer-events-auto">
          <div className="absolute bottom-[-10px] right-8 w-0 h-0 border-t-[10px] border-t-[#EAB308] border-x-[8px] border-x-transparent" />
          <div className="absolute bottom-[-7px] right-[33px] w-0 h-0 border-t-[8px] border-t-[#FDF5DA] border-x-[7px] border-x-transparent" />
          <p className="leading-relaxed">{parrotText}</p>
        </div>
        
        <div className="w-16 h-16 bg-[#214C54] border-2 border-[#FFD94C] rounded-full shadow-lg flex items-center justify-center pointer-events-auto cursor-pointer hover:scale-110 transition-transform">
          <span className="text-3xl">🦜</span>
        </div>
      </div>

      {/* ── Google Account Chooser Modal (Mockup Popup) ── */}
      {showChooser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-[390px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col text-left p-6 md:p-8 relative">
            
            {/* Close button */}
            <button 
              onClick={() => {
                setShowChooser(false);
                setError('');
                setParrotText('Ơ kìa? Đóng pop-up làm gì thế thủy thủ? Không định đăng nhập để học bài à? 🦜');
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Google Identity Header */}
            <div className="flex flex-col items-center text-center mb-6 mt-2">
              <svg className="w-8 h-8 mb-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <h2 className="text-xl font-bold text-gray-950">Đăng nhập bằng Google</h2>
              <p className="text-xs text-gray-500 mt-1">để tiếp tục đến <span className="font-bold text-[#214C54]">LightMS</span></p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 text-xs font-semibold p-3 rounded-xl mb-4 border border-red-100">
                {error}
              </div>
            )}

            {/* Account List */}
            {!showCustomInput ? (
              <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
                {preseededAccounts.map((acc, index) => (
                  <button
                    key={index}
                    onClick={() => handleAccountSelect(acc.email)}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl border border-gray-100 hover:border-[#214C54]/30 hover:bg-gray-50 transition-all text-left"
                  >
                    <img src={acc.avatar} alt={acc.name} className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-800 truncate">{acc.name}</span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          acc.role === 'Admin' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-sky-50 text-sky-700 border border-sky-200'
                        }`}>
                          {acc.role}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-500 truncate block">{acc.email}</span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">{acc.desc}</span>
                    </div>
                  </button>
                ))}

                <div className="border-t border-gray-100 my-2" />

                {/* Option to use other account */}
                <button
                  onClick={() => {
                    setShowCustomInput(true);
                    setParrotText('Ồ! Ngươi muốn dùng Gmail mới hoàn toàn để đăng ký tài khoản thủy thủ mới hả? Hãy điền vào đi! 🦜');
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#214C54] text-gray-600 hover:text-[#214C54] hover:bg-[#214C54]/5 transition-all text-sm font-bold text-center"
                >
                  <User className="w-4 h-4" />
                  Sử dụng một tài khoản khác
                </button>
              </div>
            ) : (
              /* Custom Gmail Input Form */
              <form onSubmit={handleCustomSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1.5">
                    Địa chỉ Gmail
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="example@gmail.com"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#214C54] focus:ring-1 focus:ring-[#214C54] text-sm font-semibold transition-all"
                  />
                  <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed">
                    Nhập bất kỳ Gmail nào. Nếu là Gmail mới, bạn sẽ tham gia chặng khảo sát Onboarding để kích hoạt tài khoản học viên.
                  </p>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomInput(false);
                      setError('');
                      setParrotText('Hì hì, chọn tài khoản có sẵn cũng là ý hay cho nhanh đấy! 🦜');
                    }}
                    className="flex-1 py-3 px-4 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl font-bold text-xs transition-all text-center"
                  >
                    Quay lại
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-[#214C54] hover:bg-[#15333B] text-white rounded-xl font-bold text-xs shadow-sm hover:shadow transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    Tiếp tục
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {/* Google Terms Footer */}
            <p className="text-[10px] text-gray-400 mt-6 leading-relaxed text-center border-t border-gray-50 pt-4">
              Để tiếp tục, Google sẽ chia sẻ tên, địa chỉ email, tùy chọn ngôn ngữ và ảnh hồ sơ của bạn với LightMS.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
