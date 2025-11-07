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
import { usePathname } from 'next/navigation';
import { UserProfile } from '@/components/user-profile';


export function AppSidebar() {
    const pathname = usePathname();
    const logoutLink = (pathname.startsWith('/admin') || pathname === '/') ? '/admin/login' : '/login';

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
        <Nav />
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
