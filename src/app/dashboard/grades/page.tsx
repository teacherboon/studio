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
import { scores, offerings, subjects, classes } from "@/lib/data";
import { calculateGPA } from "@/lib/utils";
import type { StudentGradeDetails, Score } from '@/lib/types';
import { Download, FileWarning } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function StudentGradesPage() {
  const user = useUser();
  const [selectedTerm, setSelectedTerm] = useState<string>('2568');
  
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
    </div>
  );
}
