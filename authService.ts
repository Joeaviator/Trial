
import { UserState } from './types';

const DB_KEY = 'ecohabit_db_users';
const SESSION_KEY = 'ecohabit_current_user';

export interface UserAccount {
  email: string;
  password?: string;
  state: UserState;
}

const DEFAULT_STATE: UserState = {
  impactScore: 0.15,
  moodHistory: [],
  exploredTopics: [],
  quizHistory: [],
  ecoHistory: [],
  lastActionTimestamp: Date.now(),
  dailyActionCount: 0
};

export const authService = {
  getUsers: (): Record<string, UserAccount> => {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : {};
  },

  register: (email: string, pass: string): UserAccount => {
    const users = authService.getUsers();
    if (users[email]) throw new Error("Email already registered!");
    const newUser: UserAccount = { email, password: pass, state: { ...DEFAULT_STATE } };
    users[email] = newUser;
    localStorage.setItem(DB_KEY, JSON.stringify(users));
    return newUser;
  },

  login: (email: string, pass: string): UserAccount => {
    const users = authService.getUsers();
    const user = users[email];
    if (!user || user.password !== pass) throw new Error("Invalid email or password");
    return user;
  },

  saveUserState: (email: string, state: UserState) => {
    const users = authService.getUsers();
    if (users[email]) {
      users[email].state = state;
      localStorage.setItem(DB_KEY, JSON.stringify(users));
    }
  },

  getCurrentUser: (): string | null => localStorage.getItem(SESSION_KEY),
  setCurrentUser: (email: string | null) => {
    if (email) localStorage.setItem(SESSION_KEY, email);
    else localStorage.removeItem(SESSION_KEY);
  }
};
