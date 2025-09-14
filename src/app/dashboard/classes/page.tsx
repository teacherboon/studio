
"use client";

import { useState, useMemo, useEffect, useRef, ChangeEvent } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Upload, Users, FileText, Save, Edit, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Offering, Score } from '@/lib/types';
import { useUser } from '@/hooks/use-user';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useData } from '@/context/data-context';


function CreateOfferingDialog({ onSave, open, onOpenChange }: { onSave: (data: Offering) => void, open: boolean, onOpenChange: (open: boolean) => void }) {
    const user = useUser();
    const { toast } = useToast();
    const { allSubjects, allClasses } = useData();
    
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [periodsPerWeek, setPeriodsPerWeek] = useState(0);
    const [yearBe, setYearBe] = useState(new Date().getFullYear() + 543);
    const [term, setTerm] = useState('1');
    const [yearMode, setYearMode] = useState<"PRIMARY" | "SECONDARY">('PRIMARY');

    const availableClasses = useMemo(() => {
      return allClasses.filter(c => c.yearBe === yearBe && c.isActive);
    }, [yearBe, allClasses]);

    useEffect(() => {
        if (open) {
            const currentYear = new Date().getFullYear() + 543;
            setSelectedSubject('');
            setSelectedClass('');
            setPeriodsPerWeek(0);
            setYearBe(currentYear);
            setTerm('1');
            setYearMode('PRIMARY');
        }
    }, [open]);

    useEffect(() => {
        // Reset selected class if it's not in the new list of available classes
        if (!availableClasses.some(c => c.classId === selectedClass)) {
            setSelectedClass('');
        }
    }, [availableClasses, selectedClass]);
    
    const handleSave = () => {
        if (!selectedSubject || !selectedClass || !yearBe || !user) {
            toast({ variant: 'destructive', title: 'ข้อมูลไม่ครบถ้วน', description: 'กรุณากรอกข้อมูลให้ครบทุกช่อง' });
            return;
        }

        const finalTermLabel = yearMode === 'PRIMARY' ? String(yearBe) : `${term}/${yearBe}`;

        const newOffering: Offering = {
            offeringId: `off-${Date.now()}`,
            subjectId: selectedSubject,
            classId: selectedClass,
            teacherEmail: user.email,
            yearMode,
            termLabel: finalTermLabel,
            yearBe,
            isConduct: false,
            periodsPerWeek: periodsPerWeek,
        };

        onSave(newOffering);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                 <Button>
                    <PlusCircle className="mr-2" />
                    เพิ่มรายวิชาที่สอน
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>เพิ่มรายวิชาที่สอน</DialogTitle>
                    <DialogDescription>
                         กำหนดวิชา, ห้องเรียน, และปี/ภาคการศึกษาที่คุณจะสอน
                    </DialogDescription>
                </DialogHeader>
                {open && <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="yearBe" className="text-right">
                            ปีการศึกษา (พ.ศ.)
                        </Label>
                        <Input id="yearBe" type="number" value={yearBe} onChange={e => setYearBe(Number(e.target.value))} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="subject" className="text-right">
                            รายวิชา
                        </Label>
                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="เลือกรายวิชา" />
                            </SelectTrigger>
                            <SelectContent>
                                {allSubjects.map(s => (
                                    <SelectItem key={s.subjectId} value={s.subjectId}>{s.subjectCode} - {s.subjectNameTh}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="class" className="text-right">
                            ห้องเรียน
                        </Label>
                        <Select value={selectedClass} onValueChange={setSelectedClass} disabled={availableClasses.length === 0}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder={availableClasses.length > 0 ? "เลือกห้องเรียน" : "ไม่พบห้องเรียนในปีการศึกษานี้"} />
                            </SelectTrigger>
                            <SelectContent>
                                {availableClasses.map(c => (
                                    <SelectItem key={c.classId} value={c.classId}>ห้อง {c.level}/{c.room}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="periods" className="text-right">
                            คาบ/สัปดาห์
                        </Label>
                        <Input id="periods" type="number" value={periodsPerWeek} onChange={e => setPeriodsPerWeek(Number(e.target.value))} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="yearMode" className="text-right">
                            ระบบภาคเรียน
                        </Label>
                        <Select value={yearMode} onValueChange={v => setYearMode(v as any)}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="เลือกระบบภาคเรียน" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PRIMARY">รายปี (ประถม)</SelectItem>
                                <SelectItem value="SECONDARY">รายเทอม (มัธยม)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {yearMode === 'SECONDARY' && (
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="term" className="text-right">
                                ภาคเรียน
                            </Label>
                            <Select value={term} onValueChange={setTerm}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="เลือกภาคเรียน" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">เทอม 1</SelectItem>
                                    <SelectItem value="2">เทอม 2</SelectItem>
                                </SelectContent>
                            </Select>
                         </div>
                    )}
                </div>}
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">ยกเลิก</Button>
                    </DialogClose>
                     <Button type="button" onClick={handleSave}>บันทึกข้อมูล</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function ClassesPage() {
    const user = useUser();
    const { allOfferings, allStudents, allScores, allSubjects, actions } = useData();
    
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [selectedOfferingId, setSelectedOfferingId] = useState<string>('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    
    const [studentScores, setStudentScores] = useState<Record<string, number | null>>({});
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const allOfferingsForTeacher = useMemo(() => {
        if (!user) return [];
        return actions.getOfferingsForTeacher(user.email);
    }, [user, allOfferings, actions]);

    const academicYears = useMemo(() => {
        const years = [...new Set(allOfferingsForTeacher.map(o => o.yearBe))];
        return years.sort((a,b) => b - a);
    }, [allOfferingsForTeacher]);

    const offeringsForSelectedYear = useMemo(() => {
        if (!selectedYear) return [];
        return allOfferingsForTeacher.filter(o => o.yearBe === Number(selectedYear));
    }, [selectedYear, allOfferingsForTeacher]);

    const selectedOffering = useMemo(() => {
        return allOfferingsForTeacher.find(o => o.offeringId === selectedOfferingId);
    }, [selectedOfferingId, allOfferingsForTeacher]);

    const studentsInClass = useMemo(() => {
        if (!selectedOffering) return [];
        return actions.getStudentsInClass(selectedOffering.classId);
    }, [selectedOffering, allStudents, actions]);


    useEffect(() => {
        if (!selectedOffering) {
            setStudentScores({});
            return;
        }
        const initialClassScores: Record<string, number | null> = {};
        studentsInClass.forEach(student => {
            const existingScore = allScores.find(s => s.studentId === student.studentId && s.offeringId === selectedOffering.offeringId);
            initialClassScores[student.studentId] = existingScore?.rawScore ?? null;
        });
        setStudentScores(initialClassScores);
    }, [studentsInClass, selectedOffering, allScores]);
    
     useEffect(() => {
        if (academicYears.length > 0 && !selectedYear) {
            setSelectedYear(String(academicYears[0]));
        }
    }, [academicYears, selectedYear]);

     useEffect(() => {
        if (selectedYear && !offeringsForSelectedYear.some(o => o.offeringId === selectedOfferingId)) {
            setSelectedOfferingId(offeringsForSelectedYear[0]?.offeringId || '');
        }
    }, [selectedYear, offeringsForSelectedYear, selectedOfferingId]);

    const handleYearChange = (year: string) => {
        setSelectedYear(year);
        setSelectedOfferingId(''); // Reset offering selection when year changes
    }

    const handleCreateOffering = (data: Offering) => {
        const isDuplicate = allOfferings.some(o => 
            o.subjectId === data.subjectId && 
            o.classId === data.classId &&
            o.termLabel === data.termLabel &&
            o.teacherEmail === data.teacherEmail
        );

        if (isDuplicate) {
            toast({
                variant: "destructive",
                title: "สร้างไม่สำเร็จ",
                description: `คุณได้สร้างรายวิชานี้สำหรับห้องนี้ในปี/ภาคเรียนนี้แล้ว`,
            });
            return;
        }
        
        actions.addOffering(data);
        toast({ title: "สร้างสำเร็จ", description: "เพิ่มรายวิชาที่เปิดสอนใหม่เรียบร้อย" });
    }

    const handleScoreChange = (studentId: string, score: string) => {
        const newScore = score === '' ? null : Number(score);
        if (newScore === null || (newScore >= 0 && newScore <= 100)) {
            setStudentScores(prev => ({ ...prev, [studentId]: newScore }));
        }
    };

    const handleSaveScores = () => {
        if (!selectedOffering || !user) return;
        
        const scoresToUpdate: Score[] = [];
        const scoresToAdd: Score[] = [];
        const subject = allSubjects.find(s => s.subjectId === selectedOffering.subjectId);

        Object.entries(studentScores).forEach(([studentId, rawScore]) => {
            const existingScore = allScores.find(s => s.studentId === studentId && s.offeringId === selectedOffering.offeringId);
            if (existingScore) {
                scoresToUpdate.push({ ...existingScore, rawScore, updatedBy: user.email, updatedAt: new Date().toISOString() });
            } else {
                 scoresToAdd.push({
                    scoreId: `new-score-${Date.now()}-${studentId}`,
                    offeringId: selectedOffering.offeringId,
                    studentId: studentId,
                    rawScore: rawScore,
                    letterGrade: null, // This would be calculated on the backend/server
                    gradePoint: null, // This would be calculated on the backend/server
                    credits: subject?.defaultCredits || 0,
                    statusFlag: 'NORMAL',
                    updatedBy: user.email,
                    updatedAt: new Date().toISOString(),
                });
            }
        });

        actions.updateScores(scoresToUpdate);
        actions.addScores(scoresToAdd);
        
        toast({
            title: 'บันทึกคะแนนสำเร็จ',
            description: 'คะแนนของนักเรียนได้รับการอัปเดตแล้ว',
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

        const header = 'studentId,stuCode,fullName,score\n';
        const rows = studentsInClass.map(s =>
            `${s.studentId},${s.stuCode},"${s.prefixTh}${s.firstNameTh} ${s.lastNameTh}",`
        ).join('\n');
        
        const csvContent = "\uFEFF" + header + rows;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `scores_template_${selectedOffering.subjectCode}_${selectedOffering.classId}.csv`);
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
                const updatedScores: Record<string, number | null> = { ...studentScores };
                let updatedCount = 0;

                lines.forEach(line => {
                    if (line.trim() === '') return;
                    const [studentId, studentCode, fullName, scoreStr] = line.split(',').map(s => s.trim().replace(/"/g, ''));
                    
                    if (studentId && studentsInClass.some(s => s.studentId === studentId)) {
                        const score = scoreStr === '' ? null : Number(scoreStr);
                        if (score === null || !isNaN(score)) {
                            updatedScores[studentId] = score;
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
        reader.readAsText(file, 'UTF-8');
        if(event.target) event.target.value = '';
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">จัดการรายวิชาและคะแนน</h1>
                    <p className="text-muted-foreground">เพิ่มรายวิชาที่คุณสอนในแต่ละปี/ภาคการศึกษา และจัดการคะแนนนักเรียน</p>
                </div>
                 <CreateOfferingDialog 
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                    onSave={handleCreateOffering}
                 />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>เลือกรายวิชาที่สอน</CardTitle>
                    <CardDescription>
                        เลือกปีการศึกษาและรายวิชาที่คุณสอนเพื่อเริ่มกรอกคะแนน
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="academic-year">ปีการศึกษา</Label>
                        <Select onValueChange={handleYearChange} value={selectedYear} disabled={academicYears.length === 0}>
                            <SelectTrigger id="academic-year">
                                <SelectValue placeholder={academicYears.length === 0 ? "คุณยังไม่ได้เพิ่มรายวิชาที่สอน" : "เลือกปีการศึกษา..."} />
                            </SelectTrigger>
                            <SelectContent>
                                {academicYears.map(year => (
                                    <SelectItem key={year} value={String(year)}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div>
                        <Label htmlFor="offering-select">รายวิชาที่สอน</Label>
                        <Select onValueChange={setSelectedOfferingId} value={selectedOfferingId} disabled={!selectedYear}>
                            <SelectTrigger id="offering-select">
                                <SelectValue placeholder="เลือกรายวิชาที่สอน..." />
                            </SelectTrigger>
                            <SelectContent>
                                {offeringsForSelectedYear.map(o => (
                                    <SelectItem key={o.offeringId} value={o.offeringId}>
                                        {o.subjectCode} - {o.subjectName} - {o.className}{o.termDisplay}
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
                            {selectedOffering?.subjectName} ({selectedOffering?.subjectCode}) - {selectedOffering?.className}{selectedOffering?.termDisplay} - มีนักเรียนทั้งหมด {studentsInClass.length} คน
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
                                                    <TableHead className="w-[80px]">เลขที่</TableHead>
                                                    <TableHead className="w-[150px]">รหัสนักเรียน</TableHead>
                                                    <TableHead>ชื่อ-สกุล</TableHead>
                                                    <TableHead className="text-center w-[120px]">คะแนน (เต็ม 100)</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {studentsInClass.map((student) => (
                                                    <TableRow key={student.studentId}>
                                                        <TableCell>{student.classNumber || '-'}</TableCell>
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
                                        <p className="mt-1 text-sm">ไม่มีนักเรียนในห้องเรียนที่เลือกสำหรับปีการศึกษานี้</p>
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
