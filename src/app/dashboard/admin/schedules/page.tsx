
"use client";

import { useState, ChangeEvent, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, UserSquare, Upload, Download, Trash2, CheckCircle, AlertCircle, Wand, Loader2 } from "lucide-react";
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
import { schedules as initialSchedules, offerings as initialOfferings, subjects, classes, users } from '@/lib/data';
import type { DayOfWeek, Schedule, Offering, Subject, Class as ClassType, User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { autoSchedule, AutoScheduleOutput } from '@/ai/flows/auto-schedule-flow';


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

function ScheduleSummaryCard({ schedules, offerings }: { schedules: Schedule[], offerings: Offering[] }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    
    const summaryData = useMemo(() => {
        return offerings.map(offering => {
            const requiredPeriods = offering.periodsPerWeek || 0;
            const scheduledPeriods = schedules.filter(s => s.offeringId === offering.offeringId).length;
            const remaining = requiredPeriods - scheduledPeriods;
            
            const subject = subjects.find(s => s.subjectId === offering.subjectId);
            const classInfo = classes.find(c => c.classId === offering.classId);
            const teacher = users.find(u => u.email === offering.teacherEmail);

            return {
                offeringId: offering.offeringId,
                subjectName: subject?.subjectNameTh || 'N/A',
                className: `${classInfo?.level}/${classInfo?.room}`,
                teacherName: teacher?.thaiName || 'N/A',
                requiredPeriods,
                scheduledPeriods,
                remaining,
            }
        }).sort((a, b) => {
            if (a.remaining > 0 && b.remaining <= 0) return -1;
            if (b.remaining > 0 && a.remaining <= 0) return 1;
            return b.remaining - a.remaining;
        });
    }, [schedules, offerings]);

    const paginatedData = summaryData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const totalPages = Math.ceil(summaryData.length / itemsPerPage);


     return (
        <Card>
            <CardHeader>
                <CardTitle>สรุปการจัดตารางสอน</CardTitle>
                <CardDescription>
                    ตรวจสอบว่ารายวิชาทั้งหมดได้ถูกจัดคาบสอนครบถ้วนตามที่กำหนดหรือไม่ (รายวิชาที่ยังจัดไม่ครบจะแสดงก่อน)
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>รายวิชา</TableHead>
                            <TableHead>ห้อง</TableHead>
                            <TableHead>ครูผู้สอน</TableHead>
                            <TableHead className="text-center">คาบที่ต้องการ</TableHead>
                            <TableHead className="text-center">คาบที่จัดแล้ว</TableHead>
                            <TableHead className="text-center">คงเหลือ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.map(item => (
                            <TableRow key={item.offeringId}>
                                <TableCell>{item.subjectName}</TableCell>
                                <TableCell>{item.className}</TableCell>
                                <TableCell>{item.teacherName}</TableCell>
                                <TableCell className="text-center">{item.requiredPeriods}</TableCell>
                                <TableCell className="text-center">{item.scheduledPeriods}</TableCell>
                                <TableCell className={`text-center font-bold ${item.remaining > 0 ? 'text-destructive' : 'text-green-600'}`}>
                                    <div className="flex items-center justify-center gap-2">
                                        {item.remaining > 0 ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                                        {item.remaining}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
             <CardFooter className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                        หน้า {currentPage} จาก {totalPages}
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            ก่อนหน้า
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            ถัดไป
                        </Button>
                    </div>
                </CardFooter>
        </Card>
    );
}

function AutoScheduleCard({ 
    allSchedules,
    allOfferings,
    onSchedulesCreated 
}: { 
    allSchedules: Schedule[], 
    allOfferings: Offering[],
    onSchedulesCreated: (newSchedules: Schedule[]) => void,
}) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AutoScheduleOutput | null>(null);

    const handleAutoSchedule = async () => {
        setLoading(true);
        setResult(null);
        try {
            const classData = classes.map(c => ({ classId: c.classId, name: `${c.level}/${c.room}` }));
            const teacherData = users.filter(u => u.role === 'TEACHER').map(t => ({ email: t.email, name: t.thaiName }));
            const periodNumbers = periods.filter(p => p.period !== null).map(p => p.period as number);
            const dayValues = daysOfWeek.map(d => d.value);

            const response = await autoSchedule({
                offerings: allOfferings,
                existingSchedules: allSchedules,
                teachers: teacherData,
                classes: classData,
                periods: periodNumbers,
                days: dayValues,
            });

            setResult(response);
            if (response.newSchedules.length > 0) {
                onSchedulesCreated(response.newSchedules);
                 toast({
                    title: 'จัดตารางสอนอัตโนมัติสำเร็จ',
                    description: `สร้างคาบสอนใหม่ ${response.newSchedules.length} คาบ และพบ ${response.failedSchedules.length} รายการที่จัดไม่สำเร็จ`,
                });
            } else {
                 toast({
                    variant: 'destructive',
                    title: 'ไม่สามารถจัดตารางสอนเพิ่มเติมได้',
                    description: `ไม่พบช่องว่างสำหรับคาบสอนที่เหลือ หรือจัดครบหมดแล้ว`,
                });
            }
        } catch (error) {
            console.error("Error during auto-scheduling:", error);
            toast({
                variant: 'destructive',
                title: 'เกิดข้อผิดพลาด',
                description: 'ไม่สามารถจัดตารางสอนอัตโนมัติได้',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>จัดตารางสอนอัตโนมัติด้วย AI</CardTitle>
                <CardDescription>
                    คลิกปุ่มเพื่อให้ AI ช่วยจัดคาบสอนที่ยังว่างอยู่ทั้งหมดลงในตารางโดยอัตโนมัติ
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleAutoSchedule} disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 animate-spin" />
                            กำลังวิเคราะห์และจัดตาราง...
                        </>
                    ) : (
                        <>
                            <Wand className="mr-2" />
                            เริ่มจัดตารางสอนอัตโนมัติ
                        </>
                    )}
                </Button>

                {result && result.failedSchedules.length > 0 && (
                    <div className="mt-4">
                        <h4 className="font-semibold">รายการที่จัดไม่สำเร็จ:</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground mt-2">
                            {result.failedSchedules.map(fail => {
                                const offering = allOfferings.find(o => o.offeringId === fail.offeringId);
                                const subject = subjects.find(s => s.subjectId === offering?.subjectId);
                                const classInfo = classes.find(c => c.classId === offering?.classId);
                                return (
                                    <li key={fail.offeringId}>
                                        <strong>{subject?.subjectCode} (ห้อง {classInfo?.level}/{classInfo?.room}):</strong> {fail.reason}
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

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
        const offeringForTeacher = initialOfferings.filter(o => o.teacherEmail === teacherEmail);
        const scheduleEntry = schedules.find(s => 
            s.dayOfWeek === day && 
            s.period === period &&
            offeringForTeacher.some(o => o.offeringId === s.offeringId)
        );

        if (!scheduleEntry) return null;

        const offering = initialOfferings.find(o => o.offeringId === scheduleEntry.offeringId);
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


function AddScheduleDialog({ onAddSchedule, allSchedules }: { onAddSchedule: (schedule: Schedule) => void, allSchedules: Schedule[] }) {
    const [open, setOpen] = useState(false);
    const classOfferings = initialOfferings;
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
                    const validOffering = initialOfferings.some(o => o.offeringId === offeringId.trim());
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
        const offering = initialOfferings.find(o => o.offeringId === schedule.offeringId);
        if (!offering) return;

        const teacherForOffering = offering.teacherEmail;

        // Check for teacher conflict
        const teacherSchedules = allSchedules.filter(s => {
            const schOffering = initialOfferings.find(o => o.offeringId === s.offeringId);
            return schOffering?.teacherEmail === teacherForOffering;
        });

        const teacherConflict = teacherSchedules.some(s => s.dayOfWeek === schedule.dayOfWeek && s.period === schedule.period);

        if (teacherConflict) {
            toast({
                variant: 'destructive',
                title: 'ตารางสอนซ้ำซ้อน (ครู)',
                description: `ครู ${users.find(u => u.email === teacherForOffering)?.thaiName} มีคาบสอนแล้วในวันและเวลาดังกล่าว`,
            });
            return;
        }

        // Check for class conflict
         const classSchedules = allSchedules.filter(s => {
            const schOffering = initialOfferings.find(o => o.offeringId === s.offeringId);
            return schOffering?.classId === offering.classId;
        });

         const classConflict = classSchedules.some(s => s.dayOfWeek === schedule.dayOfWeek && s.period === schedule.period);

         if (classConflict) {
             const conflictingOffering = initialOfferings.find(o => o.offeringId === classSchedules.find(s => s.dayOfWeek === schedule.dayOfWeek && s.period === schedule.period)!.offeringId);
             const conflictingSubject = subjects.find(s => s.subjectId === conflictingOffering?.subjectId);
              toast({
                variant: 'destructive',
                title: 'ตารางสอนซ้ำซ้อน (ห้องเรียน)',
                description: `ห้องเรียนนี้มีคาบสอนวิชา "${conflictingSubject?.subjectNameTh}" ในวันและเวลาดังกล่าวแล้ว`,
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
        let schedulesWithConflicts: Schedule[] = [];
        let uniqueNewSchedules: Schedule[] = [];
        let currentSchedules = [...allSchedules];

        newSchedules.forEach(ns => {
            const offering = initialOfferings.find(o => o.offeringId === ns.offeringId);
            if (!offering) return;

            // Check teacher conflict
            const teacherForOffering = offering.teacherEmail;
            const teacherSchedules = currentSchedules.filter(s => {
                const schOffering = initialOfferings.find(o => o.offeringId === s.offeringId);
                return schOffering?.teacherEmail === teacherForOffering;
            });
            const teacherConflict = teacherSchedules.some(s => s.dayOfWeek === ns.dayOfWeek && s.period === ns.period);

            // Check class conflict
            const classSchedules = currentSchedules.filter(s => {
                const schOffering = initialOfferings.find(o => o.offeringId === s.offeringId);
                return schOffering?.classId === offering.classId;
            });
            const classConflict = classSchedules.some(s => s.dayOfWeek === ns.dayOfWeek && s.period === ns.period);
            
            if (teacherConflict || classConflict) {
                schedulesWithConflicts.push(ns);
            } else {
                uniqueNewSchedules.push(ns);
                currentSchedules.push(ns); // Add to current check list to prevent duplicates within the same file
            }
        });

        if (schedulesWithConflicts.length > 0) {
            toast({
                variant: "destructive",
                title: "ตรวจพบข้อมูลซ้ำซ้อน",
                description: `ไม่สามารถนำเข้า ${schedulesWithConflicts.length} รายการ เนื่องจากมีคาบสอนในเวลาดังกล่าวแล้ว (ครูหรือห้องเรียนไม่ว่าง)`
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
                    <h1 className="text-3xl font-bold font-headline">จัดตารางสอน</h1>
                    <p className="text-muted-foreground">ดูและจัดการตารางสอนสำหรับครู, จัดตารางอัตโนมัติ, หรือนำเข้าข้อมูล</p>
                </div>
                <AddScheduleDialog onAddSchedule={handleAddSchedule} allSchedules={allSchedules} />
            </div>

            <ScheduleSummaryCard schedules={allSchedules} offerings={initialOfferings.filter(o => o.isConduct === false)} />
            
            <AutoScheduleCard 
                allSchedules={allSchedules} 
                allOfferings={initialOfferings.filter(o => o.isConduct === false)}
                onSchedulesCreated={(newSchedules) => setAllSchedules(prev => [...prev, ...newSchedules])}
            />

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

    

    
