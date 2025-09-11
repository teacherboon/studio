import { StudentGradeViewer } from "@/components/student-grade-viewer";

export default function ScoreAnalysisPage() {
    return (
        <div className="container mx-auto py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-headline">สมุดพกนักเรียนดิจิทัล</h1>
                <p className="text-muted-foreground">
                    เลือกนักเรียนเพื่อดูข้อมูลผลการเรียนทั้งหมด และใช้ AI เพื่อวิเคราะห์และให้คำแนะนำ
                </p>
            </div>
            <StudentGradeViewer />
        </div>
    );
}
