
"use client";

import { useState, ChangeEvent, useRef } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
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
    const [role, setRole] = useState<UserRole>(userData?.role || 'TEACHER');
    const [password, setPassword] = useState('');
    const [homeroomClassId, setHomeroomClassId] = useState(userData?.homeroomClassId || '');

    const handleSave = () => {
        if (!displayName || !thaiName || !email || !role) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }
        if (!userData && !password) {
            alert('กรุณากำหนดรหัสผ่านสำหรับผู้ใช้ใหม่');
            return;
        }

        const finalUserData: User = {
            userId: userData?.userId || `user-${Date.now()}`,
            displayName,
            thaiName,
            email,
            role,
            studentId: undefined, // No longer managed here
            homeroomClassId: role === 'TEACHER' ? homeroomClassId : undefined,
            status: userData?.status || 'ACTIVE',
            createdAt: userData?.createdAt || new Date().toISOString(),
            password: password || userData?.password,
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
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" readOnly={!!userData?.userId} />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">รหัสผ่าน</Label>
                    <Input 
                        id="password" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="col-span-3" 
                        placeholder={userData?.userId ? "(ปล่อยว่างไว้หากไม่ต้องการเปลี่ยน)" : "กำหนดรหัสผ่าน..."}
                    />
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
                        </SelectContent>
                    </Select>
                </div>
                 {role === 'TEACHER' && (
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="homeroomClassId" className="text-right">ID ห้องประจำชั้น</Label>
                        <Input id="homeroomClassId" value={homeroomClassId} onChange={(e) => setHomeroomClassId(e.target.value)} className="col-span-3" placeholder="เช่น c1, c2 (ถ้ามี)" />
                    </div>
                )}
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">ยกเลิก</Button>
                </DialogClose>
                <Button type="button" onClick={handleSave}>{userData?.userId ? 'บันทึกการเปลี่ยนแปลง' : 'สร้างผู้ใช้'}</Button>
            </DialogFooter>
        </>
    );
}


function CreateOrEditUserDialog({ user, onSave, open, onOpenChange }: { user?: User | null, onSave: (data: User) => void, open: boolean, onOpenChange: (open: boolean) => void }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{user?.userId ? 'แก้ไขบุคลากร' : 'สร้างบุคลากรใหม่'}</DialogTitle>
                    <DialogDescription>
                        {user?.userId ? 'แก้ไขข้อมูลบุคลากรในระบบ (ครู, ผู้ดูแลระบบ)' : 'กรอกข้อมูลเพื่อสร้างบุคลากรใหม่'}
                    </DialogDescription>
                </DialogHeader>
                {open && <UserForm userData={user || null} onSave={onSave} closeDialog={() => onOpenChange(false)} />}
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
                                คุณแน่ใจหรือไม่ว่าต้องการลบบุคลากร "{user.displayName}"? การกระทำนี้ไม่สามารถย้อนกลับได้
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
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDownloadTemplate = () => {
        const header = 'email,password,displayName,thaiName,role,homeroomClassId\n';
        const sampleData = 'teacher.d@school.ac.th,password123,Teacher D,ครูดี,TEACHER,c4\n';
        
        const csvContent = "\uFEFF" + header + sampleData;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `personnel_import_template.csv`);
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
                
                lines.forEach((line, index) => {
                     if (line.trim() === '') return;
                     const parts = line.split(',').map(s => s.trim());
                     const [email, password, displayName, thaiName, role, homeroomClassId] = parts;

                     if (email && password && displayName && thaiName && role && (role === 'ADMIN' || role === 'TEACHER')) {
                         newUsers.push({
                            userId: `user-csv-${Date.now()}-${index}`,
                            email,
                            displayName,
                            thaiName,
                            password,
                            role: role as UserRole,
                            homeroomClassId: role === 'TEACHER' ? homeroomClassId : undefined,
                            status: 'ACTIVE',
                            createdAt: new Date().toISOString(),
                         });
                     }
                });

                 if (newUsers.length > 0) {
                    onUsersImported(newUsers);
                } else {
                    toast({
                        variant: 'destructive',
                        title: 'ไม่พบข้อมูลที่ถูกต้อง',
                        description: `ไม่พบข้อมูลบุคลากรที่ถูกต้องในไฟล์ CSV`,
                    });
                }

            } catch (error) {
                toast({
                    variant: 'destructive',
                    title: 'ประมวลผลไฟล์ล้มเหลว',
                    description: `เกิดข้อผิดพลาดในการอ่านข้อมูลจากไฟล์ CSV: ${error instanceof Error ? error.message : String(error)}`,
                });
            }
        };
        reader.readAsText(file, 'UTF-8');
        event.target.value = '';
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>นำเข้าข้อมูลบุคลากร (CSV)</CardTitle>
                <CardDescription>
                    เพิ่มข้อมูลครูหรือผู้ดูแลระบบจำนวนมากผ่านไฟล์ CSV
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-semibold">ดาวน์โหลดเทมเพลต</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                        ดาวน์โหลดไฟล์ตัวอย่างเพื่อดูรูปแบบข้อมูลที่ถูกต้อง
                    </p>
                    <Button variant="outline" onClick={handleDownloadTemplate}>
                        <Download className="mr-2"/> เทมเพลตสำหรับบุคลากร
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
};


