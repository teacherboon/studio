
"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { schedules, offerings, subjects, classes, users } from '@/lib/data';
import type { DayOfWeek } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

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

function ScheduleTable() {
    const getScheduleForCell = (day: DayOfWeek, period: number) => {
        const scheduleEntry = schedules.find(s => s.dayOfWeek === day && s.period === period);
        if (!scheduleEntry) return null;

        const offering = offerings.find(o => o.offeringId === scheduleEntry.offeringId);
        if (!offering) return null;

        const subject = subjects.find(s => s.subjectId === offering.subjectId);
        const classInfo = classes.find(c => c.classId === offering.classId);
        const teacher = users.find(u => u.email === offering.teacherEmail);

        return (
            <div className="text-xs p-1 bg-primary/10 rounded-md">
                <p className="font-bold truncate">{subject?.subjectCode}</p>
                <p className="truncate">อ. {teacher?.thaiName.split(' ')[0]}</p>
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

function AddScheduleDialog() {
    const classOfferings = offerings;
    const { toast } = useToast();
    const [selectedOfferingId, setSelectedOfferingId] = useState('');
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('');

    const handleSave = () => {
        if (!selectedOfferingId || !selectedDay || !selectedPeriod) {
            toast({
                variant: 'destructive',
                title: 'ข้อมูลไม่ครบถ้วน',
                description: 'กรุณาเลือกข้อมูลให้ครบทุกช่อง',
            });
            return;
        }

        const offering = offerings.find(o => o.offeringId === selectedOfferingId);
        if (!offering) return;

        // Check if teacher is already scheduled
        const teacherSchedules = schedules.filter(s => {
            const schOffering = offerings.find(o => o.offeringId === s.offeringId);
            return schOffering?.teacherEmail === offering.teacherEmail;
        });

        const conflict = teacherSchedules.find(s => s.dayOfWeek === selectedDay && s.period === Number(selectedPeriod));

        if (conflict) {
            toast({
                variant: 'destructive',
                title: 'ตารางสอนซ้ำซ้อน',
                description: `ครู ${users.find(u => u.email === offering.teacherEmail)?.thaiName} มีคาบสอนแล้วในวันและเวลาดังกล่าว`,
            });
            return;
        }

        // Add new schedule (in a real app, this would be an API call)
        console.log('Saving schedule:', { selectedOfferingId, selectedDay, selectedPeriod });
        toast({
            title: 'บันทึกสำเร็จ',
            description: 'เพิ่มคาบสอนใหม่ในตารางเรียบร้อยแล้ว (จำลอง)',
        });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2" />
                    เพิ่มคาบสอน
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>เพิ่มคาบสอนในตาราง</DialogTitle>
                    <DialogDescription>
                        เลือกวิชาที่เปิดสอน, วัน, และคาบเรียน
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="offering" className="text-right">
                            วิชาที่เปิดสอน
                        </Label>
                        <Select onValueChange={setSelectedOfferingId}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="เลือกวิชาที่เปิดสอน" />
                            </SelectTrigger>
                            <SelectContent>
                                {classOfferings.map(o => {
                                    const subject = subjects.find(s => s.subjectId === o.subjectId);
                                    const classInfo = classes.find(c => c.classId === o.classId);
                                    const teacher = users.find(u => u.email === o.teacherEmail);
                                    return (
                                        <SelectItem key={o.offeringId} value={o.offeringId}>
                                            {subject?.subjectCode} (อ. {teacher?.thaiName}) - ห้อง {classInfo?.level}/{classInfo?.room}
                                        </SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="day" className="text-right">
                            วัน
                        </Label>
                        <Select onValueChange={setSelectedDay}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="เลือกวัน" />
                            </SelectTrigger>
                            <SelectContent>
                                {daysOfWeek.map(d => (
                                    <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="period" className="text-right">
                            คาบเรียน
                        </Label>
                        <Select onValueChange={setSelectedPeriod}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="เลือกคาบเรียน" />
                            </SelectTrigger>
                            <SelectContent>
                                {periods.map(p => (
                                    p.period && <SelectItem key={p.period} value={String(p.period)}>คาบที่ {p.period}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Button type="submit" className="w-full" onClick={handleSave}>บันทึกข้อมูล</Button>
            </DialogContent>
        </Dialog>
    );
}

export default function AdminSchedulesPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">จัดการตารางสอน</h1>
                    <p className="text-muted-foreground">จัดตารางสอนสำหรับครู, วิชา, และห้องเรียน</p>
                </div>
                <AddScheduleDialog />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>ตารางสอนรวม</CardTitle>
                    <CardDescription>
                        ภาพรวมตารางสอนทั้งหมดในสัปดาห์
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ScheduleTable />
                </CardContent>
            </Card>
        </div>
    )
}
