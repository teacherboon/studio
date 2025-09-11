"use client";

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { scores, offerings, subjects } from "@/lib/data";
import { calculateGPA } from "@/lib/utils";
import type { StudentGradeDetails, Score } from '@/lib/types';
import { Download, FileWarning, Wand, Loader2, BarChart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { analyzeStudentScores, type AnalyzeStudentScoresOutput } from '@/ai/flows/analyze-student-scores';
import { useToast } from '@/hooks/use-toast';

export default function StudentGradesPage() {
  const user = useUser();
  const [selectedTerm, setSelectedTerm] = useState<string>('2568');
  const [analysisResult, setAnalysisResult] = useState<AnalyzeStudentScoresOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  
  if (!user || !user.studentId) {
    return (
        <div>
            <Skeleton className="h-9 w-64 mb-2" />
            <Skeleton className="h-5 w-80 mb-8" />
            <Card>
                <CardHeader><Skeleton className="h-8 w-48 mb-4"/><Skeleton className="h-10 w-64"/></CardHeader>
                <CardContent><Skeleton className="h-40 w-full" /></CardContent>
            </Card>
        </div>
    )
  }

  const studentScores = scores.filter(s => s.studentId === user.studentId);
  
  const availableTerms = [...new Set(
    offerings
      .filter(o => studentScores.some(s => s.offeringId === o.offeringId))
      .map(o => o.termLabel)
  )];

  const scoresForTerm = studentScores.filter(score => {
    const offering = offerings.find(o => o.offeringId === score.offeringId);
    return offering?.termLabel === selectedTerm;
  });

  const gradeDetails: StudentGradeDetails[] = scoresForTerm.map(score => {
    const offering = offerings.find(o => o.offeringId === score.offeringId);
    const subject = subjects.find(s => s.subjectId === offering?.subjectId);
    return {
      ...score,
      subjectName: subject?.subjectNameTh || 'N/A',
      subjectCode: subject?.subjectCode || 'N/A',
    };
  });
  
  const gpa = calculateGPA(scoresForTerm as Score[]);
  const totalCredits = scoresForTerm.reduce((acc, score) => acc + (score.statusFlag !== 'ร' && score.statusFlag !== 'มผ' ? score.credits : 0), 0);

  const getBadgeVariant = (status: string) => {
    switch (status) {
        case 'ร':
        case '0':
        case 'มผ':
            return 'destructive';
        default:
            return 'secondary';
    }
  }

  const handleAnalyzeScores = async () => {
    if (!user || !user.studentId) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
        const allStudentScoresForAnalysis = studentScores.map(s => {
            const offeringInfo = offerings.find(o => o.offeringId === s.offeringId);
            const subjectInfo = subjects.find(sub => sub.subjectId === offeringInfo?.subjectId);
            return {
              subjectName: subjectInfo?.subjectNameTh || 'N/A',
              term: offeringInfo?.termLabel || 'N/A',
              rawScore: s.rawScore,
              letterGrade: s.letterGrade,
            };
        });

        const input = {
            student: {
                studentId: user.studentId,
                studentName: user.thaiName
            },
            scores: allStudentScoresForAnalysis
        };
        const result = await analyzeStudentScores(input);
        setAnalysisResult(result);
        toast({
            title: "วิเคราะห์ผลการเรียนสำเร็จ",
            description: "AI ได้ให้คำแนะนำสำหรับผลการเรียนของคุณแล้ว"
        });
    } catch (error) {
        console.error("Error analyzing scores:", error);
        toast({
            variant: "destructive",
            title: "เกิดข้อผิดพลาด",
            description: "ไม่สามารถวิเคราะห์ผลการเรียนได้ โปรดลองอีกครั้ง"
        });
    } finally {
        setIsAnalyzing(false);
    }
  };


  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">ผลการเรียน</h1>
            <p className="text-muted-foreground">ดูคะแนน, เกรด, และเกรดเฉลี่ยของคุณในแต่ละภาคเรียน</p>
        </div>

        <Card>
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <CardTitle>ผลการเรียนภาคเรียน</CardTitle>
                    <CardDescription>เลือกภาคเรียนเพื่อดูรายละเอียด</CardDescription>
                </div>
                <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="เลือกภาคเรียน" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableTerms.map(term => (
                            <SelectItem key={term} value={term}>{term.includes('/') ? `เทอม ${term}` : `ปีการศึกษา ${term}`}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                {gradeDetails.length > 0 ? (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">รหัสวิชา</TableHead>
                        <TableHead>ชื่อวิชา</TableHead>
                        <TableHead className="text-center">หน่วยกิต</TableHead>
                        <TableHead className="text-center">คะแนน</TableHead>
                        <TableHead className="text-center">เกรด</TableHead>
                        <TableHead className="text-right">สถานะ</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {gradeDetails.map((grade) => (
                        <TableRow key={grade.scoreId}>
                            <TableCell className="font-medium">{grade.subjectCode}</TableCell>
                            <TableCell>{grade.subjectName}</TableCell>
                            <TableCell className="text-center">{grade.credits.toFixed(1)}</TableCell>
                            <TableCell className="text-center">{grade.rawScore ?? '-'}</TableCell>
                            <TableCell className="text-center font-bold">{grade.letterGrade ?? '-'}</TableCell>
                            <TableCell className="text-right">
                                <Badge variant={getBadgeVariant(grade.statusFlag)}>
                                    {grade.statusFlag}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                ) : (
                    <div className="text-center py-10">
                        <FileWarning className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-2 text-lg font-semibold">ไม่พบข้อมูลผลการเรียน</h3>
                        <p className="mt-1 text-sm text-muted-foreground">ยังไม่มีข้อมูลสำหรับภาคเรียนที่เลือก</p>
                    </div>
                )}
            </CardContent>
             <CardFooter className="flex-col items-start gap-4 pt-6 md:flex-row md:justify-between">
                <div className="grid grid-cols-2 gap-4 rounded-lg border p-4 w-full md:w-auto">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">หน่วยกิตรวม</p>
                        <p className="text-2xl font-bold">{totalCredits.toFixed(1)}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">เกรดเฉลี่ย (GPA)</p>
                        <p className="text-2xl font-bold text-primary">{gpa}</p>
                    </div>
                </div>
                <Button>
                    <Download className="mr-2 h-4 w-4" />
                    ดาวน์โหลดใบแสดงผลการเรียน (PDF)
                </Button>
            </CardFooter>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>วิเคราะห์ผลการเรียนด้วย AI</CardTitle>
                <CardDescription>รับคำแนะนำเพื่อพัฒนาผลการเรียนของคุณจาก AI โดยวิเคราะห์จากผลการเรียนทั้งหมด</CardDescription>
            </CardHeader>
            <CardContent>
                 <Button onClick={handleAnalyzeScores} disabled={isAnalyzing}>
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            กำลังวิเคราะห์...
                        </>
                    ) : (
                        <>
                            <Wand className="mr-2 h-4 w-4" />
                            เริ่มการวิเคราะห์
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>

        {analysisResult && (
            <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="text-primary" />
                    ผลการวิเคราะห์สำหรับ {analysisResult.studentName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-lg">สรุปผลการเรียน</h3>
                        <p className="text-muted-foreground">{analysisResult.summary}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg">จุดแข็ง</h3>
                        <p className="text-muted-foreground">{analysisResult.strengths}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg">จุดที่ควรพัฒนา</h3>
                        <p className="text-muted-foreground">{analysisResult.areasForImprovement}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg">คำแนะนำ</h3>
                        <p className="text-muted-foreground">{analysisResult.recommendations}</p>
                    </div>
                </CardContent>
            </Card>
        )}

    </div>
  );
}