export default function AdminUsersPage() {
    const [allUsers, setAllUsers] = useState<User[]>(initialUsers);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    
    // Filter out students
    const personnel = allUsers.filter(u => u.role !== 'STUDENT').sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const handleSaveUser = (data: User) => {
        const isEditing = allUsers.some(u => u.userId === data.userId);

        if (isEditing) {
            setAllUsers(prev => prev.map(u => u.userId === data.userId ? data : u));
            toast({ title: "แก้ไขสำเร็จ", description: "ข้อมูลบุคลากรได้รับการอัปเดตแล้ว" });
        } else {
             if (allUsers.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
                toast({
                    variant: "destructive",
                    title: "สร้างไม่สำเร็จ",
                    description: "มีผู้ใช้งานอีเมลนี้ในระบบแล้ว",
                });
                return;
            }
            setAllUsers(prev => [data, ...prev]);
            toast({ title: "สร้างสำเร็จ", description: "บุคลากรใหม่ได้ถูกเพิ่มเข้าระบบแล้ว" });
        }
        setIsDialogOpen(false);
    };

    const handleDeleteUser = (userId: string) => {
        setAllUsers(prev => prev.filter(u => u.userId !== userId));
        toast({
            title: 'ลบบุคลากรสำเร็จ',
            description: 'บุคลากรได้ถูกลบออกจากระบบแล้ว',
        })
    };
    
    const handleOpenDialog = (user: User | null = null) => {
        setEditingUser(user);
        setIsDialogOpen(true);
    };

    const handleUsersImport = (newUsers: User[]) => {
        const existingEmails = new Set(allUsers.map(u => u.email.toLowerCase()));
        const uniqueNewUsers = newUsers.filter(newUser => !existingEmails.has(newUser.email.toLowerCase()));

        if (uniqueNewUsers.length < newUsers.length) {
            toast({
                variant: "default",
                title: "ตรวจพบข้อมูลซ้ำซ้อน",
                description: `ข้ามการนำเข้า ${newUsers.length - uniqueNewUsers.length} รายการ เนื่องจากมีอีเมลซ้ำกับข้อมูลที่มีอยู่แล้ว`
            });
        }
        
        if (uniqueNewUsers.length > 0) {
            setAllUsers(prev => [...prev, ...uniqueNewUsers]);
            toast({
                title: 'อัปโหลดสำเร็จ',
                description: `นำเข้าข้อมูลบุคลากรใหม่ ${uniqueNewUsers.length} คน`,
            });
        }
    }
    
    const paginatedPersonnel = personnel.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(personnel.length / itemsPerPage);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-headline">จัดการบุคลากร</h1>
                <Button onClick={() => handleOpenDialog()}><PlusCircle className="mr-2" /> เพิ่มบุคลากรใหม่</Button>
            </div>
            <p className="text-muted-foreground">เพิ่ม, แก้ไข, และดูบัญชีผู้ใช้ที่เป็นครูหรือผู้ดูแลระบบ</p>

            <UserImportCard onUsersImported={handleUsersImport}/>

            <Card>
                <CardHeader>
                    <CardTitle>รายชื่อบุคลากรทั้งหมด</CardTitle>
                    <CardDescription>
                        แสดงรายชื่อครูและผู้ดูแลระบบทั้งหมดในระบบ
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
                            {paginatedPersonnel.map((user) => (
                                <TableRow key={user.userId}>
                                    <TableCell className="font-medium">{user.displayName} ({user.thaiName})</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === 'ADMIN' ? 'destructive' : 'secondary'}>
                                            {user.role}
                                        </Badge>
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

            <CreateOrEditUserDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                user={editingUser}
                onSave={handleSaveUser}
            />
        </div>
    )
}

    