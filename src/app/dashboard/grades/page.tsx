
"use client";

import { useState, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { scores, offerings, subjects, classes, students, studentAttributes } from "@/lib/data";
import { calculateGPA } from "@/lib/utils";
import type { StudentGradeDetails, Score, StudentAttributes } from '@/lib/types';
import { Download, FileWarning, Wand, Loader2, BarChart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { analyzeStudentScores, type AnalyzeStudentScoresOutput } from '@/ai/flows/analyze-student-scores';
import { useToast } from '@/hooks/use-toast';
import { GradeReportSheet } from '@/components/grade-report-sheet';

export default function StudentGradesPage() {
  const user = useUser();
  const [selectedTerm, setSelectedTerm] = useState<string>('1/2568');
  const [analysisResult, setAnalysisResult] = useState<AnalyzeStudentScoresOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true); // Set to true to start loading initially
  const { toast } = useToast();

  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
    documentTitle: `grade-report-${user?.studentId}-${selectedTerm}`,
  });
  
  const studentData = user ? students.find(s => s.studentId === user.studentId) : null;
  const studentScores = user ? scores.filter(s => s.studentId === user.studentId) : [];

  useEffect(() => {
    const handleAnalyzeScores = async () => {
      if (!user || !user.studentId) return;
  
      setIsAnalyzing(true);
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

    if (user && studentScores.length > 0) {
        handleAnalyzeScores();
    } else if (user) {
        // No scores to analyze
        setIsAnalyzing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, studentScores.length]); // Depend on user and score count

  if (!user || !studentData) {
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

  const availableTerms = [...new Set(
    offerings
      .filter(o => studentScores.some(s => s.offeringId === o.offeringId))
      .map(o => o.termLabel)
  )];
  if(availableTerms.length > 0 && !selectedTerm) {
    setSelectedTerm(availableTerms[0]);
  }

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
      subjectType: subject?.type || 'พื้นฐาน',
    };
  });
  
  const currentClass = classes.find(c => {
    const offering = offerings.find(o => o.offeringId === scoresForTerm[0]?.offeringId);
    return c.classId === offering?.classId;
  });

  const attributesForYear = studentAttributes.find(attr => attr.studentId === studentData.studentId && String(attr.yearBe) === currentClass?.yearBe.toString());


  const gpa = calculateGPA(scoresForTerm as Score[]);

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
                 <div className="flex flex-col sm:flex-row gap-2">
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
                     <Button onClick={handlePrint} disabled={gradeDetails.length === 0}>
                        <Download className="mr-2 h-4 w-4" />
                        ดาวน์โหลด (PDF)
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {gradeDetails.length > 0 && studentData && currentClass ? (
                    <div className="flex justify-center bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                        <div ref={reportRef} className="transform scale-[0.8] origin-top">
                           <GradeReportSheet 
                                student={studentData} 
                                grades={gradeDetails} 
                                gpa={gpa}
                                currentClass={currentClass}
                                attributes={attributesForYear || null}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <FileWarning className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-2 text-lg font-semibold">ไม่พบข้อมูลผลการเรียน</h3>
                        <p className="mt-1 text-sm text-muted-foreground">ยังไม่มีข้อมูลสำหรับภาคเรียนที่เลือก</p>
                    </div>
                )}
            </CardContent>
        </Card>

        {isAnalyzing ? (
            <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    กำลังวิเคราะห์ผลการเรียนด้วย AI
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </CardContent>
            </Card>
        ) : analysisResult && (
            <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="text-primary" />
                    ผลการวิเคราะห์สำหรับ {analysisResult.studentName}
                  </CardTitle>
                  <CardDescription>AI ได้ให้คำแนะนำสำหรับผลการเรียนของคุณแล้ว</CardDescription>
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
