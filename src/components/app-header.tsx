'use client';

import { Bell, Search } from 'lucide-react';
import {
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuFooter
} from './ui/dropdown-menu';
import { notifications } from '@/lib/data';
import { Badge } from './ui/badge';
import Link from 'next/link';
import { UserProfile } from './user-profile';
import { format } from 'date-fns';
import { usePathname } from 'next/navigation';

export function AppHeader() {
  const { isMobile } = useSidebar();
  const unreadNotifications = notifications.filter((n) => !n.isRead).length;
  const pathname = usePathname();

  const getNotificationLink = () => {
    if (pathname.startsWith('/admin')) {
      return '/admin/notifications';
    }
    return '/employee/notifications';
  }

  if (isMobile === undefined) return null;

  return (
    <header className="sticky top-0 z-30 flex h-auto items-center gap-4 border-b bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:py-4">
      <SidebarTrigger className="sm:hidden" />
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-secondary pl-8 md:w-[200px] lg:w-[320px]"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadNotifications > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-1 h-5 w-5 justify-center rounded-full p-0 text-xs"
              >
                {unreadNotifications}
              </Badge>
            )}
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {notifications.slice(0, 4).map((notif) => (
            <DropdownMenuItem key={notif.id} className="flex-col items-start gap-1">
              <p className={`text-sm ${!notif.isRead ? 'font-semibold' : ''}`}>
                {notif.message}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(notif.createdAt, "PPP 'at' p")}
              </p>
            </DropdownMenuItem>
          ))}
           <DropdownMenuSeparator />
           <DropdownMenuFooter>
                <Button asChild variant="outline" className="w-full">
                    <Link href={getNotificationLink()}>View All Notifications</Link>
                </Button>
           </DropdownMenuFooter>
        </DropdownMenuContent>
      </DropdownMenu>
      <UserProfile />
    </header>
  );
}
