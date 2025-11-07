import { cn } from '@/lib/utils';
import { CalendarCheck } from 'lucide-react';

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 text-lg font-semibold text-sidebar-foreground font-headline',
        className
      )}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground bg-gradient-to-tr from-pink-500 to-violet-500">
        <CalendarCheck className="h-5 w-5 text-white" />
      </div>
      <span className="hidden group-data-[collapsible=icon]:hidden text-slate-800 dark:text-white">
        SiRancak
      </span>
    </div>
  );
}
