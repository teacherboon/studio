
"use client";

import { useState, useMemo, ChangeEvent } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { classes, students, enrollments, scores as initialScores, type Score, offerings, subjects } from "@/lib/data";
import { Download, Upload, Users, FileText, Save, Edit, School, BookOpen, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Offering, Class } from '@/lib/types';


interface OfferingWithDetails extends Offering {
    subjectName: string;
    subjectCode: string;
    className: string;
}


export default function ClassesPage() {
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [selectedTerm, setSelectedTerm] = useState<string>('');
    const [selectedOfferingId, setSelectedOfferingId] = useState<string>('');
    
    const [studentScores, setStudentScores] = useState<Record<string, number | null>>({});
    const { toast } = useToast();
    const fileInputRef = useState<HTMLInputElement>(null);

    const academicYears = useMemo(() => {
        return [...new Set(classes.map(c => c.yearBe))].sort((a, b) => b - a);
    }, []);

    const termsForYear = useMemo(() => {
        if (!selectedYear) return [];
        const terms = new Set<string>();
        offerings.forEach(o => {
            const classInfo = classes.find(c => c.classId === o.classId);
            if (classInfo?.yearBe === Number(selectedYear)) {
                if (classInfo.yearMode === 'PRIMARY') {
                    terms.add(classInfo.termLabel);
                } else { // SECONDARY
                    classInfo.termLabel.split(',').forEach(term => terms.add(term));
                }
            }
        });
        return Array.from(terms);
    }, [selectedYear]);

    const offeringsForTerm = useMemo(() => {
        if (!selectedTerm) return [];

        const isPrimaryTerm = !selectedTerm.includes('/');

        return offerings
            .filter(o => {
                const classInfo = classes.find(c => c.classId === o.classId);
                if (!classInfo) return false;

                const termMatch = o.termLabel.includes(selectedTerm);
                
                if (isPrimaryTerm) {
                    return termMatch && classInfo.yearMode === 'PRIMARY';
                } else {
                    return termMatch && classInfo.yearMode === 'SECONDARY';
                }
            })
            .map(o => {
                const subject = subjects.find(s => s.subjectId === o.subjectId);
                const classInfo = classes.find(c => c.classId === o.classId);
                return {
                    ...o,
                    subjectName: subject?.subjectNameTh || 'N/A',
                    subjectCode: subject?.subjectCode || 'N/A',
                    className: `ห้อง ${classInfo?.level}/${classInfo?.room}` || 'N/A'
                }
            })
    }, [selectedTerm]);

    const selectedOffering = useMemo(() => {
        return offeringsForTerm.find(o => o.offeringId === selectedOfferingId);
    }, [selectedOfferingId, offeringsForTerm]);

    const studentsInClass = useMemo(() => {
        if (!selectedOffering) return [];
        const studentIdsInClass = enrollments
            .filter(e => e.classId === selectedOffering.classId)
            .map(e => e.studentId);
        return students.filter(s => studentIdsInClass.includes(s.studentId));
    }, [selectedOffering]);

    // Effect to initialize scores when class changes
    useMemo(() => {
        if (!selectedOffering) {
            setStudentScores({});
            return;
        }
        const initialClassScores: Record<string, number | null> = {};
        studentsInClass.forEach(student => {
            const existingScore = initialScores.find(s => s.studentId === student.studentId && s.offeringId === selectedOffering.offeringId);
            initialClassScores[student.studentId] = existingScore?.rawScore ?? null;
        });
        setStudentScores(initialClassScores);
    }, [studentsInClass, selectedOffering]);

    const handleYearChange = (year: string) => {
        setSelectedYear(year);
        setSelectedTerm('');
        setSelectedOfferingId('');
    }

    const handleTermChange = (term: string) => {
        setSelectedTerm(term);
        setSelectedOfferingId('');
    }


    const handleScoreChange = (studentId: string, score: string) => {
        const newScore = score === '' ? null : Number(score);
        if (newScore === null || (newScore >= 0 && newScore <= 100)) {
            setStudentScores(prev => ({ ...prev, [studentId]: newScore }));
        }
    };

    const handleSaveScores = () => {
        if (!selectedOffering) return;

        Object.entries(studentScores).forEach(([studentId, rawScore]) => {
            const scoreIndex = initialScores.findIndex(s => s.studentId === studentId && s.offeringId === selectedOffering.offeringId);
            if (scoreIndex !== -1) {
                initialScores[scoreIndex].rawScore = rawScore;
                 // TODO: Update letterGrade and gradePoint based on gradeScale
            } else {
                 // In a real app, this would be a new score record
                console.log(`Creating new score for ${studentId} in ${selectedOffering.offeringId}`);
            }
        });
        toast({
            title: 'บันทึกคะแนนสำเร็จ',
            description: 'คะแนนของนักเรียนได้รับการอัปเดตแล้ว (จำลอง)',
        });
    };

    const handleDownloadCsv = () => {
        if (studentsInClass.length === 0 || !selectedOffering) {
            toast({
                variant: 'destructive',
                title: 'ไม่สามารถดาวน์โหลดได้',
                description: 'กรุณาเลือกข้อมูลให้ครบถ้วนก่อน',
            });
            return;
        }

        const header = 'studentId,studentCode,studentName,score\n';
        const rows = studentsInClass.map(s =>
            `${s.studentId},${s.stuCode},"${s.prefixTh}${s.firstNameTh} ${s.lastNameTh}",`
        ).join('\n');
        
        const csvContent = "\uFEFF" + header + rows;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `scores_template_${selectedOffering.subjectCode}.csv`);
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
                <p className="text-muted-foreground">เลือกปีการศึกษา, ภาคเรียน, และรายวิชาเพื่อดูรายชื่อนักเรียนและกรอกคะแนน</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>เลือกข้อมูลการสอน</CardTitle>
                    <CardDescription>
                        กรุณาเลือกข้อมูลตามลำดับเพื่อค้นหารายการที่ต้องการจัดการ
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                         <Calendar className="h-5 w-5 text-muted-foreground" />
                        <Select onValueChange={handleYearChange} value={selectedYear}>
                            <SelectTrigger>
                                <SelectValue placeholder="เลือกปีการศึกษา..." />
                            </SelectTrigger>
                            <SelectContent>
                                {academicYears.map(year => (
                                    <SelectItem key={year} value={String(year)}>
                                        ปีการศึกษา {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <Select onValueChange={handleTermChange} value={selectedTerm} disabled={!selectedYear}>
                            <SelectTrigger>
                                <SelectValue placeholder="เลือกภาคเรียน..." />
                            </SelectTrigger>
                            <SelectContent>
                                {termsForYear.map(term => (
                                    <SelectItem key={term} value={term}>
                                        {term.includes('/') ? `ภาคเรียนที่ ${term}`: `ตลอดปีการศึกษา`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                         <Select onValueChange={setSelectedOfferingId} value={selectedOfferingId} disabled={!selectedTerm}>
                            <SelectTrigger>
                                <SelectValue placeholder="เลือกรายวิชา..." />
                            </SelectTrigger>
                            <SelectContent>
                                {offeringsForTerm.map(o => (
                                    <SelectItem key={o.offeringId} value={o.offeringId}>
                                        {o.subjectCode} - {o.subjectName} ({o.className})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>
            
            {selectedOfferingId && (
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Users className="h-6 w-6" />
                           รายชื่อนักเรียน
                        </CardTitle>
                        <CardDescription>
                            {selectedOffering?.subjectName} ({selectedOffering?.subjectCode}) - {selectedOffering?.className} - มีนักเรียนทั้งหมด {studentsInClass.length} คน
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
