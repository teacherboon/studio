
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Bell,
  Home,
  Users,
  BookUser,
  Settings,
  AlertTriangle,
  LogOut,
  FileText,
  Wand,
  Book,
  School,
  ChevronDown,
  LayoutDashboard,
  Moon,
  Sun,
  CalendarDays,
  CalendarPlus
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/hooks/use-user";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

export function DashboardNav() {
  const pathname = usePathname();
  const user = useUser();
  const router = useRouter();
  const { setTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('user_email');
    router.push('/');
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  }

  const isAdminSectionOpen = pathname.startsWith('/dashboard/admin');

  return (
    <Sidebar
      className="border-r"
      collapsible="icon"
      variant="sidebar"
    >
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="shrink-0 h-12 w-12" asChild>
                <Link href="/dashboard">
                    <Logo className="h-10 w-10 text-primary" />
                </Link>
            </Button>
            <h2 className="text-lg font-semibold font-headline">โรงเรียนวัดทองสัมฤทธิ์</h2>
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
                <LayoutDashboard />
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

           {(user?.role === 'TEACHER') && (
             <SidebarMenuItem>
                <SidebarMenuButton
                    asChild
                    isActive={pathname === "/dashboard/teacher/leave"}
                    tooltip="Leave Request"
                >
                    <Link href="/dashboard/teacher/leave">
                        <CalendarPlus />
                        <span>แจ้งลา/ราชการ</span>
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
                  <span>จัดการคะแนน</span>
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
            <Collapsible defaultOpen={isAdminSectionOpen}>
                <SidebarMenuItem asChild>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                            variant="ghost"
                            className="w-full justify-start"
                        >
                            <Users />
                            <span>ส่วนผู้ดูแลระบบ</span>
                            <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform ease-in-out group-data-[state=open]:rotate-180" />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                </SidebarMenuItem>
                <CollapsibleContent>
                    <SidebarMenu className="ml-4 my-1 border-l pl-4">
                       <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={pathname === "/dashboard/admin/users"} tooltip="Users">
                              <Link href="/dashboard/admin/users">ผู้ใช้งาน</Link>
                          </SidebarMenuButton>
                       </SidebarMenuItem>
                       <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={pathname === "/dashboard/admin/classes"} tooltip="Classes">
                              <Link href="/dashboard/admin/classes">ห้องเรียน</Link>
                          </SidebarMenuButton>
                       </SidebarMenuItem>
                       <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={pathname === "/dashboard/admin/subjects"} tooltip="Subjects">
                              <Link href="/dashboard/admin/subjects">รายวิชา</Link>
                          </SidebarMenuButton>
                       </SidebarMenuItem>
                       <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={pathname === "/dashboard/admin/schedules"} tooltip="Schedules">
                              <Link href="/dashboard/admin/schedules">ตารางสอน</Link>
                          </SidebarMenuButton>
                       </SidebarMenuItem>
                    </SidebarMenu>
                </CollapsibleContent>
            </Collapsible>
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
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            <Sun className="mr-2 h-4 w-4" />
                            <span>Light Mode</span>
                        </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => setTheme("dark")}>
                            <Moon className="mr-2 h-4 w-4" />
                            <span>Dark Mode</span>
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
