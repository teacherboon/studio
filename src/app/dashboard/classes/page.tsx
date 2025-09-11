import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function ClassesPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">รายวิชาของฉัน</h1>
                <p className="text-muted-foreground">จัดการคะแนนและข้อมูลของรายวิชาที่คุณสอน</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>ตารางให้คะแนน</CardTitle>
                    <CardDescription>
                        ส่วนนี้จะแสดงตารางสำหรับกรอกคะแนนนักเรียนในแต่ละวิชา
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">ฟังก์ชันยังไม่พร้อมใช้งาน</p>
                </CardContent>
            </Card>
        </div>
    )
}
