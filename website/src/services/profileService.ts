import { localDataService } from './localDataService';
import type { Profile } from '../types/database';

export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    await localDataService.init();
    return localDataService.getUserById(userId);
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<boolean> {
    await localDataService.init();
    return localDataService.updateUser(userId, updates);
  },

  async getAllStudents(): Promise<Profile[]> {
    await localDataService.init();
    const all = localDataService.getUsers();
    return all.filter(u => u.role !== 'admin').sort((a, b) => a.full_name.localeCompare(b.full_name));
  },
};
