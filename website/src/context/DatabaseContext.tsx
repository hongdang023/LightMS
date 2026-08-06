import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import {
  SEED_BADGES,
  SEED_COURSES,
  SEED_BATCHES,
  SEED_TRANSACTIONS,
  SEED_NOTIFICATIONS,
  SEED_ABOUT_CONTENT
} from './seedData';
import type {
  UserRole,
  SubmissionStatus,
  Profile,
  Admin,
  Course,
  Batch,
  Lesson,
  Submission,
  Feedback,
  NauticalMilesTransaction,
  Badge,
  ProfileBadge,
  NotificationLog,
  Announcement,
  OnboardingDay,
  EventType,
  CalendarEvent,
  AboutContent
} from '../types/database';
import { EVENT_TYPE_CONFIG } from '../types/database';

export type {
  UserRole,
  SubmissionStatus,
  Profile,
  Course,
  Batch,
  Lesson,
  Submission,
  Feedback,
  NauticalMilesTransaction,
  Badge,
  ProfileBadge,
  NotificationLog,
  Announcement,
  OnboardingDay,
  EventType,
  CalendarEvent,
  AboutContent
};
export { EVENT_TYPE_CONFIG };

const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// ==========================================
// Context State Type
// ==========================================

interface DatabaseContextType {
  // Authentication & Session
  activeUser: Profile;
  activeAdmin: Admin | null;
  switchUser: (role: UserRole) => void;
  users: Profile[];
  admins: Admin[];
  updateProfile: (profileId: string, updates: Partial<Profile>) => Promise<boolean>;
  updateAdminProfile: (adminId: string, updates: Partial<Admin>) => Promise<boolean>;
  isAuthenticated: boolean;
  loginWithGmail: (email: string, role?: UserRole) => Profile | null;
  loginWithSupabaseGoogle: (role?: UserRole) => Promise<void>;
  logout: () => void;
  
  // Data lists
  courses: Course[];
  batches: Batch[];
  lessons: Lesson[];
  isLessonsLoading: boolean;

  nauticalTransactions: NauticalMilesTransaction[];
  badges: Badge[];
  profileBadges: ProfileBadge[];
  notifications: NotificationLog[];

  // Admin and Dynamic Content states
  announcements: Announcement[];
  calendarEvents: CalendarEvent[];
  onboardingDays: OnboardingDay[];
  aboutContent: AboutContent;

  // Action mutations (Rules Engine internally triggered)


  completeLesson: (lessonId: string) => void;
  addNauticalMiles: (studentId: string, amount: number, actionType: NauticalMilesTransaction['action_type'], description: string, referenceId?: string) => Promise<void>;
  addNotification: (title: string, message: string, type?: 'telegram' | 'system') => void;


  // New Admin mutation functions
  addAnnouncement: (title: string, content: string, sendEmail: boolean, mediaUrls?: string[]) => void;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateCalendarEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteCalendarEvent: (id: string) => void;
  shiftCalendarEvents: (startDateStr: string, daysToShift: number) => void;
  updateOnboardingDay: (dayNumber: number, updates: Partial<OnboardingDay>) => void;
  updateAboutContent: (updates: Partial<AboutContent>) => void;
  updateLesson: (id: string, updates: Partial<Lesson>) => void;
  updateBatch: (id: string, updates: Partial<Batch>) => void;
  incrementVisits: (userId: string) => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

// ==========================================
// Seed Initial Data imported from ./seedData
// ==========================================

// ==========================================
// Context Provider Implementation
// ==========================================

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Clear legacy mock data cache from LocalStorage for Supabase version
  useEffect(() => {
    const isCleared = localStorage.getItem('lms_cache_cleared_v2');
    if (!isCleared) {
      const keysToRemove = [
        'lms_profiles', 
        'lms_submissions', 
        'lms_comments', 
        'lms_feedbacks', 
        'lms_discussion_posts', 
        'lms_discussion_topics', 
        'lms_nautical_transactions',
        'lms_profile_badges',
        'lms_active_user_id',
        'lms_is_authenticated'
      ];
      keysToRemove.forEach(k => localStorage.removeItem(k));
      localStorage.setItem('lms_cache_cleared_v2', 'true');
      window.location.reload();
    }
  }, []);
  // ── MASTER VERSION GUARD ─────────────────────────────────────────────────
  // Bump DB_VERSION whenever a breaking schema/seed change is made.
  // This auto-clears ALL localStorage so stale cached data never blocks updates.
  const DB_VERSION = 'lms_v24';
  const storedDbVersion = localStorage.getItem('lms_db_version');
  if (storedDbVersion !== DB_VERSION) {
    // Wipe everything except the active user preference
    const savedUserId = localStorage.getItem('lms_active_user_id');
    localStorage.clear();
    if (savedUserId) localStorage.setItem('lms_active_user_id', savedUserId);
    localStorage.setItem('lms_db_version', DB_VERSION);
    window.location.reload();
  }
  // ─────────────────────────────────────────────────────────────────────────

