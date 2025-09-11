import Image from 'next/image';
import { LoginForm } from '@/components/login-form';
import { GraduationCap } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <div className="flex justify-center items-center gap-2">
                <GraduationCap className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold font-headline">Thai Grade Vision</h1>
            </div>
            <p className="text-balance text-muted-foreground">
              เข้าสู่ระบบเพื่อจัดการและดูผลการเรียน
            </p>
          </div>
          <LoginForm />
          <div className="mt-4 text-center text-sm">
            หากไม่มีบัญชี?{' '}
            <a href="#" className="underline">
              ติดต่อผู้ดูแล
            </a>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="https://picsum.photos/seed/school/1920/1080"
          alt="Image"
          data-ai-hint="classroom students"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
