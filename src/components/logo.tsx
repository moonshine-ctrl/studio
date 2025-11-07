import { cn } from '@/lib/utils';
import { CalendarCheck } from 'lucide-react';
import Image from 'next/image';

export function Logo({ className, logoUrl, useText = false }: { className?: string, logoUrl?: string, useText?: boolean }) {
  const showText = useText || !logoUrl;

  return (
    <div
      className={cn(
        'flex items-center gap-2 text-lg font-semibold text-sidebar-foreground font-headline',
        className
      )}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground bg-gradient-to-tr from-pink-500 to-violet-500">
        {logoUrl ? (
          <Image src={logoUrl} alt="Logo" width={32} height={32} className="rounded-lg" />
        ) : (
          <CalendarCheck className="h-5 w-5 text-white" />
        )}
      </div>
      {showText && (
        <span className="hidden group-data-[collapsible=icon]:hidden text-slate-800 dark:text-white">
          SiRancak
        </span>
      )}
    </div>
  );
}
