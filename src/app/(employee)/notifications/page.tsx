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

export default function NotificationsPage() {
  const [notifData, setNotifData] = useState<Notification[]>(initialNotifications);
  
  const [currentUser, setCurrentUser] = useState<User | undefined>();

  useEffect(() => {
    // For employee view, we can simulate user '1' or '2' (approver)
    // In a real app, this would be a single authenticated user.
    // We'll use user '1' for this demo to show personal notifications.
    setCurrentUser(users.find(u => u.id === '1'));
  }, []);


  const enrichedNotifications = useMemo(() => {
    if (!currentUser) return [];

    const headedDepartments = getDepartmentById(currentUser.departmentId) ? [getDepartmentById(currentUser.departmentId)!].filter(d => d.headId === currentUser.id) : [];
    const headedDeptIds = headedDepartments.map(d => d.id);
    
    const filteredNotifications = notifData.filter(n => {
      // Is the notification for me directly?
      if (n.userId === currentUser.id) return true;

      // Am I an approver for this notification's related request?
      const request = getLeaveRequestById(n.leaveRequestId || '');
      if (request) {
        const employee = getUserById(request.userId);
        if(employee && headedDeptIds.includes(employee.departmentId)) {
          // This is a notification for a request in my department
          return true;
        }
      }
      return false;
    });

    return filteredNotifications;
  }, [notifData, currentUser]);


  const markAsRead = (id: string) => {
    setNotifData(notifData.map(n => n.id === id ? {...n, isRead: true} : n));
    initialNotifications.find(n => n.id === id)!.isRead = true;
  }

  const markAllAsRead = () => {
    setNotifData(notifData.map(n => ({...n, isRead: true})));
    initialNotifications.forEach(n => n.isRead = true);
  }

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
          <CardTitle>Your Notifications</CardTitle>
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
