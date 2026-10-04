import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { Badge, ProfileBadge, NauticalMilesTransaction, Profile } from '../types/database';
import { useAuth } from './AuthContext';
import { useCourse } from './CourseContext';
import { localDataService } from '../services/localDataService';

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
    addNotification?: (title: string, message: string, type?: 'telegram' | 'system') => void,
    batchId?: string
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
  const { activeBatch } = useCourse();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [nauticalTransactions, setNauticalTransactions] = useState<NauticalMilesTransaction[]>([]);

  // Dynamically derive profileBadges from student profiles
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

  // Load gamification data from localDataService
  useEffect(() => {
    const loadGamificationData = async () => {
      try {
        await localDataService.init();
        let loadedBadges = localDataService.getBadges();
        if (!loadedBadges || loadedBadges.length === 0) {
          const res = await fetch('/data/badges.json');
          if (res.ok) {
            loadedBadges = await res.json();
            localDataService.setBadges(loadedBadges);
          }
        }
        if (loadedBadges) setBadges(loadedBadges);
        setNauticalTransactions(localDataService.getTransactions());
      } catch (e) {
        console.warn('Lỗi load gamification data:', e);
      }
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

    localDataService.updateUser(studentId, { badges: updatedBadges });

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
  };

  const addNauticalMiles = async (
    studentId: string,
    amount: number,
    actionType: NauticalMilesTransaction['action_type'],
    description: string,
    referenceId?: string,
    profiles: Profile[] = [],
    setProfiles?: React.Dispatch<React.SetStateAction<Profile[]>>,
    _addNotification?: (title: string, message: string, type?: 'telegram' | 'system') => void,
    batchId?: string
  ) => {
    try {
      const targetUser = profiles.find(p => p.id === studentId) || localDataService.getUserById(studentId);
      const newMiles = (targetUser?.nautical_miles || 0) + amount;

      const newTx: NauticalMilesTransaction = {
        id: crypto.randomUUID(),
        student_id: studentId,
        batch_id: batchId || activeBatch?.id,
        amount,
        action_type: actionType,
        reference_id: referenceId,
        description,
        created_at: new Date().toISOString()
      };

      localDataService.addTransaction(newTx);
      localDataService.updateUser(studentId, { nautical_miles: newMiles });

      setNauticalTransactions(prev => [newTx, ...prev]);

      if (setProfiles) {
        setProfiles(prev => prev.map(p => {
          if (p.id === studentId) {
            return { ...p, nautical_miles: newMiles };
          }
          return p;
        }));
      }

      return { error: null };
    } catch (e: any) {
      console.error('Lỗi khi addNauticalMiles:', e);
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
