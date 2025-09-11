
import React from 'react';
import { Logo } from '@/components/logo';
import { Student, StudentGradeDetails, Class, Subject, StudentAttributes } from '@/lib/types';
import { subjects } from '@/lib/data';

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


    return (
        <div ref={ref} className="p-8 bg-white text-black font-['Sarabun'] print:shadow-none" style={{ width: '210mm', minHeight: '297mm', fontFamily: 'Sarabun, sans-serif' }}>
            <div className="text-center mb-4">
                <div className="flex items-center justify-center gap-4">
                    <Logo className="w-20 h-20" />
                    <div>
                        <h1 className="text-xl font-bold">แบบรายงานประจำตัวนักเรียน</h1>
                        <h2 className="text-lg font-bold">โรงเรียนวัดทองสัมฤทธิ์ เขตมีนบุรี กรุงเทพมหานคร</h2>
                    </div>
                </div>
                <p className="text-lg mt-2">ชั้นประถมศึกษาปีที่ {currentClass.level.split('.')[1]} ปีการศึกษา {currentClass.yearBe}</p>
            </div>
            
            <div className="grid grid-cols-4 gap-x-4 gap-y-2 mb-4 border-t border-b border-black py-2 text-sm">
                <div><strong>ชื่อ:</strong> {student.prefixTh}{student.firstNameTh} {student.lastNameTh}</div>
                <div><strong>เลขประจำตัว:</strong> {student.stuCode}</div>
                <div><strong>เลขที่:</strong> {student.classNumber || '-'}</div>
                <div></div>
            </div>

            <table className="w-full border-collapse border border-black text-sm">
                <thead>
                    <tr className="bg-gray-100 print:bg-gray-100">
                        <th className="border border-black p-1" rowSpan={2}>รหัสวิชา</th>
                        <th className="border border-black p-1" rowSpan={2}>รายวิชา</th>
                        <th className="border border-black p-1" rowSpan={2}>ประเภท</th>
                        <th className="border border-black p-1" rowSpan={2}>หน่วยกิต</th>
                        <th className="border border-black p-1" colSpan={3}>การประเมินผลสัมฤทธิ์</th>
                        <th className="border border-black p-1" rowSpan={2}>หมายเหตุ</th>
                    </tr>
                    <tr className="bg-gray-100 print:bg-gray-100">
                        <th className="border border-black p-1">คะแนน</th>
                        <th className="border border-black p-1">สอบปกติ</th>
                        <th className="border border-black p-1">แก้ตัว</th>
                    </tr>
                </thead>
                <tbody>
                    {grades.map(grade => {
                         return (
                            <tr key={grade.scoreId}>
                                <td className="border border-black p-1 text-center">{grade.subjectCode}</td>
                                <td className="border border-black p-1">{grade.subjectName}</td>
                                <td className="border border-black p-1 text-center">{grade.subjectType}</td>
                                <td className="border border-black p-1 text-center">{grade.credits.toFixed(1)}</td>
                                <td className="border border-black p-1 text-center">{grade.rawScore}</td>
                                <td className="border border-black p-1 text-center">{grade.gradePoint}</td>
                                <td className="border border-black p-1 text-center">{grade.statusFlag === 'ร' ? 'ร' : ''}</td>
                                <td className="border border-black p-1 text-center"></td>
                            </tr>
                         )
                    })}
                </tbody>
            </table>

            <div className="grid grid-cols-2 gap-8 mt-4 text-sm">
                <div>
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
                
                <div className="flex flex-col justify-between">
                    <div className="text-center mt-8">
                        <p>ลงชื่อ ........................................................</p>
                        <p>(........................................................)</p>
                        <p>ครูประจำชั้น / ครูประจำวิชา</p>
                    </div>
                     <div className="text-center">
                        <p>ลงชื่อ ........................................................</p>
                        <p>(นางสาวสุมิตรา นวลสระน้อย)</p>
                        <p>รองผู้อำนวยการสถานศึกษา โรงเรียนวัดทองสัมฤทธิ์</p>
                    </div>
                     <div className="text-center">
                        <p>ลงชื่อ ........................................................</p>
                        <p>(นายราชัน หาญเทพ)</p>
                        <p>ผู้อำนวยการสถานศึกษา โรงเรียนวัดทองสัมฤทธิ์</p>
                    </div>
                    <div className="text-center">
                        <p>ลงชื่อ ........................................................</p>
                        <p>ผู้ปกครอง</p>
                    </div>
                </div>
            </div>
        </div>
    );
});

GradeReportSheet.displayName = 'GradeReportSheet';
