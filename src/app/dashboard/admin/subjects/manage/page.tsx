
"use client";

import { useState, useRef, ChangeEvent, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Pencil, Trash2, Download, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
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

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import type { Subject } from '@/lib/types';
import { useData } from '@/context/data-context';


function SubjectForm({ subjectData, onSave, closeDialog }: { subjectData: Partial<Subject> | null, onSave: (data: Subject) => void, closeDialog: () => void }) {
    const [subjectCode, setSubjectCode] = useState(subjectData?.subjectCode || '');
    const [subjectNameTh, setSubjectNameTh] = useState(subjectData?.subjectNameTh || '');
    const [type, setType] = useState<"พื้นฐาน" | "เพิ่มเติม">(subjectData?.type || 'พื้นฐาน');
    const [defaultCredits, setDefaultCredits] = useState(subjectData?.defaultCredits || 0);

    const handleSave = () => {
        if (!subjectCode || !subjectNameTh || !type || defaultCredits <= 0) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง');
            return;
        }

        const finalSubjectData: Subject = {
            subjectId: subjectData?.subjectId || `subj-${Date.now()}`,
            subjectCode,
            subjectNameTh,
            type,
            defaultCredits,
            status: subjectData?.status || 'ACTIVE',
            createdByEmail: subjectData?.createdByEmail || 'admin@school.ac.th'
        };
        
        onSave(finalSubjectData);
        closeDialog();
    }

    return (
        <>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="subjectCode" className="text-right">รหัสวิชา</Label>
                    <Input id="subjectCode" value={subjectCode} onChange={e => setSubjectCode(e.target.value)} placeholder="เช่น ค16101" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="subjectNameTh" className="text-right">ชื่อวิชา (ไทย)</Label>
                    <Input id="subjectNameTh" value={subjectNameTh} onChange={e => setSubjectNameTh(e.target.value)} placeholder="เช่น คณิตศาสตร์พื้นฐาน" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">ประเภทวิชา</Label>
                    <Select value={type} onValueChange={(value) => setType(value as any)}>
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="เลือกประเภท" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="พื้นฐาน">พื้นฐาน</SelectItem>
                            <SelectItem value="เพิ่มเติม">เพิ่มเติม</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="defaultCredits" className="text-right">หน่วยกิต</Label>
                    <Input id="defaultCredits" type="number" step="0.5" value={defaultCredits} onChange={e => setDefaultCredits(Number(e.target.value))} className="col-span-3" />
                </div>
            </div>
            <DialogFooter>
                 <DialogClose asChild>
                    <Button type="button" variant="secondary">ยกเลิก</Button>
                </DialogClose>
                <Button type="button" onClick={handleSave}>{subjectData?.subjectId ? 'บันทึกการเปลี่ยนแปลง' : 'สร้างรายวิชา'}</Button>
            </DialogFooter>
        </>
    )
}

function CreateOrEditSubjectDialog({ subject, onSave, open, onOpenChange }: { subject?: Subject | null, onSave: (data: Subject) => void, open: boolean, onOpenChange: (open: boolean) => void }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{subject ? 'แก้ไขข้อมูลรายวิชา' : 'สร้างรายวิชาใหม่'}</DialogTitle>
                    <DialogDescription>
                        {subject ? `แก้ไขข้อมูลสำหรับวิชา ${subject.subjectCode}` : 'กรอกข้อมูลเพื่อสร้างรายวิชาหลักในระบบ'}
                    </DialogDescription>
                </DialogHeader>
                {open && <SubjectForm subjectData={subject || null} onSave={onSave} closeDialog={() => onOpenChange(false)} />}
            </DialogContent>
        </Dialog>
    )
}

