import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">ตั้งค่า</h1>
                <p className="text-muted-foreground">จัดการการตั้งค่าบัญชีและระบบ</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>ตั้งค่าระบบ</CardTitle>
                    <CardDescription>
                        ส่วนนี้สำหรับการตั้งค่าทั่วไปของระบบ เช่น ชื่อโรงเรียน, เทมเพลต PDF (สำหรับผู้ดูแลระบบ)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">ยังไม่มีการตั้งค่าให้ใช้งานในขณะนี้</p>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>ตั้งค่าบัญชี</CardTitle>
                    <CardDescription>
                        จัดการข้อมูลส่วนตัวและรหัสผ่านของคุณ
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">ยังไม่มีการตั้งค่าให้ใช้งานในขณะนี้</p>
                </CardContent>
            </Card>
        </div>
    )
}
