import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { CalendarEvent, OnboardingDay, AboutContent, NotificationLog, HelpDeskFaq } from '../types/database';
import { useCourse } from './CourseContext';
import {
  DEFAULT_OBSIDIAN_ABOUT_CONTENT,
  DEFAULT_VIBE_ABOUT_CONTENT
} from '../data/aboutViewData';
import { DEFAULT_HELP_DESK_FAQS } from '../data/helpDeskData';

import { d1ApiService } from '../services/d1ApiService';

export interface CommunityContextType {
  calendarEvents: CalendarEvent[];
  onboardingDays: OnboardingDay[];
  aboutContent: AboutContent;
  helpDeskFaqs: HelpDeskFaq[];
  notifications: NotificationLog[];
  isOnboardingLoading: boolean;
  isCalendarLoading: boolean;
  setCalendarEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  setOnboardingDays: React.Dispatch<React.SetStateAction<OnboardingDay[]>>;
  setAboutContent: React.Dispatch<React.SetStateAction<AboutContent>>;
  setHelpDeskFaqs: React.Dispatch<React.SetStateAction<HelpDeskFaq[]>>;
  setNotifications: React.Dispatch<React.SetStateAction<NotificationLog[]>>;
  addNotification: (title: string, message: string, type?: 'telegram' | 'system') => void;
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
  const { activeCourse, activeBatch } = useCourse();

  const isVibeCourse = useMemo(() => {
    return (
      activeCourse?.slug === 'vibe-coding-201' ||
      activeCourse?.id === 'course-vibe-201' ||
      activeCourse?.id === '3f26048a-6689-400e-99fc-e0499161d934'
    );
  }, [activeCourse]);

  const currentBatchKey = useMemo(() => {
    if (activeBatch?.id) return activeBatch.id;
    return isVibeCourse ? 'batch-vibe201-k2' : 'batch-obs101-k1';
  }, [activeBatch?.id, isVibeCourse]);

  const currentCourseKey = useMemo(() => {
    if (activeCourse?.id) return activeCourse.id;
    return isVibeCourse ? 'course-vibe-201' : 'course-obsidian-101';
  }, [activeCourse?.id, isVibeCourse]);

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [onboardingDays, setOnboardingDays] = useState<OnboardingDay[]>([]);
  const [isOnboardingLoading, setIsOnboardingLoading] = useState<boolean>(true);
  const [isCalendarLoading, setIsCalendarLoading] = useState<boolean>(true);

  const [aboutContent, setAboutContent] = useState<AboutContent>(() => {
    return isVibeCourse ? DEFAULT_VIBE_ABOUT_CONTENT : DEFAULT_OBSIDIAN_ABOUT_CONTENT;
  });

  // Automatically sync calendar, onboarding, and about content directly from D1 (Single Source of Truth)
  useEffect(() => {
    let isCancelled = false;
    setIsOnboardingLoading(true);
    setIsCalendarLoading(true);

    // 1. Fetch Onboarding Days from D1
    d1ApiService.getOnboardingDays(currentCourseKey)
      .then(d1Days => {
        if (!isCancelled && d1Days && Array.isArray(d1Days)) {
          setOnboardingDays(d1Days);
        }
      })
      .catch(err => {
        console.warn('[CommunityContext] D1 getOnboardingDays error:', err);
      })
      .finally(() => {
        if (!isCancelled) setIsOnboardingLoading(false);
      });

    // 2. Fetch Calendar Events from D1
    d1ApiService.getCalendarEvents(currentBatchKey)
      .then(d1Events => {
        if (!isCancelled && d1Events && Array.isArray(d1Events)) {
          setCalendarEvents(d1Events);
        }
      })
      .catch(err => {
        console.warn('[CommunityContext] D1 getCalendarEvents error:', err);
      })
      .finally(() => {
        if (!isCancelled) setIsCalendarLoading(false);
      });

    setAboutContent(isVibeCourse ? DEFAULT_VIBE_ABOUT_CONTENT : DEFAULT_OBSIDIAN_ABOUT_CONTENT);

    return () => {
      isCancelled = true;
    };
  }, [currentBatchKey, currentCourseKey, isVibeCourse]);

