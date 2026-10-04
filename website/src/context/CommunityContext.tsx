import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { CalendarEvent, OnboardingDay, AboutContent, NotificationLog, HelpDeskFaq } from '../types/database';
import { useCourse } from './CourseContext';
import { DEFAULT_OBSIDIAN_CALENDAR_EVENTS, DEFAULT_OBSIDIAN_ONBOARDING_DAYS } from '../data/seedCourses';
import { VIBE_201_CALENDAR_EVENTS } from '../data/vibeCalendarEvents';
import { VIBE_7DAY_ONBOARDING_DAYS } from '../data/vibeOnboardingDays';
import {
  DEFAULT_OBSIDIAN_ABOUT_CONTENT,
  DEFAULT_VIBE_ABOUT_CONTENT
} from '../data/aboutViewData';

import { d1ApiService } from '../services/d1ApiService';

const STORAGE_FAQS_KEY = 'lightms_help_desk_faqs';

export interface CommunityContextType {
  calendarEvents: CalendarEvent[];
  onboardingDays: OnboardingDay[];
  aboutContent: AboutContent;
  helpDeskFaqs: HelpDeskFaq[];
  notifications: NotificationLog[];
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

  const getCalendarEventsForBatch = useCallback((batchId: string, isVibe: boolean): CalendarEvent[] => {
    try {
      const saved = localStorage.getItem(`lightms_calendar_events_${batchId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return isVibe ? VIBE_201_CALENDAR_EVENTS : DEFAULT_OBSIDIAN_CALENDAR_EVENTS;
  }, []);

  const getOnboardingDaysForCourse = useCallback((courseKey: string, isVibe: boolean): OnboardingDay[] => {
    try {
      const saved = localStorage.getItem(`lightms_onboarding_days_${courseKey}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        // If cached data contains outdated/fabricated day titles or old companion hints, discard cache
        const isStale = Array.isArray(parsed) && parsed.some((d: any) => 
          typeof d.title === 'string' && (d.title.includes('Cloudflare') || d.title.includes('Mindset & Thiết lập')) ||
          (typeof d.companionHint === 'string' && (d.companionHint.includes('Tri thức chỉ có giá trị') || d.companionHint.includes('Ghi nhớ nhỏ: Bạn không cần')))
        );
        if (Array.isArray(parsed) && parsed.length > 0 && !isStale) return parsed;
      }
    } catch {
      // fallback
    }
    return isVibe ? VIBE_7DAY_ONBOARDING_DAYS : DEFAULT_OBSIDIAN_ONBOARDING_DAYS;
  }, []);

