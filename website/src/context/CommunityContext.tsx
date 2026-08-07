import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Announcement, CalendarEvent, OnboardingDay, AboutContent, NotificationLog, HelpDeskFaq } from '../types/database';

export interface CommunityContextType {
  announcements: Announcement[];
  calendarEvents: CalendarEvent[];
  onboardingDays: OnboardingDay[];
  aboutContent: AboutContent;
  helpDeskFaqs: HelpDeskFaq[];
  notifications: NotificationLog[];
  setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
  setCalendarEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  setOnboardingDays: React.Dispatch<React.SetStateAction<OnboardingDay[]>>;
  setAboutContent: React.Dispatch<React.SetStateAction<AboutContent>>;
  setHelpDeskFaqs: React.Dispatch<React.SetStateAction<HelpDeskFaq[]>>;
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
  updateHelpDeskFaq: (id: string, updates: Partial<HelpDeskFaq>) => void;
  addHelpDeskFaq: (faq: Omit<HelpDeskFaq, 'order_index'>) => void;
  deleteHelpDeskFaq: (id: string) => void;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const CommunityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [onboardingDays, setOnboardingDays] = useState<OnboardingDay[]>([]);
  const [helpDeskFaqs, setHelpDeskFaqs] = useState<HelpDeskFaq[]>([]);
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    overviewText: '',
    scheduleText: '',
    benefitsText: ''
  });

  // ── Initial data fetch from Supabase ──────────────────────────────────────
  useEffect(() => {
    const loadCommunityData = async () => {
      const [
        { data: announcementsData, error: annErr },
        { data: calendarData, error: calErr },
        { data: onboardingData, error: onbErr },
        { data: aboutData, error: abtErr },
        { data: faqsData, error: faqErr },
      ] = await Promise.all([
        supabase.from('announcements').select('*').order('created_at', { ascending: false }),
        supabase.from('calendar_events').select('*'),
        supabase.from('onboarding_days').select('*').order('day', { ascending: true }),
        supabase.from('about_content').select('*').eq('id', 'default').single(),
        supabase.from('help_desk_faqs').select('*').order('order_index', { ascending: true }),
      ]);

      if (annErr) console.error('Lỗi announcements:', annErr);
      if (calErr) console.error('Lỗi calendar_events:', calErr);
      if (onbErr) console.error('Lỗi onboarding_days:', onbErr);
      if (abtErr) console.error('Lỗi about_content:', abtErr);
      if (faqErr) console.error('Lỗi help_desk_faqs:', faqErr);

      if (announcementsData) setAnnouncements(announcementsData);
      if (calendarData) {
        const mapped = calendarData.map((e: any) => ({
          id: e.id,
          title: e.title,
          time: e.time,
          endTime: e.end_time,
          allDay: e.all_day,
          date: e.date,
          month: e.month,
          year: e.year,
          dayOfWeek: e.day_of_week,
          startRecur: e.start_recur ? Number(e.start_recur) : undefined,
          endRecur: e.end_recur ? Number(e.end_recur) : undefined,
          colorClass: e.color_class,
          dotColorClass: e.dot_color_class,
          type: e.type,
          eventType: e.event_type,
          details: e.details
        }));
        setCalendarEvents(mapped);
      }
      if (onboardingData) setOnboardingDays(onboardingData);
      if (faqsData) setHelpDeskFaqs(faqsData);
      if (aboutData) {
        setAboutContent({
          overviewText: aboutData.overview_text ?? '',
          scheduleText: aboutData.schedule_text ?? '',
          benefitsText: aboutData.benefits_text ?? '',
          videoUrl: aboutData.video_url ?? undefined,
          platformButtons: aboutData.platform_buttons ?? undefined,
          benefitClubs: aboutData.benefit_clubs ?? undefined,
          quote: aboutData.quote ?? undefined,
          gachDauDong: aboutData.gach_dau_dong ?? undefined,
          truCot1: aboutData.tru_cot_1 ?? undefined,
          truCot2: aboutData.tru_cot_2 ?? undefined,
          truCot3: aboutData.tru_cot_3 ?? undefined,
          outro: aboutData.outro ?? undefined,
          sdtNote: aboutData.sdt_note ?? undefined,
          officeHourDesc: aboutData.office_hour_desc ?? undefined,
          luuYGold: aboutData.luu_y_gold ?? undefined,
        });
      }
    };

    loadCommunityData();
  }, []);

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
    
    const dbEvent = {
      id: newEvent.id,
      title: newEvent.title,
      time: newEvent.time,
      end_time: newEvent.endTime,
      all_day: newEvent.allDay,
      date: newEvent.date,
      month: newEvent.month,
      year: newEvent.year,
      day_of_week: newEvent.dayOfWeek,
      start_recur: newEvent.startRecur,
      end_recur: newEvent.endRecur,
      color_class: newEvent.colorClass,
      dot_color_class: newEvent.dotColorClass,
      type: newEvent.type,
      event_type: newEvent.eventType,
      details: newEvent.details
    };

    supabase.from('calendar_events').insert([dbEvent]).then(({ error }) => {
      if (error) console.error('Lỗi khi lưu calendar event lên Supabase:', error);
    });
  };

  const updateCalendarEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setCalendarEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    addNotification('Cập nhật lịch học', 'Thông tin sự kiện lịch đã được cập nhật', 'system');
    
    const dbUpdates: any = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.time !== undefined) dbUpdates.time = updates.time;
    if (updates.endTime !== undefined) dbUpdates.end_time = updates.endTime;
    if (updates.allDay !== undefined) dbUpdates.all_day = updates.allDay;
    if (updates.date !== undefined) dbUpdates.date = updates.date;
    if (updates.month !== undefined) dbUpdates.month = updates.month;
    if (updates.year !== undefined) dbUpdates.year = updates.year;
    if (updates.dayOfWeek !== undefined) dbUpdates.day_of_week = updates.dayOfWeek;
    if (updates.startRecur !== undefined) dbUpdates.start_recur = updates.startRecur;
    if (updates.endRecur !== undefined) dbUpdates.end_recur = updates.endRecur;
    if (updates.colorClass !== undefined) dbUpdates.color_class = updates.colorClass;
    if (updates.dotColorClass !== undefined) dbUpdates.dot_color_class = updates.dotColorClass;
    if (updates.type !== undefined) dbUpdates.type = updates.type;
    if (updates.eventType !== undefined) dbUpdates.event_type = updates.eventType;
    if (updates.details !== undefined) dbUpdates.details = updates.details;

    supabase.from('calendar_events').update(dbUpdates).eq('id', id).then(({ error }) => {
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
      benefits_text: updated.benefitsText,
      video_url: updated.videoUrl,
      platform_buttons: updated.platformButtons,
      benefit_clubs: updated.benefitClubs,
      quote: updated.quote,
      gach_dau_dong: updated.gachDauDong,
      tru_cot_1: updated.truCot1,
      tru_cot_2: updated.truCot2,
      tru_cot_3: updated.truCot3,
      outro: updated.outro,
      sdt_note: updated.sdtNote,
      office_hour_desc: updated.officeHourDesc,
      luu_y_gold: updated.luuYGold,
    }).eq('id', 'default').then(({ error }) => {
      if (error) console.error('Lỗi khi cập nhật about_content trên Supabase:', error);
    });
  };

  // ── Help Desk FAQ CRUD ─────────────────────────────────────────────────────
  const addHelpDeskFaq = (faq: Omit<HelpDeskFaq, 'order_index'>) => {
    const newFaq: HelpDeskFaq = {
      ...faq,
      order_index: helpDeskFaqs.length + 1,
    };
    setHelpDeskFaqs(prev => [...prev, newFaq]);
    addNotification('FAQ mới', `Đã thêm câu hỏi: "${faq.question}"`, 'system');
    supabase.from('help_desk_faqs').insert([newFaq]).then(({ error }) => {
      if (error) console.error('Lỗi khi thêm FAQ lên Supabase:', error);
    });
  };

  const updateHelpDeskFaq = (id: string, updates: Partial<HelpDeskFaq>) => {
    setHelpDeskFaqs(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    addNotification('Cập nhật FAQ', 'Nội dung câu hỏi đã được chỉnh sửa', 'system');
    supabase.from('help_desk_faqs').update(updates).eq('id', id).then(({ error }) => {
      if (error) console.error('Lỗi khi cập nhật FAQ trên Supabase:', error);
    });
  };

  const deleteHelpDeskFaq = (id: string) => {
    setHelpDeskFaqs(prev => prev.filter(f => f.id !== id));
    addNotification('Xóa FAQ', 'Đã xóa câu hỏi khỏi hệ thống', 'system');
    supabase.from('help_desk_faqs').delete().eq('id', id).then(({ error }) => {
      if (error) console.error('Lỗi khi xóa FAQ trên Supabase:', error);
    });
  };

  return (
    <CommunityContext.Provider value={{
      announcements,
      calendarEvents,
      onboardingDays,
      aboutContent,
      helpDeskFaqs,
      notifications,
      setAnnouncements,
      setCalendarEvents,
      setOnboardingDays,
      setAboutContent,
      setHelpDeskFaqs,
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
      updateAboutContent,
      addHelpDeskFaq,
      updateHelpDeskFaq,
      deleteHelpDeskFaq,
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
