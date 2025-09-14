import type { Schedule } from '../types';

export const schedules: Schedule[] = [
    // Teacher A, P.1/1 (class1)
    { scheduleId: 'sch1', offeringId: 'off1', dayOfWeek: 'MONDAY', period: 1 },
    { scheduleId: 'sch2', offeringId: 'off1', dayOfWeek: 'TUESDAY', period: 2 },
    { scheduleId: 'sch3', offeringId: 'off2', dayOfWeek: 'WEDNESDAY', period: 3 },
    { scheduleId: 'sch4', offeringId: 'off3', dayOfWeek: 'FRIDAY', period: 4 },

    // Teacher B, P.2/1 (class2)
    { scheduleId: 'sch5', offeringId: 'off4', dayOfWeek: 'MONDAY', period: 2 },
    { scheduleId: 'sch6', offeringId: 'off5', dayOfWeek: 'TUESDAY', period: 1 },

    // Teacher B, P.1/1 (class1) Science
    { scheduleId: 'sch7', offeringId: 'off6', dayOfWeek: 'THURSDAY', period: 5 },
];
