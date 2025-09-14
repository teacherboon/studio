import type { User } from '../types';

export const users: User[] = [
  { userId: 'user1', role: 'ADMIN', email: 'admin@school.ac.th', displayName: 'Admin User', thaiName: 'ผู้ดูแลระบบ', password: 'password123', status: 'ACTIVE', createdAt: new Date().toISOString() },
  { userId: 'user2', role: 'TEACHER', email: 'teacher.a@school.ac.th', displayName: 'Teacher A', thaiName: 'ครู เอ', password: 'password123', status: 'ACTIVE', createdAt: new Date().toISOString() },
  { userId: 'user3', role: 'TEACHER', email: 'teacher.b@school.ac.th', displayName: 'Teacher B', thaiName: 'ครู บี', password: 'password123', status: 'ACTIVE', createdAt: new Date().toISOString() },
  { userId: 'user4', role: 'STUDENT', email: 'student.1@school.ac.th', studentId: 'stu1', displayName: 'Student 1', thaiName: 'นักเรียน หนึ่ง', password: 'password123', status: 'ACTIVE', createdAt: new Date().toISOString() },
  { userId: 'user5', role: 'STUDENT', email: 'student.2@school.ac.th', studentId: 'stu2', displayName: 'Student 2', thaiName: 'นักเรียน สอง', password: 'password123', status: 'ACTIVE', createdAt: new Date().toISOString() },
  { userId: 'user-teacher-c', role: 'TEACHER', email: 'teacher.c@school.ac.th', displayName: 'Teacher C', thaiName: 'ครู ซี', password: 'password123', status: 'ACTIVE', createdAt: new Date().toISOString() },
];
