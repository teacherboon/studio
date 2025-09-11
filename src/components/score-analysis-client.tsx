"use client";

import { useState } from "react";
import { analyzeStudentScores } from "@/ai/flows/analyze-student-scores";
import type { AnalyzeStudentScoresOutput } from "@/ai/flows/analyze-student-scores";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { students, scores, offerings, subjects } from "@/lib/data";
import { Loader2, Wand, BarChart, FileWarning } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ScoreAnalysisClient() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeStudentScoresOutput | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!selectedStudentId) {
      toast({
        variant: "destructive",
        title: "โปรดเลือกนักเรียน",
        description: "คุณต้องเลือกนักเรียนก่อนเริ่มการวิเคราะห์",
      });
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const studentScores = scores.filter(s => s.studentId === selectedStudentId).map(s => {
        const offeringInfo = offerings.find(o => o.offeringId === s.offeringId);
        const subjectInfo = subjects.find(sub => sub.subjectId === offeringInfo?.subjectId);
        return {
          subjectName: subjectInfo?.subjectNameTh || 'N/A',
          term: offeringInfo?.termLabel || 'N/A',
          rawScore: s.rawScore,
          letterGrade: s.letterGrade,
        };
      });
      
      const studentInfo = students.find(s => s.studentId === selectedStudentId);

      if (!studentInfo) {
          throw new Error("Student not found")
      }

      const input = {
        student: {
            studentId: studentInfo.studentId,
            studentName: `${studentInfo.prefixTh}${studentInfo.firstNameTh} ${studentInfo.lastNameTh}`
        },
        scores: studentScores,
      };

      const response = await analyzeStudentScores(input);
      setResult(response);
      toast({
        title: "วิเคราะห์สำเร็จ",
        description: `การวิเคราะห์สำหรับ ${input.student.studentName}เสร็จสมบูรณ์`,
      });
    } catch (error) {
      console.error("Error analyzing scores:", error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถวิเคราะห์ข้อมูลได้ โปรดลองอีกครั้ง",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>เริ่มการวิเคราะห์</CardTitle>
          <CardDescription>
            เลือกนักเรียนและคลิกปุ่มเพื่อใช้ AI วิเคราะห์ผลการเรียนในภาพรวม
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Select onValueChange={setSelectedStudentId} value={selectedStudentId}>
                <SelectTrigger className="w-full md:w-[280px]">
                    <SelectValue placeholder="เลือกนักเรียน..." />
                </SelectTrigger>
                <SelectContent>
                    {students.map(student => (
                        <SelectItem key={student.studentId} value={student.studentId}>
                            {`${student.prefixTh}${student.firstNameTh} ${student.lastNameTh}`}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

          <Button onClick={handleAnalyze} disabled={loading || !selectedStudentId}>
            {loading ? (
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

      {result && (
        <div>
          <h2 className="text-2xl font-bold mb-4">ผลการวิเคราะห์สำหรับ {result.studentName}</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="text-primary" />
                สรุปภาพรวมและคำแนะนำ
              </CardTitle>
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
        </div>
      )}
    </div>
  );
}
