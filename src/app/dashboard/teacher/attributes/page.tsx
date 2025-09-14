
"use client";

import { useState, useMemo, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { type StudentAttributes, type AttributeLevel, type ActivityStatus } from "@/lib/types";
import { useToast } from '@/hooks/use-toast';
import { Save, Users, AlertCircle } from 'lucide-react';
import { useData } from '@/context/data-context';

const ATTRIBUTE_LABELS: Record<keyof Omit<StudentAttributes, 'studentId' | 'yearBe'>, string> = {
    desirableCharacteristics: 'คุณลักษณะอันพึงประสงค์',
    readingThinkingWriting: 'อ่าน คิด วิเคราะห์และเขียน',
    guidanceActivity: 'กิจกรรมแนะแนว',
    clubActivity: 'กิจกรรมชุมนุม',
    scoutActivity: 'กิจกรรมลูกเสือ/ยุวกาชาด',
    socialServiceActivity: 'กิจกรรมเพื่อสังคมฯ'
}

const attributeOptions: { value: AttributeLevel, label: string }[] = [
    { value: 3, label: '3 - ดีเยี่ยม' },
    { value: 2, label: '2 - ดี' },
    { value: 1, label: '1 - ผ่าน' },
];

const activityOptions: { value: ActivityStatus, label: string }[] = [
    { value: 'ผ่าน', label: 'ผ่าน' },
    { value: 'ไม่ผ่าน', label: 'ไม่ผ่าน' },
];

export default function EvaluateAttributesPage() {
    const user = useUser();
    const { toast } = useToast();
    const { allStudents, allEnrollments, allStudentAttributes, actions } = useData();

    const [currentAttributes, setCurrentAttributes] = useState<Record<string, StudentAttributes>>({});

    const homeroomStudents = useMemo(() => {
        if (!user || !user.homeroomClassId) return [];
        const studentIdsInClass = allEnrollments
            .filter(e => e.classId === user.homeroomClassId)
            .map(e => e.studentId);
        return allStudents.filter(s => studentIdsInClass.includes(s.studentId));
    }, [user, allEnrollments, allStudents]);

    useEffect(() => {
        const attributesMap: Record<string, StudentAttributes> = {};
        const currentYear = new Date().getFullYear() + 543;
        homeroomStudents.forEach(student => {
            const existingAttr = allStudentAttributes.find(attr => attr.studentId === student.studentId && attr.yearBe === currentYear);
            if (existingAttr) {
                attributesMap[student.studentId] = existingAttr;
            } else {
                attributesMap[student.studentId] = {
                    studentId: student.studentId,
                    yearBe: currentYear,
                    desirableCharacteristics: 3,
                    readingThinkingWriting: 3,
                    guidanceActivity: 'ผ่าน',
                    clubActivity: 'ผ่าน',
                    scoutActivity: 'ผ่าน',
                    socialServiceActivity: 'ผ่าน',
                }
            }
        });
        setCurrentAttributes(attributesMap);
    }, [homeroomStudents, allStudentAttributes]);

    const handleAttributeChange = (studentId: string, field: keyof StudentAttributes, value: AttributeLevel | ActivityStatus) => {
        setCurrentAttributes(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [field]: value
            }
        }));
    };

    const handleSave = () => {
        const attrsToUpdate = Object.values(currentAttributes);
        actions.updateStudentAttributes(attrsToUpdate);
        toast({
            title: "บันทึกข้อมูลสำเร็จ",
            description: `อัปเดตข้อมูลการประเมินของนักเรียน ${attrsToUpdate.length} คนเรียบร้อยแล้ว`,
        });
    };
    
    if (!user || !user.homeroomClassId) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="text-destructive"/>
                        ไม่พบข้อมูลห้องเรียนประจำชั้น
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        บัญชีของคุณไม่ได้ถูกกำหนดให้เป็นครูประจำชั้น โปรดติดต่อผู้ดูแลระบบ
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">ประเมินคุณลักษณะและกิจกรรม</h1>
                <p className="text-muted-foreground">บันทึกผลการประเมินคุณลักษณะอันพึงประสงค์และกิจกรรมพัฒนาผู้เรียน</p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                       <Users className="h-6 w-6" />
                       นักเรียนในที่ปรึกษา
                    </CardTitle>
                    <CardDescription>
                        แสดงรายชื่อนักเรียนในห้องเรียนประจำชั้นของคุณ
                    </CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="min-w-[150px]">ชื่อ-สกุล</TableHead>
                                    <TableHead className="min-w-[150px]">{ATTRIBUTE_LABELS.desirableCharacteristics}</TableHead>
                                    <TableHead className="min-w-[150px]">{ATTRIBUTE_LABELS.readingThinkingWriting}</TableHead>
                                    <TableHead className="min-w-[150px]">{ATTRIBUTE_LABELS.guidanceActivity}</TableHead>
                                    <TableHead className="min-w-[150px]">{ATTRIBUTE_LABELS.clubActivity}</TableHead>
                                    <TableHead className="min-w-[150px]">{ATTRIBUTE_LABELS.scoutActivity}</TableHead>
                                    <TableHead className="min-w-[150px]">{ATTRIBUTE_LABELS.socialServiceActivity}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {homeroomStudents.map((student) => {
                                    const studentAttrs = currentAttributes[student.studentId];
                                    if (!studentAttrs) return null;
                                    return (
                                    <TableRow key={student.studentId}>
                                        <TableCell className="font-medium">{`${student.prefixTh}${student.firstNameTh} ${student.lastNameTh}`}</TableCell>
                                        <TableCell>
                                            <Select
                                                value={String(studentAttrs.desirableCharacteristics)}
                                                onValueChange={(val) => handleAttributeChange(student.studentId, 'desirableCharacteristics', Number(val) as AttributeLevel)}
                                            >
                                                <SelectTrigger><SelectValue/></SelectTrigger>
                                                <SelectContent>
                                                    {attributeOptions.map(opt => <SelectItem key={opt.value} value={String(opt.value)}>{opt.label}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                         <TableCell>
                                            <Select
                                                value={String(studentAttrs.readingThinkingWriting)}
                                                onValueChange={(val) => handleAttributeChange(student.studentId, 'readingThinkingWriting', Number(val) as AttributeLevel)}
                                            >
                                                <SelectTrigger><SelectValue/></SelectTrigger>
                                                <SelectContent>
                                                    {attributeOptions.map(opt => <SelectItem key={opt.value} value={String(opt.value)}>{opt.label}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                             <Select
                                                value={studentAttrs.guidanceActivity}
                                                onValueChange={(val) => handleAttributeChange(student.studentId, 'guidanceActivity', val as ActivityStatus)}
                                            >
                                                <SelectTrigger><SelectValue/></SelectTrigger>
                                                <SelectContent>
                                                    {activityOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                value={studentAttrs.clubActivity}
                                                onValueChange={(val) => handleAttributeChange(student.studentId, 'clubActivity', val as ActivityStatus)}
                                            >
                                                <SelectTrigger><SelectValue/></SelectTrigger>
                                                <SelectContent>
                                                    {activityOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                         <TableCell>
                                            <Select
                                                value={studentAttrs.scoutActivity}
                                                onValueChange={(val) => handleAttributeChange(student.studentId, 'scoutActivity', val as ActivityStatus)}
                                            >
                                                <SelectTrigger><SelectValue/></SelectTrigger>
                                                <SelectContent>
                                                    {activityOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                         <TableCell>
                                            <Select
                                                value={studentAttrs.socialServiceActivity}
                                                onValueChange={(val) => handleAttributeChange(student.studentId, 'socialServiceActivity', val as ActivityStatus)}
                                            >
                                                <SelectTrigger><SelectValue/></SelectTrigger>
                                                <SelectContent>
                                                    {activityOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                    </TableRow>
                                )})}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

             <div className="flex justify-end">
                <Button onClick={handleSave} disabled={Object.keys(currentAttributes).length === 0}>
                    <Save className="mr-2"/>
                    บันทึกข้อมูล
                </Button>
            </div>
        </div>
    )
}
