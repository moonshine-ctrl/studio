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
import { LogOut, User as UserIcon } from 'lucide-react';
import { users } from '@/lib/data';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { User } from '@/types';
import { useState, useEffect } from 'react';

export function UserProfile() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  
  useEffect(() => {
    // This logic determines the user based on the route structure.
    if (pathname.startsWith('/admin')) {
      setCurrentUser(users.find(u => u.role === 'Admin'));
    } else if (pathname.startsWith('/employee')) {
      // In a real app, this would be based on auth state
      // For demo, we check if they are an approver by checking the department heads
      const isApprover = !!users.find(u => u.id === '2'); // Example approver
      if (pathname.includes('/approvals') && isApprover) {
         setCurrentUser(users.find(u => u.id === '2')); // Citra Lestari, approver
      } else {
         setCurrentUser(users.find(u => u.id === '1')); // Budi Santoso, regular employee
      }
    }
  }, [pathname]);

  if (!currentUser) return null;

  const logoutLink = currentUser.role === 'Admin' ? '/admin/login' : '/login';
  const profileName = currentUser.name || 'User';
  const profileAvatar = currentUser.avatar || 'https://picsum.photos/seed/user/100/100';
  const profileLink = currentUser.role === 'Admin' ? '/admin/settings' : '#'; // Employee profile page doesn't exist yet

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
            <DropdownMenuItem asChild>
                <Link href={profileLink}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                </Link>
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
