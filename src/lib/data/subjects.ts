import type { Subject } from '../types';

export const subjects: Subject[] = [
  { subjectId: 'subj1', subjectCode: 'ค16101', subjectNameTh: 'คณิตศาสตร์พื้นฐาน', type: 'พื้นฐาน', defaultCredits: 1.0, createdByEmail: 'teacher.a@school.ac.th', status: 'ACTIVE' },
  { subjectId: 'subj2', subjectCode: 'ว21101', subjectNameTh: 'วิทยาศาสตร์เพิ่มเติม', type: 'เพิ่มเติม', defaultCredits: 0.5, createdByEmail: 'teacher.b@school.ac.th', status: 'ACTIVE' },
  { subjectId: 'subj3', subjectCode: 'พ16101', subjectNameTh: 'สุขศึกษาและพลศึกษา', type: 'พื้นฐาน', defaultCredits: 0.5, createdByEmail: 'teacher.a@school.ac.th', status: 'ACTIVE' },
];
