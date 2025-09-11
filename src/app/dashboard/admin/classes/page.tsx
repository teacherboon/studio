
"use client";

import { useState, useMemo, ChangeEvent, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Pencil, Trash2, Download, Upload, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
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

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { classes as initialClasses, students as initialStudents, enrollments as initialEnrollments } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import type { Class, Enrollment, Student } from '@/lib/types';


function ClassForm({ classData, onSave, closeDialog }: { classData: Partial<Class> | null, onSave: (classData: Omit<Class, 'yearBe' | 'yearMode' | 'termLabel' | 'isActive'>) => void, closeDialog: () => void }) {
    const [level, setLevel] = useState(classData?.level || '');
    const [room, setRoom] = useState(classData?.room || '');

    const handleSave = () => {
        // Basic validation
        if (!level || !room) {
             alert('กรุณากรอกข้อมูลให้ครบถ้วน');
             return;
        }

        const finalClassData: Omit<Class, 'yearBe' | 'yearMode' | 'termLabel' | 'isActive'> = {
            classId: classData?.classId || `c${Date.now()}`,
            level,
            room,
        };
        
        onSave(finalClassData);
        closeDialog();
    }

    return (
        <>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="level" className="text-right">
                        ระดับชั้น
                    </Label>
                    <Input id="level" value={level} onChange={e => setLevel(e.target.value)} placeholder="เช่น ป.1 หรือ ม.4" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="room" className="text-right">
                        ห้อง
                    </Label>
                    <Input id="room" value={room} onChange={e => setRoom(e.target.value)} placeholder="เช่น 1 หรือ 2" className="col-span-3" />
                </div>
            </div>
            <DialogFooter>
                 <DialogClose asChild>
                    <Button type="button" variant="secondary">ยกเลิก</Button>
                </DialogClose>
                <Button type="button" onClick={handleSave}>{classData?.classId ? 'บันทึกการเปลี่ยนแปลง' : 'สร้างห้องเรียน'}</Button>
            </DialogFooter>
        </>
    )
}

function CreateOrEditClassDialog({ classData, onSave, open, onOpenChange }: { classData?: Class | null, onSave: (data: Class) => void, open: boolean, onOpenChange: (open: boolean) => void }) {
    
    const handleFullSave = (data: Omit<Class, 'yearBe' | 'yearMode' | 'termLabel' | 'isActive'>) => {
        // Add back the default/unchanged properties
        const fullData: Class = {
            ...data,
            // These properties are no longer managed here
            yearBe: classData?.yearBe || 0,
            yearMode: classData?.yearMode || 'PRIMARY',
            termLabel: classData?.termLabel || '',
            isActive: classData?.isActive ?? true,
        };
        onSave(fullData);
    }
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{classData?.classId ? 'แก้ไขห้องเรียน' : 'สร้างห้องเรียนใหม่'}</DialogTitle>
                    <DialogDescription>
                        {classData?.classId ? `แก้ไขข้อมูลสำหรับห้อง ${classData.level}/${classData.room}` : 'กรอกข้อมูลเพื่อสร้างห้องเรียนในระบบ'}
                    </DialogDescription>
                </DialogHeader>
                {open && <ClassForm classData={classData || null} onSave={handleFullSave} closeDialog={() => onOpenChange(false)} />}
            </DialogContent>
        </Dialog>
    )
}

