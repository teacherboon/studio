
import React from 'react';
import { Logo } from '@/components/logo';
import { Student, StudentGradeDetails, Class, Subject, StudentAttributes } from '@/lib/types';
import { subjects, users } from '@/lib/data';
import Image from 'next/image';

interface GradeReportSheetProps {
    student: Student;
    grades: StudentGradeDetails[];
    gpa: string;
    currentClass: Class;
    attributes: StudentAttributes | null;
}

export const GradeReportSheet = React.forwardRef<HTMLDivElement, GradeReportSheetProps>((props, ref) => {
    const { student, grades, gpa, currentClass, attributes } = props;

    const subjectsInfo: Record<string, Subject> = subjects.reduce((acc, s) => {
        acc[s.subjectId] = s;
        return acc;
    }, {} as Record<string, Subject>);
    
    const basicSubjects = grades.filter(g => g.subjectType === 'พื้นฐาน');
    const additionalSubjects = grades.filter(g => g.subjectType === 'เพิ่มเติม');

    const totalBasicCredits = basicSubjects.reduce((sum, g) => sum + g.credits, 0)
    const totalAdditionalCredits = additionalSubjects.reduce((sum, g) => sum + g.credits, 0)
    const totalCredits = totalBasicCredits + totalAdditionalCredits;

    const homeroomTeachers = currentClass.homeroomTeacherEmails
        ?.map(email => users.find(u => u.email === email)?.thaiName)
        .filter(Boolean) as string[];


    return (
        <div 
            ref={ref} 
            className="p-8 bg-white text-black print:shadow-none flex flex-col" 
            style={{ width: '210mm', minHeight: '297mm', fontFamily: '"TH Sarabun New", sans-serif', fontSize: '16px' }}
        >
            <div className="text-center mb-1">
                <div className="flex items-center justify-center gap-4">
                    <Logo className="w-20 h-20" />
                    <div className="text-center">
                        <h1 className="text-xl font-bold">แบบรายงานประจำตัวนักเรียน</h1>
                        <h2 className="text-lg font-bold">โรงเรียนวัดทองสัมฤทธิ์ เขตมีนบุรี กรุงเทพมหานคร</h2>
                    </div>
                </div>
                 <p className="text-lg mt-1">ชั้นประถมศึกษาปีที่ {currentClass.level.split('.')[1]} ปีการศึกษา {currentClass.yearBe}</p>
            </div>
            
            <div className="grid grid-cols-4 gap-x-4 gap-y-1 mb-1 border-t border-b border-black py-1">
                <div><strong>ชื่อ:</strong> {student.prefixTh}{student.firstNameTh} {student.lastNameTh}</div>
                <div><strong>เลขประจำตัว:</strong> {student.stuCode}</div>
                <div><strong>เลขที่:</strong> {student.classNumber || '-'}</div>
                <div></div>
            </div>

            <table className="w-full border-collapse border border-black">
                <thead>
                    <tr className="bg-gray-100 print:bg-gray-100">
                        <th className="border border-black px-1 py-0 w-[15%]">รหัสวิชา</th>
                        <th className="border border-black px-1 py-0 w-[35%]">รายวิชา</th>
                        <th className="border border-black px-1 py-0 w-[10%]">หน่วยกิต</th>
                        <th className="border border-black px-1 py-0 w-[10%]">คะแนน</th>
                        <th className="border border-black px-1 py-0 w-[10%]">เกรด</th>
                        <th className="border border-black px-1 py-0 w-[10%]">แก้ตัว</th>
                        <th className="border border-black px-1 py-0 w-[10%]">หมายเหตุ</th>
                    </tr>
                </thead>
                <tbody>
                    {grades.map(grade => {
                         return (
                            <tr key={grade.scoreId}>
                                <td className="border border-black px-1 py-0 text-center">{grade.subjectCode}</td>
                                <td className="border border-black px-1 py-0">{grade.subjectName}</td>
                                <td className="border border-black px-1 py-0 text-center">{grade.credits.toFixed(1)}</td>
                                <td className="border border-black px-1 py-0 text-center">{grade.rawScore}</td>
                                <td className="border border-black px-1 py-0 text-center">{grade.gradePoint?.toFixed(2) ?? '-'}</td>
                                <td className="border border-black px-1 py-0 text-center">{grade.statusFlag === 'ร' ? 'ร' : ''}</td>
                                <td className="border border-black px-1 py-0 text-center"></td>
                            </tr>
                         )
                    })}
                    {Array.from({ length: Math.max(0, 15 - grades.length) }).map((_, i) => (
                        <tr key={`empty-${i}`}>
                            <td className="border border-black px-1 py-0">&nbsp;</td>
                            <td className="border border-black px-1 py-0"></td>
                            <td className="border border-black px-1 py-0"></td>
                            <td className="border border-black px-1 py-0"></td>
                            <td className="border border-black px-1 py-0"></td>
                            <td className="border border-black px-1 py-0"></td>
                            <td className="border border-black px-1 py-0"></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <div className="flex-grow"></div>

            <div className="mt-4">
                <div className="flex">
                    <div className="w-1/2 pr-4">
                        <table className="w-full border-collapse border border-black">
                            <thead>
                                <tr className="bg-gray-100 print:bg-gray-100">
                                    <th className="border border-black px-1 py-0 text-left" colSpan={2}>สรุปผลการประเมิน</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-black px-1 py-0">จำนวนหน่วยกิต/น้ำหนักวิชาพื้นฐาน</td>
                                    <td className="border border-black px-1 py-0 text-right">{totalBasicCredits.toFixed(1)}</td>
                                </tr>
                                <tr>
                                    <td className="border border-black px-1 py-0">จำนวนหน่วยกิต/น้ำหนักวิชาเพิ่มเติม</td>
                                    <td className="border border-black px-1 py-0 text-right">{totalAdditionalCredits.toFixed(1)}</td>
                                </tr>
                                <tr>
                                    <td className="border border-black px-1 py-0">รวมหน่วยกิต/น้ำหนัก</td>
                                    <td className="border border-black px-1 py-0 text-right">{totalCredits.toFixed(1)}</td>
                                </tr>
                                <tr>
                                    <td className="border border-black px-1 py-0"><strong>ระดับผลการเรียนเฉลี่ย</strong></td>
                                    <td className="border border-black px-1 py-0 text-right"><strong>{gpa}</strong></td>
                                </tr>
                            </tbody>
                        </table>

                        <table className="w-full border-collapse border border-black mt-2">
                            <thead>
                                <tr className="bg-gray-100 print:bg-gray-100">
                                    <th className="border border-black px-1 py-0 text-left" colSpan={2}>การประเมินคุณลักษณะ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-black px-1 py-0">คุณลักษณะอันพึงประสงค์ของสถานศึกษา</td>
                                    <td className="border border-black px-1 py-0 text-center">{attributes?.desirableCharacteristics || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="border border-black px-1 py-0">การอ่าน คิด วิเคราะห์และเขียน</td>
                                    <td className="border border-black px-1 py-0 text-center">{attributes?.readingThinkingWriting || '-'}</td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="w-full border-collapse border border-black mt-2">
                            <thead>
                                <tr className="bg-gray-100 print:bg-gray-100">
                                    <th className="border border-black px-1 py-0 text-left" colSpan={2}>กิจกรรมพัฒนาผู้เรียน</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td className="border border-black px-1 py-0">กิจกรรมแนะแนว</td><td className="border border-black px-1 py-0 text-center">{attributes?.guidanceActivity || '-'}</td></tr>
                                <tr><td className="border border-black px-1 py-0">กิจกรรมชุมนุม</td><td className="border border-black px-1 py-0 text-center">{attributes?.clubActivity || '-'}</td></tr>
                                <tr><td className="border border-black px-1 py-0">กิจกรรมลูกเสือ ยุวกาชาด</td><td className="border border-black px-1 py-0 text-center">{attributes?.scoutActivity || '-'}</td></tr>
                                <tr><td className="border border-black px-1 py-0">กิจกรรมเพื่อสังคมและสาธารณประโยชน์</td><td className="border border-black px-1 py-0 text-center">{attributes?.socialServiceActivity || '-'}</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="w-1/2 flex flex-col justify-end items-center pl-4">
                        <div className="w-full space-y-8 text-center" style={{ fontSize: '16px', fontFamily: '"TH Sarabun New", sans-serif' }}>
                            <div>
                                {homeroomTeachers && homeroomTeachers.length > 0 && (
                                    <>
                                        {homeroomTeachers.map((teacher, index) => (
                                            <p key={index}>{teacher}</p>
                                        ))}
                                        <p>ครูประจำชั้น</p>
                                    </>
                                )}
                            </div>
                            <div className="relative h-20">
                                <div className="absolute bottom-8 inset-x-0 flex justify-center">
                                    <Image src="https://i.postimg.cc/bNhpJgYD/image.png" alt="Head of Academic's Signature" width={120} height={40} style={{ objectFit: 'contain' }} />
                                </div>
                                <div className="absolute bottom-0 inset-x-0">
                                    <p>(นายรัตนะ มณีงาม)</p>
                                    <p>หัวหน้าฝ่ายวิชาการ</p>
                                </div>
                            </div>
                             <div className="relative h-20">
                                <div className="absolute bottom-8 inset-x-0 flex justify-center">
                                    <Image src="https://i.postimg.cc/HW5TdRm1/image.png" alt="Director's Signature" width={150} height={50} style={{ objectFit: 'contain' }} />
                                </div>
                                <div className="absolute bottom-0 inset-x-0">
                                    <p>(นายราชัน หาญเทพ)</p>
                                    <p>ผู้อำนวยการสถานศึกษา โรงเรียนวัดทองสัมฤทธิ์</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

GradeReportSheet.displayName = 'GradeReportSheet';
