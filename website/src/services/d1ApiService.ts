// D1 API Client & Synchronization Service for LightMS
import type { OnboardingDay, CalendarEvent, Course, Batch, Profile } from '../types/database';

const API_BASE = '/api';

class D1ApiService {
  // ── ONBOARDING DAYS ──────────────────────────────────────────────────────────
  async getOnboardingDays(courseId: string): Promise<OnboardingDay[] | null> {
    try {
      const res = await fetch(`${API_BASE}/onboarding?courseId=${encodeURIComponent(courseId)}`);
      if (!res.ok) return null;
      const data = (await res.json()) as any;
      if (data && data.success && Array.isArray(data.onboardingDays) && data.onboardingDays.length > 0) {
        return data.onboardingDays.map((d: any) => ({
          id: d.id,
          day: d.day,
          course_id: d.courseId || d.course_id,
          batch_id: d.batchId || d.batch_id,
          title: d.title,
          intro: d.intro || '',
          objective: d.objective || '',
          checklist: d.checklist || '',
          takeaway: d.takeaway || '',
          emailSubject: d.emailSubject || d.email_subject || '',
          emailBody: d.emailBody || d.email_body || '',
          companionHint: d.companionHint || d.companion_hint || '',
          bonusResources: d.bonusResources || d.bonus_resources || '',
        }));
      }
    } catch (e) {
      console.warn('[D1ApiService] Failed to fetch onboarding days from D1:', e);
    }
    return null;
  }

  async saveOnboardingDay(courseId: string, dayNumber: number, updates: Partial<OnboardingDay>): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/onboarding`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          day: dayNumber,
          ...updates,
        }),
      });
      return res.ok;
    } catch (e) {
      console.warn('[D1ApiService] Failed to persist onboarding day to D1:', e);
      return false;
    }
  }

  // ── CALENDAR EVENTS ──────────────────────────────────────────────────────────
  async getCalendarEvents(batchId: string): Promise<CalendarEvent[] | null> {
    try {
      const res = await fetch(`${API_BASE}/calendar?batchId=${encodeURIComponent(batchId)}`);
      if (!res.ok) return null;
      const data = (await res.json()) as any;
      if (data && data.success && Array.isArray(data.events)) {
        return data.events.map((e: any) => ({
          id: e.id,
          batch_id: e.batchId || e.batch_id,
          title: e.title,
          event_type: e.eventType || e.event_type,
          start_time: e.startTime || e.start_time,
          end_time: e.endTime || e.end_time,
          meeting_url: e.meetingUrl || e.meeting_url || '',
          description: e.description || '',
        }));
      }
    } catch (e) {
      console.warn('[D1ApiService] Failed to fetch calendar events from D1:', e);
    }
    return null;
  }

  async createCalendarEvent(event: Omit<CalendarEvent, 'id'>): Promise<string | null> {
    try {
      const res = await fetch(`${API_BASE}/calendar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
      if (res.ok) {
        const data = (await res.json()) as any;
        return data?.eventId || null;
      }
    } catch (e) {
      console.warn('[D1ApiService] Failed to create calendar event in D1:', e);
    }
    return null;
  }

  async updateCalendarEvent(id: string, updates: Partial<CalendarEvent>): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/calendar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      return res.ok;
    } catch (e) {
      console.warn('[D1ApiService] Failed to update calendar event in D1:', e);
      return false;
    }
  }

  async deleteCalendarEvent(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/calendar?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch (e) {
      console.warn('[D1ApiService] Failed to delete calendar event in D1:', e);
      return false;
    }
  }

  // ── COURSES & BATCHES ────────────────────────────────────────────────────────
  async getCourses(): Promise<Course[] | null> {
    try {
      const res = await fetch(`${API_BASE}/courses`);
      if (!res.ok) return null;
      const data = (await res.json()) as any;
      if (data && data.success && Array.isArray(data.courses)) {
        return data.courses.map((c: any) => ({
          id: c.id,
          slug: c.slug,
          title: c.title,
          description: c.description,
          cover_image: c.coverImage || c.cover_image,
          tagline: c.tagline,
          level: c.level,
          category: c.category,
          is_active: c.isActive !== undefined ? c.isActive : c.is_active,
        }));
      }
    } catch (e) {
      console.warn('[D1ApiService] Failed to fetch courses from D1:', e);
    }
    return null;
  }

  async updateCourse(id: string, updates: Partial<Course>): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/courses`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      return res.ok;
    } catch (e) {
      console.warn('[D1ApiService] Failed to update course in D1:', e);
      return false;
    }
  }

  async getBatches(courseId?: string): Promise<Batch[] | null> {
    try {
      const url = courseId ? `${API_BASE}/batches?courseId=${encodeURIComponent(courseId)}` : `${API_BASE}/batches`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = (await res.json()) as any;
      if (data && data.success && Array.isArray(data.batches)) {
        return data.batches.map((b: any) => ({
          id: b.id,
          course_id: b.courseId || b.course_id,
          batch_code: b.batchCode || b.batch_code,
          name: b.title || b.name,
          access_code: b.accessCode || b.access_code,
          start_date: b.startDate || b.start_date,
          end_date: b.endDate || b.end_date,
          mentor_id: b.mentorId || b.mentor_id,
          max_students: b.maxStudents || b.max_students,
          is_active: b.isActive !== undefined ? b.isActive : b.is_active,
        }));
      }
    } catch (e) {
      console.warn('[D1ApiService] Failed to fetch batches from D1:', e);
    }
    return null;
  }

  // ── USER PROFILE & ONBOARDING TASKS ──────────────────────────────────────────
  async updateUserProfile(userId: string, updates: Partial<Profile>): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/users/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, ...updates }),
      });
      return res.ok;
    } catch (e) {
      console.warn('[D1ApiService] Failed to update user profile in D1:', e);
      return false;
    }
  }
}

export const d1ApiService = new D1ApiService();