function StudentEnrollmentCard({ onEnrollmentsImported }: { onEnrollmentsImported: (newEnrollments: Enrollment[]) => void }) {
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDownloadTemplate = () => {
        const header = 'studentId,classId\n';
        const sampleData = 'stu1,c1\nstu2,c1\n';
        
        const csvContent = "\uFEFF" + header + sampleData;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `enrollment_import_template.csv`);
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
                const newEnrollments: Enrollment[] = [];
                let importedCount = 0;

                lines.forEach((line, index) => {
                    if (line.trim() === '') return;
                    const [studentId, classId] = line.split(',').map(s => s.trim());
                    
                    if (studentId && classId) {
                         newEnrollments.push({
                            enrollmentId: `enroll-csv-${Date.now()}-${index}`,
                            studentId,
                            classId,
                            status: 'ENROLLED'
                        });
                        importedCount++;
                    }
                });

                if (importedCount > 0) {
                    onEnrollmentsImported(newEnrollments);
                } else {
                     toast({
                        variant: 'destructive',
                        title: 'ไม่พบข้อมูลที่ถูกต้อง',
                        description: 'ไม่พบข้อมูลที่ถูกต้องในไฟล์ CSV (ต้องมี studentId และ classId)',
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
        event.target.value = '';
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>นำข้อมูลนักเรียนเข้าห้องเรียน (CSV)</CardTitle>
                <CardDescription>
                    เพิ่มนักเรียนจำนวนมากลงในห้องเรียนต่างๆ ผ่านไฟล์ CSV
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div>
                    <h4 className="font-semibold">ดาวน์โหลดเทมเพลต</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                        ดาวน์โหลดไฟล์ตัวอย่างเพื่อดูรูปแบบข้อมูลที่ถูกต้อง (คอลัมน์: studentId, classId)
                    </p>
                    <Button variant="outline" onClick={handleDownloadTemplate}>
                        <Download className="mr-2"/> เทมเพลตสำหรับลงทะเบียน
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

function ActionDropdown({ classItem, onEdit, onDelete, onViewStudents }: { classItem: Class, onEdit: () => void, onDelete: () => void, onViewStudents: () => void }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">เปิดเมนู</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onViewStudents}>
                    <Users className="mr-2 h-4 w-4" />
                    <span>ดูรายชื่อนักเรียน</span>
                </DropdownMenuItem>
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
                                คุณแน่ใจหรือไม่ว่าต้องการลบห้อง "{classItem.level}/{classItem.room}"? การกระทำนี้ไม่สามารถย้อนกลับได้
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

export default function AdminClassesPage() {
    const [allClasses, setAllClasses] = useState<Class[]>(initialClasses.sort((a,b) => a.level.localeCompare(b.level) || a.room.localeCompare(b.room)));
    const [allEnrollments, setAllEnrollments] = useState<Enrollment[]>(initialEnrollments);
    
    const [editingClass, setEditingClass] = useState<Class | null>(null);
    const [viewingClass, setViewingClass] = useState<Class | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    
    const studentCountByClass = useMemo(() => {
        const counts: Record<string, number> = {};
        allEnrollments.forEach(e => {
            counts[e.classId] = (counts[e.classId] || 0) + 1;
        });
        return counts;
    }, [allEnrollments]);
    
    const studentsInViewingClass = useMemo(() => {
        if (!viewingClass) return [];
        const studentIds = allEnrollments
            .filter(e => e.classId === viewingClass.classId)
            .map(e => e.studentId);
        return initialStudents.filter(s => studentIds.includes(s.studentId));
    }, [viewingClass, allEnrollments]);


    const handleSaveClass = (data: Class) => {
        const isEditing = allClasses.some(c => c.classId === data.classId);

        if (isEditing) {
            setAllClasses(prev => prev.map(c => c.classId === data.classId ? data : c)
                .sort((a,b) => a.level.localeCompare(b.level) || a.room.localeCompare(b.room)));
            toast({ title: "แก้ไขสำเร็จ", description: "ข้อมูลห้องเรียนได้รับการอัปเดตแล้ว" });
        } else {
             const isDuplicate = allClasses.some(
                c => c.level === data.level && c.room === data.room
            );
            if (isDuplicate) {
                toast({
                    variant: "destructive",
                    title: "สร้างไม่สำเร็จ",
                    description: `ห้องเรียน ${data.level}/${data.room} มีอยู่แล้ว`,
                });
                return;
            }
            setAllClasses(prev => [data, ...prev].sort((a,b) => a.level.localeCompare(b.level) || a.room.localeCompare(b.room)));
            toast({ title: "สร้างสำเร็จ", description: "ห้องเรียนใหม่ได้ถูกเพิ่มเข้าระบบแล้ว" });
        }
        setIsDialogOpen(false);
    }
    
    const handleDeleteClass = (classId: string) => {
        // Also remove enrollments associated with this class to be clean
        setAllEnrollments(prev => prev.filter(e => e.classId !== classId));
        setAllClasses(prev => prev.filter(c => c.classId !== classId));
        toast({ title: "ลบสำเร็จ", description: "ห้องเรียนและข้อมูลการลงทะเบียนได้ถูกลบแล้ว" });
    }

    const handleOpenDialog = (classItem: Class | null = null) => {
        setEditingClass(classItem);
        setIsDialogOpen(true);
    };

    const handleEnrollmentsImport = (newEnrollments: Enrollment[]) => {
        const uniqueNewEnrollments: Enrollment[] = [];
        const enrollmentConflicts: Enrollment[] = [];
        const currentEnrollments = [...allEnrollments];

        newEnrollments.forEach(newE => {
            const isDuplicate = currentEnrollments.some(
                e => e.studentId === newE.studentId && e.classId === newE.classId
            );
            if (isDuplicate) {
                enrollmentConflicts.push(newE);
            } else {
                uniqueNewEnrollments.push(newE);
                currentEnrollments.push(newE); 
            }
        });
        
        if (enrollmentConflicts.length > 0) {
            toast({
                variant: "default",
                title: "ตรวจพบข้อมูลซ้ำซ้อน",
                description: `ข้ามการนำเข้า ${enrollmentConflicts.length} รายการ เนื่องจากนักเรียนลงทะเบียนในห้องนั้นแล้ว`
            });
        }

        if (uniqueNewEnrollments.length > 0) {
            setAllEnrollments(prev => [...prev, ...uniqueNewEnrollments]);
            toast({
                title: 'อัปโหลดสำเร็จ',
                description: `ลงทะเบียนนักเรียนใหม่ ${uniqueNewEnrollments.length} รายการ`,
            });
        }
    };
    
    const paginatedClasses = allClasses.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const totalPages = Math.ceil(allClasses.length / itemsPerPage);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">จัดการห้องเรียน</h1>
                    <p className="text-muted-foreground">สร้างห้องเรียนและลงทะเบียนนักเรียนเข้าห้อง</p>
                </div>
                <Button onClick={() => handleOpenDialog()}>
                    <PlusCircle className="mr-2" />
                    สร้างห้องเรียนใหม่
                </Button>
            </div>

            <StudentEnrollmentCard onEnrollmentsImported={handleEnrollmentsImport} />

            <Card>
                <CardHeader>
                    <CardTitle>รายชื่อห้องเรียน</CardTitle>
                    <CardDescription>
                        ห้องเรียนทั้งหมดที่มีอยู่ในระบบ (คลิกที่เมนู "..." เพื่อดูรายชื่อนักเรียน)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ระดับชั้น</TableHead>
                                <TableHead>ห้อง</TableHead>
                                <TableHead className="text-center">จำนวนนักเรียน</TableHead>
                                <TableHead className="text-right">การดำเนินการ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedClasses.map((c) => (
                                <TableRow key={c.classId} onClick={() => setViewingClass(c)} className="cursor-pointer">
                                    <TableCell>{c.level}</TableCell>
                                    <TableCell>{c.room}</TableCell>
                                    <TableCell className="text-center">{studentCountByClass[c.classId] || 0}</TableCell>
                                    <TableCell className="text-right">
                                       <ActionDropdown 
                                            classItem={c} 
                                            onViewStudents={() => setViewingClass(c)}
                                            onEdit={() => handleOpenDialog(c)}
                                            onDelete={() => handleDeleteClass(c.classId)}
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

            {viewingClass && (
                 <Card>
                    <CardHeader>
                        <CardTitle>รายชื่อนักเรียน ห้อง {viewingClass.level}/{viewingClass.room}</CardTitle>
                        <CardDescription>
                            มีนักเรียนทั้งหมด {studentsInViewingClass.length} คน
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>รหัสนักเรียน</TableHead>
                                    <TableHead>ชื่อ-สกุล</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {studentsInViewingClass.map((student) => (
                                    <TableRow key={student.studentId}>
                                        <TableCell>{student.stuCode}</TableCell>
                                        <TableCell>{`${student.prefixTh}${student.firstNameTh} ${student.lastNameTh}`}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
            
            <CreateOrEditClassDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                classData={editingClass}
                onSave={handleSaveClass}
            />
        </div>
    )
}

    