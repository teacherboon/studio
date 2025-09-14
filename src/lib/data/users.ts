import type { User } from '../types';

// It is recommended to have at least one initial admin user when deploying
// to ensure you can log in and manage the system.
export const users: User[] = [
  { userId: 'user1', role: 'ADMIN', email: 'admin@school.ac.th', displayName: 'Admin User', thaiName: 'ผู้ดูแลระบบ', password: 'password123', status: 'ACTIVE', createdAt: '2024-01-01T10:00:00Z' },
  { userId: 'user2', role: 'TEACHER', email: 'teacher.a@school.ac.th', displayName: 'Teacher A', thaiName: 'ครูเอ', password: 'password123', status: 'ACTIVE', createdAt: '2024-01-01T10:01:00Z' },
  { userId: 'user3', role: 'TEACHER', email: 'teacher.b@school.ac.th', displayName: 'Teacher B', thaiName: 'ครูบี', password: 'password123', status: 'ACTIVE', createdAt: '2024-01-01T10:02:00Z' },
  { userId: 'user4', role: 'STUDENT', email: 'student.a@school.ac.th', displayName: 'Student A', thaiName: 'ด.ช. นักเรียนเอ', studentId: 'stu1', password: 'password123', status: 'ACTIVE', createdAt: '2024-01-02T11:00:00Z' },
  { userId: 'user5', role: 'STUDENT', email: 'student.b@school.ac.th', displayName: 'Student B', thaiName: 'ด.ญ. นักเรียนบี', studentId: 'stu2', password: 'password123', status: 'ACTIVE', createdAt: '2024-01-02T11:01:00Z' },
  { userId: 'user6', role: 'STUDENT', email: 'student.c@school.ac.th', displayName: 'Student C', thaiName: 'ด.ช. นักเรียนซี', studentId: 'stu3', password: 'password123', status: 'ACTIVE', createdAt: '2024-01-02T11:02:00Z' },
  { userId: 'user7', role: 'STUDENT', email: 'student.d@school.ac.th', displayName: 'Student D', thaiName: 'ด.ญ. นักเรียนดี', studentId: 'stu4', password: 'password123', status: 'ACTIVE', createdAt: '2024-01-02T11:03:00Z' },
];
