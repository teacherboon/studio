
"use client";

import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { schedules, offerings, subjects, classes, users, students } from '@/lib/data';
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

function ScheduleTable({ classId }: { classId: string | undefined}) {
    const getScheduleForCell = (day: DayOfWeek, period: number) => {
        const offeringInClass = offerings.filter(o => o.classId === classId);
        const scheduleEntry = schedules.find(s => 
            s.dayOfWeek === day && 
            s.period === period &&
            offeringInClass.some(o => o.offeringId === s.offeringId)
        );

        if (!scheduleEntry) return null;

        const offering = offerings.find(o => o.offeringId === scheduleEntry.offeringId);
        if (!offering) return null;

        const subject = subjects.find(s => s.subjectId === offering.subjectId);
        const teacher = users.find(u => u.email === offering.teacherEmail);

        return (
            <div className="text-xs p-1 bg-primary/10 rounded-md">
                <p className="font-bold truncate">{subject?.subjectNameTh}</p>
                <p className="truncate">อ. {teacher?.thaiName.split(' ')[0]}</p>
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

export default function StudentSchedulePage() {
    const user = useUser();
    
    const studentData = useMemo(() => {
        if (!user || !user.studentId) return null;
        return students.find(s => s.studentId === user.studentId);
    }, [user]);

    const currentClass = useMemo(() => {
        if (!studentData) return null;
        return classes.find(c => c.level === studentData.level && c.room === studentData.room && c.isActive);
    }, [studentData]);

    if (!user || !studentData || !currentClass) {
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
                    <CardTitle>ตารางสอนห้อง {currentClass.level}/{currentClass.room}</CardTitle>
                    <CardDescription>
                       ปีการศึกษา {currentClass.yearBe}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ScheduleTable classId={currentClass.classId} />
                </CardContent>
            </Card>
        </div>
    )
}
