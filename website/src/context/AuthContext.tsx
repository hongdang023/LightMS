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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeUserId, setActiveUserId] = useState<string>(() => {
    return localStorage.getItem('lms_active_user_id') || 'f28c5a4d-7a6c-4b5b-86d7-e23a6b8c9d0e';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('lms_is_authenticated') === 'true';
  });

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);

  const activeUser = profiles.find(p => p.id === activeUserId) || profiles[0];
  const activeAdmin = admins.find(a => a.id === activeUserId || a.gmail?.toLowerCase() === activeUser?.gmail?.toLowerCase()) || admins[0] || null;

  // Load profiles and admins from Supabase on startup
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profRes, adminRes] = await Promise.all([
          supabase.from('profiles').select('*'),
          supabase.from('admins').select('*')
        ]);
        if (profRes.data) {
          setProfiles((profRes.data as Profile[]).map(p => ({ ...p, role: 'student' })));
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
        
        // Check if user is in admins table dynamically from Supabase
        const { data: adminData } = await supabase
          .from('admins')
          .select('*')
          .eq('gmail', userEmail)
          .maybeSingle();

        const isAdmin = !!adminData;
        const role: UserRole = isAdmin ? 'admin' : 'student';

        // Check if profile exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('gmail', userEmail)
          .maybeSingle();

        let currentProfile: Profile;

        if (existingProfile) {
          if (existingProfile.role !== role) {
            await supabase.from('profiles').update({ role }).eq('id', existingProfile.id);
            existingProfile.role = role;
          }
          currentProfile = existingProfile as Profile;
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
    if (role === 'admin') {
      setActiveUserId('c6b8a8b1-321a-4d2a-89a1-5d9f0f9b6b8a');
    } else {
      setActiveUserId('f28c5a4d-7a6c-4b5b-86d7-e23a6b8c9d0e');
    }
  };

  const loginWithGmail = (email: string, requestedRole: UserRole = 'student'): Profile | null => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Check dynamic admin status against loaded admins array or requestedRole
    const isAdminEmail = admins.some(a => a.gmail.toLowerCase() === cleanEmail) || requestedRole === 'admin';
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
    }

    const newUser: Profile = {
      id: crypto.randomUUID ? crypto.randomUUID() : `usr-${Date.now()}`,
      full_name: email.split('@')[0],
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      role: finalRole,
      gmail: cleanEmail,
      phone_number: '',
      facebook_url: '',
      is_profile_completed: false,
      nautical_miles: 0,
      visits: 1,
      created_at: new Date().toISOString()
    };

    setProfiles(prev => [newUser, ...prev]);
    setActiveUserId(newUser.id);
    setIsAuthenticated(true);
    localStorage.setItem('lms_active_user_id', newUser.id);
    localStorage.setItem('lms_is_authenticated', 'true');

    supabase.from('profiles').insert([newUser]).then(({ error }) => {
      if (error) console.error('Lỗi khi lưu profile mới lên Supabase:', error);
    });

    return newUser;
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
