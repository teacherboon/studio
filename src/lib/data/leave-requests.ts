import type { LeaveRequest } from '../types';

export const leaveRequests: LeaveRequest[] = [
    {
        leaveRequestId: 'lr1',
        teacherEmail: 'teacher.a@school.ac.th',
        leaveType: 'PERSONAL',
        leaveDate: '2024-07-29', // A Monday
        periods: [1],
        reason: 'ธุระส่วนตัว',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
    }
];
