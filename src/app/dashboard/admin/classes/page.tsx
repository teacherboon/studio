
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { classes } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

function CreateClassDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                 <Button>
                    <PlusCircle className="mr-2" />
                    สร้างห้องเรียนใหม่
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>สร้างห้องเรียนใหม่</DialogTitle>
                    <DialogDescription>
                        ฟังก์ชันนี้ยังไม่พร้อมใช้งานในเวอร์ชันนี้
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

function ActionDropdown() {
    const { toast } = useToast();
    const showPlaceholderToast = () => {
        toast({
            title: "ยังไม่พร้อมใช้งาน",
            description: "ฟังก์ชันแก้ไขและลบยังไม่สามารถใช้งานได้",
        });
    };

    return (
        <Dialog>
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
                    <DropdownMenuItem onClick={showPlaceholderToast} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>ลบ</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </Dialog>
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
                                        <ActionDropdown />
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
