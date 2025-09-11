
"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { students, scores, offerings, subjects, classes, enrollments } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand, BarChart, User, FileText, PieChart, School, Calendar } from "lucide-react";
import { analyzeStudentScores, type AnalyzeStudentScoresOutput } from "@/ai/flows/analyze-student-scores";
import type { StudentGradeDetails } from "@/lib/types";
import { calculateGPA } from "@/lib/utils";

function AnalysisResultCard({ result }: { result: AnalyzeStudentScoresOutput }) {
    return (
        <Card className="mt-6 border-primary bg-primary/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart className="text-primary" />
                    ผลการวิเคราะห์สำหรับ {result.studentName}
                </CardTitle>
                <CardDescription>AI ได้ให้คำแนะนำสำหรับผลการเรียนของนักเรียนคนนี้</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h3 className="font-semibold text-lg">สรุปผลการเรียน</h3>
                    <p className="text-muted-foreground">{result.summary}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-lg">จุดแข็ง</h3>
                    <p className="text-muted-foreground">{result.strengths}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-lg">จุดที่ควรพัฒนา</h3>
                    <p className="text-muted-foreground">{result.areasForImprovement}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-lg">คำแนะนำ</h3>
                    <p className="text-muted-foreground">{result.recommendations}</p>
                </div>
            </CardContent>
        </Card>
    )
}

