"use client";

import { useState } from "react";
import { identifyAtRiskStudents } from "@/ai/flows/identify-at-risk-students";
import type { IdentifyAtRiskStudentsOutput } from "@/ai/flows/identify-at-risk-students";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { students, gradeScale } from "@/lib/data";
import { Loader2, AlertTriangle, UserCheck } from "lucide-react";

// For demo, we'll just use a subset of scores from the mock data
const allStudentRecords = students.map(s => ({
    studentId: s.studentId,
    studentName: `${s.prefixTh}${s.firstNameTh} ${s.lastNameTh}`,
    // A more realistic scenario would fetch the current score. Here we use a random score for demo.
    rawScore: Math.floor(Math.random() * 60) + 30, 
}));
allStudentRecords[1].rawScore = 45; // ensure at least one is at risk
allStudentRecords[3].rawScore = 38; // and another one

export function AtRiskStudentsClient() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IdentifyAtRiskStudentsOutput | null>(null);
  const { toast } = useToast();

  const handleIdentify = async () => {
    setLoading(true);
    setResult(null);
    try {
      const input = {
        studentRecords: allStudentRecords,
        gradeScale: gradeScale,
      };
      const response = await identifyAtRiskStudents(input);
      setResult(response);
      toast({
        title: "วิเคราะห์สำเร็จ",
        description: `พบนักเรียนกลุ่มเสี่ยง ${response.atRiskStudents.length} คน`,
      });
    } catch (error) {
      console.error("Error identifying at-risk students:", error);
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
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <p className="text-muted-foreground flex-1">
            คลิกปุ่มเพื่อส่งข้อมูลนักเรียนและเกณฑ์การให้คะแนนปัจจุบันไปยัง AI เพื่อระบุกลุ่มเสี่ยง
          </p>
          <Button onClick={handleIdentify} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                กำลังวิเคราะห์...
              </>
            ) : (
              "เริ่มระบุนักเรียนกลุ่มเสี่ยง"
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div>
          <h2 className="text-2xl font-bold mb-4">ผลการวิเคราะห์</h2>
          {result.atRiskStudents.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {result.atRiskStudents.map((student) => (
                <Card key={student.studentId} className="border-destructive bg-destructive/5">
                  <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                     <div className="bg-destructive/10 p-2 rounded-full">
                        <AlertTriangle className="h-6 w-6 text-destructive" />
                     </div>
                     <div className="space-y-1">
                        <CardTitle>{student.studentName}</CardTitle>
                        <p className="text-sm text-muted-foreground">ID: {student.studentId}</p>
                     </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-medium text-destructive-foreground">{student.reason}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
             <Card className="border-primary bg-primary/5">
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <UserCheck className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-primary">ไม่พบนักเรียนกลุ่มเสี่ยง</CardTitle>
                        <p className="text-muted-foreground">ยอดเยี่ยม! จากการวิเคราะห์ไม่พบนักเรียนที่มีแนวโน้มจะสอบตก</p>
                    </div>
                </CardHeader>
             </Card>
          )}
        </div>
      )}
    </div>
  );
}