  const getAboutContentForCourse = useCallback((courseKey: string, isVibe: boolean): AboutContent => {
    try {
      const saved = localStorage.getItem(`lightms_about_content_${courseKey}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        // If cached data contains outdated/fabricated about content, discard cache
        const isStale = parsed && (
          (parsed.quote && parsed.quote.includes('AI Codes')) ||
          (parsed.truCot1?.title && parsed.truCot1.title.includes('Product Builder'))
        );
        if (parsed && typeof parsed === 'object' && (parsed.quote || parsed.gachDauDong) && !isStale) return parsed;
      }
    } catch {
      // fallback
    }
    return isVibe ? DEFAULT_VIBE_ABOUT_CONTENT : DEFAULT_OBSIDIAN_ABOUT_CONTENT;
  }, []);

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    return getCalendarEventsForBatch(currentBatchKey, isVibeCourse);
  });

  const [onboardingDays, setOnboardingDays] = useState<OnboardingDay[]>(() => {
    return getOnboardingDaysForCourse(currentCourseKey, isVibeCourse);
  });

  const [aboutContent, setAboutContent] = useState<AboutContent>(() => {
    return getAboutContentForCourse(currentCourseKey, isVibeCourse);
  });

  // Automatically sync calendar, onboarding, and about content when course or batch changes (D1 first, fallback local)
  useEffect(() => {
    let isCancelled = false;

    // Fetch from D1 Database
    d1ApiService.getOnboardingDays(currentCourseKey).then(d1Days => {
      if (!isCancelled && d1Days && d1Days.length > 0) {
        setOnboardingDays(d1Days);
        localStorage.setItem(`lightms_onboarding_days_${currentCourseKey}`, JSON.stringify(d1Days));
      } else if (!isCancelled) {
        setOnboardingDays(getOnboardingDaysForCourse(currentCourseKey, isVibeCourse));
      }
    });

    d1ApiService.getCalendarEvents(currentBatchKey).then(d1Events => {
      if (!isCancelled && d1Events && d1Events.length > 0) {
        setCalendarEvents(d1Events);
        localStorage.setItem(`lightms_calendar_events_${currentBatchKey}`, JSON.stringify(d1Events));
      } else if (!isCancelled) {
        setCalendarEvents(getCalendarEventsForBatch(currentBatchKey, isVibeCourse));
      }
    });

    setAboutContent(getAboutContentForCourse(currentCourseKey, isVibeCourse));

    return () => {
      isCancelled = true;
    };
  }, [currentBatchKey, currentCourseKey, isVibeCourse, getCalendarEventsForBatch, getOnboardingDaysForCourse, getAboutContentForCourse]);

  const [helpDeskFaqs, setHelpDeskFaqs] = useState<HelpDeskFaq[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_FAQS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

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
    setCalendarEvents(prev => {
      const next = [...prev, newEvent];
      localStorage.setItem(`lightms_calendar_events_${currentBatchKey}`, JSON.stringify(next));
      return next;
    });
    // Async persist to D1
    d1ApiService.createCalendarEvent(newEvent).catch(err => console.warn('D1 createCalendarEvent error:', err));
    addNotification('Lịch học mới', `Đã thêm sự kiện "${event.title}" vào lịch`, 'system');
  };

  const updateCalendarEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setCalendarEvents(prev => {
      const next = prev.map(e => e.id === id ? { ...e, ...updates } : e);
      localStorage.setItem(`lightms_calendar_events_${currentBatchKey}`, JSON.stringify(next));
      return next;
    });
    // Async persist to D1
    d1ApiService.updateCalendarEvent(id, updates).catch(err => console.warn('D1 updateCalendarEvent error:', err));
    addNotification('Cập nhật lịch học', 'Thông tin sự kiện lịch đã được cập nhật', 'system');
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents(prev => {
      const next = prev.filter(e => e.id !== id);
      localStorage.setItem(`lightms_calendar_events_${currentBatchKey}`, JSON.stringify(next));
      return next;
    });
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
      localStorage.setItem(`lightms_calendar_events_${currentBatchKey}`, JSON.stringify(next));
      return next;
    });
  };

  const updateOnboardingDay = (dayNumber: number, updates: Partial<OnboardingDay>) => {
    setOnboardingDays(prev => {
      const next = prev.map(d => d.day === dayNumber ? { ...d, ...updates } : d);
      localStorage.setItem(`lightms_onboarding_days_${currentCourseKey}`, JSON.stringify(next));
      return next;
    });
    // Async persist directly to Cloudflare D1 Database!
    d1ApiService.saveOnboardingDay(currentCourseKey, dayNumber, updates).catch(err => {
      console.warn('[CommunityContext] D1 saveOnboardingDay error:', err);
    });
    addNotification('Cập nhật Onboarding', `Đã lưu nội dung Ngày ${dayNumber} vào D1`, 'system');
  };

  const updateAboutContent = (updates: Partial<AboutContent>) => {
    setAboutContent(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem(`lightms_about_content_${currentCourseKey}`, JSON.stringify(updated));
      return updated;
    });
    addNotification('Cập nhật Giới thiệu', 'Thông tin trang About đã được cập nhật', 'system');
  };

  // ── Help Desk FAQ CRUD ─────────────────────────────────────────────────────
  const addHelpDeskFaq = (faq: Omit<HelpDeskFaq, 'order_index'>) => {
    const newFaq: HelpDeskFaq = {
      ...faq,
      order_index: helpDeskFaqs.length + 1,
    };
    setHelpDeskFaqs(prev => {
      const next = [...prev, newFaq];
      localStorage.setItem(STORAGE_FAQS_KEY, JSON.stringify(next));
      return next;
    });
    addNotification('FAQ mới', `Đã thêm câu hỏi: "${faq.question}"`, 'system');
  };

  const updateHelpDeskFaq = (id: string, updates: Partial<HelpDeskFaq>) => {
    setHelpDeskFaqs(prev => {
      const next = prev.map(f => f.id === id ? { ...f, ...updates } : f);
      localStorage.setItem(STORAGE_FAQS_KEY, JSON.stringify(next));
      return next;
    });
    addNotification('Cập nhật FAQ', 'Nội dung câu hỏi đã được chỉnh sửa', 'system');
  };

  const deleteHelpDeskFaq = (id: string) => {
    setHelpDeskFaqs(prev => {
      const next = prev.filter(f => f.id !== id);
      localStorage.setItem(STORAGE_FAQS_KEY, JSON.stringify(next));
      return next;
    });
    addNotification('Xóa FAQ', 'Đã xóa câu hỏi khỏi hệ thống', 'system');
  };

  return (
    <CommunityContext.Provider value={{
      calendarEvents,
      onboardingDays,
      aboutContent,
      helpDeskFaqs,
      notifications,
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
