
"use client";

import { useState, ChangeEvent } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, UserSquare, Upload, Download, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { schedules as initialSchedules, offerings, subjects, classes, users } from '@/lib/data';
import type { DayOfWeek, Schedule, Offering, Subject, Class as ClassType, User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


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

function TeacherScheduleTable({ 
    teacherEmail, 
    schedules, 
    onDelete 
}: { 
    teacherEmail: string, 
    schedules: Schedule[],
    onDelete: (scheduleId: string) => void,
}) {
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
            <div className="text-xs p-1 bg-primary/10 rounded-md relative group h-full">
                <p className="font-bold truncate">{subject?.subjectCode}</p>
                <p className="truncate">{subject?.subjectNameTh}</p>
                <p className="truncate">ห้อง {classInfo?.level}/{classInfo?.room}</p>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                         <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>ยืนยันการลบคาบสอน</AlertDialogTitle>
                            <AlertDialogDescription>
                                คุณแน่ใจหรือไม่ว่าต้องการลบคาบสอน "{subject?.subjectNameTh}" ของครู {users.find(u => u.email === teacherEmail)?.thaiName}?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(scheduleEntry.scheduleId)}>ยืนยัน</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
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
                                    <TableCell key={day.value} className="p-1 border-r align-top h-[80px]">
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


function AddScheduleDialog({ onAddSchedule }: { onAddSchedule: (schedule: Schedule) => void }) {
    const [open, setOpen] = useState(false);
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

        const newSchedule: Schedule = {
            scheduleId: `sch${Date.now()}`,
            offeringId: selectedOfferingId,
            dayOfWeek: selectedDay as DayOfWeek,
            period: Number(selectedPeriod),
        };

        onAddSchedule(newSchedule);
        
        setOpen(false);
        // Reset form
        setSelectedOfferingId('');
        setSelectedDay('');
        setSelectedPeriod('');
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
                        <Select value={selectedOfferingId} onValueChange={setSelectedOfferingId}>
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
                        <Select value={selectedDay} onValueChange={setSelectedDay}>
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
                        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
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
                 <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">ยกเลิก</Button>
                    </DialogClose>
                     <Button type="button" onClick={handleSave}>บันทึกข้อมูล</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function ImportSchedulesCard({ onSchedulesImported }: { onSchedulesImported: (newSchedules: Schedule[]) => void }) {
    const { toast } = useToast();
    const fileInputRef = useState<HTMLInputElement>(null);

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
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            try {
                const lines = text.split('\n').slice(1); // Skip header
                const newSchedules: Schedule[] = [];
                let importedCount = 0;

                lines.forEach((line, index) => {
                    if (line.trim() === '') return;
                    const [offeringId, dayOfWeek, periodStr] = line.split(',');
                    
                    const period = Number(periodStr.trim());
                    const validOffering = offerings.some(o => o.offeringId === offeringId.trim());
                    const validDay = daysOfWeek.some(d => d.value === dayOfWeek.trim());
                    const validPeriod = periods.some(p => p.period === period);

                    if (validOffering && validDay && validPeriod) {
                        newSchedules.push({
                            scheduleId: `csv-import-${Date.now()}-${index}`,
                            offeringId: offeringId.trim(),
                            dayOfWeek: dayOfWeek.trim() as DayOfWeek,
                            period: period,
                        });
                        importedCount++;
                    }
                });

                if (importedCount > 0) {
                    onSchedulesImported(newSchedules);
                    
                } else {
                     toast({
                        variant: 'destructive',
                        title: 'ไม่พบข้อมูลที่ถูกต้อง',
                        description: 'ไม่พบข้อมูลตารางสอนที่ถูกต้องในไฟล์ CSV',
                    });
                }
            } catch (error) {
                 toast({
                    variant: 'destructive',
                    title: 'ไฟล์ไม่ถูกต้อง',
                    description: 'ไม่สามารถประมวลผลไฟล์ CSV ได้ โปรดตรวจสอบรูปแบบไฟล์',
                });
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>นำเข้าตารางสอน (CSV)</CardTitle>
                <CardDescription>
                    เพิ่มหรืออัปเดตข้อมูลตารางสอนจำนวนมากผ่านไฟล์ CSV
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-semibold">ดาวน์โหลดเทมเพลต</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                        ดาวน์โหลดไฟล์ตัวอย่างเพื่อดูรูปแบบข้อมูลที่ถูกต้อง (คอลัมน์: offeringId, dayOfWeek, period)
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
                     <Input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept=".csv"
                        onChange={handleFileChange}
                    />
                </div>
            </CardContent>
        </Card>
    );
}


export default function AdminSchedulesPage() {
    const [allSchedules, setAllSchedules] = useState<Schedule[]>(initialSchedules);
    const [selectedTeacherEmail, setSelectedTeacherEmail] = useState<string>('');
    const allTeachers = users.filter(u => u.role === 'TEACHER');
    const selectedTeacher = allTeachers.find(t => t.email === selectedTeacherEmail);
    const { toast } = useToast();

    const handleAddSchedule = (schedule: Schedule) => {
        const offering = offerings.find(o => o.offeringId === schedule.offeringId);
        if (!offering) return;

        const teacherForOffering = offering.teacherEmail;

        const teacherSchedules = allSchedules.filter(s => {
            const schOffering = offerings.find(o => o.offeringId === s.offeringId);
            return schOffering?.teacherEmail === teacherForOffering;
        });

        const conflict = teacherSchedules.some(s => s.dayOfWeek === schedule.dayOfWeek && s.period === schedule.period);

        if (conflict) {
            toast({
                variant: 'destructive',
                title: 'ตารางสอนซ้ำซ้อน',
                description: `ครู ${users.find(u => u.email === teacherForOffering)?.thaiName} มีคาบสอนแล้วในวันและเวลาดังกล่าว`,
            });
            return;
        }

        setAllSchedules(prev => [...prev, schedule]);
        toast({
            title: 'บันทึกสำเร็จ',
            description: 'เพิ่มคาบสอนใหม่ในตารางเรียบร้อยแล้ว',
        });
    }
    
    const handleDeleteSchedule = (scheduleId: string) => {
        setAllSchedules(prev => prev.filter(s => s.scheduleId !== scheduleId));
        toast({
            title: 'ลบสำเร็จ',
            description: 'คาบสอนได้ถูกลบออกจากตารางแล้ว',
        })
    }

    const handleSchedulesImport = (newSchedules: Schedule[]) => {
        const schedulesWithConflicts: Schedule[] = [];
        const uniqueNewSchedules: Schedule[] = [];

        newSchedules.forEach(ns => {
            const offering = offerings.find(o => o.offeringId === ns.offeringId);
            if (!offering) return;
            const teacherEmail = offering.teacherEmail;

            const hasConflict = allSchedules.some(s => {
                 const existingOffering = offerings.find(o => o.offeringId === s.offeringId);
                 return existingOffering?.teacherEmail === teacherEmail && s.dayOfWeek === ns.dayOfWeek && s.period === ns.period;
            });
            
            if (hasConflict) {
                schedulesWithConflicts.push(ns);
            } else {
                uniqueNewSchedules.push(ns);
            }
        });

        if (schedulesWithConflicts.length > 0) {
            toast({
                variant: "destructive",
                title: "ตรวจพบข้อมูลซ้ำซ้อน",
                description: `ไม่สามารถนำเข้า ${schedulesWithConflicts.length} รายการ เนื่องจากครูมีคาบสอนในเวลาดังกล่าวแล้ว`
            });
        }
        
        if (uniqueNewSchedules.length > 0) {
            setAllSchedules(prevSchedules => [...prevSchedules, ...uniqueNewSchedules]);
            toast({
                title: 'อัปโหลดสำเร็จ',
                description: `นำเข้าตารางสอนใหม่ ${uniqueNewSchedules.length} รายการ`,
            });
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">จัดตารางสอนครู</h1>
                    <p className="text-muted-foreground">ดูและจัดการตารางสอนสำหรับครูแต่ละคน</p>
                </div>
                <AddScheduleDialog onAddSchedule={handleAddSchedule} />
            </div>

            <ImportSchedulesCard onSchedulesImported={handleSchedulesImport} />

             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserSquare />
                        ตารางสอนรายบุคคล
                    </CardTitle>
                    <CardDescription>
                        เลือกคุณครูที่ต้องการดูตารางสอน (คุณสามารถลบคาบสอนได้โดยการคลิกที่ไอคอนถังขยะ)
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
                           ภาพรวมคาบสอนทั้งหมดในสัปดาห์ (คลิกที่คาบสอนเพื่อลบ)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TeacherScheduleTable 
                            teacherEmail={selectedTeacher.email} 
                            schedules={allSchedules}
                            onDelete={handleDeleteSchedule}
                        />
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
