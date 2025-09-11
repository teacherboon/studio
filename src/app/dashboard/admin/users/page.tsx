
"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UserImportCard = () => {
    const { toast } = useToast();

    const handleDownloadTemplate = (type: 'teachers' | 'students') => {
        const header = type === 'teachers' 
            ? 'email,displayName,thaiName\n'
            : 'stuCode,prefixTh,firstNameTh,lastNameTh,email,homeroomEmail\n';
        const sampleData = type === 'teachers'
            ? 'teacher.c@school.ac.th,Teacher C,ครู ซี\n'
            : 'S006,ด.ช.,เด็กใหม่,นามสกุลดี,student.new@school.ac.th,teacher.a@school.ac.th\n';
        
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
                <CardTitle>นำเข้าข้อมูลผู้ใช้</CardTitle>
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
                        <Upload className="mr-2"/> เลือกไฟล์เพื่ออัปโหลด
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};


export default function AdminUsersPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">จัดการผู้ใช้งาน</h1>
                <p className="text-muted-foreground">เพิ่ม, แก้ไข, และดูบัญชีผู้ใช้ในระบบ</p>
            </div>

            <UserImportCard />

            <Card>
                <CardHeader>
                    <CardTitle>รายชื่อผู้ใช้ทั้งหมด</CardTitle>
                    <CardDescription>
                        ส่วนนี้จะแสดงตารางผู้ใช้ทั้งหมดในระบบ
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">ฟังก์ชันยังไม่พร้อมใช้งาน</p>
                </CardContent>
            </Card>
        </div>
    )
}
