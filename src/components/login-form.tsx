
"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { users } from '@/lib/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from 'react';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!email) {
        alert("กรุณาเลือกบัญชีเพื่อเข้าสู่ระบบ");
        return;
    }
    
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
        <Label htmlFor="email">บัญชีผู้ใช้</Label>
        <Select value={email} onValueChange={setEmail}>
            <SelectTrigger>
                <SelectValue placeholder="เลือกบัญชีเพื่อเข้าสู่ระบบ" />
            </SelectTrigger>
            <SelectContent>
                {users.map(user => (
                    <SelectItem key={user.userId} value={user.email}>
                        {user.displayName} ({user.role})
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
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
