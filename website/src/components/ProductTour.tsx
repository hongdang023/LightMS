import React, { useState, useEffect } from "react";
import { useDatabase } from "../context/DatabaseContext";
import { ChevronRight, X, Sparkles, HelpCircle } from "lucide-react";

interface TourStep {
  targetId?: string;
  title: string;
  content: string;
  position: "bottom" | "top" | "left" | "right" | "center";
}

export const ProductTour: React.FC = () => {
  const { activeUser, isAuthenticated } = useDatabase();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const steps: TourStep[] = [
    {
      title: "Chào mừng thủy thủ đến với LightMS! ⛵",
      content:
        "Hãy dành ra 1 phút để ta dẫn ngươi đi tham quan quanh con tàu này nhé! Ta sẽ chỉ cho ngươi biết các khu vực tính năng chính.",
      position: "center",
    },
    {
      targetId: "nav-item-about",
      title: "Giới thiệu 🧭",
      content:
        "Nơi giới thiệu về khóa học, triết lý giáo dục của Conan Learning OS, và các thông tin cơ bản giúp bạn làm quen với môi trường học tập.",
      position: "right",
    },
    {
      targetId: "nav-item-dashboard",
      title: "Dashboard học tập 🏠",
      content:
        "Nơi hiển thị tiến độ học tập hàng ngày của bạn, danh sách bài tập chưa hoàn thành và các nhiệm vụ cần thực hiện.",
      position: "right",
    },
    {
      targetId: "nav-item-announcements",
      title: "Thông báo lớp học 📢",
      content:
        "Nơi cập nhật nhanh những thông tin, sự kiện và nhắc nhở quan trọng nhất từ Ban quản lý lớp học và Mentor.",
      position: "right",
    },
    {
      targetId: "nav-item-onboarding",
      title: "Tuần Onboarding 🚀",
      content:
        "Chặng 1 của khóa học! Bạn sẽ có 7 ngày để thiết lập môi trường làm việc, cam kết học tập, làm quen cách viết problem statement và tương tác với AI.",
      position: "right",
    },
    {
      targetId: "nav-item-syllabus",
      title: "Lộ trình học (Syllabus) 📚",
      content:
        "Nơi lưu trữ giáo trình, các buổi học (video bài giảng, slide), đề bài tập cũng như chấm điểm phản hồi từ Mentor.",
      position: "right",
    },
    {
      targetId: "nav-item-calendar",
      title: "Lịch học lớp 📅",
      content:
        "Xem lịch các buổi học Live Class, hạn chót nộp bài tập và các sự kiện diễn ra trong suốt khóa học.",
      position: "right",
    },
    {
      targetId: "nav-item-walloffame",
      title: "Bảng vinh danh 🏆",
      content:
        "Nơi tôn vinh các học viên xuất sắc, tích lũy nhiều Hải lý nhất và các thành tựu nổi bật trên hành trình chinh phục khóa học.",
      position: "right",
    },
    {
      targetId: "nav-item-help",
      title: "Hỏi đáp & Hỗ trợ 💬",
      content:
        "Kênh gửi câu hỏi hỗ trợ kỹ thuật, giải đáp thắc mắc về bài học và tương tác trực tiếp với đội ngũ Mentor.",
      position: "right",
    },
    {
      targetId: "header-profile-dropdown",
      title: "Hồ sơ",
      content:
        "Tại đây bạn có thể cập nhật thông tin cá nhân (Telegram/Facebook) để Mentor tiện hỗ trợ, đồng thời theo dõi số điểm Hải lý đã tích lũy và bộ sưu tập Huy hiệu thành tựu của mình!",
      position: "bottom",
    },
  ];

  useEffect(() => {
    // Only run for student role and when authenticated
    if (isAuthenticated && activeUser && activeUser.role === "student") {
      const tourKey = `lms_tour_completed_${activeUser.id}`;
      const completed = localStorage.getItem(tourKey);
      if (completed !== "true") {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, activeUser?.id, activeUser?.role]);

  useEffect(() => {
    if (!isOpen) return;

    const updateCoords = () => {
      const step = steps[currentStep];
      if (step.targetId) {
        const el = document.getElementById(step.targetId);
        if (el) {
          const rect = el.getBoundingClientRect();
          setCoords({
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height,
          });

          el.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
      }
      setCoords(null);
    };

    updateCoords();

    window.addEventListener("resize", updateCoords);
    window.addEventListener("scroll", updateCoords);

    return () => {
      window.removeEventListener("resize", updateCoords);
      window.removeEventListener("scroll", updateCoords);
    };
  }, [currentStep, isOpen]);

  if (!isOpen) return null;

  const step = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    if (activeUser) {
      localStorage.setItem(`lms_tour_completed_${activeUser.id}`, "true");
    } else {
      localStorage.setItem("lms_tour_completed", "true");
    }
    setIsOpen(false);
  };

  const getTooltipStyle = (): React.CSSProperties => {
    if (!coords) {
      return {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1000,
      };
    }

    const margin = 16;
    const tooltipWidth = 320;

    if (step.position === "right") {
      return {
        position: "absolute",
        top: coords.top + coords.height / 2 - 100,
        left: coords.left + coords.width + margin,
        zIndex: 1000,
      };
    }

    if (step.position === "bottom") {
      return {
        position: "absolute",
        top: coords.top + coords.height + margin,
        left: coords.left + coords.width / 2 - tooltipWidth / 2,
        zIndex: 1000,
      };
    }

    return {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 1000,
    };
  };

  return (
    <div className="absolute inset-0 z-[999] pointer-events-none">
      {/* SVG overlay mask to highlight target element */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-auto"
        style={{ zIndex: 998 }}
      >
        <defs>
          <mask id="tour-mask">
            {/* White color keeps opacity (shows the dark mask overlay) */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* Black color cuts out of the mask (reveals the highlighted element underneath) */}
            {coords && (
              <rect
                x={coords.left - 6}
                y={coords.top - 6 - window.scrollY}
                width={coords.width + 12}
                height={coords.height + 12}
                rx="12"
                fill="black"
              />
            )}
          </mask>
        </defs>
        {/* The overlay background with transparency and blur applied via CSS, masked by the SVG mask */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="#0f172a"
          fillOpacity="0.7"
          mask="url(#tour-mask)"
          onClick={handleSkip}
          className="cursor-pointer"
        />
      </svg>

      {coords && (
        <div
          className="absolute border-[3px] border-[#FFD94C] rounded-xl shadow-[0_0_25px_rgba(255,217,76,0.5)] transition-all duration-300 pointer-events-none"
          style={{
            top: coords.top - 6,
            left: coords.left - 6,
            width: coords.width + 12,
            height: coords.height + 12,
            zIndex: 999,
          }}
        />
      )}

      <div
        className="w-full max-w-[340px] bg-[#15333B] border border-[#3E5E63]/50 text-white p-6 rounded-3xl shadow-2xl transition-all duration-300 pointer-events-auto flex flex-col gap-4"
        style={getTooltipStyle()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FFD94C] animate-pulse" />
            <h4 className="font-extrabold text-sm text-[#FFD94C] tracking-wide uppercase">
              Hướng dẫn nhanh
            </h4>
          </div>
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-white transition-colors bg-transparent border-0 cursor-pointer p-0"
            title="Đóng hướng dẫn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          <h5 className="font-black text-lg text-white leading-snug">
            {step.title}
          </h5>
          <p className="text-xs text-gray-300 leading-relaxed font-semibold">
            {step.content}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2 pt-4 border-t border-[#3E5E63]/30">
          <span className="text-[10px] text-gray-400 font-extrabold">
            Bước {currentStep + 1} / {steps.length}
          </span>

          <div className="flex items-center gap-2">
            {currentStep < steps.length - 1 && (
              <button
                onClick={handleSkip}
                className="text-[10px] text-gray-400 hover:text-white font-black bg-transparent border-0 cursor-pointer py-1.5 px-3"
              >
                Bỏ qua
              </button>
            )}
            <button
              onClick={handleNext}
              className="btn btn-accent text-[10px] font-black py-2 px-4 rounded-lg flex items-center gap-1 border-0 cursor-pointer"
            >
              <span>
                {currentStep === steps.length - 1 ? "Hoàn thành" : "Tiếp tục"}
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {!isOpen && (
        <button
          onClick={() => {
            setCurrentStep(0);
            setIsOpen(true);
          }}
          className="fixed bottom-6 left-6 z-[999] w-12 h-12 bg-[#214C54] hover:bg-[#15333B] border-2 border-[#FFD94C] text-[#FFD94C] rounded-full shadow-lg flex items-center justify-center pointer-events-auto cursor-pointer hover:scale-105 transition-all"
          title="Xem lại hướng dẫn hệ thống"
        >
          <HelpCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};
