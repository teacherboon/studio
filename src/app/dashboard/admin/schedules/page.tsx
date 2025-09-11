
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

const daysOfWeek: { value: DayOfWeek; label: string }[] = [
    { value: 'MONDAY', label: 'วันจันทร์' },
    { value: 'TUESDAY', label: 'วันอังคาร' },
    { value: 'WEDNESDAY', label: 'วันพุธ' },
    { value: 'THURSDAY', label: 'วันพฤหัสบดี' },
    { value: 'FRIDAY', label: 'วันศุกร์' },
];

const periods = Array.from({ length: 8 }, (_, i) => i + 1); // 8 periods

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
            <Table className="border">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px] border-r">คาบ/วัน</TableHead>
                        {daysOfWeek.map(day => <TableHead key={day.value} className="text-center border-r">{day.label}</TableHead>)}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {periods.map(period => (
                        <TableRow key={period}>
                            <TableCell className="font-medium border-r text-center">{period}</TableCell>
                            {daysOfWeek.map(day => (
                                <TableCell key={day.value} className="p-1 border-r align-top h-[70px]">
                                    {getScheduleForCell(day.value, period)}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}


export default function AdminSchedulesPage() {
    const classOfferings = offerings; // In a real app, you'd filter by term

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">จัดการตารางสอน</h1>
                    <p className="text-muted-foreground">จัดตารางสอนสำหรับครู, วิชา, และห้องเรียน</p>
                </div>
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
                         <Select>
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
                        <Select>
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
                        <Select>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="เลือกคาบเรียน" />
                            </SelectTrigger>
                            <SelectContent>
                                {periods.map(p => (
                                    <SelectItem key={p} value={String(p)}>คาบที่ {p}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                      </div>
                    </div>
                     <Button type="submit" className="w-full">บันทึกข้อมูล</Button>
                  </DialogContent>
                </Dialog>
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
