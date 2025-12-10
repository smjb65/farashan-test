import { User, UserRole } from '../types';
import { INITIAL_SUPER_ADMIN_EMAIL, INITIAL_SUPER_ADMIN_PASS } from '../constants';

// Simulating a database in localStorage
const USERS_KEY = 'farashan_users';
const CURRENT_USER_KEY = 'farashan_current_user';

export const AuthService = {
  getUsers: (): User[] => {
    const stored = localStorage.getItem(USERS_KEY);
    if (!stored) {
      // Seed Super Admin
      const superAdmin: User = {
        id: 'super-admin-id',
        email: INITIAL_SUPER_ADMIN_EMAIL,
        password: INITIAL_SUPER_ADMIN_PASS,
        role: UserRole.SUPER_ADMIN,
        isDeleted: false,
        name: 'Super Admin',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem(USERS_KEY, JSON.stringify([superAdmin]));
      return [superAdmin];
    }
    return JSON.parse(stored);
  },

  register: (email: string, pass: string, name?: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = AuthService.getUsers();
        if (users.find(u => u.email === email)) {
          reject('این ایمیل قبلا ثبت شده است');
          return;
        }

        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          password: pass,
          name: name || email.split('@')[0],
          role: UserRole.USER,
          isDeleted: false,
          createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        
        // Auto login
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
        resolve(newUser);
      }, 800);
    });
  },

  login: (email: string, pass: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = AuthService.getUsers();
        const user = users.find(u => u.email === email && u.password === pass);

        if (!user) {
          reject('نام کاربری یا رمز عبور اشتباه است');
          return;
        }

        if (user.isDeleted) {
          reject('حساب کاربری شما مسدود شده است');
          return;
        }

        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        resolve(user);
      }, 800);
    });
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  // Admin functions
  updateUserRole: (userId: string, newRole: UserRole) => {
    const users = AuthService.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      users[idx].role = newRole;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  },

  deleteUser: (userId: string) => {
    const users = AuthService.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      users[idx].isDeleted = true;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  },

  restoreUser: (userId: string) => {
    const users = AuthService.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      users[idx].isDeleted = false;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  }
};