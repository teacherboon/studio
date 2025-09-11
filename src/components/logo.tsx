import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="https://lh3.googleusercontent.com/d/10qUwamnvsdgwLO3GoNpXVcsaJHVixY9p"
      alt="Thai Grade Vision Logo"
      width={32}
      height={32}
      className={cn("h-8 w-8", className)}
    />
  );
}
