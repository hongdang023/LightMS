import React, { createContext, useContext, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Announcement, CalendarEvent, OnboardingDay, AboutContent, NotificationLog } from '../types/database';

export interface CommunityContextType {
  announcements: Announcement[];
  calendarEvents: CalendarEvent[];
  onboardingDays: OnboardingDay[];
  aboutContent: AboutContent;
  notifications: NotificationLog[];
  setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
  setCalendarEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  setOnboardingDays: React.Dispatch<React.SetStateAction<OnboardingDay[]>>;
  setAboutContent: React.Dispatch<React.SetStateAction<AboutContent>>;
  setNotifications: React.Dispatch<React.SetStateAction<NotificationLog[]>>;
  addNotification: (title: string, message: string, type?: 'telegram' | 'system') => void;
  addAnnouncement: (title: string, content: string, sendEmail: boolean, mediaUrls?: string[]) => void;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateCalendarEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteCalendarEvent: (id: string) => void;
  shiftCalendarEvents: (startDateStr: string, daysToShift: number) => void;
  updateOnboardingDay: (dayNumber: number, updates: Partial<OnboardingDay>) => void;
  updateAboutContent: (updates: Partial<AboutContent>) => void;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const CommunityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [onboardingDays, setOnboardingDays] = useState<OnboardingDay[]>([]);
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    overviewText: '',
    scheduleText: '',
    benefitsText: ''
  });

  const addNotification = (title: string, message: string, type: 'telegram' | 'system' = 'system') => {
    const newLog: NotificationLog = {
      id: `ntf-${Math.random().toString(36).substr(2, 9)}`,
      title,
      message,
      created_at: new Date().toISOString(),
      type
    };
    setNotifications(prev => [newLog, ...prev]);
  };

  const addAnnouncement = (title: string, content: string, sendEmail: boolean, mediaUrls?: string[]) => {
    const newAnn: Announcement = {
      id: `ann-${Math.random().toString(36).substr(2, 9)}`,
      title,
      content,
      created_by: 'Admin',
      send_email: sendEmail,
      created_at: new Date().toISOString(),
      media_urls: mediaUrls || []
    };

    setAnnouncements(prev => [newAnn, ...prev]);
    addNotification('Thông báo mới', `Admin vừa phát thông báo: "${title}"`, 'system');

    if (sendEmail) {
      addNotification('Gửi Email hàng loạt', `Đã gửi thông báo "${title}" tới tất cả email học viên.`, 'system');
    }

    const { isNew, ...dbAnn } = newAnn as any;
    supabase.from('announcements').insert([dbAnn]).then(({ error }) => {
      if (error) console.error('Lỗi khi lưu announcement lên Supabase:', error);
    });
  };

  const updateAnnouncement = (id: string, updates: Partial<Announcement>) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    addNotification('Cập nhật thông báo', 'Nội dung thông báo đã được chỉnh sửa', 'system');
    const { isNew, ...dbUpdates } = updates as any;
    supabase.from('announcements').update(dbUpdates).eq('id', id).then(({ error }) => {
      if (error) console.error('Lỗi khi cập nhật announcement trên Supabase:', error);
    });
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    addNotification('Xóa thông báo', 'Đã xóa 1 thông báo khỏi hệ thống', 'system');
    supabase.from('announcements').delete().eq('id', id).then(({ error }) => {
      if (error) console.error('Lỗi khi xóa announcement trên Supabase:', error);
    });
  };

  const addCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `cal-${Math.random().toString(36).substr(2, 9)}`
    };
    setCalendarEvents(prev => [...prev, newEvent]);
    addNotification('Lịch học mới', `Đã thêm sự kiện "${event.title}" vào lịch`, 'system');
    supabase.from('calendar_events').insert([newEvent]).then(({ error }) => {
      if (error) console.error('Lỗi khi lưu calendar event lên Supabase:', error);
    });
  };

  const updateCalendarEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setCalendarEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    addNotification('Cập nhật lịch học', 'Thông tin sự kiện lịch đã được cập nhật', 'system');
    supabase.from('calendar_events').update(updates).eq('id', id).then(({ error }) => {
      if (error) console.error('Lỗi khi cập nhật calendar event trên Supabase:', error);
    });
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents(prev => prev.filter(e => e.id !== id));
    addNotification('Xóa sự kiện lịch', 'Đã xóa sự kiện khỏi lịch học', 'system');
    supabase.from('calendar_events').delete().eq('id', id).then(({ error }) => {
      if (error) console.error('Lỗi khi xóa calendar event trên Supabase:', error);
    });
  };

  const shiftCalendarEvents = (startDateStr: string, daysToShift: number) => {
    const targetDate = new Date(startDateStr);
    setCalendarEvents(prev => prev.map(evt => {
      if (evt.date !== undefined && evt.month !== undefined && evt.year !== undefined) {
        const evtDate = new Date(evt.year, evt.month, evt.date);
        if (evtDate >= targetDate) {
          evtDate.setDate(evtDate.getDate() + daysToShift);
          const updated = {
            ...evt,
            date: evtDate.getDate(),
            month: evtDate.getMonth(),
            year: evtDate.getFullYear()
          };
          supabase.from('calendar_events').update({
            date: updated.date,
            month: updated.month,
            year: updated.year
          }).eq('id', evt.id).then(({ error }) => {
            if (error) console.error('Lỗi khi dời lịch sự kiện trên Supabase:', error);
          });
          return updated;
        }
      }
      return evt;
    }));
  };

  const updateOnboardingDay = (dayNumber: number, updates: Partial<OnboardingDay>) => {
    setOnboardingDays(prev => prev.map(d => d.day === dayNumber ? { ...d, ...updates } : d));
    addNotification('Cập nhật Onboarding', `Đã cập nhật nội dung Ngày ${dayNumber}`, 'system');
    supabase.from('onboarding_days').update(updates).eq('day', dayNumber).then(({ error }) => {
      if (error) console.error('Lỗi khi cập nhật onboarding_days trên Supabase:', error);
    });
  };

  const updateAboutContent = (updates: Partial<AboutContent>) => {
    const updated = { ...aboutContent, ...updates };
    setAboutContent(updated);
    addNotification('Cập nhật Giới thiệu', 'Thông tin trang About đã được cập nhật', 'system');
    supabase.from('about_content').update({
      overview_text: updated.overviewText,
      schedule_text: updated.scheduleText,
      benefits_text: updated.benefitsText
    }).eq('id', 'default').then(({ error }) => {
      if (error) console.error('Lỗi khi cập nhật about_content trên Supabase:', error);
    });
  };

  return (
    <CommunityContext.Provider value={{
      announcements,
      calendarEvents,
      onboardingDays,
      aboutContent,
      notifications,
      setAnnouncements,
      setCalendarEvents,
      setOnboardingDays,
      setAboutContent,
      setNotifications,
      addNotification,
      addAnnouncement,
      updateAnnouncement,
      deleteAnnouncement,
      addCalendarEvent,
      updateCalendarEvent,
      deleteCalendarEvent,
      shiftCalendarEvents,
      updateOnboardingDay,
      updateAboutContent
    }}>
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) throw new Error('useCommunity must be used within a CommunityProvider');
  return context;
};
