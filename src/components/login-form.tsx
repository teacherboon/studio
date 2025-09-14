
"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { users } from '@/lib/data';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!email || !password) {
        toast({
            variant: "destructive",
            title: "ข้อมูลไม่ครบถ้วน",
            description: "กรุณากรอกอีเมลและรหัสผ่าน",
        });
        return;
    }
    
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (user && user.password === password) {
        localStorage.setItem('user_email', user.email);
        router.push('/dashboard');
    } else {
        toast({
            variant: "destructive",
            title: "เข้าสู่ระบบไม่สำเร็จ",
            description: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
        });
    }
  };

  return (
    <form onSubmit={handleLogin} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">อีเมล</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <Input 
            id="password" 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full">
        เข้าสู่ระบบ
      </Button>
    </form>
  );
}
