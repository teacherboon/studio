
"use client";

import { useState, useMemo } from 'react';
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
import { students, enrollments, studentAttributes as initialStudentAttributes, type Student, type StudentAttributes, type AttributeLevel, type ActivityStatus } from "@/lib/data";
import { useToast } from '@/hooks/use-toast';
import { Save, Users, AlertCircle } from 'lucide-react';

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
    const [allAttributes, setAllAttributes] = useState<StudentAttributes[]>(initialStudentAttributes);
    const [changedAttributes, setChangedAttributes] = useState<Record<string, Partial<StudentAttributes>>>({});


    const homeroomStudents = useMemo(() => {
        if (!user || !user.homeroomClassId) return [];
        const studentIdsInClass = enrollments
            .filter(e => e.classId === user.homeroomClassId)
            .map(e => e.studentId);
        return students.filter(s => studentIdsInClass.includes(s.studentId));
    }, [user]);

    const handleAttributeChange = (studentId: string, field: keyof StudentAttributes, value: AttributeLevel | ActivityStatus) => {
        setChangedAttributes(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [field]: value
            }
        }));
    };

    const handleSave = () => {
        let updatedCount = 0;
        const updatedAllAttributes = allAttributes.map(originalAttr => {
             if (changedAttributes[originalAttr.studentId]) {
                 updatedCount++;
                 return { ...originalAttr, ...changedAttributes[originalAttr.studentId] };
             }
             return originalAttr;
        });

        // Add new attributes for students who didn't have them before
        homeroomStudents.forEach(student => {
            if (!updatedAllAttributes.some(attr => attr.studentId === student.studentId) && changedAttributes[student.studentId]) {
                const newAttr: StudentAttributes = {
                    studentId: student.studentId,
                    yearBe: new Date().getFullYear() + 543, // Assuming current year
                    desirableCharacteristics: 3,
                    readingThinkingWriting: 3,
                    guidanceActivity: 'ผ่าน',
                    clubActivity: 'ผ่าน',
                    scoutActivity: 'ผ่าน',
                    socialServiceActivity: 'ผ่าน',
                    ...changedAttributes[student.studentId]
                };
                updatedAllAttributes.push(newAttr);
                updatedCount++;
            }
        });


        setAllAttributes(updatedAllAttributes);
        setChangedAttributes({});
        toast({
            title: "บันทึกข้อมูลสำเร็จ",
            description: `อัปเดตข้อมูลการประเมินของนักเรียน ${updatedCount} คนเรียบร้อยแล้ว`,
        });
        // In a real app, you'd also update the mock data source `initialStudentAttributes`
        // For simplicity here, we're only updating the component's state.
    };

    const getStudentCurrentAttribute = (studentId: string, field: keyof StudentAttributes): AttributeLevel | ActivityStatus | undefined => {
        if (changedAttributes[studentId]?.[field]) {
            return changedAttributes[studentId]?.[field] as any;
        }
        const existing = allAttributes.find(a => a.studentId === studentId);
        return existing?.[field] as any;
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
                                {homeroomStudents.map((student) => (
                                    <TableRow key={student.studentId}>
                                        <TableCell className="font-medium">{`${student.prefixTh}${student.firstNameTh} ${student.lastNameTh}`}</TableCell>
                                        <TableCell>
                                            <Select
                                                value={String(getStudentCurrentAttribute(student.studentId, 'desirableCharacteristics') ?? '3')}
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
                                                value={String(getStudentCurrentAttribute(student.studentId, 'readingThinkingWriting') ?? '3')}
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
                                                value={getStudentCurrentAttribute(student.studentId, 'guidanceActivity') ?? 'ผ่าน'}
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
                                                value={getStudentCurrentAttribute(student.studentId, 'clubActivity') ?? 'ผ่าน'}
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
                                                value={getStudentCurrentAttribute(student.studentId, 'scoutActivity') ?? 'ผ่าน'}
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
                                                value={getStudentCurrentAttribute(student.studentId, 'socialServiceActivity') ?? 'ผ่าน'}
                                                onValueChange={(val) => handleAttributeChange(student.studentId, 'socialServiceActivity', val as ActivityStatus)}
                                            >
                                                <SelectTrigger><SelectValue/></SelectTrigger>
                                                <SelectContent>
                                                    {activityOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

             <div className="flex justify-end">
                <Button onClick={handleSave} disabled={Object.keys(changedAttributes).length === 0}>
                    <Save className="mr-2"/>
                    บันทึกข้อมูล
                </Button>
            </div>
        </div>
    )
}
