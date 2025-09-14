
"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/hooks/use-user';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { findSubstituteTeacher, FindSubstituteTeacherOutput } from '@/ai/flows/find-substitute-teacher';
import { useData } from '@/context/data-context';

const formSchema = z.object({
  leaveType: z.enum(['PERSONAL', 'OFFICIAL_DUTY'], {
    required_error: 'กรุณาเลือกประเภทการลา',
  }),
  leaveDate: z.date({
    required_error: 'กรุณาเลือกวันที่',
  }),
  reason: z.string().min(1, 'กรุณาระบุเหตุผล'),
});

type LeaveFormValues = z.infer<typeof formSchema>;

export default function TeacherLeavePage() {
  const user = useUser();
  const { allUsers, allSchedules, allOfferings } = useData();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FindSubstituteTeacherOutput | null>(null);

  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: LeaveFormValues) => {
    if (!user) return;
    setLoading(true);
    setResult(null);

    const dayOfWeek = format(data.leaveDate, 'EEEE').toUpperCase() as 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY';
    
    // Find periods the teacher is scheduled to teach on that day
    const affectedPeriods = allSchedules
        .filter(s => {
            const offering = allOfferings.find(o => o.offeringId === s.offeringId);
            return offering?.teacherEmail === user.email && s.dayOfWeek === dayOfWeek;
        })
        .map(s => s.period);
    
    if (affectedPeriods.length === 0) {
        toast({
            title: "คุณไม่มีคาบสอนในวันที่เลือก",
            description: "ระบบไม่ต้องหาครูสอนแทนเนื่องจากคุณไม่มีตารางสอนในวันดังกล่าว",
        });
        setLoading(false);
        return;
    }

    try {
        const aiInput = {
            requestingTeacher: {
                email: user.email,
                name: user.thaiName
            },
            leaveDate: format(data.leaveDate, 'yyyy-MM-dd'),
            leaveReason: data.reason,
            affectedPeriods: affectedPeriods,
            allSchedules: allSchedules,
            allTeachers: allUsers.filter(u => u.role === 'TEACHER'),
            allOfferings: allOfferings,
        }

        const aiResult = await findSubstituteTeacher(aiInput);
        setResult(aiResult);
        toast({
            title: "ค้นหาครูสอนแทนสำเร็จ",
            description: aiResult.justification,
        })
    } catch(error) {
        console.error("Error finding substitute:", error);
        toast({
            variant: "destructive",
            title: "เกิดข้อผิดพลาด",
            description: "ไม่สามารถค้นหาครูสอนแทนได้ โปรดลองอีกครั้ง"
        })
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">แจ้งวันลา/ไปราชการ</h1>
        <p className="text-muted-foreground">
          กรอกฟอร์มเพื่อส่งเรื่องและให้ระบบ AI ช่วยหาครูสอนแทนอัตโนมัติ
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-1">
            <CardHeader>
                <CardTitle>กรอกข้อมูลการลา</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                    control={form.control}
                    name="leaveType"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>ประเภท</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="เลือกประเภทการลา" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="PERSONAL">ลาป่วย/ลากิจ</SelectItem>
                            <SelectItem value="OFFICIAL_DUTY">ไปราชการ</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="leaveDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>วันที่</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={'outline'}
                                className={cn(
                                    'w-full pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                )}
                                >
                                {field.value ? (
                                    format(field.value, 'PPP')
                                ) : (
                                    <span>เลือกวันที่</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                date < new Date(new Date().setDate(new Date().getDate() - 1)) // Disable past dates
                                }
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>หมายเหตุ/เหตุผล</FormLabel>
                        <FormControl>
                            <Textarea
                            placeholder="เช่น ไปอบรมที่ สพฐ."
                            className="resize-none"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        ส่งเรื่องและค้นหาครูสอนแทน
                    </Button>
                </form>
                </Form>
            </CardContent>
        </Card>
        
        <div className="md:col-span-2">
            {loading && (
                <Card>
                    <CardHeader>
                        <CardTitle>กำลังค้นหา...</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center p-16">
                         <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </CardContent>
                </Card>
            )}
            {result && (
                <Card className="border-primary bg-primary/5">
                    <CardHeader>
                        <CardTitle>ผลการจัดครูสอนแทน</CardTitle>
                        <CardDescription>
                            ระบบ AI ได้เลือกครูสอนแทนสำหรับคุณแล้ว
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-semibold">ผู้สอนแทนที่ถูกเลือก:</h3>
                            <p className="text-lg font-bold text-primary">{result.substituteTeacher.name} ({result.substituteTeacher.email})</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">เหตุผลในการเลือก:</h3>
                            <p className="text-muted-foreground">{result.justification}</p>
                        </div>
                         <div>
                            <h3 className="font-semibold">ขั้นตอนถัดไป:</h3>
                            <p className="text-muted-foreground">ระบบจะส่งอีเมลแจ้งเตือนไปยัง {result.substituteTeacher.name} โดยอัตโนมัติ (จำลอง)</p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>

      </div>
    </div>
  );
}
