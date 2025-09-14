import type { Score } from '../types';

export const scores: Score[] = [
    { scoreId: 'score1', offeringId: 'off1', studentId: 'stu1', rawScore: 85, letterGrade: 'A', gradePoint: 4.0, credits: 1.5, statusFlag: 'NORMAL', updatedBy: 'teacher.a@school.ac.th', updatedAt: new Date().toISOString() },
    { scoreId: 'score2', offeringId: 'off1', studentId: 'stu2', rawScore: 76, letterGrade: 'B+', gradePoint: 3.5, credits: 1.5, statusFlag: 'NORMAL', updatedBy: 'teacher.a@school.ac.th', updatedAt: new Date().toISOString() },
    { scoreId: 'score3', offeringId: 'off2', studentId: 'stu1', rawScore: 90, letterGrade: 'A', gradePoint: 4.0, credits: 1.5, statusFlag: 'NORMAL', updatedBy: 'teacher.a@school.ac.th', updatedAt: new Date().toISOString() },
    { scoreId: 'score4', offeringId: 'off2', studentId: 'stu2', rawScore: 45, letterGrade: 'F', gradePoint: 0.0, credits: 1.5, statusFlag: '0', updatedBy: 'teacher.a@school.ac.th', updatedAt: new Date().toISOString() },
];
