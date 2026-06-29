import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { PageHeader } from '../../components/PageHeader';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { addNotification, calendarEvents } = useDatabase();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1)); // Month is 0-indexed, 6 = July 2026

  // Helper to get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Helper to get day of week of the 1st (0 = Sun, 1 = Mon, ..., 6 = Sat)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const getEventsForDate = (yearNum: number, monthNum: number, dateNum: number, dayOfWeek: number) => {
    const currentTimestamp = new Date(yearNum, monthNum, dateNum).getTime();

    return calendarEvents.filter(e => {
      // Specific date
      if (e.date && e.month !== undefined && e.year !== undefined) {
        if (e.date === dateNum && e.month === monthNum && e.year === yearNum) return true;
        return false;
      }
      // Recurring
      if (e.dayOfWeek === dayOfWeek) {
        if (e.startRecur && currentTimestamp < e.startRecur) return false;
        if (e.endRecur && currentTimestamp > e.endRecur) return false;
        return true;
      }
      return false;
    });
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  let firstDay = getFirstDayOfMonth(year, month);
  // Adjust so Monday is 0
  firstDay = firstDay === 0 ? 6 : firstDay - 1;

  const daysPrevMonth = getDaysInMonth(year, month - 1);
  
  // Create grid cells
  const gridCells = [];
  
  // Previous month cells
  for (let i = 0; i < firstDay; i++) {
    gridCells.push({
      date: daysPrevMonth - firstDay + i + 1,
      isCurrentMonth: false,
      dayOfWeek: i + 1 // 1 to 7
    });
  }
  
  // Current month cells
  for (let i = 1; i <= daysInMonth; i++) {
    gridCells.push({
      date: i,
      isCurrentMonth: true,
      dayOfWeek: ((firstDay + i - 1) % 7) + 1
    });
  }
  
  // Next month cells (fill to 42 cells = 6 rows)
  const remainingCells = 42 - gridCells.length;
  for (let i = 1; i <= remainingCells; i++) {
    gridCells.push({
      date: i,
      isCurrentMonth: false,
      dayOfWeek: ((firstDay + daysInMonth + i - 1) % 7) + 1
    });
  }

  const generateICS = () => {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//LightMS//VN\nCALSCALE:GREGORIAN\n";
    
    // Helper to format date for ICS (UTC)
    const formatDate = (date: Date, timeStr: string, isAllDay: boolean) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      if (isAllDay) {
        return `${year}${month}${day}`;
      }
      
      const [hours, minutes] = timeStr.split(':').map(Number);
      const localDate = new Date(year, date.getMonth(), date.getDate(), hours, minutes, 0);
      
      const utcYear = localDate.getUTCFullYear();
      const utcMonth = String(localDate.getUTCMonth() + 1).padStart(2, '0');
      const utcDay = String(localDate.getUTCDate()).padStart(2, '0');
      const utcHours = String(localDate.getUTCHours()).padStart(2, '0');
      const utcMins = String(localDate.getUTCMinutes()).padStart(2, '0');
      
      return `${utcYear}${utcMonth}${utcDay}T${utcHours}${utcMins}00Z`;
    };

    const getEventDescription = (title: string, date: Date, timeStr: string, customDetails?: string) => {
      const titleUpper = title.toUpperCase();
      
      const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
      const dayName = days[date.getDay()];
      const formattedDate = `${dayName}, ${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
      
      if (titleUpper.includes('KICK-OFF') || titleUpper.includes('KICKOFF')) {
        return `Chào mừng bạn đến với hành trình **Build with The1ight** \n\nĐội ngũ The1ight thân mời bạn tham gia Buổi Kick-off Meeting - cột mốc quan trọng để chúng ta cùng nhau đặt những viên gạch đầu tiên, làm quen với đội ngũ điều phối và sẵn sàng cho hải trình xây dựng sản phẩm sắp tới. \n\n📍 **Thông tin tham gia:**\n\n* **Thời gian:** ${timeStr} ngày ${formattedDate}\n* **Link tham gia:** https://zoom.us/j/the1ight-lms-class\n\n📝 **Nội dung chính:**\n\n1. **Chào mừng & Làm quen:** Giới thiệu đội ngũ và các thành viên trong lớp.\n2. **Lộ trình khóa học:** Chi tiết các chặng hành trình và mục tiêu cần đạt được.\n3. **Hướng dẫn công cụ:** Cách sử dụng các nền tảng hỗ trợ trong suốt quá trình học.\n4. **Giải đáp thắc mắc (Q&A):** Trả lời các câu hỏi về vận hành và nội dung học tập.\n\n💻 **Lưu ý chuẩn bị:**\n\n* Vui lòng truy cập link Zoom trước 05 phút để ổn định đường truyền internet.\n* Sử dụng máy tính cá nhân để thuận tiện cho việc theo dõi các slide hướng dẫn.\n\nNếu có bất kỳ khó khăn nào trong việc tham gia, bạn hãy liên hệ với **Ms. Đặng Hồng** qua SĐT **0985679417** hoặc [Messenger](https://www.facebook.com/danghong.harunoyuki) để được hỗ trợ kịp thời.\n\nHẹn gặp bạn tại buổi Kick-off!\n\nThân mến,\n\nĐội ngũ The1ight`;
      }
      
      if (titleUpper.includes('ONBOARDING')) {
        return `Chào mừng bạn đến với **Onboarding Week** - tuần lễ khởi động đặc biệt trước khi chính thức bước vào hành trình học tập cùng The 1ight ✨.\n\n📅 **Thời gian: ${formattedDate}**\n\nTrong 7 ngày sắp tới, mỗi ngày bạn sẽ được gửi một hoạt động nhỏ để:\n\n* Làm quen với tinh thần và cường độ học tập của khóa học.\n* Trang bị kiến thức và mindset nền tảng.\n* Kết nối cùng cộng đồng học viên qua những thử thách thú vị.\n\nChỉ **30 phút mỗi ngày**, bạn sẽ thấy việc học tập khi bước vào các buổi học chính thức thuận lợi hơn rất nhiều.\n\n👉 Hãy truy cập **đường link sau** để đọc hướng dẫn chi tiết nhé: ${window.location.origin}\n\nLưu ý: Onboarding Week KHÔNG PHẢI Live Class. Đây là Chuỗi các Bài tập cá nhân, học viên có thể tự sắp xếp thời gian hoàn thành bài tập phù hợp với lịch trình cá nhân.\n\nHẹn gặp bạn ở cuối tuần lễ này ^^\n\nThân mến,\n**Đội ngũ The 1ight** 💡`;
      }
      
      if (titleUpper.includes('LIVE CLASS')) {
        return `Thân gửi học viên,\n\nChào mừng bạn đến với buổi học trong hành trình **Build with The1ight**\n\n**Link Meeting: https://zoom.us/j/the1ight-lms-class**\n🕘 Lịch học cố định:\n\n* 🌙 **Thứ 5 — 20:30-22:30** hàng tuần\n* ☀️ **Chủ Nhật — 14:30-16:30** hàng tuần\n\nHãy chuẩn bị tinh thần thật thoải mái, chủ động học tập – kết nối – sẻ chia để cùng nhau tạo nên một buổi học đầy năng lượng nhé 💡.\n\nThân mến,\nĐội ngũ **The 1ight**`;
      }
      
      if (titleUpper.includes('OFFICE HOUR')) {
        return `Thân gửi hải tặc,\n\nOffice Hour là hoạt động hỗ trợ giải đáp thắc mắc của trainers cho các học viên ngoài giờ học. Để đăng kí hỗ trợ, hãy vote poll trên group chat của lớp nhé!\n\nThân mến,\n\nĐội ngũ The1ight`;
      }
      
      if (titleUpper.includes('CAPSTONE') || titleUpper.includes('CAPSTONES') || titleUpper.includes('PITCHING')) {
        return `Thân gửi các hải tặc của Hải trình Ánh sáng,\n\nĐội ngũ The1ight xin trân trọng mời các hải tặc tham gia Pitching Day để cùng nhau sẵn sàng ra khơi.\n\n⏰ **Lịch trình Pitching Day:**\n- 9h00 - 12h30: Pitching Online trên Google Meet + Xem trực tiếp buổi Pitching tại Hà Nội\n- 12h30 - 14h00: Ăn trưa giao lưu cùng lớp\n- 14h30 - 17h00: Bonding giao lưu với lớp\n\n📍**Địa điểm:**\n1. Quán cafe bonding:\nTiny Cafe Indochine Thái Hà\n👉https://maps.app.goo.gl/yG2XQmJozD73ZEQ3A\n2. Quán ăn trưa:\nChả cá lăng Vĩ Ngư Thái Hà\n👉 https://maps.app.goo.gl/yJKroMU1qXQ59Fyb6\n3. Link phòng pitching online:\n👉 https://meet.google.com/yis-osqi-vke\n\nCác hải tặc có thể xem **thứ tự pitching** tại đường link dưới đây:\n👉 https://www.facebook.com/share/p/1BBACd3XUN/\n\nRất mong được gặp cả nhà vào Thứ Bảy tuần nàyyyy!\n\nThân mến,\nĐội ngũ The1ight`;
      }

      return customDetails || '';
    };

    const addEvent = (eventTitle: string, date: Date, timeStr: string, details: string) => {
      const isAllDay = timeStr === 'Cả ngày';
      
      icsContent += "BEGIN:VEVENT\n";
      icsContent += `UID:${Math.random().toString(36).substring(2)}@lightms.vn\n`;
      icsContent += `DTSTAMP:${formatDate(new Date(), '00:00', false)}\n`;
      
      if (isAllDay) {
        icsContent += `DTSTART;VALUE=DATE:${formatDate(date, '', true)}\n`;
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        icsContent += `DTEND;VALUE=DATE:${formatDate(nextDay, '', true)}\n`;
      } else {
        icsContent += `DTSTART:${formatDate(date, timeStr, false)}\n`;
        const endDate = new Date(date);
        const [h, m] = timeStr.split(':').map(Number);
        endDate.setHours(h + 2, m, 0); // Giả định event kéo dài 2 tiếng
        icsContent += `DTEND:${formatDate(endDate, `${endDate.getHours()}:${endDate.getMinutes()}`, false)}\n`;
      }
      
      icsContent += `SUMMARY:${eventTitle}\n`;
      if (details) {
        icsContent += `DESCRIPTION:${details.replace(/\n/g, '\\n')}\n`;
      }
      icsContent += "END:VEVENT\n";
    };

    calendarEvents.forEach(e => {
      if (e.date && e.month !== undefined && e.year !== undefined) {
        const d = new Date(e.year, e.month, e.date);
        const desc = getEventDescription(e.title, d, e.time, e.details);
        addEvent(e.title, d, e.time, desc);
      } else if (e.dayOfWeek && e.startRecur && e.endRecur) {
        const start = new Date(e.startRecur);
        const end = new Date(e.endRecur);
        let current = new Date(start);
        while (current <= end) {
          let jsDay = current.getDay();
          let ourDay = jsDay === 0 ? 7 : jsDay;
          if (ourDay === e.dayOfWeek) {
            const d = new Date(current);
            const desc = getEventDescription(e.title, d, e.time, e.details);
            addEvent(e.title, d, e.time, desc);
          }
          current.setDate(current.getDate() + 1);
        }
      }
    });

    icsContent += "END:VCALENDAR";
    return icsContent;
  };

  const downloadICSFile = (filename: string) => {
    const content = generateICS();
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddAppleCalendar = () => {
    downloadICSFile('LightMS_Apple_Schedule.ics');
    addNotification(
      'Đã tải lịch cho Apple Calendar',
      'File .ics đã được tải xuống. Hãy bấm mở file để tự động thêm vào Apple Calendar trên máy của bạn!',
      'system'
    );
  };

  const handleAddGoogleCalendar = () => {
    downloadICSFile('LightMS_Google_Schedule.ics');
    addNotification(
      'Đã mở trang import Google Calendar',
      'File .ics đã được tải xuống. Trang Settings của Google Calendar sẽ mở ra để bạn Import file này.',
      'system'
    );
    window.open('https://calendar.google.com/calendar/r/settings/export', '_blank');
  };

  const monthNames = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in select-none">
      <PageHeader
        title="Lịch học"
        description="Lịch Zoom Class và các buổi Checkpoint trực tiếp từ Mentor."
        helpTitle="Schedule"
        helpSummary="Tổng quan lịch trình khoá học kèm nút tự động đồng bộ vào lịch cá nhân."
        helpPurpose="Giúp bạn không bỏ lỡ bất kỳ buổi học hay deadline quan trọng nào trong hải trình."
        action={
          <div className="flex items-center gap-3">
            <button
              onClick={handleAddGoogleCalendar}
              className="border-0 shadow-md text-xs font-black flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer transform active:scale-95 hover:brightness-105"
              style={{ backgroundColor: '#FFD94C', color: '#15333B' }}
            >
              <span className="text-base">📅</span>
              <span>Google Calendar</span>
            </button>
            <button
              onClick={handleAddAppleCalendar}
              className="border-0 shadow-md text-xs font-black flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer transform active:scale-95 hover:brightness-105"
              style={{ backgroundColor: '#214C54', color: '#FFFFFF' }}
            >
              <span className="text-base">🍎</span>
              <span>Apple Calendar</span>
            </button>
          </div>
        }
      />
      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-xl font-bold text-[#15333B]">
            Tháng {monthNames[month]}.{year}
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded bg-[#e65100] text-white hover:bg-[#cc4800] transition-colors">
              <ChevronLeft size={18} />
            </button>
            <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded bg-[#e65100] text-white hover:bg-[#cc4800] transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 border-t border-b border-gray-100 bg-gray-50/50">
          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => (
            <div key={day} className="py-3 text-center text-xs font-semibold text-gray-400">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 auto-rows-[minmax(140px,auto)]">
          {gridCells.map((cell, idx) => {
            const cellMonth = cell.isCurrentMonth ? month : (cell.date > 15 ? month - 1 : month + 1);
            const cellYear = cellMonth < 0 ? year - 1 : cellMonth > 11 ? year + 1 : year;
            const normalizedMonth = (cellMonth + 12) % 12;
            const isToday = cell.isCurrentMonth && cell.date === 19 && month === 6 && year === 2026; // Kick-off as mock today
            const events = getEventsForDate(cellYear, normalizedMonth, cell.date, cell.dayOfWeek);

            return (
              <div 
                key={idx} 
                className={`border-r border-b border-gray-100 p-2 ${
                  !cell.isCurrentMonth ? 'bg-gray-50/30' : 'bg-white'
                } ${idx % 7 === 6 ? 'border-r-0' : ''}`}
              >
                <div className="flex justify-center mb-2">
                  <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold ${
                    isToday ? 'bg-red-500 text-white' : 
                    !cell.isCurrentMonth ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {cell.date}
                  </span>
                </div>
                
                <div className="space-y-1.5 px-1">
                  {cell.isCurrentMonth && events.map((event, eIdx) => (
                    <div 
                      key={`${event.id}-${eIdx}`}
                      className={`group relative text-[10px] font-bold px-2 py-1.5 rounded-md truncate cursor-pointer transition-transform hover:scale-[1.02] ${event.colorClass}`}
                      title={event.details}
                    >
                      {event.dotColorClass ? (
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${event.dotColorClass}`}></span>
                          <span>{event.time} {event.title}</span>
                        </div>
                      ) : (
                        <span>{event.time} {event.title}</span>
                      )}

                      {/* Tooltip for detailed events */}
                      {event.details && (
                        <div className="hidden group-hover:block absolute z-50 left-full top-0 ml-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-4 animate-fade-in text-gray-800 whitespace-normal">
                          <div className="font-bold text-sm mb-1">{event.details.split('\n')[0]}</div>
                          <div className="text-sm font-semibold mb-3">{event.details.split('\n')[1]}</div>
                          
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold mb-3">
                            <CalendarIcon size={14} />
                            {event.details.split('\n')[2]}
                          </div>
                          
                          <div className="flex gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#15333B] text-white flex items-center justify-center text-sm font-bold">1</div>
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-sm font-bold text-gray-400">2</div>
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-sm font-bold text-gray-400">3</div>
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-sm font-bold text-gray-400">4</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend Footer */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mt-6 flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <p className="text-sm text-gray-700 leading-relaxed font-medium mb-4">
            Với <strong className="text-[#d94a11]">màu da cam</strong>, thì đó là ngày học trực tiếp (Kick-off, Live Class).
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="bg-[#d94a11] text-white text-[11px] font-bold px-3 py-1.5 rounded-md inline-flex items-center tracking-wide">
              20:00 KICK-OFF MEETING
            </div>
            <div className="bg-[#d94a11] text-white text-[11px] font-bold px-3 py-1.5 rounded-md inline-flex items-center tracking-wide">
              20:30 LIVE CLASS
            </div>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-700 leading-relaxed font-medium mb-4">
            Với <strong className="text-blue-600">màu xanh và các màu khác</strong>, đó là các sự kiện cộng đồng, hỗ trợ (Office Hour, Onboarding).
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="bg-purple-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-md inline-flex items-center tracking-wide">
              ONBOARDING WEEK
            </div>
            <div className="bg-blue-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-md inline-flex items-center tracking-wide">
              20:00 OFFICE HOUR
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};
