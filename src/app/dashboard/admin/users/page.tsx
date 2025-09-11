import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function AdminUsersPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">จัดการผู้ใช้งาน</h1>
                <p className="text-muted-foreground">เพิ่ม, แก้ไข, และลบบัญชีผู้ใช้ในระบบ</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>รายชื่อผู้ใช้</CardTitle>
                    <CardDescription>
                        ส่วนนี้จะแสดงตารางผู้ใช้ทั้งหมดในระบบ
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">ฟังก์ชันยังไม่พร้อมใช้งาน</p>
                </CardContent>
            </Card>
        </div>
    )
}
