import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { Nav } from '@/components/nav';
import { UserProfile } from '@/components/user-profile';

export function AppSidebar() {
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
      <SidebarFooter>
        <UserProfile />
      </SidebarFooter>
    </Sidebar>
  );
}
