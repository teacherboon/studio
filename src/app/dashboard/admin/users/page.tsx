
"use client";

import { useState, ChangeEvent } from "react";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { users as initialUsers, type User, type UserRole } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

function UserForm({ userData, onSave, closeDialog }: { userData: Partial<User> | null, onSave: (userData: User) => void, closeDialog: () => void }) {
    const [displayName, setDisplayName] = useState(userData?.displayName || '');
    const [thaiName, setThaiName] = useState(userData?.thaiName || '');
    const [email, setEmail] = useState(userData?.email || '');
    const [role, setRole] = useState<UserRole>(userData?.role || 'STUDENT');

    const handleSave = () => {
        if (!displayName || !thaiName || !email || !role) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        const finalUserData: User = {
            userId: userData?.userId || `user${Math.random()}`,
            displayName,
            thaiName,
            email,
            role,
            status: userData?.status || 'ACTIVE',
            createdAt: userData?.createdAt || new Date().toISOString(),
            password: userData?.password || 'password', // Default password for new users
        };

        onSave(finalUserData);
        closeDialog();
    };

    return (
        <>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="displayName" className="text-right">ชื่อที่แสดง</Label>
                    <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="thaiName" className="text-right">ชื่อภาษาไทย</Label>
                    <Input id="thaiName" value={thaiName} onChange={(e) => setThaiName(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">อีเมล</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">บทบาท</Label>
                    <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="เลือกบทบาท" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ADMIN">ผู้ดูแลระบบ (ADMIN)</SelectItem>
                            <SelectItem value="TEACHER">ครู (TEACHER)</SelectItem>
                            <SelectItem value="STUDENT">นักเรียน (STUDENT)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">ยกเลิก</Button>
                </DialogClose>
                <Button type="button" onClick={handleSave}>{userData ? 'บันทึกการเปลี่ยนแปลง' : 'สร้างผู้ใช้'}</Button>
            </DialogFooter>
        </>
    );
}


function CreateOrEditUserDialog({ user, onSave, trigger, open, onOpenChange }: { user?: User | null, onSave: (data: User) => void, trigger: React.ReactNode, open: boolean, onOpenChange: (open: boolean) => void }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{user ? 'แก้ไขผู้ใช้งาน' : 'สร้างผู้ใช้งานใหม่'}</DialogTitle>
                    <DialogDescription>
                        {user ? 'แก้ไขข้อมูลผู้ใช้ในระบบ' : 'กรอกข้อมูลเพื่อสร้างผู้ใช้ใหม่'}
                    </DialogDescription>
                </DialogHeader>
                <UserForm userData={user || null} onSave={onSave} closeDialog={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    );
}


function ActionDropdown({ user, onEdit, onDelete }: { user: User, onEdit: () => void, onDelete: () => void }) {
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

const UserImportCard = ({ onUsersImported }: { onUsersImported: (newUsers: User[]) => void }) => {
    const { toast } = useToast();
    const fileInputRef = useState<HTMLInputElement>(null);

    const handleDownloadTemplate = (type: 'teachers' | 'students') => {
        const header = type === 'teachers' 
            ? 'email,displayName,thaiName,password,homeroomClassId\n'
            : 'studentId,prefixTh,firstNameTh,lastNameTh,email,password\n';
        const sampleData = type === 'teachers'
            ? 'teacher.c@school.ac.th,Teacher C,ครู ซี,password123,c2\n'
            : 'stu6,ด.ช.,เด็กใหม่,ดีเด่น,student.new@school.ac.th,password123\n';
        
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
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const lines = text.split('\n');
            const header = lines[0].trim().split(',');

            if (header.includes('studentId')) {
                processStudentCsv(text);
            } else if (header.includes('homeroomClassId')) {
                processTeacherCsv(text);
            } else {
                toast({
                    variant: 'destructive',
                    title: 'ไฟล์ไม่ถูกต้อง',
                    description: 'ไม่รู้จักรูปแบบของไฟล์ CSV',
                });
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    }

    const processStudentCsv = (csvText: string) => {
        try {
            const lines = csvText.split('\n').slice(1);
            const newUsers: User[] = [];
            let importedCount = 0;

            lines.forEach((line) => {
                if (line.trim() === '') return;
                const [studentId, prefixTh, firstNameTh, lastNameTh, email, password] = line.split(',').map(s => s.trim());

                if (studentId && email && password) {
                    newUsers.push({
                        userId: `user-csv-${Date.now()}-${importedCount}`,
                        role: 'STUDENT',
                        email,
                        displayName: `${firstNameTh} ${lastNameTh}`,
                        thaiName: `${prefixTh}${firstNameTh} ${lastNameTh}`,
                        password,
                        studentId,
                        status: 'ACTIVE',
                        createdAt: new Date().toISOString(),
                    });
                    importedCount++;
                }
            });
            
            if (importedCount > 0) {
                onUsersImported(newUsers);
                toast({
                    title: 'อัปโหลดสำเร็จ',
                    description: `นำเข้าข้อมูลนักเรียนใหม่ ${importedCount} คน`,
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'ไม่พบข้อมูลที่ถูกต้อง',
                    description: 'ไม่พบข้อมูลนักเรียนที่ถูกต้องในไฟล์ CSV',
                });
            }

        } catch (error) {
             toast({
                variant: 'destructive',
                title: 'ประมวลผลไฟล์ล้มเหลว',
                description: 'เกิดข้อผิดพลาดในการอ่านข้อมูลจากไฟล์ CSV',
            });
        }
    };
    
    const processTeacherCsv = (csvText: string) => {
        try {
            const lines = csvText.split('\n').slice(1);
            const newUsers: User[] = [];
            let importedCount = 0;

            lines.forEach((line) => {
                if (line.trim() === '') return;
                const [email, displayName, thaiName, password, homeroomClassId] = line.split(',').map(s => s.trim());

                if (email && displayName && thaiName && password) {
                    newUsers.push({
                        userId: `user-csv-${Date.now()}-${importedCount}`,
                        role: 'TEACHER',
                        email,
                        displayName,
                        thaiName,
                        password,
                        homeroomClassId: homeroomClassId || undefined,
                        status: 'ACTIVE',
                        createdAt: new Date().toISOString(),
                    });
                    importedCount++;
                }
            });
            
            if (importedCount > 0) {
                onUsersImported(newUsers);
                toast({
                    title: 'อัปโหลดสำเร็จ',
                    description: `นำเข้าข้อมูลครูใหม่ ${importedCount} คน`,
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'ไม่พบข้อมูลที่ถูกต้อง',
                    description: 'ไม่พบข้อมูลครูที่ถูกต้องในไฟล์ CSV',
                });
            }

        } catch (error) {
             toast({
                variant: 'destructive',
                title: 'ประมวลผลไฟล์ล้มเหลว',
                description: 'เกิดข้อผิดพลาดในการอ่านข้อมูลจากไฟล์ CSV ของครู',
            });
        }
    };


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
};


export default function AdminUsersPage() {
    const [userList, setUserList] = useState<User[]>(initialUsers);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    const handleSaveUser = (data: User) => {
        const isEditing = userList.some(u => u.userId === data.userId);

        if (isEditing) {
            setUserList(prev => prev.map(u => u.userId === data.userId ? data : u));
            toast({ title: "แก้ไขสำเร็จ", description: "ข้อมูลผู้ใช้ได้รับการอัปเดตแล้ว" });
        } else {
            setUserList(prev => [data, ...prev]);
            toast({ title: "สร้างสำเร็จ", description: "ผู้ใช้ใหม่ได้ถูกเพิ่มเข้าระบบแล้ว" });
        }
    };

    const handleDeleteUser = (userId: string) => {
        setUserList(prev => prev.filter(u => u.userId !== userId));
        toast({
            title: 'ลบผู้ใช้สำเร็จ',
            description: 'ผู้ใช้ได้ถูกลบออกจากระบบแล้ว',
        })
    };
    
    const handleOpenDialog = (user: User | null = null) => {
        setEditingUser(user);
        setIsDialogOpen(true);
    };

    const handleUsersImport = (newUsers: User[]) => {
        setUserList(prev => [...prev, ...newUsers]);
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline">จัดการผู้ใช้งาน</h1>
                <Button onClick={() => handleOpenDialog()}><PlusCircle className="mr-2" /> เพิ่มผู้ใช้งานใหม่</Button>
            </div>
            <p className="text-muted-foreground">เพิ่ม, แก้ไข, และดูบัญชีผู้ใช้ทั้งหมดในระบบ</p>

            <UserImportCard onUsersImported={handleUsersImport}/>

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
                                        <ActionDropdown 
                                            user={user} 
                                            onEdit={() => handleOpenDialog(user)}
                                            onDelete={() => handleDeleteUser(user.userId)} 
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <CreateOrEditUserDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                user={editingUser}
                onSave={handleSaveUser}
                trigger={<></>}
            />
        </div>
    )
}

    