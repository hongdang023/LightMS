import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import type { Badge, ProfileBadge, NauticalMilesTransaction, Profile } from '../types/database';

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
  ) => Promise<void>;
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
  const [badges, setBadges] = useState<Badge[]>([]);
  const [nauticalTransactions, setNauticalTransactions] = useState<NauticalMilesTransaction[]>([]);

  // Dummy profileBadges state placeholder if needed by context
  const profileBadges: ProfileBadge[] = useMemo(() => [], []);

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
          .order('created_at', { ascending: false }),
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
    const newTx: NauticalMilesTransaction = {
      id: `tx-${Math.random().toString(36).substr(2, 9)}`,
      student_id: studentId,
      amount,
      action_type: actionType,
      reference_id: referenceId,
      description,
      created_at: new Date().toISOString()
    };
    setNauticalTransactions(prev => [newTx, ...prev]);

    if (setProfiles) {
      setProfiles(prev => prev.map(p => {
        if (p.id === studentId) {
          const newMiles = p.nautical_miles + amount;
          supabase.from('profiles').update({ nautical_miles: newMiles }).eq('id', studentId).then(({ error }) => {
            if (error) console.error('Lỗi khi cập nhật nautical_miles của profile:', error);
          });
          return { ...p, nautical_miles: newMiles };
        }
        return p;
      }));
    }

    try {
      const { error } = await supabase
        .from('nautical_miles_transactions')
        .insert([newTx]);
      if (error) console.error('Lỗi khi lưu nautical miles transaction lên Supabase:', error);
    } catch (e) {
      console.error(e);
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
