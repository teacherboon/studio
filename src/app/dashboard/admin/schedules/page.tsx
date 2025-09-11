
"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, UserSquare, Upload, Download } from "lucide-react";
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
import { TeacherScheduleTable } from '@/app/dashboard/admin/teachers/page';

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

function ImportSchedulesCard() {
    const { toast } = useToast();

    const handleDownloadTemplate = () => {
        const header = 'offeringId,dayOfWeek,period\n';
        const sampleData = 'off1,MONDAY,1\n';
        
        const csvContent = "\uFEFF" + header + sampleData;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `schedules_import_template.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleUploadClick = () => {
        toast({
            title: 'ฟังก์ชันยังไม่พร้อมใช้งาน',
            description: 'การอัปโหลดไฟล์ CSV ยังไม่สามารถใช้งานได้ในเวอร์ชันนี้',
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>นำเข้าตารางสอน (CSV)</CardTitle>
                <CardDescription>
                    เพิ่มข้อมูลตารางสอนจำนวนมากผ่านไฟล์ CSV
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-semibold">ดาวน์โหลดเทมเพลต</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                        ดาวน์โหลดไฟล์ตัวอย่างเพื่อดูรูปแบบข้อมูลที่ถูกต้อง
                    </p>
                    <Button variant="outline" onClick={handleDownloadTemplate}>
                        <Download className="mr-2"/> เทมเพลตสำหรับตารางสอน
                    </Button>
                </div>
                <div>
                    <h4 className="font-semibold">อัปโหลดไฟล์</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                        เลือกไฟล์ CSV ที่กรอกข้อมูลเรียบร้อยแล้วเพื่อนำเข้าสู่ระบบ
                    </p>
                    <Button onClick={handleUploadClick}>
                        <Upload className="mr-2"/> เลือกไฟล์เพื่ออัปโหลด
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}


export default function AdminSchedulesPage() {
    const [selectedTeacherEmail, setSelectedTeacherEmail] = useState<string>('');
    const allTeachers = users.filter(u => u.role === 'TEACHER');
    const selectedTeacher = allTeachers.find(t => t.email === selectedTeacherEmail);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">จัดตารางสอนครู</h1>
                    <p className="text-muted-foreground">ดูและจัดการตารางสอนสำหรับครูแต่ละคน</p>
                </div>
                <AddScheduleDialog />
            </div>

            <ImportSchedulesCard />

             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserSquare />
                        ตารางสอนรายบุคคล
                    </CardTitle>
                    <CardDescription>
                        เลือกคุณครูที่ต้องการดูตารางสอน
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <Select onValueChange={setSelectedTeacherEmail} value={selectedTeacherEmail}>
                        <SelectTrigger className="w-full md:w-[320px]">
                            <SelectValue placeholder="เลือกคุณครู..." />
                        </SelectTrigger>
                        <SelectContent>
                            {allTeachers.map(t => (
                                <SelectItem key={t.userId} value={t.email}>
                                    {t.thaiName} ({t.email})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {selectedTeacher && (
                <Card>
                    <CardHeader>
                        <CardTitle>
                           ตารางสอนของ {selectedTeacher.thaiName}
                        </CardTitle>
                        <CardDescription>
                           ภาพรวมคาบสอนทั้งหมดในสัปดาห์
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TeacherScheduleTable teacherEmail={selectedTeacher.email} />
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
