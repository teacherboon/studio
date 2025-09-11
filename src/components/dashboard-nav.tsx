"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  GraduationCap,
  Home,
  Users,
  BookUser,
  Settings,
  AlertTriangle,
  LogOut,
  FileText,
  Wand,
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/hooks/use-user";

export function DashboardNav() {
  const pathname = usePathname();
  const user = useUser();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('user_email');
    router.push('/');
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  }

  return (
    <Sidebar
      className="border-r"
      collapsible="icon"
      variant="sidebar"
    >
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="shrink-0" asChild>
                <Link href="/dashboard">
                    <GraduationCap className="h-6 w-6 text-primary" />
                </Link>
            </Button>
            <h2 className="text-lg font-semibold font-headline">Grade Vision</h2>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/dashboard"}
              tooltip="Dashboard"
            >
              <Link href="/dashboard">
                <Home />
                <span>แดชบอร์ด</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {user?.role === 'STUDENT' && (
             <SidebarMenuItem>
                <SidebarMenuButton
                    asChild
                    isActive={pathname === "/dashboard/grades"}
                    tooltip="My Grades"
                >
                    <Link href="/dashboard/grades">
                        <FileText />
                        <span>ผลการเรียน</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {(user?.role === 'TEACHER' || user?.role === 'ADMIN') && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith("/dashboard/classes")}
                tooltip="My Classes"
              >
                <Link href="/dashboard/classes">
                  <BookUser />
                  <span>รายวิชาของฉัน</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          
          {(user?.role === 'TEACHER' || user?.role === 'ADMIN') && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/dashboard/at-risk"}
                tooltip="At-Risk Students"
              >
                <Link href="/dashboard/at-risk">
                  <AlertTriangle />
                  <span>นักเรียนกลุ่มเสี่ยง</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {(user?.role === 'TEACHER' || user?.role === 'ADMIN') && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/dashboard/score-analysis"}
                tooltip="Score Analysis"
              >
                <Link href="/dashboard/score-analysis">
                  <Wand />
                  <span>วิเคราะห์ผลการเรียน</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          
          {user?.role === 'ADMIN' && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith("/dashboard/admin")}
                tooltip="Admin"
              >
                <Link href="/dashboard/admin/users">
                  <Users />
                  <span>จัดการผู้ใช้</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
            <SidebarMenuItem>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start p-2 gap-2 h-12">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={`https://picsum.photos/seed/${user?.email}/40/40`} />
                                <AvatarFallback>{user ? getInitials(user.displayName) : 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start text-left truncate">
                                <span className="text-sm font-medium">{user?.displayName}</span>
                                <span className="text-xs text-muted-foreground">{user?.email}</span>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user?.displayName}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                {user?.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>ตั้งค่า</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>ออกจากระบบ</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
