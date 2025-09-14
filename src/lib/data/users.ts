import type { User } from '../types';

// It is recommended to have at least one initial admin user when deploying
// to ensure you can log in and manage the system.
export const users: User[] = [
  { userId: 'user1', role: 'ADMIN', email: 'admin@school.ac.th', displayName: 'Admin User', thaiName: 'ผู้ดูแลระบบ', password: 'password123', status: 'ACTIVE', createdAt: new Date().toISOString() },
];
