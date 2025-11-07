import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User as UserIcon, MoreVertical } from 'lucide-react';
import { users } from '@/lib/data';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { User } from '@/types';
import { useState, useEffect } from 'react';

export function UserProfile() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  
  useEffect(() => {
     // In a real app, this would come from an auth context.
     // For now, we simulate by picking a user based on the route.
    if (pathname.startsWith('/admin') || pathname === '/') {
      setCurrentUser(users.find(u => u.role === 'Admin'));
    } else {
      // Simulate a logged-in employee, e.g., 'Budi Santoso'
      setCurrentUser(users.find(u => u.id === '1'));
    }
  }, [pathname]);

  if (!currentUser) return null;

  const logoutLink = currentUser?.role === 'Admin' ? '/admin/login' : '/login';
  const profileName = currentUser?.name || 'User';
  const profileNip = currentUser?.nip || '123456789';
  const profileAvatar = currentUser?.avatar || 'https://picsum.photos/seed/user/100/100';


  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                    <AvatarImage
                        src={profileAvatar}
                        alt={profileName}
                        data-ai-hint="profile person"
                    />
                    <AvatarFallback>{profileName.charAt(0)}</AvatarFallback>
                </Avatar>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuLabel className='flex flex-col'>
                <span>My Account</span>
                <span className='text-xs text-muted-foreground font-normal'>{profileName}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Link href={logoutLink}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
                </Link>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  );
}
