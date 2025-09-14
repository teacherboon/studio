import type { Schedule } from '../types';

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
