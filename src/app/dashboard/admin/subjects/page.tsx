
"use client";

import { useState, useMemo, useEffect, ChangeEvent } from 'react';
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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { classes, subjects, users, offerings as initialOfferings, type Offering, type Subject, type Class as ClassType, type User } from "@/lib/data";
import { Table, TableHead, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";


function OfferingActionDropdown({ offering, onEdit, onDelete }: { offering: Offering, onEdit: () => void, onDelete: () => void }) {

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">เปิดเมนู</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
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

function CreateOrEditOfferingDialog({ offeringData, onSave, open, onOpenChange }: { offeringData?: Offering | null, onSave: (data: Offering) => void, open: boolean, onOpenChange: (open: boolean) => void }) {
    const teachers = users.filter(u => u.role === 'TEACHER');
    const { toast } = useToast();
    
    const [selectedSubject, setSelectedSubject] = useState(offeringData?.subjectId || '');
    const [selectedTeacher, setSelectedTeacher] = useState(offeringData?.teacherEmail || '');
    const [selectedClass, setSelectedClass] = useState(offeringData?.classId || '');

    useEffect(() => {
        if (open) { // Reset form when dialog opens
            if (offeringData) {
                setSelectedSubject(offeringData.subjectId);
                setSelectedTeacher(offeringData.teacherEmail);
                setSelectedClass(offeringData.classId);
            } else {
                setSelectedSubject('');
                setSelectedTeacher('');
                setSelectedClass('');
            }
        }
    }, [offeringData, open]);

    const handleSave = () => {
        if (!selectedSubject || !selectedTeacher || !selectedClass) {
            toast({ variant: 'destructive', title: 'ข้อมูลไม่ครบถ้วน', description: 'กรุณาเลือกข้อมูลให้ครบทุกช่อง' });
            return;
        }

        const classDetails = classes.find(c => c.classId === selectedClass);
        if (!classDetails) {
            toast({ variant: 'destructive', title: 'ไม่พบข้อมูลห้องเรียน', description: 'ไม่สามารถหารายละเอียดห้องเรียนได้' });
            return
        };

        const newOffering: Offering = {
            offeringId: offeringData?.offeringId || `off${Date.now()}`,
            subjectId: selectedSubject,
            classId: selectedClass,
            teacherEmail: selectedTeacher,
            yearMode: classDetails.yearMode,
            termLabel: classDetails.termLabel,
            isConduct: offeringData?.isConduct || false,
        };

        onSave(newOffering);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{offeringData ? 'แก้ไขรายวิชาที่เปิดสอน' : 'เพิ่มรายวิชาที่เปิดสอน'}</DialogTitle>
                    <DialogDescription>
                         {offeringData ? 'แก้ไขข้อมูลครู, วิชา, และห้องเรียน' : 'กำหนดครู, วิชา, และห้องเรียนสำหรับภาคการศึกษานี้'}
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

function ImportOfferingsCard({ onOfferingsImported }: { onOfferingsImported: (newOfferings: Offering[]) => void }) {
    const { toast } = useToast();
    const fileInputRef = useState<HTMLInputElement>(null);

    const handleDownloadTemplate = () => {
        const header = 'subjectId,classId,teacherEmail\n';
        const sampleData = 'subj1,c1,teacher.a@school.ac.th\n';
        
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
                const newOfferings: Offering[] = [];
                let importedCount = 0;

                lines.forEach((line, index) => {
                    if (line.trim() === '') return;
                    const [subjectId, classId, teacherEmail] = line.split(',').map(item => item.trim());
                    
                    const classDetails = classes.find(c => c.classId === classId);
                    const subjectExists = subjects.some(s => s.subjectId === subjectId);
                    const teacherExists = users.some(u => u.email === teacherEmail);

                    if (classDetails && subjectExists && teacherExists) {
                         newOfferings.push({
                            offeringId: `csv-import-${Date.now()}-${index}`,
                            subjectId,
                            classId,
                            teacherEmail,
                            yearMode: classDetails.yearMode,
                            termLabel: classDetails.termLabel,
                            isConduct: false,
                        });
                        importedCount++;
                    }
                });

                if (importedCount > 0) {
                    onOfferingsImported(newOfferings);
                    toast({
                        title: 'อัปโหลดสำเร็จ',
                        description: `นำเข้ารายวิชาที่เปิดสอนใหม่ ${importedCount} รายการ`,
                    });
                } else {
                     toast({
                        variant: 'destructive',
                        title: 'ไม่พบข้อมูลที่ถูกต้อง',
                        description: 'ไม่พบข้อมูลที่ถูกต้องในไฟล์ CSV หรือข้อมูลอ้างอิงไม่ถูกต้อง (subjectId, classId, teacherEmail)',
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
                <CardTitle>นำเข้ารายวิชาที่เปิดสอน (CSV)</CardTitle>
                <CardDescription>
                    เพิ่มข้อมูลรายวิชาที่เปิดสอนจำนวนมากผ่านไฟล์ CSV
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-semibold">ดาวน์โหลดเทมเพลต</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                        ดาวน์โหลดไฟล์ตัวอย่างเพื่อดูรูปแบบข้อมูลที่ถูกต้อง (คอลัมน์: subjectId, classId, teacherEmail)
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

export default function AdminSubjectsPage() {
    const [offeringsList, setOfferingsList] = useState<Offering[]>(initialOfferings);
    const [editingOffering, setEditingOffering] = useState<Offering | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    const handleSaveOffering = (data: Offering) => {
        const isEditing = offeringsList.some(o => o.offeringId === data.offeringId);
        
        if(isEditing) {
            setOfferingsList(prev => prev.map(o => o.offeringId === data.offeringId ? data : o));
             toast({ title: "แก้ไขสำเร็จ", description: "ข้อมูลรายวิชาที่เปิดสอนได้รับการอัปเดตแล้ว" });
        } else {
            setOfferingsList(prev => [data, ...prev]);
            toast({ title: "สร้างสำเร็จ", description: "เพิ่มรายวิชาที่เปิดสอนใหม่เรียบร้อย" });
        }
    }

    const deleteOffering = (offeringId: string) => {
        setOfferingsList(prev => prev.filter(o => o.offeringId !== offeringId));
        toast({
            title: 'ลบรายวิชาสำเร็จ',
            description: 'รายวิชาที่เปิดสอนได้ถูกลบออกจากระบบแล้ว',
        })
    };

    const handleOpenDialog = (offering: Offering | null = null) => {
        setEditingOffering(offering);
        setIsDialogOpen(true);
    };

    const handleOfferingsImport = (newOfferings: Offering[]) => {
        setOfferingsList(prev => [...prev, ...newOfferings]);
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
                 <Button onClick={() => handleOpenDialog()}>
                    <PlusCircle className="mr-2" />
                    เพิ่มรายวิชาที่เปิดสอน
                 </Button>
            </div>

            <ImportOfferingsCard onOfferingsImported={handleOfferingsImport} />

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
                                            <OfferingActionDropdown 
                                                offering={offering} 
                                                onEdit={() => handleOpenDialog(offering)}
                                                onDelete={() => deleteOffering(offering.offeringId)} 
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

             <CreateOrEditOfferingDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                offeringData={editingOffering}
                onSave={handleSaveOffering}
            />
        </div>
    );
}