  const safeParse = <T,>(key: string, fallback: T): T => {
    try {
      const value = localStorage.getItem(key);
      if (!value || value === 'undefined') return fallback;
      return JSON.parse(value);
    } catch (e) {
      console.error(`Error parsing localStorage key "${key}":`, e);
      localStorage.removeItem(key);
      return fallback;
    }
  };

  // Load initial states from LocalStorage or use preloaded seed data
  const [activeUserId, setActiveUserId] = useState<string>(() => {
    return localStorage.getItem('lms_active_user_id') || 'f28c5a4d-7a6c-4b5b-86d7-e23a6b8c9d0e';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('lms_is_authenticated') === 'true';
  });



  const [profiles, setProfiles] = useState<Profile[]>([]);

  const [admins, setAdmins] = useState<Admin[]>([]);



  const [nauticalTransactions, setNauticalTransactions] = useState<NauticalMilesTransaction[]>(() => 
    safeParse('lms_nautical_transactions', SEED_TRANSACTIONS)
  );

  const profileBadges = useMemo(() => {
    const list: ProfileBadge[] = [];
    profiles.forEach(p => {
      if (p.badges && Array.isArray(p.badges)) {
        p.badges.forEach(b => {
          list.push({
            student_id: p.id,
            badge_id: b.badge_id,
            unlocked_at: b.unlocked_at
          });
        });
      }
    });
    return list;
  }, [profiles]);

  const [notifications, setNotifications] = useState<NotificationLog[]>(() => 
    safeParse('lms_notifications', SEED_NOTIFICATIONS)
  );

