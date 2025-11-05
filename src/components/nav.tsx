'use client';

import {
  Building,
  FileDown,
  LayoutDashboard,
  Settings,
  Users,
  Bell,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const links = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/users', label: 'Users', icon: Users },
  { href: '/departments', label: 'Departments', icon: Building },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/reports', label: 'Reports', icon: FileDown },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {links.map((link) => (
        <SidebarMenuItem key={link.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === link.href}
            tooltip={link.label}
          >
            <Link href={link.href}>
              <link.icon />
              <span>{link.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
