
import Image from 'next/image';
import { LoginForm } from '@/components/login-form';
import { Logo } from '@/components/logo';

export default function LoginPage() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <div className="flex justify-center items-center gap-4">
                <Logo className="h-14 w-14 text-primary" />
                <h1 className="text-3xl font-bold font-headline whitespace-nowrap">โรงเรียนวัดทองสัมฤทธิ์</h1>
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
          src="https://i.postimg.cc/Jzk1zzSx/DSC-0029.jpg"
          alt="Image"
          data-ai-hint="school building"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
