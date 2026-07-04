import React, { useState, useEffect } from 'react';
import { useDatabase } from '../context/DatabaseContext';

interface ParrotMascotProps {
  currentPage: string;
}

export const ParrotMascot: React.FC<ParrotMascotProps> = ({ currentPage }) => {
  const { activeUser, notifications } = useDatabase();
  const [bubbleText, setBubbleText] = useState('');
  const [showBubble, setShowBubble] = useState(false);
  const [isWiggling, setIsWiggling] = useState(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    return localStorage.getItem('lms_parrot_muted') === 'true';
  });

  // Define speech scripts based on page views
  useEffect(() => {
    let script = '';
    const name = activeUser.full_name;
    const isStudent = activeUser.role === 'student';

    if (!isStudent) {
      // Mentor/Admin lines
      switch (currentPage) {
        case 'admin-dashboard':
          script = `Aye Thuyền trưởng ${name}! Đang có vài kẻ đi chậm tiến độ trên hải đồ kìa. Can thiệp ngay thôi!`;
          break;
        case 'speedgrader':
          script = `Quạaa! Một xấp bài nộp đang chờ được chấm. Đọc kỹ Rubric rồi ban thưởng Hải lý thôi nào!`;
          break;
        case 'student-mgmt':
          script = `Danh sách thủy thủ đoàn đây rồi. Ai đạt chuẩn Mastery chưa hả Thuyền trưởng?`;
          break;
        case 'course-builder':
          script = `Xây dựng hải lộ kiến thức thôi! Thêm chướng ngại vật hay thêm rương kho báu nào?`;
          break;
        default:
          script = `Aye aye Đặng Tuyết Hồng! Ta đang canh gác hệ thống, không có con tàu lạ nào lọt qua được đâu!`;
      }
    } else {
      // Student lines
      switch (currentPage) {
        case 'dashboard':
          if (!activeUser.is_profile_completed) {
            script = `Arrr! Chào mừng Thủy thủ mới! Hồ sơ của ngươi còn trống kìa, mau hoàn thành đi kẻo bị phạt!`;
          } else if (activeUser.nautical_miles < 500) {
            script = `Tàu của ngươi đang ở vùng biển lặng gió. Nhấp vào Bản đồ (Syllabus) để mở rộng buồm đi thôi!`;
          } else {
            script = `Thủy thủ ${name}! Gió đang lên và tàu ta đang lướt sóng rất cừ! Tiếp tục phát huy!`;
          }
          break;
        case 'about':
          script = `Tài liệu 'Read Me First' này cực kỳ quan trọng! Đọc kỹ quy luật hải trình kẻo lạc lối giữa đại dương!`;
          break;
        case 'onboarding':
          script = `La bàn định hướng đây rồi! Hãy đánh dấu từng việc để làm quen với đồng đội và văn hóa tàu nhé!`;
          break;
        case 'syllabus':
          script = `Kho báu kiến thức nằm cả ở đây! Bấm vào từng buổi, xem video và nhớ làm bài tập (Action Items) đó nha!`;
          break;
        case 'competency':
          script = `Mắt ta lóa rồi! Nhìn biểu đồ kỹ năng này đi. Phải ráng đạt mốc Competent (Level 3) để ra khơi tự lập nghe chưa!`;
          break;
        case 'discussion':
          script = `Đảo thảo luận đây rồi! Xem bài làm của đồng đội khác để học lỏm đi. Nhớ thả tim (Upvote) hoặc comment cứu net nhé!`;
          break;
        case 'calendar':
          script = `Xem lịch trình để không bỏ lỡ các buổi live meeting. Click nút để đồng bộ vào Google Calendar của ngươi đi!`;
          break;
        case 'walloffame':
          script = `Rương vàng lấp lánh! Ai đang đứng đầu bảng xếp hạng Hải lý kìa? Ráng cày điểm để được ghim tên lên đây đi!`;
          break;
        case 'profile':
          script = `Thẻ Căn Cước của ngươi đây! Trưng bày đống Huy hiệu (Badges) kiếm được ra đây xem oai phong lẫm liệt thế nào!`;
          break;
        case 'help':
          script = `Bị mắc cẹt hay gặp bão biển à? Bấm nút chát Telegram với đội hỗ trợ Light Support ngay đi, họ có phao cứu sinh đó!`;
          break;
        default:
          script = `Aye! Gió biển mát lành quá. Chúc ngươi có một ngày build sản phẩm mượt mà!`;
      }
    }

    setBubbleText(script);
    if (!isMuted) {
      setShowBubble(true);
      triggerWiggle();
    }

    // Hide bubble after 8 seconds
    const timer = setTimeout(() => {
      setShowBubble(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, [currentPage, activeUser, isMuted]);

  // Listen to new notifications and pop them up through the parrot!
  useEffect(() => {
    if (notifications.length > 0 && !isMuted) {
      const latest = notifications[0];
      // Only pop up if it's recent (within 5 seconds)
      const isRecent = (new Date().getTime() - new Date(latest.created_at).getTime()) < 5000;
      if (isRecent) {
        setBubbleText(`🦜 LOA LOA! ${latest.title}: ${latest.message.replace(/📢|⚓|📝|🏆/g, '')}`);
        setShowBubble(true);
        triggerWiggle();
        
        const timer = setTimeout(() => {
          setShowBubble(false);
        }, 8000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [notifications, isMuted]);

  const triggerWiggle = () => {
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 800);
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem('lms_parrot_muted', String(newMuted));
    if (newMuted) {
      setShowBubble(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none select-none">
      {/* Dialogue bubble */}
      {showBubble && (
        <div 
          className="mb-3 max-w-xs p-4 bg-[#FDF5DA] border-2 border-[#EAB308] text-[#15333B] text-xs font-semibold rounded-2xl shadow-xl relative animate-fade-in pointer-events-auto cursor-pointer"
          onClick={() => setShowBubble(false)}
        >
          <div className="absolute bottom-[-10px] right-8 w-0 h-0 border-t-[10px] border-t-[#EAB308] border-x-[8px] border-x-transparent" />
          <div className="absolute bottom-[-7px] right-[33px] w-0 h-0 border-t-[8px] border-t-[#FDF5DA] border-x-[7px] border-x-transparent" />
          <p className="leading-relaxed whitespace-pre-line">{bubbleText}</p>
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#EAB308]/20">
            <button
              onClick={handleToggleMute}
              className="text-[10px] text-[#CA8A04] hover:text-[#CA8A04]/80 font-bold underline"
            >
              Tắt tự động nói
            </button>
            <span className="text-[10px] text-[#3E5E63] opacity-60">Nhấp để đóng</span>
          </div>
        </div>
      )}

      {/* Parrot Mascot Icon */}
      <div 
        className={`w-16 h-16 bg-[#214C54] border-2 border-[#FFD94C] rounded-full shadow-lg flex items-center justify-center pointer-events-auto cursor-pointer relative overflow-visible ${
          isWiggling ? 'animate-wiggle' : 'hover:scale-110 transition-transform duration-300'
        } ${isMuted ? 'opacity-50 grayscale hover:opacity-100 hover:grayscale-0' : ''}`}
        onClick={() => {
          setShowBubble(!showBubble);
          triggerWiggle();
        }}
        title={isMuted ? "Vẹt đang tắt tự động nói. Nhấp để bật/tương tác." : "Vẹt trợ lý. Nhấp để trò chuyện."}
      >
        <span className="text-3xl filter drop-shadow">🦜</span>
        
        {/* Glow pulsing effect */}
        {!isMuted && (
          <span className="absolute inset-0 rounded-full border border-[#FFD94C] animate-ping opacity-25 pointer-events-none" />
        )}

        {/* Small mute status badge */}
        {isMuted && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-500 rounded-full flex items-center justify-center text-[10px] text-white border border-white font-bold">
            🔇
          </div>
        )}
      </div>
    </div>
  );
};
