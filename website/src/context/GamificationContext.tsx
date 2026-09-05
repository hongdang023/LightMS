import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import type { Badge, ProfileBadge, NauticalMilesTransaction, Profile } from '../types/database';
import { useAuth } from './AuthContext';

export interface GamificationContextType {
  badges: Badge[];
  profileBadges: ProfileBadge[];
  nauticalTransactions: NauticalMilesTransaction[];
  setBadges: React.Dispatch<React.SetStateAction<Badge[]>>;
  setNauticalTransactions: React.Dispatch<React.SetStateAction<NauticalMilesTransaction[]>>;
  addNauticalMiles: (
    studentId: string,
    amount: number,
    actionType: NauticalMilesTransaction['action_type'],
    description: string,
    referenceId?: string,
    profiles?: Profile[],
    setProfiles?: React.Dispatch<React.SetStateAction<Profile[]>>,
    addNotification?: (title: string, message: string, type?: 'telegram' | 'system') => void
  ) => Promise<{ error: any }>;
  unlockBadge: (
    studentId: string,
    badgeId: string,
    silent?: boolean,
    profiles?: Profile[],
    setProfiles?: React.Dispatch<React.SetStateAction<Profile[]>>,
    addNotification?: (title: string, message: string, type?: 'telegram' | 'system') => void
  ) => Promise<void>;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { users } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [nauticalTransactions, setNauticalTransactions] = useState<NauticalMilesTransaction[]>([]);

  // Dynamically derive profileBadges from the real student profiles loaded from Supabase
  const profileBadges: ProfileBadge[] = useMemo(() => {
    const list: ProfileBadge[] = [];
    users.forEach(u => {
      if (u.badges && Array.isArray(u.badges)) {
        u.badges.forEach(b => {
          list.push({
            student_id: u.id,
            badge_id: b.badge_id,
            unlocked_at: b.unlocked_at
          });
        });
      }
    });
    return list;
  }, [users]);

  // ── Initial data fetch from Supabase ──────────────────────────────────────
  useEffect(() => {
    const loadGamificationData = async () => {
      const [
        { data: badgesData },
        { data: txData },
      ] = await Promise.all([
        supabase.from('badges').select('*'),
        supabase.from('nautical_miles_transactions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100),
      ]);

      if (badgesData) setBadges(badgesData);
      if (txData) setNauticalTransactions(txData);
    };

    loadGamificationData();
  }, []);

  const unlockBadge = async (
    studentId: string,
    badgeId: string,
    silent: boolean = false,
    profiles: Profile[] = [],
    setProfiles?: React.Dispatch<React.SetStateAction<Profile[]>>,
    addNotification?: (title: string, message: string, type?: 'telegram' | 'system') => void
  ) => {
    const targetProfile = profiles.find(p => p.id === studentId);
    if (!targetProfile) return;

    const currentBadges = targetProfile.badges || [];
    const alreadyUnlocked = currentBadges.some(b => b.badge_id === badgeId);
    if (alreadyUnlocked) return;

    const unlockedAt = new Date().toISOString();
    const newBadgeItem = { badge_id: badgeId, unlocked_at: unlockedAt };
    const updatedBadges = [...currentBadges, newBadgeItem];

    if (setProfiles) {
      setProfiles(prev => prev.map(p => p.id === studentId ? { ...p, badges: updatedBadges } : p));
    }

    const badge = badges.find(b => b.id === badgeId);

    if (!silent && addNotification) {
      addNotification(
        'Huy hiệu được mở khóa!',
        `Chúc mừng bạn đã mở khóa huy hiệu ${badge?.icon} "${badge?.name}"!`,
        'system'
      );
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

  const addNauticalMiles = async (
    studentId: string,
    amount: number,
    actionType: NauticalMilesTransaction['action_type'],
    description: string,
    referenceId?: string,
    _profiles: Profile[] = [],
    setProfiles?: React.Dispatch<React.SetStateAction<Profile[]>>,
    _addNotification?: (title: string, message: string, type?: 'telegram' | 'system') => void
  ) => {
    let effectiveStudentId = studentId;

    try {
      // 0. Ensure student profile exists in Supabase to prevent FK constraint failure
      const { data: existingProf } = await supabase
        .from('profiles')
        .select('id, nautical_miles')
        .eq('id', studentId)
        .maybeSingle();

      if (!existingProf) {
        // Attempt fallback lookup in local profiles list or create placeholder in Supabase
        const localProfile = _profiles.find(p => p.id === studentId);
        if (localProfile) {
          const { data: profByGmail } = await supabase
            .from('profiles')
            .select('id, nautical_miles')
            .eq('gmail', localProfile.gmail)
            .maybeSingle();

          if (profByGmail) {
            effectiveStudentId = profByGmail.id;
          } else {
            const { role: _r, ...dbProfile } = localProfile as any;
            const { data: createdProf, error: cErr } = await supabase
              .from('profiles')
              .insert([dbProfile])
              .select('id')
              .maybeSingle();
            if (cErr) console.error('Lỗi khởi tạo profile trước transaction:', cErr);
            if (createdProf) effectiveStudentId = createdProf.id;
          }
        }
      }

      const newTx: NauticalMilesTransaction = {
        id: crypto.randomUUID(),
        student_id: effectiveStudentId,
        amount,
        action_type: actionType,
        reference_id: referenceId,
        description,
        created_at: new Date().toISOString()
      };

      // 1. Insert transaction into Supabase
      const { error: txError } = await supabase
        .from('nautical_miles_transactions')
        .insert([newTx]);

      if (txError) {
        console.error('Lỗi khi lưu nautical miles transaction lên Supabase:', txError);
        return { error: txError };
      }

      // 2. Fetch current profile from Supabase to get latest nautical_miles
      const { data: currentProf } = await supabase
        .from('profiles')
        .select('nautical_miles')
        .eq('id', effectiveStudentId)
        .maybeSingle();

      const newMiles = ((currentProf?.nautical_miles || 0) + amount);

      // 3. Update profile's nautical_miles in Supabase
      const { error: profError } = await supabase
        .from('profiles')
        .update({ nautical_miles: newMiles })
        .eq('id', effectiveStudentId);

      if (profError) {
        console.error('Lỗi khi cập nhật nautical_miles của profile trên Supabase:', profError);
      }

      // 4. Update local React states
      setNauticalTransactions(prev => [newTx, ...prev]);

      if (setProfiles) {
        setProfiles(prev => prev.map(p => {
          if (p.id === studentId || p.id === effectiveStudentId) {
            return { ...p, nautical_miles: newMiles };
          }
          return p;
        }));
      }

      return { error: null };
    } catch (e: any) {
      console.error('Lỗi không xác định khi addNauticalMiles:', e);
      return { error: e };
    }
  };

  return (
    <GamificationContext.Provider value={{
      badges,
      profileBadges,
      nauticalTransactions,
      setBadges,
      setNauticalTransactions,
      addNauticalMiles,
      unlockBadge
    }}>
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) throw new Error('useGamification must be used within a GamificationProvider');
  return context;
};
