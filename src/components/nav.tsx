'use client';

import {
  Building,
  FileDown,
  LayoutDashboard,
  Settings,
  Users,
  Bell,
  Printer,
  ClipboardPlus,
  ClipboardCheck,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/approvals', label: 'Approvals', icon: ClipboardCheck },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/departments', label: 'Departments', icon: Building },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/print', label: 'Cetak Surat', icon: Printer },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { href: '/admin/reports', label: 'Reports', icon: FileDown },
];

const employeeLinks = [
    { href: '/employee/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/employee/ajukan-cuti', label: 'Ajukan Cuti', icon: ClipboardPlus },
    { href: '/employee/approvals', label: 'Approvals', icon: ClipboardCheck },
    { href: '/employee/notifications', label: 'Notifications', icon: Bell },
];

interface NavProps {
  role: 'Admin' | 'Employee';
}

export function Nav({ role }: NavProps) {
  const pathname = usePathname();
  const links = role === 'Admin' ? adminLinks : employeeLinks;

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
