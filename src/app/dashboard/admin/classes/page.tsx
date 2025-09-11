
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
import { classes as initialClasses, students as initialStudents, enrollments as initialEnrollments, users as initialUsers } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import type { Class, Enrollment, Student, User, UserRole } from '@/lib/types';


function ClassForm({ classData, onSave, closeDialog }: { classData: Partial<Class> | null, onSave: (classData: Class) => void, closeDialog: () => void }) {
    const [level, setLevel] = useState(classData?.level || '');
    const [room, setRoom] = useState(classData?.room || '');

    const handleSave = () => {
        if (!level || !room) {
             alert('กรุณากรอกข้อมูลให้ครบถ้วน');
             return;
        }

        const finalClassData: Class = {
            classId: classData?.classId || `c${Date.now()}`,
            level,
            room,
            yearBe: classData?.yearBe || new Date().getFullYear() + 543,
            isActive: classData?.isActive ?? true,
            yearMode: 'PRIMARY', // Simplified
            termLabel: String(new Date().getFullYear() + 543), // Simplified
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
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{classData?.classId ? 'แก้ไขห้องเรียน' : 'สร้างห้องเรียนใหม่'}</DialogTitle>
                    <DialogDescription>
                        {classData?.classId ? `แก้ไขข้อมูลสำหรับห้อง ${classData.level}/${classData.room}` : 'กรอกข้อมูลเพื่อสร้างห้องเรียนในระบบ'}
                    </DialogDescription>
                </DialogHeader>
                {open && <ClassForm classData={classData || null} onSave={onSave} closeDialog={() => onOpenChange(false)} />}
            </DialogContent>
        </Dialog>
    )
}

function EditStudentDialog({ 
    student, 
    user, 
    onSave, 
    open, 
    onOpenChange 
}: { 
    student: Student | null, 
    user: User | null,
    onSave: (studentData: Student, userData: User) => void,
    open: boolean, 
    onOpenChange: (open: boolean) => void 
}) {
    const [prefixTh, setPrefixTh] = useState(student?.prefixTh || '');
    const [firstNameTh, setFirstNameTh] = useState(student?.firstNameTh || '');
    const [lastNameTh, setLastNameTh] = useState(student?.lastNameTh || '');
    const [classNumber, setClassNumber] = useState(student?.classNumber || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    
    if (!open) return null;

    const handleSave = () => {
        if (!prefixTh || !firstNameTh || !lastNameTh || !email || !student || !user) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }
        
        const updatedStudent: Student = {
            ...student,
            prefixTh,
            firstNameTh,
            lastNameTh,
            classNumber: Number(classNumber) || undefined,
        };

        const updatedUser: User = {
            ...user,
            email,
            password: password || user.password,
            displayName: `${firstNameTh} ${lastNameTh}`,
            thaiName: `${prefixTh}${firstNameTh} ${lastNameTh}`,
        };

        onSave(updatedStudent, updatedUser);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>แก้ไขข้อมูลนักเรียน</DialogTitle>
                    <DialogDescription>แก้ไขข้อมูลสำหรับ {student?.firstNameTh} {student?.lastNameTh}</DialogDescription>
                </DialogHeader>
                 <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="prefix" className="text-right">คำนำหน้า</Label>
                        <Input id="prefix" value={prefixTh} onChange={e => setPrefixTh(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="firstName" className="text-right">ชื่อจริง</Label>
                        <Input id="firstName" value={firstNameTh} onChange={e => setFirstNameTh(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="lastName" className="text-right">นามสกุล</Label>
                        <Input id="lastName" value={lastNameTh} onChange={e => setLastNameTh(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="classNumber" className="text-right">เลขที่</Label>
                        <Input id="classNumber" type="number" value={classNumber} onChange={e => setClassNumber(e.target.value)} className="col-span-3" />
                    </div>
                    <hr className="col-span-4 my-2" />
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">อีเมล</Label>
                        <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">รหัสผ่านใหม่</Label>
                        <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="col-span-3" placeholder="(ปล่อยว่างไว้หากไม่ต้องการเปลี่ยน)" />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="secondary">ยกเลิก</Button></DialogClose>
                    <Button onClick={handleSave}>บันทึกการเปลี่ยนแปลง</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function StudentImportCard({ 
    onImport,
}: { 
    onImport: (data: { newUsers: User[], newStudents: Student[], newEnrollments: Enrollment[] }) => void 
}) {
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDownloadTemplate = () => {
        const header = 'studentId,stuCode,prefixTh,firstNameTh,lastNameTh,email,password,level,room,classNumber\n';
        const sampleData = 'stu_new_1,S006,ด.ช.,เด็กใหม่,คนหนึ่ง,student.new1@school.ac.th,password,ป.1,1,30\n';
        
        const csvContent = "\uFEFF" + header + sampleData;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `student_import_template.csv`);
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
                const newUsers: User[] = [];
                const newStudents: Student[] = [];
                const newEnrollments: Enrollment[] = [];
                let importedCount = 0;

                const existingClasses = initialClasses;

                lines.forEach((line, index) => {
                    if (line.trim() === '') return;
                    const [studentId, stuCode, prefixTh, firstNameTh, lastNameTh, email, password, level, room, classNumber] = line.split(',').map(s => s.trim());
                    
                    const classTarget = existingClasses.find(c => c.level === level && c.room === room && c.isActive);

                    if (studentId && stuCode && firstNameTh && lastNameTh && email && password && classTarget) {
                        const now = new Date().toISOString();
                        const userId = `user-csv-${Date.now()}-${index}`;

                        newUsers.push({
                            userId,
                            email,
                            password,
                            displayName: `${firstNameTh} ${lastNameTh}`,
                            thaiName: `${prefixTh}${firstNameTh} ${lastNameTh}`,
                            role: 'STUDENT',
                            studentId: studentId,
                            status: 'ACTIVE',
                            createdAt: now,
                        });
                        
                        newStudents.push({
                            studentId,
                            stuCode,
                            prefixTh,
                            firstNameTh,
                            lastNameTh,
                            level,
                            room,
                            classNumber: classNumber ? parseInt(classNumber) : undefined,
                            homeroomEmail: classTarget.homeroomTeacherEmail || '',
                            status: 'ACTIVE',
                            admitYearBe: classTarget.yearBe,
                        });

                        newEnrollments.push({
                            enrollmentId: `enroll-csv-${Date.now()}-${index}`,
                            studentId,
                            classId: classTarget.classId,
                            status: 'ENROLLED'
                        });

                        importedCount++;
                    }
                });

                if (importedCount > 0) {
                    onImport({ newUsers, newStudents, newEnrollments });
                } else {
                     toast({
                        variant: 'destructive',
                        title: 'ไม่พบข้อมูลที่ถูกต้อง',
                        description: 'ไม่พบข้อมูลนักเรียนที่ถูกต้องในไฟล์ CSV หรือไม่พบห้องเรียนที่ตรงกัน',
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
                <CardTitle>นำข้อมูลนักเรียนเข้าสู่ระบบ (CSV)</CardTitle>
                <CardDescription>
                    สร้างบัญชีผู้ใช้, ข้อมูลนักเรียน, และลงทะเบียนเข้าห้องเรียนในขั้นตอนเดียว
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div>
                    <h4 className="font-semibold">ดาวน์โหลดเทมเพลต</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                        ดาวน์โหลดไฟล์ตัวอย่างเพื่อดูรูปแบบข้อมูลที่ถูกต้อง
                    </p>
                    <Button variant="outline" onClick={handleDownloadTemplate}>
                        <Download className="mr-2"/> เทมเพลตสำหรับลงทะเบียนนักเรียน
                    </Button>
                </div>
                 <div>
                    <h4 className="font-semibold">อัปโหลดไฟล์</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                        เลือกไฟล์ CSV ที่กรอกข้อมูลนักเรียนเรียบร้อยแล้วเพื่อนำเข้าสู่ระบบ
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

function StudentActionDropdown({ student, user, onEdit }: { student: Student, user: User | null, onEdit: () => void }) {
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
                {/* Delete student functionality could be added here */}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default function AdminClassesPage() {
    const [allClasses, setAllClasses] = useState<Class[]>(initialClasses.sort((a,b) => a.level.localeCompare(b.level) || a.room.localeCompare(b.room)));
    const [allUsers, setAllUsers] = useState<User[]>(initialUsers);
    const [allStudents, setAllStudents] = useState<Student[]>(initialStudents);
    const [allEnrollments, setAllEnrollments] = useState<Enrollment[]>(initialEnrollments);
    
    const [editingClass, setEditingClass] = useState<Class | null>(null);
    const [viewingClass, setViewingClass] = useState<Class | null>(null);
    const [isClassDialogOpen, setIsClassDialogOpen] = useState(false);
    
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);

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
        return allStudents
            .filter(s => studentIds.includes(s.studentId))
            .sort((a,b) => (a.classNumber || 999) - (b.classNumber || 999));
    }, [viewingClass, allEnrollments, allStudents]);

    const usersByStudentId = useMemo(() => {
        const map = new Map<string, User>();
        allUsers.forEach(u => {
            if (u.studentId) {
                map.set(u.studentId, u);
            }
        });
        return map;
    }, [allUsers]);

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
        setIsClassDialogOpen(false);
    }
    
    const handleDeleteClass = (classId: string) => {
        setAllEnrollments(prev => prev.filter(e => e.classId !== classId));
        setAllClasses(prev => prev.filter(c => c.classId !== classId));
        toast({ title: "ลบสำเร็จ", description: "ห้องเรียนและข้อมูลการลงทะเบียนได้ถูกลบแล้ว" });
    }

    const handleOpenClassDialog = (classItem: Class | null = null) => {
        setEditingClass(classItem);
        setIsClassDialogOpen(true);
    };

    const handleStudentImport = ({ newUsers, newStudents, newEnrollments }: { newUsers: User[], newStudents: Student[], newEnrollments: Enrollment[] }) => {
        const existingUserEmails = new Set(allUsers.map(u => u.email.toLowerCase()));
        const existingStudentIds = new Set(allStudents.map(s => s.studentId));

        const uniqueNewUsers = newUsers.filter(u => !existingUserEmails.has(u.email.toLowerCase()));
        const uniqueNewStudents = newStudents.filter(s => !existingStudentIds.has(s.studentId));
        
        let conflicts = newUsers.length - uniqueNewUsers.length + (newStudents.length - uniqueNewStudents.length);
        
        if (conflicts > 0) {
             toast({
                variant: "destructive",
                title: "ตรวจพบข้อมูลซ้ำซ้อน",
                description: `ข้ามการนำเข้า ${conflicts} รายการ เนื่องจากมีอีเมลหรือรหัสนักเรียนซ้ำกับข้อมูลที่มีอยู่แล้ว`
            });
        }
        
        const validUserIds = new Set(uniqueNewUsers.map(u => u.studentId));
        const validStudentIds = new Set(uniqueNewStudents.map(s => s.studentId));

        const finalNewEnrollments = newEnrollments.filter(e => validUserIds.has(e.studentId) && validStudentIds.has(e.studentId));
        
        if (uniqueNewUsers.length > 0) {
            setAllUsers(prev => [...prev, ...uniqueNewUsers]);
        }
        if (uniqueNewStudents.length > 0) {
            setAllStudents(prev => [...prev, ...uniqueNewStudents]);
        }
        if (finalNewEnrollments.length > 0) {
            setAllEnrollments(prev => [...prev, ...finalNewEnrollments]);
        }

        if (finalNewEnrollments.length > 0) {
            toast({
                title: 'นำเข้าสำเร็จ!',
                description: `สร้างและลงทะเบียนนักเรียนใหม่ ${finalNewEnrollments.length} คน`,
            });
        }
    };
    
    const paginatedClasses = allClasses.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const totalPages = Math.ceil(allClasses.length / itemsPerPage);

    const handleOpenStudentDialog = (student: Student) => {
        setEditingStudent(student);
        setIsStudentDialogOpen(true);
    };

    const handleSaveStudent = (studentData: Student, userData: User) => {
        // Check for email conflicts
        const isEmailDuplicate = allUsers.some(u => u.email.toLowerCase() === userData.email.toLowerCase() && u.userId !== userData.userId);
        if (isEmailDuplicate) {
            toast({
                variant: 'destructive',
                title: 'แก้ไขไม่สำเร็จ',
                description: 'มีผู้ใช้งานอีเมลนี้ในระบบแล้ว'
            });
            return;
        }

        setAllStudents(prev => prev.map(s => s.studentId === studentData.studentId ? studentData : s));
        setAllUsers(prev => prev.map(u => u.userId === userData.userId ? userData : u));
        
        toast({
            title: 'แก้ไขสำเร็จ',
            description: `ข้อมูลของ ${studentData.firstNameTh} ได้รับการอัปเดตแล้ว`
        });
        setIsStudentDialogOpen(false);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">จัดการห้องเรียนและนักเรียน</h1>
                    <p className="text-muted-foreground">สร้างห้องเรียน และนำข้อมูลนักเรียนเข้าสู่ระบบ</p>
                </div>
                <Button onClick={() => handleOpenClassDialog()}>
                    <PlusCircle className="mr-2" />
                    สร้างห้องเรียนใหม่
                </Button>
            </div>

            <StudentImportCard onImport={handleStudentImport} />

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
                                <TableHead className="text-center">ปีการศึกษา</TableHead>
                                <TableHead className="text-center">จำนวนนักเรียน</TableHead>
                                <TableHead className="text-right">การดำเนินการ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedClasses.map((c) => (
                                <TableRow key={c.classId}>
                                    <TableCell>{c.level}</TableCell>
                                    <TableCell>{c.room}</TableCell>
                                    <TableCell className="text-center">{c.yearBe}</TableCell>
                                    <TableCell className="text-center">{studentCountByClass[c.classId] || 0}</TableCell>
                                    <TableCell className="text-right">
                                       <ActionDropdown 
                                            classItem={c} 
                                            onViewStudents={() => setViewingClass(c)}
                                            onEdit={() => handleOpenClassDialog(c)}
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
                                    <TableHead>เลขที่</TableHead>
                                    <TableHead>รหัสนักเรียน</TableHead>
                                    <TableHead>ชื่อ-สกุล</TableHead>
                                    <TableHead>อีเมล</TableHead>
                                    <TableHead className="text-right">การดำเนินการ</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {studentsInViewingClass.map((student) => {
                                    const user = usersByStudentId.get(student.studentId) || null;
                                    return (
                                        <TableRow key={student.studentId}>
                                            <TableCell>{student.classNumber || '-'}</TableCell>
                                            <TableCell>{student.stuCode}</TableCell>
                                            <TableCell>{`${student.prefixTh}${student.firstNameTh} ${student.lastNameTh}`}</TableCell>
                                            <TableCell>{user?.email}</TableCell>
                                            <TableCell className="text-right">
                                                <StudentActionDropdown 
                                                    student={student} 
                                                    user={user}
                                                    onEdit={() => handleOpenStudentDialog(student)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
            
            <CreateOrEditClassDialog
                open={isClassDialogOpen}
                onOpenChange={setIsClassDialogOpen}
                classData={editingClass}
                onSave={handleSaveClass}
            />

            <EditStudentDialog
                open={isStudentDialogOpen}
                onOpenChange={setIsStudentDialogOpen}
                student={editingStudent}
                user={editingStudent ? usersByStudentId.get(editingStudent.studentId) || null : null}
                onSave={handleSaveStudent}
            />
        </div>
    )
}
