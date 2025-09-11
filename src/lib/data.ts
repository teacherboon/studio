
import type { User, Student, Class, Enrollment, Subject, Offering, Score, GradeScale, Schedule, LeaveRequest } from './types';

export const users: User[] = [
  { userId: 'user1', role: 'ADMIN', email: 'admin@school.ac.th', displayName: 'Admin User', thaiName: 'ผู้ดูแลระบบ', status: 'ACTIVE', createdAt: new Date().toISOString() },
  { userId: 'user2', role: 'TEACHER', email: 'teacher.a@school.ac.th', displayName: 'Teacher A', thaiName: 'ครู เอ', status: 'ACTIVE', createdAt: new Date().toISOString() },
  { userId: 'user3', role: 'TEACHER', email: 'teacher.b@school.ac.th', displayName: 'Teacher B', thaiName: 'ครู บี', status: 'ACTIVE', createdAt: new Date().toISOString() },
  { userId: 'user4', role: 'STUDENT', email: 'student.1@school.ac.th', studentId: 'stu1', displayName: 'Student 1', thaiName: 'นักเรียน หนึ่ง', status: 'ACTIVE', createdAt: new Date().toISOString() },
  { userId: 'user5', role: 'STUDENT', email: 'student.2@school.ac.th', studentId: 'stu2', displayName: 'Student 2', thaiName: 'นักเรียน สอง', status: 'ACTIVE', createdAt: new Date().toISOString() },
  { userId: 'user-teacher-c', role: 'TEACHER', email: 'teacher.c@school.ac.th', displayName: 'Teacher C', thaiName: 'ครู ซี', status: 'ACTIVE', createdAt: new Date().toISOString() },

];

export const students: Student[] = [
  { studentId: 'stu1', stuCode: 'S001', prefixTh: 'ด.ช.', firstNameTh: 'สมชาย', lastNameTh: 'ใจดี', level: 'ป.6', room: '1', classNumber: 1, homeroomEmail: 'teacher.a@school.ac.th', status: 'ACTIVE', admitYearBe: 2562 },
  { studentId: 'stu2', stuCode: 'S002', prefixTh: 'ด.ญ.', firstNameTh: 'สมหญิง', lastNameTh: 'เรียนเก่ง', level: 'ป.6', room: '1', classNumber: 2, homeroomEmail: 'teacher.a@school.ac.th', status: 'ACTIVE', admitYearBe: 2562 },
  { studentId: 'stu3', stuCode: 'S003', prefixTh: 'ด.ช.', firstNameTh: 'มานะ', lastNameTh: 'พากเพียร', level: 'ม.1', room: '2', classNumber: 1, homeroomEmail: 'teacher.b@school.ac.th', status: 'ACTIVE', admitYearBe: 2568 },
  { studentId: 'stu4', stuCode: 'S004', prefixTh: 'ด.ญ.', firstNameTh: 'ปิติ', lastNameTh: 'ยินดี', level: 'ม.1', room: '2', classNumber: 2, homeroomEmail: 'teacher.b@school.ac.th', status: 'ACTIVE', admitYearBe: 2568 },
  { studentId: 'stu5', stuCode: 'S005', prefixTh: 'ด.ช.', firstNameTh: 'วีระ', lastNameTh: 'กล้าหาญ', level: 'ม.1', room: '2', classNumber: 3, homeroomEmail: 'teacher.b@school.ac.th', status: 'ACTIVE', admitYearBe: 2568 },
];

export const classes: Class[] = [
  { classId: 'c1', level: 'ป.6', room: '1', yearMode: 'PRIMARY', termLabel: '2568', yearBe: 2568, isActive: true },
  { classId: 'c2', level: 'ม.1', room: '2', yearMode: 'SECONDARY', termLabel: '1/2568', yearBe: 2568, isActive: true },
];

export const enrollments: Enrollment[] = [
  { enrollmentId: 'e1', studentId: 'stu1', classId: 'c1', status: 'ENROLLED' },
  { enrollmentId: 'e2', studentId: 'stu2', classId: 'c1', status: 'ENROLLED' },
  { enrollmentId: 'e3', studentId: 'stu3', classId: 'c2', status: 'ENROLLED' },
  { enrollmentId: 'e4', studentId: 'stu4', classId: 'c2', status: 'ENROLLED' },
  { enrollmentId: 'e5', studentId: 'stu5', classId: 'c2', status: 'ENROLLED' },
];

export const subjects: Subject[] = [
  { subjectId: 'subj1', subjectCode: 'ค16101', subjectNameTh: 'คณิตศาสตร์พื้นฐาน', type: 'พื้นฐาน', defaultCredits: 1.0, createdByEmail: 'teacher.a@school.ac.th', status: 'ACTIVE' },
  { subjectId: 'subj2', subjectCode: 'ว21101', subjectNameTh: 'วิทยาศาสตร์เพิ่มเติม', type: 'เพิ่มเติม', defaultCredits: 0.5, createdByEmail: 'teacher.b@school.ac.th', status: 'ACTIVE' },
  { subjectId: 'subj3', subjectCode: 'พ16101', subjectNameTh: 'สุขศึกษาและพลศึกษา', type: 'พื้นฐาน', defaultCredits: 0.5, createdByEmail: 'teacher.a@school.ac.th', status: 'ACTIVE' },
];

