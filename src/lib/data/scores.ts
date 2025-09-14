import type { Score } from '../types';

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
