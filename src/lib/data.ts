// This file is obsolete and will be replaced by the /data directory.
// It is kept to avoid breaking imports in files that are not part of this change.
// Please use `import { ... } from '@/lib/data';` instead.

import type { User, Student, Class, Enrollment, Subject, Offering, Score, GradeScale, Schedule, LeaveRequest, StudentAttributes } from './types';

export const users: User[] = [];
export const students: Student[] = [];
export const classes: Class[] = [];
export const enrollments: Enrollment[] = [];
export const subjects: Subject[] = [];
export const offerings: Offering[] = [];
export const scores: Score[] = [];
export const studentAttributes: StudentAttributes[] = [];
export const gradeScale: GradeScale[] = [];
export const schedules: Schedule[] = [];
export const leaveRequests: LeaveRequest[] = [];
