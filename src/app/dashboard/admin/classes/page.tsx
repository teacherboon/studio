
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
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { classes } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import type { Class } from '@/lib/types';

function CreateClassDialog() {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [yearMode, setYearMode] = useState<'PRIMARY' | 'SECONDARY' | ''>('');

    const handleCreate = () => {
        // In a real app, you would handle form state and submission here
        toast({
            title: "สร้างห้องเรียนสำเร็จ (จำลอง)",
            description: "ห้องเรียนใหม่ได้ถูกเพิ่มเข้าระบบแล้ว"
        });
        setOpen(false); // Close the dialog
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                 <Button>
                    <PlusCircle className="mr-2" />
                    สร้างห้องเรียนใหม่
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>สร้างห้องเรียนใหม่</DialogTitle>
                    <DialogDescription>
                        กรอกข้อมูลเพื่อสร้างห้องเรียนสำหรับปีการศึกษาใหม่
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="year" className="text-right">
                            ปีการศึกษา
                        </Label>
                        <Input id="year" type="number" placeholder="เช่น 2568" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="level" className="text-right">
                            ระดับชั้น
                        </Label>
                        <Input id="level" placeholder="เช่น ป.1 หรือ ม.4" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="room" className="text-right">
                            ห้อง
                        </Label>
                        <Input id="room" placeholder="เช่น 1 หรือ 2" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="yearMode" className="text-right">
                            ระบบภาคเรียน
                        </Label>
                        <Select onValueChange={(value) => setYearMode(value as any)}>
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
                                <Input id="term1_label" placeholder="เช่น 1/2568" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="term2_label" className="text-right">
                                    ป้ายภาคเรียน 2
                                </Label>
                                <Input id="term2_label" placeholder="เช่น 2/2568" className="col-span-3" />
                            </div>
                         </>
                    )}

                </div>
                <DialogFooter>
                    <Button type="button" onClick={handleCreate}>สร้างห้องเรียน</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function ActionDropdown({ classItem }: { classItem: Class }) {
    const { toast } = useToast();
    const showPlaceholderToast = (action: 'แก้ไข' | 'ลบ') => {
        toast({
            title: "ยังไม่พร้อมใช้งาน",
            description: `ฟังก์ชัน ${action} ห้อง ${classItem.level}/${classItem.room} ยังไม่สามารถใช้งานได้`,
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
                <DropdownMenuItem onClick={() => showPlaceholderToast('แก้ไข')}>
                    <Pencil className="mr-2 h-4 w-4" />
                    <span>แก้ไข</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => showPlaceholderToast('ลบ')} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>ลบ</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default function AdminClassesPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">จัดการห้องเรียน</h1>
                    <p className="text-muted-foreground">สร้าง, แก้ไข, และดูข้อมูลห้องเรียนทั้งหมดในระบบ</p>
                </div>
                <CreateClassDialog />
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
                                <TableHead>ระดับชั้น</TableHead>
                                <TableHead>ห้อง</TableHead>
                                <TableHead>ภาคเรียน/ปีการศึกษา</TableHead>
                                <TableHead>สถานะ</TableHead>
                                <TableHead className="text-right">การดำเนินการ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {classes.map((c) => (
                                <TableRow key={c.classId}>
                                    <TableCell>{c.level}</TableCell>
                                    <TableCell>{c.room}</TableCell>
                                    <TableCell>{c.termLabel}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 text-xs rounded-full ${c.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {c.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <ActionDropdown classItem={c} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
