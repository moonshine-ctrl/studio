import { cn } from '@/lib/utils';
import { CalendarCheck } from 'lucide-react';
import Image from 'next/image';

export function Logo({ className, logoUrl, useText = false, isLogin = false }: { className?: string, logoUrl?: string, useText?: boolean, isLogin?: boolean }) {
  const showText = useText || !logoUrl;

  const logoContainerSize = isLogin ? 'h-16 w-16' : 'h-10 w-10';
  const logoIconSizeClass = isLogin ? 'h-8 w-8' : 'h-5 w-5';
  const logoImageSize = isLogin ? 64 : 40;


  const backgroundClass = logoUrl ? 'bg-transparent' : 'bg-gradient-to-tr from-pink-500 to-violet-500';

  return (
    <div
      className={cn(
        'flex items-center gap-3 text-lg font-semibold text-sidebar-foreground font-headline',
        className
      )}
    >
      <div className={cn(
        'flex items-center justify-center rounded-lg text-primary-foreground',
        logoContainerSize,
        backgroundClass
        )}>
        {logoUrl ? (
          <Image src={logoUrl} alt="Logo" width={logoImageSize} height={logoImageSize} className="rounded-lg object-contain" />
        ) : (
          <CalendarCheck className={cn("text-white", logoIconSizeClass)} />
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
