import type { Announcement, Profile, Lesson, CalendarEvent } from '../types/database';

/**
 * Generates an auto announcement for Leaderboard top performers if not already announced today
 */
export function checkLeaderboardAutoAnnouncements(
  profiles: Profile[],
  existingAnnouncements: Announcement[]
): Announcement[] {
  if (!profiles || profiles.length === 0) return [];

  // Sort top profiles by nautical miles
  const sortedProfiles = [...profiles].sort((a, b) => (b.nautical_miles || 0) - (a.nautical_miles || 0));
  const top1 = sortedProfiles[0];
  if (!top1 || (top1.nautical_miles || 0) <= 0) return [];

  const todayStr = new Date().toISOString().split('T')[0];
  const targetId = `leaderboard-top1-${top1.id}-${todayStr}`;

  // Check if already created today for this top1 student
  const exists = existingAnnouncements.some(a => a.target_id === targetId || (a.category === 'leaderboard' && a.content.includes(top1.full_name) && a.created_at.startsWith(todayStr)));

  if (exists) return [];

  const newAnnouncement: Announcement = {
    id: `auto-lb-${Date.now()}`,
    title: `🏆 ${top1.full_name} xuất sắc vươn lên Dẫn Đầu Leaderboard!`,
    content: `Chúc mừng ${top1.full_name} đã đạt vị trí Hạng 1 trên Bảng Vàng Leaderboard với tổng cộng ${top1.nautical_miles} Hải Lý! 🚀\nCùng tiếp tục giữ vững phong độ và lan tỏa tinh thần học tập nhiệt huyết đến cả lớp nhé!`,
    created_by: 'Hệ thống LightMS',
    send_email: false,
    created_at: new Date().toISOString(),
    isNew: true,
    category: 'leaderboard',
    is_auto: true,
    target_id: targetId
  };

  return [newAnnouncement];
}

/**
 * Creates an announcement when materials or lessons are updated by Admin
 */
export function createContentUpdateAnnouncement(
  lesson: Lesson,
  batchName?: string
): Announcement {
  return {
    id: `auto-content-${Date.now()}`,
    title: `📚 Tài liệu & Bài giảng mới: ${lesson.title}`,
    content: `Đội ngũ Giảng dạy vừa cập nhật đầy đủ slide, tài liệu tham khảo và nội dung cho bài học "${lesson.title}"${batchName ? ` (Lớp ${batchName})` : ''}.\nHọc viên hãy truy cập mục Bài học để xem chi tiết và chuẩn bị cho buổi học nhé! ⚓`,
    created_by: 'Ban Quản Lý Lớp Học',
    send_email: false,
    created_at: new Date().toISOString(),
    isNew: true,
    category: 'content_update',
    is_auto: true,
    target_id: `content-update-${lesson.id}-${Date.now()}`
  };
}

/**
 * Checks upcoming schedule events and creates reminders
 */
export function checkScheduleAutoAnnouncements(
  calendarEvents: CalendarEvent[],
  existingAnnouncements: Announcement[]
): Announcement[] {
  if (!calendarEvents || calendarEvents.length === 0) return [];

  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-12
  const currentDay = now.getDate();
  const currentYear = now.getFullYear();

  // Find today's class/live-class events
  const todaysEvents = calendarEvents.filter(ev => {
    if (ev.year && ev.year !== currentYear) return false;
    if (ev.month && ev.month !== currentMonth) return false;
    if (ev.date && ev.date !== currentDay) return false;
    return true;
  });

  const newAnnouncements: Announcement[] = [];

  todaysEvents.forEach(ev => {
    const targetId = `schedule-reminder-${ev.id}-${currentYear}-${currentMonth}-${currentDay}`;
    const exists = existingAnnouncements.some(a => a.target_id === targetId);

    if (!exists) {
      newAnnouncements.push({
        id: `auto-sched-${Date.now()}-${ev.id}`,
        title: `⏰ Nhắc lịch: ${ev.title} (${ev.time || 'Hôm nay'})`,
        content: `Sự kiện "${ev.title}" sẽ diễn ra vào hôm nay (${ev.time || 'giờ học quy định'}).\n${ev.details ? `Chi tiết: ${ev.details}\n` : ''}Hãy sắp xếp thời gian vào lớp đúng giờ để không bỏ lỡ kiến thức quan trọng!`,
        created_by: 'Hệ Thống Lịch Học',
        send_email: false,
        created_at: new Date().toISOString(),
        isNew: true,
        category: 'schedule',
        is_auto: true,
        target_id: targetId
      });
    }
  });

  return newAnnouncements;
}
