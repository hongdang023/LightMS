// D1 API Client & Synchronization Service for LightMS
import type { OnboardingDay, CalendarEvent, Course, Batch, Profile, Lesson } from '../types/database';

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

  // ── LESSONS ──────────────────────────────────────────────────────────
  async getLessons(courseId?: string): Promise<Lesson[] | null> {
    try {
      const url = courseId ? `${API_BASE}/lessons?courseId=${encodeURIComponent(courseId)}` : `${API_BASE}/lessons`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = (await res.json()) as any;
      if (data && data.success && Array.isArray(data.lessons)) {
        return data.lessons.map((l: any) => {
          let keyConcepts: string[] = [];
          try {
            keyConcepts = typeof l.keyConceptsJson === 'string' ? JSON.parse(l.keyConceptsJson) : (l.key_concepts || []);
          } catch {
            keyConcepts = [];
          }

          let rubrics: any[] = [];
          try {
            rubrics = typeof l.assignmentRubricJson === 'string' ? JSON.parse(l.assignmentRubricJson) : (l.assignment_rubric_checklist || []);
          } catch {
            rubrics = [];
          }

          let resources: any[] = [];
          try {
            resources = typeof l.supportingResourcesJson === 'string' ? JSON.parse(l.supportingResourcesJson) : (l.supporting_resources || []);
          } catch {
            resources = [];
          }

          return {
            id: l.id,
            course_id: l.courseId || l.course_id,
            title: l.title,
            type: l.type || 'video',
            content: l.content || '',
            video_url: l.videoUrl || l.video_url || '',
            order_index: l.orderIndex ?? l.order_index ?? 1,
            target: l.target || '',
            has_materials: l.hasMaterials !== undefined ? Boolean(l.hasMaterials) : true,
            slide_url: l.slideUrl || l.slide_url || '',
            study_note_url: l.studyNoteUrl || l.study_note_url || '',
            key_concepts: keyConcepts,
            supporting_resources: resources,
            assignment_description: l.assignmentDescription || l.assignment_description || '',
            assignment_rubric_checklist: rubrics,
          };
        });
      }
    } catch (e) {
      console.warn('[D1ApiService] Failed to fetch lessons from D1:', e);
    }
    return null;
  }

  async createLesson(lesson: Lesson): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lesson),
      });
      return res.ok;
    } catch (e) {
      console.warn('[D1ApiService] Failed to create lesson in D1:', e);
      return false;
    }
  }

  async updateLesson(id: string, updates: Partial<Lesson>): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/lessons`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      return res.ok;
    } catch (e) {
      console.warn('[D1ApiService] Failed to update lesson in D1:', e);
      return false;
    }
  }

  async deleteLesson(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/lessons?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch (e) {
      console.warn('[D1ApiService] Failed to delete lesson in D1:', e);
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
  async getUsers(): Promise<Profile[] | null> {
    try {
      const res = await fetch(`${API_BASE}/users`);
      if (!res.ok) return null;
      const data = (await res.json()) as any;
      if (data && data.success && Array.isArray(data.users)) {
        return data.users.map((u: any) => ({
          id: u.id,
          full_name: u.fullName || u.full_name || u.email?.split('@')[0],
          avatar_url: u.avatarUrl || u.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.email || u.id)}`,
          gmail: u.email || u.gmail,
          role: u.role || 'student',
          phone_number: u.phoneNumber || u.phone_number || '',
          facebook_url: u.facebookUrl || u.facebook_url || '',
          industry: u.industry,
          current_job: u.currentJob || u.current_job,
          product_idea: u.productIdea || u.product_idea,
          is_profile_completed: u.isProfileCompleted ?? u.is_profile_completed ?? false,
          nautical_miles: u.nauticalMiles ?? u.nautical_miles ?? 0,
          visits: u.visits ?? 1,
          referral_source: u.referralSource || u.referral_source,
          current_role: u.currentRole || u.current_role,
          work_field: u.workField || u.work_field,
          living_region: u.livingRegion || u.living_region,
          gender: u.gender,
          age_group: u.ageGroup || u.age_group,
          onboarding_tasks: u.onboardingTasksJson ? JSON.parse(u.onboardingTasksJson) : (u.onboarding_tasks || {}),
          badges: u.badgesJson ? JSON.parse(u.badgesJson) : (u.badges || []),
          created_at: u.createdAt || u.created_at || new Date().toISOString(),
        }));
      }
    } catch (e) {
      console.warn('[D1ApiService] Failed to fetch users from D1:', e);
    }
    return null;
  }

  async syncUser(user: Partial<Profile>): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      return res.ok;
    } catch (e) {
      console.warn('[D1ApiService] Failed to sync user to D1:', e);
      return false;
    }
  }

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

  // ── ENROLLMENTS ─────────────────────────────────────────────────────────────
  async getEnrollments(batchId?: string, userId?: string): Promise<any[] | null> {
    try {
      const params = new URLSearchParams();
      if (batchId) params.append('batchId', batchId);
      if (userId) params.append('userId', userId);
      const url = `${API_BASE}/enrollments${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = (await res.json()) as any;
      if (data && data.success && Array.isArray(data.enrollments)) {
        return data.enrollments.map((e: any) => ({
          id: e.id,
          user_id: e.userId || e.user_id,
          batch_id: e.batchId || e.batch_id,
          course_id: e.courseId || e.course_id,
          access_code_used: e.accessCodeUsed || e.access_code_used,
          enrolled_at: e.enrolledAt || e.enrolled_at,
          status: e.status || 'active',
        }));
      }
    } catch (e) {
      console.warn('[D1ApiService] Failed to fetch enrollments from D1:', e);
    }
    return null;
  }

  async createEnrollment(enrollment: { userId: string; batchId: string; courseId?: string; accessCode?: string }): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/enrollments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enrollment),
      });
      return res.ok;
    } catch (e) {
      console.warn('[D1ApiService] Failed to create enrollment in D1:', e);
      return false;
    }
  }
}

export const d1ApiService = new D1ApiService();
