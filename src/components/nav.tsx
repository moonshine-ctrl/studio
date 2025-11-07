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
import { useState, useEffect } from 'react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import type { User } from '@/types';
import { users } from '@/lib/data';


const adminLinks = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/approvals', label: 'Approvals', icon: ClipboardCheck },
  { href: '/users', label: 'Users', icon: Users },
  { href: '/departments', label: 'Departments', icon: Building },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/print', label: 'Cetak Surat', icon: Printer },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/reports', label: 'Reports', icon: FileDown },
];

const employeeLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/ajukan-cuti', label: 'Ajukan Cuti', icon: ClipboardPlus },
    { href: '/approvals', label: 'Approvals', icon: ClipboardCheck },
    { href: '/notifications', label: 'Notifications', icon: Bell },
];

export function Nav() {
  const pathname = usePathname();
  // In a real app, this would come from an auth context
  const [role, setRole] = useState<'Admin' | 'Employee'>('Admin');
  const links = pathname.startsWith('/admin') || pathname === '/' ? adminLinks : employeeLinks;

  // Simple logic to switch role for demonstration
  useEffect(() => {
    if (pathname.startsWith('/admin') || pathname === '/') {
        setRole('Admin');
    } else {
        setRole('Employee');
    }
  }, [pathname]);


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
