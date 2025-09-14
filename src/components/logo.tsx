
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="https://i.postimg.cc/7h6Kmpwt/image.png"
      alt="Thai Grade Vision Logo"
      width={40}
      height={40}
      className={cn("h-10 w-10", className)}
    />
  );
}
