// Client-side local data service for LightMS
// Replaces direct Supabase client with safe local state & Cloudflare D1 compatibility layer
import type { Profile, Admin, CalendarEvent, Badge, NauticalMilesTransaction } from '../types/database';

const STORAGE_USERS_KEY = 'lightms_users';
const STORAGE_ADMINS_KEY = 'lightms_admins';
const STORAGE_EVENTS_KEY = 'lightms_calendar_events';
const STORAGE_BADGES_KEY = 'lightms_badges';
const STORAGE_TRANSACTIONS_KEY = 'lightms_nautical_transactions';

class LocalDataService {
  private users: Profile[] = [];
  private admins: Admin[] = [];
  private events: CalendarEvent[] = [];
  private badges: Badge[] = [];
  private transactions: NauticalMilesTransaction[] = [];
  private isInitialized = false;

  async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // 1. Load users from localStorage or backup bundle
      const savedUsers = localStorage.getItem(STORAGE_USERS_KEY);
      if (savedUsers) {
        this.users = JSON.parse(savedUsers);
      } else {
        // Fallback fetch from bundled json if exists
        try {
          const res = await fetch('/data/users.json');
          if (res.ok) {
            this.users = await res.json();
            this.saveUsers();
          }
        } catch {
          // ignore
        }
      }

      // 2. Load admins
      const savedAdmins = localStorage.getItem(STORAGE_ADMINS_KEY);
      if (savedAdmins) {
        this.admins = JSON.parse(savedAdmins);
      }

      // 3. Load events
      const savedEvents = localStorage.getItem(STORAGE_EVENTS_KEY);
      if (savedEvents) {
        this.events = JSON.parse(savedEvents);
      }

      // 4. Load badges
      const savedBadges = localStorage.getItem(STORAGE_BADGES_KEY);
      if (savedBadges) {
        this.badges = JSON.parse(savedBadges);
      }

      // 5. Load transactions
      const savedTx = localStorage.getItem(STORAGE_TRANSACTIONS_KEY);
      if (savedTx) {
        this.transactions = JSON.parse(savedTx);
      }
    } catch (e) {
      console.warn('LocalDataService init fallback error:', e);
    } finally {
      this.isInitialized = true;
    }
  }

  // --- Users / Profiles ---
  getUsers(): Profile[] {
    return [...this.users];
  }

  getUserById(id: string): Profile | null {
    return this.users.find(u => u.id === id) || null;
  }

  getUserByEmail(email: string): Profile | null {
    const lower = email.toLowerCase().trim();
    return this.users.find(u => (u.gmail || '').toLowerCase().trim() === lower) || null;
  }

  saveUsers(): void {
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(this.users));
    } catch (e) {
      console.error('Failed to persist users:', e);
    }
  }

  upsertUser(user: Profile): Profile {
    const idx = this.users.findIndex(u => u.id === user.id || (u.gmail && u.gmail.toLowerCase() === user.gmail?.toLowerCase()));
    if (idx >= 0) {
      this.users[idx] = { ...this.users[idx], ...user };
    } else {
      this.users.push(user);
    }
    this.saveUsers();
    return user;
  }

  updateUser(id: string, updates: Partial<Profile>): boolean {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx >= 0) {
      this.users[idx] = { ...this.users[idx], ...updates };
      this.saveUsers();
      return true;
    }
    return false;
  }

  // --- Admins ---
  getAdmins(): Admin[] {
    return [...this.admins];
  }

  saveAdmins(): void {
    localStorage.setItem(STORAGE_ADMINS_KEY, JSON.stringify(this.admins));
  }

  upsertAdmin(admin: Admin): Admin {
    const idx = this.admins.findIndex(a => a.id === admin.id || (a.gmail && a.gmail.toLowerCase() === admin.gmail?.toLowerCase()));
    if (idx >= 0) {
      this.admins[idx] = { ...this.admins[idx], ...admin };
    } else {
      this.admins.push(admin);
    }
    this.saveAdmins();
    return admin;
  }

  // --- Events ---
  getEvents(): CalendarEvent[] {
    return [...this.events];
  }

  // --- Badges ---
  getBadges(): Badge[] {
    return [...this.badges];
  }

  setBadges(list: Badge[]): void {
    this.badges = list;
    localStorage.setItem(STORAGE_BADGES_KEY, JSON.stringify(list));
  }

  // --- Transactions ---
  getTransactions(): NauticalMilesTransaction[] {
    return [...this.transactions];
  }

  addTransaction(tx: NauticalMilesTransaction): void {
    this.transactions.unshift(tx);
    localStorage.setItem(STORAGE_TRANSACTIONS_KEY, JSON.stringify(this.transactions.slice(0, 100)));
  }
}

export const localDataService = new LocalDataService();
