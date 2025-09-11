import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function AdminSubjectsPage() {
    return (
        <div className="space-y-8">
             <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">จัดการรายวิชา</h1>
                    <p className="text-muted-foreground">สร้าง, แก้ไข, และดูข้อมูลรายวิชาทั้งหมดในระบบ</p>
                </div>
                <Button>
                    <PlusCircle className="mr-2" />
                    สร้างรายวิชาใหม่
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>รายชื่อวิชา</CardTitle>
                    <CardDescription>
                        ส่วนนี้จะแสดงตารางวิชาทั้งหมดในระบบ
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">ฟังก์ชันยังไม่พร้อมใช้งาน</p>
                </CardContent>
            </Card>
        </div>
    )
}
