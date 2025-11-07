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
      // Simulate a specific logged-in employee, e.g., 'Budi Santoso' (user '1')
      // or an approver like 'Citra Lestari' (user '2')
      // For this demo, we'll default to Budi Santoso.
      setCurrentUser(users.find(u => u.id === '1'));
    }
  }, [pathname]);

  if (!currentUser) return null;

  const logoutLink = currentUser.role === 'Admin' ? '/admin/login' : '/login';
  const profileName = currentUser.name || 'User';
  const profileAvatar = currentUser.avatar || 'https://picsum.photos/seed/user/100/100';

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
