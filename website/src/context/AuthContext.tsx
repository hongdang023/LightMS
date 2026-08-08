import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile, Admin, UserRole } from '../types/database';

export interface AuthContextType {
  activeUser: Profile;
  activeAdmin: Admin | null;
  activeUserId: string;
  isAuthenticated: boolean;
  users: Profile[];
  admins: Admin[];
  setProfiles: React.Dispatch<React.SetStateAction<Profile[]>>;
  setAdmins: React.Dispatch<React.SetStateAction<Admin[]>>;
  setActiveUserId: (id: string) => void;
  setIsAuthenticated: (auth: boolean) => void;
  switchUser: (role: UserRole) => void;
  updateProfile: (profileId: string, updates: Partial<Profile>) => Promise<boolean>;
  updateAdminProfile: (adminId: string, updates: Partial<Admin>) => Promise<boolean>;
  loginWithGmail: (email: string, role?: UserRole) => Profile | null;
  loginWithSupabaseGoogle: (role?: UserRole) => Promise<void>;
  logout: () => void;
  incrementVisits: (userId: string) => void;
}

export const ALLOWED_ADMIN_EMAILS = [
  'dangtuyethong2324@gmail.com',
  'linhblt.20@gmail.com',
  'khuevu.thucj4fun@gmail.com',
  'ngavtq2@gmail.com',
  'chinn2006@gmail.com',
  'quangnhatnguyen2403@gmail.com'
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeUserId, setActiveUserId] = useState<string>(() => {
    return localStorage.getItem('lms_active_user_id') || '';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('lms_is_authenticated') === 'true';
  });

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);

  const activeUser = profiles.find(p => p.id === activeUserId) || profiles[0];
  const activeAdmin = admins.find(a => a.id === activeUserId || a.gmail?.toLowerCase() === activeUser?.gmail?.toLowerCase()) || null;

  // Load active user profile immediately on startup if activeUserId is saved, then load full profiles/admins asynchronously
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedId = localStorage.getItem('lms_active_user_id');
        if (storedId) {
          // Fast path: Fetch active user profile specifically first
          const { data: activeProf } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', storedId)
            .maybeSingle();

          if (activeProf) {
            const emailLower = activeProf.gmail?.toLowerCase().trim() || '';
            const isAllowedAdmin = ALLOWED_ADMIN_EMAILS.includes(emailLower);
            const { data: adminCheck } = await supabase
              .from('admins')
              .select('*')
              .eq('gmail', emailLower)
              .maybeSingle();

            const isAdmin = isAllowedAdmin || !!adminCheck;
            const userWithRole = {
              ...activeProf,
              role: isAdmin ? ('admin' as UserRole) : ('student' as UserRole)
            };

            setProfiles(prev => {
              if (prev.some(p => p.id === activeProf.id)) return prev;
              return [userWithRole, ...prev];
            });

            if (isAdmin && adminCheck) {
              setAdmins(prev => {
                if (prev.some(a => a.id === adminCheck.id)) return prev;
                return [adminCheck, ...prev];
              });
            }
          }
        }

        // Background path: Fetch all profiles and admins asynchronously without blocking UI render
        const [profRes, adminRes] = await Promise.all([
          supabase.from('profiles').select('*'),
          supabase.from('admins').select('*')
        ]);
        const loadedAdmins = adminRes.data || [];
        if (profRes.data) {
          setProfiles((profRes.data as Profile[]).map(p => {
            const emailLower = p.gmail?.toLowerCase().trim() || '';
            const isAdmin = ALLOWED_ADMIN_EMAILS.includes(emailLower) || loadedAdmins.some((a: any) => a.gmail?.toLowerCase().trim() === emailLower);
            return {
              ...p,
              role: isAdmin ? 'admin' : 'student'
            };
          }));
        }
        if (adminRes.data) setAdmins(adminRes.data as Admin[]);
      } catch (err) {
        console.error('Error fetching profiles/admins in AuthContext:', err);
      }
    };
    fetchData();
  }, []);

  // Listen to Supabase Auth state changes (e.g. Google OAuth redirect)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const userEmail = session.user.email?.toLowerCase().trim() || '';
        
        const isAllowedAdmin = ALLOWED_ADMIN_EMAILS.includes(userEmail);
        const { data: adminData } = await supabase
          .from('admins')
          .select('*')
          .eq('gmail', userEmail)
          .maybeSingle();

        const isAdmin = isAllowedAdmin || !!adminData;
        const role: UserRole = isAdmin ? 'admin' : 'student';

        // Check if profile exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('gmail', userEmail)
          .maybeSingle();

        let currentProfile: Profile;

        if (existingProfile) {
          currentProfile = {
            ...existingProfile,
            role
          } as Profile;
        } else {
          const newProfile: Profile = {
            id: session.user.id || crypto.randomUUID(),
            full_name: session.user.user_metadata?.full_name || userEmail.split('@')[0],
            avatar_url: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userEmail)}`,
            role,
            gmail: userEmail,
            phone_number: '',
            facebook_url: '',
            is_profile_completed: false,
            nautical_miles: 0,
            visits: 1,
            created_at: new Date().toISOString()
          };
          await supabase.from('profiles').insert([newProfile]);
          currentProfile = newProfile;
        }

        setProfiles(prev => {
          const idx = prev.findIndex(p => p.id === currentProfile.id);
          if (idx >= 0) {
            const copy = [...prev];
            copy[idx] = currentProfile;
            return copy;
          }
          return [currentProfile, ...prev];
        });

        if (adminData) {
          setAdmins(prev => {
            const idx = prev.findIndex(a => a.id === adminData.id);
            if (idx >= 0) {
              const copy = [...prev];
              copy[idx] = adminData as Admin;
              return copy;
            }
            return [adminData as Admin, ...prev];
          });
        }

        setActiveUserId(currentProfile.id);
        setIsAuthenticated(true);
        localStorage.setItem('lms_active_user_id', currentProfile.id);
        localStorage.setItem('lms_is_authenticated', 'true');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('lms_active_user_id', activeUserId);
  }, [activeUserId]);

  const switchUser = (role: UserRole) => {
    setProfiles(prev => prev.map(p => p.id === activeUserId ? { ...p, role } : p));
  };

  const loginWithGmail = (email: string, requestedRole: UserRole = 'student'): Profile | null => {
    const emailLower = email.toLowerCase().trim();
    const effectiveRole: UserRole = ALLOWED_ADMIN_EMAILS.includes(emailLower) ? 'admin' : (requestedRole === 'admin' && !ALLOWED_ADMIN_EMAILS.includes(emailLower) ? 'student' : requestedRole);
    let user = profiles.find(p => p.gmail?.toLowerCase().trim() === emailLower);
    
    if (!user) {
      user = {
        id: crypto.randomUUID(),
        full_name: email.split('@')[0],
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(emailLower)}`,
        role: effectiveRole,
        gmail: emailLower,
        phone_number: '',
        facebook_url: '',
        is_profile_completed: true,
        nautical_miles: 0,
        visits: 1,
        created_at: new Date().toISOString()
      };
      setProfiles(prev => [user!, ...prev]);
    } else {
      user = { ...user, role: effectiveRole };
      setProfiles(prev => prev.map(p => p.id === user!.id ? user! : p));
    }

    setActiveUserId(user.id);
    setIsAuthenticated(true);
    localStorage.setItem('lms_active_user_id', user.id);
    localStorage.setItem('lms_is_authenticated', 'true');
    return user;
  };

  const loginWithSupabaseGoogle = async (_role: UserRole = 'student') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (e) {
      console.error('Lỗi khi đăng nhập bằng Google Supabase:', e);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('lms_is_authenticated');
    supabase.auth.signOut();
  };

  const updateProfile = async (profileId: string, updates: Partial<Profile>): Promise<boolean> => {
    setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, ...updates } : p));
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

  const incrementVisits = (userId: string) => {
    setProfiles(prev => prev.map(p => {
      if (p.id === userId) {
        const newVisits = (p.visits || 0) + 1;
        supabase.from('profiles').update({ visits: newVisits }).eq('id', userId).then(({ error }) => {
          if (error) console.error('Lỗi khi cập nhật visits:', error);
        });
        return { ...p, visits: newVisits };
      }
      return p;
    }));
  };

  return (
    <AuthContext.Provider value={{
      activeUser,
      activeAdmin,
      activeUserId,
      isAuthenticated,
      users: profiles,
      admins,
      setProfiles,
      setAdmins,
      setActiveUserId,
      setIsAuthenticated,
      switchUser,
      updateProfile,
      updateAdminProfile,
      loginWithGmail,
      loginWithSupabaseGoogle,
      logout,
      incrementVisits
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
