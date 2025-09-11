
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  BookUser,
  Users,
  AlertTriangle,
  FileText,
  Activity,
  Wand
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/hooks/use-user";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
    const user = useUser();

    if (!user) {
        return (
            <div className="flex flex-col gap-8">
                 <div>
                    <Skeleton className="h-9 w-64 mb-2" />
                    <Skeleton className="h-5 w-80" />
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card><CardHeader><Skeleton className="h-5 w-32" /></CardHeader><CardContent><Skeleton className="h-8 w-24 mb-2"/><Skeleton className="h-4 w-48"/></CardContent></Card>
                    <Card><CardHeader><Skeleton className="h-5 w-32" /></CardHeader><CardContent><Skeleton className="h-8 w-24 mb-2"/><Skeleton className="h-4 w-48"/></CardContent></Card>
                    <Card><CardHeader><Skeleton className="h-5 w-32" /></CardHeader><CardContent><Skeleton className="h-8 w-24 mb-2"/><Skeleton className="h-4 w-48"/></CardContent></Card>
                </div>
            </div>
        )
    }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">แดชบอร์ด, {user.thaiName}</h1>
        <p className="text-muted-foreground">ภาพรวมระบบและการเข้าถึงด่วนสำหรับ {user.role === 'TEACHER' ? 'ครู' : user.role === 'STUDENT' ? 'นักเรียน' : 'ผู้ดูแลระบบ'}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        
        {(user.role === 'TEACHER' || user.role === 'ADMIN') && (
            <Card className="hover:shadow-lg transition-shadow">
            <Link href="/dashboard/classes">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">จัดการคะแนน</CardTitle>
                <BookUser className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">5 วิชา</div>
                <p className="text-xs text-muted-foreground">
                    กรอกคะแนนและดูรายชื่อนักเรียน
                </p>
                </CardContent>
            </Link>
            </Card>
        )}
        
        {(user.role === 'TEACHER' || user.role === 'ADMIN') && (
            <Card className="hover:shadow-lg transition-shadow">
            <Link href="/dashboard/score-analysis">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">วิเคราะห์ผลการเรียน (AI)</CardTitle>
                <Wand className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">ใหม่</div>
                <p className="text-xs text-muted-foreground">
                    ใช้ AI เพื่อวิเคราะห์และให้คำแนะนำ
                </p>
                </CardContent>
            </Link>
            </Card>
        )}

        {(user.role === 'TEACHER' || user.role === 'ADMIN') && (
            <Card className="hover:shadow-lg transition-shadow bg-accent/20 border-accent">
            <Link href="/dashboard/at-risk">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">นักเรียนกลุ่มเสี่ยง (AI)</CardTitle>
                <AlertTriangle className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">3 คน</div>
                <p className="text-xs text-muted-foreground">
                    AI ช่วยวิเคราะห์นักเรียนที่ต้องดูแล
                </p>
                </CardContent>
            </Link>
            </Card>
        )}

        {user.role === 'STUDENT' && (
            <Card className="hover:shadow-lg transition-shadow">
            <Link href="/dashboard/grades">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ผลการเรียนของฉัน</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">GPA 3.54</div>
                <p className="text-xs text-muted-foreground">
                    ดูผลการเรียนและดาวน์โหลดรายงาน
                </p>
                </CardContent>
            </Link>
            </Card>
        )}

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">กิจกรรมล่าสุด</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12 บันทึก</div>
            <p className="text-xs text-muted-foreground">
              อัปเดตคะแนนล่าสุดเมื่อ 5 นาทีที่แล้ว
            </p>
          </CardContent>
        </Card>

        {user.role === 'ADMIN' && (
            <Card className="hover:shadow-lg transition-shadow">
            <Link href="/dashboard/admin/users">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">จัดการผู้ใช้</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">257 คน</div>
                <p className="text-xs text-muted-foreground">
                    จัดการบัญชีผู้ใช้ในระบบ
                </p>
                </CardContent>
            </Link>
            </Card>
        )}
      </div>
    </div>
  );
}
