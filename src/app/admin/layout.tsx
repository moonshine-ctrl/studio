'use client';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { AppHeader } from '@/components/app-header';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // The print layout is handled by the (print) route group layout.
  // No special logic is needed here anymore.

  return (
    <SidebarProvider>
      <div className="flex">
        <AppSidebar role="Admin" />
        <div className="flex flex-col w-full">
          <AppHeader />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50/50 dark:bg-gray-900/50">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
