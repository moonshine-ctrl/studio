import { cn } from '@/lib/utils';
import { ClipboardCheck } from 'lucide-react';

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 text-lg font-semibold text-sidebar-foreground font-headline',
        className
      )}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <ClipboardCheck className="h-5 w-5" />
      </div>
      <span className="hidden group-data-[collapsible=icon]:hidden">
        LeaveTrack Pro
      </span>
    </div>
  );
}
