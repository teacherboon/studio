import { AtRiskStudentsClient } from "@/components/at-risk-students-client";

export default function AtRiskPage() {
    return (
        <div className="container mx-auto py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-headline">วิเคราะห์นักเรียนกลุ่มเสี่ยงด้วย AI</h1>
                <p className="text-muted-foreground">
                    ใช้ AI เพื่อระบุว่านักเรียนคนใดมีความเสี่ยงที่จะไม่ผ่านตามคะแนนปัจจุบัน
                </p>
            </div>
            <AtRiskStudentsClient />
        </div>
    );
}
