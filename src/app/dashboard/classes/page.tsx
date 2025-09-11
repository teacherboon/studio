
"use client";

import { useState, useMemo, ChangeEvent } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { classes, students, enrollments, scores as initialScores, type Score } from "@/lib/data";
import { Download, Upload, Users, FileText, Save, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ClassesPage() {
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [studentScores, setStudentScores] = useState<Record<string, number | null>>({});
    const { toast } = useToast();
    const fileInputRef = useState<HTMLInputElement>(null);


    const studentsInClass = useMemo(() => {
        if (!selectedClassId) return [];
        const studentIdsInClass = enrollments
            .filter(e => e.classId === selectedClassId)
            .map(e => e.studentId);
        return students.filter(s => studentIdsInClass.includes(s.studentId));
    }, [selectedClassId]);

    // Effect to initialize scores when class changes
    useMemo(() => {
        const initialClassScores: Record<string, number | null> = {};
        studentsInClass.forEach(student => {
            const existingScore = initialScores.find(s => s.studentId === student.studentId);
            initialClassScores[student.studentId] = existingScore?.rawScore ?? null;
        });
        setStudentScores(initialClassScores);
    }, [studentsInClass]);


    const handleScoreChange = (studentId: string, score: string) => {
        const newScore = score === '' ? null : Number(score);
        if (newScore === null || (newScore >= 0 && newScore <= 100)) {
            setStudentScores(prev => ({ ...prev, [studentId]: newScore }));
        }
    };

    const handleSaveScores = () => {
        // In a real app, you would make an API call here to persist the changes.
        // For now, we just update the initialScores array to simulate persistence.
        Object.entries(studentScores).forEach(([studentId, rawScore]) => {
            const scoreIndex = initialScores.findIndex(s => s.studentId === studentId);
            if (scoreIndex !== -1) {
                initialScores[scoreIndex].rawScore = rawScore;
            }
        });
        console.log("Saving scores:", studentScores);
        toast({
            title: 'บันทึกคะแนนสำเร็จ',
            description: 'คะแนนของนักเรียนได้รับการอัปเดตแล้ว (จำลอง)',
        });
    };

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
            `${s.studentId},${s.stuCode},"${s.prefixTh}${s.firstNameTh} ${s.lastNameTh}",`
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
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            try {
                const lines = text.split('\n').slice(1); // Skip header
                const updatedScores: Record<string, number | null> = { ...studentScores };
                let updatedCount = 0;

                lines.forEach(line => {
                    if (line.trim() === '') return;
                    const [studentId, studentCode, studentName, scoreStr] = line.split(',');
                    
                    if (studentId && studentsInClass.some(s => s.studentId === studentId.trim())) {
                        const score = scoreStr.trim() === '' ? null : Number(scoreStr.trim());
                        if (score === null || !isNaN(score)) {
                            updatedScores[studentId.trim()] = score;
                            updatedCount++;
                        }
                    }
                });

                if (updatedCount > 0) {
                    setStudentScores(updatedScores);
                    toast({
                        title: 'อัปโหลดสำเร็จ',
                        description: `คะแนนของนักเรียน ${updatedCount} คน ถูกเตรียมสำหรับบันทึก`,
                    });
                } else {
                     toast({
                        variant: 'destructive',
                        title: 'ไม่พบข้อมูลที่ตรงกัน',
                        description: 'ไม่พบรหัสนักเรียนที่ตรงกับนักเรียนในห้องนี้ในไฟล์ CSV',
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
        reader.readAsText(file);
        // Reset file input
        event.target.value = '';
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">จัดการคะแนนรายวิชา</h1>
                <p className="text-muted-foreground">เลือกห้องเรียนเพื่อดูรายชื่อนักเรียน, กรอกคะแนน หรือนำเข้าข้อมูล</p>
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
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Users className="h-6 w-6" />
                           รายชื่อนักเรียน
                        </CardTitle>
                        <CardDescription>
                            ห้อง {classes.find(c => c.classId === selectedClassId)?.level}/{classes.find(c => c.classId === selectedClassId)?.room} มีนักเรียนทั้งหมด {studentsInClass.length} คน
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                       <Tabs defaultValue="manual-entry">
                           <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                               <TabsTrigger value="manual-entry">
                                   <Edit className="mr-2"/> กรอกคะแนน
                               </TabsTrigger>
                               <TabsTrigger value="csv-upload">
                                   <Upload className="mr-2"/> อัปโหลด CSV
                                </TabsTrigger>
                           </TabsList>
                           <TabsContent value="manual-entry" className="pt-4">
                                {studentsInClass.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[150px]">รหัสนักเรียน</TableHead>
                                                    <TableHead>ชื่อ-สกุล</TableHead>
                                                    <TableHead className="text-center w-[120px]">คะแนน (เต็ม 100)</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {studentsInClass.map((student) => (
                                                    <TableRow key={student.studentId}>
                                                        <TableCell className="font-medium">{student.stuCode}</TableCell>
                                                        <TableCell>{`${student.prefixTh}${student.firstNameTh} ${student.lastNameTh}`}</TableCell>
                                                        <TableCell className="text-center">
                                                            <Input
                                                                type="number"
                                                                value={studentScores[student.studentId] ?? ''}
                                                                onChange={(e) => handleScoreChange(student.studentId, e.target.value)}
                                                                className="max-w-[100px] mx-auto text-center"
                                                                placeholder="-"
                                                                min="0"
                                                                max="100"
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="text-center py-10 text-muted-foreground">
                                        <FileText className="mx-auto h-12 w-12" />
                                        <h3 className="mt-2 text-lg font-semibold">ไม่พบข้อมูลนักเรียน</h3>
                                        <p className="mt-1 text-sm">ไม่มีนักเรียนในห้องเรียนที่เลือก</p>
                                    </div>
                                )}
                           </TabsContent>
                           <TabsContent value="csv-upload" className="pt-4 space-y-4">
                                <CardDescription>
                                    ดาวน์โหลดไฟล์เทมเพลต CSV, กรอกคะแนน, จากนั้นอัปโหลดไฟล์กลับมาที่นี่
                                </CardDescription>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Button variant="outline" onClick={handleDownloadCsv}>
                                        <Download className="mr-2" />
                                        ดาวน์โหลดเทมเพลต
                                    </Button>
                                    <Button onClick={handleUploadClick}>
                                        <Upload className="mr-2" />
                                        เลือกไฟล์ CSV เพื่ออัปโหลด
                                    </Button>
                                     <Input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        className="hidden" 
                                        accept=".csv"
                                        onChange={handleFileChange}
                                    />
                                </div>
                           </TabsContent>
                       </Tabs>
                    </CardContent>
                    <CardFooter className="border-t pt-6">
                        <Button onClick={handleSaveScores} disabled={studentsInClass.length === 0}>
                            <Save className="mr-2" />
                            บันทึกคะแนนทั้งหมด
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    )
}