  // Lessons always come from Supabase — start empty, populated after fetch.
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLessonsLoading, setIsLessonsLoading] = useState(true);

  // Always fetched fresh from Supabase — no localStorage cache.
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [onboardingDays, setOnboardingDays] = useState<OnboardingDay[]>([]);



  const [aboutContent, setAboutContent] = useState<AboutContent>(() => 
    safeParse('lms_about_content', SEED_ABOUT_CONTENT)
  );

  const [batches, setBatches] = useState<Batch[]>(() => 
    safeParse('lms_batches', SEED_BATCHES)
  );

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('lms_active_user_id', activeUserId);
  }, [activeUserId]);

  // profiles, announcements, calendarEvents, onboardingDays are NOT cached in localStorage
  // — always fetched fresh from Supabase.




  // announcements, calendarEvents, onboardingDays are NOT cached in localStorage
  // — always fetched fresh from Supabase.

  useEffect(() => {
    localStorage.setItem('lms_about_content', JSON.stringify(aboutContent));
  }, [aboutContent]);

  useEffect(() => {
    localStorage.setItem('lms_nautical_transactions', JSON.stringify(nauticalTransactions));
  }, [nauticalTransactions]);

  useEffect(() => {
    localStorage.setItem('lms_batches', JSON.stringify(batches));
  }, [batches]);

  useEffect(() => {
    localStorage.setItem('lms_notifications', JSON.stringify(notifications));
  }, [notifications]);



  // lessons are NOT cached in localStorage — always fetched fresh from Supabase.





  // ── Supabase Auth Synchronization ────────────────────────────────────────
  useEffect(() => {
    // Check for active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSupabaseSession(session);
    });

    // Listen to authentication changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      handleSupabaseSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // ── Sync Database State from Supabase ──────────────────────────────────
  const fetchDatabaseState = async () => {
    setIsLessonsLoading(true);
    try {
      console.log('Bắt đầu tải dữ liệu thực tế từ Supabase...');
      
      const [
        resProfiles,
        resAdmins,
        resLessons,
        resAnnouncements,
        resCalendarEvents,
        resOnboardingDays,
        resBatches,
      ] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('admins').select('*'),
        supabase.from('lessons').select('*').order('order_index', { ascending: true }),
        supabase.from('announcements').select('*').order('created_at', { ascending: false }),
        supabase.from('calendar_events').select('*'),
        supabase.from('onboarding_days').select('*').order('day', { ascending: true }),
        supabase.from('batches').select('*'),
      ]);

      if (resAdmins.data && resAdmins.data.length > 0) {
        setAdmins(resAdmins.data);
      }

      if (resProfiles.data && resProfiles.data.length > 0) {
        setProfiles(prev => {
          const fetchedProfiles = resProfiles.data as Profile[];
          const newProfiles: Profile[] = fetchedProfiles.map(dbP => {
            return {
              ...dbP,
              role: (dbP.role || 'student') as UserRole
            };
          });
          
          // Giữ lại profile đang được active ở local (nhưng do lỗi insert chưa kịp lên DB)
          prev.forEach(p => {
            if (p.id === activeUserId && !newProfiles.some(np => np.id === p.id)) {
              newProfiles.push(p);
            }
          });
          
          return newProfiles;
        });
      }
      let currentLessons = resLessons.data && resLessons.data.length > 0 ? (resLessons.data as Lesson[]) : [];


      
      setLessons(currentLessons);
      if (resCalendarEvents.data) setCalendarEvents(resCalendarEvents.data);

      // onboardingDays: Supabase first, fallback to static JSON if empty
      if (resOnboardingDays.data && resOnboardingDays.data.length > 0) {
        setOnboardingDays(resOnboardingDays.data);
      } else {
        try {
          const res = await fetch('/data/onboardingData.json');
          if (res.ok) setOnboardingDays(await res.json());
        } catch { /* leave empty */ }
      }

      if (resBatches.data && resBatches.data.length > 0) setBatches(resBatches.data);
      if (resAnnouncements.data) setAnnouncements(resAnnouncements.data);

      const [
        resNauticalMiles,
      ] = await Promise.all([
        supabase.from('nautical_miles_transactions').select('*').order('created_at', { ascending: false }),
      ]);

      if (resNauticalMiles.data) setNauticalTransactions(resNauticalMiles.data);

      console.log('Đã tải xong toàn bộ dữ liệu thực tế từ Supabase.');
    } catch (e) {
      console.error('Lỗi khi tải dữ liệu từ Supabase:', e);
    } finally {
      setIsLessonsLoading(false);
    }
  };

  useEffect(() => {
    fetchDatabaseState();
  }, [isAuthenticated]);

  const handleSupabaseSession = async (session: any) => {
    if (session?.user) {
      const user = session.user;
      const userEmail = user.email || '';
      const userId = user.id;

      // Check if profile exists on Supabase Database
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      let activeProfile: Profile;

      // Check admin emails list
      const adminEmails = [
        'dangtuyethong2324@gmail.com',
        'quangnhatnguyen2403@gmail.com',
        'chinn2006@gmail.com'
      ];
      const isAdminEmail = adminEmails.includes(userEmail.toLowerCase());

      // Clean up requested role from localStorage
      if (localStorage.getItem('lms_signing_in_role')) {
        localStorage.removeItem('lms_signing_in_role');
      }

      // Determine correct role (admin or student by default)
      const finalRole: UserRole = isAdminEmail ? 'admin' : 'student';

      if (error || !profile) {
        // Create new profile locally & on Supabase
        const newProfile: Profile = {
          id: userId,
          full_name: user.user_metadata?.full_name || userEmail.split('@')[0],
          avatar_url: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userEmail)}`,
          role: finalRole,

          gmail: userEmail,
          phone_number: '',
          facebook_url: '',
          is_profile_completed: false,
          nautical_miles: 0,
          visits: 1,
          created_at: new Date().toISOString()
        };

        // Attempt to insert into Supabase
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { visits, ...profileToInsert } = newProfile;
        const { data: insertedData, error: insertError } = await supabase
          .from('profiles')
          .insert([profileToInsert])
          .select()
          .maybeSingle();

        if (insertError) {
          console.error('Lỗi khi lưu profile mới lên Supabase:', insertError);
          activeProfile = newProfile;
        } else {
          activeProfile = (insertedData as Profile) || newProfile;
        }
      } else {
        activeProfile = profile as Profile;
        // Automatically upgrade/sync role if allowed list changed or admin role preferred
        if (activeProfile.role !== finalRole) {
          activeProfile.role = finalRole; // Override in memory immediately for correct routing
          // Try to sync with DB
          await supabase
            .from('profiles')
            .update({ role: finalRole })
            .eq('id', userId);
        }
      }

      // Sync React State
      setProfiles(prev => {
        const exists = prev.some(p => p.id === activeProfile.id);
        if (exists) {
          return prev.map(p => p.id === activeProfile.id ? activeProfile : p);
        }
        return [...prev, activeProfile];
      });

      setActiveUserId(activeProfile.id);
      setIsAuthenticated(true);
      localStorage.setItem('lms_active_user_id', activeProfile.id);
      localStorage.setItem('lms_is_authenticated', 'true');
    }
  };

  const loginWithSupabaseGoogle = async (role: UserRole = 'student') => {
    localStorage.setItem('lms_signing_in_role', role);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      console.error('Lỗi Supabase signInWithOAuth:', error.message);
      throw error;
    }
  };

  // Derived Active User object
  const activeUser = profiles.find(p => p.id === activeUserId) || profiles[0];
  const activeAdmin = admins.find(a => a.id === activeUserId || a.gmail === activeUser?.gmail) || admins[0] || null;

  // Auto unlock current level badges on activeUser changes (silently on load)
  useEffect(() => {
    if (!activeUser || !activeUser.id) return;
    
    // Auto-unlock silently based on profile completion
    if (activeUser.is_profile_completed) {
      unlockBadge(activeUser.id, 'bada0000-0000-0000-0000-000000000001', true);
    }

    const miles = activeUser.nautical_miles || 0;
    // Auto-unlock silently based on miles
    if (miles >= 5000) unlockBadge(activeUser.id, 'bada0000-0000-0000-0000-000000000105', true);
    if (miles >= 3001) unlockBadge(activeUser.id, 'bada0000-0000-0000-0000-000000000104', true);
    if (miles >= 1501) unlockBadge(activeUser.id, 'bada0000-0000-0000-0000-000000000103', true);
    if (miles >= 501) unlockBadge(activeUser.id, 'bada0000-0000-0000-0000-000000000102', true);
    if (miles >= 0) unlockBadge(activeUser.id, 'bada0000-0000-0000-0000-000000000101', true);
  }, [activeUser?.id, activeUser?.nautical_miles, activeUser?.is_profile_completed]);

  const switchUser = (role: UserRole) => {
    if (role === 'admin') {
      setActiveUserId('c6b8a8b1-321a-4d2a-89a1-5d9f0f9b6b8a');
    } else {
      setActiveUserId('f28c5a4d-7a6c-4b5b-86d7-e23a6b8c9d0e');
    }
  };

  const loginWithGmail = (email: string, _role: UserRole = 'student'): Profile | null => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Check if admin
    const adminEmails = [
      'dangtuyethong2324@gmail.com',
      'quangnhatnguyen2403@gmail.com',
      'chinn2006@gmail.com'
    ];
    const isAdminEmail = adminEmails.includes(cleanEmail);

    const finalRole: UserRole = isAdminEmail ? 'admin' : 'student';

    const existingUser = profiles.find(p => p.gmail.toLowerCase() === cleanEmail);
    
    if (existingUser) {
      if (existingUser.role !== finalRole) {
        existingUser.role = finalRole;
        setProfiles(prev => prev.map(p => p.id === existingUser.id ? { ...p, role: finalRole } : p));
      }
      setActiveUserId(existingUser.id);
      setIsAuthenticated(true);
      localStorage.setItem('lms_active_user_id', existingUser.id);
      localStorage.setItem('lms_is_authenticated', 'true');
      return existingUser;
    } else {
      // Create a new profile with selected role (UUID format)
      const newId = generateUUID();
      const newProfile: Profile = {
        id: newId,
        full_name: email.split('@')[0], // default name from email prefix
        avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
        role: finalRole,

        gmail: cleanEmail,
        phone_number: '',
        facebook_url: '',
        is_profile_completed: false,
        nautical_miles: 0,
        visits: 1,
        created_at: new Date().toISOString()
      };
      
      setProfiles(prev => [...prev, newProfile]);
      setActiveUserId(newId);
      setIsAuthenticated(true);
      localStorage.setItem('lms_active_user_id', newId);
      localStorage.setItem('lms_is_authenticated', 'true');
      return newProfile;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    localStorage.removeItem('lms_is_authenticated');
  };

  // Profile management
  const updateProfile = async (profileId: string, updates: Partial<Profile>): Promise<boolean> => {
    let completedNow = false;

    setProfiles(prev => prev.map(p => {
      if (p.id === profileId) {
        const updated = { ...p, ...updates };
        
        // Rules Engine check: profile completion
        // If explicitly set to true in updates, or satisfies all requirements
        const fulfillsAllRequirements = !!(updated.gmail && updated.phone_number && updated.facebook_url && updated.industry && updated.current_job && updated.product_idea);
        
        if (updates.is_profile_completed === true || (!p.is_profile_completed && fulfillsAllRequirements)) {
          if (!p.is_profile_completed) {
            completedNow = true;
          }
          updated.is_profile_completed = true;
        }
        
        return updated;
      }
      return p;
    }));

    if (completedNow) {
      // Award miles
      addNauticalMiles(profileId, 50, 'profile_completion', 'Hoàn thành 100% hồ sơ cá nhân lần đầu');
      
      // Award badge
      unlockBadge(profileId, 'bada0000-0000-0000-0000-000000000001');
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profileId);
      if (error) {
        console.error('Lỗi khi cập nhật profile lên Supabase:', error);
        return false;
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const updateAdminProfile = async (adminId: string, updates: Partial<Admin>): Promise<boolean> => {
    setAdmins(prev => prev.map(a => a.id === adminId ? { ...a, ...updates } : a));
    try {
      const { error } = await supabase
        .from('admins')
        .update(updates)
        .eq('id', adminId);
      if (error) {
        console.error('Lỗi khi cập nhật admin profile lên Supabase:', error);
        return false;
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // Helper to add Nautical Miles
  const addNauticalMiles = async (studentId: string, amount: number, actionType: NauticalMilesTransaction['action_type'], description: string, referenceId?: string) => {
    // Add transaction
    const newTx: NauticalMilesTransaction = {
      id: generateUUID(),
      student_id: studentId,
      amount,
      action_type: actionType,
      reference_id: referenceId,
      description,
      created_at: new Date().toISOString()
    };
    setNauticalTransactions(prev => [newTx, ...prev]);

    // Update profile balance
    setProfiles(prev => prev.map(p => {
      if (p.id === studentId) {
        const newMiles = p.nautical_miles + amount;
        
        // Cập nhật nốt nautical_miles của profile lên Supabase
        supabase.from('profiles').update({ nautical_miles: newMiles }).eq('id', studentId).then(({ error }) => {
          if (error) console.error('Lỗi khi cập nhật nautical_miles của profile:', error);
        });

        // Auto unlock level milestone badges (with notification)
        if (newMiles >= 5000) unlockBadge(studentId, 'bada0000-0000-0000-0000-000000000105', false);
        else if (newMiles >= 3001) unlockBadge(studentId, 'bada0000-0000-0000-0000-000000000104', false);
        else if (newMiles >= 1501) unlockBadge(studentId, 'bada0000-0000-0000-0000-000000000103', false);
        else if (newMiles >= 501) unlockBadge(studentId, 'bada0000-0000-0000-0000-000000000102', false);
        else if (newMiles >= 0) unlockBadge(studentId, 'bada0000-0000-0000-0000-000000000101', false);

        return { ...p, nautical_miles: newMiles };
      }
      return p;
    }));

    try {
      const { error } = await supabase
        .from('nautical_miles_transactions')
        .insert([newTx]);
      if (error) console.error('Lỗi khi lưu nautical miles transaction lên Supabase:', error);
    } catch (e) {
      console.error(e);
    }
  };

  // Helper to unlock badge
  const unlockBadge = async (studentId: string, badgeId: string, silent: boolean = false) => {
    const targetProfile = profiles.find(p => p.id === studentId);
    if (!targetProfile) return;

    const currentBadges = targetProfile.badges || [];
    const alreadyUnlocked = currentBadges.some(b => b.badge_id === badgeId);
    if (alreadyUnlocked) return;

    const unlockedAt = new Date().toISOString();
    const newBadgeItem = { badge_id: badgeId, unlocked_at: unlockedAt };
    const updatedBadges = [...currentBadges, newBadgeItem];

    // Cập nhật state profiles locally
    setProfiles(prev => prev.map(p => p.id === studentId ? { ...p, badges: updatedBadges } : p));

    const badge = SEED_BADGES.find(b => b.id === badgeId);
    
    if (!silent) {
      addNotification(
        'Huy hiệu được mở khóa!',
        `Chúc mừng bạn đã mở khóa huy hiệu ${badge?.icon} "${badge?.name}"!`,
        'system'
      );

      // Telegram notification mimic
      addNotification(
        '📢 Telegram Wall of Fame Bot',
        `⚓ THÀNH TỰU HẢI TRÌNH: Thủy thủ ${targetProfile.full_name} (${targetProfile.gmail}) vừa xuất sắc thu về Huy hiệu ${badge?.icon} **${badge?.name}**! Gió đang thổi căng buồm!`,
        'telegram'
      );
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ badges: updatedBadges })
        .eq('id', studentId);
      if (error) console.error('Lỗi khi lưu badge vào profile trên Supabase:', error);
    } catch (e) {
      console.error(e);
    }
  };

  // Helper to add notification log
  const addNotification = (title: string, message: string, type: 'telegram' | 'system' = 'system') => {
    const newLog: NotificationLog = {
      id: `ntf-${Math.random().toString(36).substr(2, 9)}`,
      title,
      message,
      type,
      created_at: new Date().toISOString()
    };
    setNotifications(prev => [newLog, ...prev]);
  };

  // ==========================================
  // Student Actions
  // ==========================================

  const completeLesson = (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    const hasCompleted = nauticalTransactions.some(
      t => t.student_id === activeUserId && t.action_type === 'lesson_complete' && t.reference_id === lessonId
    );
    if (hasCompleted) return;

    const points = lesson.assignment_description ? 50 : 5;
    addNauticalMiles(activeUserId, points, 'lesson_complete', `Đã hoàn thành bài học: ${lesson.title}`, lessonId);
    
    // Check for Treasure Map badge
    const completedLessonTx = nauticalTransactions.filter(t => t.student_id === activeUserId && t.action_type === 'lesson_complete');
    if (completedLessonTx.length + 1 >= lessons.length) {
      unlockBadge(activeUserId, 'bada0000-0000-0000-0000-000000000006');
    }
  };





  // ==========================================
  // Admin Action Mutation Implementations
  // ==========================================

  const addAnnouncement = (title: string, content: string, sendEmail: boolean, mediaUrls: string[] = []) => {
    const newAnn: Announcement = {
      id: generateUUID(),
      title,
      content,
      created_by: activeUserId,
      send_email: sendEmail,
      sent_email_at: sendEmail ? new Date().toISOString() : undefined,
      media_urls: mediaUrls,
      created_at: new Date().toISOString(),
      isNew: true
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    addNotification('Thông báo mới', `Thông báo "${title}" đã được đăng tải`, 'system');

    if (sendEmail) {
      const studentProfiles = profiles.filter(p => p.role === 'student');
      const studentNames = studentProfiles.map(p => `${p.full_name} (${p.gmail})`).join(', ');
      addNotification(
        '📢 Email Broadcast Bot',
        `📧 ĐÃ GỬI EMAIL: [Thông báo: ${title}] tới toàn thể học viên: ${studentNames}`,
        'telegram'
      );
    }

    // Lưu lên Supabase - lược bỏ các thuộc tính không có trong DB
    const { isNew, ...dbAnn } = newAnn;
    supabase.from('announcements').insert([dbAnn]).then(({ error }) => {
      if (error) console.error('Lỗi khi lưu thông báo lên Supabase:', error.message);
    });
  };

  const updateAnnouncement = (id: string, updates: Partial<Announcement>) => {
    setAnnouncements(prev => prev.map(a => {
      if (a.id === id) {
        const updated = { ...a, ...updates };
        if (updates.send_email && !a.send_email) {
          updated.sent_email_at = new Date().toISOString();
          const studentProfiles = profiles.filter(p => p.role === 'student');
          const studentNames = studentProfiles.map(p => `${p.full_name} (${p.gmail})`).join(', ');
          addNotification(
            '📢 Email Broadcast Bot',
            `📧 ĐÃ GỬI EMAIL: [Thông báo cập nhật: ${a.title}] tới toàn thể học viên: ${studentNames}`,
            'telegram'
          );
        }
        return updated;
      }
      return a;
    }));
    addNotification('Cập nhật thông báo', 'Thông báo đã được chỉnh sửa thành công', 'system');

    // Cập nhật lên Supabase - lược bỏ các thuộc tính không có trong DB
    const { isNew, ...dbUpdates } = updates as any;
    supabase.from('announcements').update(dbUpdates).eq('id', id).then(({ error }) => {
      if (error) console.error('Lỗi khi cập nhật thông báo trên Supabase:', error.message);
    });
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    addNotification('Xóa thông báo', 'Đã gỡ bỏ thông báo', 'system');

    // Xóa trên Supabase
    supabase.from('announcements').delete().eq('id', id).then(({ error }) => {
      if (error) console.error('Lỗi khi xóa thông báo trên Supabase:', error.message);
    });
  };

  const addCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `cal-${Math.random().toString(36).substr(2, 9)}`
    };
    setCalendarEvents(prev => [...prev, newEvent]);
    addNotification('Thêm lịch sự kiện', `Sự kiện "${event.title}" đã được thêm vào lịch trình`, 'system');

    // Lưu lên Supabase
    supabase.from('calendar_events').insert([newEvent]).then(({ error }) => {
      if (error) console.error('Lỗi khi lưu sự kiện lịch lên Supabase:', error.message);
    });
  };

  const updateCalendarEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setCalendarEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    addNotification('Cập nhật lịch sự kiện', 'Lịch trình sự kiện đã được điều chỉnh', 'system');

    // Cập nhật lên Supabase
    supabase.from('calendar_events').update(updates).eq('id', id).then(({ error }) => {
      if (error) console.error('Lỗi khi cập nhật sự kiện lịch trên Supabase:', error.message);
    });
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents(prev => prev.filter(e => e.id !== id));
    addNotification('Xóa lịch sự kiện', 'Đã gỡ bỏ sự kiện khỏi lịch trình', 'system');

    // Xóa trên Supabase
    supabase.from('calendar_events').delete().eq('id', id).then(({ error }) => {
      if (error) console.error('Lỗi khi xóa sự kiện lịch trên Supabase:', error.message);
    });
  };

  const shiftCalendarEvents = (startDateStr: string, daysToShift: number) => {
    const cutoffTime = new Date(startDateStr + 'T00:00:00').getTime();
    
    setCalendarEvents(prev => prev.map(event => {
      if (event.date && event.month !== undefined && event.year !== undefined) {
        const eventTime = new Date(event.year, event.month, event.date).getTime();
        if (eventTime >= cutoffTime) {
          const d = new Date(event.year, event.month, event.date);
          d.setDate(d.getDate() + daysToShift);
          return {
            ...event,
            date: d.getDate(),
            month: d.getMonth(),
            year: d.getFullYear()
          };
        }
      }
      
      if (event.startRecur && event.endRecur) {
        let updatedStart = event.startRecur;
        let updatedEnd = event.endRecur;
        
        if (event.startRecur >= cutoffTime) {
          updatedStart += daysToShift * 24 * 60 * 60 * 1000;
        }
        if (event.endRecur >= cutoffTime) {
          updatedEnd += daysToShift * 24 * 60 * 60 * 1000;
        }
        
        return {
          ...event,
          startRecur: updatedStart,
          endRecur: updatedEnd
        };
      }
      
      return event;
    }));



    addNotification(
      'Dời lịch hàng loạt', 
      `Đã dời toàn bộ lịch học và lịch mở khóa từ ngày ${startDateStr} tiến thêm ${daysToShift} ngày!`, 
      'system'
    );
  };

  const updateOnboardingDay = (dayNumber: number, updates: Partial<OnboardingDay>) => {
    setOnboardingDays(prev => prev.map(d => d.day === dayNumber ? { ...d, ...updates } : d));
    addNotification('Cập nhật Onboarding', `Đã cập nhật thông tin Ngày ${dayNumber}`, 'system');

    // Cập nhật trên Supabase
    supabase.from('onboarding_days').update(updates).eq('day', dayNumber).then(({ error }) => {
      if (error) console.error('Lỗi khi cập nhật onboarding_day trên Supabase:', error.message);
    });
  };



  const updateAboutContent = (updates: Partial<AboutContent>) => {
    setAboutContent(prev => ({ ...prev, ...updates }));
    addNotification('Cập nhật Giới thiệu', 'Thông tin giới thiệu khóa học đã được cập nhật', 'system');
  };

  const updateLesson = (id: string, updates: Partial<Lesson>) => {
    setLessons(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
    addNotification('Cập nhật bài học', 'Nội dung bài học đã được cập nhật', 'system');

    // Cập nhật trên Supabase (loại bỏ target vì cột này đã bị xóa)
    const { target, ...dbUpdates } = updates as any;
    supabase.from('lessons').update(dbUpdates).eq('id', id).then(({ error }) => {
      if (error) console.error('Lỗi khi cập nhật lesson trên Supabase:', error.message);
    });
  };
  const updateBatch = (id: string, updates: Partial<Batch>) => {
    setBatches(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    addNotification('Cập nhật lớp học', 'Đã cập nhật ngày khai giảng/kết thúc lớp học', 'system');

    // Cập nhật trên Supabase
    supabase.from('batches').update(updates).eq('id', id).then(({ error }) => {
      if (error) console.error('Lỗi khi cập nhật batch trên Supabase:', error.message);
    });
  };

  const incrementVisits = (userId: string) => {
    setProfiles(prev => prev.map(p => {
      if (p.id === userId) {
        const newVisits = (p.visits || 0) + 1;
        return { ...p, visits: newVisits };
      }
      return p;
    }));
  };

  return (
    <DatabaseContext.Provider value={{
      activeUser,
      activeAdmin,
      switchUser,
      users: profiles,
      admins,
      updateProfile,
      updateAdminProfile,
      isAuthenticated,
      loginWithGmail,
      loginWithSupabaseGoogle,
      logout,
      courses: SEED_COURSES,
      batches,
      lessons,
      isLessonsLoading,
      nauticalTransactions,
      badges: SEED_BADGES,
      profileBadges,
      notifications,
      announcements,
      calendarEvents,
      onboardingDays,
      aboutContent,


      completeLesson,
      addNauticalMiles,
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
      updateLesson,
      updateBatch,
      incrementVisits
    }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
