import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Profile, Admin, UserRole } from '../types/database';
import { localDataService } from '../services/localDataService';
import { d1ApiService } from '../services/d1ApiService';

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
  loginWithGoogle: (role?: UserRole) => Promise<void>;
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

  const [profiles, setProfiles] = useState<Profile[]>(() => {
    try {
      const cached = localStorage.getItem('lms_cached_active_user');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.id) {
          return [parsed];
        }
      }
    } catch (e) {
      console.warn('Lỗi đọc cached active user:', e);
    }
    return [];
  });
  const [admins, setAdmins] = useState<Admin[]>([]);

  // Derived current user
  const activeUser = profiles.find(p => p.id === activeUserId) || profiles[0] || {
    id: 'user-default',
    full_name: 'Thủy Thủ Mới',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
    role: 'student' as UserRole,
    gmail: 'guest@lightms.io',
    phone_number: '',
    facebook_url: '',
    is_profile_completed: false,
    nautical_miles: 0,
    visits: 1,
    created_at: new Date().toISOString()
  };

  const activeAdmin = admins.find(a => a.id === activeUserId || a.gmail?.toLowerCase() === activeUser.gmail?.toLowerCase()) || null;

  // Persist active user cache
  useEffect(() => {
    if (activeUser && activeUser.id && activeUser.id !== 'user-default') {
      try {
        localStorage.setItem('lms_cached_active_user', JSON.stringify(activeUser));
      } catch (e) {
        console.warn('Lỗi lưu active user vào cache:', e);
      }
    }
  }, [activeUser]);

  // Load profiles and admins from localDataService
  useEffect(() => {
    const fetchData = async () => {
      try {
        await localDataService.init();
        const loadedUsers = localDataService.getUsers();
        const loadedAdmins = localDataService.getAdmins();

        setAdmins(loadedAdmins);
        setProfiles(loadedUsers.map(p => {
          const emailLower = (p.gmail || '').toLowerCase().trim();
          const isAdmin = ALLOWED_ADMIN_EMAILS.includes(emailLower) || loadedAdmins.some(a => (a.gmail || '').toLowerCase().trim() === emailLower);
          return {
            ...p,
            role: isAdmin ? 'admin' : 'student'
          };
        }));
      } catch (err) {
        console.error('Error fetching profiles/admins in AuthContext:', err);
      }
    };
    fetchData();
  }, []);

  const switchUser = (role: UserRole) => {
    const target = profiles.find(p => p.role === role);
    if (target) {
      setActiveUserId(target.id);
      setIsAuthenticated(true);
      localStorage.setItem('lms_active_user_id', target.id);
      localStorage.setItem('lms_is_authenticated', 'true');
    }
  };

  const loginWithGmail = (email: string, role?: UserRole): Profile | null => {
    const normalizedEmail = email.toLowerCase().trim();
    if (!normalizedEmail) return null;

    const isAllowedAdmin = ALLOWED_ADMIN_EMAILS.includes(normalizedEmail);
    const effectiveRole: UserRole = role || (isAllowedAdmin ? 'admin' : 'student');

    let user = profiles.find(p => (p.gmail || '').toLowerCase().trim() === normalizedEmail);

    if (!user) {
      const newUser: Profile = {
        id: `user-${Date.now()}`,
        full_name: normalizedEmail.split('@')[0],
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(normalizedEmail)}`,
        role: effectiveRole,
        gmail: normalizedEmail,
        phone_number: '',
        facebook_url: '',
        is_profile_completed: false,
        nautical_miles: 0,
        visits: 1,
        created_at: new Date().toISOString()
      };

      setProfiles(prev => [newUser, ...prev]);
      localDataService.upsertUser(newUser);

      if (effectiveRole === 'admin') {
        const newAdmin: Admin = {
          id: newUser.id,
          full_name: newUser.full_name,
          avatar_url: newUser.avatar_url,
          gmail: normalizedEmail,
          admin_role: 'Operations',
          is_onboarded: true,
          created_at: new Date().toISOString()
        };
        setAdmins(prev => [newAdmin, ...prev]);
        localDataService.upsertAdmin(newAdmin);
      }

      user = newUser;
    } else {
      user = { ...user, role: effectiveRole };
      setProfiles(prev => prev.map(p => p.id === user!.id ? user! : p));
      localDataService.upsertUser(user);
    }

    setActiveUserId(user.id);
    setIsAuthenticated(true);
    localStorage.setItem('lms_active_user_id', user.id);
    localStorage.setItem('lms_is_authenticated', 'true');
    return user;
  };

  const loginWithGoogle = async (role: UserRole = 'student') => {
    const promptEmail = window.prompt('Nhập Gmail Google của bạn để đăng nhập nhanh:', 'hocvien@gmail.com');
    if (promptEmail) {
      loginWithGmail(promptEmail, role);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('lms_is_authenticated');
    localStorage.removeItem('lms_active_user_id');
    localStorage.removeItem('lms_cached_active_user');
  };

  const updateProfile = async (profileId: string, updates: Partial<Profile>): Promise<boolean> => {
    setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, ...updates } : p));
    localDataService.updateUser(profileId, updates);
    d1ApiService.updateUserProfile(profileId, updates).catch(err => {
      console.warn('[AuthContext] D1 updateUserProfile error:', err);
    });
    return true;
  };

  const updateAdminProfile = async (adminId: string, updates: Partial<Admin>): Promise<boolean> => {
    setAdmins(prev => prev.map(a => a.id === adminId ? { ...a, ...updates } : a));
    const target = admins.find(a => a.id === adminId);
    if (target) {
      localDataService.upsertAdmin({ ...target, ...updates });
    }
    return true;
  };

  const incrementVisits = async (userId: string) => {
    setProfiles(prev => prev.map(p => {
      if (p.id === userId) {
        const currentVisits = p.visits || 0;
        const newVisits = currentVisits + 1;
        localDataService.updateUser(userId, { visits: newVisits });
        return { ...p, visits: newVisits };
      }
      return p;
    }));
  };

  return (
    <AuthContext.Provider
      value={{
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
        loginWithGoogle,
        logout,
        incrementVisits
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
