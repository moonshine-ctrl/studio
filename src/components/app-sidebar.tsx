import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { Nav } from '@/components/nav';
import { Button } from './ui/button';
import Link from 'next/link';
import { LogOut } from 'lucide-react';

interface AppSidebarProps {
  role: 'Admin' | 'Employee';
}

export function AppSidebar({ role }: AppSidebarProps) {
    const logoutLink = role === 'Admin' ? '/admin/login' : '/login';

  return (
    <Sidebar
      className="flex flex-col"
      variant="sidebar"
      collapsible="icon"
    >
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <Nav role={role} />
      </SidebarContent>
      <SidebarFooter className='items-center group-data-[collapsible=icon]:hidden'>
         <Button variant="outline" asChild className='w-full'>
            <Link href={logoutLink}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
            </Link>
         </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
