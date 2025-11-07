'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { notifications as initialNotifications } from '@/lib/data';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Mail, MessageSquare } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { Notification, User } from '@/types';
import {
  getUserById,
  getLeaveRequestById,
  getDepartmentById,
  getLeaveTypeById,
  users,
} from '@/lib/data';
import { usePathname } from 'next/navigation';

export default function NotificationsPage() {
  const [notifData, setNotifData] = useState<Notification[]>(initialNotifications);
  const pathname = usePathname();
  
  // This should come from auth context in a real app
  const [currentUser, setCurrentUser] = useState<User | undefined>();

  useEffect(() => {
    if (pathname.startsWith('/admin') || pathname === '/') {
      setCurrentUser(users.find(u => u.role === 'Admin'));
    } else {
      setCurrentUser(users.find(u => u.id === '1'));
    }
  }, [pathname]);


  const enrichedNotifications = useMemo(() => {
    if (!currentUser) return [];
    // Filter notifications for the current user (or all for admin)
    const userNotifications = currentUser?.role === 'Admin' 
      ? notifData 
      : notifData.filter(n => {
        if (n.userId === currentUser.id) return true;
        
        const approverDept = getDepartmentById(currentUser.departmentId);
        if (approverDept?.headId === currentUser.id) {
            const request = getLeaveRequestById(n.leaveRequestId || '');
            if (request) {
                const employee = getUserById(request.userId);
                return employee?.departmentId === approverDept.id;
            }
        }
        return false;
      });

    return userNotifications.map(notification => {
      let finalMessage = notification.message;
      const request = getLeaveRequestById(notification.leaveRequestId || '');
      if (request) {
        const employee = getUserById(request.userId);

        if (notification.type === 'warning' && currentUser?.role === 'Admin') {
            finalMessage = `${employee?.name} mengajukan cuti sakit. Ingatkan untuk mengisi form surat keterangan.`;
        } else if (notification.type === 'warning' && currentUser?.id === getDepartmentById(employee?.departmentId || '')?.headId) {
            finalMessage = `Permintaan cuti dari ${employee?.name} menunggu persetujuan Anda.`;
        }
      }
      return { ...notification, message: finalMessage };
    });
  }, [notifData, currentUser]);


  const markAsRead = (id: string) => {
    setNotifData(notifData.map(n => n.id === id ? {...n, isRead: true} : n));
    initialNotifications.find(n => n.id === id)!.isRead = true;
  }

  const markAllAsRead = () => {
    setNotifData(notifData.map(n => ({...n, isRead: true})));
    initialNotifications.forEach(n => n.isRead = true);
  }

  const handleWhatsAppNotification = (notification: Notification) => {
    if (!notification.leaveRequestId) return;

    const leaveRequest = getLeaveRequestById(notification.leaveRequestId);
    if (!leaveRequest) return;
    
    const employee = getUserById(leaveRequest.userId);
    if (!employee) return;
    
    const department = getDepartmentById(employee.departmentId);
    if (!department) return;

    const approver = getUserById(department.headId);
    if (!approver || !approver.phone) {
      alert('Approver contact not found.');
      return;
    }
    
    const leaveType = getLeaveTypeById(leaveRequest.leaveTypeId);
    const message = `Yth. Bapak/Ibu ${approver.name},\n\nDengan ini kami memberitahukan bahwa ada pengajuan cuti dari Sdr/i ${employee.name} (NIP: ${employee.nip}) yang memerlukan persetujuan Anda.\n\nDetail pengajuan:\nJenis Cuti: ${leaveType?.name}\nTanggal: ${format(leaveRequest.startDate, 'dd-MM-yyyy')} s/d ${format(leaveRequest.endDate, 'dd-MM-yyyy')}\n\nMohon untuk segera ditindaklanjuti. Terima kasih.\n\n- Admin Kepegawaian -`;
    const whatsappUrl = `https://wa.me/${approver.phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const notificationVariants = {
    info: 'bg-blue-100 dark:bg-blue-900/50',
    warning: 'bg-yellow-100 dark:bg-yellow-900/50',
    success: 'bg-green-100 dark:bg-green-900/50',
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline">Notifications</h1>
        {enrichedNotifications.some(n => !n.isRead) && (
            <Button onClick={markAllAsRead}>
                <Check className="mr-2 h-4 w-4" />
                Mark all as read
            </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
          <CardDescription>
            Here are all your recent notifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
           {enrichedNotifications.length > 0 ? (
            <div className="space-y-4">
              {enrichedNotifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-4 rounded-lg border p-4 transition-colors",
                    !notification.isRead && notificationVariants[notification.type],
                    !notification.isRead && 'font-semibold',
                  )}
                >
                  <div className="flex-shrink-0">
                    <Badge variant={notification.isRead ? 'outline' : 'default'} className="p-2">
                       <Mail className="h-5 w-5"/>
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(notification.createdAt, "PPP 'at' p")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentUser?.role === 'Admin' && notification.type === 'warning' && (
                       <Button variant="outline" size="sm" onClick={() => handleWhatsAppNotification(notification)}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Notify Approver
                       </Button>
                    )}
                    {!notification.isRead && (
                      <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
           ) : (
            <div className="text-center py-12 text-muted-foreground">
                <p>You have no notifications.</p>
            </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
