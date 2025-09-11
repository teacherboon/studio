
"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
import { subjects as initialSubjects } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import type { Subject } from '@/lib/types';


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
            subjectId: subjectData?.subjectId || `subj${Date.now()}`,
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
                <Button type="button" onClick={handleSave}>{subjectData ? 'บันทึกการเปลี่ยนแปลง' : 'สร้างรายวิชา'}</Button>
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
                <SubjectForm subjectData={subject || null} onSave={onSave} closeDialog={() => onOpenChange(false)} />
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

export default function ManageSubjectsPage() {
    const [allSubjects, setAllSubjects] = useState<Subject[]>(initialSubjects);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    const handleSaveSubject = (data: Subject) => {
        const isEditing = allSubjects.some(s => s.subjectId === data.subjectId);

        if (isEditing) {
            setAllSubjects(prev => prev.map(s => s.subjectId === data.subjectId ? data : s));
            toast({ title: "แก้ไขสำเร็จ", description: "ข้อมูลรายวิชาได้รับการอัปเดตแล้ว" });
        } else {
            setAllSubjects(prev => [data, ...prev]);
            toast({ title: "สร้างสำเร็จ", description: "รายวิชาใหม่ได้ถูกเพิ่มเข้าระบบแล้ว" });
        }
    }
    
    const handleDeleteSubject = (subjectId: string) => {
        // In a real app, you'd also check for dependencies in offerings.
        setAllSubjects(prev => prev.filter(s => s.subjectId !== subjectId));
        toast({ title: "ลบสำเร็จ", description: "รายวิชาได้ถูกลบออกจากระบบแล้ว" });
    }

    const handleOpenDialog = (subject: Subject | null = null) => {
        setEditingSubject(subject);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">จัดการข้อมูลรายวิชา</h1>
                    <p className="text-muted-foreground">สร้าง, แก้ไข, และดูข้อมูลรายวิชาหลักทั้งหมดในระบบ</p>
                </div>
                <Button onClick={() => handleOpenDialog()}>
                    <PlusCircle className="mr-2" />
                    สร้างรายวิชาใหม่
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>รายชื่อรายวิชาหลัก</CardTitle>
                    <CardDescription>
                        รายวิชาทั้งหมดที่มีในระบบ สามารถนำไปใช้ในหน้า 'จัดการรายวิชาที่เปิดสอน'
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
                            {allSubjects.map((s) => (
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

    