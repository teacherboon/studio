import type { Offering } from '../types';

export const offerings: Offering[] = [
  { offeringId: 'off1', subjectId: 'subj1', classId: 'c1', teacherEmail: 'teacher.a@school.ac.th', yearMode: 'PRIMARY', termLabel: '2568', isConduct: false, periodsPerWeek: 2, yearBe: 2568 },
  { offeringId: 'off2', subjectId: 'subj2', classId: 'c2', teacherEmail: 'teacher.b@school.ac.th', yearMode: 'SECONDARY', termLabel: '1/2568', isConduct: false, periodsPerWeek: 3, yearBe: 2568 },
  { offeringId: 'off3', subjectId: 'subj3', classId: 'c1', teacherEmail: 'teacher.a@school.ac.th', yearMode: 'PRIMARY', termLabel: '2568', isConduct: false, periodsPerWeek: 1, yearBe: 2568 },
];