function ActionDropdown({ subject, onEdit, onDelete }: { subject: Subject, onEdit: () => void, onDelete: () => void }) {
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
                                คุณแน่ใจหรือไม่ว่าต้องการลบรายวิชา "{subject.subjectNameTh}"? การกระทำนี้ไม่สามารถย้อนกลับได้ และอาจส่งผลกระทบต่อรายวิชาที่เปิดสอนแล้ว
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

function SubjectImportCard({ onSubjectsImported }: { onSubjectsImported: (newSubjects: Subject[]) => void }) {
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDownloadTemplate = () => {
        const header = 'subjectCode,subjectNameTh,type,defaultCredits\n';
        const sampleData = 'ท21101,ภาษาไทย,พื้นฐาน,1.5\n';
        
        const csvContent = "\uFEFF" + header + sampleData;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'subject_import_template.csv');
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
                const lines = text.split('\n').slice(1);
                const newSubjects: Subject[] = [];
                
                lines.forEach((line, index) => {
                     if (line.trim() === '') return;
                     const parts = line.split(',').map(s => s.trim());
                     const [subjectCode, subjectNameTh, type, defaultCreditsStr] = parts;

                     const defaultCredits = Number(defaultCreditsStr);

                     if (subjectCode && subjectNameTh && (type === 'พื้นฐาน' || type === 'เพิ่มเติม') && !isNaN(defaultCredits) && defaultCredits > 0) {
                         newSubjects.push({
                            subjectId: `subj-csv-${Date.now()}-${index}`,
                            subjectCode,
                            subjectNameTh,
                            type: type as "พื้นฐาน" | "เพิ่มเติม",
                            defaultCredits,
                            status: 'ACTIVE',
                            createdByEmail: 'admin@school.ac.th' // Or a dynamic user
                         });
                     }
                });

                 if (newSubjects.length > 0) {
                    onSubjectsImported(newSubjects);
                } else {
                    toast({
                        variant: 'destructive',
                        title: 'ไม่พบข้อมูลที่ถูกต้อง',
                        description: 'ไม่พบข้อมูลรายวิชาที่ถูกต้องในไฟล์ CSV',
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
        reader.readAsText(file, 'UTF-8');
        if(event.target) event.target.value = '';
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>นำเข้าข้อมูลรายวิชา (CSV)</CardTitle>
                <CardDescription>
                    เพิ่มข้อมูลรายวิชาหลักจำนวนมากผ่านไฟล์ CSV
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-semibold">ดาวน์โหลดเทมเพลต</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                        ดาวน์โหลดไฟล์ตัวอย่างเพื่อดูรูปแบบข้อมูลที่ถูกต้อง (คอลัมน์: subjectCode, subjectNameTh, type, defaultCredits)
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
                        <Upload className="mr-2"/> อัปโหลดไฟล์ CSV
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

export default function ManageSubjectsPage() {
    const { allSubjects, actions } = useData();
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    
    const sortedSubjects = useMemo(() => allSubjects.sort((a,b) => b.subjectId.localeCompare(a.subjectId)), [allSubjects]);

    const handleSaveSubject = (data: Subject) => {
        const isEditing = allSubjects.some(s => s.subjectId === data.subjectId);

        if (isEditing) {
            actions.updateSubject(data.subjectId, data);
            toast({ title: "แก้ไขสำเร็จ", description: "ข้อมูลรายวิชาได้รับการอัปเดตแล้ว" });
        } else {
            if (allSubjects.some(s => s.subjectCode.toLowerCase() === data.subjectCode.toLowerCase())) {
                 toast({
                    variant: "destructive",
                    title: "สร้างไม่สำเร็จ",
                    description: `มีรายวิชาที่ใช้รหัส "${data.subjectCode}" อยู่ในระบบแล้ว`,
                });
                return;
            }
            actions.addSubject(data);
            toast({ title: "สร้างสำเร็จ", description: "รายวิชาใหม่ได้ถูกเพิ่มเข้าระบบแล้ว" });
        }
        setIsDialogOpen(false);
    }
    
    const handleDeleteSubject = (subjectId: string) => {
        actions.deleteSubject(subjectId);
        toast({ title: "ลบสำเร็จ", description: "รายวิชาได้ถูกลบออกจากระบบแล้ว" });
    }

    const handleOpenDialog = (subject: Subject | null = null) => {
        setEditingSubject(subject);
        setIsDialogOpen(true);
    };

    const handleSubjectsImport = (newSubjects: Subject[]) => {
        const { importedCount, conflictCount } = actions.importSubjects(newSubjects);

        if (conflictCount > 0) {
            toast({
                variant: 'destructive',
                title: 'พบข้อมูลซ้ำซ้อน',
                description: `ข้ามการนำเข้า ${conflictCount} รายการ เนื่องจากมีรหัสวิชาซ้ำกับข้อมูลที่มีอยู่แล้ว`,
            });
        }

        if (importedCount > 0) {
            toast({
                title: 'นำเข้าสำเร็จ!',
                description: `เพิ่มรายวิชาใหม่ ${importedCount} รายการ`,
            });
        }
    };

    const paginatedSubjects = sortedSubjects.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(allSubjects.length / itemsPerPage);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">จัดการข้อมูลรายวิชาหลัก</h1>
                    <p className="text-muted-foreground">สร้าง, แก้ไข, และดูข้อมูลรายวิชาหลักทั้งหมดในระบบ</p>
                </div>
                <Button onClick={() => handleOpenDialog()}>
                    <PlusCircle className="mr-2" />
                    สร้างรายวิชาใหม่
                </Button>
            </div>

            <SubjectImportCard onSubjectsImported={handleSubjectsImport} />

            <Card>
                <CardHeader>
                    <CardTitle>รายชื่อรายวิชาหลัก</CardTitle>
                    <CardDescription>
                        รายวิชาทั้งหมดที่มีในระบบเพื่อให้ครูสามารถนำไปสร้างรายวิชาที่เปิดสอนได้
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>รหัสวิชา</TableHead>
                                <TableHead>ชื่อวิชา (ภาษาไทย)</TableHead>
                                <TableHead>ประเภท</TableHead>
                                <TableHead className="text-center">หน่วยกิต</TableHead>
                                <TableHead className="text-center">สถานะ</TableHead>
                                <TableHead className="text-right">การดำเนินการ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedSubjects.map((s) => (
                                <TableRow key={s.subjectId}>
                                    <TableCell className="font-mono">{s.subjectCode}</TableCell>
                                    <TableCell>{s.subjectNameTh}</TableCell>
                                    <TableCell>{s.type}</TableCell>
                                    <TableCell className="text-center">{s.defaultCredits.toFixed(1)}</TableCell>
                                    <TableCell className="text-center">
                                        <span className={`px-2 py-1 text-xs rounded-full ${s.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {s.status === 'ACTIVE' ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                       <ActionDropdown 
                                            subject={s} 
                                            onEdit={() => handleOpenDialog(s)}
                                            onDelete={() => handleDeleteSubject(s.subjectId)}
                                        />
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
            
            <CreateOrEditSubjectDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                subject={editingSubject}
                onSave={handleSaveSubject}
            />
        </div>
    )
}

    