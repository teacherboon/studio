
"use client";

import { useState } from 'react';
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
  DialogTrigger,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { classes as initialClasses } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import type { Class } from '@/lib/types';


function ClassForm({ classData, onSave, closeDialog }: { classData: Partial<Class> | null, onSave: (classData: Class) => void, closeDialog: () => void }) {
    const [year, setYear] = useState(classData?.yearBe || new Date().getFullYear() + 543);
    const [level, setLevel] = useState(classData?.level || '');
    const [room, setRoom] = useState(classData?.room || '');
    const [yearMode, setYearMode] = useState<'PRIMARY' | 'SECONDARY' | ''>(classData?.yearMode || '');
    const [term1Label, setTerm1Label] = useState(classData?.yearMode === 'SECONDARY' ? (classData.termLabel?.split(',')[0] || '') : '');
    const [term2Label, setTerm2Label] = useState(classData?.yearMode === 'SECONDARY' ? (classData.termLabel?.split(',')[1] || '') : '');
    const isEditing = !!classData;

    const handleSave = () => {
        // Basic validation
        if (!year || !level || !room || !yearMode) {
             alert('กรุณากรอกข้อมูลให้ครบถ้วน');
             return;
        }

        let finalClassData: Class;

        if (yearMode === 'PRIMARY') {
            finalClassData = {
                classId: classData?.classId || `c${Date.now()}`,
                yearBe: year,
                level,
                room,
                yearMode,
                termLabel: String(year),
                isActive: classData?.isActive ?? true,
            };
        } else { // SECONDARY
            if (!term1Label || !term2Label) {
                 alert('กรุณากรอกป้ายภาคเรียนสำหรับมัธยม');
                 return;
            }
             finalClassData = {
                classId: classData?.classId || `c${Date.now()}`,
                yearBe: year,
                level,
                room,
                yearMode,
                termLabel: `${term1Label},${term2Label}`,
                isActive: classData?.isActive ?? true,
            };
        }
        
        onSave(finalClassData);
        closeDialog();
    }

    return (
        <>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="year" className="text-right">
                        ปีการศึกษา
                    </Label>
                    <Input id="year" type="number" value={year} onChange={e => setYear(Number(e.target.value))} placeholder="เช่น 2568" className="col-span-3" readOnly={isEditing} />
                </div>
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
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="yearMode" className="text-right">
                        ระบบภาคเรียน
                    </Label>
                    <Select value={yearMode} onValueChange={(value) => setYearMode(value as any)}>
                            <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="เลือกระบบ" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="PRIMARY">ระบบปีการศึกษา (ประถม)</SelectItem>
                            <SelectItem value="SECONDARY">ระบบภาคเรียน (มัธยม)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {yearMode === 'SECONDARY' && (
                        <>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="term1_label" className="text-right">
                                ป้ายภาคเรียน 1
                            </Label>
                            <Input id="term1_label" value={term1Label} onChange={e => setTerm1Label(e.target.value)} placeholder="เช่น 1/2568" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="term2_label" className="text-right">
                                ป้ายภาคเรียน 2
                            </Label>
                            <Input id="term2_label" value={term2Label} onChange={e => setTerm2Label(e.target.value)} placeholder="เช่น 2/2568" className="col-span-3" />
                        </div>
                        </>
                )}

            </div>
            <DialogFooter>
                 <DialogClose asChild>
                    <Button type="button" variant="secondary">ยกเลิก</Button>
                </DialogClose>
                <Button type="button" onClick={handleSave}>{classData ? 'บันทึกการเปลี่ยนแปลง' : 'สร้างห้องเรียน'}</Button>
            </DialogFooter>
        </>
    )
}

function CreateOrEditClassDialog({ classData, onSave, open, onOpenChange }: { classData?: Class | null, onSave: (data: Class) => void, open: boolean, onOpenChange: (open: boolean) => void }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{classData ? 'แก้ไขห้องเรียน' : 'สร้างห้องเรียนใหม่'}</DialogTitle>
                    <DialogDescription>
                        {classData ? `แก้ไขข้อมูลสำหรับห้อง ${classData.level}/${classData.room}` : 'กรอกข้อมูลเพื่อสร้างห้องเรียนสำหรับปีการศึกษาใหม่'}
                    </DialogDescription>
                </DialogHeader>
                <ClassForm classData={classData || null} onSave={onSave} closeDialog={() => onOpenChange(false)} />
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
    const [allClasses, setAllClasses] = useState<Class[]>(initialClasses);
    const [editingClass, setEditingClass] = useState<Class | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    const handleSaveClass = (data: Class) => {
        const isEditing = allClasses.some(c => c.classId === data.classId);

        if (isEditing) {
            setAllClasses(prev => prev.map(c => c.classId === data.classId ? data : c));
            toast({ title: "แก้ไขสำเร็จ", description: "ข้อมูลห้องเรียนได้รับการอัปเดตแล้ว" });
        } else {
            // Check for duplicates before adding
            const isDuplicate = allClasses.some(
                c => c.yearBe === data.yearBe && c.level === data.level && c.room === data.room
            );
            if (isDuplicate) {
                toast({
                    variant: "destructive",
                    title: "สร้างไม่สำเร็จ",
                    description: `ห้องเรียน ${data.level}/${data.room} สำหรับปีการศึกษา ${data.yearBe} มีอยู่แล้ว`,
                });
                return;
            }
            setAllClasses(prev => [data, ...prev].sort((a, b) => b.yearBe - a.yearBe));
            toast({ title: "สร้างสำเร็จ", description: "ห้องเรียนใหม่ได้ถูกเพิ่มเข้าระบบแล้ว" });
        }
    }
    
    const handleDeleteClass = (classId: string) => {
        setAllClasses(prev => prev.filter(c => c.classId !== classId));
        toast({ title: "ลบสำเร็จ", description: "ห้องเรียนได้ถูกลบออกจากระบบแล้ว" });
    }

    const handleOpenDialog = (classItem: Class | null = null) => {
        setEditingClass(classItem);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">จัดการห้องเรียน</h1>
                    <p className="text-muted-foreground">สร้าง, แก้ไข, และดูข้อมูลห้องเรียนทั้งหมดในระบบ</p>
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
                        ห้องเรียนทั้งหมดที่เปิดใช้งานในระบบ
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ปีการศึกษา</TableHead>
                                <TableHead>ระดับชั้น</TableHead>
                                <TableHead>ห้อง</TableHead>
                                <TableHead>ภาคเรียน/ปีการศึกษา</TableHead>
                                <TableHead>สถานะ</TableHead>
                                <TableHead className="text-right">การดำเนินการ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allClasses.map((c) => (
                                <TableRow key={c.classId}>
                                    <TableCell>{c.yearBe}</TableCell>
                                    <TableCell>{c.level}</TableCell>
                                    <TableCell>{c.room}</TableCell>
                                    <TableCell>{c.termLabel.replace(',', ', ')}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 text-xs rounded-full ${c.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {c.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                                        </span>
                                    </TableCell>
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
