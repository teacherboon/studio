import type { Offering } from '../types';

export const offerings: Offering[] = [
    // Teacher A teaches P.1/1
    { offeringId: 'off1', subjectId: 'subj1', classId: 'class1', teacherEmail: 'teacher.a@school.ac.th', yearMode: 'PRIMARY', termLabel: '2567', yearBe: 2567, isConduct: false, periodsPerWeek: 5 },
    { offeringId: 'off2', subjectId: 'subj2', classId: 'class1', teacherEmail: 'teacher.a@school.ac.th', yearMode: 'PRIMARY', termLabel: '2567', yearBe: 2567, isConduct: false, periodsPerWeek: 5 },
    { offeringId: 'off3', subjectId: 'subj5', classId: 'class1', teacherEmail: 'teacher.a@school.ac.th', yearMode: 'PRIMARY', termLabel: '2567', yearBe: 2567, isConduct: false, periodsPerWeek: 2 },
    
    // Teacher B teaches P.2/1
    { offeringId: 'off4', subjectId: 'subj1', classId: 'class2', teacherEmail: 'teacher.b@school.ac.th', yearMode: 'PRIMARY', termLabel: '2567', yearBe: 2567, isConduct: false, periodsPerWeek: 5 },
    { offeringId: 'off5', subjectId: 'subj2', classId: 'class2', teacherEmail: 'teacher.b@school.ac.th', yearMode: 'PRIMARY', termLabel: '2567', yearBe: 2567, isConduct: false, periodsPerWeek: 5 },

    // Teacher B also teaches Science to P.1/1
    { offeringId: 'off6', subjectId: 'subj3', classId: 'class1', teacherEmail: 'teacher.b@school.ac.th', yearMode: 'PRIMARY', termLabel: '2567', yearBe: 2567, isConduct: false, periodsPerWeek: 3 },
];