export const offerings: Offering[] = [
  { offeringId: 'off1', subjectId: 'subj1', classId: 'c1', teacherEmail: 'teacher.a@school.ac.th', yearMode: 'PRIMARY', termLabel: '2568', isConduct: false, periodsPerWeek: 2 },
  { offeringId: 'off2', subjectId: 'subj2', classId: 'c2', teacherEmail: 'teacher.b@school.ac.th', yearMode: 'SECONDARY', termLabel: '1/2568', isConduct: false, periodsPerWeek: 3 },
  { offeringId: 'off3', subjectId: 'subj3', classId: 'c1', teacherEmail: 'teacher.a@school.ac.th', yearMode: 'PRIMARY', termLabel: '2568', isConduct: false, periodsPerWeek: 1 },
];

export const scores: Score[] = [
  // Student 1 (สมชาย) - ป.6/1, ปี 2568
  { scoreId: 's1', offeringId: 'off1', studentId: 'stu1', rawScore: 85, letterGrade: 'A', gradePoint: 4.0, credits: 1.0, statusFlag: 'NORMAL', updatedBy: 'teacher.a@school.ac.th', updatedAt: new Date().toISOString() },
  { scoreId: 's2', offeringId: 'off3', studentId: 'stu1', rawScore: 72, letterGrade: 'B', gradePoint: 3.0, credits: 0.5, statusFlag: 'NORMAL', updatedBy: 'teacher.a@school.ac.th', updatedAt: new Date().toISOString() },
  // Student 2 (สมหญิง) - ป.6/1, ปี 2568
  { scoreId: 's3', offeringId: 'off1', studentId: 'stu2', rawScore: 48, letterGrade: 'F', gradePoint: 0, credits: 1.0, statusFlag: '0', updatedBy: 'teacher.a@school.ac.th', updatedAt: new Date().toISOString() },
  { scoreId: 's4', offeringId: 'off3', studentId: 'stu2', rawScore: null, letterGrade: null, gradePoint: null, credits: 0.5, statusFlag: 'ร', updatedBy: 'teacher.a@school.ac.th', updatedAt: new Date().toISOString() },
  // Student 3 (มานะ) - ม.1/2, เทอม 1/2568
  { scoreId: 's5', offeringId: 'off2', studentId: 'stu3', rawScore: 68, letterGrade: 'C+', gradePoint: 2.5, credits: 0.5, statusFlag: 'NORMAL', updatedBy: 'teacher.b@school.ac.th', updatedAt: new Date().toISOString() },
];

export const gradeScale: GradeScale[] = [
  { min_inclusive: 80, max_inclusive: 100, letter: 'A', grade_point: 4.0, is_pass: true },
  { min_inclusive: 75, max_inclusive: 79, letter: 'B+', grade_point: 3.5, is_pass: true },
  { min_inclusive: 70, max_inclusive: 74, letter: 'B', grade_point: 3.0, is_pass: true },
  { min_inclusive: 65, max_inclusive: 69, letter: 'C+', grade_point: 2.5, is_pass: true },
  { min_inclusive: 60, max_inclusive: 64, letter: 'C', grade_point: 2.0, is_pass: true },
  { min_inclusive: 55, max_inclusive: 59, letter: 'D+', grade_point: 1.5, is_pass: true },
  { min_inclusive: 50, max_inclusive: 54, letter: 'D', grade_point: 1.0, is_pass: true },
  { min_inclusive: 0, max_inclusive: 49, letter: 'F', grade_point: 0.0, is_pass: false },
];

export const schedules: Schedule[] = [
    // Teacher A (teacher.a@school.ac.th)
    { scheduleId: 'sch1', offeringId: 'off1', dayOfWeek: 'MONDAY', period: 1 },
    { scheduleId: 'sch2', offeringId: 'off1', dayOfWeek: 'WEDNESDAY', period: 2 },
    { scheduleId: 'sch3', offeringId: 'off3', dayOfWeek: 'FRIDAY', period: 3 },

    // Teacher B (teacher.b@school.ac.th)
    { scheduleId: 'sch4', offeringId: 'off2', dayOfWeek: 'TUESDAY', period: 4 },
    { scheduleId: 'sch5', offeringId: 'off2', dayOfWeek: 'THURSDAY', period: 1 },

     // Teacher C is free on Monday period 1
    { scheduleId: 'sch6', offeringId: 'off2', dayOfWeek: 'TUESDAY', period: 2 },
];

export const leaveRequests: LeaveRequest[] = [
    {
        leaveRequestId: 'lr1',
        teacherEmail: 'teacher.a@school.ac.th',
        leaveType: 'PERSONAL',
        leaveDate: '2024-07-29', // A Monday
        periods: [1],
        reason: 'ธุระส่วนตัว',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
    }
];
