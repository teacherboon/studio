
"use client";

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Upload, Download, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { classes, subjects, users, offerings as initialOfferings, type Offering, type Subject, type Class as ClassType, type User } from "@/lib/data";
import { Table, TableHead, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";


function OfferingActionDropdown({ offering, onDelete }: { offering: Offering, onDelete: () => void }) {
    const { toast } = useToast();
    const showPlaceholderToast = () => {
        toast({
            title: "ยังไม่พร้อมใช้งาน",
            description: "ฟังก์ชันแก้ไขยังไม่สามารถใช้งานได้",
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">เปิดเมนู</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={showPlaceholderToast}>
                    <Pencil className="mr-2 h-4 w-4" />
                    <span>แก้ไข</span>
                </DropdownMenuItem>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                         <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>ลบ</span>
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                         <AlertDialogHeader>
                            <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
                            <AlertDialogDescription>
                                คุณแน่ใจหรือไม่ว่าต้องการลบรายวิชานี้? การกระทำนี้ไม่สามารถย้อนกลับได้
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                            <AlertDialogAction onClick={onDelete}>ยืนยัน</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function CreateOfferingDialog({ onAddOffering }: { onAddOffering: (newOffering: Offering) => void }) {
    const teachers = users.filter(u => u.role === 'TEACHER');
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [selectedClass, setSelectedClass] = useState('');

    const handleSave = () => {
        if (!selectedSubject || !selectedTeacher || !selectedClass) {
            toast({ variant: 'destructive', title: 'ข้อมูลไม่ครบถ้วน', description: 'กรุณาเลือกข้อมูลให้ครบทุกช่อง' });
            return;
        }

        const newOffering: Offering = {
            offeringId: `off${Math.floor(Math.random() * 1000)}`,
            subjectId: selectedSubject,
            classId: selectedClass,
            teacherEmail: selectedTeacher,
            yearMode: classes.find(c => c.classId === selectedClass)?.yearMode || 'PRIMARY',
            termLabel: classes.find(c => c.classId === selectedClass)?.termLabel || '',
            isConduct: false,
        };

        onAddOffering(newOffering);
        toast({
            title: 'บันทึกสำเร็จ',
            description: 'เพิ่มรายวิชาที่เปิดสอนใหม่เรียบร้อย',
        });
        setOpen(false);
        // Reset form
        setSelectedSubject('');
        setSelectedTeacher('');
        setSelectedClass('');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2" />
                    เพิ่มรายวิชาที่เปิดสอน
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>เพิ่มรายวิชาที่เปิดสอน</DialogTitle>
                    <DialogDescription>
                        กำหนดครู, วิชา, และห้องเรียนสำหรับภาคการศึกษานี้
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="subject" className="text-right">
                            รายวิชา
                        </Label>
                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="เลือกรายวิชา" />
                            </SelectTrigger>
                            <SelectContent>
                                {subjects.map(s => (
                                    <SelectItem key={s.subjectId} value={s.subjectId}>{s.subjectCode} - {s.subjectNameTh}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="teacher" className="text-right">
                            ครูผู้สอน
                        </Label>
                        <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="เลือกครูผู้สอน" />
                            </SelectTrigger>
                            <SelectContent>
                                {teachers.map(t => (
                                    <SelectItem key={t.userId} value={t.email}>{t.thaiName}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="class" className="text-right">
                            ห้องเรียน
                        </Label>
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="เลือกห้องเรียน" />
                            </SelectTrigger>
                            <SelectContent>
                                {classes.map(c => (
                                    <SelectItem key={c.classId} value={c.classId}>ห้อง {c.level}/{c.room} ({c.termLabel})</SelectItem>
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

function ImportOfferingsCard() {
    const { toast } = useToast();

    const handleDownloadTemplate = () => {
        const header = 'subjectCode,subjectNameTh,credits,periodsPerWeek,class,teacherEmail\n';
        const sampleData = 'ค16101,คณิตศาสตร์พื้นฐาน,1.0,2,ป.6/1,teacher.a@school.ac.th\n';
        
        const csvContent = "\uFEFF" + header + sampleData;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `offerings_import_template.csv`);
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
                <CardTitle>นำเข้ารายวิชาที่เปิดสอน (CSV)</CardTitle>
                <CardDescription>
                    เพิ่มข้อมูลรายวิชาที่เปิดสอนจำนวนมากผ่านไฟล์ CSV
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-semibold">ดาวน์โหลดเทมเพลต</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                        ดาวน์โหลดไฟล์ตัวอย่างเพื่อดูรูปแบบข้อมูลที่ถูกต้อง
                    </p>
                    <Button variant="outline" onClick={handleDownloadTemplate}>
                        <Download className="mr-2"/> เทมเพลตสำหรับรายวิชา
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

export default function AdminSubjectsPage() {
    const [offeringsList, setOfferingsList] = useState<Offering[]>(initialOfferings);
    const { toast } = useToast();

    const addOffering = (newOffering: Offering) => {
        setOfferingsList(prev => [newOffering, ...prev]);
    };

    const deleteOffering = (offeringId: string) => {
        setOfferingsList(prev => prev.filter(o => o.offeringId !== offeringId));
        toast({
            title: 'ลบรายวิชาสำเร็จ',
            description: 'รายวิชาที่เปิดสอนได้ถูกลบออกจากระบบแล้ว',
        })
    };

    const getOfferingDetails = (offering: Offering) => {
        const subject = subjects.find(s => s.subjectId === offering.subjectId);
        const classInfo = classes.find(c => c.classId === offering.classId);
        const teacher = users.find(u => u.email === offering.teacherEmail);
        return { subject, classInfo, teacher };
    }

    return (
        <div className="space-y-8">
             <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">จัดการรายวิชา</h1>
                    <p className="text-muted-foreground">สร้าง, แก้ไข, และดูข้อมูลรายวิชาทั้งหมดในระบบ</p>
                </div>
                <CreateOfferingDialog onAddOffering={addOffering} />
            </div>

            <ImportOfferingsCard />

            <Card>
                <CardHeader>
                    <CardTitle>รายชื่อวิชาที่เปิดสอน</CardTitle>
                    <CardDescription>
                        ส่วนนี้จะแสดงตารางวิชาทั้งหมดที่เปิดสอนในแต่ละภาคเรียน
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>รหัสวิชา</TableHead>
                                <TableHead>ชื่อวิชา</TableHead>
                                <TableHead>ห้องเรียน</TableHead>
                                <TableHead>ครูผู้สอน</TableHead>
                                <TableHead className="text-center">หน่วยกิต</TableHead>
                                <TableHead className="text-center">คาบ/สัปดาห์</TableHead>
                                <TableHead className="text-right">การดำเนินการ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {offeringsList.map(offering => {
                                const { subject, classInfo, teacher } = getOfferingDetails(offering);
                                return (
                                    <TableRow key={offering.offeringId}>
                                        <TableCell>{subject?.subjectCode}</TableCell>
                                        <TableCell>{subject?.subjectNameTh}</TableCell>
                                        <TableCell>ห้อง {classInfo?.level}/{classInfo?.room}</TableCell>
                                        <TableCell>{teacher?.thaiName}</TableCell>
                                        <TableCell className="text-center">{subject?.defaultCredits.toFixed(1)}</TableCell>
                                        <TableCell className="text-center">{offering.periodsPerWeek || '-'}</TableCell>
                                        <TableCell className="text-right">
                                            <OfferingActionDropdown offering={offering} onDelete={() => deleteOffering(offering.offeringId)} />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
