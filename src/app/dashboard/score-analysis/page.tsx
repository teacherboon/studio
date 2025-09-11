import { ScoreAnalysisClient } from "@/components/score-analysis-client";

export default function ScoreAnalysisPage() {
    return (
        <div className="container mx-auto py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-headline">วิเคราะห์ผลการเรียนของนักเรียนด้วย AI</h1>
                <p className="text-muted-foreground">
                    ใช้ AI เพื่อวิเคราะห์แนวโน้มและให้คำแนะนำสำหรับผลการเรียนของนักเรียน
                </p>
            </div>
            <ScoreAnalysisClient />
        </div>
    );
}
