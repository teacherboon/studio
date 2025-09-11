export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface User {
  userId: string;
  role: UserRole;
  email: string;
  displayName: string;
  thaiName: string;
  studentId?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface Student {
  studentId: string;
  stuCode: string;
  prefixTh: string;
  firstNameTh: string;
  lastNameTh: string;
  level: string; // e.g., 'ป.1' to 'ป.6', 'ม.1' to 'ม.6'
  room: string; // e.g., '1', '2'
  homeroomEmail: string;
  status: 'ACTIVE' | 'INACTIVE';
  admitYearBe: number;
}

export interface Class {
  classId: string;
  level: string;
  room: string;
  yearMode: 'PRIMARY' | 'SECONDARY';
  termLabel: string; // e.g., '2568' or '1/2568'
  yearBe: number;
  isActive: boolean;
}

export interface Enrollment {
  enrollmentId: string;
  studentId: string;
  classId: string;
  status: 'ENROLLED' | 'LEFT';
}

export interface Subject {
  subjectId: string;
  subjectCode: string;
  subjectNameTh: string;
  type: 'พื้นฐาน' | 'เพิ่มเติม';
  defaultCredits: number;
  createdByEmail: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Offering {
  offeringId: string;
  subjectId: string;
  classId: string;
  teacherEmail: string;
  creditsOverride?: number;
  yearMode: 'PRIMARY' | 'SECONDARY';
  termLabel: string;
  isConduct: boolean;
}

export type ScoreStatusFlag = 'NORMAL' | 'ร' | '0' | 'มผ';

export interface Score {
  scoreId: string;
  offeringId: string;
  studentId: string;
  rawScore: number | null;
  letterGrade: string | null;
  gradePoint: number | null;
  credits: number;
  statusFlag: ScoreStatusFlag;
  remark?: string;
  updatedBy: string;
  updatedAt: string;
}

export interface GradeScale {
  min_inclusive: number;
  max_inclusive: number;
  letter: string;
  grade_point: number;
  is_pass: boolean;
}

export interface StudentGradeDetails extends Score {
  subjectName: string;
  subjectCode: string;
}