export function StudentGradeViewer() {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeStudentScoresOutput | null>(null);
  const { toast } = useToast();

  const academicYears = useMemo(() => {
    return [...new Set(classes.map(c => c.yearBe))].sort((a, b) => b - a);
  }, []);

  const studentsForYear = useMemo(() => {
    if (!selectedYear) return [];

    const classIdsInYear = new Set<string>();
    classes.forEach(c => {
        if (c.yearBe === Number(selectedYear)) {
            classIdsInYear.add(c.classId);
        }
    });

    const studentIdsInClass = new Set<string>();
    enrollments.forEach(e => {
        if (classIdsInYear.has(e.classId)) {
            studentIdsInClass.add(e.studentId);
        }
    });
    
    return students.filter(s => studentIdsInClass.has(s.studentId));

  }, [selectedYear]);


  const selectedStudent = useMemo(() => {
    return students.find(s => s.studentId === selectedStudentId);
  }, [selectedStudentId]);

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setSelectedStudentId("");
    setAnalysisResult(null);
  }

  const handleStudentChange = (studentId: string) => {
    setSelectedStudentId(studentId);
    setAnalysisResult(null);
  }

  const studentGrades = useMemo(() => {
    if (!selectedStudentId) return [];
    
    const studentScores = scores.filter(s => s.studentId === selectedStudentId);

    return studentScores.map(score => {
        const offering = offerings.find(o => o.offeringId === score.offeringId);
        const subject = subjects.find(s => s.subjectId === offering?.subjectId);
        const classInfo = classes.find(c => c.classId === offering?.classId);
        return {
          ...score,
          subjectName: subject?.subjectNameTh || 'N/A',
          subjectCode: subject?.subjectCode || 'N/A',
          termLabel: offering?.termLabel || 'N/A',
          className: `${classInfo?.level}/${classInfo?.room}` || 'N/A'
        };
      });
  }, [selectedStudentId]);

  const gradesByTerm = useMemo(() => {
    return studentGrades.reduce((acc, grade) => {
      const term = grade.termLabel;
      if (!acc[term]) {
        acc[term] = [];
      }
      acc[term].push(grade);
      return acc;
    }, {} as Record<string, StudentGradeDetails[]>);
  }, [studentGrades]);

  const handleAnalyze = async () => {
    if (!selectedStudent || studentGrades.length === 0) {
      toast({
        variant: "destructive",
        title: "ข้อมูลไม่เพียงพอ",
        description: "ไม่สามารถวิเคราะห์ได้หากไม่มีข้อมูลผลการเรียน",
      });
      return;
    }

    setLoadingAnalysis(true);
    setAnalysisResult(null);
    try {
      const analysisInputScores = studentGrades.map(s => ({
        subjectName: s.subjectName,
        term: s.termLabel,
        rawScore: s.rawScore,
        letterGrade: s.letterGrade,
      }));

      const input = {
        student: {
            studentId: selectedStudent.studentId,
            studentName: `${selectedStudent.prefixTh}${selectedStudent.firstNameTh} ${selectedStudent.lastNameTh}`
        },
        scores: analysisInputScores,
      };

      const response = await analyzeStudentScores(input);
      setAnalysisResult(response);
      toast({
        title: "วิเคราะห์สำเร็จ",
        description: `การวิเคราะห์สำหรับ ${input.student.studentName} เสร็จสมบูรณ์`,
      });
    } catch (error) {
      console.error("Error analyzing scores:", error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถวิเคราะห์ข้อมูลได้ โปรดลองอีกครั้ง",
      });
    } finally {
      setLoadingAnalysis(false);
    }
  };
  
  const studentOptions = useMemo(() => {
    return studentsForYear.map(student => ({
        value: student.studentId,
        label: `${student.prefixTh}${student.firstNameTh} ${student.lastNameTh}`
    }));
  }, [studentsForYear]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <School />
            ค้นหานักเรียน
          </CardTitle>
          <CardDescription>
            เลือกปีการศึกษา, ภาคเรียน, จากนั้นจึงเลือกนักเรียนที่ต้องการดูข้อมูล
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <User className="h-5 w-5 text-muted-foreground" />
                <Combobox
                    options={studentOptions}
                    value={selectedStudentId}
                    onValueChange={handleStudentChange}
                    placeholder="เลือกนักเรียน..."
                    searchPlaceholder="ค้นหานักเรียน..."
                    disabled={!selectedYear}
                />
            </div>
        </CardContent>
      </Card>

      {selectedStudent && (
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <FileText />
                            ผลการเรียนของ {`${selectedStudent.prefixTh}${selectedStudent.firstNameTh} ${selectedStudent.lastNameTh}`}
                        </CardTitle>
                        <CardDescription>
                            แสดงผลการเรียนทั้งหมดที่บันทึกไว้ในระบบ
                        </CardDescription>
                    </div>
                    <Button onClick={handleAnalyze} disabled={loadingAnalysis || studentGrades.length === 0}>
                        {loadingAnalysis ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            กำลังวิเคราะห์...
                        </>
                        ) : (
                        <>
                            <Wand className="mr-2 h-4 w-4" />
                            วิเคราะห์ภาพรวมด้วย AI
                        </>
                        )}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {Object.keys(gradesByTerm).length > 0 ? (
                    Object.entries(gradesByTerm).map(([term, grades]) => (
                        <div key={term}>
                            <h3 className="font-bold text-lg mb-2">
                                {term.includes('/') ? `ภาคเรียนที่ ${term}` : `ปีการศึกษา ${term}`}
                            </h3>
                             <div className="border rounded-lg">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>รหัสวิชา</TableHead>
                                            <TableHead>ชื่อวิชา</TableHead>
                                            <TableHead className="text-center">คะแนน</TableHead>
                                            <TableHead className="text-center">เกรด</TableHead>
                                            <TableHead className="text-center">หน่วยกิต</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {grades.map(grade => (
                                            <TableRow key={grade.scoreId}>
                                                <TableCell>{grade.subjectCode}</TableCell>
                                                <TableCell>{grade.subjectName}</TableCell>
                                                <TableCell className="text-center">{grade.rawScore ?? '-'}</TableCell>
                                                <TableCell className="text-center">{grade.letterGrade ?? '-'}</TableCell>
                                                <TableCell className="text-center">{grade.credits.toFixed(1)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                             </div>
                             <div className="text-right font-bold text-md mt-2 pr-4">
                                GPA: {calculateGPA(grades)}
                             </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-muted-foreground">
                        <PieChart className="mx-auto h-12 w-12" />
                        <h3 className="mt-2 text-lg font-semibold">ไม่พบข้อมูลผลการเรียน</h3>
                        <p className="mt-1 text-sm">ยังไม่มีการบันทึกคะแนนสำหรับนักเรียนคนนี้</p>
                    </div>
                )}
            </CardContent>
             {analysisResult && <AnalysisResultCard result={analysisResult} />}
        </Card>
      )}
    </div>
  );
}
