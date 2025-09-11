
"use client";

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
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
import { classes as initialClasses } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import type { Class } from '@/lib/types';


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
            yearBe: classData?.yearBe || 0, // No longer relevant, can be defaulted
            yearMode: classData?.yearMode || 'PRIMARY', // No longer relevant
            termLabel: classData?.termLabel || '', // No longer relevant
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

function ActionDropdown({ classItem, onEdit, onDelete }: { classItem: Class, onEdit: () => void, onDelete: () => void }) {
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
    const [editingClass, setEditingClass] = useState<Class | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const handleSaveClass = (data: Class) => {
        const isEditing = allClasses.some(c => c.classId === data.classId);

        if (isEditing) {
            setAllClasses(prev => prev.map(c => c.classId === data.classId ? data : c)
                .sort((a,b) => a.level.localeCompare(b.level) || a.room.localeCompare(b.room)));
            toast({ title: "แก้ไขสำเร็จ", description: "ข้อมูลห้องเรียนได้รับการอัปเดตแล้ว" });
        } else {
            // Check for duplicates before adding
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
        setAllClasses(prev => prev.filter(c => c.classId !== classId));
        toast({ title: "ลบสำเร็จ", description: "ห้องเรียนได้ถูกลบออกจากระบบแล้ว" });
    }

    const handleOpenDialog = (classItem: Class | null = null) => {
        setEditingClass(classItem);
        setIsDialogOpen(true);
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
                    <p className="text-muted-foreground">สร้างและแก้ไขข้อมูลห้องเรียนทั้งหมดในระบบ</p>
                </div>
                <Button onClick={() => handleOpenDialog()}>
                    <PlusCircle className="mr-2" />
                    สร้างห้องเรียนใหม่
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>รายชื่อห้องเรียน</CardTitle>
                    <CardDescription>
                        ห้องเรียนทั้งหมดที่มีอยู่ในระบบ
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ระดับชั้น</TableHead>
                                <TableHead>ห้อง</TableHead>
                                <TableHead className="text-right">การดำเนินการ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedClasses.map((c) => (
                                <TableRow key={c.classId}>
                                    <TableCell>{c.level}</TableCell>
                                    <TableCell>{c.room}</TableCell>
                                    <TableCell className="text-right">
                                       <ActionDropdown 
                                            classItem={c} 
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
            
            <CreateOrEditClassDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                classData={editingClass}
                onSave={handleSaveClass}
            />
        </div>
    )
}
