
'use client';

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import type { User, Student, Class, Enrollment, Subject, Offering, Score, Schedule, StudentAttributes } from '@/lib/types';
import * as initialData from '@/lib/data';

interface DataContextType {
  allUsers: User[];
  allStudents: Student[];
  allClasses: Class[];
  allEnrollments: Enrollment[];
  allSubjects: Subject[];
  allOfferings: Offering[];
  allScores: Score[];
  allSchedules: Schedule[];
  allStudentAttributes: StudentAttributes[];
  gradeScale: typeof initialData.gradeScale;
  studentCountByClass: Record<string, number>;
  homeroomTeacherByClass: Map<string, string>;
  usersByStudentId: Map<string, User>;
  offeringDetails: Record<string, { subject: Subject | undefined; classInfo: Class | undefined; teacher: User | undefined; }>;
  actions: {
    addUser: (user: User) => void;
    updateUser: (userId: string, updatedData: Partial<User>) => void;
    deleteUser: (userId: string) => void;
    importUsers: (users: User[]) => { importedCount: number, conflictCount: number };
    
    addStudent: (student: Student) => void;
    updateStudent: (studentId: string, updatedData: Partial<Student>) => void;
    deleteStudent: (studentId: string) => void;
    importStudents: (data: { newUsers: User[], newStudents: Student[], newEnrollments: Enrollment[] }) => { importedCount: number, conflicts: number };

    addClass: (classData: Class) => void;
    updateClass: (classId: string, updatedData: Partial<Class>) => void;
    deleteClass: (classId: string) => void;

    addOffering: (offering: Offering) => void;
    updateOffering: (offeringId: string, updatedData: Partial<Offering>) => void;
    deleteOffering: (offeringId: string) => void;

    addSubject: (subject: Subject) => void;
    updateSubject: (subjectId: string, updatedData: Partial<Subject>) => void;
    deleteSubject: (subjectId: string) => void;
    importSubjects: (subjects: Subject[]) => { importedCount: number, conflictCount: number };

    addSchedule: (schedule: Schedule) => { success: boolean; error?: string; description?: string; };
    addSchedules: (schedules: Schedule[]) => void;
    deleteSchedule: (scheduleId: string) => void;
    importSchedules: (schedules: Schedule[]) => { importedCount: number, conflictCount: number };

    addScores: (scores: Score[]) => void;
    updateScores: (scores: Score[]) => void;

    updateStudentAttributes: (attributes: StudentAttributes[]) => void;
    
    getOfferingsForTeacher: (teacherEmail: string) => any[];
    getStudentsInClass: (classId: string) => Student[];
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [allUsers, setAllUsers] = useState<User[]>(initialData.users);
  const [allStudents, setAllStudents] = useState<Student[]>(initialData.students);
  const [allClasses, setAllClasses] = useState<Class[]>(initialData.classes);
  const [allEnrollments, setAllEnrollments] = useState<Enrollment[]>(initialData.enrollments);
  const [allSubjects, setAllSubjects] = useState<Subject[]>(initialData.subjects);
  const [allOfferings, setAllOfferings] = useState<Offering[]>(initialData.offerings);
  const [allScores, setAllScores] = useState<Score[]>(initialData.scores);
  const [allSchedules, setAllSchedules] = useState<Schedule[]>(initialData.schedules);
  const [allStudentAttributes, setAllStudentAttributes] = useState<StudentAttributes[]>(initialData.studentAttributes);

  const studentCountByClass = useMemo(() => {
    const counts: Record<string, number> = {};
    allEnrollments.forEach(e => {
        counts[e.classId] = (counts[e.classId] || 0) + 1;
    });
    return counts;
  }, [allEnrollments]);

  const homeroomTeacherByClass = useMemo(() => {
    const map = new Map<string, string>();
    allClasses.forEach(c => {
        if (c.homeroomTeacherEmails && c.homeroomTeacherEmails.length > 0) {
            const teacherNames = c.homeroomTeacherEmails
                .map(email => allUsers.find(u => u.email === email)?.thaiName)
                .filter(Boolean)
                .join(', ');
            map.set(c.classId, teacherNames);
        }
    });
    return map;
  }, [allClasses, allUsers]);

  const usersByStudentId = useMemo(() => {
    const map = new Map<string, User>();
    allUsers.forEach(u => {
        if (u.studentId) {
            map.set(u.studentId, u);
        }
    });
    return map;
  }, [allUsers]);

  const offeringDetails = useMemo(() => {
      const details: DataContextType['offeringDetails'] = {};
      allOfferings.forEach(offering => {
          details[offering.offeringId] = {
              subject: allSubjects.find(s => s.subjectId === offering.subjectId),
              classInfo: allClasses.find(c => c.classId === offering.classId),
              teacher: allUsers.find(u => u.email === offering.teacherEmail),
          };
      });
      return details;
  }, [allOfferings, allSubjects, allClasses, allUsers]);

  const actions = {
    // User Actions
    addUser: (user: User) => setAllUsers(prev => [...prev, user]),
    updateUser: (userId: string, updatedData: Partial<User>) => setAllUsers(prev => prev.map(u => u.userId === userId ? { ...u, ...updatedData } : u)),
    deleteUser: (userId: string) => setAllUsers(prev => prev.filter(u => u.userId !== userId)),
    importUsers: (newUsers: User[]) => {
        let importedCount = 0;
        let conflictCount = 0;
        const existingEmails = new Set(allUsers.map(u => u.email.toLowerCase()));
        const uniqueNewUsers = newUsers.filter(newUser => {
            const isConflict = existingEmails.has(newUser.email.toLowerCase());
            if (isConflict) {
                conflictCount++;
                return false;
            }
            return true;
        });

        if (uniqueNewUsers.length > 0) {
            setAllUsers(prev => [...prev, ...uniqueNewUsers]);
            importedCount = uniqueNewUsers.length;
        }
        return { importedCount, conflictCount };
    },

    // Student Actions
    addStudent: (student: Student) => setAllStudents(prev => [...prev, student]),
    updateStudent: (studentId: string, updatedData: Partial<Student>) => setAllStudents(prev => prev.map(s => s.studentId === studentId ? { ...s, ...updatedData } : s)),
    deleteStudent: (studentId: string) => setAllStudents(prev => prev.filter(s => s.studentId !== studentId)),
    importStudents: (data: { newUsers: User[], newStudents: Student[], newEnrollments: Enrollment[] }) => {
        const { newUsers, newStudents, newEnrollments } = data;
        const existingUserEmails = new Set(allUsers.map(u => u.email.toLowerCase()));
        const existingStudentIds = new Set(allStudents.map(s => s.studentId));

        const uniqueNewUsers = newUsers.filter(u => !existingUserEmails.has(u.email.toLowerCase()));
        const uniqueNewStudents = newStudents.filter(s => !existingStudentIds.has(s.studentId));
        
        let conflicts = newUsers.length - uniqueNewUsers.length + (newStudents.length - uniqueNewStudents.length);
        
        const validUserStudentIds = new Set(uniqueNewUsers.map(u => u.studentId));
        const validStudentIds = new Set(uniqueNewStudents.map(s => s.studentId));

        const finalNewEnrollments = newEnrollments.filter(e => validUserStudentIds.has(e.studentId) && validStudentIds.has(e.studentId));
        
        if (uniqueNewUsers.length > 0) setAllUsers(prev => [...prev, ...uniqueNewUsers]);
        if (uniqueNewStudents.length > 0) setAllStudents(prev => [...prev, ...uniqueNewStudents]);
        if (finalNewEnrollments.length > 0) setAllEnrollments(prev => [...prev, ...finalNewEnrollments]);
        
        return { importedCount: finalNewEnrollments.length, conflicts };
    },
    
    // Class Actions
    addClass: (classData: Class) => setAllClasses(prev => [...prev, classData]),
    updateClass: (classId: string, updatedData: Partial<Class>) => setAllClasses(prev => prev.map(c => c.classId === classId ? { ...c, ...updatedData } : c)),
    deleteClass: (classId: string) => {
        setAllEnrollments(prev => prev.filter(e => e.classId !== classId));
        setAllClasses(prev => prev.filter(c => c.classId !== classId));
    },

    // Offering Actions
    addOffering: (offering: Offering) => setAllOfferings(prev => [...prev, offering]),
    updateOffering: (offeringId: string, updatedData: Partial<Offering>) => setAllOfferings(prev => prev.map(o => o.offeringId === offeringId ? { ...o, ...updatedData } : o)),
    deleteOffering: (offeringId: string) => setAllOfferings(prev => prev.filter(o => o.offeringId !== offeringId)),

    // Subject Actions
    addSubject: (subject: Subject) => setAllSubjects(prev => [...prev, subject]),
    updateSubject: (subjectId: string, updatedData: Partial<Subject>) => setAllSubjects(prev => prev.map(s => s.subjectId === subjectId ? { ...s, ...updatedData } : s)),
    deleteSubject: (subjectId: string) => setAllSubjects(prev => prev.filter(s => s.subjectId !== subjectId)),
    importSubjects: (newSubjects: Subject[]) => {
        const existingCodes = new Set(allSubjects.map(s => s.subjectCode.toLowerCase()));
        let conflictCount = 0;
        const uniqueNewSubjects = newSubjects.filter(subject => {
            const isConflict = existingCodes.has(subject.subjectCode.toLowerCase());
            if (isConflict) {
                conflictCount++;
                return false;
            }
            return true;
        });

        if (uniqueNewSubjects.length > 0) {
            setAllSubjects(prev => [...prev, ...uniqueNewSubjects]);
        }
        return { importedCount: uniqueNewSubjects.length, conflictCount };
    },

    // Schedule Actions
    addSchedule: (schedule: Schedule) => {
        const offering = allOfferings.find(o => o.offeringId === schedule.offeringId);
        if (!offering) return { success: false, error: 'Offering not found' };

        const teacherSchedules = allSchedules.filter(s => allOfferings.find(o => o.offeringId === s.offeringId)?.teacherEmail === offering.teacherEmail);
        if (teacherSchedules.some(s => s.dayOfWeek === schedule.dayOfWeek && s.period === schedule.period)) {
            const teacher = allUsers.find(u => u.email === offering.teacherEmail);
            return { success: false, error: 'ตารางสอนซ้ำซ้อน (ครู)', description: `ครู ${teacher?.thaiName} มีคาบสอนแล้วในวันและเวลาดังกล่าว` };
        }

        const classSchedules = allSchedules.filter(s => allOfferings.find(o => o.offeringId === s.offeringId)?.classId === offering.classId);
        if (classSchedules.some(s => s.dayOfWeek === schedule.dayOfWeek && s.period === schedule.period)) {
            const conflictingOffering = allOfferings.find(o => o.offeringId === classSchedules.find(s => s.dayOfWeek === schedule.dayOfWeek && s.period === schedule.period)!.offeringId);
            const conflictingSubject = allSubjects.find(s => s.subjectId === conflictingOffering?.subjectId);
            return { success: false, error: 'ตารางสอนซ้ำซ้อน (ห้องเรียน)', description: `ห้องเรียนนี้มีคาบสอนวิชา "${conflictingSubject?.subjectNameTh}" ในวันและเวลาดังกล่าวแล้ว` };
        }

        setAllSchedules(prev => [...prev, schedule]);
        return { success: true };
    },
    addSchedules: (schedules: Schedule[]) => setAllSchedules(prev => [...prev, ...schedules]),
    deleteSchedule: (scheduleId: string) => setAllSchedules(prev => prev.filter(s => s.scheduleId !== scheduleId)),
    importSchedules: (newSchedules: Schedule[]) => {
        let conflictCount = 0;
        let importedCount = 0;
        let currentSchedules = [...allSchedules];

        newSchedules.forEach(ns => {
            const offering = allOfferings.find(o => o.offeringId === ns.offeringId);
            if (!offering) return;

            const teacherConflict = currentSchedules.some(s => allOfferings.find(o => o.offeringId === s.offeringId)?.teacherEmail === offering.teacherEmail && s.dayOfWeek === ns.dayOfWeek && s.period === ns.period);
            const classConflict = currentSchedules.some(s => allOfferings.find(o => o.offeringId === s.offeringId)?.classId === offering.classId && s.dayOfWeek === ns.dayOfWeek && s.period === ns.period);
            
            if (teacherConflict || classConflict) {
                conflictCount++;
            } else {
                currentSchedules.push(ns);
                importedCount++;
            }
        });
        setAllSchedules(currentSchedules);
        return { importedCount, conflictCount };
    },

    // Score Actions
    addScores: (scores: Score[]) => setAllScores(prev => [...prev, ...scores]),
    updateScores: (scoresToUpdate: Score[]) => {
        setAllScores(prev => {
            const updatedScoresMap = new Map(scoresToUpdate.map(s => [s.scoreId, s]));
            return prev.map(s => updatedScoresMap.has(s.scoreId) ? updatedScoresMap.get(s.scoreId)! : s);
        });
    },

    // Student Attribute Actions
    updateStudentAttributes: (attributes: StudentAttributes[]) => {
      setAllStudentAttributes(prev => {
          const newAttributesMap = new Map(attributes.map(a => [a.studentId, a]));
          const updatedAttributes = prev.map(attr => 
              newAttributesMap.has(attr.studentId) ? newAttributesMap.get(attr.studentId)! : attr
          );
          attributes.forEach(attr => {
              if (!prev.some(p => p.studentId === attr.studentId)) {
                  updatedAttributes.push(attr);
              }
          });
          return updatedAttributes;
      });
    },

    // Getter functions
    getOfferingsForTeacher: (teacherEmail: string) => {
      return allOfferings
            .filter(o => o.teacherEmail === teacherEmail)
            .map(o => {
                const subject = allSubjects.find(s => s.subjectId === o.subjectId);
                const classInfo = allClasses.find(c => c.classId === o.classId);
                return {
                    ...o,
                    subjectName: subject?.subjectNameTh || 'N/A',
                    subjectCode: subject?.subjectCode || 'N/A',
                    className: `ห้อง ${classInfo?.level}/${classInfo?.room}` || 'N/A',
                    termDisplay: o.termLabel.includes('/') ? ` (เทอม ${o.termLabel})` : ''
                }
            }).sort((a,b) => b.yearBe - a.yearBe || a.subjectName.localeCompare(b.subjectName));
    },

    getStudentsInClass: (classId: string) => {
        const studentIdsInClass = allEnrollments
            .filter(e => e.classId === classId)
            .map(e => e.studentId);
            
        return allStudents
            .filter(s => studentIdsInClass.includes(s.studentId))
            .sort((a, b) => (a.classNumber || 999) - (b.classNumber || 999));
    }
  };

  const value: DataContextType = {
    allUsers,
    allStudents,
    allClasses,
    allEnrollments,
    allSubjects,
    allOfferings,
    allScores,
    allSchedules,
    allStudentAttributes,
    gradeScale: initialData.gradeScale,
    studentCountByClass,
    homeroomTeacherByClass,
    usersByStudentId,
    offeringDetails,
    actions,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
