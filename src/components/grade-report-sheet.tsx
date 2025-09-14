
import React from 'react';
import { Logo } from '@/components/logo';
import { Student, StudentGradeDetails, Class, Subject, StudentAttributes } from '@/lib/types';
import { subjects, users } from '@/lib/data';

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
            style={{ width: '210mm', height: '297mm', fontFamily: '"TH Sarabun New", sans-serif', fontSize: '16px' }}
        >
            <div className="text-center mb-4">
                <div className="flex items-center justify-center gap-4">
                    <Logo className="w-20 h-20" />
                    <div>
                        <h1 className="text-xl font-bold">แบบรายงานประจำตัวนักเรียน</h1>
                        <h2 className="text-lg font-bold">โรงเรียนวัดทองสัมฤทธิ์ เขตมีนบุรี กรุงเทพมหานคร</h2>
                    </div>
                </div>
                <p className="text-lg mt-2 text-center">ชั้นประถมศึกษาปีที่ {currentClass.level.split('.')[1]} ปีการศึกษา {currentClass.yearBe}</p>
            </div>
            
            <div className="grid grid-cols-4 gap-x-4 gap-y-2 mb-4 border-t border-b border-black py-2">
                <div><strong>ชื่อ:</strong> {student.prefixTh}{student.firstNameTh} {student.lastNameTh}</div>
                <div><strong>เลขประจำตัว:</strong> {student.stuCode}</div>
                <div><strong>เลขที่:</strong> {student.classNumber || '-'}</div>
                <div></div>
            </div>

            <table className="w-full border-collapse border border-black">
                <thead>
                    <tr className="bg-gray-100 print:bg-gray-100">
                        <th className="border border-black p-1 w-[15%]">รหัสวิชา</th>
                        <th className="border border-black p-1 w-[35%]">รายวิชา</th>
                        <th className="border border-black p-1 w-[10%]">หน่วยกิต</th>
                        <th className="border border-black p-1 w-[10%]">คะแนน</th>
                        <th className="border border-black p-1 w-[10%]">เกรด</th>
                        <th className="border border-black p-1 w-[10%]">แก้ตัว</th>
                        <th className="border border-black p-1 w-[10%]">หมายเหตุ</th>
                    </tr>
                </thead>
                <tbody>
                    {grades.map(grade => {
                         return (
                            <tr key={grade.scoreId}>
                                <td className="border border-black p-1 text-center">{grade.subjectCode}</td>
                                <td className="border border-black p-1">{grade.subjectName}</td>
                                <td className="border border-black p-1 text-center">{grade.credits.toFixed(1)}</td>
                                <td className="border border-black p-1 text-center">{grade.rawScore}</td>
                                <td className="border border-black p-1 text-center">{grade.gradePoint?.toFixed(2) ?? '-'}</td>
                                <td className="border border-black p-1 text-center">{grade.statusFlag === 'ร' ? 'ร' : ''}</td>
                                <td className="border border-black p-1 text-center"></td>
                            </tr>
                         )
                    })}
                     {/* Add empty rows to fill the page */}
                    {Array.from({ length: Math.max(0, 15 - grades.length) }).map((_, i) => (
                        <tr key={`empty-${i}`}>
                            <td className="border border-black p-1">&nbsp;</td>
                            <td className="border border-black p-1"></td>
                            <td className="border border-black p-1"></td>
                            <td className="border border-black p-1"></td>
                            <td className="border border-black p-1"></td>
                            <td className="border border-black p-1"></td>
                            <td className="border border-black p-1"></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {/* This div will grow and push the footer to the bottom */}
            <div className="flex-grow"></div>

            {/* Footer Section */}
            <div className="mt-4">
                <div className="flex">
                    {/* Left Column for summaries */}
                    <div className="w-1/2 pr-4">
                        <table className="w-full border-collapse border border-black">
                            <thead>
                                <tr className="bg-gray-100 print:bg-gray-100">
                                    <th className="border border-black p-1 text-left" colSpan={2}>สรุปผลการประเมิน</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-black p-1">จำนวนหน่วยกิต/น้ำหนักวิชาพื้นฐาน</td>
                                    <td className="border border-black p-1 text-right">{totalBasicCredits.toFixed(1)}</td>
                                </tr>
                                <tr>
                                    <td className="border border-black p-1">จำนวนหน่วยกิต/น้ำหนักวิชาเพิ่มเติม</td>
                                    <td className="border border-black p-1 text-right">{totalAdditionalCredits.toFixed(1)}</td>
                                </tr>
                                <tr>
                                    <td className="border border-black p-1">รวมหน่วยกิต/น้ำหนัก</td>
                                    <td className="border border-black p-1 text-right">{totalCredits.toFixed(1)}</td>
                                </tr>
                                <tr>
                                    <td className="border border-black p-1"><strong>ระดับผลการเรียนเฉลี่ย</strong></td>
                                    <td className="border border-black p-1 text-right"><strong>{gpa}</strong></td>
                                </tr>
                            </tbody>
                        </table>

                        <table className="w-full border-collapse border border-black mt-2">
                            <thead>
                                <tr className="bg-gray-100 print:bg-gray-100">
                                    <th className="border border-black p-1 text-left" colSpan={2}>การประเมินคุณลักษณะ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-black p-1">คุณลักษณะอันพึงประสงค์ของสถานศึกษา</td>
                                    <td className="border border-black p-1 text-center">{attributes?.desirableCharacteristics || '-'}</td>
                                </tr>
                                <tr>
                                    <td className="border border-black p-1">การอ่าน คิด วิเคราะห์และเขียน</td>
                                    <td className="border border-black p-1 text-center">{attributes?.readingThinkingWriting || '-'}</td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="w-full border-collapse border border-black mt-2">
                            <thead>
                                <tr className="bg-gray-100 print:bg-gray-100">
                                    <th className="border border-black p-1 text-left" colSpan={2}>กิจกรรมพัฒนาผู้เรียน</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td className="border border-black p-1">กิจกรรมแนะแนว</td><td className="border border-black p-1 text-center">{attributes?.guidanceActivity || '-'}</td></tr>
                                <tr><td className="border border-black p-1">กิจกรรมชุมนุม</td><td className="border border-black p-1 text-center">{attributes?.clubActivity || '-'}</td></tr>
                                <tr><td className="border border-black p-1">กิจกรรมลูกเสือ ยุวกาชาด</td><td className="border border-black p-1 text-center">{attributes?.scoutActivity || '-'}</td></tr>
                                <tr><td className="border border-black p-1">กิจกรรมเพื่อสังคมและสาธารณประโยชน์</td><td className="border border-black p-1 text-center">{attributes?.socialServiceActivity || '-'}</td></tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Right Column for signatures */}
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
                            <div>
                                <p>........................................................</p>
                                <p>(นายรัตนะ มณีงาม)</p>
                                <p>หัวหน้าฝ่ายวิชาการ</p>
                            </div>
                            <div>
                                <p>........................................................</p>
                                <p>(นายราชัน หาญเทพ)</p>
                                <p>ผู้อำนวยการสถานศึกษา โรงเรียนวัดทองสัมฤทธิ์</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

GradeReportSheet.displayName = 'GradeReportSheet';