  const [helpDeskFaqs, setHelpDeskFaqs] = useState<HelpDeskFaq[]>(DEFAULT_HELP_DESK_FAQS);

  const [notifications, setNotifications] = useState<NotificationLog[]>([]);

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

  const addCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const tempId = crypto.randomUUID();
    const newEvent: CalendarEvent = {
      ...event,
      id: tempId,
      batch_id: currentBatchKey,
      course_id: currentCourseKey,
    };
    setCalendarEvents(prev => [...prev, newEvent]);
    // Async persist to D1
    d1ApiService.createCalendarEvent(newEvent).catch(err => console.warn('D1 createCalendarEvent error:', err));
    addNotification('Lịch học mới', `Đã thêm sự kiện "${event.title}" vào lịch`, 'system');
  };

  const updateCalendarEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setCalendarEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    // Async persist to D1
    d1ApiService.updateCalendarEvent(id, updates).catch(err => console.warn('D1 updateCalendarEvent error:', err));
    addNotification('Cập nhật lịch học', 'Thông tin sự kiện lịch đã được cập nhật', 'system');
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents(prev => prev.filter(e => e.id !== id));
    // Async persist to D1
    d1ApiService.deleteCalendarEvent(id).catch(err => console.warn('D1 deleteCalendarEvent error:', err));
    addNotification('Xóa sự kiện lịch', 'Đã xóa sự kiện khỏi lịch học', 'system');
  };

  const shiftCalendarEvents = (startDateStr: string, daysToShift: number) => {
    const targetDate = new Date(startDateStr);
    setCalendarEvents(prev => {
      const next = prev.map(evt => {
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
            d1ApiService.updateCalendarEvent(evt.id, updated).catch(() => {});
            return updated;
          }
        }
        return evt;
      });
      return next;
    });
  };

  const updateOnboardingDay = (dayNumber: number, updates: Partial<OnboardingDay>) => {
    setOnboardingDays(prev => prev.map(d => d.day === dayNumber ? { ...d, ...updates } : d));
    // Async persist directly to Cloudflare D1 Database!
    d1ApiService.saveOnboardingDay(currentCourseKey, dayNumber, updates).catch(err => {
      console.warn('[CommunityContext] D1 saveOnboardingDay error:', err);
    });
    addNotification('Cập nhật Onboarding', `Đã lưu nội dung Ngày ${dayNumber} vào D1`, 'system');
  };

  const updateAboutContent = (updates: Partial<AboutContent>) => {
    setAboutContent(prev => ({ ...prev, ...updates }));
    addNotification('Cập nhật Giới thiệu', 'Thông tin trang About đã được cập nhật', 'system');
  };

  // ── Help Desk FAQ CRUD ─────────────────────────────────────────────────────
  const addHelpDeskFaq = (faq: Omit<HelpDeskFaq, 'order_index'>) => {
    const newFaq: HelpDeskFaq = {
      ...faq,
      order_index: helpDeskFaqs.length + 1,
    };
    setHelpDeskFaqs(prev => [...prev, newFaq]);
    addNotification('FAQ mới', `Đã thêm câu hỏi: "${faq.question}"`, 'system');
  };

  const updateHelpDeskFaq = (id: string, updates: Partial<HelpDeskFaq>) => {
    setHelpDeskFaqs(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    addNotification('Cập nhật FAQ', 'Nội dung câu hỏi đã được chỉnh sửa', 'system');
  };

  const deleteHelpDeskFaq = (id: string) => {
    setHelpDeskFaqs(prev => prev.filter(f => f.id !== id));
    addNotification('Xóa FAQ', 'Đã xóa câu hỏi khỏi hệ thống', 'system');
  };

  return (
    <CommunityContext.Provider value={{
      calendarEvents,
      onboardingDays,
      aboutContent,
      helpDeskFaqs,
      notifications,
      isOnboardingLoading,
      isCalendarLoading,
      setCalendarEvents,
      setOnboardingDays,
      setAboutContent,
      setHelpDeskFaqs,
      setNotifications,
      addNotification,
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
