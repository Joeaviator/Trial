import { UserState } from './types';

const DB_NAME = 'AllEase_Core_V3';
const SESSION_KEY = 'AllEase_Active_Session';

export interface DatabaseSchema {
  users: Record<string, { email: string; passwordHash: string; state: UserState }>;
  system_logs: Array<{ id: string; event: string; timestamp: number }>;
}

const cryptoEngine = {
  hashPassword: async (password: string): Promise<string> => {
    const msgUint8 = new TextEncoder().encode(password);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
};

const _db = {
  get: (): DatabaseSchema => {
    const raw = localStorage.getItem(DB_NAME);
    return raw ? JSON.parse(raw) : { users: {}, system_logs: [] };
  },
  save: (data: DatabaseSchema) => {
    localStorage.setItem(DB_NAME, JSON.stringify(data));
  },
  log: (event: string) => {
    const data = _db.get();
    data.system_logs.unshift({ id: Math.random().toString(36).substr(2, 9), event, timestamp: Date.now() });
    if (data.system_logs.length > 100) data.system_logs = data.system_logs.slice(0, 100);
    _db.save(data);
  }
};

export const authService = {
  getUsers: () => _db.get().users,
  
  register: async (email: string, pass: string) => {
    const data = _db.get();
    const cleanEmail = email.toLowerCase().trim();
    if (data.users[cleanEmail]) throw new Error("Entity ID collision: User already exists.");
    
    const hash = await cryptoEngine.hashPassword(pass);
    data.users[cleanEmail] = {
      email: cleanEmail,
      passwordHash: hash,
      state: {
        impactScore: 15,
        moodHistory: [],
        exploredTopics: [],
        quizHistory: [],
        ecoHistory: [],
        lastActionTimestamp: Date.now(),
        dailyActionCount: 0
      }
    };
    _db.save(data);
    _db.log(`REGISTRATION_SUCCESS: ${cleanEmail}`);
    return data.users[cleanEmail];
  },

  login: async (email: string, pass: string) => {
    const data = _db.get();
    const cleanEmail = email.toLowerCase().trim();
    const user = data.users[cleanEmail];
    if (!user) throw new Error("Invalid profile signature.");
    
    const hash = await cryptoEngine.hashPassword(pass);
    if (user.passwordHash !== hash) throw new Error("Invalid profile signature.");
    
    _db.log(`AUTH_GRANTED: ${cleanEmail}`);
    return user;
  },

  saveUserState: (email: string, state: UserState) => {
    const data = _db.get();
    const cleanEmail = email.toLowerCase().trim();
    if (data.users[cleanEmail]) {
      data.users[cleanEmail].state = state;
      _db.save(data);
    }
  },

  // CRITICAL: Switched to sessionStorage to allow simultaneous sessions per tab
  getCurrentUser: (): string | null => sessionStorage.getItem(SESSION_KEY),
  setCurrentUser: (email: string | null) => {
    if (email) {
      sessionStorage.setItem(SESSION_KEY, email.toLowerCase().trim());
    } else {
      sessionStorage.removeItem(SESSION_KEY);
    }
  },
  
  query: (sql: string, activeUserEmail: string | null) => {
    const data = _db.get();
    const command = sql.toLowerCase().trim();
    
    if (command.includes('select * from users')) {
      const allUsers = Object.values(data.users);
      // If a specific user is requesting, we default to showing their isolated view
      if (activeUserEmail) {
        return allUsers
          .filter(u => u.email === activeUserEmail.toLowerCase().trim())
          .map(u => ({
            ...u,
            passwordHash: '[PROTECTED_BY_HASH]',
            state: '{ACTIVE_PARTITION}'
          }));
      }
      return allUsers.map(u => ({ email: u.email, status: 'ENCRYPTED' }));
    }
    
    if (command.includes('select * from logs')) return data.system_logs;
    return { error: "Access Denied: SQL command outside allowed neural scope." };
  }
};