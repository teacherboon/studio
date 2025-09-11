
"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download, PlusCircle, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
import { users as initialUsers, type User } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

function ActionDropdown({ user, onDelete }: { user: User, onDelete: () => void }) {
    const { toast } = useToast();
    const showPlaceholderToast = () => {
        toast({
            title: "ยังไม่พร้อมใช้งาน",
            description: `ฟังก์ชันแก้ไขสำหรับ ${user.displayName} ยังไม่สามารถใช้งานได้`,
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
                <DropdownMenuItem onClick={showPlaceholderToast}>
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
                                คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้ "{user.displayName}"? การกระทำนี้ไม่สามารถย้อนกลับได้
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

const UserImportCard = () => {
    const { toast } = useToast();

    const handleDownloadTemplate = (type: 'teachers' | 'students') => {
        const header = type === 'teachers' 
            ? 'email,displayName,thaiName,password,homeroomClass\n'
            : 'stuCode,classNumber,prefixTh,firstNameTh,lastNameTh,email,password,class\n';
        const sampleData = type === 'teachers'
            ? 'teacher.c@school.ac.th,Teacher C,ครู ซี,password123,ป.1/1\n'
            : 'S006,4,ด.ช.,เด็กใหม่,นามสกุลดี,student.new@school.ac.th,password123,ป.6/1\n';
        
        const csvContent = "\uFEFF" + header + sampleData;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${type}_import_template.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleUploadClick = () => {
        toast({
            title: 'ฟังก์ชันยังไม่พร้อมใช้งาน',
            description: 'การอัปโหลดไฟล์ CSV ยังไม่สามารถใช้งานได้ในเวอร์ชันนี้',
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>นำเข้าข้อมูลผู้ใช้ (CSV)</CardTitle>
                <CardDescription>
                    เพิ่มข้อมูลครูและนักเรียนจำนวนมากผ่านไฟล์ CSV
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-semibold">ดาวน์โหลดเทมเพลต</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                        ดาวน์โหลดไฟล์ตัวอย่างเพื่อดูรูปแบบข้อมูลที่ถูกต้อง
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button variant="outline" onClick={() => handleDownloadTemplate('teachers')}>
                            <Download className="mr-2"/> เทมเพลตสำหรับครู
                        </Button>
                        <Button variant="outline" onClick={() => handleDownloadTemplate('students')}>
                            <Download className="mr-2"/> เทมเพลตสำหรับนักเรียน
                        </Button>
                    </div>
                </div>
                 <div>
                    <h4 className="font-semibold">อัปโหลดไฟล์</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                        เลือกไฟล์ CSV ที่กรอกข้อมูลเรียบร้อยแล้วเพื่อนำเข้าสู่ระบบ
                    </p>
                    <Button onClick={handleUploadClick}>
                        <Upload className="mr-2"/> อัปโหลดไฟล์ CSV
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};


export default function AdminUsersPage() {
    const [userList, setUserList] = useState<User[]>(initialUsers);
    const { toast } = useToast();

    const handleDeleteUser = (userId: string) => {
        setUserList(prev => prev.filter(u => u.userId !== userId));
        toast({
            title: 'ลบผู้ใช้สำเร็จ',
            description: 'ผู้ใช้ได้ถูกลบออกจากระบบแล้ว',
        })
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline">จัดการผู้ใช้งาน</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button><PlusCircle className="mr-2" /> เพิ่มผู้ใช้งานใหม่</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>เพิ่มผู้ใช้งานใหม่</DialogTitle>
                            <DialogDescription>
                                ฟังก์ชันนี้ยังไม่พร้อมใช้งานในเวอร์ชันนี้
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
            <p className="text-muted-foreground">เพิ่ม, แก้ไข, และดูบัญชีผู้ใช้ทั้งหมดในระบบ</p>

            <UserImportCard />

            <Card>
                <CardHeader>
                    <CardTitle>รายชื่อผู้ใช้ทั้งหมด</CardTitle>
                    <CardDescription>
                        แสดงรายชื่อผู้ใช้งานทั้งหมดในระบบ
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ชื่อที่แสดง</TableHead>
                                <TableHead>อีเมล</TableHead>
                                <TableHead>บทบาท</TableHead>

                                <TableHead>สถานะ</TableHead>
                                <TableHead className="text-right">การดำเนินการ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userList.map((user) => (
                                <TableRow key={user.userId}>
                                    <TableCell className="font-medium">{user.displayName} ({user.thaiName})</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            user.role === 'ADMIN' ? 'destructive' :
                                            user.role === 'TEACHER' ? 'secondary' : 'default'
                                        }>{user.role}</Badge>
                                    </TableCell>
                                    <TableCell>
                                         <span className={`px-2 py-1 text-xs rounded-full ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {user.status === 'ACTIVE' ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                                        </span>
                                    </TableCell>
                                     <TableCell className="text-right">
                                        <ActionDropdown user={user} onDelete={() => handleDeleteUser(user.userId)} />
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
