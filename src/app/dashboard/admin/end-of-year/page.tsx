
"use client";

import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { classes as initialClasses, offerings as initialOfferings, students, enrollments as initialEnrollments } from '@/lib/data';
import type { Class, Offering, Enrollment } from '@/lib/types';
import { Milestone, Loader2, PartyPopper } from "lucide-react";


function EndOfYearDialog({ onConfirm, academicYears }: { onConfirm: (from: number, to: number) => void, academicYears: number[] }) {
    const [fromYear, setFromYear] = useState<string>('');
    const [toYear, setToYear] = useState<string>('');
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const handleConfirm = () => {
        const from = Number(fromYear);
        const to = Number(toYear);
        if (!from || !to || from >= to) {
            toast({
                variant: 'destructive',
                title: 'ข้อมูลไม่ถูกต้อง',
                description: 'กรุณาเลือกปีการศึกษาต้นทางและปีการศึกษาใหม่ให้ถูกต้อง (ปีใหม่ต้องมากกว่าปีเก่า)',
            });
            return;
        }
        onConfirm(from, to);
        setOpen(false);
    }
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Milestone className="mr-2" />
                    เริ่มกระบวนการสร้างปีการศึกษาใหม่
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>สร้างปีการศึกษาใหม่</DialogTitle>
                    <DialogDescription>
                        ระบบจะทำการคัดลอกข้อมูลห้องเรียนและรายวิชาจากปีการศึกษาเก่า และทำการเลื่อนชั้นให้นักเรียนโดยอัตโนมัติ
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <Label htmlFor="from-year">ปีการศึกษาต้นทาง (Source)</Label>
                        <Select value={fromYear} onValueChange={setFromYear}>
                            <SelectTrigger id="from-year">
                                <SelectValue placeholder="เลือกปีการศึกษาที่จะคัดลอก" />
                            </SelectTrigger>
                            <SelectContent>
                                {academicYears.map(year => (
                                    <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div>
                        <Label htmlFor="to-year">ปีการศึกษาใหม่ (New)</Label>
                        <Input 
                            id="to-year" 
                            type="number" 
                            placeholder="เช่น 2569" 
                            value={toYear}
                            onChange={(e) => setToYear(e.target.value)}
                        />
                    </div>
                </div>
                 <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary">ยกเลิก</Button>
                    </DialogClose>
                    <Button onClick={handleConfirm}>ยืนยันและเริ่มกระบวนการ</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


export default function EndOfYearPage() {
    const [allClasses, setAllClasses] = useState<Class[]>(initialClasses);
    const [allOfferings, setAllOfferings] = useState<Offering[]>(initialOfferings);
    const [allEnrollments, setAllEnrollments] = useState<Enrollment[]>(initialEnrollments);

    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ newClasses: number, newOfferings: number, newEnrollments: number} | null>(null);
    const { toast } = useToast();

    const academicYears = useMemo(() => {
        return [...new Set(allClasses.map(c => c.yearBe))].sort((a, b) => b - a);
    }, [allClasses]);

    const handleStartRollover = (fromYear: number, toYear: number) => {
        setIsLoading(true);
        setResult(null);

        // Simulate async operation
        setTimeout(() => {
            try {
                // 1. Deactivate old classes and offerings
                const updatedClasses = [...allClasses];
                const updatedOfferings = [...allOfferings];

                updatedClasses.forEach(c => {
                    if (c.yearBe === fromYear) c.isActive = false;
                });
                 updatedOfferings.forEach(o => {
                    const classInfo = updatedClasses.find(c => c.classId === o.classId);
                    if (classInfo?.yearBe === fromYear) o.isConduct = true; // Mark as finished
                });


                // 2. Clone Classes for the new year
                const sourceClasses = updatedClasses.filter(c => c.yearBe === fromYear);
                const newClasses: Class[] = sourceClasses.map(sc => ({
                    ...sc,
                    classId: `c-${toYear}-${sc.level}-${sc.room}`,
                    yearBe: toYear,
                    termLabel: sc.termLabel.replace(String(fromYear), String(toYear)),
                    isActive: true,
                }));
                const combinedClasses = [...updatedClasses, ...newClasses];


                // 3. Clone Offerings for the new year
                const sourceOfferings = updatedOfferings.filter(o => {
                     const classInfo = sourceClasses.find(c => c.classId === o.classId);
                     return classInfo?.yearBe === fromYear;
                });
                const newOfferings: Offering[] = sourceOfferings.map(so => {
                    const oldClass = sourceClasses.find(c => c.classId === so.classId);
                    const newClass = newClasses.find(nc => nc.level === oldClass?.level && nc.room === oldClass?.room);
                    return {
                        ...so,
                        offeringId: `o-${toYear}-${so.subjectId}-${newClass?.classId}`,
                        classId: newClass!.classId,
                        yearMode: newClass!.yearMode,
                        termLabel: newClass!.termLabel,
                        isConduct: false,
                    }
                });
                const combinedOfferings = [...updatedOfferings, ...newOfferings];
                

                // 4. Promote Students & Create new enrollments
                const sourceEnrollments = allEnrollments.filter(e => {
                     const classInfo = sourceClasses.find(c => c.classId === e.classId);
                     return !!classInfo;
                });

                const newEnrollments: Enrollment[] = sourceEnrollments.map(se => {
                    const oldClass = sourceClasses.find(c => c.classId === se.classId);
                    if (!oldClass) return null;

                    // Simple promotion logic
                    let nextLevelNum = Number(oldClass.level.split('.')[1]) + 1;
                    const prefix = oldClass.level.split('.')[0];
                    // Handle graduation
                    if ((prefix === 'ป' && nextLevelNum > 6) || (prefix === 'ม' && nextLevelNum > 6)) {
                        return null; 
                    }
                    const nextLevel = `${prefix}.${nextLevelNum}`;
                    
                    const nextClass = newClasses.find(nc => nc.level === nextLevel && nc.room === oldClass.room);
                    
                    // If there's a class for them to go to
                    if (nextClass) {
                        return {
                            enrollmentId: `e-${toYear}-${se.studentId}`,
                            studentId: se.studentId,
                            classId: nextClass.classId,
                            status: 'ENROLLED',
                        };
                    }
                    return null;
                }).filter((e): e is Enrollment => e !== null);

                const combinedEnrollments = [...allEnrollments, ...newEnrollments];
                

                // Update state
                setAllClasses(combinedClasses);
                setAllOfferings(combinedOfferings);
                setAllEnrollments(combinedEnrollments);
                
                // Set result for display
                setResult({
                    newClasses: newClasses.length,
                    newOfferings: newOfferings.length,
                    newEnrollments: newEnrollments.length
                });

                toast({
                    title: `สร้างปีการศึกษา ${toYear} สำเร็จ`,
                    description: "ข้อมูลห้องเรียน, รายวิชา, และการลงทะเบียนของนักเรียนได้ถูกสร้างขึ้นใหม่แล้ว"
                })

            } catch (error) {
                console.error("End of year rollover failed:", error);
                toast({
                    variant: 'destructive',
                    title: 'เกิดข้อผิดพลาด',
                    description: `ไม่สามารถสร้างปีการศึกษาใหม่ได้: ${error instanceof Error ? error.message : 'Unknown error'}`
                });
            } finally {
                setIsLoading(false);
            }
        }, 2000); // Simulate network latency
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">สิ้นปีการศึกษาและขึ้นปีใหม่</h1>
                <p className="text-muted-foreground">
                    เครื่องมือสำหรับช่วยเตรียมข้อมูลสำหรับปีการศึกษาใหม่โดยอัตโนมัติ
                </p>
            </div>

            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>กระบวนการสิ้นปีการศึกษา</CardTitle>
                    <CardDescription>
                        คลิกปุ่มด้านล่างเพื่อเริ่มกระบวนการคัดลอกข้อมูลจากปีการศึกษาปัจจุบันไปสู่ปีการศึกษาใหม่ โปรดตรวจสอบข้อมูลให้ถูกต้องก่อนดำเนินการ
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                         <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
                            <Loader2 className="h-16 w-16 animate-spin text-primary" />
                            <h3 className="text-xl font-semibold">กำลังดำเนินการ...</h3>
                            <p className="text-muted-foreground">
                                กำลังสร้างห้องเรียน, คัดลอกรายวิชา, และเลื่อนชั้นนักเรียนสำหรับปีการศึกษาใหม่<br/>
                                กรุณารอสักครู่...
                            </p>
                        </div>
                    ) : result ? (
                        <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
                            <PartyPopper className="h-16 w-16 text-green-500" />
                            <h3 className="text-xl font-semibold text-green-600">สร้างปีการศึกษาใหม่สำเร็จ!</h3>
                            <div className="text-left bg-muted p-4 rounded-lg">
                                <ul className="list-disc list-inside space-y-1">
                                    <li>สร้างห้องเรียนใหม่: <strong>{result.newClasses}</strong> ห้อง</li>
                                    <li>คัดลอกรายวิชาที่เปิดสอน: <strong>{result.newOfferings}</strong> รายวิชา</li>
                                    <li>เลื่อนชั้นและลงทะเบียนนักเรียน: <strong>{result.newEnrollments}</strong> คน</li>
                                </ul>
                            </div>
                            <p className="text-muted-foreground pt-4">
                                คุณสามารถตรวจสอบข้อมูลใหม่ได้จากหน้าจัดการต่างๆ
                            </p>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-muted-foreground">
                            <p>ยังไม่มีการดำเนินการใดๆ</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center border-t pt-6">
                    <EndOfYearDialog onConfirm={handleStartRollover} academicYears={academicYears} />
                </CardFooter>
            </Card>
        </div>
    );
}

    