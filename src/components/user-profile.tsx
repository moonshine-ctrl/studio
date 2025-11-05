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

export function UserProfile() {
  const adminUser = users.find(u => u.role === 'Admin');

  return (
    <div className="flex w-full items-center gap-3 p-2">
      <Avatar className="h-9 w-9">
        <AvatarImage
          src={adminUser?.avatar || "https://picsum.photos/seed/admin/100/100"}
          alt={adminUser?.name || "Admin"}
          data-ai-hint="profile person"
        />
        <AvatarFallback>{adminUser?.name.charAt(0) || 'A'}</AvatarFallback>
      </Avatar>
      <div className="hidden flex-1 flex-col group-data-[collapsible=icon]:hidden">
        <span className="text-sm font-medium text-sidebar-foreground">
          {adminUser?.name || 'Admin User'}
        </span>
        <span className="text-xs text-muted-foreground">
          NIP: {adminUser?.nip || '199001012020121001'}
        </span>
      </div>
      <div className="hidden group-data-[collapsible=icon]:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <LogOut className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Link href="/login">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
