
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
import { classes, subjects, users } from "@/lib/data";


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
                    <p className="text-sm text-muted-foreground">ฟังก์ชันยังไม่พร้อมใช้งาน</p>
                </CardContent>
            </Card>
        </div>
    )
}
