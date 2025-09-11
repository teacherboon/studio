
"use client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { classes, subjects, users, offerings } from "@/lib/data";
import { Table, TableHead, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";


export default function AdminSubjectsPage() {
    const teachers = users.filter(u => u.role === 'TEACHER');

    return (
        <div className="space-y-8">
             <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">จัดการรายวิชา</h1>
                    <p className="text-muted-foreground">สร้าง, แก้ไข, และดูข้อมูลรายวิชาทั้งหมดในระบบ</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                        <PlusCircle className="mr-2" />
                        สร้างรายวิชาที่เปิดสอน
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>สร้างรายวิชาที่เปิดสอน</DialogTitle>
                      <DialogDescription>
                        กำหนดครู, วิชา, และห้องเรียนสำหรับภาคการศึกษานี้
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="subject" className="text-right">
                          รายวิชา
                        </Label>
                         <Select>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="เลือกรายวิชา" />
                            </SelectTrigger>
                            <SelectContent>
                                {subjects.map(s => (
                                    <SelectItem key={s.subjectId} value={s.subjectId}>{s.subjectCode} - {s.subjectNameTh}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="teacher" className="text-right">
                          ครูผู้สอน
                        </Label>
                        <Select>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="เลือกครูผู้สอน" />
                            </SelectTrigger>
                            <SelectContent>
                                {teachers.map(t => (
                                    <SelectItem key={t.userId} value={t.email}>{t.thaiName}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                      </div>
                       <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="class" className="text-right">
                          ห้องเรียน
                        </Label>
                        <Select>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="เลือกห้องเรียน" />
                            </SelectTrigger>
                            <SelectContent>
                                {classes.map(c => (
                                    <SelectItem key={c.classId} value={c.classId}>ห้อง {c.level}/{c.room} ({c.termLabel})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                      </div>
                    </div>
                     <Button type="submit" className="w-full">บันทึกข้อมูล</Button>
                  </DialogContent>
                </Dialog>

            </div>

            <Card>
                <CardHeader>
                    <CardTitle>รายชื่อวิชาที่เปิดสอน</CardTitle>
                    <CardDescription>
                        ส่วนนี้จะแสดงตารางวิชาทั้งหมดที่เปิดสอนในแต่ละภาคเรียน
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>รหัสวิชา</TableHead>
                                <TableHead>ชื่อวิชา</TableHead>
                                <TableHead>ห้องเรียน</TableHead>
                                <TableHead>ครูผู้สอน</TableHead>
                                <TableHead className="text-center">หน่วยกิต</TableHead>
                                <TableHead className="text-center">คาบ/สัปดาห์</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {offerings.map(offering => {
                                const subject = subjects.find(s => s.subjectId === offering.subjectId);
                                const classInfo = classes.find(c => c.classId === offering.classId);
                                const teacher = users.find(u => u.email === offering.teacherEmail);
                                return (
                                    <TableRow key={offering.offeringId}>
                                        <TableCell>{subject?.subjectCode}</TableCell>
                                        <TableCell>{subject?.subjectNameTh}</TableCell>
                                        <TableCell>ห้อง {classInfo?.level}/{classInfo?.room}</TableCell>
                                        <TableCell>{teacher?.thaiName}</TableCell>
                                        <TableCell className="text-center">{subject?.defaultCredits.toFixed(1)}</TableCell>
                                        <TableCell className="text-center">{offering.periodsPerWeek || '-'}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
