
"use client";

import { useState, useEffect, ChangeEvent } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Upload, Download, MoreHorizontal, Pencil, Trash2, BookPlus } from "lucide-react";
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
import { classes, subjects as initialSubjects, users, offerings as initialOfferings, type Offering, type Subject } from "@/lib/data";
import { Table, TableHead, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';


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
    const [periodsPerWeek, setPeriodsPerWeek] = useState(offeringData?.periodsPerWeek || 0);

    useEffect(() => {
        if (open) { // Reset form when dialog opens
            if (offeringData) {
                setSelectedSubject(offeringData.subjectId);
                setSelectedTeacher(offeringData.teacherEmail);
                setSelectedClass(offeringData.classId);
                setPeriodsPerWeek(offeringData.periodsPerWeek || 0);
            } else {
                setSelectedSubject('');
                setSelectedTeacher('');
                setSelectedClass('');
                setPeriodsPerWeek(0);
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
            offeringId: offeringData?.offeringId || `off-${Date.now()}`,
            subjectId: selectedSubject,
            classId: selectedClass,
            teacherEmail: selectedTeacher,
            yearMode: classDetails.yearMode,
            termLabel: classDetails.termLabel,
            isConduct: offeringData?.isConduct || false,
            periodsPerWeek: periodsPerWeek,
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
                {open && <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="subject" className="text-right">
                            รายวิชา
                        </Label>
                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="เลือกรายวิชา" />
                            </SelectTrigger>
                            <SelectContent>
                                {initialSubjects.map(s => (
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
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="periods" className="text-right">
                            คาบ/สัปดาห์
                        </Label>
                        <Input id="periods" type="number" value={periodsPerWeek} onChange={e => setPeriodsPerWeek(Number(e.target.value))} className="col-span-3" />
                    </div>
                </div>}
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
        const header = 'subjectId,classId,teacherEmail,periodsPerWeek\n';
        const sampleData = 'subj1,c1,teacher.a@school.ac.th,2\n';
        
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
                    const [subjectId, classId, teacherEmail, periodsPerWeekStr] = line.split(',').map(item => item.trim());
                    
                    const classDetails = classes.find(c => c.classId === classId);
                    const subjectExists = initialSubjects.some(s => s.subjectId === subjectId);
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
                            periodsPerWeek: periodsPerWeekStr ? Number(periodsPerWeekStr) : undefined,
                        });
                        importedCount++;
                    }
                });

                if (importedCount > 0) {
                    onOfferingsImported(newOfferings);
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
                        ดาวน์โหลดไฟล์ตัวอย่างเพื่อดูรูปแบบข้อมูลที่ถูกต้อง (คอลัมน์: subjectId, classId, teacherEmail, periodsPerWeek)
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

export default function AdminOfferingsPage() {
    const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
    const [offeringsList, setOfferingsList] = useState<Offering[]>(initialOfferings.sort((a,b) => b.offeringId.localeCompare(a.offeringId)));
    const [editingOffering, setEditingOffering] = useState<Offering | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;


    const handleSaveOffering = (data: Offering) => {
        const isEditing = offeringsList.some(o => o.offeringId === data.offeringId);
        
        // Check for duplicate offering before adding/editing
        const isDuplicate = offeringsList.some(o => 
            o.offeringId !== data.offeringId &&
            o.subjectId === data.subjectId && 
            o.classId === data.classId
        );

        if (isDuplicate) {
            toast({
                variant: "destructive",
                title: "สร้างไม่สำเร็จ",
                description: `รายวิชานี้ถูกเปิดสอนให้ห้องนี้แล้ว (อาจจะโดยครูท่านอื่น)`,
            });
            return;
        }

        if(isEditing) {
            setOfferingsList(prev => prev.map(o => o.offeringId === data.offeringId ? data : o));
             toast({ title: "แก้ไขสำเร็จ", description: "ข้อมูลรายวิชาที่เปิดสอนได้รับการอัปเดตแล้ว" });
        } else {
            setOfferingsList(prev => [data, ...prev].sort((a,b) => b.offeringId.localeCompare(a.offeringId)));
            toast({ title: "สร้างสำเร็จ", description: "เพิ่มรายวิชาที่เปิดสอนใหม่เรียบร้อย" });
        }
        setIsDialogOpen(false);
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
        const uniqueNewOfferings: Offering[] = [];
        const offeringConflicts: Offering[] = [];
        const currentOfferings = [...offeringsList];

        newOfferings.forEach(newO => {
            const isDuplicate = currentOfferings.some(
                o => o.subjectId === newO.subjectId && o.classId === newO.classId
            );
            if (isDuplicate) {
                offeringConflicts.push(newO);
            } else {
                uniqueNewOfferings.push(newO);
                currentOfferings.push(newO); // Add to temp array to check against duplicates within the same file
            }
        });
        
        if (offeringConflicts.length > 0) {
            toast({
                variant: "default",
                title: "ตรวจพบข้อมูลซ้ำซ้อน",
                description: `ข้ามการนำเข้ารายการที่ซ้ำซ้อน ${offeringConflicts.length} รายการ (มีวิชาในห้องเรียนนั้นแล้ว)`
            });
        }

        if (uniqueNewOfferings.length > 0) {
            setOfferingsList(prev => [...prev, ...uniqueNewOfferings].sort((a,b) => b.offeringId.localeCompare(a.offeringId)));
            toast({
                title: 'อัปโหลดสำเร็จ',
                description: `นำเข้ารายวิชาที่เปิดสอนใหม่ ${uniqueNewOfferings.length} รายการ`,
            });
        }
    };

    const getOfferingDetails = (offering: Offering) => {
        const subject = subjects.find(s => s.subjectId === offering.subjectId);
        const classInfo = classes.find(c => c.classId === offering.classId);
        const teacher = users.find(u => u.email === offering.teacherEmail);
        return { subject, classInfo, teacher };
    }
    
    const paginatedOfferings = offeringsList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const totalPages = Math.ceil(offeringsList.length / itemsPerPage);

    return (
        <div className="space-y-8">
             <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">จัดการรายวิชาที่เปิดสอน</h1>
                    <p className="text-muted-foreground">จับคู่รายวิชา, ครูผู้สอน, และห้องเรียน</p>
                </div>
                 <div className='flex gap-2'>
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/admin/subjects/manage">
                            <BookPlus className="mr-2" />
                            จัดการข้อมูลรายวิชา
                        </Link>
                    </Button>
                    <Button onClick={() => handleOpenDialog()}>
                        <PlusCircle className="mr-2" />
                        เพิ่มรายวิชาที่เปิดสอน
                    </Button>
                 </div>
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
                                <TableHead>ประเภท</TableHead>
                                <TableHead>ห้องเรียน</TableHead>
                                <TableHead>ครูผู้สอน</TableHead>
                                <TableHead className="text-center">หน่วยกิต</TableHead>
                                <TableHead className="text-center">คาบ/สัปดาห์</TableHead>
                                <TableHead className="text-right">การดำเนินการ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedOfferings.map(offering => {
                                const { subject, classInfo, teacher } = getOfferingDetails(offering);
                                return (
                                    <TableRow key={offering.offeringId}>
                                        <TableCell>{subject?.subjectCode}</TableCell>
                                        <TableCell>{subject?.subjectNameTh}</TableCell>
                                        <TableCell>{subject?.type}</TableCell>
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

             <CreateOrEditOfferingDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                offeringData={editingOffering}
                onSave={handleSaveOffering}
            />
        </div>
    );
}

    

    