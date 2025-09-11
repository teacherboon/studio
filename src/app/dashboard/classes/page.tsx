"use client";

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { classes, students, enrollments } from "@/lib/data";
import { Download, Upload, Users, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ClassesPage() {
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const { toast } = useToast();

    const studentsInClass = useMemo(() => {
        if (!selectedClassId) return [];
        const studentIdsInClass = enrollments
            .filter(e => e.classId === selectedClassId)
            .map(e => e.studentId);
        return students.filter(s => studentIdsInClass.includes(s.studentId));
    }, [selectedClassId]);

    const handleDownloadCsv = () => {
        if (studentsInClass.length === 0) {
            toast({
                variant: 'destructive',
                title: 'ไม่สามารถดาวน์โหลดได้',
                description: 'กรุณาเลือกห้องเรียนที่มีนักเรียนก่อน',
            });
            return;
        }

        const selectedClass = classes.find(c => c.classId === selectedClassId);
        const header = 'studentId,studentCode,studentName,score\n';
        const rows = studentsInClass.map(s =>
            `${s.studentId},${s.stuCode},${s.prefixTh}${s.firstNameTh} ${s.lastNameTh},`
        ).join('\n');
        
        const csvContent = "\uFEFF" + header + rows;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `scores_template_${selectedClass?.level}-${selectedClass?.room}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleUploadClick = () => {
        // This is a placeholder for the actual upload functionality.
        // In a real app, you would trigger a file input click here.
        toast({
            title: 'ฟังก์ชันยังไม่พร้อมใช้งาน',
            description: 'การอัปโหลดไฟล์ CSV ยังไม่สามารถใช้งานได้ในเวอร์ชันนี้',
        });
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">จัดการคะแนนรายวิชา</h1>
                <p className="text-muted-foreground">เลือกห้องเรียนเพื่อดูรายชื่อนักเรียน, นำเข้าคะแนน, และจัดการข้อมูล</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>เลือกห้องเรียน</CardTitle>
                    <CardDescription>
                        เลือกห้องเรียนและรายวิชาที่ต้องการจัดการ
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Select onValueChange={setSelectedClassId} value={selectedClassId}>
                        <SelectTrigger className="w-full md:w-[280px]">
                            <SelectValue placeholder="เลือกห้องเรียน..." />
                        </SelectTrigger>
                        <SelectContent>
                            {classes.map(c => (
                                <SelectItem key={c.classId} value={c.classId}>
                                    ห้อง {c.level}/{c.room} ({c.termLabel})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>
            
            {selectedClassId && (
                 <Card>
                    <CardHeader className="flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                               <Users className="h-6 w-6" />
                               รายชื่อนักเรียน
                            </CardTitle>
                            <CardDescription>
                                ห้อง {classes.find(c => c.classId === selectedClassId)?.level}/{classes.find(c => c.classId === selectedClassId)?.room} มีนักเรียนทั้งหมด {studentsInClass.length} คน
                            </CardDescription>
                        </div>
                         <div className="flex flex-col sm:flex-row gap-2">
                            <Button variant="outline" onClick={handleDownloadCsv}>
                                <Download className="mr-2" />
                                ดาวน์โหลดเทมเพลต
                            </Button>
                            <Button onClick={handleUploadClick}>
                                <Upload className="mr-2" />
                                อัปโหลดคะแนน (CSV)
                            </Button>
                         </div>
                    </CardHeader>
                    <CardContent>
                        {studentsInClass.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[150px]">รหัสนักเรียน</TableHead>
                                        <TableHead>ชื่อ-สกุล</TableHead>
                                        <TableHead className="text-center w-[120px]">ห้อง</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {studentsInClass.map((student) => (
                                        <TableRow key={student.studentId}>
                                            <TableCell className="font-medium">{student.stuCode}</TableCell>
                                            <TableCell>{`${student.prefixTh}${student.firstNameTh} ${student.lastNameTh}`}</TableCell>
                                            <TableCell className="text-center">{student.room}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-10 text-muted-foreground">
                                <FileText className="mx-auto h-12 w-12" />
                                <h3 className="mt-2 text-lg font-semibold">ไม่พบข้อมูลนักเรียน</h3>
                                <p className="mt-1 text-sm">ไม่มีนักเรียนในห้องเรียนที่เลือก</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
