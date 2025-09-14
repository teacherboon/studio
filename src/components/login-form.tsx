
"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { users } from '@/lib/data';

export function LoginForm() {
  const router = useRouter();

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    
    const user = users.find(u => u.email === email);

    if (user) {
        localStorage.setItem('user_email', user.email);
        router.push('/dashboard');
    } else {
        alert("ไม่พบผู้ใช้งานนี้ในระบบ หรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  return (
    <form onSubmit={handleLogin} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">อีเมล</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="m@example.com"
          required
        />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">รหัสผ่าน</Label>
          <a
            href="#"
            className="ml-auto inline-block text-sm underline"
          >
            ลืมรหัสผ่าน?
          </a>
        </div>
        <Input id="password" type="password" required defaultValue="password" />
      </div>
      <Button type="submit" className="w-full">
        เข้าสู่ระบบ
      </Button>
      <Button variant="outline" className="w-full">
        เข้าสู่ระบบด้วย Google
      </Button>
    </form>
  );
}
