"use client";

import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { schedules, offerings, subjects, classes, users } from '@/lib/data';
import type { DayOfWeek } from '@/lib/types';
import { useUser } from '@/hooks/use-user';
import { Skeleton } from '@/components/ui/skeleton';

const daysOfWeek: { value: DayOfWeek; label: string }[] = [
    { value: 'MONDAY', label: 'วันจันทร์' },
    { value: 'TUESDAY', label: 'วันอังคาร' },
    { value: 'WEDNESDAY', label: 'วันพุธ' },
    { value: 'THURSDAY', label: 'วันพฤหัสบดี' },
    { value: 'FRIDAY', label: 'วันศุกร์' },
];

const periods = [
    { period: 1, time: '8:30-9:30' },
    { period: 2, time: '9:30-10:30' },
    { period: 3, time: '10:30-11:30' },
    { period: null, time: '11:30-12:30' }, // Lunch Break
    { period: 4, time: '12:30-13:30' },
    { period: 5, time: '13:30-14:30' },
    { period: 6, time: '14:30-15:30' },
];

function TeacherScheduleTable({ teacherEmail }: { teacherEmail: string }) {
    const getScheduleForCell = (day: DayOfWeek, period: number) => {
        const offeringForTeacher = offerings.filter(o => o.teacherEmail === teacherEmail);
        const scheduleEntry = schedules.find(s => 
            s.dayOfWeek === day && 
            s.period === period &&
            offeringForTeacher.some(o => o.offeringId === s.offeringId)
        );

        if (!scheduleEntry) return null;

        const offering = offerings.find(o => o.offeringId === scheduleEntry.offeringId);
        if (!offering) return null;

        const subject = subjects.find(s => s.subjectId === offering.subjectId);
        const classInfo = classes.find(c => c.classId === offering.classId);

        return (
            <div className="text-xs p-1 bg-primary/10 rounded-md">
                <p className="font-bold truncate">{subject?.subjectCode}</p>
                <p className="truncate">{subject?.subjectNameTh}</p>
                <p className="truncate">ห้อง {classInfo?.level}/{classInfo?.room}</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <Table className="border min-w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[120px] border-r text-center">เวลา</TableHead>
                        <TableHead className="w-[80px] border-r text-center">คาบที่</TableHead>
                        {daysOfWeek.map(day => <TableHead key={day.value} className="text-center border-r min-w-[150px]">{day.label}</TableHead>)}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {periods.map(({ period, time }, index) => (
                        period ? (
                            <TableRow key={period}>
                                <TableCell className="font-medium border-r text-center">{time}</TableCell>
                                <TableCell className="font-medium border-r text-center">{period}</TableCell>
                                {daysOfWeek.map(day => (
                                    <TableCell key={day.value} className="p-1 border-r align-top h-[70px]">
                                        {getScheduleForCell(day.value, period)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ) : (
                            <TableRow key={`break-${index}`} className="bg-muted/50">
                                <TableCell className="font-medium border-r text-center">{time}</TableCell>
                                <TableCell colSpan={daysOfWeek.length + 1} className="text-center font-semibold text-muted-foreground">
                                    พักกลางวัน
                                </TableCell>
                            </TableRow>
                        )
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default function TeacherSchedulePage() {
    const user = useUser();
    
    if (!user) {
        return (
            <div className="space-y-8">
                 <div>
                    <Skeleton className="h-9 w-64 mb-2" />
                    <Skeleton className="h-5 w-80" />
                </div>
                <Card>
                    <CardHeader><Skeleton className="h-8 w-48 mb-4"/><Skeleton className="h-5 w-64"/></CardHeader>
                    <CardContent><Skeleton className="h-64 w-full" /></CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-8">
             <div>
                <h1 className="text-3xl font-bold font-headline">ตารางสอน</h1>
                <p className="text-muted-foreground">ดูตารางสอนประจำสัปดาห์ของคุณ</p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>ตารางสอนของ {user.thaiName}</CardTitle>
                    <CardDescription>
                       ภาพรวมคาบสอนทั้งหมดในสัปดาห์นี้
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <TeacherScheduleTable teacherEmail={user.email} />
                </CardContent>
            </Card>
        </div>
    )
}
